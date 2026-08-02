import {
  assertPortalSameOrigin,
  parsePortalClaimJson,
  portalClaimFailure,
  portalClaimJson,
} from "../../../../../src/portalClaim/http.server.js";
import {
  getGuardianOnboardingService,
  isGuardianOnboardingConfigured,
} from "../../../../../src/guardianOnboarding/runtime.server.js";
import { readPortalSessionCookie } from "../../../../../src/portalClaim/session.server.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    assertPortalSameOrigin(request);
    if (!isGuardianOnboardingConfigured()) {
      return portalClaimJson({ ok: false, error: "guardian_onboarding_unavailable" }, { status: 503 });
    }
    const service = getGuardianOnboardingService();
    const identity = await service.authenticateSession(readPortalSessionCookie(request));
    const receipt = await service.finalize(await parsePortalClaimJson(request), identity);
    return portalClaimJson({ ok: true, saved: true, ...receipt });
  } catch (error) {
    return portalClaimFailure(error);
  }
}
