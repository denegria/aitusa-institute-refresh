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

describe("homepage Prueba real gallery", () => {
  it("uses the four approved staging videos and their real durations", async () => {
    const { testimonials } = await loadSiteData();

    assert.equal(testimonials.length, 4);
    assert.deepEqual(
      Array.from(testimonials, (item) => item.duration),
      ["0:46", "0:42", "2:52", "1:06"],
    );

    for (const item of testimonials) {
      assert.match(item.video, /^\.\/public\/assets\/wix\/videos\/.+\.mp4$/);
      assert.match(item.videoPoster, /^\.\/public\/assets\/wix\/videos\/posters\/.+\.jpg$/);
    }
  });

  it("renders one accessible selected-video experience", async () => {
    const source = await readFile("src/main.js", "utf8");
    const proofSection = source.slice(
      source.indexOf("function renderProofSection"),
      source.indexOf("function renderFinalCtaSection"),
    );

    assert.match(proofSection, /data-proof-gallery/);
    assert.match(proofSection, /role="tablist"/);
    assert.match(proofSection, /role="tab"/);
    assert.match(proofSection, /role="tabpanel"/);
    assert.doesNotMatch(proofSection, /autoplay/);
    assert.doesNotMatch(proofSection, /muted/);
  });

  it("supports pointer and keyboard selection without autoplay", async () => {
    const source = await readFile("src/main.js", "utf8");

    assert.match(source, /function initProofGallery/);
    assert.match(source, /ArrowLeft/);
    assert.match(source, /ArrowRight/);
    assert.match(source, /video\?\.pause\(\)/);
    assert.doesNotMatch(source, /video\.play\(\)/);
  });

  it("preserves full video frames and responsive selector layouts", async () => {
    const styles = await readFile("src/styles.css", "utf8");

    assert.match(styles, /\.proof-editorial__panel video\s*\{[\s\S]*object-fit: contain/);
    assert.match(styles, /\.proof-editorial__tabs\s*\{[\s\S]*grid-template-columns: repeat\(4/);
    assert.match(styles, /@media \(max-width: 640px\)[\s\S]*\.proof-editorial__tabs\s*\{[\s\S]*grid-template-columns: repeat\(2/);
    assert.match(styles, /--proof-gold: #c4932d/);
    assert.match(styles, /--proof-navy: #001a3d/);
  });
});
