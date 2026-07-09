export const ATTENDANCE_FIXTURES = Object.freeze({
  courses: Object.freeze([
    Object.freeze({
      courseRef: "course_fixture_esl_101",
      title: "Ingles ESL para jovenes y adultos",
      level: "A2",
    }),
  ]),
  sections: Object.freeze([
    Object.freeze({
      sectionRef: "section_fixture_english_101",
      courseRef: "course_fixture_esl_101",
      title: "ESL 101 - Weekday Evening",
      instructorPortalAccountId: "acct_fixture_teacher_active",
    }),
  ]),
  enrollments: Object.freeze([
    Object.freeze({
      enrollmentRef: "enrollment_fixture_student_001",
      studentCrmContactRef: "crm_contact_fixture_student_001",
      sectionRef: "section_fixture_english_101",
      status: "active",
    }),
    Object.freeze({
      enrollmentRef: "enrollment_fixture_minor_001",
      studentCrmContactRef: "crm_contact_fixture_minor_001",
      sectionRef: "section_fixture_english_101",
      status: "active",
    }),
  ]),
  sessions: Object.freeze([
    Object.freeze({
      sessionRef: "session_fixture_english_101_001",
      sectionRef: "section_fixture_english_101",
      startsAt: "2026-07-01T22:00:00.000Z",
      endsAt: "2026-07-02T00:00:00.000Z",
      deliveryMode: "in_person",
    }),
    Object.freeze({
      sessionRef: "session_fixture_english_101_002",
      sectionRef: "section_fixture_english_101",
      startsAt: "2026-07-03T22:00:00.000Z",
      endsAt: "2026-07-04T00:00:00.000Z",
      deliveryMode: "in_person",
    }),
    Object.freeze({
      sessionRef: "session_fixture_english_101_003",
      sectionRef: "section_fixture_english_101",
      startsAt: "2026-07-08T22:00:00.000Z",
      endsAt: "2026-07-09T00:00:00.000Z",
      deliveryMode: "in_person",
    }),
  ]),
  records: Object.freeze([
    Object.freeze({
      attendanceRef: "attendance_fixture_student_001_001",
      enrollmentRef: "enrollment_fixture_student_001",
      sessionRef: "session_fixture_english_101_001",
      studentCrmContactRef: "crm_contact_fixture_student_001",
      status: "present",
      checkIn: Object.freeze({
        method: "front_desk",
        checkedInAt: "2026-07-01T21:55:00.000Z",
        recordedByPortalAccountId: "acct_fixture_teacher_active",
      }),
      updatedAt: "2026-07-01T21:55:00.000Z",
    }),
    Object.freeze({
      attendanceRef: "attendance_fixture_student_001_002",
      enrollmentRef: "enrollment_fixture_student_001",
      sessionRef: "session_fixture_english_101_002",
      studentCrmContactRef: "crm_contact_fixture_student_001",
      status: "absent",
      absence: Object.freeze({
        reasonCode: "no_show",
        reportedAt: "2026-07-03T22:15:00.000Z",
      }),
      updatedAt: "2026-07-03T22:15:00.000Z",
    }),
    Object.freeze({
      attendanceRef: "attendance_fixture_student_001_003",
      enrollmentRef: "enrollment_fixture_student_001",
      sessionRef: "session_fixture_english_101_003",
      studentCrmContactRef: "crm_contact_fixture_student_001",
      status: "excused",
      absence: Object.freeze({
        reasonCode: "family_emergency",
        reportedAt: "2026-07-08T21:20:00.000Z",
      }),
      correction: Object.freeze({
        fromStatus: "absent",
        toStatus: "excused",
        reason: "Advisor confirmed absence note.",
        correctedAt: "2026-07-08T23:30:00.000Z",
        correctedByPortalAccountId: "acct_fixture_admin_active",
      }),
      updatedAt: "2026-07-08T23:30:00.000Z",
    }),
    Object.freeze({
      attendanceRef: "attendance_fixture_minor_001_001",
      enrollmentRef: "enrollment_fixture_minor_001",
      sessionRef: "session_fixture_english_101_001",
      studentCrmContactRef: "crm_contact_fixture_minor_001",
      status: "late",
      checkIn: Object.freeze({
        method: "front_desk",
        checkedInAt: "2026-07-01T22:12:00.000Z",
        recordedByPortalAccountId: "acct_fixture_teacher_active",
      }),
      updatedAt: "2026-07-01T22:12:00.000Z",
    }),
  ]),
  auditEntries: Object.freeze([
    Object.freeze({
      auditRef: "audit_fixture_student_001_003",
      attendanceRef: "attendance_fixture_student_001_003",
      action: "manual_correction",
      actorPortalAccountId: "acct_fixture_admin_active",
      occurredAt: "2026-07-08T23:30:00.000Z",
      reason: "Advisor confirmed absence note.",
      before: Object.freeze({ status: "absent" }),
      after: Object.freeze({ status: "excused" }),
    }),
  ]),
});
