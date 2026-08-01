import { sql } from 'drizzle-orm';
import { toClaimedCrmOutboxItem } from './outbox.js';

export {
  CRM_OUTBOX_MAX_ATTEMPTS,
  CRM_OUTBOX_LEASE_MS,
  CRM_OUTBOX_SCHEMA_VERSION,
  CRM_TRANSPORT_TIMEOUT_MS,
  createAitCrmTransport,
  createCrmOutboxDispatcher,
  nextCrmOutboxAttemptAt,
  safeCrmDeliveryError,
} from './outbox.js';

export function createNeonCrmOutboxRepository(database) {
  if (!database) throw new Error('portal_database_required');
  return {
    async claimNext({ now, leaseUntil }) {
      const result = await database.execute(sql`
        with candidate as (
          select
            outbox.id,
            coalesce(
              (
                select attempt.id::text
                from diagnostic_results result
                join diagnostic_attempts attempt on attempt.id = result.attempt_id
                where result.id::text = outbox.correlation_id
                limit 1
              ),
              (
                select challenge.attempt_id::text
                from portal_auth_challenges challenge
                where challenge.claim_id = outbox.correlation_id
                limit 1
              )
            ) as funnel_correlation_id
          from crm_outbox outbox
          where (outbox.status in ('pending', 'retry_wait') and outbox.next_attempt_at <= ${now.toISOString()}::timestamptz)
             or (outbox.status = 'delivering' and outbox.next_attempt_at <= ${now.toISOString()}::timestamptz)
          order by outbox.next_attempt_at asc, outbox.created_at asc
          limit 1
          for update skip locked
        )
        update crm_outbox outbox
        set status = 'delivering', attempt_count = outbox.attempt_count + 1,
            next_attempt_at = ${leaseUntil.toISOString()}::timestamptz
        from candidate
        where outbox.id = candidate.id
        returning outbox.id, outbox.payload, outbox.correlation_id, outbox.attempt_count,
          candidate.funnel_correlation_id
      `);
      const row = rows(result)[0];
      return toClaimedCrmOutboxItem(row);
    },
    async markDelivered({ id, deliveredAt }) {
      await database.execute(sql`
        update crm_outbox
        set status = 'delivered', delivered_at = ${deliveredAt.toISOString()}::timestamptz, safe_error_code = null
        where id = ${id}::uuid and status = 'delivering'
      `);
    },
    async markFailed({ id, status, safeErrorCode, nextAttemptAt }) {
      await database.execute(sql`
        update crm_outbox
        set status = ${status}, safe_error_code = ${safeErrorCode},
          next_attempt_at = coalesce(${nextAttemptAt?.toISOString() ?? null}::timestamptz, now())
        where id = ${id}::uuid and status = 'delivering'
      `);
    },
  };
}

function rows(result) { return Array.isArray(result) ? result : result?.rows || []; }
