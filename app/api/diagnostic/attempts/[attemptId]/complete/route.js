import {
  assertSameOrigin,
  diagnosticFailure,
  diagnosticJson,
  getResumeAuthorization,
} from "../../../../../../src/diagnostic/http.server.js";
import {
  getDiagnosticService,
  isDiagnosticServiceConfigured,
} from "../../../../../../src/diagnostic/runtime.server.js";
import { getPlacementReviewService, isPlacementReviewConfigured } from "../../../../../../src/placementReview/runtime.server.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request, { params }) {
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
    const completed = await getDiagnosticService().completeAttempt({
      attemptId,
      resumeCredential: authorization.credential,
      completionId: body.completionId,
      expectedRevision: body.expectedRevision,
      selfAssessment: body.selfAssessment,
      goal: body.goal,
      writingSample: body.writingSample,
    });
    if (!isPlacementReviewConfigured()) {
      return diagnosticJson({ ok: false, error: "placement_review_storage_unavailable" }, { status: 503 });
    }
    await getPlacementReviewService().createReview({
      resultId: completed.resultId,
      attemptId,
      correlationId: attemptId,
      recommendedLevel: completed.result?.recommendation?.level,
    });
    return diagnosticJson({ ok: true, durable: true, ...completed });
  } catch (error) {
    return diagnosticFailure(error);
  }
}
