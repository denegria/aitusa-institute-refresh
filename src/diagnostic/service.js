import { createHash, randomUUID } from "node:crypto";
import {
  evaluatePlacementTestSubmission,
} from "../placement/placementTestModel.js";
import {
  addDays,
  addMinutes,
  DIAGNOSTIC_RETENTION,
  DIAGNOSTIC_VERSIONS,
} from "./contract.js";
import {
  createClaimToken,
  createResumeCredential,
  credentialMatches,
  hashCredential,
} from "./credentials.js";
import { DiagnosticDomainError } from "./errors.js";
import {
  DIAGNOSTIC_QUESTION_BANK,
  validateSelectedAnswer,
} from "./questionBank.server.js";
import { funnelDurationBucket } from "../observability/funnelContract.js";

const MAX_REQUEST_ID_LENGTH = 128;
const MAX_REQUEST_SECRET_LENGTH = 256;
const MAX_MUTATION_ID_LENGTH = 128;
const MAX_GOAL_LENGTH = 160;
const MAX_WRITING_SAMPLE_LENGTH = 2000;

export function createDiagnosticService({
  repository,
  resumeSecret,
  now = () => new Date(),
  createId = () => randomUUID(),
  createToken = createClaimToken,
  ledger = null,
}) {
  if (!repository) throw new Error("diagnostic_repository_required");

  async function authorize(attemptId, resumeCredential) {
    const attempt = await repository.getAttempt(attemptId);
    if (!attempt) throw new DiagnosticDomainError("attempt_not_found", 404);
    if (!credentialMatches(resumeCredential, attempt.resumeTokenHash)) {
      throw new DiagnosticDomainError("attempt_resume_unauthorized", 401);
    }
    const currentTime = now();
    if (new Date(attempt.expiresAt) <= currentTime) {
      throw new DiagnosticDomainError("attempt_expired", 410);
    }
    return attempt;
  }

  return {
    async startAttempt({
      requestId,
      requestSecret,
      ageBand = "age_13_plus",
    } = {}) {
      validateOpaqueId(requestId, "request_id_invalid", MAX_REQUEST_ID_LENGTH);
      if (!["age_13_plus", "under_13"].includes(ageBand)) {
        throw new DiagnosticDomainError("age_band_invalid", 422);
      }
      if (ageBand === "under_13") {
        return {
          durable: false,
          guardianRequired: true,
          retention: "session_only",
        };
      }
      validateOpaqueId(
        requestSecret,
        "request_secret_invalid",
        MAX_REQUEST_SECRET_LENGTH,
        32,
      );

      const currentTime = now();
      const id = createId();
      const initialCredential = createResumeCredential(
        resumeSecret,
        id,
        requestId,
        requestSecret,
      );
      const input = {
        id,
        requestId,
        status: "started",
        revision: 0,
        resumeTokenHash: hashCredential(initialCredential),
        productContractVersion: DIAGNOSTIC_VERSIONS.productContract,
        questionBankVersion: DIAGNOSTIC_VERSIONS.questionBank,
        answerKeyVersion: DIAGNOSTIC_VERSIONS.answerKey,
        levelMapVersion: DIAGNOSTIC_VERSIONS.levelMap,
        scoringContractVersion: DIAGNOSTIC_VERSIONS.scoring,
        resultCopyVersion: DIAGNOSTIC_VERSIONS.resultCopy,
        startedAt: currentTime.toISOString(),
        lastActivityAt: currentTime.toISOString(),
        completedAt: null,
        claimedAt: null,
        expiresAt: addDays(
          currentTime,
          DIAGNOSTIC_RETENTION.anonymousAttemptDays,
        ).toISOString(),
        rawAnswersPurgeAt: null,
        completionId: null,
        claimedAccountId: null,
        claimedChildProfileId: null,
      };
      const created = await repository.createAttempt(input);
      await emitLedger(ledger, {
        eventName: "diagnostic_started", idempotencyKey: `diagnostic-started:${created.attempt.id}`,
        correlationId: created.attempt.id, source: "diagnostic", safeOutcomeCode: "started",
        occurredAt: created.attempt.startedAt, ...diagnosticVersions(created.attempt),
      });
      const resumeCredential = createResumeCredential(
        resumeSecret,
        created.attempt.id,
        requestId,
        requestSecret,
      );
      if (!credentialMatches(resumeCredential, created.attempt.resumeTokenHash)) {
        throw new DiagnosticDomainError("attempt_idempotency_mismatch", 409);
      }
      return {
        durable: true,
        guardianRequired: false,
        attempt: toSafeAttempt(created.attempt),
        resumeCredential,
        replayed: created.replayed,
      };
    },

    async resumeAttempt({ attemptId, resumeCredential }) {
      await authorize(attemptId, resumeCredential);
      const snapshot = await repository.getAttemptSnapshot(attemptId);
      if (!snapshot) throw new DiagnosticDomainError("attempt_not_found", 404);
      return toSafeSnapshot(snapshot);
    },

    async recordAnswer({
      attemptId,
      resumeCredential,
      mutationId,
      expectedRevision,
      questionKey,
      answerState,
      answerValue = null,
    }) {
      await authorize(attemptId, resumeCredential);
      validateOpaqueId(mutationId, "mutation_id_invalid", MAX_MUTATION_ID_LENGTH);
      if (!Number.isInteger(expectedRevision) || expectedRevision < 0) {
        throw new DiagnosticDomainError("expected_revision_invalid", 422);
      }
      const validation = validateSelectedAnswer(questionKey, answerState, answerValue);
      if (!validation.ok) {
        throw new DiagnosticDomainError(validation.code, 422);
      }
      const result = await repository.applyAnswerMutation({
        attemptId,
        mutationId,
        expectedRevision,
        answer: { questionKey, answerState, answerValue },
        now: now(),
      });
      return {
        attemptId,
        revision: result.revision,
        replayed: result.replayed,
      };
    },

    async completeAttempt({
      attemptId,
      resumeCredential,
      completionId,
      expectedRevision,
      selfAssessment = {},
      goal,
      writingSample = "",
    }) {
      const attempt = await authorize(attemptId, resumeCredential);
      validateOpaqueId(completionId, "completion_id_invalid", MAX_MUTATION_ID_LENGTH);
      if (!Number.isInteger(expectedRevision) || expectedRevision < 0) {
        throw new DiagnosticDomainError("expected_revision_invalid", 422);
      }
      validateCompletionContext({ selfAssessment, goal, writingSample });

      const snapshot = await repository.getAttemptSnapshot(attemptId);
      if (!snapshot) throw new DiagnosticDomainError("attempt_not_found", 404);
      if (snapshot.attempt.completionId === completionId && snapshot.result) {
        await emitCompletionLedger(ledger, {
          attempt: snapshot.attempt,
          attemptId,
          completionId,
          occurredAt: snapshot.attempt.completedAt ?? now(),
          includeRequested: true,
        });
        return {
          attempt: toSafeAttempt(snapshot.attempt),
          result: snapshot.result.response,
          resultId: snapshot.result.id,
          claimEligible: true,
          replayed: true,
        };
      }
      assertVersions(attempt);

      const answerByKey = new Map(
        snapshot.answers.map((answer) => [answer.questionKey, answer]),
      );
      const selectedAnswers = DIAGNOSTIC_QUESTION_BANK.map((question) => {
        const answer = answerByKey.get(question.key);
        return answer?.answerState === "answered" ? answer.answerValue : null;
      });
      const evaluated = evaluatePlacementTestSubmission({
        attemptId,
        student: {},
        selectedAnswers,
        selfAssessment,
        goal,
        writingSample,
        consent: { advisorHandoff: false },
        submittedAt: now().toISOString(),
      });
      if (evaluated.status !== 200) {
        throw new DiagnosticDomainError(
          evaluated.body.errors?.[0] || "diagnostic_scoring_failed",
          422,
        );
      }

      const currentTime = now();
      await emitLedger(ledger, {
        eventName: "result_save_requested", idempotencyKey: ledgerKey("result-save-requested", attemptId, completionId),
        correlationId: attemptId, source: "diagnostic", safeOutcomeCode: "started",
        occurredAt: currentTime.toISOString(), ...diagnosticVersions(attempt),
      });
      const durableResponse = {
        ...evaluated.body,
        storageEnabled: true,
        durableResumeEnabled: true,
      };
      const persisted = await repository.completeAttempt({
        attemptId,
        completionId,
        expectedRevision,
        context: {
          attemptId,
          goal: goal.trim(),
          selfAssessment,
          writingSample: writingSample.trim() || null,
          updatedAt: currentTime.toISOString(),
        },
        result: {
          id: createId(),
          attemptId,
          ...DIAGNOSTIC_VERSIONS,
          resultStatus: evaluated.body.scores.finalScoringStatus,
          recommendedLevelKey: evaluated.body.recommendation.key,
          recommendedLevelLabel: evaluated.body.recommendation.level,
          quizScore: evaluated.body.scores.quizScore,
          answeredQuestionCount: evaluated.body.scores.answeredQuestionCount,
          skippedQuestionCount: evaluated.body.scores.skippedQuestionCount,
          scoreSummary: evaluated.body.scores,
          advisorConfirmationRequired: true,
          createdAt: currentTime.toISOString(),
          response: durableResponse,
        },
        now: currentTime,
      });
      await emitCompletionLedger(ledger, { attempt, attemptId, completionId, occurredAt: currentTime });
      return {
        attempt: toSafeAttempt(persisted.attempt),
        result: persisted.result.response,
        resultId: persisted.result.id,
        claimEligible: true,
        replayed: persisted.replayed,
      };
    },

    async mintClaimToken({ attemptId, resumeCredential }) {
      await authorize(attemptId, resumeCredential);
      const token = createToken();
      const currentTime = now();
      const claim = await repository.createClaim({
        attemptId,
        claim: {
          id: createId(),
          attemptId,
          claimTokenHash: hashCredential(token),
          status: "pending",
          expiresAt: addMinutes(
            currentTime,
            DIAGNOSTIC_RETENTION.claimTokenMinutes,
          ).toISOString(),
          consumedAt: null,
          claimedAccountId: null,
          createdAt: currentTime.toISOString(),
        },
        now: currentTime,
      });
      return {
        claimToken: token,
        expiresAt: claim.expiresAt,
      };
    },

    async validateClaimToken({ attemptId, claimToken }) {
      if (typeof claimToken !== "string" || claimToken.length < 32) {
        throw new DiagnosticDomainError("claim_token_invalid", 401);
      }
      const claim = await repository.getClaimByTokenHash(hashCredential(claimToken));
      if (!claim || claim.attemptId !== attemptId || claim.status !== "pending") {
        throw new DiagnosticDomainError("claim_token_invalid", 401);
      }
      if (new Date(claim.expiresAt) <= now()) {
        throw new DiagnosticDomainError("claim_token_expired", 410);
      }
      return {
        eligible: true,
        attemptId,
        claimId: claim.id,
        expiresAt: claim.expiresAt,
      };
    },

    async runRetention({ limit = DIAGNOSTIC_RETENTION.purgeBatchSize } = {}) {
      const boundedLimit = Math.min(
        Math.max(Number.parseInt(limit, 10) || DIAGNOSTIC_RETENTION.purgeBatchSize, 1),
        DIAGNOSTIC_RETENTION.purgeBatchSize,
      );
      return repository.purgeExpired({ now: now(), limit: boundedLimit });
    },
  };
}

