import { RegistrationExperienceError } from "./contract.js";

const TIMEOUT_MS = 10_000;

function config() {
  const url = String(process.env.AIT_CRM_REGISTRATION_URL || "").trim();
  const secret = String(process.env.AIT_CRM_REGISTRATION_SECRET || "").trim();
  if (!url || !secret) throw new RegistrationExperienceError("registration_service_unavailable", 503);
  return { url, secret, bypass: String(process.env.AIT_CRM_VERCEL_PROTECTION_BYPASS || "").trim() };
}

export async function callRegistrationCrm(action, payload = {}, fetchImpl = fetch) {
  const { url, secret, bypass } = config();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const headers = { "content-type": "application/json", "x-ait-registration-secret": secret };
    if (bypass) headers["x-vercel-protection-bypass"] = bypass;
    const response = await fetchImpl(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ action, ...payload }),
      cache: "no-store",
      signal: controller.signal,
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new RegistrationExperienceError(
        body?.error?.code || "registration_service_rejected",
        response.status,
        body?.error?.message || "No pudimos continuar con la inscripción.",
      );
    }
    return body;
  } catch (error) {
    if (error instanceof RegistrationExperienceError) throw error;
    throw new RegistrationExperienceError("registration_service_unavailable", 503);
  } finally {
    clearTimeout(timer);
  }
}
