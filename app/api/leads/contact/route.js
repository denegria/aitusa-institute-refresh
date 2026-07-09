import {
  evaluateLeadContactSubmission,
  getLeadContactConfig,
} from "../../../../src/leads/leadContactModel.js";

export const runtime = "nodejs";

export async function GET() {
  return Response.json({
    ok: true,
    leadContact: getLeadContactConfig(),
    crmWrite: false,
  });
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      {
        ok: false,
        errors: ["invalid_json"],
        crmWrite: false,
        storageEnabled: false,
      },
      { status: 400 },
    );
  }

  const response = evaluateLeadContactSubmission(body);
  return Response.json(response.body, { status: response.status });
}
