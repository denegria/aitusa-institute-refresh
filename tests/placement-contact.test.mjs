import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildPlacementContactCrmPayload, validatePlacementContactPreference } from "../src/placementContact/contract.js";
import { validateCrmEventEnvelope } from "../src/crm/eventContract.js";

describe("MIS-397 channel-specific placement contact consent", () => {
  it("keeps email-only save valid without a phone", () => {
    const result = validatePlacementContactPreference({ preferredChannel: "email", verifiedEmail: true, consents: { email: true }, sourceUrl: "https://aitusa.example/placement-test/?email=private" });
    assert.equal(result.ok, true); assert.equal(result.preference.mobile, null); assert.equal(result.preference.sourceUrl, "https://aitusa.example/placement-test/");
  });
  it("requires separately verified E.164 mobile and guardian ownership", () => {
    assert.equal(validatePlacementContactPreference({ preferredChannel: "sms", mobile: "+17323790593", consents: { serviceSms: true } }).ok, false);
    assert.equal(validatePlacementContactPreference({ preferredChannel: "phone", mobile: "+17323790593", verifiedMobile: true, ageBand: "under_13", consents: { phone: true } }).errors.includes("placement_contact_guardian_required"), true);
  });
  it("does not enable outbound WhatsApp and sends CRM only safe consent evidence", () => {
    const invalid = validatePlacementContactPreference({ preferredChannel: "whatsapp", mobile: "+17323790593", verifiedMobile: true, consents: { whatsapp: true } });
    assert.equal(invalid.errors.includes("placement_contact_whatsapp_unavailable"), true);
    const preference = validatePlacementContactPreference({ preferredChannel: "email", verifiedEmail: true, consents: { email: true } }).preference;
    const payload = buildPlacementContactCrmPayload({ reviewId: "00000000-0000-4000-8000-000000000001", resultId: "00000000-0000-4000-8000-000000000002", correlationId: "00000000-0000-4000-8000-000000000003", preference });
    assert.equal(JSON.stringify(payload).includes("rawAnswers"), false);
    const event = validateCrmEventEnvelope({ type: "placement_review_created", idempotencyKey: "placement-review:fixture:0001", occurredAt: "2026-08-20T00:00:00.000Z", actor: { portalAccountId: "opaque-account" }, source: { surface: "staff_tool", path: "/employee/placement-reviews" }, consent: { basis: "contract", policyVersion: preference.disclosureVersion }, payload });
    assert.equal(event.ok, true);
  });
});
