(function () {
const {
  books,
  differentiators,
  downloads,
  faqs,
  heroPoints,
  locations,
  methodBlocks,
  modalities,
  nav,
  programs,
  requirements,
  schedules,
  site,
  stats,
  storeProducts,
  teachers,
  testimonials,
} = window.AITUSA_DATA;

const app = document.querySelector("#app");
const initials = ["Todos", "Ingles", "Ninos", "Academico", "Tecnologia"];

const categoryLabel = {
  Todos: "todos",
  Ingles: "ingles",
  Ninos: "ninos",
  Academico: "academico",
  Tecnologia: "tecnologia",
};

const joinList = (items) => items.map((item) => `<li>${item}</li>`).join("");
const renderVariants = (variants = []) => {
  if (!variants.length) return "";
  const preview = variants.slice(0, 3);
  const remaining = variants.length - preview.length;

  return `<ul class="variant-list">${preview
    .map((variant) => `<li><span>${variant.name}</span><strong>${variant.price}</strong></li>`)
    .join("")}${remaining ? `<li><span>+ ${remaining} variantes más</span><strong>Ver Wix</strong></li>` : ""}</ul>`;
};

const contactMessage = encodeURIComponent(
  "Hola AiT USA Institute, quiero informacion sobre clases de ingles.",
);

app.innerHTML = `
  <header class="site-header" data-header>
    <a class="brand" href="#inicio" aria-label="${site.name}">
      <img src="${site.images.logo}" alt="" />
      <span>
        <strong>AiT USA</strong>
        <small>Institute</small>
      </span>
    </a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
      Menu
    </button>
    <nav id="site-nav" class="site-nav" aria-label="Principal">
      ${nav.map(([label, id]) => `<a href="#${id}">${label}</a>`).join("")}
    </nav>
    <a class="header-cta" href="${site.whatsappHref}?text=${contactMessage}">WhatsApp</a>
  </header>

  <main>
    <section id="inicio" class="hero" style="background-image: linear-gradient(90deg, rgba(7, 17, 38, .92), rgba(7, 17, 38, .68), rgba(7, 17, 38, .18)), url('${site.images.hero}')">
      <div class="hero__inner">
        <p class="section-kicker">${site.tagline}</p>
        <h1>${site.name}</h1>
        <p class="hero__lead">
          Aprende tecnicas para hablar y comprender ingles sin traducir palabra por palabra.
          Clases presenciales, hibridas y online para estudiantes dentro y fuera de Estados Unidos.
        </p>
        <div class="hero__actions">
          <a class="button button--primary" href="${site.whatsappHref}?text=${contactMessage}">Textanos por WhatsApp</a>
          <a class="button button--ghost" href="${site.forms.registration}" target="_blank" rel="noreferrer">Quiero inscribirme</a>
        </div>
        <ul class="hero__points">
          ${joinList(heroPoints)}
        </ul>
      </div>
    </section>

    <section class="stats-band" aria-label="Datos principales">
      <div class="section-inner stats-grid">
        ${stats
          .map(
            (stat) => `
              <div>
                <strong>${stat.value}</strong>
                <span>${stat.label}</span>
              </div>
            `,
          )
          .join("")}
      </div>
    </section>

    <section class="section section--white" aria-labelledby="diferente-title">
      <div class="section-inner intro-grid">
        <div>
          <p class="section-kicker">Por que somos diferentes</p>
          <h2 id="diferente-title">Una ruta visual para dejar de traducir y empezar a responder.</h2>
        </div>
        <p>
          El sitio actual enfatiza una idea clara: el estudiante no necesita memorizar miles de palabras
          para avanzar. AiT USA Institute organiza el aprendizaje con metodos, tecnicas y estrategias
          propias desarrolladas durante mas de 20 anos con la comunidad.
        </p>
      </div>
      <div class="section-inner reason-grid">
        ${differentiators
          .map(
            (item, index) => `
              <article class="reason-card">
                <span>${String(index + 1).padStart(2, "0")}</span>
                <h3>${item.title}</h3>
                <p>${item.text}</p>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>

    <section id="cursos" class="section section--soft" aria-labelledby="cursos-title">
      <div class="section-inner section-heading">
        <p class="section-kicker">Cursos</p>
        <h2 id="cursos-title">Programas capturados del sitio actual</h2>
        <p>Ingles ESL, ninos online, apoyo academico y tecnologia en un catalogo mas claro para escanear.</p>
      </div>
      <div class="section-inner filter-bar" role="group" aria-label="Filtrar cursos">
        ${initials
          .map(
            (label, index) => `
              <button class="filter-button" type="button" data-filter="${categoryLabel[label]}" aria-pressed="${index === 0 ? "true" : "false"}">${label}</button>
            `,
          )
          .join("")}
      </div>
      <div class="section-inner program-grid" data-program-grid>
        ${programs
          .map(
            (program) => `
              <article class="program-card" data-category="${program.category}">
                <img src="${program.image}" alt="" loading="lazy" />
                <div>
                  <p>${program.mode}</p>
                  <h3>${program.title}</h3>
                  <span>${program.audience}</span>
                  <p>${program.summary}</p>
                  <ul>${joinList(program.details)}</ul>
                </div>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>

    <section id="metodo" class="section section--white" aria-labelledby="metodo-title">
      <div class="section-inner split">
        <div>
          <p class="section-kicker">Metodo Graphic Concept</p>
          <h2 id="metodo-title">El contenido se organiza alrededor de comprender, practicar y hablar.</h2>
          <p>
            La metodologia GC aparece en varias paginas como el centro academico de AiT USA Institute:
            una forma grafica de visualizar tiempos, palabras y estructura para que el ingles sea mas facil
            de usar en situaciones reales.
          </p>
        </div>
        <div class="method-list">
          ${methodBlocks
            .map(
              (block) => `
                <article class="method-item">
                  <img src="${block.image}" alt="" loading="lazy" />
                  <div>
                    <h3>${block.title}</h3>
                    <p>${block.text}</p>
                  </div>
                </article>
              `,
            )
            .join("")}
        </div>
      </div>
    </section>

    <section id="libros" class="section section--blue" aria-labelledby="libros-title">
      <div class="section-inner section-heading section-heading--inverted">
        <p class="section-kicker">Nuestros libros</p>
        <h2 id="libros-title">Material academico propio para seguir la hoja de ruta.</h2>
        <p>Los libros son soporte del metodo, la tecnica y la estrategia para poner en practica el ingles.</p>
      </div>
      <div class="section-inner book-grid">
        ${books
          .map(
            (book) => `
              <article class="book-card">
                <img src="${book.image}" alt="${book.title}" loading="lazy" />
                <div>
                  <h3>${book.title}</h3>
                  <span>${book.subtitle}</span>
                  <p>${book.text}</p>
                </div>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>

    <section id="horarios" class="section section--white" aria-labelledby="horarios-title">
      <div class="section-inner split split--center">
        <div>
          <p class="section-kicker">Horarios y modalidad</p>
          <h2 id="horarios-title">El estudiante elige el horario y la modalidad que mejor encaja.</h2>
          <div class="modality-grid">
            ${modalities
              .map(
                (mode) => `
                  <article>
                    <h3>${mode.title}</h3>
                    <p>${mode.text}</p>
                  </article>
                `,
              )
              .join("")}
          </div>
        </div>
        <div class="schedule-panel">
          ${schedules
            .map(
              (schedule) => `
                <article>
                  <h3>${schedule.label}</h3>
                  <ul>${joinList(schedule.times)}</ul>
                </article>
              `,
            )
            .join("")}
        </div>
      </div>
    </section>

    <section id="sedes" class="section section--soft" aria-labelledby="sedes-title">
      <div class="section-inner section-heading">
        <p class="section-kicker">Contacto y sedes</p>
        <h2 id="sedes-title">New Jersey, New York online y atencion por WhatsApp.</h2>
        <p>Los datos se copiaron del sitio publico actual para que puedan verificarse contra el dashboard de Wix.</p>
      </div>
      <div class="section-inner location-grid">
        ${locations
          .map(
            (location) => `
              <article class="location-card">
                <h3>${location.city}</h3>
                <p>${location.address}</p>
                <span>${location.note}</span>
              </article>
            `,
          )
          .join("")}
      </div>
      <div class="section-inner contact-strip">
        <a href="${site.phoneHref}">${site.phone}</a>
        <a href="${site.whatsappHref}?text=${contactMessage}">WhatsApp ${site.whatsapp}</a>
        <a href="${site.facebookHref}" target="_blank" rel="noreferrer">Facebook</a>
      </div>
    </section>

    <section class="section section--white" aria-labelledby="about-title">
      <div class="section-inner about-grid">
        <div>
          <p class="section-kicker">Nosotros</p>
          <h2 id="about-title">Una institucion educativa creada en New Jersey para romper esquemas tradicionales.</h2>
          <p>
            AiT USA Institute comunica mas de 20 anos capacitando personas con metodos, tecnicas y estrategias
            propias para hablar ingles facil y rapido. La escuela presenta su plataforma digital y sus sedes
            fisicas como una forma de acercarse a estudiantes dentro y fuera de Estados Unidos.
          </p>
        </div>
        <div class="mission-grid">
          <article>
            <h3>Mision</h3>
            <p>Ensenar con metodos propios, tecnicas y estrategias diferentes a la educacion tradicional.</p>
          </article>
          <article>
            <h3>Vision</h3>
            <p>Ayudar a que las personas puedan hablar ingles facil y rapido en un mundo globalizado.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section section--blue" aria-labelledby="testimonios-title">
      <div class="section-inner split">
        <div>
          <p class="section-kicker">Testimonios y profesores</p>
          <h2 id="testimonios-title">El mensaje central es confianza para hablar.</h2>
          <ul class="teacher-list">${joinList(teachers)}</ul>
        </div>
        <div class="testimonial-grid">
          ${testimonials
            .map(
              (item) => `
                <article class="testimonial-card">
                  <img src="${item.image}" alt="" loading="lazy" />
                  <p>${item.text}</p>
                  <strong>${item.name}</strong>
                </article>
              `,
            )
            .join("")}
        </div>
      </div>
    </section>

    <section class="section section--white" aria-labelledby="downloads-title">
      <div class="section-inner section-heading">
        <p class="section-kicker">Descargas</p>
        <h2 id="downloads-title">Herramientas para estudiantes registrados en clases online.</h2>
        <p>Esta seccion conserva el contenido de descarga publico; los archivos reales deben validarse desde Wix.</p>
      </div>
      <div class="section-inner download-grid">
        ${downloads
          .map(
            (item) => `
              <article class="download-card">
                <img src="${item.image}" alt="" loading="lazy" />
                <h3>${item.title}</h3>
                <p>${item.text}</p>
              </article>
            `,
          )
          .join("")}
      </div>
      <div class="section-inner requirement-grid">
        ${requirements
          .map(
            (item) => `
              <article class="requirement">
                <img src="${item.image}" alt="" loading="lazy" />
                <div>
                  <h3>${item.title}</h3>
                  <p>${item.text}</p>
                </div>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>

    <section class="section section--soft" aria-labelledby="pagos-title">
      <div class="section-inner section-heading">
        <p class="section-kicker">Productos y pagos</p>
        <h2 id="pagos-title">Catálogo real capturado desde el backend de Wix.</h2>
        <p>Productos, precios, SKUs y variantes listos para conectar con Wix, Stripe, PayPal o la plataforma que el cliente apruebe.</p>
      </div>
      <div class="section-inner payment-grid">
        ${storeProducts
          .map(
            (item) => `
              <article class="payment-card">
                <img src="${item.image}" alt="" loading="lazy" />
                <div class="payment-card__body">
                  <h3>${item.title}</h3>
                  <div class="payment-card__meta">
                    <strong class="payment-card__price">${item.price}</strong>
                    <span>${item.status}${item.sku ? ` · SKU ${item.sku}` : ""}</span>
                  </div>
                  <p>${item.note}</p>
                  ${renderVariants(item.variants)}
                </div>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>

    <section id="faq" class="section section--white" aria-labelledby="faq-title">
      <div class="section-inner section-heading">
        <p class="section-kicker">Preguntas frecuentes</p>
        <h2 id="faq-title">Objeciones comunes, respondidas con el mensaje original del instituto.</h2>
      </div>
      <div class="section-inner faq-list">
        ${faqs
          .map(
            (faq, index) => `
              <details ${index === 0 ? "open" : ""}>
                <summary>${faq.question}</summary>
                <p>${faq.answer}</p>
              </details>
            `,
          )
          .join("")}
      </div>
    </section>

    <section id="contacto" class="section section--contact" aria-labelledby="contacto-title">
      <div class="section-inner contact-grid">
        <div>
          <p class="section-kicker">Comienza ahora</p>
          <h2 id="contacto-title">Cada logro comienza con la decision de intentarlo.</h2>
          <p>
            Completa el formulario para preparar el mensaje por WhatsApp. Cuando el dashboard de Wix este disponible,
            este bloque se puede conectar al formulario real del cliente.
          </p>
          <div class="direct-contact">
            <a href="${site.phoneHref}">${site.phone}</a>
            <a href="${site.whatsappHref}?text=${contactMessage}">${site.whatsapp}</a>
            <a href="${site.forms.registration}" target="_blank" rel="noreferrer">Inscripcion gratuita</a>
          </div>
        </div>
        <form class="lead-form" data-lead-form>
          <div class="form-row">
            <label>Nombre <input name="nombre" autocomplete="given-name" required /></label>
            <label>Apellido <input name="apellido" autocomplete="family-name" required /></label>
          </div>
          <label>Email <input name="email" type="email" autocomplete="email" required /></label>
          <div class="form-row">
            <label>Para quien es
              <select name="para">
                <option>Mi</option>
                <option>Hijo/a</option>
                <option>Alguien</option>
              </select>
            </label>
            <label>Edad <input name="edad" inputmode="numeric" /></label>
          </div>
          <div class="form-row">
            <label>Codigo pais <input name="codigo" placeholder="+1" /></label>
            <label>Telefono <input name="telefono" type="tel" autocomplete="tel" required /></label>
          </div>
          <label>Pais y ciudad <input name="ubicacion" required /></label>
          <button class="button button--primary" type="submit">Preparar mensaje</button>
          <p class="form-status" role="status" data-form-status></p>
          <a class="button button--ghost form-whatsapp" data-form-whatsapp href="${site.whatsappHref}?text=${contactMessage}">Enviar por WhatsApp</a>
        </form>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div>
      <strong>${site.name}</strong>
      <span>${site.legal}</span>
    </div>
    <p>Contenido capturado desde ${site.originalSite} para una reconstruccion local. © ${site.founded} ${site.name}.</p>
  </footer>
`;

const menuToggle = document.querySelector(".menu-toggle");
const navEl = document.querySelector(".site-nav");
menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  navEl.classList.toggle("is-open", !isOpen);
});

navEl.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    menuToggle.setAttribute("aria-expanded", "false");
    navEl.classList.remove("is-open");
  }
});

const filterButtons = [...document.querySelectorAll(".filter-button")];
const programCards = [...document.querySelectorAll(".program-card")];

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));

    programCards.forEach((card) => {
      const matches = filter === "todos" || card.dataset.category === filter;
      card.hidden = !matches;
    });
  });
});

const form = document.querySelector("[data-lead-form]");
const status = document.querySelector("[data-form-status]");
const whatsappDraft = document.querySelector("[data-form-whatsapp]");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const message = [
    "Hola AiT USA Institute, quiero informacion.",
    `Nombre: ${data.get("nombre")} ${data.get("apellido")}`,
    `Email: ${data.get("email")}`,
    `Para: ${data.get("para")}`,
    `Edad: ${data.get("edad") || "No indicado"}`,
    `Telefono: ${data.get("codigo") || ""} ${data.get("telefono")}`,
    `Ubicacion: ${data.get("ubicacion")}`,
  ].join("\n");

  whatsappDraft.href = `${site.whatsappHref}?text=${encodeURIComponent(message)}`;
  status.textContent = "Mensaje listo. Usa el boton de WhatsApp para enviarlo al equipo.";
});
})();
