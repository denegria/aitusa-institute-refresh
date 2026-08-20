import { resolvePortalSession } from "../portal/authBoundary.js";
import {
  GUARDIAN_CONSENT_POLICY,
  GUARDIAN_CONSENT_POLICY_VERSION,
} from "./guardianConsentPolicy.js";

export {
  GUARDIAN_CONSENT_POLICY,
  GUARDIAN_CONSENT_POLICY_VERSION,
  GUARDIAN_DIRECT_NOTICE,
  evaluateGuardianAccess,
} from "./guardianConsentPolicy.js";

export const SENSITIVE_DATA_FIELD_NAMES = Object.freeze([
  "audio",
  "audioBlob",
  "audioUrl",
  "cardNumber",
  "cvv",
  "password",
  "providerSubject",
  "rawAudio",
  "rawTranscript",
  "recordingUrl",
  "ssn",
  "token",
  "transcript",
]);

export const PRIVACY_DATA_CATEGORIES = Object.freeze({
  portal_profile_summary: Object.freeze({
    label: "Portal profile summary",
    requiredConsentBasis: "contract",
    storageAllowed: true,
    retentionClass: "account_lifecycle_plus_2y",
    deletionPolicy: "delete_or_deidentify_on_verified_request",
    guardianConsentRequiredForUnder13: false,
    adminAuditRequired: true,
  }),
  attendance_record: Object.freeze({
    label: "Attendance record",
    requiredConsentBasis: "contract",
    storageAllowed: true,
    retentionClass: "student_record_7y",
    deletionPolicy: "review_before_delete_academic_record",
    guardianConsentRequiredForUnder13: false,
    adminAuditRequired: true,
  }),
  lesson_progress_summary: Object.freeze({
    label: "Lesson progress summary",
    requiredConsentBasis: "contract",
    storageAllowed: true,
    retentionClass: "student_record_3y",
    deletionPolicy: "delete_or_deidentify_on_verified_request",
    guardianConsentRequiredForUnder13: false,
    adminAuditRequired: true,
  }),
  placement_review_record: Object.freeze({
    label: "Placement recommendation and review decision",
    requiredConsentBasis: "contract",
    storageAllowed: true,
    retentionClass: "student_record_5y",
    deletionPolicy: "review_before_delete_academic_record",
    guardianConsentRequiredForUnder13: false,
    adminAuditRequired: true,
  }),
  ai_practice_summary: Object.freeze({
    label: "AI practice safe summary",
    requiredConsentBasis: "explicit",
    storageAllowed: true,
    retentionClass: "learning_support_1y",
    deletionPolicy: "delete_on_verified_request",
    guardianConsentRequiredForUnder13: true,
    adminAuditRequired: true,
  }),
  ai_audio_raw: Object.freeze({
    label: "Raw AI practice audio",
    requiredConsentBasis: "explicit",
    storageAllowed: false,
    retentionClass: "zero_retention_no_store",
    deletionPolicy: "do_not_store",
    guardianConsentRequiredForUnder13: true,
    adminAuditRequired: true,
  }),
  ai_transcript_raw: Object.freeze({
    label: "Raw AI practice transcript",
    requiredConsentBasis: "explicit",
    storageAllowed: false,
    retentionClass: "zero_retention_no_store",
    deletionPolicy: "do_not_store",
    guardianConsentRequiredForUnder13: true,
    adminAuditRequired: true,
  }),
  payment_ledger_summary: Object.freeze({
    label: "Payment ledger summary",
    requiredConsentBasis: "contract",
    storageAllowed: true,
    retentionClass: "financial_record_7y",
    deletionPolicy: "retain_as_required_for_ledger_and_tax",
    guardianConsentRequiredForUnder13: true,
    adminAuditRequired: true,
  }),
  payment_sensitive_payload: Object.freeze({
    label: "Raw payment instrument payload",
    requiredConsentBasis: "explicit",
    storageAllowed: false,
    retentionClass: "blocked_provider_owned_only",
    deletionPolicy: "do_not_store",
    guardianConsentRequiredForUnder13: true,
    adminAuditRequired: true,
  }),
});

export const PRIVACY_DATA_CATEGORY_NAMES = Object.freeze(
  Object.keys(PRIVACY_DATA_CATEGORIES),
);

export function evaluatePrivacyGate({
  category,
  actor = {},
  consent = {},
  operation = "store",
}) {
  const policy = PRIVACY_DATA_CATEGORIES[category];
  if (!policy) {
    return denied("unknown_data_category");
  }

  if (operation === "store" && !policy.storageAllowed) {
    return denied("storage_not_approved", policy);
  }

  if (consent.basis !== policy.requiredConsentBasis) {
    return denied("consent_basis_required", policy);
  }

  if (
    (actor.ageBand === "under_13" || actor.ageGroup === "under_13") &&
    policy.guardianConsentRequiredForUnder13 &&
    consent.guardianApproval !== true
  ) {
    return denied("guardian_consent_required", policy);
  }

  return {
    allowed: true,
    policy,
    auditRequired: policy.adminAuditRequired,
    retentionClass: policy.retentionClass,
    deletionPolicy: policy.deletionPolicy,
  };
}

export function findSensitiveDataField(value) {
  const sensitiveNames = new Set(SENSITIVE_DATA_FIELD_NAMES);
  return findField(value, sensitiveNames);
}

export function getPrivacyPolicyStatus(accountKey = "studentActive") {
  const session = resolvePortalSession(accountKey);
  const account = session.account ?? null;

  return {
    account: account
      ? {
          portalAccountId: account.portalAccountId,
          status: account.status,
          roles: account.roles,
          privacyGateSatisfied: session.privacy?.gateSatisfied === true,
        }
      : null,
    sessionState: session.state,
    guardianPolicy: {
      version: GUARDIAN_CONSENT_POLICY_VERSION,
      minimumSelfServiceAge: GUARDIAN_CONSENT_POLICY.minimumSelfServiceAge,
      anonymousDiagnosticAllowed: GUARDIAN_CONSENT_POLICY.anonymousDiagnosticAllowed,
      guardianVerificationMethod: GUARDIAN_CONSENT_POLICY.guardianVerificationMethod,
      aiPracticeConsentSeparate: GUARDIAN_CONSENT_POLICY.aiPracticeConsentSeparate,
    },
    categories: PRIVACY_DATA_CATEGORY_NAMES.map((category) => {
      const policy = PRIVACY_DATA_CATEGORIES[category];
      return {
        category,
        label: policy.label,
        storageAllowed: policy.storageAllowed,
        retentionClass: policy.retentionClass,
        deletionPolicy: policy.deletionPolicy,
        guardianConsentRequiredForUnder13: policy.guardianConsentRequiredForUnder13,
        adminAuditRequired: policy.adminAuditRequired,
      };
    }),
  };
}

function denied(reason, policy = null) {
  return {
    allowed: false,
    reason,
    policy,
  };
}

function findField(value, sensitiveNames) {
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findField(item, sensitiveNames);
      if (found) return found;
    }
    return null;
  }

  if (!value || typeof value !== "object") return null;

  for (const [key, nested] of Object.entries(value)) {
    if (sensitiveNames.has(key)) return key;
    const found = findField(nested, sensitiveNames);
    if (found) return found;
  }
  return null;
}
