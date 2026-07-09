import {
  getScannerStationResponse,
  previewScannerCheckIn,
} from "../../../../src/attendance/checkInModel.js";

export const runtime = "nodejs";

export async function GET(request) {
  const url = new URL(request.url);
  const accountKey = url.searchParams.get("accountKey") ?? "teacherActive";
  const stationRef =
    url.searchParams.get("stationRef") ?? "station_bound_brook_front_desk";
  const sessionRef =
    url.searchParams.get("sessionRef") ?? "session_fixture_english_101_003";

  const response = getScannerStationResponse(accountKey, stationRef, sessionRef);
  return Response.json(response.body, { status: response.status });
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const response = previewScannerCheckIn({
    accountKey: body.accountKey ?? "teacherActive",
    stationRef: body.stationRef ?? "station_bound_brook_front_desk",
    sessionRef: body.sessionRef ?? "session_fixture_english_101_003",
    scannedValue: body.scannedValue,
    scannedAt: body.scannedAt,
  });

  return Response.json(response.body, { status: response.status });
}
