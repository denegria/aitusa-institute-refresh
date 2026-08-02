import { after } from "next/server.js";
import { dispatchCrmOutboxBestEffort } from "../../../../../src/crm/runtime.server.js";
import {
  assertPortalSameOrigin,
  parsePortalClaimJson,
  portalClaimFailure,
  portalClaimJson,
} from "../../../../../src/portalClaim/http.server.js";
import {
  getPortalClaimService,
  isPortalClaimServiceConfigured,
} from "../../../../../src/portalClaim/runtime.server.js";
import { readPortalSessionCookie } from "../../../../../src/portalClaim/session.server.js";

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
    const service = getPortalClaimService();
    const identity = await service.authenticateSession(
      readPortalSessionCookie(request),
    );
    const claimed = await service.finalizeClaim(
      await parsePortalClaimJson(request),
      identity,
    );
    if (process.env.VERCEL) after(() => dispatchCrmOutboxBestEffort());
    return portalClaimJson({ ok: true, claimed: true, ...claimed });
  } catch (error) {
    return portalClaimFailure(error);
  }
}
