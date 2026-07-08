# AIT USA CRM Event API Contract

Date: 2026-07-08
Linear: MIS-277
Status: Docs/spec only

## Purpose

Define how meaningful public-site and student-portal actions should be logged to
AIT CRM through approved server-side contracts.

This document gives future builders a normalized event taxonomy, payload shape,
idempotency model, consent/source rules, retry behavior, and CRM timeline/task
effects. It does not approve a live CRM integration, backend endpoint, database,
queue, or production write.

## Scope

In scope:

- Public-site and portal event taxonomy.
- Shared event payload shape.
- Idempotency and source attribution.
- Consent and privacy boundaries.
- Retry/error/degraded behavior.
- CRM timeline, task, and reporting effects.
- Dependencies on platform issues.

Out of scope until explicitly approved:

- Creating API routes or backend services.
- Calling AIT CRM from the browser.
- Storing raw student PII, audio, transcripts, payment secrets, or provider
  tokens.
- Sending live CRM writes, migrations, emails, SMS, WhatsApp messages, or payment
  events.
- Choosing final infrastructure such as queues, databases, or serverless runtime.

## Contract Principles

- Server-side only: browsers call the site/portal backend, and the backend calls
  AIT CRM or a CRM adapter.
- AIT CRM remains the operational system of record.
- The website and portal produce events; they do not become the CRM.
- Every event has a stable idempotency key.
- Every event has clear source attribution.
- Events carry only the minimum safe metadata needed for CRM follow-up.
- Raw audio/transcripts, payment card data, secrets, and private staff notes are
  never event payload defaults.
- Failed writes should be retryable and visible to staff; student-facing flows
  should degrade honestly.

## Proposed Boundary

Future browser flow:

1. User completes a public-site or portal action.
2. Browser sends the action to an approved website/portal backend endpoint.
3. Backend validates session, consent, payload, rate limits, and source.
4. Backend writes or queues a normalized event for AIT CRM.
5. Backend returns a student-safe response.
6. Backend retries failures according to policy.

Forbidden boundary:

- Browser sends directly to AIT CRM.
- Browser contains CRM API keys or provider secrets.
- Public static form silently stores durable student data without approved
  consent/retention policy.

## Event Envelope

Every event should use a shared envelope.

```json
{
  "eventId": "evt_01HX...",
  "eventType": "portal.sign_in.succeeded",
  "idempotencyKey": "portal.sign_in.succeeded:acct_123:2026-07-08T16:00",
  "occurredAt": "2026-07-08T16:00:00.000Z",
  "receivedAt": "2026-07-08T16:00:01.000Z",
  "source": "aitusa-portal",
  "sourceVersion": "unknown-until-runtime-approved",
  "environment": "preview",
  "actor": {
    "type": "student",
    "portalAccountId": "acct_123",
    "crmContactId": "crm_contact_456"
  },
  "subject": {
    "type": "enrollment",
    "crmEnrollmentId": "crm_enrollment_789"
  },
  "consent": {
    "status": "not_required",
    "policyVersion": null
  },
  "metadata": {},
  "request": {
    "sessionId": "sess_redacted",
    "ipHash": "sha256-redacted",
    "userAgentHash": "sha256-redacted"
  }
}
```

The exact ID formats are placeholders. Final formats should follow the approved
portal backend and CRM API conventions.

## Required Fields

- `eventId`: unique event ID generated server-side.
- `eventType`: normalized event name.
- `idempotencyKey`: stable key for deduplication.
- `occurredAt`: when the user action happened.
- `receivedAt`: when the backend received it.
- `source`: `aitusa-website`, `aitusa-portal`, `aitusa-admin`, or
  `aitusa-system`.
- `environment`: `local`, `preview`, `staging`, or `production`.
- `actor.type`: `visitor`, `lead`, `student`, `guardian`, `teacher`, `admin`,
  or `system`.
- `metadata`: event-specific safe metadata.

## Optional Link Fields

Include only when known and verified:

- `portalAccountId`
- `crmContactId`
- `crmLeadId`
- `crmEnrollmentId`
- `courseId`
- `sectionId`
- `sessionId`
- `moduleId`
- `invoiceId`
- `paymentId`
- `supportRequestId`

Do not expose internal CRM IDs to the browser unless the backend explicitly maps
them to safe public references.

## Event Type Taxonomy

Use dotted names in the shape `area.action.result`.

### Public Site Events

| Event type | Trigger | Default CRM effect | Gate |
| --- | --- | --- | --- |
| `lead.form.submitted` | Contact/lead form submitted | Timeline event; lead/contact creation or update | MIS-266, MIS-277, consent |
| `placement.started` | Placement flow started | Timeline event or anonymous aggregate | MIS-265/MIS-277 |
| `placement.completed` | Placement result generated/submitted | Lead/contact timeline; advisor task | MIS-265/MIS-277, consent |
| `whatsapp.cta.clicked` | WhatsApp/advisor link clicked | Timeline event if identifiable; aggregate otherwise | MIS-277 |
| `course.cta.clicked` | Course CTA clicked | Timeline event or aggregate interest signal | MIS-277 |
| `registration_book.cta.clicked` | Registration/book CTA clicked | Lead/contact timeline; advisor task | MIS-277 |

