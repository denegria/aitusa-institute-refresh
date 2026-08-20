import { randomUUID } from "node:crypto";
import { getPlacementReviewService } from "../../../../../src/placementReview/runtime.server.js";
import { resolvePlacementReviewActor } from "../../../../../src/placementReview/auth.server.js";
import { placementReviewFailure } from "../../../../../src/placementReview/errors.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(request, { params }) {
  try {
    const origin = request.headers.get("origin"); const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
    if (origin && host && !origin.endsWith(host)) return Response.json({ ok: false, error: "cross_origin_request_forbidden" }, { status: 403 });
    const { reviewId } = await params; const body = await request.formData(); const action = body.get("action");
    const actor = await resolvePlacementReviewActor(request); const service = getPlacementReviewService();
    const input = { reviewId, actor, mutationId: randomUUID(), expectedRevision: Number(body.get("expectedRevision")) };
    const review = action === "start" ? await service.startReview(input) : action === "confirm" ? await service.confirmReview(input) : action === "additional" ? await service.requestAdditionalReview(input) : null;
    if (!review) return Response.json({ ok: false, error: "placement_review_action_invalid" }, { status: 422 });
    return Response.redirect(new URL(`/employee/placement-reviews?review=${encodeURIComponent(review.id)}`, request.url), 303);
  } catch (error) { const failure = placementReviewFailure(error); return Response.json(failure.body, { status: failure.status, headers: { "cache-control": "no-store" } }); }
}
