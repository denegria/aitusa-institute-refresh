import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CRM_EVENT_TYPE_NAMES,
  buildCrmEventResponse,
  toCrmTimelineSummary,
  validateCrmEventEnvelope,
} from "../src/crm/eventContract.js";

const REQUIRED_ACCEPTANCE_TYPES = [
  "lead_form_submitted",
  "placement_started",
  "placement_completed",
  "whatsapp_cta_clicked",
  "portal_sign_in",
  "lesson_viewed",
  "lesson_completed",
  "ai_practice_started",
  "ai_practice_completed",
  "attendance_scan",
  "payment_started",
  "payment_completed",
  "payment_failed",
  "profile_updated",
];

function event(overrides = {}) {
  return {
    type: "whatsapp_cta_clicked",
    idempotencyKey: "public:whatsapp:fixture-001",
    occurredAt: "2026-07-09T00:00:00.000Z",
    actor: {
      anonymousId: "anon_fixture_001",
    },
    source: {
      surface: "public_site",
      path: "/",
      campaign: "fixture",
    },
    consent: {
      basis: "legitimate_interest",
      policyVersion: "fixture-v1",
    },
    payload: {
      summary: "Clicked WhatsApp CTA from homepage hero.",
    },
    ...overrides,
  };
}

describe("MIS-277 CRM event contract", () => {
  it("covers the required event taxonomy", () => {
    for (const type of REQUIRED_ACCEPTANCE_TYPES) {
      assert.equal(
        CRM_EVENT_TYPE_NAMES.includes(type),
        true,
        `missing required event type ${type}`,
      );
    }
  });

  it("accepts a safe public-site event envelope", () => {
    const result = validateCrmEventEnvelope(event());

    assert.equal(result.ok, true);
    assert.equal(result.event.type, "whatsapp_cta_clicked");
    assert.equal(result.event.source.surface, "public_site");
    assert.equal(result.event.payload.summary, "Clicked WhatsApp CTA from homepage hero.");
  });

  it("returns a local stub response without CRM writes", () => {
    const result = buildCrmEventResponse(event());

    assert.equal(result.status, 202);
    assert.equal(result.body.accepted, true);
    assert.equal(result.body.delivery.crmWrite, false);
    assert.equal(result.body.delivery.mode, "local_contract_stub");
  });

  it("rejects unsupported event types and missing idempotency keys", () => {
    const result = validateCrmEventEnvelope(
      event({ type: "raw_crm_note", idempotencyKey: "" }),
    );

    assert.equal(result.ok, false);
    assert.equal(result.errors.includes("unsupported_event_type"), true);
    assert.equal(result.errors.includes("idempotency_key_required"), true);
  });

  it("rejects raw transcripts and audio before MIS-279 approval", () => {
    const result = validateCrmEventEnvelope(
      event({
        type: "ai_practice_completed",
        idempotencyKey: "portal:ai-practice:fixture-001",
        actor: {
          crmContactRef: "crm_contact_fixture_student_001",
          portalAccountId: "acct_fixture_student_active",
        },
        source: {
          surface: "portal",
          path: "/portal",
        },
        consent: {
          basis: "explicit",
          policyVersion: "fixture-v1",
        },
        payload: {
          topic: "Job interview",
          score: 82,
          transcript: "raw transcript must not be accepted",
        },
      }),
    );

    assert.equal(result.ok, false);
    assert.equal(result.errors.includes("sensitive_payload_field:transcript"), true);
  });

  it("builds a safe CRM timeline summary", () => {
    const validation = validateCrmEventEnvelope(event());
    const summary = toCrmTimelineSummary(validation.event);

    assert.equal(summary.eventType, "whatsapp_cta_clicked");
    assert.equal(summary.crmContactRef, null);
    assert.equal(summary.crmEffect, "timeline_entry");
    assert.equal(summary.summary, "Clicked WhatsApp CTA from homepage hero.");
  });
});
