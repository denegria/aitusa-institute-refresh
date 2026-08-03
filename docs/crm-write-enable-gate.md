# CRM Write-Enable Gate For Leads And Placement

Linear issue: MIS-301
Related issues: MIS-221, MIS-265, MIS-266, MIS-277, MIS-279

## Purpose

The refresh site has separate lead/contact and placement pipelines. MIS-221
enables durable outbox delivery for both public contact forms. Anonymous
placement attempts/results remain in the Portal database; CRM delivery begins
only after a student verifies email and claims a result.

This gate defines what must be true before promoting the new contact behavior to
production and how the placement boundary stays separate.

## Current Runtime State

Lead/contact route:

- `app/api/leads/contact/route.js`
- `src/leads/leadContactModel.js`
- `sourceKey`: `aitusa-website-lead-v1`
- default `sourcePath`: `/#contacto`
- full form event: `contact_form_submitted`
- callback event: `callback_requested`
- successful submissions are stored in the durable Portal CRM outbox
- CRM receipt is idempotent by browser-generated submission ID

Placement route:

- `app/api/placement-test/route.js`
- `src/placement/placementTestModel.js`
- `sourceKey`: `aitusa-placement-test-v1`
- `sourcePath`: `/placement-test`
- current response includes `crmWrite: false`
- current response includes `storageEnabled: false`
- answer key status is `approved`
- grading mode is `automatic_consecutive_block_mastery`

Shared event contract:

- `docs/crm-event-contract.md`
- current event envelopes are safe previews only
- the durable outbox and AIT CRM transport are shared with result-claim and
  Study Buddy events

## Recommended Enablement Order

1. Deploy the contact intake feature to both staging lanes.
2. Smoke one full form and one callback submission in staging.
3. Verify the AIT CRM contact, lead, activity, task, notification, consent state,
   and duplicate behavior.
4. Separately smoke a claimed placement result; never use raw anonymous answers
   as a CRM payload.
5. Ask for explicit production approval after branded-domain legal/10DLC review.

## Environment Gates

The deployment lane and branch-scoped secrets are the gate. AIT USA staging must
target the protected AIT CRM staging endpoint and its matching source secret;
production must target only the production endpoint and secret. A missing Portal
database or outbox configuration fails closed with 503.

## Lead/Contact CRM Payload

Live delivery creates or matches an AIT CRM lead/contact with:

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
- confirm queue failure returns 503 rather than a false success.

Placement:

- submit one internal placement result from staging;
- verify AIT CRM created or matched the contact;
- verify placement result is marked provisional and advisor-review-needed;
- verify answer-key status remains pending unless AIT has approved it;
- verify writing answer is omitted unless retention approval exists;
- disable the flag and confirm the route returns to preview-only behavior.

## Rollback

Rollback must be simple:

1. Revert the AIT USA form-enqueue commit and redeploy through Git/Vercel.
2. If delivery itself is unsafe, rotate/remove the branch-scoped CRM source
   secret and keep queued records for controlled replay.
3. Leave already-created CRM records intact, but add a Linear note with test
   record identifiers and cleanup owner if they were staging-only.

## Client Decisions Needed

Resolved: website leads should be stored immediately after a valid full-form or
callback submission. Still confirm advisor ownership/routing and final consent
copy during branded-domain launch review. Placement CRM linkage remains the
verified result-claim pipeline and excludes raw answers/writing/audio/transcripts.
