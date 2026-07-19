import { createHash } from "node:crypto";
import {
  CONTACT_PERMISSION_COPY_ES,
  PRIVACY_POLICY_VERSION,
  SMS_CONSENT_COPY_ES,
  SMS_DISCLOSURE_ES,
  SMS_DISCLOSURE_VERSION,
  TERMS_VERSION,
} from "../legal/publicLegalContent.js";
import {
  buildCrmEventResponse,
  toCrmTimelineSummary,
  validateCrmEventEnvelope,
} from "../crm/eventContract.js";

export const LEAD_CONTACT_CONTRACT = Object.freeze({
  sourceKey: "aitusa-website-lead-v1",
  sourceName: "AIT USA Website Lead Form",
  sourcePathDefault: "/contactanos",
  crmDestination: "ait_crm",
  crmWrite: false,
  storageEnabled: false,
  wixFormsTarget: false,
  whatsappFallback: true,
  advisorConfirmationRequired: true,
  whatsappNumber: "+1 732-379-0593",
  whatsappHref: "https://wa.me/17323790593",
  minSubmitSeconds: 3,
  privacyPolicyVersion: PRIVACY_POLICY_VERSION,
  termsVersion: TERMS_VERSION,
  smsDisclosureVersion: SMS_DISCLOSURE_VERSION,
});

export const LEAD_REQUIRED_FIELDS = Object.freeze(["name", "interest"]);

export const LEAD_OPTIONAL_FIELDS = Object.freeze([
  "phone",
  "email",
  "city",
  "preferredMode",
  "preferredSchedule",
  "ageGroup",
  "message",
]);

export const LEAD_INTERESTS = Object.freeze([
  "ingles-presencial",
  "ingles-hibrido",
  "ingles-online",
  "kids",
  "ged",
  "computacion",
  "espanol",
  "curso-tecnico",
  "libro-inscripcion",
  "otro",
]);

export function getLeadContactConfig() {
  return {
    contract: LEAD_CONTACT_CONTRACT,
    requiredFields: LEAD_REQUIRED_FIELDS,
    optionalFields: LEAD_OPTIONAL_FIELDS,
    interests: LEAD_INTERESTS,
    consentCopy: {
      contactPermission: CONTACT_PERMISSION_COPY_ES,
      marketingSmsCheckbox: SMS_CONSENT_COPY_ES,
      marketingSmsDisclosure: SMS_DISCLOSURE_ES,
      marketingSmsDisclosureVersion: SMS_DISCLOSURE_VERSION,
      crmStorage:
        "AIT USA podra guardar mi solicitud en AIT CRM cuando el contrato de captura sea aprobado.",
    },
    successState: {
      label: "Solicitud preparada",
      copy:
        "Recibimos la informacion necesaria para preparar el seguimiento. En esta version no se guarda en CRM; puedes enviar el resumen por WhatsApp.",
    },
    errorState: {
      label: "Revisa la informacion",
      copy:
        "Falta informacion requerida o la solicitud parece automatizada. Corrige los datos antes de continuar.",
    },
    crmWrite: false,
  };
}

export function evaluateLeadContactSubmission(input = {}) {
  const validation = validateLeadContactInput(input);
  if (!validation.ok) {
    return {
      status: validation.status,
      body: {
        ok: false,
        errors: validation.errors,
        crmWrite: false,
        storageEnabled: false,
      },
    };
  }

  const submittedAt = input.submittedAt ?? new Date().toISOString();
  const sourcePath = normalizeSourcePath(input.source?.path);
  const advisorMessage = buildLeadAdvisorHandoffMessage({
    lead: input.lead,
    sourcePath,
  });
  const crmPayloadPreview = buildLeadCrmPayloadPreview({
    input,
    sourcePath,
    submittedAt,
  });
  const crmSyncPreview = buildLeadCrmSyncPreview({
    input,
    sourcePath,
    submittedAt,
    crmPayloadPreview,
  });

  return {
    status: 200,
    body: {
      ok: true,
      decision: {
        destination: "ait_crm_pending_endpoint",
        fallback: "whatsapp_advisor",
        wixForms: "not_target_for_refresh_repo",
      },
      advisorHandoff: {
        channel: "whatsapp",
        label: "Enviar solicitud por WhatsApp",
        message: advisorMessage,
        href: `${LEAD_CONTACT_CONTRACT.whatsappHref}?text=${encodeURIComponent(advisorMessage)}`,
        confirmationRequired: true,
      },
      crmPayloadPreview,
      crmSyncPreview,
      crmWrite: false,
      storageEnabled: false,
    },
  };
}

