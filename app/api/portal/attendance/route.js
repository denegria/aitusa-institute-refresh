import { getRetiredPortalPrototypeResponse } from "../../../../src/portal/portalAvailability.js";

export const runtime = "nodejs";

export async function GET() {
  return getRetiredPortalPrototypeResponse();
}
