import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { placementTest } from "../src/content.js";
import { createGuardianOnboardingService } from "../src/guardianOnboarding/service.js";
import { createMemoryGuardianRepository } from "../src/guardianOnboarding/memoryRepository.js";

const ids = Array.from({ length: 30 }, (_, index) =>
  `00000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
);
const requestId = "10000000-0000-4000-8000-000000000001";

function fixture() {
  const repository = createMemoryGuardianRepository();
  let idIndex = 0;
  const authCalls = [];
  const authProvider = {
    async sendCode(input) {
      authCalls.push({ type: "send", ...input });
      return {
        providerChallengeId: "guardian_magic_fixture",
        providerUserId: "guardian_user_fixture",
        expiresAt: "2026-08-02T01:10:00.000Z",
      };
    },
    async verifyCode(input) {
      authCalls.push({ type: "verify", ...input });
      return {
        identity: { providerUserId: "guardian_user_fixture", email: input.email, emailVerified: true },
        sessionData: "guardian-session",
      };
    },
    async authenticateSession(value) {
      assert.equal(value, "guardian-session");
      return { providerUserId: "guardian_user_fixture", email: "guardian@example.com", emailVerified: true };
    },
  };
  const service = createGuardianOnboardingService({
    repository,
    authProvider,
    now: () => new Date("2026-08-02T01:00:00.000Z"),
    createId: () => ids[idIndex++],
  });
  return { authCalls, repository, service };
}

function requestInput(overrides = {}) {
  return {
    requestId,
    guardianFirstName: "María",
    guardianEmail: "GUARDIAN@example.com",
    guardianAttested: true,
    noticeAccepted: true,
    aiPracticeApproved: false,
    advisorContactApproved: false,
    ...overrides,
  };
}

function submission() {
  return {
    selectedAnswers: placementTest.questions.flatMap((level) => level.items.map((question) => question.options[0])),
    selfAssessment: Object.fromEntries(placementTest.selfAssessments.map((item) => [item.key, 2])),
    goal: placementTest.goals[0],
    writingSample: "",
  };
}

describe("MIS-279 guardian onboarding", () => {
  it("persists only adult notice/attestation data before verified consent", async () => {
    const { repository, service } = fixture();
    const response = await service.requestCode(requestInput());
    assert.equal(response.codeLength, 6);
    const challenge = repository.inspect().challenges.get(response.challengeId);
    assert.equal(challenge.guardianEmail, "guardian@example.com");
    assert.equal(Object.hasOwn(challenge, "childFirstName"), false);
    assert.equal(Object.hasOwn(challenge, "selectedAnswers"), false);
    assert.equal(Object.hasOwn(challenge, "writingSample"), false);
  });

  it("rejects optional permissions unless the guardian explicitly checks them", async () => {
    const { repository, service } = fixture();
    const response = await service.requestCode(requestInput());
    const challenge = repository.inspect().challenges.get(response.challengeId);
    assert.equal(challenge.aiPracticeApproved, false);
    assert.equal(challenge.advisorContactApproved, false);
  });

  it("creates the guardian account, minimal child profile, result, and receipt only after verification", async () => {
    const { repository, service } = fixture();
    const requested = await service.requestCode(requestInput({ aiPracticeApproved: true }));
    const verified = await service.verifyCode({
      challengeId: requested.challengeId,
      requestId,
      code: "123456",
    });
    const identity = await service.authenticateSession(verified.sessionData);
    const receipt = await service.finalize({
      challengeId: requested.challengeId,
      requestId,
      childFirstName: "Luis",
      submission: submission(),
    }, identity);
    assert.equal(receipt.account.accountType, "guardian");
    assert.deepEqual(
      { firstName: receipt.child.firstName, ageBand: receipt.child.ageBand },
      { firstName: "Luis", ageBand: "under_13" },
    );
    assert.equal(receipt.consent.permissions.aiPracticeApproved, true);
    assert.equal(receipt.consent.permissions.marketingSmsOptIn, false);
    assert.match(receipt.result.attemptId, /^[0-9a-f-]{36}$/);
    assert.equal(repository.inspect().persisted.length, 1);
  });

  it("supports guardian-owned withdrawal, unlink, and deletion-request controls", async () => {
    const { service } = fixture();
    const requested = await service.requestCode(requestInput());
    const verified = await service.verifyCode({ challengeId: requested.challengeId, requestId, code: "123456" });
    const identity = await service.authenticateSession(verified.sessionData);
    const receipt = await service.finalize({
      challengeId: requested.challengeId,
      requestId,
      childFirstName: "Luis",
      submission: submission(),
    }, identity);
    const result = await service.manageChild({
      childProfileId: receipt.child.id,
      action: "request_deletion",
    }, identity);
    assert.equal(result.status, "deletion_requested");
  });

  it("rejects a different verified guardian identity", async () => {
    const { service } = fixture();
    const requested = await service.requestCode(requestInput());
    await assert.rejects(
      service.finalize({
        challengeId: requested.challengeId,
        requestId,
        childFirstName: "Luis",
        submission: submission(),
      }, { providerUserId: "attacker", email: "attacker@example.com", emailVerified: true }),
      (error) => error.code === "verified_identity_mismatch",
    );
  });
});
