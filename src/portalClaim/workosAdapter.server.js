import { WorkOS } from "@workos-inc/node";
import { PORTAL_AUTH_CHALLENGE_MINUTES } from "./contract.js";
import { PortalClaimError } from "./errors.js";

export function createWorkOSAuthProvider({
  apiKey,
  clientId,
  cookiePassword,
  workosClient,
}) {
  if (!apiKey || !clientId || !cookiePassword || cookiePassword.length < 32) {
    throw new Error("workos_auth_configuration_invalid");
  }
  const workos = workosClient || new WorkOS(apiKey, { clientId });

  return {
    async maintainSession(sessionData) {
      if (typeof sessionData !== "string" || !sessionData) {
        throw new PortalClaimError("portal_session_invalid", 401);
      }
      try {
        const session = workos.userManagement.loadSealedSession({
          sessionData,
          cookiePassword,
        });
        const authenticated = await session.authenticate();
        if (authenticated.authenticated === true) {
          return { sessionData, refreshed: false };
        }
        if (authenticated.reason !== "invalid_jwt") {
          throw new PortalClaimError("portal_session_invalid", 401);
        }

        const refreshed = await session.refresh();
        if (
          refreshed.authenticated !== true ||
          typeof refreshed.sealedSession !== "string" ||
          !refreshed.sealedSession
        ) {
          throw new PortalClaimError("portal_session_invalid", 401);
        }
        return { sessionData: refreshed.sealedSession, refreshed: true };
      } catch (error) {
        if (error instanceof PortalClaimError) throw error;
        if (isIdentityProviderUnavailable(error)) {
          throw new PortalClaimError("identity_provider_unavailable", 503);
        }
        throw new PortalClaimError("portal_session_invalid", 401);
      }
    },

    async sendCode({ email, ipAddress, userAgent }) {
      try {
        const magicAuth = await workos.userManagement.createMagicAuth({
          email,
          ...(ipAddress ? { ipAddress } : {}),
          ...(userAgent ? { userAgent } : {}),
        });
        return {
          providerChallengeId: magicAuth.id,
          providerUserId: magicAuth.userId || null,
          expiresAt:
            toIso(magicAuth.expiresAt) ||
            new Date(
              Date.now() + PORTAL_AUTH_CHALLENGE_MINUTES * 60 * 1000,
            ).toISOString(),
        };
      } catch (error) {
        throw mapWorkOSError(error, "magic_auth_delivery_failed");
      }
    },

    async verifyCode({ email, code, ipAddress, userAgent }) {
      try {
        const authenticationResponse =
          await workos.userManagement.authenticateWithMagicAuth({
            clientId,
            email,
            code,
            ...(ipAddress ? { ipAddress } : {}),
            ...(userAgent ? { userAgent } : {}),
          });
        return verifiedSessionFromAuthenticationResponse(
          workos,
          authenticationResponse,
          cookiePassword,
        );
      } catch (error) {
        if (error instanceof PortalClaimError) throw error;
        throw mapWorkOSError(error, "magic_auth_code_invalid");
      }
    },

    async authenticatePassword({ email, password, ipAddress, userAgent }) {
      try {
        const authenticationResponse =
          await workos.userManagement.authenticateWithPassword({
            clientId,
            email,
            password,
            ...(ipAddress ? { ipAddress } : {}),
            ...(userAgent ? { userAgent } : {}),
          });
        return verifiedSessionFromAuthenticationResponse(
          workos,
          authenticationResponse,
          cookiePassword,
        );
      } catch (error) {
        if (error instanceof PortalClaimError) throw error;
        throw mapWorkOSError(error, "password_auth_invalid");
      }
    },

    async sendPasswordReset({ email }) {
      try {
        await workos.userManagement.createPasswordReset({ email });
        return { accepted: true };
      } catch (error) {
        throw mapWorkOSError(error, "password_reset_delivery_failed");
      }
    },

    async authenticateSession(sessionData) {
      try {
        const response =
          await workos.userManagement.authenticateWithSessionCookie({
            sessionData,
            cookiePassword,
          });
        if (
          response.authenticated !== true ||
          !response.sessionId ||
          !response.user?.id ||
          !response.user.email ||
          response.user.emailVerified !== true
        ) {
          throw new PortalClaimError("portal_session_invalid", 401);
        }
        return {
          providerUserId: response.user.id,
          email: response.user.email.trim().toLowerCase(),
          emailVerified: true,
          sessionId: response.sessionId,
        };
      } catch (error) {
        if (error instanceof PortalClaimError) throw error;
        if (isIdentityProviderUnavailable(error)) {
          throw new PortalClaimError("identity_provider_unavailable", 503);
        }
        throw new PortalClaimError("portal_session_invalid", 401);
      }
    },

    async revokeSession(sessionId) {
      if (typeof sessionId !== "string" || !sessionId) {
        throw new PortalClaimError("portal_session_invalid", 401);
      }
      try {
        await workos.userManagement.revokeSession({ sessionId });
      } catch (error) {
        if (isIdentityProviderUnavailable(error)) {
          throw new PortalClaimError("identity_provider_unavailable", 503);
        }
        throw new PortalClaimError("portal_session_revoke_failed", 502);
      }
    },
  };
}

