import { PortalClaimError } from "../portalClaim/errors.js";
import { normalizeEmail } from "../portalClaim/validation.js";

export function validatePortalSignInCodeRequest(input = {}) {
  return {
    email: normalizeEmail(input.email),
    audience: normalizeAudience(input.audience),
  };
}

export function validatePortalSignInVerifyRequest(input = {}) {
  const email = normalizeEmail(input.email);
  const code = typeof input.code === "string" ? input.code.trim() : "";
  if (!/^\d{6}$/.test(code)) {
    throw new PortalClaimError("portal_sign_in_invalid", 401);
  }
  return { email, code, audience: normalizeAudience(input.audience) };
}

export function validatePortalPasswordSignInRequest(input = {}) {
  const email = normalizeEmail(input.email);
  const password = typeof input.password === "string" ? input.password : "";
  if (!password || password.length > 256) {
    throw new PortalClaimError("portal_sign_in_invalid", 401);
  }
  return { email, password, audience: normalizeAudience(input.audience) };
}

export function validatePortalPasswordResetRequest(input = {}) {
  return {
    email: normalizeEmail(input.email),
    audience: normalizeAudience(input.audience),
  };
}

function normalizeAudience(value) {
  return value === "employee" ? "employee" : "student";
}
