import { NextResponse } from "next/server.js";
import { getPortalPrototypeGateResponse } from "./src/portal/portalAvailability.js";

export function proxy() {
  return getPortalPrototypeGateResponse() || NextResponse.next();
}

export const config = {
  matcher: ["/portal/:path*", "/api/portal/:path*"],
};
