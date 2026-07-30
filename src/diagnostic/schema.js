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
