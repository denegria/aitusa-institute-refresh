import { StudyBuddyError } from "./errors.js";

export const SESSION_STATES = Object.freeze(["reserved", "active", "completed", "expired", "escalated"]);

export function validateTurn({ session, accountId, learnerTurn, retryAttempt, baseAttemptState = null, now }) {
  if (!session || !SESSION_STATES.includes(session.state)) throw new StudyBuddyError("foreign_session", 404);
  if (session.accountId !== accountId) throw new StudyBuddyError("foreign_session", 404);
  if (session.expiresAt <= now) throw new StudyBuddyError("session_expired", 409);
  if (["completed", "expired", "escalated"].includes(session.state)) throw new StudyBuddyError("session_expired", 409);
  const expectedTurn = retryAttempt === 1 ? session.lastLearnerTurn : session.turnCount + 1;
  if (!Number.isInteger(learnerTurn) || learnerTurn !== expectedTurn || learnerTurn < 1 || learnerTurn > 5) {
    throw new StudyBuddyError("invalid_request", 400);
  }
  if (!Number.isInteger(retryAttempt) || retryAttempt < 0 || retryAttempt > 1) {
    throw new StudyBuddyError("invalid_request", 400);
  }
  if (retryAttempt === 1 && !["completed", "failed", "ambiguous"].includes(baseAttemptState)) throw new StudyBuddyError("retry_limit_reached", 409);
  return true;
}

export function nextSessionState(session, { outcome = "success", retryAttempt = 0, baseAttemptState = null, now }) {
  const turnCount = session.turnCount + (retryAttempt === 0 || baseAttemptState !== "completed" ? 1 : 0);
  if (outcome === "escalated") return { state: "escalated", turnCount };
  if (turnCount >= 5) return { state: "completed", turnCount, completedAt: now };
  return { state: "active", turnCount };
}
