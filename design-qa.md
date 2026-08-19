# Design QA: Flagship Course Detail Template

## Comparison target

- Previous route: `screenshots/course-template-reference.jpg`
- Desktop implementation: `screenshots/course-template-desktop-final.jpg`
- Mobile implementation: `screenshots/course-template-mobile-final.jpg`
- Mobile Hero: `screenshots/course-template-mobile-hero-final.png`
- Route: `/courses/ingles-jovenes-adultos/`
- State: page loaded at the top, video paused, FAQs closed

The previous canonical route repeated the generic catalog before showing the
selected program inside a disclosure. At 1440×900, the selected course detail
began 2,252px below the first viewport. The new route opens directly on the
program and uses one reusable editorial template backed by reviewed course
data.

## Viewports

- Primary desktop: 1440×900
- Desktop regressions: 1366×768 and 1920×1080
- Primary mobile: 390×844
- Mobile regressions: 360×800 and 430×932
- Browser screenshots and DOM measurements used device-pixel ratio 1.

## Findings

No actionable P0, P1, or P2 findings remain.

### Fonts and typography

- The existing Plus Jakarta Sans display and body system remains intact.
- One H1 names the selected program. Seven ordered H2 chapters create an
  understandable academic journey without a generic catalog heading.
- Desktop uses an editorial title scale; mobile reduces it without clipping,
  clamping, or forcing a horizontal scroll.

### Spacing and layout rhythm

- At 1440×900, the complete Header, Hero, and academic proof ledger end at
  885.94px, inside the first viewport.
- The Hero presents the program, lead, placement CTA, admission link, and
  program photography before any unrelated content.
- At 1366×768, the title and CTA remain visible before the first scroll; the
  ledger follows naturally below the shorter viewport.
- Major chapters alternate white, warm-academic, soft-blue, and navy surfaces.
  They do not use nested rails, stacked scrollbars, or repeated card grids.
- The complete page has no horizontal overflow at any required viewport.

### Colors and visual tokens

- Deep navy establishes academic authority; warm gold is limited to rules,
  markers, and supporting labels.
- Existing blue remains reserved for the dominant placement CTA and small
  institutional signals.
- No glass effects, decorative gradients, competing shadows, or new design
  token system were introduced.

### Image quality and asset fidelity

- Hero and method imagery use the existing approved AIT media through optimized
  `next/image` output with responsive sizes and an eager LCP Hero.
- The method image lazy-loads successfully when its chapter enters view.
- Jessica's existing 2:52 real-person video is presented once with native
  controls, documentary framing, no autoplay, and its approved poster.
- The photography remains temporary template media until the proposed client
  classroom/faculty shoot is available; the template does not claim it is
  documentary classroom photography.

### Copy and content

- The page covers three outcomes, three academic stages, three modalities,
  three schedule groups, one documented AIT story, and five program FAQs.
- No accreditation, tuition, guaranteed result, guaranteed duration, fixed
  enrollment date, or guaranteed location was added.
- Schedule and location language retains the existing caveat that the final
  group, sede, modality, and time must be confirmed before enrollment.
- Jessica's story uses the documented student-to-teacher context without an
  invented quote or outcome.

### Interaction and accessibility

- Placement is the single dominant action in the Hero and closing chapter;
  WhatsApp remains a quieter text link for questions.
- Every visible course-page link and FAQ summary is at least 44px in each
  required interactive dimension.
- Native FAQ disclosure toggling passed mouse and keyboard Enter testing;
  focus stays on the summary and the answer is exposed only while open.
- The story video has native controls, remains paused by default, does not
  autoplay, and preloads metadata only.
- The canonical link and Course JSON-LD schema remain present.

## Comparison history

### Pass 1: existing route

- P1: the selected program began 2,252px below the first desktop viewport.
- P1: two catalog cards, modality cards, filters, and unrelated disclosures
  appeared before or around the selected detail.
- P2: the canonical detail experience looked like an opened catalog accordion,
  not a prestigious program page.

### Pass 2: editorial template

- The route opens directly on the program with zero program cards and no
  `#catalogo-detallado` surface.
