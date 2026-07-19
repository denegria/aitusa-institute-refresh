import { getPortalLearningResponse } from "../../../../src/learning/learningContentModel.js";
import { getPortalPrototypeGateResponse } from "../../../../src/portal/portalAvailability.js";

export const runtime = "nodejs";

export async function GET(request) {
  const gateResponse = getPortalPrototypeGateResponse();
  if (gateResponse) return gateResponse;

  const url = new URL(request.url);
  const accountKey = url.searchParams.get("accountKey") ?? "studentActive";
  const studentCrmContactRef =
    url.searchParams.get("studentCrmContactRef") ?? "crm_contact_fixture_student_001";

  const response = getPortalLearningResponse(accountKey, studentCrmContactRef);
  return Response.json(response.body, { status: response.status });
}
