import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import { programs } from "../src/content.js";

describe("MIS-264 native React course routes", () => {
  it("defines catalog metadata and a native App Router page", async () => {
    const source = await readFile("app/(public-site)/courses/page.jsx", "utf8");
    assert.match(source, /Cursos AiT USA Institute \| Catálogo detallado/);
    assert.match(source, /canonical: "\/courses\/"/);
    assert.match(source, /Explora el catálogo detallado de inglés, GED, computación/);
    assert.match(source, /<CoursesPage/);
  });

  it("statically generates every course with route-specific metadata and schema", async () => {
    const route = await readFile("app/(public-site)/courses/[slug]/page.jsx", "utf8");
    const shell = await readFile("app/_components/site/CoursesPage.jsx", "utf8");

    assert.match(route, /generateStaticParams/);
    assert.match(route, /programs\.map/);
    assert.match(route, /generateMetadata/);
    assert.match(route, /"@type": "Course"/);
    assert.match(route, /dangerouslySetInnerHTML/);
    assert.match(shell, /`\$\{program\.title\} \| Cursos AiT USA Institute`/);
    assert.match(shell, /canonical: `\/courses\/\$\{program\.slug\}\/`/);
    assert.equal(programs.length, 9);
  });

  it("keeps Spanish aliases canonical by redirecting to the English route family", async () => {
    const alias = await readFile("app/(public-site)/cursos/[slug]/page.jsx", "utf8");
    assert.match(alias, /permanentRedirect/);
    assert.match(alias, /`\/courses\/\$\{slug\}\/`/);
  });
});
