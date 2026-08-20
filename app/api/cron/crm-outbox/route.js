import { diagnosticJson } from '../../../../src/diagnostic/http.server.js';
import {
  getCrmOutboxDispatcher,
  isCrmOutboxConfigured,
} from '../../../../src/crm/runtime.server.js';
import { reconcileClaimedPlacementReviewsBestEffort } from '../../../../src/placementReview/runtime.server.js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function handle(request) {
  if (!process.env.CRON_SECRET || request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return diagnosticJson({ ok: false, error: 'cron_unauthorized' }, { status: 401 });
  }
  if (!isCrmOutboxConfigured()) {
    return diagnosticJson({ ok: false, error: 'crm_delivery_unavailable' }, { status: 503 });
  }
  const reviews = await reconcileClaimedPlacementReviewsBestEffort({ limit: 50 });
  const counts = await getCrmOutboxDispatcher().dispatchDue();
  return diagnosticJson({ ok: true, reviews, ...counts });
}

export const GET = handle;
export const POST = handle;
