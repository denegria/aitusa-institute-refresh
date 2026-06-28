import { cp, mkdir, readFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const dist = path.join(root, "dist");

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

await cp(path.join(root, "index.html"), path.join(dist, "index.html"));
await cp(path.join(root, "src"), path.join(dist, "src"), { recursive: true });
await cp(path.join(root, "public"), path.join(dist, "public"), { recursive: true });

const contentSource = await readFile(path.join(root, "src", "content.js"), "utf8");
const context = { window: {} };
vm.createContext(context);
vm.runInContext(contentSource, context, { filename: "src/content.js" });

const programs = context.window.AITUSA_DATA?.programs || [];
for (const route of ["courses", "placement-test"]) {
  const routeDir = path.join(dist, route);
  await mkdir(routeDir, { recursive: true });
  await cp(path.join(root, "index.html"), path.join(routeDir, "index.html"));
}

for (const program of programs) {
  if (!program.slug) continue;
  for (const prefix of ["cursos", "courses"]) {
    const courseDir = path.join(dist, prefix, program.slug);
    await mkdir(courseDir, { recursive: true });
    await cp(path.join(root, "index.html"), path.join(courseDir, "index.html"));
  }
}

for (const file of ["robots.txt", "sitemap.xml", "site.webmanifest"]) {
  const source = path.join(root, file);
  if (existsSync(source)) {
    await cp(source, path.join(dist, file));
  }
}
