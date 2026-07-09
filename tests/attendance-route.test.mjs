import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GET } from "../app/api/portal/attendance/route.js";

function request(search = "") {
  return new Request(`http://localhost/api/portal/attendance${search}`);
}

describe("MIS-272 attendance route handler", () => {
  it("returns a portal-safe attendance summary for an authorized guardian", async () => {
    const response = await GET(
      request("?accountKey=guardianActive&studentCrmContactRef=crm_contact_fixture_minor_001"),
    );
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.ok, true);
    assert.equal(body.attendance.studentCrmContactRef, "crm_contact_fixture_minor_001");
    assert.equal(body.crmSyncPreview.crmTimelinePreview.eventType, "attendance_scan");
    assert.equal(body.crmWrite, false);
  });

  it("returns a privacy-gate denial for the default student fixture", async () => {
    const response = await GET(request());
    const body = await response.json();

    assert.equal(response.status, 403);
    assert.equal(body.ok, false);
    assert.equal(body.reason, "privacy_gate_required");
    assert.equal(body.crmWrite, false);
  });
});
