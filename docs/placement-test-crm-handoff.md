# Placement Test MVP And CRM Handoff

Linear issue: MIS-265
Status: Fixture-backed route/API contract on staging

## Purpose

The public `/placement-test` experience should help a student get an initial
level recommendation and then confirm it with an AIT USA advisor. This slice
keeps the existing static UI stable while adding the route/API contract needed
for future CRM handoff.

## Implemented Boundary

Code paths:

- `src/placement/placementTestModel.js`
- `app/api/placement-test/route.js`
- `tests/placement-test.test.mjs`
- `tests/placement-test-route.test.mjs`

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

The model mirrors the existing static placement-test scoring:

- Four quiz answers, each scored `0..3`.
- Four self-assessment answers, each scored `0..3`.
- Total score is quiz sum plus rounded self-assessment average.

Recommendations:

- `0..6`: `Inicio / Basico`
- `7..11`: `Basico alto / Intermedio inicial`
- `12..16`: `Intermedio / Intermedio alto`

All recommendation copy is explicitly orientative. Advisor confirmation remains
required before enrollment, schedule, or final level placement.

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
