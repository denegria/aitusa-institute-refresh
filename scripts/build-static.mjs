import { cp, mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

await cp(path.join(root, "index.html"), path.join(dist, "index.html"));
await cp(path.join(root, "src"), path.join(dist, "src"), { recursive: true });
await cp(path.join(root, "public"), path.join(dist, "public"), { recursive: true });

for (const file of ["robots.txt", "sitemap.xml", "site.webmanifest"]) {
  const source = path.join(root, file);
  if (existsSync(source)) {
    await cp(source, path.join(dist, file));
  }
}
