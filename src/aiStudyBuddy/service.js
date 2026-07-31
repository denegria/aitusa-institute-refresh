import { getStudyBuddyConfig } from "./config.server.js";
import { StudyBuddyError } from "./errors.js";
import { evaluateStudyBuddyEligibility } from "./policy.server.js";
import { resolvePracticePlan } from "./practicePlan.js";
import { validateTurnRequest } from "./requestValidation.server.js";
import { isolateLearnerInput, validateProviderResult } from "./safety.server.js";
import { safePracticeResult } from "./studyBuddyContract.js";
import { validateAuthorizedStudyBuddyContext } from "./authorizedContext.server.js";

export function createStudyBuddyService({ repository, provider, config = getStudyBuddyConfig(), now = () => new Date() }) {
  if (!repository) throw new Error("study_buddy_repository_required");
  return {
    async eligibility(snapshot) {
      return evaluateStudyBuddyEligibility(snapshot, { providerEnabled: config.enabled });
    },
    async start({ context }) {
      validateAuthorizedStudyBuddyContext(context);
      const { snapshot, ownership } = context;
      const eligibility = await this.eligibility(snapshot);
      if (!eligibility.ok) return eligibility;
      const plan = resolvePracticePlan(snapshot.result);
      return repository.reserveStart({
        accountId: ownership.accountId,
        resultId: ownership.resultId,
        verifiedEmailHmac: ownership.verifiedEmailHmac,
        hashVersion: ownership.hashVersion,
        plan,
        limits: config.limits,
      });
    },
    async turn({ context, sessionId, payload }) {
      validateAuthorizedStudyBuddyContext(context);
      const { snapshot, ownership } = context;
      const eligibility = await this.eligibility(snapshot);
      if (!eligibility.ok) return eligibility;
      const input = validateTurnRequest(payload);
      if (input.input.kind === "text") isolateLearnerInput(input.input.value);
      const session = await repository.getSession(sessionId, ownership.accountId);
      const learnerTurn = input.retryAttempt === 1 ? session.lastLearnerTurn : session.turnCount + 1;
      const claim = await repository.claimTurn({ sessionId, accountId: ownership.accountId, learnerTurn, retryAttempt: input.retryAttempt, operationId: input.operationId, at: now() });
      if (claim.replayed) return safePracticeResult("operation_replayed", { operationState: claim.state });
      let providerResult;
      try {
        const rawResult = await provider.runTurn({ plan: { scenario: session.scenario, useCase: session.useCase, version: session.planVersion }, input: input.input });
        providerResult = validateProviderResult(rawResult, { maxMicroUsd: claim.reservedMicroUsd, expectedPlanVersion: session.planVersion });
      } catch {
        await repository.failTurn({ sessionId, accountId: ownership.accountId, operationId: input.operationId, ambiguous: true, at: now() });
        throw new StudyBuddyError("provider_unavailable", 503);
      }
      const completed = await repository.completeTurn({ sessionId, accountId: ownership.accountId, operationId: input.operationId, outcomeCode: providerResult.outcomeCode, focusCode: providerResult.focusCode, usage: providerResult.usage, at: now() });
      return safePracticeResult(completed.session.state === "completed" ? "completed" : "authenticated", { session: completed.session, feedback: providerResult.feedback });
    },
  };
}
