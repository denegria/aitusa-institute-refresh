import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import { PgDialect } from "drizzle-orm/pg-core";
import { createMemoryPlacementReviewRepository } from "../src/placementReview/memoryRepository.js";
import { createNeonPlacementReviewRepository } from "../src/placementReview/neonRepository.server.js";
import { createPlacementReviewService } from "../src/placementReview/service.js";
import { PLACEMENT_REVIEW_COPY } from "../src/placementReview/contract.js";
import { buildPlacementReviewCrmEnvelope, validatePlacementReviewCrmEnvelope } from "../src/placementReview/crmEnvelope.js";
import { assertTrustedEmployeeOrigin } from "../src/placementReview/http.server.js";
import { sanitizePortalReturnTo } from "../src/portalAuth/returnTo.js";
import { resolvePlacementReviewActor } from "../src/placementReview/auth.server.js";
import { PortalClaimError } from "../src/portalClaim/errors.js";

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
    const adjusted = await service.adjustReview({ reviewId: review.id, actor, expectedRevision: 2, mutationId: ids[3], finalLevel: "Nivel 4", internalRationale: "La evidencia escrita respalda el ajuste." });
    const replay = await service.adjustReview({ reviewId: review.id, actor, expectedRevision: 2, mutationId: ids[3], finalLevel: "Nivel 4", internalRationale: "La evidencia escrita respalda el ajuste." });
    assert.equal(adjusted.status, "adjusted"); assert.equal(adjusted.finalLevel, "Nivel 4"); assert.equal(replay.replayed, true);
    const outbox = repository._inspect().outbox;
    assert.equal(outbox.length, 3); assert.match(outbox.at(-1).idempotencyKey, /revision:3:placement_review_adjusted$/);
    assert.equal(repository._inspect().events.at(-1).internalRationale, "La evidencia escrita respalda el ajuste.");
    assert.equal(JSON.stringify(outbox.at(-1)).match(/answer|writing|rationale|email@/i), null);
  });
  it("requires a bounded internal rationale for adjustment and additional review", async () => {
    const { service, actor } = fixture();
    const review = await service.createReview({ resultId: ids[0], attemptId: ids[1], recommendedLevel: "Nivel 3" });
    await service.startReview({ reviewId: review.id, actor, expectedRevision: 1, mutationId: ids[2] });
    await assert.rejects(() => service.adjustReview({ reviewId: review.id, actor, expectedRevision: 2, mutationId: ids[3], finalLevel: "Nivel 4" }), /placement_review_rationale_invalid/);
    await assert.rejects(() => service.requestAdditionalReview({ reviewId: review.id, actor, expectedRevision: 2, mutationId: ids[4], internalRationale: "" }), /placement_review_rationale_invalid/);
  });
  it("uses an exact Origin comparison for employee mutations", () => {
    const request = (origin) => new Request("https://staff.aitusa.example/api", { headers: { origin, host: "staff.aitusa.example", "x-forwarded-proto": "https" } });
    assert.doesNotThrow(() => assertTrustedEmployeeOrigin(request("https://staff.aitusa.example")));
    assert.throws(() => assertTrustedEmployeeOrigin(request("https://evil-staff.aitusa.example")), /cross_origin_request_forbidden/);
    assert.throws(() => assertTrustedEmployeeOrigin(request("https://staff.aitusa.example.evil.example")), /cross_origin_request_forbidden/);
  });
  it("allowlists only opaque employee-review return paths", () => {
    const reviewPath = `/employee/placement-reviews?review=${ids[0]}`;
    assert.equal(sanitizePortalReturnTo(reviewPath, "employee"), reviewPath);
    assert.equal(sanitizePortalReturnTo("/employee/placement-reviews", "employee"), "/employee/placement-reviews");
    assert.equal(sanitizePortalReturnTo("/employee/team", "employee"), "/employee/team");
    assert.equal(sanitizePortalReturnTo("//evil.example/employee/placement-reviews", "employee"), "/employee");
    assert.equal(sanitizePortalReturnTo("https://evil.example/employee/placement-reviews", "employee"), "/employee");
    assert.equal(sanitizePortalReturnTo("/employee/placement-reviews?review=guessable", "employee"), "/employee");
    assert.equal(sanitizePortalReturnTo(`${reviewPath}&next=/admin`, "employee"), "/employee");
    assert.equal(sanitizePortalReturnTo(reviewPath, "student"), "/portal/");
  });
  it("reconciles only claimed results missing an employee review", async () => {
    const writes = [];
    const service = createPlacementReviewService({
      createId: () => ids[writes.length],
      repository: {
        async listClaimedResultsMissingReviews(input) {
          assert.deepEqual(input, { resultId: ids[0], limit: 10 });
          return [{ resultId: ids[0], attemptId: ids[1], recommendedLevel: "Nivel 3", correlationId: "claim-correlation-fixture" }];
        },
        async createReview(input) { writes.push(input); return { review: { ...input, status: "pending", revision: 1, finalLevel: null, createdAt: input.occurredAt, updatedAt: input.occurredAt }, replayed: false }; },
      },
    });
    const result = await service.reconcileClaimedReviews({ resultId: ids[0] });
    assert.deepEqual(result, { scanned: 1, created: 1, replayed: 0, failed: 0 });
    assert.equal(writes[0].correlationId, "claim-correlation-fixture");
  });

  it("passes an actual placement_reviews composite to the CRM payload function", async () => {
    const source = await readFile(new URL("../src/placementReview/neonRepository.server.js", import.meta.url), "utf8");
    const createReview = source.slice(
      source.indexOf("async createReview"),
      source.indexOf("async listClaimedResultsMissingReviews"),
    );
    assert.match(createReview, /select inserted::placement_reviews as review, false as replayed/);
    assert.match(createReview, /placement_crm_payload\(selected\.review,/);
    assert.doesNotMatch(createReview, /placement_crm_payload\(review,/);
  });
  it("binds absent final levels and rationales as SQL null parameters", async () => {
    const dialect = new PgDialect();
    let calls = 0;
    let compiled;
    const repository = createNeonPlacementReviewRepository({
      async execute(query) {
        calls += 1;
        if (calls === 1) return [];
        if (calls === 2) return [{
          id: ids[0], result_id: ids[1], attempt_id: ids[2],
          correlation_id: ids[2], business_unit: "ait_usa",
          recommended_level: "Nivel 3", final_level: undefined,
          status: "pending", revision: 1,
          created_at: "2026-08-20T12:00:00.000Z",
          updated_at: "2026-08-20T12:00:00.000Z",
        }];
        compiled = dialect.sqlToQuery(query);
        return [];
      },
    });
    await assert.rejects(() => repository.transition({
      reviewId: ids[0], actor: { accountId: ids[6] }, action: "start",
      mutationId: ids[3], expectedRevision: 1, finalLevel: null,
      occurredAt: "2026-08-20T12:00:00.000Z", internalRationale: null,
      eventId: ids[4], outboxId: ids[5],
    }), /placement_review_revision_conflict/);
    assert.match(compiled.sql, /final_level = \$\d+/);
    assert.doesNotMatch(compiled.sql, /final_level =\s*,/);
    assert.equal(compiled.params.filter((value) => value === null).length, 2);
  });
  it("normalizes a missing or expired Portal session into the employee sign-in boundary", async () => {
    await assert.rejects(
      () => resolvePlacementReviewActor(new Request("https://employee.aitusa.local/employee/placement-reviews"), {
        resolveSnapshot: async () => { throw new PortalClaimError("portal_session_required", 401); },
        database: { execute: async () => { throw new Error("database_must_not_be_called"); } },
      }),
      (error) => error.code === "placement_review_unauthenticated" && error.status === 401,
    );
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
  it("keeps no-preference CRM payload timestamps sourced from the SQL argument", async () => {
    const noPreference = buildPlacementReviewCrmEnvelope({ review: { id: ids[0], resultId: ids[1], attemptId: ids[2], correlationId: ids[2], status: "pending", revision: 1 }, eventType: "placement_review_created", occurredAt: "2026-08-20T12:00:00.000Z" });
    assert.equal(noPreference.occurredAt, "2026-08-20T12:00:00.000Z");
    assert.deepEqual(noPreference.consent, { communicationPreference: null, disclosureVersion: null, disclosureHash: null, sourceUrl: null, optInAction: null, advisorContactEmail: false, serviceSms: false, marketingSms: false, phoneCall: false, whatsappContact: false, verifiedEmail: false, verifiedMobile: false });
    const fs = await import("node:fs/promises");
    const migration = await fs.readFile(new URL("../drizzle/0006_placement_review_and_preferences.sql", import.meta.url), "utf8");
    const constructorStart = migration.indexOf("CREATE FUNCTION placement_crm_payload");
    const constructor = migration.slice(constructorStart, migration.indexOf("$$;", constructorStart));
    assert.match(migration, /DROP FUNCTION IF EXISTS placement_crm_payload\(placement_reviews, text, timestamptz\);\r?\n--> statement-breakpoint\r?\nCREATE FUNCTION placement_crm_payload/);
    assert.match(constructor, /event_occurred_at timestamptz/);
    assert.match(constructor, /'occurredAt', event_occurred_at/);
    assert.doesNotMatch(constructor, /'occurredAt', occurred_at/);
    assert.match(migration, /UPDATE "crm_outbox" outbox[\s\S]*SET "payload" = placement_crm_payload\(review, 'placement_review_created', outbox\."created_at"\)[\s\S]*outbox\."status" IN \('pending', 'retry_wait', 'dead_letter'\)/);
  });
  it("ships the additive internal-rationale migration without changing the CRM payload", async () => {
    const fs = await import("node:fs/promises");
    const migration = await fs.readFile(new URL("../drizzle/0007_employee_portal_v1.sql", import.meta.url), "utf8");
    assert.match(migration, /ADD COLUMN IF NOT EXISTS "internal_rationale" text/);
    assert.match(migration, /char_length\("internal_rationale"\) between 1 and 1000/);
    assert.doesNotMatch(migration, /crm_outbox|placement_crm_payload/);
  });
});
