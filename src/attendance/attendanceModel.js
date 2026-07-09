import {
  buildCrmEventResponse,
  toCrmTimelineSummary,
  validateCrmEventEnvelope,
} from "../crm/eventContract.js";
import {
  canAccessArea,
  canViewStudentReference,
  resolvePortalSession,
} from "../portal/authBoundary.js";
import { ATTENDANCE_FIXTURES } from "./attendanceFixtures.js";

const PRESENT_STATUSES = new Set(["present", "late"]);

export function getAttendanceSummary(
  studentCrmContactRef,
  fixtures = ATTENDANCE_FIXTURES,
) {
  const enrollment = fixtures.enrollments.find(
    (candidate) => candidate.studentCrmContactRef === studentCrmContactRef,
  );

  if (!enrollment) {
    return {
      found: false,
      reason: "enrollment_not_found",
    };
  }

  const section = fixtures.sections.find(
    (candidate) => candidate.sectionRef === enrollment.sectionRef,
  );
  const course = fixtures.courses.find(
    (candidate) => candidate.courseRef === section?.courseRef,
  );
  const sectionSessions = fixtures.sessions.filter(
    (session) => session.sectionRef === enrollment.sectionRef,
  );
  const records = fixtures.records.filter(
    (record) => record.enrollmentRef === enrollment.enrollmentRef,
  );
  const counts = countAttendance(records);
  const correctionCount = records.filter((record) => record.correction).length;

  return {
    found: true,
    studentCrmContactRef,
    enrollment: {
      enrollmentRef: enrollment.enrollmentRef,
      status: enrollment.status,
    },
    course: {
      courseRef: course?.courseRef ?? null,
      title: course?.title ?? "Unknown course",
      level: course?.level ?? null,
    },
    section: {
      sectionRef: section?.sectionRef ?? null,
      title: section?.title ?? "Unknown section",
    },
    totals: {
      scheduledSessions: sectionSessions.length,
      recordedSessions: records.length,
      present: counts.present,
      late: counts.late,
      absent: counts.absent,
      excused: counts.excused,
      corrections: correctionCount,
      attendanceRate: records.length === 0
        ? 0
        : Math.round(((counts.present + counts.late) / records.length) * 100),
    },
    records: records.map((record) => toPortalRecord(record, fixtures)),
    auditHistory: getAttendanceAuditHistory(studentCrmContactRef, fixtures),
  };
}

export function getPortalAttendanceResponse(
  accountKey,
  studentCrmContactRef,
  fixtures = ATTENDANCE_FIXTURES,
) {
  const session = resolvePortalSession(accountKey);
  const attendanceAccess = canAccessArea(session, "attendance");
  if (!attendanceAccess.allowed) {
    return denied(403, attendanceAccess.reason);
  }

  const studentAccess = canViewStudentReference(session, studentCrmContactRef);
  if (!studentAccess.allowed) {
    return denied(403, studentAccess.reason);
  }

  const summary = getAttendanceSummary(studentCrmContactRef, fixtures);
  if (!summary.found) {
    return denied(404, summary.reason);
  }

  return {
    status: 200,
    body: {
      ok: true,
      visibility: studentAccess.visibility,
      attendance: summary,
      crmSyncPreview: buildAttendanceCrmSyncPreview(summary, session),
      crmWrite: false,
    },
  };
}

export function buildAttendanceCrmSyncPreview(summary, session) {
  const latestRecord = [...summary.records].sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  )[0];

  if (!latestRecord) {
    return {
      accepted: false,
      reason: "no_attendance_records",
      crmWrite: false,
    };
  }

  const envelope = {
    type: "attendance_scan",
    idempotencyKey: `attendance:${latestRecord.attendanceRef}:${latestRecord.updatedAt}`,
    occurredAt: latestRecord.updatedAt,
    actor: {
      crmContactRef: summary.studentCrmContactRef,
      portalAccountId: session.account.portalAccountId,
      role: session.account.roles[0],
    },
    source: {
      surface: "portal",
      path: "/portal/attendance",
    },
    consent: {
      basis: "contract",
      policyVersion: "fixture-v1",
    },
    payload: {
      summary: `${summary.course.title}: ${latestRecord.status}`,
      courseRef: summary.course.courseRef,
      sectionRef: summary.section.sectionRef,
      sessionRef: latestRecord.sessionRef,
      attendanceRef: latestRecord.attendanceRef,
      attendanceStatus: latestRecord.status,
      correctionApplied: Boolean(latestRecord.correction),
    },
  };

  const response = buildCrmEventResponse(envelope);
  if (!response.body.accepted) return response.body;

  const validation = validateCrmEventEnvelope(envelope);
  return {
    ...response.body,
    crmTimelinePreview: toCrmTimelineSummary(validation.event),
  };
}

export function getAttendanceAuditHistory(
  studentCrmContactRef,
  fixtures = ATTENDANCE_FIXTURES,
) {
  const studentRecordRefs = new Set(
    fixtures.records
      .filter((record) => record.studentCrmContactRef === studentCrmContactRef)
      .map((record) => record.attendanceRef),
  );

  return fixtures.auditEntries
    .filter((entry) => studentRecordRefs.has(entry.attendanceRef))
    .map((entry) => ({
      auditRef: entry.auditRef,
      attendanceRef: entry.attendanceRef,
      action: entry.action,
      occurredAt: entry.occurredAt,
      reason: entry.reason,
      before: entry.before,
      after: entry.after,
    }));
}

function countAttendance(records) {
  return records.reduce(
    (counts, record) => ({
      ...counts,
      [record.status]: (counts[record.status] ?? 0) + 1,
    }),
    { present: 0, late: 0, absent: 0, excused: 0 },
  );
}

function toPortalRecord(record, fixtures) {
  const session = fixtures.sessions.find(
    (candidate) => candidate.sessionRef === record.sessionRef,
  );

  return {
    attendanceRef: record.attendanceRef,
    sessionRef: record.sessionRef,
    startsAt: session?.startsAt ?? null,
    status: record.status,
    isPresent: PRESENT_STATUSES.has(record.status),
    checkIn: record.checkIn
      ? {
          method: record.checkIn.method,
          checkedInAt: record.checkIn.checkedInAt,
        }
      : null,
    absence: record.absence
      ? {
          reasonCode: record.absence.reasonCode,
          reportedAt: record.absence.reportedAt,
        }
      : null,
    correction: record.correction
      ? {
          fromStatus: record.correction.fromStatus,
          toStatus: record.correction.toStatus,
          reason: record.correction.reason,
          correctedAt: record.correction.correctedAt,
        }
      : null,
    updatedAt: record.updatedAt,
  };
}

function denied(status, reason) {
  return {
    status,
    body: {
      ok: false,
      reason,
      crmWrite: false,
    },
  };
}
