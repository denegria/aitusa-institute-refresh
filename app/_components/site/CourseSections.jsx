"use client";

import Image from "next/image";
import { useState } from "react";
import { catalogInformationRoutes, courseCatalog, programs } from "../../../src/content";

const allOfferingsKey = "all-offerings";
const primaryGroupKey = "english-paths";

function getPrograms(slugs) {
  return slugs
    .map((slug) => programs.find((program) => program.slug === slug))
    .filter(Boolean);
}

function getInformationRoutes(keys) {
  return keys
    .map((key) => catalogInformationRoutes.find((route) => route.key === key))
    .filter(Boolean);
}

function ProgramCard({ program, featured = false }) {
  return (
    <article className={`program-card${featured ? " program-card--featured" : ""}`} data-category={program.category}>
      <div className="program-card__identity">
        <p className="eyebrow-chip">{program.mode}</p>
        <h3>{program.title}</h3>
      </div>
      <Image
        className="program-card__image"
        src={program.image}
        alt={program.imageAlt}
        width={1200}
        height={900}
        sizes="(max-width: 719px) calc(100vw - 32px), (max-width: 1040px) 44vw, 28vw"
      />
      <div className="program-card__body">
        <p>{program.summary}</p>
        <dl className="program-meta">
          <div><dt>Ideal para</dt><dd>{program.bestFor}</dd></div>
          <div><dt>Audiencia</dt><dd>{program.audience}</dd></div>
        </dl>
        <div className="button-row">
          <a
            className="button button--primary"
            href={`/cursos/${program.slug}/`}
            data-course-detail-link={program.slug}
            aria-label={`${program.cta}: ${program.title}`}
          >
            {program.cta}
          </a>
        </div>
      </div>
    </article>
  );
}

function InformationRouteCard({ route }) {
  return (
    <article className="program-card program-card--informational" data-category="information">
      <div className="program-card__identity">
        <p className="eyebrow-chip">{route.label}</p>
        <h3>{route.title}</h3>
      </div>
      <Image
        className="program-card__image"
        src={route.image}
        alt={route.imageAlt}
        width={1200}
        height={900}
        sizes="(max-width: 719px) calc(100vw - 32px), (max-width: 1040px) 44vw, 28vw"
      />
      <div className="program-card__body">
        <p>{route.summary}</p>
        <p className="program-card__note">{route.note}</p>
        <div className="button-row">
          <a
            className="button button--primary"
            href={route.href}
            data-information-route-link={route.key}
            aria-label={`${route.cta}: ${route.title}`}
          >
            {route.cta}
          </a>
        </div>
      </div>
    </article>
  );
}

function ProgramGrid({ programsToRender, featured = false, supporting = false }) {
  return (
    <div className={`program-grid${featured ? " program-grid--featured" : ""}${supporting ? " program-grid--supporting" : ""}`}>
      {programsToRender.map((program) => (
        <ProgramCard program={program} featured={featured} key={program.slug} />
      ))}
    </div>
  );
}

function InformationRouteGrid({ routes }) {
  return (
    <div className="program-grid program-grid--supporting">
      {routes.map((route) => <InformationRouteCard route={route} key={route.key} />)}
    </div>
  );
}

function CatalogGroup({ group }) {
  const groupPrograms = getPrograms(group.programs);
  const groupInformationRoutes = getInformationRoutes(group.informationRoutes || []);
  const isPrimary = group.key === primaryGroupKey;

  return (
    <section className={`catalog-subgroup${isPrimary ? " catalog-subgroup--primary" : ""}`} aria-labelledby={`catalog-subgroup-${group.key}`}>
      <div className="catalog-subgroup__heading">
        <p className="section-kicker">{isPrimary ? "Tres formas de estudiar inglés" : "También puedes elegir"}</p>
        <h3 id={`catalog-subgroup-${group.key}`}>{group.title}</h3>
        <p>{group.description}</p>
      </div>
      <ProgramGrid programsToRender={groupPrograms} featured={isPrimary} supporting={!isPrimary} />
      {groupInformationRoutes.length ? <InformationRouteGrid routes={groupInformationRoutes} /> : null}
    </section>
  );
}

