import {
  conversionCtas,
  institutionalProof,
  locations,
  bookLibrary,
  methodNarrative,
  painHero,
  productOfferings,
  site,
  solutionCharacteristics,
} from "../../../src/content";
import { CallbackDialog, FaqList, MethodVideo } from "./InteractiveSections";
import { LocationExplorer } from "./LocationExplorer";

export function HeroSection() {
  return (
    <section className="hero" id="inicio">
      <div className="hero__main">
        <div className="hero__copy">
          <div className="hero__title-block">
            <p className="hero__kicker">{painHero.eyebrow || ""}</p>
            <h1>
              <span className="hero__headline-lead">{painHero.headlineLead || ""}</span>
              <span className="hero__headline-emphasis">
                {painHero.headlineEmphasis || painHero.headline || ""}
              </span>
            </h1>
            {painHero.headlineAccent ? <p className="hero__headline-accent">{painHero.headlineAccent}</p> : null}
          </div>
          <nav className="hero__modalities" aria-label="Formatos de clase">
            <a href="/cursos/#ingles-presencial"><i data-lucide="users-round" aria-hidden="true" /><span>Presencial</span></a>
            <a href="/cursos/#ingles-online"><i data-lucide="laptop" aria-hidden="true" /><span>Online</span></a>
            <a href="/cursos/#ingles-hibrido"><i data-lucide="monitor-smartphone" aria-hidden="true" /><span>Híbrido</span></a>
          </nav>
        </div>
        <figure className="hero__visual">
          <img
            src={site.images.approvedHero}
            alt="Asesora de AIT USA orientando a una estudiante adulta en un salón de inglés."
            width="1536"
            height="1024"
            fetchPriority="high"
          />
        </figure>
      </div>
      <aside className="hero__institutional-band" aria-label="Trayectoria de AIT USA Institute">
        <div className="hero__institutional-inner">
          {institutionalProof.map((proof) => (
            <article className="hero__institutional-fact" key={proof.value}>
              <strong>{proof.value}</strong>
              <span>{proof.label}</span>
            </article>
          ))}
        </div>
      </aside>
    </section>
  );
}