async function emitLedger(ledger, event) {
  if (!ledger) return;
  try { await ledger.emit(event); } catch { /* Funnel telemetry is query-neutral. */ }
}

async function emitCompletionLedger(ledger, { attempt, attemptId, completionId, occurredAt, includeRequested = false }) {
  const completedAt = new Date(occurredAt);
  if (includeRequested) {
    await emitLedger(ledger, {
      eventName: "result_save_requested", idempotencyKey: ledgerKey("result-save-requested", attemptId, completionId),
      correlationId: attemptId, source: "diagnostic", safeOutcomeCode: "started",
      occurredAt: completedAt.toISOString(), ...diagnosticVersions(attempt),
    });
  }
  await emitLedger(ledger, {
    eventName: "diagnostic_completed", idempotencyKey: ledgerKey("diagnostic-completed", attemptId, completionId),
    correlationId: attemptId, source: "diagnostic", safeOutcomeCode: "completed",
    occurredAt: completedAt.toISOString(), durationBucket: funnelDurationBucket(attempt.startedAt, completedAt), ...diagnosticVersions(attempt),
  });
  await emitLedger(ledger, {
    eventName: "result_save_completed", idempotencyKey: ledgerKey("result-save-completed", attemptId, completionId),
    correlationId: attemptId, source: "diagnostic", safeOutcomeCode: "saved",
    occurredAt: completedAt.toISOString(), ...diagnosticVersions(attempt),
  });
}

