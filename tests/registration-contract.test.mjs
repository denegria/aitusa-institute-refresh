import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertPublicRegistrationSubmission,
  normalizeRegistrationInput,
  programCodeForContext,
  safeRegistrationResponse,
} from "../src/registration/contract.js";

describe("MIS-421 public registration contract", () => {
  it("maps only English contexts to the self-service program", () => {
    assert.equal(programCodeForContext("ingles-online-adultos"), "english_program");
    assert.equal(programCodeForContext("ingles-hibrido-adultos"), "english_program");
    assert.equal(programCodeForContext("ged"), "ged");
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
