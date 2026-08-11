import { conversionCtas, programs, site } from "../../../src/content";
import { CourseCatalog } from "./CourseSections";
import { FaqSection, FinalCtaSection } from "./PublicSections";
import { SiteFooter, SiteHeader } from "./SiteChrome";

export function CoursesPage() {
  return (
    <>
      <SiteHeader activePage="courses" />
      <main id="main-content">
        <section className="page-hero page-hero--catalog section" id="inicio">
          <div className="section-inner page-hero__grid">
            <div className="page-hero__copy">
              <p className="section-kicker">Catálogo detallado</p>
              <h1>Explora cursos, formatos y próximos pasos con más detalle.</h1>
              <p>Compara modalidades, objetivos y horarios para inglés, GED, computación y programas de apoyo.</p>
              <div className="button-row">
                <a className="button button--primary" href={conversionCtas.placement?.href || "/placement-test/"}>Hacer examen de ubicación</a>
                <a className="button button--ghost" href={conversionCtas.advisor?.href || site.whatsappHref} target="_blank" rel="noreferrer">Hablar con un asesor</a>
              </div>
            </div>
            <div className="page-hero__media card page-hero__media--catalog">
              <p className="eyebrow-chip">Ruta guiada</p>
              <h2>Empieza por el formato que encaja con tu semana.</h2>
              <p>Presencial, híbrido y online tienen fichas propias. También puedes explorar GED, matemáticas, computación y español.</p>
              <nav className="catalog-hero-links" aria-label="Fichas destacadas de inglés">
                <a href="/cursos/ingles-jovenes-adultos/">Inglés presencial</a>
                <a href="/cursos/ingles-hibrido-adultos/">Inglés híbrido</a>
                <a href="/cursos/ingles-online-adultos/">Inglés online</a>
              </nav>
            </div>
          </div>
        </section>
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
  const description = `${program.summary} Conoce la modalidad, los horarios publicados y el siguiente paso para confirmar tu ruta.`;
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
