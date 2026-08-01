import { getPortalDatabase, isPortalDatabaseConfigured } from "./db.server.js";
import { createNeonDiagnosticRepository } from "./neonRepository.server.js";
import { createDiagnosticService } from "./service.js";
import { getFunnelLedgerService } from "../observability/runtime.server.js";

let cachedService = null;

export function isDiagnosticServiceConfigured() {
  return Boolean(
    isPortalDatabaseConfigured() &&
    process.env.DIAGNOSTIC_RESUME_SECRET,
  );
}

export function getDiagnosticService() {
  if (cachedService) return cachedService;
  if (!isDiagnosticServiceConfigured()) {
    throw new Error("diagnostic_service_not_configured");
  }
  cachedService = createDiagnosticService({
    repository: createNeonDiagnosticRepository(getPortalDatabase()),
    resumeSecret: process.env.DIAGNOSTIC_RESUME_SECRET,
    ledger: getFunnelLedgerService(),
  });
  return cachedService;
}