export function MethodSection() {
  return (
    <section className="method-section" id="metodo" aria-labelledby="method-title">
      <div className="method-editorial">
        <div className="method-editorial__opening">
          <header className="method-editorial__intro section-heading section-heading--framed">
            <p className="method-kicker">{methodNarrative.eyebrow || "Método Graphic Concept"}</p>
            <h2 id="method-title" className="method-editorial__display-title">
              {(methodNarrative.headingLines || [methodNarrative.heading || ""]).map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>
            <p className="method-editorial__promise">{methodNarrative.promise || ""}</p>
            <p className="method-editorial__intro-copy">{methodNarrative.introduction || ""}</p>
          </header>
        </div>
      </div>
      <section className="method-editorial__community" aria-labelledby="method-community-title">
        <div className="method-editorial__community-inner">
          <header className="method-editorial__community-copy">
            <p className="method-story-kicker">{methodNarrative.painEyebrow || "Lo que escuchamos"}</p>
            <h3 id="method-community-title">{methodNarrative.painHeading || "¿Te suena familiar?"}</h3>
            <p>{methodNarrative.painIntroduction || ""}</p>
          </header>
          <ul className="method-editorial__questions" aria-label="Preguntas comunes al aprender inglés">
            {(methodNarrative.painPoints || []).map((item) => (
              <li key={item}>
                <p>{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <div className="method-editorial">
        <div className="method-editorial__bridge">
          <div className="method-editorial__bridge-copy">
            <p className="method-story-kicker">{methodNarrative.solutionEyebrow || "La respuesta"}</p>
            <h3>{methodNarrative.solutionHeading || "Una ruta clara para comprender, hablar y avanzar."}</h3>
          </div>
          <p className="method-editorial__bridge-intro">{methodNarrative.solutionIntroduction || ""}</p>
        </div>
        <section className="method-editorial__conclusion" aria-labelledby="method-principles-title">
          <div className="method-editorial__principles-heading">
            <p className="method-story-kicker">{methodNarrative.reasonsEyebrow || "De la pregunta a la práctica"}</p>
            <h3 id="method-principles-title">{methodNarrative.reasonsHeading || "Tres razones para avanzar con más facilidad."}</h3>
          </div>
          <ul className="method-reasons" aria-label="Resumen del método en tres razones">
            {solutionCharacteristics.map((item) => (
              <li key={item.key}>
                <div><h4>{item.title}</h4><p>{item.body}</p></div>
              </li>
            ))}
          </ul>
          <MethodVideo narrative={methodNarrative} />
        </section>
      </div>
    </section>
  );
}

const supportingPrograms = [
  { label: "GED", href: "/cursos/ged/" },
  { label: "Computación", href: "/cursos/#computacion-y-cursos-tecnicos" },
  { label: "Español para extranjeros", href: "/cursos/espanol-extranjeros/" },
  { label: "Tutorías de matemáticas", href: "/cursos/tutorias-matematicas/" },
];

export function OfferingPathSection() {
  return (
    <section className="section section--soft" id="cursos">
      <div className="section-inner offer-path">
        <div className="section-heading section-heading--framed">
          <p className="section-kicker">Presencial, híbrido u online</p>
          <h2>¿Cómo quieres estudiar?</h2>
          <p className="offer-path__intro">
            <span className="offer-path__intro-full">
              Compara las clases presenciales, híbridas y online. Si buscas otra meta, también puedes explorar nuestros programas de apoyo.
            </span>
            <span className="offer-path__intro-compact">
              Compara presencial, híbrido y online; después explora otros programas.
            </span>
          </p>
        </div>
        <div className="offer-map" aria-label="Opciones principales de estudio">
          {productOfferings.slice(0, 3).map((item) => (
            <article className={`offer-node offer-node--${item.emphasis || "secondary"}`} key={item.key}>
              <div>
                {item.emphasis === "primary" ? <span className="offer-node__status">Programa principal</span> : null}
                <h3>{item.title}</h3>
                <p>
                  <span className="offer-node__summary-full">
                    {item.summaryLead ? <strong className="offer-node__summary-lead">{item.summaryLead}</strong> : null}
                    {item.summaryLead ? " " : ""}
                    {item.summary}
                  </span>
                  <span className="offer-node__summary-compact">{item.mobileSummary || item.summary}</span>
                </p>
              </div>
              <a className="offer-node__link" href={item.href} aria-label={item.cta}>
                <span className="offer-node__link-full">{item.cta}</span>
                <i data-lucide="arrow-right" aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
        <nav className="catalog-programs" aria-label="Otros programas de AIT USA">
          <p className="catalog-programs__label">También ofrecemos</p>
          <ul className="catalog-programs__links">
            {supportingPrograms.map((program) => (
              <li key={program.href}><a className="catalog-programs__link" href={program.href}>{program.label}</a></li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}

export function LocationsSection() {
  const mapped = locations.filter((location) => !["pending", "online"].includes(location.status));
  const headquarters = mapped.find((location) => location.mapKey === "bound-brook");
  const hours = headquarters?.hours || [];

  return (
    <section className="section section--white" id="sedes">
      <div className="section-inner">
        <div className="section-heading section-heading--framed">
          <p className="section-kicker">Nueva Jersey</p>
          <h2 id="sedes-title">Sedes cerca de ti.</h2>
          <p>Revisa ubicaciones y horarios para elegir la alternativa más conveniente.</p>
        </div>
        <LocationExplorer
          locations={mapped}
          hours={hours}
          hoursTitle="Bound Brook · Sede principal"
          hoursEyebrow="Horario de atención administrativo"
          whatsappHref={site.whatsappHref}
        />
      </div>
    </section>
  );
}

export function BooksSection() {
  const galleryBooks = bookLibrary.levels.flatMap((level) => level.books);

  return (
    <section className="section books-section" id="libros" aria-labelledby="books-title">
      <div className="section-inner books-section__inner">
        <header className="section-heading section-heading--framed books-section__heading">
          <p className="section-kicker">Ruta Graphic Concept</p>
          <h2 id="books-title">Nuestros libros.</h2>
        </header>
        <div className="books-gallery" aria-label="Colección de libros de AIT USA Institute">
          <figure className="books-gallery__intro">
            <img
              src={bookLibrary.intro.image}
              alt={bookLibrary.intro.imageAlt}
              width="160"
              height="209"
              loading="lazy"
              decoding="async"
            />
          </figure>
          {galleryBooks.map((book, index) => (
            <figure className={`books-gallery__book books-gallery__book--${index + 1}`} key={book.title}>
              <img
                src={book.image}
                alt={book.imageAlt}
                width="177"
                height="219"
                loading="lazy"
                decoding="async"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqSection() {
  return (
    <section className="section faq-section" id="faq">
      <div className="section-inner faq-layout">
        <div className="section-heading section-heading--framed">
          <span className="chapter-accent chapter-accent--mobile" aria-hidden="true" />
          <p className="section-kicker">Preguntas frecuentes</p>
          <h2>¿Todavía tienes dudas?</h2>
          <p>Aquí respondemos las preguntas que más escuchamos de nuestros estudiantes.</p>
        </div>
        <FaqList />
      </div>
    </section>
  );
}

export function FinalCtaSection() {
  return (
    <section className="section final-cta-section" id="contacto" aria-labelledby="contacto-title">
      <div className="section-inner final-cta-layout">
        <div className="final-cta-copy">
          <div className="section-heading section-heading--framed">
            <p className="section-kicker">Empieza aquí</p>
            <h2 id="contacto-title">¿Listo para empezar?</h2>
            <p>Haz el examen de ubicación y te ayudamos a elegir tu nivel, horario y modalidad. La orientación inicial es gratuita.</p>
          </div>
          <div className="final-cta-conversion">
            <div className="final-cta-actions">
              <a className="button button--primary" href={conversionCtas.placement?.href || "/placement-test/"}>
                Encuentra tu nivel<i data-lucide="arrow-right" aria-hidden="true" />
              </a>
            </div>
            <CallbackDialog />
          </div>
        </div>
      </div>
    </section>
  );
}