- Reusable content fields now drive Hero facts, outcomes, stages, method,
  logistics, story, FAQ, and closing copy.
- Only `ingles-jovenes-adultos` opts into the reviewed template; the other eight
  routes keep their existing fallback until their content is reviewed.

### Pass 3: responsive and interaction closeout

- Desktop Hero geometry was tightened after the breadcrumb target increased to
  44px; the final 1440×900 composition ends 14px inside the viewport.
- Mobile keeps the complete title, lead, and primary CTA before the Hero image
  at 360×800, 390×844, and 430×932.
- Regression checks found no broken images, small targets, heading-order issue,
  page overflow, console error, or fallback-route regression.

## Validation

- `node --test tests/*.test.mjs`: 124 passed.
- `npm run check:assets`: 28 references, 0 missing, 0 orphaned.
- `npm run build -- --webpack`: passed; 34 static pages generated.
- `npm audit --audit-level=high`: 0 vulnerabilities.
- `git diff --check`: passed.
- Production-mode browser QA: passed at all six required viewports.
- Lint: unavailable; this repository has no lint script.

## Final Result

passed

# Design QA — AIT USA institutional student journey palette

## Source and implementation evidence

- Primary navy/gold mood reference:
  `/root/.openclaw/giuseppe-workspace/media/inbound/openclaw-staged-0ce06af3-eeb9-488f-9159-09e9690acc73/6703a29d-fb3e-4252-990c-d837d89eed69.jpg`
- Light reading-surface reference:
  `/root/.openclaw/giuseppe-workspace/media/inbound/openclaw-staged-0ce06af3-eeb9-488f-9159-09e9690acc73/88d4541b-2a7a-438d-9371-f2c99c44397c.jpg`
- Combined same-input comparison:
  `/tmp/aitusa-design-qa.t5vLYB/comparison.png` at 1440×1600 physical pixels.
- Implementation screenshots:
  - `/tmp/aitusa-design-qa.t5vLYB/placement-desktop-final.png` — 1366×768, placement intro.
  - `/tmp/aitusa-design-qa.t5vLYB/placement-mobile-final.png` — 390×844, placement intro.
  - `/tmp/aitusa-design-qa.t5vLYB/signin-desktop.png` — 1366×768, email-first sign-in.
  - `/tmp/aitusa-design-qa.t5vLYB/signin-mobile.png` — 390×844, email-first sign-in.
  - `/tmp/aitusa-design-qa.t5vLYB/portal-desktop.png` — 1366×768, authenticated dashboard fixture.
  - `/tmp/aitusa-design-qa.t5vLYB/portal-mobile.png` — 390×844, authenticated dashboard fixture.
  - `/tmp/aitusa-design-qa.t5vLYB/study-desktop.png` — 1366×768, ready Study Buddy fixture.
  - `/tmp/aitusa-design-qa.t5vLYB/study-mobile.png` — 390×844, ready Study Buddy fixture.

The supplied screenshots are mood references, not matching page layouts. The
comparison therefore evaluates palette hierarchy, frame/surface balance,
action emphasis, and institutional tone rather than pixel-level cloning.

## Comparison and fix history

1. Initial implementation established navy structural frames, warm reading
   surfaces, and gold active/action states across all four surfaces.
2. First rendered comparison found one P1 mismatch: the placement intro still
   inherited the global electric-blue primary button and cool-blue eyebrow pill.
3. The placement scope now explicitly uses `#c4932d` for primary actions,
   `#f7f2e8` for the eyebrow surface, and dark navy text. The final screenshot
   confirms the mismatch is removed.
4. Portal desktop/mobile navigation uses navy structure and gold active state;
   sign-in uses a warm elevated form; Study Buddy keeps its warm exercise area
   inside a navy mission frame.

## Responsive, interaction, and runtime checks

- CSS viewports checked: 390×844, 768×1024, 1366×768, and 1440×900.
- Placement, sign-in, Portal, and Study Buddy showed no horizontal overflow at
  any checked viewport.
- Primary control minimum heights were 49px, 46px, 44px, and 48px respectively.
- Each route completed loading with its expected heading.
- No browser console errors, runtime exceptions, or HTTP responses at 400+
  occurred during the checked states.
