CREATE TABLE "employee_review_roles" (
  "portal_account_id" uuid PRIMARY KEY NOT NULL,
  "business_unit" text NOT NULL,
  "role" text NOT NULL,
  "active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "employee_review_roles_bu_check" CHECK ("business_unit" = 'ait_usa'),
  CONSTRAINT "employee_review_roles_role_check" CHECK ("role" in ('senior', 'admin'))
);
--> statement-breakpoint
CREATE TABLE "placement_reviews" (
  "id" uuid PRIMARY KEY NOT NULL,
  "result_id" uuid NOT NULL,
  "attempt_id" uuid NOT NULL,
  "correlation_id" text NOT NULL,
  "business_unit" text NOT NULL,
  "status" text DEFAULT 'pending' NOT NULL,
  "recommended_level" text NOT NULL,
  "final_level" text,
  "revision" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "placement_reviews_bu_check" CHECK ("business_unit" = 'ait_usa'),
  CONSTRAINT "placement_reviews_status_check" CHECK ("status" in ('pending', 'in_review', 'confirmed', 'adjusted', 'additional_review_required')),
  CONSTRAINT "placement_reviews_revision_check" CHECK ("revision" >= 0)
);
--> statement-breakpoint
CREATE TABLE "placement_review_mutations" (
  "review_id" uuid NOT NULL,
  "mutation_id" text NOT NULL,
  "revision_after" integer NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "placement_review_mutations_pk" PRIMARY KEY("review_id", "mutation_id")
);
--> statement-breakpoint
CREATE TABLE "placement_review_events" (
  "id" uuid PRIMARY KEY NOT NULL,
  "review_id" uuid NOT NULL,
  "event_type" text NOT NULL,
  "status" text NOT NULL,
  "revision" integer NOT NULL,
  "final_level" text,
  "actor_account_id" uuid,
  "occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "placement_review_events_type_check" CHECK ("event_type" in ('placement_review_created', 'placement_review_started', 'placement_review_confirmed', 'placement_review_adjusted', 'placement_review_additional_review_required'))
);
--> statement-breakpoint
CREATE TABLE "placement_contact_preferences" (
  "id" uuid PRIMARY KEY NOT NULL,
  "account_id" uuid NOT NULL,
  "attempt_id" uuid NOT NULL,
  "preferred_channel" text NOT NULL,
  "mobile_e164" text,
  "verified_mobile" boolean DEFAULT false NOT NULL,
  "verified_email" boolean DEFAULT true NOT NULL,
  "guardian_owned" boolean DEFAULT false NOT NULL,
  "disclosure_version" text NOT NULL,
  "disclosure_hash" text NOT NULL,
  "source_url" text NOT NULL,
  "opt_in_action" text NOT NULL,
  "occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "placement_contact_preferences_channel_check" CHECK ("preferred_channel" in ('email', 'sms', 'whatsapp', 'phone')),
  CONSTRAINT "placement_contact_preferences_mobile_check" CHECK (("mobile_e164" is null and "verified_mobile" = false) or ("mobile_e164" ~ '^\\+[1-9][0-9]{7,14}$' and "verified_mobile" = true))
);
--> statement-breakpoint
CREATE TABLE "placement_channel_consents" (
  "id" uuid PRIMARY KEY NOT NULL,
  "preference_id" uuid NOT NULL,
  "channel" text NOT NULL,
  "purpose" text NOT NULL,
  "decision" boolean NOT NULL,
  "disclosure_version" text NOT NULL,
  "disclosure_hash" text NOT NULL,
  "source_url" text NOT NULL,
  "opt_in_action" text NOT NULL,
  "occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "placement_channel_consents_channel_check" CHECK ("channel" in ('email', 'sms', 'whatsapp', 'phone')),
  CONSTRAINT "placement_channel_consents_purpose_check" CHECK ("purpose" in ('advisor_contact', 'service_sms', 'marketing_sms', 'phone_call', 'whatsapp_contact'))
);
--> statement-breakpoint
ALTER TABLE "employee_review_roles" ADD CONSTRAINT "employee_review_roles_account_fk" FOREIGN KEY ("portal_account_id") REFERENCES "public"."portal_accounts"("id") ON DELETE cascade;
--> statement-breakpoint
ALTER TABLE "placement_reviews" ADD CONSTRAINT "placement_reviews_result_fk" FOREIGN KEY ("result_id") REFERENCES "public"."diagnostic_results"("id") ON DELETE restrict;
--> statement-breakpoint
ALTER TABLE "placement_reviews" ADD CONSTRAINT "placement_reviews_attempt_fk" FOREIGN KEY ("attempt_id") REFERENCES "public"."diagnostic_attempts"("id") ON DELETE restrict;
--> statement-breakpoint
ALTER TABLE "placement_review_mutations" ADD CONSTRAINT "placement_review_mutations_review_fk" FOREIGN KEY ("review_id") REFERENCES "public"."placement_reviews"("id") ON DELETE restrict;
--> statement-breakpoint
ALTER TABLE "placement_review_events" ADD CONSTRAINT "placement_review_events_review_fk" FOREIGN KEY ("review_id") REFERENCES "public"."placement_reviews"("id") ON DELETE restrict;
--> statement-breakpoint
ALTER TABLE "placement_review_events" ADD CONSTRAINT "placement_review_events_actor_fk" FOREIGN KEY ("actor_account_id") REFERENCES "public"."portal_accounts"("id") ON DELETE restrict;
--> statement-breakpoint
ALTER TABLE "placement_contact_preferences" ADD CONSTRAINT "placement_contact_preferences_account_fk" FOREIGN KEY ("account_id") REFERENCES "public"."portal_accounts"("id") ON DELETE restrict;
--> statement-breakpoint
ALTER TABLE "placement_contact_preferences" ADD CONSTRAINT "placement_contact_preferences_attempt_fk" FOREIGN KEY ("attempt_id") REFERENCES "public"."diagnostic_attempts"("id") ON DELETE restrict;
--> statement-breakpoint
ALTER TABLE "placement_channel_consents" ADD CONSTRAINT "placement_channel_consents_preference_fk" FOREIGN KEY ("preference_id") REFERENCES "public"."placement_contact_preferences"("id") ON DELETE restrict;
--> statement-breakpoint
CREATE UNIQUE INDEX "placement_reviews_result_uidx" ON "placement_reviews" USING btree ("result_id");
--> statement-breakpoint
CREATE INDEX "placement_reviews_queue_idx" ON "placement_reviews" USING btree ("business_unit", "status", "updated_at");
--> statement-breakpoint
CREATE INDEX "placement_review_events_review_idx" ON "placement_review_events" USING btree ("review_id", "occurred_at");
--> statement-breakpoint
CREATE INDEX "placement_contact_preferences_account_idx" ON "placement_contact_preferences" USING btree ("account_id", "occurred_at");
--> statement-breakpoint
-- Backfill only already-claimed diagnostic results. Deterministic IDs and the
-- result/idempotency unique constraints make this safe to rerun. It writes an
-- outbox record but never invokes a provider; the normal dispatcher owns delivery.
WITH inserted_reviews AS (
  INSERT INTO "placement_reviews" (
    "id", "result_id", "attempt_id", "correlation_id", "business_unit",
    "status", "recommended_level", "revision", "created_at", "updated_at"
  )
  SELECT
    md5('placement-review:' || result.id::text)::uuid,
    result.id,
    attempt.id,
    attempt.id::text,
    'ait_usa',
    'pending',
    result.recommended_level_label,
    0,
    now(),
    now()
  FROM "diagnostic_attempts" attempt
  JOIN "diagnostic_results" result ON result.attempt_id = attempt.id
  WHERE attempt.status = 'claimed'
  ON CONFLICT ("result_id") DO NOTHING
  RETURNING "id", "result_id", "attempt_id", "correlation_id", "status", "recommended_level", "revision"
), review_events AS (
  INSERT INTO "placement_review_events" (
    "id", "review_id", "event_type", "status", "revision", "final_level", "actor_account_id", "occurred_at"
  )
  SELECT
    md5('placement-review-created:' || review.id::text)::uuid,
    review.id,
    'placement_review_created',
    review.status,
    review.revision,
    null,
    null,
    now()
  FROM "placement_reviews" review
  JOIN "diagnostic_attempts" attempt ON attempt.id = review.attempt_id AND attempt.status = 'claimed'
  ON CONFLICT ("id") DO NOTHING
  RETURNING "review_id"
)
INSERT INTO "crm_outbox" (
  "id", "event_type", "idempotency_key", "correlation_id", "payload", "status", "attempt_count", "next_attempt_at", "created_at"
)
SELECT
  md5('crm-placement-review-created:' || review.id::text)::uuid,
  'placement_review_created',
  'placement-review-created:' || review.id::text,
  review.id::text,
  jsonb_build_object(
    'schemaVersion', 'aitusa-crm-event-v1',
    'eventId', 'placement-review-created:' || review.id::text,
    'eventType', 'placement_review_created',
    'idempotencyKey', 'placement-review-created:' || review.id::text,
    'correlationId', review.correlation_id,
    'occurredAt', now(),
    'source', jsonb_build_object('product', 'aitusa_refresh', 'surface', 'staff_tool', 'path', '/employee/placement-reviews', 'version', 'mis-395-v1'),
    'placementReview', jsonb_build_object('reviewId', review.id::text, 'resultId', review.result_id::text, 'status', review.status, 'recommendedLevel', review.recommended_level),
    'communicationPreference', null,
    'consent', jsonb_build_object('verifiedEmail', false, 'verifiedMobile', false)
  ),
  'pending', 0, now(), now()
FROM "placement_reviews" review
JOIN "diagnostic_attempts" attempt ON attempt.id = review.attempt_id AND attempt.status = 'claimed'
ON CONFLICT ("idempotency_key") DO NOTHING;
