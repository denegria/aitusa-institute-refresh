import Image from "next/image";
import { conversionCtas, programs, site } from "../../../src/content";
import { SiteFooter, SiteHeader } from "./SiteChrome";

const defaultSectionCopy = {
  outcomes: {
    eyebrow: "Resultados del aprendizaje",
    title: "Lo que practicarás para usar el inglés con más confianza.",
    text:
      "El programa conecta comprensión, conversación y una rutina sostenible en vez de tratar cada habilidad por separado.",
  },
  pathway: {
    eyebrow: "Ruta por niveles",
    title: "Una progresión clara, desde la base hasta una comunicación más amplia.",
    text:
      "Tu punto de entrada se define con la evaluación inicial. No tienes que adivinar dónde comenzar.",
    actionLabel: "Ver mi nivel",
    actionHref: conversionCtas.placement.href,
  },
  inquiryPathway: {
    eyebrow: "Siguiente paso",
    title: "Confirma si este programa encaja con tu objetivo.",
    text:
      "Comparte tu objetivo, punto de partida y disponibilidad por WhatsApp para recibir orientación sobre el programa.",
    actionLabel: "Consultar por WhatsApp",
    actionHref: conversionCtas.advisor.href,
    external: true,
  },
  logistics: {
    eyebrow: "Formatos y horarios",
    title: "Una ruta académica que también debe funcionar con tu semana.",
    text:
      "Compara cómo estudiar y revisa los bloques publicados. La combinación final se confirma según tu nivel y el grupo activo.",
    scheduleLabel: "Bloques publicados",
    actionLabel: "Confirmar sede y horario",
  },
  faq: {
    eyebrow: "Antes de inscribirte",
    title: "Respuestas claras para elegir con menos dudas.",
    text:
      "Si tu situación es distinta, admisiones puede confirmar el grupo, la sede y el siguiente paso.",
  },
};

function isEnglishProgram(program) {
  return program.category === "ingles";
}

function defaultProgramInquiryCta(program) {
  return {
    label: `Consultar ${program.title.toLowerCase()}`,
    href: conversionCtas.advisor.href,
    external: true,
  };
}

function externalLinkProps(link) {
  return link?.external ? { target: "_blank", rel: "noreferrer" } : {};
}

