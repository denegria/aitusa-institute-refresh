import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  calculatePlacementScore,
  evaluatePlacementTestSubmission,
  selectPlacementRecommendation,
  validatePlacementInput,
} from "../src/placement/placementTestModel.js";

const validSubmission = Object.freeze({
  student: Object.freeze({
    name: "Fixture Student",
    phone: "+17325550123",
    email: "student@example.com",
    city: "Bound Brook",
    ageGroup: "Adulto",
  }),
  selfAssessment: Object.freeze({
    speaking: 2,
    listening: 2,
    reading: 1,
    writing: 1,
  }),
  quizAnswers: Object.freeze([
    ...Array(38).fill(1),
    ...Array(24).fill(0),
  ]),
  goal: "Trabajo y entrevistas",
  consent: Object.freeze({
    advisorHandoff: true,
  }),
  submittedAt: "2026-07-09T14:30:00.000Z",
});

describe("MIS-265 placement test model", () => {
  it("validates score and goal while allowing an anonymous result", () => {
    const validation = validatePlacementInput({
      selfAssessment: { speaking: 4 },
      quizAnswers: [1],
      goal: "",
      consent: { advisorHandoff: false },
    });

    assert.equal(validation.ok, false);
    assert.equal(validation.errors.includes("self_assessment_speaking_invalid"), true);
    assert.equal(validation.errors.includes("quiz_answers_count_invalid"), true);
    assert.equal(validation.errors.includes("goal_required"), true);
    assert.equal(validation.errors.includes("student_required"), false);
    assert.equal(validation.errors.includes("advisor_handoff_consent_required"), false);
  });

  it("scores only graded answers and keeps self-assessment outside placement", () => {
    const score = calculatePlacementScore(validSubmission);

    assert.equal(score.quizScore, 38);
    assert.equal(score.quizQuestionCount, 62);
    assert.equal(score.selfAssessmentScore, 6);
    assert.equal(score.selfAssessmentAverage, 2);
    assert.equal(score.selfAssessmentAffectsPlacement, false);
    assert.equal(score.totalScore, 38);
    assert.equal(score.maxScore, 62);
    assert.equal(score.gradingMode, "automatic_provisional_total");
    assert.equal(score.answerKeyStatus, "pending_academic_review");
    assert.equal(score.finalScoringModel, "highest_validated_level_block_passed");
    assert.equal(score.finalScoringStatus, "blocked_pending_academic_rules");
    assert.equal(score.blockScores.length, 6);
    assert.equal(selectPlacementRecommendation(score.totalScore).key, "book-2-upper");
  });

  it("returns a useful anonymous result before contact capture", () => {
    const response = evaluatePlacementTestSubmission({
      ...validSubmission,
      attemptId: "attempt-fixture-001",
      student: {},
      consent: { advisorHandoff: false },
      skippedQuestionIndexes: [61],
    });

    assert.equal(response.status, 200);
    assert.equal(response.body.ok, true);
    assert.equal(response.body.attemptId, "attempt-fixture-001");
    assert.equal(response.body.scores.answeredQuestionCount, 61);
    assert.equal(response.body.scores.skippedQuestionCount, 1);
    assert.equal(response.body.resultStatus.certifiedAssessment, false);
    assert.equal(response.body.crmWrite, false);
    assert.equal(response.body.storageEnabled, false);
    assert.deepEqual(response.body.crmPayloadPreview.contactFieldsProvided, {
      name: false,
      phone: false,
      email: false,
      city: false,
      ageGroup: false,
    });
    assert.equal(response.body.crmPayloadPreview.consent.advisorHandoff, false);
  });

  it("builds advisor WhatsApp handoff and CRM-safe preview without storing data", () => {
    const response = evaluatePlacementTestSubmission(validSubmission);

    assert.equal(response.status, 200);
    assert.equal(response.body.ok, true);
    assert.equal(response.body.recommendation.key, "book-2-upper");
    assert.equal(response.body.advisorHandoff.href.startsWith("https://wa.me/"), true);
    assert.match(response.body.advisorHandoff.message, /Fixture Student/);
    assert.equal(response.body.crmPayloadPreview.sourceKey, "aitusa-placement-test-v2-preview");
    assert.equal(response.body.crmPayloadPreview.crmWrite, false);
    assert.equal(response.body.crmPayloadPreview.storageEnabled, false);
    assert.equal(response.body.crmPayloadPreview.placement.quizQuestionCount, 62);
    assert.equal(response.body.crmPayloadPreview.placement.gradingMode, "automatic_provisional_total");
    assert.equal(response.body.crmPayloadPreview.placement.answerKeyStatus, "pending_academic_review");
    assert.deepEqual(response.body.crmPayloadPreview.contactFieldsProvided, {
      name: true,
      phone: true,
      email: true,
      city: true,
      ageGroup: true,
    });
  });

  it("keeps CRM event preview free of raw phone and email values", () => {
    const response = evaluatePlacementTestSubmission(validSubmission);
    const payload = response.body.crmSyncPreview.event.payload;

    assert.equal(response.body.crmSyncPreview.accepted, true);
    assert.equal(response.body.crmSyncPreview.delivery.crmWrite, false);
    assert.equal(payload.sourceKey, "aitusa-placement-test-v2-preview");
    assert.equal(payload.gradingMode, "automatic_provisional_total");
    assert.equal(payload.answerKeyStatus, "pending_academic_review");
    assert.equal(JSON.stringify(payload).includes("+17325550123"), false);
    assert.equal(JSON.stringify(payload).includes("student@example.com"), false);
  });

  it("keeps placement phone optional and explicitly outside marketing SMS opt-in", () => {
    const response = evaluatePlacementTestSubmission({
      ...validSubmission,
      student: { ...validSubmission.student, phone: "" },
    });

    assert.equal(response.status, 200);
    assert.equal(response.body.crmPayloadPreview.contactFieldsProvided.phone, false);
    assert.equal(response.body.crmPayloadPreview.consent.marketingSmsOptIn, false);
    assert.equal(
      response.body.crmPayloadPreview.consent.marketingSmsSource,
      "not_collected_on_placement_test",
    );
    assert.equal(response.body.advisorHandoff.message.includes("WhatsApp/telefono:"), false);
  });
});
