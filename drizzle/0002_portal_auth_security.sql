CREATE TABLE "portal_auth_events" (
	"id" uuid PRIMARY KEY NOT NULL,
	"event_type" text NOT NULL,
	"key_version" text NOT NULL,
	"email_key_hash" text NOT NULL,
	"ip_key_hash" text NOT NULL,
	"decision" text NOT NULL,
	"outcome" text DEFAULT 'pending' NOT NULL,
	"occurred_at" timestamp with time zone NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	CONSTRAINT "portal_auth_events_type_check" CHECK ("portal_auth_events"."event_type" in ('code_request', 'code_verify', 'session_revoke')),
	CONSTRAINT "portal_auth_events_decision_check" CHECK ("portal_auth_events"."decision" in ('allowed', 'blocked_cooldown', 'blocked_email_budget', 'blocked_ip_budget', 'recorded')),
	CONSTRAINT "portal_auth_events_outcome_check" CHECK ("portal_auth_events"."outcome" in ('pending', 'rate_limited', 'provider_dispatched', 'account_unavailable', 'provider_error', 'provider_unavailable', 'backend_error', 'success', 'invalid', 'revoked', 'revoke_failed', 'no_session')),
	CONSTRAINT "portal_auth_events_email_hash_check" CHECK (char_length("portal_auth_events"."email_key_hash") = 64),
	CONSTRAINT "portal_auth_events_ip_hash_check" CHECK (char_length("portal_auth_events"."ip_key_hash") = 64),
	CONSTRAINT "portal_auth_events_retention_check" CHECK ("portal_auth_events"."expires_at" > "portal_auth_events"."occurred_at" and "portal_auth_events"."expires_at" <= "portal_auth_events"."occurred_at" + interval '8 days')
);
--> statement-breakpoint
CREATE INDEX "portal_auth_events_email_window_idx" ON "portal_auth_events" USING btree ("event_type","key_version","email_key_hash","occurred_at");
--> statement-breakpoint
CREATE INDEX "portal_auth_events_ip_window_idx" ON "portal_auth_events" USING btree ("event_type","key_version","ip_key_hash","occurred_at");
--> statement-breakpoint
CREATE INDEX "portal_auth_events_expiry_idx" ON "portal_auth_events" USING btree ("expires_at");
