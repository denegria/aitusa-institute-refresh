import { PortalClaimError } from "../portalClaim/errors.js";
import { readPortalSessionCookie } from "../portalClaim/session.server.js";
import {
  getPortalAuthService,
  isPortalAuthServiceConfigured,
} from "./runtime.server.js";

export function createPortalSessionResolver({ service }) {
  if (!service) throw new Error("portal_auth_service_required");

  return async function resolveAuthenticatedPortalSnapshot(request) {
    if (!request?.headers || typeof request.headers.get !== "function") {
      throw new PortalClaimError("portal_request_invalid", 400);
    }
    return service.resolveAuthenticatedSession(readPortalSessionCookie(request));
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
