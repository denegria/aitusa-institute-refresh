# Graphic Concept Method section — design acceptance contract

## User workflow and problem

An adult learner should move through one coherent story: recognize their frustration, see their questions stated plainly, understand Graphic Concept as the route forward, learn its three practical principles, and finish with the real 1:45 explainer video.

## Chosen interaction model

A long-form editorial chapter faithfully rebuilt from the selected reference. The page uses the source's visual opening, numbered question rows, illustrated solution bridge, three-principle band, and final video conclusion as one continuous reading flow—not tabs, cards, or a carousel.

## Selected visual direction

Source visual truth: `references/graphic-concept-method-reference.webp`.

Faithful-reference mode. `references/graphic-concept-method-reference.webp` is the acceptance authority for its warm editorial paper, navy-and-gold ink illustration language, serif/italic display hierarchy, hairline rules, asymmetrical desktop composition, spacing rhythm, and narrative flow. Approved AIT English-learning copy and the real Method video replace only the mock's graphic-design claims and testimonial; no other visual translation or design-system exception is implied.

## Locked behavior, content, and state

- Preserve the approved Spanish Graphic Concept narrative and three pain questions.
- Preserve the three approved learning characteristics and their existing icons.
- Preserve the real AIT 1:45 video, poster, controls, accessible label, and mobile fullscreen behavior.
- Preserve the Method section anchor and reading order between the hero and student proof.
- Use existing AIT navy, blue, muted gold, warm surface, typography, and focus behavior.

## Explicit non-goals

- No changes to the hero, books, navigation, forms, routes, or production branch.
- No invented graphic-design curriculum, fake testimonials, or new interaction model.
- No decorative illustration that competes with or replaces the real video.

## Viewports

- Primary: 1440 × 900 CSS px.
- Regression: 1280 × 720, 768 × 1024, and 390 × 844 CSS px.

## Composition invariants

- The opening is two-column on desktop and keeps the title dominant over the illustration.
- The trust line stays visually attached to the opening copy, rather than creating a separate opening row.
- Numbered questions read as editorial rows, never boxed cards.
- Desktop questions preserve the source's asymmetry: the serif heading sits left of the three rule-separated rows.
- The solution bridge is a distinct warm panel with copy readable before its illustration.
- Three principles form one horizontal band on desktop and stack cleanly on mobile.
- The final video chapter feels conclusive and keeps the portrait media at a useful size.
- Section whitespace is intentional; no horizontal overflow or clipped content at regression viewports.

## Content-growth assumptions

- Exactly three pain questions and three principles for this release.
- Question copy may wrap to two desktop lines and several mobile lines without overlapping indices.
- The video label may grow by roughly 30% without clipping.

## Required closeout evidence

- Same-state source/reference and implementation screenshots compared at the primary viewport.
- Focused comparison of the opening, question/bridge sequence, and principle/video conclusion.
- Responsive screenshots or DOM measurements at all regression viewports.
- No page horizontal overflow, console errors, missing assets, or broken video controls.
- Repository tests, asset audit, production build, and browser verifier pass.
