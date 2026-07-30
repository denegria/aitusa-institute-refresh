import Image from "next/image";
import { conversionCtas, site } from "../../../src/content";
import { SiteFooter, SiteHeader } from "./SiteChrome";

function CourseHero({ program, editorial }) {
  return (
    <section className="course-program-hero" aria-labelledby="course-program-title">
      <div className="section-inner course-program-hero__main">
        <div className="course-program-hero__copy">
          <nav className="course-breadcrumb" aria-label="Ruta de navegación">
            <a href="/courses/">Cursos</a>
            <i data-lucide="chevron-right" aria-hidden="true" />
            <span aria-current="page">{program.title}</span>
          </nav>
          <p className="section-kicker">{editorial.eyebrow}</p>
          <h1 id="course-program-title">{program.title}</h1>
          <p className="course-program-hero__lead">{editorial.lead}</p>
          <div className="course-program-hero__actions">
            <a className="button button--primary" href={conversionCtas.placement.href}>
              {editorial.closing.primaryLabel}
              <i data-lucide="arrow-right" aria-hidden="true" />
            </a>
            <a
              className="course-program-text-link"
              href={conversionCtas.advisor.href}
              target="_blank"
              rel="noreferrer"
            >
              Hablar con admisiones
              <i data-lucide="message-circle" aria-hidden="true" />
            </a>
          </div>
          <p className="course-program-hero__note">
            Evaluación inicial sin compromiso. Tu grupo se confirma antes de la inscripción.
          </p>
        </div>
        <figure className="course-program-hero__media">
          <Image
            src={editorial.heroImage}
            alt={editorial.heroImageAlt}
            width={1448}
            height={1086}
            sizes="(max-width: 820px) 100vw, 52vw"
            priority
          />
          <figcaption>
            <span>Ruta guiada</span>
            <strong>{program.mode}</strong>
          </figcaption>
        </figure>
      </div>
      <div className="course-program-ledger">
        <dl className="section-inner" aria-label="Resumen académico del programa">
          {editorial.proofLedger.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function CourseOutcomes({ outcomes }) {
  return (
    <section className="course-program-section course-program-outcomes" aria-labelledby="course-outcomes-title">
      <div className="section-inner">
        <header className="course-program-heading section-heading--framed">
          <p className="section-kicker">Resultados del aprendizaje</p>
          <h2 id="course-outcomes-title">Lo que practicarás para usar el inglés con más confianza.</h2>
          <p>
            El programa conecta comprensión, conversación y una rutina sostenible en vez de
            tratar cada habilidad por separado.
          </p>
        </header>
        <ol className="course-outcome-list">
          {outcomes.map((outcome) => (
            <li key={outcome.number}>
              <span aria-hidden="true">{outcome.number}</span>
              <h3>{outcome.title}</h3>
              <p>{outcome.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function CoursePathway({ pathway }) {
  return (
    <section className="course-program-section course-program-pathway" id="niveles" aria-labelledby="course-pathway-title">
      <div className="section-inner course-program-pathway__layout">
        <header className="course-program-heading">
          <p className="section-kicker">Ruta por niveles</p>
          <h2 id="course-pathway-title">Una progresión clara, desde la base hasta una comunicación más amplia.</h2>
          <p>
            Tu punto de entrada se define con la evaluación inicial. No tienes que adivinar
            dónde comenzar.
          </p>
          <a className="course-program-text-link" href={conversionCtas.placement.href}>
            Ver mi nivel
            <i data-lucide="arrow-right" aria-hidden="true" />
          </a>
        </header>
        <ol className="course-pathway-list">
          {pathway.map((stage) => (
            <li key={stage.stage}>
              <div className="course-pathway-list__marker" aria-hidden="true">
                <span>{stage.stage.replace("Etapa ", "")}</span>
              </div>
              <div>
                <p className="course-pathway-list__eyebrow">{stage.stage} · {stage.focus}</p>
                <h3>{stage.title}</h3>
                <p>{stage.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function CourseMethod({ method }) {
  return (
    <section className="course-program-section course-program-method" id="metodo" aria-labelledby="course-method-title">
      <div className="section-inner course-program-method__layout">
        <figure className="course-program-method__media">
          <Image
            src={method.image}
            alt={method.imageAlt}
            width={1536}
            height={1024}
            sizes="(max-width: 820px) 100vw, 54vw"
          />
          <figcaption>Graphic Concept · comprensión visual y práctica guiada</figcaption>
        </figure>
        <div className="course-program-method__copy">
          <p className="section-kicker">{method.eyebrow}</p>
          <h2 id="course-method-title">{method.title}</h2>
          <p>{method.text}</p>
          <ul>
            {method.points.map((point) => (
              <li key={point}>
                <i data-lucide="check" aria-hidden="true" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function CourseLogistics({ editorial }) {
  return (
    <section className="course-program-section course-program-logistics" id="horarios" aria-labelledby="course-logistics-title">
      <div className="section-inner">
        <header className="course-program-heading section-heading--framed">
          <p className="section-kicker">Formatos y horarios</p>
          <h2 id="course-logistics-title">Una ruta académica que también debe funcionar con tu semana.</h2>
          <p>
            Compara cómo estudiar y revisa los bloques publicados. La combinación final se
            confirma según tu nivel y el grupo activo.
          </p>
        </header>
        <div className="course-logistics-layout">
          <div className="course-format-list" aria-label="Modalidades disponibles">
            {editorial.formats.map((format) => (
              <article key={format.title}>
                <i data-lucide={format.icon} aria-hidden="true" />
                <div>
                  <h3>{format.title}</h3>
                  <p>{format.text}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="course-schedule-panel">
            <p className="course-schedule-panel__label">Bloques publicados</p>
            <dl>
              {editorial.schedule.map((group) => (
                <div key={group.label}>
                  <dt>{group.label}</dt>
                  <dd>{group.times.join(" · ")}</dd>
                </div>
              ))}
            </dl>
            <p className="course-schedule-panel__note">{editorial.logisticsNote}</p>
            <a
              className="course-program-text-link"
              href={conversionCtas.advisor.href}
              target="_blank"
              rel="noreferrer"
            >
              Confirmar sede y horario
              <i data-lucide="arrow-right" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function CourseStory({ story }) {
  return (
    <section className="course-program-story" id="historia" aria-labelledby="course-story-title">
      <div className="section-inner course-program-story__layout">
        <div className="course-program-story__copy">
          <p className="section-kicker">{story.eyebrow}</p>
          <p className="course-program-story__identity">{story.name} · {story.role}</p>
          <h2 id="course-story-title">{story.title}</h2>
          <p>{story.text}</p>
          <span className="course-program-story__duration">
            <i data-lucide="play" aria-hidden="true" />
            Conversación completa · {story.duration}
          </span>
        </div>
        <figure className="course-program-story__media">
          <video
            controls
            playsInline
            preload="metadata"
            poster={story.poster}
            width={story.width}
            height={story.height}
            aria-label={story.videoLabel}
          >
            <source src={story.video} type="video/mp4" />
            Tu navegador no puede reproducir este video.
          </video>
          <figcaption>{story.videoLabel}</figcaption>
        </figure>
      </div>
    </section>
  );
}

function CourseFaq({ faqs }) {
  return (
    <section className="course-program-section course-program-faq" id="preguntas" aria-labelledby="course-faq-title">
      <div className="section-inner course-program-faq__layout">
        <header className="course-program-heading">
          <p className="section-kicker">Antes de inscribirte</p>
          <h2 id="course-faq-title">Respuestas claras para elegir con menos dudas.</h2>
          <p>
            Si tu situación es distinta, admisiones puede confirmar el grupo, la sede y el
            siguiente paso.
          </p>
        </header>
        <div className="course-faq-list">
          {faqs.map((item) => (
            <details key={item.question}>
              <summary>
                <span>{item.question}</span>
                <i data-lucide="plus" aria-hidden="true" />
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function CourseClosing({ closing }) {
  return (
    <section className="course-program-closing" aria-labelledby="course-closing-title">
      <div className="section-inner course-program-closing__layout">
        <div>
          <p className="section-kicker">{closing.eyebrow}</p>
          <h2 id="course-closing-title">{closing.title}</h2>
          <p>{closing.text}</p>
        </div>
        <div className="course-program-closing__actions">
          <a className="button button--primary" href={conversionCtas.placement.href}>
            {closing.primaryLabel}
            <i data-lucide="arrow-right" aria-hidden="true" />
          </a>
          <a
            className="course-program-text-link"
            href={site.whatsappHref}
            target="_blank"
            rel="noreferrer"
          >
            {closing.advisorLabel}
          </a>
        </div>
      </div>
    </section>
  );
}

export function CourseProgramPage({ program }) {
  const editorial = program.editorial;

  return (
    <>
      <SiteHeader activePage="courses" />
      <main
        className="course-program-page"
        data-course-template={editorial.version}
        data-course-program={program.slug}
        id="main-content"
      >
        <CourseHero program={program} editorial={editorial} />
        <CourseOutcomes outcomes={editorial.outcomes} />
        <CoursePathway pathway={editorial.pathway} />
        <CourseMethod method={editorial.method} />
        <CourseLogistics editorial={editorial} />
        <CourseStory story={editorial.story} />
        <CourseFaq faqs={editorial.faqs} />
        <CourseClosing closing={editorial.closing} />
      </main>
      <SiteFooter />
    </>
  );
}
