# MIS-266 Lead Contact CRM Handoff

## Decision

The repo-backed refresh should treat AIT CRM as the future operational
destination for public lead/contact submissions. WhatsApp remains the immediate
advisor handoff path. Wix Forms is not the target for this refresh lane.

This slice does not enable CRM writes. It adds a route and model contract so the
future form integration has a stable validation, consent, spam, source
attribution, and CRM preview boundary before any durable lead capture is turned
on.

## Runtime Boundary

- Model: `src/leads/leadContactModel.js`
- Route: `app/api/leads/contact/route.js`
- Tests: `tests/lead-contact.test.mjs`,
  `tests/lead-contact-route.test.mjs`

`GET /api/leads/contact` returns contract metadata.

`POST /api/leads/contact` validates a lead/contact submission, prepares a
WhatsApp advisor handoff, and returns a CRM event/payload preview.

## Current Guardrails

- `crmWrite: false`
- `storageEnabled: false`
- no durable lead/contact storage
- no live AIT CRM call
- no Wix Forms post
- no email, SMS, WhatsApp, or provider send
- no homepage visual/content change

## Required Public Form Fields

- `name`
- `phone`
- `interest`
- `consent.contactPermission: true`

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

> AIT USA podra guardar mi solicitud en AIT CRM cuando el contrato de captura sea aprobado.

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

Incomplete user submissions return 422. Spam-signal submissions return 400. Both
paths keep `crmWrite: false` and `storageEnabled: false`.

## CRM Preview

Source metadata:

- `sourceKey`: `aitusa-website-lead-v1`
- `sourceName`: `AIT USA Website Lead Form`
- default `sourcePath`: `/#contacto`
- event type: `lead_form_submitted`

Future CRM payload should include:

- contact name, phone, email, city, and age group;
- interest, preferred mode, preferred schedule, and optional message;
- source path, referrer, and campaign;
- contact permission and separate SMS opt-in state;
- idempotency key based on source, safe contact fingerprint, and submission date.

The CRM event preview intentionally excludes raw phone, email, and free-text
message content from the event payload. It includes presence booleans and message
length so reporting can work without leaking sensitive contact details into
generic event payloads.

## Future Enablement Gate

Before changing `crmWrite` to true:

1. Approve exact AIT CRM website-lead endpoint and auth contract.
2. Approve final public form consent/preference copy.
3. Add bot protection appropriate for the live form surface.
4. Define CRM duplicate matching and advisor task creation rules.
5. Add retry/dead-letter behavior for failed CRM posts.
6. Rebuild or wire the actual public contact form to this route.
