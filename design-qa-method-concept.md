# Graphic Concept Method section — design QA

- Source visual truth: `references/graphic-concept-method-reference.webp`
- Final comparison board and implementation screenshot evidence: `references/graphic-concept-method-design-qa.webp`
- Viewport/state: production build, homepage `#metodo`, 1440 × 900 CSS px, DPR 1, desktop navigation visible, no dialog or media playback state.
- Source pixels: 864 × 1821. Implementation captures: 1440 × 900 each. The comparison board normalizes the source and four implementation regions to 720 px columns and 1800 px total height; no density scaling beyond that presentation normalization.

## Findings

No actionable P0, P1, or P2 differences remain.

- Typography: the implementation preserves AIT's existing display and body families, weights, and responsive wrapping. The reference's editorial serif/italic accents were intentionally translated into AIT's navy/gold hierarchy rather than introducing a one-section font system.
- Spacing and layout rhythm: the opening compass, numbered questions, solution bridge, three-principle band, and video conclusion preserve the source's sequence and generous whitespace. The section remains long by design but reads as five distinct thoughts.
- Colors and visual tokens: the implementation stays within existing AIT warm ivory, navy, blue, and muted gold. No new section color was introduced.
- Image quality and asset fidelity: the generated compass and route artwork match the reference's ink-and-paper direction, are project-local WebP assets, and remain sharp at their rendered sizes. The final video uses the real AIT poster and media rather than the mock person's image.
- Copy and content: all approved English-learning questions, principles, and core Graphic Concept explanation remain intact. The mock's graphic-design curriculum, extra four-item pain row, and fake testimonial were correctly excluded as unapproved and redundant product content.
- Accessibility and behavior: the decorative illustrations use empty alt text and hidden semantics; the Method heading and principle heading keep labelled section structure; the video retains controls, poster, accessible label, and mobile fullscreen behavior.

## Focused-region evidence

- Opening: two-column hierarchy, compass scale, title wrapping, and warm surface were compared directly.
- Questions/bridge: numbering, divider rhythm, bridge copy order, panel proportion, and route-art crop were compared directly.
- Principles: desktop three-column proportions, icon/number hierarchy, borders, and body-copy wrapping were compared directly.
- Closing: final-copy/video balance, portrait video size, poster quality, and native controls were compared directly.

## Comparison history

1. Initial render — blocked.
   - P1: legacy named-grid placement scrambled the new chapter order and collapsed the opening.
   - Fix: changed the chapter container to an explicit vertical flow and reset the nested intro grid area.
   - Post-fix evidence: opening screenshot restored the selected two-column title/compass composition.
2. Second render — blocked.
   - P2: inherited `grid-area` and forced row rules stretched the principles and closing blocks; the later desktop pain grid also caused mobile horizontal overflow.
   - Fix: reset nested grid areas and rows, constrained the principles to one row, and restored the pain section to one column below 1040 px.
   - Post-fix evidence: zero horizontal overflow at 390, 768, 1280, and 1440 px; stable 3-column desktop and stacked mobile principles.
3. Production render — passed.
   - The final comparison board showed no remaining P0/P1/P2 mismatch.
   - Production DOM verified all three Lucide icons render as SVGs, the video exposes controls with a 105.77-second source, and the browser console contains no errors.

## Follow-up polish

- P3: a future brand-wide typography decision could introduce a true editorial serif accent, but doing so only in this section would create design-system drift and is not recommended for this slice.

## Verification

- Primary interaction tested: native video controls present and real 1:45 media metadata loaded.
- Responsive layouts checked: 1440 × 900, 1280 × 720, 768 × 1024, and 390 × 844.
- Browser console errors: none in the production build.
- Horizontal overflow: none at all checked viewports.

final result: passed
