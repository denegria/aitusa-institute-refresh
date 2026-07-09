# CRM Write-Enable Gate For Leads And Placement

Linear issue: MIS-301
Related issues: MIS-265, MIS-266, MIS-277, MIS-279

## Purpose

The refresh site already has public route contracts for lead/contact and
placement submissions. Those contracts validate submissions and return safe CRM
event previews, but they intentionally do not store student data or write to AIT
CRM yet.

This gate defines what must be true before changing that behavior.

## Current Runtime State

Lead/contact route:

- `app/api/leads/contact/route.js`
- `src/leads/leadContactModel.js`
- `sourceKey`: `aitusa-website-lead-v1`
- default `sourcePath`: `/#contacto`
- current response includes `crmWrite: false`
- current response includes `storageEnabled: false`

Placement route:

- `app/api/placement-test/route.js`
- `src/placement/placementTestModel.js`
- `sourceKey`: `aitusa-placement-test-v1`
- `sourcePath`: `/placement-test`
- current response includes `crmWrite: false`
- current response includes `storageEnabled: false`
- answer key status remains `pending_academic_review`
- grading mode remains `automatic_provisional`

Shared event contract:

- `docs/crm-event-contract.md`
- current event envelopes are safe previews only
- no durable outbox exists yet
- no live AIT CRM adapter is configured in this repo

## Recommended Enablement Order

1. Keep public runtime defaults off.
2. Add staging-only CRM write flags and adapter config.
3. Smoke one internal lead/contact submission in staging.
4. Smoke one internal placement submission in staging.
5. Verify the AIT CRM record, timeline/event, advisor task, duplicate behavior,
   and rollback path.
6. Ask for explicit production approval after client consent/copy decisions and
   MIS-279 storage/retention decisions are accepted.

## Feature Flags And Environment Gates

Use separate gates so lead capture can launch before placement storage if the
placement answer key or privacy rules are still pending.

Required default values:

```text
AITUSA_CRM_WRITES_ENABLED=false
AITUSA_LEAD_CRM_WRITE_ENABLED=false
AITUSA_PLACEMENT_CRM_WRITE_ENABLED=false
AITUSA_CRM_STORAGE_ENABLED=false
```

Adapter configuration, only when writes are enabled:

```text
AITUSA_CRM_API_BASE_URL=
AITUSA_CRM_SOURCE_SECRET=
AITUSA_CRM_WRITE_MODE=preview
```

Allowed write modes:

- `preview`: validate and build CRM payload only; no outbound write.
- `staging`: write only to the approved AIT CRM staging endpoint.
- `production`: write only after explicit production approval.

Production must require:

- `AITUSA_CRM_WRITES_ENABLED=true`
- the specific route flag set to `true`
- `AITUSA_CRM_WRITE_MODE=production`
- approved API base URL and source secret
- approval evidence in Linear

## Lead/Contact CRM Payload

Future live write should create or update an AIT CRM lead/contact with:

- name
- phone
- email, when provided
- city/country, when provided
- age group, when provided
- course interest
- preferred mode
- preferred schedule
- free-text message, only if retention/copy is approved
- contact permission consent state
- SMS marketing opt-in state, stored separately from contact permission
- source key, source name, source path, referrer, and campaign
- idempotency key

Advisor task behavior:

- create a follow-up task for the approved advisor/team;
- include source, interest, preferred schedule, and contact method;
- avoid duplicating tasks when idempotency detects a repeat submission.

## Placement CRM Payload

Future live write should create or update an AIT CRM lead/contact and attach a
placement intake record or timeline event with:

- contact fields from the placement form
- placement goal
- quiz score
- self-assessment average
- total score
- recommended level key and label
- `advisorConfirmationRequired: true`
- `answerKeyStatus`
- `gradingMode`
- writing prompt metadata
- raw writing answer only after MIS-279 storage/retention approval
- consent/advisor handoff state
- source key, source name, source path, referrer, and campaign
- idempotency key

Placement writes must not mark a student as officially enrolled or finally
placed. They should create an advisor review state such as
`placement_review_needed` until AIT approves the answer key and staff confirms
the final level.

## Privacy And Retention Gates

Do not store these until MIS-279 is accepted for the relevant category:

- raw placement writing answers;
- long free-text lead messages;
- minor/guardian details;
- placement answers tied to identity beyond advisor review need;
- retry/dead-letter payloads that contain personal data.

Safe previews may keep booleans, counts, score summaries, recommendation keys,
and source metadata without raw contact details.

## Staging Smoke Checklist

Lead/contact:

- submit one internal test lead from staging;
- verify AIT CRM created or matched the contact;
- verify source is `aitusa-website-lead-v1`;
- verify advisor task owner/routing;
- resubmit the same lead and confirm duplicate/idempotency behavior;
- disable the flag and confirm the route returns to preview-only behavior.

Placement:

- submit one internal placement result from staging;
- verify AIT CRM created or matched the contact;
- verify placement result is marked provisional and advisor-review-needed;
- verify answer-key status remains pending unless AIT has approved it;
- verify writing answer is omitted unless retention approval exists;
- disable the flag and confirm the route returns to preview-only behavior.

## Rollback

Rollback must be simple:

1. Set route-specific flags back to `false`.
2. Set `AITUSA_CRM_WRITES_ENABLED=false`.
3. Redeploy through the normal Git/Vercel flow if env changes require it.
4. Leave already-created CRM records intact, but add a Linear note with test
   record identifiers and cleanup owner if they were staging-only.

## Client Decisions Needed

Ask on Monday:

1. Should website leads be saved to AIT CRM as soon as a student submits the
   contact form?
2. Who should receive the follow-up task for new website leads?
3. Should placement test submissions be saved in AIT CRM before the answer key
   is officially approved?
4. If yes, should they be saved as provisional advisor-review records only?
5. Are staff allowed to store the student's written placement answer?
6. What exact consent wording should appear before a student submits the lead or
   placement form?
