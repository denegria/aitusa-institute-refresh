import { sql } from 'drizzle-orm';

export {
  CRM_OUTBOX_MAX_ATTEMPTS,
  CRM_OUTBOX_SCHEMA_VERSION,
  createAitCrmTransport,
  createCrmOutboxDispatcher,
  nextCrmOutboxAttemptAt,
  safeCrmDeliveryError,
} from './outbox.js';

export function createNeonCrmOutboxRepository(database) {
  if (!database) throw new Error('portal_database_required');
  return {
    async claimNext({ now }) {
      const result = await database.execute(sql`
        with candidate as (
          select id
          from crm_outbox
          where status in ('pending', 'retry_wait')
            and next_attempt_at <= ${now.toISOString()}::timestamptz
          order by next_attempt_at asc, created_at asc
          limit 1
          for update skip locked
        )
        update crm_outbox outbox
        set status = 'delivering', attempt_count = outbox.attempt_count + 1
        from candidate
        where outbox.id = candidate.id
        returning outbox.id, outbox.payload, outbox.attempt_count
      `);
      const row = rows(result)[0];
      return row ? { id: row.id, payload: row.payload, attemptCount: Number(row.attempt_count) } : null;
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
          next_attempt_at = coalesce(${nextAttemptAt?.toISOString() ?? null}::timestamptz, next_attempt_at)
        where id = ${id}::uuid and status = 'delivering'
      `);
    },
  };
}

function rows(result) { return Array.isArray(result) ? result : result?.rows || []; }
