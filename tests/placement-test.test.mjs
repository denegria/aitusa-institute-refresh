import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  calculatePlacementScore,
  evaluatePlacementTestSubmission,
  PLACEMENT_LEVEL_BLOCKS,
  selectPlacementRecommendation,
  validatePlacementInput,
} from "../src/placement/placementTestModel.js";
import { DIAGNOSTIC_QUESTION_BANK } from "../src/diagnostic/questionBank.server.js";

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
  selectedAnswers: Object.freeze(
    DIAGNOSTIC_QUESTION_BANK.map((question, index) =>
      index < 38 ? question.correctAnswer : question.options.find(
        (option) => option !== question.correctAnswer,
      )),
  ),
  goal: "Trabajo y entrevistas",
  consent: Object.freeze({
    advisorHandoff: true,
  }),
  submittedAt: "2026-07-09T14:30:00.000Z",
});

function quizAnswersForBlockScores(correctCounts) {
  return PLACEMENT_LEVEL_BLOCKS.flatMap((block, blockIndex) =>
    Array.from(
      { length: block.count },
      (_, questionIndex) => Number(questionIndex < correctCounts[blockIndex]),
    ));
}

describe("MIS-265 placement test model", () => {
  it("validates score and goal while allowing an anonymous result", () => {
    const validation = validatePlacementInput({
      selfAssessment: { speaking: 4 },
      selectedAnswers: ["invalid"],
      goal: "",
      consent: { advisorHandoff: false },
    });

    assert.equal(validation.ok, false);
    assert.equal(validation.errors.includes("self_assessment_speaking_invalid"), true);
    assert.equal(validation.errors.includes("selected_answers_count_invalid"), true);
    assert.equal(validation.errors.includes("goal_required"), true);
    assert.equal(validation.errors.includes("student_required"), false);
    assert.equal(validation.errors.includes("advisor_handoff_consent_required"), false);
  });

  it("uses consecutive 70% block mastery and keeps self-assessment outside placement", () => {
    const score = calculatePlacementScore({
      ...validSubmission,
      quizAnswers: [...Array(38).fill(1), ...Array(24).fill(0)],
      skippedQuestionIndexes: [],
    });

    assert.equal(score.quizScore, 38);
    assert.equal(score.quizQuestionCount, 62);
    assert.equal(score.selfAssessmentScore, 6);
    assert.equal(score.selfAssessmentAverage, 2);
    assert.equal(score.selfAssessmentAffectsPlacement, false);
    assert.equal(score.totalScore, 38);
    assert.equal(score.maxScore, 62);
    assert.equal(score.gradingMode, "automatic_consecutive_block_mastery");
    assert.equal(score.answerKeyStatus, "approved");
    assert.equal(score.finalScoringModel, "next_level_after_consecutive_block_mastery");
    assert.equal(score.finalScoringStatus, "validated");
    assert.equal(score.blockScores.length, 6);
    assert.deepEqual(score.blockScores.map((block) => block.passCount), [9, 10, 7, 5, 6, 9]);
    assert.equal(score.consecutivePassedBlockCount, 3);
    assert.equal(score.highestValidatedBlockKey, "level-3");
    assert.equal(selectPlacementRecommendation(score).key, "book-2-upper");
    assert.equal(score.writingAffectsPlacement, false);
    assert.equal(score.writingReviewMode, "advisor_only");
  });

  it("places into the next class after the highest consecutive block passed", () => {
    const score = calculatePlacementScore({
      ...validSubmission,
      quizAnswers: quizAnswersForBlockScores([9, 8, 10, 7, 8, 12]),
      skippedQuestionIndexes: [],
    });

    assert.equal(score.blockScores[0].passStatus, "passed");
    assert.equal(score.blockScores[1].passStatus, "not_passed");
    assert.equal(score.blockScores[2].passStatus, "passed");
    assert.equal(score.blockScores[2].countsTowardPlacement, false);
    assert.equal(score.consecutivePassedBlockCount, 1);
    assert.equal(score.highestValidatedBlockKey, "level-1");
    assert.equal(selectPlacementRecommendation(score).level, "Nivel 2 / Book 1 alto");
  });

  it("flags exactly one question below a block threshold for advisor review", () => {
    const score = calculatePlacementScore({
      ...validSubmission,
      quizAnswers: quizAnswersForBlockScores([9, 9, 10, 7, 8, 12]),
      skippedQuestionIndexes: [],
    });

    assert.equal(score.blockScores[1].passCount, 10);
    assert.equal(score.blockScores[1].borderlineCount, 9);
    assert.equal(score.blockScores[1].passStatus, "borderline");
    assert.equal(score.consecutivePassedBlockCount, 1);
    assert.equal(score.borderlineReviewRequired, true);
    assert.equal(score.advisorReviewRequired, true);
    assert.equal(score.finalScoringStatus, "borderline");
    assert.equal(selectPlacementRecommendation(score).level, "Nivel 2 / Book 1 alto");

    const response = evaluatePlacementTestSubmission({
      ...validSubmission,
      selectedAnswers: PLACEMENT_LEVEL_BLOCKS.flatMap((block, blockIndex) =>
        DIAGNOSTIC_QUESTION_BANK
          .slice(block.start, block.start + block.count)
          .map((question, questionIndex) =>
            questionIndex < [9, 9, 10, 7, 8, 12][blockIndex]
              ? question.correctAnswer
              : question.options.find((option) => option !== question.correctAnswer)),
      ),
    });
    assert.match(response.body.advisorHandoff.message, /a una respuesta del siguiente nivel/i);
  });

  it("caps an all-block pass at Level 6 and requires advanced advisor review", () => {
    const score = calculatePlacementScore({
      ...validSubmission,
      quizAnswers: quizAnswersForBlockScores([12, 13, 10, 7, 8, 12]),
      skippedQuestionIndexes: [],
    });

    assert.equal(score.consecutivePassedBlockCount, 6);
    assert.equal(score.placementReason, "advanced_cap_reached");
    assert.equal(score.finalScoringStatus, "advisor_review");
    assert.equal(score.advisorReviewRequired, true);
    assert.equal(selectPlacementRecommendation(score).level, "Nivel 6 / Book 3 alto");
  });

  it("uses the normalized client answer-key decisions without exposing the key publicly", () => {
    const expected = new Map([
      [37, "through"],
      [50, "flown"],
      [51, "had already begun"],
      [52, "to bite"],
      [58, "have given"],
    ]);

    for (const [questionNumber, correctAnswer] of expected) {
      const question = DIAGNOSTIC_QUESTION_BANK[questionNumber - 1];
      assert.equal(question.correctAnswer, correctAnswer);
      assert.equal(question.options.includes(correctAnswer), true);
    }
  });

  it("returns a useful anonymous result before contact capture", () => {
    const response = evaluatePlacementTestSubmission({
      ...validSubmission,
      attemptId: "attempt-fixture-001",
      student: {},
      consent: { advisorHandoff: false },
      selectedAnswers: [...validSubmission.selectedAnswers.slice(0, 61), null],
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
    assert.equal(response.body.crmPayloadPreview.placement.gradingMode, "automatic_consecutive_block_mastery");
    assert.equal(response.body.crmPayloadPreview.placement.answerKeyStatus, "approved");
    assert.equal(response.body.crmPayloadPreview.placement.consecutivePassedBlockCount, 3);
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
    assert.equal(payload.gradingMode, "automatic_consecutive_block_mastery");
    assert.equal(payload.answerKeyStatus, "approved");
    assert.equal(payload.writingReviewMode, "advisor_only");
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
