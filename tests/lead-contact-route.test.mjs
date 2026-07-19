import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GET, POST } from "../app/api/leads/contact/route.js";

function request(body) {
  return new Request("http://localhost/api/leads/contact", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

const validBody = {
  lead: {
    name: "Fixture Lead",
    phone: "+17325550123",
    email: "lead@example.com",
    city: "Bound Brook",
    interest: "ingles-hibrido",
    preferredMode: "Hibrido",
    preferredSchedule: "Sabado",
    ageGroup: "Adulto",
    message: "Quiero comparar niveles y horarios.",
  },
  source: {
    path: "/courses",
  },
  consent: {
    contactPermission: true,
    marketingSmsOptIn: false,
    marketingSmsEvidence: null,
  },
  startedAt: "2026-07-09T14:40:00.000Z",
  submittedAt: "2026-07-09T14:40:10.000Z",
};

describe("MIS-266 lead contact route", () => {
  it("returns route config without enabling CRM writes", async () => {
    const response = await GET();
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.ok, true);
    assert.equal(body.leadContact.contract.sourceKey, "aitusa-website-lead-v1");
    assert.equal(body.leadContact.requiredFields.includes("phone"), false);
    assert.match(body.leadContact.consentCopy.marketingSmsDisclosure, /STOP/);
    assert.equal(body.crmWrite, false);
  });

  it("returns advisor handoff and CRM preview for a valid lead submission", async () => {
    const response = await POST(request(validBody));
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.ok, true);
    assert.equal(body.crmPayloadPreview.crmWrite, false);
    assert.equal(body.crmSyncPreview.crmTimelinePreview.eventType, "lead_form_submitted");
    assert.equal(body.storageEnabled, false);
  });

  it("rejects incomplete submissions", async () => {
    const response = await POST(
      request({ lead: {}, consent: { marketingSmsOptIn: false } }),
    );
    const body = await response.json();

    assert.equal(response.status, 422);
    assert.equal(body.ok, false);
    assert.equal(body.errors.includes("lead_name_required"), true);
    assert.equal(body.errors.includes("contact_permission_consent_required"), true);
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
      assert.equal(body.storageEnabled, false);
    }
  });

  it("rejects honeypot spam submissions without CRM writes", async () => {
    const response = await POST(
      request({
        ...validBody,
        honeypot: "bot-site",
      }),
    );
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.ok, false);
    assert.equal(body.errors.includes("spam_signal_detected"), true);
    assert.equal(body.storageEnabled, false);
  });

  it("accepts an unchecked SMS box without requiring a phone", async () => {
    const response = await POST(
      request({
        ...validBody,
        lead: { ...validBody.lead, phone: "" },
      }),
    );
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.crmPayloadPreview.contactFieldsProvided.phone, false);
    assert.equal(body.crmPayloadPreview.consent.marketingSmsOptIn, false);
  });
});
