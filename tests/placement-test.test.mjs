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
  it("validates required student, score, goal, and handoff consent fields", () => {
    const validation = validatePlacementInput({
      student: { name: "Only Name" },
      selfAssessment: { speaking: 4 },
      quizAnswers: [1],
      goal: "",
      consent: { advisorHandoff: false },
    });

    assert.equal(validation.ok, false);
    assert.equal(validation.errors.includes("student_phone_required"), true);
    assert.equal(validation.errors.includes("self_assessment_speaking_invalid"), true);
    assert.equal(validation.errors.includes("quiz_answers_count_invalid"), true);
    assert.equal(validation.errors.includes("goal_required"), true);
    assert.equal(validation.errors.includes("advisor_handoff_consent_required"), true);
  });

  it("scores the full source-backed placement questionnaire as provisional", () => {
    const score = calculatePlacementScore(validSubmission);

    assert.equal(score.quizScore, 38);
    assert.equal(score.quizQuestionCount, 62);
    assert.equal(score.selfAssessmentScore, 6);
    assert.equal(score.selfAssessmentAverage, 2);
    assert.equal(score.totalScore, 40);
    assert.equal(score.maxScore, 65);
    assert.equal(score.gradingMode, "automatic_provisional");
    assert.equal(score.answerKeyStatus, "pending_academic_review");
    assert.equal(selectPlacementRecommendation(score.totalScore).key, "book-2-upper");
  });

  it("builds advisor WhatsApp handoff and CRM-safe preview without storing data", () => {
    const response = evaluatePlacementTestSubmission(validSubmission);

    assert.equal(response.status, 200);
    assert.equal(response.body.ok, true);
    assert.equal(response.body.recommendation.key, "book-2-upper");
    assert.equal(response.body.advisorHandoff.href.startsWith("https://wa.me/"), true);
    assert.match(response.body.advisorHandoff.message, /Fixture Student/);
    assert.equal(response.body.crmPayloadPreview.sourceKey, "aitusa-placement-test-v1");
    assert.equal(response.body.crmPayloadPreview.crmWrite, false);
    assert.equal(response.body.crmPayloadPreview.storageEnabled, false);
    assert.equal(response.body.crmPayloadPreview.placement.quizQuestionCount, 62);
    assert.equal(response.body.crmPayloadPreview.placement.gradingMode, "automatic_provisional");
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
    assert.equal(payload.sourceKey, "aitusa-placement-test-v1");
    assert.equal(payload.gradingMode, "automatic_provisional");
    assert.equal(payload.answerKeyStatus, "pending_academic_review");
    assert.equal(JSON.stringify(payload).includes("+17325550123"), false);
    assert.equal(JSON.stringify(payload).includes("student@example.com"), false);
  });
});
