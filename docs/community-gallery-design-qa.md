# Community gallery design QA

Reference: `artifacts/gallery-cleanup/reference-vs-implementation-final.jpg` (selected mock on the left; focused local implementation states on the right).

## Comparison summary

- Layout and typography: passed. The revised chapter uses one dominant interview, two aligned support images, four equal graduation cards, stable tabs, and the selected navy/gold editorial hierarchy.
- Color and surfaces: passed. A restrained non-generative media grade brings brightness, contrast, and saturation closer together without changing faces or scene content.
- Imagery and content: passed. `Entrevistas en inglés` accurately names the real student interview videos; the collapsed graduation row uses four certificate-forward photos and the archive still exposes all 27.
- Responsive behavior: passed at 1440 × 900 and 390 × 844. The mobile layout uses one interview feature, two equal support cards, scrollable tabs, and a two-column graduation grid.
- Interaction and accessibility: passed. Timed media cycling, reduced-motion handling, keyboard tabs, the video dialog, the photo lightbox, focus return, and the 4-to-27 archive expansion were verified in the rendered page.

## Resolved findings

- P1: removed the near-equal feature/mosaic composition and irregular masonry wall that made the first pass feel crowded.
- P2: replaced the first chronological graduation group shots with certificate-forward editorial picks.
- P0 fallback: made content visible by default so an unavailable reveal observer cannot leave a blank navy section; scroll reveal remains a progressive enhancement.

Evidence: `artifacts/gallery-cleanup/qa-implementation-heading.png`, `qa-implementation-top.png`, `qa-implementation-bottom.png`, and `implementation-mobile-390x844.png`.

final result: passed

---

# Video-only interview and visible cycling update

Reference comparison: `artifacts/gallery-design-qa/reference-vs-local-final.jpg`.
Poster curation evidence: `artifacts/gallery-poster-candidates/`.

- The interview tab now contains exactly the three real testimonial videos and
  no gallery photos.
- Curated posters use real source frames: an engaged closed-mouth Jessica
  exchange, Eric with both people smiling, and a neutral closed-mouth frame for
  the international interview.
- Automatic movement advances the selected tab every eight seconds; the gold
  underline shows progress, and hover, interaction, and reduced motion stop the
  motion appropriately.
- The stronger shared photo grade improves consistency without generative face
  edits or fabricated scene content.
- Desktop, 390 px mobile, dialog playback, dynamic play icons, and a fresh
  no-error browser session passed.
- Full tests: 267 passed. Asset check: 89 references, 0 missing, 0 orphaned.
  Production build: passed.

final result: passed