- Reduced-motion and visible-focus rules remain present; scoring, authentication,
  guardian, provider, and persistence behavior were not changed.

## Severity review

- P0: none.
- P1: none remaining.
- P2: none remaining.
- P3: none recorded for this bounded palette slice.

## Final result

passed

---

# Graphic Concept Method reference implementation — 2026-08-09

The latest source-to-render comparison, responsive evidence, iteration history,
and final result are recorded in `design-qa-method-concept.md`.

Final result: passed

---

# Graphic Concept fidelity correction — 2026-08-09

## Comparison target

- Source visual truth: `C:\Users\Alvaro\AppData\Local\Temp\codex-clipboard-342bbd87-7887-434b-8d64-f9875a915e2f.png` (379 × 800 px).
- Implementation: browser-rendered local homepage `http://localhost:3020/#metodo`.
- Captures: in-app Browser, 390 × 844 CSS px mobile and 1440 × 900 CSS px desktop, DPR 1, top-of-section state, navigation visible, video paused.
- Density normalization: source is a compact single-column editorial board; the comparison matched its content hierarchy and density at mobile, and its two-column opening / compact reading grid at desktop.

## Findings

### Fonts and typography

- The earlier render used the homepage display sans at a homepage-hero scale, producing a major mismatch with the reference's editorial serif hierarchy.
- Fixed: the Graphic Concept display and question/pain headlines now use a conservative Georgia serif stack only inside this section. The title uses the same three short lines and gold italic accent as the source.

### Spacing and layout rhythm

- The earlier render treated the method as a sequence of large viewport chapters. The reference is a compact paper-like composition with shallow rule-separated bands.
- Fixed: reduced the opening scale, section gaps, bridge height, principle-card padding, and video footprint. The learner cues now sit in a four-column strip, questions use shallow numbered rules, and the bridge is a single warm panel.
- Mobile check found a horizontal overflow caused by a desktop bridge grid winning at the mobile breakpoint. Fixed with a single-column override; final mobile document width is 375/375.

### Colors and visual tokens

- The final surface uses existing warm ivory, AIT navy, and muted gold. The broad radial/gradient treatment is no longer visually dominant.

### Image quality and asset fidelity

- The existing project-local compass and path WebP artwork match the reference's ink-and-paper direction. The conclusion retains the real AIT portrait video rather than a fabricated testimonial asset.

### Copy and content

- The source's core sequence is preserved: opening promise, learner-fit cues, three questions, Graphic Concept solution, three principles, and real proof.
- Unapproved mock-specific curriculum claims and fabricated testimonial details remain excluded.

## Comparison history

1. Earlier staging render: P1 composition drift. The result used a broad homepage chapter scale and omitted the compact learner-fit / question structure.
2. First correction: added the reference headline and cue strip. Browser QA found a P1 mobile grid override and horizontal overflow.
3. Second correction: restored the mobile single-column grid and removed overflow. The opening still read too much like a homepage hero.
4. Final correction: reduced the entire layout to the source's editorial density, added the shallow question heading/rows, and applied the local serif hierarchy. Final mobile and desktop captures show the intended paper-like composition with no horizontal overflow.

## Validation

- Focused homepage-method tests: passed.
- Production build: passed.
- Browser-rendered responsive checks: passed at 390 × 844 and 1440 × 900.
- Horizontal overflow: none at the final checked viewports.
- Console error scan: no errors observed during the rendered checks.

## Follow-up polish

- P3: If the site later adopts a licensed editorial serif as a global brand token, replace the local system-serif fallback with that approved family.

final result: passed

---

# Community gallery video-only and motion pass — 2026-08-10

## Comparison target and evidence

- Selected visual target: `C:\Users\Alvaro\.codex\generated_images\019fec9c-869a-73a0-810b-a5ba80b98f1c\exec-f08e9386-6af1-4edd-a003-13a760b0d175.png`.
- Fresh same-input board: `artifacts/gallery-design-qa/reference-vs-local-final.jpg`.
- Desktop source-state capture: `artifacts/gallery-design-qa/local-968x1720.png`.
- Mobile browser check: 390 × 844 CSS px in the in-app browser.
- Poster-selection contact sheets: `artifacts/gallery-poster-candidates/`.
- Route and state: `http://127.0.0.1:5174/#experiencia`, interview tab selected, videos paused, graduation archive collapsed.

