const BLOCKED = /audio|text|prompt|transcript|response|provider.?id|email|token/i;

export function toSafeStudyBuddyEvent(event = {}) {
  return Object.fromEntries(
    Object.entries(event).filter(([key, value]) => !BLOCKED.test(key) && (typeof value === "string" || typeof value === "number" || typeof value === "boolean")),
  );
}

export function buildCrmSafeSummary({ session, outcomeCode }) {
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
