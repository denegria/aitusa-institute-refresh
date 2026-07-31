import { AI_STUDY_BUDDY_USE_CASES } from "./studyBuddyContract.js";

const PLAN_BY_LEVEL = Object.freeze({
  basic: Object.freeze({ scenario: "daily_routine", useCase: "lesson_review" }),
  intermediate: Object.freeze({ scenario: "workplace_exchange", useCase: "conversation_roleplay" }),
  advanced: Object.freeze({ scenario: "guided_discussion", useCase: "conversation_roleplay" }),
});

export function resolvePracticePlan(result) {
  const selected = PLAN_BY_LEVEL[result?.recommendedLevelKey];
  if (!selected || !AI_STUDY_BUDDY_USE_CASES[selected.useCase]) return null;
  return Object.freeze({ ...selected, version: "mis-340-plan-v1" });
}