The selected concept remains the composition reference. The two supporting
photos in that concept are intentionally replaced by the two remaining real
interview videos because the approved product requirement now makes the first
tab video-only.

## Findings and fixes

1. P1: the interview tab mixed one video with two unrelated photos. Fixed by
   presenting all three real English interview videos in the same one-plus-two
   grid.
2. P1: the earlier posters caught speakers mid-word. Real frames were sampled
   across each source video. Jessica now uses a calm engaged exchange, Eric
   uses the frame where both people are smiling, and the international
   interview uses a neutral closed-mouth frame. New `-curated.jpg` paths avoid
   stale optimized-image caches.
3. P2: the earlier timer changed media inside one tab, so automatic movement
   was easy to miss. The selected tab now advances every eight seconds and its
   gold underline fills toward the next change. Hover, recent interaction, and
   reduced-motion preference still pause or disable automatic cycling.
4. P2: dynamic video cards initially lost their Lucide play glyphs after a tab
   transition. The icon runtime now rehydrates after gallery state changes.
5. P2: the media grade was too weak to unify mixed source lighting. The final
   render uses a restrained brightness, contrast, and saturation correction on
   every gallery image and poster without altering faces or scene content.

## Responsive, interaction, and runtime checks

- Desktop retains the approved strict one-plus-two stage, four-card graduation
  row, navy chapter, and limited gold accents.
- Mobile at 390 × 844 keeps one large video, two equal video cards, horizontally
  scrollable tabs, and no document-level horizontal overflow.
- Automatic movement changed the selected tab from `Entrevistas en inglés` to
  `Graduaciones` after 8.5 seconds in the rendered browser.
- Eric's dialog loaded the curated poster and real 42.77-second MP4 with
  `readyState=4`; keyboard playback advanced beyond 1.3 seconds.
- A fresh browser tab returned no console warnings or errors after final code
  changes.
- The legacy full browser harness captured the homepage states but later
  stopped on its existing `/cursos/computacion-oficina` readiness assertion;
  gallery desktop/mobile checks were completed directly in the in-app browser.

## Validation

- `node --test tests/*.test.mjs`: 267 passed.
- `npm run check:assets`: 89 references, 0 missing, 0 orphaned.
- `npm run build`: passed; 36 static pages generated.
- `git diff --check`: passed.

No actionable P0, P1, or P2 findings remain.

final result: passed

---

# Community gallery cleanup and interview relabel — 2026-08-10

## Comparison target and evidence

- Selected visual target: `C:\Users\Alvaro\.codex\generated_images\019fec9c-869a-73a0-810b-a5ba80b98f1c\exec-f08e9386-6af1-4edd-a003-13a760b0d175.png` (984 × 1640 px).
- Same-input comparison board: `artifacts/gallery-cleanup/reference-vs-implementation-final.jpg`.
- Desktop implementation states: `artifacts/gallery-cleanup/qa-implementation-heading.png`, `qa-implementation-top.png`, and `qa-implementation-bottom.png` at a 1440 × 900 CSS viewport.
- Mobile implementation state: `artifacts/gallery-cleanup/implementation-mobile-390x844.png` at a 390 × 844 CSS viewport.
- Route and state: `http://127.0.0.1:5174/#experiencia`, first interview selected, video paused, graduation archive collapsed.

The web chapter is taller than one desktop viewport, so the comparison board pairs the complete source mock with focused heading, media-stage, and graduation-row captures. The repeated site header in the three implementation slices is capture context rather than part of the gallery design.

## Required fidelity surfaces

### Fonts and typography

- Existing AIT display and body fonts remain intact. The two-line editorial headline, restrained supporting copy, tab hierarchy, and compact graduation heading match the selected direction.
- The first tab now says `Entrevistas en inglés`, accurately naming the live student interview videos rather than calling them generic stories.

