# AIT USA Result Claim + Portal Entry Hotfix — 2026-08-20

## User workflow and problem

- A student must be able to complete the anonymous diagnostic, see the result,
  and claim it into a verified student account without CRM or employee-review
  work blocking that value-delivery path.
- Employees need a staff-branded sign-in surface. Student and employee accounts
  remain separate even though both surfaces use the same passwordless identity
  infrastructure and session-cookie mechanism.

## Interaction model and visual direction

- Student flow: anonymous result -> explicit `Guardar mi resultado` -> verified
  student account -> employee review and CRM task are queued afterward.
- Employee flow: `/employee/sign-in/` -> passwordless OTP -> exact employee
  return path. Reuse the established Portal card, typography, spacing, navy,
  gold, and warm-white system with staff-specific copy.
- Public discovery: discreet footer links for `Portal estudiantil` and
  `Acceso de empleados`; no employee CTA in the primary header or homepage hero.
- Reference mode: inspiration mode constrained by the shipped student Portal.

## Locked behavior, permissions, and non-goals

- Diagnostic completion cannot create an employee review or CRM task.
- A claimed adult/guardian result is eligible for idempotent review creation;
  a repair runner may reconcile claimed results missing reviews.
- Completion retries reuse one client completion ID and an already-persisted
  result remains claimable.
- Student sign-in accepts only non-employee Portal accounts. Employee sign-in
  accepts only active AIT USA senior/admin reviewer accounts. An employee
  identity cannot claim or open a student Portal result.
- Return paths stay same-origin and explicitly allowlisted. Unauthorized roles
  remain indistinguishable behind fail-closed behavior.
- Non-goals: separate authentication providers, shared/dual-role UX, employee
  CTA promotion, coordinator provisioning, Resend setup, or CRM redesign.

## Responsive and evidence contract

- Primary CSS viewports: 1440x900 and 390x844.
- Regression CSS viewports: 1024x768 and 430x932.
- The employee sign-in card must preserve one clear primary action, visible
  staff context, 44px controls, keyboard focus, and no horizontal overflow.
- Required evidence: focused diagnostic/claim/auth/review tests, complete
  repository validation, production build, browser checks for both entry pages
  at primary viewports, allowlisted redirect tests, and production read-only
  smoke after the approved deployment.

---

# AIT USA Responsive Conversion Corrections — 2026-08-18

## User workflow and problem

- A prospective student should enter the homepage and course catalog without
  announcement copy colliding with the hero at common tablet widths, should
  reach catalog comparison controls and course cards without a manifesto-sized
  first screen, and should see an accurate location claim.
- This is a focused correction pass from the Grok 4.6 production review. It is
  not authorization for a homepage redesign, new CTA work, navigation changes,
  course-content changes, or production promotion.

## Chosen interaction model and visual direction

- Reference mode: inspiration mode constrained by the existing navy/gold AIT
  design system and current information architecture.
- Preserve the existing hero and catalog composition while tightening vertical
  rhythm and responsive clearance. The catalog must become comparison-first:
  filters and the first useful course content move materially upward without
  hiding the catalog introduction or breaking hierarchy.

## Locked behavior, content, and non-goals

- Fix the España announcement-bar/hero-kicker collision at 1024x768 and
  768x1024 with visible separation; do not hide either element.
- Compress `/cursos/` so filters and first course content are materially closer
  to the first viewport at 1440x900, while preserving one H1, readable copy,
  current filter behavior, focus states, and all course content.
- Replace the unsupported homepage `4 sedes` claim with wording justified by
  the actual location inventory rendered by the site. Do not guess a business
  taxonomy; use a truthful count/qualifier supported by the current data.
- Preserve Spanish-first copy, existing routes, public header/footer, hero
  media, placement-test behavior, catalog filtering semantics, and 44px action
  targets. No horizontal page overflow.
- Non-goals: homepage CTA, header `Cursos` destination, mobile filter
  discoverability, study-card affordance, portal/auth, CRM/data/provider work,
  or production/main changes.

## Responsive and evidence contract

- Primary CSS viewports: 1440x900 and 390x844.
- Regression CSS viewports: 1024x768 and 768x1024.
- At both tablet widths, the announcement bar and hero kicker have positive
  visual/DOM clearance and no overlap.
- At desktop, catalog tabs begin above the old ~799px position and the first
  course content begins materially above the old ~1050px position; target a
  useful first comparison within or immediately after the first viewport.
- At mobile and tablet widths, compression must not create clipped text,
  stacked-control collisions, unreadable measures, or page overflow.
- Required evidence: targeted tests if present, `npm run validate`, production-
  mode browser checks at all four viewports, DOM positions for announcement,
  kicker, filters, and first course content, zero console/runtime errors, and
  `git diff --check`.

---

# AIT USA Homepage Launch Corrections — MIS-394

## User workflow and problem

- A prospective student should understand at a glance that AIT USA has already
  launched in Spain, see credible international-student proof, and compare the
  supporting courses through the same visual/action language used by the main
  study-format cards.
- The current ribbon still describes Spain as a future stop, the country strip
  relies on platform-dependent emoji instead of dependable flag artwork, and
  accumulated CSS overrides leave the supporting-course heading indented and
  the cards/CTAs visually inconsistent.

## Chosen interaction model and visual direction

- Reference mode: faithful-reference to Alvaro's explicit annotations and the
  existing `#cursos` offer-card system immediately above the supporting-course
  section.
- Keep the gold eyebrow, replace all competing launch copy with one full-width
  confirmed-launch headline, and preserve the ribbon gradient, sweep, pulse,
  and orbit artwork.
- Render all 21 Spanish-speaking country flags as real local SVG image assets in
  a slim edge-to-edge strip that may scroll horizontally on narrow viewports.
- Make each supporting-course card use the same status hierarchy, card rhythm,
  bordered CTA box, hover/focus behavior, and mobile row treatment as the main
  course cards while retaining accurate route-specific copy.

## Locked invariants and non-goals

