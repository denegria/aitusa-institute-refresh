import { PortalClaimError } from "../portalClaim/errors.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function validateGuardianCodeRequest(input = {}) {
  const guardianFirstName = normalizeName(input.guardianFirstName, "guardian_first_name_invalid");
  const guardianEmail = normalizeEmail(input.guardianEmail);
  if (input.guardianAttested !== true) {
    throw new PortalClaimError("guardian_attestation_required", 422);
  }
  if (input.noticeAccepted !== true) {
    throw new PortalClaimError("guardian_notice_acceptance_required", 422);
  }
  return {
    requestId: requireUuid(input.requestId, "request_id_invalid"),
    guardianFirstName,
    guardianEmail,
    guardianAttested: true,
    noticeAccepted: true,
    aiPracticeApproved: input.aiPracticeApproved === true,
    advisorContactApproved: input.advisorContactApproved === true,
  };
}

export function validateGuardianVerification(input = {}) {
  const code = typeof input.code === "string" ? input.code.trim() : "";
  if (!/^\d{6}$/.test(code)) {
    throw new PortalClaimError("magic_auth_code_invalid", 422);
  }
  return {
    challengeId: requireUuid(input.challengeId, "challenge_id_invalid"),
    requestId: requireUuid(input.requestId, "request_id_invalid"),
    code,
  };
}

export function validateGuardianFinalize(input = {}) {
  const submission = input.submission;
  if (!submission || typeof submission !== "object" || Array.isArray(submission)) {
    throw new PortalClaimError("guardian_submission_invalid", 422);
  }
  if (!Array.isArray(submission.selectedAnswers) || submission.selectedAnswers.length !== 62) {
    throw new PortalClaimError("guardian_submission_invalid", 422);
  }
  const selectedAnswers = submission.selectedAnswers.map((value) => {
    if (value === null) return null;
    if (typeof value !== "string" || value.length > 240) {
      throw new PortalClaimError("guardian_submission_invalid", 422);
    }
    return value;
  });
  const selfAssessment = sanitizeSelfAssessment(submission.selfAssessment);
  const goal = typeof submission.goal === "string" ? submission.goal.trim() : "";
  const writingSample = typeof submission.writingSample === "string"
    ? submission.writingSample.trim()
    : "";
  if (!goal || goal.length > 160 || writingSample.length > 2000) {
    throw new PortalClaimError("guardian_submission_invalid", 422);
  }
  return {
    challengeId: requireUuid(input.challengeId, "challenge_id_invalid"),
    requestId: requireUuid(input.requestId, "request_id_invalid"),
    childFirstName: normalizeName(input.childFirstName, "child_first_name_invalid"),
    submission: { selectedAnswers, selfAssessment, goal, writingSample },
  };
}

export function validateGuardianControl(input = {}) {
  const action = typeof input.action === "string" ? input.action : "";
  if (!["withdraw_consent", "unlink_child", "request_deletion"].includes(action)) {
    throw new PortalClaimError("guardian_control_action_invalid", 422);
  }
  return {
    childProfileId: requireUuid(input.childProfileId, "child_profile_id_invalid"),
    action,
  };
}

export function normalizeGuardianEmail(value) {
  return normalizeEmail(value);
}

function normalizeEmail(value) {
  const normalized = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (normalized.length < 3 || normalized.length > 254 || !EMAIL_PATTERN.test(normalized)) {
    throw new PortalClaimError("guardian_email_invalid", 422);
  }
  return normalized;
}

function normalizeName(value, code) {
  const normalized = typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
  if (!normalized || normalized.length > 80) throw new PortalClaimError(code, 422);
  return normalized;
}

function requireUuid(value, code) {
  if (typeof value !== "string" || !UUID_PATTERN.test(value)) {
    throw new PortalClaimError(code, 422);
  }
  return value;
}

function sanitizeSelfAssessment(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) return {};
  return Object.fromEntries(
    Object.entries(input)
      .filter(([key, value]) => /^[a-z][a-z0-9_-]{0,39}$/i.test(key) && Number.isInteger(value))
      .map(([key, value]) => [key, Math.min(Math.max(value, 0), 5)]),
  );
}
