import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const contentPath = path.join(root, "src", "content.js");
const assetRoot = path.join(root, "public", "assets");

const source = readFileSync(contentPath, "utf8");
const context = { window: {} };
vm.createContext(context);
vm.runInContext(source, context, { filename: "src/content.js" });

const data = context.window.AITUSA_DATA || {};
const textExtensions = new Set([
  ".css",
  ".html",
  ".js",
  ".json",
  ".jsx",
  ".mjs",
  ".ts",
  ".tsx",
  ".webmanifest",
  ".xml",
]);
const ignoredDirectoryNames = new Set([
  ".chrome-profile",
  ".git",
  ".next",
  "coverage",
  "dist",
  "node_modules",
  "out",
]);
const preloadTagPattern = /<link\b[^>]*\brel=["']preload["'][^>]*>/gi;

const walkFiles = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory() && ignoredDirectoryNames.has(entry.name)) return [];
    return entry.isDirectory() ? walkFiles(target) : [target];
  });

const normalizeAssetRef = (value) => {
  if (typeof value !== "string") return null;

  const clean = value.split(/[?#]/, 1)[0];
  const publicIndex = clean.indexOf("public/assets/");
  if (publicIndex >= 0) return clean.slice(publicIndex);

  const assetIndex = clean.indexOf("assets/");
  if (assetIndex >= 0) return `public/${clean.slice(assetIndex)}`;

  return null;
};

const liveRefs = new Set();
const collectValueRefs = (value) => {
  if (Array.isArray(value)) {
    value.forEach(collectValueRefs);
    return;
  }

  if (value && typeof value === "object") {
    Object.values(value).forEach(collectValueRefs);
    return;
  }

  const ref = normalizeAssetRef(value);
  if (ref) liveRefs.add(ref);
};

collectValueRefs(data);

const runtimeTextFiles = walkFiles(root).filter((file) => {
  const relative = path.relative(root, file).split(path.sep).join("/");
  if (
    relative.startsWith(".git/") ||
    relative.startsWith("content/") ||
    relative.startsWith("docs/") ||
    relative.startsWith("screenshots/") ||
    relative.startsWith("scripts/") ||
    relative.startsWith("tests/") ||
    relative.startsWith("public/assets/") ||
    relative.startsWith("public/legacy/") ||
    relative.startsWith("public/src/") ||
    relative === "src/content.js"
  ) {
    return false;
  }

  return (
    relative === "index.html" ||
    relative === "site.webmanifest" ||
    relative.startsWith("app/") ||
    relative.startsWith("src/") ||
    relative.startsWith("public/")
  ) && (
    textExtensions.has(path.extname(file).toLowerCase()) ||
    file.endsWith("site.webmanifest")
  );
});

const assetFiles = walkFiles(assetRoot).map((file) => ({
  absolute: file,
  relative: path.relative(root, file).split(path.sep).join("/"),
  short: path.relative(path.join(root, "public"), file).split(path.sep).join("/"),
}));

const runtimeTexts = runtimeTextFiles.map((file) => {
  const relative = path.relative(root, file).split(path.sep).join("/");
  const sourceText = readFileSync(file, "utf8");
  return {
    file,
    text: relative === "index.html"
      ? sourceText.replace(preloadTagPattern, "")
      : sourceText,
  };
});

for (const { text } of runtimeTexts) {
  for (const match of text.matchAll(/(?:public\/)?assets\/[^\s"'`()<>?#]+/g)) {
    const ref = normalizeAssetRef(match[0].replace(/[,:;]+$/, ""));
    if (ref) liveRefs.add(ref);
  }
}

const missing = [...liveRefs]
  .filter((ref) => !existsSync(path.join(root, ref)))
  .sort();
const orphaned = assetFiles
  .filter((asset) => !liveRefs.has(asset.relative))
  .sort((left, right) => statSync(right.absolute).size - statSync(left.absolute).size);

const indexSource = readFileSync(path.join(root, "index.html"), "utf8");
const preloadTags = indexSource.match(preloadTagPattern) || [];
const nonPreloadIndex = indexSource.replace(preloadTagPattern, "");
const preloadOnly = preloadTags
  .map((tag) => tag.match(/\bhref=["']([^"']+)["']/i)?.[1])
  .map(normalizeAssetRef)
  .filter(Boolean)
  .filter((ref) => {
    const short = ref.replace(/^public\//, "");
    return !nonPreloadIndex.includes(ref) &&
      !nonPreloadIndex.includes(short) &&
      ![...liveRefs].some((liveRef) => liveRef === ref);
  })
  .sort();

console.log(
  `asset refs ${liveRefs.size} missing ${missing.length} orphaned ${orphaned.length} preload-only ${preloadOnly.length}`,
);

if (missing.length) {
  console.log("\nMissing live assets:");
  console.log(missing.join("\n"));
}

if (orphaned.length) {
  console.log("\nOrphaned public assets:");
  for (const asset of orphaned) {
    console.log(`${asset.relative} (${statSync(asset.absolute).size} bytes)`);
  }
}

if (preloadOnly.length) {
  console.log("\nPreloaded but not rendered:");
  console.log(preloadOnly.join("\n"));
}

if (missing.length || orphaned.length || preloadOnly.length) {
  process.exit(1);
}
