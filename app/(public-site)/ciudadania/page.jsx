import Image from "next/image";
import { SiteFooter, SiteHeader } from "../../_components/site/SiteChrome";
import { site } from "../../../src/content";

const pageUrl = new URL("/ciudadania/", site.canonical).toString();

export const metadata = {
  title: "Información sobre ciudadanía | AiT USA Institute",
  description:
    "Conoce la página informativa en preparación de AiT USA Institute sobre apoyo para tu proceso de ciudadanía. Los detalles del programa se confirman directamente con el instituto.",
  alternates: {
    canonical: "/ciudadania/",
    languages: {
      "es-US": "/ciudadania/",
      "x-default": "/ciudadania/",
    },
  },
  openGraph: {
    type: "website",
    locale: "es_US",
    url: "/ciudadania/",
    siteName: site.name,
    title: "Información sobre ciudadanía | AiT USA Institute",
    description:
      "Una guía inicial para conversar con AiT USA Institute sobre apoyo de preparación cívica. Los detalles se confirman directamente con el instituto.",
    images: [{ url: site.images.adultEnglish, alt: "Estudiantes adultos conversando en un espacio de aprendizaje." }],
  },
  twitter: {
    card: "summary_large_image",
    site: site.twitterHandle,
    title: "Ciudadanía | AiT USA Institute",
    description:
      "Página informativa en preparación. Confirma directamente con AiT USA Institute los detalles de cualquier apoyo disponible.",
    images: [site.images.adultEnglish],
  },
};

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${pageUrl}#webpage`,
  url: pageUrl,
  name: "Información sobre ciudadanía | AiT USA Institute",
  description:
    "Página informativa en preparación para conversar con AiT USA Institute sobre apoyo de preparación cívica.",
  isPartOf: {
    "@type": "WebSite",
    name: site.name,
    url: site.canonical,
  },
  about: {
    "@type": "Thing",
    name: "Información sobre apoyo de preparación cívica",
  },
};

const questionsToConfirm = [
  "Qué tipo de apoyo está disponible actualmente.",
  "Qué formato, sede o modalidad puede funcionar para tu situación.",
  "Qué documentos o próximos pasos conviene revisar con una fuente autorizada.",
];

const reviewGaps = [
  "Fechas, horarios y duración",
  "Costo, materiales y disponibilidad",
  "Requisitos, elegibilidad y proceso de inscripción",
  "Contenido específico, instructores y sedes",
];

export default function CitizenshipInformationPage() {
  return (
    <>
      <script
        data-schema="citizenship-information"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />
      <SiteHeader activePage="courses" />
      <main className="course-program-page citizenship-information-page" id="main-content">
        <section className="course-program-hero" aria-labelledby="citizenship-page-title">
          <div className="section-inner course-program-hero__main">
            <div className="course-program-hero__copy">
              <nav className="course-breadcrumb" aria-label="Ruta de navegación">
                <a href="/">Inicio</a>
                <i data-lucide="chevron-right" aria-hidden="true" />
                <span aria-current="page">Ciudadanía</span>
              </nav>
              <p className="section-kicker">Página informativa en preparación</p>
              <h1 id="citizenship-page-title">Información sobre ciudadanía</h1>
              <p className="course-program-hero__lead">
                Consulta con AiT USA si hay apoyo de preparación cívica disponible. Los detalles de una oferta académica formal todavía están por confirmar.
              </p>
              <div className="course-program-hero__actions">
                <a className="button button--primary" href={`${site.whatsappHref}?text=${encodeURIComponent("Hola AIT USA, quiero saber si hay apoyo de preparación cívica disponible y cuáles son los próximos pasos.")}`} target="_blank" rel="noreferrer">
                  Consultar por WhatsApp
                  <i data-lucide="message-circle" aria-hidden="true" />
                </a>
                <a className="course-program-text-link" href={site.legalLinks.contact}>
                  Ver opciones de contacto
                  <i data-lucide="arrow-right" aria-hidden="true" />
                </a>
              </div>
              <p className="course-program-hero__note">
                Información general únicamente. AiT USA Institute no ofrece asesoría legal o de inmigración;
                para orientación legal, consulta a un profesional autorizado.
              </p>
            </div>
            <figure className="course-program-hero__media">
              <Image
                src={site.images.adultEnglish}
                alt="Estudiantes adultos conversando en un espacio de aprendizaje."
                width={1448}
                height={1086}
                sizes="(max-width: 820px) 100vw, 52vw"
                priority
              />
              <figcaption>
                <span>Información inicial</span>
                <strong>Confirmación directa</strong>
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="course-program-section citizenship-resources" aria-labelledby="citizenship-resources-title">
          <div className="section-inner">
            <p className="section-kicker">Fuentes y próximos pasos</p>
            <h2 id="citizenship-resources-title">Aclara tu pregunta antes de decidir.</h2>
            <div className="citizenship-resource-grid">
              <article>
                <h3>Consulta la información oficial</h3>
                <p>Esta página no evalúa elegibilidad ni recomienda qué presentar. Revisa los requisitos con USCIS y, cuando corresponda, con un profesional legal autorizado.</p>
                <a className="course-program-text-link" href="https://www.uscis.gov/citizenship" target="_blank" rel="noreferrer">Consultar información oficial de USCIS</a>
              </article>
              <article>
                <h3>Pregunta al instituto</h3>
                <ul>{questionsToConfirm.map((question) => <li key={question}>{question}</li>)}</ul>
                <details>
                  <summary>Detalles de la oferta por confirmar</summary>
                  <ul>{reviewGaps.map((gap) => <li key={gap}>{gap}</li>)}</ul>
                  <p>Esta página no abre inscripciones ni garantiza un resultado.</p>
                </details>
                <a className="course-program-text-link" href="/cursos/">Explorar cursos publicados</a>
              </article>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
