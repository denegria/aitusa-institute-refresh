import {
  evaluatePlacementTestSubmission,
  getPlacementTestConfig,
} from "../../../src/placement/placementTestModel.js";

export const runtime = "nodejs";

export async function GET() {
  return Response.json({
    ok: true,
    placementTest: getPlacementTestConfig(),
    crmWrite: false,
  });
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const response = evaluatePlacementTestSubmission(body);
  return Response.json(response.body, { status: response.status });
}
