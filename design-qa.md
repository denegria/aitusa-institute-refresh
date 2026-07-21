# Design QA: Approved Concept 1 Hero

## Comparison Target

- Source visual truth: `docs/design/approved-concept-1-desktop.png`
- Latest viewport/crop source: `/root/.openclaw/giuseppe-workspace/media/inbound/openclaw-staged-53e763b9-0275-4e90-8886-8101b62a3e41/67fefdd1-4ef0-4aa5-8f62-eb57a2383e72.jpg`
- Latest 1904 x 950 implementation: `screenshots/hero-reference-1904x950.png`
- Latest short-desktop implementation: `screenshots/hero-short-1867x847.png`
- Latest full-view comparison: `/root/.openclaw/giuseppe-workspace/runtime/exports/aitusa-hero-viewport-fit/comparison-pass3-1904x950.png`
- Desktop implementation: `docs/design/evidence/hero-desktop-1440x900.png`
- Tablet implementation: `docs/design/evidence/hero-tablet-768x1024.png`
- Mobile implementation: `docs/design/evidence/hero-mobile-390x844.png`
- Full-view comparison: `docs/design/evidence/desktop-comparison.png`
- Focused header comparison: `docs/design/evidence/header-comparison.png`
- Focused modality/proof comparison: `docs/design/evidence/proof-comparison.png`
- Route and state: homepage, default light theme, signed-out public experience

## Viewports

- Desktop: 1440 x 900
- Wide reference: 1904 x 950
- Short desktop: 1867 x 847
- Tablet: 768 x 1024
- Mobile: 390 x 844

## Findings

No actionable P0, P1, or P2 mismatches remain.

The implementation preserves the source hierarchy: compact institute header, dominant editorial promise, integrated advisor/student classroom proof, two clear CTAs, three modality links, and the immediate three-part method band.

### Fonts And Typography

- The hero uses Georgia with Times New Roman fallback to match the source's editorial school tone.
- UI and supporting copy use Plus Jakarta Sans with local system fallbacks.
- Desktop maintains the approved four-line headline. Mobile reduces the scale while preserving the copy and hierarchy.
- No negative letter spacing, truncation, or clipped text remains.

### Spacing And Layout Rhythm

- Desktop header is 92px, the hero stage ends at 713px, and the proof band ends at 856px, matching the approved reference geometry.
- At 1904 x 950, the full opening composition ends at 923.97px. At 1867 x 847, the main stage, proof band, and community line scale together and end at 846.98px, keeping the complete story inside the viewport.
- Copy and logo share the same left alignment.
- CTAs and modalities remain grouped without overlapping the image.
- The approved `Clases reales...` transition appears immediately after the proof band, as shown in Concept 1.
- Tablet and mobile stack the image below the decision content with no horizontal overflow.

### Colors And Tokens

- The primary CTA uses the sampled approved navy `#002258`, and the proof band
  uses the sampled deep navy `#001a3d`.
- The eyebrow uses `#ad6e0e`; proof and modality icons use the warmer,
  reference-matched gold family rather than the previous yellow-gold treatment.
- The CTA hierarchy, gold icon treatment, proof-band dividers, and white header remain consistent across viewports.
- Contrast remains strong for headings, controls, proof copy, and focus indicators.

### Image Quality And Asset Fidelity

- The hero uses a clean production edit of the approved Concept 1 scene so its
  original broad white-to-photo dissolve can sit behind live HTML without
  duplicating flattened interface text.
- The advisor, foreground student, supporting students, classroom sign, branded
  folder, and placement booklet preserve the selected visual's composition and
  proof details.
- The desktop classroom master now renders at exactly the viewport width rather than 66px wider than the 1904px reference, revealing more of the original scene while retaining the reference's shallow vertical offset.
- Navigation, copy, CTAs, modalities, and proof statements remain live semantic HTML rather than baked image text.
- No placeholder imagery, CSS illustration, or custom SVG artwork is used.

### Copy And Content

- Eyebrow, headline, supporting paragraph, CTA labels, modality labels, and all three proof statements match the locked specification.
- The approved claim language is preserved verbatim.

