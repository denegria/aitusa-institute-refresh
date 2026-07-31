import {
  getPortalDatabase,
  isPortalDatabaseConfigured,
} from "../diagnostic/db.server.js";
import { createWorkOSAuthProvider } from "../portalClaim/workosAdapter.server.js";
import { createNeonPortalAuthRepository } from "./neonRepository.server.js";
import { createPortalAuthService } from "./service.js";

let cachedService = null;

export function isPortalAuthServiceConfigured() {
  return Boolean(
    isPortalDatabaseConfigured() &&
      process.env.WORKOS_API_KEY &&
      process.env.WORKOS_CLIENT_ID &&
      process.env.WORKOS_COOKIE_PASSWORD?.length >= 32 &&
      process.env.PORTAL_AUTH_HASH_SECRET?.length >= 32,
  );
}

export function getPortalAuthService() {
  if (cachedService) return cachedService;
  if (!isPortalAuthServiceConfigured()) {
    throw new Error("portal_auth_service_not_configured");
  }

  cachedService = createPortalAuthService({
    repository: createNeonPortalAuthRepository(getPortalDatabase()),
    authProvider: createWorkOSAuthProvider({
      apiKey: process.env.WORKOS_API_KEY,
      clientId: process.env.WORKOS_CLIENT_ID,
      cookiePassword: process.env.WORKOS_COOKIE_PASSWORD,
    }),
    hashSecret: process.env.PORTAL_AUTH_HASH_SECRET,
  });
  return cachedService;
}
