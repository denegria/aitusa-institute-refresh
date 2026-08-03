import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import nextConfig from "../next.config.mjs";
import { programs } from "../src/content.js";

const exists = async (path) => access(path).then(() => true, () => false);

describe("public-route React migration parity", () => {
  it("publishes SEO discovery files for every public route", async () => {
    const robots = await readFile("public/robots.txt", "utf8");
    const sitemap = await readFile("public/sitemap.xml", "utf8");
    const manifest = await readFile("public/site.webmanifest", "utf8");

    assert.match(robots, /User-agent: \*/);
    assert.match(robots, /Allow: \//);
    assert.match(robots, /Sitemap: https:\/\/www\.aitusainstitute\.com\/sitemap\.xml/);
    assert.match(sitemap, /<loc>https:\/\/www\.aitusainstitute\.com\/<\/loc>/);
    assert.match(sitemap, /<loc>https:\/\/www\.aitusainstitute\.com\/cursos\/<\/loc>/);
    assert.match(sitemap, /<loc>https:\/\/www\.aitusainstitute\.com\/placement-test\/<\/loc>/);
    assert.match(sitemap, /<loc>https:\/\/www\.aitusainstitute\.com\/contactanos<\/loc>/);
    assert.match(sitemap, /<loc>https:\/\/www\.aitusainstitute\.com\/privacy-policy<\/loc>/);
    assert.match(sitemap, /<loc>https:\/\/www\.aitusainstitute\.com\/terms-and-conditions<\/loc>/);
    assert.doesNotMatch(sitemap, /\/portal\/|\/api\//);
    for (const program of programs) {
      assert.match(sitemap, new RegExp(`<loc>https://www\\.aitusainstitute\\.com/cursos/${program.slug}/</loc>`));
    }
    assert.doesNotMatch(sitemap, /\/courses\//);
    assert.match(manifest, /AiT USA Institute/);
  });

  it("uses native App Router pages instead of legacy public-route rewrites", async () => {
    const rewrites = await nextConfig.rewrites();
    assert.deepEqual(rewrites.beforeFiles, [{ source: "/public/:path*", destination: "/:path*" }]);

    assert.equal(await exists("app/(public-site)/page.jsx"), true);
    assert.equal(await exists("app/(public-site)/courses/page.jsx"), true);
    assert.equal(await exists("app/(public-site)/courses/[slug]/page.jsx"), true);
    assert.equal(await exists("app/(public-site)/cursos/page.jsx"), true);
    assert.equal(await exists("app/(public-site)/cursos/[slug]/page.jsx"), true);
    assert.equal(await exists("app/(public-site)/placement-test/page.jsx"), true);
    assert.equal(await exists("app/(public-site)/contactanos/page.jsx"), true);
    assert.equal(await exists("app/(public-site)/privacy-policy/page.jsx"), true);
    assert.equal(await exists("app/(public-site)/terms-and-conditions/page.jsx"), true);
    assert.equal(await exists("app/contactanos/page.jsx"), false);
    assert.equal(await exists("app/privacy-policy/page.jsx"), false);
    assert.equal(await exists("app/terms-and-conditions/page.jsx"), false);
    assert.equal(await exists("app/_components/PublicChrome.jsx"), false);
  });

  it("keeps the production build independent of the deleted legacy generator", async () => {
    const packageJson = JSON.parse(await readFile("package.json", "utf8"));
    assert.equal(packageJson.scripts.build, "next build");
    assert.equal(packageJson.scripts.dev, "next dev");
    assert.equal(packageJson.scripts.start, "next start");
    assert.equal("prepare:legacy" in packageJson.scripts, false);
    assert.equal("build:static" in packageJson.scripts, false);
    assert.equal(await exists("index.html"), false);
    assert.equal(await exists("src/main.js"), false);
    assert.equal(await exists("scripts/prepare-next-legacy.mjs"), false);
    assert.equal(await exists("scripts/legacy-route-html.mjs"), false);
    assert.equal(await exists("scripts/build-static.mjs"), false);
  });
});
