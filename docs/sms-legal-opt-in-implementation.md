# SMS legal and opt-in implementation

Issue: MIS-327
Prepared: 2026-07-17
Status: staging implementation; not legal approval and not a Telnyx resubmission

## Public routes

- Canonical digital opt-in: `/contactanos`
- Privacy Policy: `/privacy-policy`
- Terms and Conditions: `/terms-and-conditions`
- Legacy Privacy alias: `/copy-of-terms-of-use` redirects to `/privacy-policy`
- Legacy Terms alias: `/terms-of-use` redirects to `/terms-and-conditions`

The policies are Spanish-first and include short English SMS summaries for
carrier/compliance review. Final published copy should be approved by AIT USA
Institute and legal counsel before the branded-domain launch.

## Versioned consent contract

- Privacy version: `aitusa-privacy-2026-07-17-v1`
- Terms version: `aitusa-terms-2026-07-17-v1`
- SMS disclosure version: `aitusa-sms-consent-2026-07-17-v1`

General response permission and SMS marketing consent are separate controls.
The response permission is required to prepare advisor follow-up. The SMS
checkbox is optional and unchecked by default. The form submits without a phone
or SMS permission.

If SMS consent is selected:

- a mobile number is required;
- `consent.marketingSmsOptIn` and `consent.smsConsent` must both be `true`;
- the two aliases must agree;
- `marketingSmsEvidence.disclosureVersion` must match the deployed version;
- the evidence source path must match the request source path;
- the consent timestamp must be valid.

If SMS consent is not selected, SMS evidence must be absent or `null`. Existing
phone numbers, generic contact permission, Terms acceptance, and legacy records
never imply SMS permission.

## Current data boundary

The contact API still returns a CRM-safe preview only:

- `crmWrite: false`
- `storageEnabled: false`
- no durable lead or consent storage
- no provider send
- the visitor chooses whether to open and send the prepared WhatsApp message

The preview carries the safe consent source, version, and timestamp metadata but
keeps raw phone, email, and free-text message content out of the CRM event
preview. Production persistence remains gated by MIS-301.

## Other phone collection

The placement-test telephone field is optional and explicitly states that it is
not a marketing-SMS opt-in source. Its CRM preview always emits
`marketingSmsOptIn: false`. This keeps placement follow-up separate from the
canonical `/contactanos` subscription flow.

## Telnyx resubmission update

After the refresh site is public on the branded domain, update the campaign to
describe one digital opt-in method:

> Subscribers opt in at https://www.aitusainstitute.com/contactanos. The form
> has an optional mobile-phone field and a separate optional SMS checkbox that
> is unchecked by default. The disclosure identifies AIT USA Institute, the
> message categories, variable frequency, message/data rates, STOP, HELP, and
> that consent is not a condition of purchase or receiving services. The form
> links to the live Privacy Policy and Terms and Conditions and can be submitted
> without selecting SMS consent. AIT USA Institute records the consent source,
> timestamp, and disclosure version. Only contacts who affirmatively select the
> checkbox are eligible for the SMS program.

Do not claim verbal marketing consent in the first resubmission. Do not submit
the campaign until the branded URLs are live and the production consent record
path is approved and verified.

## Pre-launch evidence

1. Legal review of the final Privacy and Terms copy.
2. Live branded URLs return the intended pages.
3. Footer and form links resolve correctly.
4. Phone remains optional and the SMS checkbox remains optional and unchecked.
5. Checked consent requires a phone and emits exact version/source/timestamp.
6. Unchecked and absent consent never create SMS permission.
7. Production CRM storage is enabled only through the MIS-301 approval gate.
8. STOP/HELP and opt-out behavior is tested before any audience launch.
9. Telnyx campaign narrative, use case, samples, and public flow are consistent.
