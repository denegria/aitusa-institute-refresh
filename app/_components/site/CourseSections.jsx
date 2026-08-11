import { courseCatalog, programs } from "../../../src/content";

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

export function CourseCatalog() {
  return (
    <section className="section section--soft" id="catalogo-detallado">
      <div className="section-inner">
        <div className="section-heading">
          <p className="section-kicker">Ocho rutas activas</p>
          <h2>Elige una ficha y conoce el siguiente paso.</h2>
          <p>El catálogo resume cada programa. La ficha completa reúne su modalidad, horarios, preguntas frecuentes y formas de contacto.</p>
        </div>
        <nav className="catalog-nav" aria-label="Saltar a un grupo de cursos">
          {courseCatalog.map((group) => <a href={`#${group.anchor}`} key={group.key}>{group.title}</a>)}
        </nav>
        {courseCatalog.map((group) => {
          const groupPrograms = group.programs
            .map((slug) => programs.find((program) => program.slug === slug))
            .filter(Boolean);
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
      </div>
    </section>
  );
}
