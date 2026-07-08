# AIT USA Barcode Scanner Check-In POC

Date: 2026-07-08
Linear: MIS-273
Status: Docs/spec only

## Purpose

Plan a small physical barcode scanner proof of concept for student attendance
check-in.

The POC should prove the operational flow before any production attendance
deployment: scanner mode, student ID/barcode format, locked check-in station UX,
duplicate/late/wrong-class/offline handling, security rules, and how scans
become attendance events in CRM/portal state.

This document depends on the MIS-272 attendance model and does not approve
hardware purchase, production deployment, database schema, CRM writes, or portal
implementation.

## Recommended POC Direction

Start with a keyboard-wedge USB or Bluetooth barcode scanner.

Reason:

- Most barcode scanners can type scanned values into a focused input field.
- The first POC can test station UX and attendance rules without custom drivers.
- Staff can run it on an approved laptop/tablet at the front desk or classroom.
- It keeps the first experiment simple and reversible.

Avoid custom scanner SDKs, camera scanning, or custom hardware until the simple
station flow fails a real need.

## Scope

In scope:

- Hardware assumptions.
- Barcode/student ID format.
- Station UX and operator flow.
- Scan lifecycle and event mapping.
- Duplicate, late, wrong-class, unknown-student, offline, and failure handling.
- Security and privacy boundaries.
- POC validation criteria.

Out of scope until explicitly approved:

- Buying hardware.
- Building the check-in page.
- Storing raw barcode values.
- Live CRM writes.
- Student portal implementation.
- Production attendance rollout.
- Notifications or messaging sends.

## Hardware Assumptions

POC hardware:

- Keyboard-wedge USB scanner as default.
- Bluetooth scanner acceptable if reliable and paired to one station.
- Scanner sends a scanned code followed by Enter/Return.
- Scanner has no privileged network access.
- Station device is controlled by staff.

Station device:

- Laptop, tablet, or front-desk machine with browser access.
- Session authenticated as staff/admin or station mode.
- Screen visible enough for staff confirmation, not for exposing student PII.

## Barcode Format

Do not encode raw CRM IDs directly in student-visible barcodes.

Preferred format:

- Opaque student check-in token.
- Short enough to fit on card/phone display.
- Non-guessable.
- Rotatable/revocable.
- Maps server-side to CRM contact/enrollment.

Example shape:

`AIT-CHK-7F4K9Q2M`

Server-side lookup result:

- token hash;
- active/inactive/revoked;
- `crmContactId`;
- current eligible enrollments;
- student display confirmation;
- optional guardian/minor flags for staff handling.

Do not store raw scanned tokens in CRM event metadata. Store a hash or safe
lookup reference.

## Check-In Station UX

Recommended screen states:

- Ready to scan.
- Looking up student.
- Confirmed check-in.
- Already checked in.
- Late check-in.
- Wrong class/location.
- Unknown code.
- Needs staff review.
- Offline/pending sync.
- Session expired/locked.

Station should show:

- Student preferred/display name after lookup.
- Course/section/session match.
- Check-in result.
- Staff action button for review/manual override when allowed.

Station should not show:

- Full CRM timeline.
- Payment status.
- Private notes.
- Raw student PII beyond what is needed to confirm identity.
- Raw barcode token after scan.

## Scan Lifecycle

### 1. Station Ready

Requirements:

- Staff/admin or station session is authenticated.
- Active session/class context is selected.
- Scanner input is focused.
- Station has clear indication of selected location/session.

### 2. Scan Received

Browser receives the keyboard-wedge value and submits it to the approved backend.

Payload should include:

- scanned token value only in transit to backend;
- station ID;
- selected session ID;
- received timestamp;
- station user/session reference;
- source environment.

### 3. Backend Lookup

Backend validates:

- station authorization;
- token format;
- token active/revoked status;
- CRM contact/enrollment match;
- selected session eligibility;
- duplicate scan state;
- late threshold;
- rate limits.

### 4. Resolution

Possible results:

- `accepted_present`
- `accepted_late`
- `duplicate`
- `wrong_session`
- `wrong_location`
- `unknown_student`
- `inactive_or_revoked`
- `needs_review`
- `station_not_authorized`
- `offline_pending`

### 5. Attendance Event

Backend emits or queues MIS-277-compatible event:

- `attendance.scan.received`
- `attendance.check_in.recorded`
- `attendance.correction.requested` when staff review is needed

## Duplicate Handling

Duplicate scan rules:

- Same student/session within check-in window: show "already checked in".
- Do not create another attendance record.
- Log duplicate scan as audit metadata.
- If second scan occurs after late threshold, keep original accepted time unless
  staff overrides.
- If duplicate occurs in a different active session, route to review.

## Late Handling

Late rule should be configurable by course/section.

