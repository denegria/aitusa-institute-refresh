import { createHash } from "node:crypto";
import {
  buildCrmEventResponse,
  toCrmTimelineSummary,
  validateCrmEventEnvelope,
} from "../crm/eventContract.js";
import { resolvePortalSession } from "../portal/authBoundary.js";
import { ATTENDANCE_FIXTURES } from "./attendanceFixtures.js";

export const CHECK_IN_SCANNER_POC = Object.freeze({
  scannerMode: "keyboard_wedge",
  barcodeFormat: "AIT-CHK-[A-Z0-9]{8}",
  tokenStorage: "sha256_hash_only",
  defaultLateGraceMinutes: 10,
  defaultEarlyWindowMinutes: 45,
  offlineMode: "not_supported_for_poc",
});

const BARCODE_PATTERN = /^AIT-CHK-[A-Z0-9]{8}$/;
const STATION_ROLES = new Set(["admin", "teacher"]);

export function hashScannedCode(scannedValue) {
  return createHash("sha256")
    .update(normalizeScannedValue(scannedValue))
    .digest("hex");
}

export function normalizeScannedValue(scannedValue) {
  return String(scannedValue ?? "").trim().toUpperCase();
}

export function getCheckInStationContext(
  accountKey,
  stationRef,
  sessionRef,
  fixtures = ATTENDANCE_FIXTURES,
) {
  const session = resolvePortalSession(accountKey);
  if (session.state !== "authenticated") {
    return denied(401, session.reason ?? "not_authenticated");
  }

  if (!session.account.roles.some((role) => STATION_ROLES.has(role))) {
    return denied(403, "station_role_required");
  }

  const station = fixtures.checkInStations.find(
    (candidate) => candidate.stationRef === stationRef,
  );
  if (!station?.active) {
    return denied(404, "station_not_configured");
  }

  const classSession = fixtures.sessions.find(
    (candidate) => candidate.sessionRef === sessionRef,
  );
  if (!classSession) {
    return denied(404, "class_session_not_found");
  }

  const section = fixtures.sections.find(
    (candidate) => candidate.sectionRef === classSession.sectionRef,
  );
  if (!section) {
    return denied(404, "section_not_found");
  }

  if (
    !station.allowedSectionRefs.includes(section.sectionRef) ||
    station.locationRef !== section.locationRef
  ) {
    return denied(403, "station_session_not_allowed");
  }

  return {
    ok: true,
    session,
    station: toSafeStation(station),
    classSession,
    section,
  };
}

export function previewScannerCheckIn(input, fixtures = ATTENDANCE_FIXTURES) {
  const stationContext = getCheckInStationContext(
    input.accountKey,
    input.stationRef,
    input.sessionRef,
    fixtures,
  );
  if (!stationContext.ok) return stationContext;

  const scannedValue = normalizeScannedValue(input.scannedValue);
  if (!BARCODE_PATTERN.test(scannedValue)) {
    return scanResult({
      status: 422,
      result: "unknown_student",
      reason: "barcode_format_invalid",
      stationContext,
      scannedAt: input.scannedAt,
    });
  }

  const tokenHash = hashScannedCode(scannedValue);
  const token = fixtures.checkInTokens.find(
    (candidate) => candidate.tokenHash === tokenHash,
  );
  if (!token) {
    return scanResult({
      status: 404,
      result: "unknown_student",
      reason: "token_not_found",
      stationContext,
      tokenHash,
      scannedAt: input.scannedAt,
    });
  }

  if (token.status !== "active") {
    return scanResult({
      status: 403,
      result: "inactive_or_revoked",
      reason: `token_${token.status}`,
      stationContext,
      tokenHash,
      token,
      scannedAt: input.scannedAt,
    });
  }

  const enrollment = fixtures.enrollments.find(
    (candidate) => candidate.enrollmentRef === token.enrollmentRef,
  );
  if (!enrollment || enrollment.status !== "active") {
    return scanResult({
      status: 409,
      result: "needs_review",
      reason: "active_enrollment_not_found",
      stationContext,
      tokenHash,
      token,
      scannedAt: input.scannedAt,
    });
  }

  if (enrollment.sectionRef !== stationContext.section.sectionRef) {
    return scanResult({
      status: 409,
      result: "wrong_session",
      reason: "student_not_enrolled_in_selected_session",
      stationContext,
      tokenHash,
      token,
      enrollment,
      scannedAt: input.scannedAt,
    });
  }

  const existingRecord = fixtures.records.find(
    (record) =>
      record.enrollmentRef === enrollment.enrollmentRef &&
      record.sessionRef === stationContext.classSession.sessionRef &&
      record.checkIn,
  );
  if (existingRecord) {
    return scanResult({
      status: 200,
      result: "duplicate",
      reason: "already_checked_in",
      stationContext,
      tokenHash,
      token,
      enrollment,
      existingRecord,
      scannedAt: input.scannedAt,
    });
  }

  const timing = classifyScanTiming(
    input.scannedAt,
    stationContext.classSession,
    stationContext.section,
  );
  const result =
    timing.state === "on_time"
      ? "accepted_present"
      : timing.state === "late"
        ? "accepted_late"
        : "needs_review";

  return scanResult({
    status: result === "needs_review" ? 409 : 202,
    result,
    reason: timing.reason,
    stationContext,
    tokenHash,
    token,
    enrollment,
    timing,
    scannedAt: input.scannedAt,
  });
}

