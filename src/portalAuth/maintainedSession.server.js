import { createHmac, timingSafeEqual } from "node:crypto";

export const PORTAL_MAINTAINED_IDENTITY_HEADER =
  "x-aitusa-portal-maintained-identity";

export function serializeMaintainedPortalIdentity(identity, secret) {
  const payload = normalizeIdentity(identity);
  assertSecret(secret);
  const encoded = Buffer.from(
    JSON.stringify({ version: 1, ...payload }),
    "utf8",
  ).toString("base64url");
  return `${encoded}.${signature(encoded, secret)}`;
}

export function readMaintainedPortalIdentity(request, secret) {
  const value = request?.headers?.get?.(PORTAL_MAINTAINED_IDENTITY_HEADER);
  if (!value || typeof value !== "string") return null;
  try {
    assertSecret(secret);
    const [encoded, suppliedSignature, extra] = value.split(".");
    if (!encoded || !suppliedSignature || extra) return null;
    const expected = Buffer.from(signature(encoded, secret), "utf8");
    const supplied = Buffer.from(suppliedSignature, "utf8");
    if (
      supplied.length !== expected.length ||
      !timingSafeEqual(supplied, expected)
    ) {
      return null;
    }
    const decoded = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8"),
    );
    if (decoded?.version !== 1) return null;
    return normalizeIdentity(decoded);
  } catch {
    return null;
  }
}

function signature(encoded, secret) {
  return createHmac("sha256", secret)
    .update("portal-maintained-identity:v1:")
    .update(encoded)
    .digest("base64url");
}

function assertSecret(secret) {
  if (typeof secret !== "string" || secret.length < 32) {
    throw new Error("portal_maintained_identity_secret_invalid");
  }
}

function normalizeIdentity(identity) {
  const providerUserId = String(identity?.providerUserId || "").trim();
  const email = String(identity?.email || "").trim().toLowerCase();
  if (
    !providerUserId ||
    providerUserId.length > 255 ||
    !email ||
    email.length > 320 ||
    !email.includes("@") ||
    identity?.emailVerified !== true
  ) {
    throw new Error("portal_maintained_identity_invalid");
  }
  return { providerUserId, email, emailVerified: true };
}
