import {
  diagnosticFailure,
  diagnosticJson,
} from "../../../../src/diagnostic/http.server.js";
import {
  getDiagnosticService,
  isDiagnosticServiceConfigured,
} from "../../../../src/diagnostic/runtime.server.js";

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
    const counts = await getDiagnosticService().runRetention();
    return diagnosticJson({ ok: true, ...counts });
  } catch (error) {
    return diagnosticFailure(error);
  }
}

export const GET = handleRetention;
export const POST = handleRetention;
