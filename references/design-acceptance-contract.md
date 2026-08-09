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
