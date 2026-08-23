import {
  assertPortalSameOrigin,
  getRequestMetadata,
  parsePortalClaimJson,
  portalClaimFailure,
  portalClaimJson,
} from "../../../../../src/portalClaim/http.server.js";
import {
  getPortalAuthService,
  isPortalAuthServiceConfigured,
} from "../../../../../src/portalAuth/runtime.server.js";
import { serializePortalSessionCookie } from "../../../../../src/portalClaim/session.server.js";
import { getPortalPrototypeGateResponse } from "../../../../../src/portal/portalAvailability.js";
import { sanitizePortalReturnTo } from "../../../../../src/portalAuth/returnTo.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function createPortalPasswordHandler({
  isConfigured = isPortalAuthServiceConfigured,
  getService = getPortalAuthService,
  serializeSessionCookie = serializePortalSessionCookie,
  getGateResponse = getPortalPrototypeGateResponse,
} = {}) {
  return async function POST(request) {
    try {
      const gateResponse = getGateResponse();
      if (gateResponse) return gateResponse;
      assertPortalSameOrigin(request);
      if (!isConfigured()) {
        return portalClaimJson(
          { ok: false, error: "password_sign_in_unavailable" },
          { status: 503 },
        );
      }

      const body = await parsePortalClaimJson(request);
      const authenticated = await getService().signInWithPassword(
        body,
        getRequestMetadata(request),
      );
      return portalClaimJson(
        {
          ok: true,
          authenticated: true,
          portalHref: sanitizePortalReturnTo(body.returnTo, authenticated.audience),
        },
        { cookie: serializeSessionCookie(authenticated.sessionData) },
      );
    } catch (error) {
      return portalClaimFailure(error);
    }
  };
}

export const POST = createPortalPasswordHandler();
