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

- Source visual truth: approved Option 3 supplied in the Telegram design review at 1487 x 1058.
- Source visual path: `/root/.openclaw/giuseppe-workspace/media/inbound/openclaw-staged-dff56a70-a7e6-4ffe-ac42-5b6935255975/bfa38782-ca05-44c8-b591-60d724e13f94.jpg`.
- Implementation screenshot: `runtime/exports/aitusa-homepage-phase2-method-fade-qa-v2/desktop-home-method.png`.
- Comparison viewport/state: desktop 1440 x 1400 browser capture, homepage default state, first Method tab selected, video paused at its poster.
- Focused fade evidence: the full-view comparison is also a focused Method-section crop; boundary and 100px-in RGB samples are recorded in Pass 3 because the remaining issue was tonal blending rather than unreadable typography or controls.
- Locked composition: 37% editorial copy / 63% video, 74% main stage / 26% selector.
- Locked visual language: Plus Jakarta Sans headline, electric-blue second phrase, blue-to-gold vertical rule, minimal Graphic Concept copy, full-bleed real video, and original blue-number selector.

## Implementation Contract

- Preserve the approved hero without modification.
- Preserve all three real AiT instructor videos and their supporting method copy.
- Do not ship the generated instructor from the concept image.
- Use a poster derived from the real AiT instructor video, composited over the approved studio backdrop; play the authentic source video unchanged.
- Implement the bottom strip as semantic tabs with click, Left/Right Arrow, Home, and End controls.
- Pause video in inactive panels.

## Responsive Contract

- Desktop: two-column copy/video composition with a three-column tab strip.
- Tablet: stacked copy and video with the three-column selector retained.
- Mobile: stacked copy and video with the tabs presented as full-width rows to avoid cramped labels and horizontal overflow.

## Comparison History

### Pass 1 — rejected

- P1: the implementation used a constrained floating card instead of the source's full-bleed 1487:1058 frame.
- P1: Georgia, gold, and Primary Ink replaced the source's sans-serif/electric-blue headline treatment.
- P1: supporting body and proof paragraphs added density that is absent from the approved composition.
- P1: the video was contained inside a narrow navy stage instead of filling the complete right panel.
- P1: selector proportions, numbers, active state, and top notch did not match the source.

### Pass 2 — passed

- Rebuilt the section as the source's full-bleed 1487:1058 frame with measured 37.1/62.9 columns and 74.3/25.7 rows.
- Restored the approved sans-serif navy/electric-blue headline, blue-to-gold rule, minimal Graphic Concept treatment, and original selector geometry.
- Replaced the generated instructor with a frame extracted from the real AiT video and matched the studio backdrop for the paused poster state.
- Matched the first selector's active blue number, top rule, downward notch, gold dividers, and 37.1/31.45/31.45 widths.
- Corrected desktop typography rhythm and detail placement against a side-by-side source/implementation comparison.
- Preserved native video controls, keyboard-operable tabs, inactive-video pausing, and lazy metadata loading on activation.

### Pass 3 — fade refinement

- P2: the copy/video transition still read as a vertical panel seam because the video filter darkened the poster's first pixels while the copy edge remained too bright.
- Fix: added a dedicated raster haze layer over the video edge and deepened only the copy panel's boundary atmosphere, preserving text contrast and leaving the live video controls interactive.
- Post-fix evidence: `runtime/exports/aitusa-homepage-phase2-method-fade-qa-v2/method-fade-comparison.png`.
- Boundary sampling at the same visual point is now effectively matched: source `rgb(189, 193, 204)`, implementation `rgb(189, 194, 199)`. At 100px into the dissolve, source `rgb(115, 110, 107)`, implementation `rgb(111, 118, 127)`; the small hue difference reflects the authentic-video backdrop rather than fade geometry.

## Validation Status

- Source/implementation comparison: `runtime/exports/aitusa-homepage-phase2-method-fade-qa-v2/method-fade-comparison.png`.
- Desktop, tablet, and mobile browser captures completed with no missing images, video metadata failures, black frames, overflow, console errors, or runtime exceptions.
- Keyboard checks passed for ArrowRight, End, and restored first-tab selection.
- No actionable P0, P1, or P2 mismatches remain.

## Final Result

final result: passed
