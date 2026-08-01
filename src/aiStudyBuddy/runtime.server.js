import { getPortalSqlClient, isPortalDatabaseConfigured } from "../diagnostic/db.server.js";
import { assertFakeProviderConstructionAllowed, getStudyBuddyConfig } from "./config.server.js";
import { createFakeStudyBuddyProvider } from "./fakeStudyBuddyProvider.js";
import { createNeonStudyBuddyRepository } from "./neonRepository.server.js";
import { createStudyBuddyService } from "./service.js";
import { getFunnelLedgerService } from "../observability/runtime.server.js";

let cachedRuntime = null;

export function getStudyBuddyRuntime(environment = process.env) {
  if (environment === process.env && cachedRuntime) return cachedRuntime;
  const config = getStudyBuddyConfig(environment);
  if (!config.enabled || !isPortalDatabaseConfigured()) {
    return { config, service: null };
  }
  assertFakeProviderConstructionAllowed(environment);
  const runtime = {
    config,
    service: createStudyBuddyService({
      repository: createNeonStudyBuddyRepository({
        client: getPortalSqlClient(),
        circuitFailureThreshold: config.limits.circuitFailureThreshold,
        circuitOpenMs: config.limits.circuitOpenMs,
      }),
      provider: createFakeStudyBuddyProvider(),
      config,
      ledger: getFunnelLedgerService(),
    }),
  };
  if (environment === process.env) cachedRuntime = runtime;
  return runtime;
}
