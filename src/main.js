(function () {
const {
  books,
  differentiators,
  downloads,
  faqs,
  heroGallery,
  heroPoints,
  instructorClips,
  heroProof,
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
const initials = ["Todos", "Inglés", "Niños", "Académico", "Tecnología"];

const categoryLabel = {
  Todos: "todos",
  Inglés: "ingles",
  Niños: "ninos",
  Académico: "academico",
  Tecnología: "tecnologia",
};

const joinList = (items) => items.map((item) => `<li>${item}</li>`).join("");
const playIcon = `
  <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
    <path d="M8 5.5v13l10.5-6.5L8 5.5Z" />
  </svg>
`;
const heroVideoSource = site.heroVideo || site.images.heroVideo || "";

const heroMedia = () => {
  if (heroGallery.length && !heroVideoSource) {
    const chips = heroGallery
      .map(
        (slide, index) =>
          `<button class="hero__media-dot ${index === 0 ? "is-active" : ""}" data-hero-dot="${index}" type="button" aria-label="Ver clip ${index + 1}: ${slide.label}"></button>`,
      )
      .join("");

    const slides = heroGallery
      .map(
        (slide, index) =>
          `<img
              src="${slide.image}"
              alt="${slide.imageAlt}"
              loading="${index === 0 ? "eager" : "lazy"}"
              data-hero-slide="${index}"
              class="${index === 0 ? "hero__media-photo is-active" : "hero__media-photo"}"
            />`,
      )
      .join("");

    return `
      <div class="hero__media-frame hero__media-frame--hero-carousel" data-hero-frame>
        <div class="hero__media-stack" data-hero-stack>${slides}</div>
        <div class="hero__media-overlay hero__media-overlay--gallery">
          <div class="hero__media-meta">
            <p class="hero__media-kicker" data-hero-kicker>${heroGallery[0].label}</p>
            <p class="hero__media-title" data-hero-title>${heroGallery[0].title}</p>
          </div>
          <a class="hero__video-chip" href="${site.whatsappHref}?text=${contactMessage}" aria-label="Enviar mensaje para agendar una sesión de muestra">
            <span class="hero__video-chip-icon" aria-hidden="true">▶</span>
            Ver sesión de muestra
          </a>
          <div class="hero__media-dots" data-hero-dots>${chips}</div>
        </div>
      </div>
    `;
  }

  if (heroVideoSource) {
    return `
      <div class="hero__media-frame hero__media-frame--hero-carousel">
        <video
          class="hero__media-player"
          controls
          autoplay
          muted
          playsinline
          loop
          preload="metadata"
          poster="${site.images.heroVideoPoster || site.images.heroPoster}"
          aria-label="Video de clase de muestra de AiT USA Institute">
          <source src="${heroVideoSource}" type="video/mp4" />
          Tu navegador no soporta video HTML5.
        </video>
        <div class="hero__media-overlay">
          <a class="hero__video-chip" href="${site.whatsappHref}?text=${contactMessage}" aria-label="Enviar mensaje para agendar una sesión de muestra">
            <span class="hero__video-chip-icon" aria-hidden="true">▶</span>
            Ver sesión de muestra
          </a>
        </div>
      </div>
    `;
  }

  return `<img src="${site.images.hero}" alt="${site.heroQuote}" loading="eager" />`;
};

const initHeroShowcase = () => {
  if (heroVideoSource || heroGallery.length < 2) return;

  const stack = document.querySelector("[data-hero-stack]");
  const dots = [...document.querySelectorAll("[data-hero-dot]")];
  const kicker = document.querySelector("[data-hero-kicker]");
  const title = document.querySelector("[data-hero-title]");
  if (!stack || !dots.length || !kicker || !title) return;

  const slides = [...stack.querySelectorAll("[data-hero-slide]")];
  if (!slides.length) return;

  let active = 0;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const setHeroSlide = (nextIndex) => {
    if (nextIndex === active) return;

    const previous = slides[active];
    const next = slides[nextIndex];
    const nextDot = dots[nextIndex];
    const prevDot = dots[active];

    previous.classList.remove("is-active");
    prevDot.classList.remove("is-active");
    next.classList.add("is-active");
    nextDot.classList.add("is-active");
    kicker.textContent = heroGallery[nextIndex].label;
    title.textContent = heroGallery[nextIndex].title;
    active = nextIndex;
  };

  if (reduceMotion) {
    return;
  }

  const interval = setInterval(() => {
    const nextIndex = (active + 1) % heroGallery.length;
    setHeroSlide(nextIndex);
  }, 4200);

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      clearInterval(interval);
      setHeroSlide(Number(dot.dataset.heroDot));
    });
  });
};

const renderVariants = (variants = []) => {
  if (!variants.length) return "";
  const preview = variants.slice(0, 3);
  const remaining = variants.length - preview.length;

  return `<ul class="variant-list">${preview
    .map((variant) => `<li><span>${variant.name}</span><strong>${variant.price}</strong></li>`)
    .join("")}${remaining ? `<li><span>+ ${remaining} variantes más</span><strong>Ver opciones</strong></li>` : ""}</ul>`;
};

