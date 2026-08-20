ALTER TABLE "placement_review_events"
ADD COLUMN IF NOT EXISTS "internal_rationale" text;
--> statement-breakpoint
ALTER TABLE "placement_review_events"
DROP CONSTRAINT IF EXISTS "placement_review_events_rationale_length_check";
--> statement-breakpoint
ALTER TABLE "placement_review_events"
ADD CONSTRAINT "placement_review_events_rationale_length_check"
CHECK (
  "internal_rationale" is null
  or char_length("internal_rationale") between 1 and 1000
);
