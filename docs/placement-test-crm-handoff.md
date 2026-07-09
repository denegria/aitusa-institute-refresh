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
- One free-writing prompt. The writing prompt does not change the automatic
  score in this version; it gives the advisor context for final level
  confirmation.
- Total score is quiz sum plus rounded self-assessment average.

Current recommendations:

- `0..12`: `Nivel inicial / Book 1 base`
- `13..23`: `Book 1 alto / Basico funcional`
- `24..34`: `Book 2 inicial / Intermedio bajo`
- `35..45`: `Book 2 alto / Intermedio`
- `46..56`: `Book 3 inicial / Intermedio alto`
- `57..65`: `Book 3 alto / Avanzado orientativo`

All recommendation copy is explicitly orientative. The answer key is marked
`pending_academic_review`, and the automatic grading mode is
`automatic_provisional` until AIT confirms the academic source of truth. Advisor
confirmation remains required before enrollment, schedule, or final level
placement.

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
