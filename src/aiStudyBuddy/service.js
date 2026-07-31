import { getStudyBuddyConfig } from "./config.server.js";
import { StudyBuddyError } from "./errors.js";
import { evaluateStudyBuddyEligibility } from "./policy.server.js";
import { resolvePracticePlan } from "./practicePlan.js";
import { validateTurnRequest } from "./requestValidation.server.js";
import { isolateLearnerInput, validateProviderResult } from "./safety.server.js";
import { safePracticeResult } from "./studyBuddyContract.js";
import { validateAuthorizedStudyBuddyContext } from "./authorizedContext.server.js";

export function createStudyBuddyService({ repository, provider, config = getStudyBuddyConfig(), now = () => new Date(), runWithDeadline = defaultRunWithDeadline }) {
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
      if (claim.replayed) {
        const terminalReplayCodes = { escalated: "escalated", completed: "completed", expired: "session_expired" };
        const code = claim.state === "completed"
          ? terminalReplayCodes[claim.session.state] ?? "operation_completed"
          : "operation_replayed";
        return safePracticeResult(code, { session: claim.session });
      }
      let providerResult;
      let lateResult = null;
      try {
        const deadlineResult = await runWithDeadline(
          () => provider.runTurn({ plan: { scenario: session.scenario, useCase: session.useCase, version: session.planVersion }, input: input.input }),
          config.limits.providerDeadlineMs ?? 10_000,
        );
        if (deadlineResult.timedOut) {
          lateResult = deadlineResult.lateResult ?? null;
          throw new Error("study_buddy_provider_deadline");
        }
        const rawResult = deadlineResult.value;
        providerResult = validateProviderResult(rawResult, { maxMicroUsd: claim.reservedMicroUsd, expectedPlanVersion: session.planVersion });
      } catch {
        await repository.failTurn({ sessionId, accountId: ownership.accountId, operationId: input.operationId, ambiguous: true, at: now() });
        await repository.recordProviderFailure(now());
        lateResult?.then(async (rawResult) => {
          try {
            const late = validateProviderResult(rawResult, { maxMicroUsd: claim.reservedMicroUsd, expectedPlanVersion: session.planVersion });
            await repository.reconcileLateTurn({ sessionId, accountId: ownership.accountId, operationId: input.operationId, usage: late.usage, at: now() });
          } catch {
            // Reservation remains held when late cost cannot be established.
          }
        }).catch(() => {});
        throw new StudyBuddyError("provider_unavailable", 503);
      }
      const completed = await repository.completeTurn({ sessionId, accountId: ownership.accountId, operationId: input.operationId, outcomeCode: providerResult.outcomeCode, focusCode: providerResult.focusCode, usage: providerResult.usage, at: now() });
      await repository.recordProviderSuccess(now());
      if (completed.terminalCode) return safePracticeResult(completed.terminalCode, { session: completed.session });
      const code = completed.session.state === "completed" ? "completed" : completed.session.state === "escalated" ? "escalated" : "authenticated";
      return safePracticeResult(code, { session: completed.session, feedback: providerResult.feedback });
    },
  };
}

async function defaultRunWithDeadline(work, deadlineMs) {
  let timer;
  const providerResult = Promise.resolve().then(work);
  try {
    return await Promise.race([
      providerResult.then((value) => ({ timedOut: false, value })),
      new Promise((resolve) => { timer = setTimeout(() => resolve({ timedOut: true, lateResult: providerResult }), deadlineMs); }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}
