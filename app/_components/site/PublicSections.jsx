import {
  headquarters,
  institutionalProof,
  locations,
  bookLibrary,
  methodNarrative,
  painHero,
  productOfferings,
  schoolFaqs,
  site,
  solutionCharacteristics,
} from "../../../src/content";
import Image from "next/image";
import { CallbackDialog, FaqList, MethodVideo } from "./InteractiveSections";
import { LocationExplorer } from "./LocationExplorer";
import Link from "next/link";
import { catalogChoices, catalogHref } from "../../../src/courseDiscovery";

export function HeroSection() {
  return (
    <section className="approved-hero" id="inicio" aria-labelledby="home-hero-title">
      <div className="approved-hero__scene">
        <div className="approved-hero__copy">
          <p className="approved-hero__eyebrow">{painHero.eyebrow}</p>
          <h1 id="home-hero-title">
            <span>Tu próximo capítulo,</span><span>en inglés.</span>
          </h1>
          <p className="approved-hero__promise">Aprende a conversar, estudiar y trabajar con más confianza, en Nueva Jersey o en clases online en vivo.</p>
          <Link className="approved-hero__cta" href="#cursos">Encuentra tu clase de inglés <i data-lucide="arrow-right" aria-hidden="true" /></Link>
          <Link className="approved-hero__alternate" href="/contactanos/">Prefiero hablar con admisiones <span aria-hidden="true">→</span></Link>
        </div>
        <div className="approved-hero__art" aria-hidden="true">
            <img
              src={site.images.classroomHero}
              alt=""
              width="1756"
              height="896"
              fetchPriority="high"
            />
        </div>
      </div>
      <aside className="approved-hero__facts" aria-label="Trayectoria de AIT USA Institute">
        <div className="approved-hero__facts-inner">
          {institutionalProof.map((proof) => (
            <article className="approved-hero__fact" key={proof.value}>
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
    <section className="method-story-section cohesion-method" id="metodo" aria-labelledby="method-title">
      <div className="section-inner">
          <header className="section-heading section-heading--framed">
            <p className="method-kicker">Método Graphic Concept</p>
            <h2 id="method-title" className="method-story__display-title">
              {(methodNarrative.headingLines || [methodNarrative.heading || ""]).map((line, index, lines) => (
                <span key={line}>{line}{index < lines.length - 1 ? " " : ""}</span>
              ))}
            </h2>
            <p>Un método visual para comprender el inglés y practicar cómo usarlo en el trabajo, los estudios y la vida diaria, sin memorizar listas interminables.</p>
          </header>
        <div className="cohesion-method__practice">
          <ul className="cohesion-method__reasons" aria-label="Cómo practicarás con el método">
            {solutionCharacteristics.map((item) => (
              <li key={item.key}>
                <span className="method-reason__icon" aria-hidden="true">
                  {item.iconImage ? (
                    <Image
                      className="method-reason__icon-image"
                      src={item.iconImage}
                      alt=""
                      width={64}
                      height={64}
                    />
                  ) : (
                    <i data-lucide={item.icon || "circle-check"} />
                  )}
                </span>
                <div><h3>{item.title}</h3><p>{item.body}</p></div>
              </li>
            ))}
          </ul>
          <MethodVideo narrative={methodNarrative} />
        </div>
        <BooksSection />
      </div>
    </section>
  );
}

export function StudyGoalsSection() {
  const secondaryChoices = catalogChoices.filter((choice) => choice.key !== "english-paths");

  return (
    <section className="section study-goals" id="elige-tu-curso" aria-labelledby="study-goals-title">
      <div className="section-inner">
        <header className="section-heading">
          <p className="section-kicker">Otros caminos en AIT USA</p>
          <h2 id="study-goals-title">¿Buscas una meta diferente al inglés?</h2>
          <p>Encuentra una ruta clara para tu meta académica, digital o de español.</p>
        </header>
        <div className="study-goals__grid">
          {secondaryChoices.map((choice) => (
            <Link className="study-goal" href={catalogHref(choice.key)} key={choice.key}>
              <span className="study-goal__icon" aria-hidden="true"><i data-lucide={choice.icon} /></span>
              <span className="study-goal__label">Programa complementario</span>
              <h3>{choice.goal}</h3>
              <p>{choice.description}</p>
              <span className="study-goal__cta">{choice.label} <span aria-hidden="true">→</span></span>
            </Link>
          ))}
        </div>
        <div className="study-goals__notes">
          <p><strong>¿Buscas una sede?</strong> Revisa las sedes de Nueva Jersey, los puntos con cita previa y la coordinación administrativa en Nueva York. <a href="#sedes">Ver ubicaciones</a>.</p>
          <p><strong>Ciudadanía:</strong> información en preparación; aún no es un curso publicado. <Link href="/ciudadania/">Consultar el estado</Link>.</p>
        </div>
      </div>
    </section>
  );
}

const supportingPrograms = [
  {
    label: "GED",
    description: "Refuerza tu preparación académica con una ruta concreta.",
    href: "/cursos/ged/",
    cta: "Explorar GED",
  },
  {
    label: "Computación básica",
    description: "Aprende herramientas digitales para tus próximos pasos.",
    href: "/cursos/computacion-basica/",
    cta: "Ver ruta básica",
  },
  {
    label: "Computación para oficina",
    description: "Practica habilidades digitales útiles para el trabajo.",
    href: "/cursos/computacion-oficina/",
    cta: "Ver ruta oficina",
  },
  {
    label: "Español para extranjeros",
    description: "Desarrolla español práctico para la vida diaria y el trabajo.",
    href: "/cursos/espanol-extranjeros/",
    cta: "Practicar español",
  },
  {
    label: "Tutorías de matemáticas",
    description: "Recibe apoyo enfocado para una meta académica puntual.",
    href: "/cursos/tutorias-matematicas/",
    cta: "Ver tutorías",
  },
  {
    label: "Ciudadanía",
    description: "Información en preparación. Aún no es un curso publicado; consulta el estado con admisiones.",
    href: "/ciudadania/",
    cta: "Consultar ciudadanía",
  },
];

export function OfferingPathSection() {
  return (
    <section className="section section--soft" id="cursos">
      <div className="section-inner offer-path">
        <div className="section-heading section-heading--framed">
          <p className="section-kicker">Presencial, híbrido u online</p>
          <h2>¿Cómo quieres estudiar inglés?</h2>
          <p className="offer-path__intro">
            <span className="offer-path__intro-full">
              Compara las clases de inglés presenciales, híbridas y online.
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
                <span className="offer-node__status">{item.badge}</span>
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
        <div className="offer-path__next-step">
          <p><strong>¿No sabes por dónde empezar?</strong> Admisiones te ayuda a elegir modalidad, grupo y horario.</p>
          <a className="home-text-link" href="/contactanos/">Pedir orientación <span aria-hidden="true">→</span></a>
          <details className="placement-effort">
            <summary>Ya quiero conocer mi nivel de inglés</summary>
            <p>El examen tiene 62 preguntas y toma aproximadamente 10–15 minutos. Para recibir el resultado necesitas verificar tu email y crear tu cuenta.</p>
            <a className="home-text-link" href="/placement-test/">Comenzar el examen de nivel <span aria-hidden="true">→</span></a>
          </details>
          <p className="offer-path__online-note">¿Estás en España o en otro país? <Link href="/cursos/ingles-online-adultos/">Consulta las clases online y tu zona horaria</Link>.</p>
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
                <h3>{program.label}</h3>
                <p>{program.description}</p>
              </div>
              <a className="offer-node__link supporting-course-card__link" href={program.href} aria-label={`${program.cta}: ${program.label}`}>
                <span className="supporting-course-card__link-label">{program.cta}</span>
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
          <p className="section-kicker">Sedes y coordinación</p>
          <h2 id="sedes-title">Sedes en Nueva Jersey.</h2>
          <p>El mapa muestra nuestras sedes presenciales y la coordinación en Nueva York. ¿Estás en España? <Link className="locations-online-link" href="/cursos/ingles-online-adultos/">Conoce el curso de inglés online</Link>.</p>
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
  const featuredBooks = [bookLibrary.intro, galleryBooks[0], galleryBooks[2]];

  return (
    <div className="cohesion-books" id="libros" aria-labelledby="books-title">
        <header className="cohesion-books__copy">
          <p className="section-kicker">Materiales propios</p>
          <h3 id="books-title">Una guía para cada paso.</h3>
          <p>Los libros acompañan la práctica en clase. <a href="/cursos/ingles-jovenes-adultos/#niveles">Conoce la progresión por niveles</a>; admisiones confirma el material de tu grupo.</p>
          <details className="cohesion-books__collection">
            <summary>Ver la colección completa</summary>
            <div className="cohesion-books__all">
              {galleryBooks.map((book) => <figure key={book.title}><img src={book.image} alt={book.imageAlt} width="177" height="219" loading="lazy" /><figcaption>{book.title}</figcaption></figure>)}
            </div>
          </details>
        </header>
        <div className="cohesion-books__covers" aria-label="Ejemplos de materiales Graphic Concept">
          {featuredBooks.map((book) => (
            <figure key={book.title}>
              <img
                src={book.image}
                alt={book.imageAlt}
                width="177"
                height="219"
                loading="lazy"
                decoding="async"
              />
              <figcaption>{book.title}</figcaption>
            </figure>
          ))}
        </div>
    </div>
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
          <p>Resolvemos dudas sobre nuestros programas, cómo enseñamos y los pasos para inscribirte.</p>
        </div>
        <FaqList items={schoolFaqs} />
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
            <p>¿No sabes qué curso o modalidad elegir? Cuéntanos tu objetivo y admisiones te contactará para orientarte sin costo.</p>
          </div>
          <div className="final-cta-conversion">
            <CallbackDialog primary compact triggerLabel="Pedir orientación gratuita" />
            <div className="final-cta-actions">
              <a className="final-cta-register-link" href="/inscribete/">Inscribirme directamente<i data-lucide="arrow-right" aria-hidden="true" /></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
