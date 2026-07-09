import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GET, POST } from "../app/api/portal/check-in/route.js";

function request(path = "", init) {
  return new Request(`http://localhost/api/portal/check-in${path}`, init);
}

describe("MIS-273 scanner check-in route handler", () => {
  it("returns station metadata for an authorized fixture teacher", async () => {
    const response = await GET(request());
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.ok, true);
    assert.equal(body.station.stationRef, "station_bound_brook_front_desk");
    assert.equal(body.crmWrite, false);
  });

  it("previews a scanner check-in event without storing attendance", async () => {
    const response = await POST(
      request("", {
        method: "POST",
        body: JSON.stringify({
          accountKey: "teacherActive",
          stationRef: "station_bound_brook_front_desk",
          sessionRef: "session_fixture_english_101_003",
          scannedValue: "AIT-CHK-7F4K9Q2M",
          scannedAt: "2026-07-08T21:58:00.000Z",
        }),
      }),
    );
    const body = await response.json();

    assert.equal(response.status, 202);
    assert.equal(body.result, "accepted_present");
    assert.equal(body.crmSyncPreview.crmTimelinePreview.eventType, "attendance_scan");
    assert.equal(body.crmWrite, false);
  });
});
