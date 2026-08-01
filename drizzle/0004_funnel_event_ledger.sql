CREATE TABLE "funnel_event_ledger" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "event_name" text NOT NULL,
  "event_version" integer DEFAULT 1 NOT NULL,
  "idempotency_key" text NOT NULL,
  "correlation_id" text NOT NULL,
  "source" text NOT NULL,
  "utm_source" text,
  "utm_medium" text,
  "utm_campaign" text,
  "utm_term" text,
  "utm_content" text,
  "product_contract_version" text,
  "question_bank_version" text,
  "answer_key_version" text,
  "level_map_version" text,
  "scoring_contract_version" text,
  "result_copy_version" text,
  "safe_outcome_code" text,
  "duration_bucket" text,
  "occurred_at" timestamp with time zone NOT NULL,
  "expires_at" timestamp with time zone NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "funnel_event_ledger_name_check" CHECK ("event_name" in ('diagnostic_started', 'diagnostic_completed', 'result_save_requested', 'result_save_completed', 'portal_auth_success', 'portal_auth_failure', 'practice_started', 'practice_completed', 'practice_escalated', 'practice_limit', 'crm_delivery', 'crm_retry', 'crm_dead_letter')),
  CONSTRAINT "funnel_event_ledger_version_check" CHECK ("event_version" = 1),
  CONSTRAINT "funnel_event_ledger_source_check" CHECK ("source" in ('diagnostic', 'portal_auth', 'portal_claim', 'practice', 'crm_outbox')),
  CONSTRAINT "funnel_event_ledger_outcome_check" CHECK ("safe_outcome_code" is null or "safe_outcome_code" in ('started', 'completed', 'saved', 'success', 'invalid', 'provider_unavailable', 'backend_unavailable', 'rate_limited', 'escalated', 'session_limit_reached', 'daily_limit_reached', 'retry_limit_reached', 'session_expired', 'crm_unavailable', 'crm_rejected', 'crm_timeout', 'crm_transport_failed')),
  CONSTRAINT "funnel_event_ledger_duration_check" CHECK ("duration_bucket" is null or "duration_bucket" in ('lt_1s', '1_5s', '5_30s', '30_120s', '120s_plus')),
  CONSTRAINT "funnel_event_ledger_opaque_check" CHECK (
    "idempotency_key" ~ '^[A-Za-z0-9][A-Za-z0-9._:-]{7,127}$' and
    "correlation_id" ~ '^[A-Za-z0-9][A-Za-z0-9._:-]{7,127}$'
  ),
  CONSTRAINT "funnel_event_ledger_bounded_text_check" CHECK (
    ("utm_source" is null or "utm_source" ~ '^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$') and
    ("utm_medium" is null or "utm_medium" ~ '^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$') and
    ("utm_campaign" is null or "utm_campaign" ~ '^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$') and
    ("utm_term" is null or "utm_term" ~ '^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$') and
    ("utm_content" is null or "utm_content" ~ '^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$') and
    ("product_contract_version" is null or "product_contract_version" ~ '^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$') and
    ("question_bank_version" is null or "question_bank_version" ~ '^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$') and
    ("answer_key_version" is null or "answer_key_version" ~ '^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$') and
    ("level_map_version" is null or "level_map_version" ~ '^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$') and
    ("scoring_contract_version" is null or "scoring_contract_version" ~ '^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$') and
    ("result_copy_version" is null or "result_copy_version" ~ '^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$')
  ),
  CONSTRAINT "funnel_event_ledger_retention_check" CHECK ("expires_at" > "occurred_at" and "expires_at" <= "occurred_at" + interval '31 days')
);
--> statement-breakpoint
CREATE UNIQUE INDEX "funnel_event_ledger_idempotency_uidx" ON "funnel_event_ledger" USING btree ("idempotency_key");
--> statement-breakpoint
CREATE INDEX "funnel_event_ledger_retention_idx" ON "funnel_event_ledger" USING btree ("expires_at");
--> statement-breakpoint
CREATE INDEX "funnel_event_ledger_correlation_idx" ON "funnel_event_ledger" USING btree ("correlation_id","occurred_at");
