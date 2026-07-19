import { getPrivacyPolicyStatus } from "../../../../src/privacy/privacyPolicy.js";
import { getPortalPrototypeGateResponse } from "../../../../src/portal/portalAvailability.js";

export const runtime = "nodejs";

export async function GET(request) {
  const gateResponse = getPortalPrototypeGateResponse();
  if (gateResponse) return gateResponse;

  const url = new URL(request.url);
  const accountKey = url.searchParams.get("accountKey") ?? "studentActive";

  return Response.json({
    ok: true,
    policy: getPrivacyPolicyStatus(accountKey),
    durableConsentStorage: false,
  });
}
