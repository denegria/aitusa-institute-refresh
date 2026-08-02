import { randomUUID } from "node:crypto";
import {
  assertSameOrigin,
  buildResumeCookie,
  diagnosticFailure,
  diagnosticJson,
} from "../../../../src/diagnostic/http.server.js";
import {
  getDiagnosticService,
  isDiagnosticServiceConfigured,
} from "../../../../src/diagnostic/runtime.server.js";
import { evaluateGuardianAccess } from "../../../../src/privacy/guardianConsentPolicy.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    assertSameOrigin(request);
    const body = await request.json().catch(() => ({}));
    const guardianAccess = evaluateGuardianAccess({
      ageBand: body.ageBand,
      action: "take_diagnostic",
    });
    if (guardianAccess.retention === "session_only") {
      return diagnosticJson({
        ok: true,
        durable: false,
        guardianRequired: true,
        retention: guardianAccess.retention,
        identityCollectionAllowed: guardianAccess.identityCollectionAllowed,
      });
    }
    if (!isDiagnosticServiceConfigured()) {
      return diagnosticJson(
        {
          ok: true,
          durable: false,
          error: "diagnostic_storage_unavailable",
          sessionFallbackAllowed: true,
        },
      );
    }
    const started = await getDiagnosticService().startAttempt({
      requestId: body.requestId || randomUUID(),
      requestSecret: body.requestSecret,
      ageBand: body.ageBand,
    });
    return diagnosticJson(
      {
        ok: true,
        durable: started.durable,
        guardianRequired: started.guardianRequired,
        attempt: started.attempt,
        replayed: started.replayed,
      },
      { status: started.replayed ? 200 : 201, cookie: buildResumeCookie(started) },
    );
  } catch (error) {
    return diagnosticFailure(error);
  }
}
