import { createStudyBuddyRouteHandler } from "../../../../src/aiStudyBuddy/http.server.js";
import { getPortalPrototypeGateResponse } from "../../../../src/portal/portalAvailability.js";

export const runtime = "nodejs";

export async function GET(request) {
  const gateResponse = getPortalPrototypeGateResponse();
  if (gateResponse) return gateResponse;
  return createStudyBuddyRouteHandler().get(request);
}
