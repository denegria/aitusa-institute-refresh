# AIT USA Flagship Course Detail Template Contract

## User workflow and problem

A prospective adult English student arrives with one question: is this the
right program for my level, schedule, and goal? The current canonical course
route repeats the generic catalog, modality cards, filters, and unrelated
program cards before exposing the selected course inside a disclosure. At
1440×900 the selected detail begins 2,252px below the first viewport.

## Chosen interaction model

- Open directly on the selected program as an editorial academic page.
- Establish one reusable, content-driven template with program data supplying
  the hero, outcomes, levels, format/schedule facts, method proof, student story,
  FAQ, and CTA copy.
- Use the flagship `ingles-jovenes-adultos` program as the first complete
  content model. Other course routes remain on the existing experience until
  their editorial fields are reviewed and filled.
- Make the placement test the single dominant action. Advisor/WhatsApp access
  remains available as a quieter text link for questions.

## Selected visual direction

- Prestigious language-school editorial: generous white space, deep navy
  academic bands, restrained warm-gold rules, large photography, and numbered
  learning stages.
- Use the existing AIT type, color, radius, and grid tokens. Avoid another card
  system, decorative gradients, floating glass effects, excessive gold, or
  ornamental animation.
- Real-person video is framed as documentary proof, not a testimonial carousel.
  Existing approved photography is temporary template media until the client
  supplies the planned classroom/faculty shoot.

## Locked behavior and content

- Preserve the canonical route, metadata, Course schema, public header/footer,
  placement-test destination, WhatsApp destination, and Spanish canonical
  redirect.
- Preserve verified program facts: audience, three formats, Basic/Intermediate/
  Advanced pathway, current published schedule language, Graphic Concept
  framing, tutor/workshop support, and the per-location availability caveat.
- Do not introduce accreditation, guaranteed outcomes, guaranteed completion
  time, guaranteed availability, tuition, enrollment dates, faculty
  credentials, country counts, or undocumented claims.
- The Jessica story may describe her documented path from student to teacher,
  but must not fabricate a quote or academic outcome.

## Non-goals

- No redesign of the `/courses/` catalog in this slice.
- No mirroring to the other eight course pages until this flagship template is
  reviewed.
- No placement-test redesign, CRM write, registration workflow, pricing,
  checkout, CMS, faculty directory, or media-production work.
- No production/main promotion.

## Primary and regression viewports

- Primary desktop: 1440×900 CSS pixels.
- Desktop regressions: 1366×768 and 1920×1080.
- Primary mobile: 390×844.
- Mobile regressions: 360×800 and 430×932.
- Device-pixel ratio 1 for acceptance evidence unless explicitly noted.

## Layout and hierarchy invariants

- At 1440×900, Header + complete Hero + academic proof ledger fit in the first
  viewport.
- The course title, audience/format signal, lead, and primary placement CTA
  remain visible before the first desktop scroll.
- On mobile, the title, lead, and primary CTA appear before the hero image; no
  action is hidden behind a carousel, disclosure, or horizontal rail.
- Each major chapter has one visual job and no nested horizontal scrolling.
- Body copy stays within a readable measure; no clipped, clamped, or
  overprinted text.
- Interactive targets are at least 44px high, visible focus is preserved, and
  native video/details controls remain keyboard accessible.
- The page has one H1, ordered H2 chapters, semantic lists/definitions, and no
  page-level horizontal overflow.

## Content-growth assumptions

- Three learning stages, three outcomes, three study-format facts, three
  schedule groups, one story, and up to six course FAQs.
- Template data must support later program-specific replacement without
  component markup changes.
- Missing editorial data must never render an empty chapter; non-flagship routes
  retain the current fallback until complete data exists.

## Required closeout evidence

- Targeted course-route/content tests, full test suite, asset integrity,
  production webpack build, npm audit, and `git diff --check`.
- Local production-mode screenshots and DOM measurements at all primary and
  regression viewports.
- Live protected-staging smoke for the exact deployed commit at 1440×900 and
  390×844, including canonical metadata/schema, CTA destinations, video/details
  keyboard semantics, overflow, and console state.
- Side-by-side evidence that the flagship route no longer repeats the catalog or
  buries its selected content.

