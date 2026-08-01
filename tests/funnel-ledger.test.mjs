import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { createMemoryDiagnosticRepository } from "../src/diagnostic/memoryRepository.js";
import { createDiagnosticService } from "../src/diagnostic/service.js";
import { DIAGNOSTIC_QUESTION_BANK } from "../src/diagnostic/questionBank.server.js";
import { createMemoryStudyBuddyRepository } from "../src/aiStudyBuddy/memoryRepository.js";
import { createStudyBuddyService } from "../src/aiStudyBuddy/service.js";
import { createFakeStudyBuddyProvider } from "../src/aiStudyBuddy/fakeStudyBuddyProvider.js";
import { createCrmOutboxDispatcher } from "../src/crm/outbox.js";
import { createPortalAuthService } from "../src/portalAuth/service.js";
import { FUNNEL_EVENT_NAMES } from "../src/observability/funnelContract.js";
import { createFunnelLedgerService, validateFunnelEvent } from "../src/observability/funnelService.js";
import { createMemoryFunnelLedgerRepository } from "../src/observability/memoryRepository.js";

const now = "2026-08-01T12:00:00.000Z";
const correlationId = "00000000-0000-4000-8000-000000000001";
const base = Object.freeze({ idempotencyKey: "funnel-event-fixture-0001", correlationId, source: "diagnostic", occurredAt: now });

test("funnel contract accepts only the fixed versioned whitelist", () => {
  for (const eventName of FUNNEL_EVENT_NAMES) {
    assert.equal(validateFunnelEvent({ ...base, eventName, idempotencyKey: `fixture-${eventName}` }).eventVersion, 1);
  }
  assert.throws(() => validateFunnelEvent({ ...base, eventName: "unknown_event" }), /funnel_event_unknown/);
  assert.throws(() => validateFunnelEvent({ ...base, eventName: "diagnostic_started", email: "student@example.com" }), /funnel_event_extra_field/);
  assert.throws(() => validateFunnelEvent({ ...base, eventName: "diagnostic_started", metadata: { rawAnswer: "a" } }), /funnel_event_extra_field/);
  assert.throws(() => validateFunnelEvent({ ...base, eventName: "diagnostic_started", token: "secret" }), /funnel_event_extra_field/);
  assert.throws(() => validateFunnelEvent({ ...base, eventName: "diagnostic_started", utmCampaign: "contains spaces" }), /funnel_event_utm_invalid/);
});

test("ledger replays idempotently and purges bounded expired rows", async () => {
  const repository = createMemoryFunnelLedgerRepository();
  const ledger = createFunnelLedgerService({ repository, now: () => new Date("2026-09-10T00:00:00.000Z") });
  const event = { ...base, eventName: "diagnostic_started" };
  assert.equal((await ledger.emit(event)).persisted, true);
  assert.equal((await ledger.emit(event)).replayed, true);
  assert.equal(repository.inserts.length, 1);
  assert.deepEqual(await ledger.runRetention({ limit: 999 }), { deleted: 1, limit: 250 });
});

test("under-13 and guardian-unverified paths make zero ledger insert calls", async () => {
  const repository = createMemoryFunnelLedgerRepository();
  const ledger = createFunnelLedgerService({ repository });
  const diagnostic = createDiagnosticService({ repository: createMemoryDiagnosticRepository(), resumeSecret: "test-resume-secret-with-enough-entropy", ledger });
  await diagnostic.startAttempt({ requestId: "request-under-13", ageBand: "under_13" });
  const practice = createStudyBuddyService({
    repository: createMemoryStudyBuddyRepository(), provider: createFakeStudyBuddyProvider(), ledger,
    config: { enabled: true, limits: { maxSessionMicroUsd: 5, maxDayMicroUsd: 10, sessionMinutes: 5 } },
  });
  const denied = await practice.start({ context: {
    snapshot: { state: "authenticated", account: { status: "active" }, result: { recommendedLevelKey: "basic" }, practice: { guardianVerified: false } },
    ownership: { accountId: "00000000-0000-4000-8000-000000000011", resultId: "00000000-0000-4000-8000-000000000012", verifiedEmailHmac: "a".repeat(64), hashVersion: "hmac-sha256-v1" },
  } });
  assert.equal(denied.code, "guardian_unresolved");
  assert.equal(repository.inserts.length, 0);
});

