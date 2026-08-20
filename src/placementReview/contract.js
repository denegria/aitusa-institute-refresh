export const PLACEMENT_REVIEW_BUSINESS_UNIT = "ait_usa";
export const PLACEMENT_REVIEW_STATUSES = Object.freeze([
  "pending",
  "in_review",
  "confirmed",
  "adjusted",
  "additional_review_required",
]);
export const PLACEMENT_REVIEW_ROLES = Object.freeze(["senior", "admin"]);
export const PLACEMENT_REVIEW_EVENT_TYPES = Object.freeze([
  "placement_review_created",
  "placement_review_started",
  "placement_review_confirmed",
  "placement_review_adjusted",
  "placement_review_additional_review_required",
]);
export const PLACEMENT_REVIEW_COPY = Object.freeze({
  recommended: "Nivel recomendado",
  pending: "Pendiente de confirmación",
  confirmed: "Nivel confirmado por AIT",
  additional: "Revisión adicional requerida",
});

export const REVIEW_TRANSITIONS = Object.freeze({
  pending: Object.freeze({ start: "in_review" }),
  in_review: Object.freeze({
    confirm: "confirmed",
    adjust: "adjusted",
    requestAdditionalReview: "additional_review_required",
  }),
  additional_review_required: Object.freeze({ start: "in_review" }),
  confirmed: Object.freeze({}),
  adjusted: Object.freeze({}),
});

export function isPlacementReviewRole(role) {
  return PLACEMENT_REVIEW_ROLES.includes(role);
}

export function isOpaqueReviewId(value) {
  return typeof value === "string" && /^[0-9a-f-]{36}$/i.test(value);
}
