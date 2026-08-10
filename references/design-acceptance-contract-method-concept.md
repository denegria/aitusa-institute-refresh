# Graphic Concept community-story section — MIS-378 design acceptance contract

## User workflow and problem

An adult learner should recognize the questions AIT repeatedly hears from its
community, understand that those frustrations are why Graphic Concept exists,
then finish with a concise explanation of the method beside the real 1:45 video.
The current staging composition decorates this story with unrelated compass,
path, numbered-question, and numbered-principle devices that make the section
feel longer and less credible.

## Chosen interaction model

A linear editorial story with four chapters:

1. A warm opening that establishes the method and AIT's listening history.
2. A full-width navy community-voices band containing three unnumbered questions.
3. A short warm solution bridge explaining why Graphic Concept was created.
4. A concluding fundamentals-and-video split with the real portrait video shown
   exactly once.

No interaction is required to understand the story. The native video controls
remain the only interactive element inside the section.

## Selected visual direction and reference classification

- Mode: **faithful-reference with explicitly approved product refinements**.
- Source visual truth:
  `/root/.openclaw/agents/main/agent/codex-home/generated_images/019fe93c-f7d7-74b3-a028-645810fd1508/exec-cfe97fae-5833-4226-a5d8-0a9a3064aebd.png`
- Preserve the selected option's warm opening, full-width navy community band,
  ivory solution bridge, and final fundamentals/video split.
- Match the homepage's existing Plus Jakarta Sans typography, 1180px content
  frame, navy/warm/gold tokens, restrained 8px radii, and adjacent-section
  rhythm instead of introducing a standalone campaign style.

### Explicitly permitted deviations

- Remove the duplicate opening video from the generated option. The real video
  appears once, beside the fundamentals, as Alvaro requested.
- Use the homepage's existing type family and token values rather than the
  generated image's approximate raster typography and colors.
- Reflow copy at tablet/mobile widths while preserving reading order and emphasis.
- Use semantic HTML and native video controls even where the raster reference
  simplifies them.

No other compositional downgrade is permitted.

## Locked content

- Eyebrow: `Método Graphic Concept`
- Heading: `Tres razones por las que somos diferentes.`
- Promise: `Graphic Concept es nuestro método visual para ayudarte a pensar en inglés y comunicarte en el trabajo, los estudios y la vida diaria.`
- Introduction: `Durante más de 20 años hemos escuchado las necesidades y frustraciones de nuestra comunidad. Así nació Graphic Concept: un método visual, fácil de aprender y pensado para cualquier persona, sin importar su nivel académico. Te ayuda a comprender y hablar inglés con más facilidad y fluidez, sin memorizar listas interminables.`
- Community eyebrow: `Lo que escuchamos`
- Community heading: `¿Te suena familiar?`
- Community intro: `No se trata de esforzarte más por memorizar. Se trata de encontrar una forma de aprender que te permita entender, practicar y usar el inglés con confianza.`
- Questions, in source order but visually unnumbered:
  - `¿Quieres hablar inglés rápido, fácil y sin estrés?`
  - `¿Llevas tiempo intentando hablar inglés y todavía no lo logras?`
  - `¿Te obligan a memorizar miles de palabras y sientes que no te alcanzan ni el tiempo ni la cabeza?`
- Solution eyebrow: `La respuesta`
- Solution heading: `Una ruta clara para comprender, hablar y avanzar.`
- Solution intro: `Graphic Concept convierte esas frustraciones en una secuencia visual: primero comprendes, después hablas y, con práctica guiada, avanzas a tu ritmo.`
- Fundamentals eyebrow: `De la pregunta a la práctica`
- Fundamentals heading: `Tres razones para avanzar con más facilidad.`
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
- No hero, proof, courses, locations, books, FAQ, navigation, form, route, data,
  production, or production-branch changes.

## Responsive contract

- Primary desktop: 1440 × 900 CSS px.
- Desktop regression: 1280 × 720 CSS px.
- Tablet regression: 768 × 1024 CSS px.
- Mobile regression: 390 × 844 CSS px.
- Default zoom and DPR 1 for comparison captures.

## Layout and hierarchy invariants

- All warm chapters align to the homepage's 1180px content frame.
- Opening title remains the dominant type; promise and introduction retain
  readable line lengths and do not create an empty image-shaped hole.
- The navy band is full bleed, clearly framed as community voice, and contains
  one heading/intro plus three equally weighted unnumbered questions separated
  by restrained gold rules.
- The solution bridge is concise and visually connects the dark band to the
  concluding method chapter without another illustration.
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

- Source and rendered 1440px section captures combined into one comparison artifact.
- Focused comparisons for the community band and fundamentals/video conclusion.
- Browser captures or DOM measurements at every locked viewport.
- Zero horizontal overflow, missing assets, console errors, failed page requests,
  or broken video controls.
- Focused Method tests, full test suite, 44-asset audit (or current truthful
  inventory), production build, browser verification, and `git diff --check`.
- Independent visual reviewer who did not implement the candidate; the reviewer
  must name residual differences and return accepted, accepted-with-approved-
  deviations, or rejected.
- Exact candidate commit, routing evidence, Director decision, staging branch
  containment, Git-triggered Vercel deployment, and live staging evidence or
  the exact access blocker. Production remains untouched.
