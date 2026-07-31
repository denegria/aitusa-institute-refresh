import { getStudyBuddyConfig } from "./config.server.js";
import { StudyBuddyError } from "./errors.js";
import { evaluateStudyBuddyEligibility } from "./policy.server.js";
import { resolvePracticePlan } from "./practicePlan.js";
import { validateTurnRequest } from "./requestValidation.server.js";
import { isolateLearnerInput, validateSafeFocusCode } from "./safety.server.js";
import { safePracticeResult } from "./studyBuddyContract.js";

export function createStudyBuddyService({ repository, provider, config = getStudyBuddyConfig(), now = () => new Date() }) {
  if (!repository) throw new Error("study_buddy_repository_required");
  return {
    async eligibility(snapshot) {
      return evaluateStudyBuddyEligibility(snapshot, { providerEnabled: config.enabled });
    },
    async start({ snapshot, emailHash }) {
      const eligibility = await this.eligibility(snapshot);
      if (!eligibility.ok) return eligibility;
      const plan = resolvePracticePlan(snapshot.result);
      return repository.reserveStart({ accountId: snapshot.account.id, emailHash, plan, limits: config.limits });
    },
    async turn({ snapshot, sessionId, payload }) {
      const eligibility = await this.eligibility(snapshot);
      if (!eligibility.ok) return eligibility;
      const input = validateTurnRequest(payload);
      isolateLearnerInput(input.text);
      const session = await repository.getSession(sessionId, snapshot.account.id);
      const claim = await repository.claimTurn({ sessionId, accountId: snapshot.account.id, learnerTurn: session.turnCount + 1, retryAttempt: payload.retryAttempt ?? 0, operationId: input.operationId, at: now() });
      if (claim.replayed && claim.completed) return safePracticeResult("operation_replayed");
      let providerResult;
      try {
        providerResult = await provider.runTurn({ plan: { scenario: session.scenario, useCase: session.useCase, version: session.planVersion }, input: input.text });
      } catch {
        throw new StudyBuddyError("provider_unavailable", 503);
      }
      const completed = await repository.completeTurn({ sessionId, operationId: input.operationId, outcomeCode: providerResult.outcomeCode, focusCode: validateSafeFocusCode(providerResult.focusCode), usage: providerResult.usage, at: now() });
      return safePracticeResult(completed.session.state === "completed" ? "completed" : "authenticated", { session: completed.session, feedback: providerResult.feedback });
    },
  };
}
