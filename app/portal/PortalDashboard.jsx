"use client";

import { useEffect, useState } from "react";
import { site } from "../../src/content.js";

export function PortalDashboard({ model }) {
  const advisorHref = `${site.whatsappHref}?text=${encodeURIComponent(
    `Hola AIT USA, guardé mi resultado de ubicación${
      model.result?.recommendedLevelLabel
        ? ` (${model.result.recommendedLevelLabel})`
        : ""
    } y quiero confirmar mi próximo paso.`,
  )}`;

  return (
    <div className="portal-page">
      <a className="portal-skip-link" href="#portal-main">
        Saltar al contenido
      </a>
      <header className="portal-topbar">
        <a className="portal-brand" href="/portal/" aria-label="AIT USA Portal, inicio">
          <img
            className="portal-brand__mark"
            src="/assets/wix/076-solo-logo-4-x-4-clases1.png"
            alt=""
            width="36"
            height="36"
          />
          <span>
            <strong>AIT USA</strong>
            <small>Portal de aprendizaje</small>
          </span>
        </a>
        <div className="portal-account-chip" aria-label={`Cuenta de ${model.account.firstName}`}>
          <span className="portal-account-chip__avatar" aria-hidden="true">
            {model.account.firstName.slice(0, 1).toUpperCase()}
          </span>
          <span className="portal-account-chip__copy">
            <strong>{model.account.firstName}</strong>
            <small>Cuenta verificada</small>
          </span>
        </div>
      </header>

      <div className="portal-shell">
        <PortalNavigation items={model.navigation} />

        <main className="portal-main" id="portal-main" tabIndex={-1}>
          {model.welcome ? (
            <section className="portal-welcome" aria-label="Resultado guardado">
              <span className="portal-welcome__icon" aria-hidden="true">
                <PortalIcon name="check" />
              </span>
              <div>
                <strong>Tu resultado ya está guardado.</strong>
                <p>Puedes volver desde cualquier dispositivo usando el mismo email.</p>
              </div>
            </section>
          ) : null}

          <section className="portal-hero" id="inicio" aria-labelledby="portal-title">
            <div className="portal-hero__copy">
              <p className="portal-eyebrow">Tu siguiente paso</p>
              <h1 id="portal-title">
                {model.greeting}, <span>{model.account.firstName}</span>
              </h1>
              <p>
                {model.result
                  ? "Tu punto de partida está listo. Revisa la recomendación o continúa con la próxima acción disponible."
                  : "Completa el examen de ubicación para recibir un punto de partida antes de elegir tu curso."}
              </p>
            </div>
            <div className="portal-hero__signal" aria-label="Estado de tu ruta">
              <span className="portal-hero__signal-orbit" aria-hidden="true">
                <PortalIcon name="spark" />
              </span>
              <div>
                <small>{model.result ? "Ruta activa" : "Ruta por iniciar"}</small>
                <strong>{model.result ? "Resultado guardado" : "Examen pendiente"}</strong>
              </div>
            </div>
          </section>

          <section
            className="portal-priority-grid portal-priority-grid--result"
            aria-label="Resultado guardado"
          >
            <ResultCard result={model.result} />
          </section>

          <section
            className="portal-section portal-section--courses"
            id="cursos"
            aria-labelledby="portal-course-title"
          >
            <div className="portal-section__heading">
              <div>
                <p className="portal-eyebrow">
                  {model.course ? "Ruta recomendada" : "Próximo paso académico"}
                </p>
                <h2 id="portal-course-title">
                  {model.course
                    ? "Un curso que empieza donde tú estás"
                    : model.result
                      ? "Confirma tu recomendación con AIT USA"
                      : "Descubre dónde comenzar"}
                </h2>
              </div>
              <a
                className="portal-text-link"
                href={
                  model.course
                    ? model.course.href
                    : model.result
                      ? advisorHref
                      : "/placement-test/"
                }
              >
                {model.course
                  ? "Ver programa"
                  : model.result
                    ? "Hablar con un asesor"
                    : "Hacer examen"}{" "}
                <PortalIcon name="arrow" />
              </a>
            </div>

            <div className="portal-course-card">
              <div className="portal-course-card__number" aria-hidden="true">
                01
              </div>
              <div className="portal-course-card__copy">
                <span>
                  {model.course
                    ? model.course.eyebrow
                    : model.result
                      ? "Nivel por confirmar"
                      : "Ubicación pendiente"}
                </span>
                <h3>
                  {model.course
                    ? model.course.title
                    : model.result
                      ? "Tu resultado está guardado para revisión"
                      : "Completa el examen antes de elegir un nivel"}
                </h3>
                <p>
                  {model.result
                    ? "La ubicación es orientativa. Un asesor confirma el grupo, horario y modalidad antes de la inscripción."
                    : "Recibirás un punto de partida recomendado antes de compartir información de contacto."}
                </p>
              </div>
              <a
                className="portal-button portal-button--quiet"
                href={
                  model.course
                    ? model.course.href
                    : model.result
                      ? advisorHref
                      : "/placement-test/"
                }
              >
                {model.course
                  ? "Explorar curso"
                  : model.result
                    ? "Confirmar recomendación"
                    : "Hacer examen"}
              </a>
            </div>
          </section>

          <section
            className="portal-practice-section"
            id="estudiar"
            aria-label="Práctica guiada"
          >
            <PracticeMissionCard practice={model.practice} />
          </section>

          <div className="portal-detail-grid">
            <section
              className="portal-panel"
              id="historial-practica"
              aria-labelledby="portal-history-title"
            >
              <div className="portal-panel__heading">
                <span className="portal-panel__icon" aria-hidden="true">
                  <PortalIcon name="history" />
                </span>
                <div>
                  <p className="portal-eyebrow">Tu avance</p>
                  <h2 id="portal-history-title">Prácticas recientes</h2>
                </div>
              </div>
              {model.recentPractice.length ? (
                <ul className="portal-history-list">
                  {model.recentPractice.map((item) => (
                    <li key={`${item.scenarioLabel}-${item.completedAt || ""}`}>
                      <strong>{item.scenarioLabel}</strong>
                      <span>{item.successLabel}</span>
                      {item.completedAt ? (
                        <time dateTime={item.completedAt}>
                          {formatShortDate(item.completedAt)}
                        </time>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="portal-empty-state">
                  <span aria-hidden="true">
                    <PortalIcon name="path" />
                  </span>
                  <strong>Aquí verás lo que ya puedes hacer</strong>
                  <p>
                    Completa tu primera conversación y guardaremos solo un resumen de
                    progreso, nunca el audio ni la transcripción.
                  </p>
                </div>
              )}
            </section>

            <section
              className="portal-panel"
              id="asistencia"
              aria-labelledby="portal-enrollment-title"
            >
              <div className="portal-panel__heading">
                <span className="portal-panel__icon" aria-hidden="true">
                  <PortalIcon name="calendar" />
                </span>
                <div>
                  <p className="portal-eyebrow">Curso y asistencia</p>
                  <h2 id="portal-enrollment-title">{model.enrollment.title}</h2>
                </div>
              </div>
              <p className="portal-panel__body">{model.enrollment.summary}</p>
              <a
                className="portal-button portal-button--quiet portal-button--full"
                href={advisorHref}
                target="_blank"
                rel="noreferrer"
              >
                Confirmar opciones con un asesor
              </a>
            </section>
          </div>

          <section className="portal-support" aria-labelledby="portal-support-title">
            <div>
              <p className="portal-eyebrow">Estamos contigo</p>
              <h2 id="portal-support-title">{model.advisor.label}</h2>
              <p>{model.advisor.summary}</p>
            </div>
            <a
              className="portal-button portal-button--light"
              href={advisorHref}
              target="_blank"
              rel="noreferrer"
            >
              Abrir WhatsApp <PortalIcon name="arrow" />
            </a>
          </section>

          <section className="portal-account-panel" id="cuenta" aria-labelledby="portal-account-title">
            <div>
              <p className="portal-eyebrow">Cuenta</p>
              <h2 id="portal-account-title">Acceso sin contraseña</h2>
              <p>
                {model.account.email} · Tu sesión usa un código seguro enviado por
                email.
              </p>
            </div>
            <form action="/api/portal/sign-out" method="post">
              <button className="portal-signout" type="submit">
                Cerrar sesión
              </button>
            </form>
          </section>

          <footer className="portal-footer">
            <span>AIT USA Institute</span>
            <nav aria-label="Legal">
              <a href="/privacy-policy">Privacidad</a>
              <a href="/terms-and-conditions">Términos</a>
              <a href="/contactanos">Ayuda</a>
            </nav>
          </footer>
        </main>
      </div>
    </div>
  );
}

export function PortalAccessState({ model }) {
  return (
    <main className="portal-access">
      <a className="portal-access__brand" href="/">
        <img
          src="/assets/wix/076-solo-logo-4-x-4-clases1.png"
          alt=""
          width="44"
          height="44"
        />
        <span>AIT USA</span>
      </a>
      <section className="portal-access__card">
        <span className="portal-access__signal" aria-hidden="true">
          <PortalIcon name="lock" />
        </span>
        <p className="portal-eyebrow">{model.eyebrow}</p>
        <h1>{model.title}</h1>
        <p>{model.summary}</p>
        <a className="portal-button portal-button--primary" href={model.actionHref}>
          {model.actionLabel} <PortalIcon name="arrow" />
        </a>
        {model.secondaryAction ? (
          <a className="portal-text-link" href={model.secondaryAction.href}>
            {model.secondaryAction.label}
          </a>
        ) : null}
      </section>
    </main>
  );
}

function PortalNavigation({ items }) {
  const [activeId, setActiveId] = useState("inicio");

  useEffect(() => {
    const ids = items
      .map((item) => item.id)
      .filter((id) => document.getElementById(id));
    const hashId = window.location.hash.slice(1);
    if (ids.includes(hashId)) setActiveId(hashId);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActiveId(visible.target.id);
      },
      {
        rootMargin: "-12% 0px -68% 0px",
        threshold: [0, 0.2, 0.5],
      },
    );
    ids.forEach((id) => observer.observe(document.getElementById(id)));
    const syncBottomSection = () => {
      if (
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 8
      ) {
        setActiveId(ids.at(-1) || "inicio");
      }
    };
    window.addEventListener("scroll", syncBottomSection, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", syncBottomSection);
    };
  }, [items]);

  return (
    <nav className="portal-nav" aria-label="Portal">
      <div className="portal-nav__rail-label">Tu espacio</div>
      {items.map((item) => (
        <a
          className={`portal-nav__item${activeId === item.id ? " is-active" : ""}`}
          href={`#${item.id}`}
          aria-current={activeId === item.id ? "location" : undefined}
          onClick={() => setActiveId(item.id)}
          key={item.id}
        >
          <PortalIcon name={item.icon} />
          <span>{item.label}</span>
        </a>
      ))}
      <div className="portal-nav__help">
        <span aria-hidden="true">
          <PortalIcon name="help" />
        </span>
        <p>¿Necesitas ayuda?</p>
        <a href="/contactanos">Contactar soporte</a>
      </div>
    </nav>
  );
}

function PracticeMissionCard({ practice }) {
  const recommended = practice.eligible === true;
  return (
    <article className={`portal-mission portal-mission--${practice.status}`}>
      <div className="portal-mission__topline">
        <span className="portal-mission__badge">
          <PortalIcon name={recommended ? "spark" : "lock"} />{" "}
          {recommended ? "Misión recomendada" : "Práctica guiada"}
        </span>
        {practice.eligible ? (
          <span className="portal-mission__meta">
            {practice.durationLabel} · {practice.turnLabel}
          </span>
        ) : null}
      </div>
      <div className="portal-mission__body">
        <div className="portal-mission__copy">
          <p className="portal-eyebrow">Study Buddy</p>
          <h2>{practice.headline}</h2>
          <p>{practice.summary}</p>
        </div>
        <div
          className={`portal-mission__orb${
            practice.eligible ? "" : " portal-mission__orb--static"
          }`}
          aria-hidden="true"
        >
          {practice.eligible ? (
            <>
              <span />
              <span />
              <span />
            </>
          ) : null}
          <PortalIcon name={practice.eligible ? "mic" : "lock"} />
        </div>
      </div>
      {practice.eligible ? (
        <ol className="portal-mission__path" aria-label="Cinco turnos de práctica">
          {[1, 2, 3, 4, 5].map((step) => (
            <li className={step === 1 ? "is-current" : ""} key={step}>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="portal-mission__status">
          <PortalIcon name="lock" /> {practice.statusLabel}
        </p>
      )}
      <a
        className={`portal-button ${
          practice.eligible ? "portal-button--gold" : "portal-button--light"
        }`}
        href={practice.href}
      >
        {practice.actionLabel} <PortalIcon name="arrow" />
      </a>
      <p className="portal-mission__privacy">
        <PortalIcon name="shield" /> Audio y transcripciones no se guardan.
      </p>
    </article>
  );
}

function ResultCard({ result }) {
  if (!result) {
    return (
      <article
        className="portal-result-card portal-result-card--empty"
        id="resultado"
      >
        <p className="portal-eyebrow">Tu ubicación</p>
        <h2>Descubre tu punto de partida</h2>
        <p>Completa el examen antes de crear tu ruta de práctica.</p>
        <a className="portal-button portal-button--primary" href="/placement-test/">
          Hacer examen <PortalIcon name="arrow" />
        </a>
      </article>
    );
  }

  return (
    <article className="portal-result-card" id="resultado">
      <div className="portal-result-card__heading">
        <div>
          <p className="portal-eyebrow">Estimación de ubicación</p>
          <h2>{result.recommendedLevelLabel}</h2>
        </div>
        <span className="portal-result-card__status">
          <PortalIcon name="check" /> Guardado
        </span>
      </div>
      <p className="portal-result-card__note">
        Punto de partida recomendado. Un asesor confirma el nivel final.
      </p>
      <dl className="portal-result-card__facts">
        <div>
          <dt>Respondidas</dt>
          <dd>{result.answeredQuestionCount}</dd>
        </div>
        <div>
          <dt>Omitidas</dt>
          <dd>{result.skippedQuestionCount}</dd>
        </div>
        <div>
          <dt>Estado</dt>
          <dd>Orientativo</dd>
        </div>
      </dl>
    </article>
  );
}

function PortalIcon({ name }) {
  const paths = {
    home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10" /><path d="M9 20v-6h6v6" /></>,
    courses: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z" /><path d="M4 5.5v16" /><path d="M8 7h8" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /><path d="m8 15 2 2 5-5" /></>,
    study: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2" /><path d="M9 7h6M9 11h4" /></>,
    account: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    arrow: <><path d="M5 12h14" /><path d="m14 7 5 5-5 5" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    spark: <><path d="m12 3 1.4 4.6L18 9l-4.6 1.4L12 15l-1.4-4.6L6 9l4.6-1.4z" /><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7z" /></>,
    mic: <><rect x="9" y="3" width="6" height="12" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6" /></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></>,
    history: <><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5M12 7v5l3 2" /></>,
    path: <><circle cx="6" cy="18" r="2" /><circle cx="18" cy="6" r="2" /><path d="M7.5 16.5c2.5-2.5 1.5-5 4-7.5 1.5-1.5 3-1.5 4.5-2" /></>,
    help: <><circle cx="12" cy="12" r="9" /><path d="M9.7 9a2.5 2.5 0 1 1 3.8 2.1c-1 .7-1.5 1.2-1.5 2.4M12 17h.01" /></>,
    lock: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
  };

  return (
    <svg
      aria-hidden="true"
      className="portal-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name] || paths.spark}
    </svg>
  );
}

function formatShortDate(value) {
  return new Intl.DateTimeFormat("es-US", {
    month: "short",
    day: "numeric",
    timeZone: "America/New_York",
  }).format(new Date(value));
}
