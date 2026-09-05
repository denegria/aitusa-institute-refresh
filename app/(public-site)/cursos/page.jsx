import { CoursesPage } from "../../_components/site/CoursesPage";
import { programs, site } from "../../../src/content";

export const metadata = {
  title: "Cursos AiT USA Institute | Catálogo detallado",
  description:
    "Explora el catálogo detallado de inglés, GED, computación, programas de apoyo y una ruta informativa de ciudadanía de AiT USA Institute.",
  keywords: site.seoKeywords,
  alternates: {
    canonical: "/cursos/",
    languages: {
      "es-US": "/cursos/",
      "x-default": "/cursos/",
    },
  },
  openGraph: {
    type: "website",
    locale: "es_US",
    url: "/cursos/",
    siteName: site.name,
    title: "Cursos AiT USA Institute | Catálogo detallado",
    description:
      "Explora el catálogo detallado de inglés, GED, computación, programas de apoyo y una ruta informativa de ciudadanía de AiT USA Institute.",
    images: [{ url: site.seoImage, alt: site.seoImageAlt }],
  },
  twitter: {
    card: "summary_large_image",
    site: site.twitterHandle,
    title: "Cursos AiT USA Institute | Catálogo detallado",
    description:
      "Explora el catálogo detallado de inglés, GED, computación, programas de apoyo y una ruta informativa de ciudadanía de AiT USA Institute.",
    images: [site.seoImage],
  },
};

const catalogSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": `${new URL("/cursos/", site.canonical).toString()}#course-catalog`,
  name: "Catálogo de cursos de AiT USA Institute",
  itemListOrder: "https://schema.org/ItemListOrderAscending",
  numberOfItems: programs.length,
  itemListElement: programs.map((program, index) => {
    const courseUrl = new URL(`/cursos/${program.slug}/`, site.canonical).toString();
    return {
      "@type": "ListItem",
      position: index + 1,
      name: program.title,
      url: courseUrl,
      item: {
        "@type": "Course",
        "@id": `${courseUrl}#course`,
        name: program.title,
        description: program.summary,
        url: courseUrl,
        provider: {
          "@type": "EducationalOrganization",
          name: site.name,
          url: site.canonical,
        },
      },
    };
  }),
};

export default async function CourseCatalogPage({ searchParams }) {
  const { grupo } = await searchParams;
  return (
    <>
      <script
        data-schema="course-catalog"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(catalogSchema) }}
      />
      <CoursesPage initialGroup={grupo} />
    </>
  );
}