function diagnosticVersions(attempt) {
  return {
    productContractVersion: attempt.productContractVersion,
    questionBankVersion: attempt.questionBankVersion,
    answerKeyVersion: attempt.answerKeyVersion,
    levelMapVersion: attempt.levelMapVersion,
    scoringContractVersion: attempt.scoringContractVersion,
    resultCopyVersion: attempt.resultCopyVersion,
  };
}

function ledgerKey(...parts) {
  return `funnel-${createHash("sha256").update(parts.join(":"), "utf8").digest("hex")}`;
}

function assertVersions(attempt) {
  const attemptVersions = {
    productContract: attempt.productContractVersion,
    questionBank: attempt.questionBankVersion,
    answerKey: attempt.answerKeyVersion,
    levelMap: attempt.levelMapVersion,
    scoring: attempt.scoringContractVersion,
    resultCopy: attempt.resultCopyVersion,
  };
  for (const [key, value] of Object.entries(DIAGNOSTIC_VERSIONS)) {
    if (attemptVersions[key] !== value) {
      throw new DiagnosticDomainError("question_bank_version_mismatch", 409);
    }
  }
}

function validateCompletionContext({ selfAssessment, goal, writingSample }) {
  if (!goal || typeof goal !== "string" || goal.trim().length > MAX_GOAL_LENGTH) {
    throw new DiagnosticDomainError("goal_invalid", 422);
  }
  if (!selfAssessment || typeof selfAssessment !== "object" || Array.isArray(selfAssessment)) {
    throw new DiagnosticDomainError("self_assessment_invalid", 422);
  }
  if (
    typeof writingSample !== "string" ||
    writingSample.length > MAX_WRITING_SAMPLE_LENGTH
  ) {
    throw new DiagnosticDomainError("writing_sample_invalid", 422);
  }
}

function validateOpaqueId(value, code, maxLength, minLength = 8) {
  if (
    typeof value !== "string" ||
    value.trim().length < minLength ||
    value.length > maxLength
  ) {
    throw new DiagnosticDomainError(code, 422);
  }
}

function toSafeAttempt(attempt) {
  return {
    id: attempt.id,
    status: attempt.status,
    revision: attempt.revision,
    productContractVersion: attempt.productContractVersion,
    questionBankVersion: attempt.questionBankVersion,
    scoringContractVersion: attempt.scoringContractVersion,
    startedAt: attempt.startedAt,
    lastActivityAt: attempt.lastActivityAt,
    completedAt: attempt.completedAt,
    expiresAt: attempt.expiresAt,
  };
}

function toSafeSnapshot(snapshot) {
  return {
    attempt: toSafeAttempt(snapshot.attempt),
    answers: snapshot.answers.map((answer) => ({
      questionKey: answer.questionKey,
      answerState: answer.answerState,
      answerValue: answer.answerValue,
      updatedAt: answer.updatedAt,
    })),
    goal: snapshot.context?.goal || null,
    result: snapshot.result?.response || null,
  };
}
