# AIT USA Telnyx 10DLC replacement campaign manifest

Issue: MIS-396  
Prepared: 2026-08-20  
State: Human Review candidate; **do not submit yet**. The earlier marketing
opt-in path on `/contactanos` has been retired from the refresh candidate.

This is the provider-entry source of truth for the campaign that will replace
the rejected AIT USA campaign. It contains no API keys, phone numbers, student
records, or reusable credentials. Final entry must match the live branded site
and screenshots exactly.

## Rejected campaign record

- Brand display name: `AIT USA INSTITUTE`
- TCR campaign ID: `CTWYTV0`
- Telnyx campaign ID: `4b30019f-4241-e60d-49d6-7a47e4c0a70c`
- Last known status: `TELNYX_FAILED`
- Rejection gaps:
  1. no link or screenshot proving the complete opt-in form;
  2. multiple opt-in methods were claimed without complete documentation;
  3. the Privacy Policy did not satisfy the mobile-data requirements.

Telnyx does not allow a rejected campaign to be edited. The replacement is a
new paid registration after the implementation/evidence gates below pass.

## Historical 2026-08-20 staging evidence — superseded

- Integrated staging commit: `c430596074ee2e100caf08db29606151593b1114`.
- Ready deployment: `dpl_86dEEgxecuHhfwKJTbEWEgZ5qPMA`.
- Public contact path exercised at the protected staging branch URL with a
  synthetic email-only submission: phone absent, required contact permission
  checked, marketing SMS unchecked, and the submit action succeeded.
- Desktop evidence SHA-256:
  `896bd041fdd682ce792fdbd45c8c65782b0ec62616f43ec108d8b35289849079`.
- Mobile consent-panel evidence SHA-256:
  `786dcac3b2f03a42a591c8906b5066d3e6c576b227f8fe20f2797f9e96863643`.
- Both files are attached to MIS-396. They show a **former** contact-form
  marketing control, not the current refresh candidate. Do not use them as
  resubmission evidence.
- No WhatsApp link was opened, no provider message was sent, and no phone
  number was supplied.
- Telnyx campaign `4b30019f-4241-e60d-49d6-7a47e4c0a70c` remains rejected and
  unchanged. It was **not edited, replaced, or resubmitted** during this update.

This historical evidence does not satisfy the production/branded-URL or final
opt-in-path gates below. Capture fresh evidence only after the final paths are
implemented and approved.

## Historical 2026-09-28 contact-form copy revision — superseded

- The marketing consent text was shortened without removing its visible
  disclosures. It was versioned as
  `aitusa-sms-consent-marketing-2026-09-28-v3`; any historical records retain
  their original version. New `/contactanos` submissions no longer collect
  marketing-SMS permission.
- The separate unchecked checkbox now names AIT USA Institute and promotional
  SMS. Its adjacent visible disclosure names recurring
  course/enrollment/event/offer messages, up to eight monthly with variable
  frequency, automated delivery, message/data rates, STOP/HELP, no purchase or
  service condition, and no third-party/affiliate marketing sharing. Privacy
  and Terms were directly linked. This describes the superseded form, not a
  current opt-in path.
- The permission to respond to an inquiry is still separate and required; its
  shorter label authorizes only a response to this request, not promotional SMS
  or promotional WhatsApp.

## 2026-09-28 inquiry-only revision — current refresh candidate

- `/contactanos` and the homepage callback are inquiry-response forms. Neither
  displays or records marketing-SMS consent. The Orientation form retains its
  required response permission, optional phone, CRM lead handoff, and
  Privacy/Terms links; its payload explicitly records `marketingSmsOptIn: false`.
  The contact API rejects forged marketing opt-ins submitted to these forms.
- No new marketing-SMS subscription destination has been implemented or
  selected. Registration currently has no enrollment-welcome SMS opt-in;
  placement account creation has a narrow result-follow-up channel choice, not
  welcome or marketing consent.
- The placement service-SMS screen is **not** submission evidence yet: its
  visible disclosure omits frequency, HELP, and no-sharing language, while the
  prior draft below overstated its scope and verification. Repair that screen,
  its stored evidence, and the campaign wording before citing it.
- Existing lead/number data and the prior contact-form screenshots cannot be
  treated as consent for a future marketing campaign. CRM welcome/retargeting
  execution is deferred to a separate, not-yet-created issue.

