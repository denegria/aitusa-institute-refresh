import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import {
  CRM_OUTBOX_MAX_ATTEMPTS,
  CRM_OUTBOX_LEASE_MS,
  createAitCrmTransport,
  createCrmOutboxDispatcher,
  nextCrmOutboxAttemptAt,
} from '../src/crm/outbox.js';
import { createAuthenticatedPortalViewModel } from '../src/portal/portalViewModel.js';

function fixture(items) {
  const calls = [];
  const repository = {
    async claimNext() { return items.shift() || null; },
    async markDelivered(value) { calls.push({ type: 'delivered', ...value }); },
    async markFailed(value) { calls.push({ type: 'failed', ...value }); },
  };
  return { calls, repository };
}

test('CRM outbox retries a timeout without blocking the completed product outcome', async () => {
  const { calls, repository } = fixture([{ id: 'item-1', attemptCount: 1, payload: { schemaVersion: 'aitusa-crm-event-v1' } }]);
  const dispatcher = createCrmOutboxDispatcher({
    repository,
    transport: { async deliver() { const error = new Error('timeout'); error.name = 'AbortError'; throw error; } },
    now: () => new Date('2026-07-31T12:00:00.000Z'),
  });
  assert.deepEqual(await dispatcher.dispatchDue(), { delivered: 0, retried: 1, deadLettered: 0 });
  assert.equal(calls[0].status, 'retry_wait');
  assert.equal(calls[0].safeErrorCode, 'crm_timeout');
});

test('CRM outbox dead-letters a terminal replay without leaking provider details', async () => {
  const { calls, repository } = fixture([{ id: 'item-2', attemptCount: CRM_OUTBOX_MAX_ATTEMPTS, payload: {} }]);
  const dispatcher = createCrmOutboxDispatcher({
    repository,
    transport: { async deliver() { const error = new Error('trace=secret'); error.status = 503; throw error; } },
  });
  assert.deepEqual(await dispatcher.dispatchDue(), { delivered: 0, retried: 0, deadLettered: 1 });
  assert.deepEqual(calls[0], { type: 'failed', id: 'item-2', status: 'dead_letter', safeErrorCode: 'crm_unavailable', nextAttemptAt: null });
});

test('backoff is bounded and deterministic', () => {
  const now = new Date('2026-07-31T12:00:00.000Z');
  assert.equal(nextCrmOutboxAttemptAt(1, now).toISOString(), '2026-07-31T12:01:00.000Z');
  assert.equal(nextCrmOutboxAttemptAt(99, now).toISOString(), '2026-07-31T13:00:00.000Z');
});

test('transport uses an AbortController deadline and requires an affirmative CRM acknowledgement', async () => {
  let signal;
  const transport = createAitCrmTransport({
    url: 'https://crm.example.test/events', secret: 'fixture-secret', timeoutMs: 100,
    fetchImpl: async (_url, init) => { signal = init.signal; return { ok: true, status: 201, json: async () => ({ acknowledged: true }) }; },
  });
  await transport.deliver({ schemaVersion: 'aitusa-crm-event-v1' });
  assert.equal(signal instanceof AbortSignal, true);
  const noAck = createAitCrmTransport({ url: 'https://crm.example.test/events', secret: 'fixture-secret', fetchImpl: async () => ({ ok: true, status: 201, json: async () => ({ ok: true }) }) });
  await assert.rejects(() => noAck.deliver({}), /crm_acknowledgement_invalid/);
  const timedOut = createAitCrmTransport({
    url: 'https://crm.example.test/events', secret: 'fixture-secret', timeoutMs: 100,
    fetchImpl: (_url, init) => new Promise((_resolve, reject) => init.signal.addEventListener('abort', () => { const error = new Error('aborted'); error.name = 'AbortError'; reject(error); })),
  });
  await assert.rejects(() => timedOut.deliver({}), (error) => error?.name === 'AbortError');
});

test('post-ack local-mark ambiguity remains recoverable through the durable lease and idempotent replay', async () => {
  const calls = [];
  const item = { id: 'item-3', attemptCount: 1, payload: { idempotencyKey: 'aitusa:fixture:event-3' } };
  const repository = {
    async claimNext({ leaseUntil }) { calls.push({ type: 'claim', leaseUntil }); return calls.filter((call) => call.type === 'claim').length === 1 ? item : null; },
    async markDelivered() { throw new Error('local_process_died_after_ack'); },
    async markFailed(value) { calls.push({ type: 'failed', ...value }); },
  };
  const now = new Date('2026-07-31T12:00:00.000Z');
  const dispatcher = createCrmOutboxDispatcher({ repository, transport: { async deliver() { return { acknowledged: true }; } }, now: () => now });
  assert.deepEqual(await dispatcher.dispatchDue(), { delivered: 0, retried: 1, deadLettered: 0 });
  assert.equal(calls[0].leaseUntil.getTime(), now.getTime() + CRM_OUTBOX_LEASE_MS);
  // A restarted worker can reclaim after the lease; CRM sees the same payload/key.
  const resumed = createCrmOutboxDispatcher({
    repository: { async claimNext() { return { ...item, attemptCount: 2 }; }, async markDelivered(value) { calls.push({ type: 'delivered', ...value }); }, async markFailed() {} },
    transport: { async deliver(payload) { assert.equal(payload.idempotencyKey, 'aitusa:fixture:event-3'); } }, now: () => new Date(now.getTime() + CRM_OUTBOX_LEASE_MS + 1),
  });
  await resumed.dispatchDue({ limit: 1 });
  assert.equal(calls.at(-1).type, 'delivered');
});

test('advisor acknowledgement is honest while CRM delivery is pending or terminally failed', () => {
  const base = { account: { status: 'active', firstName: 'Ana', email: 'ana@example.com' } };
  const pending = createAuthenticatedPortalViewModel({ ...base, advisor: { requested: true, deliveryStatus: 'pending' } });
  const delivered = createAuthenticatedPortalViewModel({ ...base, advisor: { requested: true, deliveryStatus: 'delivered' } });
  const failed = createAuthenticatedPortalViewModel({ ...base, advisor: { requested: true, deliveryStatus: 'needs_attention' } });
  assert.equal(pending.advisor.label, 'Solicitud pendiente de confirmación');
  assert.equal(delivered.advisor.label, 'Solicitud confirmada');
  assert.equal(failed.advisor.label, 'Solicitud pendiente de revisión');
});

test('claim and practice authoritative transitions enqueue the complete safe launch event set', async () => {
  const claimRepository = await readFile(new URL('../src/portalClaim/neonRepository.server.js', import.meta.url), 'utf8');
  const practiceRepository = await readFile(new URL('../src/aiStudyBuddy/neonRepository.server.js', import.meta.url), 'utf8');
  for (const type of ['placement_started', 'placement_completed', 'result_claimed', 'portal_account_activated', 'advisor_handoff_requested']) assert.match(claimRepository, new RegExp(`'${type}'`));
  for (const type of ['ai_practice_started', 'ai_practice_completed', 'ai_practice_escalated', 'ai_practice_limit_reached']) assert.match(practiceRepository, new RegExp(`'${type}'`));
  assert.doesNotMatch(claimRepository, /'email', true/);
  assert.match(practiceRepository, /insert into crm_outbox/);
});
