import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { promisify } from "node:util";
import { describe, it } from "node:test";
import nextConfig from "../next.config.mjs";
import { loadLegacySiteData } from "../scripts/legacy-route-html.mjs";

const execFileAsync = promisify(execFile);

describe("MIS-300 migration route parity", () => {
  it("publishes SEO discovery files through the Next public output", async () => {
    await execFileAsync("node", ["scripts/prepare-next-legacy.mjs"]);

    const siteData = await loadLegacySiteData(process.cwd());
    const robots = await readFile("public/robots.txt", "utf8");
    const sitemap = await readFile("public/sitemap.xml", "utf8");
    const manifest = await readFile("public/site.webmanifest", "utf8");

    assert.match(robots, /User-agent: \*/);
    assert.match(robots, /Allow: \//);
    assert.match(robots, /Sitemap: https:\/\/www\.aitusainstitute\.com\/sitemap\.xml/);

    assert.match(sitemap, /<loc>https:\/\/www\.aitusainstitute\.com\/<\/loc>/);
    assert.match(sitemap, /<loc>https:\/\/www\.aitusainstitute\.com\/courses\/<\/loc>/);
    assert.match(sitemap, /<loc>https:\/\/www\.aitusainstitute\.com\/placement-test\/<\/loc>/);
    assert.doesNotMatch(sitemap, /\/portal\/|\/api\//);

    for (const program of siteData.programs) {
      assert.match(
        sitemap,
        new RegExp(`<loc>https://www\\.aitusainstitute\\.com/courses/${program.slug}/</loc>`),
      );
    }

    assert.match(manifest, /AiT USA Institute/);
  });

  it("keeps Next rewrites aligned with generated legacy routes", async () => {
    await execFileAsync("node", ["scripts/prepare-next-legacy.mjs"]);

    const rewrites = await nextConfig.rewrites();
    const sources = rewrites.beforeFiles.map((rewrite) => rewrite.source);

    assert.deepEqual(
      [
        "/",
        "/courses",
        "/courses/:path*",
        "/cursos/:path*",
        "/placement-test",
        "/public/:path*",
      ].every((source) => sources.includes(source)),
      true,
    );

    const catalogHtml = await readFile("public/legacy/courses/index.html", "utf8");
    assert.match(catalogHtml, /<link rel="canonical" href="https:\/\/www\.aitusainstitute\.com\/courses\/" \/>/);

    const siteData = await loadLegacySiteData(process.cwd());
    for (const program of siteData.programs) {
      const englishHtml = await readFile(`public/legacy/courses/${program.slug}/index.html`, "utf8");
      const spanishAliasHtml = await readFile(`public/legacy/cursos/${program.slug}/index.html`, "utf8");

      assert.match(englishHtml, new RegExp(`course-${program.slug}`));
      assert.match(
        spanishAliasHtml,
        new RegExp(`https://www\\.aitusainstitute\\.com/courses/${program.slug}/`),
      );
    }
  });

  it("keeps the static build discovery files aligned with generated content", async () => {
    await execFileAsync("node", ["scripts/build-static.mjs"]);

    const sitemap = await readFile("dist/sitemap.xml", "utf8");
    const robots = await readFile("dist/robots.txt", "utf8");

    assert.match(robots, /Sitemap: https:\/\/www\.aitusainstitute\.com\/sitemap\.xml/);
    assert.match(sitemap, /<loc>https:\/\/www\.aitusainstitute\.com\/placement-test\/<\/loc>/);
    assert.match(sitemap, /<loc>https:\/\/www\.aitusainstitute\.com\/courses\/computacion-oficina\/<\/loc>/);
  });
});
