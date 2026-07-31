import { StudyBuddyError } from "./errors.js";
import { STUDY_BUDDY_LIMITS } from "./config.server.js";

export function validateTurnRequest(value) {
  if (!value || typeof value !== "object") throw new StudyBuddyError("invalid_request");
  if (typeof value.operationId !== "string" || !/^[a-zA-Z0-9_-]{8,80}$/.test(value.operationId)) {
    throw new StudyBuddyError("invalid_request");
  }
  if (typeof value.text !== "string" || value.text.trim().length === 0 || value.text.length > STUDY_BUDDY_LIMITS.maxTextCharacters) {
    throw new StudyBuddyError("invalid_request");
  }
  if (Object.keys(value).some((key) => ["accountId", "resultId", "guardian", "model", "prompt", "scenario", "budget", "policy"].includes(key))) {
    throw new StudyBuddyError("invalid_request");
  }
  return { operationId: value.operationId, text: value.text.trim() };
}

export function enforceSameOrigin(request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host || new URL(origin).host !== host) throw new StudyBuddyError("invalid_origin", 403);
}
