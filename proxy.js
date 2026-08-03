import { NextResponse } from "next/server.js";
import { getPortalPrototypeGateResponse } from "./src/portal/portalAvailability.js";
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
    return getPortalPrototypeGateResponse() || NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
