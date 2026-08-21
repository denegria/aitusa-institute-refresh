import { after } from "next/server.js";
import { dispatchCrmOutboxBestEffort } from "../../../../../src/crm/runtime.server.js";
import { reconcileClaimedPlacementReviewsBestEffort } from "../../../../../src/placementReview/runtime.server.js";
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
    const input = await parsePortalClaimJson(request);
    const service = getPortalClaimService();
    const verified = await service.verifyCode(
      input,
      getRequestMetadata(request),
    );
    const cookie = serializePortalSessionCookie(verified.sessionData);
    try {
      const claimed = await service.finalizeClaim(input, verified.identity);
      const contact = await saveClaimContactPreference(claimed, input.contactPreference);
      if (process.env.VERCEL) after(async () => {
        await reconcileClaimedPlacementReviewsBestEffort({ resultId: claimed.result?.id });
        await dispatchCrmOutboxBestEffort();
      });
      return portalClaimJson(
        { ok: true, claimed: true, ...claimed, ...contact },
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
      contactPreferenceError: error instanceof PortalClaimError ? error.code : "placement_contact_unavailable",
    };
  }
}
