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
  it("keeps the three approved paths connected to real AiT video assets", async () => {
    const { solutionCharacteristics } = await loadSiteData();

    assert.deepEqual(
      Array.from(solutionCharacteristics, (item) => item.tabLabel),
      ["Comprensión visual", "Práctica guiada", "Ruta semanal"],
    );
    for (const [index, item] of solutionCharacteristics.entries()) {
      assert.match(item.video, /^\.\/public\/assets\/wix\/videos\/.+\.mp4$/);
      if (index === 0) {
        assert.equal(item.videoPoster, "./public/assets/method/method-real-studio-poster.png");
      } else {
        assert.match(item.videoPoster, /^\.\/public\/assets\/wix\/videos\/.+\.jpg$/);
      }
    }
  });

  it("renders an accessible tab interface instead of carousel controls", async () => {
    const source = await readFile("src/main.js", "utf8");

    assert.match(source, /role="tablist"/);
    assert.match(source, /role="tab"/);
    assert.match(source, /role="tabpanel"/);
    assert.match(source, /aria-selected=/);
    assert.match(source, /ArrowLeft/);
    assert.match(source, /ArrowRight/);
    assert.doesNotMatch(source, /data-solution-prev/);
    assert.doesNotMatch(source, /data-solution-next/);
  });
});
