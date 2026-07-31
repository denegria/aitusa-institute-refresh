import { AI_STUDY_BUDDY_USE_CASES } from "./studyBuddyContract.js";

const PLAN_BY_LEVEL = Object.freeze({
  basic: Object.freeze({ scenario: "daily_routine", useCase: "lesson_review" }),
  intermediate: Object.freeze({ scenario: "workplace_exchange", useCase: "conversation_roleplay" }),
  advanced: Object.freeze({ scenario: "guided_discussion", useCase: "conversation_roleplay" }),
});

export function resolvePracticePlan(result) {
  const selected = PLAN_BY_LEVEL[normalizePracticeLevel(result?.recommendedLevelKey)];
  if (!selected || !AI_STUDY_BUDDY_USE_CASES[selected.useCase]) return null;
  return Object.freeze({ ...selected, version: "mis-340-plan-v1" });
}

export function normalizePracticeLevel(levelKey = "") {
  const normalized = String(levelKey).trim().toLowerCase();
  if (
    normalized === "advanced" ||
    normalized.includes("nivel-3") ||
    normalized.startsWith("book-3")
  ) {
    return "advanced";
  }
  if (
    normalized === "intermediate" ||
    normalized.includes("nivel-2") ||
    normalized.startsWith("book-2")
  ) {
    return "intermediate";
  }
  if (
    normalized === "basic" ||
    normalized.includes("nivel-1") ||
    normalized.startsWith("book-1")
  ) {
    return "basic";
  }
  return null;
}
