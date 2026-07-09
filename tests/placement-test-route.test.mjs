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
  quizAnswers: [3, 2, 3, 2],
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
    assert.equal(body.crmWrite, false);
  });

  it("returns advisor handoff and CRM preview for a valid placement submission", async () => {
    const response = await POST(request(validBody));
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.ok, true);
    assert.equal(body.recommendation.key, "advancing");
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
});
