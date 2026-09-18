import { assertPortalSameOrigin, parsePortalClaimJson } from '../portalClaim/http.server.js';
import { PortalPaymentsExperienceError } from './contract.js';

export async function portalPaymentInput(request) {
  try {
    assertPortalSameOrigin(request);
    return await parsePortalClaimJson(request);
  } catch (error) {
    throw new PortalPaymentsExperienceError(error?.code || 'portal_payment_request_invalid', error?.status || 400);
  }
}

export function portalPaymentJson(body, status = 200) {
  return Response.json(body, { status, headers: { 'cache-control': 'private, no-store' } });
}

export function portalPaymentFailure(error) {
  const status = Number(error?.status) || 500;
  return portalPaymentJson({
    ok: false,
    error: {
      code: error?.code || 'portal_payments_unavailable',
      message: status >= 500 ? 'Los pagos no están disponibles temporalmente.' : error.message,
    },
  }, status >= 400 && status <= 599 ? status : 500);
}
