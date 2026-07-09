import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import {
  buildCourseDetailHtml,
  buildCoursesIndexHtml,
  buildRobotsTxt,
  buildSitemapXml,
  loadLegacySiteData,
} from "./legacy-route-html.mjs";

const root = process.cwd();
const dist = path.join(root, "dist");

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

await cp(path.join(root, "index.html"), path.join(dist, "index.html"));
await cp(path.join(root, "src"), path.join(dist, "src"), { recursive: true });
await cp(path.join(root, "public"), path.join(dist, "public"), { recursive: true });
if (existsSync(path.join(root, "portal"))) {
  await cp(path.join(root, "portal"), path.join(dist, "portal"), { recursive: true });
}

const [template, siteData] = await Promise.all([
  readFile(path.join(root, "index.html"), "utf8"),
  loadLegacySiteData(root),
]);
const programs = siteData.programs || [];
for (const route of ["courses", "placement-test"]) {
  const routeDir = path.join(dist, route);
  await mkdir(routeDir, { recursive: true });
  const html =
    route === "courses"
      ? buildCoursesIndexHtml(template, siteData)
      : template;
  await writeFile(path.join(routeDir, "index.html"), html);
}

for (const program of programs) {
  if (!program.slug) continue;
  for (const prefix of ["cursos", "courses"]) {
    const courseDir = path.join(dist, prefix, program.slug);
    await mkdir(courseDir, { recursive: true });
    await writeFile(
      path.join(courseDir, "index.html"),
      buildCourseDetailHtml(template, siteData, program),
    );
  }
}

for (const file of ["robots.txt", "sitemap.xml", "site.webmanifest"]) {
  const source = path.join(root, file);
  if (existsSync(source)) {
    await cp(source, path.join(dist, file));
  }
}

await writeFile(path.join(dist, "robots.txt"), buildRobotsTxt(siteData));
await writeFile(path.join(dist, "sitemap.xml"), buildSitemapXml(siteData));
