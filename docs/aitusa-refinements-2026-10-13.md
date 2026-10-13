# AIT USA homepage refinements — release note

## Candidate

- Task: `aitusa-refinements-20261013`
- Base: `dc780de5c245931218e5d6ca9b52baa40aeacb92` (`origin/staging`)
- Environment: staging only; no push or deployment in this lane

## Changes

- Mobile alternate hero links now keep their existing copy, URLs, and font size
  together at narrow widths.
- Mobile Method orientation arrow remains attached to its text label.
- The Bound Brook office-hours message uses the full mobile hours-card width.
- Method pictograms now use the existing Lucide line-icon runtime (`ear`,
  `message-circle`, `route`) with the existing accessible decorative treatment.

## Artwork provenance

No book files were changed. The only local originals are the existing
`public/assets/books/intro-book-portada.avif` and
`step-plus-1` through `step-plus-6` assets (native sources previously measured
at approximately 160px and 174–177px wide). The canonical public homepage was
checked on 2026-10-13 and references the same paths; no genuine higher-resolution
official or project-origin source was found within the bounded discovery scope.

## Verification record

Final validation and release-surface logs/screenshots are recorded outside this
worktree under `runtime/audits/aitusa-refinements-2026-10-13/`.

## Discount banner and Bound Brook office-hours release

The homepage discount ribbon preserves `ESPAÑA · ONLINE`, the original font
sizes and Spain artwork. It separates the 30% new-student offer from the
additional 10% couples/groups benefit; no CTA or combined “40%” claim is added.
Mobile benefits stack compactly without increasing the accepted ribbon height.
Desktop artwork occupies the far-right zone, clear of the offer text.

Bound Brook's four office-hour slots are restored exactly from client-approved
source `750a5d5a978f72db357e663b3cefda845f73121a` (August 11), removed by
`3f66671`. The `Horario de oficina` label and all class schedules/other locations
remain unchanged. A regression assertion protects all four approved slots.

Telegram 23968 authorizes production after validation and live staging QA.
Director recovered the existing uncommitted candidate after the original worker
became unavailable, corrected the reduced-type-size deviation, and owns final
validation, staging acceptance, and production promotion. Evidence is stored in
`runtime/audits/aitusa-discount-banner-2026-10-13/` outside this repository.
