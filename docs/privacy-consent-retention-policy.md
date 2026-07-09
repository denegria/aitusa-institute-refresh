# Privacy, consent, and retention gate

Linear issue: MIS-279

This slice creates code-backed privacy guardrails for future portal,
attendance, AI practice, audio, transcript, and payment-adjacent data. It is a
technical enforcement foundation, not a final legal policy.

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
approval for minors. Raw audio/transcript retention remains blocked until a
future approved policy defines purpose, retention window, deletion process,
access controls, and student/guardian consent language.

## API boundary

Route: `/api/portal/privacy`

The route returns a safe policy status preview for fixture accounts. It does
not store consent decisions durably and does not expose provider subjects.

## Admin/audit expectation

Every approved student data category currently requires admin audit metadata.
Future implementation should store who collected consent, policy version,
timestamp, student/guardian relationship where applicable, and deletion/audit
events.
