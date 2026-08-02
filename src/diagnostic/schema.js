import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import {
  CLAIM_STATUSES,
  DIAGNOSTIC_STATUSES,
  RESULT_STATUSES,
} from "./contract.js";
import {
  PORTAL_AUTH_DECISIONS,
  PORTAL_AUTH_EVENT_TYPES,
  PORTAL_AUTH_OUTCOMES,
} from "../portalAuth/contract.js";
import {
  FUNNEL_DURATION_BUCKETS,
  FUNNEL_EVENT_NAMES,
  FUNNEL_EVENT_VERSION,
  FUNNEL_SAFE_OUTCOME_CODES,
  FUNNEL_SOURCES,
} from "../observability/funnelContract.js";

const statusList = (values) => sql.raw(values.map((value) => `'${value}'`).join(", "));

export const portalAccounts = pgTable(
  "portal_accounts",
  {
    id: uuid("id").primaryKey(),
    workosUserId: text("workos_user_id").notNull(),
    status: text("status").notNull().default("active"),
    accountType: text("account_type").notNull().default("adult_student"),
    firstName: text("first_name").notNull(),
    primaryEmail: text("primary_email").notNull(),
    preferredLanguage: text("preferred_language").notNull().default("es"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    lastSignedInAt: timestamp("last_signed_in_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("portal_accounts_workos_user_id_uidx").on(table.workosUserId),
    uniqueIndex("portal_accounts_primary_email_uidx").on(table.primaryEmail),
    check(
      "portal_accounts_status_check",
      sql`${table.status} in ('active', 'locked', 'disabled', 'merged', 'deleted')`,
    ),
    check(
      "portal_accounts_type_check",
      sql`${table.accountType} in ('adult_student', 'guardian')`,
    ),
  ],
);

export const portalAuthEvents = pgTable(
  "portal_auth_events",
  {
    id: uuid("id").primaryKey(),
    eventType: text("event_type").notNull(),
    keyVersion: text("key_version").notNull(),
    emailKeyHash: text("email_key_hash").notNull(),
    ipKeyHash: text("ip_key_hash").notNull(),
    decision: text("decision").notNull(),
    outcome: text("outcome").notNull().default("pending"),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    index("portal_auth_events_email_window_idx").on(
      table.eventType,
      table.keyVersion,
      table.emailKeyHash,
      table.occurredAt,
    ),
    index("portal_auth_events_ip_window_idx").on(
      table.eventType,
      table.keyVersion,
      table.ipKeyHash,
      table.occurredAt,
    ),
    index("portal_auth_events_expiry_idx").on(table.expiresAt),
    check(
      "portal_auth_events_type_check",
      sql`${table.eventType} in (${statusList(PORTAL_AUTH_EVENT_TYPES)})`,
    ),
    check(
      "portal_auth_events_decision_check",
      sql`${table.decision} in (${statusList(PORTAL_AUTH_DECISIONS)})`,
    ),
    check(
      "portal_auth_events_outcome_check",
      sql`${table.outcome} in (${statusList(PORTAL_AUTH_OUTCOMES)})`,
    ),
    check(
      "portal_auth_events_email_hash_check",
      sql`char_length(${table.emailKeyHash}) = 64`,
    ),
    check(
      "portal_auth_events_ip_hash_check",
      sql`char_length(${table.ipKeyHash}) = 64`,
    ),
    check(
      "portal_auth_events_retention_check",
      sql`${table.expiresAt} > ${table.occurredAt} and ${table.expiresAt} <= ${table.occurredAt} + interval '8 days'`,
    ),
  ],
);

export const diagnosticAttempts = pgTable(
  "diagnostic_attempts",
  {
    id: uuid("id").primaryKey(),
    requestId: text("request_id").notNull(),
    status: text("status").notNull().default("started"),
    revision: integer("revision").notNull().default(0),
    resumeTokenHash: text("resume_token_hash").notNull(),
    productContractVersion: text("product_contract_version").notNull(),
    questionBankVersion: text("question_bank_version").notNull(),
    answerKeyVersion: text("answer_key_version").notNull(),
    levelMapVersion: text("level_map_version").notNull(),
    scoringContractVersion: text("scoring_contract_version").notNull(),
    resultCopyVersion: text("result_copy_version").notNull(),
    completionId: text("completion_id"),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
    lastActivityAt: timestamp("last_activity_at", { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    claimedAt: timestamp("claimed_at", { withTimezone: true }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    rawAnswersPurgeAt: timestamp("raw_answers_purge_at", { withTimezone: true }),
    claimedAccountId: uuid("claimed_account_id").references(() => portalAccounts.id, {
      onDelete: "set null",
    }),
    claimedChildProfileId: uuid("claimed_child_profile_id"),
  },
  (table) => [
    uniqueIndex("diagnostic_attempts_request_id_uidx").on(table.requestId),
    uniqueIndex("diagnostic_attempts_resume_token_hash_uidx").on(table.resumeTokenHash),
    uniqueIndex("diagnostic_attempts_completion_id_uidx").on(table.completionId),
    index("diagnostic_attempts_expiry_idx").on(table.expiresAt, table.status),
    index("diagnostic_attempts_raw_purge_idx").on(table.rawAnswersPurgeAt),
    check(
      "diagnostic_attempts_status_check",
      sql`${table.status} in (${statusList(DIAGNOSTIC_STATUSES)})`,
    ),
    check("diagnostic_attempts_revision_check", sql`${table.revision} >= 0`),
  ],
);

export const diagnosticAnswers = pgTable(
  "diagnostic_answers",
  {
    attemptId: uuid("attempt_id")
      .notNull()
      .references(() => diagnosticAttempts.id, { onDelete: "cascade" }),
    questionKey: text("question_key").notNull(),
    answerState: text("answer_state").notNull(),
    answerValue: text("answer_value"),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.attemptId, table.questionKey] }),
    check(
      "diagnostic_answers_state_check",
      sql`${table.answerState} in ('answered', 'skipped')`,
    ),
    check(
      "diagnostic_answers_value_check",
      sql`(${table.answerState} = 'answered' and ${table.answerValue} is not null) or (${table.answerState} = 'skipped' and ${table.answerValue} is null)`,
    ),
  ],
);

export const diagnosticMutations = pgTable(
  "diagnostic_mutations",
  {
    attemptId: uuid("attempt_id")
      .notNull()
      .references(() => diagnosticAttempts.id, { onDelete: "cascade" }),
    mutationId: text("mutation_id").notNull(),
    revisionAfter: integer("revision_after").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.attemptId, table.mutationId] }),
    check("diagnostic_mutations_revision_check", sql`${table.revisionAfter} > 0`),
  ],
);

