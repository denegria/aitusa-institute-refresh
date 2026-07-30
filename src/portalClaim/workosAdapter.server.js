import { WorkOS } from "@workos-inc/node";
import { PORTAL_AUTH_CHALLENGE_MINUTES } from "./contract.js";
import { PortalClaimError } from "./errors.js";

export function createWorkOSAuthProvider({
  apiKey,
  clientId,
  cookiePassword,
}) {
  if (!apiKey || !clientId || !cookiePassword || cookiePassword.length < 32) {
    throw new Error("workos_auth_configuration_invalid");
  }
  const workos = new WorkOS(apiKey, { clientId });

  return {
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
        const user = authenticationResponse.user;
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
      } catch (error) {
        if (error instanceof PortalClaimError) throw error;
        throw mapWorkOSError(error, "magic_auth_code_invalid");
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
        };
      } catch (error) {
        if (error instanceof PortalClaimError) throw error;
        throw new PortalClaimError("portal_session_invalid", 401);
      }
    },
  };
}

function mapWorkOSError(error, fallbackCode) {
  const status = Number(error?.status ?? error?.statusCode ?? 0);
  if (status === 429) {
    return new PortalClaimError("magic_auth_rate_limited", 429);
  }
  if (status >= 500) {
    return new PortalClaimError("identity_provider_unavailable", 503);
  }
  if (fallbackCode === "magic_auth_code_invalid") {
    return new PortalClaimError(fallbackCode, 422);
  }
  return new PortalClaimError(fallbackCode, 503);
}

function toIso(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}