function CourseHero({ program, editorial }) {
  const englishProgram = isEnglishProgram(program);
  const primaryCta = {
    ...(englishProgram
      ? {
          label: editorial.closing?.primaryLabel || conversionCtas.placement.label,
          href: conversionCtas.placement.href,
          external: false,
        }
      : defaultProgramInquiryCta(program)),
    ...editorial.primaryCta,
  };
  const advisorCta = {
    label: "Hablar con admisiones",
    href: conversionCtas.advisor.href,
    external: true,
    ...editorial.advisorCta,
  };

  return (
    <section className="course-program-hero" aria-labelledby="course-program-title">
      <div className="section-inner course-program-hero__main">
        <div className="course-program-hero__copy">
          <nav className="course-breadcrumb" aria-label="Ruta de navegación">
            <a href="/cursos/">Cursos</a>
            <i data-lucide="chevron-right" aria-hidden="true" />
            <span aria-current="page">{program.title}</span>
          </nav>
          <p className="section-kicker">{editorial.eyebrow}</p>
          <h1 id="course-program-title">{program.title}</h1>
          <p className="course-program-hero__lead">{editorial.lead}</p>
          <div className="course-program-hero__actions">
            <a
              className="button button--primary"
              href={primaryCta.href}
              {...externalLinkProps(primaryCta)}
            >
              {primaryCta.label}
              <i data-lucide="arrow-right" aria-hidden="true" />
            </a>
            <a
              className="course-program-text-link"
              href={advisorCta.href}
              {...externalLinkProps(advisorCta)}
            >
              {advisorCta.label}
              <i data-lucide="message-circle" aria-hidden="true" />
            </a>
          </div>
          <p className="course-program-hero__note">
            {editorial.heroNote ||
              (englishProgram
                ? "Evaluación inicial sin compromiso. Tu grupo se confirma antes de la inscripción."
                : "Admisiones confirma el punto de inicio, el grupo y el horario antes de comenzar.")}
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

function CourseOutcomes({ outcomes, copy = defaultSectionCopy.outcomes }) {
  return (
    <section className="course-program-section course-program-outcomes" aria-labelledby="course-outcomes-title">
      <div className="section-inner">
        <header className="course-program-heading section-heading--framed">
          <p className="section-kicker">{copy.eyebrow}</p>
          <h2 id="course-outcomes-title">{copy.title}</h2>
          <p>{copy.text}</p>
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

function CoursePathway({ pathway, copy = defaultSectionCopy.pathway }) {
  return (
    <section
      className="course-program-section course-program-pathway"
      id={copy.id || "niveles"}
      aria-labelledby="course-pathway-title"
    >
      <div className="section-inner course-program-pathway__layout">
        <header className="course-program-heading">
          <p className="section-kicker">{copy.eyebrow}</p>
          <h2 id="course-pathway-title">{copy.title}</h2>
          <p>{copy.text}</p>
          {copy.actionLabel && copy.actionHref ? (
            <a
              className="course-program-text-link"
              href={copy.actionHref}
              {...externalLinkProps(copy)}
            >
              {copy.actionLabel}
              <i data-lucide="arrow-right" aria-hidden="true" />
            </a>
          ) : null}
        </header>
        <ol className="course-pathway-list">
          {pathway.map((stage) => (
            <li key={stage.stage}>
              <div className="course-pathway-list__marker" aria-hidden="true">
                <span>{stage.marker || stage.stage.replace(/^(Etapa|Área)\s+/, "")}</span>
              </div>
              <div>
                <p className="course-pathway-list__eyebrow">
                  {stage.stage}{stage.focus ? ` · ${stage.focus}` : ""}
                </p>
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
          <figcaption>
            {method.figcaption || "Graphic Concept · comprensión visual y práctica guiada"}
          </figcaption>
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

function CourseLogistics({ editorial, copy = defaultSectionCopy.logistics }) {
  return (
    <section className="course-program-section course-program-logistics" id="horarios" aria-labelledby="course-logistics-title">
      <div className="section-inner">
        <header className="course-program-heading section-heading--framed">
          <p className="section-kicker">{copy.eyebrow}</p>
          <h2 id="course-logistics-title">{copy.title}</h2>
          <p>{copy.text}</p>
        </header>
        <div className="course-logistics-layout">
          <div
            className="course-format-list"
            aria-label={copy.formatsLabel || "Modalidades disponibles"}
          >
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
            <p className="course-schedule-panel__label">{copy.scheduleLabel}</p>
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
              {copy.actionLabel}
              <i data-lucide="arrow-right" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function CourseStory({ story }) {
  const videoDescriptionId = "course-story-video-description";
  const transcriptNoteId = "course-story-video-transcript-note";

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
            aria-describedby={`${videoDescriptionId} ${transcriptNoteId}`}
          >
            <source src={story.video} type="video/mp4" />
            Tu navegador no puede reproducir este video.
          </video>
          <figcaption>{story.videoLabel}</figcaption>
          <p id={videoDescriptionId}>
            <strong>Alternativa de texto:</strong> {story.text}
          </p>
          <p id={transcriptNoteId}>
            No hay subtítulos ni una transcripción verificable disponible para este video.
          </p>
        </figure>
      </div>
    </section>
  );
}

function CourseFaq({ faqs, copy = defaultSectionCopy.faq }) {
  return (
    <section className="course-program-section course-program-faq" id="preguntas" aria-labelledby="course-faq-title">
      <div className="section-inner course-program-faq__layout">
        <header className="course-program-heading">
          <p className="section-kicker">{copy.eyebrow}</p>
          <h2 id="course-faq-title">{copy.title}</h2>
          <p>{copy.text}</p>
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

function CourseRelated({ program }) {
  const related = [
    ...programs.filter((candidate) => candidate.slug !== program.slug && candidate.category === program.category),
    ...programs.filter((candidate) => candidate.slug !== program.slug && candidate.category !== program.category),
  ].slice(0, 3);

  return (
    <aside className="course-program-related" aria-labelledby="course-related-title">
      <div className="section-inner">
        <p className="section-kicker">Sigue explorando</p>
        <h2 id="course-related-title">Otras rutas que también puedes comparar.</h2>
        <nav aria-label="Cursos relacionados">
          {related.map((candidate) => (
            <a href={`/cursos/${candidate.slug}/`} key={candidate.slug}>
              <span>{candidate.title}</span>
              <small>{candidate.mode}</small>
              <i data-lucide="arrow-right" aria-hidden="true" />
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}

function CourseClosing({ closing, program }) {
  const englishProgram = isEnglishProgram(program);
  const primaryCta = {
    ...(englishProgram
      ? {
          label: closing.primaryLabel || conversionCtas.placement.label,
          href: conversionCtas.placement.href,
          external: false,
        }
      : defaultProgramInquiryCta(program)),
    ...closing.primaryCta,
  };
  const advisorCta = {
    label: closing.advisorLabel,
    href: site.whatsappHref,
    external: true,
    ...closing.advisorCta,
  };

  return (
    <section className="course-program-closing" aria-labelledby="course-closing-title">
      <div className="section-inner course-program-closing__layout">
        <div>
          <p className="section-kicker">{closing.eyebrow}</p>
          <h2 id="course-closing-title">{closing.title}</h2>
          <p>{closing.text}</p>
        </div>
        <div className="course-program-closing__actions">
          <a
            className="button button--primary"
            href={primaryCta.href}
            {...externalLinkProps(primaryCta)}
          >
            {primaryCta.label}
            <i data-lucide="arrow-right" aria-hidden="true" />
          </a>
          <a
            className="course-program-text-link"
            href={advisorCta.href}
            {...externalLinkProps(advisorCta)}
          >
            {advisorCta.label}
          </a>
        </div>
      </div>
    </section>
  );
}

export function CourseProgramPage({ program }) {
  const editorial = program.editorial;
  const pathwayCopy =
    editorial.sectionCopy?.pathway ||
    (isEnglishProgram(program)
      ? defaultSectionCopy.pathway
      : defaultSectionCopy.inquiryPathway);

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
        {editorial.outcomes?.length ? (
          <CourseOutcomes
            outcomes={editorial.outcomes}
            copy={editorial.sectionCopy?.outcomes}
          />
        ) : null}
        {editorial.pathway?.length ? (
          <CoursePathway
            pathway={editorial.pathway}
            copy={pathwayCopy}
          />
        ) : null}
        {editorial.method ? <CourseMethod method={editorial.method} /> : null}
        {editorial.formats?.length && editorial.schedule?.length ? (
          <CourseLogistics
            editorial={editorial}
            copy={editorial.sectionCopy?.logistics}
          />
        ) : null}
        {editorial.story ? <CourseStory story={editorial.story} /> : null}
        {editorial.faqs?.length ? (
          <CourseFaq faqs={editorial.faqs} copy={editorial.sectionCopy?.faq} />
        ) : null}
        <CourseRelated program={program} />
        <CourseClosing closing={editorial.closing} program={program} />
      </main>
      <SiteFooter />
    </>
  );
}
