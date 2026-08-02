import { sql } from "drizzle-orm";

export function createNeonFunnelOperatorRepository(database) {
  if (!database) throw new Error("portal_database_required");

  return {
    async readSummary({ since, staleBefore }) {
      const [eventResult, outboxResult, openResult] = await Promise.all([
        database.execute(sql`
          select event_name, safe_outcome_code, count(*)::integer as event_count
          from funnel_event_ledger
          where occurred_at >= ${since.toISOString()}::timestamptz
          group by event_name, safe_outcome_code
          order by event_name, safe_outcome_code
        `),
        database.execute(sql`
          select status, count(*)::integer as status_count
          from crm_outbox
          group by status
          order by status
        `),
        database.execute(sql`
          select
            count(*) filter (
              where status in ('pending', 'retry_wait', 'delivering')
                and created_at <= ${staleBefore.toISOString()}::timestamptz
            )::integer as stale_delivery_count,
            min(created_at) filter (
              where status in ('pending', 'retry_wait', 'delivering')
            ) as oldest_open_at
          from crm_outbox
        `),
      ]);

      const open = rows(openResult)[0] || {};
      return {
        events: rows(eventResult).map((row) => ({
          eventName: row.event_name,
          safeOutcomeCode: row.safe_outcome_code,
          count: Number(row.event_count),
        })),
        outbox: rows(outboxResult).map((row) => ({
          status: row.status,
          count: Number(row.status_count),
        })),
        staleDeliveryCount: Number(open.stale_delivery_count || 0),
        oldestOpenAt: open.oldest_open_at ? new Date(open.oldest_open_at).toISOString() : null,
      };
    },
  };
}

function rows(result) {
  return Array.isArray(result) ? result : result?.rows || [];
}
