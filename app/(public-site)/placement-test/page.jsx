import { PlacementExperience } from "../../_components/site/PlacementExperience";
import { SiteFooter, SiteHeader } from "../../_components/site/SiteChrome";
import { placementTest } from "../../../src/content";

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
        <section className="page-hero placement-page__hero section" id="inicio">
          <div className="section-inner placement-hero">
            <div className="page-hero__copy">
              <p className="section-kicker">{placementTest.eyebrow || "Evaluación inicial"}</p>
              <h1>{placementTest.title || "Examen de ubicación"}</h1>
              <p>{placementTest.intro || ""}</p>
              <div className="notice-box">
                <strong>Primero recibes valor:</strong>
                <span>{placementTest.privacyNote || ""}</span>
              </div>
            </div>
          </div>
        </section>
        <section className="section placement-page__app" id="placement-test">
          <PlacementExperience />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
