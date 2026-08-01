export const FUNNEL_EVENT_VERSION = 1;
export const FUNNEL_RETENTION_DAYS = 30;
export const FUNNEL_RETENTION_BATCH_SIZE = 250;

export const FUNNEL_EVENT_NAMES = Object.freeze([
  "diagnostic_started",
  "diagnostic_completed",
  "result_save_requested",
  "result_save_completed",
  "portal_auth_success",
  "portal_auth_failure",
  "practice_started",
  "practice_completed",
  "practice_escalated",
  "practice_limit",
  "crm_delivery",
  "crm_retry",
  "crm_dead_letter",
]);

export const FUNNEL_SOURCES = Object.freeze([
  "diagnostic",
  "portal_auth",
  "portal_claim",
  "practice",
  "crm_outbox",
]);

export const FUNNEL_SAFE_OUTCOME_CODES = Object.freeze([
  "started", "completed", "saved", "success", "invalid", "provider_unavailable",
  "backend_unavailable", "rate_limited", "escalated", "session_limit_reached",
  "daily_limit_reached", "retry_limit_reached", "session_expired", "crm_unavailable", "crm_rejected",
  "crm_timeout", "crm_transport_failed",
]);

export const FUNNEL_DURATION_BUCKETS = Object.freeze([
  "lt_1s", "1_5s", "5_30s", "30_120s", "120s_plus",
]);

export const FUNNEL_UTM_KEYS = Object.freeze([
  "utmSource", "utmMedium", "utmCampaign", "utmTerm", "utmContent",
]);

export function funnelDurationBucket(startedAt, completedAt) {
  const milliseconds = new Date(completedAt).getTime() - new Date(startedAt).getTime();
  if (!Number.isFinite(milliseconds) || milliseconds < 1_000) return "lt_1s";
  if (milliseconds < 5_000) return "1_5s";
  if (milliseconds < 30_000) return "5_30s";
  if (milliseconds < 120_000) return "30_120s";
  return "120s_plus";
}
