import {
  assertPortalSameOrigin,
  parsePortalClaimJson,
  portalClaimFailure,
  portalClaimJson,
} from "../../../../../../src/portalClaim/http.server.js";
import {
  getGuardianOnboardingService,
  isGuardianOnboardingConfigured,
} from "../../../../../../src/guardianOnboarding/runtime.server.js";
import { readPortalSessionCookie } from "../../../../../../src/portalClaim/session.server.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request, { params }) {
  try {
    assertPortalSameOrigin(request);
    if (!isGuardianOnboardingConfigured()) {
      return portalClaimJson({ ok: false, error: "guardian_onboarding_unavailable" }, { status: 503 });
    }
    const service = getGuardianOnboardingService();
    const identity = await service.authenticateSession(readPortalSessionCookie(request));
    const body = await parsePortalClaimJson(request);
    const { childProfileId } = await params;
    const result = await service.manageChild({ ...body, childProfileId }, identity);
    return portalClaimJson({ ok: true, ...result });
  } catch (error) {
    return portalClaimFailure(error);
  }
}
