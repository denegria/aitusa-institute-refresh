import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const rawDir = path.join(root, "content", "raw");

const normalize = (text) => text.replace(/\\u002F/g, "/").replace(/\\\//g, "/").replace(/&amp;/g, "&");
const files = (await readdir(rawDir)).filter((entry) => entry.endsWith(".html"));
const urls = new Set();

for (const file of files) {
  const text = normalize(await readFile(path.join(rawDir, file), "utf8"));
  const matches = text.match(/https?:\/\/(?:docs\.google\.com|wa\.me|www\.facebook\.com|www\.instagram\.com|www\.youtube\.com|www\.pinterest\.com)[^"'<>\\\s)]+/gi) || [];
  matches.forEach((url) => urls.add(url.replace(/[,.;]+$/, "")));
}

const list = [...urls].sort();
await writeFile(path.join(root, "content", "external-links.txt"), `${list.join("\n")}\n`);
console.log(list.join("\n"));
