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
      ["Comprensión visual", "Práctica guiada", "Ruta semanal"],
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
  });
});
