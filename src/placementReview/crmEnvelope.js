import { PLACEMENT_REVIEW_EVENT_TYPES } from "./contract.js";

export const PLACEMENT_REVIEW_CRM_SCHEMA = "aitusa-crm-event-v1";
export const PLACEMENT_REVIEW_CRM_VERSION = "mis-395-v1";

export function buildPlacementReviewCrmEnvelope({ review, eventType, occurredAt, consent = {} }) {
  if (!PLACEMENT_REVIEW_EVENT_TYPES.includes(eventType)) throw new Error("placement_review_event_invalid");
  const idempotencyKey = placementReviewOutboxKey(review, eventType);
  const finalLevel = ["confirmed", "adjusted"].includes(review.status) ? review.finalLevel : null;
  return {
    schemaVersion: PLACEMENT_REVIEW_CRM_SCHEMA,
    eventId: idempotencyKey,
    eventType,
    idempotencyKey,
    correlationId: review.correlationId,
    occurredAt,
    source: {
      product: "aitusa_refresh",
      surface: "staff_tool",
      employeeUrl: `/employee/placement-reviews?review=${review.id}`,
      version: PLACEMENT_REVIEW_CRM_VERSION,
    },
    placement: {
      reviewId: review.id,
      resultId: review.resultId,
      attemptId: review.attemptId,
      state: review.status,
      revision: Number(review.revision),
      ...(finalLevel ? { finalLevel } : {}),
    },
    consent: normalizeConsent(consent),
  };
}

export function placementReviewOutboxKey(review, eventType) {
  return `placement-review:${review.id}:revision:${Number(review.revision)}:${eventType}`;
}

export function validatePlacementReviewCrmEnvelope(envelope) {
  const errors = [];
  const top = ["schemaVersion", "eventId", "eventType", "idempotencyKey", "correlationId", "occurredAt", "source", "placement", "consent"];
  if (!recordWithOnly(envelope, top)) errors.push("placement_envelope_shape_invalid");
  if (envelope?.schemaVersion !== PLACEMENT_REVIEW_CRM_SCHEMA) errors.push("placement_schema_invalid");
  if (!PLACEMENT_REVIEW_EVENT_TYPES.includes(envelope?.eventType)) errors.push("placement_event_type_invalid");
  if (!opaqueId(envelope?.correlationId) || !opaqueId(envelope?.placement?.reviewId) || !opaqueId(envelope?.placement?.resultId) || !opaqueId(envelope?.placement?.attemptId)) errors.push("placement_ids_invalid");
  if (!recordWithOnly(envelope?.source, ["product", "surface", "employeeUrl", "version"]) || envelope?.source?.product !== "aitusa_refresh" || envelope?.source?.surface !== "staff_tool" || envelope?.source?.version !== PLACEMENT_REVIEW_CRM_VERSION || envelope?.source?.employeeUrl !== `/employee/placement-reviews?review=${envelope?.placement?.reviewId}`) errors.push("placement_source_invalid");
  const allowedPlacement = ["reviewId", "resultId", "attemptId", "state", "revision", "finalLevel"];
  if (!recordWithOnly(envelope?.placement, allowedPlacement) || !["pending", "in_review", "confirmed", "adjusted", "additional_review_required"].includes(envelope?.placement?.state)) errors.push("placement_state_invalid");
  if (!Number.isInteger(envelope?.placement?.revision) || envelope.placement.revision < 1) errors.push("placement_revision_invalid");
  const expectedKey = `placement-review:${envelope?.placement?.reviewId}:revision:${envelope?.placement?.revision}:${envelope?.eventType}`;
  if (envelope?.eventId !== expectedKey || envelope?.idempotencyKey !== expectedKey) errors.push("placement_idempotency_invalid");
  const expectedState = { placement_review_created: "pending", placement_review_started: "in_review", placement_review_confirmed: "confirmed", placement_review_adjusted: "adjusted", placement_review_additional_review_required: "additional_review_required" }[envelope?.eventType];
  if (expectedState !== envelope?.placement?.state) errors.push("placement_event_state_mismatch");
  if (["confirmed", "adjusted"].includes(envelope?.placement?.state) !== Boolean(envelope?.placement?.finalLevel) || (envelope?.placement?.finalLevel && (typeof envelope.placement.finalLevel !== "string" || envelope.placement.finalLevel.length > 120))) errors.push("placement_final_level_invalid");
  const consentKeys = ["communicationPreference", "disclosureVersion", "disclosureHash", "sourceUrl", "optInAction", "advisorContactEmail", "serviceSms", "marketingSms", "phoneCall", "whatsappContact", "verifiedEmail", "verifiedMobile"];
  if (!recordWithOnly(envelope?.consent, consentKeys)) errors.push("placement_consent_shape_invalid");
  if (envelope?.consent?.sourceUrl !== null && !cleanPath(envelope?.consent?.sourceUrl)) errors.push("placement_consent_source_url_invalid");
  return errors.length ? { ok: false, errors } : { ok: true };
}

function normalizeConsent(consent) {
  return {
    communicationPreference: ["email", "sms", "whatsapp", "phone"].includes(consent.communicationPreference) ? consent.communicationPreference : null,
    disclosureVersion: cleanOptional(consent.disclosureVersion),
    disclosureHash: cleanOptional(consent.disclosureHash),
    sourceUrl: cleanPath(consent.sourceUrl),
    optInAction: consent.optInAction === "explicit_checkbox" ? "explicit_checkbox" : null,
    advisorContactEmail: consent.advisorContactEmail === true,
    serviceSms: consent.serviceSms === true,
    marketingSms: consent.marketingSms === true,
    phoneCall: consent.phoneCall === true,
    whatsappContact: consent.whatsappContact === true,
    verifiedEmail: consent.verifiedEmail === true,
    verifiedMobile: consent.verifiedMobile === true,
  };
}
function cleanOptional(value) { return typeof value === "string" && value.length > 0 && value.length <= 160 ? value : null; }
function cleanPath(value) { return typeof value === "string" && /^\/[A-Za-z0-9/_?=.-]{1,280}$/.test(value) ? value : null; }
function opaqueId(value) { return typeof value === "string" && /^[0-9a-f-]{36}$/i.test(value); }
function recordWithOnly(value, keys) { return Boolean(value) && typeof value === "object" && !Array.isArray(value) && Object.keys(value).every((key) => keys.includes(key)) && keys.filter((key) => !["finalLevel"].includes(key)).every((key) => key in value); }
