import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import { POST as requestGuardianCode } from "../app/api/portal/guardian-onboarding/code/route.js";

const schema = await readFile(new URL("../src/diagnostic/schema.js", import.meta.url), "utf8");
const migration = await readFile(new URL("../drizzle/0005_guardian_onboarding.sql", import.meta.url), "utf8");
const runtime = await readFile(new URL("../src/guardianOnboarding/runtime.server.js", import.meta.url), "utf8");
const portalControls = await readFile(new URL("../app/portal/GuardianPrivacyControls.jsx", import.meta.url), "utf8");

describe("MIS-279 guardian onboarding route and storage boundary", () => {
  it("fails closed until the non-destructive migration and explicit feature flag are activated", async () => {
    const previous = process.env.GUARDIAN_ONBOARDING_ENABLED;
    delete process.env.GUARDIAN_ONBOARDING_ENABLED;
    try {
      const response = await requestGuardianCode(new Request("https://example.com/api/portal/guardian-onboarding/code", {
        method: "POST",
        headers: { "content-type": "application/json", origin: "https://example.com", host: "example.com" },
        body: JSON.stringify({}),
      }));
      assert.equal(response.status, 503);
      assert.deepEqual(await response.json(), { ok: false, error: "guardian_onboarding_unavailable" });
    } finally {
      if (previous === undefined) delete process.env.GUARDIAN_ONBOARDING_ENABLED;
      else process.env.GUARDIAN_ONBOARDING_ENABLED = previous;
    }
    assert.match(runtime, /GUARDIAN_ONBOARDING_ENABLED === "true"/);
  });

  it("keeps child identity and answers out of the pre-consent challenge table", () => {
    const challengeBlock = schema.match(/export const guardianConsentChallenges[\s\S]*?export const childProfiles/)?.[0] || "";
    assert.doesNotMatch(challengeBlock, /childFirstName|selectedAnswers|writingSample|dateOfBirth|childEmail/);
    assert.match(challengeBlock, /guardianFirstName/);
    assert.match(challengeBlock, /noticeAccepted/);
  });

  it("ships linked-child, receipt, and ownership-control storage without applying it automatically", () => {
    assert.match(migration, /CREATE TABLE "child_profiles"/);
    assert.match(migration, /CREATE TABLE "guardian_child_links"/);
    assert.match(migration, /CREATE TABLE "guardian_consent_receipts"/);
    assert.match(migration, /verified_email_plus_attestation/);
    assert.doesNotMatch(migration, /date_of_birth|child_email|raw_transcript|raw_audio/i);
    assert.match(portalControls, /withdraw_consent/);
    assert.match(portalControls, /unlink_child/);
    assert.match(portalControls, /request_deletion/);
  });
});
