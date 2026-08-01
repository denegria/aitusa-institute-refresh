# Privacy-safe funnel ledger

MIS-347 records a fixed, versioned server-side funnel ledger. It is not a
client analytics SDK and it deliberately contains no identity, provider, free
text, raw diagnostic, audio, transcript, token, cookie, or metadata payload.

The allowlist is defined in `src/observability/funnelContract.js`. Each event
has an opaque correlation value and a stable idempotency key. Domain services
choose when an event has product meaning; the ledger service only validates,
persists idempotently, and purges expired rows. Ledger failure is
query-neutral: it does not alter a diagnostic, auth, practice, or CRM outcome.

The canonical correlation is the diagnostic attempt ID and is never returned in
browser DTOs. CRM retains its existing result/claim correlation for payload and
delivery idempotency, while its server repository derives the canonical attempt
only for ledger emission. Successful portal sign-in uses the active claimed
attempt when present; failed sign-in retains its opaque auth reservation.

Rows expire 30 days after `occurred_at`. The authenticated
`/api/cron/portal-retention` job purges at most 250 expired ledger rows per
invocation, alongside diagnostic retention. The migration enforces the same
31-day upper bound, fixed event/version/source/outcome/duration allowlists,
and one unique idempotency key per row. It also mirrors the service character
allowlists for opaque keys, attribution, and contract versions, so direct SQL
writes cannot store email-like values, spaces, or free text in those columns.