export function validateLeadContactInput(input = {}) {
  if (!isRecord(input)) {
    return {
      ok: false,
      status: 422,
      errors: ["request_body_invalid"],
    };
  }

  const errors = [];

  if (!isRecord(input.lead)) {
    errors.push("lead_required");
  } else {
    for (const field of LEAD_REQUIRED_FIELDS) {
      if (!isNonEmptyString(input.lead[field])) {
        errors.push(`lead_${field}_required`);
      }
    }

    if (
      isNonEmptyString(input.lead.interest) &&
      !LEAD_INTERESTS.includes(input.lead.interest)
    ) {
      errors.push("lead_interest_invalid");
    }

    if (
      isNonEmptyString(input.lead.email) &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.lead.email.trim())
    ) {
      errors.push("lead_email_invalid");
    }

    if (isNonEmptyString(input.lead.message) && input.lead.message.length > 800) {
      errors.push("lead_message_too_long");
    }
  }

  if (input.consent?.contactPermission !== true) {
    errors.push("contact_permission_consent_required");
  }

  if (
    input.submittedAt !== undefined &&
    input.submittedAt !== null &&
    (!isNonEmptyString(input.submittedAt) ||
      Number.isNaN(Date.parse(input.submittedAt)))
  ) {
    errors.push("submitted_at_invalid");
  }

  validateMarketingSmsConsent(input, errors);

  if (hasSpamSignal(input)) {
    errors.push("spam_signal_detected");
  }

  if (errors.length > 0) {
    return {
      ok: false,
      status: errors.includes("spam_signal_detected") ? 400 : 422,
      errors,
    };
  }

  return { ok: true, errors: [] };
}

