import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  AI_COST_CONTROLS,
  AI_PROVIDER_GATE,
  AI_STUDY_BUDDY_USE_CASES,
  buildAiPracticeCrmSummaryPreview,
  evaluateAiPracticeRequest,
  getAiStudyBuddyPlan,
} from "../src/aiStudyBuddy/studyBuddyContract.js";
import { resolvePortalSession } from "../src/portal/authBoundary.js";

describe("MIS-275 AI study buddy contract", () => {
  it("defines the MVP use cases", () => {
    assert.deepEqual(Object.keys(AI_STUDY_BUDDY_USE_CASES), [
      "pronunciation_drill",
      "conversation_roleplay",
      "lesson_review",
      "vocabulary_quiz",
    ]);
  });

  it("keeps browser and server provider calls disabled until approval", () => {
    assert.equal(AI_PROVIDER_GATE.browserProviderCallsAllowed, false);
    assert.equal(AI_PROVIDER_GATE.serverProviderCallsAllowed, false);
    assert.equal(AI_PROVIDER_GATE.providerDecisionRequired, true);
    assert.equal(AI_COST_CONTROLS.hardStopUntilProviderApproval, true);
  });

  it("blocks raw audio and transcript retention requests", () => {
    assert.equal(
      evaluateAiPracticeRequest({
        useCase: "pronunciation_drill",
        actor: { ageGroup: "adult" },
        consent: { basis: "explicit" },
        requestedRetention: { rawAudio: true },
      }).reason,
      "raw_audio_storage_not_approved",
    );
    assert.equal(
      evaluateAiPracticeRequest({
        useCase: "conversation_roleplay",
        actor: { ageGroup: "adult" },
        consent: { basis: "explicit" },
        requestedRetention: { rawTranscript: true },
      }).reason,
      "raw_transcript_storage_not_approved",
    );
  });

  it("still blocks safe summary practice until provider decision is approved", () => {
    const result = evaluateAiPracticeRequest({
      useCase: "lesson_review",
      actor: { ageGroup: "adult" },
      consent: { basis: "explicit" },
    });

    assert.equal(result.allowed, false);
    assert.equal(result.reason, "provider_decision_required");
  });

  it("returns a safe plan with blocked reasons instead of launching AI practice", () => {
    const plan = getAiStudyBuddyPlan({
      accountKey: "guardianActive",
      studentCrmContactRef: "crm_contact_fixture_minor_001",
      useCase: "lesson_review",
    });

    assert.equal(plan.practiceAvailable, false);
    assert.equal(plan.blockedReasons.includes("feature_not_approved"), true);
    assert.equal(plan.blockedReasons.includes("provider_decision_required"), true);
    assert.equal(plan.rawAudioStorage, false);
    assert.equal(plan.rawTranscriptStorage, false);
  });

  it("builds CRM-safe AI practice summary events without raw audio or transcript", () => {
    const session = resolvePortalSession("guardianActive");
    const preview = buildAiPracticeCrmSummaryPreview({
      session,
      studentCrmContactRef: "crm_contact_fixture_minor_001",
      useCase: "vocabulary_quiz",
      progressState: "completed",
    });

    assert.equal(preview.accepted, true);
    assert.equal(preview.delivery.crmWrite, false);
    assert.equal(preview.crmTimelinePreview.eventType, "ai_practice_completed");
    assert.equal(preview.event.payload.rawAudioStored, false);
    assert.equal(preview.event.payload.rawTranscriptStored, false);
  });
});