test("diagnostic and result-save emitters keep one correlation through completion", async () => {
  const repository = createMemoryFunnelLedgerRepository();
  const ledger = createFunnelLedgerService({ repository });
  const diagnostic = createDiagnosticService({ repository: createMemoryDiagnosticRepository(), resumeSecret: "test-resume-secret-with-enough-entropy", ledger, now: () => new Date(now) });
  const started = await diagnostic.startAttempt({ requestId: "diagnostic-funnel-request", requestSecret: "request-secret-fixture-with-more-than-thirty-two-characters" });
  let revision = 0;
  for (const [index, question] of DIAGNOSTIC_QUESTION_BANK.entries()) {
    const result = await diagnostic.recordAnswer({ attemptId: started.attempt.id, resumeCredential: started.resumeCredential, mutationId: `answer-mutation-${index.toString().padStart(3, "0")}`, expectedRevision: revision, questionKey: question.key, answerState: "answered", answerValue: question.correctAnswer });
    revision = result.revision;
  }
  await diagnostic.completeAttempt({ attemptId: started.attempt.id, resumeCredential: started.resumeCredential, completionId: "diagnostic-completion-fixture-0001", expectedRevision: revision, selfAssessment: {}, goal: "Trabajo", writingSample: "" });
  assert.deepEqual(repository.inserts.map((event) => event.eventName), ["diagnostic_started", "result_save_requested", "diagnostic_completed", "result_save_completed"]);
  assert.equal(repository.inserts.every((event) => event.correlationId === started.attempt.id), true);
  assert.equal(JSON.stringify(repository.inserts).match(/rawAnswer|writingSample|"goal"|"response"|"token"|request-secret/i), null);
});

test("migration and schema retain the same bounded ledger constraints", async () => {
  const [migration, schema] = await Promise.all([readFile("drizzle/0004_funnel_event_ledger.sql", "utf8"), readFile("src/diagnostic/schema.js", "utf8")]);
  for (const value of ["funnel_event_ledger", "idempotency_key", "correlation_id", "event_version", "expires_at", "funnel_event_ledger_retention_check", "funnel_event_ledger_bounded_text_check"]) {
    assert.match(migration, new RegExp(value));
    assert.match(schema, new RegExp(value));
  }
  assert.doesNotMatch(migration, /jsonb|email|phone|provider.*id|account_id|user_id/i);
});

test("portal auth emits success and failure with an auth reservation correlation only", async () => {
  const repository = createMemoryFunnelLedgerRepository();
  const ledger = createFunnelLedgerService({ repository });
  const authRepository = {
    async reserveAuthAttempt({ id }) { return { id, allowed: true }; },
    async completeAuthAttempt() {},
    async getActivePortalSnapshot() { return { state: "authenticated" }; },
  };
  const provider = {
    async verifyCode({ code }) {
      if (code === "000000") throw new Error("provider detail must not persist");
      return { identity: { providerUserId: "provider-id-not-ledger", email: "student@example.com", emailVerified: true }, sessionData: "sealed-session" };
    },
  };
  let index = 0;
  const auth = createPortalAuthService({ repository: authRepository, authProvider: provider, ledger, hashSecret: "portal-auth-service-test-secret-32-bytes", createId: () => `portal-auth-reservation-${++index}` });
  await auth.verifySignInCode({ email: "student@example.com", code: "123456" });
  await assert.rejects(() => auth.verifySignInCode({ email: "student@example.com", code: "000000" }));
  assert.deepEqual(repository.inserts.map((event) => event.eventName), ["portal_auth_success", "portal_auth_failure"]);
  assert.equal(JSON.stringify(repository.inserts).match(/student@example|provider-id|sealed-session|detail/i), null);
});

