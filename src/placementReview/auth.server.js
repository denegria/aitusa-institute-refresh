import { sql } from "drizzle-orm";
import { getPortalDatabase } from "../diagnostic/db.server.js";
import { PortalClaimError } from "../portalClaim/errors.js";
import { resolveAuthenticatedPortalIdentity } from "../portalAuth/sessionResolver.server.js";
import { PlacementReviewError } from "./errors.js";

export async function resolvePlacementReviewActor(request, { resolveSnapshot = resolveAuthenticatedPortalIdentity, database = getPortalDatabase() } = {}) {
  let snapshot;
  try {
    snapshot = await resolveSnapshot(request);
  } catch (error) {
    if (error instanceof PortalClaimError && error.status === 401) {
      throw new PlacementReviewError("placement_review_unauthenticated", 401);
    }
    throw error;
  }
  const accountId = snapshot?.account?.accountId;
  if (!accountId) throw new PlacementReviewError("placement_review_unauthenticated", 401);
  const result = await database.execute(sql`
    select business_unit, role from employee_review_roles
    where portal_account_id = ${accountId}::uuid and active = true limit 1
  `);
  const row = (Array.isArray(result) ? result : result?.rows || [])[0];
  if (!row || row.business_unit !== "ait_usa" || !["senior", "admin"].includes(row.role)) {
    throw new PlacementReviewError("placement_review_forbidden", 403);
  }
  return {
    accountId,
    businessUnit: row.business_unit,
    role: row.role,
    firstName: snapshot.account.firstName || "Equipo AIT",
  };
}
