import { createHash } from "node:crypto";

export const PLACEMENT_CONTACT_DISCLOSURE = Object.freeze({
  version: "aitusa-placement-contact-2026-08-20-v1",
  text: "Elige si AIT USA puede contactarte sobre tu resultado. Email, llamadas y cada tipo de mensaje requieren permisos separados. Responder STOP cancela mensajes SMS autorizados.",
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
  if (needsMobile && !/^\+[1-9]\d{7,14}$/.test(mobile || "")) errors.push("placement_contact_mobile_e164_required");
  if (needsMobile && input.verifiedMobile !== true) errors.push("placement_contact_mobile_verification_required");
  if (preferredChannel === "whatsapp" && WHATSAPP_OUTBOUND_ENABLED !== true) errors.push("placement_contact_whatsapp_unavailable");
  if (input.ageBand === "under_13" && (input.guardianOwned !== true || input.guardianVerified !== true)) errors.push("placement_contact_guardian_required");
  if (consent.serviceSms === true && preferredChannel !== "sms") errors.push("placement_contact_service_sms_channel_mismatch");
  if (consent.marketingSms === true && consent.serviceSms !== true) errors.push("placement_contact_marketing_sms_requires_service_choice");
  return errors.length ? { ok: false, errors } : { ok: true, preference: {
    preferredChannel, mobile, verifiedMobile: needsMobile, verifiedEmail: input.verifiedEmail === true,
    guardianOwned: input.guardianOwned === true, disclosureVersion: PLACEMENT_CONTACT_DISCLOSURE.version,
    disclosureHash: placementContactDisclosureHash, sourceUrl: safeSourceUrl(input.sourceUrl), optInAction: "explicit_checkbox",
    consents: { email: consent.email === true, serviceSms: consent.serviceSms === true, marketingSms: consent.marketingSms === true, phone: consent.phone === true, whatsapp: whatsappRequested },
  }};
}
function safeSourceUrl(value) { try { const url = new URL(value || "https://aitusa.example/placement-test/"); return `${url.origin}${url.pathname}`; } catch { return "/placement-test/"; } }

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
