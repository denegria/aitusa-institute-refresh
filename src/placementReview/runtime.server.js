import { getPortalDatabase, isPortalDatabaseConfigured } from "../diagnostic/db.server.js";
import { createNeonPlacementReviewRepository } from "./neonRepository.server.js";
import { createPlacementReviewService } from "./service.js";

let cachedService;
export function isPlacementReviewConfigured() { return isPortalDatabaseConfigured(); }
export function getPlacementReviewService() {
  if (cachedService) return cachedService;
  if (!isPlacementReviewConfigured()) throw new Error("placement_review_unavailable");
  cachedService = createPlacementReviewService({ repository: createNeonPlacementReviewRepository(getPortalDatabase()) });
  return cachedService;
}

export async function reconcileClaimedPlacementReviewsBestEffort(input = {}) {
  if (!isPlacementReviewConfigured()) return { scanned: 0, created: 0, replayed: 0, failed: 0, unavailable: true };
  try {
    const result = await getPlacementReviewService().reconcileClaimedReviews(input);
    if (result.failed > 0) console.error("placement_review_reconciliation_failed");
    return result;
  } catch {
    console.error("placement_review_reconciliation_failed");
    return { scanned: 0, created: 0, replayed: 0, failed: 1 };
  }
}
