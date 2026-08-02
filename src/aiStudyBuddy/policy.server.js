import { safePracticeResult } from "./studyBuddyContract.js";
import { resolvePracticePlan } from "./practicePlan.js";

export function evaluateStudyBuddyEligibility(snapshot, { providerEnabled = false } = {}) {
  if (!snapshot || snapshot.state !== "authenticated") return safePracticeResult("unauthenticated");
  if (snapshot.account?.status !== "active") return safePracticeResult("account_blocked");
  if (!snapshot.result) return safePracticeResult("missing_result");
  // Adult students do not require guardian authorization. Every non-adult
  // account remains fail-closed until its snapshot carries an authoritative
  // guardian verification signal.
  if (
    snapshot.account?.accountType !== "adult_student" &&
    snapshot.practice?.guardianVerified !== true
  ) {
    return safePracticeResult("guardian_unresolved");
  }
  if (!resolvePracticePlan(snapshot.result)) return safePracticeResult("missing_result");
  if (!providerEnabled) return safePracticeResult("provider_disabled");
  return safePracticeResult("authenticated");
}
