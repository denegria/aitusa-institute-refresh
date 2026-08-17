import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GET, POST } from "../app/api/portal/check-in/route.js";

function request(path = "", init) {
  return new Request(`http://localhost/api/portal/check-in${path}`, init);
}

describe("MIS-273 scanner check-in route handler", () => {
  it("fails GET closed instead of exposing fixture station metadata", async () => {
    const response = await GET(request("?accountKey=teacherActive"));
    assert.equal(response.status, 404);
    assert.equal(await response.text(), "Not Found");
  });

  it("fails POST closed instead of accepting fixture scanner events", async () => {
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
    assert.equal(response.status, 404);
    assert.equal(await response.text(), "Not Found");
  });
});
