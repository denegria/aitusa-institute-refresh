import { callRegistrationCrm } from "../../../../src/registration/crm.server.js";
import { normalizeRegistrationInput, safeRegistrationResponse } from "../../../../src/registration/contract.js";
import { registrationFailure, registrationInput, registrationJson } from "../../../../src/registration/http.server.js";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const input = normalizeRegistrationInput(await registrationInput(request));
    const result = await callRegistrationCrm("quote", {
      programCode: input.programCode,
      residenceCountryCode: input.residenceCountryCode,
      billingCountryCode: input.billingCountryCode,
      learningModality: input.learningModality,
      includeTuitionPrepayment: input.includeTuitionPrepayment,
    });
    return registrationJson({ ok: true, ...safeRegistrationResponse(result) });
  } catch (error) { return registrationFailure(error); }
}
