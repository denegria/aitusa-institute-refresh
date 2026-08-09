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
        <header className="method-editorial__intro section-heading section-heading--framed">
          <p className="method-kicker">{methodNarrative.eyebrow || "Método Graphic Concept"}</p>
          <h2 id="method-title">{methodNarrative.heading || ""}</h2>
          <p className="method-editorial__promise">{methodNarrative.promise || ""}</p>
          <p className="method-editorial__intro-copy">{methodNarrative.introduction || ""}</p>
        </header>
        <section className="method-editorial__pain" aria-labelledby="method-pain-title">
          <div className="method-editorial__pain-copy">
            <p className="method-story-kicker">{methodNarrative.painEyebrow || "Lo que escuchamos"}</p>
            <h3 id="method-pain-title">{methodNarrative.painHeading || "¿Te suena familiar?"}</h3>
            <p>{methodNarrative.painIntroduction || ""}</p>
          </div>
          <ul className="method-editorial__questions" aria-label="Preguntas comunes al aprender inglés">
            {(methodNarrative.painPoints || []).map((item, index) => (
              <li key={item}>
                <span className="method-question__index">{String(index + 1).padStart(2, "0")}</span>
                <p>{item}</p>
              </li>
            ))}
          </ul>
        </section>
        <div className="method-editorial__bridge">
          <p className="method-story-kicker">{methodNarrative.solutionEyebrow || "La respuesta"}</p>
          <h3>{methodNarrative.solutionHeading || "Una ruta clara para comprender, hablar y avanzar."}</h3>
          <p>{methodNarrative.solutionIntroduction || ""}</p>
        </div>
        <div className="method-editorial__solution">
          <div className="method-editorial__solution-copy">
            <p className="method-story-kicker">{methodNarrative.reasonsEyebrow || "De la pregunta a la práctica"}</p>
            <h3>{methodNarrative.reasonsHeading || "Tres razones para avanzar con más facilidad."}</h3>
            <ul className="method-reasons" aria-label="Resumen del método en tres razones">
              {solutionCharacteristics.map((item) => (
                <li key={item.key}>
                  <span className="method-reason__icon" aria-hidden="true">
                    <i data-lucide={item.icon || "circle-check"} />
                  </span>
                  <div><h4>{item.title}</h4><p>{item.body}</p></div>
                </li>
              ))}
            </ul>
          </div>
          <MethodVideo narrative={methodNarrative} />
        </div>
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
  return (
    <section className="section books-section" id="libros" aria-labelledby="books-title">
      <div className="section-inner books-section__inner">
        <header className="section-heading section-heading--framed books-section__heading">
          <p className="section-kicker">Ruta Graphic Concept</p>
          <h2 id="books-title">Nuestros libros.</h2>
          <p>Una ruta visual de apoyo para que cada nivel tenga una dirección clara, práctica y fácil de seguir.</p>
        </header>
        <div className="books-showcase">
          <article className="books-showcase__intro">
            <div className="books-showcase__intro-copy">
              <img className="books-showcase__logo" src={site.images.logo} alt="AIT USA Institute" width="96" height="96" />
              <p className="books-showcase__eyebrow">{bookLibrary.intro.eyebrow}</p>
              <h3>{bookLibrary.intro.title}</h3>
              <p>{bookLibrary.intro.description}</p>
            </div>
            <figure className="book-card book-card--intro">
              <img src={bookLibrary.intro.image} alt={bookLibrary.intro.imageAlt} width="160" height="209" loading="lazy" decoding="async" />
              <figcaption>English introductory book</figcaption>
            </figure>
          </article>
          <div className="books-showcase__levels">
            {bookLibrary.levels.map((level) => (
              <article className="book-level" key={level.key}>
                <header className="book-level__heading">
                  <p>{level.eyebrow}</p>
                  <h3>{level.title}</h3>
                </header>
                <ul className="book-level__covers" aria-label={`Libros: ${level.title}`}>
                  {level.books.map((book) => (
                    <li className="book-card" key={book.title}>
                      <img src={book.image} alt={book.imageAlt} width="177" height="219" loading="lazy" decoding="async" />
                      <span>{book.title}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
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
