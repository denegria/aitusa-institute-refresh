export default function PortalLoading() {
  return (
    <div className="portal-page portal-loading" aria-busy="true">
      <p className="portal-sr-only" role="status">
        Cargando tu portal.
      </p>
      <header className="portal-topbar" aria-hidden="true">
        <div className="portal-brand">
          <span className="portal-skeleton portal-skeleton--logo" />
          <span className="portal-loading__brand-copy">
            <span className="portal-skeleton portal-skeleton--brand" />
            <span className="portal-skeleton portal-skeleton--caption" />
          </span>
        </div>
        <span className="portal-skeleton portal-skeleton--account" />
      </header>

      <div className="portal-shell" aria-hidden="true">
        <aside className="portal-nav portal-loading__nav">
          <span className="portal-skeleton portal-skeleton--caption" />
          {[1, 2, 3, 4, 5].map((item) => (
            <span className="portal-skeleton portal-skeleton--nav" key={item} />
          ))}
        </aside>
        <main className="portal-main">
          <section className="portal-loading__hero">
            <span className="portal-skeleton portal-skeleton--eyebrow" />
            <span className="portal-skeleton portal-skeleton--title" />
            <span className="portal-skeleton portal-skeleton--copy" />
          </section>
          <section className="portal-loading__stack">
            <span className="portal-skeleton portal-skeleton--card" />
            <span className="portal-skeleton portal-skeleton--card portal-skeleton--card-short" />
            <span className="portal-skeleton portal-skeleton--mission" />
          </section>
        </main>
      </div>
    </div>
  );
}
