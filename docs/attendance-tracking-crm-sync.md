# AIT USA Attendance Tracking Model And CRM Sync

Date: 2026-07-08
Linear: MIS-272
Status: Docs/spec only

## Purpose

Define the student attendance model for AIT USA course sessions/classes and how
attendance should sync with AIT CRM and the future student portal.

This document does not approve implementation. It gives future builders a
bounded contract for attendance entities, check-ins, absences, corrections,
manual admin edits, reporting views, CRM sync, audit history, and student-facing
summaries.

## Scope

In scope:

- Attendance entities and relationships.
- Session/check-in/absence/correction lifecycle.
- Manual admin edit model.
- CRM sync and event/API contract expectations.
- Student, guardian, teacher, and admin views.
- Audit history and reporting needs.
- Dependencies and abort conditions.

Out of scope until explicitly approved:

- Database schema, migrations, or production data writes.
- Barcode scanner station implementation.
- Live CRM writes.
- Student portal UI implementation.
- Notifications, SMS, email, or WhatsApp sends.
- Payment, grades, AI practice, or lesson progress implementation.

## Source Of Truth

AIT CRM should own the durable attendance record and reporting history.

The portal may show student-facing summaries after:

- MIS-271 verifies account-to-CRM identity links;
- MIS-277 approves CRM event/API contract behavior;
- MIS-279 approves privacy, retention, minor/guardian, and audit rules;
- this MIS-272 model is accepted.

The portal should not become an alternate attendance ledger.

## Core Entities

### Student

CRM-owned person record.

Key references:

- `crmContactId`
- `portalAccountId` when linked
- guardian links when applicable

### Enrollment

CRM-owned relationship between a student and an offering/course/section.

Key references:

- `crmEnrollmentId`
- `crmContactId`
- `courseId`
- `sectionId`
- enrollment status
- access start/end dates

### Course

Program/offering identity such as English in-person, GED, computing, or another
approved class group.

Key references:

- `courseId`
- course title
- modality
- location or online/hybrid state

### Section

Specific class group/cohort tied to schedule, teacher, and location.

Key references:

- `sectionId`
- `courseId`
- location
- schedule pattern
- teacher/staff assignment

### Class Session

One scheduled class occurrence.

Suggested fields:

- `sessionId`
- `sectionId`
- `startsAt`
- `endsAt`
- `locationId`
- `teacherId`
- `sessionStatus`: `scheduled`, `in_progress`, `completed`, `canceled`
- `createdFrom`: `schedule`, `manual`, `makeup`, `import`

### Attendance Record

Durable attendance result for one enrollment and one class session.

Suggested fields:

- `attendanceRecordId`
- `sessionId`
- `crmEnrollmentId`
- `crmContactId`
- `status`: `present`, `late`, `absent`, `excused`, `pending`, `canceled`
- `checkInId`
- `recordedBy`: `scanner`, `teacher`, `admin`, `system`
- `recordedAt`
- `sourceEventId`
- `lastCorrectedAt`

### Check-In

Raw or normalized event that may create or update an attendance record.

Suggested fields:

- `checkInId`
- `sessionId`
- `crmEnrollmentId`
- `crmContactId`
- `checkInMethod`: `barcode`, `manual`, `teacher_roster`, `admin`
- `scannedCodeHash` when barcode is used
- `receivedAt`
- `acceptedAt`
- `result`: `accepted`, `duplicate`, `late`, `wrong_session`, `unknown_student`,
  `needs_review`, `rejected`
- `sourceEventId`

### Absence

Attendance record or supporting note for a missed class.

Suggested fields:

- `attendanceRecordId`
- `absenceReason`: `unknown`, `student_notice`, `staff_excused`, `sick`,
  `schedule_conflict`, `weather`, `other`
- `excusedBy`
- `excusedAt`
- `studentVisibleNote`

### Correction

Audit entry for a staff-reviewed attendance change.

Suggested fields:

- `correctionId`
- `attendanceRecordId`
- `previousStatus`
- `newStatus`
- `requestedBy`: `student`, `guardian`, `teacher`, `admin`, `system`
- `approvedBy`
- `reasonCode`
- `reasonNote`
- `requestedAt`
- `approvedAt`
- `sourceEventId`

## Attendance Lifecycle

### 1. Session Scheduled

A class session exists or is generated from the approved schedule.

Requirements:

- Link to section/course/location.
- Identify expected enrollments.
- Avoid exposing unscheduled/internal drafts to students.

### 2. Check-In Received

Check-in may come from:

- barcode scanner POC after MIS-273;
- teacher roster action;
- admin manual entry;
- approved import.

The check-in event should create an audit trail before it changes attendance
state.

### 3. Check-In Resolved

Resolution rules:

- Valid on-time scan: `present`.
- Valid late scan: `late`.
- Duplicate scan: no duplicate attendance record; log duplicate audit event.
- Wrong session/location: `needs_review` or rejected based on policy.
- Unknown code/student: `needs_review`; do not create a false student link.
- Canceled session: do not create normal attendance records.

### 4. Absence Recorded

After a session window closes, expected enrollments with no accepted check-in may
be marked absent or pending review.

Default:

- Use `pending` if the source data is incomplete.
- Use `absent` only when schedule/enrollment/session state is reliable.

