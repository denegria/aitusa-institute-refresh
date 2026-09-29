import { callRegistrationCrm } from "../../../../src/registration/crm.server.js";
import { registrationFailure, registrationInput, registrationJson } from "../../../../src/registration/http.server.js";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const input = await registrationInput(request);
    const result = await callRegistrationCrm("reconcile_draft", { idempotencyKey: input.idempotencyKey });
    return registrationJson({ ok: true, ...result.result });
  } catch (error) { return registrationFailure(error); }
}
