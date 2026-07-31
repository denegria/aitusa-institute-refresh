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
import { getStudyBuddyConfig, assertLiveProviderConstructionAllowed } from "../src/aiStudyBuddy/config.server.js";

const snapshot = {
  state: "authenticated",
  account: { id: "account-1", status: "active" },
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

  it("emits a restricted eligibility DTO", () => {
    const dto = toPracticeEligibilityDto(evaluateStudyBuddyEligibility(snapshot));
    assert.deepEqual(Object.keys(dto).sort(), ["code", "contractVersion", "nextAction", "ok", "practiceAvailable"]);
    assert.equal(JSON.stringify(dto).match(/account|email|providerId|model|prompt|cost/i), null);
  });

  it("cannot construct a live provider in tests or without all server gates", () => {
    assert.equal(getStudyBuddyConfig({}).enabled, false);
    assert.throws(() => assertLiveProviderConstructionAllowed({ NODE_ENV: "test", STUDY_BUDDY_EXECUTION_ENABLED: "true", STUDY_BUDDY_PROVIDER_APPROVED: "true", STUDY_BUDDY_GUARDIAN_SOURCE_APPROVED: "true", STUDY_BUDDY_MAX_SESSION_MICRO_USD: "10" }), /disabled/);
  });
});
