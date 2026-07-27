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
  it("keeps the published staging videos and their real durations", async () => {
    const { testimonials } = await loadSiteData();

    assert.ok(testimonials.length >= 3);
    assert.equal(testimonials.find((item) => item.name === "Testimonio internacional")?.duration, "0:46");
    assert.equal(testimonials.find((item) => item.name === "Eric")?.duration, "0:42");
    assert.equal(testimonials.find((item) => item.name === "Jessica")?.duration, "2:52");

    for (const item of testimonials) {
      assert.match(item.video, /^\.\/public\/assets\/wix\/videos\/.+\.mp4$/);
      assert.match(item.videoPoster, /^\.\/public\/assets\/wix\/videos\/posters\/.+\.jpg$/);
    }
  });

  it("renders a scalable story shelf with a no-JS video fallback", async () => {
    const source = await readFile("src/main.js", "utf8");
    const proofSection = source.slice(
      source.indexOf("function renderProofSection"),
      source.indexOf("function renderFinalCtaSection"),
    );

    assert.match(proofSection, /data-proof-shelf/);
    assert.match(proofSection, /data-proof-rail/);
    assert.match(proofSection, /role="list"/);
    assert.match(proofSection, /role="listitem"/);
    assert.match(proofSection, /aria-haspopup="dialog"/);
    assert.match(proofSection, /href="\$\{asset\(item\.video\)\}"/);
    assert.match(proofSection, /<dialog/);
    assert.match(proofSection, /data-proof-dialog-video/);
    assert.match(proofSection, /const fillsDesktopRow = orderedTestimonials\.length === 3/);
    assert.match(proofSection, /proof-editorial--complete-row/);
    assert.doesNotMatch(proofSection, /slice\(0,\s*3\)/);
    assert.doesNotMatch(proofSection, /Tres historias/);
    assert.doesNotMatch(proofSection, /autoplay/);
    assert.doesNotMatch(proofSection, /muted/);
  });

  it("supports rail and dialog navigation without autoplay", async () => {
    const source = await readFile("src/main.js", "utf8");

    assert.match(source, /function initProofShelf/);
    assert.match(source, /scrollBy\(\{ left: distance \* direction, behavior: "smooth" \}\)/);
    assert.match(source, /dialog\.showModal\(\)/);
    assert.match(source, /dialogVideo\.pause\(\)/);
    assert.match(source, /dialogVideo\.load\(\)/);
    assert.match(source, /lastTrigger\?\.focus\(\)/);
    assert.doesNotMatch(source, /video\.play\(\)/);
  });

  it("preserves native video frames and responsive shelf layouts", async () => {
    const styles = await readFile("src/styles.css", "utf8");

    assert.match(styles, /\.proof-shelf__rail\s*\{[\s\S]*grid-auto-flow: column/);
    assert.match(styles, /\.proof-shelf__rail\s*\{[\s\S]*scroll-snap-type: x mandatory/);
    assert.match(styles, /\.proof-dialog__media video\s*\{[\s\S]*object-fit: contain/);
    assert.match(styles, /@media \(max-width: 640px\)[\s\S]*\.proof-shelf__rail\s*\{[\s\S]*grid-auto-columns: min\(76vw, 290px\)/);
    assert.match(styles, /\.proof-shelf__controls button,[\s\S]*min-height: 44px/);
    assert.match(styles, /--proof-gold: #c4932d/);
    assert.match(styles, /--proof-navy: #001a3d/);
    assert.match(
      styles,
      /@media \(min-width: 1041px\)[\s\S]*\.home-page \.proof-editorial--complete-row \.proof-shelf__controls button\s*\{[\s\S]*display: none/,
    );
    assert.match(
      styles,
      /@media \(min-width: 1041px\)[\s\S]*\.home-page \.proof-editorial--complete-row \.proof-shelf__rail\s*\{[\s\S]*grid-template-columns: repeat\(3, minmax\(0, 1fr\)\);[\s\S]*overflow-x: visible/,
    );
    assert.match(
      styles,
      /\.home-page \.proof-editorial--complete-row \.proof-shelf__hint\s*\{[\s\S]*display: none/,
    );
  });
});
