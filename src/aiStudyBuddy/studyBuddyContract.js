export const STUDY_BUDDY_CONTRACT_VERSION = "mis-340-v1";

export const AI_STUDY_BUDDY_USE_CASES = Object.freeze({
  pronunciation_drill: Object.freeze({ label: "Pronunciation drill" }),
  conversation_roleplay: Object.freeze({ label: "Conversation roleplay" }),
  lesson_review: Object.freeze({ label: "Lesson review" }),
  vocabulary_quiz: Object.freeze({ label: "Vocabulary quiz" }),
});

export const AI_PROVIDER_GATE = Object.freeze({
  browserProviderCallsAllowed: false,
  serverProviderCallsAllowed: false,
  providerDecisionDeferredTo: "MIS-345",
  deterministicFakeAllowedInStaging: true,
  rawAudioStorageAllowed: false,
  rawTranscriptStorageAllowed: false,
});

export const AI_COST_CONTROLS = Object.freeze({
  maxTurnsPerSession: 5,
  maxRetriesPerTurn: 1,
  acquisitionTrialSessionLimitPerVerifiedEmail: 1,
  maxEstimatedCentsPerSession: 0,
  hardStopForRealProviders: true,
});

export const AI_GUARDIAN_POLICY = Object.freeze({
  guardianRequiredUnderAge: 13,
  practiceAllowedWithoutGuardian: false,
  guardianVerificationRequired: true,
});

export const STUDY_BUDDY_CODES = Object.freeze([
  "authenticated",
  "unauthenticated",
  "account_blocked",
  "missing_result",
  "guardian_unresolved",
  "trial_consumed",
  "session_limit_reached",
  "daily_limit_reached",
  "provider_disabled",
  "provider_unavailable",
  "circuit_open",
  "session_expired",
  "foreign_session",
  "invalid_request",
  "request_too_large",
  "invalid_origin",
  "operation_replayed",
  "operation_completed",
  "retry_limit_reached",
  "completed",
  "escalated",
]);

export const SAFE_NEXT_ACTIONS = Object.freeze({
  unauthenticated: "sign_in",
  account_blocked: "contact_support",
  missing_result: "complete_placement",
  guardian_unresolved: "contact_support",
  trial_consumed: "view_portal",
  session_limit_reached: "try_later",
  daily_limit_reached: "try_tomorrow",
  provider_disabled: "try_later",
  provider_unavailable: "try_later",
  circuit_open: "try_later",
  session_expired: "start_new_session",
  foreign_session: "contact_support",
  invalid_request: "retry",
  request_too_large: "retry",
  invalid_origin: "retry",
  operation_replayed: "retry",
  operation_completed: "continue",
  retry_limit_reached: "continue",
  completed: "view_summary",
  escalated: "contact_support",
});

export function safePracticeResult(code, extra = {}) {
  const safeCode = STUDY_BUDDY_CODES.includes(code) ? code : "provider_unavailable";
  return {
    ok: ["authenticated", "completed", "escalated", "operation_completed"].includes(safeCode),
    code: safeCode,
    nextAction: SAFE_NEXT_ACTIONS[safeCode] ?? "contact_support",
    ...extra,
  };
}

export function toPracticeEligibilityDto(result) {
  return {
    ok: result.ok,
    code: result.code,
    nextAction: result.nextAction,
    practiceAvailable: result.code === "authenticated",
    contractVersion: STUDY_BUDDY_CONTRACT_VERSION,
  };
}
