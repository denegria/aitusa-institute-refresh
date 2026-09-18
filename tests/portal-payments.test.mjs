import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';

import { safePaymentStatus, safePortalPaymentsSnapshot } from '../src/portalPayments/contract.js';
import { callPortalPaymentsCrm } from '../src/portalPayments/crm.server.js';
import { createPortalPaymentReturnState, readPortalPaymentReturnState } from '../src/portalPayments/returnState.server.js';

const originalEnv = { ...process.env };
afterEach(() => { process.env = { ...originalEnv }; });

describe('MIS-420 portal payment contract', () => {
  it('normalizes only safe CRM fields and keeps pending verifying', () => {
    const result = safePortalPaymentsSnapshot({ result: {
      student: { name: 'Student', email: 'student@example.com', internalContactId: 'must-not-pass' },
      charges: [{ id: 'charge-1', description: 'Tuition', originalAmount: '95.00', appliedAmount: '10.00', remainingAmount: '85.00', state: 'partially_paid', currency: 'USD', privateMetadata: 'must-not-pass' }],
      paymentRequests: [{ id: 'request-1', amount: '25.00', state: 'pending' }],
    } });
    assert.equal(result.paymentRequests[0].state, 'verifying');
    assert.equal(JSON.stringify(result).includes('must-not-pass'), false);
  });

  it('binds return state to the authenticated account and expires it', () => {
    process.env.PORTAL_PAYMENT_STATE_SECRET = 'fixture-secret-that-is-longer-than-thirty-two-characters';
    const token = createPortalPaymentReturnState({ accountId: 'account-1', paymentRequestId: 'request-1' }, 1_000);
    assert.deepEqual(readPortalPaymentReturnState(token, 'account-1', 1_001), { paymentRequestId: 'request-1' });
    assert.throws(() => readPortalPaymentReturnState(token, 'account-2', 1_001), (error) => error.code === 'portal_payment_state_expired');
    assert.throws(() => readPortalPaymentReturnState(token, 'account-1', 1_000 + (24 * 60 * 60 * 1000) + 1), (error) => error.code === 'portal_payment_state_expired');
  });

  it('sends only server-resolved identity and secret to CRM', async () => {
    process.env.AIT_CRM_PORTAL_PAYMENTS_URL = 'https://crm.example.test/api/portal-payments';
    process.env.AIT_CRM_PORTAL_PAYMENTS_SECRET = 'shared-secret';
    process.env.AIT_CRM_VERCEL_PROTECTION_BYPASS = 'bypass-secret';
    let captured;
    const body = await callPortalPaymentsCrm('snapshot', { accountId: 'account-1', email: 'student@example.com' }, {}, async (url, options) => {
      captured = { url, options };
      return new Response(JSON.stringify({ result: { charges: [] } }), { status: 200, headers: { 'content-type': 'application/json' } });
    });
    assert.deepEqual(body.result.charges, []);
    assert.equal(captured.options.headers['x-ait-portal-payments-secret'], 'shared-secret');
    assert.equal(captured.options.headers['x-vercel-protection-bypass'], 'bypass-secret');
    assert.deepEqual(JSON.parse(captured.options.body).identity, { accountId: 'account-1', email: 'student@example.com' });
  });

  it('defaults unknown provider state to verifying', () => {
    assert.equal(safePaymentStatus({ state: 'pending' }).state, 'verifying');
  });
});
