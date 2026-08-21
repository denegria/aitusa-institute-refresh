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
  getPortalClaimService,
  isPortalClaimServiceConfigured,
} from "../../../../../src/portalClaim/runtime.server.js";
import { readPortalSessionCookie } from "../../../../../src/portalClaim/session.server.js";
import { savePlacementContactPreferenceForAccount } from "../../../../../src/placementContact/save.server.js";

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
    const input = await parsePortalClaimJson(request);
    const claimed = await service.finalizeClaim(input, identity);
    const contact = await saveClaimContactPreference(claimed, input.contactPreference);
    if (process.env.VERCEL) after(async () => {
      await reconcileClaimedPlacementReviewsBestEffort({ resultId: claimed.result?.id });
      await dispatchCrmOutboxBestEffort();
    });
    return portalClaimJson({ ok: true, claimed: true, ...claimed, ...contact });
  } catch (error) {
    return portalClaimFailure(error);
  }
}

async function saveClaimContactPreference(claimed, input) {
  if (!input) return {};
  try {
    const preference = await savePlacementContactPreferenceForAccount({
      accountId: claimed.account?.id,
      accountType: claimed.account?.accountType,
      attemptId: claimed.result?.attemptId,
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
