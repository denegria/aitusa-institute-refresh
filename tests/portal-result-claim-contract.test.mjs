import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import { POST as requestCode } from "../app/api/portal/result-claim/code/route.js";
import { parsePortalClaimJson } from "../src/portalClaim/http.server.js";

const migration = await readFile(
  new URL("../drizzle/0001_result_claim_accounts.sql", import.meta.url),
  "utf8",
);
const repository = await readFile(
  new URL("../src/portalClaim/neonRepository.server.js", import.meta.url),
  "utf8",
);
const component = await readFile(
  new URL("../app/_components/site/PlacementExperience.jsx", import.meta.url),
  "utf8",
);
const completionRoute = await readFile(
  new URL("../app/api/diagnostic/attempts/[attemptId]/complete/route.js", import.meta.url),
  "utf8",
);
const reviewRepository = await readFile(
  new URL("../src/placementReview/neonRepository.server.js", import.meta.url),
  "utf8",
);
const authRepository = await readFile(
  new URL("../src/portalAuth/neonRepository.server.js", import.meta.url),
  "utf8",
);
const claimVerifyRoute = await readFile(
  new URL("../app/api/portal/result-claim/verify/route.js", import.meta.url),
  "utf8",
);
const guardianRepository = await readFile(
  new URL("../src/guardianOnboarding/neonRepository.server.js", import.meta.url),
  "utf8",
);

describe("MIS-338 result claim contracts", () => {
  it("degrades without calling WorkOS when staging credentials are absent", async () => {
    const previous = {
      apiKey: process.env.WORKOS_API_KEY,
      clientId: process.env.WORKOS_CLIENT_ID,
      cookiePassword: process.env.WORKOS_COOKIE_PASSWORD,
    };
    delete process.env.WORKOS_API_KEY;
    delete process.env.WORKOS_CLIENT_ID;
    delete process.env.WORKOS_COOKIE_PASSWORD;
    try {
      const response = await requestCode(
        new Request("https://example.com/api/portal/result-claim/code", {
          method: "POST",
        }),
      );
      assert.equal(response.status, 503);
      assert.deepEqual(await response.json(), {
        ok: false,
        error: "passwordless_claim_unavailable",
      });
    } finally {
      for (const [key, value] of Object.entries(previous)) {
        const envKey = {
          apiKey: "WORKOS_API_KEY",
          clientId: "WORKOS_CLIENT_ID",
          cookiePassword: "WORKOS_COOKIE_PASSWORD",
        }[key];
        if (value === undefined) delete process.env[envKey];
        else process.env[envKey] = value;
      }
    }
  });

  it("rejects malformed or oversized public claim bodies before provider work", async () => {
    await assert.rejects(
      parsePortalClaimJson(
        new Request("https://example.com/api/portal/result-claim/code", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: "{",
        }),
      ),
      (error) => error.code === "request_body_invalid" && error.status === 400,
    );
    await assert.rejects(
      parsePortalClaimJson(
        new Request("https://example.com/api/portal/result-claim/code", {
          method: "POST",
          headers: { "content-length": "20000" },
          body: "{}",
        }),
      ),
      (error) => error.code === "request_body_too_large" && error.status === 413,
    );
  });

  it("creates isolated account, challenge, consent, and delivery-outbox tables", () => {
    for (const table of [
      "portal_accounts",
      "portal_auth_challenges",
      "consent_records",
      "crm_outbox",
    ]) {
      assert.match(migration, new RegExp(`CREATE TABLE \"${table}\"`));
    }
    assert.match(migration, /advisor_contact_requested/);
    assert.match(migration, /workos_user_id/);
  });

  it("keeps raw diagnostic and AI content outside the CRM outbox payload", () => {
    const outboxSection = repository.slice(repository.indexOf("outbox_write as"));
    for (const forbidden of [
      "selectedAnswers",
      "writingSample",
      "audio",
      "transcript",
      "prompt",
      "conversation",
    ]) {
      assert.equal(outboxSection.includes(forbidden), false);
    }
    assert.match(outboxSection, /recommendedLevelKey/);
    assert.match(outboxSection, /advisorContactEmail/);
  });

  it("purges short-lived identity challenges through the existing retention job", async () => {
    const retentionRepository = await readFile(
      new URL("../src/diagnostic/neonRepository.server.js", import.meta.url),
      "utf8",
    );
    assert.match(retentionRepository, /deleted_auth_challenges/);
    assert.match(retentionRepository, /consumed_at.*interval '1 day'/s);
  });

  it("reveals the result only after verified identity and one channel-specific advisor choice", () => {
    assert.match(component, /data-diagnostic-screen="result-gate"/);
    assert.match(component, /Verificar y ver mi resultado/);
    assert.match(component, /savePlacementContactPreference/);
    assert.match(component, /contactPreference: contactPreferencePayload/);
    assert.match(claimVerifyRoute, /savePlacementContactPreferenceForAccount/);
    assert.match(claimVerifyRoute, /contactPreferencePending/);
    assert.match(component, /advisorContactRequested: false/);
    assert.match(component, /onClaimed\?\./);
    assert.doesNotMatch(component, /Ahora no/);
    assert.doesNotMatch(component, /Placement Diagnostic/);
    assert.doesNotMatch(component, /El contacto con un asesor es opcional/);
    assert.doesNotMatch(component, /type="password"/);
  });

  it("creates employee review work only after a result is claimed", () => {
    assert.doesNotMatch(completionRoute, /PlacementReview|createReview|crm_outbox/);
    assert.match(reviewRepository, /attempt\.status = 'claimed'/);
    assert.match(reviewRepository, /review\.id is null/);
    assert.match(repository, /employee_account_student_claim_forbidden/);
  });

  it("keeps employee identities out of student-only account surfaces", () => {
    assert.match(authRepository, /getAuthorizedStudyBuddyContext[\s\S]+not exists \([\s\S]+employee_review_roles/);
    assert.match(repository, /getClaimReceipt[\s\S]+not exists \([\s\S]+employee_review_roles/);
    assert.match(guardianRepository, /getReceipt[\s\S]+not exists \([\s\S]+employee_review_roles/);
    assert.match(guardianRepository, /manageChild[\s\S]+not exists \([\s\S]+employee_review_roles/);
  });
});
