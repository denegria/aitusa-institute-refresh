# AIT USA Homepage Design Consistency Contract

## User problem

The homepage is visually strong, but section-to-section alignment and mobile
content discovery drift after the React migration. Students should be able to
scan the method, compare study formats, find every location, and reach the final
action without learning a new visual or scrolling convention in each section.

## Chosen interaction model

- Keep the Hero full-bleed and the testimonial stories as an intentional
  horizontal carousel.
- Keep Method as an editorial copy + portrait-video composition, but place its
  copy on the shared homepage content grid and use the shared framed heading.
- On mobile, pair Method's portrait video with the three fully visible reasons
  instead of stacking four full-width blocks.
- Present mobile study formats and supporting programs without hidden
  horizontal scrolling.
- Treat Sedes as a physical-location lookup: show the four New Jersey
  locations, keep Online in Courses, and place published hours in an explicit
  native disclosure.
- Restore a compact mobile location rail with a visible next-card peek,
  counter, and 44px previous/next controls. Selecting a card or pin focuses the
  existing on-page map; only the explicit `Cómo llegar`/`Consultar` action may
  leave the page.
- Keep the verified static New Jersey map asset and add controlled zoom/focus
  behavior. Do not introduce a map SDK, API key, live tile dependency, or
  geolocation permission.
- Keep the final CTA as a focused two-column conversion block inside the shared
  wide-desktop content grid.

## Locked direction and behavior

- Preserve all approved copy, routes, media, map pins, hours, CTA behavior,
  callback dialog behavior, course links, and location links.
- Preserve Presencial as the visually dominant principal program.
- Remove modality chips whose text duplicates the course-card heading; retain
  only the truthful `Programa principal` hierarchy signal.
- Preserve the dark testimonial chapter, its controls, and its dialog.
- Give Experiences a visible desktop chapter accent and FAQ a guaranteed
  mobile horizontal accent.
- Preserve the Hero composition and approved desktop/mobile variants.
- Use the same horizontal gradient marker on every mobile chapter intro after
  the Hero. Method must not retain a mobile vertical rule.
- Replace the repeated `Sedes` kicker + `Sedes cerca de ti` opening with one
  contextual kicker and one section title.
- Keep the OpenStreetMap attribution visible but materially smaller; remove the
  separate external-map launch control.
- Keep the sticky header fully opaque and clear the navigation active state
  while the unlisted FAQ chapter is the reading section.
- Do not touch production, CRM writes, portal behavior, or Study Buddy behavior.

## Non-goals

- No wholesale card-system redesign.
- No new carousel framework or interaction dependency.
- No content rewrite, route change, or architectural refactor.

## Viewports

- Primary: 1440×900 desktop and 390×844 mobile CSS viewports.
- Regression: 1920×930 wide desktop, 360×800 compact mobile, and 430×932 mobile.
- Assume device-pixel ratio 1 for acceptance screenshots; CSS viewport
  dimensions, not physical display resolution, are authoritative.

## Invariants

- Standard desktop chapter grid: responsive 1180–1320px content width.
- Sedes stays within the usable short-desktop viewport without compressing its
  map, location rows, or published-hours content.
- Method heading baseline matches standard framed headings while its media stays
  portrait and centered.
- Mobile informational/lookup sections expose all options vertically or through
  wrapping, except for the explicitly controlled testimonial and location
  rails.
- Method and Sedes stay within one compact-mobile viewport plus a small
  readability allowance; Sedes must fit a 390×844 viewport when its hours
  disclosure is closed.
- Every physical location remains reachable through swipe, the visible rail
  controls, and map pins. The selected card and selected pin share one state.
- Map focus is reversible through an on-map overview control and must not
  navigate or open a new tab.
- Published hours remain complete and legible at 14px or larger when expanded;
  the disclosure summary is at least 44px tall.
- Desktop Method H2 stays at or below 1.22× the Hero H1, preserving emphasis
  without overtaking the page title.
- No page-level horizontal overflow.
- Mobile targets remain at least 44px where the existing interaction contract
  requires it.

## Evidence required

- Targeted homepage tests and asset integrity pass.
- Production webpack build passes.
- Browser verification passes with no runtime/console errors.
- Local and live staging screenshots at the primary viewports.
- DOM measurements confirm aligned desktop grids and no hidden horizontal
  overflow in mobile study or supporting-program content.
- DOM measurements confirm four physical location rows, a closed-by-default
  hours disclosure, consistent mobile intro markers, an opaque header, and no
  stale FAQ navigation state.
- Interaction evidence confirms card selection, pin selection, mobile rail
  controls, manual rail scrolling, map focus/reset, and external navigation only
  from the dedicated location CTA.

This contract supersedes only the prior contract's locked mobile horizontal-card
behavior. Its study-format content, links, Presencial hierarchy, and restrained
institutional direction remain locked.

---

# Prior contract: Study-format polish

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
