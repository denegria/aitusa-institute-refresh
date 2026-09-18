import { RegistrationExperience } from "../../_components/site/RegistrationExperience";
import { SiteFooter, SiteHeader } from "../../_components/site/SiteChrome";
import { programCodeForContext } from "../../../src/registration/contract.js";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Inscríbete | AIT USA Institute",
  description: "Confirma tu ruta, revisa el precio y continúa al pago seguro de AIT USA Institute.",
  alternates: { canonical: "/inscribete/" },
};

const COURSE_LABELS = Object.freeze({
  "english_program": "Programa de inglés",
  "ingles-jovenes-adultos": "Inglés para jóvenes y adultos",
  "ingles-online-adultos": "Inglés online para adultos",
  "ingles-hibrido-adultos": "Inglés híbrido para adultos",
});

export default async function RegistrationPage({ searchParams }) {
  const params = await searchParams;
  const context = String(params?.curso || "english_program").trim().toLowerCase();
  return <>
    <SiteHeader activePage="registration" />
    <main className="registration-page" id="main-content">
      <div className="section-inner">
        <RegistrationExperience
          programCode={programCodeForContext(context)}
          courseLabel={COURSE_LABELS[context] || "Programa seleccionado"}
          returnToken={String(params?.state || "")}
          redirectState={String(params?.payment || "")}
        />
      </div>
    </main>
    <SiteFooter />
  </>;
}
