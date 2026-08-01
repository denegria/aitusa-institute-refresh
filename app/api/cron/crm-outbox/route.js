import { diagnosticJson } from '../../../../src/diagnostic/http.server.js';
import { getPortalDatabase, isPortalDatabaseConfigured } from '../../../../src/diagnostic/db.server.js';
import {
  createAitCrmTransport,
  createCrmOutboxDispatcher,
  createNeonCrmOutboxRepository,
} from '../../../../src/crm/outbox.server.js';
import { getFunnelLedgerService } from '../../../../src/observability/runtime.server.js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function configured() {
  return Boolean(
    isPortalDatabaseConfigured() &&
    process.env.AIT_CRM_WEBSITE_LEADS_URL &&
    process.env.AIT_CRM_WEBSITE_LEADS_SECRET,
  );
}

async function handle(request) {
  if (!process.env.CRON_SECRET || request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return diagnosticJson({ ok: false, error: 'cron_unauthorized' }, { status: 401 });
  }
  if (!configured()) {
    return diagnosticJson({ ok: false, error: 'crm_delivery_unavailable' }, { status: 503 });
  }
  const dispatcher = createCrmOutboxDispatcher({
    repository: createNeonCrmOutboxRepository(getPortalDatabase()),
    transport: createAitCrmTransport({
      url: process.env.AIT_CRM_WEBSITE_LEADS_URL,
      secret: process.env.AIT_CRM_WEBSITE_LEADS_SECRET,
      protectionBypassSecret: process.env.AIT_CRM_VERCEL_PROTECTION_BYPASS,
    }),
    ledger: getFunnelLedgerService(),
  });
  const counts = await dispatcher.dispatchDue();
  return diagnosticJson({ ok: true, ...counts });
}

export const GET = handle;
export const POST = handle;
