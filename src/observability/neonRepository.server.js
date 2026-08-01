import { sql } from "drizzle-orm";

export function createNeonFunnelLedgerRepository(database) {
  if (!database) throw new Error("portal_database_required");
  return {
    async insert(event) {
      const result = await database.execute(sql`
        insert into funnel_event_ledger (
          event_name, event_version, idempotency_key, correlation_id, source,
          utm_source, utm_medium, utm_campaign, utm_term, utm_content,
          product_contract_version, question_bank_version, answer_key_version,
          level_map_version, scoring_contract_version, result_copy_version,
          safe_outcome_code, duration_bucket, occurred_at, expires_at
        ) values (
          ${event.eventName}, ${event.eventVersion}, ${event.idempotencyKey}, ${event.correlationId}, ${event.source},
          ${event.utmSource ?? null}, ${event.utmMedium ?? null}, ${event.utmCampaign ?? null}, ${event.utmTerm ?? null}, ${event.utmContent ?? null},
          ${event.productContractVersion ?? null}, ${event.questionBankVersion ?? null}, ${event.answerKeyVersion ?? null},
          ${event.levelMapVersion ?? null}, ${event.scoringContractVersion ?? null}, ${event.resultCopyVersion ?? null},
          ${event.safeOutcomeCode ?? null}, ${event.durationBucket ?? null}, ${event.occurredAt}::timestamptz, ${event.expiresAt}::timestamptz
        ) on conflict (idempotency_key) do nothing
        returning event_name, event_version, idempotency_key, correlation_id, source, occurred_at
      `);
      const row = (Array.isArray(result) ? result : result?.rows || [])[0];
      return { replayed: !row, event: row ? toEvent(row) : { ...event } };
    },
    async purgeExpired({ now, limit }) {
      const result = await database.execute(sql`
        with expired as (
          select id from funnel_event_ledger where expires_at <= ${now.toISOString()}::timestamptz
          order by expires_at asc limit ${limit}
        ) delete from funnel_event_ledger using expired where funnel_event_ledger.id = expired.id
        returning funnel_event_ledger.id
      `);
      return { deleted: (Array.isArray(result) ? result : result?.rows || []).length, limit };
    },
  };
}

function toEvent(row) {
  return { eventName: row.event_name, eventVersion: Number(row.event_version), idempotencyKey: row.idempotency_key, correlationId: row.correlation_id, source: row.source, occurredAt: new Date(row.occurred_at).toISOString() };
}
