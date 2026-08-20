# MIS-395 / MIS-397 release packet

- Scope: AIT USA placement-review ownership, employee queue, result state, and post-result communication preferences.
- Data boundary: AIT USA retains review evidence and immutable decision history. CRM outbox payloads may carry only opaque review/result/correlation IDs, status/final level, preference, consent evidence, and verification flags—never answers, writing, rationale, phone numbers, or email addresses.
- Canonical CRM schema: [`docs/fixtures/aitusa-placement-review-crm-envelope-v1.json`](fixtures/aitusa-placement-review-crm-envelope-v1.json) is the cross-repository fixture for `aitusa-crm-event-v1`; the companion `aitusa-placement-review-crm-events-out-of-order-v1.json` proves the consumer ordering rule. It has top-level `placement` (not `placementReview`) with `state` exactly one of `pending`, `in_review`, `confirmed`, `adjusted`, or `additional_review_required`; every event contains a positive monotonic numeric `placement.revision`, and `eventId`/`idempotencyKey` embed the same revision. `finalLevel` appears only after confirm/adjust and is capped at **120 characters** in UI, service, database, fixture validation, and CRM payload. Its `correlationId` is the opaque diagnostic attempt/funnel correlation—not the review ID—and the sole employee URL is `/employee/placement-reviews?review=<opaque-review-id>`.
- Outbox guarantee: review creation and every valid state transition atomically write the review row, immutable audit row, and an outbox record keyed as `placement-review:<review-id>:revision:<revision>:<event-type>`. Replaying the same mutation does not enqueue a second record. The migration uses the same envelope constructor and idempotency/correlation semantics for historical claimed results.
- Authorization: `/employee/placement-reviews?review=<opaque-id>` resolves a verified portal session against the active `employee_review_roles` record. Senior/Admin plus `ait_usa` are required; failure renders as absent.
- State: `pending → in_review → confirmed|adjusted|additional_review_required`, with additional review returning to `in_review`. Mutations use a supplied revision and opaque idempotency ID; events are append-only.
- Messaging: email remains valid without a mobile. SMS and calls require a separately verified E.164 number and an explicit channel permission. Service SMS and marketing SMS are separate. Automated WhatsApp is deliberately disabled pending provider/template readiness. Under-13 phone use requires verified guardian ownership.
- Current launch boundary: the available post-save route persists email-only preference/consent. It deliberately rejects a browser-supplied mobile `verified` flag until a server-owned verified-mobile evidence flow is selected and implemented; no number is silently accepted as verified.
- Consent audit: each preference persists independent email, service-SMS, marketing-SMS, phone-call, and WhatsApp-contact decisions. Automated WhatsApp remains off. A changed channel or mobile creates a privacy-safe replacement audit that links old/new preference IDs but stores no mobile value in the audit row. CRM `consent.sourceUrl` is always an origin-stripped relative path (for example, `/placement-test/`), never a full URL or query string.
- Migration: `drizzle/0006_placement_review_and_preferences.sql` is committed only; it has not been run against Neon or any remote database.
- Migration order (staging first, then production only after approval): pause/disable the CRM outbox dispatcher; apply `0006`; run the verification queries below; inspect queued `placement_review_created` entries and only then restore the dispatcher. The migration backfills every existing `diagnostic_attempts.status = 'claimed'` result using deterministic UUIDs and `ON CONFLICT`, so it is rerunnable and does not duplicate reviews, audit events, or outbox records. It does not send or call any provider.

```sql
-- Existing eligible claimed results must each have exactly one pending review.
select count(*) filter (where status = 'claimed') as claimed_attempts,
       (select count(*) from placement_reviews) as reviews;
select result_id, count(*) from placement_reviews group by result_id having count(*) <> 1;
-- Safe events contain no contact or answer material; expected queue rows are auditable.
select event_type, status, count(*) from crm_outbox
where event_type like 'placement_review_%' group by event_type, status;
select count(*) from crm_outbox
where event_type like 'placement_review_%'
  and payload::text ~ '"(rawAnswers|answers|writingSample|writing|reviewerRationale|rationale|email|phone|mobileE164|mobile_e164)"[[:space:]]*:';
```
- Validation: focused placement-review/contact, CRM-envelope, Portal view-model, diagnostic-route/service tests passed; `npm run validate` passed (286 tests, repository/assets/build gates); local `next start` plus `VERIFY_BASE_URL=http://127.0.0.1:3000 npm run verify:release-surfaces` passed with six deterministic desktop/mobile screenshots in `artifacts/release-surfaces/`.
- Deployment: pending staging review. No push, deployment, provider call, or CRM delivery was performed by this change.
