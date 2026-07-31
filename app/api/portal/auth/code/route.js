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
import { getPortalPrototypeGateResponse } from "../../../../../src/portal/portalAvailability.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function createPortalAuthCodeHandler({
  isConfigured = isPortalAuthServiceConfigured,
  getService = getPortalAuthService,
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

      const challenge = await getService().requestSignInCode(
        await parsePortalClaimJson(request),
        getRequestMetadata(request),
      );
      return portalClaimJson(
        { ok: true, ...challenge },
        { status: 202 },
      );
    } catch (error) {
      return portalClaimFailure(error);
    }
  };
}

export const POST = createPortalAuthCodeHandler();
