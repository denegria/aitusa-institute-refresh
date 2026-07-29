import {
  conversionCtas,
  locations,
  methodNarrative,
  painHero,
  productOfferings,
  site,
  solutionCharacteristics,
} from "../../../src/content";
import { CallbackDialog, FaqList, MethodVideo } from "./InteractiveSections";

export function HeroSection() {
  return (
    <section className="hero" id="inicio">
      <div className="hero__main">
        <div className="hero__copy">
          <div className="hero__title-block">
            <p className="hero__kicker">{painHero.eyebrow || ""}</p>
            <h1>
              <span className="hero__headline-lead">{painHero.headlineLead || ""}</span>
              <span className="hero__headline-emphasis">
                {painHero.headlineEmphasis || painHero.headline || ""}
              </span>
            </h1>
            {painHero.headlineAccent ? <p className="hero__headline-accent">{painHero.headlineAccent}</p> : null}
          </div>
          <p className="hero__summary">
            {(painHero.subheadlineLines || [painHero.subheadline || ""]).map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
          {painHero.objections?.length ? (
            <ul className="hero__objections" aria-label="Preguntas comunes al aprender inglés">
              {painHero.objections.map((item) => <li key={item}><p>{item}</p></li>)}
            </ul>
          ) : null}
          <div className="hero__conversion">
            <div className="button-row hero__actions">
              <a className="button button--primary" href={conversionCtas.placement?.href || "/placement-test/"}>
                {painHero.ctas?.primary || "Conoce tu nivel"}
                <i data-lucide="arrow-right" aria-hidden="true" />
              </a>
              <a className="button button--ghost" href="#metodo">
                <i data-lucide="circle-play" aria-hidden="true" />
                {painHero.ctas?.secondary || "Explora el método"}
              </a>
            </div>
          </div>
          <nav className="hero__modalities" aria-label="Formatos de clase">
            <a href="/courses/#ingles-presencial"><i data-lucide="users-round" aria-hidden="true" /><span>Presencial</span></a>
            <a href="/courses/#ingles-online"><i data-lucide="laptop" aria-hidden="true" /><span>Online</span></a>
            <a href="/courses/#ingles-hibrido"><i data-lucide="monitor-smartphone" aria-hidden="true" /><span>Híbrido</span></a>
          </nav>
        </div>
        <figure className="hero__visual">
          <img
            src={site.images.approvedHero}
            alt="Asesora de AIT USA orientando a una estudiante adulta en un salón de inglés."
            width="1536"
            height="1024"
            fetchPriority="high"
          />
        </figure>
      </div>
    </section>
  );
}

export function MethodSection() {
  return (
    <section className="method-section" id="metodo" aria-labelledby="method-title">
      <div className="method-editorial">
        <header className="method-editorial__intro">
          <p className="method-kicker">{methodNarrative.eyebrow || "Método Graphic Concept"}</p>
          <h2 id="method-title">{methodNarrative.heading || ""}</h2>
          <p>{methodNarrative.introduction || ""}</p>
        </header>
        <MethodVideo narrative={methodNarrative} />
        <ul className="method-reasons" aria-label="Resumen del método en tres razones">
          {solutionCharacteristics.map((item) => (
            <li key={item.key}>
              <span className="method-reason__icon" aria-hidden="true">
                <i data-lucide={item.icon || "circle-check"} />
              </span>
              <div><h3>{item.title}</h3><p>{item.body}</p></div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const supportingPrograms = [
  { label: "Inglés para niños", href: "/courses/ingles-ninos/" },
  { label: "GED", href: "/courses/ged/" },
  { label: "Computación", href: "/courses/#computacion-y-cursos-tecnicos" },
  { label: "Español para extranjeros", href: "/courses/espanol-extranjeros/" },
  { label: "Programas de apoyo", href: "/courses/#apoyo-academico" },
];

export function OfferingPathSection() {
  return (
    <section className="section section--soft" id="cursos">
      <div className="section-inner offer-path">
        <div className="section-heading section-heading--framed">
          <p className="section-kicker">Presencial, híbrido u online</p>
          <h2>¿Cómo quieres estudiar?</h2>
          <p>Compara las clases presenciales, híbridas y online. Si buscas otra meta, también puedes explorar nuestros programas de apoyo.</p>
        </div>
        <div className="offer-map" aria-label="Opciones principales de estudio">
          {productOfferings.slice(0, 3).map((item) => (
            <article className={`offer-node offer-node--${item.emphasis || "secondary"}`} key={item.key}>
              <div className="offer-node__header">
                <span className="offer-node__marker">{item.marker || item.shortLabel || ""}</span>
                {item.emphasis === "primary" ? <span className="offer-node__status">Programa principal</span> : null}
              </div>
              <div><h3>{item.title}</h3><p>{item.summary}</p></div>
              <a className="offer-node__link" href={item.href}>
                {item.cta}<i data-lucide="arrow-right" aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
        <nav className="catalog-programs" aria-label="Otros programas de AIT USA">
          <p className="catalog-programs__label">También ofrecemos</p>
          <ul className="catalog-programs__links">
            {supportingPrograms.map((program) => (
              <li key={program.href}><a className="catalog-programs__link" href={program.href}>{program.label}</a></li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}

function MapPin({ location, index }) {
  const id = location.mapKey || `location-${index + 1}`;
  return (
    <a className={`real-map-pin real-map-pin--${id}`} href={`#sede-${id}`} aria-label={`Ver ${location.city}`}>
      <i data-lucide="map-pin" aria-hidden="true" />
      <strong>{String(index + 1).padStart(2, "0")}</strong>
    </a>
  );
}

function LocationRow({ location, index }) {
  const statusLabel = {
    active: location.note?.includes("principal") ? "Principal" : "Presencial",
    limited: "Con cita",
    online: "Online",
    pending: "Pendiente / no activa",
  };
  const limited = location.status === "limited";
  const online = location.status === "online";
  const id = location.mapKey || "online";
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`;
  const href = limited
    ? `${site.whatsappHref}?text=${encodeURIComponent(`Hola AIT USA, quiero consultar la atención con cita previa en ${location.city}.`)}`
    : online ? "/courses/#ingles-online" : mapsHref;
  const shortCity = online ? "Clases online" : location.city.split(",")[0];
  const supportingText = limited
    ? "Atención disponible con coordinación previa"
    : online ? "Disponible según nivel y zona horaria" : location.address;
  const actionLabel = limited ? "Consultar" : online ? "Ver online" : "Cómo llegar";

  return (
    <a
      className={`compact-location-row compact-location-row--${location.status || "active"}`}
      id={`sede-${id}`}
      href={href}
      target={limited || !online ? "_blank" : undefined}
      rel={limited || !online ? "noreferrer" : undefined}
    >
      <span className="compact-location-row__number" aria-hidden="true">
        {online ? <i data-lucide="monitor" /> : String(index + 1).padStart(2, "0")}
      </span>
      <span className="compact-location-row__copy">
        <span><strong>{shortCity}</strong><em>{statusLabel[location.status] || "Sede"}</em></span>
        <small>{supportingText}</small>
      </span>
      <span className="compact-location-row__action">
        {actionLabel}<i data-lucide={online ? "arrow-right" : "navigation"} aria-hidden="true" />
      </span>
    </a>
  );
}

export function LocationsSection() {
  const published = locations.filter((location) => location.status !== "pending");
  const mapped = published.filter((location) => location.status !== "online");
  const online = published.find((location) => location.status === "online");
  const hours = published.find((location) => location.status === "active")?.hours || [];

  return (
    <section className="section section--white" id="sedes">
      <div className="section-inner">
        <div className="section-heading section-heading--framed">
          <p className="section-kicker">Sedes</p>
          <h2 id="sedes-title">Sedes cerca de ti.</h2>
          <p>Revisa ubicaciones y horarios para elegir la alternativa más conveniente.</p>
        </div>
        <div className="location-explorer">
          <div className="real-map-card">
            <div className="real-map-card__frame">
              <img
                className="real-map-card__image"
                src="/assets/maps/new-jersey-campus-map.jpg"
                alt="Mapa real del centro de Nueva Jersey con Bound Brook, Plainfield, Piscataway y Flemington."
                width="874"
                height="660"
                loading="eager"
                decoding="async"
              />
              <div className="real-map-card__pins" aria-label="Sedes marcadas en el mapa">
                {mapped.map((location, index) => <MapPin key={location.mapKey} location={location} index={index} />)}
              </div>
              <a className="real-map-card__attribution" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap</a>
              <a
                className="real-map-card__expand"
                href="https://www.openstreetmap.org/#map=11/40.57/-74.61"
                target="_blank"
                rel="noreferrer"
                aria-label="Ampliar mapa en OpenStreetMap"
              >
                <i data-lucide="external-link" aria-hidden="true" />
              </a>
            </div>
          </div>
          <div className="location-compact-panel">
            <div className="location-compact-list" aria-label="Sedes presenciales en Nueva Jersey">
              {mapped.map((location, index) => <LocationRow key={location.mapKey} location={location} index={index} />)}
              {online ? <LocationRow location={online} index={mapped.length} /> : null}
            </div>
            <div className="location-hours-panel">
              <div className="location-hours-panel__heading">
                <span className="location-hours-panel__icon"><i data-lucide="clock-3" aria-hidden="true" /></span>
                <div><p className="eyebrow-chip">Horarios publicados</p><h3>Bound Brook · Plainfield · Piscataway</h3></div>
              </div>
              <ul>{hours.map((hour) => <li key={hour}>{hour}</li>)}</ul>
              <p className="location-hours-panel__note">Los cupos pueden variar. Confirma tu turno antes de inscribirte.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FaqSection() {
  return (
    <section className="section faq-section">
      <div className="section-inner faq-layout">
        <div className="section-heading section-heading--framed">
          <p className="section-kicker">Preguntas frecuentes</p>
          <h2>¿Todavía tienes dudas?</h2>
          <p>Aquí respondemos las preguntas que más escuchamos de nuestros estudiantes.</p>
        </div>
        <FaqList />
      </div>
    </section>
  );
}

export function FinalCtaSection() {
  return (
    <section className="section final-cta-section" id="contacto" aria-labelledby="contacto-title">
      <div className="section-inner final-cta-layout">
        <div className="final-cta-copy">
          <div className="section-heading section-heading--framed">
            <p className="section-kicker">Empieza aquí</p>
            <h2 id="contacto-title">¿Listo para empezar?</h2>
            <p>Haz el examen de ubicación y te ayudamos a elegir tu nivel, horario y modalidad. La orientación inicial es gratuita.</p>
          </div>
          <div className="final-cta-conversion">
            <div className="final-cta-actions">
              <a className="button button--primary" href={conversionCtas.placement?.href || "/placement-test/"}>
                Encuentra tu nivel<i data-lucide="arrow-right" aria-hidden="true" />
              </a>
            </div>
            <CallbackDialog />
          </div>
        </div>
      </div>
    </section>
  );
}