### Portal Account Events

| Event type | Trigger | Default CRM effect | Gate |
| --- | --- | --- | --- |
| `portal.invite.created` | Staff/admin creates invite | Timeline/admin audit | MIS-271 |
| `portal.invite.claimed` | Student claims invite | Timeline event | MIS-271 |
| `portal.sign_in.succeeded` | Verified user signs in | Timeline or activity signal | MIS-271 |
| `portal.sign_in.failed` | Failed sign-in after backend validation | Security/audit signal only | MIS-271 |
| `portal.profile_update.requested` | Student requests profile change | CRM task/review | MIS-271, MIS-279 |
| `portal.support.requested` | Support contact submitted | CRM task | MIS-276, MIS-277 |

### Attendance Events

| Event type | Trigger | Default CRM effect | Gate |
| --- | --- | --- | --- |
| `attendance.scan.received` | Scanner sends check-in code | Attendance processing/audit | MIS-272, MIS-273 |
| `attendance.check_in.recorded` | Check-in accepted | Attendance timeline/report | MIS-272 |
| `attendance.absence.recorded` | Absence recorded | Attendance timeline/report | MIS-272 |
| `attendance.correction.requested` | Student/guardian disputes record | Staff task | MIS-272 |
| `attendance.correction.approved` | Staff approves correction | Attendance timeline/audit | MIS-272 |

### Learning Content Events

| Event type | Trigger | Default CRM effect | Gate |
| --- | --- | --- | --- |
| `lesson.recap.viewed` | Student opens recap | Timeline/progress summary | MIS-274 |
| `lesson.module.started` | Student starts video/module | Progress event | MIS-274 |
| `lesson.module.completed` | Student completes module | Progress event/report | MIS-274 |
| `lesson.homework.submitted` | Homework/checkpoint submitted | Teacher/admin task or progress | MIS-274 |
| `lesson.content.published` | Teacher/admin publishes content | Admin audit | MIS-274 |

### AI Study Buddy Events

| Event type | Trigger | Default CRM effect | Gate |
| --- | --- | --- | --- |
| `ai.practice.started` | Student starts approved AI practice | Safe timeline/progress event | MIS-275, MIS-279 |
| `ai.practice.completed` | Student completes session | Safe summary event | MIS-275, MIS-279 |
| `ai.practice.escalation_needed` | Safety/teacher review triggered | Staff task | MIS-275, MIS-279 |
| `ai.practice.limit_reached` | Cost/rate limit reached | Support/audit signal | MIS-275 |

Default AI CRM payload should include safe summaries only:

- topic;
- course/module reference;
- level;
- completion status;
- score/progress summary when approved;
- escalation flag.

Do not store raw audio or transcripts unless MIS-279 explicitly approves
collection, retention, access, and deletion policy.

### Payment Events

| Event type | Trigger | Default CRM effect | Gate |
| --- | --- | --- | --- |
| `payment.started` | Student opens approved payment request | Payment timeline | MIS-278 |
| `payment.completed` | Provider confirms payment | Ledger/receipt update | MIS-278 |
| `payment.failed` | Provider reports failed payment | Staff task or timeline | MIS-278 |
| `payment.refunded` | Provider reports refund | Ledger/receipt update | MIS-278 |
| `receipt.viewed` | Student views approved receipt | Timeline/audit | MIS-278 |

Never include card numbers, CVC, raw provider secrets, or full payment method
details in CRM event metadata.

## Idempotency

Each event write should include an idempotency key built from stable fields.

Recommended shape:

`{eventType}:{actorOrSession}:{subject}:{businessTimestampOrActionId}`

Examples:

- `placement.completed:lead_123:placement_abc`
- `portal.invite.claimed:invite_123`
- `attendance.scan.received:scanner_1:code_hash:2026-07-08T18:01`
- `lesson.module.completed:acct_123:module_456`
- `payment.completed:provider_stripe:payment_intent_123`

Rules:

- Retrying the same event with the same key must not create duplicates.
- Conflicting payloads with the same key should be rejected or flagged for
  review.
- Payment provider event IDs should be the idempotency anchor when available.
- Attendance scanner events need duplicate-scan handling defined by MIS-272 and
  MIS-273.

## Consent And Privacy

Consent fields:

- `status`: `not_required`, `granted`, `declined`, `withdrawn`, `unknown`
- `policyVersion`
- `capturedAt`
- `captureMethod`: `form_checkbox`, `portal_setting`, `staff_recorded`,
  `provider_webhook`, `not_applicable`

Rules:

- Public lead/contact/placement events require approved consent copy before
  storing personal data.
- Student portal events require verified account identity and MIS-279 rules for
  sensitive data.
- Minor/guardian events require guardian policy before expanded access.
- AI audio/transcript events require explicit privacy/retention approval.
- Payment events must follow MIS-278 and provider compliance boundaries.

## Source Attribution

Events should preserve acquisition and action context when safe:

- landing page;
- referrer domain;
- UTM campaign/source/medium/content/term;
- CTA ID;
- course/program interest;
- location interest;
- language;
- device category;
- source environment.

