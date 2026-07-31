import {
  PORTAL_SESSION_COOKIE_NAME,
  PORTAL_SESSION_MAX_AGE_SECONDS,
} from "./contract.js";

export function readPortalSessionCookie(request) {
  const cookieHeader = request.headers.get("cookie") || "";
  for (const item of cookieHeader.split(";")) {
    const [name, ...parts] = item.trim().split("=");
    if (name === PORTAL_SESSION_COOKIE_NAME) {
      const value = parts.join("=");
      try {
        return decodeURIComponent(value);
      } catch {
        return null;
      }
    }
  }
  return null;
}

export function serializePortalSessionCookie(
  sessionData,
  { secure = process.env.NODE_ENV === "production" } = {},
) {
  const parts = [
    `${PORTAL_SESSION_COOKIE_NAME}=${encodeURIComponent(sessionData)}`,
    "Path=/",
    `Max-Age=${PORTAL_SESSION_MAX_AGE_SECONDS}`,
    "HttpOnly",
    "SameSite=Lax",
  ];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

export function serializeExpiredPortalSessionCookie(
  { secure = process.env.NODE_ENV === "production" } = {},
) {
  const parts = [
    `${PORTAL_SESSION_COOKIE_NAME}=`,
    "Path=/",
    "Max-Age=0",
    "Expires=Thu, 01 Jan 1970 00:00:00 GMT",
    "HttpOnly",
    "SameSite=Lax",
  ];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}
