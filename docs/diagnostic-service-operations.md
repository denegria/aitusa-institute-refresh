# AIT USA Diagnostic Service Operations

Status: MIS-337 implementation contract
Environment: dedicated AIT USA Portal database only
Production: separately approval-gated

## Runtime boundary

The public browser owns presentation and short-lived interaction state. The
server owns the answer key, selected-answer validation, provisional scoring,
attempt lifecycle, resume authorization, result summaries, claim tokens, and
retention.

The service does not read or write AIT CRM. Raw answers, writing samples,
resume secrets, claim tokens, and result payloads never enter CRM or generic
event timelines.

## Required server secrets

- `PORTAL_DATABASE_URL`: scoped connection for the dedicated Portal database.
- `DIAGNOSTIC_RESUME_SECRET`: high-entropy, environment-specific HMAC secret.
- `CRON_SECRET`: protects the retention worker.

These values must be different in staging and production. They are server-only
and must never use a `NEXT_PUBLIC_` prefix.

## Routes

- `POST /api/diagnostic/attempts`: start an eligible anonymous attempt.
- `GET /api/diagnostic/attempts/resume`: resume the current cookie-bound attempt.
- `PATCH /api/diagnostic/attempts/:attemptId`: apply one idempotent answer/skip.
- `POST /api/diagnostic/attempts/:attemptId/complete`: calculate and persist the
  provisional result.
- `POST /api/diagnostic/attempts/:attemptId/claim-token`: mint a one-time,
  15-minute claim token for MIS-338.
- `GET /api/cron/portal-retention`: run the bounded daily purge.

When portal storage is not configured, eligible users keep the session-only
fallback and can still receive a server-scored result. Under-13 attempts never
enter durable storage in this slice.

## Data lifecycle

- Unclaimed anonymous attempts and all dependent raw data: seven days.
- Pending claim tokens: 15 minutes.
- Claimed raw answers and writing: maximum 30 days after MIS-338 sets the purge
  timestamp.
- Approved result summary: retained with the account until deletion/unlinking.
- The daily retention worker processes at most 250 records per category.

## Schema and migration

The checked-in migration is
`drizzle/0000_diagnostic_foundation.sql`. Drizzle schema source is
`src/diagnostic/schema.js`.

Migration tooling is intentionally excluded from the application dependency
tree because the current stable Drizzle CLI pulls a vulnerable legacy loader
and does not yet recognize the patched runtime ORM release. The checked-in SQL,
schema contract tests, and application build are the local source of truth.
Database validation must run on Neon's temporary migration branch once the
dedicated project is provisioned.

Applying the migration requires the reviewed staging database target and the
normal migration-approval flow. Never point `PORTAL_DATABASE_URL` at AIT CRM.

## Failure behavior

- A missing/unavailable Portal database degrades to session-only progress.
- A stale revision returns `attempt_revision_conflict`; it never overwrites.
- A replayed mutation/completion returns its original revision/result.
- Invalid or expired resume/claim credentials fail closed.
- The academic result stays `provisional` until AIT supplies the validated
  answer key, block mapping, and thresholds.
