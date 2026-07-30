import {
  assertSameOrigin,
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

export async function PATCH(request, { params }) {
  try {
    assertSameOrigin(request);
    if (!isDiagnosticServiceConfigured()) {
      return diagnosticJson(
        { ok: false, error: "diagnostic_storage_unavailable" },
        { status: 503 },
      );
    }
    const { attemptId } = await params;
    const authorization = getResumeAuthorization(request, attemptId);
    if (!authorization) {
      return diagnosticJson(
        { ok: false, error: "attempt_resume_unauthorized" },
        { status: 401 },
      );
    }
    const body = await request.json().catch(() => ({}));
    const mutation = await getDiagnosticService().recordAnswer({
      attemptId,
      resumeCredential: authorization.credential,
      mutationId: body.mutationId,
      expectedRevision: body.expectedRevision,
      questionKey: body.questionKey,
      answerState: body.answerState,
      answerValue: body.answerValue ?? null,
    });
    return diagnosticJson({ ok: true, durable: true, ...mutation });
  } catch (error) {
    return diagnosticFailure(error);
  }
}
