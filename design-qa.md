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
