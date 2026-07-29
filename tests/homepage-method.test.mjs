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
      "Durante más de 20 años hemos escuchado las necesidades y frustraciones de nuestra comunidad. Así nació Graphic Concept: una forma diferente de aprender, creada para ayudarte a comprender y hablar inglés sin memorizar listas interminables.",
    );
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
    assert.match(method, /data-lucide=/);
    assert.match(method, /aria-hidden="true"/);
    assert.doesNotMatch(method, /method-reason__number/);
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
    assert.match(source, /method-video-frame/);
    assert.match(
      styles,
      /\.method-editorial\s*\{[\s\S]*grid-template-areas:[\s\S]*"intro media"[\s\S]*"reasons media"/,
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
      /@media \(max-width: 719px\)[\s\S]*grid-template-areas:[\s\S]*"intro"[\s\S]*"media"[\s\S]*"reasons"/,
    );
    assert.match(
      styles,
      /@media \(min-width: 1600px\) and \(min-height: 820px\)[\s\S]*\.method-editorial\s*\{[\s\S]*grid-template-columns: minmax\(0, 1\.52fr\) minmax\(400px, 0\.68fr\)/,
    );
    assert.match(
      styles,
      /@media \(min-width: 1600px\) and \(min-height: 820px\)[\s\S]*\.method-reasons\s*\{[\s\S]*grid-template-columns: minmax\(0, 1fr\);[\s\S]*align-self: stretch/,
    );
    assert.match(
      styles,
      /@media \(min-width: 1181px\) and \(max-width: 1599px\) and \(min-height: 768px\)[\s\S]*\.method-reasons\s*\{[\s\S]*grid-template-rows: repeat\(3, minmax\(0, 1fr\)\);[\s\S]*align-self: stretch/,
    );
    assert.match(
      styles,
      /@media \(min-width: 1600px\) and \(min-height: 820px\)[\s\S]*\.method-reasons li > div\s*\{[\s\S]*display: block;[\s\S]*max-width: 720px/,
    );
    assert.match(
      styles,
      /@media \(min-width: 1600px\) and \(min-height: 820px\)[\s\S]*\.method-editorial\s*\{[\s\S]*height: calc\(100% - clamp\(32px, 6svh, 64px\)\);[\s\S]*min-height: min\(790px, 100%\)/,
    );
    assert.match(
      styles,
      /@media \(min-width: 1600px\) and \(min-height: 820px\)[\s\S]*\.method-editorial__media\s*\{[\s\S]*clamp\(360px, calc\(\(100svh - 190px\) \* 0\.5577\), 430px\)/,
    );
    assert.match(
      styles,
      /@media \(min-width: 1600px\) and \(min-height: 820px\)[\s\S]*\.method-editorial__intro > p:last-child\s*\{[\s\S]*font-size: 1\.06rem;[\s\S]*font-weight: 500;[\s\S]*\.method-reasons p\s*\{[\s\S]*font-size: 1\.05rem;[\s\S]*font-weight: 500;/,
    );
    assert.match(
      styles,
      /@media \(min-width: 2200px\) and \(min-height: 1200px\)[\s\S]*\.method-section\s*\{[\s\S]*height: min\(1120px, calc\(100svh - 94px\)\)[\s\S]*\.method-editorial\s*\{[\s\S]*grid-template-rows: auto auto;[\s\S]*align-content: center/,
    );
  });

  it("keeps the mobile summary legible and the safe-area header fill intact", async () => {
    const styles = await readFile("src/styles.css", "utf8");

    assert.match(
      styles,
      /@media \(max-width: 719px\)[\s\S]*\.method-reasons h3\s*\{[\s\S]*font-size: 0\.83rem/,
    );
    assert.match(
      styles,
      /\.site-header::before\s*\{[\s\S]*bottom: 100%;[\s\S]*height: max\(96px, env\(safe-area-inset-top\)\);[\s\S]*background: #ffffff/,
    );
  });
});
