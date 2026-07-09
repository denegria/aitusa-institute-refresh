import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CHECK_IN_SCANNER_POC,
  getScannerStationResponse,
  hashScannedCode,
  previewScannerCheckIn,
} from "../src/attendance/checkInModel.js";

describe("MIS-273 scanner check-in model", () => {
  it("documents keyboard-wedge scanner assumptions and hashed token storage", () => {
    assert.equal(CHECK_IN_SCANNER_POC.scannerMode, "keyboard_wedge");
    assert.equal(CHECK_IN_SCANNER_POC.tokenStorage, "sha256_hash_only");
    assert.equal(
      hashScannedCode(" ait-chk-7f4k9q2m "),
      "2ef2718b099402abf36f5335b49bcde0f8df8c7740ce42fe49449cee012465b9",
    );
  });

  it("returns station context for a teacher-controlled check-in station", () => {
    const response = getScannerStationResponse(
      "teacherActive",
      "station_bound_brook_front_desk",
      "session_fixture_english_101_003",
    );

    assert.equal(response.status, 200);
    assert.equal(response.body.station.mode, "keyboard_wedge");
    assert.equal(response.body.session.sectionRef, "section_fixture_english_101");
    assert.equal(response.body.crmWrite, false);
  });

  it("accepts an on-time scan without writing to CRM", () => {
    const response = previewScannerCheckIn({
      accountKey: "teacherActive",
      stationRef: "station_bound_brook_front_desk",
      sessionRef: "session_fixture_english_101_003",
      scannedValue: "AIT-CHK-7F4K9Q2M",
      scannedAt: "2026-07-08T21:58:00.000Z",
    });

    assert.equal(response.status, 202);
    assert.equal(response.body.result, "accepted_present");
    assert.equal(response.body.student.studentCrmContactRef, "crm_contact_fixture_student_001");
    assert.equal(response.body.crmWrite, false);
    assert.equal(response.body.crmSyncPreview.accepted, true);
    assert.equal(response.body.crmSyncPreview.event.payload.tokenHash.includes("AIT-CHK"), false);
  });

  it("classifies a scan after the grace window as late", () => {
    const response = previewScannerCheckIn({
      accountKey: "teacherActive",
      stationRef: "station_bound_brook_front_desk",
      sessionRef: "session_fixture_english_101_003",
      scannedValue: "AIT-CHK-7F4K9Q2M",
      scannedAt: "2026-07-08T22:15:00.000Z",
    });

    assert.equal(response.status, 202);
    assert.equal(response.body.result, "accepted_late");
    assert.equal(response.body.timing.reason, "after_grace_before_session_end");
  });

  it("returns duplicate when the student already has a check-in for the session", () => {
    const response = previewScannerCheckIn({
      accountKey: "teacherActive",
      stationRef: "station_bound_brook_front_desk",
      sessionRef: "session_fixture_english_101_001",
      scannedValue: "AIT-CHK-MN8R2K4P",
      scannedAt: "2026-07-01T22:20:00.000Z",
    });

    assert.equal(response.status, 200);
    assert.equal(response.body.result, "duplicate");
    assert.equal(response.body.duplicateAttendanceRef, "attendance_fixture_minor_001_001");
  });

  it("blocks student accounts from acting as scanner stations", () => {
    const response = previewScannerCheckIn({
      accountKey: "guardianActive",
      stationRef: "station_bound_brook_front_desk",
      sessionRef: "session_fixture_english_101_003",
      scannedValue: "AIT-CHK-7F4K9Q2M",
      scannedAt: "2026-07-08T21:58:00.000Z",
    });

    assert.equal(response.status, 403);
    assert.equal(response.body.reason, "station_role_required");
  });

  it("does not reveal whether malformed or revoked scanner values belong to students", () => {
    const malformed = previewScannerCheckIn({
      accountKey: "teacherActive",
      stationRef: "station_bound_brook_front_desk",
      sessionRef: "session_fixture_english_101_003",
      scannedValue: "bad-code",
      scannedAt: "2026-07-08T21:58:00.000Z",
    });
    const revoked = previewScannerCheckIn({
      accountKey: "teacherActive",
      stationRef: "station_bound_brook_front_desk",
      sessionRef: "session_fixture_english_101_003",
      scannedValue: "AIT-CHK-REVOKE01",
      scannedAt: "2026-07-08T21:58:00.000Z",
    });

    assert.equal(malformed.body.student, null);
    assert.equal(malformed.body.result, "unknown_student");
    assert.equal(revoked.body.result, "inactive_or_revoked");
    assert.equal(revoked.body.crmSyncPreview.delivery.crmWrite, false);
  });
});
