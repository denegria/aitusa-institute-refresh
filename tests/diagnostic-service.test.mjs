import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createMemoryDiagnosticRepository } from "../src/diagnostic/memoryRepository.js";
import { DIAGNOSTIC_QUESTION_BANK } from "../src/diagnostic/questionBank.server.js";
import { createDiagnosticService } from "../src/diagnostic/service.js";

const ids = [
  "00000000-0000-4000-8000-000000000001",
  "00000000-0000-4000-8000-000000000002",
  "00000000-0000-4000-8000-000000000003",
  "00000000-0000-4000-8000-000000000004",
  "00000000-0000-4000-8000-000000000005",
];

function fixture() {
  const repository = createMemoryDiagnosticRepository();
  let currentTime = new Date("2026-07-30T19:00:00.000Z");
  let idIndex = 0;
  const service = createDiagnosticService({
    repository,
    resumeSecret: "test-resume-secret-with-enough-entropy",
    now: () => new Date(currentTime),
    createId: () => ids[idIndex++],
    createToken: () => "claim-token-fixture-with-at-least-thirty-two-characters",
  });
  return {
    repository,
    service,
    setTime(value) {
      currentTime = new Date(value);
    },
  };
}

const requestSecret = "request-secret-fixture-with-more-than-thirty-two-characters";

async function answerAllCorrect(service, started) {
  let revision = started.attempt.revision;
  for (let index = 0; index < DIAGNOSTIC_QUESTION_BANK.length; index += 1) {
    const question = DIAGNOSTIC_QUESTION_BANK[index];
    const mutation = await service.recordAnswer({
      attemptId: started.attempt.id,
      resumeCredential: started.resumeCredential,
      mutationId: `mutation-${String(index + 1).padStart(3, "0")}`,
      expectedRevision: revision,
      questionKey: question.key,
      answerState: "answered",
      answerValue: question.correctAnswer,
    });
    revision = mutation.revision;
  }
  return revision;
}

