import { getPortalDatabase, isPortalDatabaseConfigured } from "../diagnostic/db.server.js";
import { createWorkOSAuthProvider } from "../portalClaim/workosAdapter.server.js";
import { createGuardianOnboardingService } from "./service.js";
import { createNeonGuardianRepository } from "./neonRepository.server.js";

let cachedService = null;

export function isGuardianOnboardingConfigured() {
  return Boolean(
    process.env.GUARDIAN_ONBOARDING_ENABLED === "true" &&
    isPortalDatabaseConfigured() &&
    process.env.WORKOS_API_KEY &&
    process.env.WORKOS_CLIENT_ID &&
    process.env.WORKOS_COOKIE_PASSWORD?.length >= 32,
  );
}

export function getGuardianOnboardingService() {
  if (cachedService) return cachedService;
  if (!isGuardianOnboardingConfigured()) throw new Error("guardian_onboarding_not_configured");
  cachedService = createGuardianOnboardingService({
    repository: createNeonGuardianRepository(getPortalDatabase()),
    authProvider: createWorkOSAuthProvider({
      apiKey: process.env.WORKOS_API_KEY,
      clientId: process.env.WORKOS_CLIENT_ID,
      cookiePassword: process.env.WORKOS_COOKIE_PASSWORD,
    }),
  });
  return cachedService;
}
