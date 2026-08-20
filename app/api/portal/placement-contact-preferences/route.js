import { randomUUID } from "node:crypto";
import { getPortalDatabase, isPortalDatabaseConfigured } from "../../../../src/diagnostic/db.server.js";
import { createNeonPlacementContactRepository } from "../../../../src/placementContact/neonRepository.server.js";
import { validatePlacementContactPreference } from "../../../../src/placementContact/contract.js";
import { resolveAuthenticatedPortalSnapshot } from "../../../../src/portalAuth/sessionResolver.server.js";
import { assertPortalSameOrigin, parsePortalClaimJson, portalClaimFailure, portalClaimJson } from "../../../../src/portalClaim/http.server.js";
import { PortalClaimError } from "../../../../src/portalClaim/errors.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(request) {
  try {
    assertPortalSameOrigin(request);
    if (!isPortalDatabaseConfigured()) throw new PortalClaimError("placement_contact_unavailable", 503);
    const snapshot = await resolveAuthenticatedPortalSnapshot(request);
    const input = await parsePortalClaimJson(request);
    const guardianAccount = snapshot.account.accountType === "guardian";
    // A submitted number is contact information, not authentication evidence.
    // Never trust a browser-supplied verification flag; verification remains
    // false until a future server-owned verification flow proves otherwise.
    const validation = validatePlacementContactPreference({
      ...input,
      verifiedEmail: true,
      verifiedMobile: false,
      ageBand: guardianAccount ? "under_13" : "age_13_plus",
      guardianOwned: guardianAccount,
      guardianVerified: guardianAccount,
    });
    if (!validation.ok) return portalClaimJson({ ok: false, error: validation.errors[0] }, { status: 422 });
    const saved = await createNeonPlacementContactRepository(getPortalDatabase()).save({ id: randomUUID(), accountId: snapshot.account.accountId, attemptId: input.attemptId, preference: validation.preference, occurredAt: new Date().toISOString() });
    if (!saved) throw new PortalClaimError("placement_contact_forbidden", 403);
    return portalClaimJson({ ok: true, saved: true, preference: { channel: validation.preference.preferredChannel, verifiedEmail: true, verifiedMobile: false } });
  } catch (error) { return portalClaimFailure(error); }
}
