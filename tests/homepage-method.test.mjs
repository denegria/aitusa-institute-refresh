import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import { siteData } from "../src/content.js";

const selectedQuestions = [
  "¿Quieres hablar inglés rápido, fácil y sin estrés?",
  "¿Llevas tiempo intentando hablar inglés y todavía no lo logras?",
  "¿Te obligan a memorizar miles de palabras y sientes que no te alcanzan ni el tiempo ni la cabeza?",
];

describe("homepage Method community story", () => {
  it("keeps the approved narrative and fundamentals verbatim", () => {
    const { methodNarrative, solutionCharacteristics } = siteData;

    assert.equal(methodNarrative.eyebrow, "Método Graphic Concept");
    assert.equal(methodNarrative.heading, "Tres razones por las que somos diferentes.");
    assert.equal(
      methodNarrative.promise,
      "Graphic Concept es nuestro método visual para ayudarte a pensar en inglés y comunicarte en el trabajo, los estudios y la vida diaria.",
    );
    assert.equal(
      methodNarrative.introduction,
      "Durante más de 20 años hemos escuchado las necesidades y frustraciones de nuestra comunidad. Así nació Graphic Concept: un método visual, fácil de aprender y pensado para cualquier persona, sin importar su nivel académico. Te ayuda a comprender y hablar inglés con más facilidad y fluidez, sin memorizar listas interminables.",
    );
    assert.equal(methodNarrative.painEyebrow, "Lo que escuchamos");
    assert.equal(methodNarrative.painHeading, "¿Te suena familiar?");
    assert.deepEqual(methodNarrative.painPoints, selectedQuestions);
    assert.equal(methodNarrative.solutionEyebrow, "La respuesta");
    assert.equal(methodNarrative.solutionHeading, "Una ruta clara para comprender, hablar y avanzar.");
    assert.equal(methodNarrative.reasonsEyebrow, "De la pregunta a la práctica");
    assert.equal(methodNarrative.reasonsHeading, "Tres razones para avanzar con más facilidad.");
    assert.equal(methodNarrative.video, "/assets/wix/videos/intro-video-great.mp4");
    assert.equal(methodNarrative.videoPoster, "/assets/wix/videos/posters/intro-video-great.jpg");
    assert.equal(methodNarrative.videoLabel, "Conoce el método completo · 1:45");
    assert.deepEqual(
      solutionCharacteristics.map(({ title, body }) => ({ title, body })),
      [
        {
          title: "Comprende sin traducir",
          body: "Entrena tu comprensión para entender inglés directamente, sin traducir palabra por palabra.",
        },
        {
          title: "Habla sin memorizar",
          body: "Practica estructuras útiles para hablar desde la primera clase, sin listas interminables.",
        },
        {
          title: "Avanza a tu ritmo",
          body: "Graphic Concept se adapta a tu nivel: un método propio, patentado y probado para hablar con más facilidad.",
        },
      ],
    );
  });

  it("renders the community band and unnumbered semantic questions", async () => {
    const source = await readFile("app/_components/site/PublicSections.jsx", "utf8");
    const method = source.slice(
      source.indexOf("export function MethodSection"),
      source.indexOf("const supportingPrograms"),
    );

    assert.match(method, /method-story__opening/);
    assert.match(method, /method-story__community/);
    assert.match(method, /method-story__community-inner/);
    assert.match(method, /method-story__bridge/);
    assert.match(method, /method-story__conclusion/);
    assert.match(method, /<ul className="method-story__questions"/);
    assert.match(method, /<ul className="method-reasons"/);
    assert.match(method, /aria-label="Preguntas comunes al aprender inglés"/);
    assert.match(method, /aria-label="Resumen del método en tres razones"/);
    assert.doesNotMatch(method, /<ol/);
    assert.doesNotMatch(method, /method-question__index|method-question__slash|Tres preguntas/);
    assert.doesNotMatch(method, /graphic-concept-(compass-source|pain-|principle-|path)/);
    assert.doesNotMatch(method, /method-reason__(icon|number|mark)/);
    assert.doesNotMatch(method, /footer-note|trust-note|videoEyebrow|videoHeading|videoIntroduction/);
    assert.doesNotMatch(method, /method-section|method-editorial/);
  });

  it("renders the existing native Method video exactly once with its required behavior", async () => {
    const [sections, interactive] = await Promise.all([
      readFile("app/_components/site/PublicSections.jsx", "utf8"),
      readFile("app/_components/site/InteractiveSections.jsx", "utf8"),
    ]);
    const method = sections.slice(
      sections.indexOf("export function MethodSection"),
      sections.indexOf("const supportingPrograms"),
    );
    const video = interactive.slice(
      interactive.indexOf("export function MethodVideo"),
      interactive.indexOf("export function ProofStories"),
    );

    assert.equal((method.match(/<MethodVideo/g) || []).length, 1);
    assert.equal((video.match(/<video/g) || []).length, 1);
    assert.match(video, /className="method-story__video"/);
    assert.match(video, /controls/);
    assert.match(video, /preload="metadata"/);
    assert.match(video, /narrative\.video/);
    assert.match(video, /narrative\.videoPoster/);
    assert.match(video, /onPlay=\{enterMobileFullscreen\}/);
    assert.match(video, /video\.webkitEnterFullscreen\(\)/);
    assert.match(video, /video\.requestFullscreen/);
    assert.doesNotMatch(video, /autoplay|muted|playsInline/);
  });

  it("locks the faithful community-story layout across desktop and compact viewports", async () => {
    const styles = await readFile("src/styles.css", "utf8");
    const correctionStart = styles.lastIndexOf("/* MIS-378 correction");
    const layer = styles.slice(
      correctionStart,
      styles.indexOf("/* MIS-378 source-art baseline", correctionStart),
    );

    assert.match(layer, /method-story__community\s*\{[\s\S]*background: var\(--home-navy\)/);
    assert.match(layer, /method-story__community-inner\s*\{[\s\S]*grid-template-columns: minmax\(260px, \.84fr\) minmax\(0, 1\.5fr\)/);
    assert.match(layer, /method-story__questions\s*\{[\s\S]*grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
    assert.match(layer, /method-story__conclusion\s*\{[\s\S]*grid-template-areas:[\s\S]*"heading video"[\s\S]*"reasons video"/);
    assert.match(layer, /@media \(max-width: 900px\)[\s\S]*method-story__questions\s*\{[\s\S]*grid-template-columns: minmax\(0, 1fr\)/);
    assert.match(layer, /@media \(max-width: 900px\)[\s\S]*"heading"[\s\S]*"reasons"[\s\S]*"video"/);
    assert.match(layer, /@media \(max-width: 719px\)[\s\S]*method-story__media\s*\{[\s\S]*width: min\(100%, 300px\)/);
    assert.doesNotMatch(layer, /linear-gradient|radial-gradient|mix-blend-mode|margin: 0 -|width: 145%/);
  });

  it("isolates the story from legacy Method grids so chapter order and tablet stacking cannot regress", async () => {
    const [sections, styles] = await Promise.all([
      readFile("app/_components/site/PublicSections.jsx", "utf8"),
      readFile("src/styles.css", "utf8"),
    ]);
    const method = sections.slice(
      sections.indexOf("export function MethodSection"),
      sections.indexOf("const supportingPrograms"),
    );
    const correctionStart = styles.lastIndexOf("/* MIS-378 correction");
    const layer = styles.slice(
      correctionStart,
      styles.indexOf("/* MIS-378 source-art baseline", correctionStart),
    );

    assert.ok(method.indexOf("method-story__opening") < method.indexOf("method-story__community"));
    assert.ok(method.indexOf("method-story__community") < method.indexOf("method-story__bridge"));
    assert.ok(method.indexOf("method-story__bridge") < method.indexOf("method-story__conclusion"));
    assert.doesNotMatch(method, /method-section|method-editorial/);
    assert.match(layer, /#metodo\.method-story-section\s*\{[\s\S]*display: block/);
    assert.match(layer, /method-story-frame\s*\{[\s\S]*width: min\(1180px, calc\(100% - 32px\)\)/);
    assert.match(layer, /method-story__bridge\s*\{[\s\S]*grid-template-columns: minmax\(0, 1fr\) minmax\(300px, \.78fr\)/);
    assert.match(layer, /@media \(max-width: 900px\)[\s\S]*method-story__bridge,[\s\S]*method-story__conclusion\s*\{[\s\S]*grid-template-columns: minmax\(0, 1fr\)/);
    assert.match(layer, /method-story__media figcaption\s*\{[\s\S]*text-transform: none/);
  });
});
