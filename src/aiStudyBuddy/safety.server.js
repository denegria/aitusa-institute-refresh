import { StudyBuddyError } from "./errors.js";

const FORBIDDEN_CONTROL_PATTERNS = /(?:ignore (?:previous|all)|system prompt|change (?:the )?(?:model|scenario|policy|budget)|developer message)/i;
const SAFE_CODES = new Set(["meaning_acknowledged", "focus_pronunciation", "focus_grammar", "escalation_needed"]);

export function isolateLearnerInput(text) {
  if (FORBIDDEN_CONTROL_PATTERNS.test(text)) throw new StudyBuddyError("invalid_request");
  return text;
}

export function validateSafeFocusCode(code) {
  return SAFE_CODES.has(code) ? code : "meaning_acknowledged";
}
