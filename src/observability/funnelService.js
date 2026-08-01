import {
  FUNNEL_DURATION_BUCKETS,
  FUNNEL_EVENT_NAMES,
  FUNNEL_EVENT_VERSION,
  FUNNEL_RETENTION_BATCH_SIZE,
  FUNNEL_RETENTION_DAYS,
  FUNNEL_SAFE_OUTCOME_CODES,
  FUNNEL_SOURCES,
  FUNNEL_UTM_KEYS,
} from "./funnelContract.js";

const ALLOWED_FIELDS = new Set([
  "eventName", "eventVersion", "idempotencyKey", "correlationId", "source",
  "utmSource", "utmMedium", "utmCampaign", "utmTerm", "utmContent",
  "productContractVersion", "questionBankVersion", "answerKeyVersion",
  "levelMapVersion", "scoringContractVersion", "resultCopyVersion",
  "safeOutcomeCode", "durationBucket", "occurredAt",
]);
const REQUIRED_FIELDS = ["eventName", "idempotencyKey", "correlationId", "source", "occurredAt"];
const OPAQUE_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{7,127}$/;
const VERSION_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$/;
const UTM_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/;

export class FunnelContractError extends Error {
  constructor(code) {
    super(code);
    this.code = code;
  }
}

export function validateFunnelEvent(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new FunnelContractError("funnel_event_invalid");
  for (const key of Object.keys(input)) if (!ALLOWED_FIELDS.has(key)) throw new FunnelContractError("funnel_event_extra_field");
  for (const key of REQUIRED_FIELDS) if (!(key in input)) throw new FunnelContractError("funnel_event_required_field");
  if (!FUNNEL_EVENT_NAMES.includes(input.eventName)) throw new FunnelContractError("funnel_event_unknown");
  if ((input.eventVersion ?? FUNNEL_EVENT_VERSION) !== FUNNEL_EVENT_VERSION) throw new FunnelContractError("funnel_event_version_invalid");
  if (!OPAQUE_PATTERN.test(input.idempotencyKey) || !OPAQUE_PATTERN.test(input.correlationId)) throw new FunnelContractError("funnel_event_opaque_invalid");
  if (!FUNNEL_SOURCES.includes(input.source)) throw new FunnelContractError("funnel_event_source_invalid");
  if (input.safeOutcomeCode !== undefined && !FUNNEL_SAFE_OUTCOME_CODES.includes(input.safeOutcomeCode)) throw new FunnelContractError("funnel_event_outcome_invalid");
  if (input.durationBucket !== undefined && !FUNNEL_DURATION_BUCKETS.includes(input.durationBucket)) throw new FunnelContractError("funnel_event_duration_invalid");
  for (const key of FUNNEL_UTM_KEYS) if (input[key] !== undefined && (typeof input[key] !== "string" || !UTM_PATTERN.test(input[key]))) throw new FunnelContractError("funnel_event_utm_invalid");
  for (const key of ["productContractVersion", "questionBankVersion", "answerKeyVersion", "levelMapVersion", "scoringContractVersion", "resultCopyVersion"]) if (input[key] !== undefined && (typeof input[key] !== "string" || !VERSION_PATTERN.test(input[key]))) throw new FunnelContractError("funnel_event_version_value_invalid");
  const occurredAt = new Date(input.occurredAt);
  if (Number.isNaN(occurredAt.getTime())) throw new FunnelContractError("funnel_event_timestamp_invalid");
  return Object.freeze({ ...input, eventVersion: FUNNEL_EVENT_VERSION, occurredAt: occurredAt.toISOString() });
}

export function createFunnelLedgerService({ repository, now = () => new Date() }) {
  if (!repository) throw new Error("funnel_ledger_repository_required");
  return {
    async emit(input) {
      const event = validateFunnelEvent(input);
      const occurredAt = new Date(event.occurredAt);
      const expiresAt = new Date(occurredAt.getTime() + FUNNEL_RETENTION_DAYS * 86_400_000);
      const result = await repository.insert({ ...event, expiresAt: expiresAt.toISOString() });
      return { persisted: !result.replayed, replayed: Boolean(result.replayed), event: result.event };
    },
    async runRetention({ limit = FUNNEL_RETENTION_BATCH_SIZE } = {}) {
      const boundedLimit = Math.max(1, Math.min(Number.parseInt(limit, 10) || FUNNEL_RETENTION_BATCH_SIZE, FUNNEL_RETENTION_BATCH_SIZE));
      return repository.purgeExpired({ now: now(), limit: boundedLimit });
    },
  };
}