- Locked: gold ribbon eyebrow; one Spain-launch headline; existing hero image;
  all 21 named countries; six supporting routes; 44px minimum CTAs; one H2 for
  the supporting-course section; visible keyboard focus; no horizontal page
  overflow.
- Source-to-render map: ribbon eyebrow -> existing gold eyebrow; launch state ->
  one `strong` headline spanning the available ribbon; country data -> local SVG
  image per list item; main `offer-node` card/CTA language -> supporting card and
  CTA selectors at desktop and mobile.
- Non-goals: navigation, Portal/auth, CRM, testimonials, course-route content,
  Method section, or a broader homepage redesign.

## Responsive and evidence contract

- Primary CSS viewports: 1440x900 and 390x844.
- Regression CSS viewports: 1280x800 and 768x1024.
- The Spain headline remains legible without clipping; the decorative orbit
  never competes with copy; every real flag is visible or reachable within the
  dedicated strip; supporting headings align with the shared section frame;
  card heights and CTA boxes remain consistent within each grid row.
- Required evidence: targeted tests, full suite, asset check, production build,
  `git diff --check`, DOM count/source checks for 21 flag images, zero page
  overflow/broken images/console errors, and screenshots at all four viewports.

---

# AIT USA Placement Diagnostic V2 — MIS-339

## Problem

- User/job: a prospective English student wants to discover the right AIT
  starting level without surrendering contact information first.
- Current friction: the route asks for contact data before value and exposes all
  62 questions in one long form, with no question-level progress, time estimate,
  skip review, or app-like momentum.
- Desired outcome: an anonymous, focused, one-question diagnostic that feels
  alive, preserves academic trust, and creates a natural post-result path toward
  account claim, practice, and advisor contact.

## Selected Direction

- Interaction model: stable single-page application shell with intro, one
  graded question at a time, skipped review, short reflection, goal/writing,
  anonymous result, and later account claim.
- Visual direction: restrained academic playfulness—navy/gold progress,
  tactile answer cards, directional transitions, and quiet block checkpoints.
- Why this direction: it reduces cognitive load and abandonment while making
  progress legible without turning the assessment into a game or revealing
  correctness.
- Rejected alternatives: the current all-question wall; contact-first wizard;
  mid-test correctness feedback; constant confetti; and early “qualified level”
  claims that can become false after Back or academic review.

## Locked Contract

- Behavior/state: 62 graded questions; one active question; Back, Skip, answer
  changes, review queue; no correctness feedback; self-assessment excluded from
  academic scoring; initial result before contact; 30-day retake policy for the
  final service.
- Permissions/data boundaries: initial staging slice is anonymous and
  session-only; no CRM/storage/provider write; raw answers, writing, audio, and
  transcripts stay out of generic events/CRM.
- Routes/actions: `/placement-test/` and `/api/placement-test`; API remains an
  explicitly provisional, no-storage/no-CRM boundary until MIS-337.
- Copy: use “AIT placement estimate,” advisor confirmation, “Explorando
  preguntas de Nivel …,” and no CEFR/certification claim.
- Guardian rule: users under 13 may take the anonymous diagnostic, but saving,
  account creation, and Study Buddy require a verified guardian.
- Study Buddy trial: one 3–5 minute, five-learner-turn guided voice conversation
  per verified email; text fallback; no raw audio/transcript retention.
- Explicit non-goals: final block thresholds, durable resume, auth/account
  claim, CRM writes, external provider calls, production promotion.

## Responsive Contract

- Primary browser CSS viewports: 390×844 and 1440×900.
- Regression CSS viewports: 360×800, 430×932, and 1920×1080.
- DPR/zoom assumptions: CSS pixels at default zoom; DPR is not an acceptance
  dimension.
- Layout constraints: the active question, its answers, progress, and primary
  navigation should fit without nested scrolling at the primary viewports when
  answer copy is typical; long prompts may extend the document naturally.
- Balance invariants: stable shell, no layout jump between questions, no page
  horizontal overflow, and all action targets at least 44px.
- Content growth: four answer choices is normal; the shell must tolerate modest
  prompt/choice growth and 1–2 digit minute estimates.

## Evidence

- Render path/state: intro → forward answer → Back → Skip → review → reflection
  → goal/writing → anonymous result.
- Local browser proof: primary and regression viewports, keyboard navigation,
  reduced motion, refresh/session resume, and no hidden inactive-question
  accessibility leakage.
- Live staging proof: canonical staging route and the exact accepted commit.
- DOM measurements: one visible active question, no horizontal overflow,
  progress values update, Back/Skip controls remain 44px or larger.
- Screenshot budget: intro, representative question, skipped review, and result
  at primary desktop/mobile only.
- Console/runtime checks: no console errors, runtime exceptions, failed route
  requests, or unexpected CRM/provider calls.

## Closeout Questions

1. Does the shipped workflow still use the selected one-question model?
2. Did the contact-first or all-question wall return in another container?
3. Are anonymous value, guardian, scoring, and provider boundaries preserved?
4. Were 390×844 and 1440×900 exercised as real CSS viewports?
5. Are academic-key and durable-service deviations explicitly named?

---

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

---

# AIT USA Portal V1 + Study Buddy Launch Contract — MIS-341/MIS-340/MIS-342

## Product promise

The Portal answers one question first: “What should I do next?” A newly claimed
student sees the saved placement estimate, the recommended next action, and one
useful practice activity without navigating a student-management system.

Study Buddy is a guided 3–5 minute English practice session, not a general AI
chatbot. It should feel responsive, encouraging, and game-like while preserving
adult dignity, academic uncertainty, privacy, and hard cost limits.

## Research-backed learning loop

The launch session follows one authored state machine:

1. Choose one practical scenario and understand its communicative goal.
2. Hear and read one short model plus up to two useful phrases.
3. Complete two guided learner turns with optional hints.
4. Complete up to three progressively freer turns.
5. Receive at most one high-value correction after each turn.
6. Retry once immediately or continue without penalty.
7. Finish with one demonstrated success, one improvement focus, and one next
   practice recommendation.

