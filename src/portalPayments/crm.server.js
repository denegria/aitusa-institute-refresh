import { PortalPaymentsExperienceError } from './contract.js';

const TIMEOUT_MS = 12_000;

function config() {
  const url = String(process.env.AIT_CRM_PORTAL_PAYMENTS_URL || '').trim();
  const secret = String(process.env.AIT_CRM_PORTAL_PAYMENTS_SECRET || '').trim();
  if (!url || !secret) throw new PortalPaymentsExperienceError('portal_payments_unavailable', 503);
  return { url, secret, bypass: String(process.env.AIT_CRM_VERCEL_PROTECTION_BYPASS || '').trim() };
}

export async function callPortalPaymentsCrm(action, identity, payload = {}, fetchImpl = fetch) {
  const { url, secret, bypass } = config();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const headers = { 'content-type': 'application/json', 'x-ait-portal-payments-secret': secret };
    if (bypass) headers['x-vercel-protection-bypass'] = bypass;
    const response = await fetchImpl(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ action, identity: { accountId: identity.accountId, email: identity.email }, ...payload }),
      cache: 'no-store',
      signal: controller.signal,
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new PortalPaymentsExperienceError(
        body?.error?.code || 'portal_payments_rejected',
        response.status,
        body?.error?.message || 'No pudimos continuar con el pago.',
      );
    }
    return body;
  } catch (error) {
    if (error instanceof PortalPaymentsExperienceError) throw error;
    throw new PortalPaymentsExperienceError('portal_payments_unavailable', 503);
  } finally {
    clearTimeout(timer);
  }
}
