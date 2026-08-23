import { randomUUID } from "node:crypto";
import { performance } from "node:perf_hooks";
import { addDays } from "../diagnostic/contract.js";
import { PortalClaimError } from "../portalClaim/errors.js";
import { PORTAL_AUTH_SECURITY } from "./contract.js";
import {
  createPortalAuthIdentifierHasher,
  waitForGenericCodeResponse,
} from "./security.js";
import {
  validatePortalPasswordResetConfirmRequest,
  validatePortalPasswordResetRequest,
  validatePortalPasswordSignInRequest,
  validatePortalSignInCodeRequest,
  validatePortalSignInVerifyRequest,
} from "./validation.js";

const GENERIC_CODE_RESPONSE = Object.freeze({
  accepted: true,
  delivery: "email",
  codeLength: 6,
});
const GENERIC_PASSWORD_RESET_RESPONSE = Object.freeze({
  accepted: true,
  delivery: "email",
});

export function createPortalAuthService({
  repository,
  authProvider,
  hashSecret,
  now = () => new Date(),
  createId = () => randomUUID(),
  monotonicNow = () => performance.now(),
  sleep = (milliseconds) =>
    new Promise((resolve) => setTimeout(resolve, milliseconds)),
  security = PORTAL_AUTH_SECURITY,
  ledger = null,
  observeOutcome = null,
}) {
  if (!repository) throw new Error("portal_auth_repository_required");
  if (!authProvider) throw new Error("portal_auth_provider_required");
  const hashIdentifiers = createPortalAuthIdentifierHasher(hashSecret);

  async function reserveAttempt(eventType, identifiers, limits) {
    const occurredAt = now();
    try {
      return await repository.reserveAuthAttempt({
        id: createId(),
        eventType,
        ...identifiers,
        now: occurredAt,
        expiresAt: addDays(occurredAt, security.auditRetentionDays),
        ...limits,
      });
    } catch {
      throw new PortalClaimError("portal_auth_unavailable", 503);
    }
  }

  async function completeAttempt(reservation, outcome) {
    if (!reservation?.allowed) return;
    try {
      await repository.completeAuthAttempt({
        id: reservation.id,
        outcome,
      });
    } catch {
      // The atomic reservation is already durable. A pending outcome is safer
      // than failing an otherwise valid one-time-code flow after provider work.
    }
  }

  function reportOutcome(eventType, outcome) {
    try {
      observeOutcome?.({ eventType, outcome });
    } catch {
      // Authentication must not depend on operational logging.
    }
  }

  async function recordSessionRevokeEvent({
    email = "unknown",
    ipAddress,
    outcome,
  }) {
    const occurredAt = now();
    try {
      await repository.recordAuthEvent({
        id: createId(),
        eventType: "session_revoke",
        ...hashIdentifiers({ email, ipAddress }),
        decision: "recorded",
        outcome,
        occurredAt,
        expiresAt: addDays(occurredAt, security.auditRetentionDays),
      });
    } catch {
      // Sign-out must always clear the local cookie even when audit persistence
      // is temporarily unavailable.
    }
  }

  async function resolveAudienceSnapshot(request, verified) {
    if (!isVerifiedIdentityForEmail(verified?.identity, request.email)) {
      throw new PortalClaimError("portal_sign_in_invalid", 401);
    }
    if (
      typeof verified.sessionData !== "string" ||
      verified.sessionData.length === 0
    ) {
      throw new PortalClaimError("portal_sign_in_invalid", 401);
    }

    let snapshot;
    try {
      snapshot = request.audience === "employee"
        ? await repository.getActiveEmployeeIdentity(toPortalIdentity(verified.identity))
        : await repository.getActivePortalSnapshot(toPortalIdentity(verified.identity));
    } catch {
      throw new PortalClaimError("portal_auth_unavailable", 503);
    }
    if (!snapshot) throw new PortalClaimError("portal_sign_in_invalid", 401);
    return snapshot;
  }

  return {
    async requestSignInCode(input, requestMetadata = {}) {
      const request = validatePortalSignInCodeRequest(input);
      const identifiers = hashIdentifiers({
        email: request.email,
        ipAddress: requestMetadata.ipAddress,
      });
      let reservation = null;
      let outcome = "backend_error";
      let envelopeStartedAt;

      try {
        reservation = await reserveAttempt(
          "code_request",
          identifiers,
          security.codeRequest,
        );
        envelopeStartedAt = monotonicNow();

        if (!reservation.allowed) {
          outcome = "rate_limited";
        } else if (
          !(await repository.hasActivePortalAccountByEmail(request.email, request.audience))
        ) {
          outcome = "account_unavailable";
        } else {
          try {
            await authProvider.sendCode({
              email: request.email,
              ...requestMetadata,
            });
            outcome = "provider_dispatched";
          } catch (error) {
            outcome =
              error instanceof PortalClaimError &&
              error.code === "identity_provider_unavailable"
                ? "provider_unavailable"
                : "provider_error";
          }
        }
      } catch {
        outcome = "backend_error";
      } finally {
        if (envelopeStartedAt === undefined) {
          envelopeStartedAt = monotonicNow();
        }
        await completeAttempt(reservation, outcome);
        reportOutcome("code_request", outcome);
        await waitForGenericCodeResponse({
          startedAt: envelopeStartedAt,
          monotonicNow,
          sleep,
          minimumMs: security.minimumCodeResponseMs,
        });
      }

      return { ...GENERIC_CODE_RESPONSE };
    },

    async verifySignInCode(input, requestMetadata = {}) {
      const request = validatePortalSignInVerifyRequest(input);
      const identifiers = hashIdentifiers({
        email: request.email,
        ipAddress: requestMetadata.ipAddress,
      });
      const reservation = await reserveAttempt(
        "code_verify",
        identifiers,
        security.codeVerify,
      );
      if (!reservation.allowed) {
        throw new PortalClaimError("portal_sign_in_invalid", 401);
      }

      let verified;
      let outcome = "backend_error";
      let funnelCorrelationId = null;

      try {
        try {
          verified = await authProvider.verifyCode({
            email: request.email,
            code: request.code,
            ...requestMetadata,
          });
        } catch (error) {
          const publicError = publicVerificationError(error);
          outcome =
            publicError.code === "identity_provider_unavailable"
              ? "provider_unavailable"
              : "invalid";
          throw publicError;
        }

        if (!isVerifiedIdentityForEmail(verified?.identity, request.email)) {
          outcome = "invalid";
          throw new PortalClaimError("portal_sign_in_invalid", 401);
        }
        if (
          typeof verified.sessionData !== "string" ||
          verified.sessionData.length === 0
        ) {
          outcome = "invalid";
          throw new PortalClaimError("portal_sign_in_invalid", 401);
        }

        let snapshot;
        try {
          snapshot = request.audience === "employee"
            ? await repository.getActiveEmployeeIdentity(toPortalIdentity(verified.identity))
            : await repository.getActivePortalSnapshot(toPortalIdentity(verified.identity));
        } catch {
          outcome = "backend_error";
          throw new PortalClaimError("portal_auth_unavailable", 503);
        }
        if (!snapshot) {
          outcome = "invalid";
          throw new PortalClaimError("portal_sign_in_invalid", 401);
        }

        outcome = "success";
        try {
          if (request.audience === "student") {
            funnelCorrelationId = await repository.getActiveFunnelCorrelationForIdentity?.(
              toPortalIdentity(verified.identity),
            ) ?? null;
          }
        } catch {
          // Portal authentication is authoritative; a telemetry lookup must not change it.
        }
        return {
          sessionData: verified.sessionData,
          snapshot,
          audience: request.audience,
        };
      } finally {
        await completeAttempt(reservation, outcome);
        reportOutcome("code_verify", outcome);
        if (reservation?.id) await emitLedger(ledger, {
          eventName: outcome === "success" ? "portal_auth_success" : "portal_auth_failure",
          idempotencyKey: `portal-auth-verify:${reservation.id}`,
          correlationId: outcome === "success" ? funnelCorrelationId ?? reservation.id : reservation.id,
          source: "portal_auth",
          safeOutcomeCode: toFunnelAuthOutcome(outcome), occurredAt: now().toISOString(),
        });
      }
    },

    async signInWithPassword(input, requestMetadata = {}) {
      const request = validatePortalPasswordSignInRequest(input);
      const identifiers = hashIdentifiers({
        email: request.email,
        ipAddress: requestMetadata.ipAddress,
      });
      const reservation = await reserveAttempt(
        "password_verify",
        identifiers,
        security.passwordVerify,
      );
      if (!reservation.allowed) {
        throw new PortalClaimError("portal_sign_in_invalid", 401);
      }

      let outcome = "backend_error";
      let funnelCorrelationId = null;
      try {
        let verified;
        try {
          verified = await authProvider.authenticatePassword({
            email: request.email,
            password: request.password,
            ...requestMetadata,
          });
        } catch (error) {
          const publicError = publicPasswordError(error);
          outcome = publicError.code === "identity_provider_unavailable"
            ? "provider_unavailable"
            : publicError.code === "password_auth_rate_limited"
              ? "rate_limited"
              : "invalid";
          throw publicError;
        }

        const snapshot = await resolveAudienceSnapshot(request, verified);
        outcome = "success";
        try {
          if (request.audience === "student") {
            funnelCorrelationId = await repository.getActiveFunnelCorrelationForIdentity?.(
              toPortalIdentity(verified.identity),
            ) ?? null;
          }
        } catch {
          // Authentication is authoritative; telemetry correlation is optional.
        }
        return {
          sessionData: verified.sessionData,
          snapshot,
          audience: request.audience,
        };
      } finally {
        await completeAttempt(reservation, outcome);
        reportOutcome("password_verify", outcome);
        if (reservation?.id) await emitLedger(ledger, {
          eventName: outcome === "success" ? "portal_auth_success" : "portal_auth_failure",
          idempotencyKey: `portal-auth-password:${reservation.id}`,
          correlationId: outcome === "success" ? funnelCorrelationId ?? reservation.id : reservation.id,
          source: "portal_auth",
          safeOutcomeCode: toFunnelAuthOutcome(outcome), occurredAt: now().toISOString(),
        });
      }
    },

    async requestPasswordReset(input, requestMetadata = {}) {
      const request = validatePortalPasswordResetRequest(input);
      const identifiers = hashIdentifiers({
        email: request.email,
        ipAddress: requestMetadata.ipAddress,
      });
      let reservation = null;
      let outcome = "backend_error";
      let envelopeStartedAt;

      try {
        reservation = await reserveAttempt(
          "password_reset_request",
          identifiers,
          security.passwordReset,
        );
        envelopeStartedAt = monotonicNow();
        if (!reservation.allowed) {
          outcome = "rate_limited";
        } else if (
          !(await repository.hasActivePortalAccountByEmail(request.email, request.audience))
        ) {
          outcome = "account_unavailable";
        } else {
          try {
            await authProvider.sendPasswordReset({ email: request.email });
            outcome = "provider_dispatched";
          } catch (error) {
            outcome = error instanceof PortalClaimError &&
              error.code === "identity_provider_unavailable"
              ? "provider_unavailable"
              : "provider_error";
          }
        }
      } catch {
        outcome = "backend_error";
      } finally {
        if (envelopeStartedAt === undefined) envelopeStartedAt = monotonicNow();
        await completeAttempt(reservation, outcome);
        reportOutcome("password_reset_request", outcome);
        await waitForGenericCodeResponse({
          startedAt: envelopeStartedAt,
          monotonicNow,
          sleep,
          minimumMs: security.minimumCodeResponseMs,
        });
      }
      return { ...GENERIC_PASSWORD_RESET_RESPONSE };
    },

    async confirmPasswordReset(token, input, requestMetadata = {}) {
      const request = validatePortalPasswordResetConfirmRequest(input);
      if (typeof token !== "string" || token.length < 16 || token.length > 2048) {
        throw new PortalClaimError("password_reset_invalid", 422);
      }
      const identifiers = hashIdentifiers({
        email: token,
        ipAddress: requestMetadata.ipAddress,
      });
      const reservation = await reserveAttempt(
        "password_reset_request",
        identifiers,
        security.passwordResetConfirm,
      );
      if (!reservation.allowed) {
        throw new PortalClaimError("password_reset_rate_limited", 429);
      }

      let outcome = "backend_error";
      try {
        try {
          await authProvider.confirmPasswordReset({
            token,
            password: request.password,
          });
        } catch (error) {
          outcome =
            error instanceof PortalClaimError &&
            error.code === "identity_provider_unavailable"
              ? "provider_unavailable"
              : error instanceof PortalClaimError &&
                  error.code === "password_reset_rate_limited"
                ? "rate_limited"
                : "invalid";
          if (
            error instanceof PortalClaimError &&
            [
              "identity_provider_unavailable",
              "password_reset_rate_limited",
            ].includes(error.code)
          ) {
            throw error;
          }
          throw new PortalClaimError("password_reset_invalid", 422);
        }
        outcome = "success";
        return { completed: true };
      } finally {
        await completeAttempt(reservation, outcome);
        reportOutcome("password_reset_request", outcome);
      }
    },

    async requestAuthenticatedPasswordSetup(sessionData, requestMetadata = {}) {
      if (!sessionData) throw new PortalClaimError("portal_session_required", 401);
      let identity;
      try {
        identity = await authProvider.authenticateSession(sessionData);
      } catch (error) {
        if (error instanceof PortalClaimError && error.code === "identity_provider_unavailable") {
          throw error;
        }
        throw new PortalClaimError("portal_session_invalid", 401);
      }
      if (!isVerifiedIdentity(identity)) {
        throw new PortalClaimError("portal_session_invalid", 401);
      }
      const account = await repository.getActivePortalIdentity(toPortalIdentity(identity));
      if (!account) throw new PortalClaimError("portal_session_invalid", 401);

      const identifiers = hashIdentifiers({
        email: identity.email,
        ipAddress: requestMetadata.ipAddress,
      });
      const reservation = await reserveAttempt(
        "password_reset_request",
        identifiers,
        security.passwordReset,
      );
      if (!reservation.allowed) {
        await completeAttempt(reservation, "rate_limited");
        reportOutcome("password_reset_request", "rate_limited");
        throw new PortalClaimError("password_setup_rate_limited", 429);
      }

      let outcome = "provider_error";
      try {
        await authProvider.sendPasswordReset({ email: identity.email });
        outcome = "provider_dispatched";
        return { ...GENERIC_PASSWORD_RESET_RESPONSE };
      } catch (error) {
        outcome = error instanceof PortalClaimError &&
          error.code === "identity_provider_unavailable"
          ? "provider_unavailable"
          : "provider_error";
        throw new PortalClaimError("password_setup_unavailable", 503);
      } finally {
        await completeAttempt(reservation, outcome);
        reportOutcome("password_reset_request", outcome);
      }
    },

    async resolveAuthenticatedSession(sessionData) {
      if (!sessionData) {
        throw new PortalClaimError("portal_session_required", 401);
      }

      let identity;
      try {
        identity = await authProvider.authenticateSession(sessionData);
      } catch (error) {
        if (
          error instanceof PortalClaimError &&
          error.code === "identity_provider_unavailable"
        ) {
          throw error;
        }
        throw new PortalClaimError("portal_session_invalid", 401);
      }

      if (!isVerifiedIdentity(identity)) {
        throw new PortalClaimError("portal_session_invalid", 401);
      }

      const snapshot = await repository.getActivePortalSnapshot(
        toPortalIdentity(identity),
      );
      if (!snapshot) {
        throw new PortalClaimError("portal_session_invalid", 401);
      }
      return snapshot;
    },

    async resolveAuthenticatedIdentity(sessionData) {
      if (!sessionData) {
        throw new PortalClaimError("portal_session_required", 401);
      }
      let identity;
      try {
        identity = await authProvider.authenticateSession(sessionData);
      } catch (error) {
        if (
          error instanceof PortalClaimError &&
          error.code === "identity_provider_unavailable"
        ) {
          throw error;
        }
        throw new PortalClaimError("portal_session_invalid", 401);
      }
      if (!isVerifiedIdentity(identity)) {
        throw new PortalClaimError("portal_session_invalid", 401);
      }
      const account = await repository.getActivePortalIdentity(
        toPortalIdentity(identity),
      );
      if (!account) {
        throw new PortalClaimError("portal_session_invalid", 401);
      }
      return { state: "authenticated", account };
    },

    async resolveAuthorizedStudyBuddyContext(sessionData) {
      if (!sessionData) {
        throw new PortalClaimError("portal_session_required", 401);
      }
      let identity;
      try {
        identity = await authProvider.authenticateSession(sessionData);
      } catch (error) {
        if (error instanceof PortalClaimError && error.code === "identity_provider_unavailable") {
          throw error;
        }
        throw new PortalClaimError("portal_session_invalid", 401);
      }
      if (!isVerifiedIdentity(identity)) {
        throw new PortalClaimError("portal_session_invalid", 401);
      }
      const normalizedIdentity = toPortalIdentity(identity);
      const identifiers = hashIdentifiers({ email: normalizedIdentity.email });
      const context = await repository.getAuthorizedStudyBuddyContext?.(normalizedIdentity);
      if (!context?.snapshot || !context?.ownership?.accountId) {
        throw new PortalClaimError("portal_session_invalid", 401);
      }
      return {
        snapshot: context.snapshot,
        ownership: {
          accountId: context.ownership.accountId,
          resultId: context.ownership.resultId,
          funnelCorrelationId: context.ownership.funnelCorrelationId,
          verifiedEmailHmac: identifiers.emailKeyHash,
          hashVersion: identifiers.keyVersion,
        },
      };
    },

    async revokeSession(sessionData, requestMetadata = {}) {
      let email = "unknown";
      let outcome = sessionData ? "revoke_failed" : "no_session";

      try {
        if (!sessionData) return { revoked: false };
        const identity = await authProvider.authenticateSession(sessionData);
        if (isVerifiedIdentity(identity)) email = identity.email;
        if (!identity?.sessionId) {
          outcome = "invalid";
          return { revoked: false };
        }
        await authProvider.revokeSession(identity.sessionId);
        outcome = "revoked";
        return { revoked: true };
      } catch (error) {
        outcome =
          error instanceof PortalClaimError &&
          error.code === "identity_provider_unavailable"
            ? "provider_unavailable"
            : "revoke_failed";
        return { revoked: false };
      } finally {
        await recordSessionRevokeEvent({
          email,
          ipAddress: requestMetadata.ipAddress,
          outcome,
        });
      }
    },
  };
}

