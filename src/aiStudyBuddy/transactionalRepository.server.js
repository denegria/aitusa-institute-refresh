// Durable command composition only: no connection is created here. The future
// Neon adapter must implement these lock and transition commands against 0003.
export function createTransactionalStudyBuddyRepository({ runTransaction }) {
  if (typeof runTransaction !== "function") throw new Error("study_buddy_transaction_runner_required");

  const required = (tx, name) => {
    if (!tx || typeof tx[name] !== "function") throw new Error(`study_buddy_transaction_${name}_required`);
    return tx[name].bind(tx);
  };
  const transaction = (work) => runTransaction(work);

  return {
    reserveStart: (input) => transaction(async (tx) => {
      await required(tx, "lockCircuit")(input);
      await required(tx, "lockEntitlementAndDayBudget")(input);
      return required(tx, "reserveStartAtomic")(input);
    }),
    claimTurn: (input) => transaction(async (tx) => {
      await required(tx, "lockCircuitAndSession")(input);
      return required(tx, "claimTurnAtomic")(input);
    }),
    completeTurn: (input) => transaction(async (tx) => {
      await required(tx, "lockSessionOperationAndBudget")(input);
      return required(tx, "completeTurnAndReconcileAtomic")(input);
    }),
    failTurn: (input) => transaction(async (tx) => {
      await required(tx, "lockSessionOperationAndBudget")(input);
      return required(tx, "failTurnAndReconcileAtomic")(input);
    }),
    reconcileLateTurn: (input) => transaction(async (tx) => {
      await required(tx, "lockSessionOperationAndBudget")(input);
      return required(tx, "reconcileLateTurnAtomic")(input);
    }),
    reapExpired: (at) => transaction((tx) => required(tx, "reapExpiredAndReconcileAtomic")({ at })),
    recordProviderFailure: (at) => transaction(async (tx) => {
      await required(tx, "lockCircuit")({ at });
      return required(tx, "recordProviderFailureAtomic")({ at });
    }),
    recordProviderSuccess: (at) => transaction(async (tx) => {
      await required(tx, "lockCircuit")({ at });
      return required(tx, "recordProviderSuccessAtomic")({ at });
    }),
    setCircuitOpen: (until) => transaction(async (tx) => {
      await required(tx, "lockCircuit")({ until });
      return required(tx, "setCircuitOpenAtomic")({ until });
    }),
    getSession: (sessionId, accountId) => transaction((tx) => required(tx, "readOwnedSession")({ sessionId, accountId })),
  };
}