This preserves the strongest shared patterns found in Duolingo, Babbel, Busuu,
Memrise, and ELSA: short practical goals, learning by doing, level-matched
scaffolding, focused feedback, immediate retrieval/retry, and mastery-oriented
completion. It deliberately excludes punitive hearts, public rankings, streak
loss, fake urgency, opaque pronunciation scores, and open-ended prompt boxes.

## Portal information architecture

- Desktop: left navigation rail.
- Mobile: fixed five-item bottom navigation respecting safe-area insets.
- Navigation order: `Inicio`, `Mis cursos`, `Asistencia`, `Estudiar`, `Cuenta`.
- `Inicio` order:
  1. urgent verification/support blocker, if any;
  2. saved placement estimate and advisor-confirmation language;
  3. recommended course or enrollment action;
  4. one eligible Study Buddy practice;
  5. recent practice summary/history;
  6. persistent advisor/support path.
- Launch data may be empty or pending; the UI must explain that state and offer
  a next action rather than fabricating enrollment, attendance, payment,
  teacher, or schedule data.

## Authentication and authorization

- `/portal` is protected by the sealed WorkOS session cookie.
- The server resolves the WorkOS identity to one active `portal_accounts`
  record and builds a safe browser model.
- The browser never supplies authoritative account IDs, WorkOS subjects, CRM
  contact references, roles, guardian scope, provider/model selection, limits,
  timestamps, or costs.
- Unauthenticated and expired sessions receive a clear passwordless sign-in
  path. Authorization mismatch fails closed with advisor support.
- Under-13 accounts remain closed until verified guardian linkage and consent
  exist.
- Fixture identities, query-string identity switching, prototype labels, and
  browser-owned actor references are prohibited on the launch path.

## Study Buddy provider and privacy boundary

- Voice model: bounded push-to-talk turns, not an always-open microphone.
- Server pipeline:
  1. transient audio upload with strict type/size/duration limits;
  2. ephemeral transcription;
  3. structured teaching response from a server-owned prompt;
  4. short generated model speech;
  5. atomic summary/usage update.
- Initial models route through Vercel AI Gateway:
  - transcription: `openai/gpt-4o-mini-transcribe`;
  - teaching response: `openai/gpt-5.4-mini`;
  - speech: `openai/tts-1`.
- Models and prompts are replaceable server configuration, never browser input.
- Text fallback follows the same teaching state machine.
- Raw audio, learner transcript, generated transcript, prompts, and
  conversations are never persisted, logged, analyzed, or sent to CRM.
- Persist only authorized summary state: scenario, use case, turn count,
  completion, one safe success/focus code, limit/escalation state, provider
  usage/cost counters, policy/model version, and timestamps.
- No provider call occurs before verified account, age/guardian, consent,
  eligibility, and atomic budget reservation succeed.

## Cost, abuse, and reliability limits

- Acquisition entitlement: one completed trial per verified email/account.
- Session: five learner turns, one retry per turn, 3–5 minute target.
- Audio: explicit start/stop, short per-turn duration ceiling, bounded request
  size, and no background capture.
- Server enforces per-account/session/day reservations, idempotency, timeouts,
  and an absolute session cost ceiling.
- A provider timeout or outage preserves account/result/history integrity and
  offers a text/canned recovery path; the UI never leaves a permanent spinner.
- Prompt injection cannot change scenario, level, policy, provider, cost, or
  persistence boundaries.
- Safety concern or repeated confusion ends cleanly with an advisor/teacher
  escalation option.

## Interaction and visual direction

- AIT identity remains authoritative: deep navy, warm gold, white surfaces,
  existing display typography, generous space, and restrained borders.
- The playful layer comes from progression and feedback, not mascots or
  borrowed Duolingo assets:
  - scenario “mission” card and goal badge;
  - stable five-step progress path;
  - responsive recording pulse and waveform;
  - tactile answer/retry controls;
  - focused feedback reveal;
  - small checkpoint acknowledgements;
  - satisfying completion bloom and mastery recap.
- Motion: directional 240–280ms transitions, no layout jumps, instant
  reduced-motion alternative.
- Sound: opt-in only. No autoplay, background music, failure sounds, or reward
  sound required to understand state.
- Feedback copy preserves confidence:
  - first acknowledge meaning or effort;
  - identify one improvement only;
  - provide a short model;
  - invite one retry;
  - never mark intelligible speech as a failed turn.

## Required states

Portal:

- loading, empty, pending-link, blocked, error, offline/degraded,
  unauthorized, expired session, authenticated without a claimed result, and
  authenticated with a saved provisional result.

Study Buddy:

- ready, microphone request, recording, processing, feedback, retry,
  continuing, completed, text fallback, microphone denied/unsupported, network
  interruption, provider unavailable, trial consumed, daily/session limit,
  guardian required, no eligible practice, and escalation.

Every blocked/unavailable state must say what happened and what the learner can
do next. “Unavailable” must never look like “broken.”

## Responsive and accessibility contract

- Primary CSS viewports: 390×844 and 1440×900.
- Regressions: 360×800, 430×932, and 1366×768.
- Mobile stays one column with the primary action visible early; bottom
  navigation never overlaps content.
- Desktop keeps the active practice in a readable centered column; secondary
  context may occupy a small rail but never competes with the turn.
- No page-level horizontal overflow or nested conversation scrolling.
- Interactive targets are at least 44×44px.
- Real links/buttons, visible focus, `aria-current`, and live announcements for
  recording, processing, feedback, errors, and completion.
- Recording has explicit keyboard-operable start and stop controls plus an
  equally complete text alternative.
- Motion, color, and sound are never the sole carriers of meaning.
- Only the active prompt/feedback state remains in the accessibility tree.

## CRM boundary

- The browser never writes generic CRM envelopes.
- The site server enqueues fixed, authenticated, summary-only events with
  deterministic idempotency:
  - result claimed;
  - portal account activated;
  - advisor handoff requested;
  - AI practice started;
  - AI practice completed;
  - AI practice escalation or limit reached, if approved.
