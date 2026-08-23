export const PORTAL_AUTH_HASH_VERSION = "hmac-sha256-v1";

export const PORTAL_AUTH_EVENT_TYPES = Object.freeze([
  "code_request",
  "code_verify",
  "password_verify",
  "password_reset_request",
  "session_revoke",
]);

export const PORTAL_AUTH_DECISIONS = Object.freeze([
  "allowed",
  "blocked_cooldown",
  "blocked_email_budget",
  "blocked_ip_budget",
  "recorded",
]);

export const PORTAL_AUTH_OUTCOMES = Object.freeze([
  "pending",
  "rate_limited",
  "provider_dispatched",
  "account_unavailable",
  "provider_error",
  "provider_unavailable",
  "backend_error",
  "success",
  "invalid",
  "revoked",
  "revoke_failed",
  "no_session",
]);

export const PORTAL_AUTH_SECURITY = Object.freeze({
  auditRetentionDays: 7,
  minimumCodeResponseMs: 350,
  codeRequest: Object.freeze({
    windowMinutes: 15,
    emailCooldownSeconds: 60,
    ipCooldownSeconds: 2,
    emailBudget: 5,
    ipBudget: 30,
  }),
  codeVerify: Object.freeze({
    windowMinutes: 15,
    emailCooldownSeconds: 0,
    ipCooldownSeconds: 0,
    emailBudget: 8,
    ipBudget: 40,
  }),
  passwordVerify: Object.freeze({
    windowMinutes: 15,
    emailCooldownSeconds: 0,
    ipCooldownSeconds: 0,
    emailBudget: 8,
    ipBudget: 40,
  }),
  passwordReset: Object.freeze({
    windowMinutes: 15,
    emailCooldownSeconds: 60,
    ipCooldownSeconds: 2,
    emailBudget: 3,
    ipBudget: 20,
  }),
});
