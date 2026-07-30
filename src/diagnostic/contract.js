export const DIAGNOSTIC_VERSIONS = Object.freeze({
  productContract: "aitusa-placement-v2-draft-2026-07-30",
  questionBank: "legacy-62-pending-academic-review",
  answerKey: "legacy-key-v1-pending-academic-review",
  levelMap: "legacy-six-blocks-v1-pending-academic-review",
  scoring: "provisional-total-v1",
  resultCopy: "placement-result-es-v1",
});

export const DIAGNOSTIC_RETENTION = Object.freeze({
  anonymousAttemptDays: 7,
  claimedRawAnswerDays: 30,
  claimTokenMinutes: 15,
  purgeBatchSize: 250,
});

export const DIAGNOSTIC_STATUSES = Object.freeze([
  "started",
  "in_progress",
  "completed",
  "claim_pending",
  "claimed",
  "expired",
  "purged",
]);

export const CLAIM_STATUSES = Object.freeze([
  "pending",
  "consumed",
  "expired",
  "revoked",
]);

export const RESULT_STATUSES = Object.freeze([
  "provisional",
  "validated",
  "borderline",
  "advisor_review",
]);

export const RESUME_COOKIE_NAME = "aitusa_placement_resume";

export function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

export function addDays(date, days) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}
