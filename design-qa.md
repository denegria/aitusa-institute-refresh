# Design QA: Approved Concept 1 Hero

## Comparison Target

- Source visual truth: `docs/design/approved-concept-1-desktop.png`
- Desktop implementation: `docs/design/evidence/hero-desktop-1440x900.png`
- Tablet implementation: `docs/design/evidence/hero-tablet-768x1024.png`
- Mobile implementation: `docs/design/evidence/hero-mobile-390x844.png`
- Full-view comparison: `docs/design/evidence/desktop-comparison.png`
- Focused header comparison: `docs/design/evidence/header-comparison.png`
- Focused modality/proof comparison: `docs/design/evidence/proof-comparison.png`
- Route and state: homepage, default light theme, signed-out public experience

## Viewports

- Desktop: 1440 x 900
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

- Desktop header is 88px and the hero/proof composition ends at approximately 883px, leaving the next section visible at a 900px viewport.
- Copy and logo share the same left alignment.
- CTAs and modalities remain grouped without overlapping the image.
- Tablet and mobile stack the image below the decision content with no horizontal overflow.

### Colors And Tokens

- Navy, deep navy, gold, white, and neutral text map to the approved source.
- The CTA hierarchy, gold icon treatment, proof-band dividers, and white header remain consistent across viewports.
- Contrast remains strong for headings, controls, proof copy, and focus indicators.

### Image Quality And Asset Fidelity

- The hero uses a dedicated high-resolution image derived from the approved classroom art direction.
- The advisor, foreground student, and supporting students remain visible and naturally cropped.
- The standalone image intentionally omits baked-in navigation, copy, logos, and unreadable generated signage so the live page remains accessible and responsive.
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

## Follow-Up Polish

- P3: the source concept includes generated AIT branding inside the classroom image. The implementation removes it because the source asset was flattened and its text could not remain crisp or accessible across responsive crops.
- P3: the Lucide proof icons are slightly simpler than the concept's illustrated icons, but they are consistent, legible, and production-ready.

## Final Result

final result: passed

---

# Design QA: Homepage Phase 2 Method Section

## Comparison Target

- Source visual truth: approved Option 3 supplied in the Telegram design review.
- Locked composition: editorial copy at left, real instructor video stage at right, three-part method selector below.
- Brand corrections: Georgia display type, Plus Jakarta Sans support copy, Primary Ink, Deep Navy, CTA Navy, Institute Gold, and no decorative gradients.

## Implementation Contract

- Preserve the approved hero without modification.
- Preserve all three real AiT instructor videos and their supporting method copy.
- Do not ship the generated instructor or generated studio background from the concept image.
- Reproduce the dark studio mood with a Deep Navy stage and a darkened, blurred extension of each authentic video poster behind the untouched video.
- Implement the bottom strip as semantic tabs with click, Left/Right Arrow, Home, and End controls.
- Pause video in inactive panels.

## Responsive Contract

- Desktop: two-column copy/video composition with a three-column tab strip.
- Tablet: stacked copy and video with the three-column selector retained.
- Mobile: stacked copy and video with the tabs presented as full-width rows to avoid cramped labels and horizontal overflow.

## Validation Status

- Desktop, tablet, and mobile browser captures match the approved composition and brand corrections.
- All three real videos loaded metadata and produced visible frames.
- No missing images, horizontal overflow, console errors, runtime exceptions, or screenshot errors were found.
- Arrow Right selected the second tab, End selected the third tab, and the verifier restored the first tab at all three viewports.
- The instructor remains authentic. The source footage is not segmented; the dark studio mood is produced by the Deep Navy stage and a darkened extension of the real poster behind the untouched video.

## Final Result

final result: passed
