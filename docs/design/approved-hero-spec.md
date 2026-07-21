# AIT USA Approved Homepage Hero Specification

## Source Of Truth

- Approved direction: Concept 1 - Clean Production Lockup.
- Desktop reference: `docs/design/approved-concept-1-desktop.png`.
- Implementation scope: shared header, homepage hero, modality links, and immediate three-part proof band.
- Out of scope: broader homepage redesign, CRM capture, payments, authentication, platform work, and removal of the legacy public-site bridge.

## Final Spanish Copy

Eyebrow:

> Una escuela de inglés diferente

Headline:

> Te guiamos al camino correcto para hablar inglés con confianza.

Supporting copy:

> Con métodos, técnicas y estrategias propias, más de 20 años trabajando con la comunidad. Conocemos tus necesidades y frustraciones, por eso aprendemos de manera diferente y lo aplicamos con éxito.

Primary CTA:

> Encuentra tu nivel

Secondary CTA:

> Conoce nuestro método

Modalities:

- Presencial
- Online
- Híbrido

Proof statements:

1. **Comprendemos, no traducimos**

   Técnicas de comprensión que te permiten entender el inglés de forma natural.
2. **Hablamos, no memorizamos**

   Técnicas para hablar inglés sin memorizar miles de palabras.
3. **Método Graphic Concept**

   Nuestro método único, patentado y probado por más de 20 años de experiencia.

## Visual System

- Brand navy: `#061a4a`
- Deep proof-band navy: `#001a3d`
- CTA navy: `#002258`
- Eyebrow gold: `#ad6e0e`
- Icon gold: `#c28a26`
- Brand gold: `#c4932d`
- Primary text: `#07122f`
- Supporting text: `#263247`
- White: `#ffffff`
- Headline font: Georgia with Times New Roman fallback.
- Body and UI font: Plus Jakarta Sans with Segoe UI and Arial fallbacks.
- Buttons: 6px radius, 48-52px height, 700-weight labels, restrained shadow,
  and strong navy or white/outlined treatment.
- Secondary CTA icon: outlined circle with a filled play triangle, matching the
  approved Concept 1 control.
- Icons: Lucide line icons at a consistent 1.8px stroke, rendered in gold for modality and proof elements.
- Modalities: open white strip with no outer border or shadow; short neutral
  vertical dividers separate Presencial, Online, and Híbrido.
- Hero image: warm editorial classroom scene with Hispanic adult students and a professional advisor. Faces remain unobstructed and the advisor/student interaction is the visual proof.

## Responsive Layout

### Desktop: 1100px and wider

- 92px shared header with full navigation and telephone CTA.
- Hero uses a 42/58 split between copy and image.
- Copy aligns to the same left grid as the logo.
- On desktop, the header, hero copy, CTAs, and modality strip share one
  responsive outer gutter: `clamp(32px, 4vw, 58px)`. The hero and proof band
  remain full-width on large displays instead of centering inside a 1440px cap.
- Image overlaps the copy boundary beneath a broad white feather so the classroom
  dissolves into the text field without a hard vertical seam.
- Headline, supporting copy, CTAs, and modalities finish inside the protected
  white field before the photograph becomes visually dominant.
- Modalities appear as one connected row below the CTAs.
- At 1181px and wider, the header, main hero stage, proof band, and community
  line share one viewport-height budget. The proof band and community line use
  compact responsive heights so the complete approved composition remains
  visible on the initial desktop screen.
- The image keeps its natural aspect ratio and shifts vertically within the
  stage to protect the advisor, student, and placement booklet from the crop.
- The modality strip stays grouped directly beneath the CTA row.
- Between 1181px and 1439px, CTA and modality widths scale with the available
  copy field so controls remain clear of the photographic subject. Full Concept
  1 control dimensions return at 1440px and wider.
- The proof band's first and last groups use the same responsive outer gutter
  as the logo and hero copy, preserving one left edge across wide desktops.
- Proof band uses three equal columns directly below the hero image/copy stage.

### Tablet: 721px to 1099px

- Compact header with menu control when navigation no longer fits.
- Hero keeps a balanced two-column layout until 900px, then stacks copy above the image.
- Headline reduces without changing its editorial hierarchy.
- Image uses a 3:2 frame and an object position that protects both faces.
- Proof band remains three columns when space permits and becomes a stacked list below 900px.

### Mobile: 720px and narrower

- Logo remains visible at full mobile size; navigation opens beneath the header.
- Copy comes first, followed by two full-width CTAs.
- Modalities become a stable three-column row with icon above label.
- Hero image follows the actions in a 4:3 crop, with the advisor face and student interaction centered.
- Proof statements stack vertically with icons aligned consistently.
- No horizontal scrolling, clipped controls, overlapping copy, or off-screen actions.

## Functional Destinations

- Primary CTA: `/placement-test/`
- Secondary CTA: `#metodo`
- Presencial: `/courses/#ingles-presencial`
- Online: `/courses/#ingles-online`
- Híbrido: `/courses/#ingles-hibrido`
- Header phone CTA: configured AIT USA telephone link

## Accessibility And Behavior

- Semantic `nav`, `figure`, headings, links, and proof articles.
- Descriptive hero image alternative text.
- Keyboard-visible focus states on every action.
- Mobile menu exposes `aria-expanded`, `aria-controls`, and an updated accessible label.
- At 200% zoom, content may reflow but must not overlap or become unreachable.
- Motion remains limited to existing hover transitions; no autoplay or decorative animation is introduced.
