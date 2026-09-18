import { callRegistrationCrm } from "../../../../src/registration/crm.server.js";
import { registrationFailure, registrationInput, registrationJson } from "../../../../src/registration/http.server.js";
import { readRegistrationReturnState } from "../../../../src/registration/returnState.server.js";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const input = await registrationInput(request);
    const state = readRegistrationReturnState(input.state);
    const status = await callRegistrationCrm("status", { paymentRequestId: state.paymentRequestId });
    return registrationJson({ ok: true, result: status.result });
  } catch (error) { return registrationFailure(error); }
}
