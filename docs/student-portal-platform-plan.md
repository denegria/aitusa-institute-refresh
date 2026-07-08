# AIT USA Student Portal And Learning Platform Plan

Date: 2026-07-06

## Product Direction

The public AIT USA refresh is no longer just a marketing site if we add
student sign-in, attendance, lesson recaps, payments, and AI practice. Treat this
as an AIT USA digital platform:

- Public site: acquisition, course discovery, placement, contact, conversion.
- Student portal: authenticated student experience.
- AIT CRM: operational system of record for contacts, enrollments, attendance,
  payments, events, follow-up, and reporting.

Do not force these features into the current static site without a stack/auth/data
decision. The current static repo can own planning, public pages, prototypes, and
contracts, but authenticated portal work needs a real app/runtime path.

## Core Platform Principles

- AIT CRM owns the durable business record.
- The portal is a student-facing surface, not a separate CRM.
- Every meaningful action should become a normalized CRM event when approved:
  placement started/completed, lead form submitted, WhatsApp CTA clicked, portal
  sign-in, lesson viewed, module completed, AI practice session, attendance scan,
  payment started/completed/failed, and profile updates.
- Payments remain blocked until provider, student identity, ledger/receipt, and
  reconciliation rules are approved.
- AI speech practice remains blocked until privacy, audio retention, cost control,
  and teacher/escalation policy are approved.

## Issue-Ready Backlog

### Parent

Title: `[AIT USA Platform] Student portal, attendance, and learning operations expansion`

Purpose: Parent for authenticated student-platform expansion beyond the static
marketing site.

Acceptance:

- Child slices define accounts, attendance, barcode check-in, lesson content, AI
  study support, CRM event logging, payments, and privacy/security.
- AIT CRM remains the operational system of record.
- The public site/student portal boundary is explicit.

### Student Accounts

Title: `[AIT USA Platform] Student accounts and portal authentication model`

Acceptance:

- Choose auth/provider direction.
- Define student account lifecycle, invites, password reset, and profile basics.
- Map portal accounts to AIT CRM contacts, leads, enrollments, courses,
  guardians/minors, and payment records.
- Define student, guardian, teacher, and admin permissions.
- Define migration path from current static site.

### Attendance Model

Title: `[AIT USA Platform] Attendance tracking model and CRM sync`

Acceptance:

- Define entities: student, enrollment, course, class/session, check-in, absence,
  correction, and audit history.
- Define manual admin edits and reporting views.
- Define CRM API sync and event shape.
- Define how attendance appears in both CRM and student portal.

### Barcode Scanner Check-In

Title: `[AIT USA Platform] Barcode scanner check-in POC`

Acceptance:

- Choose scanner mode/hardware assumptions.
- Define student barcode/ID format.
- Define check-in station UX.
- Handle duplicate scans, late scans, wrong class, offline/failure mode, and
  manual override.
- Scans create attendance events in CRM/portal state.

### Lesson Recaps And Modules

Title: `[AIT USA Platform] Lesson recap and video module library`

Acceptance:

- Define content types: lesson recap, video module, handout/link, homework, and
  optional quiz/checkpoint.
- Associate content to courses, class sessions, and individual enrollments.
- Define admin/teacher publishing workflow.
- Define student progress/view logging.
- Define CRM event logging for viewed/completed lessons.

### Student Portal UX

Title: `[AIT USA Platform] Student portal UX shell and navigation`

Acceptance:

- Mobile-first dashboard IA includes attendance, enrolled courses, lesson recaps,
  video modules, placement result/history, payments/receipts if approved, AI
  study buddy entry, profile/settings, and support/contact.
- Define empty/loading/error states.
- Define what students can and cannot edit.

### AI Study Buddy

Title: `[AIT USA Platform] AI study buddy and speech-practice architecture`

Acceptance:

- Define MVP use cases: pronunciation, conversation practice, lesson recap Q&A,
  vocabulary drills, and confidence-building speaking reps.
- Define audio/speech flow and what is stored.
- Define privacy, consent, and retention rules for audio/transcripts.
- Define cost controls and abuse limits.
- Define teacher escalation and human review boundaries.
- Define provider/model decision gate before implementation.

### CRM Event Logging

Title: `[AIT USA Platform] Website and portal action logging to AIT CRM`

Acceptance:

- Define normalized event taxonomy for public-site and portal actions.
- Define idempotency, source attribution, consent, retries, and failure behavior.
- Define CRM timeline/task/reporting effects.
- Include placement, lead/contact, attendance, lesson, AI practice, payment, and
  profile events.

### Payment Portal

Title: `[AIT USA Platform] Payment portal and CRM ledger/receipt integration`

Acceptance:

- Decide public payment link vs student portal vs invoice link vs admin-generated
  payment request.
- Choose/compare provider path.
- Map payments to student, enrollment, invoice/account balance, and CRM ledger.
- Define partial-payment rules, receipts, refunds, failures, and reconciliation.
- No card capture until this is approved.

### Privacy And Retention

Title: `[AIT USA Platform] Student data privacy, consent, and retention policy`

Acceptance:

- Define what student data is collected and why.
- Define access controls for student, guardian, teacher, and admin roles.
- Define minor/guardian considerations.
- Define attendance, payment, lesson-progress, audio, and AI-transcript retention.
- Define export/delete policy and admin audit requirements.

## Extra Suggestions

- Add a teacher/admin content workflow before building a rich lesson library; the
  portal needs a way to publish recaps without developer edits.
- Plan notifications early: missed class, new recap, payment reminder, upcoming
  class, and placement follow-up.
- Keep attendance scanner POC simple first. A keyboard-wedge USB/Bluetooth
  scanner plus a locked check-in page is probably enough before custom hardware.
- Start AI study buddy as a constrained prototype tied to one lesson/module, not a
  wide-open chat surface.
- Treat CRM event logging as a shared platform dependency. If it is designed well,
  the public site, portal, payments, and attendance all become easier.