### Icons

- Lucide icons provide one consistent line-icon family for navigation, CTAs, modalities, and proof statements.
- Gold modality and proof icons retain the visual role established by the source.

### Responsiveness And Accessibility

- No horizontal overflow at desktop, tablet, or mobile.
- All images load with no broken sources.
- Hero image includes descriptive alternative text.
- Mobile menu exposes its expanded state and accessible label.
- Escape closes the mobile menu and returns focus to the menu button.
- Primary, secondary, and modality links are keyboard-reachable semantic anchors.

## Interaction Evidence

- Primary CTA opened `/placement-test/` and rendered the level-finder form.
- Secondary CTA updated the URL to `#metodo` and scrolled the method section below the sticky header.
- Presencial opened `/courses/#ingles-presencial`, focused the matching course card, and displayed the correct title.
- Online and Híbrido expose matching route anchors through the same rendering contract.
- Mobile menu opened, exposed navigation, closed with Escape, and restored focus.
- Browser console check: no errors or warnings.

## Comparison History

### Pass 1

- P2: desktop headline wrapped from the intended four lines into six, increasing the hero height and pushing the proof band below the first viewport.
- Fix: reduced the desktop display scale, widened the usable copy column, and protected each approved line at desktop widths.
- Post-fix evidence: `docs/design/evidence/hero-desktop-1440x900.png`; the proof band is visible and the hero ends at approximately 883px.

### Pass 2

- P2: mobile headline and spacing made the copy block approximately 794px tall, leaving the classroom image outside the first viewport.
- Fix: reduced only the mobile display scale, tightened vertical gaps, shortened button height, and preserved all approved copy.
- Post-fix evidence: `docs/design/evidence/hero-mobile-390x844.png`; the classroom scene begins around 671px and is visibly established above the fold.

### Pass 3

- P2: at 768px portrait width, the three proof statements remained in desktop columns and wrapped too aggressively.
- Fix: stacked the proof statements below 900px while preserving the desktop three-column band and mobile spacing.
- Post-fix evidence: `docs/design/evidence/hero-tablet-768x1024.png`; proof headings and descriptions now retain a comfortable reading measure with consistent icon alignment.

### Pass 4

- P1: the implementation used a different clean classroom image, so the advisor, student, signage, folder, booklet, and crop could not match the approved Concept 1 visual.
- Fix: switched to the exact Concept 1 master, isolated its classroom region with a responsive CSS crop, and realigned the 92px header, 42/58 hero split, copy lines, CTA row, modality row, proof columns, and community transition.
- Post-fix evidence: `docs/design/evidence/desktop-comparison.png`, `docs/design/evidence/header-comparison.png`, and `docs/design/evidence/proof-comparison.png`.

### Pass 5

- P1: the copy/photo boundary remained a hard vertical seam, while the CTA blue,
  proof-band navy, eyebrow gold, and proof icon gold drifted from the approved
  reference.
- Fix: sampled the reference palette directly, replaced the flattened master
  with a clean edit of the approved classroom scene, and let its broad white
  feather overlap beneath the live copy.
- Post-fix evidence: `docs/design/evidence/desktop-comparison.png`,
  `docs/design/evidence/hero-tablet-768x1024.png`, and
  `docs/design/evidence/hero-mobile-390x844.png`.

### Pass 6

- P2: copy and controls sat too close to the photo transition; CTA labels and
  shadows felt heavier than the reference; the modality strip read as a
  bordered card and extended too far into the image.
- Fix: tightened the headline and summary measure, reduced CTA label weight and
  shadow, shortened the action group, removed the modality strip's outer
  border/radius/shadow, replaced full-height gold borders with short neutral
  dividers, and applied a subtle warm photographic finish.
- Post-fix evidence: `docs/design/evidence/controls-comparison.png`,
  `docs/design/evidence/desktop-comparison.png`,
  `docs/design/evidence/hero-tablet-768x1024.png`, and
  `docs/design/evidence/hero-mobile-390x844.png`.

