import { programs, site } from "../../../src/content";
import { getCourseMetaDescription } from "../../../src/seo/courseMetadata";
import { CourseCatalog } from "./CourseSections";
import { FaqSection, FinalCtaSection } from "./PublicSections";
import { SiteFooter, SiteHeader } from "./SiteChrome";

export function CoursesPage() {
  return (
    <>
      <SiteHeader activePage="courses" />
      <main id="main-content">
        <CourseCatalog />
        <FinalCtaSection />
        <FaqSection />
      </main>
      <SiteFooter />
    </>
  );
}

export function getCourseMetadata(slug) {
  const program = programs.find((item) => item.slug === slug);
  if (!program) return null;
  const title = `${program.title} | AiT USA Institute`;
  const description = getCourseMetaDescription(program);
  return {
    title,
    description,
    alternates: { canonical: `/cursos/${program.slug}/` },
    openGraph: {
      type: "website",
      siteName: site.name,
      title,
      description,
      url: `/cursos/${program.slug}/`,
      images: [{ url: program.image, alt: program.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [program.image],
    },
  };
}
