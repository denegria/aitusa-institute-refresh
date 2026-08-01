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
  validatePortalSignInCodeRequest,
  validatePortalSignInVerifyRequest,
} from "./validation.js";

const GENERIC_CODE_RESPONSE = Object.freeze({
  accepted: true,
  delivery: "email",
  codeLength: 6,
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
          !(await repository.hasActivePortalAccountByEmail(request.email))
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
          snapshot = await repository.getActivePortalSnapshot(
            toPortalIdentity(verified.identity),
          );
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
          funnelCorrelationId = await repository.getActiveFunnelCorrelationForIdentity?.(
            toPortalIdentity(verified.identity),
          ) ?? null;
        } catch {
          // Portal authentication is authoritative; a telemetry lookup must not change it.
        }
        return {
          sessionData: verified.sessionData,
          snapshot,
        };
      } finally {
        await completeAttempt(reservation, outcome);
        if (reservation?.id) await emitLedger(ledger, {
          eventName: outcome === "success" ? "portal_auth_success" : "portal_auth_failure",
          idempotencyKey: `portal-auth-verify:${reservation.id}`,
          correlationId: outcome === "success" ? funnelCorrelationId ?? reservation.id : reservation.id,
          source: "portal_auth",
          safeOutcomeCode: toFunnelAuthOutcome(outcome), occurredAt: now().toISOString(),
        });
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
