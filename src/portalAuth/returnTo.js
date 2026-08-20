import { isOpaqueReviewId } from "../placementReview/contract.js";

const DEFAULT_PORTAL_HREF = "/portal/";
const DEFAULT_EMPLOYEE_HREF = "/employee";
const PLACEMENT_REVIEW_PATH = "/employee/placement-reviews";
const EMPLOYEE_PATHS = new Set([DEFAULT_EMPLOYEE_HREF, PLACEMENT_REVIEW_PATH, "/employee/team"]);

export function sanitizePortalReturnTo(value, audience = "student") {
  const fallback = audience === "employee" ? DEFAULT_EMPLOYEE_HREF : DEFAULT_PORTAL_HREF;
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  let target;
  try {
    target = new URL(value, "https://portal-return.local");
  } catch {
    return fallback;
  }

  if (target.origin !== "https://portal-return.local") return fallback;
  if (audience !== "employee") return fallback;
  const pathname = target.pathname.replace(/\/$/, "") || "/";
  if (!EMPLOYEE_PATHS.has(pathname)) {
    return fallback;
  }

  if (pathname !== PLACEMENT_REVIEW_PATH && target.search) return fallback;

  const reviewIds = target.searchParams.getAll("review");
  if (reviewIds.length > 1 || [...target.searchParams.keys()].some((key) => key !== "review")) {
    return fallback;
  }
  if (reviewIds.length === 1 && !isOpaqueReviewId(reviewIds[0])) {
    return fallback;
  }

  return `${pathname}${target.search}`;
}
