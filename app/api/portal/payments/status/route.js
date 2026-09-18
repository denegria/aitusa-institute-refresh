import { resolveAuthenticatedPortalIdentity } from '../../../../../src/portalAuth/sessionResolver.server.js';
import { callPortalPaymentsCrm } from '../../../../../src/portalPayments/crm.server.js';
import { safePaymentStatus } from '../../../../../src/portalPayments/contract.js';
import { portalPaymentFailure, portalPaymentInput, portalPaymentJson } from '../../../../../src/portalPayments/http.server.js';
import { readPortalPaymentReturnState } from '../../../../../src/portalPayments/returnState.server.js';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const identity = await resolveAuthenticatedPortalIdentity(request);
    const input = await portalPaymentInput(request);
    const state = readPortalPaymentReturnState(input.state, identity.account.accountId);
    const status = await callPortalPaymentsCrm('status', identity.account, { paymentRequestId: state.paymentRequestId });
    return portalPaymentJson({ ok: true, result: safePaymentStatus(status.result) });
  } catch (error) { return portalPaymentFailure(error); }
}
