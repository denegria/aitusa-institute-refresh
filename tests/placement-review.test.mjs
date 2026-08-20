import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createMemoryPlacementReviewRepository } from "../src/placementReview/memoryRepository.js";
import { createPlacementReviewService } from "../src/placementReview/service.js";
import { PLACEMENT_REVIEW_COPY } from "../src/placementReview/contract.js";

const ids = ["00000000-0000-4000-8000-000000000001", "00000000-0000-4000-8000-000000000002", "00000000-0000-4000-8000-000000000003", "00000000-0000-4000-8000-000000000004", "00000000-0000-4000-8000-000000000005", "00000000-0000-4000-8000-000000000006", "00000000-0000-4000-8000-000000000007"];
function fixture() { let i = 0; const repository = createMemoryPlacementReviewRepository(); return { repository, service: createPlacementReviewService({ repository, createId: () => ids[i++] }), actor: { accountId: "00000000-0000-4000-8000-000000000099", role: "senior", businessUnit: "ait_usa" } }; }

describe("MIS-395 placement review state machine", () => {
  it("creates an immutable, opaque review and confirms idempotently", async () => {
    const { service, repository, actor } = fixture();
    const review = await service.createReview({ resultId: ids[0], attemptId: ids[1], recommendedLevel: "Nivel 3", correlationId: ids[1] });
    assert.equal(review.status, "pending");
    const started = await service.startReview({ reviewId: review.id, actor, expectedRevision: 0, mutationId: ids[2] });
    const confirmed = await service.confirmReview({ reviewId: review.id, actor, expectedRevision: 1, mutationId: ids[3] });
    const replay = await service.confirmReview({ reviewId: review.id, actor, expectedRevision: 1, mutationId: ids[3] });
    assert.equal(started.status, "in_review"); assert.equal(confirmed.status, "confirmed"); assert.equal(confirmed.finalLevel, "Nivel 3"); assert.equal(replay.replayed, true);
    assert.deepEqual(repository._inspect().events.map((event) => event.eventType), ["placement_review_created", "placement_review_started", "placement_review_confirmed"]);
  });
  it("fails closed for cross-BU or stale decisions", async () => {
    const { service, actor } = fixture(); const review = await service.createReview({ resultId: ids[0], attemptId: ids[1], recommendedLevel: "Nivel 3" });
    await assert.rejects(() => service.startReview({ reviewId: review.id, actor: { ...actor, businessUnit: "other" }, expectedRevision: 0, mutationId: ids[2] }), /placement_review_forbidden/);
    await assert.rejects(() => service.confirmReview({ reviewId: review.id, actor, expectedRevision: 0, mutationId: ids[3] }), /placement_review_transition_invalid/);
  });
  it("keeps the locked student-facing labels", () => {
    assert.deepEqual(Object.values(PLACEMENT_REVIEW_COPY), ["Nivel recomendado", "Pendiente de confirmación", "Nivel confirmado por AIT", "Revisión adicional requerida"]);
  });
});