- CRM payloads may contain only server-resolved contact/account linkage,
  placement summary/version, approved goal/course/scenario identifiers,
  completion status, safe aggregate practice summary, explicit channel consent,
  source attribution, and correlation/idempotency IDs.
- Raw answers, writing, audio, transcripts, prompts, generated responses,
  provider IDs/secrets, and detailed usage are forbidden.
- CRM failure never blocks the result, account, or practice completion.

## Explicit non-goals

- No full LMS/student administration, billing, attendance truth, certificates,
  teacher console, open-ended AI chat, persistent conversation memory, social
  leaderboard, streak system, lives/hearts, marketplace, or production
  promotion.
- No final academic level claim until the AIT answer key and block thresholds
  are approved.
- No CEFR equivalence or AI-generated diagnostic certainty.

## Required acceptance evidence

- Contract and state-machine tests with fake providers; no external AI call in
  CI.
- Auth, authorization, guardian, limit, idempotency, prompt-injection,
  provider-failure, CRM-failure, and privacy tests.
- Migration tested on a disposable Neon branch before staging application.
- Local production build, full targeted suites, asset integrity, dependency
  audit, and `git diff --check`.
- Live protected-staging proof for the exact accepted commit:
  authenticated claim → Portal → voice and text practice → completion/history →
  optional advisor handoff.
- Browser proof at all named viewports, keyboard/reduced-motion/mic-denied
  paths, no console/runtime errors, no overflow, and no secret/sensitive payload
  exposure.
- Neon proof of summary-only persistence and usage accounting.
- CRM staging proof with synthetic data, safe database fingerprint, correct
  task/notification, idempotent retry, and no raw answers/transcripts.
- Independent Sentry QA and Titan security review before MIS-344 can pass.
- Production promotion remains a separate explicit approval.

---

# AIT USA Global Student Portal Entry — MIS-349

## User workflow and problem

- A returning student or placement-test account holder must be able to reach
  Portal sign-in from every public page without hunting through the footer or
  repeating the placement flow.
- The entry is a returning-student utility, not a new acquisition CTA; it must
  not compete with the approved phone and placement actions.

## Chosen interaction model and visual direction

- Add one persistent, compact `Portal` utility link to the shared public
  header, using a restrained account icon and the existing navy/gold system.
- Keep it visible at desktop and mobile widths. On mobile it sits with the
  menu/phone utilities instead of becoming a large navigation row.
- The destination is the existing passwordless `/portal/sign-in/` route.

## Locked behavior, permissions, and non-goals

- Preserve the approved homepage structure, section navigation, call CTA,
  menu behavior, header height, sticky behavior, and all auth/guardian rules.
- The link is available on every route using `SiteHeader`; it never implies
  that anonymous test takers already have an account.
- Non-goals: no auth rewrite, account creation changes, Portal redesign,
  Study Buddy activation, modal sign-in, homepage re-polish, or production
  promotion.

## Responsive contract

- Primary viewports: 1440×900 and 390×844 CSS pixels.
- Regressions: 1040×900, 760×844, 360×800, and 1920×1080.
- Header utilities must not wrap, overlap, or cause horizontal overflow.
- All utility targets remain at least 44×44 CSS pixels with visible keyboard
  focus and an explicit accessible name.
- At desktop the utility may show icon + `Portal`; at narrow widths the compact
  treatment may reduce typography but must remain legible and discoverable.

## Required evidence

- Targeted shared-header contract test plus the full suite/build/assets/audit.
- Live staging proof on homepage, course catalog, placement, and a course detail
  route at desktop/mobile widths.
- Verify the link destination, keyboard focus, menu coexistence, no horizontal
  overflow, and no console errors.

---

# AIT USA Student-Surface Brand Consistency Rework — MIS-350

## Problem and chosen interaction model

- A student moving from placement result to account claim sees roughly five
  peer actions, so the correct next step is visually ambiguous.
- Portal sign-in accepts an email before clearly explaining that it is for
  existing saved-result accounts, while its generic success response can make a
  new learner think an email was sent.
- Portal and Study Buddy still read as a cold SaaS blue/white product beside
  the approved homepage's trustworthy navy/gold editorial identity.
- Keep the result-first diagnostic and in-place passwordless claim. Make
  `Guardar mi resultado` the only dominant action; keep defer, advisor, courses,
  and restart as reachable text-level pathways rather than stacked peer CTAs.
- Keep sign-in email-first and generic after submission. Explain the existing
  account boundary before submission and give new learners a clear placement
  path without revealing whether any email/account exists.
- Preserve the Portal dashboard IA and authored five-turn Study Buddy flow.

## Selected visual direction

- The client-approved homepage remains the source of truth.
- Navy owns structure, gold owns emphasis and state, and warm cream/white
  surfaces own reading areas.
- Product surfaces may remain denser than marketing pages, but bright electric
  SaaS blue and cold blue-white canvas treatments are no longer the dominant
  identity.

## Locked behavior and non-goals

- No changes to placement scoring, answer handling, persistence, guardian
  onboarding, WorkOS calls, account eligibility, CRM delivery, Study Buddy
  provider/runtime behavior, trial limits, or privacy rules.
- Unknown-account requests remain indistinguishable from known-account code
  requests.
- Preserve loading, disabled, error, recovery, guardian, provider-disabled, and
  authenticated states.
- No homepage change, auth rewrite, provider activation, schema/migration
  change, CRM payload change, new analytics, or production promotion.

## Responsive and hierarchy invariants

- Primary CSS viewports: 390×844 and 1366×768.
- Regression CSS viewports: 360×800, 430×932, 768×1024, and 1440×900.
- One dominant result action; secondary pathways remain reachable without a
  vertical wall of peer buttons.
- Button-like controls remain at least 44 CSS pixels.
- No horizontal overflow, clipped copy, hidden default-state CTA, or hover-only
  affordance.
- Portal navigation, dashboard order, and Study Buddy turn progression remain
  unchanged.

## Required evidence

