import { resolveAuthenticatedPortalSnapshot } from "../../../../src/portalAuth/sessionResolver.server.js";
import { registrationJson } from "../../../../src/registration/http.server.js";
import { registrationPlacementDisplay, registrationPortalActor } from "../../../../src/registration/placement.server.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const snapshot = await resolveAuthenticatedPortalSnapshot(request);
    const actor = registrationPortalActor(snapshot, snapshot.account?.email);
    return registrationJson({
      authenticated: true,
      student: {
        name: snapshot.account?.firstName || "",
        email: snapshot.account?.email || "",
      },
      placement: registrationPlacementDisplay(actor.placement),
    });
  } catch {
    return registrationJson({ authenticated: false, student: null });
  }
}
