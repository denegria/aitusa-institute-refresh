# Privacy-safe funnel ledger

MIS-347 records a fixed, versioned server-side funnel ledger. It is not a
client analytics SDK and it deliberately contains no identity, provider, free
text, raw diagnostic, audio, transcript, token, cookie, or metadata payload.

The allowlist is defined in `src/observability/funnelContract.js`. Each event
has an opaque correlation value and a stable idempotency key. Domain services
choose when an event has product meaning; the ledger service only validates,
persists idempotently, and purges expired rows. Ledger failure is
query-neutral: it does not alter a diagnostic, auth, practice, or CRM outcome.

Rows expire 30 days after `occurred_at`. The authenticated
`/api/cron/portal-retention` job purges at most 250 expired ledger rows per
invocation, alongside diagnostic retention. The migration enforces the same
31-day upper bound, fixed event/version/source/outcome/duration allowlists,
and one unique idempotency key per row.
