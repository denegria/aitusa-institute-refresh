export class PortalPaymentsExperienceError extends Error {
  constructor(code, status = 400, message = 'No pudimos cargar tus pagos.') {
    super(message);
    this.name = 'PortalPaymentsExperienceError';
    this.code = code;
    this.status = status;
  }
}

export function safePortalPaymentsSnapshot(payload = {}) {
  const result = payload?.result || payload;
  return {
    state: 'ready',
    student: {
      name: String(result?.student?.name || ''),
      email: String(result?.student?.email || ''),
    },
    charges: Array.isArray(result?.charges) ? result.charges.map((charge) => ({
      id: String(charge.id || ''),
      type: String(charge.type || ''),
      description: String(charge.description || 'Cargo de AIT USA'),
      originalAmount: String(charge.originalAmount || '0.00'),
      appliedAmount: String(charge.appliedAmount || '0.00'),
      remainingAmount: String(charge.remainingAmount || '0.00'),
      currency: String(charge.currency || 'USD'),
      state: ['due', 'partially_paid', 'overdue', 'paid'].includes(charge.state) ? charge.state : 'due',
      servicePeriodStart: charge.servicePeriodStart || null,
      servicePeriodEnd: charge.servicePeriodEnd || null,
      upcomingPeriodStart: charge.upcomingPeriodStart || null,
      originalDueDate: charge.originalDueDate || null,
    })) : [],
    unappliedCredit: {
      amount: String(result?.unappliedCredit?.amount || '0.00'),
      currency: String(result?.unappliedCredit?.currency || 'USD'),
    },
    receipts: Array.isArray(result?.receipts) ? result.receipts.map((receipt) => ({
      id: String(receipt.id || ''),
      number: String(receipt.number || 'Recibo'),
      issueDate: receipt.issueDate || null,
      total: String(receipt.total || '0.00'),
      currency: String(receipt.currency || 'USD'),
    })) : [],
    paymentRequests: Array.isArray(result?.paymentRequests) ? result.paymentRequests.map(safePaymentStatus) : [],
  };
}

export function safePaymentStatus(input = {}) {
  return {
    paymentRequestId: String(input.paymentRequestId || input.id || ''),
    chargeId: input.chargeId ? String(input.chargeId) : null,
    state: ['verifying', 'confirmed', 'declined', 'cancelled', 'expired'].includes(input.state) ? input.state : 'verifying',
    amount: String(input.amount || '0.00'),
    currency: String(input.currency || 'USD'),
    verifiedAt: input.verifiedAt || null,
    receiptAvailable: input.receiptAvailable === true,
  };
}

export function portalPaymentsUnavailable(code = 'portal_payments_unavailable') {
  if (code === 'portal_billing_not_linked' || code === 'portal_identity_review_required') {
    return { state: 'support_required', reason: code, charges: [], receipts: [], paymentRequests: [], unappliedCredit: { amount: '0.00', currency: 'USD' } };
  }
  return { state: 'unavailable', reason: code, charges: [], receipts: [], paymentRequests: [], unappliedCredit: { amount: '0.00', currency: 'USD' } };
}
