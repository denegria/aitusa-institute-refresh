import { createHmac } from "node:crypto";
import { isIP } from "node:net";
import {
  PORTAL_AUTH_HASH_VERSION,
  PORTAL_AUTH_SECURITY,
} from "./contract.js";

export function createPortalAuthIdentifierHasher(secret) {
  if (typeof secret !== "string" || secret.length < 32) {
    throw new Error("portal_auth_hash_secret_invalid");
  }

  return function hashIdentifiers({ email, ipAddress }) {
    return {
      keyVersion: PORTAL_AUTH_HASH_VERSION,
      emailKeyHash: keyedHash(secret, `email\u0000${email}`),
      ipKeyHash: keyedHash(
        secret,
        `ip\u0000${normalizeIpAddress(ipAddress)}`,
      ),
    };
  };
}

export async function waitForGenericCodeResponse({
  startedAt,
  monotonicNow,
  sleep,
  minimumMs = PORTAL_AUTH_SECURITY.minimumCodeResponseMs,
}) {
  const elapsed = Math.max(0, monotonicNow() - startedAt);
  const remaining = Math.min(minimumMs, Math.max(0, minimumMs - elapsed));
  if (remaining > 0) await sleep(remaining);
}

function keyedHash(secret, value) {
  return createHmac("sha256", secret).update(value, "utf8").digest("hex");
}

function normalizeIpAddress(value) {
  const candidate =
    typeof value === "string" ? value.trim().toLowerCase() : "";
  return isIP(candidate) ? candidate : "unknown";
}