async function emitLedger(ledger, event) {
  if (!ledger) return;
  try { await ledger.emit(event); } catch { /* Auth must not disclose ledger availability. */ }
}

function toFunnelAuthOutcome(outcome) {
  if (["invalid", "rate_limited", "provider_unavailable"].includes(outcome)) return outcome;
  return outcome === "success" ? "success" : "backend_unavailable";
}

function publicVerificationError(error) {
  if (
    error instanceof PortalClaimError &&
    ["identity_provider_unavailable", "magic_auth_rate_limited"].includes(
      error.code,
    )
  ) {
    return error;
  }
  return new PortalClaimError("portal_sign_in_invalid", 401);
}

function publicPasswordError(error) {
  if (
    error instanceof PortalClaimError &&
    ["identity_provider_unavailable", "password_auth_rate_limited"].includes(error.code)
  ) {
    return error;
  }
  return new PortalClaimError("portal_sign_in_invalid", 401);
}

function isVerifiedIdentityForEmail(identity, email) {
  return (
    isVerifiedIdentity(identity) &&
    identity.email.trim().toLowerCase() === email
  );
}

function isVerifiedIdentity(identity) {
  return Boolean(
    identity?.providerUserId &&
      typeof identity.email === "string" &&
      identity.email.trim() &&
      identity.emailVerified === true,
  );
}

function toPortalIdentity(identity) {
  return {
    providerUserId: identity.providerUserId,
    email: identity.email.trim().toLowerCase(),
    emailVerified: true,
  };
}
