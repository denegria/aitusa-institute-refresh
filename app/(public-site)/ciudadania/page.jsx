import Image from "next/image";
import { SiteFooter, SiteHeader } from "../../_components/site/SiteChrome";
import { site } from "../../../src/content";

const pageUrl = new URL("/ciudadania/", site.canonical).toString();

export const metadata = {
  title: "Ciudadanía | Página informativa en preparación | AiT USA Institute",
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
    title: "Ciudadanía | Página informativa en preparación | AiT USA Institute",
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
  name: "Ciudadanía | Página informativa en preparación | AiT USA Institute",
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
              <h1 id="citizenship-page-title">Empieza con una conversación clara sobre tu próximo paso.</h1>
              <p className="course-program-hero__lead">
                Esta página abre una ruta para preguntar por apoyo de preparación cívica. Antes de asumir
                detalles, conversemos sobre tu objetivo y confirmemos qué información aplica a tu caso.
              </p>
              <div className="course-program-hero__actions">
                <a className="button button--primary" href={site.whatsappHref} target="_blank" rel="noreferrer">
                  Hablar con AiT USA
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
          <div className="course-program-ledger">
            <dl className="section-inner" aria-label="Estado de esta página">
              <div><dt>Propósito</dt><dd>Abrir una conversación informada</dd></div>
              <div><dt>Estado</dt><dd>Detalles del programa por confirmar</dd></div>
              <div><dt>Próximo paso</dt><dd>Contactar al instituto directamente</dd></div>
            </dl>
          </div>
        </section>

        <section className="course-program-section course-program-outcomes" aria-labelledby="citizenship-conversation-title">
          <div className="section-inner">
            <header className="course-program-heading section-heading--framed">
              <p className="section-kicker">Una conversación, no una promesa</p>
              <h2 id="citizenship-conversation-title">Aclara lo esencial antes de decidir.</h2>
              <p>
                La información pública disponible todavía no confirma una oferta académica formal. Esta
                página no presenta un curso, una inscripción ni un resultado garantizado.
              </p>
            </header>
            <ol className="course-outcome-list">
              {questionsToConfirm.map((question, index) => (
                <li key={question}>
                  <span aria-hidden="true">0{index + 1}</span>
                  <h3>{["Ubica la conversación", "Confirma lo disponible", "Elige fuentes correctas"][index]}</h3>
                  <p>{question}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="course-program-section course-program-pathway" aria-labelledby="citizenship-boundary-title">
          <div className="section-inner course-program-pathway__layout">
            <header className="course-program-heading">
              <p className="section-kicker">Límite importante</p>
              <h2 id="citizenship-boundary-title">Prepararte e informarte no sustituye orientación legal.</h2>
              <p>
                Los requisitos y decisiones de inmigración dependen de circunstancias individuales y de fuentes
                oficiales. Esta página no evalúa elegibilidad ni recomienda qué presentar.
              </p>
              <a className="course-program-text-link" href="https://www.uscis.gov/citizenship" target="_blank" rel="noreferrer">
                Consultar información oficial de USCIS
                <i data-lucide="external-link" aria-hidden="true" />
              </a>
            </header>
            <ol className="course-pathway-list">
              <li>
                <div className="course-pathway-list__marker" aria-hidden="true"><span>1</span></div>
                <div><p className="course-pathway-list__eyebrow">Antes de contactar</p><h3>Define tu pregunta.</h3><p>Anota qué necesitas aclarar para que la conversación sea concreta.</p></div>
              </li>
              <li>
                <div className="course-pathway-list__marker" aria-hidden="true"><span>2</span></div>
                <div><p className="course-pathway-list__eyebrow">Con el instituto</p><h3>Confirma la información actual.</h3><p>Pregunta directamente por cualquier apoyo, disponibilidad y siguientes pasos que estén vigentes.</p></div>
              </li>
              <li>
                <div className="course-pathway-list__marker" aria-hidden="true"><span>3</span></div>
                <div><p className="course-pathway-list__eyebrow">Para tu caso</p><h3>Usa fuentes autorizadas.</h3><p>Revisa los requisitos con USCIS y, cuando corresponda, con un profesional legal autorizado.</p></div>
              </li>
            </ol>
          </div>
        </section>

        <section className="course-program-section course-program-faq" aria-labelledby="citizenship-review-title">
          <div className="section-inner course-program-faq__layout">
            <header className="course-program-heading">
              <p className="section-kicker">Para completar esta página</p>
              <h2 id="citizenship-review-title">Detalles que AiT USA debe confirmar antes de publicar una oferta.</h2>
              <p>Estos puntos se muestran de forma visible para que esta página de muestra no se interprete como una promesa de servicio.</p>
            </header>
            <div className="course-faq-list" role="list" aria-label="Detalles pendientes de confirmación">
              {reviewGaps.map((gap) => (
                <div key={gap} role="listitem">
                  <p><strong>{gap}</strong></p>
                  <p>Pendiente de confirmación por AiT USA Institute.</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="course-program-closing" aria-labelledby="citizenship-closing-title">
          <div className="section-inner course-program-closing__layout">
            <div>
              <p className="section-kicker">Siguiente paso</p>
              <h2 id="citizenship-closing-title">Haz una pregunta directa y recibe información confirmada.</h2>
              <p>La conversación es el siguiente paso seguro mientras se confirman los detalles de esta ruta.</p>
            </div>
            <div className="course-program-closing__actions">
              <a className="button button--primary" href={site.whatsappHref} target="_blank" rel="noreferrer">
                Contactar por WhatsApp
                <i data-lucide="message-circle" aria-hidden="true" />
              </a>
              <a className="course-program-text-link" href="/cursos/">Explorar cursos publicados</a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
