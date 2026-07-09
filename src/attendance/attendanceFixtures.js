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
      locationRef: "location_bound_brook",
      lateGraceMinutes: 10,
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
  checkInStations: Object.freeze([
    Object.freeze({
      stationRef: "station_bound_brook_front_desk",
      label: "Bound Brook front desk",
      locationRef: "location_bound_brook",
      mode: "keyboard_wedge",
      active: true,
      allowedSectionRefs: Object.freeze(["section_fixture_english_101"]),
    }),
  ]),
  checkInTokens: Object.freeze([
    Object.freeze({
      tokenRef: "token_fixture_student_001",
      tokenHash:
        "2ef2718b099402abf36f5335b49bcde0f8df8c7740ce42fe49449cee012465b9",
      studentCrmContactRef: "crm_contact_fixture_student_001",
      enrollmentRef: "enrollment_fixture_student_001",
      status: "active",
      issuedAt: "2026-06-20T14:00:00.000Z",
    }),
    Object.freeze({
      tokenRef: "token_fixture_minor_001",
      tokenHash:
        "4f73350cf28146fcdb4f44f6d01bf62da4e6cdfd740cd7af190defe4e8d59ad7",
      studentCrmContactRef: "crm_contact_fixture_minor_001",
      enrollmentRef: "enrollment_fixture_minor_001",
      status: "active",
      issuedAt: "2026-06-20T14:00:00.000Z",
    }),
    Object.freeze({
      tokenRef: "token_fixture_revoked_001",
      tokenHash:
        "c4dd1c5c941e7827b66469943e8292fa0fbd3602f9f95644a2a91e294cf1506f",
      studentCrmContactRef: "crm_contact_fixture_student_001",
      enrollmentRef: "enrollment_fixture_student_001",
      status: "revoked",
      issuedAt: "2026-06-01T14:00:00.000Z",
      revokedAt: "2026-07-01T14:00:00.000Z",
    }),
  ]),
});
