import { PortalClaimError } from "./errors.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ATTRIBUTION_KEYS = new Set([
  "utmSource",
  "utmMedium",
  "utmCampaign",
  "utmContent",
  "utmTerm",
  "landingPath",
]);

export function validateClaimRequest(input = {}) {
  const attemptId = requireUuid(input.attemptId, "attempt_id_invalid");
  const claimId = requireOpaqueId(input.claimId, "claim_id_invalid", 128);
  const claimToken = requireOpaqueId(input.claimToken, "claim_token_invalid", 512, 32);
  const firstName = normalizeFirstName(input.firstName);
  const email = normalizeEmail(input.email);
  const advisorContactRequested = input.advisorContactRequested === true;
  return {
    attemptId,
    claimId,
    claimToken,
    firstName,
    email,
    advisorContactRequested,
    attribution: sanitizeAttribution(input.attribution),
  };
}

export function validateCodeRequest(input = {}) {
  const challengeId = requireUuid(input.challengeId, "challenge_id_invalid");
  const claimId = requireOpaqueId(input.claimId, "claim_id_invalid", 128);
  const code = typeof input.code === "string" ? input.code.trim() : "";
  if (!/^\d{6}$/.test(code)) {
    throw new PortalClaimError("magic_auth_code_invalid", 422);
  }
  return { challengeId, claimId, code };
}

export function validateFinalizeRequest(input = {}) {
  return {
    challengeId: requireUuid(input.challengeId, "challenge_id_invalid"),
    claimId: requireOpaqueId(input.claimId, "claim_id_invalid", 128),
  };
}

export function normalizeEmail(value) {
  const normalized = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (
    normalized.length < 3 ||
    normalized.length > 254 ||
    !EMAIL_PATTERN.test(normalized)
  ) {
    throw new PortalClaimError("email_invalid", 422);
  }
  return normalized;
}

function normalizeFirstName(value) {
  const normalized =
    typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
  if (normalized.length < 1 || normalized.length > 80) {
    throw new PortalClaimError("first_name_invalid", 422);
  }
  return normalized;
}

function requireUuid(value, code) {
  if (typeof value !== "string" || !UUID_PATTERN.test(value)) {
    throw new PortalClaimError(code, 422);
  }
  return value;
}

function requireOpaqueId(value, code, maxLength, minLength = 8) {
  if (
    typeof value !== "string" ||
    value.length < minLength ||
    value.length > maxLength ||
    /[\u0000-\u001f\u007f]/.test(value)
  ) {
    throw new PortalClaimError(code, 422);
  }
  return value;
}

function sanitizeAttribution(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) return {};
  return Object.fromEntries(
    Object.entries(input)
      .filter(([key, value]) => ATTRIBUTION_KEYS.has(key) && typeof value === "string")
      .map(([key, value]) => [key, value.trim().slice(0, 180)])
      .filter(([, value]) => value.length > 0),
  );
}
