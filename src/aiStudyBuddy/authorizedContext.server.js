import { StudyBuddyError } from "./errors.js";

const HMAC_PATTERN = /^[a-f0-9]{64}$/;
const VERSION_PATTERN = /^[a-z0-9][a-z0-9._-]{0,63}$/;
const ID_PATTERN = /^[a-zA-Z0-9-]{8,128}$/;

export function validateAuthorizedStudyBuddyContext(context) {
  const ownership = context?.ownership;
  if (
    !context?.snapshot ||
    context.snapshot.state !== "authenticated" ||
    !ownership ||
    typeof ownership.accountId !== "string" ||
    !ID_PATTERN.test(ownership.accountId) ||
    !(
      (context.snapshot.result === null && ownership.resultId === null) ||
      (context.snapshot.result && typeof ownership.resultId === "string" && ID_PATTERN.test(ownership.resultId))
    ) ||
    typeof ownership.verifiedEmailHmac !== "string" ||
    !HMAC_PATTERN.test(ownership.verifiedEmailHmac) ||
    typeof ownership.hashVersion !== "string" ||
    !VERSION_PATTERN.test(ownership.hashVersion)
    || (ownership.funnelCorrelationId !== undefined && (typeof ownership.funnelCorrelationId !== "string" || !ID_PATTERN.test(ownership.funnelCorrelationId)))
  ) {
    throw new StudyBuddyError("unauthenticated", 401);
  }
  return context;
}

export function publicSnapshotFromAuthorizedContext(context) {
  return validateAuthorizedStudyBuddyContext(context).snapshot;
}
