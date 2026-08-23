import { NextResponse } from "next/server.js";
import { getPortalPrototypeGateResponse } from "./src/portal/portalAvailability.js";
import {
  PORTAL_SESSION_COOKIE_NAME,
  PORTAL_SESSION_MAX_AGE_SECONDS,
} from "./src/portalClaim/contract.js";
import {
  isPortalSessionProviderConfigured,
  maintainPortalSession,
} from "./src/portalAuth/sessionRuntime.server.js";
import {
  PORTAL_MAINTAINED_IDENTITY_HEADER,
  serializeMaintainedPortalIdentity,
} from "./src/portalAuth/maintainedSession.server.js";
import {
  CANONICAL_ORIGIN,
  getLegacyDestination,
  isLegacyGonePath,
  LEGACY_ENGLISH_HOST,
} from "./src/seo/legacyRoutes.js";

function requestHost(request) {
  return (request.headers.get("x-forwarded-host") || request.headers.get("host") || request.nextUrl.hostname)
    .split(",")[0]
    .trim()
    .split(":")[0]
    .toLowerCase();
}

function redirectUrl(request, destination, forceCanonicalHost) {
  const origin = forceCanonicalHost ? CANONICAL_ORIGIN : request.nextUrl.origin;
  const url = new URL(destination, origin);
  url.search = request.nextUrl.search;
  return url;
}

function goneResponse() {
  return new NextResponse("Gone", {
    status: 410,
    headers: {
      "cache-control": "public, max-age=3600, s-maxage=86400",
      "content-type": "text/plain; charset=utf-8",
    },
  });
}

function isPortalSessionPath(pathname) {
  return (
    pathname === "/portal" ||
    pathname.startsWith("/portal/") ||
    pathname.startsWith("/api/portal/") ||
    pathname === "/employee" ||
    pathname.startsWith("/employee/") ||
    pathname.startsWith("/api/employee/")
  );
}

export async function forwardWithMaintainedPortalSession(
  request,
  {
    isConfigured = isPortalSessionProviderConfigured,
    maintainSession = maintainPortalSession,
    getSessionContextSecret = () => process.env.PORTAL_AUTH_HASH_SECRET,
    observeMaintenance = observePortalSessionMaintenance,
  } = {},
) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete(PORTAL_MAINTAINED_IDENTITY_HEADER);
  const current = request.cookies.get(PORTAL_SESSION_COOKIE_NAME)?.value;
  if (!current || !isConfigured()) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  try {
    const maintained = await maintainSession(current);
    if (!maintained?.sessionData || !maintained.identity) {
      throw Object.assign(new Error("portal_session_invalid"), {
        code: "portal_session_invalid",
        status: 401,
        details: { reason: "maintained_identity_missing" },
      });
    }

    request.cookies.set(PORTAL_SESSION_COOKIE_NAME, maintained.sessionData);
    requestHeaders.set("cookie", request.headers.get("cookie") || "");
    requestHeaders.set(
      PORTAL_MAINTAINED_IDENTITY_HEADER,
      serializeMaintainedPortalIdentity(
        maintained.identity,
        getSessionContextSecret(),
      ),
    );
    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });
    if (maintained.refreshed) {
      response.cookies.set({
        name: PORTAL_SESSION_COOKIE_NAME,
        value: maintained.sessionData,
        path: "/",
        maxAge: PORTAL_SESSION_MAX_AGE_SECONDS,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
      observeMaintenance({ outcome: "refreshed", reason: "invalid_jwt" });
    }
    return response;
  } catch (error) {
    if (
      error?.code === "identity_provider_unavailable" &&
      error?.status === 503
    ) {
      // Preserve the sealed cookie while WorkOS is transiently unavailable so
      // its refresh token can be retried on a later request.
      observeMaintenance({
        outcome: "preserved",
        reason: safeMaintenanceReason(error),
      });
      return NextResponse.next({ request: { headers: requestHeaders } });
    }

    request.cookies.delete(PORTAL_SESSION_COOKIE_NAME);
    requestHeaders.set("cookie", request.headers.get("cookie") || "");
    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });
    response.cookies.set({
      name: PORTAL_SESSION_COOKIE_NAME,
      value: "",
      path: "/",
      maxAge: 0,
      expires: new Date(0),
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    observeMaintenance({
      outcome: "cleared",
      reason: safeMaintenanceReason(error),
    });
    return response;
  }
}

function safeMaintenanceReason(error) {
  const reason = error?.details?.reason || error?.code || "unknown";
  return /^[a-z0-9_]{1,80}$/.test(String(reason))
    ? String(reason)
    : "unknown";
}

function observePortalSessionMaintenance(event) {
  console.info("aitusa_portal_session_maintenance", event);
}

export function proxy(request) {
  if (!request) return getPortalPrototypeGateResponse() || NextResponse.next();

  const { pathname } = request.nextUrl;
  const isLegacyEnglishHost = requestHost(request) === LEGACY_ENGLISH_HOST;

  if (isLegacyGonePath(pathname)) return goneResponse();

  const legacyDestination = getLegacyDestination(pathname);
  if (legacyDestination) {
    return NextResponse.redirect(
      redirectUrl(request, legacyDestination, isLegacyEnglishHost),
      308,
    );
  }

  if (isLegacyEnglishHost) {
    return NextResponse.redirect(redirectUrl(request, pathname, true), 308);
  }

  if (pathname === "/portal" || pathname.startsWith("/portal/") || pathname.startsWith("/api/portal/")) {
    const gateResponse = getPortalPrototypeGateResponse();
    if (gateResponse) return gateResponse;
  }

  if (isPortalSessionPath(pathname)) {
    return forwardWithMaintainedPortalSession(request);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
