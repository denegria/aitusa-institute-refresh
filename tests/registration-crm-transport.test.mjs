import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import { callRegistrationCrm } from "../src/registration/crm.server.js";

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
});
