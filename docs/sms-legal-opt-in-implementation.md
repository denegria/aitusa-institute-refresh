# SMS legal and opt-in implementation

Issues: MIS-327, MIS-396
Prepared: 2026-08-20
Status: legal/consent contract prepared for Human Review; not legal advice and
not a Telnyx submission

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

- Privacy version: `aitusa-privacy-2026-08-20-v3`
- Terms version: `aitusa-terms-2026-08-20-v2`
- Marketing SMS disclosure: `aitusa-sms-consent-marketing-2026-08-20-v2`
- Service SMS disclosure: `aitusa-sms-consent-service-2026-08-20-v1`

General response permission, service SMS, and SMS marketing consent are
separate controls.
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

The contact API now creates the approved CRM event and consent evidence:

- `crmWrite: true`
- durable lead and versioned marketing-consent storage are enabled
- no provider send until the Telnyx production gate is approved
- the visitor chooses whether to open and send the prepared WhatsApp message

The event carries the consent source, version, and timestamp metadata. Provider
sends and campaign audience eligibility remain separately gated.

## Other phone collection

The placement-test telephone field is optional and explicitly states that it is
not a marketing-SMS opt-in source. Its CRM preview always emits
`marketingSmsOptIn: false`. This keeps placement follow-up separate from the
canonical `/contactanos` subscription flow.

## Telnyx replacement campaign

The previous `TELNYX_FAILED` campaign cannot be edited. Create a new campaign
only after both digital consent paths are live and evidenced:

1. `/contactanos`: separate marketing SMS opt-in, up to 8 messages per month.
2. Post-placement result save/confirmation flow: separate service SMS opt-in,
   with variable frequency based on the student's activity. This second path is
   implemented under MIS-397.

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
4. Phone remains optional and the SMS checkbox remains optional and unchecked.
5. Checked consent requires a phone and emits exact version/source/timestamp.
6. Unchecked and absent consent never create SMS permission.
7. Production CRM storage is enabled only through the MIS-301 approval gate.
8. STOP/HELP and opt-out behavior is tested before any audience launch.
9. Both service and marketing opt-in paths are fully functional and evidenced.
10. Telnyx campaign narrative, use case, samples, and public flows are consistent.
