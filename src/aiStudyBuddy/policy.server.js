import { safePracticeResult } from "./studyBuddyContract.js";
import { resolvePracticePlan } from "./practicePlan.js";

export function evaluateStudyBuddyEligibility(snapshot, { providerEnabled = false } = {}) {
  if (!snapshot || snapshot.state !== "authenticated") return safePracticeResult("unauthenticated");
  if (snapshot.account?.status !== "active") return safePracticeResult("account_blocked");
  if (!snapshot.result) return safePracticeResult("missing_result");
  // No authoritative under-13 authorization exists in this runtime. Existing
  // snapshots therefore never establish the prerequisite for real practice.
  if (snapshot.practice?.guardianVerified !== true) {
    return safePracticeResult("guardian_unresolved");
  }
  if (!resolvePracticePlan(snapshot.result)) return safePracticeResult("missing_result");
  if (!providerEnabled) return safePracticeResult("provider_disabled");
  return safePracticeResult("authenticated");
}
