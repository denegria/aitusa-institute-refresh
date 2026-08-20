import { PlacementReviewError } from "./errors.js";
import { placementReviewEventType, transitionTarget } from "./service.js";

const clone = (value) => structuredClone(value);

export function createMemoryPlacementReviewRepository() {
  const reviews = new Map(); const byResult = new Map(); const mutations = new Map(); const events = [];
  return {
    async createReview(input) {
      const existing = byResult.get(input.resultId);
      if (existing) return { review: clone(reviews.get(existing)), replayed: true };
      const review = { ...input, status: "pending", finalLevel: null, revision: 0, createdAt: input.occurredAt, updatedAt: input.occurredAt };
      reviews.set(review.id, review); byResult.set(review.resultId, review.id);
      events.push(eventFor(review, input.eventId, "create", input.occurredAt, null));
      return { review: clone(review), replayed: false };
    },
    async getById(id) { return reviews.has(id) ? clone(reviews.get(id)) : null; },
    async listByBusinessUnit(businessUnit) { return [...reviews.values()].filter((item) => item.businessUnit === businessUnit).map(clone); },
    async transition(input) {
      const review = reviews.get(input.reviewId);
      if (!review) throw new PlacementReviewError("placement_review_not_found", 404);
      const mutationKey = `${input.reviewId}:${input.mutationId}`;
      if (mutations.has(mutationKey)) return { review: clone(review), replayed: true };
      if (review.revision !== input.expectedRevision) throw new PlacementReviewError("placement_review_revision_conflict", 409, { currentRevision: review.revision });
      const status = transitionTarget(review.status, input.action);
      if (!status) throw new PlacementReviewError("placement_review_transition_invalid", 409);
      review.status = status; review.revision += 1; review.updatedAt = input.occurredAt;
      if (input.action === "confirm") review.finalLevel = review.recommendedLevel;
      if (input.action === "adjust") review.finalLevel = input.finalLevel;
      mutations.set(mutationKey, true); events.push(eventFor(review, input.eventId, input.action, input.occurredAt, input.actor));
      return { review: clone(review), replayed: false };
    },
    _inspect() { return { reviews: clone([...reviews.values()]), events: clone(events) }; },
  };
}

function eventFor(review, id, action, occurredAt, actor) {
  return { id, reviewId: review.id, eventType: placementReviewEventType(action), status: review.status, revision: review.revision, finalLevel: review.finalLevel, actorAccountId: actor?.accountId || null, occurredAt };
}
