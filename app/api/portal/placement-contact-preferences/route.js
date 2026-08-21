import { after } from "next/server.js";
import { dispatchCrmOutboxBestEffort } from "../../../../src/crm/runtime.server.js";
import { savePlacementContactPreferenceForAccount } from "../../../../src/placementContact/save.server.js";
import { resolveAuthenticatedPortalSnapshot } from "../../../../src/portalAuth/sessionResolver.server.js";
import { assertPortalSameOrigin, parsePortalClaimJson, portalClaimFailure, portalClaimJson } from "../../../../src/portalClaim/http.server.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(request) {
  try {
    assertPortalSameOrigin(request);
    const snapshot = await resolveAuthenticatedPortalSnapshot(request);
    const input = await parsePortalClaimJson(request);
    const preference = await savePlacementContactPreferenceForAccount({
      accountId: snapshot.account.accountId,
      accountType: snapshot.account.accountType,
      attemptId: input.attemptId,
      input,
    });
    if (process.env.VERCEL) after(() => dispatchCrmOutboxBestEffort());
    return portalClaimJson({ ok: true, saved: true, preference });
  } catch (error) { return portalClaimFailure(error); }
}
