import { getPortalDatabase, isPortalDatabaseConfigured } from "../diagnostic/db.server.js";
import { createNeonFunnelOperatorRepository } from "./operatorNeonRepository.server.js";
import { createFunnelOperatorService } from "./operatorService.js";

let cachedService = null;

export function isFunnelOperatorConfigured() {
  return Boolean(isPortalDatabaseConfigured() && process.env.CRON_SECRET);
}

export function getFunnelOperatorService() {
  if (cachedService) return cachedService;
  if (!isFunnelOperatorConfigured()) throw new Error("funnel_operator_not_configured");
  cachedService = createFunnelOperatorService({
    repository: createNeonFunnelOperatorRepository(getPortalDatabase()),
  });
  return cachedService;
}
