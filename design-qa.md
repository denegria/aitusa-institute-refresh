# Design QA: Prueba Real Editorial Gallery

## Comparison Target

- Source visual truth: `screenshots/prueba-real-reference.png`
- Desktop implementation: `screenshots/prueba-real-desktop-final.png`
- Mobile implementation: `screenshots/prueba-real-mobile-final.png`
- Full-view comparison: `screenshots/prueba-real-comparison-full.png`
- Focused content comparison: `screenshots/prueba-real-comparison-focused.png`
- State: homepage, first testimonial selected, videos paused with sound available

The prior approved-hero QA report is preserved at
`docs/design/approved-concept-1-hero-design-qa.md`.

## Viewports

- Source concept: 1586 x 992
- Desktop comparison: 1280 x 800
- Short desktop validation: 1280 x 720
- Mobile validation: 390 x 844

## Findings

No actionable P0, P1, or P2 findings remain.

### Fonts And Typography

- Plus Jakarta Sans is retained from the current AIT public-site system.
- The headline, kicker, labels, and factual descriptions preserve the source
  hierarchy without negative letter spacing, clipping, or truncation.
- The headline wraps responsively. Short desktop viewports use a tighter scale
  so the complete section remains visible with the fixed header.

### Spacing And Layout Rhythm

- Desktop preserves the source composition: one portrait featured video at
  left, a dominant heading at right, and four compact video selectors below.
- The 1280 x 720 section measures 566px high and leaves the next section visible.
- Mobile reorders the experience to heading, featured video, selectors, and
  proof note. It has no horizontal overflow.
- Radii, separators, and shadows remain restrained and match the approved
  institute direction.

### Colors And Visual Tokens

- Warm paper `#fbfaf7`, navy `#001a3d`, and muted gold `#c4932d` align with the
  approved hero and method-section palette.
- The selected state uses gold consistently through the number, play control,
  and underline. Inactive options remain navy and neutral.
- Text and control contrast remain legible on both the paper and media surfaces.

### Image Quality And Asset Fidelity

- All four existing staging poster and MP4 assets are used directly.
- The active video uses `object-fit: contain`, preserving the complete portrait,
  square, and landscape frames without stretching.
- Selector thumbnails also use `contain`; no replacement photography,
  generated people, or approximate assets were introduced.

### Copy And Content

- The approved headline is unchanged.
- The supporting sentence is concise and makes no invented outcome claim.
- Published durations come from the current content data: Jessica `2:52`,
  international `0:46`, Eric `0:42`, and Leila `1:06`.
- The concept's nonfunctional “more testimonials” link was replaced with a
  factual four-video proof note.

### Interaction And Accessibility

- The selector is an ARIA tab interface with associated tab panels.
- Click, ArrowLeft, ArrowRight, Home, and End selection paths are implemented.
- Switching videos pauses the previously selected video and never autoplays.
- Videos are not muted by default and retain native controls.
- Desktop browser console showed no errors or warnings.

## Comparison History

### Pass 1

- P2: the first desktop implementation measured 766px high at 1280 x 720,
  cutting off the proof note and conflicting with the project's desktop-section
  viewport rule.
- Fix: added a short-desktop treatment with tighter vertical padding, compact
  selector proportions, and responsive title sizing.

### Pass 2

- Evidence: `screenshots/prueba-real-desktop-final.png` and
  `screenshots/prueba-real-comparison-full.png`.
- Result: the complete section fits below the fixed header, all selectors remain
  readable and clickable, the next section is visible, and no P0/P1/P2 mismatch
  remains.

## Follow-up Polish

- P3: the selected concept is drawn at a taller 1586 x 992 viewport, so its
  featured video is intentionally larger than the short-desktop implementation.
  Taller production viewports retain the more spacious 4:5 selector treatment.

## Final Result

passed
