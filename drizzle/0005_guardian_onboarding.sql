CREATE TABLE "guardian_consent_challenges" (
  "id" uuid PRIMARY KEY NOT NULL,
  "request_id" text NOT NULL,
  "status" text DEFAULT 'pending' NOT NULL,
  "guardian_first_name" text NOT NULL,
  "guardian_email" text NOT NULL,
  "provider_challenge_id" text NOT NULL,
  "provider_user_id" text,
  "guardian_attested" boolean NOT NULL,
  "notice_accepted" boolean NOT NULL,
  "ai_practice_approved" boolean DEFAULT false NOT NULL,
  "advisor_contact_approved" boolean DEFAULT false NOT NULL,
  "policy_version" text NOT NULL,
  "notice_hash" text NOT NULL,
  "expires_at" timestamp with time zone NOT NULL,
  "verified_at" timestamp with time zone,
  "consumed_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "guardian_consent_challenges_status_check" CHECK ("guardian_consent_challenges"."status" in ('pending', 'verified', 'consumed', 'expired', 'cancelled')),
  CONSTRAINT "guardian_consent_challenges_attestation_check" CHECK ("guardian_consent_challenges"."guardian_attested" = true and "guardian_consent_challenges"."notice_accepted" = true)
);
--> statement-breakpoint
CREATE TABLE "child_profiles" (
  "id" uuid PRIMARY KEY NOT NULL,
  "first_name" text NOT NULL,
  "age_band" text NOT NULL,
  "status" text DEFAULT 'active' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  "deleted_at" timestamp with time zone,
  CONSTRAINT "child_profiles_age_band_check" CHECK ("child_profiles"."age_band" = 'under_13'),
  CONSTRAINT "child_profiles_status_check" CHECK ("child_profiles"."status" in ('active', 'unlinked', 'deletion_requested', 'deleted'))
);
--> statement-breakpoint
CREATE TABLE "guardian_child_links" (
  "id" uuid PRIMARY KEY NOT NULL,
  "guardian_account_id" uuid NOT NULL,
  "child_profile_id" uuid NOT NULL,
  "status" text DEFAULT 'active' NOT NULL,
  "linked_at" timestamp with time zone NOT NULL,
  "revoked_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "guardian_consent_receipts" (
  "id" uuid PRIMARY KEY NOT NULL,
  "challenge_id" uuid NOT NULL,
  "guardian_account_id" uuid NOT NULL,
  "child_profile_id" uuid NOT NULL,
  "receipt_code" text NOT NULL,
  "status" text DEFAULT 'active' NOT NULL,
  "policy_version" text NOT NULL,
  "notice_hash" text NOT NULL,
  "verification_method" text NOT NULL,
  "permissions" jsonb NOT NULL,
  "captured_at" timestamp with time zone NOT NULL,
  "withdrawn_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "guardian_consent_receipts_status_check" CHECK ("guardian_consent_receipts"."status" in ('active', 'withdrawn', 'deletion_requested')),
  CONSTRAINT "guardian_consent_receipts_method_check" CHECK ("guardian_consent_receipts"."verification_method" = 'verified_email_plus_attestation')
);
--> statement-breakpoint
ALTER TABLE "guardian_child_links" ADD CONSTRAINT "guardian_child_links_guardian_account_id_portal_accounts_id_fk" FOREIGN KEY ("guardian_account_id") REFERENCES "public"."portal_accounts"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "guardian_child_links" ADD CONSTRAINT "guardian_child_links_child_profile_id_child_profiles_id_fk" FOREIGN KEY ("child_profile_id") REFERENCES "public"."child_profiles"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "guardian_consent_receipts" ADD CONSTRAINT "guardian_consent_receipts_challenge_id_guardian_consent_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."guardian_consent_challenges"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "guardian_consent_receipts" ADD CONSTRAINT "guardian_consent_receipts_guardian_account_id_portal_accounts_id_fk" FOREIGN KEY ("guardian_account_id") REFERENCES "public"."portal_accounts"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "guardian_consent_receipts" ADD CONSTRAINT "guardian_consent_receipts_child_profile_id_child_profiles_id_fk" FOREIGN KEY ("child_profile_id") REFERENCES "public"."child_profiles"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "diagnostic_attempts" ADD CONSTRAINT "diagnostic_attempts_claimed_child_profile_id_child_profiles_id_fk" FOREIGN KEY ("claimed_child_profile_id") REFERENCES "public"."child_profiles"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
CREATE UNIQUE INDEX "guardian_consent_challenges_request_uidx" ON "guardian_consent_challenges" USING btree ("request_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "guardian_consent_challenges_provider_uidx" ON "guardian_consent_challenges" USING btree ("provider_challenge_id");
--> statement-breakpoint
CREATE INDEX "guardian_consent_challenges_expiry_idx" ON "guardian_consent_challenges" USING btree ("expires_at", "status");
--> statement-breakpoint
CREATE UNIQUE INDEX "guardian_child_links_child_uidx" ON "guardian_child_links" USING btree ("child_profile_id");
--> statement-breakpoint
CREATE INDEX "guardian_child_links_guardian_idx" ON "guardian_child_links" USING btree ("guardian_account_id", "status");
--> statement-breakpoint
CREATE UNIQUE INDEX "guardian_consent_receipts_challenge_uidx" ON "guardian_consent_receipts" USING btree ("challenge_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "guardian_consent_receipts_code_uidx" ON "guardian_consent_receipts" USING btree ("receipt_code");
--> statement-breakpoint
CREATE INDEX "guardian_consent_receipts_guardian_idx" ON "guardian_consent_receipts" USING btree ("guardian_account_id", "captured_at");
