import {
  sealPortalPasswordResetToken,
  serializePortalPasswordResetCookie,
} from "../../../../src/portalAuth/passwordResetSession.server.js";
import { getPortalPrototypeGateResponse } from "../../../../src/portal/portalAvailability.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function createPortalPasswordResetStartHandler({
  getGateResponse = getPortalPrototypeGateResponse,
  sealToken = sealPortalPasswordResetToken,
  serializeCookie = serializePortalPasswordResetCookie,
} = {}) {
  return async function GET(request) {
    const gateResponse = getGateResponse();
    if (gateResponse) return gateResponse;

    const requestUrl = new URL(request.url);
    const cleanUrl = new URL("/portal/reset-password/", requestUrl);
    const token = requestUrl.searchParams.get("token");
    const headers = new Headers({
      "cache-control": "no-store, private",
      "referrer-policy": "no-referrer",
      location: cleanUrl.toString(),
    });

    try {
      headers.append("set-cookie", serializeCookie(sealToken(token)));
    } catch {
      cleanUrl.searchParams.set("error", "invalid_link");
      headers.set("location", cleanUrl.toString());
    }
    return new Response(null, { status: 303, headers });
  };
}

export const GET = createPortalPasswordResetStartHandler();
