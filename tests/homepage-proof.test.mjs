import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import { siteData } from "../src/content.js";

async function loadSiteData() {
  return siteData;
}

describe("homepage Prueba real gallery", () => {
  it("keeps the published staging videos and their real durations", async () => {
    const { testimonials } = await loadSiteData();

    assert.ok(testimonials.length >= 3);
    assert.equal(testimonials.find((item) => item.name === "Testimonio internacional")?.duration, "0:46");
    assert.equal(testimonials.find((item) => item.name === "Eric")?.duration, "0:42");
    assert.equal(testimonials.find((item) => item.name === "Jessica")?.duration, "2:52");

    for (const item of testimonials) {
      assert.match(item.video, /^\/assets\/wix\/videos\/.+\.mp4$/);
      assert.match(item.videoPoster, /^\/assets\/wix\/videos\/posters\/.+\.jpg$/);
    }
  });

  it("renders a scalable story shelf with a no-JS video fallback", async () => {
    const proofSection = await readFile("app/_components/site/InteractiveSections.jsx", "utf8");

    assert.match(proofSection, /function ProofStories/);
    assert.match(proofSection, /className="proof-shelf__rail"/);
    assert.match(proofSection, /role="list"/);
    assert.match(proofSection, /role="listitem"/);
    assert.match(proofSection, /aria-haspopup="dialog"/);
    assert.match(proofSection, /href=\{item\.video\}/);
    assert.match(proofSection, /<dialog/);
    assert.match(proofSection, /<video/);
    assert.match(proofSection, /ordered\.length === 3/);
    assert.match(proofSection, /proof-editorial--complete-row/);
    assert.doesNotMatch(proofSection, /slice\(0,\s*3\)/);
    assert.doesNotMatch(proofSection, /Tres historias/);
    assert.doesNotMatch(proofSection, /autoplay/);
    assert.doesNotMatch(proofSection, /muted/);
  });

  it("supports rail and dialog navigation without autoplay", async () => {
    const source = await readFile("app/_components/site/InteractiveSections.jsx", "utf8");

    assert.match(source, /function ProofStories/);
    assert.match(source, /rail\.scrollBy/);
    assert.match(source, /dialog\.showModal\(\)/);
    assert.match(source, /video\?\.pause\(\)/);
    assert.match(source, /triggerRef\.current\?\.focus\(\)/);
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
