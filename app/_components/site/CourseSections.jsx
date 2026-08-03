"use client";

import { useMemo, useState } from "react";
import {
  courseCatalog,
  productOfferings,
  programs,
  site,
} from "../../../src/content";

const filters = [
  { label: "Todos", key: "todos" },
  { label: "Inglés", key: "ingles" },
  { label: "Niños", key: "ninos" },
  { label: "Académico", key: "academico" },
  { label: "Tecnología", key: "tecnologia" },
  { label: "Idiomas", key: "idiomas" },
];

function OfferingCard({ item }) {
  return (
    <article className={`offering-card card offering-card--${item.emphasis || "secondary"}`} id={item.anchor || item.key}>
      <img src={item.image} alt={item.imageAlt} />
      <div className="offering-card__body">
        <p className="eyebrow-chip">{item.badge || ""}</p>
        <h3>{item.title}</h3>
        <p>{item.summary}</p>
        <ul>{item.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
        <a className={`button ${item.emphasis === "primary" ? "button--primary" : "button--ghost"}`} href={item.href}>
          {item.cta}
        </a>
      </div>
    </article>
  );
}

export function OfferingsSection() {
  return (
    <section className="section section--soft" id="cursos">
      <div className="section-inner">
        <div className="section-heading">
          <p className="section-kicker">Por dónde empezar</p>
          <h2>Empieza por inglés presencial o compara otras modalidades.</h2>
          <p>Revisa cursos, horarios y requisitos antes de elegir tu ruta.</p>
        </div>
        <div className="offering-grid">
          {productOfferings.map((item) => <OfferingCard item={item} key={item.key} />)}
        </div>
        <div className="catalog-links">
          <a className="button button--primary" href="/cursos/">Ver cursos detallados</a>
          <a className="button button--ghost" href="/placement-test/">Hacer examen de ubicación</a>
        </div>
      </div>
    </section>
  );
}

function ProgramCard({ program }) {
  return (
    <article className="program-card" data-category={program.category}>
      <img src={program.image} alt={program.imageAlt} />
      <div className="program-card__body">
        <p className="eyebrow-chip">{program.mode}</p>
        <h3>{program.title}</h3>
        <p>{program.summary}</p>
        <dl className="program-meta">
          <div><dt>Ideal para</dt><dd>{program.bestFor}</dd></div>
          <div><dt>Audiencia</dt><dd>{program.audience}</dd></div>
        </dl>
        <div className="button-row">
          <a className="button button--primary" href={`/cursos/${program.slug}/`} data-course-detail-link={program.slug}>Abrir ficha completa</a>
          <a className="button button--ghost" href="/placement-test/">Ver mi nivel</a>
        </div>
      </div>
    </article>
  );
}

function CourseDetail({ program, open }) {
  const sections = program.courseDetail?.sections || [];
  const schedule = program.courseDetail?.schedule || [];

  return (
    <details
      className="course-detail"
      id={`detalle-${program.slug}`}
      data-course-detail={program.slug}
      open={open || undefined}
    >
      <summary><span>{program.title}</span><span>{program.mode}</span></summary>
      <div className="course-detail__content">
        <p>{program.courseDetail?.lead || program.summary}</p>
        <div className="course-detail__grid">
          {sections.map((section) => (
            <section key={section.title}>
              <h4>{section.title}</h4>
              <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
          ))}
          <section>
            <h4>Horarios y formato</h4>
            <ul>{schedule.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
        </div>
        <p className="course-note">{program.courseDetail?.note || ""}</p>
        <div className="button-row">
          <a className="button button--primary" href="/placement-test/">Hacer examen de ubicación</a>
          <a className="button button--ghost" href={site.whatsappHref} target="_blank" rel="noreferrer">Confirmar con un asesor</a>
        </div>
      </div>
    </details>
  );
}

export function CourseCatalog({ selectedSlug = null }) {
  const selectedProgram = programs.find((program) => program.slug === selectedSlug);
  const [filter, setFilter] = useState(selectedProgram?.category || "todos");
  const visiblePrograms = useMemo(
    () => programs.filter((program) => filter === "todos" || program.category === filter),
    [filter],
  );

  return (
    <section className="section section--soft" id="catalogo-detallado">
      <div className="section-inner">
        <div className="section-heading">
          <p className="section-kicker">Catálogo completo</p>
          <h2>Compara formatos, horarios y objetivos antes de elegir.</h2>
          <p>Revisa cada programa con calma o comparte la ficha con un asesor para resolver tus dudas.</p>
        </div>
        <div className="filter-bar" role="group" aria-label="Filtrar cursos">
          {filters.map((item) => (
            <button
              className={`filter-chip${filter === item.key ? " is-active" : ""}`}
              type="button"
              aria-pressed={filter === item.key}
              data-filter={item.key}
              onClick={() => setFilter(item.key)}
              key={item.key}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className="course-count">Mostrando {visiblePrograms.length} programas.</p>
        {courseCatalog.map((group) => {
          const groupPrograms = group.programs
            .map((slug) => programs.find((program) => program.slug === slug))
            .filter((program) => program && visiblePrograms.includes(program));
          if (!groupPrograms.length) return null;
          return (
            <section className="catalog-group" id={group.anchor} key={group.key}>
              <div className="catalog-group__heading"><h3>{group.title}</h3><p>{group.description}</p></div>
              <div className="program-grid">
                {groupPrograms.map((program) => <ProgramCard program={program} key={program.slug} />)}
              </div>
            </section>
          );
        })}
        <div className="course-detail-stack">
          {programs.map((program) => (
            <CourseDetail program={program} open={program.slug === selectedSlug} key={program.slug} />
          ))}
        </div>
      </div>
    </section>
  );
}
