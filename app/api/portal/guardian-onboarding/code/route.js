import {
  assertPortalSameOrigin,
  getRequestMetadata,
  parsePortalClaimJson,
  portalClaimFailure,
  portalClaimJson,
} from "../../../../../src/portalClaim/http.server.js";
import {
  getGuardianOnboardingService,
  isGuardianOnboardingConfigured,
} from "../../../../../src/guardianOnboarding/runtime.server.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    assertPortalSameOrigin(request);
    if (!isGuardianOnboardingConfigured()) {
      return portalClaimJson({ ok: false, error: "guardian_onboarding_unavailable" }, { status: 503 });
    }
    const result = await getGuardianOnboardingService().requestCode(
      await parsePortalClaimJson(request),
      getRequestMetadata(request),
    );
    return portalClaimJson({ ok: true, ...result });
  } catch (error) {
    return portalClaimFailure(error);
  }
}
