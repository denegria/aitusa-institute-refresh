import {
  assertPortalSameOrigin,
  getRequestMetadata,
  portalClaimFailure,
  portalClaimJson,
} from "../../../../../src/portalClaim/http.server.js";
import {
  getPortalAuthService,
  isPortalAuthServiceConfigured,
} from "../../../../../src/portalAuth/runtime.server.js";
import { readPortalSessionCookie } from "../../../../../src/portalClaim/session.server.js";
import { getPortalPrototypeGateResponse } from "../../../../../src/portal/portalAvailability.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function createPortalPasswordSetupHandler({
  isConfigured = isPortalAuthServiceConfigured,
  getService = getPortalAuthService,
  readSessionCookie = readPortalSessionCookie,
  getGateResponse = getPortalPrototypeGateResponse,
} = {}) {
  return async function POST(request) {
    try {
      const gateResponse = getGateResponse();
      if (gateResponse) return gateResponse;
      assertPortalSameOrigin(request);
      if (!isConfigured()) {
        return portalClaimJson(
          { ok: false, error: "password_setup_unavailable" },
          { status: 503 },
        );
      }

      const setup = await getService().requestAuthenticatedPasswordSetup(
        readSessionCookie(request),
        getRequestMetadata(request),
      );
      return portalClaimJson({ ok: true, ...setup }, { status: 202 });
    } catch (error) {
      return portalClaimFailure(error);
    }
  };
}

export const POST = createPortalPasswordSetupHandler();
