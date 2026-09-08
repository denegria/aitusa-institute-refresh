"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { catalogInformationRoutes, courseCatalog, programs, site } from "../../../src/content";
import { catalogChoices, catalogHref, courseComparison, courseInquiryHref, normalizeCatalogGroup } from "../../../src/courseDiscovery";
import { CallbackDialog, FaqList } from "./InteractiveSections";
import { CourseQuickFacts } from "./CourseQuickFacts";

const allOfferingsKey = "all-offerings";
const primaryGroupKey = "english-paths";

function ProgramCard({ program, activeTab }) {
  const facts = courseComparison[program.slug];
  return (
    <article className="program-card" id={`curso-${program.slug}`} data-category={program.category}>
      <Image className="program-card__image" src={program.image} alt={program.imageAlt}
        width={1200} height={900} sizes="(max-width: 719px) calc(100vw - 32px), (max-width: 1040px) 44vw, 30vw" />
      <div className="program-card__body">
        <h3>{program.title}</h3>
        <p>{facts.fit}</p>
        <CourseQuickFacts slug={program.slug} />
        <div className="button-row">
          <Link className="button button--primary" href={`/cursos/${program.slug}/?grupo=${activeTab}`}
            data-course-detail-link={program.slug} aria-label={`${program.cta}: ${program.title}`}>
            {program.cta}
          </Link>
        </div>
      </div>
    </article>
  );
}

function InformationRouteCard({ route }) {
  return (
    <article className="catalog-information" data-category="information">
      <p className="section-kicker">{route.label}</p>
      <h3>{route.title}</h3>
      <p>{route.note}</p>
      <Link href={route.href} data-information-route-link={route.key}>{route.cta} →</Link>
    </article>
  );
}

