import { after } from "next/server.js";
import { dispatchCrmOutboxBestEffort } from "../../../../src/crm/runtime.server.js";
import { getLeadContactConfig } from "../../../../src/leads/leadContactModel.js";
import { getLeadContactService } from "../../../../src/leads/service.server.js";

export const runtime = "nodejs";

export async function GET() {
  return Response.json({
    ok: true,
    leadContact: getLeadContactConfig(),
    crmWrite: true,
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

  try {
    const response = await getLeadContactService().submit(body);
    if (response.body.crmQueued && process.env.VERCEL) {
      after(() => dispatchCrmOutboxBestEffort());
    }
    return Response.json(response.body, { status: response.status });
  } catch {
    return Response.json(
      {
        ok: false,
        errors: ["crm_delivery_unavailable"],
        crmWrite: false,
        storageEnabled: false,
      },
      { status: 503 },
    );
  }
}
