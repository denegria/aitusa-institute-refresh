import {
  assertPortalSameOrigin,
  getRequestMetadata,
  parsePortalClaimJson,
  portalClaimFailure,
} from "../../../../../../src/portalClaim/http.server.js";
import {
  getPortalAuthService,
  isPortalAuthServiceConfigured,
} from "../../../../../../src/portalAuth/runtime.server.js";
import {
  readPortalPasswordResetCookie,
  serializeExpiredPortalPasswordResetCookie,
  unsealPortalPasswordResetToken,
} from "../../../../../../src/portalAuth/passwordResetSession.server.js";
import { serializeExpiredPortalSessionCookie } from "../../../../../../src/portalClaim/session.server.js";
import { PortalClaimError } from "../../../../../../src/portalClaim/errors.js";
import { getPortalPrototypeGateResponse } from "../../../../../../src/portal/portalAvailability.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function createPortalPasswordResetConfirmHandler({
  isConfigured = isPortalAuthServiceConfigured,
  getService = getPortalAuthService,
  getGateResponse = getPortalPrototypeGateResponse,
  readResetCookie = readPortalPasswordResetCookie,
  unsealToken = unsealPortalPasswordResetToken,
  expireResetCookie = serializeExpiredPortalPasswordResetCookie,
  expireSessionCookie = serializeExpiredPortalSessionCookie,
} = {}) {
  return async function POST(request) {
    try {
      const gateResponse = getGateResponse();
      if (gateResponse) return gateResponse;
      assertPortalSameOrigin(request);
      if (!isConfigured()) {
        throw new PortalClaimError("password_reset_unavailable", 503);
      }
      const token = unsealToken(readResetCookie(request));
      if (!token) throw new PortalClaimError("password_reset_invalid", 422);

      const result = await getService().confirmPasswordReset(
        token,
        await parsePortalClaimJson(request),
        getRequestMetadata(request),
      );
      const headers = new Headers({ "cache-control": "no-store, private" });
      headers.append("set-cookie", expireResetCookie());
      headers.append("set-cookie", expireSessionCookie());
      return Response.json({ ok: true, ...result }, { status: 200, headers });
    } catch (error) {
      return portalClaimFailure(error);
    }
  };
}

export const POST = createPortalPasswordResetConfirmHandler();
