# Graphic Concept homepage-rhythm refinement — MIS-378 design acceptance contract

## User workflow and problem

An adult learner should understand AIT's teaching philosophy, recognize the
questions AIT repeatedly hears from its community, and see how Graphic Concept
answers those frustrations beside the real 1:45 video. The accepted staging
composition has the right ingredients, but its opening reads like two competing
copy blocks, the community heading is weakened by an unnecessary explanation,
and the separate answer bridge makes the story feel assembled rather than fluid.

## Chosen interaction model

A linear editorial story with three chapters:

1. A warm philosophy-led opening that combines AIT's 20+ years of listening and
   the Graphic Concept definition into one coherent passage.
2. A full-width navy community-voices band containing three unnumbered questions.
3. A concluding response-and-video split that introduces the method's practical
   value without counting the fundamentals as "three reasons."

No interaction is required to understand the story. The native video controls
remain the only interactive element inside the section.

## Selected visual direction and reference classification

- Mode: **inspiration mode**. Alvaro's August 10 refinement feedback and the
  homepage's existing section system are authoritative; the earlier generated
  option is no longer a literal fidelity target.
- Preserve the accepted option's warm opening, full-width navy community band,
  and final fundamentals/video split while removing the now-rejected standalone
  solution bridge.
- Match the homepage's existing Plus Jakarta Sans typography, 1180px content
  frame, navy/warm/gold tokens, restrained 8px radii, and adjacent-section
  rhythm instead of introducing a standalone campaign style.
- Use the same vertical blue-to-gold heading accent seen in the other homepage
  chapters. At the mobile breakpoint it follows the homepage system's compact
  horizontal-marker variant. The opening eyebrow is gold and the large heading
  is near-black navy.

## Locked content

- Hero eyebrow retains `Una escuela de inglés diferente para gente con propósito`
  and uses the same warm gold as the modality icons below it.
- Method eyebrow: `Nuestra filosofía`
- Method heading: `Primero comprendes. Después hablas.`
- Opening passage: `Durante más de 20 años hemos escuchado las necesidades y frustraciones de nuestra comunidad. De esa experiencia nació Graphic Concept: nuestro método visual para ayudarte a pensar en inglés y comunicarte en el trabajo, los estudios y la vida diaria. Es fácil de aprender y está pensado para cualquier persona, sin importar su nivel académico, para que comprendas y hables con más facilidad y fluidez, sin memorizar listas interminables.`
- Community eyebrow: `Lo que escuchamos`
- Community heading: `¿Te suena familiar?`
- No community intro paragraph; the questions carry the subsection.
- Questions, in source order but visually unnumbered:
  - `¿Quieres hablar inglés rápido, fácil y sin estrés?`
  - `¿Llevas tiempo intentando hablar inglés y todavía no lo logras?`
  - `¿Te obligan a memorizar miles de palabras y sientes que no te alcanzan ni el tiempo ni la cabeza?`
- Response eyebrow: `Nuestra respuesta`
- Response heading: `Lo que cambia cuando entiendes el método.`
- Preserve the approved three fundamentals and supporting descriptions from
  `solutionCharacteristics` verbatim.
- Video label: `Conoce el método completo · 1:45`

## Locked behavior and state

- Preserve `#metodo`, the section's current position, the one real video source,
  poster, controls, accessible label, preload behavior, and mobile fullscreen behavior.
- Questions and fundamentals are semantic unordered lists without visible or
  accessible sequence numbers.
- No question-count subheading such as `Tres preguntas`.
- The video appears exactly once.
- Preserve keyboard access, visible focus, reduced-motion behavior, and page
  reading order.

## Explicit non-goals

- No compass, door, path, staircase, decorative illustration, question/principle
  artwork, invented testimonial, fake quote, CTA, grammar demo, cards, carousel,
  tabs, new colors, gradients, or changes outside the Method section and its
  focused tests/reference contract.
- No hero changes beyond the eyebrow color. No proof, courses, locations, books,
  FAQ, navigation, form, route, data, production, or production-branch changes.

## Responsive contract

- Primary desktop: 1440 × 900 CSS px.
- Desktop regression: 1280 × 720 CSS px.
- Tablet regression: 768 × 1024 CSS px.
- Mobile regression: 390 × 844 CSS px.
- Default zoom and DPR 1 for comparison captures.

## Layout and hierarchy invariants

- All warm chapters align to the homepage's 1180px content frame.
- Opening title remains the dominant type; the single integrated passage retains
  a readable line length and does not create an empty image-shaped hole.
- The navy band is full bleed, clearly framed as community voice, and contains
  one heading plus three equally weighted unnumbered questions separated by
  restrained gold rules.
- The conclusion follows the questions directly; no redundant bridge chapter is
  inserted between the community voice and AIT's response.
- On desktop, fundamentals and the single portrait video are balanced side by
  side; the video is neither oversized nor detached.
- On tablet/mobile, questions and fundamentals stack in natural reading order;
  the video follows the fundamentals and remains useful without horizontal
  overflow or clipped controls.
- Spacing matches the homepage's calm section rhythm; there are no excessive
  dead zones, repeated headings, or ornamental filler.

## Content-growth assumptions

- Exactly three community questions and three fundamentals for this release.
- Each question may wrap to four mobile lines and each fundamental description
  may grow by roughly 30% without overlap or clipping.
- The video label may grow by roughly 30% without clipping.

## Required closeout evidence

- Before/after 1440px section captures on a matching viewport basis.
- Focused captures for the community band and fundamentals/video conclusion.
- Browser captures or DOM measurements at every locked viewport.
- Zero horizontal overflow, missing assets, console errors, failed page requests,
  or broken video controls.
- Focused Method tests, full test suite, 44-asset audit (or current truthful
  inventory), production build, browser verification, and `git diff --check`.
- Exact candidate commit, routing evidence, Director decision, staging branch
  containment, Git-triggered Vercel deployment, and live staging evidence or
  the exact access blocker. Production remains untouched.
