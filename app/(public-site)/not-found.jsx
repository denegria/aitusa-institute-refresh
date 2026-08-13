import { SiteFooter, SiteHeader } from "../_components/site/SiteChrome";

export default function PublicNotFound() {
  return (
    <>
      <SiteHeader activePage="not-found" />
      <main id="main-content">
        <section className="page-hero" aria-labelledby="not-found-title">
          <div className="section-inner">
            <div className="hero__copy">
              <p className="section-kicker">AIT USA Institute</p>
              <h1 id="not-found-title">No encontramos esta página.</h1>
              <p>Puede que el enlace haya cambiado. Regresa al inicio o explora el catálogo de cursos.</p>
              <div className="hero__actions">
                <a className="button button--primary" href="/">Volver al inicio</a>
                <a className="inline-link" href="/cursos/">Ver cursos</a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