export function CourseCatalog({ initialGroup = allOfferingsKey }) {
  const [activeTab, setActiveTab] = useState(normalizeCatalogGroup(initialGroup));
  useEffect(() => {
    const restore = () => setActiveTab(normalizeCatalogGroup(new URLSearchParams(window.location.search).get("grupo")));
    restore();
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, []);
  const activeGroup = courseCatalog.find((group) => group.key === activeTab);
  const visibleGroups = activeGroup ? [activeGroup] : courseCatalog;
  const visibleCount = visibleGroups.reduce((count, group) => count + group.programs.length, 0);
  const visibleInformationRoutes = visibleGroups.flatMap((group) => group.informationRoutes || []);
  const englishSelected = activeTab === primaryGroupKey;
  const context = catalogChoices.find((choice) => choice.key === activeTab)?.label || "Todos los cursos";

  function selectTab(key) {
    if (key === activeTab) return;
    window.history.pushState(null, "", catalogHref(key));
    setActiveTab(key);
  }

  function handleTabKeyDown(event) {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const keys = [allOfferingsKey, ...catalogChoices.map((choice) => choice.key)];
    const index = keys.indexOf(activeTab);
    const next = event.key === "Home" ? 0 : event.key === "End" ? keys.length - 1
      : (index + (event.key === "ArrowRight" ? 1 : -1) + keys.length) % keys.length;
    selectTab(keys[next]);
    window.requestAnimationFrame(() => document.getElementById(`catalog-tab-${keys[next]}`)?.focus());
  }

  return (
    <>
      <section className="section course-catalog prospect-catalog" id="catalogo-detallado" aria-labelledby="catalog-title">
        <div className="section-inner">
          <header className="course-catalog__intro">
            <div className="course-catalog__intro-copy">
              <p className="section-kicker">AIT USA · Catálogo de cursos</p>
              <h1 id="catalog-title">Encuentra el curso para tu objetivo.</h1>
              <p className="course-catalog__lead">Compara cursos y encuentra tu próximo paso.</p>
              <p className="catalog-location-note">Inglés en Nueva Jersey y online. Confirma sede, horario y cupo con admisiones.</p>
            </div>
            <a className="catalog-help-link" href="#orientacion-catalogo">¿Necesitas ayuda para elegir? ↓</a>
          </header>
          <div className="catalog-tabs" role="tablist" aria-label="Filtrar cursos por objetivo">
            {[{ key: allOfferingsKey, label: "Todos" }, ...catalogChoices].map((choice) => (
              <button type="button" id={`catalog-tab-${choice.key}`} role="tab"
                aria-selected={activeTab === choice.key} aria-controls="catalog-panel"
                tabIndex={activeTab === choice.key ? 0 : -1}
                onClick={() => selectTab(choice.key)} onKeyDown={handleTabKeyDown} key={choice.key}>
                {choice.label}
              </button>
            ))}
          </div>
          <p className="catalog-result-count" role="status" aria-live="polite" aria-atomic="true">
            {visibleCount} cursos{visibleInformationRoutes.length ? ` · ${visibleInformationRoutes.length} ruta informativa, sin curso publicado` : ""}
          </p>
          <section className="catalog-panel" id="catalog-panel" role="tabpanel" aria-labelledby={`catalog-tab-${activeTab}`} tabIndex={0}>
            {visibleGroups.map((group) => (
              <section className="catalog-subgroup" aria-labelledby={`catalog-subgroup-${group.key}`} key={group.key}>
                <header className="catalog-subgroup__heading">
                  <h2 id={`catalog-subgroup-${group.key}`}>{catalogChoices.find((choice) => choice.key === group.key)?.label}</h2>
                  <p>{catalogChoices.find((choice) => choice.key === group.key)?.description}</p>
                  {group.key === "digital-technical" ? <p>¿Empiezas desde cero? Revisa computación básica. Si ya manejas tareas digitales y buscas Word, Excel o PowerPoint, compara la ruta de oficina con admisiones.</p> : null}
                </header>
                <div className={`program-grid${group.programs.length < 3 ? " program-grid--supporting" : ""}`}>
                  {group.programs.map((slug) => <ProgramCard key={slug} program={programs.find((program) => program.slug === slug)} activeTab={activeTab} />)}
                </div>
                {(group.informationRoutes || []).map((key) => <InformationRouteCard key={key} route={catalogInformationRoutes.find((route) => route.key === key)} />)}
              </section>
            ))}
          </section>
        </div>
      </section>
      <section className="section catalog-guidance" id="orientacion-catalogo" aria-labelledby="catalog-guidance-title">
        <div className="section-inner">
          <div className="section-heading">
            <p className="section-kicker">Tu siguiente paso · {context}</p>
            <h2 id="catalog-guidance-title">Elige con ayuda de admisiones.</h2>
            <p>Cuéntanos qué quieres aprender y tu disponibilidad. Te ayudamos a confirmar duración, requisitos, sede o modalidad, horario y costo antes de inscribirte.</p>
          </div>
          <div className="button-row">
            <CallbackDialog key={activeTab} defaultSubject="" subjectGroup={activeTab} primary />
            <a className="course-program-text-link" href={courseInquiryHref(site.whatsappHref, context)} target="_blank" rel="noreferrer">Consultar por WhatsApp</a>
          </div>
          {englishSelected ? <p className="course-assessment-option"><Link href="/placement-test/">Explorar mi nivel de inglés</Link><span>Opcional antes de consultar · 62 preguntas · 10–15 minutos.</span></p> : null}
          <details className="catalog-confirmation">
            <summary>¿Qué necesito confirmar antes de inscribirme?</summary>
            <p>Elige una ficha para ver el contenido y los horarios publicados. Admisiones confirma el grupo activo, la sede o plataforma, requisitos, materiales y costo. Las duraciones estimadas dependen de tu punto de partida y práctica.</p>
          </details>
          {englishSelected ? <div className="catalog-english-faq"><h3>Preguntas sobre estudiar inglés</h3><FaqList /></div> : null}
        </div>
      </section>
    </>
  );
}
