import styles from "./employee.module.css";

const NAVIGATION = [
  { id: "overview", label: "Resumen", href: "/employee" },
  { id: "reviews", label: "Revisiones", href: "/employee/placement-reviews" },
  { id: "team", label: "Equipo", href: "/employee/team" },
];

export function EmployeeShell({ actor, active, children }) {
  return <div className={styles.page}>
    <a className={styles.skip} href="#employee-main">Saltar al contenido</a>
    <header className={styles.topbar}>
      <a className={styles.brand} href="/employee" aria-label="AIT USA empleados, inicio">
        <img src="/assets/wix/076-solo-logo-4-x-4-clases1.png" alt="" width="38" height="38" />
        <span><strong>AIT USA</strong><small>Portal de empleados</small></span>
      </a>
      <div className={styles.account}>
        <span aria-hidden="true">{actor.firstName.slice(0, 1).toUpperCase()}</span>
        <div><strong>{actor.firstName}</strong><small>{actor.role === "admin" ? "Administrador" : "Revisor senior"}</small></div>
      </div>
    </header>
    <div className={styles.shell}>
      <nav className={styles.nav} aria-label="Portal de empleados">
        <p>Operaciones académicas</p>
        {NAVIGATION.map((item) => <a className={active === item.id ? styles.active : undefined} href={item.href} aria-current={active === item.id ? "page" : undefined} key={item.id}>{item.label}</a>)}
        <div className={styles.navHelp}><strong>Acceso protegido</strong><span>Solo personal autorizado de AIT USA.</span></div>
      </nav>
      <main className={styles.main} id="employee-main" tabIndex={-1}>{children}</main>
    </div>
  </div>;
}

export function EmployeeHeading({ eyebrow, title, summary, aside = null }) {
  return <header className={styles.heading}>
    <div><p>{eyebrow}</p><h1>{title}</h1><span>{summary}</span></div>
    {aside}
  </header>;
}
