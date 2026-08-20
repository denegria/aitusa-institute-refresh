import { SENSITIVE_DATA_FIELD_NAMES } from "../privacy/privacyPolicy.js";

export const CRM_EVENT_TYPES = Object.freeze({
  lead_form_submitted: Object.freeze({
    label: "Lead form submitted",
    surfaces: ["public_site"],
    crmEffect: "timeline_entry",
  }),
  placement_started: Object.freeze({
    label: "Placement started",
    surfaces: ["public_site", "portal"],
    crmEffect: "timeline_entry",
  }),
  placement_completed: Object.freeze({
    label: "Placement completed",
    surfaces: ["public_site", "portal"],
    crmEffect: "timeline_entry_and_task",
  }),
  placement_review_created: Object.freeze({ label: "Placement review created", surfaces: ["staff_tool", "portal"], crmEffect: "timeline_entry_and_task" }),
  placement_review_started: Object.freeze({ label: "Placement review started", surfaces: ["staff_tool"], crmEffect: "timeline_entry" }),
  placement_review_confirmed: Object.freeze({ label: "Placement review confirmed", surfaces: ["staff_tool"], crmEffect: "timeline_entry_and_progress" }),
  placement_review_adjusted: Object.freeze({ label: "Placement review adjusted", surfaces: ["staff_tool"], crmEffect: "timeline_entry_and_progress" }),
  placement_review_additional_review_required: Object.freeze({ label: "Placement review needs more review", surfaces: ["staff_tool"], crmEffect: "timeline_entry_and_task" }),
  whatsapp_cta_clicked: Object.freeze({
    label: "WhatsApp CTA clicked",
    surfaces: ["public_site"],
    crmEffect: "timeline_entry",
  }),
  portal_sign_in: Object.freeze({
    label: "Portal sign-in",
    surfaces: ["portal"],
    crmEffect: "timeline_entry",
  }),
  lesson_viewed: Object.freeze({
    label: "Lesson viewed",
    surfaces: ["portal"],
    crmEffect: "timeline_entry",
  }),
  lesson_completed: Object.freeze({
    label: "Lesson completed",
    surfaces: ["portal"],
    crmEffect: "timeline_entry_and_progress",
  }),
  ai_practice_started: Object.freeze({
    label: "AI practice started",
    surfaces: ["portal"],
    crmEffect: "safe_summary_only",
  }),
  ai_practice_completed: Object.freeze({
    label: "AI practice completed",
    surfaces: ["portal"],
    crmEffect: "safe_summary_only",
  }),
  attendance_scan: Object.freeze({
    label: "Attendance scan",
    surfaces: ["portal", "staff_tool"],
    crmEffect: "timeline_entry_and_attendance",
  }),
  payment_started: Object.freeze({
    label: "Payment started",
    surfaces: ["portal"],
    crmEffect: "ledger_timeline_entry",
  }),
  payment_completed: Object.freeze({
    label: "Payment completed",
    surfaces: ["portal"],
    crmEffect: "ledger_timeline_entry_and_receipt",
  }),
  payment_failed: Object.freeze({
    label: "Payment failed",
    surfaces: ["portal"],
    crmEffect: "ledger_timeline_entry_and_task",
  }),
  profile_updated: Object.freeze({
    label: "Profile updated",
    surfaces: ["portal"],
    crmEffect: "timeline_entry",
  }),
});

export const CRM_EVENT_TYPE_NAMES = Object.freeze(Object.keys(CRM_EVENT_TYPES));

const ALLOWED_CONSENT_BASES = new Set([
  "explicit",
  "contract",
  "legitimate_interest",
  "not_required",
]);

const SENSITIVE_FIELD_NAMES = new Set(SENSITIVE_DATA_FIELD_NAMES);

const IDEMPOTENCY_KEY_PATTERN = /^[A-Za-z0-9._:-]{12,160}$/;

