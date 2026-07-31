import { StudyBuddyError } from "./errors.js";

export const SESSION_STATES = Object.freeze(["reserved", "active", "completed", "expired", "escalated"]);

export function validateTurn({ session, learnerTurn, retryAttempt, now }) {
  if (!session || !SESSION_STATES.includes(session.state)) throw new StudyBuddyError("foreign_session", 404);
  if (session.accountId !== session.requestAccountId) throw new StudyBuddyError("foreign_session", 403);
  if (session.expiresAt <= now) throw new StudyBuddyError("session_expired", 409);
  if (["completed", "expired", "escalated"].includes(session.state)) throw new StudyBuddyError("session_expired", 409);
  if (!Number.isInteger(learnerTurn) || learnerTurn !== session.turnCount + 1) {
    throw new StudyBuddyError("invalid_request", 400);
  }
  if (!Number.isInteger(retryAttempt) || retryAttempt < 0 || retryAttempt > 1) {
    throw new StudyBuddyError("retry_limit_reached", 409);
  }
  return true;
}

export function nextSessionState(session, { outcome = "success", now }) {
  const turnCount = session.turnCount + 1;
  if (outcome === "escalated") return { state: "escalated", turnCount };
  if (turnCount >= 5) return { state: "completed", turnCount, completedAt: now };
  return { state: "active", turnCount };
}
