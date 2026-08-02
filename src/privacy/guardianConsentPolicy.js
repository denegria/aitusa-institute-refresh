export const GUARDIAN_CONSENT_POLICY_VERSION =
  "aitusa-under-13-guardian-consent-2026-08-02-v1";

export const GUARDIAN_CONSENT_POLICY = Object.freeze({
  minimumSelfServiceAge: 13,
  ageGate: "self_declared_age_band",
  under13AgeBand: "under_13",
  anonymousDiagnosticAllowed: true,
  anonymousResultAllowed: true,
  preConsentRetention: "session_only",
  preConsentIdentityCollectionAllowed: false,
  guardianVerificationMethod: "verified_email_plus_attestation",
  directNoticeRequired: true,
  confirmationAndWithdrawalReceiptRequired: true,
  guardianOwnsAccount: true,
  childProfileFieldsAfterConsent: Object.freeze(["firstName", "ageBand"]),
  childDateOfBirthRequired: false,
  aiPracticeConsentSeparate: true,
  advisorContactConsentSeparate: true,
  marketingSmsConsentSeparate: true,
  rawAiAudioStorageAllowed: false,
  rawAiTranscriptStorageAllowed: false,
  withdrawalAndDeletionControlsRequired: true,
  realAiProviderActivationIssue: "MIS-345",
});

export const GUARDIAN_DIRECT_NOTICE = Object.freeze({
  title: "Autorización del padre, madre o tutor",
  summary:
    "AIT USA guardará el resultado del examen en una cuenta del adulto verificado y creará un perfil infantil vinculado con solo el nombre y la banda de edad necesarias.",
  confirmation:
    "El adulto recibirá una confirmación con instrucciones para revisar, retirar la autorización, desvincular el perfil o solicitar la eliminación de los datos.",
});

const UNDER_13_SESSION_ACTIONS = new Set([
  "take_diagnostic",
  "view_result",
]);
const UNDER_13_GUARDIAN_ACTIONS = new Set([
  "save_result",
  "create_portal_account",
  "access_portal",
]);

export function evaluateGuardianAccess({
  ageBand,
  action,
  consent = {},
}) {
  if (ageBand !== GUARDIAN_CONSENT_POLICY.under13AgeBand) {
    return { allowed: true, guardianRequired: false, retention: "standard" };
  }

  if (UNDER_13_SESSION_ACTIONS.has(action)) {
    return {
      allowed: true,
      guardianRequired: false,
      retention: "session_only",
      identityCollectionAllowed: false,
    };
  }

  if (
    consent.policyVersion !== GUARDIAN_CONSENT_POLICY_VERSION ||
    consent.status !== "verified" ||
    consent.verificationMethod !== GUARDIAN_CONSENT_POLICY.guardianVerificationMethod ||
    consent.guardianAttested !== true
  ) {
    return denied("verified_guardian_consent_required");
  }

  if (UNDER_13_GUARDIAN_ACTIONS.has(action)) {
    return { allowed: true, guardianRequired: true, retention: "account_policy" };
  }

  if (action === "use_study_buddy") {
    return consent.aiPracticeApproved === true
      ? { allowed: true, guardianRequired: true, retention: "safe_summary_only" }
      : denied("guardian_ai_practice_consent_required");
  }

  if (action === "request_advisor_contact") {
    return consent.advisorContactApproved === true
      ? { allowed: true, guardianRequired: true, retention: "consent_record" }
      : denied("guardian_advisor_contact_consent_required");
  }

  if (action === "marketing_sms") {
    return consent.marketingSmsOptIn === true
      ? { allowed: true, guardianRequired: true, retention: "consent_record" }
      : denied("guardian_marketing_sms_consent_required");
  }

  return denied("unknown_guardian_action");
}

function denied(reason) {
  return { allowed: false, guardianRequired: true, reason };
}
