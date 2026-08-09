import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import { siteData } from "../src/content.js";

async function loadSiteData() {
  return siteData;
}

describe("homepage Method story", () => {
  it("uses the complete 1:45 explanation and keeps all three reasons visible", async () => {
    const { methodNarrative, solutionCharacteristics } = await loadSiteData();

    assert.equal(
      methodNarrative.video,
      "/assets/wix/videos/intro-video-great.mp4",
    );
    assert.equal(
      methodNarrative.videoPoster,
      "/assets/wix/videos/posters/intro-video-great.jpg",
    );
    assert.equal(methodNarrative.videoLabel, "Conoce el método completo · 1:45");
    assert.equal(
      methodNarrative.introduction,
      "Creado para adultos con poco tiempo que quieren comprender, hablar y avanzar sin memorizar listas interminables.",
    );
    assert.equal(
      methodNarrative.promise,
      "En AIT USA Institute convertimos el inglés en un aprendizaje visual, práctico y humano.",
    );
    assert.deepEqual(methodNarrative.painPoints, [
      "¿Puedo aprender inglés si empiezo desde cero?",
      "¿Tendré tiempo para estudiar y cumplir mis metas?",
      "¿Este conocimiento realmente me ayudará a trabajar en lo que me apasiona?",
    ]);
    assert.deepEqual(
      Array.from(solutionCharacteristics, (item) => item.title),
      [
        "Comprende sin traducir",
        "Habla sin memorizar",
        "Avanza a tu ritmo",
      ],
    );
    assert.deepEqual(
      Array.from(solutionCharacteristics, (item) => item.body),
      [
        "Entrena tu comprensión para entender inglés directamente, sin traducir palabra por palabra.",
        "Practica estructuras útiles para hablar desde la primera clase, sin listas interminables.",
        "Graphic Concept se adapta a tu nivel: un método propio, patentado y probado para hablar con más facilidad.",
      ],
    );
    assert.deepEqual(
      Array.from(solutionCharacteristics, (item) => item.icon),
      ["ear", "message-circle", "route"],
    );
  });

  it("renders one accessible video with an adjacent written summary", async () => {
    const interactiveSource = await readFile("app/_components/site/InteractiveSections.jsx", "utf8");
    const source = interactiveSource.slice(
      interactiveSource.indexOf("export function MethodVideo"),
      interactiveSource.indexOf("export function ProofStories"),
    );
    const sections = await readFile("app/_components/site/PublicSections.jsx", "utf8");
    const method = `${source}\n${sections}`;
    const videoMarkup = method.slice(method.indexOf("<video"), method.indexOf("</video>"));

    assert.equal((method.match(/<video/g) || []).length, 1);
    assert.match(method, /className="method-editorial__video"/);
    assert.match(method, /className="method-reasons"/);
    assert.match(method, /aria-label="Resumen del método en tres razones"/);
    assert.match(method, /<ul className="method-reasons"/);
    assert.match(method, /className="method-reason__icon"/);
    assert.match(method, /className="method-reason__number"/);
    assert.match(method, /data-lucide=/);
    assert.match(method, /aria-hidden="true"/);
    assert.doesNotMatch(method, /<ol class="method-reasons"/);
    assert.match(method, /narrative\.video/);
    assert.doesNotMatch(method, /role="tablist"/);
    assert.doesNotMatch(method, /role="tab"/);
    assert.doesNotMatch(method, /role="tabpanel"/);
    assert.doesNotMatch(method, /autoplay/);
    assert.doesNotMatch(method, /muted/);
    assert.doesNotMatch(videoMarkup, /playsinline/);
    assert.doesNotMatch(source, /initMethodTabs/);
    assert.doesNotMatch(source, /video\.play\(\)/);
    assert.match(source, /function MethodVideo/);
    assert.match(source, /video\.webkitEnterFullscreen\(\)/);
    assert.match(source, /video\.requestFullscreen/);
    assert.match(source, /onPlay=\{enterMobileFullscreen\}/);
  });

  it("does not render the former short duplicate or third characteristic video", async () => {
    const method = [
      await readFile("app/_components/site/InteractiveSections.jsx", "utf8"),
      await readFile("app/_components/site/PublicSections.jsx", "utf8"),
    ].join("\n");

    assert.doesNotMatch(method, /differenceVideo|what-makes-us-different/);
    assert.doesNotMatch(method, /thirdCharacteristicVideo|third-characteristic/);
    assert.equal((method.match(/narrative\.video\}/g) || []).length, 1);
  });

  it("preserves the approved editorial hierarchy without decorative tab chrome", async () => {
    const source = [
      await readFile("app/_components/site/PublicSections.jsx", "utf8"),
      await readFile("app/_components/site/InteractiveSections.jsx", "utf8"),
    ].join("\n");
    const styles = await readFile("src/styles.css", "utf8");

    assert.match(source, /Método Graphic Concept/);
    assert.match(source, /method-editorial__intro/);
    assert.match(source, /method-editorial__pain/);
    assert.match(source, /method-editorial__bridge/);
    assert.match(source, /method-editorial__principles/);
    assert.match(source, /method-editorial__closing/);
    assert.match(source, /graphic-concept-compass-source\.png/);
    assert.match(source, /graphic-concept-pain-1\.png/);
    assert.match(source, /graphic-concept-principle-1\.png/);
    assert.match(source, /method-question__slash/);
    assert.match(source, /Tres preguntas<\/span><span>que muchos<\/span><span>se hacen/);
    assert.match(source, /graphic-concept-path\.webp/);
    assert.match(source, /method-video-frame/);
    assert.match(
      styles,
      /Graphic Concept reference pass:[\s\S]*\.home-page #metodo \.method-editorial\s*\{[\s\S]*display: flex;[\s\S]*flex-direction: column/,
    );
    assert.match(
      styles,
      /\.method-video-frame\s*\{[\s\S]*padding: clamp\(8px, 0\.8vw, 12px\);[\s\S]*background: var\(--method-navy\)/,
    );
    assert.match(
      styles,
      /\.method-editorial__video\s*\{[\s\S]*height: auto;[\s\S]*aspect-ratio: 464 \/ 832;[\s\S]*object-fit: contain/,
    );
    assert.match(
      styles,
      /Graphic Concept reference pass:[\s\S]*\.method-editorial__opening[\s\S]*grid-template-columns: minmax\(0, 1\.13fr\) minmax\(340px, 0\.87fr\)/,
    );
    assert.match(
      styles,
      /Graphic Concept reference pass:[\s\S]*\.method-editorial__questions li\s*\{[\s\S]*grid-template-columns: 62px 14px minmax\(0, 1fr\)/,
    );
    assert.match(
      styles,
      /Graphic Concept reference pass:[\s\S]*\.method-editorial__bridge\s*\{[\s\S]*grid-template-columns: minmax\(0, 1\.05fr\) minmax\(220px, 0\.66fr\) minmax\(280px, 0\.86fr\)/,
    );
    assert.match(
      styles,
      /Graphic Concept reference pass:[\s\S]*\.method-editorial__principles \.method-reasons\s*\{[\s\S]*grid-template-columns: repeat\(3, minmax\(0, 1fr\)\);[\s\S]*grid-template-rows: auto/,
    );
    assert.match(
      styles,
      /Graphic Concept reference pass:[\s\S]*\.method-editorial__closing\s*\{[\s\S]*grid-template-columns: minmax\(0, 1fr\) minmax\(330px, 0\.72fr\)/,
    );
    assert.match(
      styles,
      /@media \(max-width: 1040px\)[\s\S]*\.home-page #metodo \.method-editorial__pain\s*\{[\s\S]*grid-template-columns: minmax\(0, 1fr\)/,
    );
    assert.match(
      styles,
      /@media \(max-width: 719px\)[\s\S]*\.home-page #metodo \.method-editorial__opening\s*\{[\s\S]*grid-template-columns: minmax\(0, 1fr\)/,
    );
    assert.match(
      styles,
      /@media \(max-width: 719px\)[\s\S]*\.home-page #metodo \.method-editorial__principles \.method-reasons\s*\{[\s\S]*grid-template-columns: minmax\(0, 1fr\)/,
    );
    assert.match(styles, /Graphic Concept reference pass:[\s\S]*mix-blend-mode: multiply/);
    assert.match(
      styles,
      /MIS-378 Sentry correction:[\s\S]*\.method-editorial__questions li\s*\{[\s\S]*min-height: clamp\(64px, 5vw, 82px\)/,
    );
    assert.match(
      styles,
      /MIS-378 Sentry correction:[\s\S]*@media \(max-width: 719px\)[\s\S]*\.method-editorial__principles \.method-reasons\s*\{[\s\S]*grid-template-columns: minmax\(0, 1fr\)/,
    );
  });

  it("keeps the mobile summary legible and the safe-area header fill intact", async () => {
    const styles = await readFile("src/styles.css", "utf8");

    assert.match(
      styles,
      /@media \(max-width: 719px\)[\s\S]*\.home-page #metodo \.method-editorial__closing\s*\{[\s\S]*grid-template-columns: minmax\(0, 1fr\);[\s\S]*gap: 38px/,
    );
    assert.match(
      styles,
      /\.site-header::before\s*\{[\s\S]*bottom: 100%;[\s\S]*height: max\(96px, env\(safe-area-inset-top\)\);[\s\S]*background: #ffffff/,
    );
  });
});
