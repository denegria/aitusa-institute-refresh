import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createPortalAuthOutcomeObserver } from "../src/portalAuth/outcomeObserver.server.js";

describe("portal auth outcome observer", () => {
  it("logs allowlisted operational fields only", () => {
    const entries = [];
    const observe = createPortalAuthOutcomeObserver({
      info(...args) {
        entries.push(args);
      },
    });

    observe({
      eventType: "code_request",
      outcome: "provider_dispatched",
      email: "student@example.com",
      ipAddress: "203.0.113.25",
    });
    observe({ eventType: "unknown", outcome: "provider_dispatched" });

    assert.deepEqual(entries, [[
      "portal_auth_outcome",
      { eventType: "code_request", outcome: "provider_dispatched" },
    ]]);
    assert.equal(JSON.stringify(entries).match(/student@example|203\.0\.113/i), null);
  });
});
