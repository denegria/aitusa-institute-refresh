import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { POST } from "../app/api/portal/events/route.js";

function request(body) {
  return new Request("http://localhost/api/portal/events", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

function validPortalEvent(overrides = {}) {
  return {
    type: "portal_sign_in",
    idempotencyKey: "portal:sign-in:fixture-001",
    occurredAt: "2026-07-09T00:00:00.000Z",
    actor: {
      crmContactRef: "crm_contact_fixture_student_001",
      portalAccountId: "acct_fixture_student_active",
      role: "student",
    },
    source: {
      surface: "portal",
      path: "/portal",
    },
    consent: {
      basis: "contract",
      policyVersion: "fixture-v1",
    },
    payload: {
      summary: "Student signed in to portal fixture.",
    },
    ...overrides,
  };
}

describe("MIS-277 CRM event route handler", () => {
  it("accepts a valid event without writing to CRM", async () => {
    const response = await POST(request(validPortalEvent()));
    const body = await response.json();

    assert.equal(response.status, 202);
    assert.equal(body.accepted, true);
    assert.equal(body.delivery.crmWrite, false);
    assert.equal(body.crmTimelinePreview.eventType, "portal_sign_in");
  });

  it("rejects sensitive payload fields", async () => {
    const response = await POST(
      request(
        validPortalEvent({
          type: "ai_practice_completed",
          idempotencyKey: "portal:ai-practice:fixture-002",
          payload: {
            topic: "Pronunciation",
            rawAudio: "base64-audio-must-not-be-accepted",
          },
        }),
      ),
    );
    const body = await response.json();

    assert.equal(response.status, 422);
    assert.equal(body.accepted, false);
    assert.equal(body.crmWrite, false);
    assert.equal(body.errors.includes("sensitive_payload_field:rawAudio"), true);
  });

  it("rejects invalid JSON", async () => {
    const response = await POST(
      new Request("http://localhost/api/portal/events", {
        method: "POST",
        body: "{not-json",
      }),
    );
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.errors.includes("invalid_json"), true);
  });
});
