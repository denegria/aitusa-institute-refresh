import { randomUUID } from "node:crypto";
import { sql } from "drizzle-orm";

export function createNeonLeadCrmRepository(database) {
  if (!database) throw new Error("portal_database_required");

  return {
    async enqueue(event) {
      const now = new Date().toISOString();
      const result = await database.execute(sql`
        insert into crm_outbox (
          id, event_type, idempotency_key, correlation_id, payload,
          status, attempt_count, next_attempt_at, created_at
        ) values (
          ${randomUUID()}::uuid,
          ${event.eventType},
          ${event.idempotencyKey},
          ${event.correlationId},
          ${JSON.stringify(event)}::jsonb,
          'pending', 0, ${now}::timestamptz, ${now}::timestamptz
        )
        on conflict (idempotency_key) do nothing
        returning id
      `);
      const inserted = rows(result)[0];
      if (inserted?.id) return { queued: true, duplicate: false };

      const existing = await database.execute(sql`
        select id from crm_outbox where idempotency_key = ${event.idempotencyKey} limit 1
      `);
      if (!rows(existing)[0]?.id) throw new Error("crm_outbox_enqueue_failed");
      return { queued: true, duplicate: true };
    },
  };
}

function rows(result) {
  return Array.isArray(result) ? result : result?.rows || [];
}
