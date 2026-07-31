// Durable composition boundary only: this module intentionally constructs no
// database connection. A future Neon adapter supplies lock-safe implementations
// for these commands against migration 0003.
export function createTransactionalStudyBuddyRepository({ runTransaction }) {
  if (typeof runTransaction !== "function") throw new Error("study_buddy_transaction_runner_required");

  async function invoke(method, input) {
    return runTransaction(async (transaction) => {
      if (!transaction || typeof transaction[method] !== "function") {
        throw new Error(`study_buddy_transaction_${method}_required`);
      }
      return transaction[method](input);
    });
  }

  return {
    reserveStart: (input) => invoke("reserveStart", input),
    claimTurn: (input) => invoke("claimTurn", input),
    completeTurn: (input) => invoke("completeTurn", input),
    failTurn: (input) => invoke("failTurn", input),
    reapExpired: (at) => invoke("reapExpired", { at }),
    setCircuitOpen: (until) => invoke("setCircuitOpen", { until }),
    getSession: (sessionId, accountId) => invoke("getSession", { sessionId, accountId }),
  };
}