### Spacing and layout rhythm

- The earlier two-by-two support mosaic and irregular 15-tile graduation wall were the main P1 density problem.
- Fixed with one dominant interview feature, two evenly stacked supporting images, and four equal 3:4 graduation cards. The expanded 27-photo archive preserves the same uniform grid instead of switching to masonry.
- Section gaps, media radii, tab baselines, and the centered archive action now follow the selected mock's strict alignment.

### Colors and visual tokens

- Deep navy remains the chapter surface; warm gold is limited to the section marker, selected-tab rule, and archive action.
- Photography receives one restrained, non-generative brightness, contrast, and saturation treatment. No identity, face, or scene content is altered.

### Image quality and asset fidelity

- The featured interview uses the real Jessica poster and opens the real video. Supporting photos and all 27 graduation photos are optimized local AIT assets rendered through `next/image`.
- The four collapsed graduation cards were changed from weak group shots to certificate-forward images with clear subjects and consistent portrait crops.
- The source mock's simulated bottom video controls are intentionally replaced by a real play affordance and working dialog rather than fake playback chrome.

### Copy and content

- The introduction now names student interviews in English, graduations, and real community moments.
- `Graduaciones recientes` and `Ver las 27 graduaciones` match the selected concept. No new student outcomes, quotes, or promotional claims were invented.

## Interaction, accessibility, and responsive checks

- Interview feature cycling changed the real video source after 6.5 seconds and pauses for reduced motion, hover, or recent interaction.
- Video dialog opened the selected interview; the photo lightbox opened, advanced to a different image, closed, and returned focus.
- Tabs remain keyboard-oriented ARIA tabs. `Graduaciones` selected correctly, the collapsed row contained 4 cards, and the archive expanded to all 27 with `aria-expanded=true`.
- Mobile at 390 × 844 keeps the gold chapter marker, horizontally scrollable tabs, one featured interview, a two-photo support grid, and two-column graduation cards without visible horizontal page overflow.

## Comparison history

1. P1: the first implementation felt visually messy because it combined a near-equal two-column stage with four small tiles and an irregular 15-photo wall. Replaced by the selected strict grid.
2. P2: the first four chronological graduation files did not consistently show certificates. Replaced with certificate-forward editorial picks while preserving all 27 in the archive.
3. P0 fallback: the browser check exposed a blank chapter when the reveal observer was unavailable. The section now stays visible by default and uses the reveal animation only as an enhancement.
4. Final same-input comparison found no remaining P0, P1, or P2 difference. The real header context and functional play affordance are intentional product constraints; no P3 follow-up is required for this slice.

final result: passed

---

# Graphic Concept final fidelity pass — 2026-08-09

## Comparison target and evidence

- Source visual truth: `C:\Users\Alvaro\AppData\Local\Temp\codex-clipboard-2f56a5cb-d1db-42be-97c1-0f377844089b.png` (379 × 800 physical px).
- Browser-rendered implementation: `http://localhost:3020/#metodo`, paused video state with the site navigation visible.
- Mobile evidence: `C:\Users\Alvaro\AppData\Local\Temp\ait-method-mobile-final.png` at 379 × 800 browser viewport, 364 CSS px content width, DPR 1.
- Desktop evidence: `C:\Users\Alvaro\AppData\Local\Temp\ait-method-desktop-top-final.png`, `ait-method-desktop-mid-final.png`, and `ait-method-desktop-bottom-final.png` at 1440 × 900 browser viewport, 1425 CSS px content width, DPR 1.
- The source and each final implementation capture were emitted together in the same comparison input. Focused top, middle, and closing comparisons were necessary because the responsive web section is taller than a single desktop viewport.

## Findings and fixes

### Fonts and typography

- Earlier implementation still used heavy homepage sans headings for the bridge, principles, and proof close. This was a P1 mismatch against the reference's consistent editorial-serif voice.
- Fixed with a section-scoped Georgia serif stack, restrained weights, tighter letter spacing, smaller copy, and the exact three-line gold-italic title treatment.

### Spacing and layout rhythm

