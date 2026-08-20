import { sql } from "drizzle-orm";
import { PlacementReviewError } from "./errors.js";
import { placementReviewEventType, transitionTarget } from "./service.js";

// The audit event and CRM outbox insert live in the same statement as the
// authoritative review mutation. No caller can observe a changed review whose
// CRM event was not durably queued.
export function createNeonPlacementReviewRepository(database) {
  if (!database) throw new Error("portal_database_required");
  return {
    async createReview(input) {
      const eventType = "placement_review_created";
      const result = await database.execute(sql`
        with inserted as (
          insert into placement_reviews (id, result_id, attempt_id, correlation_id, business_unit, recommended_level, status, revision, created_at, updated_at)
          values (${input.id}::uuid, ${input.resultId}::uuid, ${input.attemptId}::uuid, ${input.correlationId}, ${input.businessUnit}, ${input.recommendedLevel}, 'pending', 0, ${input.occurredAt}::timestamptz, ${input.occurredAt}::timestamptz)
          on conflict (result_id) do nothing returning *
        ), selected as (
          select *, false as replayed from inserted union all
          select review.*, true as replayed from placement_reviews review where review.result_id = ${input.resultId}::uuid and not exists (select 1 from inserted)
        ), audit_write as (
          insert into placement_review_events (id, review_id, event_type, status, revision, final_level, actor_account_id, occurred_at)
          select ${input.eventId}::uuid, id, ${eventType}, status, revision, null, null, ${input.occurredAt}::timestamptz from selected where replayed = false
        ), outbox_write as (
          insert into crm_outbox (id, event_type, idempotency_key, correlation_id, payload, status, attempt_count, next_attempt_at, created_at)
          select
            ${input.outboxId}::uuid, ${eventType}, 'placement-review:' || review.id::text || ':revision:' || review.revision::text || ':' || ${eventType}, review.correlation_id,
            placement_crm_payload(review, ${eventType}, ${input.occurredAt}::timestamptz),
            'pending', 0, ${input.occurredAt}::timestamptz, ${input.occurredAt}::timestamptz
          from selected review where review.replayed = false
          on conflict (idempotency_key) do nothing
        ) select * from selected
      `);
      const row = rows(result)[0]; if (!row) throw new Error("placement_review_create_failed");
      return { review: normalize(row), replayed: toBool(row.replayed) };
    },
    async getById(id) {
      const result = await database.execute(sql`select * from placement_reviews where id = ${id}::uuid limit 1`);
      const row = rows(result)[0]; return row ? normalize(row) : null;
    },
    async listByBusinessUnit(businessUnit) {
      const result = await database.execute(sql`select * from placement_reviews where business_unit = ${businessUnit} order by updated_at asc, id asc`);
      return rows(result).map(normalize);
    },
    async transition(input) {
      const existing = await database.execute(sql`select 1 from placement_review_mutations where review_id = ${input.reviewId}::uuid and mutation_id = ${input.mutationId} limit 1`);
      if (rows(existing)[0]) {
        const review = await this.getById(input.reviewId); if (!review) throw new PlacementReviewError("placement_review_not_found", 404);
        return { review, replayed: true };
      }
      const current = await this.getById(input.reviewId);
      if (!current) throw new PlacementReviewError("placement_review_not_found", 404);
      if (current.revision !== input.expectedRevision) throw new PlacementReviewError("placement_review_revision_conflict", 409, { currentRevision: current.revision });
      const nextStatus = transitionTarget(current.status, input.action);
      if (!nextStatus) throw new PlacementReviewError("placement_review_transition_invalid", 409);
      const eventType = placementReviewEventType(input.action);
      const nextFinal = input.action === "confirm" ? current.recommendedLevel : input.action === "adjust" ? input.finalLevel : current.finalLevel;
      const result = await database.execute(sql`
        with updated as (
          update placement_reviews set status = ${nextStatus}, final_level = ${nextFinal}, revision = revision + 1, updated_at = ${input.occurredAt}::timestamptz
          where id = ${input.reviewId}::uuid and revision = ${input.expectedRevision} and status = ${current.status}
          returning *
        ), mutation_write as (
          insert into placement_review_mutations (review_id, mutation_id, revision_after, created_at)
          select id, ${input.mutationId}, revision, ${input.occurredAt}::timestamptz from updated
        ), audit_write as (
          insert into placement_review_events (id, review_id, event_type, status, revision, final_level, actor_account_id, occurred_at)
          select ${input.eventId}::uuid, id, ${eventType}, status, revision, final_level, ${input.actor.accountId}::uuid, ${input.occurredAt}::timestamptz from updated
        ), outbox_write as (
          insert into crm_outbox (id, event_type, idempotency_key, correlation_id, payload, status, attempt_count, next_attempt_at, created_at)
          select
            ${input.outboxId}::uuid, ${eventType}, 'placement-review:' || review.id::text || ':revision:' || review.revision::text || ':' || ${eventType}, review.correlation_id,
            placement_crm_payload(review, ${eventType}, ${input.occurredAt}::timestamptz),
            'pending', 0, ${input.occurredAt}::timestamptz, ${input.occurredAt}::timestamptz
          from updated review
          on conflict (idempotency_key) do nothing
        ) select * from updated
      `);
      const row = rows(result)[0];
      if (!row) throw new PlacementReviewError("placement_review_revision_conflict", 409, { currentRevision: current.revision });
      return { review: normalize(row), replayed: false };
    },
  };
}

// A database SQL function avoids duplicating the envelope shape in each CTE.
// The migration creates it as a stable, privacy-safe JSONB constructor.
function rows(result) { return Array.isArray(result) ? result : result?.rows || []; }
function toBool(value) { return value === true || value === "t" || value === 1 || value === "1"; }
function normalize(row) { return { id: row.id, resultId: row.result_id ?? row.resultId, attemptId: row.attempt_id ?? row.attemptId, correlationId: row.correlation_id ?? row.correlationId, businessUnit: row.business_unit ?? row.businessUnit, recommendedLevel: row.recommended_level ?? row.recommendedLevel, finalLevel: row.final_level ?? row.finalLevel, status: row.status, revision: Number(row.revision), createdAt: iso(row.created_at ?? row.createdAt), updatedAt: iso(row.updated_at ?? row.updatedAt) }; }
function iso(value) { return value instanceof Date ? value.toISOString() : new Date(value).toISOString(); }