---

# AIT USA Course Template Stress-Test Contract

## User workflow and problem

The approved adult-English page proves the editorial direction for one language
program, but it does not yet prove that the shared template can represent both a
second delivery model and a structurally different academic program. Duplicating
the markup route-by-route would make later approval changes expensive; forcing
every program into language levels would make the content inaccurate.

## Chosen interaction model

- Keep one shared `course-editorial-v1` renderer.
- Add reviewed content for `ingles-online-adultos` and `ged`.
- Let program data override chapter copy, pathway labels, method framing, hero
  note, and the primary action without branching on a slug in the component.
- Keep the placement test dominant for English. Use admissions as the primary
  action for GED because the English placement test is not its entry workflow.
- Allow documentary proof to be omitted when no program-relevant story exists;
  do not reuse an unrelated testimonial simply to fill the template.

## Locked facts and claims

- English Online is for young people and adults outside the United States, uses
  live teacher-led classes that are not prerecorded, and follows Basic,
  Intermediate, and Advanced levels.
- The published online schedule contains duplicate conflicting evening blocks;
  use the cleaner 70-minute evening sequence already verified for the flagship
  page and qualify all availability by active group and time zone.
- GED is preparation for the New Jersey high-school-equivalency pathway, not the
  diploma issuer or official testing center.
- The current GED assessment has four subject tests. AIT's live product listing
  publishes an estimated six-month preparation period, two one-hour classes per
  week, and four Saturday blocks; present the duration as an estimate, never a
  guarantee.
- Do not publish GED pricing, guaranteed passing, guaranteed completion,
  official-test-center status, or automatic eligibility.

## Responsive and content invariants

- Retain the flagship viewports and first-screen Hero/ledger contract.
- Support three language stages or four GED subject areas without fixed-height
  clipping or horizontal rails.
- Every rendered chapter must have program-relevant copy; optional chapters must
  disappear cleanly.
- Maintain one H1, ordered H2 chapters, 44px action targets, canonical metadata,
  Course schema, and no page-level overflow.

## Evidence required

- Targeted course content/route tests for all three editorial programs.
- Full test suite, asset integrity, production webpack build, npm audit, and
  `git diff --check`.
- Local production-mode browser evidence for both new routes at 1440×900 and
  390×844, plus overflow/console/CTA/FAQ checks.
- Live canonical staging smoke for the exact deployed commit. Production remains
  out of scope.

---

# AIT USA Course Detail Bulk-Rollout Contract

## User workflow and problem

Six remaining canonical course routes still fall back to the generic catalog
experience. A visitor selecting children’s English, Spanish, math tutoring, or a
technology course should land directly on the chosen program and understand its
goal, learning path, published schedule context, and next admissions step.

## Chosen interaction model

- Reuse the accepted `course-editorial-v1` renderer for all nine programs.
- Keep route markup shared; each program supplies reviewed editorial data.
- Use admissions as the dominant action for children’s English, Spanish, math,
  computing, office, and repair because the adult English placement test is not
  their documented entry workflow.
- Let learning stages represent age-appropriate progression, tutoring workflow,
  software modules, or technical practice rather than forcing every route into
  language levels.
- Omit documentary proof when no program-relevant story exists.

## Locked facts, claims, and boundaries

- Children’s English remains online for ages 8–13, uses Graphic Concept,
  bilingual-to-English instruction, family progress reporting, and the currently
  published weekday/Saturday blocks. Do not promise the published ten-month
  target or automatic schedule changes.
- Spanish remains an online conversational program. Do not publish instructor
  nationality, duration, proficiency guarantees, or a fixed schedule without
  current client confirmation.
- Math tutoring remains support for secondary and university students, with
  subject, level, mode, and schedule confirmed before starting. Do not promise
  grade improvement or exam outcomes.
- Basic computing may cover internet, files, operating-system basics, security,
  and everyday digital tasks. Office computing may cover Word, Excel, and
  PowerPoint. Published schedules and module durations are presented as
  references that admissions must confirm.
- Computer repair remains an introductory diagnosis, maintenance, and repair
  route. Do not promise mastery of every brand/model, certification, employment,
  networking coverage, or a guaranteed timetable.
