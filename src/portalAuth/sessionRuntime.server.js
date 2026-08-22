import { createWorkOSAuthProvider } from "../portalClaim/workosAdapter.server.js";

let cachedProvider = null;

export function isPortalSessionProviderConfigured() {
  return Boolean(
    process.env.WORKOS_API_KEY &&
      process.env.WORKOS_CLIENT_ID &&
      process.env.WORKOS_COOKIE_PASSWORD?.length >= 32,
  );
}

export function getPortalSessionProvider() {
  if (cachedProvider) return cachedProvider;
  if (!isPortalSessionProviderConfigured()) {
    throw new Error("portal_session_provider_not_configured");
  }
  cachedProvider = createWorkOSAuthProvider({
    apiKey: process.env.WORKOS_API_KEY,
    clientId: process.env.WORKOS_CLIENT_ID,
    cookiePassword: process.env.WORKOS_COOKIE_PASSWORD,
  });
  return cachedProvider;
}

export async function maintainPortalSession(sessionData) {
  return getPortalSessionProvider().maintainSession(sessionData);
}
