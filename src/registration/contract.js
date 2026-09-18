export const REGISTRATION_DRAFT_KEY = "aitusa:registration:v1";
export const ENGLISH_PROGRAM_SLUGS = Object.freeze(new Set([
  "ingles-jovenes-adultos",
  "ingles-online-adultos",
  "ingles-hibrido-adultos",
]));

export class RegistrationExperienceError extends Error {
  constructor(code, status = 400, message = "No pudimos continuar con la inscripción.") {
    super(message);
    this.name = "RegistrationExperienceError";
    this.code = code;
    this.status = status;
  }
}

export function assertPublicRegistrationSubmission(input = {}, now = Date.now()) {
  if (String(input.website || '').trim()) {
    throw new RegistrationExperienceError('registration_request_rejected', 400);
  }
  const startedAt = Number(input.startedAt);
  if (!Number.isFinite(startedAt) || startedAt > now || now - startedAt < 1_500 || now - startedAt > 24 * 60 * 60 * 1000) {
    throw new RegistrationExperienceError('registration_session_invalid', 400);
  }
}

export function programCodeForContext(value) {
  const context = String(value || "english_program").trim().toLowerCase();
  return context === "english_program" || ENGLISH_PROGRAM_SLUGS.has(context)
    ? "english_program"
    : context;
}

export function safeRegistrationResponse(payload = {}) {
  if (payload.quote?.status === "advisor_required") {
    return { state: "advisor_required", reason: payload.quote.reason || "advisor_required" };
  }
  return {
    state: "quoted",
    quote: payload.quote ? {
      status: payload.quote.status,
      lines: Array.isArray(payload.quote.lines) ? payload.quote.lines.map((line) => ({
        code: line.code,
        label: line.label,
        amount: line.amount,
        currency: line.currency,
      })) : [],
      total: payload.quote.total,
      currency: payload.quote.currency,
      region: payload.quote.regionalPricing?.region || null,
    } : null,
    fulfillment: payload.fulfillment ? {
      deliveryMode: payload.fulfillment.deliveryMode,
      requiresPhysicalDelivery: payload.fulfillment.requiresPhysicalDelivery === true,
      requiresDigitalDelivery: payload.fulfillment.requiresDigitalDelivery === true,
    } : null,
  };
}

export function normalizeRegistrationInput(input = {}) {
  const clean = (value, max = 180) => String(value || "").trim().slice(0, max);
  const student = {
    name: clean(input.student?.name, 120),
    email: clean(input.student?.email, 254).toLowerCase(),
    phone: clean(input.student?.phone, 32),
  };
  const payer = input.separatePayer ? {
    name: clean(input.payer?.name, 120),
    email: clean(input.payer?.email, 254).toLowerCase(),
    phone: clean(input.payer?.phone, 32),
  } : null;
  const shippingAddress = input.shippingAddress ? {
    recipientName: clean(input.shippingAddress.recipientName, 120),
    addressLine1: clean(input.shippingAddress.addressLine1, 160),
    addressLine2: clean(input.shippingAddress.addressLine2, 160),
    city: clean(input.shippingAddress.city, 100),
    state: clean(input.shippingAddress.state, 2).toUpperCase(),
    postalCode: clean(input.shippingAddress.postalCode, 10),
    countryCode: "US",
  } : undefined;
  return {
    idempotencyKey: clean(input.idempotencyKey, 160),
    sourceReference: clean(input.sourceReference || "public-site:/inscribete", 180),
    programCode: programCodeForContext(input.programCode),
    residenceCountryCode: clean(input.residenceCountryCode, 2).toUpperCase(),
    billingCountryCode: clean(input.billingCountryCode || input.residenceCountryCode, 2).toUpperCase(),
    learningModality: clean(input.learningModality, 24).toLowerCase(),
    includeTuitionPrepayment: input.includeTuitionPrepayment === true,
    student,
    payer,
    shippingAddress,
  };
}
