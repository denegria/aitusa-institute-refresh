import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildCourseDetailHtml,
  buildCoursesIndexHtml,
  loadLegacySiteData,
} from "./legacy-route-html.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = path.join(root, "public");

await rm(path.join(publicRoot, "legacy"), { recursive: true, force: true });
await rm(path.join(publicRoot, "src"), { recursive: true, force: true });

await mkdir(path.join(publicRoot, "legacy"), { recursive: true });
await mkdir(path.join(publicRoot, "src"), { recursive: true });

await cp(path.join(root, "index.html"), path.join(publicRoot, "legacy", "index.html"));
await cp(path.join(root, "src", "content.js"), path.join(publicRoot, "src", "content.js"));
await cp(path.join(root, "src", "main.js"), path.join(publicRoot, "src", "main.js"));
await cp(path.join(root, "src", "styles.css"), path.join(publicRoot, "src", "styles.css"));

const [template, siteData] = await Promise.all([
  readFile(path.join(root, "index.html"), "utf8"),
  loadLegacySiteData(root),
]);
const programs = siteData.programs || [];

await mkdir(path.join(publicRoot, "legacy", "courses"), { recursive: true });
await writeFile(
  path.join(publicRoot, "legacy", "courses", "index.html"),
  buildCoursesIndexHtml(template, siteData),
);

for (const program of programs) {
  if (!program.slug) continue;

  for (const prefix of ["courses", "cursos"]) {
    const routeDir = path.join(publicRoot, "legacy", prefix, program.slug);
    await mkdir(routeDir, { recursive: true });
    await writeFile(
      path.join(routeDir, "index.html"),
      buildCourseDetailHtml(template, siteData, program),
    );
  }
}
