# Study-format polish acceptance contract

## User workflow and problem

Homepage visitors compare the three primary English study formats, then discover
the institute's additional programs without mistaking Presencial's dark card
for an unfinished inconsistency.

## Chosen interaction model

- Keep the three existing study-format cards and their current links.
- Add a concise, truthful `Programa principal` signal to the existing
  Presencial card while retaining its `Presencial` modality marker.
- Replace the passive secondary-program sentence with a compact linked program
  rail that supports direct exploration.

## Selected visual direction

Institutional and restrained: reuse the homepage navy, gold, border, radius,
typography, and pill language. The rail should read as quiet program depth, not
as a second card grid or a competing conversion block.

## Locked behavior, state, and content

- Preserve the three study formats, summaries, ordering, and card destinations.
- Preserve Presencial as the visually primary offer.
- Preserve existing routes and use only valid course destinations.
- Preserve existing mobile horizontal-card behavior.
- Keep all other homepage sections unchanged.

## Explicit non-goals

- No hero, Method, Stories, Locations, FAQ, header, footer, or final-CTA changes.
- No new programs, popularity claims, pricing claims, or backend behavior.
- No branded-domain cutover or CRM data write.

## Viewports

- Primary: 1920×1080 CSS pixels.
- Regression: 1440×900, 1536×864, and 1920×930 CSS pixels.
- Mobile behavior remains locked and must not gain horizontal page overflow.

## Visual invariants

- The three study cards remain equal-height and aligned.
- The Presencial signal is subordinate to the modality marker and title.
- The program rail wraps cleanly without widening the section or increasing the
  page's overall visual weight materially.
- Heading hierarchy, section rhythm, card padding, and the transition into
  Locations remain unchanged.

## Content-growth assumptions

The rail contains five links at launch. It must wrap gracefully if labels grow
slightly, but it is not designed as an unbounded course catalog.

## Required closeout evidence

- Targeted homepage tests, asset check, production build, and `git diff --check`.
- Rendered staging evidence at all four desktop viewports.
- DOM confirmation of valid links, equal card alignment, rail wrapping, and no
  horizontal page overflow.
- Protected production smoke after the exact staging-approved commit reaches
  `main`.
