import {
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";
import { RESUME_COOKIE_NAME } from "./contract.js";

export function createResumeCredential(
  secret,
  attemptId,
  requestId,
  requestSecret,
) {
  if (!secret) throw new Error("DIAGNOSTIC_RESUME_SECRET is required");
  return createHmac("sha256", secret)
    .update(`${attemptId}:${requestId}:${requestSecret}`)
    .digest("base64url");
}

export function createClaimToken() {
  return randomBytes(32).toString("base64url");
}

export function hashCredential(value) {
  return createHash("sha256").update(value).digest("hex");
}

export function credentialMatches(value, expectedHash) {
  if (!value || !expectedHash) return false;
  const actual = Buffer.from(hashCredential(value), "hex");
  const expected = Buffer.from(expectedHash, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function serializeResumeCookie({ attemptId, credential, expiresAt, secure }) {
  const value = `${attemptId}.${credential}`;
  const parts = [
    `${RESUME_COOKIE_NAME}=${encodeURIComponent(value)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Expires=${new Date(expiresAt).toUTCString()}`,
  ];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

export function clearResumeCookie({ secure }) {
  const parts = [
    `${RESUME_COOKIE_NAME}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0",
  ];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

export function readResumeCookie(request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const pair = cookieHeader
    .split(";")
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(`${RESUME_COOKIE_NAME}=`));
  if (!pair) return null;
  const raw = decodeURIComponent(pair.slice(RESUME_COOKIE_NAME.length + 1));
  const separator = raw.indexOf(".");
  if (separator <= 0 || separator >= raw.length - 1) return null;
  return {
    attemptId: raw.slice(0, separator),
    credential: raw.slice(separator + 1),
  };
}
