import Image from "next/image";
import { conversionCtas, programs, site } from "../../../src/content";
import { SiteFooter, SiteHeader } from "./SiteChrome";
import { CatalogReturnLink } from "./CatalogReturnLink";
import { contactCourseHref } from "../../../src/admissions.js";
import { courseComparison } from "../../../src/courseDiscovery.js";
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

function CourseDetailHero({ program, editorial }) {
  const registration = courseRegistrationAction(program.slug);
  const english = isEnglishProgram(program);
  const presencial = program.slug === "ingles-jovenes-adultos";
  const online = program.slug === "ingles-online-adultos";
  const comparison = courseComparison[program.slug];
  const hasPublishedTimes = editorial.schedule.some((group) => group.times.some((time) => /\d/.test(time)));
  const referenceDays = [...new Set(editorial.schedule.map((group) => group.label.split(" · ")[0]))].join(" · ");
  const referencePeriods = [...new Set(editorial.schedule.map((group) => group.label.match(/mañana|noche/i)?.[0]).filter(Boolean))].join(" y ");
  const scheduleSummary = hasPublishedTimes
    ? `${referenceDays}${referencePeriods ? ` · ${referencePeriods}` : ""}. Hora de Nueva Jersey (Eastern Time).`
    : program.slug === "espanol-extranjeros"
      ? "Grupo y horario coordinados según país y zona horaria."
      : "Horario y zona horaria a confirmar según materia, tutor, modalidad y disponibilidad.";
  const facts = [
    ["Para quién", program.audience],
    ["Modalidad", comparison.format],
    [program.slug === "ged" ? "Ritmo y duración" : "Duración", program.slug === "ged" ? `Dos horas semanales de referencia. ${comparison.duration}` : comparison.duration],
    ["Inicio y costo", "Próximo grupo, colegiatura y materiales por confirmar con admisiones."],
    ["Horario de referencia", <>{scheduleSummary} <a className="course-schedule-preview-link" href="#horarios">Ver horarios y requisitos</a></>],
  ];

  return (
    <section className="course-program-hero course-program-hero--detail" aria-labelledby="course-program-title">
      <div className="course-detail-stage">
        <div className="section-inner">
          <nav className="course-breadcrumb" aria-label="Ruta de navegación">
            <CatalogReturnLink slug={program.slug} />
            <i data-lucide="chevron-right" aria-hidden="true" />
            <span aria-current="page">{program.title}</span>
          </nav>
          <div className="course-detail-stage__layout">
            <div className="course-detail-stage__copy">
              <p className="section-kicker">{presencial ? "Inglés en Nueva Jersey" : editorial.eyebrow}</p>
              <h1 id="course-program-title">{program.title}</h1>
              <p className="course-program-hero__lead">
                {presencial ? "Para jóvenes y adultos que quieren comprender y conversar en situaciones reales, con práctica cara a cara y guía constante." : editorial.lead}
              </p>
              {program.slug === "espanol-extranjeros" ? (
                <div className="course-language-summary" lang="en">
                  <h2>Learn Spanish online</h2>
                  <p>Practice Spanish for everyday life, study or work. Admissions confirms your starting level, group and time zone.</p>
                  <a href={contactCourseHref(program.slug)}>Ask about the Spanish course</a>
                </div>
              ) : null}
              <dl className="course-detail-facts" aria-label={`Lo esencial de ${program.title}`}>
                {facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
              </dl>
              {program.slug === "espanol-extranjeros" ? <p className="course-registration-note">Inscripción online por este sitio solo para residentes en Estados Unidos. Para otros países, consulta con admisiones.</p> : null}
              <div className="course-program-hero__actions">
                <a className="button button--primary" href={registration.href}>
                  {registration.label}
                  <i data-lucide="arrow-right" aria-hidden="true" />
                </a>
                <a className="course-program-text-link" href={contactCourseHref(program.slug)}>
                  {presencial ? "Consultar costo y grupo" : program.slug === "tutorias-matematicas" ? "Consultar opción online" : "Preguntar a admisiones"}
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
              <figcaption><span>{presencial ? "Aprender en persona" : online ? "Clase en vivo" : english ? "Ruta combinada" : "Ruta guiada"}</span><strong>{presencial ? "Práctica guiada · Nueva Jersey" : online ? "Profesor y grupo · online" : english ? "Encuentros y apoyo remoto" : program.mode}</strong></figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}

function CourseDetailChapters({ program }) {
  return (
    <nav className="course-detail-chapters section-inner" aria-label={`Explorar ${program.title}`}>
      <span>En esta página</span>
      <a href="#horarios">Horarios y requisitos</a>
      <a href="#resultados">Qué aprenderás</a>
      <a href="#preguntas">Preguntas frecuentes</a>
    </nav>
  );
}

function CourseLearning({ editorial, pathwayCopy, program }) {
  const copy = editorial.sectionCopy?.outcomes || defaultSectionCopy.outcomes;
  const pathwayLabel = isEnglishProgram(program) ? "Ver los niveles del programa" : program.slug === "ged" ? "Ver las cuatro áreas del examen" : program.slug.startsWith("computacion-") ? "Ver los módulos del programa" : "Ver la ruta de aprendizaje";
  return (
    <section className="course-program-section course-program-outcomes" id="resultados" aria-labelledby="course-outcomes-title">
      <div className="section-inner">
        <header className="course-program-heading section-heading--framed">
          <p className="section-kicker">{copy.eyebrow}</p>
          <h2 id="course-outcomes-title">{copy.title}</h2>
          <p>{copy.text}</p>
        </header>
        <ol className="course-outcome-list">
          {editorial.outcomes.map((outcome) => (
            <li key={outcome.number}>
              <span aria-hidden="true">{outcome.number}</span>
              <h3>{outcome.title}</h3>
              <p>{outcome.text}</p>
            </li>
          ))}
        </ol>
        {editorial.pathway?.length ? (
          <details className="course-learning-pathway" id={pathwayCopy.id || "niveles"}>
            <summary><span>{pathwayLabel}</span><i data-lucide="plus" aria-hidden="true" /></summary>
            <p className="course-learning-pathway__intro">{pathwayCopy.text}</p>
            <ol className="course-pathway-list" data-stage-count={editorial.pathway.length}>
              {editorial.pathway.map((stage) => (
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
            {pathwayCopy.actionLabel && pathwayCopy.actionHref ? (
              <>
                <a className="course-program-text-link" href={pathwayCopy.actionHref} {...externalLinkProps(pathwayCopy)}>
                  {pathwayCopy.actionLabel}
                  {pathwayCopy.external && !pathwayCopy.actionLabel.includes("WhatsApp") ? " · WhatsApp" : ""}
                  <i data-lucide="arrow-right" aria-hidden="true" />
                </a>
                {pathwayCopy.actionHref === conversionCtas.placement.href ? <p className="course-learning-pathway__readiness">62 preguntas · 10–15 min. Para ver y guardar el resultado, debes verificar tu correo y crear una cuenta.</p> : null}
              </>
            ) : null}
          </details>
        ) : null}
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
  const details = {
    "ingles-online-adultos": "mi zona horaria, el horario y el próximo grupo disponible",
    "ingles-hibrido-adultos": "la sede, la alternancia presencial/remota, el horario y el próximo grupo disponible",
    "espanol-extranjeros": "mi zona horaria, el grupo y el horario disponible",
    ged: "la sede, el bloque y el grupo disponible",
    "tutorias-matematicas": "la materia, el tutor, la modalidad y el horario disponible",
    "computacion-basica": "el sistema, la sede, el grupo y el horario disponible",
    "computacion-oficina": "el módulo, la versión del software, el grupo y el horario disponible",
  }[program.slug] || "sede, horarios y próximo grupo disponible";
  url.searchParams.set("text", `Hola AIT USA, quiero confirmar ${details} para ${program.title}. ¿Me pueden orientar también sobre el costo total?`);
  return url.toString();
}

const otherScheduleTitles = {
  "espanol-extranjeros": "Horario según tu país.",
  ged: "Bloques de preparación.",
  "tutorias-matematicas": "Coordina tu tutoría.",
  "computacion-basica": "Horarios publicados.",
  "computacion-oficina": "Horarios por módulo.",
};

const otherDecisionTitles = {
  "espanol-extranjeros": "Confirma país, costo y grupo.",
  ged: "Confirma sede, costo y bloque.",
  "tutorias-matematicas": "Confirma tutor, modalidad y costo.",
  "computacion-basica": "Confirma equipo, costo y grupo.",
  "computacion-oficina": "Confirma módulo, software y costo.",
};

function CourseLogistics({ program, editorial, copy = defaultSectionCopy.logistics }) {
  const english = isEnglishProgram(program);
  const presencial = program.slug === "ingles-jovenes-adultos";
  return (
    <section className="course-program-section course-program-logistics" id="horarios" aria-labelledby="course-logistics-title">
      <div className="section-inner">
        <header className="course-program-heading section-heading--framed">
          <p className="section-kicker">{copy.eyebrow}</p>
          <h2 id="course-logistics-title">{presencial ? "Horarios de clase." : program.slug === "ingles-online-adultos" ? "Horarios en Nueva Jersey." : english ? "Bloques de referencia." : otherScheduleTitles[program.slug]}</h2>
          {editorial.schedule.some((group) => group.times.some((time) => /\d/.test(time))) ? (
            <p className="course-schedule-timezone">Hora de Nueva Jersey · Eastern Time (America/New_York). Si estudias desde otra zona, confirma tu hora local con admisiones; la diferencia puede cambiar con el horario de verano.</p>
          ) : null}
        </header>
        <div className="course-logistics-layout">
          <div className="course-schedule-panel">
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
              <div className={program.slug === "ged" ? "course-detail-availability-group" : undefined}>
                {program.slug === "ged" ? <h3 className="course-detail-availability__day">Sábados</h3> : null}
                <dl className={`course-detail-availability${editorial.schedule.length === 1 ? " course-detail-availability--coordinated" : ""}`} aria-label={copy.scheduleLabel}>
                  {editorial.schedule.map((group) => (
                    <div key={group.label}>
                      <dt>{program.slug === "ged" ? group.label.replace("Sábado · bloque", "Bloque") : group.label}</dt>
                      <dd>{group.times.join(" · ")}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
            <p className="course-schedule-panel__note">{program.slug === "ged" ? "AIT publica una referencia de dos horas semanales y estos bloques de dos horas los sábados. Admisiones confirma la frecuencia de encuentros, el bloque y la sede de tu grupo antes de inscribirte." : editorial.logisticsNote}</p>
          </div>
        </div>
        <aside className="course-detail-decision" aria-labelledby="course-decision-title">
            <div>
              <p className="section-kicker">Antes de inscribirte</p>
              <h3 id="course-decision-title">{english ? "Confirma tu nivel, costo y grupo." : otherDecisionTitles[program.slug]}</h3>
            </div>
            <div>
              <p>{courseComparison[program.slug].requirements}</p>
              <div className="course-detail-decision__actions">
                <a href={contactCourseHref(program.slug)}>Consultar costo y disponibilidad</a>
                <a href={scheduleInquiryHref(program)} target="_blank" rel="noreferrer">{program.slug === "tutorias-matematicas" ? "Consultar opción online por WhatsApp" : "Confirmar horario por WhatsApp"}</a>
              </div>
            </div>
          </aside>
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

const relatedCourseSlugs = {
  "ingles-jovenes-adultos": ["ingles-hibrido-adultos", "ingles-online-adultos"],
  "ingles-online-adultos": ["ingles-hibrido-adultos", "ingles-jovenes-adultos"],
  "ingles-hibrido-adultos": ["ingles-jovenes-adultos", "ingles-online-adultos"],
  "espanol-extranjeros": [],
  ged: ["tutorias-matematicas"],
  "tutorias-matematicas": ["ged"],
  "computacion-basica": ["computacion-oficina"],
  "computacion-oficina": ["computacion-basica"],
};

const relatedHeadings = {
  ged: "Si necesitas reforzar matemáticas.",
  "tutorias-matematicas": "Si tu meta también es el GED.",
  "computacion-basica": "Cuando quieras seguir con herramientas de oficina.",
  "computacion-oficina": "Si necesitas empezar por la base digital.",
};

function CourseRelated({ program }) {
  const related = (relatedCourseSlugs[program.slug] || [])
    .map((slug) => programs.find((candidate) => candidate.slug === slug))
    .filter(Boolean);

  if (related.length === 0) return null;

  return (
    <aside className={`course-program-related course-program-related--${related.length}`} aria-labelledby="course-related-title">
      <div className="section-inner">
        <div className="course-program-related__intro">
          <p className="section-kicker">Sigue explorando</p>
          <h2 id="course-related-title">{relatedHeadings[program.slug] || "Compara las opciones de inglés."}</h2>
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
  const courseCostLabel = program.slug === "ged" ? "la preparación GED" : program.title.toLowerCase();

  return (
    <section className="course-program-closing" aria-labelledby="course-closing-title">
      <div className="section-inner course-program-closing__layout">
        <div>
          <p className="section-kicker">{closing.eyebrow}</p>
          <h2 id="course-closing-title">{program.slug === "ingles-jovenes-adultos" ? "Elige tu próximo paso con claridad." : closing.title}</h2>
          <p>Revisa el precio de inscripción antes de pagar. Admisiones puede ayudarte a confirmar el grupo, el horario y el costo total de {courseCostLabel}.</p>
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
        <CourseLearning editorial={editorial} pathwayCopy={pathwayCopy} program={program} />
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
        className="course-program-page course-program-page--detail"
        data-course-template={editorial.version}
        data-course-program={program.slug}
        id="main-content"
      >
        <CourseDetailHero program={program} editorial={editorial} />
        <div className="course-detail-sheet">
          <CourseDetailChapters program={program} />
          {courseChapters}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
