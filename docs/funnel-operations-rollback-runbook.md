# AIT USA Funnel Operations and Rollback

Scope: MIS-348 / MIS-344. This runbook covers the AIT USA Portal database and
the downstream AIT CRM event pipeline. Production activation remains an
explicit owner approval.

## Runtime posture

- Authoritative product transitions write the local Portal state, privacy-safe
  funnel ledger row, and CRM outbox row before responding.
- Result claim and Study Buddy routes schedule an immediate best-effort outbox
  dispatch after the response. CRM failure never reverses the completed product
  outcome.
- Vercel runs one supported daily safety sweep at `05:00 UTC`. The sweep is a
  recovery net, not the primary delivery path. Do not restore an unsupported
  high-frequency Hobby cron.
- Funnel ledger retention runs daily at `05:15 UTC` and remains bounded.

## Operator checks

Authenticate both endpoints with `Authorization: Bearer $CRON_SECRET`.

- `GET /api/ops/funnel-health?hours=24`
- `POST /api/cron/crm-outbox`

The health response contains aggregate event/outbox counts, the oldest open
timestamp, and stable alert codes only. It must never include identities, raw
answers, writing, audio, transcripts, prompts, generated responses, tokens,
provider traces, CRM payloads, or record IDs.

Alert meanings:

- `crm_dead_letters_present` — critical; inspect the safe error code and
  downstream availability before replay.
- `crm_delivery_stale` — warning; one or more open items are older than 15
  minutes.
- `diagnostic_completion_rate_low` — warning after at least five starts when
  fewer than half reach result-save completion within the selected window.
- `portal_auth_failure_rate_high` — warning after at least five failures when
  failures are at least half of observed authentication outcomes.

## Staging acceptance

1. Confirm the deployed Refresh commit and protected staging access.
2. Print the safe Portal and CRM Neon fingerprints. Both branches must be named
   `staging`; never use the default/production branches.
3. Run one synthetic adult funnel:
   homepage → course → diagnostic → result → verified claim → Portal.
4. Confirm the Portal transaction writes the account, result, consent, outbox,
   and funnel ledger rows atomically.
5. Trigger the authenticated dispatcher and verify exact one-of-each CRM
   contact/lead/activity/task/notification behavior.
6. Replay the dispatcher/event and verify the CRM counts remain one-of-each.
7. Query funnel health and confirm no dead letter or stale-delivery alert.
8. Remove the synthetic WorkOS user and all exact synthetic records in both
   staging databases; verify zero residue.

## Rollback

Use the smallest reversible control first:

1. Disable downstream delivery by removing/rotating the branch-scoped
   `AIT_CRM_WEBSITE_LEADS_SECRET` or pointing the branch away from the
   dispatcher. The outbox preserves pending work while Portal outcomes remain
   available.
2. If the immediate background path is faulty, promote the last accepted
   Refresh commit while retaining the outbox tables and daily recovery sweep.
3. If CRM ingestion is faulty, roll back the AIT CRM staging/production
   deployment independently. Do not delete Portal outbox rows.
4. Do not roll back additive Portal schema merely to stop delivery. Prefer the
   environment kill switch and application rollback.
5. Re-enable only after one synthetic event, one exact replay, clean operator
   health, and complete cleanup pass.

Production promotion must list the exact Refresh and CRM commits, migrations,
branch-scoped environment changes, smoke checks, rollback commits, and named
approver.