- Targeted placement, claim, Portal auth/shell, and Study Buddy tests.
- Full suite, asset check, dependency audit, and webpack production build.
- Rendered result, sign-in, Portal, and Study Buddy checks at primary and
  regression viewports, including focus/reduced motion, overflow, and console.
- Exact staging commit/deployment evidence plus MIS-344 integrated staging
  regression before Human Review.

---

# AIT USA Human-Review Cleanup — 2026-08-02

## Problem and chosen interaction model

- Human review found the persistent desktop `Portal` label visually heavier
  than needed beside the existing account icon, and found the placement-page
  privacy disclosure occupying too much of the first desktop viewport.
- Use the account icon alone on every public-page header while preserving its
  44×44 target, explicit accessible name, native tooltip, focus ring, and
  passwordless sign-in destination.
- Remove the placement hero disclosure block so the diagnostic itself returns
  to the first viewport. Preserve the concise placement promise and all actual
  privacy, guardian, retention, CRM, and account behavior.

## Locked behavior and non-goals

- No changes to navigation, authentication, placement scoring, data handling,
  guardian policy, WorkOS, CRM, Portal, or Study Buddy behavior.
- No cross-surface color redesign in this patch; that direction will be chosen
  with Alvaro separately.
- No general Portal or Study Buddy UI redesign and no production promotion.

## Responsive invariants and evidence

- Primary CSS viewports: 390×844 and 1366×768; regression: 360×800, 760×844,
  1040×900, and 1440×900.
- Header utilities must not wrap or overflow, and the icon-only Portal target
  remains visible and keyboard accessible at every breakpoint.
- Placement content must start materially higher with no empty disclosure gap.
- Required evidence: targeted contract tests, full suite/build/assets/audit,
  responsive rendered checks, exact staging commit/deployment, and Linear note.

---

# AIT USA Student Journey Institutional Palette — 2026-08-03

## User goal and chosen direction

- Make placement, result claim/account creation, Portal sign-in/dashboard, and
  Study Buddy feel like one trusted educational institution instead of adjacent
  SaaS products.
- Use the client-selected navy/gold reference as the product frame and the
  lighter reference only for dense reading, form, result, and exercise areas.
- Keep the existing journey and information architecture intact; this is a
  visual-system implementation, not a workflow redesign.

## Locked visual system

- Structural navy: `#001a3d` for page canvas, navigation, mission framing, and
  authenticated product shells.
- Action gold: `#c4932d` for primary actions, progress, active states, and
  important icons; gold is not body-copy color.
- Warm surfaces: `#f7f2e8`, `#fffdf9`, and white for forms, results, lessons,
  tables, and longer reading.
- Text: `#0f172a` primary ink and `#475569` muted copy on light surfaces.
- Avoid electric blue, cold-gray product canvases, decorative blue gradients,
  blanket dark-mode reading areas, and low-contrast gold text.

## Locked behavior and non-goals

- Preserve placement scoring, answer state, result claim, guardian rules,
  WorkOS enumeration protection, session behavior, Portal IA, Study Buddy turn
  order, privacy boundaries, provider state, and CRM delivery.
- Preserve loading, focus, disabled, error, success, recovery, guardian, and
  provider-disabled states.
- No homepage redesign, copy rewrite, auth rewrite, data/schema migration,
  provider activation, CRM payload change, or production promotion.

## Responsive and accessibility contract

- Primary CSS viewports: 390×844 and 1366×768.
- Regression CSS viewports: 360×800, 430×932, 768×1024, and 1440×900.
- Navy remains the structural frame while warm content surfaces preserve
  reading comfort; mobile Portal navigation remains navy with gold active state.
- No horizontal overflow, clipped copy, hover-only action, or target smaller
  than 44 CSS pixels.
- Visible keyboard focus, reduced-motion behavior, semantic errors/success, and
  contrast-safe text must survive the palette change.

## Required evidence

- Targeted placement, claim/auth, Portal shell, and Study Buddy tests.
- Full suite, asset check, dependency audit, webpack production build, and
  `git diff --check`.
- Rendered placement, sign-in, authenticated Portal, and Study Buddy evidence at
  primary viewports plus responsive regression, overflow, and console checks.
- Reference and implementation screenshots must be judged together; because
  the supplied images are mood references rather than matching layouts, the QA
  comparison evaluates palette hierarchy and surface balance, not pixel cloning.
- Exact staging commit/deployment and Linear evidence. Production stays out of
  scope until explicit approval.

---

# Graphic Concept Method reference implementation — 2026-08-09

The scoped workflow, visual direction, locked content, responsive invariants,
and closeout evidence are recorded in
`references/design-acceptance-contract-method-concept.md`.

---

# Homepage Method rhythm and book collection — 2026-08-10

## User workflow and problem

- The approved Graphic Concept story is clear, but its opening copy measure and
  uneven question lengths can be easier to scan without changing the narrative.
- The book collection currently renders two competing heading accents and all
  seven covers in one horizontal row, making the curriculum read as an image
  wall rather than a deliberate sequence.

## Chosen interaction model and visual direction

- Reference mode: inspiration. Alvaro's staged review and the established
  homepage section system are authoritative; no generated or external visual is
  a fidelity target.
- Preserve the Method's three-chapter editorial sequence. Improve only reading
  measure, question-column balance, and small spacing details that increase
  comprehension.
- Present the books as one featured Intro cover spanning both desktop rows,
  followed by Steps 1–3 on the first row and Steps 4–6 on the second. Keep the
  covers unboxed on navy so the curriculum art, not another card system, carries
  the section.
- Keep the existing gradient heading rule and remove the redundant solid rule.

## Locked behavior, content, and non-goals

- Preserve all approved Method copy, its lightened `Lo que escuchamos` eyebrow,
  three questions, three outcome icons, native video, caption, and semantic
  order.
- Preserve the `Ruta Graphic Concept` / `Nuestros libros.` heading and all seven
  source covers in Intro, Step 1 through Step 6 DOM order.
- No new ornaments, labels, cards, carousel, horizontal scroller, copy rewrite,
  asset generation, route change, interaction, production promotion, or data
  write.

