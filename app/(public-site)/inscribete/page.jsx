import { RegistrationExperience } from "../../_components/site/RegistrationExperience";
import { SiteHeader } from "../../_components/site/SiteChrome";
import { programs, site } from "../../../src/content";
import { ENGLISH_PROGRAM_SLUGS, registrationSelectionForContext } from "../../../src/registration/contract.js";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Inscríbete | AIT USA Institute",
  description: "Elige un curso en AIT USA, revisa el precio y completa tu inscripción de forma segura.",
  alternates: { canonical: "/inscribete/" },
};

const COURSE_OPTIONS = Object.freeze([
  { code: "english_program", label: "Inglés" },
  ...programs.filter(({ slug }) => !ENGLISH_PROGRAM_SLUGS.has(slug)).map(({ slug, title }) => ({ code: slug, label: title })),
]);

export default async function RegistrationPage({ searchParams }) {
  const params = await searchParams;
  const context = String(params?.curso || "").trim().toLowerCase();
  const entry = registrationSelectionForContext(context);
  const validContext = COURSE_OPTIONS.some(({ code }) => code === entry.programCode);
  return <>
    <SiteHeader activePage="registration" />
    <main className="registration-page" id="main-content">
      <div className="section-inner">
        <RegistrationExperience
          courseOptions={COURSE_OPTIONS}
          initialProgramCode={validContext ? entry.programCode : "english_program"}
          initialLearningModality={validContext ? entry.learningModality : "in_person"}
          entryContext={validContext && context ? context : "general"}
          returnToken={String(params?.state || "")}
          redirectState={String(params?.payment || "")}
        />
      </div>
      <nav className="placement-utility registration-utility" aria-label="Ayuda y documentos legales">
        <a href={site.legalLinks.contact}>Ayuda</a>
        <a href={site.legalLinks.privacy}>Privacidad</a>
        <a href={site.legalLinks.terms}>Términos</a>
      </nav>
    </main>
  </>;
}
