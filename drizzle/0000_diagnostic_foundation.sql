CREATE TABLE "diagnostic_answers" (
	"attempt_id" uuid NOT NULL,
	"question_key" text NOT NULL,
	"answer_state" text NOT NULL,
	"answer_value" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "diagnostic_answers_attempt_id_question_key_pk" PRIMARY KEY("attempt_id","question_key"),
	CONSTRAINT "diagnostic_answers_state_check" CHECK ("diagnostic_answers"."answer_state" in ('answered', 'skipped')),
	CONSTRAINT "diagnostic_answers_value_check" CHECK (("diagnostic_answers"."answer_state" = 'answered' and "diagnostic_answers"."answer_value" is not null) or ("diagnostic_answers"."answer_state" = 'skipped' and "diagnostic_answers"."answer_value" is null))
);
--> statement-breakpoint
CREATE TABLE "diagnostic_attempts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"request_id" text NOT NULL,
	"status" text DEFAULT 'started' NOT NULL,
	"revision" integer DEFAULT 0 NOT NULL,
	"resume_token_hash" text NOT NULL,
	"product_contract_version" text NOT NULL,
	"question_bank_version" text NOT NULL,
	"answer_key_version" text NOT NULL,
	"level_map_version" text NOT NULL,
	"scoring_contract_version" text NOT NULL,
	"result_copy_version" text NOT NULL,
	"completion_id" text,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_activity_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	"claimed_at" timestamp with time zone,
	"expires_at" timestamp with time zone NOT NULL,
	"raw_answers_purge_at" timestamp with time zone,
	"claimed_account_id" uuid,
	"claimed_child_profile_id" uuid,
	CONSTRAINT "diagnostic_attempts_status_check" CHECK ("diagnostic_attempts"."status" in ('started', 'in_progress', 'completed', 'claim_pending', 'claimed', 'expired', 'purged')),
	CONSTRAINT "diagnostic_attempts_revision_check" CHECK ("diagnostic_attempts"."revision" >= 0)
);
--> statement-breakpoint
CREATE TABLE "diagnostic_contexts" (
	"attempt_id" uuid PRIMARY KEY NOT NULL,
	"goal" text NOT NULL,
	"self_assessment" jsonb NOT NULL,
	"writing_sample" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "diagnostic_mutations" (
	"attempt_id" uuid NOT NULL,
	"mutation_id" text NOT NULL,
	"revision_after" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "diagnostic_mutations_attempt_id_mutation_id_pk" PRIMARY KEY("attempt_id","mutation_id"),
	CONSTRAINT "diagnostic_mutations_revision_check" CHECK ("diagnostic_mutations"."revision_after" > 0)
);
--> statement-breakpoint
CREATE TABLE "diagnostic_results" (
	"id" uuid PRIMARY KEY NOT NULL,
	"attempt_id" uuid NOT NULL,
	"product_contract_version" text NOT NULL,
	"question_bank_version" text NOT NULL,
	"answer_key_version" text NOT NULL,
	"level_map_version" text NOT NULL,
	"scoring_contract_version" text NOT NULL,
	"result_copy_version" text NOT NULL,
	"result_status" text DEFAULT 'provisional' NOT NULL,
	"recommended_level_key" text NOT NULL,
	"recommended_level_label" text NOT NULL,
	"quiz_score" integer NOT NULL,
	"answered_question_count" integer NOT NULL,
	"skipped_question_count" integer NOT NULL,
	"score_summary" jsonb NOT NULL,
	"response_payload" jsonb NOT NULL,
	"advisor_confirmation_required" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "diagnostic_results_status_check" CHECK ("diagnostic_results"."result_status" in ('provisional', 'validated', 'borderline', 'advisor_review')),
	CONSTRAINT "diagnostic_results_quiz_score_check" CHECK ("diagnostic_results"."quiz_score" >= 0),
	CONSTRAINT "diagnostic_results_advisor_check" CHECK ("diagnostic_results"."advisor_confirmation_required" in (0, 1))
);
--> statement-breakpoint
CREATE TABLE "result_claims" (
	"id" uuid PRIMARY KEY NOT NULL,
	"attempt_id" uuid NOT NULL,
	"claim_token_hash" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"consumed_at" timestamp with time zone,
	"claimed_account_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "result_claims_status_check" CHECK ("result_claims"."status" in ('pending', 'consumed', 'expired', 'revoked'))
);
--> statement-breakpoint
ALTER TABLE "diagnostic_answers" ADD CONSTRAINT "diagnostic_answers_attempt_id_diagnostic_attempts_id_fk" FOREIGN KEY ("attempt_id") REFERENCES "public"."diagnostic_attempts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "diagnostic_contexts" ADD CONSTRAINT "diagnostic_contexts_attempt_id_diagnostic_attempts_id_fk" FOREIGN KEY ("attempt_id") REFERENCES "public"."diagnostic_attempts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "diagnostic_mutations" ADD CONSTRAINT "diagnostic_mutations_attempt_id_diagnostic_attempts_id_fk" FOREIGN KEY ("attempt_id") REFERENCES "public"."diagnostic_attempts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "diagnostic_results" ADD CONSTRAINT "diagnostic_results_attempt_id_diagnostic_attempts_id_fk" FOREIGN KEY ("attempt_id") REFERENCES "public"."diagnostic_attempts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "result_claims" ADD CONSTRAINT "result_claims_attempt_id_diagnostic_attempts_id_fk" FOREIGN KEY ("attempt_id") REFERENCES "public"."diagnostic_attempts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "diagnostic_attempts_request_id_uidx" ON "diagnostic_attempts" USING btree ("request_id");--> statement-breakpoint
CREATE UNIQUE INDEX "diagnostic_attempts_resume_token_hash_uidx" ON "diagnostic_attempts" USING btree ("resume_token_hash");--> statement-breakpoint
CREATE UNIQUE INDEX "diagnostic_attempts_completion_id_uidx" ON "diagnostic_attempts" USING btree ("completion_id");--> statement-breakpoint
CREATE INDEX "diagnostic_attempts_expiry_idx" ON "diagnostic_attempts" USING btree ("expires_at","status");--> statement-breakpoint
CREATE INDEX "diagnostic_attempts_raw_purge_idx" ON "diagnostic_attempts" USING btree ("raw_answers_purge_at");--> statement-breakpoint
CREATE UNIQUE INDEX "diagnostic_results_attempt_id_uidx" ON "diagnostic_results" USING btree ("attempt_id");--> statement-breakpoint
CREATE UNIQUE INDEX "result_claims_token_hash_uidx" ON "result_claims" USING btree ("claim_token_hash");--> statement-breakpoint
CREATE INDEX "result_claims_attempt_status_idx" ON "result_claims" USING btree ("attempt_id","status");--> statement-breakpoint
CREATE INDEX "result_claims_expiry_idx" ON "result_claims" USING btree ("expires_at","status");