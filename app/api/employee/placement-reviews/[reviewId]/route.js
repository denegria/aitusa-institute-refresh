import { after } from "next/server.js";
import { dispatchCrmOutboxBestEffort } from "../../../../../src/crm/runtime.server.js";
import { getPlacementReviewService } from "../../../../../src/placementReview/runtime.server.js";
import { resolvePlacementReviewActor } from "../../../../../src/placementReview/auth.server.js";
import { placementReviewFailure } from "../../../../../src/placementReview/errors.js";
import { assertTrustedEmployeeOrigin } from "../../../../../src/placementReview/http.server.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(request, { params }) {
  try {
    assertTrustedEmployeeOrigin(request);
    const { reviewId } = await params; const body = await request.formData(); const action = body.get("action");
    const actor = await resolvePlacementReviewActor(request); const service = getPlacementReviewService();
    const input = { reviewId, actor, mutationId: body.get("mutationId"), expectedRevision: Number(body.get("expectedRevision")), finalLevel: body.get("finalLevel") };
    const review = action === "start" ? await service.startReview(input) : action === "confirm" ? await service.confirmReview(input) : action === "adjust" ? await service.adjustReview(input) : action === "additional" ? await service.requestAdditionalReview(input) : null;
    if (!review) return Response.json({ ok: false, error: "placement_review_action_invalid" }, { status: 422 });
    if (process.env.VERCEL) after(() => dispatchCrmOutboxBestEffort());
    return Response.redirect(new URL(`/employee/placement-reviews?review=${encodeURIComponent(review.id)}`, request.url), 303);
  } catch (error) { const failure = placementReviewFailure(error); return Response.json(failure.body, { status: failure.status, headers: { "cache-control": "no-store" } }); }
}
