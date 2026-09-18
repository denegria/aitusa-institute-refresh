import { resolveAuthenticatedPortalIdentity } from '../../../../../src/portalAuth/sessionResolver.server.js';
import { callPortalPaymentsCrm } from '../../../../../src/portalPayments/crm.server.js';
import { portalPaymentFailure, portalPaymentInput, portalPaymentJson } from '../../../../../src/portalPayments/http.server.js';
import { createPortalPaymentReturnState } from '../../../../../src/portalPayments/returnState.server.js';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const identity = await resolveAuthenticatedPortalIdentity(request);
    const input = await portalPaymentInput(request);
    const account = identity.account;
    const idempotencyKey = `portal-payment:${account.accountId}:${String(input.idempotencyKey || '').trim()}`;
    const created = await callPortalPaymentsCrm('create_request', account, {
      payment: { chargeId: input.chargeId, amount: input.amount, idempotencyKey },
    });
    const paymentRequestId = created.result?.paymentRequestId;
    const returnState = createPortalPaymentReturnState({ accountId: account.accountId, paymentRequestId });
    const hosted = await callPortalPaymentsCrm('hosted_link', account, {
      paymentRequestId,
      idempotencyKey: `${idempotencyKey}:hpp`,
      returnState,
    });
    return portalPaymentJson({ ok: true, state: 'checkout_ready', checkoutUrl: hosted.result?.checkoutUrl }, 201);
  } catch (error) { return portalPaymentFailure(error); }
}
