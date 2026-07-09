import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GET } from "../app/api/portal/privacy/route.js";

describe("MIS-279 privacy route handler", () => {
  it("returns safe policy status for a portal account", async () => {
    const response = await GET(
      new Request("http://localhost/api/portal/privacy?accountKey=guardianActive"),
    );
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.ok, true);
    assert.equal(body.durableConsentStorage, false);
    assert.equal(body.policy.account.privacyGateSatisfied, true);
    assert.equal("providerSubject" in body.policy.account, false);
  });
});
