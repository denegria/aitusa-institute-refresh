export const CRM_OUTBOX_MAX_ATTEMPTS = 4;
export const CRM_OUTBOX_SCHEMA_VERSION = 'aitusa-crm-event-v1';
export const CRM_OUTBOX_LEASE_MS = 2 * 60_000;
export const CRM_TRANSPORT_TIMEOUT_MS = 8_000;

const RETRY_DELAYS_MS = [60_000, 5 * 60_000, 15 * 60_000, 60 * 60_000];

export function nextCrmOutboxAttemptAt(attemptCount, now = new Date()) {
  const delay = RETRY_DELAYS_MS[Math.max(0, Math.min(attemptCount - 1, RETRY_DELAYS_MS.length - 1))];
  return new Date(now.getTime() + delay);
}

export function safeCrmDeliveryError(error) {
  const status = Number(error?.status);
  if (Number.isInteger(status)) return status >= 500 ? 'crm_unavailable' : 'crm_rejected';
  if (error?.name === 'AbortError') return 'crm_timeout';
  return 'crm_transport_failed';
}

export function createAitCrmTransport({ url, secret, fetchImpl = fetch, timeoutMs = CRM_TRANSPORT_TIMEOUT_MS }) {
  if (!url || !secret) throw new Error('crm_transport_not_configured');
  if (!Number.isInteger(timeoutMs) || timeoutMs < 100 || timeoutMs > 60_000) throw new Error('crm_transport_timeout_invalid');
  return {
    async deliver(payload) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      let response;
      try {
        response = await fetchImpl(url, {
          method: 'POST',
          headers: { 'content-type': 'application/json', 'x-ait-webhook-secret': secret },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timer);
      }
      if (!response.ok) {
        const error = new Error('crm_delivery_failed');
        error.status = response.status;
        throw error;
      }
      const acknowledgement = await response.json().catch(() => null);
      if (acknowledgement?.acknowledged !== true) {
        const error = new Error('crm_acknowledgement_invalid');
        error.status = response.status;
        throw error;
      }
      return { acknowledged: true };
    },
  };
}

export function createCrmOutboxDispatcher({ repository, transport, now = () => new Date() }) {
  if (!repository) throw new Error('crm_outbox_repository_required');
  if (!transport) throw new Error('crm_outbox_transport_required');
  return {
    async dispatchDue({ limit = 20 } = {}) {
      const result = { delivered: 0, retried: 0, deadLettered: 0 };
      const boundedLimit = Math.max(1, Math.min(Number(limit) || 20, 50));
      for (let index = 0; index < boundedLimit; index += 1) {
        const claimedAt = now();
        const item = await repository.claimNext({ now: claimedAt, leaseUntil: new Date(claimedAt.getTime() + CRM_OUTBOX_LEASE_MS) });
        if (!item) break;
        try {
          await transport.deliver(item.payload);
          await repository.markDelivered({ id: item.id, deliveredAt: now() });
          result.delivered += 1;
        } catch (error) {
          const deadLetter = item.attemptCount >= CRM_OUTBOX_MAX_ATTEMPTS;
          await repository.markFailed({
            id: item.id,
            status: deadLetter ? 'dead_letter' : 'retry_wait',
            safeErrorCode: safeCrmDeliveryError(error),
            nextAttemptAt: deadLetter ? null : nextCrmOutboxAttemptAt(item.attemptCount, now()),
          });
          if (deadLetter) result.deadLettered += 1;
          else result.retried += 1;
        }
      }
      return result;
    },
  };
}
