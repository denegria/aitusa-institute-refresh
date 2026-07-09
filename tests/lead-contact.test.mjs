import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildLeadAdvisorHandoffMessage,
  evaluateLeadContactSubmission,
  validateLeadContactInput,
} from "../src/leads/leadContactModel.js";

const validSubmission = Object.freeze({
  lead: Object.freeze({
    name: "Fixture Lead",
    phone: "+17325550123",
    email: "lead@example.com",
    city: "Bound Brook",
    interest: "ingles-presencial",
    preferredMode: "Presencial",
    preferredSchedule: "Noche",
    ageGroup: "Adulto",
    message: "Quiero saber horarios para empezar.",
  }),
  source: Object.freeze({
    path: "/#contacto",
    campaign: "fixture-campaign",
  }),
  consent: Object.freeze({
    contactPermission: true,
    marketingSmsOptIn: false,
  }),
  startedAt: "2026-07-09T14:40:00.000Z",
  submittedAt: "2026-07-09T14:40:08.000Z",
});

describe("MIS-266 lead contact model", () => {
  it("validates required lead fields, consent, interest, email, and spam signals", () => {
    const validation = validateLeadContactInput({
      lead: {
        name: "Only Name",
        phone: "",
        email: "bad-email",
        interest: "bad-interest",
      },
      consent: { contactPermission: false },
      honeypot: "filled",
    });

    assert.equal(validation.ok, false);
    assert.equal(validation.status, 400);
    assert.equal(validation.errors.includes("lead_phone_required"), true);
    assert.equal(validation.errors.includes("lead_interest_invalid"), true);
    assert.equal(validation.errors.includes("lead_email_invalid"), true);
    assert.equal(
      validation.errors.includes("contact_permission_consent_required"),
      true,
    );
    assert.equal(validation.errors.includes("spam_signal_detected"), true);
  });

  it("builds a WhatsApp advisor handoff with the submitted contact context", () => {
    const message = buildLeadAdvisorHandoffMessage({
      lead: validSubmission.lead,
      sourcePath: "/#contacto",
    });

    assert.match(message, /Fixture Lead/);
    assert.match(message, /\+17325550123/);
    assert.match(message, /ingles-presencial/);
    assert.match(message, /Origen: \/#contacto/);
  });

  it("returns CRM-safe previews while keeping writes and storage disabled", () => {
    const response = evaluateLeadContactSubmission(validSubmission);

    assert.equal(response.status, 200);
    assert.equal(response.body.ok, true);
    assert.equal(response.body.decision.destination, "ait_crm_pending_endpoint");
    assert.equal(response.body.decision.fallback, "whatsapp_advisor");
    assert.equal(response.body.decision.wixForms, "not_target_for_refresh_repo");
    assert.equal(response.body.crmPayloadPreview.sourceKey, "aitusa-website-lead-v1");
    assert.equal(response.body.crmPayloadPreview.crmWrite, false);
    assert.equal(response.body.crmPayloadPreview.storageEnabled, false);
    assert.equal(response.body.crmSyncPreview.event.type, "lead_form_submitted");
    assert.equal(response.body.crmSyncPreview.delivery.crmWrite, false);
  });

  it("keeps raw phone, email, and message text out of the CRM event payload", () => {
    const response = evaluateLeadContactSubmission(validSubmission);
    const payload = response.body.crmSyncPreview.event.payload;

    assert.equal(JSON.stringify(payload).includes("+17325550123"), false);
    assert.equal(JSON.stringify(payload).includes("lead@example.com"), false);
    assert.equal(
      JSON.stringify(payload).includes("Quiero saber horarios para empezar."),
      false,
    );
    assert.deepEqual(payload.contactFieldsProvided, {
      name: true,
      phone: true,
      email: true,
      city: true,
      ageGroup: true,
    });
    assert.equal(payload.messageProvided, true);
  });
});
