import { getPrivacyPolicyStatus } from "../../../../src/privacy/privacyPolicy.js";

export const runtime = "nodejs";

export async function GET(request) {
  const url = new URL(request.url);
  const accountKey = url.searchParams.get("accountKey") ?? "studentActive";

  return Response.json({
    ok: true,
    policy: getPrivacyPolicyStatus(accountKey),
    durableConsentStorage: false,
  });
}
