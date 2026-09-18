import { resolveAuthenticatedPortalIdentity } from "../../../../src/portalAuth/sessionResolver.server.js";
import { callRegistrationCrm } from "../../../../src/registration/crm.server.js";
import { assertPublicRegistrationSubmission, normalizeRegistrationInput } from "../../../../src/registration/contract.js";
import { registrationFailure, registrationInput, registrationJson } from "../../../../src/registration/http.server.js";
import { createRegistrationReturnState } from "../../../../src/registration/returnState.server.js";

export const runtime = "nodejs";

async function optionalPortalActor(request) {
  try {
    const identity = await resolveAuthenticatedPortalIdentity(request);
    return { portalAccountId: identity.account?.accountId || null };
  } catch { return { portalAccountId: null }; }
}

export async function POST(request) {
  try {
    const raw = await registrationInput(request);
    assertPublicRegistrationSubmission(raw);
    const input = normalizeRegistrationInput(raw);
    const actor = await optionalPortalActor(request);
    const created = await callRegistrationCrm("create", { registration: input, actor });
    if (created.result?.status === "advisor_required") {
      return registrationJson({ ok: true, state: "advisor_required", reason: created.result.reason });
    }
    const paymentRequestId = created.result?.paymentRequest?.id;
    const returnState = createRegistrationReturnState(paymentRequestId);
    const hosted = await callRegistrationCrm("hosted_link", {
      paymentRequestId,
      idempotencyKey: `registration:hpp:${input.idempotencyKey}`,
      returnState,
    });
    return registrationJson({
      ok: true,
      state: "checkout_ready",
      checkoutUrl: hosted.result?.checkoutUrl,
      returnState,
    }, 201);
  } catch (error) { return registrationFailure(error); }
}
