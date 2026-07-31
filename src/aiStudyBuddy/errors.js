import { safePracticeResult } from "./studyBuddyContract.js";
import { PortalClaimError } from "../portalClaim/errors.js";

export class StudyBuddyError extends Error {
  constructor(code, status = 400) {
    super(code);
    this.name = "StudyBuddyError";
    this.code = code;
    this.status = status;
  }
}

export function toSafeStudyBuddyError(error) {
  if (error instanceof StudyBuddyError) {
    return { body: safePracticeResult(error.code), status: safeStatus(error.status) };
  }
  if (error instanceof PortalClaimError) {
    // WorkOS exposes no trustworthy invalid-vs-expired detail here.
    if (["portal_session_required", "portal_session_invalid", "portal_session_expired"].includes(error.code)) {
      return { body: safePracticeResult("unauthenticated"), status: 401 };
    }
  }
  return { body: safePracticeResult("provider_unavailable"), status: 503 };
}

function safeStatus(status) {
  return [400, 401, 403, 404, 409, 413, 429, 503].includes(status) ? status : 503;
}