### Pass 7

- P2: the secondary CTA used an outlined interior play shape, the modality strip
  stopped above the hero's bottom edge, and the hero content gutter did not
  exactly match the logo gutter across desktop widths.
- Fix: filled the play triangle while retaining the circle outline, anchored the
  modality strip to the hero bottom, and introduced one responsive desktop
  gutter shared by the header and hero content.
- Measured alignment: `57.6px` at 1440px and `24px` at both 1180px and 1060px;
  logo, copy, primary CTA, and modalities matched at each viewport with no
  horizontal overflow.
- Post-fix evidence: `docs/design/evidence/controls-comparison.png` and
  `docs/design/evidence/desktop-comparison.png`.

### Pass 8

- Annotation: reduce the large-desktop hero copy padding from 58px to 24px,
  move the modality strip with it, and rebalance the proof band horizontally.
- Fix: made 24px the desktop hero gutter while preserving the header's own
  navigation spacing; reduced the first proof group's inset from 88px to 54px
  and mirrored 54px on the third group's outer edge.
- Responsive decision: the existing 24px gutter at 1180px and 1060px remains
  unchanged, so the annotation removes a large-desktop jump rather than
  creating another breakpoint.
- Post-fix evidence: `docs/design/evidence/annotation-desktop-1647x746.png`,
  `docs/design/evidence/hero-desktop-1440x900.png`, and
  `docs/design/evidence/proof-comparison.png`.

### Pass 9

- P2: the hero and proof interiors were capped at 1440px and centered while the
  header continued across the viewport. On larger desktop displays this moved
  the hero copy, controls, and proof content far inside the logo edge and left
  unused white space beside the photograph.
- Fix: removed the 1440px interior cap and applied the header's responsive
  `clamp(32px, 4vw, 58px)` gutter to the hero copy, controls, modality strip,
  and outer proof groups. Tablet and smaller desktop layouts retain their
  existing 24px gutter below 1181px.
- Post-fix evidence: `docs/design/evidence/wide-desktop-1867x847.png`,
  `docs/design/evidence/hero-desktop-1440x900.png`, and
  `docs/design/evidence/proof-comparison.png`.

### Pass 10

- P2: immediately above the 1180px layout breakpoint, the fixed-width CTA row
  overflowed the copy column and the full-width modality strip reached into the
  photographic subject.
- Fix: introduced a fluid compact-control range from 1181px through 1439px.
  Buttons, icons, gaps, and modality height scale down together, while the
  approved full-size Concept 1 controls remain unchanged at 1440px and wider.
- Post-fix evidence: `docs/design/evidence/desktop-compact-1280x900.png` and
  `docs/design/evidence/hero-desktop-1440x900.png`.

### Pass 11

- P1: the 1867 x 847 desktop composition ended at 924px, placing the full proof band and the `Clases reales...` community line below the first viewport. The hero image also rendered at 1970.02px inside the 1904px reference frame and started 68.29px above the stage, producing the over-zoomed crop Alvaro flagged.
- Fix: made the desktop main stage, proof band, and community line share viewport-aware height tokens; added a compact vertical rhythm for shorter desktop screens; rendered the approved 1536 x 1024 master at exactly `100vw`; and tuned its vertical offset to `-2.5%` so the advisor, sign, students, and booklet match the supplied frame without enlarging the asset.
- Post-fix measurements: the 1904 x 950 composition ends at 923.97px with a 1904px-wide image; the 1867 x 847 composition ends at 846.98px with a 1867px-wide image. Both checks report zero viewport issues, console messages, or runtime exceptions.
- Post-fix evidence: `screenshots/hero-reference-1904x950.png`, `screenshots/hero-short-1867x847.png`, and `/root/.openclaw/giuseppe-workspace/runtime/exports/aitusa-hero-viewport-fit/comparison-pass3-1904x950.png`.

## Follow-Up Polish

- P3: the Lucide proof icons are intentionally simpler than the concept's generated illustrated icons, but they remain consistent, legible, accessible, and production-ready.

## Final Result

final result: passed
