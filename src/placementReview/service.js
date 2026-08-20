import { randomUUID } from "node:crypto";
import {
  PLACEMENT_REVIEW_BUSINESS_UNIT,
  PLACEMENT_REVIEW_EVENT_TYPES,
  REVIEW_TRANSITIONS,
  isOpaqueReviewId,
  isPlacementReviewRole,
} from "./contract.js";
import { PlacementReviewError } from "./errors.js";

export function createPlacementReviewService({ repository, now = () => new Date(), createId = () => randomUUID() }) {
  if (!repository) throw new Error("placement_review_repository_required");

  async function requireActor(actor) {
    if (!actor || !isPlacementReviewRole(actor.role) || actor.businessUnit !== PLACEMENT_REVIEW_BUSINESS_UNIT || !isOpaqueReviewId(actor.accountId)) {
      throw new PlacementReviewError("placement_review_forbidden", 403);
    }
  }
  function requireId(value, code = "placement_review_id_invalid") {
    if (!isOpaqueReviewId(value)) throw new PlacementReviewError(code, 422);
  }

  async function transition({ reviewId, actor, action, mutationId, expectedRevision, finalLevel = null }) {
    await requireActor(actor);
    requireId(reviewId);
    if (!isOpaqueReviewId(mutationId)) throw new PlacementReviewError("placement_review_mutation_id_invalid", 422);
    if (!Number.isInteger(expectedRevision) || expectedRevision < 0) throw new PlacementReviewError("placement_review_revision_invalid", 422);
    if (action === "adjust" && (typeof finalLevel !== "string" || finalLevel.trim().length < 1 || finalLevel.trim().length > 120)) {
      throw new PlacementReviewError("placement_review_final_level_invalid", 422);
    }
    const at = now().toISOString();
    const result = await repository.transition({
      reviewId, actor, action, mutationId, expectedRevision,
      finalLevel: finalLevel?.trim() || null, occurredAt: at,
      eventId: createId(),
      outboxId: createId(),
    });
    return safeReview(result.review, result.replayed);
  }

  return {
    async createReview({ resultId, attemptId, recommendedLevel, correlationId, businessUnit = PLACEMENT_REVIEW_BUSINESS_UNIT }) {
      requireId(resultId, "placement_result_id_invalid");
      requireId(attemptId, "placement_attempt_id_invalid");
      if (businessUnit !== PLACEMENT_REVIEW_BUSINESS_UNIT) throw new PlacementReviewError("placement_review_business_unit_invalid", 422);
      if (typeof recommendedLevel !== "string" || !recommendedLevel.trim()) throw new PlacementReviewError("placement_review_recommended_level_invalid", 422);
      const created = await repository.createReview({
        id: createId(), resultId, attemptId, correlationId: correlationId || attemptId,
        businessUnit, recommendedLevel: recommendedLevel.trim(), occurredAt: now().toISOString(), eventId: createId(), outboxId: createId(),
      });
      return safeReview(created.review, created.replayed);
    },
    async listReviews(actor) {
      await requireActor(actor);
      return (await repository.listByBusinessUnit(actor.businessUnit)).map((review) => safeReview(review));
    },
    async getReview(reviewId, actor) {
      await requireActor(actor); requireId(reviewId);
      const review = await repository.getById(reviewId);
      if (!review || review.businessUnit !== actor.businessUnit) throw new PlacementReviewError("placement_review_not_found", 404);
      return safeReview(review);
    },
    startReview(input) { return transition({ ...input, action: "start" }); },
    confirmReview(input) { return transition({ ...input, action: "confirm" }); },
    adjustReview(input) { return transition({ ...input, action: "adjust" }); },
    requestAdditionalReview(input) { return transition({ ...input, action: "requestAdditionalReview" }); },
  };
}

export function safeReview(review, replayed = false) {
  return {
    id: review.id, resultId: review.resultId, attemptId: review.attemptId,
    status: review.status, recommendedLevel: review.recommendedLevel,
    finalLevel: review.finalLevel || null, revision: Number(review.revision),
    createdAt: review.createdAt, updatedAt: review.updatedAt,
    replayed,
  };
}

export function placementReviewEventType(action) {
  const event = {
    create: "placement_review_created", start: "placement_review_started",
    confirm: "placement_review_confirmed", adjust: "placement_review_adjusted",
    requestAdditionalReview: "placement_review_additional_review_required",
  }[action];
  if (!PLACEMENT_REVIEW_EVENT_TYPES.includes(event)) throw new Error("placement_review_event_invalid");
  return event;
}

export function transitionTarget(status, action) {
  return REVIEW_TRANSITIONS[status]?.[action] || null;
}
