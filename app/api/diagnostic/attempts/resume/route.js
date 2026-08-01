import {
  buildExpiredResumeCookie,
  diagnosticFailure,
  diagnosticJson,
  getResumeAuthorization,
} from "../../../../../src/diagnostic/http.server.js";
import {
  getDiagnosticService,
  isDiagnosticServiceConfigured,
} from "../../../../../src/diagnostic/runtime.server.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function shouldClearResumeCookie(errorCode) {
  return [
    "attempt_expired",
    "attempt_not_found",
    "attempt_resume_unauthorized",
  ].includes(errorCode);
}

export async function GET(request) {
  if (!isDiagnosticServiceConfigured()) {
    return diagnosticJson(
      {
        ok: true,
        durable: false,
        error: "diagnostic_storage_unavailable",
      },
    );
  }
  const authorization = getResumeAuthorization(request);
  if (!authorization) {
    return diagnosticJson({
      ok: true,
      durable: false,
      resumableAttempt: false,
    });
  }
  try {
    const snapshot = await getDiagnosticService().resumeAttempt({
      attemptId: authorization.attemptId,
      resumeCredential: authorization.credential,
    });
    return diagnosticJson({ ok: true, durable: true, ...snapshot });
  } catch (error) {
    if (!shouldClearResumeCookie(error.code)) return diagnosticFailure(error);
    const failure = diagnosticFailure(error);
    failure.headers.append("set-cookie", buildExpiredResumeCookie());
    return failure;
  }
}
