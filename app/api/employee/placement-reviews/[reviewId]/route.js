import { after } from "next/server.js";
import { dispatchCrmOutboxBestEffort } from "../../../../../src/crm/runtime.server.js";
import { getPlacementReviewService } from "../../../../../src/placementReview/runtime.server.js";
import { resolvePlacementReviewActor } from "../../../../../src/placementReview/auth.server.js";
import { placementReviewFailure } from "../../../../../src/placementReview/errors.js";
import { assertTrustedEmployeeOrigin } from "../../../../../src/placementReview/http.server.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(request, { params }) {
  let stage = "origin";
  let reviewId = null;
  try {
    assertTrustedEmployeeOrigin(request);
    ({ reviewId } = await params);
    stage = "request";
    const body = await request.formData(); const action = body.get("action");
    stage = "authorization";
    const actor = await resolvePlacementReviewActor(request); const service = getPlacementReviewService();
    stage = "transition";
    const input = { reviewId, actor, mutationId: body.get("mutationId"), expectedRevision: Number(body.get("expectedRevision")), finalLevel: body.get("finalLevel"), internalRationale: body.get("internalRationale") };
    const review = action === "start" ? await service.startReview(input) : action === "confirm" ? await service.confirmReview(input) : action === "adjust" ? await service.adjustReview(input) : action === "additional" ? await service.requestAdditionalReview(input) : null;
    if (!review) return Response.json({ ok: false, error: "placement_review_action_invalid" }, { status: 422 });
    if (process.env.VERCEL) after(() => dispatchCrmOutboxBestEffort());
    if (request.headers.get("accept")?.includes("application/json")) {
      return Response.json({ ok: true, review: { id: review.id, status: review.status, revision: review.revision } });
    }
    return Response.redirect(new URL(`/employee/placement-reviews?review=${encodeURIComponent(review.id)}`, request.url), 303);
  } catch (error) {
    const failure = placementReviewFailure(error);
    console.error("placement_review_action_failed", {
      stage,
      errorName: error?.name || "Error",
      errorCode: error?.code || "unexpected",
      status: failure.status,
    });
    if (request.headers.get("accept")?.includes("application/json") || !reviewId) {
      return Response.json(failure.body, { status: failure.status, headers: { "cache-control": "no-store" } });
    }
    if (failure.status === 401) {
      const returnTo = `/employee/placement-reviews?review=${encodeURIComponent(reviewId)}`;
      return Response.redirect(new URL(`/portal/sign-in/?returnTo=${encodeURIComponent(returnTo)}`, request.url), 303);
    }
    const target = new URL(`/employee/placement-reviews?review=${encodeURIComponent(reviewId)}&actionError=${encodeURIComponent(failure.body.error)}`, request.url);
    return Response.redirect(target, 303);
  }
}
