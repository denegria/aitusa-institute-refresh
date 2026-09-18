import { assertPortalSameOrigin, parsePortalClaimJson } from "../portalClaim/http.server.js";
import { RegistrationExperienceError } from "./contract.js";

export async function registrationInput(request) {
  try {
    assertPortalSameOrigin(request);
    return await parsePortalClaimJson(request);
  } catch (error) {
    throw new RegistrationExperienceError(error?.code || "registration_request_invalid", error?.status || 400);
  }
}

export function registrationJson(body, status = 200) {
  return Response.json(body, { status, headers: { "cache-control": "private, no-store" } });
}

export function registrationFailure(error) {
  const status = Number(error?.status) || 500;
  return registrationJson({
    ok: false,
    error: {
      code: error?.code || "registration_unavailable",
      message: status >= 500 ? "La inscripción no está disponible temporalmente." : error.message,
    },
  }, status >= 400 && status <= 599 ? status : 500);
}
