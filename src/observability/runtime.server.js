import { getPortalDatabase, isPortalDatabaseConfigured } from "../diagnostic/db.server.js";
import { createFunnelLedgerService } from "./funnelService.js";
import { createNeonFunnelLedgerRepository } from "./neonRepository.server.js";

let cachedService = null;

export function getFunnelLedgerService() {
  if (cachedService) return cachedService;
  if (!isPortalDatabaseConfigured()) return null;
  cachedService = createFunnelLedgerService({ repository: createNeonFunnelLedgerRepository(getPortalDatabase()) });
  return cachedService;
}