Do not store raw IP addresses by default. Use a hash or omit unless a security
policy requires retention.

## Retry And Failure Behavior

Recommended future backend behavior:

- Validate payload synchronously.
- Return a clear result to the browser.
- Queue CRM writes when a queue exists.
- Retry transient CRM/API failures with backoff.
- Mark permanent failures for staff review.
- Keep an internal dead-letter/retry dashboard if event volume warrants it.

Student-facing behavior:

- If the user action can complete without CRM write, show success plus "we will
  follow up" only when the backend has accepted the event.
- If the event is essential, show a retry/support path.
- Do not silently lose placement, payment, attendance, or support events.

## CRM Timeline, Task, And Reporting Effects

Each event should declare intended CRM effects before implementation:

- Timeline only: visible history, no task.
- Task: staff follow-up needed.
- Reporting: aggregate metrics or funnel reporting.
- Ledger/update: payment/accounting effect after MIS-278.
- Audit only: security or admin history.

Default mapping:

- Lead/contact/placement: timeline plus advisor task when actionable.
- WhatsApp CTA: timeline or aggregate signal.
- Portal sign-in: timeline or activity signal, not noisy staff task.
- Attendance: attendance record plus audit trail.
- Lesson/module: progress/reporting event.
- AI practice: safe progress summary plus task only on escalation.
- Payment: ledger/receipt effect plus staff task on failure/refund exceptions.
- Profile update request: staff task.

## Security Rules

- CRM credentials stay server-side.
- Use least-privilege CRM API credentials.
- Validate actor permissions before accepting portal events.
- Rate-limit public and portal event endpoints.
- Verify provider webhooks for payment or third-party events.
- Sanitize free-text metadata before writing to CRM timeline.
- Do not log raw secrets, tokens, payment details, audio, or transcripts.
- Keep admin/audit events separate from student-facing notifications.

## Example Events

### Placement Completed

```json
{
  "eventType": "placement.completed",
  "source": "aitusa-website",
  "actor": {
    "type": "lead",
    "crmLeadId": "pending"
  },
  "subject": {
    "type": "placement_test"
  },
  "metadata": {
    "recommendedLevel": "beginner",
    "goal": "work",
    "courseInterest": "english-in-person",
    "advisorConfirmationRequired": true
  }
}
```

### Portal Sign-In

```json
{
  "eventType": "portal.sign_in.succeeded",
  "source": "aitusa-portal",
  "actor": {
    "type": "student",
    "portalAccountId": "acct_123",
    "crmContactId": "crm_contact_456"
  },
  "metadata": {
    "method": "managed_provider",
    "role": "student"
  }
}
```

### AI Practice Completed

```json
{
  "eventType": "ai.practice.completed",
  "source": "aitusa-portal",
  "actor": {
    "type": "student",
    "portalAccountId": "acct_123",
    "crmContactId": "crm_contact_456"
  },
  "subject": {
    "type": "lesson_module",
    "moduleId": "module_789"
  },
  "metadata": {
    "topic": "past tense conversation",
    "level": "beginner",
    "completed": true,
    "scoreSummary": "approved-summary-only",
    "escalationNeeded": false
  }
}
```

## Dependencies

- MIS-271 supplies account identity, role, and CRM link rules.
- MIS-276 supplies the portal actions and screens that create events.
- MIS-272 and MIS-273 supply attendance event details and scanner behavior.
- MIS-274 supplies learning content and progress events.
- MIS-275 supplies AI event safety and summary boundaries.
- MIS-278 supplies payment provider and ledger/receipt events.
- MIS-279 supplies consent, retention, minor/guardian, export/delete, and audit
  requirements.

## Open Decisions

- CRM API endpoint shape and authentication method.
- Whether event writes are synchronous, queued, or hybrid.
- Event ID and CRM ID formats.
- Final source names for website, portal, admin, and system events.
- Consent policy versioning.
- Staff task assignment rules by location/program.
- Retry/dead-letter monitoring owner.
- Which public-site events can be anonymous aggregate events.
- Which portal events should be visible to students versus CRM-only.

## Abort Conditions

Stop before implementation if:

- The proposed flow calls AIT CRM directly from browser code.
- Event payloads include secrets, raw payment details, raw audio, or transcripts
  without explicit approval.
- Consent/retention requirements are missing for personal or sensitive data.
- Idempotency cannot prevent duplicate payment, attendance, or lead events.
- CRM effects are unclear enough that staff could get duplicate/noisy tasks.
- The integration turns the portal into a second CRM instead of a safe event
  source.

## Acceptance Mapping

MIS-277 acceptance coverage:

- Event taxonomy: public site, portal account, attendance, lesson, AI, payment,
  and profile/support events are listed.
- Idempotency: shared key strategy and duplicate rules are defined.
- Consent: event consent fields and privacy rules are defined.
- Source attribution: acquisition/action metadata is defined.
- Retry/error behavior: validation, queue/retry, permanent failure, and
  student-facing behavior are defined.
- CRM timeline/task/reporting effects: default mapping is defined.

This spec is ready for review as a docs-only MIS-277 slice.