## Responsive and rhythm invariants

- Primary CSS viewports: 1440×900 and 390×844. Regression viewports: 1280×720
  and 768×1024. Default zoom; DPR is not an acceptance dimension.
- Desktop books: featured Intro plus a legible 3×2 sequence with materially
  larger covers than the current seven-column row.
- Tablet books: four-column reading order that naturally produces Intro + Steps
  1–3, then Steps 4–6. Mobile books: featured Intro above a two-column sequence.
- Method titles remain in the homepage display family; body copy keeps a
  readable measure; the three questions feel balanced without clipping or
  truncation.
- One heading accent only, no page-level horizontal overflow, no image
  distortion, and no regression to adjacent homepage sections.

## Required closeout evidence

- Focused homepage Method/books tests, full test suite, asset audit, webpack
  production build, and `git diff --check`.
- DOM measurements and one calibrated screenshot for each required viewport,
  including grid order, rendered cover sizes, heading pseudo-element/border,
  Method text measure, overflow, image loading, and console/runtime state.
- Exact staging commit and Git-triggered deployment verification. Production
  remains untouched and MIS-378 stays in Human Review unless Alvaro accepts it.

---

# AIT USA launch-week homepage polish — 2026-08-17

## Owner direction and source-to-render mapping

- Reference mode: faithful owner-selected refinement of the live staging
  homepage. The current approved page remains the visual source of truth.
- Spain ribbon: preserve the navy-to-gold gradient, sweep, pulse, and orbit;
  replace the vague headline with an explicit “next stop” announcement and use
  the ribbon's horizontal space for one supporting sentence.
- Method conclusion: preserve the three approved illustrations and content;
  remove the nested icon frames, increase illustration scale, reduce the
  headline-to-list gap, and center every illustration against its text block.
- Testimonials: add one restrained proof strip after the three videos with a
  concise international-community statement and a single-row rail of flags for
  the Spanish-speaking countries represented by the school's reach.
- Supporting courses: keep all six routes and labels, but return their tiles to
  the same border, radius, surface, shadow, spacing, and text-link language used
  by the primary course tiles immediately above them.

## Locked behavior and non-goals

- Preserve homepage section order, hero image and core headline, testimonial
  media/dialog behavior, Method copy/video, course destinations, navigation,
  placement, authentication, Portal, CRM, and analytics behavior.
- No new carousel, marquee, autoplay, remote flag dependency, image generation,
  route change, or broad homepage redesign.
- The flag rail is semantic proof, not a geographic promise of physical
  campuses. It must remain visually secondary to the testimonials.

## Responsive and accessibility contract

- Primary CSS viewports: 1440×1000 and 390×844. Regression viewports: 768×1024
  and 1280×720.
- Desktop ribbon reads as one balanced horizontal announcement; mobile keeps
  the “España es nuestra próxima parada” claim and orbit without clipped copy.
- Method list gap is materially below the 47px staging baseline; icons are at
  least 48px and vertically centered without a visible frame.
- Country flags remain one compact rail; mobile may scroll the rail horizontally
  without creating page-level overflow. Country names remain available to
  assistive technology and native hover inspection.
- Course tiles maintain equal row heights, clear 44px interaction targets,
  visible focus, and no hover-only information.

## Required closeout evidence

- Focused homepage integration/Method tests, full suite, asset audit, production
  build, and `git diff --check`.
- Calibrated desktop and mobile screenshots of all four changed regions plus DOM
  measurements for Method gap/alignment, overflow, image loading, reduced
  motion, and console/runtime state.
- Independent visual review of the candidate, exact staging deployment/live QA,
  then an authorized fast-forward of the complete staging history to `main`
  followed by production smoke QA. No manual platform deployment.
# AIT USA Employee + Student Portal V1 — 2026-08-20

## User workflow and problem

- An authorized AIT employee needs a real operations dashboard: see workload,
  open one placement submission, inspect the academic evidence, make one
  deliberate decision, and understand the audit/CRM state without leaving the
  employee portal.
- A student needs a real learning dashboard: see the current academic status
  and navigate to courses, attendance, study, and account areas without one
  very long anchor-scrolling page.
- Current failures: the employee review is a thin, visually disconnected page;
  its POST actions can strand the reviewer on raw JSON; the student Portal
  places every concern on one document.

## Selected interaction model and visual direction

- Faithful-reference mode using the captured production student Portal at
  `docs/qa/portal-redesign/source-student-1440x900.png` as the visual source of
  truth for shared chrome and tokens.
- Keep the existing AIT navy/gold/warm-white design language, real AIT logo,
  Plus Jakarta Sans typography, card radii, border treatment, and calm academic
  tone. Do not introduce a second design system.
- Employee: a dedicated `/employee` shell with overview and review-workspace
  routes. The review workspace uses an independently scrolling queue and
  evidence/detail pane so the primary desktop viewport is operational rather
  than a stacked document.
- Student: a dedicated `/portal` shell with routed dashboard, results, courses,
  attendance, study, and account areas. The root is an overview; each major
  concern has its own route.

## Locked behavior, security, and content

- Preserve passwordless Portal auth, opaque exact-review deep links, AIT USA
  business-unit scoping, and senior/admin reviewer authorization. Missing,
  cross-business-unit, and unauthorized reviews remain fail-closed.
- The employee evidence view may render only the authorized submission's test
  questions, selected answers, correctness, score summary, self-assessment,
  writing sample, recommendation, and audit events. No evidence is copied into
  CRM, URLs, logs, generic analytics, or client-side storage.
- Employee mutations retain exact-origin checks, opaque mutation IDs,
  optimistic revision checks, idempotency, immutable audit rows, and atomic CRM
  outbox writes. Failures render a bounded in-portal message; raw API JSON is
  never the reviewer's terminal experience.
- Internal rationale is required for final adjustment and additional-review
  decisions, bounded to 1,000 characters, stored only in the AIT USA review
  audit, and excluded from the CRM envelope.