POC default:

- On time: scan before configured grace cutoff.
- Late: scan after grace cutoff but before session end.
- Needs review: scan after session end or before session starts too early.

Do not hard-code academic policy into scanner code without product approval.

## Wrong Class Or Location

If scanned student is enrolled but not expected in the selected session:

- show a neutral review state;
- do not expose unrelated enrollment details;
- allow staff to select a valid session only if authorized;
- record `wrong_session` or `needs_review` event;
- do not auto-move attendance across classes without staff confirmation.

## Unknown Or Revoked Code

If token is unknown, malformed, inactive, or revoked:

- show generic "needs staff help" message;
- do not reveal whether a student exists;
- log safe audit event;
- rate-limit repeated failures;
- provide staff manual lookup path only for authorized users.

## Offline And Failure Mode

The safest first POC is online-only.

If offline mode is required later:

- cache only minimal token hashes for currently expected class roster;
- encrypt local cache when available;
- expire cache quickly;
- queue scans with timestamps;
- show "pending sync" until backend confirms;
- detect duplicates locally and server-side;
- never cache broad CRM data or raw PII.

POC default:

- If backend is unavailable, station shows degraded state and asks staff to use
  approved manual attendance path.

## Security Rules

- Station session must be authenticated or use an approved limited station token.
- Station token must be scoped to location/session/time window.
- Raw scanned code is never logged to browser console or CRM timeline.
- Store token hash, not raw token, in events.
- Rate-limit failed scans.
- Do not allow public website visitors to submit scanner events.
- Manual override requires staff/admin role.
- Every accepted scan must have an audit trail.

## CRM Event Mapping

Use MIS-277 and MIS-272 event contracts.

Recommended event metadata:

- `stationId`
- `scannerMode`: `keyboard_wedge`
- `codeHash`
- `sessionId`
- `sectionId`
- `crmEnrollmentId` when resolved
- `crmContactId` when resolved
- `result`
- `receivedAt`
- `acceptedAt`
- `recordedBy`: `scanner`
- `needsReview`: boolean

Idempotency examples:

- `attendance.scan.received:{stationId}:{codeHash}:{receivedAtBucket}`
- `attendance.check_in.recorded:{sessionId}:{crmEnrollmentId}`

## Staff Manual Override

Manual override should be available only to authorized staff.

Override actions:

- Link scan to correct session.
- Mark present/late manually.
- Mark scan as duplicate.
- Void scan.
- Create correction request.

Every override requires:

- actor;
- timestamp;
- reason code;
- optional note;
- previous and new state.

## POC Validation Plan

Use fixture/student-test data first.

Test cases:

- Valid student, correct class, on-time.
- Valid student, correct class, late.
- Duplicate scan.
- Student in different class.
- Unknown barcode.
- Revoked/inactive barcode.
- Station not authorized for selected session.
- Backend unavailable.
- Manual override.
- Correction request.

Pass criteria:

- No raw barcode values are persisted in CRM/event metadata.
- Duplicate scan does not create duplicate attendance.
- Wrong class and unknown student do not leak private data.
- Staff can recover with manual review path.
- Event shape matches MIS-277.
- Attendance state maps to MIS-272.

## Dependencies

- MIS-272 defines attendance entities and status lifecycle.
- MIS-277 defines CRM event contract and idempotency.
- MIS-271 defines staff/admin authentication boundary.
- MIS-276 defines portal/admin station entry points.
- MIS-279 defines privacy, retention, raw scan handling, and audit rules.

## Open Decisions

- Barcode card vs phone display vs both.
- Token expiration/rotation policy.
- Whether scanner stations are tied to location, teacher, or class session.
- Late threshold by course/section.
- Whether station can select session manually or only from current schedule.
- Offline mode requirement.
- Staff override role requirements.
- Hardware model and operating system.

## Abort Conditions

Stop before implementation if:

- Scanner flow stores raw barcode values in CRM.
- Station can create attendance without staff/station authorization.
- Duplicate handling is not idempotent.
- Unknown scans leak student existence.
- Offline mode requires broad local CRM/PII storage.
- Manual override lacks audit trail.
- Attendance model from MIS-272 is not accepted.

## Acceptance Mapping

MIS-273 acceptance coverage:

- Scanner mode/hardware assumptions: keyboard-wedge USB/Bluetooth POC is
  defined.
- Barcode/student ID format: opaque rotatable token and hash handling are
  defined.
- Check-in station UX: screen states and station rules are defined.
- Duplicate/late/offline/error handling: each flow is defined.
- Security rules: station auth, token handling, rate limits, and audit rules are
  defined.
- Scan to CRM/portal state: MIS-272/MIS-277 event mapping is defined.

This spec is ready for review as a docs-only MIS-273 slice.
