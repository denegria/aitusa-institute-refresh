import { PlacementExperience } from "../../_components/site/PlacementExperience";
import { SiteHeader } from "../../_components/site/SiteChrome";
import { placementTest, site } from "../../../src/content";

export const metadata = {
  title: "Examen de ubicación | AiT USA Institute",
  description:
    "Completa una evaluación inicial de inglés y recibe una recomendación orientativa antes de confirmar tu nivel con un asesor.",
  alternates: { canonical: "/placement-test/" },
};

export default function PlacementTestPage() {
  return (
    <>
      <SiteHeader activePage="placement" />
      <main className="placement-page" id="main-content">
        <section className="section placement-page__app" id="placement-test">
          <PlacementExperience />
        </section>
        <nav className="placement-utility" aria-label="Ayuda y documentos legales">
          <a href={site.legalLinks.contact}>Ayuda</a>
          <a href={site.legalLinks.privacy}>Privacidad</a>
          <a href={site.legalLinks.terms}>Términos</a>
        </nav>
      </main>
    </>
  );
}
