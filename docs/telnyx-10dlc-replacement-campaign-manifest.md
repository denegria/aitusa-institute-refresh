# AIT USA Telnyx 10DLC replacement campaign manifest

Issue: MIS-396  
Prepared: 2026-08-20  
State: Human Review candidate; **do not submit yet**

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

## Description field

> AIT USA Institute sends low-volume customer-care and marketing SMS. Service
> messages provide requested placement-level confirmations, enrollment and
> class updates, appointment details, and reminders. Marketing messages provide
> program announcements, enrollment dates, events, and offers only to contacts
> with separate marketing-SMS consent. Each recipient is eligible only for the
> scope they affirmatively selected, and historical students or leads are not
> automatically enrolled.

## Message-flow field

Use this text only after both paths are live:

> AIT USA Institute uses two separate digital opt-in paths. Marketing SMS:
> visitors use the public contact form at
> https://www.aitusainstitute.com/contactanos, enter an optional mobile number,
> and affirmatively check a separate marketing-SMS checkbox that is unchecked by
> default. The adjacent disclosure names AIT USA Institute, says messages are
> recurring marketing texts sent using automated technology, describes program
> announcements, enrollment dates, events and offers, limits frequency to up to
> 8 messages/month, states message/data rates may apply, provides STOP and HELP,
> states consent is not a condition of purchase or service, states mobile data
> is not shared with third parties or affiliates for their marketing, and links
> the Privacy Policy and Terms. The form submits without SMS consent. Service
> SMS: after a placement result is saved, the verified user may choose SMS as a
> confirmation channel and enter/verify an optional mobile number. A separate,
> unchecked service-SMS checkbox discloses placement-result, enrollment, class,
> appointment and reminder messages, variable frequency, automated technology,
> rates, STOP/HELP, no purchase condition, no third-party marketing sharing,
> Privacy and Terms. Email-only remains available. AIT stores the phone, scope,
> decision, disclosure version, source URL and timestamp. Under-13 consent and
> the mobile number must belong to the verified guardian. Existing numbers,
> service consent and general contact permission never imply marketing consent.

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

## Sample message fields

Every production template must retain the brand identity and opt-out language.

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

- Opt-in path A: `https://www.aitusainstitute.com/contactanos`
- Opt-in path B: the exact public post-placement URL created by MIS-397; fill
  this before submission.
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
- [ ] `/contactanos` shows optional phone, unchecked marketing checkbox, full
      disclosure, Privacy/Terms links and a working submit button.
- [ ] MIS-397 service-SMS path is live, optional, unchecked and independently
      recorded; email-only still works.
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