### 5. Correction Requested

Students/guardians may request review from the portal. Teachers/admins may also
flag issues.

Students and guardians cannot directly edit attendance status.

### 6. Correction Approved

Staff approves or rejects the correction.

Requirements:

- Store previous and new value.
- Store reason and approving actor.
- Emit CRM event after MIS-277.
- Update student-facing summary after the durable CRM record changes.

## Manual Admin Edits

Manual edits are allowed for operational reality, but every edit needs an audit
trail.

Required admin edit capabilities:

- Mark present/late/absent/excused.
- Attach reason code and note.
- Correct wrong session/student link.
- Void duplicate or bad check-ins.
- Add makeup session attendance.
- Reopen a completed session only with audit reason.

Forbidden shortcuts:

- Editing attendance without actor/reason/time.
- Deleting records without tombstone/audit trail.
- Backdating without original and edit timestamps.
- Letting students directly change attendance state.

## Portal Display Rules

Student view after approval:

- Overall attendance summary.
- Recent sessions.
- Per-session state: present, late, absent, excused, pending, canceled.
- Correction/request status.
- Support path for disputes.

Guardian view:

- Same as student when guardian link and consent allow it.
- No raw staff-only notes by default.

Teacher view:

- Assigned section/session roster.
- Session attendance summary.
- Students needing review.
- No payment, full CRM timeline, or unrelated classes.

Admin view:

- Attendance records needing review.
- Check-in anomalies.
- Correction queue.
- Audit trail.
- Sync status with CRM.

## CRM Sync Contract

Attendance should use the MIS-277 event contract.

Recommended event types:

- `attendance.session.scheduled`
- `attendance.scan.received`
- `attendance.check_in.recorded`
- `attendance.absence.recorded`
- `attendance.correction.requested`
- `attendance.correction.approved`
- `attendance.correction.rejected`
- `attendance.record.voided`

Minimum attendance event metadata:

- `sessionId`
- `sectionId`
- `courseId`
- `crmEnrollmentId`
- `crmContactId`
- `attendanceRecordId` when available
- `status`
- `checkInMethod`
- `recordedBy`
- `reasonCode` when relevant
- `studentVisible`: boolean

Idempotency examples:

- `attendance.check_in.recorded:{sessionId}:{crmEnrollmentId}`
- `attendance.scan.received:{scannerId}:{codeHash}:{receivedAtBucket}`
- `attendance.correction.approved:{correctionId}`

## Reporting Views

CRM/admin reporting should support:

- Attendance by student.
- Attendance by course/section.
- Attendance by date range.
- Absence/late patterns.
- Correction volume.
- Scanner/manual source mix.
- Students at risk due to attendance.
- Session roster completion.

Student portal reporting should be simpler:

- Overall attendance summary.
- Recent attendance history.
- Pending review indicators.
- Advisor/support CTA.

## Privacy And Retention

MIS-279 must define:

- attendance retention duration;
- minor/guardian visibility rules;
- export/delete behavior;
- audit-log retention;
- whether raw scan events are retained after normalization;
- who can view reason notes;
- whether location/time details are sensitive in student view.

Default posture:

- Keep audit history staff-visible.
- Keep student-visible summaries minimal and understandable.
- Do not expose raw barcode values.
- Hash scanner codes in event metadata.

## Failure And Degraded Modes

Examples:

- CRM sync fails: queue/retry and show admin sync warning.
- Scanner offline: use MIS-273 offline flow; mark events pending.
- Session schedule missing: check-in goes to review queue.
- Enrollment mismatch: do not auto-link to a different student.
- Duplicate scan: show already checked in at station; log duplicate audit event.
- Portal unavailable: staff can still record attendance through approved admin
  path.

## Dependencies

- MIS-271: verified portal account and CRM identity link.
- MIS-276: portal IA for attendance views and support states.
- MIS-277: shared CRM event/API contract.
- MIS-273: scanner-specific check-in POC.
- MIS-279: privacy, retention, minor/guardian, and audit policy.

## Open Decisions

- Attendance status labels and whether to show percentage or plain-language
  summaries to students.
- Late threshold by course/session.
- Excused absence policy.
- Who can approve corrections.
- Whether teachers can finalize attendance or only submit for admin review.
- Session generation source.
- Offline scanner tolerance and retry window.
- CRM API endpoint shape for attendance records.
- Whether student-facing notes are allowed.

## Abort Conditions

Stop before implementation if:

- Attendance data would be stored before MIS-279 approval.
- Student identity cannot be linked to CRM enrollment reliably.
- Corrections can overwrite history without audit.
- Scanner flow requires raw barcode values to be stored in CRM.
- The portal becomes the durable attendance ledger instead of CRM.
- Teacher/admin role boundaries are not separated.

## Acceptance Mapping

MIS-272 acceptance coverage:

- Attendance entities: student, enrollment, course, session, check-in, absence,
  correction, and audit history are defined.
- Manual admin edits: allowed capabilities and forbidden shortcuts are defined.
- Reporting views: CRM/admin and student summaries are defined.
- CRM sync/API contract: event types, metadata, and idempotency are defined.
- Student portal/CRM appearance: role-specific display rules are defined.

This spec is ready for review as a docs-only MIS-272 slice.
