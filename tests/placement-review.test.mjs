import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createMemoryPlacementReviewRepository } from "../src/placementReview/memoryRepository.js";
import { createPlacementReviewService } from "../src/placementReview/service.js";
import { PLACEMENT_REVIEW_COPY } from "../src/placementReview/contract.js";
import { buildPlacementReviewCrmEnvelope, validatePlacementReviewCrmEnvelope } from "../src/placementReview/crmEnvelope.js";
import { assertTrustedEmployeeOrigin } from "../src/placementReview/http.server.js";

const ids = ["00000000-0000-4000-8000-000000000001", "00000000-0000-4000-8000-000000000002", "00000000-0000-4000-8000-000000000003", "00000000-0000-4000-8000-000000000004", "00000000-0000-4000-8000-000000000005", "00000000-0000-4000-8000-000000000006", "00000000-0000-4000-8000-000000000007"];
function fixture() { let i = 0; const repository = createMemoryPlacementReviewRepository(); return { repository, service: createPlacementReviewService({ repository, createId: () => ids[i++] }), actor: { accountId: "00000000-0000-4000-8000-000000000099", role: "senior", businessUnit: "ait_usa" } }; }

describe("MIS-395 placement review state machine", () => {
  it("creates an immutable, opaque review and confirms idempotently", async () => {
    const { service, repository, actor } = fixture();
    const review = await service.createReview({ resultId: ids[0], attemptId: ids[1], recommendedLevel: "Nivel 3", correlationId: ids[1] });
    assert.equal(review.status, "pending");
    const started = await service.startReview({ reviewId: review.id, actor, expectedRevision: 1, mutationId: ids[2] });
    const confirmed = await service.confirmReview({ reviewId: review.id, actor, expectedRevision: 2, mutationId: ids[3] });
    const replay = await service.confirmReview({ reviewId: review.id, actor, expectedRevision: 2, mutationId: ids[3] });
    assert.equal(started.status, "in_review"); assert.equal(confirmed.status, "confirmed"); assert.equal(confirmed.finalLevel, "Nivel 3"); assert.equal(replay.replayed, true);
    assert.deepEqual(repository._inspect().events.map((event) => event.eventType), ["placement_review_created", "placement_review_started", "placement_review_confirmed"]);
    const outbox = repository._inspect().outbox;
    assert.equal(outbox.length, 3);
    assert.deepEqual(outbox.map((event) => event.placement.state), ["pending", "in_review", "confirmed"]);
    assert.deepEqual(outbox.map((event) => event.placement.revision), [1, 2, 3]);
    assert.equal(outbox.at(-1).placement.finalLevel, "Nivel 3");
    assert.equal(outbox.at(-1).correlationId, ids[1]);
    assert.equal(validatePlacementReviewCrmEnvelope(outbox.at(-1)).ok, true);
  });
  it("fails closed for cross-BU or stale decisions", async () => {
    const { service, actor } = fixture(); const review = await service.createReview({ resultId: ids[0], attemptId: ids[1], recommendedLevel: "Nivel 3" });
    await assert.rejects(() => service.startReview({ reviewId: review.id, actor: { ...actor, businessUnit: "other" }, expectedRevision: 0, mutationId: ids[2] }), /placement_review_forbidden/);
    await assert.rejects(() => service.confirmReview({ reviewId: review.id, actor, expectedRevision: 1, mutationId: ids[3] }), /placement_review_transition_invalid/);
  });
  it("keeps the locked student-facing labels", () => {
    assert.deepEqual(Object.values(PLACEMENT_REVIEW_COPY), ["Nivel recomendado", "Pendiente de confirmación", "Nivel confirmado por AIT", "Revisión adicional requerida"]);
  });
  it("adjusts a bounded final level and keeps replay/outbox idempotent", async () => {
    const { service, repository, actor } = fixture();
    const review = await service.createReview({ resultId: ids[0], attemptId: ids[1], recommendedLevel: "Nivel 3", correlationId: ids[1] });
    await service.startReview({ reviewId: review.id, actor, expectedRevision: 1, mutationId: ids[2] });
    const adjusted = await service.adjustReview({ reviewId: review.id, actor, expectedRevision: 2, mutationId: ids[3], finalLevel: "Nivel 4" });
    const replay = await service.adjustReview({ reviewId: review.id, actor, expectedRevision: 2, mutationId: ids[3], finalLevel: "Nivel 4" });
    assert.equal(adjusted.status, "adjusted"); assert.equal(adjusted.finalLevel, "Nivel 4"); assert.equal(replay.replayed, true);
    const outbox = repository._inspect().outbox;
    assert.equal(outbox.length, 3); assert.match(outbox.at(-1).idempotencyKey, /revision:3:placement_review_adjusted$/);
    assert.equal(JSON.stringify(outbox.at(-1)).match(/answer|writing|rationale|email@/i), null);
  });
  it("uses an exact Origin comparison for employee mutations", () => {
    const request = (origin) => new Request("https://staff.aitusa.example/api", { headers: { origin, host: "staff.aitusa.example", "x-forwarded-proto": "https" } });
    assert.doesNotThrow(() => assertTrustedEmployeeOrigin(request("https://staff.aitusa.example")));
    assert.throws(() => assertTrustedEmployeeOrigin(request("https://evil-staff.aitusa.example")), /cross_origin_request_forbidden/);
    assert.throws(() => assertTrustedEmployeeOrigin(request("https://staff.aitusa.example.evil.example")), /cross_origin_request_forbidden/);
  });
  it("builds only the canonical CRM envelope allowlist", () => {
    const event = buildPlacementReviewCrmEnvelope({ review: { id: ids[0], resultId: ids[1], attemptId: ids[2], correlationId: ids[2], status: "adjusted", revision: 2, finalLevel: "Nivel 4", recommendedLevel: "must-not-export", reviewerRationale: "must-not-export" }, eventType: "placement_review_adjusted", occurredAt: "2026-08-20T12:00:00.000Z", consent: { communicationPreference: "email", advisorContactEmail: true, verifiedEmail: true, rawAnswers: "must-not-export" } });
    assert.equal(validatePlacementReviewCrmEnvelope(event).ok, true);
    assert.equal(JSON.stringify(event).includes("must-not-export"), false);
    assert.equal(event.source.employeeUrl, `/employee/placement-reviews?review=${ids[0]}`);
  });
  it("keeps the shared CRM fixture valid for the receiving repository", async () => {
    const fs = await import("node:fs/promises");
    const fixture = JSON.parse(await fs.readFile(new URL("../docs/fixtures/aitusa-placement-review-crm-envelope-v1.json", import.meta.url), "utf8"));
    assert.equal(validatePlacementReviewCrmEnvelope(fixture).ok, true);
  });
  it("makes out-of-order delivery detectable with positive monotonic revisions", async () => {
    const fs = await import("node:fs/promises");
    const events = JSON.parse(await fs.readFile(new URL("../docs/fixtures/aitusa-placement-review-crm-events-out-of-order-v1.json", import.meta.url), "utf8"));
    assert.equal(events.every((event) => validatePlacementReviewCrmEnvelope(event).ok), true);
    assert.deepEqual(events.map((event) => event.placement.revision), [3, 2]);
  });
  it("rejects absolute consent URLs, non-positive revisions, and CRM-overlong final levels", () => {
    const base = buildPlacementReviewCrmEnvelope({ review: { id: ids[0], resultId: ids[1], attemptId: ids[2], correlationId: ids[2], status: "adjusted", revision: 3, finalLevel: "Nivel 4" }, eventType: "placement_review_adjusted", occurredAt: "2026-08-20T12:00:00.000Z", consent: { sourceUrl: "/placement-test/" } });
    assert.equal(validatePlacementReviewCrmEnvelope({ ...base, consent: { ...base.consent, sourceUrl: "https://aitusa.example/placement-test/" } }).errors.includes("placement_consent_source_url_invalid"), true);
    assert.equal(validatePlacementReviewCrmEnvelope({ ...base, placement: { ...base.placement, revision: 0 } }).errors.includes("placement_revision_invalid"), true);
    assert.equal(validatePlacementReviewCrmEnvelope({ ...base, placement: { ...base.placement, finalLevel: "x".repeat(121) } }).errors.includes("placement_final_level_invalid"), true);
  });
  it("orders historical review, audit, and outbox backfill phases for fresh and partial repair", async () => {
    const fs = await import("node:fs/promises");
    const migration = await fs.readFile(new URL("../drizzle/0006_placement_review_and_preferences.sql", import.meta.url), "utf8");
    const backfill = migration.slice(migration.indexOf("-- Backfill only already-claimed diagnostic results."));
    const phases = backfill.split("--> statement-breakpoint");
    assert.equal(backfill.includes("WITH inserted_reviews"), false);
    assert.equal(phases.length >= 3, true);
    assert.match(phases[0], /INSERT INTO "placement_reviews"[\s\S]*ON CONFLICT \("result_id"\) DO NOTHING;/);
    assert.match(phases[1], /INSERT INTO "placement_review_events"[\s\S]*placement_review_created[\s\S]*ON CONFLICT \("id"\) DO NOTHING;/);
    assert.match(phases[2], /INSERT INTO "crm_outbox"[\s\S]*JOIN "placement_review_events" audit[\s\S]*ON CONFLICT \("idempotency_key"\) DO NOTHING;/);
  });
});
