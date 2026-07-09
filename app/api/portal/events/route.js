import {
  buildCrmEventResponse,
  toCrmTimelineSummary,
  validateCrmEventEnvelope,
} from "../../../../src/crm/eventContract.js";

export const runtime = "nodejs";

export async function POST(request) {
  let envelope;
  try {
    envelope = await request.json();
  } catch {
    return Response.json(
      {
        accepted: false,
        errors: ["invalid_json"],
        crmWrite: false,
      },
      { status: 400 },
    );
  }

  const response = buildCrmEventResponse(envelope);

  if (response.body.accepted) {
    const validation = validateCrmEventEnvelope(envelope);
    response.body.crmTimelinePreview = toCrmTimelineSummary(validation.event);
  }

  return Response.json(response.body, { status: response.status });
}
