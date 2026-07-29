# AIT USA Homepage Design Consistency Contract

## User problem

The homepage is visually strong, but section-to-section alignment and mobile
content discovery drift after the React migration. Students should be able to
scan the method, compare study formats, find every location, and reach the final
action without learning a new visual or scrolling convention in each section.

## Chosen interaction model

- Keep the Hero full-bleed and the testimonial stories as the one intentional
  horizontal carousel.
- Keep Method as an editorial copy + portrait-video composition, but place its
  copy on the shared homepage content grid and use the shared framed heading.
- Present mobile study formats, supporting programs, and locations without
  hidden horizontal scrolling.
- Keep the final CTA as a focused two-column conversion block inside the shared
  wide-desktop content grid.

## Locked direction and behavior

- Preserve all approved copy, routes, media, map pins, hours, CTA behavior,
  callback dialog behavior, course links, and location links.
- Preserve Presencial as the visually dominant principal program.
- Preserve the dark testimonial chapter, its controls, and its dialog.
- Preserve the Hero composition and approved desktop/mobile variants.
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
  wrapping; only testimonial stories retain a horizontal rail.
- No page-level horizontal overflow.
- Mobile targets remain at least 44px where the existing interaction contract
  requires it.

## Evidence required

- Targeted homepage tests and asset integrity pass.
- Production webpack build passes.
- Browser verification passes with no runtime/console errors.
- Local and live staging screenshots at the primary viewports.
- DOM measurements confirm aligned desktop grids and no hidden horizontal
  overflow in mobile study, supporting-program, or location content.

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
