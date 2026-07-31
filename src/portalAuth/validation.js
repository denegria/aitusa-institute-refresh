import { PortalClaimError } from "../portalClaim/errors.js";
import { normalizeEmail } from "../portalClaim/validation.js";

export function validatePortalSignInCodeRequest(input = {}) {
  return {
    email: normalizeEmail(input.email),
  };
}

export function validatePortalSignInVerifyRequest(input = {}) {
  const email = normalizeEmail(input.email);
  const code = typeof input.code === "string" ? input.code.trim() : "";
  if (!/^\d{6}$/.test(code)) {
    throw new PortalClaimError("portal_sign_in_invalid", 401);
  }
  return { email, code };
}
