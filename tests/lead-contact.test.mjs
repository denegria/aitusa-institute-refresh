import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildLeadCrmDeliveryEvent,
  buildLeadAdvisorHandoffMessage,
  evaluateLeadContactSubmission,
  validateLeadContactInput,
} from "../src/leads/leadContactModel.js";
import { SMS_DISCLOSURE_VERSION } from "../src/legal/publicLegalContent.js";

const validSubmission = Object.freeze({
  formType: "contact_form",
  submissionId: "fixture-contact-0001",
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
    path: "/contactanos",
    campaign: "fixture-campaign",
  }),
  consent: Object.freeze({
    contactPermission: true,
    marketingSmsOptIn: false,
    marketingSmsEvidence: null,
  }),
  startedAt: "2026-07-09T14:40:00.000Z",
  submittedAt: "2026-07-09T14:40:08.000Z",
});

describe("MIS-266 lead contact model", () => {
  it("validates required lead fields, consent, interest, email, and spam signals", () => {
    const validation = validateLeadContactInput({
      lead: {
        name: "Only Name",
        email: "bad-email",
        interest: "bad-interest",
      },
      consent: { contactPermission: false, marketingSmsOptIn: false },
      honeypot: "filled",
    });

    assert.equal(validation.ok, false);
    assert.equal(validation.status, 400);
    assert.equal(validation.errors.includes("lead_name_required"), false);
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
      sourcePath: "/contactanos",
    });

    assert.match(message, /Fixture Lead/);
    assert.match(message, /\+17325550123/);
    assert.match(message, /ingles-presencial/);
    assert.match(message, /Origen: \/contactanos/);
  });

  it("returns CRM-safe previews for the durable contact intake contract", () => {
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

  it("builds distinct durable CRM events for the full contact and callback forms", () => {
    const contact = buildLeadCrmDeliveryEvent({
      input: validSubmission,
      sourcePath: "/contactanos",
      submittedAt: validSubmission.submittedAt,
    });
    const callback = buildLeadCrmDeliveryEvent({
      input: {
        ...validSubmission,
        formType: "callback_request",
        submissionId: "fixture-callback-0001",
        consent: { contactPermission: true, marketingSmsOptIn: false, marketingSmsEvidence: null },
      },
      sourcePath: "/#contacto",
      submittedAt: validSubmission.submittedAt,
    });

    assert.equal(contact.eventType, "contact_form_submitted");
    assert.equal(contact.consent.sms, false);
    assert.equal(contact.lead.ageGroup, validSubmission.lead.ageGroup);
    assert.equal(contact.lead.message, validSubmission.lead.message);
    assert.equal(callback.eventType, "callback_requested");
    assert.equal(Object.hasOwn(callback.consent, "sms"), false);
    assert.match(callback.idempotencyKey, /fixture-callback-0001/);
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

  it("accepts an optional phone when marketing SMS consent is not selected", () => {
    const response = evaluateLeadContactSubmission({
      ...validSubmission,
      lead: { ...validSubmission.lead, phone: "" },
    });

    assert.equal(response.status, 200);
    assert.equal(response.body.crmPayloadPreview.contactFieldsProvided.phone, false);
    assert.equal(response.body.crmPayloadPreview.consent.marketingSmsOptIn, false);
    assert.equal(response.body.crmPayloadPreview.consent.marketingSmsEvidence, null);
    assert.match(response.body.advisorHandoff.message, /No indicado/);
  });

  it("preserves versioned source and timestamp evidence for explicit SMS opt-in", () => {
    const consentedAt = "2026-07-17T21:00:00.000Z";
    const response = evaluateLeadContactSubmission({
      ...validSubmission,
      submittedAt: consentedAt,
      consent: {
        contactPermission: true,
        marketingSmsOptIn: true,
        marketingSmsEvidence: {
          disclosureVersion: SMS_DISCLOSURE_VERSION,
          sourcePath: "/contactanos",
          consentedAt,
        },
      },
    });

    assert.equal(response.status, 200);
    assert.deepEqual(response.body.crmPayloadPreview.consent.marketingSmsEvidence, {
      disclosureVersion: SMS_DISCLOSURE_VERSION,
      sourcePath: "/contactanos",
      consentedAt,
    });
    assert.equal(response.body.crmSyncPreview.event.payload.marketingSmsOptIn, true);
    assert.equal(
      response.body.crmSyncPreview.event.payload.marketingSmsDisclosureVersion,
      SMS_DISCLOSURE_VERSION,
    );
  });

  it("rejects ambiguous or incomplete SMS consent evidence", () => {
    const noPhone = validateLeadContactInput({
      ...validSubmission,
      lead: { ...validSubmission.lead, phone: "" },
      consent: { contactPermission: true, marketingSmsOptIn: true },
    });
    assert.equal(noPhone.ok, false);
    assert.equal(noPhone.errors.includes("marketing_sms_phone_required"), true);
    assert.equal(noPhone.errors.includes("marketing_sms_evidence_required"), true);

    const evidenceWithoutOptIn = validateLeadContactInput({
      ...validSubmission,
      consent: {
        contactPermission: true,
        marketingSmsOptIn: false,
        marketingSmsEvidence: {
          disclosureVersion: SMS_DISCLOSURE_VERSION,
          sourcePath: "/contactanos",
          consentedAt: "2026-07-17T21:00:00.000Z",
        },
      },
    });
    assert.equal(evidenceWithoutOptIn.ok, false);
    assert.equal(
      evidenceWithoutOptIn.errors.includes("marketing_sms_evidence_without_opt_in"),
      true,
    );
  });
});
