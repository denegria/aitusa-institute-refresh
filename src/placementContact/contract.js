import { createHash } from "node:crypto";

export const PLACEMENT_CONTACT_DISCLOSURE = Object.freeze({
  version: "aitusa-placement-contact-2026-08-20-v2",
  text: "Elige cómo prefieres que AIT USA te contacte sobre tu resultado. Guardar un teléfono no lo verifica para iniciar sesión. Email, llamadas, SMS de servicio y contacto individual por WhatsApp requieren permisos separados. Esto no autoriza marketing.",
});
export const PLACEMENT_CHANNELS = Object.freeze(["email", "sms", "whatsapp", "phone"]);
export const WHATSAPP_OUTBOUND_ENABLED = false;
export const placementContactDisclosureHash = createHash("sha256").update(PLACEMENT_CONTACT_DISCLOSURE.text, "utf8").digest("hex");

export function validatePlacementContactPreference(input = {}) {
  const errors = [];
  const preferredChannel = input.preferredChannel;
  if (!PLACEMENT_CHANNELS.includes(preferredChannel)) errors.push("placement_contact_channel_invalid");
  const mobile = input.mobile?.trim() || null;
  const consent = input.consents || {};
  const whatsappRequested = consent.whatsapp === true;
  const needsMobile = ["sms", "whatsapp", "phone"].includes(preferredChannel) || whatsappRequested;
  const normalizedMobile = needsMobile ? normalizeMobile(mobile) : null;
  if (needsMobile && !normalizedMobile) errors.push("placement_contact_mobile_e164_required");
  if (input.ageBand === "under_13" && (input.guardianOwned !== true || input.guardianVerified !== true)) errors.push("placement_contact_guardian_required");
  if (preferredChannel === "email" && consent.email !== true) errors.push("placement_contact_email_consent_required");
  if (preferredChannel === "sms" && consent.serviceSms !== true) errors.push("placement_contact_service_sms_consent_required");
  if (preferredChannel === "phone" && consent.phone !== true) errors.push("placement_contact_phone_consent_required");
  if (preferredChannel === "whatsapp" && consent.whatsapp !== true) errors.push("placement_contact_whatsapp_consent_required");
  if (consent.email === true && preferredChannel !== "email") errors.push("placement_contact_email_channel_mismatch");
  if (consent.serviceSms === true && preferredChannel !== "sms") errors.push("placement_contact_service_sms_channel_mismatch");
  if (consent.phone === true && preferredChannel !== "phone") errors.push("placement_contact_phone_channel_mismatch");
  if (consent.whatsapp === true && preferredChannel !== "whatsapp") errors.push("placement_contact_whatsapp_channel_mismatch");
  if (consent.marketingSms === true && consent.serviceSms !== true) errors.push("placement_contact_marketing_sms_requires_service_choice");
  return errors.length ? { ok: false, errors } : { ok: true, preference: {
    preferredChannel, mobile: normalizedMobile, verifiedMobile: needsMobile && input.verifiedMobile === true, verifiedEmail: input.verifiedEmail === true,
    guardianOwned: input.guardianOwned === true, disclosureVersion: PLACEMENT_CONTACT_DISCLOSURE.version,
    disclosureHash: placementContactDisclosureHash, sourceUrl: safeSourceUrl(input.sourceUrl), optInAction: "explicit_checkbox",
    consents: { email: consent.email === true, serviceSms: consent.serviceSms === true, marketingSms: consent.marketingSms === true, phone: consent.phone === true, whatsapp: whatsappRequested },
}};
}
function normalizeMobile(value) {
  if (!value) return null;
  const trimmed = value.trim();
  const digits = trimmed.replace(/\D/g, "");
  const candidate = trimmed.startsWith("+") ? `+${digits}` : digits.length === 10 ? `+1${digits}` : digits.length === 11 && digits.startsWith("1") ? `+${digits}` : null;
  return candidate && /^\+[1-9]\d{7,14}$/.test(candidate) ? candidate : null;
}
function safeSourceUrl(value) { try { const url = new URL(value || "https://aitusa.example/placement-test/"); return url.pathname; } catch { return "/placement-test/"; } }

export function buildPlacementContactCrmPayload({ reviewId, resultId, correlationId, preference }) {
  return {
    schemaVersion: "aitusa-crm-event-v1", reviewId, resultId, correlationId,
    communicationPreference: preference.preferredChannel,
    consent: {
      disclosureVersion: preference.disclosureVersion, disclosureHash: preference.disclosureHash,
      sourceUrl: preference.sourceUrl, optInAction: preference.optInAction,
      email: preference.consents.email, serviceSms: preference.consents.serviceSms,
      marketingSms: preference.consents.marketingSms, phone: preference.consents.phone,
      whatsapp: preference.consents.whatsapp, verifiedEmail: preference.verifiedEmail, verifiedMobile: preference.verifiedMobile,
    },
  };
}
