import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import { callRegistrationCrm } from "../src/registration/crm.server.js";
import { POST as reconcileDraft } from "../app/api/registration/reconcile/route.js";

const saved = Object.fromEntries(["AIT_CRM_REGISTRATION_URL", "AIT_CRM_REGISTRATION_SECRET", "AIT_CRM_VERCEL_PROTECTION_BYPASS"].map((key) => [key, process.env[key]]));
afterEach(() => { for (const [key, value] of Object.entries(saved)) { if (value === undefined) delete process.env[key]; else process.env[key] = value; } });

describe("MIS-421 CRM registration transport", () => {
  it("sends the private shared secret and protection bypass server-side", async () => {
    process.env.AIT_CRM_REGISTRATION_URL = "https://crm.example.com/api/public-registration";
    process.env.AIT_CRM_REGISTRATION_SECRET = "shared-secret";
    process.env.AIT_CRM_VERCEL_PROTECTION_BYPASS = "bypass-secret";
    let call;
    const result = await callRegistrationCrm("quote", { residenceCountryCode: "US" }, async (url, init) => {
      call = { url, init };
      return new Response(JSON.stringify({ quote: { status: "quoted" } }), { status: 200, headers: { "content-type": "application/json" } });
    });
    assert.equal(result.quote.status, "quoted");
    assert.equal(call.init.headers["x-ait-registration-secret"], "shared-secret");
    assert.equal(call.init.headers["x-vercel-protection-bypass"], "bypass-secret");
    assert.equal(JSON.parse(call.init.body).action, "quote");
  });

  it("maps CRM failures to safe typed errors", async () => {
    process.env.AIT_CRM_REGISTRATION_URL = "https://crm.example.com/api/public-registration";
    process.env.AIT_CRM_REGISTRATION_SECRET = "shared-secret";
    await assert.rejects(() => callRegistrationCrm("quote", {}, async () => new Response(JSON.stringify({ error: { code: "program_advisor_required", message: "Advisor required" } }), { status: 409, headers: { "content-type": "application/json" } })),
      (error) => error.code === "program_advisor_required" && error.status === 409);
  });

  it("reconciles a legacy draft through the private CRM route before allowing checkout", async () => {
    process.env.AIT_CRM_REGISTRATION_URL = "https://crm.example.com/api/public-registration";
    process.env.AIT_CRM_REGISTRATION_SECRET = "shared-secret";
    const originalFetch = globalThis.fetch;
    const requests = [];
    try {
      globalThis.fetch = async (url, init) => {
        requests.push({ url, ...JSON.parse(init.body) });
        return Response.json({ result: { exists: true, state: "confirmed" } });
      };
      const response = await reconcileDraft(new Request("https://site.example.com/api/registration/reconcile/", {
        method: "POST",
        headers: { origin: "https://site.example.com", host: "site.example.com", "content-type": "application/json" },
        body: JSON.stringify({ idempotencyKey: "public:12345678-1234-4234-8234-123456789abc" }),
      }));
      assert.equal(response.status, 200);
      assert.equal(response.headers.get("cache-control"), "private, no-store");
      assert.deepEqual(await response.json(), { ok: true, exists: true, state: "confirmed" });
      assert.deepEqual(requests, [{
        url: "https://crm.example.com/api/public-registration",
        action: "reconcile_draft",
        idempotencyKey: "public:12345678-1234-4234-8234-123456789abc",
      }]);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
