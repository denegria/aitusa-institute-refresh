import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildAttendanceCrmSyncPreview,
  getAttendanceAuditHistory,
  getAttendanceSummary,
  getPortalAttendanceResponse,
} from "../src/attendance/attendanceModel.js";
import { resolvePortalSession } from "../src/portal/authBoundary.js";

describe("MIS-272 attendance model", () => {
  it("summarizes attendance entities for a student enrollment", () => {
    const summary = getAttendanceSummary("crm_contact_fixture_student_001");

    assert.equal(summary.found, true);
    assert.equal(summary.course.courseRef, "course_fixture_esl_101");
    assert.equal(summary.section.sectionRef, "section_fixture_english_101");
    assert.equal(summary.totals.scheduledSessions, 3);
    assert.equal(summary.totals.present, 1);
    assert.equal(summary.totals.absent, 1);
    assert.equal(summary.totals.excused, 1);
    assert.equal(summary.totals.corrections, 1);
    assert.equal(summary.totals.attendanceRate, 33);
  });

  it("keeps manual correction history in a portal-safe audit shape", () => {
    const audit = getAttendanceAuditHistory("crm_contact_fixture_student_001");

    assert.equal(audit.length, 1);
    assert.equal(audit[0].action, "manual_correction");
    assert.deepEqual(audit[0].before, { status: "absent" });
    assert.deepEqual(audit[0].after, { status: "excused" });
    assert.equal("actorPortalAccountId" in audit[0], false);
  });

  it("blocks attendance when the privacy gate is not satisfied", () => {
    const response = getPortalAttendanceResponse(
      "studentActive",
      "crm_contact_fixture_student_001",
    );

    assert.equal(response.status, 403);
    assert.equal(response.body.reason, "privacy_gate_required");
  });

  it("allows a guardian to view an authorized linked student summary", () => {
    const response = getPortalAttendanceResponse(
      "guardianActive",
      "crm_contact_fixture_minor_001",
    );

    assert.equal(response.status, 200);
    assert.equal(response.body.visibility, "guardian_summary");
    assert.equal(response.body.attendance.totals.late, 1);
    assert.equal(response.body.crmWrite, false);
  });

  it("denies unrelated student attendance", () => {
    const response = getPortalAttendanceResponse(
      "guardianActive",
      "crm_contact_fixture_unrelated_001",
    );

    assert.equal(response.status, 403);
    assert.equal(response.body.reason, "guardian_link_required");
  });

  it("builds a CRM-safe attendance event preview without writing to CRM", () => {
    const session = resolvePortalSession("guardianActive");
    const summary = getAttendanceSummary("crm_contact_fixture_minor_001");
    const preview = buildAttendanceCrmSyncPreview(summary, session);

    assert.equal(preview.accepted, true);
    assert.equal(preview.delivery.crmWrite, false);
    assert.equal(preview.crmTimelinePreview.eventType, "attendance_scan");
    assert.equal(preview.crmTimelinePreview.crmEffect, "timeline_entry_and_attendance");
  });
});