- Earlier mobile evidence stacked the compass below a long text block and produced a 2536 px chapter, losing the reference composition. The questions and solution also read as separate homepage panels rather than one editorial board.
- Fixed by pairing the compass with the title at mobile, shortening the introduction, restoring four compact learner cues, placing the question label beside its numbered rules, keeping a shallow two-track bridge, and retaining three equal principle columns. Final mobile section height is 1828 px with no horizontal overflow; desktop height is 2071 px within the centered 1040 px editorial board.

### Colors and visual tokens

- The final implementation uses the reference's paper ivory, AIT navy, muted gold, and hairline rules. No gradient, card shadow, or high-chroma treatment competes with the board.

### Image quality and asset fidelity

- The project-local compass and staircase WebP assets are sharp, correctly scaled, and use the source's ink-on-paper treatment. The proof area retains a real AIT portrait video and its working native controls. No visible reference asset is replaced by CSS art or a fabricated drawing.

### Copy and content

- Copy is now deliberately short and follows the source sequence: adult-learning promise, four barriers, three questions, Graphic Concept answer, three principles, real-student proof, and the closing reassurance.
- English-learning language remains accurate to AIT's product direction while matching the reference's line lengths and information density.

## Comparison history

1. Prior staging state: P1 typography and density drift remained; mobile opening was one long column and several headings were heavy sans.
2. First final-pass correction: shortened copy, restored serif hierarchy, added the trust and closing reassurance, and compressed mobile composition. Same-input comparison found the mobile question label still stacked above its rules.
3. Second correction: moved the trust note into the opening grid and placed the mobile question label beside its numbered rows. Post-fix same-input comparison showed the source hierarchy at both 379 × 800 and 1440 × 900, with no P0/P1/P2 visual mismatch remaining.

## Responsive, interaction, and runtime checks

- Mobile: 364/364 CSS document width; no horizontal overflow.
- Desktop: 1425/1425 CSS document width; no horizontal overflow.
- Video remains visible, paused, and interactive with native controls.
- Navigation remains visible and unchanged.
- Browser console warning/error scan returned no entries.

## Severity review

- P0: none.
- P1: none remaining.
- P2: none remaining.
- P3: an approved licensed editorial serif could replace the system-serif fallback later; this does not block fidelity.

final result: passed
## Current run — wide-desktop homepage hero

- Source visual: `C:\\Users\\Alvaro\\AppData\\Local\\Temp\\codex-clipboard-f0505c26-d4ae-4303-a12e-80791f02318b.png` (1890 × 698 px reference crop).
- Implementation: [staging homepage](https://aitusa-institute-refresh-git-staging-alvaros-projects-efb8ae58.vercel.app/), commit `b167e1752b43c235aae237675151a828243abacb`.
- QA state: homepage hero at the top of the page, default desktop styling, no interaction.
- Rendered check: Codex in-app browser at 1296 × 920 CSS px (actual content width 1281 px). The in-app canvas caps the viewport below the 1440 px large-desktop breakpoint, so the large-desktop branch was source-checked rather than captured at its target width.

### Compared surfaces

- The regular desktop grid uses a 42/58 copy-to-image split; the large-desktop branch uses 36/64 so the photo extends farther left and showcases more of the supplied classroom image.
- The image frame begins immediately below the Spain launch banner and is clipped at the trust band below it. The live regular-desktop measurement was image frame `top: 154px`, `bottom: 822px`, with the trust band beginning at `822px`.
- Both desktop branches share the same subtle white edge veil: a lightened top edge plus reduced left, right, and bottom border treatment. The existing approved soft-fade asset remains the image source; no replacement imagery was introduced.
- Mobile remains on the existing classroom asset and mobile crop behavior.

### Findings

- No P0, P1, or P2 visual issues found in the available live render.
- Exact 1440+ pixel comparison remains an open P3 verification item because the Codex in-app browser exposes a maximum inner width of 1296 px in this session; the `min-width: 1440px` layout rule is present in the deployed source.

### Comparison history

- `b167e17 feat: widen large desktop hero treatment` — added the large-desktop column treatment and consistent lighter edge veil.

Final result: passed
