import { StudyBuddyError } from "./errors.js";

export function createMemoryStudyBuddyRepository({ now = () => new Date(), createId = (() => { let n = 0; return () => `study-${++n}`; })() } = {}) {
  const entitlements = new Map();
  const sessions = new Map();
  const operations = new Map();
  const dayBudgets = new Map();
  let circuitOpenUntil = null;
  return {
    async reserveStart({ accountId, emailHash, plan, limits }) {
      if (circuitOpenUntil && circuitOpenUntil > now()) throw new StudyBuddyError("circuit_open", 503);
      const existing = [...sessions.values()].find((item) => item.accountId === accountId && item.state === "active");
      if (existing) return { session: { ...existing }, replayed: true };
      if (entitlements.get(emailHash) === "consumed" || entitlements.get(emailHash) === "reserved") throw new StudyBuddyError("trial_consumed", 409);
      const dayKey = `${accountId}:${now().toISOString().slice(0, 10)}`;
      const current = dayBudgets.get(dayKey) || 0;
      if (current + limits.maxSessionMicroUsd > limits.maxDayMicroUsd) throw new StudyBuddyError("daily_limit_reached", 429);
      const session = { id: createId(), accountId, requestAccountId: accountId, emailHash, scenario: plan.scenario, useCase: plan.useCase, planVersion: plan.version, state: "active", turnCount: 0, retries: new Map(), reservedMicroUsd: limits.maxSessionMicroUsd, usedMicroUsd: 0, createdAt: now(), expiresAt: new Date(now().getTime() + limits.sessionMinutes * 60000), completedAt: null };
      entitlements.set(emailHash, "reserved");
      dayBudgets.set(dayKey, current + limits.maxSessionMicroUsd);
      sessions.set(session.id, session);
      return { session: { ...session }, replayed: false };
    },
    async claimTurn({ sessionId, accountId, learnerTurn, retryAttempt, operationId, at }) {
      const session = sessions.get(sessionId);
      if (!session || session.accountId !== accountId) throw new StudyBuddyError("foreign_session", 404);
      const prior = operations.get(operationId);
      if (prior) return { ...prior, replayed: true };
      if (session.expiresAt <= at || session.state !== "active") throw new StudyBuddyError("session_expired", 409);
      if (learnerTurn !== session.turnCount + 1 || retryAttempt > 1 || retryAttempt < 0) throw new StudyBuddyError(retryAttempt > 1 ? "retry_limit_reached" : "invalid_request", 409);
      const retryKey = `${learnerTurn}:${retryAttempt}`;
      if (operations.has(`${sessionId}:${retryKey}`)) throw new StudyBuddyError("operation_replayed", 409);
      const claim = { session: { ...session }, sessionId, learnerTurn, retryAttempt, operationId, replayed: false };
      operations.set(operationId, claim);
      operations.set(`${sessionId}:${retryKey}`, claim);
      return claim;
    },
    async completeTurn({ sessionId, operationId, outcomeCode, focusCode, usage, at }) {
      const claim = operations.get(operationId);
      const session = sessions.get(sessionId);
      if (!claim || !session) throw new StudyBuddyError("invalid_request");
      if (claim.completed) return { session: { ...session }, replayed: true };
      claim.completed = true;
      session.turnCount += 1;
      session.lastOutcomeCode = outcomeCode;
      session.focusCode = focusCode;
      session.usedMicroUsd += Math.max(0, Math.min(Number(usage?.microUsd) || 0, session.reservedMicroUsd));
      if (session.turnCount >= 5 || outcomeCode === "escalated") {
        session.state = outcomeCode === "escalated" ? "escalated" : "completed";
        session.completedAt = at;
        entitlements.set(session.emailHash, session.state === "completed" ? "consumed" : "available");
      }
      return { session: { ...session }, replayed: false };
    },
    async reapExpired(at = now()) {
      let count = 0;
      for (const session of sessions.values()) {
        if (session.state === "active" && session.expiresAt <= at) {
          session.state = "expired";
          entitlements.set(session.emailHash, "available");
          count += 1;
        }
      }
      return count;
    },
    async setCircuitOpen(until) { circuitOpenUntil = until; },
    async getSession(sessionId, accountId) {
      const session = sessions.get(sessionId);
      if (!session || session.accountId !== accountId) throw new StudyBuddyError("foreign_session", 404);
      return { ...session };
    },
  };
}
