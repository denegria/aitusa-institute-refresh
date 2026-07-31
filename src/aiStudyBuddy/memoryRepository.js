import { StudyBuddyError } from "./errors.js";

export function createMemoryStudyBuddyRepository({ now = () => new Date(), createId = (() => { let n = 0; return () => `study-${++n}`; })(), circuitFailureThreshold = 3, circuitOpenMs = 60_000 } = {}) {
  const entitlements = new Map();
  const sessions = new Map();
  const operations = new Map();
  const dayBudgets = new Map();
  const circuit = { state: "closed", failureCount: 0, openUntil: null, probeInFlight: false };

  const operationKey = (sessionId, operationId) => `${sessionId}:${operationId}`;
  const attemptKey = (sessionId, learnerTurn, retryAttempt) => `${sessionId}:${learnerTurn}:${retryAttempt}`;
  const isCircuitOpen = (at) => circuit.state === "open" && circuit.openUntil > at;

  function copySession(session) {
    return session ? { ...session } : session;
  }

  function reconcileReservation(session, at) {
    const unused = Math.max(0, session.reservedMicroUsd - session.usedMicroUsd - session.pendingMicroUsd);
    const delta = unused - session.releasedMicroUsd;
    session.releasedMicroUsd = unused;
    const day = dayBudgets.get(session.dayKey);
    if (day) day.releasedMicroUsd = Math.max(0, Math.min(day.reservedMicroUsd - day.chargedMicroUsd, day.releasedMicroUsd + delta));
    session.updatedAt = at;
  }

  function expireIfNeeded(session, at) {
    if (session.state === "active" && session.expiresAt <= at) {
      session.state = "expired";
      session.completedAt = at;
      // A persisted acquisition-trial session is unique to its entitlement.
      entitlements.set(session.entitlementKey, "consumed");
      reconcileReservation(session, at);
    }
  }

  function requireOwnedSession(sessionId, accountId, at = now()) {
    const session = sessions.get(sessionId);
    if (!session || session.accountId !== accountId) throw new StudyBuddyError("foreign_session", 404);
    expireIfNeeded(session, at);
    return session;
  }

  return {
    async reserveStart({ accountId, resultId, verifiedEmailHmac, hashVersion, plan, limits }) {
      const at = now();
      if (isCircuitOpen(at)) throw new StudyBuddyError("circuit_open", 503);
      if (!Number.isSafeInteger(limits.maxSessionMicroUsd) || limits.maxSessionMicroUsd <= 0 || !Number.isSafeInteger(limits.maxDayMicroUsd) || limits.maxDayMicroUsd < limits.maxSessionMicroUsd) {
        throw new StudyBuddyError("provider_disabled", 503);
      }
      for (const item of sessions.values()) expireIfNeeded(item, at);
      const existing = [...sessions.values()].find((item) => item.accountId === accountId && item.resultId === resultId && item.state === "active");
      if (existing) return { session: copySession(existing), replayed: true };
      const entitlementKey = `${hashVersion}:${verifiedEmailHmac}`;
      if (["consumed", "reserved"].includes(entitlements.get(entitlementKey))) throw new StudyBuddyError("trial_consumed", 409);
      const dayKey = `${accountId}:${at.toISOString().slice(0, 10)}`;
      const day = dayBudgets.get(dayKey) || { reservedMicroUsd: 0, chargedMicroUsd: 0, releasedMicroUsd: 0 };
      const committed = day.reservedMicroUsd - day.releasedMicroUsd;
      if (committed + limits.maxSessionMicroUsd > limits.maxDayMicroUsd) throw new StudyBuddyError("daily_limit_reached", 429);
      const session = {
        id: createId(), accountId, resultId, entitlementKey,
        scenario: plan.scenario, useCase: plan.useCase, planVersion: plan.version,
        state: "active", turnCount: 0, retryCount: 0, lastLearnerTurn: 0,
        reservedMicroUsd: limits.maxSessionMicroUsd, pendingMicroUsd: 0,
        usedMicroUsd: 0, releasedMicroUsd: 0, providerStarted: false,
        dayKey, createdAt: at, updatedAt: at,
        expiresAt: new Date(at.getTime() + limits.sessionMinutes * 60_000), completedAt: null,
      };
      entitlements.set(entitlementKey, "reserved");
      day.reservedMicroUsd += limits.maxSessionMicroUsd;
      dayBudgets.set(dayKey, day);
      sessions.set(session.id, session);
      return { session: copySession(session), replayed: false };
    },

    async claimTurn({ sessionId, accountId, learnerTurn, retryAttempt, operationId, at }) {
      const session = requireOwnedSession(sessionId, accountId, at);
      const scopedKey = operationKey(sessionId, operationId);
      const prior = operations.get(scopedKey);
      if (prior) {
        if (prior.accountId !== accountId) throw new StudyBuddyError("foreign_session", 404);
        return { ...prior, session: copySession(session), replayed: true };
      }
      if (session.state !== "active") throw new StudyBuddyError("session_expired", 409);
      if (!Number.isInteger(retryAttempt) || ![0, 1].includes(retryAttempt)) throw new StudyBuddyError("invalid_request", 400);
      const expectedTurn = retryAttempt === 0 ? session.turnCount + 1 : session.lastLearnerTurn;
      const base = operations.get(attemptKey(sessionId, expectedTurn, 0));
      if (retryAttempt === 1 && !base) throw new StudyBuddyError("retry_limit_reached", 409);
      if (!Number.isInteger(learnerTurn) || learnerTurn !== expectedTurn || learnerTurn < 1 || learnerTurn > 5) throw new StudyBuddyError("invalid_request", 400);
      const attempt = attemptKey(sessionId, learnerTurn, retryAttempt);
      if (operations.has(attempt)) throw new StudyBuddyError("operation_replayed", 409);
      const remaining = session.reservedMicroUsd - session.usedMicroUsd - session.pendingMicroUsd;
      if (remaining <= 0) throw new StudyBuddyError("session_limit_reached", 429);
      // Acquire the half-open probe only after every non-provider check passes.
      if (circuit.state === "open" && circuit.openUntil <= at) {
        circuit.state = "half_open";
        circuit.probeInFlight = false;
      }
      if (isCircuitOpen(at) || (circuit.state === "half_open" && circuit.probeInFlight)) throw new StudyBuddyError("circuit_open", 503);
      if (circuit.state === "half_open") circuit.probeInFlight = true;
      const claim = {
        sessionId, accountId, learnerTurn, retryAttempt, operationId,
        state: "claimed", reservedMicroUsd: remaining, replayed: false,
        createdAt: at, completedAt: null,
      };
      session.pendingMicroUsd += remaining;
      session.providerStarted = true;
      session.lastLearnerTurn = learnerTurn;
      if (retryAttempt === 1) session.retryCount += 1;
      operations.set(scopedKey, claim);
      operations.set(attempt, claim);
      return { ...claim, session: copySession(session) };
    },

    async completeTurn({ sessionId, accountId, operationId, outcomeCode, focusCode, usage, at }) {
      const session = requireOwnedSession(sessionId, accountId, at);
      const claim = operations.get(operationKey(sessionId, operationId));
      if (!claim || claim.sessionId !== sessionId || claim.accountId !== accountId) throw new StudyBuddyError("foreign_session", 404);
      if (claim.state !== "claimed") return { session: copySession(session), operation: { ...claim }, replayed: true };
      const charged = usage.microUsd;
      if (!Number.isSafeInteger(charged) || charged < 0 || charged > claim.reservedMicroUsd) throw new StudyBuddyError("provider_unavailable", 503);
      session.pendingMicroUsd = Math.max(0, session.pendingMicroUsd - claim.reservedMicroUsd);
      session.usedMicroUsd = Math.min(session.reservedMicroUsd, session.usedMicroUsd + charged);
      const day = dayBudgets.get(session.dayKey);
      day.chargedMicroUsd = Math.min(day.reservedMicroUsd, day.chargedMicroUsd + charged);
      if (session.state === "expired") {
        claim.state = "failed";
        claim.safeOutcomeCode = "deadline_exceeded";
        claim.inputUnits = usage.inputUnits;
        claim.outputUnits = usage.outputUnits;
        claim.chargedMicroUsd = charged;
        claim.completedAt = at;
        reconcileReservation(session, at);
        return { session: copySession(session), operation: { ...claim }, replayed: false, terminalCode: "session_expired" };
      }
      claim.state = "completed";
      claim.safeOutcomeCode = outcomeCode;
      claim.inputUnits = usage.inputUnits;
      claim.outputUnits = usage.outputUnits;
      claim.chargedMicroUsd = charged;
      claim.completedAt = at;
      const base = operations.get(attemptKey(sessionId, claim.learnerTurn, 0));
      if (claim.retryAttempt === 0 || base?.state !== "completed") session.turnCount += 1;
      session.lastOutcomeCode = outcomeCode;
      session.focusCode = focusCode;
      session.updatedAt = at;
      if (session.turnCount >= 5 || outcomeCode === "escalated") {
        session.state = outcomeCode === "escalated" ? "escalated" : "completed";
        session.completedAt = at;
        entitlements.set(session.entitlementKey, "consumed");
        reconcileReservation(session, at);
      }
      return { session: copySession(session), operation: { ...claim }, replayed: false };
    },

    async failTurn({ sessionId, accountId, operationId, ambiguous = true, at }) {
      const session = requireOwnedSession(sessionId, accountId, at);
      const claim = operations.get(operationKey(sessionId, operationId));
      if (!claim || claim.sessionId !== sessionId || claim.accountId !== accountId) throw new StudyBuddyError("foreign_session", 404);
      if (claim.state !== "claimed") return { session: copySession(session), operation: { ...claim }, replayed: true };
      claim.state = ambiguous ? "ambiguous" : "failed";
      claim.completedAt = at;
      session.updatedAt = at;
      if (!ambiguous) {
        session.pendingMicroUsd = Math.max(0, session.pendingMicroUsd - claim.reservedMicroUsd);
        reconcileReservation(session, at);
      }
      return { session: copySession(session), operation: { ...claim }, replayed: false };
    },

    async reconcileLateTurn({ sessionId, accountId, operationId, usage, at }) {
      const session = requireOwnedSession(sessionId, accountId, at);
      const claim = operations.get(operationKey(sessionId, operationId));
      if (!claim || claim.sessionId !== sessionId || claim.accountId !== accountId) throw new StudyBuddyError("foreign_session", 404);
      if (claim.state !== "ambiguous") return { session: copySession(session), operation: { ...claim }, replayed: true };
      const charged = usage.microUsd;
      if (!Number.isSafeInteger(charged) || charged < 0 || charged > claim.reservedMicroUsd) throw new StudyBuddyError("provider_unavailable", 503);
      session.pendingMicroUsd = Math.max(0, session.pendingMicroUsd - claim.reservedMicroUsd);
      session.usedMicroUsd = Math.min(session.reservedMicroUsd, session.usedMicroUsd + charged);
      const day = dayBudgets.get(session.dayKey);
      day.chargedMicroUsd = Math.min(day.reservedMicroUsd, day.chargedMicroUsd + charged);
      claim.state = "failed";
      claim.safeOutcomeCode = "deadline_exceeded";
      claim.inputUnits = usage.inputUnits;
      claim.outputUnits = usage.outputUnits;
      claim.chargedMicroUsd = charged;
      claim.completedAt = at;
      if (session.state === "expired") reconcileReservation(session, at);
      return { session: copySession(session), operation: { ...claim }, replayed: false, terminalCode: session.state === "expired" ? "session_expired" : "provider_unavailable" };
    },

    async reapExpired(at = now()) {
      let count = 0;
      for (const session of sessions.values()) {
        const prior = session.state;
        expireIfNeeded(session, at);
        if (prior === "active" && session.state === "expired") count += 1;
      }
      return count;
    },
    async recordProviderFailure(at = now()) {
      circuit.failureCount += 1;
      circuit.probeInFlight = false;
      if (circuit.state === "half_open" || circuit.failureCount >= circuitFailureThreshold) {
        circuit.state = "open";
        circuit.openUntil = new Date(at.getTime() + circuitOpenMs);
      }
      return { ...circuit };
    },
    async recordProviderSuccess() {
      circuit.state = "closed";
      circuit.failureCount = 0;
      circuit.openUntil = null;
      circuit.probeInFlight = false;
      return { ...circuit };
    },
    async setCircuitOpen(until) { circuit.state = "open"; circuit.openUntil = until; circuit.probeInFlight = false; },
    async getCircuit() { return { ...circuit }; },
    async getSession(sessionId, accountId) { return copySession(requireOwnedSession(sessionId, accountId)); },
    async getOperation(sessionId, operationId, accountId) {
      requireOwnedSession(sessionId, accountId);
      const operation = operations.get(operationKey(sessionId, operationId));
      if (!operation || operation.accountId !== accountId) throw new StudyBuddyError("foreign_session", 404);
      return { ...operation };
    },
    async getBudget(accountId, at = now()) {
      const value = dayBudgets.get(`${accountId}:${at.toISOString().slice(0, 10)}`);
      return value ? { ...value } : null;
    },
  };
}