export const diagnosticContexts = pgTable("diagnostic_contexts", {
  attemptId: uuid("attempt_id")
    .primaryKey()
    .references(() => diagnosticAttempts.id, { onDelete: "cascade" }),
  goal: text("goal").notNull(),
  selfAssessment: jsonb("self_assessment").notNull(),
  writingSample: text("writing_sample"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const diagnosticResults = pgTable(
  "diagnostic_results",
  {
    id: uuid("id").primaryKey(),
    attemptId: uuid("attempt_id")
      .notNull()
      .references(() => diagnosticAttempts.id, { onDelete: "cascade" }),
    productContractVersion: text("product_contract_version").notNull(),
    questionBankVersion: text("question_bank_version").notNull(),
    answerKeyVersion: text("answer_key_version").notNull(),
    levelMapVersion: text("level_map_version").notNull(),
    scoringContractVersion: text("scoring_contract_version").notNull(),
    resultCopyVersion: text("result_copy_version").notNull(),
    resultStatus: text("result_status").notNull().default("provisional"),
    recommendedLevelKey: text("recommended_level_key").notNull(),
    recommendedLevelLabel: text("recommended_level_label").notNull(),
    quizScore: integer("quiz_score").notNull(),
    answeredQuestionCount: integer("answered_question_count").notNull(),
    skippedQuestionCount: integer("skipped_question_count").notNull(),
    scoreSummary: jsonb("score_summary").notNull(),
    responsePayload: jsonb("response_payload").notNull(),
    advisorConfirmationRequired: integer("advisor_confirmation_required")
      .notNull()
      .default(1),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("diagnostic_results_attempt_id_uidx").on(table.attemptId),
    check(
      "diagnostic_results_status_check",
      sql`${table.resultStatus} in (${statusList(RESULT_STATUSES)})`,
    ),
    check("diagnostic_results_quiz_score_check", sql`${table.quizScore} >= 0`),
    check(
      "diagnostic_results_advisor_check",
      sql`${table.advisorConfirmationRequired} in (0, 1)`,
    ),
  ],
);

export const resultClaims = pgTable(
  "result_claims",
  {
    id: uuid("id").primaryKey(),
    attemptId: uuid("attempt_id")
      .notNull()
      .references(() => diagnosticAttempts.id, { onDelete: "cascade" }),
    claimTokenHash: text("claim_token_hash").notNull(),
    status: text("status").notNull().default("pending"),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    consumedAt: timestamp("consumed_at", { withTimezone: true }),
    claimedAccountId: uuid("claimed_account_id").references(() => portalAccounts.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("result_claims_token_hash_uidx").on(table.claimTokenHash),
    index("result_claims_attempt_status_idx").on(table.attemptId, table.status),
    index("result_claims_expiry_idx").on(table.expiresAt, table.status),
    check(
      "result_claims_status_check",
      sql`${table.status} in (${statusList(CLAIM_STATUSES)})`,
    ),
  ],
);

export const portalAuthChallenges = pgTable(
  "portal_auth_challenges",
  {
    id: uuid("id").primaryKey(),
    claimId: text("claim_id").notNull(),
    attemptId: uuid("attempt_id")
      .notNull()
      .references(() => diagnosticAttempts.id, { onDelete: "cascade" }),
    resultClaimId: uuid("result_claim_id")
      .notNull()
      .references(() => resultClaims.id, { onDelete: "cascade" }),
    status: text("status").notNull().default("pending"),
    email: text("email").notNull(),
    firstName: text("first_name").notNull(),
    providerChallengeId: text("provider_challenge_id").notNull(),
    providerUserId: text("provider_user_id"),
    accountType: text("account_type").notNull().default("adult_student"),
    advisorContactRequested: boolean("advisor_contact_requested")
      .notNull()
      .default(false),
    privacyPolicyVersion: text("privacy_policy_version").notNull(),
    termsVersion: text("terms_version").notNull(),
    disclosureHash: text("disclosure_hash").notNull(),
    advisorDisclosureHash: text("advisor_disclosure_hash").notNull(),
    attribution: jsonb("attribution").notNull().default({}),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
    consumedAt: timestamp("consumed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("portal_auth_challenges_claim_id_uidx").on(table.claimId),
    uniqueIndex("portal_auth_challenges_provider_id_uidx").on(
      table.providerChallengeId,
    ),
    index("portal_auth_challenges_expiry_idx").on(table.expiresAt, table.status),
    check(
      "portal_auth_challenges_status_check",
      sql`${table.status} in ('pending', 'verified', 'consumed', 'expired', 'cancelled')`,
    ),
    check(
      "portal_auth_challenges_type_check",
      sql`${table.accountType} in ('adult_student', 'guardian')`,
    ),
  ],
);

export const consentRecords = pgTable(
  "consent_records",
  {
    id: uuid("id").primaryKey(),
    accountId: uuid("account_id")
      .notNull()
      .references(() => portalAccounts.id, { onDelete: "cascade" }),
    attemptId: uuid("attempt_id").references(() => diagnosticAttempts.id, {
      onDelete: "set null",
    }),
    purpose: text("purpose").notNull(),
    channel: text("channel").notNull(),
    decision: boolean("decision").notNull(),
    policyVersion: text("policy_version").notNull(),
    disclosureHash: text("disclosure_hash").notNull(),
    captureMethod: text("capture_method").notNull(),
    correlationId: text("correlation_id").notNull(),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("consent_records_correlation_purpose_uidx").on(
      table.correlationId,
      table.purpose,
    ),
    index("consent_records_account_idx").on(table.accountId, table.occurredAt),
  ],
);

export const guardianConsentChallenges = pgTable(
  "guardian_consent_challenges",
  {
    id: uuid("id").primaryKey(),
    requestId: text("request_id").notNull(),
    status: text("status").notNull().default("pending"),
    guardianFirstName: text("guardian_first_name").notNull(),
    guardianEmail: text("guardian_email").notNull(),
    providerChallengeId: text("provider_challenge_id").notNull(),
    providerUserId: text("provider_user_id"),
    guardianAttested: boolean("guardian_attested").notNull(),
    noticeAccepted: boolean("notice_accepted").notNull(),
    aiPracticeApproved: boolean("ai_practice_approved").notNull().default(false),
    advisorContactApproved: boolean("advisor_contact_approved").notNull().default(false),
    policyVersion: text("policy_version").notNull(),
    noticeHash: text("notice_hash").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
    consumedAt: timestamp("consumed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("guardian_consent_challenges_request_uidx").on(table.requestId),
    uniqueIndex("guardian_consent_challenges_provider_uidx").on(table.providerChallengeId),
    index("guardian_consent_challenges_expiry_idx").on(table.expiresAt, table.status),
    check("guardian_consent_challenges_status_check", sql`${table.status} in ('pending', 'verified', 'consumed', 'expired', 'cancelled')`),
    check("guardian_consent_challenges_attestation_check", sql`${table.guardianAttested} = true and ${table.noticeAccepted} = true`),
  ],
);

export const childProfiles = pgTable(
  "child_profiles",
  {
    id: uuid("id").primaryKey(),
    firstName: text("first_name").notNull(),
    ageBand: text("age_band").notNull(),
    status: text("status").notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    check("child_profiles_age_band_check", sql`${table.ageBand} = 'under_13'`),
    check("child_profiles_status_check", sql`${table.status} in ('active', 'unlinked', 'deletion_requested', 'deleted')`),
  ],
);

export const guardianChildLinks = pgTable(
  "guardian_child_links",
  {
    id: uuid("id").primaryKey(),
    guardianAccountId: uuid("guardian_account_id").notNull().references(() => portalAccounts.id, { onDelete: "cascade" }),
    childProfileId: uuid("child_profile_id").notNull().references(() => childProfiles.id, { onDelete: "cascade" }),
    status: text("status").notNull().default("active"),
    linkedAt: timestamp("linked_at", { withTimezone: true }).notNull(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("guardian_child_links_child_uidx").on(table.childProfileId),
    index("guardian_child_links_guardian_idx").on(table.guardianAccountId, table.status),
    check("guardian_child_links_status_check", sql`${table.status} in ('active', 'revoked')`),
  ],
);

export const guardianConsentReceipts = pgTable(
  "guardian_consent_receipts",
  {
    id: uuid("id").primaryKey(),
    challengeId: uuid("challenge_id").notNull().references(() => guardianConsentChallenges.id, { onDelete: "restrict" }),
    guardianAccountId: uuid("guardian_account_id").notNull().references(() => portalAccounts.id, { onDelete: "restrict" }),
    childProfileId: uuid("child_profile_id").notNull().references(() => childProfiles.id, { onDelete: "restrict" }),
    receiptCode: text("receipt_code").notNull(),
    status: text("status").notNull().default("active"),
    policyVersion: text("policy_version").notNull(),
    noticeHash: text("notice_hash").notNull(),
    verificationMethod: text("verification_method").notNull(),
    permissions: jsonb("permissions").notNull(),
    capturedAt: timestamp("captured_at", { withTimezone: true }).notNull(),
    withdrawnAt: timestamp("withdrawn_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("guardian_consent_receipts_challenge_uidx").on(table.challengeId),
    uniqueIndex("guardian_consent_receipts_code_uidx").on(table.receiptCode),
    index("guardian_consent_receipts_guardian_idx").on(table.guardianAccountId, table.capturedAt),
    check("guardian_consent_receipts_status_check", sql`${table.status} in ('active', 'withdrawn', 'deletion_requested')`),
    check("guardian_consent_receipts_method_check", sql`${table.verificationMethod} = 'verified_email_plus_attestation'`),
  ],
);

export const crmOutbox = pgTable(
  "crm_outbox",
  {
    id: uuid("id").primaryKey(),
    eventType: text("event_type").notNull(),
    idempotencyKey: text("idempotency_key").notNull(),
    correlationId: text("correlation_id").notNull(),
    payload: jsonb("payload").notNull(),
    status: text("status").notNull().default("pending"),
    attemptCount: integer("attempt_count").notNull().default(0),
    nextAttemptAt: timestamp("next_attempt_at", { withTimezone: true }).notNull(),
    safeErrorCode: text("safe_error_code"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    deliveredAt: timestamp("delivered_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("crm_outbox_idempotency_key_uidx").on(table.idempotencyKey),
    index("crm_outbox_delivery_idx").on(
      table.status,
      table.nextAttemptAt,
      table.createdAt,
    ),
    check(
      "crm_outbox_status_check",
      sql`${table.status} in ('pending', 'delivering', 'delivered', 'retry_wait', 'dead_letter')`,
    ),
    check("crm_outbox_attempt_count_check", sql`${table.attemptCount} >= 0`),
  ],
);

export const funnelEventLedger = pgTable(
  "funnel_event_ledger",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    eventName: text("event_name").notNull(),
    eventVersion: integer("event_version").notNull().default(FUNNEL_EVENT_VERSION),
    idempotencyKey: text("idempotency_key").notNull(),
    correlationId: text("correlation_id").notNull(),
    source: text("source").notNull(),
    utmSource: text("utm_source"), utmMedium: text("utm_medium"), utmCampaign: text("utm_campaign"), utmTerm: text("utm_term"), utmContent: text("utm_content"),
    productContractVersion: text("product_contract_version"), questionBankVersion: text("question_bank_version"), answerKeyVersion: text("answer_key_version"),
    levelMapVersion: text("level_map_version"), scoringContractVersion: text("scoring_contract_version"), resultCopyVersion: text("result_copy_version"),
    safeOutcomeCode: text("safe_outcome_code"), durationBucket: text("duration_bucket"),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("funnel_event_ledger_idempotency_uidx").on(table.idempotencyKey),
    index("funnel_event_ledger_retention_idx").on(table.expiresAt),
    index("funnel_event_ledger_correlation_idx").on(table.correlationId, table.occurredAt),
    check("funnel_event_ledger_name_check", sql`${table.eventName} in (${statusList(FUNNEL_EVENT_NAMES)})`),
    check("funnel_event_ledger_version_check", sql`${table.eventVersion} = ${FUNNEL_EVENT_VERSION}`),
    check("funnel_event_ledger_source_check", sql`${table.source} in (${statusList(FUNNEL_SOURCES)})`),
    check("funnel_event_ledger_outcome_check", sql`${table.safeOutcomeCode} is null or ${table.safeOutcomeCode} in (${statusList(FUNNEL_SAFE_OUTCOME_CODES)})`),
    check("funnel_event_ledger_duration_check", sql`${table.durationBucket} is null or ${table.durationBucket} in (${statusList(FUNNEL_DURATION_BUCKETS)})`),
    check("funnel_event_ledger_opaque_check", sql`${table.idempotencyKey} ~ '^[A-Za-z0-9][A-Za-z0-9._:-]{7,127}$' and ${table.correlationId} ~ '^[A-Za-z0-9][A-Za-z0-9._:-]{7,127}$'`),
    check("funnel_event_ledger_bounded_text_check", sql`
      (${table.utmSource} is null or ${table.utmSource} ~ '^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$') and
      (${table.utmMedium} is null or ${table.utmMedium} ~ '^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$') and
      (${table.utmCampaign} is null or ${table.utmCampaign} ~ '^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$') and
      (${table.utmTerm} is null or ${table.utmTerm} ~ '^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$') and
      (${table.utmContent} is null or ${table.utmContent} ~ '^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$') and
      (${table.productContractVersion} is null or ${table.productContractVersion} ~ '^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$') and
      (${table.questionBankVersion} is null or ${table.questionBankVersion} ~ '^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$') and
      (${table.answerKeyVersion} is null or ${table.answerKeyVersion} ~ '^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$') and
      (${table.levelMapVersion} is null or ${table.levelMapVersion} ~ '^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$') and
      (${table.scoringContractVersion} is null or ${table.scoringContractVersion} ~ '^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$') and
      (${table.resultCopyVersion} is null or ${table.resultCopyVersion} ~ '^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$')`),
    check("funnel_event_ledger_retention_check", sql`${table.expiresAt} > ${table.occurredAt} and ${table.expiresAt} <= ${table.occurredAt} + interval '31 days'`),
  ],
);

export const aiPracticeEntitlements = pgTable(
  "ai_practice_entitlements",
  {
    id: uuid("id").primaryKey(),
    verifiedEmailHmac: text("verified_email_hmac").notNull(),
    hashVersion: text("hash_version").notNull(),
    state: text("state").notNull().default("available"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("ai_practice_entitlements_email_hash_uidx").on(table.verifiedEmailHmac, table.hashVersion),
    check("ai_practice_entitlements_state_check", sql`${table.state} in ('available', 'reserved', 'consumed')`),
    check("ai_practice_entitlements_hmac_check", sql`char_length(${table.verifiedEmailHmac}) = 64`),
    check("ai_practice_entitlements_hash_version_check", sql`char_length(${table.hashVersion}) > 0`),
  ],
);

export const aiPracticeSessions = pgTable(
  "ai_practice_sessions",
  {
    id: uuid("id").primaryKey(),
    accountId: uuid("account_id").notNull().references(() => portalAccounts.id, { onDelete: "cascade" }),
    resultId: uuid("result_id").notNull().references(() => diagnosticResults.id, { onDelete: "restrict" }),
    entitlementId: uuid("entitlement_id").notNull().references(() => aiPracticeEntitlements.id, { onDelete: "restrict" }),
    scenario: text("scenario").notNull(), useCase: text("use_case").notNull(), planVersion: text("plan_version").notNull(),
    state: text("state").notNull().default("reserved"), turnCount: integer("turn_count").notNull().default(0), retryCount: integer("retry_count").notNull().default(0),
    safeSuccessCode: text("safe_success_code"), safeFocusCode: text("safe_focus_code"), limitCode: text("limit_code"), escalationCode: text("escalation_code"),
    inputUnits: integer("input_units").notNull().default(0), outputUnits: integer("output_units").notNull().default(0), chargedMicroUsd: integer("charged_micro_usd").notNull().default(0),
    providerProfile: text("provider_profile").notNull(), policyVersion: text("policy_version").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(), updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(), expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(), completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (table) => [
    index("ai_practice_sessions_account_state_idx").on(table.accountId, table.state, table.expiresAt),
    uniqueIndex("ai_practice_sessions_entitlement_uidx").on(table.entitlementId),
    check("ai_practice_sessions_state_check", sql`${table.state} in ('reserved', 'active', 'completed', 'expired', 'escalated')`),
    check("ai_practice_sessions_turn_check", sql`${table.turnCount} >= 0 and ${table.turnCount} <= 5`),
    check("ai_practice_sessions_retry_check", sql`${table.retryCount} >= 0 and ${table.retryCount} <= 5`),
    check("ai_practice_sessions_usage_check", sql`${table.inputUnits} >= 0 and ${table.outputUnits} >= 0 and ${table.chargedMicroUsd} >= 0`),
    check("ai_practice_sessions_scenario_check", sql`${table.scenario} in ('daily_routine', 'workplace_exchange', 'guided_discussion')`),
    check("ai_practice_sessions_use_case_check", sql`${table.useCase} in ('lesson_review', 'conversation_roleplay')`),
    check("ai_practice_sessions_plan_check", sql`${table.planVersion} = 'mis-340-plan-v1'`),
    check("ai_practice_sessions_success_check", sql`${table.safeSuccessCode} is null or ${table.safeSuccessCode} = 'success'`),
    check("ai_practice_sessions_focus_check", sql`${table.safeFocusCode} is null or ${table.safeFocusCode} in ('meaning_acknowledged', 'focus_pronunciation', 'focus_grammar', 'escalation_needed')`),
    check("ai_practice_sessions_limit_code_check", sql`${table.limitCode} is null or ${table.limitCode} in ('session_limit_reached', 'daily_limit_reached', 'retry_limit_reached')`),
    check("ai_practice_sessions_escalation_code_check", sql`${table.escalationCode} is null or ${table.escalationCode} = 'provider_escalated'`),
    check("ai_practice_sessions_provider_profile_check", sql`char_length(${table.providerProfile}) between 1 and 80`),
    check("ai_practice_sessions_policy_check", sql`${table.policyVersion} = 'mis-340-policy-v1'`),
    check("ai_practice_sessions_expiry_check", sql`${table.expiresAt} > ${table.createdAt}`),
    check("ai_practice_sessions_completion_check", sql`(${table.state} in ('completed', 'expired', 'escalated') and ${table.completedAt} is not null) or (${table.state} in ('reserved', 'active') and ${table.completedAt} is null)`),
  ],
);

export const aiPracticeTurnOperations = pgTable(
  "ai_practice_turn_operations",
  {
    id: uuid("id").primaryKey(), sessionId: uuid("session_id").notNull().references(() => aiPracticeSessions.id, { onDelete: "cascade" }), clientOperationId: text("client_operation_id").notNull(), learnerTurn: integer("learner_turn").notNull(), retryAttempt: integer("retry_attempt").notNull(), state: text("state").notNull().default("claimed"), safeOutcomeCode: text("safe_outcome_code"), inputUnits: integer("input_units").notNull().default(0), outputUnits: integer("output_units").notNull().default(0), chargedMicroUsd: integer("charged_micro_usd").notNull().default(0), reservedMicroUsd: integer("reserved_micro_usd").notNull(), createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(), completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("ai_practice_turn_operations_client_uidx").on(table.sessionId, table.clientOperationId), uniqueIndex("ai_practice_turn_operations_turn_uidx").on(table.sessionId, table.learnerTurn, table.retryAttempt), check("ai_practice_turn_operations_state_check", sql`${table.state} in ('claimed', 'completed', 'failed', 'ambiguous')`), check("ai_practice_turn_operations_turn_check", sql`${table.learnerTurn} between 1 and 5 and ${table.retryAttempt} between 0 and 1`), check("ai_practice_turn_operations_usage_check", sql`${table.inputUnits} >= 0 and ${table.outputUnits} >= 0 and ${table.chargedMicroUsd} >= 0 and ${table.reservedMicroUsd} > 0 and ${table.chargedMicroUsd} <= ${table.reservedMicroUsd}`), check("ai_practice_turn_operations_outcome_check", sql`${table.safeOutcomeCode} is null or ${table.safeOutcomeCode} in ('success', 'escalated', 'deadline_exceeded')`), check("ai_practice_turn_operations_client_check", sql`char_length(${table.clientOperationId}) between 8 and 80`), check("ai_practice_turn_operations_terminal_check", sql`(${table.state} = 'claimed' and ${table.completedAt} is null) or (${table.state} in ('completed', 'failed', 'ambiguous') and ${table.completedAt} is not null)`),
  ],
);

export const aiPracticeBudgetReservations = pgTable(
  "ai_practice_budget_reservations",
  { id: uuid("id").primaryKey(), sessionId: uuid("session_id").notNull().references(() => aiPracticeSessions.id, { onDelete: "cascade" }), accountId: uuid("account_id").notNull().references(() => portalAccounts.id, { onDelete: "cascade" }), utcDay: text("utc_day").notNull(), state: text("state").notNull().default("reserved"), reservedMicroUsd: integer("reserved_micro_usd").notNull(), chargedMicroUsd: integer("charged_micro_usd").notNull().default(0), releasedMicroUsd: integer("released_micro_usd").notNull().default(0), createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(), releasedAt: timestamp("released_at", { withTimezone: true }) },
  (table) => [uniqueIndex("ai_practice_budget_reservations_session_uidx").on(table.sessionId), index("ai_practice_budget_reservations_day_idx").on(table.accountId, table.utcDay), check("ai_practice_budget_reservations_state_check", sql`${table.state} in ('reserved', 'reconciled', 'released')`), check("ai_practice_budget_reservations_amount_check", sql`${table.reservedMicroUsd} > 0 and ${table.chargedMicroUsd} >= 0 and ${table.releasedMicroUsd} >= 0 and ${table.chargedMicroUsd} + ${table.releasedMicroUsd} <= ${table.reservedMicroUsd}`), check("ai_practice_budget_reservations_day_check", sql`${table.utcDay} ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'`), check("ai_practice_budget_reservations_release_check", sql`(${table.state} = 'reserved' and ${table.releasedAt} is null) or (${table.state} in ('reconciled', 'released') and ${table.releasedAt} is not null)`)],
);

export const aiPracticeAccountDayBudgets = pgTable(
  "ai_practice_account_day_budgets",
  { accountId: uuid("account_id").notNull().references(() => portalAccounts.id, { onDelete: "cascade" }), utcDay: text("utc_day").notNull(), reservedMicroUsd: integer("reserved_micro_usd").notNull().default(0), chargedMicroUsd: integer("charged_micro_usd").notNull().default(0), releasedMicroUsd: integer("released_micro_usd").notNull().default(0), updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow() },
  (table) => [primaryKey({ columns: [table.accountId, table.utcDay] }), check("ai_practice_account_day_budgets_amount_check", sql`${table.reservedMicroUsd} >= 0 and ${table.chargedMicroUsd} >= 0 and ${table.releasedMicroUsd} >= 0 and ${table.chargedMicroUsd} + ${table.releasedMicroUsd} <= ${table.reservedMicroUsd}`), check("ai_practice_account_day_budgets_day_check", sql`${table.utcDay} ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'`)],
);

export const aiProviderCircuitState = pgTable(
  "ai_provider_circuit_state",
  { capability: text("capability").primaryKey(), failureCount: integer("failure_count").notNull().default(0), state: text("state").notNull().default("closed"), openUntil: timestamp("open_until", { withTimezone: true }), probeInFlight: boolean("probe_in_flight").notNull().default(false), updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow() },
  (table) => [check("ai_provider_circuit_state_check", sql`${table.state} in ('closed', 'open', 'half_open')`), check("ai_provider_circuit_failure_check", sql`${table.failureCount} >= 0`), check("ai_provider_circuit_open_check", sql`(${table.state} = 'open' and ${table.openUntil} is not null) or (${table.state} <> 'open')`)],
);
