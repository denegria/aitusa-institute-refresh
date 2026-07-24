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

describe("homepage Method showcase", () => {
  it("keeps the three paths connected to real AIT videos", async () => {
    const { solutionCharacteristics } = await loadSiteData();

    assert.deepEqual(
      Array.from(solutionCharacteristics, (item) => item.tabLabel),
      ["Comprensión visual", "Práctica guiada", "Apoyo constante"],
    );
    for (const item of solutionCharacteristics) {
      assert.match(item.video, /^\.\/public\/assets\/wix\/videos\/.+\.mp4$/);
    }
    assert.equal(
      solutionCharacteristics[0].videoPoster,
      "./public/assets/method/method-real-studio-poster.png",
    );
  });

  it("renders an accessible tab interface instead of carousel controls", async () => {
    const source = await readFile("src/main.js", "utf8");

    assert.match(source, /role="tablist"/);
    assert.match(source, /role="tab"/);
    assert.match(source, /role="tabpanel"/);
    assert.doesNotMatch(source, /class="method-panel__video"[\s\S]*autoplay/);
    assert.doesNotMatch(source, /class="method-panel__video"[\s\S]*muted/);
    assert.doesNotMatch(source, /video\.play\(\)/);
    assert.match(source, /ArrowLeft/);
    assert.match(source, /ArrowRight/);
    assert.doesNotMatch(source, /data-solution-prev/);
    assert.doesNotMatch(source, /data-solution-next/);
  });

  it("uses one scoped gradient blend without the rejected transition artwork", async () => {
    const source = await readFile("src/main.js", "utf8");
    const styles = await readFile("src/styles.css", "utf8");

    assert.doesNotMatch(source, /method-panel__transition-art/);
    assert.doesNotMatch(source, /method-panel__diffusion/);
    assert.match(styles, /\.method-panel::after\s*\{/);
    assert.match(styles, /transparent 56%/);
    assert.match(styles, /\.method-panel__video\s*\{[\s\S]*object-fit: contain/);
  });

  it("adds restrained media polish without changing the staging surfaces", async () => {
    const source = await readFile("src/main.js", "utf8");
    const styles = await readFile("src/styles.css", "utf8");

    assert.match(source, /Video real · Método AIT USA/);
    assert.match(styles, /\.method-panel__media::after\s*\{[\s\S]*border: 1px solid rgba\(196, 147, 45, 0\.58\)/);
    assert.match(styles, /\.method-tab\s*\{[\s\S]*background: var\(--method-navy\)/);
    assert.match(styles, /\.method-tab\.is-active\s*\{[\s\S]*background: var\(--method-navy\)/);
  });
});