## Campaign selection

- `brandId`: retrieve from the approved AIT USA brand at submission time.
- Preferred `usecase`: `LOW_VOLUME` because AIT expects fewer than 6,000
  messages per month.
- Intended content categories/sub-use cases: `CUSTOMER_CARE`, `MARKETING`.
- If the approved brand's `/10dlc/enum/usecase` response does not permit that
  low-volume combination, use `MIXED` with the same two categories. Do not
  guess or change the content to fit a cheaper category.
- `referenceId`: `aitusa-messaging-2026-08-20-v1`
- `numberPool`: `false`
- `subscriberOptin`: `true`
- `subscriberOptout`: `true`
- `subscriberHelp`: `true`
- `embeddedLink`: `true`
- `embeddedPhone`: `true`
- `ageGated`: `false` (the educational content is not age-restricted; AIT does
  not seek marketing consent directly from children, and under-13 contact must
  be guardian-owned).
- `directLending`: `false`
- `termsAndConditions`: `true` only after owner approval of the live Terms.

## Description field — provisional, do not paste into Telnyx

> AIT USA Institute plans low-volume customer-care and marketing SMS. Intended
> service messages include requested placement-result follow-up and, after a
> separate enrollment opt-in is implemented, confirmed-enrollment next steps.
> Intended marketing messages include program announcements and offers only to
> contacts who affirmatively subscribe through a future, documented marketing
> opt-in path. Each recipient must be eligible for the specific purpose; phone
> collection, inquiry permission, and historical records are not SMS consent.

This is a scope draft, **not a claim that any of these paths or sends are live**.
Reconcile final wording with the actual opt-in surfaces and CRM eligibility
before provider entry.

## Message-flow field — blocked pending actual opt-in paths

No submission-ready field text exists now. The prior two-path draft was retired
because it named `/contactanos` as a marketing opt-in and overstated the
placement disclosure, scope, and mobile verification. Before drafting the new
field, record for **each actual digital opt-in path**: public URL, exact
purpose-specific unchecked checkbox and adjacent terms, subscriber/guardian
ownership, consent evidence, and a privacy-safe screenshot showing the form and
submit control. An inquiry response is not itself a marketing-SMS opt-in.

If enrollment welcome and retargeting remain both in scope, the new field must
name the implemented enrollment-service and marketing paths separately. The
placement result-only path may be included only after its own repairs and may
not be described as enrollment-welcome permission.

Do not add verbal, paper, inbound-keyword, WhatsApp, Google Forms, legacy Wix
forms, or employee-entered consent to this campaign unless that exact method is
implemented, scripted, evidenced, and added to the consent ledger first.

## Provider keyword fields

- `optinKeywords`: `START,YES,SUBSCRIBE`
- `optoutKeywords`: `STOP,UNSUBSCRIBE,CANCEL,QUIT`
- `helpKeywords`: `HELP,INFO`
- `optinMessage`:

> AIT USA Institute: Tu número puede recibir mensajes para los permisos activos
> registrados en tu cuenta. Responde STOP para cancelar o HELP para ayuda.

An inbound START removes a provider suppression only. It must not create a
missing marketing permission in the AIT consent ledger.

- `optoutMessage`:

> AIT USA Institute: Cancelamos los mensajes de texto para este número. No
> recibirás más SMS. Visita https://www.aitusainstitute.com/contactanos si
> necesitas ayuda.

- `helpMessage`:

> AIT USA Institute: Para ayuda llama al +1 732-271-0011 o visita
> https://www.aitusainstitute.com/contactanos. Pueden aplicarse tarifas de
> mensajes y datos. Responde STOP para cancelar.

## Sample message fields — purpose drafts, not ready for provider entry

Every eventual production template must retain brand identity and opt-out
language. Remove any sample whose purpose lacks a live, matching opt-in path;
the appointment/enrollment/marketing examples below are not authorized by the
current inquiry form or result-only placement consent.

- `sample1` — placement service:

> AIT USA Institute: Tu nivel fue confirmado. Inicia sesión para verlo:
> https://www.aitusainstitute.com/portal. Responde STOP para cancelar.

- `sample2` — requested follow-up:

> AIT USA Institute: Recordatorio de tu cita de orientación el 25 de agosto a
> las 6:00 p. m. Responde HELP para ayuda o STOP para cancelar.