const contactMessage = encodeURIComponent("Hola AiT USA Institute, quiero información sobre clases de inglés.");

app.innerHTML = `
  <header class="site-header" data-header>
    <a class="brand" href="#inicio" aria-label="${site.name}">
      <img src="${site.images.logo}" alt="" />
      <span>
        <strong>AiT USA</strong>
        <small>Institute</small>
      </span>
    </a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Abrir menú">
      <span class="menu-toggle__icon" aria-hidden="true"></span>
      <span class="menu-toggle__label">Menú</span>
    </button>
    <nav id="site-nav" class="site-nav" aria-label="Principal">
      ${nav.map(([label, id]) => `<a href="#${id}">${label}</a>`).join("")}
    </nav>
    <a class="header-cta" href="${site.whatsappHref}?text=${contactMessage}">WhatsApp</a>
  </header>

  <main>
    <section id="inicio" class="hero" style="--hero-image: url('${site.images.hero}')">
      <div class="hero__inner">
        <div class="hero__content">
          <p class="section-kicker">${site.tagline}</p>
          <h1>${site.heroHeadline || site.name}</h1>
          <p class="hero__lead">${site.heroLead || site.description}</p>
          <div class="hero__actions">
            <a class="button button--primary" href="${site.whatsappHref}?text=${contactMessage}">Agenda tu clase de muestra</a>
            <a class="button button--ghost" href="${site.forms.registration}" target="_blank" rel="noreferrer">Quiero inscribirme hoy</a>
          </div>
          <ul class="hero__points">
            ${joinList(heroPoints)}
          </ul>
          <div class="hero__proof" aria-label="Indicadores de confianza">
            ${heroProof
              .map(
                (item) => `
                  <article class="hero__proof-item">
                    <strong>${item.value}</strong>
                    <span>${item.label}</span>
                  </article>
                `,
              )
              .join("")}
          </div>
        </div>
        <div class="hero__media">
          ${heroMedia()}
          <p class="hero__quote">
            “${site.heroQuote}”
          </p>
        </div>
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

    <section class="section section--reel" aria-labelledby="reel-title">
      <div class="section-inner reel-grid">
        <div class="reel-copy">
            <p class="section-kicker">Clases con presencia humana</p>
            <h2 id="reel-title">Energía real de aula, también en línea.</h2>
            <p>
            Combinamos práctica guiada, corrección puntual y seguimiento de progreso para que avancemos sin
            vacíos: cada clase te deja con una acción concreta para usar inglés de inmediato.
          </p>
          <a class="button button--primary" href="#horarios">Ver horarios</a>
        </div>
        <div class="instructor-reel" aria-label="Momentos de clases e instructoras">
          ${instructorClips
            .map(
              (clip, index) => `
                <article class="clip-card clip-card--${index + 1}">
                  <div class="clip-card__media">
                    <img src="${clip.image}" alt="${clip.imageAlt}" loading="${index === 0 ? "eager" : "lazy"}" />
                    <span class="clip-card__play">${playIcon}</span>
                    <span class="clip-card__duration">${clip.duration}</span>
                    <span class="clip-card__scan" aria-hidden="true"></span>
                  </div>
                  <div class="clip-card__body">
                    <span>${clip.eyebrow}</span>
                    <h3>${clip.title}</h3>
                    <p>${clip.caption}</p>
                    <div class="clip-card__progress" aria-hidden="true"><i></i></div>
                  </div>
                </article>
              `,
            )
            .join("")}
        </div>
      </div>
    </section>

    <section class="section section--white" aria-labelledby="diferente-title">
      <div class="section-inner intro-grid">
        <div>
          <p class="section-kicker">Por qué somos diferentes</p>
          <h2 id="diferente-title">Una ruta visual para entender rápido, hablar con precisión y ganar confianza.</h2>
        </div>
          <p>
            El objetivo es práctico: comprender rápido, hablar con precisión y usar el inglés en
            escenarios cotidianos y académicos sin fricción. Graphic Concept traduce estructura y vocabulario
            en hábitos de comunicación para resultados visibles.
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
            <h2 id="cursos-title">Programas pensados para resultados medibles y metas reales</h2>
          <p>Inglés ESL, apoyo académico y tecnología en rutas claras para aprender, practicar y avanzar con disciplina.</p>
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
                <img src="${program.image}" alt="${program.imageAlt}" loading="lazy" />
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
          <p class="section-kicker">Método Graphic Concept</p>
          <h2 id="metodo-title">Comprender. Practicar. Hablar. Repetir.</h2>
          <p>
            Graphic Concept organiza vocabulario, tiempos y estructura para acelerar la comprensión.
            Cada bloque está diseñado para pasar de “lo teórico” a “lo útil” con más práctica y menos confusión.
          </p>
        </div>
        <div class="method-list">
          ${methodBlocks
            .map(
              (block) => `
                <article class="method-item">
                  <img src="${block.image}" alt="${block.imageAlt}" loading="lazy" />
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
          <h2 id="libros-title">Material académico propio para reforzar tu progreso.</h2>
        <p>Material desarrollado para practicar más allá del aula y construir hábitos diarios reales.</p>
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
          <h2 id="horarios-title">Elige el horario y la modalidad que mejor se adapta a tu semana.</h2>
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
          <h2 id="sedes-title">New Jersey, acceso remoto y atención por WhatsApp.</h2>
        <p>Opciones presenciales y remotas para aprender con la flexibilidad que tu calendario necesita.</p>
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
          <h2 id="about-title">Una institución de New Jersey enfocada en inglés práctico y resultados visibles.</h2>
          <p>
            Con más de 20 años de experiencia, ayudamos a estudiantes dentro y fuera de Estados Unidos
            a aprender inglés mediante una metodología visual, práctica y centrada en objetivos reales.
          </p>
        </div>
        <div class="mission-grid">
          <article>
            <h3>Misión</h3>
            <p>Enseñar con métodos propios, técnicas y estrategias diferentes a la educación tradicional.</p>
          </article>
          <article>
            <h3>Visión</h3>
            <p>Ayudar a que las personas puedan hablar inglés fácil y rápido en un mundo globalizado.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section section--blue" aria-labelledby="testimonios-title">
      <div class="section-inner split">
        <div>
          <p class="section-kicker">Testimonios y profesores</p>
          <h2 id="testimonios-title">Resultado que se nota en cada conversación.</h2>
          <ul class="teacher-list">${joinList(teachers)}</ul>
        </div>
        <div class="testimonial-grid">
          ${testimonials
            .map(
              (item) => `
                <article class="testimonial-card">
                  <img src="${item.image}" alt="${item.imageAlt}" loading="lazy" />
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
          <h2 id="downloads-title">Material de apoyo para repasar desde casa.</h2>
        <p>Recursos para reforzar tareas, pronunciación y seguimiento semanal desde cualquier dispositivo.</p>
      </div>
      <div class="section-inner download-grid">
        ${downloads
          .map(
            (item) => `
              <article class="download-card">
                <img src="${item.image}" alt="${item.imageAlt}" loading="lazy" />
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
                <img src="${item.image}" alt="${item.imageAlt}" loading="lazy" />
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
          <h2 id="pagos-title">Opciones transparentes para estudiar sin sorpresas.</h2>
        <p>Precios y productos claros para que el siguiente paso sea evidente desde el inicio.</p>
      </div>
      <div class="section-inner payment-grid">
        ${storeProducts
          .map(
            (item) => `
              <article class="payment-card">
                <img src="${item.image}" alt="${item.imageAlt}" loading="lazy" />
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
          <h2 id="faq-title">Resolvemos tus dudas antes de inscribirte.</h2>
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
          <h2 id="contacto-title">Da el siguiente paso hoy mismo.</h2>
          <p>
            Completa el formulario y enviamos tu ruta inicial por WhatsApp en minutos.
            Nuestro equipo confirmará cupo, calendario y documentos para empezar.
          </p>
          <div class="direct-contact">
            <a href="${site.phoneHref}">${site.phone}</a>
            <a href="${site.whatsappHref}?text=${contactMessage}">${site.whatsapp}</a>
            <a href="${site.forms.registration}" target="_blank" rel="noreferrer">Inscripción gratuita</a>
          </div>
        </div>
        <form class="lead-form" data-lead-form>
          <div class="form-row">
            <label>Nombre <input name="nombre" autocomplete="given-name" required /></label>
            <label>Apellido <input name="apellido" autocomplete="family-name" required /></label>
          </div>
          <label>Email <input name="email" type="email" autocomplete="email" required /></label>
          <div class="form-row">
            <label>Para quién es
              <select name="para">
                <option>Mi</option>
                <option>Hijo/a</option>
                <option>Alguien</option>
              </select>
            </label>
            <label>Edad <input name="edad" inputmode="numeric" /></label>
          </div>
          <div class="form-row">
            <label>Código país <input name="codigo" placeholder="+1" /></label>
            <label>Teléfono <input name="telefono" type="tel" autocomplete="tel" required /></label>
          </div>
          <label>País y ciudad <input name="ubicacion" required /></label>
          <button class="button button--primary" type="submit">Solicitar ruta inicial</button>
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
    <p>Experiencia web renovada para una comunicación más clara y efectiva. © ${site.founded} ${site.name}.</p>
  </footer>
`;
initHeroShowcase();

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
    "Hola AiT USA Institute, quiero información.",
    `Nombre: ${data.get("nombre")} ${data.get("apellido")}`,
    `Email: ${data.get("email")}`,
    `Para: ${data.get("para")}`,
    `Edad: ${data.get("edad") || "No indicado"}`,
    `Teléfono: ${data.get("codigo") || ""} ${data.get("telefono")}`,
    `Ubicación: ${data.get("ubicacion")}`,
  ].join("\n");

  whatsappDraft.href = `${site.whatsappHref}?text=${encodeURIComponent(message)}`;
  status.textContent = "Mensaje listo. Haz clic en WhatsApp para enviarlo al equipo y recibir respuesta inmediata.";
});
})();

