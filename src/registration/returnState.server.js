import { createHmac, timingSafeEqual } from "node:crypto";

import { RegistrationExperienceError } from "./contract.js";

const TTL_MS = 24 * 60 * 60 * 1000;

function secret() {
  const value = String(process.env.REGISTRATION_STATE_SECRET || "").trim();
  if (value.length < 32) throw new RegistrationExperienceError("registration_state_unconfigured", 503);
  return value;
}

function signature(payload) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createRegistrationReturnState(paymentRequestId, now = Date.now()) {
  const id = String(paymentRequestId || "").trim();
  if (!id) throw new RegistrationExperienceError("payment_request_required", 400);
  const payload = Buffer.from(JSON.stringify({ paymentRequestId: id, expiresAt: now + TTL_MS })).toString("base64url");
  return `${payload}.${signature(payload)}`;
}

export function readRegistrationReturnState(value, now = Date.now()) {
  const [payload, suppliedSignature, extra] = String(value || "").split(".");
  if (!payload || !suppliedSignature || extra) throw new RegistrationExperienceError("registration_state_invalid", 400);
  const expected = signature(payload);
  const suppliedBuffer = Buffer.from(suppliedSignature);
  const expectedBuffer = Buffer.from(expected);
  if (suppliedBuffer.length !== expectedBuffer.length || !timingSafeEqual(suppliedBuffer, expectedBuffer)) {
    throw new RegistrationExperienceError("registration_state_invalid", 400);
  }
  let decoded;
  try { decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")); } catch {
    throw new RegistrationExperienceError("registration_state_invalid", 400);
  }
  if (!decoded?.paymentRequestId || Number(decoded.expiresAt) <= now) {
    throw new RegistrationExperienceError("registration_state_expired", 410);
  }
  return { paymentRequestId: String(decoded.paymentRequestId) };
}
