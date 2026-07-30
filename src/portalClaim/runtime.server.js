import {
  getDiagnosticService,
  isDiagnosticServiceConfigured,
} from "../diagnostic/runtime.server.js";
import {
  getPortalDatabase,
  isPortalDatabaseConfigured,
} from "../diagnostic/db.server.js";
import { createNeonPortalClaimRepository } from "./neonRepository.server.js";
import { createPortalClaimService } from "./service.js";
import { createWorkOSAuthProvider } from "./workosAdapter.server.js";

let cachedService = null;

export function isPortalClaimServiceConfigured() {
  return Boolean(
    isPortalDatabaseConfigured() &&
    isDiagnosticServiceConfigured() &&
    process.env.WORKOS_API_KEY &&
    process.env.WORKOS_CLIENT_ID &&
    process.env.WORKOS_COOKIE_PASSWORD?.length >= 32,
  );
}

export function getPortalClaimService() {
  if (cachedService) return cachedService;
  if (!isPortalClaimServiceConfigured()) {
    throw new Error("portal_claim_service_not_configured");
  }
  cachedService = createPortalClaimService({
    repository: createNeonPortalClaimRepository(getPortalDatabase()),
    diagnosticService: getDiagnosticService(),
    authProvider: createWorkOSAuthProvider({
      apiKey: process.env.WORKOS_API_KEY,
      clientId: process.env.WORKOS_CLIENT_ID,
      cookiePassword: process.env.WORKOS_COOKIE_PASSWORD,
    }),
  });
  return cachedService;
}
