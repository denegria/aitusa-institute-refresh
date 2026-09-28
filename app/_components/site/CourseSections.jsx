"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { catalogInformationRoutes, courseCatalog, programs, site } from "../../../src/content";
import { catalogChoices, catalogHref, courseComparison, courseInquiryHref, normalizeCatalogGroup } from "../../../src/courseDiscovery";
import { CallbackDialog, FaqList } from "./InteractiveSections";

const allOfferingsKey = "all-offerings";
const primaryGroupKey = "english-paths";

function ProgramCard({ program, activeTab }) {
  const facts = courseComparison[program.slug];
  return (
    <article className="program-card chooser-card" id={`curso-${program.slug}`} data-category={program.category}>
      <Image className="program-card__image" src={program.image} alt={program.imageAlt}
        width={1200} height={900} sizes="(max-width: 719px) 104px, (max-width: 1040px) 44vw, 30vw" />
      <div className="program-card__body">
        <span className="chooser-card__mode">{program.mode}</span>
        <h3>{program.title}</h3>
        <p className="chooser-card__fit">{facts.fit}</p>
        <p className="chooser-card__format">{facts.compactFormat}</p>
        <Link className="chooser-card__action" href={`/cursos/${program.slug}/?grupo=${activeTab}`}
          data-course-detail-link={program.slug} aria-label={`${program.cta}: ${program.title}`}>
          {program.cta}<span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

function InformationRouteCard({ route }) {
  return (
    <article className="catalog-information" data-category="information">
      <p className="section-kicker">Información, no curso publicado</p>
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
      <section className="section course-catalog prospect-catalog course-chooser" id="catalogo-detallado" aria-labelledby="catalog-title">
        <div className="section-inner">
          <header className="course-catalog__intro">
            <div className="course-catalog__intro-copy">
              <p className="section-kicker">AIT USA · Cursos</p>
              <h1 id="catalog-title">Encuentra tu próximo curso.</h1>
              <p className="course-catalog__lead">Elige un área y compara las opciones que mejor encajan contigo.</p>
            </div>
            <div className="course-chooser__help" aria-label="Ayuda para elegir">
              <p className="section-kicker">¿No sabes cuál elegir?</p>
              <strong>Te ayudamos a elegir.</strong>
              <p>Admisiones confirma sede, horario, duración y costo antes de inscribirte.</p>
              <div className="course-chooser__help-actions">
                <CallbackDialog key={activeTab} defaultSubject="" subjectGroup={activeTab} />
                <a href={courseInquiryHref(site.whatsappHref, context)} target="_blank" rel="noreferrer">WhatsApp ↗</a>
              </div>
            </div>
          </header>
          <p className="course-chooser__filter-label">Explora por área</p>
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
            {visibleCount} cursos
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
              </section>
            ))}
          </section>
          {englishSelected ? <p className="course-chooser__placement"><Link href="/placement-test/">¿No sabes tu nivel de inglés? Explora tu nivel.</Link><span>Opcional · 62 preguntas · 10–15 minutos.</span></p> : null}
          {visibleInformationRoutes.length ? (
            <aside className="course-chooser__information" aria-labelledby="course-information-title">
              <div>
                <p className="section-kicker">Además de los cursos</p>
                <h2 id="course-information-title">Información para tu próximo paso.</h2>
              </div>
              {visibleInformationRoutes.map((key) => <InformationRouteCard key={key} route={catalogInformationRoutes.find((route) => route.key === key)} />)}
            </aside>
          ) : null}
          {englishSelected ? <details className="course-chooser__faq"><summary>Preguntas sobre estudiar inglés</summary><FaqList /></details> : null}
        </div>
      </section>
    </>
  );
}
