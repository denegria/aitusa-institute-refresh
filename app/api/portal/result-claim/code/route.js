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
    const challenge = await getPortalClaimService().requestCode(
      await parsePortalClaimJson(request),
      getRequestMetadata(request),
    );
    return portalClaimJson({ ok: true, ...challenge });
  } catch (error) {
    return portalClaimFailure(error);
  }
}
