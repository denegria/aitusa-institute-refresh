# Design QA: Institutional Proof Band

## Comparison target

- Source concept: `screenshots/institutional-proof-reference.png`
- Desktop implementation: `screenshots/institutional-proof-desktop-final.png`
- Mobile implementation: `screenshots/institutional-proof-mobile-final.png`
- Full-view comparison: `screenshots/institutional-proof-comparison-full.png`
- Focused band comparison: `screenshots/institutional-proof-comparison-focused.png`
- State: homepage at the top, navigation closed, Hero actions idle

The source concept is the selected navy direction. Alvaro's subsequent
corrections are part of the visual truth: retain `Desde 2004`, remove its Hero
duplication, reduce its scale, replace the redundant `20+ años` fact, add
international reach, and fit the complete Hero ledger in the first viewport.

## Viewports

- Source concept: 1487×1058
- Primary desktop implementation: 1440×900
- Desktop regressions: 1536×864, 1920×930, and 1920×1080
- Primary mobile implementation: 390×844
- Mobile regressions: 360×800 and 430×932
- Browser screenshots and DOM measurements used device-pixel ratio 1.

## Findings

No actionable P0, P1, or P2 findings remain.

### Fonts and typography

- The implementation keeps the existing Plus Jakarta Sans system instead of
  introducing the concept's unrelated display serif.
- `Desde 2004`, `+1,000`, `4 sedes`, and `Alcance internacional` share one
  restrained fact hierarchy. The international heading tightens only enough to
  fit its longer phrase.
- Supporting labels remain uppercase, legible, and subordinate. No text is
  clipped, clamped, or truncated at any required viewport.

### Spacing and layout rhythm

- Desktop uses a 96px four-column ledger with fine dividers. At every required
  desktop viewport, the Header, Hero main, and ledger end two pixels before the
  viewport boundary.
- The 1536×864 short-desktop pass confirms that the modality row ends inside the
  Hero main rather than being covered by the ledger.
- Mobile uses a static 2×2 ledger measuring approximately 108–112px. At 390px
  and 430px it follows the photo normally; at 360px it overlaps 52px of the
  photo's existing white fade so the complete ledger ends inside the first
  screen.
- The mobile solution has no carousel, ticker, auto-rotation, or hidden
  horizontal content.

### Colors and visual tokens

- The ledger uses the homepage navy `#001a3d`, white type, muted-white labels,
  and warm-gold dividers from the selected direction.
- It introduces no gradient, glow, card shadow, added gold headline, or new
  decorative system.
- The transition into the warm Method chapter remains intentional on mobile and
  begins below the complete Hero composition.

### Image quality and asset fidelity

- The approved Hero photograph and its current crop are preserved.
- No generated people, substitute photography, icons, or approximate assets
  were introduced.
- The 360px overlap covers only the photograph's white fade; it does not cover a
  face, classroom subject, CTA, or meaningful image detail.

### Copy and content

- The Hero eyebrow now reads `Escuela de inglés en Nueva Jersey`; `Desde 2004`
  appears once, in the proof ledger.
- The four supplied proofs are `Desde 2004`, `+1,000 estudiantes`, `4 sedes`,
  and `Alcance internacional`.
- International reach is framed precisely as `EE. UU., Centroamérica y
  Sudamérica`. No accreditation, country count, campus, or unsupported outcome
  claim was added.

### Interaction and accessibility

- The proof ledger is semantic, static content inside an `aside` labelled
  `Trayectoria de AIT USA Institute`.
- All existing Hero links, modality links, header navigation, and mobile menu
  behavior are preserved.
- Production-mode local browser verification showed no console errors.
- DOM verification found four visible facts and no page-level horizontal
  overflow at every required viewport.

## Comparison history

### Pass 1: selected concept

- P1: `DESDE 2004` dominated the entire band and duplicated the Hero eyebrow.
- P2: `20+ años` repeated the same longevity proof without adding information.
- Direction change: normalize the four facts, remove the eyebrow duplication,
  and add the supplied international reach.

### Pass 2: responsive candidate

- P1: the first 1536×864 candidate let the modality row extend 17px into the
  ledger.
- P1: the first 360×800 candidate left the second mobile proof row below the
  first viewport.
- Fix: tighten the short-desktop Hero's top budget and overlap the compact
  mobile ledger only across the photograph's white fade.

### Pass 3: final comparison

- Evidence: `screenshots/institutional-proof-comparison-full.png` and
  `screenshots/institutional-proof-comparison-focused.png`.
- Result: the selected navy mood is preserved while the corrected content,
  scale, first-viewport fit, and responsive behavior match the approved
  direction.

## Validation

- `node --test tests/*.test.mjs`: 123 passed.
- `npm run check:assets`: 28 references, 0 missing, 0 orphaned.
- `npm run build -- --webpack`: passed; 34 static pages generated.
- `npm audit --audit-level=high`: 0 vulnerabilities.
- `git diff --check`: passed.
- Lint: unavailable; this repository has no lint script.

## Final Result

passed
