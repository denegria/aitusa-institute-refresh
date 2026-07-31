import { and, eq, sql } from "drizzle-orm";
import {
  diagnosticAnswers,
  diagnosticAttempts,
  diagnosticContexts,
  diagnosticMutations,
  diagnosticResults,
  resultClaims,
} from "./schema.js";
import { DiagnosticDomainError } from "./errors.js";

export function createNeonDiagnosticRepository(database) {
  if (!database) throw new Error("portal_database_required");

  return {
    async createAttempt(input) {
      const [attempt] = await database
        .insert(diagnosticAttempts)
        .values(toAttemptInsert(input))
        .onConflictDoUpdate({
          target: diagnosticAttempts.requestId,
          set: { requestId: input.requestId },
        })
        .returning();
      return {
        attempt: normalizeAttempt(attempt),
        replayed: attempt.id !== input.id,
      };
    },

    async getAttempt(attemptId) {
      const [attempt] = await database
        .select()
        .from(diagnosticAttempts)
        .where(eq(diagnosticAttempts.id, attemptId))
        .limit(1);
      return attempt ? normalizeAttempt(attempt) : null;
    },

    async getAttemptSnapshot(attemptId) {
      const [attempt, answerRows, contextRows, resultRows] = await database.batch([
        database
          .select()
          .from(diagnosticAttempts)
          .where(eq(diagnosticAttempts.id, attemptId))
          .limit(1),
        database
          .select()
          .from(diagnosticAnswers)
          .where(eq(diagnosticAnswers.attemptId, attemptId)),
        database
          .select()
          .from(diagnosticContexts)
          .where(eq(diagnosticContexts.attemptId, attemptId))
          .limit(1),
        database
          .select()
          .from(diagnosticResults)
          .where(eq(diagnosticResults.attemptId, attemptId))
          .limit(1),
      ]);
      if (!attempt[0]) return null;
      return {
        attempt: normalizeAttempt(attempt[0]),
        answers: answerRows.map(normalizeAnswer),
        context: contextRows[0] ? normalizeContext(contextRows[0]) : null,
        result: resultRows[0] ? normalizeResult(resultRows[0]) : null,
      };
    },

    async applyAnswerMutation({
      attemptId,
      mutationId,
      expectedRevision,
      answer,
      now,
    }) {
      const result = await database.execute(sql`
        with replay as (
          select revision_after
          from diagnostic_mutations
          where attempt_id = ${attemptId}::uuid
            and mutation_id = ${mutationId}
        ),
        updated_attempt as (
          update diagnostic_attempts
          set revision = revision + 1,
              status = 'in_progress',
              last_activity_at = ${now.toISOString()}::timestamptz
          where id = ${attemptId}::uuid
            and revision = ${expectedRevision}
            and status in ('started', 'in_progress')
            and expires_at > ${now.toISOString()}::timestamptz
            and not exists (select 1 from replay)
          returning revision
        ),
        answer_write as (
          insert into diagnostic_answers (
            attempt_id, question_key, answer_state, answer_value, updated_at
          )
          select
            ${attemptId}::uuid,
            ${answer.questionKey},
            ${answer.answerState},
            ${answer.answerValue},
            ${now.toISOString()}::timestamptz
          from updated_attempt
          on conflict (attempt_id, question_key) do update
          set answer_state = excluded.answer_state,
              answer_value = excluded.answer_value,
              updated_at = excluded.updated_at
          returning question_key
        ),
        mutation_write as (
          insert into diagnostic_mutations (
            attempt_id, mutation_id, revision_after, created_at
          )
          select
            ${attemptId}::uuid,
            ${mutationId},
            revision,
            ${now.toISOString()}::timestamptz
          from updated_attempt
          returning revision_after
        )
        select
          coalesce(
            (select revision_after from replay),
            (select revision_after from mutation_write)
          ) as revision,
          exists(select 1 from replay) as replayed,
          current_attempt.revision as current_revision,
          current_attempt.status as current_status,
          current_attempt.expires_at as expires_at
        from diagnostic_attempts current_attempt
        where current_attempt.id = ${attemptId}::uuid
      `);
      const row = rows(result)[0];
      if (!row) throw new DiagnosticDomainError("attempt_not_found", 404);
      if (row.revision !== null && row.revision !== undefined) {
        return {
          revision: Number(row.revision),
          replayed: Boolean(row.replayed),
        };
      }
      if (new Date(row.expires_at) <= now) {
        throw new DiagnosticDomainError("attempt_expired", 410);
      }
      if (!["started", "in_progress"].includes(row.current_status)) {
        throw new DiagnosticDomainError("attempt_state_invalid", 409);
      }
      throw new DiagnosticDomainError("attempt_revision_conflict", 409, {
        currentRevision: Number(row.current_revision),
      });
    },

    async completeAttempt({
      attemptId,
      completionId,
      expectedRevision,
      context,
      result,
      now,
    }) {
      const responsePayload = result.response;
      const resultRow = await database.execute(sql`
        with existing as (
          select
            a.id as attempt_id,
            a.status,
            a.revision,
            a.started_at,
            a.last_activity_at,
            a.completed_at,
            a.expires_at,
            r.response_payload
          from diagnostic_attempts a
          join diagnostic_results r on r.attempt_id = a.id
          where a.id = ${attemptId}::uuid
            and a.completion_id = ${completionId}
        ),
        updated_attempt as (
          update diagnostic_attempts
          set revision = revision + 1,
              status = 'completed',
              completion_id = ${completionId},
              completed_at = ${now.toISOString()}::timestamptz,
              last_activity_at = ${now.toISOString()}::timestamptz
          where id = ${attemptId}::uuid
            and revision = ${expectedRevision}
            and status in ('started', 'in_progress')
            and expires_at > ${now.toISOString()}::timestamptz
            and not exists (select 1 from existing)
          returning
            id as attempt_id,
            status,
            revision,
            started_at,
            last_activity_at,
            completed_at,
            expires_at
        ),
        context_write as (
          insert into diagnostic_contexts (
            attempt_id, goal, self_assessment, writing_sample, updated_at
          )
          select
            ${attemptId}::uuid,
            ${context.goal},
            ${JSON.stringify(context.selfAssessment)}::jsonb,
            ${context.writingSample},
            ${now.toISOString()}::timestamptz
          from updated_attempt
          on conflict (attempt_id) do update
          set goal = excluded.goal,
              self_assessment = excluded.self_assessment,
              writing_sample = excluded.writing_sample,
              updated_at = excluded.updated_at
          returning attempt_id
        ),
        result_write as (
          insert into diagnostic_results (
            id,
            attempt_id,
            product_contract_version,
            question_bank_version,
            answer_key_version,
            level_map_version,
            scoring_contract_version,
            result_copy_version,
            result_status,
            recommended_level_key,
            recommended_level_label,
            quiz_score,
            answered_question_count,
            skipped_question_count,
            score_summary,
            response_payload,
            advisor_confirmation_required,
            created_at
          )
          select
            ${result.id}::uuid,
            ${attemptId}::uuid,
            ${result.productContract},
            ${result.questionBank},
            ${result.answerKey},
            ${result.levelMap},
            ${result.scoring},
            ${result.resultCopy},
            ${result.resultStatus},
            ${result.recommendedLevelKey},
            ${result.recommendedLevelLabel},
            ${result.quizScore},
            ${result.answeredQuestionCount},
            ${result.skippedQuestionCount},
            ${JSON.stringify(result.scoreSummary)}::jsonb,
            ${JSON.stringify(responsePayload)}::jsonb,
            1,
            ${now.toISOString()}::timestamptz
          from updated_attempt
          returning response_payload
        ),
        selected as (
          select
            attempt_id,
            status,
            revision,
            started_at,
            last_activity_at,
            completed_at,
            expires_at,
            response_payload,
            true as replayed
          from existing
          union all
          select
            updated_attempt.attempt_id,
            updated_attempt.status,
            updated_attempt.revision,
            updated_attempt.started_at,
            updated_attempt.last_activity_at,
            updated_attempt.completed_at,
            updated_attempt.expires_at,
            result_write.response_payload,
            false as replayed
          from updated_attempt
          cross join result_write
        )
        select * from selected
      `);
      const row = rows(resultRow)[0];
      if (row) {
        return {
          attempt: {
            id: row.attempt_id,
            status: row.status,
            revision: Number(row.revision),
            productContractVersion: result.productContract,
            questionBankVersion: result.questionBank,
            scoringContractVersion: result.scoring,
            startedAt: iso(row.started_at),
            lastActivityAt: iso(row.last_activity_at),
            completedAt: iso(row.completed_at),
            expiresAt: iso(row.expires_at),
          },
          result: {
            ...result,
            response: row.response_payload,
          },
          replayed: Boolean(row.replayed),
        };
      }

      const attempt = await this.getAttempt(attemptId);
      if (!attempt) throw new DiagnosticDomainError("attempt_not_found", 404);
      if (new Date(attempt.expiresAt) <= now) {
        throw new DiagnosticDomainError("attempt_expired", 410);
      }
      if (!["started", "in_progress"].includes(attempt.status)) {
        throw new DiagnosticDomainError("attempt_state_invalid", 409);
      }
      throw new DiagnosticDomainError("attempt_revision_conflict", 409, {
        currentRevision: attempt.revision,
      });
    },

    async createClaim({ attemptId, claim, now }) {
      const result = await database.execute(sql`
        with revoked as (
          update result_claims
          set status = 'revoked'
          where attempt_id = ${attemptId}::uuid
            and status = 'pending'
          returning id
        ),
        updated_attempt as (
          update diagnostic_attempts
          set status = 'claim_pending',
              last_activity_at = ${now.toISOString()}::timestamptz
          where id = ${attemptId}::uuid
            and status in ('completed', 'claim_pending')
            and expires_at > ${now.toISOString()}::timestamptz
          returning id
        ),
        inserted as (
          insert into result_claims (
            id, attempt_id, claim_token_hash, status, expires_at, created_at
          )
          select
            ${claim.id}::uuid,
            ${attemptId}::uuid,
            ${claim.claimTokenHash},
            'pending',
            ${claim.expiresAt}::timestamptz,
            ${claim.createdAt}::timestamptz
          from updated_attempt
          returning *
        )
        select * from inserted
      `);
      const row = rows(result)[0];
      if (row) return normalizeClaim(row);
      const attempt = await this.getAttempt(attemptId);
      if (!attempt) throw new DiagnosticDomainError("attempt_not_found", 404);
      if (new Date(attempt.expiresAt) <= now) {
        throw new DiagnosticDomainError("attempt_expired", 410);
      }
      throw new DiagnosticDomainError("attempt_state_invalid", 409);
    },

    async getClaimByTokenHash(claimTokenHash) {
      const [claim] = await database
        .select()
        .from(resultClaims)
        .where(
          and(
            eq(resultClaims.claimTokenHash, claimTokenHash),
            eq(resultClaims.status, "pending"),
          ),
        )
        .limit(1);
      return claim ? normalizeClaim(claim) : null;
    },

    async purgeExpired({ now, limit }) {
      const result = await database.execute(sql`
        with expired_claims as (
          update result_claims
          set status = 'expired'
          where id in (
            select id
            from result_claims
            where status = 'pending'
              and expires_at <= ${now.toISOString()}::timestamptz
            order by expires_at
            limit ${limit}
          )
          returning id
        ),
        expired_auth_challenge_candidates as (
          select id
          from portal_auth_challenges
          where (
              status in ('pending', 'verified', 'expired', 'cancelled')
              and expires_at <= ${now.toISOString()}::timestamptz
            )
            or (
              status = 'consumed'
              and consumed_at <= ${now.toISOString()}::timestamptz - interval '1 day'
            )
          order by expires_at
          limit ${limit}
        ),
        deleted_auth_challenges as (
          delete from portal_auth_challenges
          where id in (select id from expired_auth_challenge_candidates)
          returning id
        ),
        auth_event_candidates as (
          select id
          from portal_auth_events
          where expires_at <= ${now.toISOString()}::timestamptz
          order by expires_at
          limit ${limit}
        ),
        deleted_auth_events as (
          delete from portal_auth_events
          where id in (select id from auth_event_candidates)
          returning id
        ),
        raw_candidates as (
          select id
          from diagnostic_attempts
          where raw_answers_purge_at is not null
            and raw_answers_purge_at <= ${now.toISOString()}::timestamptz
          order by raw_answers_purge_at
          limit ${limit}
        ),
        deleted_answers as (
          delete from diagnostic_answers
          where attempt_id in (select id from raw_candidates)
          returning attempt_id
        ),
        deleted_contexts as (
          delete from diagnostic_contexts
          where attempt_id in (select id from raw_candidates)
          returning attempt_id
        ),
        deleted_mutations as (
          delete from diagnostic_mutations
          where attempt_id in (select id from raw_candidates)
          returning attempt_id
        ),
        expired_attempt_candidates as (
          select id
          from diagnostic_attempts
          where status not in ('claimed', 'purged')
            and expires_at <= ${now.toISOString()}::timestamptz
          order by expires_at
          limit ${limit}
        ),
        deleted_attempts as (
          delete from diagnostic_attempts
          where id in (select id from expired_attempt_candidates)
          returning id
        )
        select
          (select count(*)::int from expired_claims) as expired_claims,
          (select count(*)::int from deleted_auth_challenges) as purged_auth_challenges,
          (select count(*)::int from deleted_auth_events) as purged_auth_events,
          (select count(distinct attempt_id)::int from deleted_answers) as purged_raw_answer_sets,
          (select count(*)::int from deleted_attempts) as purged_attempts
      `);
      const row = rows(result)[0] || {};
      return {
        expiredClaims: Number(row.expired_claims || 0),
        purgedAuthChallenges: Number(row.purged_auth_challenges || 0),
        purgedAuthEvents: Number(row.purged_auth_events || 0),
        purgedRawAnswerSets: Number(row.purged_raw_answer_sets || 0),
        purgedAttempts: Number(row.purged_attempts || 0),
      };
    },
  };
}

