import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertPublicRegistrationSubmission,
  isPricedRegistrationChoice,
  migrateUnsubmittedSpanishDraft,
  needsLegacySpanishDraftReconciliation,
  normalizeRegistrationInput,
  programCodeForContext,
  registrationSelectionForContext,
  safeRegistrationResponse,
} from "../src/registration/contract.js";

describe("MIS-421 public registration contract", () => {
  it("maps only English contexts to the self-service program", () => {
    assert.equal(programCodeForContext("ingles-online-adultos"), "english_program");
    assert.equal(programCodeForContext("ingles-hibrido-adultos"), "english_program");
    assert.equal(programCodeForContext("ged"), "ged");
  });

  it("preserves course-link format and US pricing for every offered course", () => {
    assert.deepEqual(registrationSelectionForContext("ingles-online-adultos"), { programCode: "english_program", learningModality: "online" });
    assert.deepEqual(registrationSelectionForContext("ingles-hibrido-adultos"), { programCode: "english_program", learningModality: "hybrid" });
    assert.deepEqual(registrationSelectionForContext("espanol-extranjeros"), { programCode: "espanol-extranjeros", learningModality: "online" });
    assert.deepEqual(registrationSelectionForContext("ged"), { programCode: "ged", learningModality: "in_person" });
    assert.equal(isPricedRegistrationChoice("english_program", "in_person"), true);
    assert.equal(isPricedRegistrationChoice("english_program", "online"), true);
    assert.equal(isPricedRegistrationChoice("english_program", "hybrid"), true);
    assert.equal(isPricedRegistrationChoice("english_program", "in_person", "CO"), false);
    assert.equal(isPricedRegistrationChoice("english_program", "hybrid", "CO"), false);
    assert.equal(isPricedRegistrationChoice("english_program", "online", "CO"), true);
    assert.equal(isPricedRegistrationChoice("espanol-extranjeros", "online", "US"), true);
    assert.equal(isPricedRegistrationChoice("espanol-extranjeros", "online", "CO"), false);
    assert.equal(isPricedRegistrationChoice("espanol-extranjeros", "in_person", "US"), false);
    for (const course of ["ged", "tutorias-matematicas", "computacion-basica", "computacion-oficina"]) {
      assert.equal(isPricedRegistrationChoice(course, "in_person", "US"), true, course);
      assert.equal(isPricedRegistrationChoice(course, "in_person", "CO"), false, course);
      assert.equal(isPricedRegistrationChoice(course, "online", "US"), false, course);
    }
  });

  it("reconciles old Spanish pickup drafts before replacing a payable checkout key", () => {
    const draft = { entryContext: "general", programCode: "espanol-extranjeros", learningModality: "in_person", idempotencyKey: "public:old-key" };
    assert.equal(needsLegacySpanishDraftReconciliation(draft), true);
    assert.equal(needsLegacySpanishDraftReconciliation({ ...draft, entryContext: "espanol-extranjeros" }), true);
    assert.equal(needsLegacySpanishDraftReconciliation({ ...draft, idempotencyKey: "" }), false);
    assert.equal(needsLegacySpanishDraftReconciliation({ ...draft, learningModality: "online" }), false);
    assert.equal(needsLegacySpanishDraftReconciliation({ ...draft, programCode: "ged" }), false);
    const restored = { programCode: "espanol-extranjeros", learningModality: "online", idempotencyKey: "public:new-random", step: 2 };
    const firstTab = migrateUnsubmittedSpanishDraft(restored, draft);
    const secondTab = migrateUnsubmittedSpanishDraft({ ...restored, idempotencyKey: "public:other-random" }, draft);
    assert.equal(firstTab.idempotencyKey, draft.idempotencyKey);
    assert.equal(secondTab.idempotencyKey, draft.idempotencyKey);
    assert.equal(firstTab.learningModality, "online");
    assert.equal(firstTab.step, 1);
  });

  it("normalizes identities and never accepts browser CRM contact references", () => {
    const input = normalizeRegistrationInput({
      idempotencyKey: "public:fixture-000001",
      residenceCountryCode: "us",
      learningModality: "online",
      separatePayer: true,
      student: { name: " Ana Student ", email: "ANA@EXAMPLE.COM", contactId: "crm-secret" },
      payer: { name: "Paying Parent", phone: "+1 (732) 555-0100", contactId: "crm-payer" },
      shippingAddress: { recipientName: "Ana Student", addressLine1: "1 Main", city: "Bound Brook", state: "nj", postalCode: "08805" },
    });
    assert.deepEqual(input.student, { name: "Ana Student", email: "ana@example.com", phone: "" });
    assert.equal(input.payer.contactId, undefined);
    assert.equal(input.shippingAddress.state, "NJ");
    assert.equal(input.shippingAddress.countryCode, "US");
  });

  it("projects CRM quotes without internal record identifiers", () => {
    const response = safeRegistrationResponse({
      quote: {
        status: "quoted", total: "240.00", currency: "USD",
        lines: [{ code: "bundle", label: "Bundle", amount: "95.00", currency: "USD", chargeId: "secret" }],
        regionalPricing: { region: "latinoamerica", internal: "hidden" },
      },
      fulfillment: { deliveryMode: "digital", requiresDigitalDelivery: true, shippingAddressSnapshot: { addressLine1: "secret" } },
      studentContactId: "secret",
    });
    assert.equal(response.state, "quoted");
    assert.equal(response.quote.lines[0].chargeId, undefined);
    assert.equal(response.fulfillment.shippingAddressSnapshot, undefined);
    assert.doesNotMatch(JSON.stringify(response), /studentContactId|addressLine1|chargeId/);
  });

  it("rejects bot-field and implausible checkout timing before CRM writes", () => {
    assert.doesNotThrow(() => assertPublicRegistrationSubmission({ website: "", startedAt: 1_000 }, 3_000));
    assert.throws(() => assertPublicRegistrationSubmission({ website: "https://spam.example", startedAt: 1_000 }, 3_000),
      (error) => error.code === "registration_request_rejected");
    assert.throws(() => assertPublicRegistrationSubmission({ website: "", startedAt: 2_900 }, 3_000),
      (error) => error.code === "registration_session_invalid");
  });
});
