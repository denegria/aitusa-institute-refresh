import { resolveAuthorizedStudyBuddyContext } from "../portalAuth/sessionResolver.server.js";
import { toSafeStudyBuddyError } from "./errors.js";
import { assertEmptyStartBody, enforceSameOrigin, parseBoundedJson } from "./requestValidation.server.js";
import { publicSnapshotFromAuthorizedContext, validateAuthorizedStudyBuddyContext } from "./authorizedContext.server.js";
import { toPracticeEligibilityDto, safePracticeResult } from "./studyBuddyContract.js";

const NO_STORE = Object.freeze({ "cache-control": "private, no-store" });

function response(body, status = 200) {
  return Response.json(body, { status, headers: NO_STORE });
}

export function createStudyBuddyRouteHandler({ resolveContext = resolveAuthorizedStudyBuddyContext, service = null, configuredOrigin = null } = {}) {
  return {
    async get(request) {
      try {
        const context = validateAuthorizedStudyBuddyContext(await resolveContext(request));
        const snapshot = publicSnapshotFromAuthorizedContext(context);
        if (!service) return response(toPracticeEligibilityDto(safePracticeResult("provider_disabled")));
        return response(toPracticeEligibilityDto(await service.eligibility(snapshot)));
      } catch (error) {
        const safe = toSafeStudyBuddyError(error);
        return response(toPracticeEligibilityDto(safe.body), safe.status);
      }
    },
    async start(request) {
      try {
        enforceSameOrigin(request, configuredOrigin);
        await assertEmptyStartBody(request);
        const context = validateAuthorizedStudyBuddyContext(await resolveContext(request));
        if (!service) return response(safePracticeResult("provider_disabled"), 503);
        const result = await service.start({ context });
        return response(result.session ? { ok: true, session: toSafeSessionDto(result.session), replayed: result.replayed } : result, result.session ? 201 : 409);
      } catch (error) {
        const safe = toSafeStudyBuddyError(error);
        return response(safe.body, safe.status);
      }
    },
    async turn(request, sessionId) {
      try {
        enforceSameOrigin(request, configuredOrigin);
        const payload = await parseBoundedJson(request);
        const context = validateAuthorizedStudyBuddyContext(await resolveContext(request));
        if (!service) return response(safePracticeResult("provider_disabled"), 503);
        const result = await service.turn({ context, sessionId, payload });
        return response(toSafeTurnDto(result), result.ok ? 200 : 409);
      } catch (error) {
        const safe = toSafeStudyBuddyError(error);
        return response(safe.body, safe.status);
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
