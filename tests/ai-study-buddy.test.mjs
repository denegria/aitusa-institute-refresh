import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  AI_COST_CONTROLS,
  AI_GUARDIAN_POLICY,
  AI_PROVIDER_GATE,
  AI_STUDY_BUDDY_USE_CASES,
  toPracticeEligibilityDto,
} from "../src/aiStudyBuddy/studyBuddyContract.js";
import { evaluateStudyBuddyEligibility } from "../src/aiStudyBuddy/policy.server.js";
import { getStudyBuddyConfig, assertFakeProviderConstructionAllowed, assertLiveProviderConstructionAllowed } from "../src/aiStudyBuddy/config.server.js";
import { createPortalAuthService } from "../src/portalAuth/service.js";
import { validateAuthorizedStudyBuddyContext } from "../src/aiStudyBuddy/authorizedContext.server.js";

const snapshot = {
  state: "authenticated",
  account: { id: "account-1", status: "active", accountType: "guardian" },
  result: { recommendedLevelKey: "basic" },
  practice: { guardianVerified: true },
};

describe("MIS-340 Study Buddy public contract", () => {
  it("locks server provider use, five turns, one retry, and guardian policy", () => {
    assert.deepEqual(Object.keys(AI_STUDY_BUDDY_USE_CASES), ["pronunciation_drill", "conversation_roleplay", "lesson_review", "vocabulary_quiz"]);
    assert.equal(AI_PROVIDER_GATE.browserProviderCallsAllowed, false);
    assert.equal(AI_PROVIDER_GATE.serverProviderCallsAllowed, false);
    assert.equal(AI_COST_CONTROLS.maxTurnsPerSession, 5);
    assert.equal(AI_COST_CONTROLS.maxRetriesPerTurn, 1);
    assert.equal(AI_GUARDIAN_POLICY.practiceAllowedWithoutGuardian, false);
  });

  it("fails closed for guardian-unresolved, missing-result, and provider-disabled snapshots", () => {
    assert.equal(evaluateStudyBuddyEligibility({ ...snapshot, practice: {} }).code, "guardian_unresolved");
    assert.equal(evaluateStudyBuddyEligibility({ ...snapshot, result: null }).code, "missing_result");
    assert.equal(evaluateStudyBuddyEligibility(snapshot).code, "provider_disabled");
  });

  it("does not apply the under-13 guardian gate to an adult student", () => {
    const adult = {
      ...snapshot,
      account: { ...snapshot.account, accountType: "adult_student" },
      practice: {},
    };
    assert.equal(
      evaluateStudyBuddyEligibility(adult, { providerEnabled: true }).code,
      "authenticated",
    );
  });

  it("emits a restricted eligibility DTO", () => {
    const dto = toPracticeEligibilityDto(evaluateStudyBuddyEligibility(snapshot));
    assert.deepEqual(Object.keys(dto).sort(), ["code", "contractVersion", "nextAction", "ok", "practiceAvailable"]);
    assert.equal(JSON.stringify(dto).match(/account|email|providerId|model|prompt|cost/i), null);
  });

  it("constructs only the fake provider in non-production and defers live providers to MIS-345", () => {
    assert.equal(getStudyBuddyConfig({}).enabled, false);
    const gates = { NODE_ENV: "test", STUDY_BUDDY_EXECUTION_ENABLED: "true", STUDY_BUDDY_FAKE_PROVIDER_ENABLED: "true" };
    for (const budgets of [
      { STUDY_BUDDY_MAX_SESSION_MICRO_USD: "0", STUDY_BUDDY_MAX_DAY_MICRO_USD: "10" },
      { STUDY_BUDDY_MAX_SESSION_MICRO_USD: "1.5", STUDY_BUDDY_MAX_DAY_MICRO_USD: "10" },
      { STUDY_BUDDY_MAX_SESSION_MICRO_USD: "10", STUDY_BUDDY_MAX_DAY_MICRO_USD: "9" },
      { STUDY_BUDDY_MAX_SESSION_MICRO_USD: "10", STUDY_BUDDY_MAX_DAY_MICRO_USD: "" },
    ]) assert.equal(getStudyBuddyConfig({ ...gates, ...budgets }).enabled, false);
    const enabled = getStudyBuddyConfig({ ...gates, STUDY_BUDDY_MAX_SESSION_MICRO_USD: "10", STUDY_BUDDY_MAX_DAY_MICRO_USD: "20" });
    assert.equal(enabled.enabled, true);
    assert.equal(enabled.providerMode, "fake");
    assert.equal(enabled.providerProfile, "fake-v1");
    assert.equal(enabled.limits.maxDayMicroUsd, 20);
    assert.equal(assertFakeProviderConstructionAllowed({ ...gates, STUDY_BUDDY_MAX_SESSION_MICRO_USD: "10", STUDY_BUDDY_MAX_DAY_MICRO_USD: "20" }).providerMode, "fake");
    assert.throws(() => assertFakeProviderConstructionAllowed({ ...gates, VERCEL_ENV: "production", STUDY_BUDDY_MAX_SESSION_MICRO_USD: "10", STUDY_BUDDY_MAX_DAY_MICRO_USD: "20" }), /disabled/);
    assert.throws(() => assertLiveProviderConstructionAllowed(enabled), /MIS-345|mis_345/i);
  });

  it("derives a private versioned email HMAC and ownership from the sealed identity", async () => {
    const accountId = "00000000-0000-4000-8000-000000000001";
    const resultId = "10000000-0000-4000-8000-000000000001";
    const service = createPortalAuthService({
      hashSecret: "study-buddy-test-hash-secret-32-bytes-long",
      authProvider: { async authenticateSession(value) { assert.equal(value, "sealed-session"); return { providerUserId: "workos-user", email: "Student@Example.com", emailVerified: true }; } },
      repository: { async getAuthorizedStudyBuddyContext(identity) { assert.equal(identity.email, "student@example.com"); return { snapshot: { state: "authenticated", account: { status: "active" }, result: { recommendedLevelKey: "basic" }, practice: { guardianVerified: false } }, ownership: { accountId, resultId } }; } },
    });
    const context = validateAuthorizedStudyBuddyContext(await service.resolveAuthorizedStudyBuddyContext("sealed-session"));
    assert.equal(context.ownership.verifiedEmailHmac.length, 64);
    assert.equal(context.ownership.hashVersion, "hmac-sha256-v1");
    assert.equal(JSON.stringify(context.snapshot).match(/accountId|resultId|hmac|email/i), null);
    assert.throws(() => validateAuthorizedStudyBuddyContext({ ...context, ownership: { ...context.ownership, verifiedEmailHmac: null } }), /unauthenticated/);
  });
});
