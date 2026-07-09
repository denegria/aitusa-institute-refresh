import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

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