- Preserve canonical metadata, Course schema, header/footer, Spanish redirect,
  WhatsApp/contact destinations, and all existing safety/consent boundaries.
- No pricing, checkout, CRM write, registration workflow, accreditation claim,
  guaranteed outcome, guaranteed duration, guaranteed availability, or
  production/main promotion.

## Responsive and content invariants

- Preserve the accepted desktop 1440×900 and mobile 390×844 primary viewports,
  plus 1366×768, 1920×1080, 360×800, and 430×932 regressions.
- Header + complete Hero + proof ledger fit inside the first 1440×900 viewport.
- Mobile title, lead, and primary action remain above the hero image.
- Support two or three program stages without fixed-height clipping or horizontal
  rails.
- Every chapter has program-relevant copy; no unrelated English placement or
  testimonial content appears.
- Maintain one H1, ordered H2 chapters, 44px action targets, no page-level
  overflow, and clean canonical/schema output.

## Required closeout evidence

- Targeted route/content tests covering all nine editorial programs.
- Full test suite, asset integrity, production webpack build, npm audit, and
  `git diff --check`.
- Local production-mode QA for all six new routes at 1440×900 and 390×844, plus
  flagship regression and targeted narrow/wide viewport checks.
- Verify CTA destinations, FAQ interaction, loaded images, first-screen
  Hero/ledger fit, minimum action size, horizontal overflow, and console state.
- Live canonical staging smoke for the exact deployed commit. Production remains
  out of scope and client visual review remains the next gate.

---

# AIT USA Compact Mobile Study Options Contract

## User workflow and problem

Mobile visitors need to compare Presencial, Híbrido, and Online before choosing
a route. The current section exposes everything correctly, but its 1,102px
height turns a simple three-way decision into a 1.3-viewport card stack.

## Chosen interaction model

- Keep all three study formats visible in one static vertical decision list.
- Convert each mobile card into a compact two-column row: format and concise
  description at left, a 44px arrow-only action at right.
- Preserve Presencial as the navy `Programa principal`; keep Híbrido and Online
  quieter but equally reachable.
- Use complete mobile-specific summaries instead of clipping or line-clamping
  the desktop descriptions.
- Present the five supporting programs as a fully visible two-column link list.
  Do not add a carousel, swipe rail, disclosure, ticker, or hidden overflow.

## Locked behavior and content

- Preserve the three offerings, order, destinations, desktop descriptions,
  desktop CTA labels, and the `Programa principal` hierarchy.
- Preserve all five supporting-program destinations and labels.
- Preserve the chapter title, kicker, mobile chapter accent, desktop section,
  and adjacent homepage sections.
- Every compact arrow-only action retains the complete existing CTA as its
  accessible name.

## Selected visual direction

- Institutional decision ledger using the existing white, navy, warm-gold,
  border, type, and 8px-radius system.
- Compact rows, not miniature cards. No new icons, shadows, decorative
  animation, gradients, or visual system.
- Supporting programs become quiet text links separated by rules, subordinate
  to the three primary formats.

## Non-goals

- No desktop redesign.
- No route, navigation, course-content, placement-test, Study Buddy, CRM, or
  data change.
- No horizontal card rail, accordion, tab system, or course-page work in this
  slice.

## Viewports and invariants

- Primary mobile viewport: 390×844 CSS pixels.
- Regression mobile viewports: 360×800 and 430×932.
- Desktop regression: 1440×900; rendered dimensions and content must remain
  unchanged from the current staging baseline.
- At 390×844, the complete section must fit below the 72px sticky header inside
  one viewport: section height at or below 772px.
- All three primary formats and all five supporting links remain visible without
  interaction.
- No summary clipping, line clamp, text overlap, nested scrollbar, or
  page-level horizontal overflow.
- Mobile link targets remain at least 44px high.
- Content-growth assumption: exactly three primary formats and five supporting
  programs for this homepage decision surface.

## Required closeout evidence

- Targeted homepage integration tests, full test suite, asset integrity,
  production webpack build, audit, and `git diff --check`.
- Browser screenshots and DOM measurements at 390×844, 360×800, 430×932, and
  desktop 1440×900.
