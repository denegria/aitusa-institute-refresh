import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GET, POST } from "../app/api/placement-test/route.js";
import { DIAGNOSTIC_QUESTION_BANK } from "../src/diagnostic/questionBank.server.js";

function request(body) {
  return new Request("http://localhost/api/placement-test", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

const validBody = {
  student: {
    name: "Fixture Student",
    phone: "+17325550123",
    email: "student@example.com",
    city: "Bound Brook",
    ageGroup: "Adulto",
  },
  selfAssessment: {
    speaking: 3,
    listening: 3,
    reading: 2,
    writing: 2,
  },
  selectedAnswers: DIAGNOSTIC_QUESTION_BANK.map((question) => question.correctAnswer),
  goal: "Escuela o universidad",
  consent: {
    advisorHandoff: true,
  },
  submittedAt: "2026-07-09T14:30:00.000Z",
};

describe("MIS-265 placement test route", () => {
  it("returns route config without enabling CRM writes", async () => {
    const response = await GET();
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.ok, true);
    assert.equal(body.placementTest.contract.sourceKey, "aitusa-placement-test-v2-preview");
    assert.equal(body.placementTest.quizQuestionCount, 62);
    assert.equal(body.placementTest.contract.anonymousResultEnabled, true);
    assert.equal(body.placementTest.contract.guardianRequiredUnderAge, 13);
    assert.equal(body.placementTest.source.gradingMode, "automatic_provisional_total");
    assert.equal(body.placementTest.source.answerKeyStatus, "pending_academic_review");
    assert.equal(body.placementTest.source.finalScoringStatus, "blocked_pending_academic_rules");
    assert.equal(body.crmWrite, false);
  });

  it("returns advisor handoff and CRM preview for a valid placement submission", async () => {
    const response = await POST(request(validBody));
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.ok, true);
    assert.equal(body.recommendation.key, "book-3-upper");
    assert.equal(body.scores.quizQuestionCount, 62);
    assert.equal(body.scores.maxScore, 62);
    assert.equal(body.scores.answerKeyStatus, "pending_academic_review");
    assert.equal(body.scores.selfAssessmentAffectsPlacement, false);
    assert.equal(body.crmPayloadPreview.crmWrite, false);
    assert.equal(body.crmSyncPreview.crmTimelinePreview.eventType, "placement_completed");
  });

  it("rejects incomplete submissions", async () => {
    const response = await POST(request({ selectedAnswers: [] }));
    const body = await response.json();

    assert.equal(response.status, 422);
    assert.equal(body.ok, false);
    assert.equal(body.errors.includes("selected_answers_count_invalid"), true);
    assert.equal(body.errors.includes("student_required"), false);
    assert.equal(body.crmWrite, false);
  });

  it("returns an anonymous result without handoff consent", async () => {
    const response = await POST(request({
      ...validBody,
      attemptId: "attempt-route-fixture",
      student: {},
      consent: { advisorHandoff: false },
      selectedAnswers: [
        ...validBody.selectedAnswers.slice(0, 60),
        null,
        null,
      ],
    }));
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.ok, true);
    assert.equal(body.attemptId, "attempt-route-fixture");
    assert.equal(body.scores.skippedQuestionCount, 2);
    assert.equal(body.crmPayloadPreview.consent.advisorHandoff, false);
    assert.equal(body.storageEnabled, false);
  });

  it("rejects malformed request bodies without throwing", async () => {
    for (const bodyValue of [null, { ...validBody, submittedAt: 123 }]) {
      const response = await POST(request(bodyValue));
      const body = await response.json();

      assert.equal(response.status, 422);
      assert.equal(body.ok, false);
      assert.equal(
        body.errors.includes(
          bodyValue === null ? "request_body_invalid" : "submitted_at_invalid",
        ),
        true,
      );
      assert.equal(body.crmWrite, false);
    }
  });
});
