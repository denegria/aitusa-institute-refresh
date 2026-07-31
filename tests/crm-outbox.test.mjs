import assert from 'node:assert/strict';
import test from 'node:test';
import {
  CRM_OUTBOX_MAX_ATTEMPTS,
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

test('advisor acknowledgement is honest while CRM delivery is pending or terminally failed', () => {
  const base = { account: { status: 'active', firstName: 'Ana', email: 'ana@example.com' } };
  const pending = createAuthenticatedPortalViewModel({ ...base, advisor: { requested: true, deliveryStatus: 'pending' } });
  const delivered = createAuthenticatedPortalViewModel({ ...base, advisor: { requested: true, deliveryStatus: 'delivered' } });
  const failed = createAuthenticatedPortalViewModel({ ...base, advisor: { requested: true, deliveryStatus: 'needs_attention' } });
  assert.equal(pending.advisor.label, 'Solicitud pendiente de confirmación');
  assert.equal(delivered.advisor.label, 'Solicitud confirmada');
  assert.equal(failed.advisor.label, 'Solicitud pendiente de revisión');
});
