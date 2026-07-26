import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import { describe, it } from "node:test";

async function loadSiteData() {
  const source = await readFile("src/content.js", "utf8");
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(source, context, { filename: "src/content.js" });
  return context.window.AITUSA_DATA;
}

describe("homepage Method story", () => {
  it("uses the complete 1:45 explanation and keeps all three reasons visible", async () => {
    const { methodNarrative, solutionCharacteristics } = await loadSiteData();

    assert.equal(
      methodNarrative.video,
      "./public/assets/wix/videos/intro-video-great.mp4",
    );
    assert.equal(
      methodNarrative.videoPoster,
      "./public/assets/wix/videos/posters/intro-video-great.jpg",
    );
    assert.equal(methodNarrative.videoLabel, "Conoce el método completo · 1:45");
    assert.deepEqual(
      Array.from(solutionCharacteristics, (item) => item.title),
      [
        "Comprende sin traducir",
        "Habla sin memorizar miles de palabras",
        "Un método propio, patentado y probado",
      ],
    );
  });

  it("renders one accessible video with an adjacent written summary", async () => {
    const source = await readFile("src/main.js", "utf8");
    const method = source.slice(
      source.indexOf("function renderSolutionSection"),
      source.indexOf("function renderOfferingPathSection"),
    );

    assert.equal((method.match(/<video/g) || []).length, 1);
    assert.match(method, /class="method-editorial__video"/);
    assert.match(method, /class="method-reasons"/);
    assert.match(method, /aria-label="Resumen del método en tres razones"/);
    assert.match(method, /methodNarrative\.video/);
    assert.doesNotMatch(method, /role="tablist"/);
    assert.doesNotMatch(method, /role="tab"/);
    assert.doesNotMatch(method, /role="tabpanel"/);
    assert.doesNotMatch(method, /autoplay/);
    assert.doesNotMatch(method, /muted/);
    assert.doesNotMatch(source, /function initMethodTabs/);
    assert.doesNotMatch(source, /video\.play\(\)/);
  });

  it("does not render the former short duplicate or third characteristic video", async () => {
    const source = await readFile("src/main.js", "utf8");
    const method = source.slice(
      source.indexOf("function renderSolutionSection"),
      source.indexOf("function renderOfferingPathSection"),
    );

    assert.doesNotMatch(method, /differenceVideo|what-makes-us-different/);
    assert.doesNotMatch(method, /thirdCharacteristicVideo|third-characteristic/);
    assert.equal((method.match(/asset\(methodNarrative\.video\)/g) || []).length, 1);
  });

  it("preserves the approved editorial hierarchy without decorative tab chrome", async () => {
    const source = await readFile("src/main.js", "utf8");
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
      /\.method-video-frame\s*\{[\s\S]*aspect-ratio: 464 \/ 832;[\s\S]*background: var\(--method-navy\)/,
    );
    assert.match(
      styles,
      /\.method-editorial__video\s*\{[\s\S]*object-fit: contain/,
    );
    assert.match(
      styles,
      /@media \(max-width: 719px\)[\s\S]*grid-template-areas:[\s\S]*"intro"[\s\S]*"media"[\s\S]*"reasons"/,
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
