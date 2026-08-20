import { isOpaqueReviewId } from "../placementReview/contract.js";

const DEFAULT_PORTAL_HREF = "/portal/";
const PLACEMENT_REVIEW_PATH = "/employee/placement-reviews";

export function sanitizePortalReturnTo(value) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return DEFAULT_PORTAL_HREF;
  }

  let target;
  try {
    target = new URL(value, "https://portal-return.local");
  } catch {
    return DEFAULT_PORTAL_HREF;
  }

  if (target.origin !== "https://portal-return.local" || target.pathname !== PLACEMENT_REVIEW_PATH) {
    return DEFAULT_PORTAL_HREF;
  }

  const reviewIds = target.searchParams.getAll("review");
  if (reviewIds.length > 1 || [...target.searchParams.keys()].some((key) => key !== "review")) {
    return DEFAULT_PORTAL_HREF;
  }
  if (reviewIds.length === 1 && !isOpaqueReviewId(reviewIds[0])) {
    return DEFAULT_PORTAL_HREF;
  }

  return `${target.pathname}${target.search}`;
}
