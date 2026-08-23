import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";

export const PORTAL_PASSWORD_RESET_COOKIE_NAME = "aitusa_password_reset";
export const PORTAL_PASSWORD_RESET_MAX_AGE_SECONDS = 15 * 60;

export function sealPortalPasswordResetToken(
  token,
  {
    secret = process.env.WORKOS_COOKIE_PASSWORD,
    now = () => new Date(),
    random = randomBytes,
  } = {},
) {
  assertConfiguration(secret);
  if (typeof token !== "string" || token.length < 16 || token.length > 2048) {
    throw new Error("portal_password_reset_token_invalid");
  }

  const issuedAt = now().getTime();
  const payload = JSON.stringify({
    token,
    expiresAt: issuedAt + PORTAL_PASSWORD_RESET_MAX_AGE_SECONDS * 1000,
  });
  const iv = random(12);
  const cipher = createCipheriv("aes-256-gcm", deriveKey(secret), iv);
  const encrypted = Buffer.concat([
    cipher.update(payload, "utf8"),
    cipher.final(),
  ]);
  return [
    "v1",
    iv.toString("base64url"),
    cipher.getAuthTag().toString("base64url"),
    encrypted.toString("base64url"),
  ].join(".");
}

export function unsealPortalPasswordResetToken(
  sealed,
  {
    secret = process.env.WORKOS_COOKIE_PASSWORD,
    now = () => new Date(),
  } = {},
) {
  try {
    assertConfiguration(secret);
    if (typeof sealed !== "string" || sealed.length > 4096) return null;
    const [version, ivValue, tagValue, encryptedValue, extra] = sealed.split(".");
    if (version !== "v1" || !ivValue || !tagValue || !encryptedValue || extra) {
      return null;
    }
    const decipher = createDecipheriv(
      "aes-256-gcm",
      deriveKey(secret),
      Buffer.from(ivValue, "base64url"),
    );
    decipher.setAuthTag(Buffer.from(tagValue, "base64url"));
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encryptedValue, "base64url")),
      decipher.final(),
    ]).toString("utf8");
    const payload = JSON.parse(decrypted);
    if (
      typeof payload?.token !== "string" ||
      payload.token.length < 16 ||
      payload.token.length > 2048 ||
      !Number.isFinite(payload.expiresAt) ||
      payload.expiresAt <= now().getTime()
    ) {
      return null;
    }
    return payload.token;
  } catch {
    return null;
  }
}

export function readPortalPasswordResetCookie(request) {
  const cookieHeader = request.headers.get("cookie") || "";
  for (const item of cookieHeader.split(";")) {
    const [name, ...parts] = item.trim().split("=");
    if (name !== PORTAL_PASSWORD_RESET_COOKIE_NAME) continue;
    try {
      return decodeURIComponent(parts.join("="));
    } catch {
      return null;
    }
  }
  return null;
}

export function serializePortalPasswordResetCookie(
  sealed,
  { secure = process.env.NODE_ENV === "production" } = {},
) {
  const parts = [
    `${PORTAL_PASSWORD_RESET_COOKIE_NAME}=${encodeURIComponent(sealed)}`,
    "Path=/",
    `Max-Age=${PORTAL_PASSWORD_RESET_MAX_AGE_SECONDS}`,
    "HttpOnly",
    "SameSite=Lax",
  ];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

export function serializeExpiredPortalPasswordResetCookie(
  { secure = process.env.NODE_ENV === "production" } = {},
) {
  const parts = [
    `${PORTAL_PASSWORD_RESET_COOKIE_NAME}=`,
    "Path=/",
    "Max-Age=0",
    "Expires=Thu, 01 Jan 1970 00:00:00 GMT",
    "HttpOnly",
    "SameSite=Lax",
  ];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

function deriveKey(secret) {
  return createHash("sha256").update(secret, "utf8").digest();
}

function assertConfiguration(secret) {
  if (typeof secret !== "string" || secret.length < 32) {
    throw new Error("portal_password_reset_configuration_invalid");
  }
}
