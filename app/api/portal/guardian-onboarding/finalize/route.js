import { after } from "next/server.js";
import { dispatchCrmOutboxBestEffort } from "../../../../../src/crm/runtime.server.js";
import { reconcileClaimedPlacementReviewsBestEffort } from "../../../../../src/placementReview/runtime.server.js";
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
import { savePlacementContactPreferenceForAccount } from "../../../../../src/placementContact/save.server.js";

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
    const input = await parsePortalClaimJson(request);
    const receipt = await service.finalize(input, identity);
    const contact = await saveGuardianContactPreference(receipt, input.contactPreference);
    if (process.env.VERCEL) after(async () => {
      await reconcileClaimedPlacementReviewsBestEffort({ resultId: receipt.result?.id });
      await dispatchCrmOutboxBestEffort();
    });
    return portalClaimJson({ ok: true, saved: true, ...receipt, ...contact });
  } catch (error) {
    return portalClaimFailure(error);
  }
}

async function saveGuardianContactPreference(receipt, input) {
  if (!input) return {};
  try {
    const preference = await savePlacementContactPreferenceForAccount({
      accountId: receipt.account?.id,
      accountType: receipt.account?.accountType,
      attemptId: receipt.result?.attemptId,
      input,
    });
    return { contactPreferenceSaved: true, contactPreference: preference };
  } catch (error) {
    return {
      contactPreferenceSaved: false,
      contactPreferencePending: true,
      contactPreferenceError: error?.code || "placement_contact_unavailable",
    };
  }
}
