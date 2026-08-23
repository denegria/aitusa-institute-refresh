const SAFE_EVENT_TYPES = new Set([
  "code_request",
  "code_verify",
  "password_verify",
  "password_reset_request",
]);
const SAFE_OUTCOMES = new Set([
  "account_unavailable",
  "backend_error",
  "invalid",
  "provider_dispatched",
  "provider_error",
  "provider_unavailable",
  "rate_limited",
  "success",
]);

export function createPortalAuthOutcomeObserver(logger = console) {
  return ({ eventType, outcome }) => {
    if (!SAFE_EVENT_TYPES.has(eventType) || !SAFE_OUTCOMES.has(outcome)) return;

    logger.info("portal_auth_outcome", {
      eventType,
      outcome,
    });
  };
}
