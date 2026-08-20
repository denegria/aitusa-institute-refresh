# MIS-395 / MIS-397 release packet

- Scope: AIT USA placement-review ownership, employee queue, result state, and post-result communication preferences.
- Data boundary: AIT USA retains review evidence and immutable decision history. CRM outbox payloads may carry only opaque review/result/correlation IDs, status/final level, preference, consent evidence, and verification flags—never answers, writing, rationale, phone numbers, or email addresses.
- Authorization: `/employee/placement-reviews?review=<opaque-id>` resolves a verified portal session against the active `employee_review_roles` record. Senior/Admin plus `ait_usa` are required; failure renders as absent.
- State: `pending → in_review → confirmed|adjusted|additional_review_required`, with additional review returning to `in_review`. Mutations use a supplied revision and opaque idempotency ID; events are append-only.
- Messaging: email remains valid without a mobile. SMS and calls require a separately verified E.164 number and an explicit channel permission. Service SMS and marketing SMS are separate. Automated WhatsApp is deliberately disabled pending provider/template readiness. Under-13 phone use requires verified guardian ownership.
- Current launch boundary: the available post-save route persists email-only preference/consent. It deliberately rejects a browser-supplied mobile `verified` flag until a server-owned verified-mobile evidence flow is selected and implemented; no number is silently accepted as verified.
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
  and payload::text ~* '(writing|answer|email|phone|rationale)';
```
- Validation: focused placement-review/contact, CRM-envelope, Portal view-model, diagnostic-route/service tests passed; `npm run validate` passed (286 tests, repository/assets/build gates); local `next start` plus `VERIFY_BASE_URL=http://127.0.0.1:3000 npm run verify:release-surfaces` passed with six deterministic desktop/mobile screenshots in `artifacts/release-surfaces/`.
- Deployment: pending staging review. No push, deployment, provider call, or CRM delivery was performed by this change.
