# Attendance model and CRM sync contract

Linear issue: MIS-272

This slice adds a fixture-backed attendance model and read-only API boundary for
the student portal. It prepares the domain and CRM sync shape without durable
storage, live check-in devices, or outbound CRM writes.

## Entities

- Student: represented by `studentCrmContactRef`.
- Course: learning product such as ESL 101.
- Section: scheduled course instance with instructor assignment.
- Enrollment: student-to-section relationship.
- Session: individual class meeting.
- Attendance record: present, late, absent, or excused record for one session.
- Absence: reason metadata for missed sessions.
- Correction: manual status change with reason and timestamp.
- Audit entry: immutable correction history for admin/reporting review.

## Portal visibility

Attendance is treated as a sensitive portal area. The route uses the MIS-271
auth boundary and requires:

- authenticated fixture account;
- privacy gate satisfied;
- authorized student reference visibility.

The current default student fixture remains blocked by the privacy gate. The
guardian fixture can view the linked minor's summary.

## API boundary

Route: `/api/portal/attendance`

Supported fixture query parameters:

- `accountKey`
- `studentCrmContactRef`

The response includes a portal-safe attendance summary, audit history, and a
CRM sync preview. It never writes to AIT CRM.

## CRM sync

The CRM preview uses the MIS-277 event contract with event type
`attendance_scan`. The preview includes safe timeline metadata only:

- student CRM contact reference;
- course/section/session references;
- attendance status;
- correction flag;
- source path.

Future implementation should attach this model to a durable outbox,
idempotency store, retry behavior, admin correction UI, and approved AIT CRM API
adapter after the CRM contract is approved.
