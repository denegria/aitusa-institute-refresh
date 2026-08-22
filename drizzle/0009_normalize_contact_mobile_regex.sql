ALTER TABLE "placement_contact_preferences"
  DROP CONSTRAINT IF EXISTS "placement_contact_preferences_mobile_check";
--> statement-breakpoint
ALTER TABLE "placement_contact_preferences"
  ADD CONSTRAINT "placement_contact_preferences_mobile_check"
  CHECK (
    ("mobile_e164" is null and "verified_mobile" = false)
    or "mobile_e164" ~ $regex$^\+[1-9][0-9]{7,14}$$regex$
  );
