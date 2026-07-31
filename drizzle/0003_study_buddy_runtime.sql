CREATE TABLE "ai_practice_entitlements" (
  "id" uuid PRIMARY KEY NOT NULL,
  "verified_email_hmac" text NOT NULL,
  "hash_version" text NOT NULL,
  "state" text DEFAULT 'available' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "ai_practice_entitlements_state_check" CHECK ("state" in ('available', 'reserved', 'consumed')),
  CONSTRAINT "ai_practice_entitlements_hmac_check" CHECK (char_length("verified_email_hmac") = 64),
  CONSTRAINT "ai_practice_entitlements_hash_version_check" CHECK (char_length("hash_version") > 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX "ai_practice_entitlements_email_hash_uidx" ON "ai_practice_entitlements" USING btree ("verified_email_hmac", "hash_version");
--> statement-breakpoint
CREATE TABLE "ai_practice_sessions" (
  "id" uuid PRIMARY KEY NOT NULL,
  "account_id" uuid NOT NULL REFERENCES "portal_accounts"("id") ON DELETE cascade,
  "result_id" uuid NOT NULL REFERENCES "diagnostic_results"("id") ON DELETE restrict,
  "entitlement_id" uuid NOT NULL REFERENCES "ai_practice_entitlements"("id") ON DELETE restrict,
  "scenario" text NOT NULL,
  "use_case" text NOT NULL,
  "plan_version" text NOT NULL,
  "state" text DEFAULT 'reserved' NOT NULL,
  "turn_count" integer DEFAULT 0 NOT NULL,
  "retry_count" integer DEFAULT 0 NOT NULL,
  "safe_success_code" text,
  "safe_focus_code" text,
  "limit_code" text,
  "escalation_code" text,
  "input_units" integer DEFAULT 0 NOT NULL,
  "output_units" integer DEFAULT 0 NOT NULL,
  "charged_micro_usd" integer DEFAULT 0 NOT NULL,
  "model_version" text NOT NULL,
  "policy_version" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  "expires_at" timestamp with time zone NOT NULL,
  "completed_at" timestamp with time zone,
  CONSTRAINT "ai_practice_sessions_state_check" CHECK ("state" in ('reserved', 'active', 'completed', 'expired', 'escalated')),
  CONSTRAINT "ai_practice_sessions_turn_check" CHECK ("turn_count" >= 0 and "turn_count" <= 5),
  CONSTRAINT "ai_practice_sessions_retry_check" CHECK ("retry_count" >= 0 and "retry_count" <= 5),
  CONSTRAINT "ai_practice_sessions_usage_check" CHECK ("input_units" >= 0 and "output_units" >= 0 and "charged_micro_usd" >= 0)
);
--> statement-breakpoint
CREATE INDEX "ai_practice_sessions_account_state_idx" ON "ai_practice_sessions" USING btree ("account_id", "state", "expires_at");
--> statement-breakpoint
CREATE TABLE "ai_practice_turn_operations" (
  "id" uuid PRIMARY KEY NOT NULL,
  "session_id" uuid NOT NULL REFERENCES "ai_practice_sessions"("id") ON DELETE cascade,
  "client_operation_id" text NOT NULL,
  "learner_turn" integer NOT NULL,
  "retry_attempt" integer NOT NULL,
  "state" text DEFAULT 'claimed' NOT NULL,
  "safe_outcome_code" text,
  "input_units" integer DEFAULT 0 NOT NULL,
  "output_units" integer DEFAULT 0 NOT NULL,
  "charged_micro_usd" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "completed_at" timestamp with time zone,
  CONSTRAINT "ai_practice_turn_operations_state_check" CHECK ("state" in ('claimed', 'completed', 'failed', 'ambiguous')),
  CONSTRAINT "ai_practice_turn_operations_turn_check" CHECK ("learner_turn" between 1 and 5 and "retry_attempt" between 0 and 1),
  CONSTRAINT "ai_practice_turn_operations_usage_check" CHECK ("input_units" >= 0 and "output_units" >= 0 and "charged_micro_usd" >= 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX "ai_practice_turn_operations_client_uidx" ON "ai_practice_turn_operations" USING btree ("client_operation_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "ai_practice_turn_operations_turn_uidx" ON "ai_practice_turn_operations" USING btree ("session_id", "learner_turn", "retry_attempt");
--> statement-breakpoint
CREATE TABLE "ai_practice_budget_reservations" (
  "id" uuid PRIMARY KEY NOT NULL,
  "session_id" uuid NOT NULL REFERENCES "ai_practice_sessions"("id") ON DELETE cascade,
  "account_id" uuid NOT NULL REFERENCES "portal_accounts"("id") ON DELETE cascade,
  "utc_day" text NOT NULL,
  "state" text DEFAULT 'reserved' NOT NULL,
  "reserved_micro_usd" integer NOT NULL,
  "charged_micro_usd" integer DEFAULT 0 NOT NULL,
  "released_micro_usd" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "released_at" timestamp with time zone,
  CONSTRAINT "ai_practice_budget_reservations_state_check" CHECK ("state" in ('reserved', 'reconciled', 'released')),
  CONSTRAINT "ai_practice_budget_reservations_amount_check" CHECK ("reserved_micro_usd" >= 0 and "charged_micro_usd" >= 0 and "released_micro_usd" >= 0 and "charged_micro_usd" + "released_micro_usd" <= "reserved_micro_usd")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "ai_practice_budget_reservations_session_uidx" ON "ai_practice_budget_reservations" USING btree ("session_id");
--> statement-breakpoint
CREATE INDEX "ai_practice_budget_reservations_day_idx" ON "ai_practice_budget_reservations" USING btree ("account_id", "utc_day");
--> statement-breakpoint
CREATE TABLE "ai_practice_account_day_budgets" (
  "account_id" uuid NOT NULL REFERENCES "portal_accounts"("id") ON DELETE cascade,
  "utc_day" text NOT NULL,
  "reserved_micro_usd" integer DEFAULT 0 NOT NULL,
  "charged_micro_usd" integer DEFAULT 0 NOT NULL,
  "released_micro_usd" integer DEFAULT 0 NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "ai_practice_account_day_budgets_pkey" PRIMARY KEY ("account_id", "utc_day"),
  CONSTRAINT "ai_practice_account_day_budgets_amount_check" CHECK ("reserved_micro_usd" >= 0 and "charged_micro_usd" >= 0 and "released_micro_usd" >= 0)
);
--> statement-breakpoint
CREATE TABLE "ai_provider_circuit_state" (
  "capability" text PRIMARY KEY NOT NULL,
  "failure_count" integer DEFAULT 0 NOT NULL,
  "state" text DEFAULT 'closed' NOT NULL,
  "open_until" timestamp with time zone,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "ai_provider_circuit_state_check" CHECK ("state" in ('closed', 'open', 'half_open')),
  CONSTRAINT "ai_provider_circuit_failure_check" CHECK ("failure_count" >= 0)
);
