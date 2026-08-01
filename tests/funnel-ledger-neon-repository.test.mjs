import assert from "node:assert/strict";
import test from "node:test";

const canonicalAttemptId = "00000000-0000-4000-8000-000000000001";

test("Neon repositories project canonical funnel correlation separately from private CRM and browser data", async (t) => {
  let createNeonCrmOutboxRepository;
  let createNeonPortalAuthRepository;
  try {
    ({ createNeonCrmOutboxRepository } = await import("../src/crm/outbox.server.js"));
    ({ createNeonPortalAuthRepository } = await import("../src/portalAuth/neonRepository.server.js"));
  } catch (error) {
    if (error?.code === "ERR_MODULE_NOT_FOUND") {
      t.skip("optional runtime dependencies are not hydrated in this isolated worktree");
      return;
    }
    throw error;
  }

  const outboxQueries = [];
  const outbox = createNeonCrmOutboxRepository({
    async execute(query) {
      outboxQueries.push(query);
      return { rows: [{
        id: "00000000-0000-4000-8000-000000000010",
        payload: { schemaVersion: "aitusa-crm-event-v1" },
        correlation_id: "claim-or-result-correlation-is-not-ledger-correlation",
        funnel_correlation_id: canonicalAttemptId,
        attempt_count: 2,
      }] };
    },
  });
  assert.deepEqual(await outbox.claimNext({ now: new Date("2026-08-01T12:00:00.000Z"), leaseUntil: new Date("2026-08-01T12:02:00.000Z") }), {
    id: "00000000-0000-4000-8000-000000000010",
    payload: { schemaVersion: "aitusa-crm-event-v1" },
    correlationId: "claim-or-result-correlation-is-not-ledger-correlation",
    funnelCorrelationId: canonicalAttemptId,
    attemptCount: 2,
  });
  assert.equal(outboxQueries.length, 1);

  const authQueries = [];
  const auth = createNeonPortalAuthRepository({
    async execute(query) {
      authQueries.push(query);
      return { rows: [{ funnel_correlation_id: canonicalAttemptId }] };
    },
  });
  assert.equal(await auth.getActiveFunnelCorrelationForIdentity({ providerUserId: "provider-user", email: "student@example.com" }), canonicalAttemptId);
  assert.equal(authQueries.length, 1);
});
