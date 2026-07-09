import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GET } from "../app/api/portal/ai-study-buddy/route.js";

describe("MIS-275 AI study buddy route handler", () => {
  it("returns a safe contract plan without provider calls", async () => {
    const response = await GET(
      new Request(
        "http://localhost/api/portal/ai-study-buddy?accountKey=guardianActive&studentCrmContactRef=crm_contact_fixture_minor_001&useCase=lesson_review",
      ),
    );
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.ok, true);
    assert.equal(body.practiceAvailable, false);
    assert.equal(body.providerGate.browserProviderCallsAllowed, false);
    assert.equal(body.providerGate.serverProviderCallsAllowed, false);
    assert.equal(body.crmSummaryPreview.delivery.crmWrite, false);
  });
});
