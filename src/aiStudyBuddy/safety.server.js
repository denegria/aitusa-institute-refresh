import { StudyBuddyError } from "./errors.js";

const FORBIDDEN_CONTROL_PATTERNS = /(?:ignore (?:previous|all)|system prompt|change (?:the )?(?:model|scenario|policy|budget)|developer message)/i;
export const SAFE_FOCUS_CODES = Object.freeze(["meaning_acknowledged", "focus_pronunciation", "focus_grammar", "escalation_needed"]);
export const SAFE_OUTCOME_CODES = Object.freeze(["success", "escalated"]);
export const SAFE_FEEDBACK_CODES = Object.freeze(["meaning_acknowledged", "try_again", "session_complete", "support_recommended"]);

export function isolateLearnerInput(text) {
  if (FORBIDDEN_CONTROL_PATTERNS.test(text)) throw new StudyBuddyError("invalid_request");
  return text;
}

export function validateProviderResult(value, { maxMicroUsd, expectedPlanVersion }) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new StudyBuddyError("provider_unavailable", 503);
  const allowed = new Set(["outcomeCode", "focusCode", "usage", "feedback", "planVersion"]);
  if (Object.keys(value).some((key) => !allowed.has(key))) throw new StudyBuddyError("provider_unavailable", 503);
  if (!SAFE_OUTCOME_CODES.includes(value.outcomeCode) || !SAFE_FOCUS_CODES.includes(value.focusCode) || !SAFE_FEEDBACK_CODES.includes(value.feedback)) {
    throw new StudyBuddyError("provider_unavailable", 503);
  }
  if (value.planVersion !== undefined && value.planVersion !== expectedPlanVersion) throw new StudyBuddyError("provider_unavailable", 503);
  const usage = value.usage;
  if (!usage || typeof usage !== "object" || Array.isArray(usage) || Object.keys(usage).some((key) => !["inputUnits", "outputUnits", "microUsd"].includes(key))) {
    throw new StudyBuddyError("provider_unavailable", 503);
  }
  for (const key of ["inputUnits", "outputUnits", "microUsd"]) {
    if (!Number.isSafeInteger(usage[key]) || usage[key] < 0) throw new StudyBuddyError("provider_unavailable", 503);
  }
  if (usage.inputUnits > 1_000_000 || usage.outputUnits > 1_000_000 || usage.microUsd > maxMicroUsd) {
    throw new StudyBuddyError("provider_unavailable", 503);
  }
  return Object.freeze({ outcomeCode: value.outcomeCode, focusCode: value.focusCode, feedback: value.feedback, usage: Object.freeze({ ...usage }) });
}
