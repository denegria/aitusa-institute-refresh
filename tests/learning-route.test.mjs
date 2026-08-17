import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GET } from "../app/api/portal/learning/route.js";

describe("MIS-274 learning route handler", () => {
  it("fails closed even when fixture identity query parameters are supplied", async () => {
    const response = await GET(
      new Request(
        "http://localhost/api/portal/learning?accountKey=guardianActive&studentCrmContactRef=crm_contact_fixture_minor_001",
      ),
    );
    assert.equal(response.status, 404);
    assert.equal(await response.text(), "Not Found");
    assert.equal(response.headers.get("cache-control"), "private, no-store");
  });
});
