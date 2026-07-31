# AIT USA Diagnostic Service Operations

Status: MIS-337/MIS-338/MIS-341 implementation contract
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
- `WORKOS_API_KEY`: server credential for the dedicated Portal WorkOS
  environment.
- `WORKOS_CLIENT_ID`: AuthKit application identifier for that environment.
- `WORKOS_COOKIE_PASSWORD`: at least 32 characters; seals the HttpOnly Portal
  session cookie.
- `PORTAL_AUTH_HASH_SECRET`: at least 32 characters; HMACs email and IP
  identifiers before bounded auth rate-limit/audit storage.

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
- `POST /api/portal/auth/code`: request a generic passwordless sign-in response
  without revealing whether an account exists.
- `POST /api/portal/auth/verify`: verify the six-digit code and establish the
  sealed Portal session only after an active account is resolved.
- `POST /api/portal/sign-out`: revoke the WorkOS session when available and
  always expire the local Portal cookie.
- `GET /api/cron/portal-retention`: run the bounded daily purge.

When portal storage is not configured, eligible users keep the session-only
fallback and can still receive a server-scored result. Under-13 attempts never
enter durable storage in this slice.

## Data lifecycle

- Unclaimed anonymous attempts and all dependent raw data: seven days.
- Pending claim tokens: 15 minutes.
- Auth rate-limit/audit hashes: seven days.
- Claimed raw answers and writing: maximum 30 days after MIS-338 sets the purge
  timestamp.
- Approved result summary: retained with the account until deletion/unlinking.
- The daily retention worker processes at most 250 records per category.

## Schema and migration

The checked-in migrations are:

- `drizzle/0000_diagnostic_foundation.sql`
- `drizzle/0001_result_claim_accounts.sql`
- `drizzle/0002_portal_auth_security.sql`

Drizzle schema source is `src/diagnostic/schema.js`.

Migration tooling is intentionally excluded from the application dependency
tree because the current stable Drizzle CLI pulls a vulnerable legacy loader
and does not yet recognize the patched runtime ORM release. The checked-in SQL,
schema contract tests, and application build are the local source of truth.
Staging was activated on 2026-07-30 using the isolated Neon project
`late-bar-02771888` (`AIT USA Student Portal`) and its `staging` branch
`br-small-hill-awit1nbz`. The six diagnostic tables were verified empty after
the migration. The project's default production branch was not modified.

`PORTAL_DATABASE_URL`, `DIAGNOSTIC_RESUME_SECRET`, `CRON_SECRET`,
`WORKOS_API_KEY`, `WORKOS_CLIENT_ID`, and `WORKOS_COOKIE_PASSWORD` are
configured as sensitive Vercel Preview variables restricted to the Git branch
`staging`. MIS-341 additionally requires a branch-scoped
`PORTAL_AUTH_HASH_SECRET` before staging deployment. Production configuration
remains a separate approval-gated step. Never point `PORTAL_DATABASE_URL` at
AIT CRM.

## Failure behavior

- A missing/unavailable Portal database degrades to session-only progress.
- A stale revision returns `attempt_revision_conflict`; it never overwrites.
- A replayed mutation/completion returns its original revision/result.
- Invalid or expired resume/claim credentials fail closed.
- The academic result stays `provisional` until AIT supplies the validated
  answer key, block mapping, and thresholds.
