import { createHmac, timingSafeEqual } from 'node:crypto';

import { PortalPaymentsExperienceError } from './contract.js';

const TTL_MS = 24 * 60 * 60 * 1000;

function secret() {
  const value = String(process.env.PORTAL_PAYMENT_STATE_SECRET || '').trim();
  if (value.length < 32) throw new PortalPaymentsExperienceError('portal_payment_state_unconfigured', 503);
  return value;
}

function signature(payload) {
  return createHmac('sha256', secret()).update(payload).digest('base64url');
}

export function createPortalPaymentReturnState({ accountId, paymentRequestId }, now = Date.now()) {
  if (!accountId || !paymentRequestId) throw new PortalPaymentsExperienceError('portal_payment_state_invalid', 400);
  const payload = Buffer.from(JSON.stringify({ accountId, paymentRequestId, expiresAt: now + TTL_MS })).toString('base64url');
  return `${payload}.${signature(payload)}`;
}

export function readPortalPaymentReturnState(value, expectedAccountId, now = Date.now()) {
  const [payload, supplied, extra] = String(value || '').split('.');
  if (!payload || !supplied || extra) throw new PortalPaymentsExperienceError('portal_payment_state_invalid', 400);
  const expected = signature(payload);
  const left = Buffer.from(supplied);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) {
    throw new PortalPaymentsExperienceError('portal_payment_state_invalid', 400);
  }
  let decoded;
  try { decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')); } catch {
    throw new PortalPaymentsExperienceError('portal_payment_state_invalid', 400);
  }
  if (!decoded?.paymentRequestId || decoded.accountId !== expectedAccountId || Number(decoded.expiresAt) <= now) {
    throw new PortalPaymentsExperienceError('portal_payment_state_expired', 410);
  }
  return { paymentRequestId: String(decoded.paymentRequestId) };
}
