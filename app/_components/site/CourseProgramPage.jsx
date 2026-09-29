import Image from "next/image";
import { conversionCtas, programs, site } from "../../../src/content";
import { SiteFooter, SiteHeader } from "./SiteChrome";
import { CourseQuickFacts } from "./CourseQuickFacts";
import { CatalogReturnLink } from "./CatalogReturnLink";
import { contactCourseHref } from "../../../src/admissions.js";
import { courseComparison, courseInquiryHref } from "../../../src/courseDiscovery.js";
import { courseRegistrationAction } from "../../../src/courseRegistration.js";

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

function externalLinkProps(link) {
  return link?.external ? { target: "_blank", rel: "noreferrer" } : {};
}

function EnglishCourseHero({ program, editorial }) {
  const registration = courseRegistrationAction(program.slug);
  const presencial = program.slug === "ingles-jovenes-adultos";
  const online = program.slug === "ingles-online-adultos";
  const facts = presencial ? [
    ["Modalidad", "En sede de Nueva Jersey; admisiones confirma cuál."],
    ["Horarios", "Mañanas y noches lun–jue; fines de semana."],
    ["Costo y grupo", "Confirma el costo total y el próximo inicio con admisiones."],
  ] : online ? [
    ["Modalidad", "100% online y en vivo, desde fuera de Estados Unidos."],
    ["Horarios", "Bloques en hora de Nueva Jersey; confirma la conversión a tu zona."],
    ["Nivel y grupo", "La evaluación inicial orienta tu nivel; admisiones confirma el grupo."],
  ] : [
    ["Modalidad", "Encuentros presenciales con apoyo remoto, según el grupo activo."],
    ["Horarios", "Bloques de referencia; confirma sede, alternancia y horario vigente."],
    ["Nivel y grupo", "La evaluación inicial orienta tu nivel; admisiones confirma la combinación."],
  ];

  return (
    <section className="course-program-hero course-program-hero--english" aria-labelledby="course-program-title">
      <div className="course-english-stage">
        <div className="section-inner">
          <nav className="course-breadcrumb" aria-label="Ruta de navegación">
            <CatalogReturnLink slug={program.slug} />
            <i data-lucide="chevron-right" aria-hidden="true" />
            <span aria-current="page">{program.title}</span>
          </nav>
          <div className="course-english-stage__layout">
            <div className="course-english-stage__copy">
              <p className="section-kicker">{presencial ? "Inglés en Nueva Jersey" : editorial.eyebrow}</p>
              <h1 id="course-program-title">{program.title}</h1>
              <p className="course-program-hero__lead">
                {presencial ? "Para jóvenes y adultos que quieren comprender y conversar en situaciones reales, con práctica cara a cara y guía constante." : editorial.lead}
              </p>
              <dl className="course-english-facts" aria-label={`Lo esencial de ${program.title}`}>
                {facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value} {label === "Horarios" ? <a href="#horarios">Ver todos</a> : null}</dd></div>)}
              </dl>
              <div className="course-program-hero__actions">
                <a className="button button--primary" href={registration.href}>
                  {registration.label}
                  <i data-lucide="arrow-right" aria-hidden="true" />
                </a>
                <a className="course-program-text-link" href={contactCourseHref(program.slug)}>
                  {presencial ? "Consultar costo y grupo" : "Preguntar a admisiones"}
                  <i data-lucide="arrow-right" aria-hidden="true" />
                </a>
              </div>
            </div>
            <figure className="course-program-hero__media">
              <Image
                src={editorial.heroImage}
                alt={editorial.heroImageAlt}
                width={1448}
                height={1086}
                sizes="(max-width: 820px) 100vw, 48vw"
                priority
              />
              <figcaption><span>{presencial ? "Aprender en persona" : online ? "Clase en vivo" : "Ruta combinada"}</span><strong>{presencial ? "Práctica guiada · Nueva Jersey" : online ? "Profesor y grupo · online" : "Encuentros y apoyo remoto"}</strong></figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}

function EnglishCourseChapters({ program }) {
  return (
    <nav className="course-english-chapters section-inner" aria-label={`Explorar ${program.title}`}>
      <span>En esta página</span>
      <a href="#horarios">Horarios y requisitos</a>
      <a href="#resultados">Qué aprenderás</a>
      <a href="#preguntas">Preguntas frecuentes</a>
    </nav>
  );
}

