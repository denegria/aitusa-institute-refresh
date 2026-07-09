import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GET } from "../app/api/portal/learning/route.js";

describe("MIS-274 learning route handler", () => {
  it("returns a portal-safe module library for an authorized guardian", async () => {
    const response = await GET(
      new Request(
        "http://localhost/api/portal/learning?accountKey=guardianActive&studentCrmContactRef=crm_contact_fixture_minor_001",
      ),
    );
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.ok, true);
    assert.equal(body.modules[0].content.length, 4);
    assert.equal(body.progressPreview.crmTimelinePreview.eventType, "lesson_viewed");
    assert.equal(body.durableProgressStorage, false);
  });

  it("returns a privacy denial for the default student fixture", async () => {
    const response = await GET(new Request("http://localhost/api/portal/learning"));
    const body = await response.json();

    assert.equal(response.status, 403);
    assert.equal(body.reason, "privacy_gate_required");
  });
});