export function validateCrmEventEnvelope(envelope) {
  const errors = [];

  if (!isRecord(envelope)) {
    return invalid(["event_envelope_required"]);
  }

  const definition = CRM_EVENT_TYPES[envelope.type];
  if (!definition) {
    errors.push("unsupported_event_type");
  }

  if (!IDEMPOTENCY_KEY_PATTERN.test(envelope.idempotencyKey ?? "")) {
    errors.push("idempotency_key_required");
  }

  if (!isIsoDate(envelope.occurredAt)) {
    errors.push("occurred_at_required");
  }

  if (!isRecord(envelope.source)) {
    errors.push("source_required");
  } else {
    if (!definition?.surfaces.includes(envelope.source.surface)) {
      errors.push("source_surface_not_allowed");
    }
    if (!isNonEmptyString(envelope.source.path)) {
      errors.push("source_path_required");
    }
  }

  if (!isRecord(envelope.consent)) {
    errors.push("consent_required");
  } else if (!ALLOWED_CONSENT_BASES.has(envelope.consent.basis)) {
    errors.push("consent_basis_invalid");
  }

  if (!isRecord(envelope.actor)) {
    errors.push("actor_required");
  } else if (
    !isNonEmptyString(envelope.actor.crmContactRef) &&
    !isNonEmptyString(envelope.actor.portalAccountId) &&
    !isNonEmptyString(envelope.actor.anonymousId)
  ) {
    errors.push("actor_reference_required");
  }

  const sensitiveField = findSensitiveField(envelope.payload ?? {});
  if (sensitiveField) {
    errors.push(`sensitive_payload_field:${sensitiveField}`);
  }

  if (errors.length > 0) {
    return invalid(errors);
  }

  return {
    ok: true,
    event: normalizeCrmEvent(envelope, definition),
  };
}

export function buildCrmEventResponse(envelope) {
  const validation = validateCrmEventEnvelope(envelope);

  if (!validation.ok) {
    return {
      status: 422,
      body: {
        accepted: false,
        errors: validation.errors,
        crmWrite: false,
      },
    };
  }

  return {
    status: 202,
    body: {
      accepted: true,
      event: validation.event,
      delivery: {
        mode: "local_contract_stub",
        crmWrite: false,
        retry: "not_configured_until_crm_contract_approval",
      },
    },
  };
}

export function toCrmTimelineSummary(event) {
  return {
    crmContactRef: event.actor.crmContactRef ?? null,
    eventType: event.type,
    label: event.definition.label,
    occurredAt: event.occurredAt,
    source: event.source,
    crmEffect: event.definition.crmEffect,
    summary: event.payload.summary ?? event.definition.label,
  };
}

function normalizeCrmEvent(envelope, definition) {
  return {
    type: envelope.type,
    idempotencyKey: envelope.idempotencyKey,
    occurredAt: envelope.occurredAt,
    actor: pickDefined({
      crmContactRef: envelope.actor.crmContactRef,
      portalAccountId: envelope.actor.portalAccountId,
      anonymousId: envelope.actor.anonymousId,
      role: envelope.actor.role,
    }),
    source: pickDefined({
      surface: envelope.source.surface,
      path: envelope.source.path,
      referrer: envelope.source.referrer,
      campaign: envelope.source.campaign,
    }),
    consent: pickDefined({
      basis: envelope.consent.basis,
      policyVersion: envelope.consent.policyVersion,
    }),
    payload: sanitizePayload(envelope.payload ?? {}),
    definition,
  };
}

function sanitizePayload(payload) {
  const output = {};
  for (const [key, value] of Object.entries(payload)) {
    if (SENSITIVE_FIELD_NAMES.has(key)) continue;
    if (isRecord(value)) {
      output[key] = sanitizePayload(value);
    } else if (Array.isArray(value)) {
      output[key] = value.map((item) => (isRecord(item) ? sanitizePayload(item) : item));
    } else {
      output[key] = value;
    }
  }
  return output;
}

function findSensitiveField(value) {
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findSensitiveField(item);
      if (found) return found;
    }
    return null;
  }

  if (!isRecord(value)) return null;

  for (const [key, nested] of Object.entries(value)) {
    if (SENSITIVE_FIELD_NAMES.has(key)) return key;
    const found = findSensitiveField(nested);
    if (found) return found;
  }
  return null;
}

function invalid(errors) {
  return { ok: false, errors };
}

function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isIsoDate(value) {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

function pickDefined(input) {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined && value !== null),
  );
}