function CourseHero({ program, editorial }) {
  if (isEnglishProgram(program)) {
    return <EnglishCourseHero program={program} editorial={editorial} />;
  }
  const registration = courseRegistrationAction(program.slug);

  return (
    <section className="course-program-hero" aria-labelledby="course-program-title">
      <div className="section-inner course-program-hero__main">
        <div className="course-program-hero__copy">
          <nav className="course-breadcrumb" aria-label="Ruta de navegación">
            <CatalogReturnLink slug={program.slug} />
            <i data-lucide="chevron-right" aria-hidden="true" />
            <span aria-current="page">{program.title}</span>
          </nav>
          <p className="section-kicker">{editorial.eyebrow}</p>
          <h1 id="course-program-title">{program.title}</h1>
          <p className="course-program-hero__lead">{editorial.lead}</p>
          <div className="course-program-hero__actions">
            {registration ? (
              <a className="button button--primary" href={registration.href}>
                {registration.label}
                <i data-lucide="arrow-right" aria-hidden="true" />
              </a>
            ) : null}
            <a
              className={registration ? "button button--ghost" : "button button--primary"}
              href={contactCourseHref(program.slug)}
            >
              {program.slug === "tutorias-matematicas" ? "Consultar opción online" : "Preguntar a admisiones"}
              <i data-lucide="arrow-right" aria-hidden="true" />
            </a>
            <a
              className="course-program-text-link"
              href={courseInquiryHref(site.whatsappHref, program.title)}
              target="_blank" rel="noreferrer"
            >
              Consultar por WhatsApp
              <i data-lucide="message-circle" aria-hidden="true" />
            </a>
          </div>
          <p className="course-program-hero__note">
            {editorial.heroNote || "Admisiones confirma el punto de inicio, el grupo y el horario antes de comenzar."}
          </p>
          {program.slug === "espanol-extranjeros" ? <p className="course-program-hero__note">La inscripción online por este sitio está disponible solo para residentes en Estados Unidos. Si estás en otro país, consulta con admisiones.</p> : null}
          <nav className="course-decision-nav" aria-label="Explorar este curso">
            <a href="#horarios">Horarios y requisitos</a>
            <a href={`#${editorial.sectionCopy?.pathway?.id || "niveles"}`}>Qué aprenderás</a>
            <a href="#preguntas">Preguntas frecuentes</a>
          </nav>
          <CourseQuickFacts slug={program.slug} />
          {program.slug === "espanol-extranjeros" ? (
            <details className="course-language-summary" lang="en">
              <summary>New to Spanish? Read the English overview</summary>
              <p>Practice Spanish online for everyday life, study or work. Your starting level, group and time zone are confirmed with admissions. Duration depends on your level, goals and study frequency.</p>
              <a href={contactCourseHref(program.slug)}>Ask about the Spanish course</a>
            </details>
          ) : null}
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

function CourseOutcomes({ outcomes, copy = defaultSectionCopy.outcomes, id }) {
  return (
    <section className="course-program-section course-program-outcomes" id={id} aria-labelledby="course-outcomes-title">
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
              {copy.external && !copy.actionLabel.includes("WhatsApp") ? " · WhatsApp" : ""}
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

function scheduleInquiryHref(program) {
  const url = new URL(site.whatsappHref);
  const details = program.slug === "ingles-online-adultos"
    ? "mi zona horaria, el horario y el próximo grupo disponible"
    : program.slug === "ingles-hibrido-adultos"
      ? "la sede, la alternancia presencial/remota, el horario y el próximo grupo disponible"
      : "sede, horarios y próximo grupo disponible";
  url.searchParams.set("text", `Hola AIT USA, quiero confirmar ${details} para ${program.title}. ¿Me pueden orientar también sobre el costo total?`);
  return url.toString();
}

function CourseLogistics({ program, editorial, copy = defaultSectionCopy.logistics }) {
  const english = isEnglishProgram(program);
  const presencial = program.slug === "ingles-jovenes-adultos";
  return (
    <section className="course-program-section course-program-logistics" id="horarios" aria-labelledby="course-logistics-title">
      <div className="section-inner">
        <header className="course-program-heading section-heading--framed">
          <p className="section-kicker">{copy.eyebrow}</p>
          <h2 id="course-logistics-title">{presencial ? "Horarios de clase." : program.slug === "ingles-online-adultos" ? "Horarios en Nueva Jersey." : english ? "Bloques de referencia." : "Organiza tu semana."}</h2>
          {!english ? <p>{copy.text}</p> : null}
        </header>
        <div className="course-logistics-layout">
          <div className="course-schedule-panel">
            {!english ? (
              <p className="course-schedule-panel__label">{copy.scheduleLabel}</p>
            ) : null}
            {presencial ? (
              <div className="course-english-timetable" aria-label="Horarios publicados de inglés presencial">
                <section className="course-english-timetable__group" aria-labelledby="course-weekday-title">
                  <header className="course-english-timetable__heading">
                    <h3 id="course-weekday-title">Lunes a jueves</h3>
                    <p>Inicios de clase</p>
                  </header>
                  <dl className="course-english-timetable__rows">
                    {editorial.schedule.slice(0, 2).map((group, index) => (
                      <div key={group.label}>
                        <dt>{index === 0 ? "Mañana" : "Noche"}</dt>
                        <dd>
                          <ul className="course-english-times">
                            {group.times.map((time) => <li key={time}>{time}</li>)}
                          </ul>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </section>
                <section className="course-english-timetable__group" aria-labelledby="course-weekend-title">
                  <header className="course-english-timetable__heading">
                    <h3 id="course-weekend-title">Fin de semana</h3>
                    <p>Clases completas</p>
                  </header>
                  <dl className="course-english-timetable__rows">
                    {editorial.schedule.slice(2).map((group) => (
                      <div key={group.label}>
                        <dt>{group.label}</dt>
                        <dd>
                          <ul className="course-english-times">
                            {group.times.map((time) => <li key={time}>{time}</li>)}
                          </ul>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </section>
              </div>
            ) : english ? (
              <div className="course-english-timetable course-english-timetable--ranges" aria-label={`Bloques publicados de ${program.title}`}>
                <section className="course-english-timetable__group" aria-labelledby="course-weekday-title">
                  <header className="course-english-timetable__heading">
                    <h3 id="course-weekday-title">Lunes a jueves</h3>
                    <p>Bloques completos</p>
                  </header>
                  <dl className="course-english-timetable__rows">
                    {editorial.schedule.slice(0, 2).map((group, index) => (
                      <div key={group.label}>
                        <dt>{index === 0 ? "Mañana" : "Noche"}</dt>
                        <dd><ul className="course-english-times">{group.times.map((time) => <li key={time}>{time}</li>)}</ul></dd>
                      </div>
                    ))}
                  </dl>
                </section>
                <section className="course-english-timetable__group" aria-labelledby="course-weekend-title">
                  <header className="course-english-timetable__heading">
                    <h3 id="course-weekend-title">Fin de semana</h3>
                    <p>Bloques completos</p>
                  </header>
                  <dl className="course-english-timetable__rows">
                    <div>
                      <dt>Sábados</dt>
                      <dd><ul className="course-english-times">{editorial.schedule[2].times.map((time) => <li key={time}>{time}</li>)}</ul></dd>
                    </div>
                  </dl>
                </section>
              </div>
            ) : (
              <dl>
                {editorial.schedule.map((group) => (
                  <div key={group.label}>
                    <dt>{group.label}</dt>
                    <dd>{group.times.join(" · ")}</dd>
                  </div>
                ))}
              </dl>
            )}
            <p className="course-schedule-panel__note">{editorial.logisticsNote}</p>
            {!english ? (
              <a
                className="course-program-text-link"
                href={courseInquiryHref(site.whatsappHref, program.title)}
                target="_blank"
                rel="noreferrer"
              >
                Confirmar horario por WhatsApp
                <i data-lucide="arrow-right" aria-hidden="true" />
              </a>
            ) : null}
          </div>
          {!english ? (
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
          ) : null}
        </div>
        {english ? (
          <aside className="course-english-decision" aria-labelledby="course-decision-title">
            <div>
              <p className="section-kicker">Antes de inscribirte</p>
              <h3 id="course-decision-title">Confirma tu nivel, costo y grupo.</h3>
            </div>
            <div>
              <p>{courseComparison[program.slug].requirements}</p>
              <p>{presencial ? "El registro desglosa inscripción y materiales. Confirma colegiatura total, grupo y próxima fecha con admisiones." : "Confirma el costo total, los materiales incluidos y la próxima fecha disponible con admisiones antes de inscribirte."}</p>
              <div className="course-english-decision__actions">
                <a href={contactCourseHref(program.slug)}>Consultar costo y disponibilidad</a>
                <a href={scheduleInquiryHref(program)} target="_blank" rel="noreferrer">Confirmar horario por WhatsApp</a>
              </div>
            </div>
          </aside>
        ) : (
          <div className="course-admissions-facts">
            <div><h3>Requisitos para empezar</h3><p>{courseComparison[program.slug].requirements}</p></div>
            <div><h3>Costo y próximo grupo</h3><p>Solicita el costo total, los materiales incluidos y la próxima fecha disponible antes de inscribirte.</p><a href={contactCourseHref(program.slug)}>Consultar costo y disponibilidad</a></div>
          </div>
        )}
      </div>
    </section>
  );
}

function CourseStory({ story, isEnglishPresencial = false }) {
  const videoDescriptionId = "course-story-video-description";
  const transcriptNoteId = "course-story-video-transcript-note";

  return (
    <section className="course-program-story" id="historia" aria-labelledby="course-story-title">
      <div className="section-inner course-program-story__layout">
        <div className="course-program-story__copy">
          <p className="section-kicker">{story.eyebrow}</p>
          <p className="course-program-story__identity">{story.name} · {story.role}</p>
          <h2 id="course-story-title">{story.title}</h2>
          <p id={isEnglishPresencial ? videoDescriptionId : undefined}>{story.text}</p>
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
          {isEnglishPresencial ? null : <p id={videoDescriptionId}>
            <strong>Sobre esta entrevista:</strong> {story.text}
          </p>}
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
        <div className="course-program-related__intro">
          <p className="section-kicker">Sigue explorando</p>
          <h2 id="course-related-title">{program.slug === "ingles-jovenes-adultos" ? "Sigue explorando otras rutas." : "Otras rutas que también puedes comparar."}</h2>
        </div>
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
  const registration = courseRegistrationAction(program.slug);

  return (
    <section className="course-program-closing" aria-labelledby="course-closing-title">
      <div className="section-inner course-program-closing__layout">
        <div>
          <p className="section-kicker">{closing.eyebrow}</p>
          <h2 id="course-closing-title">{program.slug === "ingles-jovenes-adultos" ? "Elige tu próximo paso con claridad." : "Da el siguiente paso."}</h2>
          <p>Revisa el precio de inscripción antes de pagar. Admisiones puede ayudarte a confirmar el grupo, el horario y el costo total de {program.title.toLowerCase()}.</p>
        </div>
        <div className="course-program-closing__actions">
          {registration ? <a className="button button--primary" href={registration.href}>
            {registration.label}
            <i data-lucide="arrow-right" aria-hidden="true" />
          </a> : null}
          <a
            className="course-program-text-link"
            href={contactCourseHref(program.slug)}
          >
            {program.slug === "tutorias-matematicas" ? "Consultar opción online" : "Preguntar a admisiones"}
          </a>
        </div>
      </div>
    </section>
  );
}

export function CourseProgramPage({ program }) {
  const editorial = program.editorial;
  const english = isEnglishProgram(program);
  const isEnglishPresencial = program.slug === "ingles-jovenes-adultos";
  const pathwayCopy =
    editorial.sectionCopy?.pathway ||
    (isEnglishProgram(program)
      ? defaultSectionCopy.pathway
      : defaultSectionCopy.inquiryPathway);
  const courseChapters = (
    <>
      {editorial.formats?.length && editorial.schedule?.length ? (
        <CourseLogistics program={program} editorial={editorial} copy={editorial.sectionCopy?.logistics} />
      ) : null}
      {editorial.outcomes?.length ? (
        <CourseOutcomes
          outcomes={editorial.outcomes}
          copy={editorial.sectionCopy?.outcomes}
          id={english ? "resultados" : undefined}
        />
      ) : null}
      {editorial.pathway?.length ? (
        <CoursePathway pathway={editorial.pathway} copy={pathwayCopy} />
      ) : null}
      {editorial.method ? <CourseMethod method={editorial.method} /> : null}
      {editorial.story ? <CourseStory story={editorial.story} isEnglishPresencial={isEnglishPresencial} /> : null}
      {editorial.faqs?.length ? (
        <CourseFaq faqs={editorial.faqs} copy={editorial.sectionCopy?.faq} />
      ) : null}
      <CourseRelated program={program} />
      <CourseClosing closing={editorial.closing} program={program} />
    </>
  );

  return (
    <>
      <SiteHeader activePage="courses" />
      <main
        className={`course-program-page${english ? " course-program-page--english-detail" : ""}`}
        data-course-template={editorial.version}
        data-course-program={program.slug}
        id="main-content"
      >
        <CourseHero program={program} editorial={editorial} />
        {english ? (
          <div className="course-english-sheet">
            <EnglishCourseChapters program={program} />
            {courseChapters}
          </div>
        ) : courseChapters}
      </main>
      <SiteFooter />
    </>
  );
}
