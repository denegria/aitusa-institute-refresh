import { diagnosticJson } from "../../../../src/diagnostic/http.server.js";
import {
  getFunnelOperatorService,
  isFunnelOperatorConfigured,
} from "../../../../src/observability/operatorRuntime.server.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  if (
    !process.env.CRON_SECRET ||
    request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return diagnosticJson({ ok: false, error: "operator_unauthorized" }, { status: 401 });
  }
  if (!isFunnelOperatorConfigured()) {
    return diagnosticJson({ ok: false, error: "operator_unavailable" }, { status: 503 });
  }
  const url = new URL(request.url);
  const health = await getFunnelOperatorService().getHealth({
    hours: url.searchParams.get("hours"),
  });
  return diagnosticJson(health);
}
