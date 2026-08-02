import { after } from "next/server.js";
import { createStudyBuddyRouteHandler } from "../../../../../src/aiStudyBuddy/http.server.js";
import { dispatchCrmOutboxBestEffort } from "../../../../../src/crm/runtime.server.js";
import { getPortalPrototypeGateResponse } from "../../../../../src/portal/portalAvailability.js";

export const runtime = "nodejs";

export async function POST(request) {
  const gateResponse = getPortalPrototypeGateResponse();
  if (gateResponse) return gateResponse;
  const response = await createStudyBuddyRouteHandler().start(request);
  if (response.ok && process.env.VERCEL) after(() => dispatchCrmOutboxBestEffort());
  return response;
}
