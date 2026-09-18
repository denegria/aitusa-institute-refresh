import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import { createRegistrationReturnState, readRegistrationReturnState } from "../src/registration/returnState.server.js";

const original = process.env.REGISTRATION_STATE_SECRET;
afterEach(() => { process.env.REGISTRATION_STATE_SECRET = original; });

describe("MIS-421 signed return state", () => {
  it("round-trips an opaque payment request and rejects tampering", () => {
    process.env.REGISTRATION_STATE_SECRET = "fixture-secret-with-at-least-thirty-two-characters";
    const token = createRegistrationReturnState("request-1", 1_000);
    assert.deepEqual(readRegistrationReturnState(token, 2_000), { paymentRequestId: "request-1" });
    assert.throws(() => readRegistrationReturnState(`${token}x`, 2_000), (error) => error.code === "registration_state_invalid");
  });

  it("expires after one day and fails closed without a strong secret", () => {
    process.env.REGISTRATION_STATE_SECRET = "fixture-secret-with-at-least-thirty-two-characters";
    const token = createRegistrationReturnState("request-1", 1_000);
    assert.throws(() => readRegistrationReturnState(token, 86_401_001), (error) => error.code === "registration_state_expired");
    process.env.REGISTRATION_STATE_SECRET = "short";
    assert.throws(() => createRegistrationReturnState("request-1"), (error) => error.code === "registration_state_unconfigured");
  });
});
