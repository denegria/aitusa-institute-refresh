# Privacy, consent, and retention launch policy

Linear issue: MIS-279

This is the owner-approved launch contract for the AIT USA diagnostic, Portal,
and Study Buddy data boundaries. It is an operating/product policy and should
still receive counsel review before a public-domain launch.

## Under-13 launch rule

The age gate asks only whether the learner is **13 or older** or **under 13**.
AIT does not require or store a date of birth for this flow.

An under-13 learner may:

- complete the full diagnostic anonymously;
- see the estimated result;
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
- Claimed raw diagnostic answers: purge no later than 30 days after claim.
- Saved result summaries: account-owned until deletion or unlinking.
- Safe Study Buddy summaries: at most 1 year and deletable on verified request.
- Raw Study Buddy audio, full transcript, and complete conversation: no-store.
- Consumed/expired email challenges: purge through the existing short-lived
  challenge-retention job.
- Consent/security audit evidence: retain only for the approved operational or
  legal need; it must not contain raw answers, writing, audio, or transcripts.

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
