# MIS-266 Lead Contact CRM Handoff

## Decision

The repo-backed refresh should treat AIT CRM as the future operational
destination for public lead/contact submissions. WhatsApp remains the immediate
advisor handoff path. Wix Forms is not the target for this refresh lane.

MIS-221 enables durable CRM delivery for both public lead surfaces:

- the full contact form emits `contact_form_submitted`;
- the request-a-call dialog emits `callback_requested`.

Both paths validate first, then atomically enqueue an idempotent event in the
Portal database's existing CRM outbox before returning success. The existing
dispatcher delivers the event to AIT CRM. WhatsApp remains an optional fallback
and immediate advisor handoff, not the system of record.

## Runtime Boundary

- Model: `src/leads/leadContactModel.js`
- Service: `src/leads/service.server.js`
- Repository: `src/leads/neonRepository.server.js`
- Route: `app/api/leads/contact/route.js`
- Tests: `tests/lead-contact.test.mjs`,
  `tests/lead-contact-route.test.mjs`

`GET /api/leads/contact` returns contract metadata.

`POST /api/leads/contact` validates a lead/contact submission, enqueues its CRM
event, prepares a WhatsApp advisor handoff, and returns 201. An idempotent replay
returns 202. Storage or queue failure returns 503; the UI must not claim success.

## Current Guardrails

- durable Portal CRM outbox storage
- idempotent submission IDs generated in the browser and enforced server-side
- fail-closed success semantics when the outbox is unavailable
- bounded outbox retries and dead-letter behavior through the shared dispatcher
- no Wix Forms post
- no automatic email, SMS, WhatsApp, or provider send from the public form
- separate SMS permission on the full form; callback requests do not imply SMS

## Required Public Form Fields

- `name`
- `interest`
- `consent.contactPermission: true`
- one of `phone` or `email`

Optional fields:

- `email`
- `city`
- `preferredMode`
- `preferredSchedule`
- `ageGroup`
- `message`

Approved interest keys in this contract:

- `ingles-presencial`
- `ingles-hibrido`
- `ingles-online`
- `kids`
- `ged`
- `computacion`
- `espanol`
- `curso-tecnico`
- `libro-inscripcion`
- `otro`

## Consent Copy

Contact permission:

> Acepto que AIT USA me contacte sobre programas, horarios y proximos pasos.

CRM storage notice:

> AIT USA guardará esta solicitud en AIT CRM para que un asesor pueda darle seguimiento.

SMS marketing opt-in stays separate from contact permission. This route accepts
`marketingSmsOptIn`, but it does not treat that as approval for SMS sending.

## Spam And Error Handling

The contract blocks obvious automated submissions through:

- blank-required-field validation;
- simple honeypot fields: `honeypot` and `companyWebsite`;
- minimum submit time of three seconds when `startedAt` and `submittedAt` are
  provided;
- email format validation;
- max free-text message length of 800 characters.

Incomplete user submissions return 422. Spam-signal submissions return 400.
Neither path enqueues an event.

## CRM Preview

Source metadata:

- `sourceKey`: `aitusa-website-lead-v1`
- `sourceName`: `AIT USA Website Lead Form`
- default `sourcePath`: `/#contacto`
- event types: `contact_form_submitted` and `callback_requested`

The delivery event includes:

- contact name, phone, email, city, and age group;
- interest, preferred mode, preferred schedule, and optional message;
- source path, referrer, and campaign;
- contact permission and separate SMS opt-in state;
- a stable form submission ID and event-specific idempotency key.

The generic analytics preview still excludes raw phone, email, and message text.
The private CRM outbox event includes only the contact and follow-up fields that
AIT CRM needs. It excludes placement answers, writing samples, audio, and
transcripts.

## Production Enablement Gate

1. Prove both form types against the AIT USA and AIT CRM staging deployments.
2. Confirm one contact, lead, activity, advisor task, and notification per form.
3. Replay each submission ID and prove no duplicate CRM artifacts.
4. Confirm the Portal outbox has no stale or dead-letter test delivery.
5. Complete the branded-domain privacy/Terms/10DLC consistency review.
6. Obtain explicit production promotion approval for the form feature.
