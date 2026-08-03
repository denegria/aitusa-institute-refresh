import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createLeadContactService } from "../src/leads/service.server.js";

function submission(overrides = {}) {
  return {
    formType: "contact_form",
    submissionId: "fixture-service-contact-0001",
    lead: {
      name: "Fixture Lead",
      phone: "+17325550123",
      email: "lead@example.com",
      city: "Bound Brook",
      interest: "ingles-presencial",
      preferredMode: "Presencial",
      preferredSchedule: "Noche",
      message: "Quiero saber horarios.",
    },
    source: { path: "/contactanos" },
    consent: { contactPermission: true, marketingSmsOptIn: false, marketingSmsEvidence: null },
    startedAt: "2026-08-03T19:00:00.000Z",
    submittedAt: "2026-08-03T19:00:10.000Z",
    ...overrides,
  };
}

describe("MIS-221 durable lead contact service", () => {
  it("queues a validated full contact form before returning success", async () => {
    const events = [];
    const service = createLeadContactService({
      repository: { enqueue: async (event) => { events.push(event); return { queued: true, duplicate: false }; } },
    });

    const response = await service.submit(submission());

    assert.equal(response.status, 201);
    assert.equal(response.body.crmQueued, true);
    assert.equal(response.body.storageEnabled, true);
    assert.equal(response.body.decision.destination, "ait_crm_outbox");
    assert.equal(events[0].eventType, "contact_form_submitted");
  });

  it("preserves idempotent duplicate acknowledgement for callback requests", async () => {
    const service = createLeadContactService({
      repository: { enqueue: async () => ({ queued: true, duplicate: true }) },
    });
    const response = await service.submit(submission({
      formType: "callback_request",
      submissionId: "fixture-service-callback-0001",
    }));

    assert.equal(response.status, 202);
    assert.equal(response.body.duplicate, true);
    assert.equal(response.body.crmQueued, true);
  });

  it("never queues an invalid submission", async () => {
    let called = false;
    const service = createLeadContactService({
      repository: { enqueue: async () => { called = true; return { queued: true, duplicate: false }; } },
    });
    const response = await service.submit(submission({ submissionId: "bad", lead: { name: "No contact", interest: "ingles-presencial" } }));

    assert.equal(response.status, 422);
    assert.equal(called, false);
    assert.equal(response.body.errors.includes("submission_id_invalid"), true);
    assert.equal(response.body.errors.includes("lead_contact_method_required"), true);
  });
});