test("approved practice and CRM server emitters use opaque correlation without payload inspection", async () => {
  const repository = createMemoryFunnelLedgerRepository();
  const ledger = createFunnelLedgerService({ repository });
  const context = {
    snapshot: { state: "authenticated", account: { status: "active" }, result: { recommendedLevelKey: "basic" }, practice: { guardianVerified: true } },
    ownership: { accountId: "00000000-0000-4000-8000-000000000021", resultId: "00000000-0000-4000-8000-000000000022", funnelCorrelationId: correlationId, verifiedEmailHmac: "b".repeat(64), hashVersion: "hmac-sha256-v1" },
  };
  const practice = createStudyBuddyService({ repository: createMemoryStudyBuddyRepository(), provider: createFakeStudyBuddyProvider(), ledger, now: () => new Date(now), config: { enabled: true, limits: { maxSessionMicroUsd: 5, maxDayMicroUsd: 10, sessionMinutes: 5 } } });
  const started = await practice.start({ context });
  assert.equal(repository.inserts[0].eventName, "practice_started");
  const items = [
    { id: "outbox-delivery-0001", correlationId, attemptCount: 1, payload: { forbidden: "not read" } },
    { id: "outbox-retry-000002", correlationId, attemptCount: 1, payload: { forbidden: "not read" } },
    { id: "outbox-dead-000003", correlationId, attemptCount: 4, payload: { forbidden: "not read" } },
  ];
  const dispatcher = createCrmOutboxDispatcher({
    ledger, now: () => new Date(now),
    repository: { async claimNext() { return items.shift() ?? null; }, async markDelivered() {}, async markFailed() {} },
    transport: { async deliver(payload) { if (payload.forbidden === "not read" && repository.inserts.length === 1) return { acknowledged: true }; const error = new Error("no details"); error.status = items.length === 1 ? 503 : 400; throw error; } },
  });
  await dispatcher.dispatchDue({ limit: 3 });
  assert.deepEqual(repository.inserts.map((event) => event.eventName), ["practice_started", "crm_delivery", "crm_retry", "crm_dead_letter"]);
  assert.equal(started.session.resultId, context.ownership.resultId);
  assert.equal(repository.inserts.every((event) => event.correlationId === correlationId), true);
  assert.equal(JSON.stringify(repository.inserts).match(/forbidden|payload|accountId|resultId|email|provider/i), null);
});

test("practice completed, escalated, and limit emitters are server-only terminal transitions", async () => {
  const makeContext = (suffix) => ({
    snapshot: { state: "authenticated", account: { status: "active" }, result: { recommendedLevelKey: "basic" }, practice: { guardianVerified: true } },
    ownership: { accountId: `00000000-0000-4000-8000-0000000000${suffix}`, resultId: `10000000-0000-4000-8000-0000000000${suffix}`, funnelCorrelationId: correlationId, verifiedEmailHmac: suffix.repeat(32), hashVersion: "hmac-sha256-v1" },
  });
  const config = { enabled: true, limits: { maxSessionMicroUsd: 5, maxDayMicroUsd: 10, sessionMinutes: 5 } };
  const completedLedger = createMemoryFunnelLedgerRepository();
  const completed = createStudyBuddyService({ repository: createMemoryStudyBuddyRepository(), provider: createFakeStudyBuddyProvider(), ledger: createFunnelLedgerService({ repository: completedLedger }), config });
  const completedStart = await completed.start({ context: makeContext("31") });
  for (let turn = 1; turn <= 5; turn += 1) await completed.turn({ context: makeContext("31"), sessionId: completedStart.session.id, payload: { operationId: `complete-operation-${turn}`, retryAttempt: 0, text: "hello" } });
  assert.equal(completedLedger.inserts.at(-1).eventName, "practice_completed");

  const escalatedLedger = createMemoryFunnelLedgerRepository();
  const escalated = createStudyBuddyService({ repository: createMemoryStudyBuddyRepository(), provider: createFakeStudyBuddyProvider({ response: { outcomeCode: "escalated", focusCode: "escalation_needed", feedback: "support_recommended", usage: { inputUnits: 1, outputUnits: 1, microUsd: 0 } } }), ledger: createFunnelLedgerService({ repository: escalatedLedger }), config });
  const escalatedStart = await escalated.start({ context: makeContext("32") });
  await escalated.turn({ context: makeContext("32"), sessionId: escalatedStart.session.id, payload: { operationId: "escalated-operation-1", retryAttempt: 0, text: "help" } });
  assert.equal(escalatedLedger.inserts.at(-1).eventName, "practice_escalated");

  let current = new Date(now);
  const limitLedger = createMemoryFunnelLedgerRepository();
  const limited = createStudyBuddyService({ repository: createMemoryStudyBuddyRepository({ now: () => current }), provider: createFakeStudyBuddyProvider(), ledger: createFunnelLedgerService({ repository: limitLedger }), config, now: () => current, runWithDeadline: async (work) => { const value = await work(); current = new Date(current.getTime() + 6 * 60_000); return { timedOut: false, value }; } });
  const limitedStart = await limited.start({ context: makeContext("33") });
  await limited.turn({ context: makeContext("33"), sessionId: limitedStart.session.id, payload: { operationId: "expired-operation-001", retryAttempt: 0, text: "hello" } });
  assert.equal(limitLedger.inserts.at(-1).eventName, "practice_limit");
  assert.equal(limitLedger.inserts.at(-1).safeOutcomeCode, "session_expired");
});
