import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import { courseCatalog, programs } from "../src/content.js";

describe("course catalog editorial component", () => {
  it("features the three English routes and uses each program's Spanish CTA", async () => {
    const source = await readFile("app/_components/site/CourseSections.jsx", "utf8");
    const englishGroup = courseCatalog.find((group) => group.key === "english-paths");
    const englishPrograms = englishGroup.programs.map((slug) => programs.find((program) => program.slug === slug));

    assert.match(source, /const primaryGroupKey = "english-paths"/);
    assert.match(source, /useState\(primaryGroupKey\)/);
    assert.match(source, /primaryPrograms\.map/);
    assert.match(source, /\{program\.cta\}/);
    assert.deepEqual(englishPrograms.map((program) => program.title), [
      "Inglés presencial",
      "Inglés híbrido",
      "Inglés online",
    ]);
    assert.ok(programs.every((program) => program.cta && !/learn more/i.test(program.cta)));
  });

  it("keeps the tablist roving keyboard contract and uses optimized card images", async () => {
    const source = await readFile("app/_components/site/CourseSections.jsx", "utf8");
    const styles = await readFile("src/styles.css", "utf8");

    assert.match(source, /import Image from "next\/image"/);
    assert.match(source, /width=\{1200\}/);
    assert.match(source, /height=\{900\}/);
    assert.match(source, /sizes="\(max-width: 719px\)/);
    assert.match(source, /role="tablist"/);
    assert.match(source, /role="tab"/);
    assert.match(source, /tabIndex=\{activeTab === .* \? 0 : -1\}/);
    assert.match(source, /ArrowRight/);
    assert.match(source, /requestAnimationFrame/);
    assert.match(styles, /\.course-catalog \.catalog-tabs\s*\{[\s\S]*flex-wrap: wrap;[\s\S]*overflow-x: visible;/);
    assert.match(styles, /@media \(max-width: 719px\)[\s\S]*\.course-catalog \.catalog-tabs\s*\{[\s\S]*flex-wrap: nowrap;[\s\S]*overflow-x: auto;/);
    assert.match(styles, /\.course-catalog \.catalog-tabs button\s*\{[\s\S]*min-height: 44px;/);
  });
});