describe("MIS-337 versioned diagnostic service", () => {
  it("keeps under-13 attempts session-only without creating a database record", async () => {
    const { repository, service } = fixture();
    const started = await service.startAttempt({
      requestId: "request-under-13",
      ageBand: "under_13",
    });

    assert.deepEqual(started, {
      durable: false,
      guardianRequired: true,
      retention: "session_only",
    });
    assert.equal(repository._inspect().attempts.size, 0);
  });

  it("starts anonymously and replays the same request without a duplicate", async () => {
    const { repository, service } = fixture();
    const input = {
      requestId: "request-idempotent-001",
      requestSecret,
      ageBand: "age_13_plus",
    };
    const first = await service.startAttempt(input);
    const replay = await service.startAttempt(input);

    assert.equal(first.durable, true);
    assert.equal(first.attempt.id, replay.attempt.id);
    assert.equal(first.resumeCredential, replay.resumeCredential);
    assert.equal(replay.replayed, true);
    assert.equal(repository._inspect().attempts.size, 1);
    assert.equal(first.attempt.expiresAt, "2026-08-06T19:00:00.000Z");

    await assert.rejects(
      service.startAttempt({
        ...input,
        requestSecret: "different-request-secret-with-more-than-thirty-two-characters",
      }),
      (error) => error.code === "attempt_idempotency_mismatch",
    );
  });

  it("owns answer validation, mutation idempotency, and revision conflicts", async () => {
    const { service } = fixture();
    const started = await service.startAttempt({
      requestId: "request-mutation-001",
      requestSecret,
      ageBand: "age_13_plus",
    });
    const question = DIAGNOSTIC_QUESTION_BANK[0];
    const mutation = {
      attemptId: started.attempt.id,
      resumeCredential: started.resumeCredential,
      mutationId: "mutation-answer-001",
      expectedRevision: 0,
      questionKey: question.key,
      answerState: "answered",
      answerValue: question.correctAnswer,
    };

    const first = await service.recordAnswer(mutation);
    const replay = await service.recordAnswer(mutation);
    assert.equal(first.revision, 1);
    assert.equal(replay.revision, 1);
    assert.equal(replay.replayed, true);

    await assert.rejects(
      service.recordAnswer({
        ...mutation,
        mutationId: "mutation-answer-002",
        answerValue: question.options[0],
      }),
      (error) =>
        error.code === "attempt_revision_conflict" &&
        error.details.currentRevision === 1,
    );
  });

  it("calculates the approved block result on the server and completes idempotently", async () => {
    const { repository, service } = fixture();
    const started = await service.startAttempt({
      requestId: "request-complete-001",
      requestSecret,
      ageBand: "age_13_plus",
    });
    const revision = await answerAllCorrect(service, started);
    const completion = {
      attemptId: started.attempt.id,
      resumeCredential: started.resumeCredential,
      completionId: "completion-idempotent-001",
      expectedRevision: revision,
      selfAssessment: {
        speaking: 0,
        listening: 0,
        reading: 0,
        writing: 0,
      },
      goal: "Trabajo y entrevistas",
      writingSample: "",
    };

    const first = await service.completeAttempt(completion);
    const replay = await service.completeAttempt(completion);
    assert.equal(first.result.scores.quizScore, 62);
    assert.equal(first.result.scores.selfAssessmentAffectsPlacement, false);
    assert.equal(first.result.storageEnabled, true);
    assert.equal(first.result.resultStatus.certifiedAssessment, false);
    assert.equal(first.result.scores.finalScoringStatus, "advisor_review");
    assert.equal([...repository._inspect().results.values()][0].resultStatus, "advisor_review");
    assert.equal(first.attempt.status, "completed");
    assert.equal(replay.replayed, true);
    assert.equal(replay.result.scores.quizScore, 62);
  });

  it("uses hash-only, one-time-window claim tokens and rejects expired tokens", async () => {
    const { repository, service, setTime } = fixture();
    const started = await service.startAttempt({
      requestId: "request-claim-001",
      requestSecret,
      ageBand: "age_13_plus",
    });
    const revision = await answerAllCorrect(service, started);
    await service.completeAttempt({
      attemptId: started.attempt.id,
      resumeCredential: started.resumeCredential,
      completionId: "completion-claim-001",
      expectedRevision: revision,
      selfAssessment: {},
      goal: "Vida diaria",
      writingSample: "",
    });
    const claim = await service.mintClaimToken({
      attemptId: started.attempt.id,
      resumeCredential: started.resumeCredential,
    });

    const storedClaim = [...repository._inspect().claims.values()][0];
    assert.equal(storedClaim.claimTokenHash.includes(claim.claimToken), false);
    assert.equal(
      (await service.validateClaimToken({
        attemptId: started.attempt.id,
        claimToken: claim.claimToken,
      })).eligible,
      true,
    );

    setTime("2026-07-30T19:16:00.000Z");
    await assert.rejects(
      service.validateClaimToken({
        attemptId: started.attempt.id,
        claimToken: claim.claimToken,
      }),
      (error) => error.code === "claim_token_expired",
    );
    await assert.rejects(
      service.validateClaimToken({
        attemptId: started.attempt.id,
        claimToken: "not-a-valid-claim-token",
      }),
      (error) => error.code === "claim_token_invalid",
    );
  });

  it("purges unclaimed attempts after seven days without retaining answers", async () => {
    const { repository, service, setTime } = fixture();
    const started = await service.startAttempt({
      requestId: "request-retention-001",
      requestSecret,
      ageBand: "age_13_plus",
    });
    await service.recordAnswer({
      attemptId: started.attempt.id,
      resumeCredential: started.resumeCredential,
      mutationId: "mutation-retention-001",
      expectedRevision: 0,
      questionKey: "q-001",
      answerState: "skipped",
      answerValue: null,
    });

    setTime("2026-08-06T19:00:01.000Z");
    const counts = await service.runRetention();
    assert.equal(counts.purgedAttempts, 1);
    assert.equal(repository._inspect().attempts.size, 0);
    assert.equal(repository._inspect().answers.size, 0);
  });
});
