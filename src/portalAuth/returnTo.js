import { isOpaqueReviewId } from "../placementReview/contract.js";
import { ENGLISH_PROGRAM_SLUGS, US_PUBLIC_PROGRAM_CODES } from "../registration/contract.js";

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
  if (audience !== "employee") {
    if (target.pathname !== "/inscribete/" || target.hash) return fallback;
    if (!target.search) return "/inscribete/";
    const courses = target.searchParams.getAll("curso");
    return courses.length === 1 && [...target.searchParams.keys()].every((key) => key === "curso")
      && (ENGLISH_PROGRAM_SLUGS.has(courses[0]) || US_PUBLIC_PROGRAM_CODES.has(courses[0]))
      ? `/inscribete/?curso=${encodeURIComponent(courses[0])}` : fallback;
  }
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
