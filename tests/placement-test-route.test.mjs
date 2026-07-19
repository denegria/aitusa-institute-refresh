import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GET, POST } from "../app/api/placement-test/route.js";

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
  quizAnswers: Array(62).fill(1),
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
    assert.equal(body.placementTest.contract.sourceKey, "aitusa-placement-test-v1");
    assert.equal(body.placementTest.quizQuestionCount, 62);
    assert.equal(body.placementTest.source.gradingMode, "automatic_provisional");
    assert.equal(body.placementTest.source.answerKeyStatus, "pending_academic_review");
    assert.equal(body.crmWrite, false);
  });

  it("returns advisor handoff and CRM preview for a valid placement submission", async () => {
    const response = await POST(request(validBody));
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.ok, true);
    assert.equal(body.recommendation.key, "book-3-upper");
    assert.equal(body.scores.quizQuestionCount, 62);
    assert.equal(body.scores.maxScore, 65);
    assert.equal(body.scores.answerKeyStatus, "pending_academic_review");
    assert.equal(body.crmPayloadPreview.crmWrite, false);
    assert.equal(body.crmSyncPreview.crmTimelinePreview.eventType, "placement_completed");
  });

  it("rejects incomplete submissions", async () => {
    const response = await POST(request({ quizAnswers: [] }));
    const body = await response.json();

    assert.equal(response.status, 422);
    assert.equal(body.ok, false);
    assert.equal(body.errors.includes("student_required"), true);
    assert.equal(body.crmWrite, false);
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
