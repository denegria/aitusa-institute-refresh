import { StudyBuddyError } from "./errors.js";
import { SAFE_FOCUS_CODES, SAFE_OUTCOME_CODES } from "./safety.server.js";

const EVENT_FIELDS = Object.freeze({
  code: new Set(["authenticated", "completed", "provider_unavailable", "circuit_open", "session_expired", "retry_limit_reached"]),
  state: new Set(["active", "completed", "expired", "escalated"]),
  turnCount: { min: 0, max: 5 },
  retryCount: { min: 0, max: 5 },
  outcomeCode: new Set(SAFE_OUTCOME_CODES),
  focusCode: new Set(SAFE_FOCUS_CODES),
});
const SCENARIOS = new Set(["daily_routine", "workplace_exchange", "guided_discussion"]);
const USE_CASES = new Set(["lesson_review", "conversation_roleplay"]);

export function toSafeStudyBuddyEvent(event = {}) {
  const safe = {};
  for (const [key, rule] of Object.entries(EVENT_FIELDS)) {
    const value = event[key];
    if (rule instanceof Set && rule.has(value)) safe[key] = value;
    if (!(rule instanceof Set) && Number.isInteger(value) && value >= rule.min && value <= rule.max) safe[key] = value;
  }
  return safe;
}

export function buildCrmSafeSummary({ session, outcomeCode }) {
  if (!session || !/^[a-zA-Z0-9-]{2,128}$/.test(session.id) || !["completed", "escalated"].includes(session.state) || !SCENARIOS.has(session.scenario) || !USE_CASES.has(session.useCase) || !Number.isInteger(session.turnCount) || session.turnCount < 1 || session.turnCount > 5 || !SAFE_OUTCOME_CODES.includes(outcomeCode)) {
    throw new StudyBuddyError("invalid_request", 400);
  }
  return Object.freeze({
    eventType: "ai_practice_completed",
    idempotencyKey: `ai-practice:${session.id}:completed`,
    sessionState: session.state,
    scenario: session.scenario,
    useCase: session.useCase,
    turnCount: session.turnCount,
    outcomeCode,
  });
}