- Only `denegriconsulting@gmail.com` is currently provisioned. The portal must
  not infer or provision coordinator accounts. Role management is admin-only;
  a read-only team surface may expose active roles without contact data beyond
  the authorized employee directory.
- Confirmed/adjusted level remains visible in the student Portal; pending and
  additional-review states use the locked Spanish placement copy.

## Responsive and accessibility contract

- Primary CSS viewports: 1440x900 and 390x844. Regression viewports: 1024x768
  and 430x932.
- Desktop shells occupy the viewport beneath the top bar. Core overview cards
  and the active review decision fit without page-length stacking; queue/detail
  regions may scroll independently without nested horizontal scrolling.
- Mobile collapses the sidebar into reachable navigation, turns the review
  workspace into a clear queue-to-detail flow, preserves natural document
  scrolling, and keeps every interactive target at least 44px.
- Preserve one H1 per route, ordered headings, visible focus, keyboard access,
  meaningful empty/loading/error states, reduced-motion behavior, no clipped
  content, and no page-level horizontal overflow.

## Non-goals

- No standalone employee application, new identity provider, CRM academic-data
  mirror, provider/Telnyx send, course-management backend, attendance backend,
  billing, or invented coordinator access.
- Courses and attendance may truthfully communicate not-yet-connected states;
  they must not display fabricated enrollment or attendance data.

## Required closeout evidence

- Focused auth, RBAC, route, review-transition, evidence-shaping, audit,
  idempotency, and student-view-model tests; full `npm run validate`; production
  build; `git diff --check`.
- Browser interaction proof for employee navigation, queue/detail selection,
  error handling, and student routed navigation at primary desktop/mobile plus
  regression overflow checks.
- Side-by-side visual comparison against the captured student Portal source at
  the same viewport and state; final `design-qa.md` must pass.
- Staging and production deployment readiness, live route/runtime smoke, and
  no production academic decision performed by automation.

---
## 2026-08-20 — Placement contact choice correction

- **User workflow/problem:** After claiming a saved placement result, the contact panel looked like a choice but preselected email and disabled every alternative. The student could not explicitly decline additional contact.
- **Interaction model:** One focused, optional decision with no default: `Email` or `No additional contact for now`. The email consent checkbox appears only after email is selected. Unsupported mobile channels are explained in one compact note instead of rendered as disabled choices.
- **Visual direction:** Preserve the current placement-result card, typography, spacing, and navy/gold/warm-white system. This is a state/clarity correction, not a redesign.
- **Locked behavior:** No SMS, WhatsApp, or phone preference without verified mobile ownership. No provider send. A declined optional preference performs no database or CRM write. Email requires a separate explicit checkbox before save.
- **Non-goals:** Adding phone capture, mobile OTP, Telnyx, WhatsApp automation, marketing consent, or a general Portal preference center.
- **Viewports:** Primary 1440x900; regression 390x844.
- **Evidence:** Component contract tests, placement-contact validation tests, production build, and rendered staging checks at both viewports.

---
## 2026-08-20 — Placement result gate and Study Buddy conversion

- **Problem:** the completed assessment currently reveals the result before identity capture, then repeats advisor-consent questions after account creation. The handoff weakens the value exchange and can store an email-specific advisor decision even when the student prefers another channel.
- **Primary journey:** `Assessment complete → verified contact → result unlocked → Study Buddy → advisor follow-up`.
- **Completion moment:** after the last assessment step, show `¡Terminaste tu evaluación!`, explain the immediate value (saved result, personalized practice, AIT guidance), and show the compact progress path `Evaluación ✓ → Datos → Resultado`.
- **Required adult fields:** first name, account email, and one preferred advisor channel: email, SMS, WhatsApp, or phone call. Email remains the only Portal authentication and recovery identity in this release.
- **Conditional contact field:** choosing SMS, WhatsApp, or phone reveals a mobile input. The number is stored as unverified contact information and is never treated as authentication evidence.
- **Consent model:** the selected channel has one explicit, channel-specific disclosure. Marketing remains separate and off. Automated WhatsApp, SMS, and Telnyx sends remain disabled. There is no visible `No contact` choice in the conversion flow.
- **Result boundary:** the recommendation, score breakdown, advisor link, and course links remain hidden until the OTP claim and contact-preference write succeed. The diagnostic result itself remains durably saved before downstream Portal or CRM work so a later failure cannot invalidate the completed assessment.
- **Unlocked state:** reveal `¡Nivel desbloqueado!`, the full existing academic recommendation, and a primary `Comenzar mi práctica personalizada` CTA to Study Buddy. Portal access and advisor/course actions remain secondary.
- **Progression:** present the next steps as real milestones: discover level, complete the first five-minute practice, receive the confirmed level, and choose a course/schedule. Do not add points, streaks, artificial scarcity, or false urgency.
- **Under-13 behavior:** preserve guardian verification, minimum child data, and separate guardian permissions. The child result is revealed only after the guardian-owned claim is complete.
- **Visual direction:** retain the existing AIT navy, gold, warm-white, typography, and placement-test surface language. Use one focused card per stage, a compact progress strip, strong unlocked-state hierarchy, and no page-within-page dashboard chrome.
- **Responsive acceptance:** primary viewports 390×844 and 1440×900; regression viewports 430×932 and 1024×768. No horizontal overflow, clipped controls, hidden validation, or result leakage before claim.
- **Non-goals:** phone authentication, phone OTP, password accounts, marketing enrollment, provider sends, or a new standalone portal.
- **Evidence:** targeted placement/contact/claim tests, full build, staging browser verification of the pre-result gate and responsive states, then production read-only smoke on the exact validated commit.

---
## 2026-08-20 — Placement post-test polish and offer continuity

