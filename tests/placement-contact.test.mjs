import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildPlacementContactCrmPayload, validatePlacementContactPreference, WHATSAPP_OUTBOUND_ENABLED } from "../src/placementContact/contract.js";
import { validateCrmEventEnvelope } from "../src/crm/eventContract.js";

describe("MIS-397 channel-specific placement contact consent", () => {
  it("keeps email-only save valid without a phone", () => {
    const result = validatePlacementContactPreference({ preferredChannel: "email", verifiedEmail: true, consents: { email: true }, sourceUrl: "https://aitusa.example/placement-test/?email=private" });
    assert.equal(result.ok, true); assert.equal(result.preference.mobile, null); assert.equal(result.preference.sourceUrl, "/placement-test/");
  });
  it("stores an unverified contact number while keeping verification false", () => {
    const result = validatePlacementContactPreference({ preferredChannel: "sms", mobile: "(732) 379-0593", consents: { serviceSms: true } });
    assert.equal(result.ok, true);
    assert.equal(result.preference.mobile, "+17323790593");
    assert.equal(result.preference.verifiedMobile, false);
    assert.equal(validatePlacementContactPreference({ preferredChannel: "phone", mobile: "+17323790593", ageBand: "under_13", consents: { phone: true } }).errors.includes("placement_contact_guardian_required"), true);
  });
  it("rejects verified-without-mobile while allowing valid verified and unverified numbers", () => {
    const satisfiesConstraint = (mobile, verified) =>
      (mobile === null && verified === false) ||
      (mobile !== null && /^\+[1-9][0-9]{7,14}$/.test(mobile));
    assert.deepEqual(
      [
        [null, false],
        [null, true],
        ["+12025550147", false],
        ["+12025550147", true],
        ["12025550147", false],
      ].map(([mobile, verified]) => satisfiesConstraint(mobile, verified)),
      [true, false, true, true, false],
    );
  });
  it("records manual WhatsApp preference without enabling automated outbound", () => {
    const whatsapp = validatePlacementContactPreference({ preferredChannel: "whatsapp", mobile: "+17323790593", consents: { whatsapp: true } });
    assert.equal(whatsapp.ok, true);
    assert.equal(whatsapp.preference.verifiedMobile, false);
    assert.equal(whatsapp.preference.consents.whatsapp, true);
    assert.equal(whatsapp.preference.consents.marketingSms, false);
    assert.equal(WHATSAPP_OUTBOUND_ENABLED, false);
    const preference = validatePlacementContactPreference({ preferredChannel: "email", verifiedEmail: true, consents: { email: true } }).preference;
    const payload = buildPlacementContactCrmPayload({ reviewId: "00000000-0000-4000-8000-000000000001", resultId: "00000000-0000-4000-8000-000000000002", correlationId: "00000000-0000-4000-8000-000000000003", preference });
    assert.equal(JSON.stringify(payload).includes("rawAnswers"), false);
    const event = validateCrmEventEnvelope({ type: "placement_review_created", idempotencyKey: "placement-review:fixture:0001", occurredAt: "2026-08-20T00:00:00.000Z", actor: { portalAccountId: "opaque-account" }, source: { surface: "staff_tool", path: "/employee/placement-reviews" }, consent: { basis: "contract", policyVersion: preference.disclosureVersion }, payload });
    assert.equal(event.ok, true);
  });
  it("ships an additive constraint that permits valid unverified contact numbers", async () => {
    const fs = await import("node:fs/promises");
    const migration = await fs.readFile(new URL("../drizzle/0008_unverified_contact_numbers.sql", import.meta.url), "utf8");
    const normalization = await fs.readFile(new URL("../drizzle/0009_normalize_contact_mobile_regex.sql", import.meta.url), "utf8");
    const verificationGuard = await fs.readFile(new URL("../drizzle/0010_require_mobile_for_verification.sql", import.meta.url), "utf8");
    const route = await fs.readFile(new URL("../app/api/portal/placement-contact-preferences/route.js", import.meta.url), "utf8");
    const saver = await fs.readFile(new URL("../src/placementContact/save.server.js", import.meta.url), "utf8");
    assert.match(migration, /DROP CONSTRAINT IF EXISTS "placement_contact_preferences_mobile_check"/);
    assert.match(migration, /or "mobile_e164" ~ '\^\\\\\+\[1-9\]/);
    assert.doesNotMatch(migration, /"verified_mobile" = true/);
    assert.match(normalization, /DROP CONSTRAINT IF EXISTS "placement_contact_preferences_mobile_check"/);
    assert.equal(normalization.includes("$regex$^\\+[1-9][0-9]{7,14}$$regex$"), true);
    assert.doesNotMatch(normalization, /"verified_mobile" = true/);
    assert.match(verificationGuard, /"mobile_e164" is not null/);
    assert.equal(verificationGuard.includes("$regex$^\\+[1-9][0-9]{7,14}$$regex$"), true);
    assert.doesNotMatch(verificationGuard, /"verified_mobile" = true/);
    assert.match(saver, /verifiedMobile: false/);
    assert.doesNotMatch(saver, /input\.verifiedMobile/);
  });
  it("records independent WhatsApp consent and a privacy-safe replacement audit", async () => {
    const fs = await import("node:fs/promises");
    const source = await fs.readFile(new URL("../src/placementContact/neonRepository.server.js", import.meta.url), "utf8");
    const migration = await fs.readFile(new URL("../drizzle/0006_placement_review_and_preferences.sql", import.meta.url), "utf8");
    assert.match(source, /'whatsapp_contact'/);
    assert.match(source, /placement_contact_change_audits/);
    assert.match(source, /'advisor_handoff_requested'/);
    assert.match(source, /'communicationPreference'/);
    assert.match(source, /'verifiedMobile'/);
    assert.match(source, /'marketingSms', false/);
    assert.match(source, /\$\{preference\.consents\.email\}::boolean/);
    assert.match(source, /\$\{preference\.consents\.serviceSms\}::boolean/);
    assert.match(source, /\$\{preference\.consents\.marketingSms\}::boolean/);
    assert.match(source, /\$\{preference\.consents\.phone\}::boolean/);
    assert.match(source, /\$\{preference\.consents\.whatsapp\}::boolean/);
    assert.match(source, /\$\{preference\.verifiedEmail\}::boolean/);
    assert.match(source, /\$\{preference\.verifiedMobile\}::boolean/);
    assert.match(source, /'phone', \$\{preference\.mobile\}::text/);
    assert.match(source, /'policyVersion', \$\{preference\.disclosureVersion\}::text/);
    assert.match(source, /'communicationPreference', \$\{preference\.preferredChannel\}::text/);
    assert.match(migration, /placement_contact_change_audits/);
    assert.equal(source.includes("'mobile_e164', ${preference.mobile}"), false);
  });
});
