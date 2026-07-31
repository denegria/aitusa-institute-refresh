import {
  assertPortalSameOrigin,
  getRequestMetadata,
  portalClaimFailure,
} from "../../../../src/portalClaim/http.server.js";
import {
  readPortalSessionCookie,
  serializeExpiredPortalSessionCookie,
} from "../../../../src/portalClaim/session.server.js";
import {
  getPortalAuthService,
  isPortalAuthServiceConfigured,
} from "../../../../src/portalAuth/runtime.server.js";
import { getPortalPrototypeGateResponse } from "../../../../src/portal/portalAvailability.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function createPortalSignOutHandler({
  isConfigured = isPortalAuthServiceConfigured,
  getService = getPortalAuthService,
  serializeExpiredCookie = serializeExpiredPortalSessionCookie,
  getGateResponse = getPortalPrototypeGateResponse,
} = {}) {
  return async function POST(request) {
    try {
      const gateResponse = getGateResponse();
      if (gateResponse) return gateResponse;
      assertPortalSameOrigin(request);
      if (isConfigured()) {
        try {
          await getService().revokeSession(
            readPortalSessionCookie(request),
            getRequestMetadata(request),
          );
        } catch {
          // Local sign-out must still succeed when provider or audit
          // persistence is temporarily unavailable.
        }
      }

      const headers = new Headers({
        "cache-control": "no-store, private",
        location: new URL("/portal/", request.url).toString(),
      });
      headers.append("set-cookie", serializeExpiredCookie());
      return new Response(null, { status: 303, headers });
    } catch (error) {
      return portalClaimFailure(error);
    }
  };
}

export const POST = createPortalSignOutHandler();