- **Problem:** the approved result gate is functionally correct, but the mobile contact stage reads as one long dark form. Contact controls crowd their labels, the same value promise is repeated above and inside the form, and the primary action falls below the first viewport.
- **Selected interaction model:** preserve the approved sequence `assessment → contact → OTP → result → Study Buddy`, with one dominant task in each stage. The contact stage starts immediately with a compact completion/progress header and the claim form; it does not add another interstitial click.
- **Reference mode:** current-state correction based on the supplied production mobile screenshot. Preserve the existing navy/gold/warm-white accents, success mark, progress motif, typography, card radii, and institutional tone. This is polish, not a visual reset.
- **Contact layout:** name and email remain first, followed by a required channel choice. Channel cards use a stable radio column plus an independent text column, consistent vertical alignment, and a compact two-by-two mobile layout where it remains readable. SMS, WhatsApp, and phone continue to reveal the mobile field.
- **Copy continuity:** the entry screen promises a saved recommendation plus a personalized five-minute Study Buddy practice; the context and goal screens explain how answers improve the next-step recommendation; the final assessment CTA prepares the student to see the result; the contact, OTP, result, and Study Buddy screens use the same concise value language without duplicating paragraphs.
- **Viewport behavior:** on 390×844 and 430×932, the contact and OTP stages should place the primary action within one natural viewport whenever validation content is absent. On 1024×768 and 1440×900, the gate remains centered and compact rather than expanding into a long document. Natural page scrolling remains available for accessibility, zoom, guardian consent, errors, and small-height devices.
- **Locked behavior:** preserve result durability, email-only Portal identity, required advisor channel, conditional unverified mobile capture, explicit channel permission, guardian boundaries, CRM event ordering, marketing-off defaults, and provider-send suppression.
- **Non-goals:** no phone authentication, no consent bypass, no result leakage before claim, no new offer, no points/streaks/false urgency, and no restructuring of assessment scoring or academic review.
- **Evidence:** focused placement and result-claim contracts, full validation/build, responsive staging browser evidence at all four viewports, production deployment readiness, read-only production smoke, and Linear MIS-399 closeout.

---
## 2026-08-23 — Launch global navigation — MIS-393

- **User workflow/problem:** Public visitors need a predictable route-first header that moves between the school overview, course catalog, and placement test without returning secondary pages to unrelated homepage anchors.
- **Selected interaction model:** One shared three-destination global navigation: `Inicio`, `Cursos`, and `Examen de nivel`. The Portal remains a separate account utility and `Llámanos` remains the conversion utility.
- **Why this is clearer:** The header mirrors the launch funnel, removes six competing section links, and avoids inventing Method or Locations pages solely to satisfy an obsolete navigation draft.
- **Visual direction:** Current AIT white/navy/gold header, logo, typography, iconography, height, and call action. This is an information-architecture correction, not a header redesign.
- **Locked behavior:** All three navigation entries use real routes; `Cursos` goes directly to `/cursos/`; the Portal icon goes to `/portal/sign-in/`; mobile exposes the same hierarchy; route-semantic active state uses `aria-current="page"`.
- **Interaction requirements:** Escape and outside click close the mobile menu; focus returns to the trigger when Escape closes it; following a route closes it; focus remains visible; no background scroll or header collision is introduced.
- **Non-goals:** No course dropdown, new Method/Locations route, page-content redesign, placement/auth/guardian/CRM/Study Buddy change, or production promotion.
- **Primary CSS viewports:** 1366x768 desktop and 390x844 mobile. Regression viewports: 360x800, 768x1024, and 1024x768.
- **Content growth:** The launch header is locked to three destinations. Additional destinations require a new IA decision rather than silently compressing the header.
- **Evidence:** focused component/route tests, full validation/build, keyboard checks, deterministic browser evidence at all five widths, staging deployment, and live staging QA.

---
## 2026-08-23 — Provider-owned password access — MIS-403

- **User workflow/problem:** Returning students and employees need a familiar email-and-password option without losing the existing one-time-code fallback, audience separation, or provider-owned credential boundary. A newly verified placement claimant should be able to establish easier return access without delaying the result.
- **Selected interaction model:** The student and employee sign-in cards begin with email/password and offer `Usar un código por email` as a parallel method. `Olvidé mi contraseña` starts the provider-owned reset lifecycle. After result unlock, one optional setup card can send the verified claimant into the same secure password-setup lifecycle.
- **Why this is clearer:** Email remains the single account identifier, both sign-in methods resolve the same WorkOS identity, and password setup is presented at a high-intent moment without adding another required placement step.
- **Visual direction:** Inspiration mode constrained by the shipped AIT Portal access card and placement unlocked-result surface. Preserve navy/gold/warm-white, Plus Jakarta Sans, restrained radii, one dominant action, and current trust framing.
- **Locked security:** WorkOS owns password values, verification, reset tokens, and lifecycle. Portal DB and AIT CRM store no password or reset material. Same-origin protection, generic account responses, attempt budgets, sealed sessions, revocation, active-account checks, employee role/business-unit authorization, student/employee separation, and guardian ownership remain fail-closed.
- **Post-placement behavior:** The card appears only after successful OTP claim and result unlock. `Crear contraseña` requests a provider-owned setup/reset email; `Ahora no` dismisses the card locally for the current rendered flow. Neither action gates the result, Study Buddy, Portal, CRM delivery, or consent writes.
- **Provider constraint:** Existing Magic Auth users must attach/use a password on the same WorkOS user ID. A staging provider proof of no duplicate identity is required. If provider behavior cannot prove that contract, password setup is blocked rather than implemented with a local credential store.
- **Error/state contract:** Wrong password, ineligible account, and unknown account share generic copy. Rate limit and provider-unavailable states are bounded. Reset requests always return an enumeration-safe accepted response. Password reset may revoke existing provider sessions and the UI must explain that the user can sign in again.
- **Non-goals:** Custom usernames, local password storage, password visibility/logging, phone auth, new account self-provisioning, employee/student crossover, redesigned Portal dashboards, or production promotion.
- **Primary CSS viewports:** 1440x900 and 390x844. Regression viewports: 1024x768 and 430x932.
- **Evidence:** provider-adapter/service/route/component tests; cross-audience and inactive-account checks; full validation/build; browser proof for both sign-in methods, reset, and optional post-placement setup; independent security review; staging provider identity proof; final funnel regression.
