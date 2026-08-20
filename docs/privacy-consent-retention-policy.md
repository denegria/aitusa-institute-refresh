# Privacy, consent, and retention launch policy

Linear issue: MIS-279

This is the owner-approved launch contract for the AIT USA diagnostic, Portal,
employee placement review, CRM, communications, and Study Buddy data
boundaries. MIS-396 aligned it with the public Privacy Policy and Terms on
2026-08-20. It is an operating/product policy and should still receive counsel
review before production publication.

## Under-13 launch rule

The age gate asks only whether the learner is **13 or older** or **under 13**.
AIT does not require or store a date of birth for this flow.

An under-13 learner may:

- complete the full diagnostic anonymously;
- see the recommended level;
- skip questions and provide optional learning context;
- leave without creating an account.

Before guardian authorization, the browser session is the only retention
surface. The system must not create a durable attempt, attach identity, write a
funnel/CRM event, request advisor contact, or call an AI provider for the child.

Saving the result, creating or entering the Portal, and Study Buddy access
require a guardian-owned account. The guardian flow must:

1. collect the adult's name and email, not a child's email;
2. send a direct notice describing the data, purpose, retention, and controls;
3. verify control of that email and record an explicit parent/guardian
   attestation under the versioned policy;
4. send a confirmation/withdrawal receipt to the verified email;
5. create a linked child profile containing only first name and `under_13` age
   band unless a later educational workflow has an approved need for more;
6. record version, notice hash, verification method, decision, timestamp, and
   revocation/deletion events in an auditable consent record.

The launch verification method is
`verified_email_plus_attestation`. It is intended for internal educational use
with contracted service processors and no public child profile. A real AI
provider remains a separate MIS-345 gate; provider terms, data use, and the
required parental-verification strength must be approved before enabling that
provider for under-13 learners.

## Separate permissions

Guardian account authorization does not automatically grant:

- Study Buddy/AI-practice permission;
- advisor-contact permission;
- SMS or promotional marketing permission.

The production consent ledger must keep these purposes separate and default-off:

- advisor contact;
- service/placement SMS;
- marketing SMS;
- outbound phone calls;
- future automated or promotional WhatsApp.

Verified email and the Portal remain durable fallbacks. A current or historical
phone number, an inbound WhatsApp conversation, Terms acceptance, or general
contact permission never creates SMS or WhatsApp marketing permission.

For an under-13 learner, any permitted phone number and channel consent belongs
to the verified guardian. AIT does not seek marketing consent directly from a
child.

Each is a separate, default-off decision. Declining one cannot block the
anonymous diagnostic or access to an already-authorized saved result.

No physical-presence claim is stored. The product can ask the learner to get a
guardian, but enforcement relies on the verified adult account, notice,
attestation, and consent receipt rather than an unverifiable “guardian present”
checkbox.

## Current policy categories

- `portal_profile_summary`
- `attendance_record`
- `lesson_progress_summary`
- `placement_review_record`
- `ai_practice_summary`
- `ai_audio_raw`
- `ai_transcript_raw`
- `payment_ledger_summary`
- `payment_sensitive_payload`

Each category defines:

- required consent basis;
- whether storage is currently allowed;
- retention class;
- deletion policy;
- whether minor/guardian approval is required;
- whether admin audit is required.

## Storage boundaries

Storage is explicitly blocked for:

- raw AI practice audio;
- raw AI transcripts;
- raw payment instrument payloads.

Safe AI practice summaries may be stored only with explicit consent and guardian
approval for under-13 learners. Raw audio and full transcripts are an approved
zero-retention/no-store boundary, not a deferred storage decision.

## Retention and control

- Unclaimed age-13-plus anonymous attempts: 7 days.
- Under-13 pre-consent attempts: browser session only.
- Claimed raw diagnostic answers and writing: purge no later than 30 days after
  final review, with a 90-day maximum after claim when review never completes.
- Recommended/confirmed level, reviewer decision, rationale, and audit:
  5 years after the last educational or account activity.
- CRM contact, opportunity, and communication records: 5 years after the last
  meaningful interaction, unless an active relationship, legal hold, or other
  documented obligation requires longer.
- Portal profile: account lifecycle plus 2 years.
- Attendance and financial/academic records: up to 7 years when operationally
  or legally required.
- Safe Study Buddy summaries: at most 1 year and deletable on verified request.
- Raw Study Buddy audio, full transcript, and complete conversation: no-store.
- Consumed/expired email challenges: purge through the existing short-lived
  challenge-retention job.
- Consent proof and messaging eligibility records: up to 5 years after the last
  message, withdrawal, or expiration.
- Delivery metadata: up to 2 years. Security/access logs: normally 12 months.
- A minimal suppression record may remain longer when necessary to honor STOP,
  wrong-number, deletion, or do-not-contact requests. It must not contain raw
  answers, writing, audio, transcripts, or message bodies.

Five years is therefore the default for durable relationship and placement
records, not a blanket retention rule. Deletion requests remain subject to
documented academic, accounting, fraud, dispute, security, and legal-hold
exceptions. Data should be deleted or deidentified when its approved purpose
ends.

## Marketing and retargeting boundary

- A prior student or lead may receive marketing SMS only when the consent
  ledger contains an active, versioned `marketing_sms` opt-in for that number.
- A first promotional SMS cannot be used to ask a historical contact for SMS
  consent.
- Service SMS permission cannot be reused for promotions.
- Promotional email must follow the commercial-email identification and
  unsubscribe requirements that apply to it.
- Before enabling cookie-based retargeting or targeted advertising, AIT must
  publish the applicable notice and controls and honor statutory opt-out or
  consent requirements. This policy does not pre-authorize a future ad stack.

The verified guardian can review the linked child profile, revoke future use,
withdraw optional permissions, unlink the profile, and request deletion. A
revocation immediately blocks new durable child activity while the deletion
request is processed.

## API boundary

Route: `/api/portal/privacy`

The route returns a safe policy status and the versioned guardian launch
contract. It does not expose provider subjects.

## Admin/audit expectation

Every approved student data category currently requires admin audit metadata.
The guardian implementation must store who provided consent, policy version,
notice hash, verification method, timestamp, scoped permissions, relationship
attestation, and revocation/deletion events. The existing adult result-claim
flow must not be relabeled as guardian verification; guardian-owned account and
linked-child persistence are a separate implementation slice.
