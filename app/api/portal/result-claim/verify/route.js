import {
  assertPortalSameOrigin,
  getRequestMetadata,
  parsePortalClaimJson,
  portalClaimFailure,
  portalClaimJson,
} from "../../../../../src/portalClaim/http.server.js";
import {
  getPortalClaimService,
  isPortalClaimServiceConfigured,
} from "../../../../../src/portalClaim/runtime.server.js";
import { serializePortalSessionCookie } from "../../../../../src/portalClaim/session.server.js";
import { PortalClaimError } from "../../../../../src/portalClaim/errors.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    assertPortalSameOrigin(request);
    if (!isPortalClaimServiceConfigured()) {
      return portalClaimJson(
        { ok: false, error: "passwordless_claim_unavailable" },
        { status: 503 },
      );
    }
    const input = await parsePortalClaimJson(request);
    const service = getPortalClaimService();
    const verified = await service.verifyCode(
      input,
      getRequestMetadata(request),
    );
    const cookie = serializePortalSessionCookie(verified.sessionData);
    try {
      const claimed = await service.finalizeClaim(input, verified.identity);
      return portalClaimJson(
        { ok: true, claimed: true, ...claimed },
        { cookie },
      );
    } catch (error) {
      if (error instanceof PortalClaimError) {
        return portalClaimFailure(error, { cookie });
      }
      return portalClaimJson(
        {
          ok: false,
          error: "claim_finalize_pending",
          retryable: true,
          challengeId: input.challengeId,
          claimId: input.claimId,
        },
        { status: 503, cookie },
      );
    }
  } catch (error) {
    return portalClaimFailure(error);
  }
}