- `sample3` — enrollment service:

> AIT USA Institute: Tu inscripción está lista para el próximo paso. Revisa los
> detalles en tu Portal. Responde STOP para cancelar.

- `sample4` — marketing:

> AIT USA Institute: Inscripciones abiertas para clases de inglés presenciales,
> híbridas y online. Conoce opciones: https://www.aitusainstitute.com/cursos.
> Responde STOP para cancelar.

- `sample5` — marketing:

> AIT USA Institute: Nuevo grupo de inglés comienza pronto en Nueva Jersey.
> Consulta horarios: https://www.aitusainstitute.com/contactanos. Responde STOP
> para cancelar.

## Public URLs

These are intended branded paths, **not proof that the refresh is live at the
public domain**. Verify actual production routing after migration.

- Inquiry-only path (not an SMS opt-in):
  `https://www.aitusainstitute.com/contactanos`
- Marketing-SMS opt-in path: **TBD; no current refresh form collects it.**
- Enrollment-welcome service-SMS opt-in path: **TBD; Register Now currently
  collects no SMS permission.**
- Optional placement-result service-SMS path: exact public URL after MIS-397
  disclosure, evidence, and ownership repairs; do not claim this path yet.
- Privacy: `https://www.aitusainstitute.com/privacy-policy`
- Terms: `https://www.aitusainstitute.com/terms-and-conditions`

## Consent and audience eligibility

Required ledger fields:

- normalized mobile number and verified ownership/status;
- purpose: `service_sms` or `marketing_sms`;
- affirmative decision and current eligibility state;
- source path and submission/correlation ID;
- exact disclosure version and preferably a content hash;
- consent timestamp and reasonable technical evidence;
- guardian account/relationship when the learner is under 13;
- revocation, wrong-number, deletion, STOP/START, and delivery-failure events.

Audience rules:

- Prior students/leads with a phone but no active `marketing_sms` record are
  ineligible for promotional texts.
- Never send a first promotional SMS asking a historical contact to opt in.
- Service eligibility cannot be promoted to marketing eligibility.
- STOP suppresses sends immediately at the provider and AIT layers. A minimal
  suppression record remains as long as needed to prevent future contact.
- Marketing email is a separate channel and must include the applicable sender,
  postal-address and unsubscribe controls.

## Evidence and submission gate

All boxes must be checked before Alvaro updates or submits the campaign:

- [ ] Privacy and Terms approved by the business owner and counsel.
- [ ] Both branded legal URLs are live and not placeholders.
- [ ] `/contactanos` inquiry response works without creating SMS consent; the
      campaign does not name it as an opt-in path.
- [ ] An intentional public marketing-SMS opt-in path is chosen, implemented,
      optional, unchecked, purpose-specific, fully disclosed, and recorded.
- [ ] If enrollment welcome is in campaign scope, Register Now or another
      enrollment path captures separate subscriber-owned service-SMS consent;
      a confirmed enrollment/payment transition is not inferred from inquiry.
- [ ] If placement-result SMS is included, MIS-397 visible disclosure and
      stored evidence match its **result-only** scope; email-only still works.
- [ ] Desktop and mobile screenshots show each full form, browser URL and submit
      control without exposing a real student's data.
- [ ] Checked consent records scope/version/source/time; unchecked consent does
      not create eligibility.
- [ ] STOP, HELP, START, wrong-number and delivery-failure behavior pass staging
      and provider-safe tests.
- [ ] Telnyx brand use-case enum confirms the final `usecase`/`subUsecases`.
- [ ] Description, message flow, samples, flags and screenshots match the live
      implementation word-for-word.
- [ ] A new registration fee and number reassignment are approved.

## Provider access boundary

`TELNYX_API_KEY` is stored as a Vercel Sensitive value. A pulled placeholder is
not a usable credential and must never be replaced with plaintext in the repo.
Read the final brand enum and create the campaign from an authenticated Telnyx
dashboard session or an approved runtime that receives the secret directly.

## Primary provider references

- https://developers.telnyx.com/docs/messaging/10dlc/campaign-registration
- https://developers.telnyx.com/docs/messaging/10dlc/campaign-use-cases/index
- https://support.telnyx.com/en/articles/9940291-10dlc-campaign-compliance-requirements
- https://support.telnyx.com/en/articles/10684260-10dlc-opt-in-form
