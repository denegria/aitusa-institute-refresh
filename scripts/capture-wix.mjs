import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const rawDir = path.join(root, "content", "raw");
const assetsDir = path.join(root, "public", "assets", "wix");

const pages = [
  ["home", "https://www.aitusainstitute.com/"],
  ["courses", "https://www.aitusainstitute.com/cursos-1"],
  ["english-presencial", "https://www.aitusainstitute.com/copy-of-ingles"],
  ["english-online", "https://www.aitusainstitute.com/copy-of-ingles-1"],
  ["kids-online", "https://en.aitusainstitute.com/ingles-para-ninos"],
  ["spanish-foreigners", "https://www.aitusainstitute.com/copy-of-espa%C3%B1ol-para-americanos"],
  ["ged", "https://www.aitusainstitute.com/copy-of-ged-matematicas"],
  ["math-tutoring", "https://www.aitusainstitute.com/copy-of-ged-matematicas-1"],
  ["basic-computing", "https://www.aitusainstitute.com/copy-of-computacion"],
  ["office-computing", "https://en.aitusainstitute.com/copy-of-computacion-1"],
  ["computer-repair", "https://www.aitusainstitute.com/copy-of-computacion-para-oficina"],
  ["about", "https://www.aitusainstitute.com/nosotros"],
  ["contact", "https://www.aitusainstitute.com/contactanos"],
  ["downloads", "https://en.aitusainstitute.com/descargas"],
  ["faq", "https://en.aitusainstitute.com/terms-of-use"],
  ["student-survey", "https://www.aitusainstitute.com/encuesta-estudiantes"],
  ["registration", "https://www.aitusainstitute.com/inscripciones"],
  ["payments", "https://www.aitusainstitute.com/cursos"],
];

const cleanAssetUrl = (url) => {
  let cleaned = url
    .replace(/\\u002F/g, "/")
    .replace(/\\\//g, "/")
    .replace(/&amp;/g, "&");

  cleaned = cleaned.split(/[)"'<>\]\s]/)[0];
  cleaned = cleaned.replace(/,+$/, "");

  try {
    const parsed = new URL(cleaned);
    if (parsed.hostname === "static.wixstatic.com") {
      return parsed.toString();
    }
  } catch {
    return null;
  }

  return null;
};

const assetNameFromUrl = (url, index) => {
  const parsed = new URL(url);
  const parts = parsed.pathname.split("/").filter(Boolean);
  const mediaPart = decodeURIComponent(parts.at(-1) || `asset-${index}`);
  const original = mediaPart.split("~")[0].split("?")[0];
  const extMatch = original.match(/\.(png|jpe?g|webp|gif|svg|pdf|mp4|mov)$/i);
  const ext = extMatch?.[1]?.toLowerCase() || "jpg";
  const basename = original
    .replace(/\.(png|jpe?g|webp|gif|svg|pdf|mp4|mov)$/i, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 72)
    .toLowerCase() || `wix-asset-${index}`;

  return `${String(index).padStart(3, "0")}-${basename}.${ext}`;
};

const extractAssets = (html) => {
  const normalized = html.replace(/\\u002F/g, "/").replace(/\\\//g, "/");
  const matches = normalized.match(/https?:\/\/static\.wixstatic\.com\/[^"'<>\\\s)]+/g) || [];
  return matches.map(cleanAssetUrl).filter(Boolean);
};

const fetchText = async (url) => {
  const response = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0 content-capture for local client rebuild",
    },
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  return response.text();
};

const fetchAsset = async (url, target) => {
  const response = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0 content-capture for local client rebuild",
    },
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  await writeFile(target, bytes);
  return {
    bytes: bytes.byteLength,
    contentType: response.headers.get("content-type") || "unknown",
  };
};

await mkdir(rawDir, { recursive: true });
await mkdir(assetsDir, { recursive: true });

const pageManifest = [];
const assetUrls = new Set();

for (const [slug, url] of pages) {
  console.log(`Fetching ${slug}: ${url}`);
  try {
    const html = await fetchText(url);
    await writeFile(path.join(rawDir, `${slug}.html`), html);

    const assets = [...new Set(extractAssets(html))];
    assets.forEach((asset) => assetUrls.add(asset));

    pageManifest.push({
      slug,
      url,
      rawHtml: `content/raw/${slug}.html`,
      bytes: Buffer.byteLength(html),
      assetCount: assets.length,
    });
  } catch (error) {
    pageManifest.push({
      slug,
      url,
      error: error.message,
    });
    console.warn(`Failed ${slug}: ${error.message}`);
  }
}

const assetManifest = [];
let index = 1;
for (const url of assetUrls) {
  const filename = assetNameFromUrl(url, index);
  const target = path.join(assetsDir, filename);
  console.log(`Downloading ${filename}`);

  try {
    const meta = await fetchAsset(url, target);
    assetManifest.push({
      source: url,
      local: `public/assets/wix/${filename}`,
      ...meta,
    });
    index += 1;
  } catch (error) {
    assetManifest.push({
      source: url,
      error: error.message,
    });
    console.warn(`Failed asset ${url}: ${error.message}`);
  }
}

await writeFile(
  path.join(root, "content", "capture-manifest.json"),
  JSON.stringify(
    {
      capturedAt: new Date().toISOString(),
      pages: pageManifest,
      assets: assetManifest,
    },
    null,
    2,
  ),
);

console.log(`Captured ${pageManifest.length} pages and ${assetManifest.length} assets.`);
