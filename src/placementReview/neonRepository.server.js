import { sql } from "drizzle-orm";
import { PlacementReviewError } from "./errors.js";
import { placementReviewEventType, transitionTarget } from "./service.js";
import { getDiagnosticQuestion } from "../diagnostic/questionBank.server.js";

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
          values (${input.id}::uuid, ${input.resultId}::uuid, ${input.attemptId}::uuid, ${input.correlationId}, ${input.businessUnit}, ${input.recommendedLevel}, 'pending', 1, ${input.occurredAt}::timestamptz, ${input.occurredAt}::timestamptz)
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
    async listClaimedResultsMissingReviews({ resultId = null, limit = 10 } = {}) {
      const result = await database.execute(sql`
        select result.id as result_id, attempt.id as attempt_id,
          result.recommended_level_label,
          coalesce(claim.claim_id, attempt.id::text) as correlation_id
        from diagnostic_attempts attempt
        join diagnostic_results result on result.attempt_id = attempt.id
        left join placement_reviews review on review.result_id = result.id
        left join lateral (
          select challenge.claim_id
          from result_claims result_claim
          join portal_auth_challenges challenge
            on challenge.result_claim_id = result_claim.id
           and challenge.status = 'consumed'
          where result_claim.attempt_id = attempt.id
            and result_claim.status = 'consumed'
          order by challenge.consumed_at desc nulls last
          limit 1
        ) claim on true
        where attempt.status = 'claimed'
          and review.id is null
          and (${resultId}::uuid is null or result.id = ${resultId}::uuid)
        order by attempt.claimed_at asc nulls last, result.created_at asc
        limit ${limit}
      `);
      return rows(result).map((row) => ({
        resultId: row.result_id,
        attemptId: row.attempt_id,
        recommendedLevel: row.recommended_level_label,
        correlationId: row.correlation_id,
      }));
    },
    async getById(id) {
      const result = await database.execute(sql`select * from placement_reviews where id = ${id}::uuid limit 1`);
      const row = rows(result)[0]; return row ? normalize(row) : null;
    },
    async listByBusinessUnit(businessUnit) {
      const result = await database.execute(sql`select * from placement_reviews where business_unit = ${businessUnit} order by updated_at asc, id asc`);
      return rows(result).map(normalize);
    },
    async getDetailById(id) {
      const result = await database.execute(sql`
        select
          review.*,
          diagnostic.result_status,
          diagnostic.quiz_score,
          diagnostic.answered_question_count,
          diagnostic.skipped_question_count,
          diagnostic.score_summary,
          attempt.completed_at,
          attempt.raw_answers_purge_at,
          context.goal,
          context.self_assessment,
          context.writing_sample,
          coalesce(answers.items, '[]'::jsonb) as answers,
          coalesce(events.items, '[]'::jsonb) as events
        from placement_reviews review
        join diagnostic_results diagnostic on diagnostic.id = review.result_id
        join diagnostic_attempts attempt on attempt.id = review.attempt_id
        left join diagnostic_contexts context on context.attempt_id = review.attempt_id
        left join lateral (
          select jsonb_agg(
            jsonb_build_object(
              'questionKey', answer.question_key,
              'answerState', answer.answer_state,
              'answerValue', answer.answer_value
            ) order by answer.question_key
          ) as items
          from diagnostic_answers answer
          where answer.attempt_id = review.attempt_id
        ) answers on true
        left join lateral (
          select jsonb_agg(
            jsonb_build_object(
              'eventType', event.event_type,
              'status', event.status,
              'revision', event.revision,
              'finalLevel', event.final_level,
              'internalRationale', event.internal_rationale,
              'occurredAt', event.occurred_at
            ) order by event.occurred_at desc, event.id desc
          ) as items
          from placement_review_events event
          where event.review_id = review.id
        ) events on true
        where review.id = ${id}::uuid
        limit 1
      `);
      const row = rows(result)[0];
      return row ? normalizeDetail(row) : null;
    },
    async listActiveRoles(businessUnit) {
      const result = await database.execute(sql`
        select account.first_name, role.role, role.created_at
        from employee_review_roles role
        join portal_accounts account on account.id = role.portal_account_id
        where role.business_unit = ${businessUnit}
          and role.active = true
          and account.status = 'active'
        order by account.first_name, role.portal_account_id
      `);
      return rows(result).map((row) => ({
        firstName: cleanText(row.first_name, "Empleado AIT"),
        role: row.role,
        createdAt: iso(row.created_at),
      }));
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
          insert into placement_review_events (id, review_id, event_type, status, revision, final_level, actor_account_id, internal_rationale, occurred_at)
          select ${input.eventId}::uuid, id, ${eventType}, status, revision, final_level, ${input.actor.accountId}::uuid, ${input.internalRationale}, ${input.occurredAt}::timestamptz from updated
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
function cleanText(value, fallback = "") { return typeof value === "string" && value.trim() ? value.trim() : fallback; }
function jsonValue(value, fallback) { if (value && typeof value === "object") return value; if (typeof value !== "string") return fallback; try { return JSON.parse(value); } catch { return fallback; } }
function normalizeDetail(row) {
  const review = normalize(row);
  const answers = jsonValue(row.answers, []).map((answer) => {
    const question = getDiagnosticQuestion(answer.questionKey);
    if (!question) return null;
    const selected = answer.answerState === "answered" ? answer.answerValue : null;
    return {
      questionKey: answer.questionKey,
      prompt: question.prompt,
      levelLabel: question.levelLabel,
      book: question.book,
      answerState: answer.answerState,
      selectedAnswer: selected,
      correctAnswer: question.correctAnswer,
      correct: selected === question.correctAnswer,
    };
  }).filter(Boolean);
  return {
    ...review,
    evidence: {
      resultStatus: row.result_status,
      quizScore: Number(row.quiz_score),
      answeredQuestionCount: Number(row.answered_question_count),
      skippedQuestionCount: Number(row.skipped_question_count),
      scoreSummary: jsonValue(row.score_summary, {}),
      goal: cleanText(row.goal),
      selfAssessment: jsonValue(row.self_assessment, {}),
      writingSample: cleanText(row.writing_sample),
      completedAt: row.completed_at ? iso(row.completed_at) : null,
      rawAnswersPurgeAt: row.raw_answers_purge_at ? iso(row.raw_answers_purge_at) : null,
      answers,
    },
    events: jsonValue(row.events, []).map((event) => ({
      eventType: event.eventType,
      status: event.status,
      revision: Number(event.revision),
      finalLevel: cleanText(event.finalLevel),
      internalRationale: cleanText(event.internalRationale),
      occurredAt: iso(event.occurredAt),
    })),
  };
}
