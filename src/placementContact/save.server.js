import { randomUUID } from "node:crypto";
import { getPortalDatabase, isPortalDatabaseConfigured } from "../diagnostic/db.server.js";
import { PortalClaimError } from "../portalClaim/errors.js";
import { createNeonPlacementContactRepository } from "./neonRepository.server.js";
import { validatePlacementContactPreference } from "./contract.js";

/**
 * Persist a claimed placement contact choice against the account that just
 * completed the claim. Keeping the account id server-owned avoids depending on
 * a browser's previous session cookie when a second email is used on the same
 * device.
 */
export async function savePlacementContactPreferenceForAccount({
  accountId,
  accountType,
  attemptId,
  input,
}) {
  if (!isPortalDatabaseConfigured()) {
    throw new PortalClaimError("placement_contact_unavailable", 503);
  }

  const guardianAccount = accountType === "guardian";
  const validation = validatePlacementContactPreference({
    ...input,
    verifiedEmail: true,
    verifiedMobile: false,
    ageBand: guardianAccount ? "under_13" : "age_13_plus",
    guardianOwned: guardianAccount,
    guardianVerified: guardianAccount,
  });
  if (!validation.ok) {
    throw new PortalClaimError(validation.errors[0], 422);
  }

  const saved = await createNeonPlacementContactRepository(getPortalDatabase()).save({
    id: randomUUID(),
    accountId,
    attemptId,
    preference: validation.preference,
    occurredAt: new Date().toISOString(),
  });
  if (!saved) {
    throw new PortalClaimError("placement_contact_forbidden", 403);
  }
  return {
    channel: validation.preference.preferredChannel,
    verifiedEmail: true,
    verifiedMobile: false,
  };
}
