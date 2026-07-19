import { notFound } from "next/navigation";
import { createPortalShellModel } from "../../src/portal/portalShell.js";
import { isPortalPrototypeAvailable } from "../../src/portal/portalAvailability.js";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Portal estudiantil | AIT USA Institute",
  robots: {
    index: false,
    follow: false,
  },
};

function stateLabel(state) {
  const labels = {
    ready: "Listo",
    gated: "Con regla",
    pending: "Pendiente",
    blocked: "Bloqueado",
    privacy_gate_required: "Privacidad",
    feature_not_approved: "No aprobado",
  };
  return labels[state] ?? state;
}

function resolveCardState(card) {
  return card.access?.allowed === false ? card.access.reason : card.state;
}

export default function PortalPage() {
  if (!isPortalPrototypeAvailable()) notFound();

  const model = createPortalShellModel("studentActive");
  const title =
    model.state === "ready" ? `Hola, ${model.account.displayName}` : "Cuenta en revision";

  return (
    <>
      <header className="portal-topbar">
        <div className="portal-brand">AIT USA Portal</div>
        <div className="portal-role">{model.roleLabel ?? "Cuenta pendiente"}</div>
      </header>
      <main className="portal-shell">
        <nav className="portal-nav" aria-label="Portal">
          {model.navItems.length === 0 ? (
            <span className="portal-nav__item is-blocked">Soporte</span>
          ) : (
            model.navItems.map((item) => (
              <span
                className={
                  item.access.allowed ? "portal-nav__item" : "portal-nav__item is-blocked"
                }
                key={item.id}
              >
                {item.label}
              </span>
            ))
          )}
        </nav>
        <section className="portal-content">
          <p className="portal-kicker">Prototype fixture</p>
          <h1 className="portal-title">{title}</h1>
          <div className="portal-card-grid">
            {model.cards.map((card) => {
              const state = resolveCardState(card);
              return (
                <article className={`portal-card portal-card--${state}`} key={card.id}>
                  <span className="portal-card__state">{stateLabel(state)}</span>
                  <h2 className="portal-card__title">{card.title}</h2>
                  <p className="portal-card__summary">{card.summary}</p>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}