- DOM evidence for section height, three visible format rows, five visible
  supporting links, 44px targets, unchanged hrefs, and no horizontal overflow.
- Protected live-staging smoke for the deployed commit with no console errors.

This contract supersedes the prior homepage contract only for the mobile
study-format card composition and supporting-program presentation. The prior
no-hidden-content rule, Presencial hierarchy, content, routes, and all desktop
behavior remain locked.

---

# AIT USA Institutional Proof Band Contract

## User problem

The homepage hero is visually polished, but it reaches the next chapter without
establishing the institute's longevity, scale, physical presence, or wider
student reach. The proof needs to feel academic and prestigious without
duplicating the Hero eyebrow or forcing the Hero below the first desktop
viewport.

## Chosen interaction model

- Place one restrained navy institutional ledger directly after the Hero image
  and copy, inside the Hero section.
- Give all four facts equal editorial weight: `Desde 2004`, `+1,000
  estudiantes`, `4 sedes`, and `Alcance internacional`.
- Move `Desde 2004` out of the Hero eyebrow so it appears only once.
- Use a four-column desktop ledger with fine gold dividers and a compact 2×2
  mobile ledger with no carousel, ticker, animation, or hidden content.
- Preserve the existing Hero CTAs, modalities, approved photography, and all
  following homepage chapters.

## Locked direction and content

- Navy ground, warm gold accents, white type, square geometry, and restrained
  separators from the selected proof-band concept.
- Keep `Desde 2004` materially smaller than the rejected oversized concept and
  at the same hierarchy as the other three facts.
- The international fact must read `EE. UU., Centroamérica y Sudamérica`; do
  not imply countries, campuses, accreditations, or student counts that have not
  been supplied.
- The Hero eyebrow becomes `Escuela de inglés en Nueva Jersey`.
- No added gold headline, decorative icon set, card shadows, gradients, or
  serif typeface.

## Viewports and invariants

- Primary: 1440×900 desktop and 390×844 mobile CSS viewports.
- Regression: 1536×864, 1920×930, 1920×1080, 360×800, and 430×932.
- At desktop widths of 1041px and above, header + Hero main + proof band must
  equal at most `100svh`; the Method chapter may not enter the first viewport.
- The desktop proof band remains a single four-column row with no clipping or
  page-level horizontal overflow.
- On mobile, all four facts remain simultaneously discoverable in a static 2×2
  ledger. No horizontal scrolling or auto-rotation.
- Mobile proof height is compact enough to preserve the Hero's visual momentum;
  labels may tighten, but no fact may be hidden.
- Text remains readable at 360px without truncation, overlap, or line clamping.

## Required closeout evidence

- Targeted institutional-proof tests, full test suite, asset integrity,
  production webpack build, and `git diff --check`.
- Browser screenshots at the primary and regression viewports.
- DOM measurements confirming desktop first-viewport fit, a four-column desktop
  band, a 2×2 mobile band, four visible facts, and no horizontal overflow.
- Live protected-staging smoke with no runtime or console errors.

This contract supersedes the prior contract only for the Hero eyebrow, Hero
height budget, and the addition of the institutional proof band. All other
homepage consistency decisions remain locked.

---

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
  locations, keep Online in Courses, and keep published hours permanently
  visible in the section.
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
  readability allowance; Sedes must fit a 390×844 viewport with its complete
  hours panel visible.
- Every physical location remains reachable through swipe, the visible rail
  controls, and map pins. The selected card and selected pin share one state.
- Map focus is reversible through an on-map overview control and must not
  navigate or open a new tab.
- Published hours remain complete, permanently visible, and legible at 14px or
  larger.
- The hours panel is scoped only to the verified Bound Brook headquarters.
  Never imply that Plainfield or Piscataway share its hours until source
  evidence confirms that. Group the weekly schedule into `Entre semana` and
  `Fin de semana`, with the exact verified slots for `Lun–jue`, `Vie`, `Sáb`,
  and `Dom`.
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
- DOM measurements confirm four physical location rows, four visible schedule
  slots in two visible day groups with no disclosure control, consistent mobile
  intro markers, an opaque header, and no stale FAQ navigation state.
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
