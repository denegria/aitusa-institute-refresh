import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const rawDir = path.join(root, "content", "raw");
const manifest = JSON.parse(
  await readFile(path.join(root, "content", "capture-manifest.json"), "utf8"),
);

const sourceToLocal = new Map(
  manifest.assets
    .filter((asset) => asset.source && asset.local)
    .map((asset) => [asset.source, asset.local]),
);

const decode = (value = "") =>
  value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/%20/g, " ")
    .trim();

const attr = (tag, name) => {
  const match = tag.match(new RegExp(`${name}=["']([^"']*)["']`, "i"));
  return decode(match?.[1] || "");
};

const cleanSrc = (url) => {
  const normalized = url
    .replace(/\\u002F/g, "/")
    .replace(/\\\//g, "/")
    .replace(/&amp;/g, "&");

  try {
    return new URL(normalized).toString();
  } catch {
    return normalized;
  }
};

const files = await readdir(rawDir);
const inventory = [];

for (const file of files.filter((entry) => entry.endsWith(".html"))) {
  const slug = file.replace(/\.html$/, "");
  const html = await readFile(path.join(rawDir, file), "utf8");
  const tags = html.match(/<img\b[^>]*>/gi) || [];

  for (const tag of tags) {
    const src = cleanSrc(attr(tag, "src"));
    const alt = attr(tag, "alt");
    const width = attr(tag, "width");
    const height = attr(tag, "height");

    if (!src || !src.includes("static.wixstatic.com")) continue;

    inventory.push({
      page: slug,
      alt,
      width,
      height,
      src,
      local: sourceToLocal.get(src) || null,
    });
  }
}

const unique = [];
const seen = new Set();
for (const item of inventory) {
  const key = `${item.page}|${item.alt}|${item.src}`;
  if (seen.has(key)) continue;
  seen.add(key);
  unique.push(item);
}

await writeFile(
  path.join(root, "content", "image-inventory.json"),
  JSON.stringify(unique, null, 2),
);

console.log(`Wrote ${unique.length} image inventory rows.`);
