const REVIEW_STATUSES = new Set(["pending", "in_review", "confirmed", "adjusted", "additional_review_required"]);
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function registrationPortalActor(snapshot, studentEmail) {
  const account = snapshot?.account;
  const email = String(account?.email || "").trim().toLowerCase();
  if (!account?.accountId || account.accountType !== "adult_student"
    || !email || email !== String(studentEmail || "").trim().toLowerCase()) {
    return { portalAccountId: null, placement: null };
  }
  const result = snapshot.result;
  const attemptId = String(result?.attemptId || "").trim();
  const recommendedLevel = String(result?.recommendedLevelLabel || "").trim().slice(0, 120);
  const reviewStatus = String(result?.placementReviewStatus || "pending").trim();
  const confirmed = ["confirmed", "adjusted"].includes(reviewStatus);
  const finalLevel = confirmed ? String(result?.finalLevel || "").trim().slice(0, 120) : "";
  const placement = UUID_PATTERN.test(attemptId) && recommendedLevel
    && REVIEW_STATUSES.has(reviewStatus) && (!confirmed || finalLevel)
    ? { attemptId, recommendedLevel, reviewStatus, finalLevel: finalLevel || null }
    : null;
  return { portalAccountId: account.accountId, placement };
}

export function registrationPlacementDisplay(placement) {
  if (!placement) return null;
  const confirmed = ["confirmed", "adjusted"].includes(placement.reviewStatus);
  return {
    status: confirmed ? "confirmed" : placement.reviewStatus === "additional_review_required" ? "additional_review_required" : "recommended",
    levelLabel: confirmed ? placement.finalLevel : placement.recommendedLevel,
  };
}
