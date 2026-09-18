import { resolveAuthenticatedPortalIdentity } from "../../../../src/portalAuth/sessionResolver.server.js";
import { registrationJson } from "../../../../src/registration/http.server.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const identity = await resolveAuthenticatedPortalIdentity(request);
    return registrationJson({
      authenticated: true,
      student: {
        name: identity.account?.firstName || "",
        email: identity.account?.email || "",
      },
    });
  } catch {
    return registrationJson({ authenticated: false, student: null });
  }
}
