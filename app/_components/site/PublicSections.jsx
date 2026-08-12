import {
  conversionCtas,
  headquarters,
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
            <a href="/cursos/ingles-jovenes-adultos/"><i data-lucide="users-round" aria-hidden="true" /><span>Presencial</span></a>
            <a href="/cursos/ingles-online-adultos/"><i data-lucide="laptop" aria-hidden="true" /><span>Online</span></a>
            <a href="/cursos/ingles-hibrido-adultos/"><i data-lucide="monitor-smartphone" aria-hidden="true" /><span>Híbrido</span></a>
          </nav>
        </div>
        <figure className="hero__visual">
          <aside className="hero__spain-launch" aria-label="Spain Launch: próximamente en España">
            <span className="hero__spain-launch__pulse" aria-hidden="true" />
            <span className="hero__spain-launch__eyebrow">Spain Launch</span>
            <strong>AIT USA Institute llega a España</strong>
            <span className="hero__spain-launch__detail">Próximamente</span>
          </aside>
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
    <section className="method-story-section" id="metodo" aria-labelledby="method-title">
      <div className="method-story-frame">
        <div className="method-story__opening">
          <header className="method-story__intro section-heading section-heading--framed">
            <p className="method-kicker">{methodNarrative.eyebrow || "Método Graphic Concept"}</p>
            <h2 id="method-title" className="method-story__display-title">
              {(methodNarrative.headingLines || [methodNarrative.heading || ""]).map((line, index, lines) => (
                <span key={line}>{line}{index < lines.length - 1 ? " " : ""}</span>
              ))}
            </h2>
            <p className="method-story__intro-copy">{methodNarrative.introduction || ""}</p>
          </header>
        </div>
      </div>
      <section className="method-story__community" aria-labelledby="method-community-title">
        <div className="method-story__community-inner">
          <header className="method-story__community-copy">
            <p className="method-story-kicker">{methodNarrative.painEyebrow || "Lo que escuchamos"}</p>
            <h3 id="method-community-title">{methodNarrative.painHeading || "¿Te suena familiar?"}</h3>
          </header>
          <ul className="method-story__questions" aria-label="Preguntas comunes al aprender inglés">
            {(methodNarrative.painPoints || []).map((item) => (
              <li key={item}>
                <p>{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <div className="method-story-frame">
        <section className="method-story__conclusion" aria-labelledby="method-principles-title">
          <div className="method-story__principles-heading">
            <p className="method-story-kicker">{methodNarrative.reasonsEyebrow || "Nuestra respuesta"}</p>
            <h3 id="method-principles-title">{methodNarrative.reasonsHeading || "Lo que cambia cuando entiendes el método."}</h3>
          </div>
          <ul className="method-reasons" aria-label="Resultados prácticos del método">
            {solutionCharacteristics.map((item) => (
              <li key={item.key}>
                <span className="method-reason__icon" aria-hidden="true">
                  <i data-lucide={item.icon || "circle-check"} />
                </span>
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
  {
    label: "GED",
    description: "Refuerza tu preparación académica con una ruta concreta.",
    href: "/cursos/ged/",
    cta: "Ver programa",
  },
  {
    label: "Computación básica",
    description: "Aprende herramientas digitales para tus próximos pasos.",
    href: "/cursos/computacion-basica/",
    cta: "Ver programa",
  },
  {
    label: "Computación para oficina",
    description: "Practica habilidades digitales útiles para el trabajo.",
    href: "/cursos/computacion-oficina/",
    cta: "Ver programa",
  },
  {
    label: "Español para extranjeros",
    description: "Desarrolla español práctico para la vida diaria y el trabajo.",
    href: "/cursos/espanol-extranjeros/",
    cta: "Ver programa",
  },
  {
    label: "Tutorías de matemáticas",
    description: "Recibe apoyo enfocado para una meta académica puntual.",
    href: "/cursos/tutorias-matematicas/",
    cta: "Ver programa",
  },
  {
    label: "Ciudadanía",
    description: "Consulta la ruta de preparación cívica disponible para tu objetivo.",
    href: "/cursos/",
    cta: "Consultar ruta",
  },
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
              Compara las clases presenciales, híbridas y online para elegir cómo quieres estudiar.
            </span>
            <span className="offer-path__intro-compact">
              Compara presencial, híbrido y online.
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
      </div>
    </section>
  );
}

export function SupportingCoursesSection() {
  return (
    <section className="section supporting-courses-section" id="cursos-apoyo" aria-labelledby="supporting-courses-title">
      <div className="section-inner supporting-courses-section__inner">
        <header className="section-heading section-heading--framed supporting-courses-section__heading">
          <p className="section-kicker">Más rutas para metas concretas</p>
          <h2 id="supporting-courses-title">Cursos de apoyo.</h2>
          <p>
            Si buscas una meta académica, laboral o de integración, aquí puedes comparar otras rutas de AIT USA.
          </p>
        </header>
        <div className="supporting-courses-grid">
          {supportingPrograms.map((program) => (
            <article className="offer-node offer-node--secondary supporting-course-card" key={program.label}>
              <div>
                <span className="offer-node__status supporting-course-card__status">Curso de apoyo</span>
                <h3>{program.label}</h3>
                <p>{program.description}</p>
              </div>
              <a className="offer-node__link supporting-course-card__link" href={program.href} aria-label={`${program.cta}: ${program.label}`}>
                <span>{program.cta}</span>
                <i data-lucide="arrow-right" aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LocationsSection() {
  const mapped = locations.filter((location) => location.status !== "online");
  const locationList = [
    ...mapped,
    {
      ...headquarters,
      mapKey: "new-york-hq",
      address: "Nueva York · Coordinación administrativa y atención online",
      bestFor: "Ideal si necesitas coordinación administrativa o atención online.",
      highlight: "HQ de AIT USA Institute para estudiantes dentro y fuera de Nueva Jersey.",
      cta: "Consultar HQ",
    },
  ];

  return (
    <section className="section section--white" id="sedes">
      <div className="section-inner">
        <div className="section-heading section-heading--framed">
          <p className="section-kicker">Nueva Jersey · coordinación en Nueva York</p>
          <h2 id="sedes-title">Sedes cerca de ti.</h2>
          <p>Revisa las sedes presenciales y coordina tu atención según la alternativa más conveniente.</p>
        </div>
        <LocationExplorer
          locations={locationList}
          hours={mapped.find((location) => location.mapKey === "bound-brook")?.hours || []}
          hoursTitle="Bound Brook · Sede principal"
          hoursEyebrow="Horario de atención"
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
          <p>Aquí respondemos dudas sobre tu nivel, la práctica, los horarios y las modalidades.</p>
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
