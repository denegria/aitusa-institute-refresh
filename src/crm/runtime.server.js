import { getPortalDatabase, isPortalDatabaseConfigured } from "../diagnostic/db.server.js";
import { getFunnelLedgerService } from "../observability/runtime.server.js";
import {
  createAitCrmTransport,
  createCrmOutboxDispatcher,
  createNeonCrmOutboxRepository,
} from "./outbox.server.js";

let cachedDispatcher = null;

export function isCrmOutboxConfigured() {
  return Boolean(
    isPortalDatabaseConfigured() &&
    process.env.AIT_CRM_WEBSITE_LEADS_URL &&
    process.env.AIT_CRM_WEBSITE_LEADS_SECRET,
  );
}

export function getCrmOutboxDispatcher() {
  if (cachedDispatcher) return cachedDispatcher;
  if (!isCrmOutboxConfigured()) throw new Error("crm_delivery_unavailable");
  cachedDispatcher = createCrmOutboxDispatcher({
    repository: createNeonCrmOutboxRepository(getPortalDatabase()),
    transport: createAitCrmTransport({
      url: process.env.AIT_CRM_WEBSITE_LEADS_URL,
      secret: process.env.AIT_CRM_WEBSITE_LEADS_SECRET,
      protectionBypassSecret: process.env.AIT_CRM_VERCEL_PROTECTION_BYPASS,
    }),
    ledger: getFunnelLedgerService(),
  });
  return cachedDispatcher;
}

export async function dispatchCrmOutboxBestEffort({ limit = 10 } = {}) {
  if (!isCrmOutboxConfigured()) return { ok: false, error: "crm_delivery_unavailable" };
  try {
    return { ok: true, ...(await getCrmOutboxDispatcher().dispatchDue({ limit })) };
  } catch {
    return { ok: false, error: "crm_dispatch_failed" };
  }
}
