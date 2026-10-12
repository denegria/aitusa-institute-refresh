# Homepage Cohesion Pass — 2026-10-12

## Scope

Authorized homepage-only cohesion correction after production promotion of
`35cb6b6dd80d713be369fd8369d034f6bff3abbe`. Implementation is CSS-first in
`src/site-cohesion.css`; no `src/content.js`, config, dependencies, or runtime
behavior changed.

## Baseline geometry and accepted changes

- **Method:** Baseline `#metodo .method-story__opening` was a single block capped
  at 860px; desktop now uses the same content rail with the existing display
  title on the left and the existing introduction paragraph as a balanced right
  companion. At ≤900px it returns to the source-order stack. No display title
  scale or section narrative changed.
- **Chapter rhythm:** Homepage section headings now share a scoped horizontal
  gold rule and comparable kicker → heading → intro spacing. Navy/cream chapter
  contrast and local section hierarchy remain intact.
- **Actions:** The course-primary and closing CTA use the approved hero's
  `rgb(196 147 45 / 88%)` fill, `14px` corner, hover value, and raised shadow.
  Contextual outline/text actions remain variant-specific.
- **Books:** Baseline desktop books used the existing four-column gallery with
  a smaller `.9fr` Intro Plus feature column. The final uses a larger `1.12fr`
  feature column beside three defined cover columns and two rows, preserving
  real `160/209` and `177/219` cover ratios. Mobile remains Intro Plus followed
  by a two-column six-cover sequence.
- **Complementary programs:** The actual earlier region is `#elige-tu-curso`
  (`.study-goal` cards), not `#cursos-apoyo`. At mobile widths only its
  decorative icon footprint, card padding, and grid gap are reduced; words,
  font sizes, and full-card targets remain.

## Locked invariants

Copy (including whitespace-normalized text), fonts, palette, media, URLs,
interaction logic, section order, English-format gold outline, and form/link
behavior remain unchanged. No production promotion, push, form submission,
provider send, or dependency/config change is part of this implementation.

## Evidence packet

Final commit, validation log, release-surface log, screenshots, geometry
measurements, and residual limitations are recorded under
`runtime/audits/aitusa-cohesion-implementation-2026-10-12/` after finalist
verification.

## Polish follow-up — 2026-10-12

- **Testimonial poster:** The international student card now uses a poster
  cropped from the existing real testimonial video so the person fills the
  same documentary card frame as the neighboring interviews. The overlay is
  lighter and the play control remains clearly legible. No generated or
  composited person imagery was introduced.
- **Surface family:** Complementary-program cards, testimonial cards, and
  compact location rows share a restrained border/shadow family. The primary
  English offer retains its intentional gold outline.
- **Boundaries:** The FAQ transition uses a quiet navy rule and deliberate
  breathing room instead of a full-width gold glow; the local gold kicker/rule
  remains the section cue.
- **Closing/footer:** On the homepage only, the final conversion block and
  utility footer gain a quiet separation and mobile breathing room. Copy,
  actions, targets, and footer links are unchanged.

The polish remains homepage-scoped. Locked hero, Method, books, palette,
font, copy, section order, URLs, JavaScript behavior, routes, dependencies,
configuration, auth, payment, and production state are unchanged.
