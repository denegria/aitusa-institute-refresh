import { assertStudyBuddyProvider } from "./providerContract.js";

export function createFakeStudyBuddyProvider({ response = null, error = null } = {}) {
  return assertStudyBuddyProvider({
    async runTurn({ plan, input }) {
      if (error) throw error;
      return response ?? {
        outcomeCode: "success",
        focusCode: "meaning_acknowledged",
        usage: { inputUnits: input.length, outputUnits: 1, microUsd: 0 },
        feedback: "safe_fixture_feedback",
        planVersion: plan.version,
      };
    },
  });
}
