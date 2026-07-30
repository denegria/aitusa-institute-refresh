CREATE TABLE "portal_accounts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"workos_user_id" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"account_type" text DEFAULT 'adult_student' NOT NULL,
	"first_name" text NOT NULL,
	"primary_email" text NOT NULL,
	"preferred_language" text DEFAULT 'es' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_signed_in_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "portal_accounts_status_check" CHECK ("portal_accounts"."status" in ('active', 'locked', 'disabled', 'merged', 'deleted')),
	CONSTRAINT "portal_accounts_type_check" CHECK ("portal_accounts"."account_type" in ('adult_student', 'guardian'))
);
--> statement-breakpoint
CREATE TABLE "portal_auth_challenges" (
	"id" uuid PRIMARY KEY NOT NULL,
	"claim_id" text NOT NULL,
	"attempt_id" uuid NOT NULL,
	"result_claim_id" uuid NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"email" text NOT NULL,
	"first_name" text NOT NULL,
	"provider_challenge_id" text NOT NULL,
	"provider_user_id" text,
	"account_type" text DEFAULT 'adult_student' NOT NULL,
	"advisor_contact_requested" boolean DEFAULT false NOT NULL,
	"privacy_policy_version" text NOT NULL,
	"terms_version" text NOT NULL,
	"disclosure_hash" text NOT NULL,
	"advisor_disclosure_hash" text NOT NULL,
	"attribution" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"verified_at" timestamp with time zone,
	"consumed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "portal_auth_challenges_status_check" CHECK ("portal_auth_challenges"."status" in ('pending', 'verified', 'consumed', 'expired', 'cancelled')),
	CONSTRAINT "portal_auth_challenges_type_check" CHECK ("portal_auth_challenges"."account_type" in ('adult_student', 'guardian'))
);
--> statement-breakpoint
CREATE TABLE "consent_records" (
	"id" uuid PRIMARY KEY NOT NULL,
	"account_id" uuid NOT NULL,
	"attempt_id" uuid,
	"purpose" text NOT NULL,
	"channel" text NOT NULL,
	"decision" boolean NOT NULL,
	"policy_version" text NOT NULL,
	"disclosure_hash" text NOT NULL,
	"capture_method" text NOT NULL,
	"correlation_id" text NOT NULL,
	"occurred_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "crm_outbox" (
	"id" uuid PRIMARY KEY NOT NULL,
	"event_type" text NOT NULL,
	"idempotency_key" text NOT NULL,
	"correlation_id" text NOT NULL,
	"payload" jsonb NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"attempt_count" integer DEFAULT 0 NOT NULL,
	"next_attempt_at" timestamp with time zone NOT NULL,
	"safe_error_code" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"delivered_at" timestamp with time zone,
	CONSTRAINT "crm_outbox_status_check" CHECK ("crm_outbox"."status" in ('pending', 'delivering', 'delivered', 'retry_wait', 'dead_letter')),
	CONSTRAINT "crm_outbox_attempt_count_check" CHECK ("crm_outbox"."attempt_count" >= 0)
);
--> statement-breakpoint
ALTER TABLE "diagnostic_attempts" ADD CONSTRAINT "diagnostic_attempts_claimed_account_id_portal_accounts_id_fk" FOREIGN KEY ("claimed_account_id") REFERENCES "public"."portal_accounts"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "result_claims" ADD CONSTRAINT "result_claims_claimed_account_id_portal_accounts_id_fk" FOREIGN KEY ("claimed_account_id") REFERENCES "public"."portal_accounts"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "portal_auth_challenges" ADD CONSTRAINT "portal_auth_challenges_attempt_id_diagnostic_attempts_id_fk" FOREIGN KEY ("attempt_id") REFERENCES "public"."diagnostic_attempts"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "portal_auth_challenges" ADD CONSTRAINT "portal_auth_challenges_result_claim_id_result_claims_id_fk" FOREIGN KEY ("result_claim_id") REFERENCES "public"."result_claims"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "consent_records" ADD CONSTRAINT "consent_records_account_id_portal_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."portal_accounts"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "consent_records" ADD CONSTRAINT "consent_records_attempt_id_diagnostic_attempts_id_fk" FOREIGN KEY ("attempt_id") REFERENCES "public"."diagnostic_attempts"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
CREATE UNIQUE INDEX "portal_accounts_workos_user_id_uidx" ON "portal_accounts" USING btree ("workos_user_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "portal_accounts_primary_email_uidx" ON "portal_accounts" USING btree ("primary_email");
--> statement-breakpoint
CREATE UNIQUE INDEX "portal_auth_challenges_claim_id_uidx" ON "portal_auth_challenges" USING btree ("claim_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "portal_auth_challenges_provider_id_uidx" ON "portal_auth_challenges" USING btree ("provider_challenge_id");
--> statement-breakpoint
CREATE INDEX "portal_auth_challenges_expiry_idx" ON "portal_auth_challenges" USING btree ("expires_at","status");
--> statement-breakpoint
CREATE UNIQUE INDEX "consent_records_correlation_purpose_uidx" ON "consent_records" USING btree ("correlation_id","purpose");
--> statement-breakpoint
CREATE INDEX "consent_records_account_idx" ON "consent_records" USING btree ("account_id","occurred_at");
--> statement-breakpoint
CREATE UNIQUE INDEX "crm_outbox_idempotency_key_uidx" ON "crm_outbox" USING btree ("idempotency_key");
--> statement-breakpoint
CREATE INDEX "crm_outbox_delivery_idx" ON "crm_outbox" USING btree ("status","next_attempt_at","created_at");
