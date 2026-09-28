# SMS legal and opt-in implementation

Issues: MIS-327, MIS-396
Prepared: 2026-08-20
Status: legal/consent reference for Human Review; not a Telnyx submission.
Updated 2026-09-28: `/contactanos` is inquiry-only in the current refresh
candidate. Earlier marketing opt-in evidence is historical, not resubmission
evidence.

## Public routes

- Inquiry response only, **not SMS opt-in**: `/contactanos`
- Marketing-SMS and enrollment-welcome service-SMS opt-in: not yet implemented
- Privacy Policy: `/privacy-policy`
- Terms and Conditions: `/terms-and-conditions`
- Legacy Privacy alias: `/copy-of-terms-of-use` redirects to `/privacy-policy`
- Legacy Terms alias: `/terms-of-use` redirects to `/terms-and-conditions`

The policies are Spanish-first and include short English SMS summaries for
carrier/compliance review. Final published copy should be approved by AIT USA
Institute and legal counsel before the branded-domain launch.

## Versioned consent contract

- Privacy version: `aitusa-privacy-2026-08-20-v3`
- Terms version: `aitusa-terms-2026-08-20-v2`
- Historical marketing SMS disclosure: `aitusa-sms-consent-marketing-2026-08-20-v2`
  and superseding historical form copy `aitusa-sms-consent-marketing-2026-09-28-v3`
- Service SMS disclosure: `aitusa-sms-consent-service-2026-08-20-v1`

General response permission, service SMS, and SMS marketing consent remain
distinct purposes. The `/contactanos` response permission is required for
advisor follow-up by the channels named on the form. Phone is optional, and
the form submits with no phone or SMS permission. Its payload records
`marketingSmsOptIn: false`, `smsConsent: false`, and no marketing evidence;
the contact API rejects attempts to submit marketing opt-in through this
inquiry-only surface. The homepage callback also records no SMS permission.
Existing phone numbers, generic contact permission, Terms acceptance, and
legacy records never imply SMS permission.

## Current data boundary

The contact API creates the approved CRM lead event:

- `crmWrite: true`
- durable lead storage is enabled; new inquiry submissions do not create
  marketing-SMS consent evidence
- no provider send until the Telnyx production gate is approved
- the visitor chooses whether to open and send the prepared WhatsApp message

Historical consent evidence remains associated with its original disclosure
version. Provider sends and campaign audience eligibility remain separately
gated.

## Other phone collection

The placement-test telephone field is optional and explicitly states that it is
not a marketing-SMS opt-in source. Its CRM preview always emits
`marketingSmsOptIn: false`. Post-placement account creation has a narrower
result-follow-up channel choice; its SMS disclosure/evidence needs repair
before it is cited in a Telnyx campaign. Register Now currently has no SMS
permission for an enrollment welcome.

## Telnyx replacement campaign

The previous `TELNYX_FAILED` campaign cannot be edited. Do not register a
replacement using `/contactanos` as an SMS opt-in URL. No current refresh
surface authorizes marketing SMS or an enrollment-welcome text. Before a
mixed-use replacement campaign is submitted, implement and evidence the
actual marketing and enrollment-service opt-in paths, and repair the
result-only placement path if it is included.

The campaign may be technically registered as low-volume mixed messaging, but
recipient eligibility remains purpose-specific. Do not claim verbal consent.
Do not submit until the branded URLs, evidence screenshots, consent ledger,
STOP/HELP behavior, and production event path are approved and verified. The
exact provider field manifest is in
`docs/telnyx-10dlc-replacement-campaign-manifest.md`.

## Pre-launch evidence

1. Business-owner and counsel review of the final Privacy and Terms copy.
2. Live branded URLs return the intended pages.
3. Footer and form links resolve correctly.
4. Inquiry forms remain available without any SMS subscription decision.
5. Future SMS opt-in controls are optional, unchecked, purpose-specific, and
   emit exact subscriber/number/version/source/timestamp evidence.
6. Absent consent never creates SMS permission.
7. Production CRM storage is enabled only through the MIS-301 approval gate.
8. STOP/HELP and opt-out behavior is tested before any audience launch.
9. Each service and marketing opt-in path named in the campaign is fully
   functional and evidenced.
10. Telnyx campaign narrative, use case, samples, and public flows are consistent.
