import { PortalClaimError } from "../portalClaim/errors.js";
import { readPortalSessionCookie } from "../portalClaim/session.server.js";
import {
  getPortalAuthService,
  isPortalAuthServiceConfigured,
} from "./runtime.server.js";
import { readMaintainedPortalIdentity } from "./maintainedSession.server.js";

export function createPortalSessionResolver({
  service,
  sessionContextSecret = process.env.PORTAL_AUTH_HASH_SECRET,
}) {
  if (!service) throw new Error("portal_auth_service_required");

  return async function resolveAuthenticatedPortalSnapshot(request) {
    if (!request?.headers || typeof request.headers.get !== "function") {
      throw new PortalClaimError("portal_request_invalid", 400);
    }
    const maintainedIdentity = readMaintainedPortalIdentity(
      request,
      sessionContextSecret,
    );
    if (maintainedIdentity) {
      return service.resolveMaintainedSession(maintainedIdentity);
    }
    return service.resolveAuthenticatedSession(readPortalSessionCookie(request));
  };
}

export function createStudyBuddyContextResolver({ service }) {
  if (!service) throw new Error("portal_auth_service_required");
  return async function resolveAuthorizedStudyBuddyContext(request) {
    if (!request?.headers || typeof request.headers.get !== "function") {
      throw new PortalClaimError("portal_request_invalid", 400);
    }
    return service.resolveAuthorizedStudyBuddyContext(readPortalSessionCookie(request));
  };
}

export async function resolveAuthenticatedPortalSnapshot(request) {
  if (!isPortalAuthServiceConfigured()) {
    throw new PortalClaimError("portal_auth_unavailable", 503);
  }
  return createPortalSessionResolver({
    service: getPortalAuthService(),
  })(request);
}

export async function resolveAuthenticatedPortalIdentity(request) {
  if (!isPortalAuthServiceConfigured()) {
    throw new PortalClaimError("portal_auth_unavailable", 503);
  }
  if (!request?.headers || typeof request.headers.get !== "function") {
    throw new PortalClaimError("portal_request_invalid", 400);
  }
  const service = getPortalAuthService();
  const maintainedIdentity = readMaintainedPortalIdentity(
    request,
    process.env.PORTAL_AUTH_HASH_SECRET,
  );
  if (maintainedIdentity) {
    return service.resolveMaintainedIdentity(maintainedIdentity);
  }
  return service.resolveAuthenticatedIdentity(readPortalSessionCookie(request));
}

export async function resolveAuthorizedStudyBuddyContext(request) {
  if (!isPortalAuthServiceConfigured()) {
    throw new PortalClaimError("portal_auth_unavailable", 503);
  }
  return createStudyBuddyContextResolver({ service: getPortalAuthService() })(request);
}