async function verifiedSessionFromAuthenticationResponse(
  workos,
  authenticationResponse,
  cookiePassword,
) {
  const user = authenticationResponse?.user;
  if (!user?.id || !user.email || user.emailVerified !== true) {
    throw new PortalClaimError("verified_identity_invalid", 409);
  }
  const sessionData =
    await workos.userManagement.sealSessionDataFromAuthenticationResponse({
      authenticationResponse,
      cookiePassword,
    });
  return {
    identity: {
      providerUserId: user.id,
      email: user.email.trim().toLowerCase(),
      emailVerified: true,
    },
    sessionData,
  };
}

function mapWorkOSError(error, fallbackCode) {
  const status = Number(error?.status ?? error?.statusCode ?? 0);
  if (status === 429) {
    const rateLimitCode = fallbackCode.startsWith("password_")
      ? fallbackCode === "password_auth_invalid"
        ? "password_auth_rate_limited"
        : "password_reset_rate_limited"
      : "magic_auth_rate_limited";
    return new PortalClaimError(rateLimitCode, 429);
  }
  if (isIdentityProviderUnavailable(error)) {
    return new PortalClaimError("identity_provider_unavailable", 503);
  }
  if (fallbackCode === "magic_auth_code_invalid") {
    return new PortalClaimError(fallbackCode, 422);
  }
  if (fallbackCode === "password_auth_invalid") {
    return new PortalClaimError(fallbackCode, 401);
  }
  return new PortalClaimError(fallbackCode, 503);
}

function isIdentityProviderUnavailable(error, seen = new Set()) {
  if (!error || typeof error !== "object" || seen.has(error)) return false;
  seen.add(error);

  const status = Number(error.status ?? error.statusCode ?? 0);
  if (status === 408 || status === 429 || status >= 500) return true;

  const code = typeof error.code === "string" ? error.code.toUpperCase() : "";
  if (
    [
      "ECONNABORTED",
      "ECONNREFUSED",
      "ECONNRESET",
      "EAI_AGAIN",
      "ENETUNREACH",
      "ENOTFOUND",
      "ETIMEDOUT",
      "ERR_JWKS_TIMEOUT",
    ].includes(code)
  ) {
    return true;
  }

  if (["ABORTERROR", "TIMEOUTERROR", "JWKSTIMEOUT"].includes(
    String(error.name || "").toUpperCase(),
  )) {
    return true;
  }

  const message = String(error.message || "").toLowerCase();
  if (
    message.includes("fetch failed") ||
    message.includes("expected 200 ok from the json web key set") ||
    message.includes("jwks request timed out")
  ) {
    return true;
  }

  return isIdentityProviderUnavailable(error.cause, seen);
}

function toIso(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}