function rows(result) {
  return Array.isArray(result) ? result : result?.rows || [];
}

function toAttemptInsert(input) {
  return {
    ...input,
    startedAt: new Date(input.startedAt),
    lastActivityAt: new Date(input.lastActivityAt),
    completedAt: input.completedAt ? new Date(input.completedAt) : null,
    claimedAt: input.claimedAt ? new Date(input.claimedAt) : null,
    expiresAt: new Date(input.expiresAt),
    rawAnswersPurgeAt: input.rawAnswersPurgeAt
      ? new Date(input.rawAnswersPurgeAt)
      : null,
  };
}

function normalizeAttempt(row) {
  return {
    ...row,
    startedAt: iso(row.startedAt),
    lastActivityAt: iso(row.lastActivityAt),
    completedAt: iso(row.completedAt),
    claimedAt: iso(row.claimedAt),
    expiresAt: iso(row.expiresAt),
    rawAnswersPurgeAt: iso(row.rawAnswersPurgeAt),
  };
}

function normalizeAnswer(row) {
  return { ...row, updatedAt: iso(row.updatedAt) };
}

function normalizeContext(row) {
  return { ...row, updatedAt: iso(row.updatedAt) };
}

function normalizeResult(row) {
  return {
    ...row,
    createdAt: iso(row.createdAt),
    response: row.responsePayload,
  };
}

function normalizeClaim(row) {
  return {
    id: row.id,
    attemptId: row.attempt_id ?? row.attemptId,
    claimTokenHash: row.claim_token_hash ?? row.claimTokenHash,
    status: row.status,
    expiresAt: iso(row.expires_at ?? row.expiresAt),
    consumedAt: iso(row.consumed_at ?? row.consumedAt),
    claimedAccountId: row.claimed_account_id ?? row.claimedAccountId,
    createdAt: iso(row.created_at ?? row.createdAt),
  };
}

function iso(value) {
  if (!value) return null;
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}
