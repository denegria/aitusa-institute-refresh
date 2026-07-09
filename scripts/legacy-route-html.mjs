import { readFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

export async function loadLegacySiteData(root) {
  const contentSource = await readFile(path.join(root, "src", "content.js"), "utf8");
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(contentSource, context, { filename: "src/content.js" });
  return context.window.AITUSA_DATA || {};
}

export function buildCoursesIndexHtml(template, siteData) {
  return withRouteMetadata(template, siteData, {
    title: "Cursos AiT USA Institute | Catálogo detallado",
    description:
      "Explora el catálogo detallado de inglés, GED, computación y programas de apoyo de AiT USA Institute.",
    canonicalPath: "/courses/",
    mainEntityId: "course-catalog",
  });
}

export function buildCourseDetailHtml(template, siteData, program) {
  return withRouteMetadata(template, siteData, {
    title: `${program.title} | Cursos AiT USA Institute`,
    description: `${program.title}. ${program.summary}`,
    canonicalPath: `/courses/${program.slug}/`,
    mainEntityId: `course-${program.slug}`,
    courseSchema: buildCourseSchema(siteData, program),
  });
}

export function buildRobotsTxt(siteData) {
  return [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${absoluteUrl(siteData, "/sitemap.xml")}`,
    "",
  ].join("\n");
}

export function buildSitemapXml(siteData, { lastmod = currentDate() } = {}) {
  const courseUrls = (siteData.programs || [])
    .filter((program) => program.slug)
    .map((program) => ({
      loc: absoluteUrl(siteData, `/courses/${program.slug}/`),
      changefreq: "monthly",
      priority: "0.8",
    }));

  const urls = [
    {
      loc: absoluteUrl(siteData, "/"),
      changefreq: "weekly",
      priority: "1.0",
    },
    {
      loc: absoluteUrl(siteData, "/courses/"),
      changefreq: "weekly",
      priority: "0.9",
    },
    {
      loc: absoluteUrl(siteData, "/placement-test/"),
      changefreq: "monthly",
      priority: "0.9",
    },
    ...courseUrls,
  ];

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.flatMap((url) => [
      "  <url>",
      `    <loc>${escapeHtml(url.loc)}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      `    <changefreq>${url.changefreq}</changefreq>`,
      `    <priority>${url.priority}</priority>`,
      "  </url>",
    ]),
    "</urlset>",
    "",
  ].join("\n");
}

function withRouteMetadata(
  template,
  siteData,
  { title, description, canonicalPath, mainEntityId, courseSchema },
) {
  const url = absoluteUrl(siteData, canonicalPath);
  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: title,
    description,
    isPartOf: {
      "@id": `${absoluteUrl(siteData, "/")}#website`,
    },
    about: {
      "@id": `${absoluteUrl(siteData, "/")}#organization`,
    },
    mainEntity: {
      "@id": `${url}#${mainEntityId}`,
    },
    inLanguage: "es-US",
    breadcrumb: {
      "@id": `${url}#breadcrumb`,
    },
  };

  let html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
    .replace(
      /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/>/,
      `<meta name="description" content="${escapeAttribute(description)}" />`,
    )
    .replace(
      /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/,
      `<link rel="canonical" href="${escapeAttribute(url)}" />`,
    )
    .replace(
      /<meta\s+property="og:title"\s+content="[\s\S]*?"\s*\/>/,
      `<meta property="og:title" content="${escapeAttribute(title)}" />`,
    )
    .replace(
      /<meta\s+property="og:description"\s+content="[\s\S]*?"\s*\/>/,
      `<meta property="og:description" content="${escapeAttribute(description)}" />`,
    )
    .replace(
      /<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/,
      `<meta property="og:url" content="${escapeAttribute(url)}" />`,
    )
    .replace(
      /<meta\s+name="twitter:title"\s+content="[\s\S]*?"\s*\/>/,
      `<meta name="twitter:title" content="${escapeAttribute(title)}" />`,
    )
    .replace(
      /<meta\s+name="twitter:description"\s+content="[\s\S]*?"\s*\/>/,
      `<meta name="twitter:description" content="${escapeAttribute(description)}" />`,
    )
    .replace(
      /<script\s+type="application\/ld\+json"\s+data-schema="webpage">[\s\S]*?<\/script>/,
      jsonLdScript("webpage", webpageSchema),
    );

  if (courseSchema) {
    html = html.replace("</head>", `  ${jsonLdScript("course", courseSchema)}\n  </head>`);
  }

  return html;
}

function buildCourseSchema(siteData, program) {
  const url = absoluteUrl(siteData, `/courses/${program.slug}/`);
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${url}#course-${program.slug}`,
    name: program.title,
    description: program.summary,
    provider: {
      "@id": `${absoluteUrl(siteData, "/")}#organization`,
    },
    educationalLevel: program.audience,
    courseMode: program.mode,
    url,
    inLanguage: "es-US",
  };
}

function jsonLdScript(name, value) {
  return `<script type="application/ld+json" data-schema="${name}">\n${JSON.stringify(value, null, 2)}\n  </script>`;
}

function absoluteUrl(siteData, pathValue) {
  return new URL(pathValue, siteData.site?.canonical || "https://www.aitusainstitute.com/").toString();
}

function currentDate() {
  return new Date().toISOString().slice(0, 10);
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/"/g, "&quot;");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
