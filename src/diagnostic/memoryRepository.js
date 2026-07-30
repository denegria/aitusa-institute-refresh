import { DiagnosticDomainError } from "./errors.js";

const clone = (value) => structuredClone(value);

export function createMemoryDiagnosticRepository() {
  const attempts = new Map();
  const requestIds = new Map();
  const answers = new Map();
  const mutations = new Map();
  const contexts = new Map();
  const results = new Map();
  const claims = new Map();

  function answerMap(attemptId) {
    if (!answers.has(attemptId)) answers.set(attemptId, new Map());
    return answers.get(attemptId);
  }

  return {
    async createAttempt(input) {
      const existingId = requestIds.get(input.requestId);
      if (existingId) {
        return { attempt: clone(attempts.get(existingId)), replayed: true };
      }
      const attempt = clone(input);
      attempts.set(input.id, attempt);
      requestIds.set(input.requestId, input.id);
      return { attempt: clone(attempt), replayed: false };
    },

    async getAttempt(attemptId) {
      return attempts.has(attemptId) ? clone(attempts.get(attemptId)) : null;
    },

    async getAttemptSnapshot(attemptId) {
      const attempt = attempts.get(attemptId);
      if (!attempt) return null;
      return {
        attempt: clone(attempt),
        answers: [...answerMap(attemptId).values()].map(clone),
        context: contexts.has(attemptId) ? clone(contexts.get(attemptId)) : null,
        result: results.has(attemptId) ? clone(results.get(attemptId)) : null,
      };
    },

    async applyAnswerMutation({
      attemptId,
      mutationId,
      expectedRevision,
      answer,
      now,
    }) {
      const attempt = attempts.get(attemptId);
      if (!attempt) throw new DiagnosticDomainError("attempt_not_found", 404);
      const mutationKey = `${attemptId}:${mutationId}`;
      if (mutations.has(mutationKey)) {
        return {
          revision: mutations.get(mutationKey).revisionAfter,
          replayed: true,
        };
      }
      if (new Date(attempt.expiresAt) <= now) {
        attempt.status = "expired";
        throw new DiagnosticDomainError("attempt_expired", 410);
      }
      if (attempt.revision !== expectedRevision) {
        throw new DiagnosticDomainError("attempt_revision_conflict", 409, {
          currentRevision: attempt.revision,
        });
      }
      if (!["started", "in_progress"].includes(attempt.status)) {
        throw new DiagnosticDomainError("attempt_state_invalid", 409);
      }

      attempt.revision += 1;
      attempt.status = "in_progress";
      attempt.lastActivityAt = now.toISOString();
      answerMap(attemptId).set(answer.questionKey, {
        attemptId,
        ...clone(answer),
        updatedAt: now.toISOString(),
      });
      mutations.set(mutationKey, {
        attemptId,
        mutationId,
        revisionAfter: attempt.revision,
        createdAt: now.toISOString(),
      });
      return { revision: attempt.revision, replayed: false };
    },

    async completeAttempt({
      attemptId,
      completionId,
      expectedRevision,
      context,
      result,
      now,
    }) {
      const attempt = attempts.get(attemptId);
      if (!attempt) throw new DiagnosticDomainError("attempt_not_found", 404);
      if (attempt.completionId === completionId && results.has(attemptId)) {
        return {
          attempt: clone(attempt),
          result: clone(results.get(attemptId)),
          replayed: true,
        };
      }
      if (new Date(attempt.expiresAt) <= now) {
        attempt.status = "expired";
        throw new DiagnosticDomainError("attempt_expired", 410);
      }
      if (attempt.revision !== expectedRevision) {
        throw new DiagnosticDomainError("attempt_revision_conflict", 409, {
          currentRevision: attempt.revision,
        });
      }
      if (!["started", "in_progress"].includes(attempt.status)) {
        throw new DiagnosticDomainError("attempt_state_invalid", 409);
      }

      attempt.revision += 1;
      attempt.status = "completed";
      attempt.completionId = completionId;
      attempt.completedAt = now.toISOString();
      attempt.lastActivityAt = now.toISOString();
      contexts.set(attemptId, clone(context));
      results.set(attemptId, clone(result));
      return {
        attempt: clone(attempt),
        result: clone(result),
        replayed: false,
      };
    },

    async createClaim({
      attemptId,
      claim,
      now,
    }) {
      const attempt = attempts.get(attemptId);
      if (!attempt) throw new DiagnosticDomainError("attempt_not_found", 404);
      if (!["completed", "claim_pending"].includes(attempt.status)) {
        throw new DiagnosticDomainError("attempt_state_invalid", 409);
      }
      for (const existing of claims.values()) {
        if (existing.attemptId === attemptId && existing.status === "pending") {
          existing.status = "revoked";
        }
      }
      attempt.status = "claim_pending";
      attempt.lastActivityAt = now.toISOString();
      claims.set(claim.id, clone(claim));
      return clone(claim);
    },

    async getClaimByTokenHash(claimTokenHash) {
      for (const claim of claims.values()) {
        if (claim.claimTokenHash === claimTokenHash) return clone(claim);
      }
      return null;
    },

    async purgeExpired({ now, limit }) {
      let purgedAttempts = 0;
      let purgedRawAnswerSets = 0;
      let expiredClaims = 0;

      for (const claim of claims.values()) {
        if (
          expiredClaims < limit &&
          claim.status === "pending" &&
          new Date(claim.expiresAt) <= now
        ) {
          claim.status = "expired";
          expiredClaims += 1;
        }
      }

      for (const [attemptId, attempt] of attempts) {
        if (
          purgedAttempts < limit &&
          !["claimed", "purged"].includes(attempt.status) &&
          new Date(attempt.expiresAt) <= now
        ) {
          attempts.delete(attemptId);
          requestIds.delete(attempt.requestId);
          answers.delete(attemptId);
          contexts.delete(attemptId);
          results.delete(attemptId);
          for (const key of mutations.keys()) {
            if (key.startsWith(`${attemptId}:`)) mutations.delete(key);
          }
          for (const [claimId, claim] of claims) {
            if (claim.attemptId === attemptId) claims.delete(claimId);
          }
          purgedAttempts += 1;
          continue;
        }
        if (
          purgedRawAnswerSets < limit &&
          attempt.rawAnswersPurgeAt &&
          new Date(attempt.rawAnswersPurgeAt) <= now &&
          answers.has(attemptId)
        ) {
          answers.delete(attemptId);
          contexts.delete(attemptId);
          for (const key of mutations.keys()) {
            if (key.startsWith(`${attemptId}:`)) mutations.delete(key);
          }
          purgedRawAnswerSets += 1;
        }
      }

      return { purgedAttempts, purgedRawAnswerSets, expiredClaims };
    },

    _inspect() {
      return { attempts, answers, mutations, contexts, results, claims };
    },
  };
}