export function getScannerStationResponse(
  accountKey,
  stationRef,
  sessionRef,
  fixtures = ATTENDANCE_FIXTURES,
) {
  const stationContext = getCheckInStationContext(
    accountKey,
    stationRef,
    sessionRef,
    fixtures,
  );
  if (!stationContext.ok) return stationContext;

  return {
    status: 200,
    body: {
      ok: true,
      station: stationContext.station,
      scanner: CHECK_IN_SCANNER_POC,
      session: {
        sessionRef: stationContext.classSession.sessionRef,
        startsAt: stationContext.classSession.startsAt,
        endsAt: stationContext.classSession.endsAt,
        sectionRef: stationContext.section.sectionRef,
        sectionTitle: stationContext.section.title,
      },
      crmWrite: false,
    },
  };
}

export function buildCheckInCrmPreview(scan, stationContext) {
  const safeStatus = scan.result ?? "needs_review";
  const envelope = {
    type: "attendance_scan",
    idempotencyKey: `scanner:${stationContext.station.stationRef}:${stationContext.classSession.sessionRef}:${scan.tokenHash ?? scan.result}:${scan.scannedAt}`,
    occurredAt: scan.scannedAt,
    actor: {
      crmContactRef: scan.token?.studentCrmContactRef,
      portalAccountId: stationContext.session.account.portalAccountId,
      role: stationContext.session.account.roles[0],
    },
    source: {
      surface: "staff_tool",
      path: "/api/portal/check-in",
    },
    consent: {
      basis: "contract",
      policyVersion: "fixture-v1",
    },
    payload: {
      summary: `Scanner check-in ${safeStatus}`,
      scannerMode: CHECK_IN_SCANNER_POC.scannerMode,
      stationRef: stationContext.station.stationRef,
      sessionRef: stationContext.classSession.sessionRef,
      sectionRef: stationContext.section.sectionRef,
      tokenHash: scan.tokenHash,
      result: safeStatus,
      reason: scan.reason,
      attendanceStatus: resultToAttendanceStatus(safeStatus),
      duplicateAttendanceRef: scan.existingRecord?.attendanceRef,
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

function scanResult({
  status,
  result,
  reason,
  stationContext,
  tokenHash = null,
  token = null,
  enrollment = null,
  existingRecord = null,
  timing = null,
  scannedAt,
}) {
  const occurredAt = scannedAt ?? new Date().toISOString();
  const scan = {
    result,
    reason,
    tokenHash,
    token,
    enrollment,
    existingRecord,
    timing,
    scannedAt: occurredAt,
  };

  const crmSyncPreview = buildCheckInCrmPreview(scan, stationContext);

  return {
    status,
    body: {
      ok: status >= 200 && status < 300,
      result,
      reason,
      station: stationContext.station,
      session: {
        sessionRef: stationContext.classSession.sessionRef,
        sectionRef: stationContext.section.sectionRef,
      },
      student: token
        ? {
            studentCrmContactRef: token.studentCrmContactRef,
            enrollmentRef: enrollment?.enrollmentRef ?? token.enrollmentRef,
          }
        : null,
      timing,
      duplicateAttendanceRef: existingRecord?.attendanceRef ?? null,
      crmSyncPreview,
      crmWrite: false,
    },
  };
}

function classifyScanTiming(scannedAt, classSession, section) {
  const scanTime = new Date(scannedAt ?? new Date().toISOString()).getTime();
  const startsAt = new Date(classSession.startsAt).getTime();
  const endsAt = new Date(classSession.endsAt).getTime();
  const earlyWindowMs = CHECK_IN_SCANNER_POC.defaultEarlyWindowMinutes * 60 * 1000;
  const lateGraceMinutes =
    section.lateGraceMinutes ?? CHECK_IN_SCANNER_POC.defaultLateGraceMinutes;
  const lateCutoff = startsAt + lateGraceMinutes * 60 * 1000;

  if (scanTime < startsAt - earlyWindowMs) {
    return { state: "needs_review", reason: "too_early_for_session" };
  }

  if (scanTime <= lateCutoff) {
    return { state: "on_time", reason: "within_grace_window" };
  }

  if (scanTime <= endsAt) {
    return { state: "late", reason: "after_grace_before_session_end" };
  }

  return { state: "needs_review", reason: "after_session_end" };
}

function resultToAttendanceStatus(result) {
  if (result === "accepted_present") return "present";
  if (result === "accepted_late") return "late";
  return "review";
}

function toSafeStation(station) {
  return {
    stationRef: station.stationRef,
    label: station.label,
    locationRef: station.locationRef,
    mode: station.mode,
  };
}

function denied(status, reason) {
  return {
    ok: false,
    status,
    body: {
      ok: false,
      reason,
      crmWrite: false,
    },
  };
}
