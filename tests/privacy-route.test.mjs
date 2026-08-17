import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GET } from "../app/api/portal/privacy/route.js";

describe("MIS-279 privacy route handler", () => {
  it("fails closed instead of resolving fixture account policy", async () => {
    const response = await GET(
      new Request("http://localhost/api/portal/privacy?accountKey=guardianActive"),
    );
    assert.equal(response.status, 404);
    assert.equal(await response.text(), "Not Found");
    assert.equal(response.headers.get("cache-control"), "private, no-store");
  });
});
