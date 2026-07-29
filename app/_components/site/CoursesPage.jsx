import { conversionCtas, programs, site } from "../../../src/content";
import { CourseCatalog, OfferingsSection } from "./CourseSections";
import { FaqSection, FinalCtaSection } from "./PublicSections";
import { SiteFooter, SiteHeader } from "./SiteChrome";

export function CoursesPage({ selectedSlug = null }) {
  return (
    <>
      <SiteHeader activePage="courses" />
      <main id="main-content">
        <section className="page-hero section" id="inicio">
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
            <div className="page-hero__media card">
              <img src={site.images.routeLevels} alt={site.images.contactAlt || "Ruta por niveles de AiT USA."} />
              <p className="eyebrow-chip">Ruta guiada</p>
              <h2>Inglés presencial sigue siendo la oferta principal.</h2>
              <p>También puedes comparar opciones híbridas, online y programas de apoyo antes de hablar con el equipo.</p>
            </div>
          </div>
        </section>
        <OfferingsSection />
        <CourseCatalog selectedSlug={selectedSlug} />
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
  return {
    title: `${program.title} | Cursos AiT USA Institute`,
    description: `${program.title}. ${program.summary}`,
    alternates: { canonical: `/courses/${program.slug}/` },
    openGraph: {
      title: `${program.title} | Cursos AiT USA Institute`,
      description: program.summary,
      url: `/courses/${program.slug}/`,
      images: [{ url: program.image, alt: program.imageAlt }],
    },
  };
}
