"use client";

import { useState } from "react";
import { courseCatalog, programs } from "../../../src/content";

const allOfferingsKey = "all-offerings";

function getPrograms(slugs) {
  return slugs
    .map((slug) => programs.find((program) => program.slug === slug))
    .filter(Boolean);
}

function ProgramCard({ program }) {
  return (
    <article className="program-card" data-category={program.category}>
      <div className="program-card__identity">
        <p className="eyebrow-chip">{program.mode}</p>
        <h3>{program.title}</h3>
      </div>
      <img src={program.image} alt={program.imageAlt} />
      <div className="program-card__body">
        <p>{program.summary}</p>
        <dl className="program-meta">
          <div><dt>Ideal para</dt><dd>{program.bestFor}</dd></div>
          <div><dt>Audiencia</dt><dd>{program.audience}</dd></div>
        </dl>
        <div className="button-row">
          <a className="button button--primary" href={`/cursos/${program.slug}/`} data-course-detail-link={program.slug}>Learn more</a>
        </div>
      </div>
    </article>
  );
}

export function CourseCatalog() {
  const [activeTab, setActiveTab] = useState(allOfferingsKey);
  const activeGroup = courseCatalog.find((group) => group.key === activeTab);
  const visiblePrograms = activeGroup
    ? getPrograms(activeGroup.programs)
    : courseCatalog.flatMap((group) => getPrograms(group.programs));
  const activeTabId = `catalog-tab-${activeTab}`;
  const panelId = "catalog-panel";

  function handleTabKeyDown(event) {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;

    event.preventDefault();
    const tabKeys = [allOfferingsKey, ...courseCatalog.map((group) => group.key)];
    const currentIndex = tabKeys.indexOf(activeTab);
    const nextIndex = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? tabKeys.length - 1
        : (currentIndex + (event.key === 'ArrowRight' ? 1 : -1) + tabKeys.length) % tabKeys.length;
    const nextKey = tabKeys[nextIndex];

    setActiveTab(nextKey);
    window.requestAnimationFrame(() => document.getElementById(`catalog-tab-${nextKey}`)?.focus());
  }

  return (
    <section className="section section--soft course-catalog" id="catalogo-detallado">
      <div className="section-inner">
        <div className="section-heading">
          <p className="section-kicker">Catálogo detallado</p>
          <h1>Explora cursos, formatos y próximos pasos con más detalle.</h1>
          <p>Compara modalidades, objetivos y horarios para inglés, GED, computación y programas de apoyo.</p>
        </div>
        <div className="catalog-tabs" role="tablist" aria-label="Filtrar el catálogo por tipo de curso">
          <button
            type="button"
            id={`catalog-tab-${allOfferingsKey}`}
            role="tab"
            aria-selected={activeTab === allOfferingsKey}
            aria-controls={panelId}
            tabIndex={activeTab === allOfferingsKey ? 0 : -1}
            onClick={() => setActiveTab(allOfferingsKey)}
            onKeyDown={handleTabKeyDown}
          >
            Todos los cursos
          </button>
          {courseCatalog.map((group) => (
            <button
              type="button"
              id={`catalog-tab-${group.key}`}
              role="tab"
              aria-selected={activeTab === group.key}
              aria-controls={panelId}
              tabIndex={activeTab === group.key ? 0 : -1}
              onClick={() => setActiveTab(group.key)}
              onKeyDown={handleTabKeyDown}
              key={group.key}
            >
              {group.title}
            </button>
          ))}
        </div>
        <section
          className="catalog-panel"
          id={panelId}
          role="tabpanel"
          aria-labelledby={activeTabId}
          tabIndex={0}
        >
          <div className="catalog-group__heading">
            <h2>{activeGroup?.title || "Todos los cursos"}</h2>
            <p>
              {activeGroup?.description || "Explora todas las rutas de inglés, apoyo académico, computación y otros idiomas en un mismo lugar."}
            </p>
          </div>
          <div className="program-grid">
            {visiblePrograms.map((program) => <ProgramCard program={program} key={program.slug} />)}
          </div>
        </section>
      </div>
    </section>
  );
}
