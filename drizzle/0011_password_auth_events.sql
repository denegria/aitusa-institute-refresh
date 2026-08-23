ALTER TABLE "portal_auth_events" DROP CONSTRAINT "portal_auth_events_type_check";
--> statement-breakpoint
ALTER TABLE "portal_auth_events" ADD CONSTRAINT "portal_auth_events_type_check" CHECK ("portal_auth_events"."event_type" in ('code_request', 'code_verify', 'password_verify', 'password_reset_request', 'session_revoke'));