export function CourseCatalog() {
  const [activeTab, setActiveTab] = useState(allOfferingsKey);
  const activeGroup = courseCatalog.find((group) => group.key === activeTab);
  const primaryGroup = courseCatalog.find((group) => group.key === primaryGroupKey);
  const primaryPrograms = getPrograms(primaryGroup?.programs || []);
  const visiblePrograms = activeGroup
    ? getPrograms(activeGroup.programs)
    : courseCatalog.flatMap((group) => getPrograms(group.programs));
  const visibleInformationRoutes = activeGroup
    ? getInformationRoutes(activeGroup.informationRoutes || [])
    : courseCatalog.flatMap((group) => getInformationRoutes(group.informationRoutes || []));
  const activeTabId = `catalog-tab-${activeTab}`;
  const panelId = "catalog-panel";
  const formatSummary = [...new Set(visiblePrograms.map((program) => program.mode))].join(" · ");

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
    <section className="section section--soft course-catalog" id="catalogo-detallado" aria-labelledby="catalog-title">
      <div className="section-inner">
        <div className="course-catalog__intro">
          <div className="course-catalog__intro-copy">
            <p className="section-kicker">Catálogo detallado</p>
            <h1 id="catalog-title">Elige una ruta que puedas sostener.</h1>
            <p className="course-catalog__lead">
              Compara cómo se estudia, para quién encaja y qué siguiente paso tiene cada programa de AiT USA.
            </p>
            <div className="course-catalog__decision-guide">
              <p className="course-catalog__guide-label">Empieza por tu forma de estudiar</p>
              <div className="course-catalog__route-list">
                {primaryPrograms.map((program) => (
                  <a href={`/cursos/${program.slug}/`} className="course-catalog__route" key={program.slug}>
                    <span className="course-catalog__route-mode">{program.mode}</span>
                    <strong>{program.title}</strong>
                    <span>{program.bestFor}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
          {primaryPrograms[0] ? (
            <figure className="course-catalog__intro-media">
              <Image
                src={primaryPrograms[0].image}
                alt={primaryPrograms[0].imageAlt}
                width={1448}
                height={1086}
                sizes="(max-width: 719px) calc(100vw - 32px), (max-width: 1040px) 44vw, 38vw"
                priority
              />
              <figcaption>
                <span>Ruta principal</span>
                <strong>{primaryPrograms[0].title} · {primaryPrograms[0].mode}</strong>
              </figcaption>
            </figure>
          ) : null}
        </div>

        <div className="catalog-tabs" role="tablist" aria-label="Filtrar el catálogo por tipo de ruta">
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

        <div className="catalog-panel__layout">
          <section
            className="catalog-panel"
            id={panelId}
            role="tabpanel"
            aria-labelledby={activeTabId}
            tabIndex={0}
          >
            {activeGroup ? (
              <>
                <div className="catalog-group__heading">
                  <p className="section-kicker">{activeGroup.key === primaryGroupKey ? "Ruta principal" : "Programas de apoyo"}</p>
                  <h2>{activeGroup.title}</h2>
                  <p>{activeGroup.description}</p>
                </div>
                <ProgramGrid
                  programsToRender={visiblePrograms}
                  featured={activeGroup.key === primaryGroupKey}
                  supporting={activeGroup.key !== primaryGroupKey}
                />
                {visibleInformationRoutes.length ? <InformationRouteGrid routes={visibleInformationRoutes} /> : null}
              </>
            ) : (
              <div className="catalog-group-list">
                {courseCatalog.map((group) => <CatalogGroup group={group} key={group.key} />)}
              </div>
            )}
          </section>

          <aside className="course-catalog__fact-card" aria-labelledby="catalog-facts-title">
            <p className="section-kicker">Para decidir con claridad</p>
            <h2 id="catalog-facts-title">Mira primero el formato, el objetivo y el estado.</h2>
            <p>Las tarjetas reúnen los datos publicados para comparar programas y rutas informativas sin adivinar qué aplica.</p>
            <dl>
              <div>
                <dt>Rutas visibles</dt>
                <dd>{visiblePrograms.length + visibleInformationRoutes.length}</dd>
              </div>
              <div>
                <dt>Formatos</dt>
                <dd>{formatSummary}</dd>
              </div>
            </dl>
            <p className="course-catalog__fact-note">Cada botón lleva a la ficha publicada o a una página informativa con su estado claro.</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
