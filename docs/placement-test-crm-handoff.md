# Placement Test MVP And CRM Handoff

Linear issue: MIS-265
Status: Full on-page questionnaire and fixture-backed route/API contract on staging

## Purpose

The public `/placement-test` experience should help a student get an initial
level recommendation and then confirm it with an AIT USA advisor. This slice
keeps the existing static UI stable while adding the route/API contract needed
for future CRM handoff.

## Implemented Boundary

Code paths:

- `src/placement/placementTestModel.js`
- `app/api/placement-test/route.js`
- `src/content.js`
- `src/main.js`
- `tests/placement-test.test.mjs`
- `tests/placement-test-route.test.mjs`
- `tests/content-hygiene.test.mjs`

Route boundary:

- `GET /api/placement-test` returns scoring/config metadata.
- `POST /api/placement-test` evaluates a placement submission, generates a
  WhatsApp advisor handoff URL/message, and returns a CRM payload/event preview.

Guardrails:

- `crmWrite: false`
- `storageEnabled: false`
- no durable lead/student storage
- no live AIT CRM call
- no payment behavior
- no homepage implementation changes

## Scoring

The model now supports the source-backed on-page placement questionnaire:

- Six legacy source levels from the original placement exam.
- 62 grammar questions, each scored `0..1`.
- Four self-assessment answers, each scored `0..3`.
- One free-writing prompt. Writing is advisor-only evidence and never changes
  the automatic score.
- Self-assessment remains outside automatic placement.
- Each level block passes at 70%, rounded up to 9/12, 10/13, 7/10, 5/7, 6/8,
  and 9/12.
- Blocks must pass consecutively. The next class after the highest consecutive
  mastered block is recommended; a later isolated pass cannot leapfrog an
  earlier failure.
- Exactly one question below the active threshold is flagged for advisor review.
- Passing all six blocks recommends Level 6 and requires advanced review.

All recommendation copy remains orientative. The client answer key and block
model are approved under `automatic_consecutive_block_mastery`. Advisor
confirmation remains required before enrollment, schedule, or final placement.

## MIS-299 On-Page Questionnaire

The refresh product does not embed, link to, or show external form UI for the
placement test. The legacy Wix/Google questionnaire is source material only.

The on-page implementation:

- renders the six source levels directly on `/placement-test/`;
- shows 62 multiple-choice grammar questions in level groups;
- includes a free-writing prompt for advisor review context;
- submits to `/api/placement-test` when available;
- falls back to local provisional scoring if a static preview cannot reach the
  API;
- keeps `crmWrite: false` and `storageEnabled: false`;
- builds a WhatsApp handoff controlled by the student;
- keeps the result labelled as advisor-confirmed/provisional.

## Advisor Handoff

The user-facing handoff is a WhatsApp message that includes:

- name
- city/country
- phone
- email
- age group
- goal
- suggested level
- orientative score
- recommendation detail

This is user-controlled: the student chooses whether to send it through
WhatsApp. The route does not store the message.

## Future AIT CRM Payload Contract

Source contract:

- `sourceKey`: `aitusa-placement-test-v1`
- `sourceName`: `AIT USA Placement Test`
- `sourcePath`: `/placement-test`

Future CRM lead/intake payload should include:

- contact name, phone, email, city/country, and age group;
- placement goal;
- total score, quiz score, and self-assessment average;
- recommendation key and level;
- advisor-confirmation-required flag;
- consent/advisor handoff flag;
- idempotency key derived from source + submitted timestamp + safe contact
  fingerprint.

Current CRM event preview intentionally does not include raw phone or email in
the event payload. It only includes source key, recommendation, score, goal, and
field-presence flags until live CRM storage/write behavior is approved.

## Next Gates

Before enabling storage or live CRM writes:

- approve exact CRM lead endpoint and source attribution behavior;
- approve consent/preference copy for the public form;
- add spam/rate limiting;
- add durable idempotency and retry behavior;
- define advisor task creation rules;
- decide whether the static UI should call this endpoint or whether the
  placement flow should be rebuilt as a React page.