export function buildLeadAdvisorHandoffMessage({ lead, sourcePath }) {
  return [
    "Hola AIT USA, quiero informacion para empezar.",
    `Nombre: ${lead.name}`,
    `WhatsApp/telefono: ${lead.phone || "No indicado"}`,
    lead.email ? `Email: ${lead.email}` : null,
    lead.city ? `Ciudad/Pais: ${lead.city}` : null,
    lead.ageGroup ? `Grupo de edad: ${lead.ageGroup}` : null,
    `Interes: ${lead.interest}`,
    lead.preferredMode ? `Formato preferido: ${lead.preferredMode}` : null,
    lead.preferredSchedule ? `Horario ideal: ${lead.preferredSchedule}` : null,
    lead.message ? `Mensaje: ${lead.message}` : null,
    `Origen: ${sourcePath}`,
    "Quiero que un asesor me ayude con nivel, horario y siguiente paso.",
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildLeadCrmPayloadPreview({ input, sourcePath, submittedAt }) {
  const lead = input.lead;
  return {
    sourceKey: LEAD_CONTACT_CONTRACT.sourceKey,
    sourceName: LEAD_CONTACT_CONTRACT.sourceName,
    sourcePath,
    submittedAt,
    crmDestination: LEAD_CONTACT_CONTRACT.crmDestination,
    crmWrite: false,
    storageEnabled: false,
    contactFieldsProvided: {
      name: Boolean(lead.name),
      phone: Boolean(lead.phone),
      email: Boolean(lead.email),
      city: Boolean(lead.city),
      ageGroup: Boolean(lead.ageGroup),
    },
    request: {
      interest: lead.interest,
      preferredMode: lead.preferredMode ?? null,
      preferredSchedule: lead.preferredSchedule ?? null,
      messageProvided: Boolean(lead.message),
      messageLength: lead.message?.length ?? 0,
    },
    consent: {
      contactPermission: input.consent.contactPermission === true,
      crmStorageApproved: false,
      marketingSmsOptIn: input.consent.marketingSmsOptIn === true,
      smsConsent: input.consent.marketingSmsOptIn === true,
      marketingSmsEvidence: input.consent.marketingSmsOptIn === true
        ? {
            disclosureVersion: input.consent.marketingSmsEvidence.disclosureVersion,
            sourcePath: input.consent.marketingSmsEvidence.sourcePath,
            consentedAt: input.consent.marketingSmsEvidence.consentedAt,
          }
        : null,
    },
  };
}

export function buildLeadCrmSyncPreview({
  input,
  sourcePath,
  submittedAt,
  crmPayloadPreview,
}) {
  const fingerprint = createSubmissionFingerprint(input);
  const envelope = {
    type: "lead_form_submitted",
    idempotencyKey: `public:lead:${fingerprint}:${submittedAt.slice(0, 10)}`,
    occurredAt: submittedAt,
    actor: {
      anonymousId: `lead_${fingerprint}`,
    },
    source: {
      surface: "public_site",
      path: sourcePath,
      referrer: input.source?.referrer,
      campaign: input.source?.campaign,
    },
    consent: {
      basis: "explicit",
      policyVersion: PRIVACY_POLICY_VERSION,
    },
    payload: {
      summary: `Lead form submitted: ${input.lead.interest}`,
      sourceKey: LEAD_CONTACT_CONTRACT.sourceKey,
      destination: "ait_crm_pending_endpoint",
      fallback: "whatsapp_advisor",
      interest: input.lead.interest,
      preferredMode: input.lead.preferredMode ?? null,
      preferredSchedule: input.lead.preferredSchedule ?? null,
      contactFieldsProvided: crmPayloadPreview.contactFieldsProvided,
      messageProvided: crmPayloadPreview.request.messageProvided,
      messageLength: crmPayloadPreview.request.messageLength,
      contactPermission: true,
      crmStorageApproved: false,
      marketingSmsOptIn: input.consent.marketingSmsOptIn === true,
      smsConsent: input.consent.marketingSmsOptIn === true,
      marketingSmsDisclosureVersion:
        input.consent.marketingSmsOptIn === true
          ? input.consent.marketingSmsEvidence.disclosureVersion
          : null,
      marketingSmsSourcePath:
        input.consent.marketingSmsOptIn === true
          ? input.consent.marketingSmsEvidence.sourcePath
          : null,
      marketingSmsConsentedAt:
        input.consent.marketingSmsOptIn === true
          ? input.consent.marketingSmsEvidence.consentedAt
          : null,
    },
  };

  const response = buildCrmEventResponse(envelope);
  if (!response.body.accepted) return response.body;

  const validation = validateCrmEventEnvelope(envelope);
  return {
    ...response.body,
    crmTimelinePreview: toCrmTimelineSummary(validation.event),
  };
}

export function createSubmissionFingerprint(input) {
  const stable = [
    input.lead?.name,
    input.lead?.phone,
    input.lead?.email,
    input.lead?.interest,
  ]
    .filter(Boolean)
    .map((value) => String(value).trim().toLowerCase())
    .join("|");

  return createHash("sha256").update(stable).digest("hex").slice(0, 20);
}

function hasSpamSignal(input) {
  if (isNonEmptyString(input.honeypot)) return true;
  if (isNonEmptyString(input.companyWebsite)) return true;

  if (
    isNonEmptyString(input.startedAt) &&
    isNonEmptyString(input.submittedAt)
  ) {
    const started = Date.parse(input.startedAt);
    const submitted = Date.parse(input.submittedAt);
    if (
      Number.isFinite(started) &&
      Number.isFinite(submitted) &&
      submitted - started < LEAD_CONTACT_CONTRACT.minSubmitSeconds * 1000
    ) {
      return true;
    }
  }

  return false;
}

function validateMarketingSmsConsent(input, errors) {
  const optedIn = input.consent?.marketingSmsOptIn === true;
  const evidence = input.consent?.marketingSmsEvidence;

  if (
    Object.prototype.hasOwnProperty.call(input.consent || {}, "smsConsent") &&
    input.consent.smsConsent !== optedIn
  ) {
    errors.push("sms_consent_alias_mismatch");
  }

  if (!optedIn) {
    if (evidence !== null && evidence !== undefined) {
      errors.push("marketing_sms_evidence_without_opt_in");
    }
    return;
  }

  if (!isNonEmptyString(input.lead?.phone)) {
    errors.push("marketing_sms_phone_required");
  }

  if (!isRecord(evidence)) {
    errors.push("marketing_sms_evidence_required");
    return;
  }

  if (evidence.disclosureVersion !== SMS_DISCLOSURE_VERSION) {
    errors.push("marketing_sms_disclosure_version_invalid");
  }

  const evidencePath = normalizeSourcePath(evidence.sourcePath);
  const requestPath = normalizeSourcePath(input.source?.path);
  if (evidencePath !== requestPath) {
    errors.push("marketing_sms_source_path_mismatch");
  }

  if (
    !isNonEmptyString(evidence.consentedAt) ||
    Number.isNaN(Date.parse(evidence.consentedAt))
  ) {
    errors.push("marketing_sms_consented_at_invalid");
  }
}

function normalizeSourcePath(path) {
  if (!isNonEmptyString(path)) return LEAD_CONTACT_CONTRACT.sourcePathDefault;
  const trimmed = path.trim();
  if (!trimmed.startsWith("/")) return LEAD_CONTACT_CONTRACT.sourcePathDefault;
  return trimmed.slice(0, 120);
}

function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}
