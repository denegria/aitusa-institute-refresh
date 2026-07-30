# Design QA: Compact Mobile Study Options

## Comparison target

- Mobile baseline: `screenshots/mobile-study-options-reference.png`
- Mobile implementation: `screenshots/mobile-study-options-final.png`
- Desktop regression: `screenshots/mobile-study-options-desktop-final.png`
- State: homepage at `#cursos`, navigation closed, actions idle

The source of truth is the existing desktop study-options section and Alvaro's
request to compress its mobile presentation. The mobile result must preserve
all three formats and all five supporting-program links without a carousel,
tabs, disclosure, ticker, or hidden horizontal content.

## Viewports

- Primary mobile implementation: 390×844
- Mobile regressions: 360×800 and 430×932
- Desktop regression: 1440×900
- Browser screenshots and DOM measurements used device-pixel ratio 1.

## Findings

No actionable P0, P1, or P2 findings remain.

### Fonts and typography

- The existing Plus Jakarta Sans hierarchy is preserved.
- Mobile uses a shorter introductory sentence and complete, format-specific
  summaries; no summary is line-clamped, clipped, or replaced by an ambiguous
  label.
- `Programa principal` keeps Presencial visually primary without increasing
  the section's visual noise.

### Spacing and layout rhythm

- At 390×844, the section decreased from 1,102px to 708px, a reduction of
  approximately 36%.
- The complete section begins below the 72px sticky header and ends at 780px,
  leaving the beginning of the Sedes chapter visible in the same viewport.
- The three formats form a compact vertical decision ledger. Presencial is
  107px high; Híbrido and Online are each 88px high.
- The five supporting programs use a quiet two-column grid with 44px rows.
- At 360×800 and 430×932, all content remains visible with no page-level
  horizontal overflow.

### Colors and visual tokens

- Presencial retains the existing navy primary treatment.
- Híbrido and Online retain the white secondary treatment and existing border
  tokens.
- No new gradients, shadows, gold decoration, or competing card system was
  introduced.

### Image quality and asset fidelity

- This section contains no photographic assets, and no image or icon asset was
  added or substituted.
- Existing Lucide arrow icons become the sole visible mobile action treatment.

### Copy and content

- Presencial: `Práctica cara a cara con corrección inmediata en Nueva Jersey.`
- Híbrido: `Combina clases presenciales y apoyo remoto.`
- Online: `Estudia en vivo desde casa o desde otro país.`
- The compact copy communicates the key distinction between the three formats
  while the full desktop copy remains unchanged.
- All five supporting programs remain exposed: Inglés para niños, GED,
  Computación, Español para extranjeros, and Programas de apoyo.

### Interaction and accessibility

- Each mobile format has a 44×44px action target; every supporting-program link
  is at least 44px high.
- Mobile CTA text is removed visually, while the complete accessible label
  remains format-specific through `aria-label`.
- Link destinations are unchanged:
  `/courses/#ingles-presencial`, `/courses/#ingles-hibrido`, and
  `/courses/#ingles-online`.
- Production-mode local browser verification showed no console errors.

## Comparison history

### Pass 1: mobile baseline

- P1: the section measured 1,102px at 390×844, or approximately 1.31
  viewports.
- P1: three full-size cards consumed 629px before the supporting programs.
- Constraint: compression could not hide or auto-rotate any course choice.

### Pass 2: compact decision ledger

- The section measured 708px at 390×844.
- All three formats, all five supporting programs, the complete heading, and
  the start of the next chapter fit in one mobile viewport.
- Regression checks at 360×800 and 430×932 found no clipped content, undersized
  targets, or horizontal overflow.

### Pass 3: desktop regression

- The 1440×900 layout remained exactly three columns.
- Section height remained 640.296875px; offer-map width and height remained
  1188×237.140625px; each card remained 237.140625px high.
- Desktop copy, support pills, and CTA treatments are unchanged.

## Validation

- `node --test tests/*.test.mjs`: 123 passed.
- `npm run check:assets`: 28 references, 0 missing, 0 orphaned.
- `npm run build -- --webpack`: passed; 34 static pages generated.
- `npm audit --audit-level=high`: 0 vulnerabilities.
- `git diff --check`: passed.
- Lint: unavailable; this repository has no lint script.

## Final Result

passed
