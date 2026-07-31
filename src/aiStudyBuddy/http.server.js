import { resolveAuthenticatedPortalSnapshot } from "../portalAuth/sessionResolver.server.js";
import { toSafeStudyBuddyError } from "./errors.js";
import { enforceSameOrigin } from "./requestValidation.server.js";
import { toPracticeEligibilityDto, safePracticeResult } from "./studyBuddyContract.js";

const NO_STORE = Object.freeze({ "cache-control": "private, no-store" });

function response(body, status = 200) {
  return Response.json(body, { status, headers: NO_STORE });
}

export function createStudyBuddyRouteHandler({ resolveSnapshot = resolveAuthenticatedPortalSnapshot, service = null, hashEmail = () => null } = {}) {
  return {
    async get(request) {
      try {
        const snapshot = await resolveSnapshot(request);
        if (!service) return response(toPracticeEligibilityDto(safePracticeResult("provider_disabled")));
        return response(toPracticeEligibilityDto(await service.eligibility(snapshot)));
      } catch (error) {
        const safe = toSafeStudyBuddyError(error);
        const status = safe.code === "unauthenticated" ? 401 : 503;
        return response(toPracticeEligibilityDto(safe), status);
      }
    },
    async start(request) {
      try {
        enforceSameOrigin(request);
        const snapshot = await resolveSnapshot(request);
        if (!service) return response(safePracticeResult("provider_disabled"), 503);
        const result = await service.start({ snapshot, emailHash: hashEmail(snapshot) });
        return response(result.session ? { ok: true, session: toSafeSessionDto(result.session), replayed: result.replayed } : result, result.session ? 201 : 409);
      } catch (error) {
        const safe = toSafeStudyBuddyError(error);
        return response(safe, safe.code === "unauthenticated" ? 401 : 409);
      }
    },
    async turn(request, sessionId) {
      try {
        enforceSameOrigin(request);
        const payload = await request.json();
        const snapshot = await resolveSnapshot(request);
        if (!service) return response(safePracticeResult("provider_disabled"), 503);
        const result = await service.turn({ snapshot, sessionId, payload });
        return response(toSafeTurnDto(result), result.ok ? 200 : 409);
      } catch (error) {
        const safe = toSafeStudyBuddyError(error);
        return response(safe, safe.code === "provider_unavailable" ? 503 : 409);
      }
    },
  };
}

export function toSafeSessionDto(session) {
  return {
    id: session.id,
    state: session.state,
    scenario: session.scenario,
    useCase: session.useCase,
    turnCount: session.turnCount,
    expiresAt: session.expiresAt?.toISOString?.() ?? session.expiresAt,
  };
}

function toSafeTurnDto(result) {
  return {
    ok: result.ok,
    code: result.code,
    nextAction: result.nextAction,
    ...(result.session ? { session: toSafeSessionDto(result.session) } : {}),
    ...(result.feedback ? { feedback: result.feedback } : {}),
  };
}
