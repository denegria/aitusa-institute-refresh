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

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function createPortalAuthVerifyHandler({
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
          { ok: false, error: "passwordless_sign_in_unavailable" },
          { status: 503 },
        );
      }

      const authenticated = await getService().verifySignInCode(
        await parsePortalClaimJson(request),
        getRequestMetadata(request),
      );
      return portalClaimJson(
        {
          ok: true,
          authenticated: true,
          portalHref: "/portal/",
        },
        {
          cookie: serializeSessionCookie(authenticated.sessionData),
        },
      );
    } catch (error) {
      return portalClaimFailure(error);
    }
  };
}

export const POST = createPortalAuthVerifyHandler();
