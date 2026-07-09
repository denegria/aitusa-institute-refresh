import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { promisify } from "node:util";
import { describe, it } from "node:test";

const execFileAsync = promisify(execFile);

describe("MIS-264 course route metadata generation", () => {
  it("generates course catalog and detail HTML with route-specific SEO metadata", async () => {
    await execFileAsync("node", ["scripts/prepare-next-legacy.mjs"]);

    const coursesHtml = await readFile("public/legacy/courses/index.html", "utf8");
    assert.match(coursesHtml, /<title>Cursos AiT USA Institute \| Catálogo detallado<\/title>/);
    assert.match(coursesHtml, /<link rel="canonical" href="https:\/\/www\.aitusainstitute\.com\/courses\/" \/>/);
    assert.match(coursesHtml, /Explora el catálogo detallado de inglés, GED, computación/);

    const detailHtml = await readFile(
      "public/legacy/courses/ingles-jovenes-adultos/index.html",
      "utf8",
    );
    assert.match(
      detailHtml,
      /<title>Inglés para jóvenes y adultos \| Cursos AiT USA Institute<\/title>/,
    );
    assert.match(
      detailHtml,
      /<link rel="canonical" href="https:\/\/www\.aitusainstitute\.com\/courses\/ingles-jovenes-adultos\/" \/>/,
    );
    assert.match(detailHtml, /"@type": "Course"/);
    assert.match(detailHtml, /"name": "Inglés para jóvenes y adultos"/);

    const spanishAliasHtml = await readFile(
      "public/legacy/cursos/ingles-jovenes-adultos/index.html",
      "utf8",
    );
    assert.match(
      spanishAliasHtml,
      /<link rel="canonical" href="https:\/\/www\.aitusainstitute\.com\/courses\/ingles-jovenes-adultos\/" \/>/,
    );
  });
});
