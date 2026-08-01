import {
  diagnosticFailure,
  diagnosticJson,
} from "../../../../src/diagnostic/http.server.js";
import {
  getDiagnosticService,
  isDiagnosticServiceConfigured,
} from "../../../../src/diagnostic/runtime.server.js";
import { getFunnelLedgerService } from "../../../../src/observability/runtime.server.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function handleRetention(request) {
  const expected = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");
  if (!expected || authorization !== `Bearer ${expected}`) {
    return diagnosticJson({ ok: false, error: "cron_unauthorized" }, { status: 401 });
  }
  if (!isDiagnosticServiceConfigured()) {
    return diagnosticJson(
      { ok: false, error: "diagnostic_storage_unavailable" },
      { status: 503 },
    );
  }
  try {
    const [diagnostic, funnel] = await Promise.all([
      getDiagnosticService().runRetention(),
      getFunnelLedgerService()?.runRetention() ?? Promise.resolve({ deleted: 0, limit: 0 }),
    ]);
    return diagnosticJson({ ok: true, diagnostic, funnel });
  } catch (error) {
    return diagnosticFailure(error);
  }
}

export const GET = handleRetention;
export const POST = handleRetention;
