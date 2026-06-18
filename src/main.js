(function () {
const {
  books,
  differentiators,
  downloads,
  faqs,
  learningOutcomes,
  courseGuides,
  heroGallery,
  heroPoints,
  launchPath,
  heroSignal,
  heroStartPath,
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
  trustHighlights,
  paymentGuides,
  contactPrep,
  footerFacts,
} = window.AITUSA_DATA;

const app = document.querySelector("#app");
const initials = ["Todos", "Inglés", "Niños", "Académico", "Tecnología", "Idiomas"];

const categoryLabel = {
  Todos: "todos",
  Inglés: "ingles",
  Niños: "ninos",
  Académico: "academico",
  Tecnología: "tecnologia",
  Idiomas: "idiomas",
};

const programCounts = initials.reduce((acc, label) => {
  const filter = categoryLabel[label];
  acc[filter] =
    filter === "todos" ? programs.length : programs.filter((program) => program.category === filter).length;
  return acc;
}, {});

const heroMediaPoster = site.heroVideoPoster || site.images.heroPoster || site.images.hero;
const heroVideoSources = (() => {
  const isMobile = window.matchMedia("(max-width: 900px)").matches;
  const desktopFirst = site.heroVideoPortrait || site.heroVideo;
  const mobileFirst = site.heroVideo || site.heroVideoPortrait;

  return (isMobile ? [mobileFirst, desktopFirst, site.heroVideoFallback] : [desktopFirst, mobileFirst, site.heroVideoFallback])
    .filter(Boolean)
    .filter((value, index, list) => list.indexOf(value) === index);
})();
const contactMessage = encodeURIComponent(
  "Hola AiT USA Institute, quiero información sobre clases de inglés.",
);

const courseInterestMap = {
  ingles: "Inglés",
  ninos: "Niños",
  academico: "Académico",
  tecnologia: "Tecnología",
  idiomas: "Idiomas",
  todos: "No estoy seguro",
};

const programInquiryMessage = (program) =>
  encodeURIComponent(
    [
      "Hola AiT USA Institute, quiero información sobre este programa.",
      `Programa: ${program.title}`,
      `Ideal para: ${program.audience}`,
      `Modalidad: ${program.mode}`,
      `Lo estoy viendo porque: ${program.fit}`,
    ].join("\n"),
  );

const bookInquiryMessage = encodeURIComponent(
  "Hola AiT USA Institute, quiero información sobre los libros y materiales académicos.",
);

const productInquiryMessage = (product) =>
  encodeURIComponent(`Hola AiT USA Institute, quiero información sobre ${product.title}.`);

const joinList = (items) => items.map((item) => `<li>${item}</li>`).join("");

const heroSignalCards = () => {
  if (!heroSignal.length) return "";

  return `
    <div class="hero__signal" aria-label="Promesas de resultado">
      ${heroSignal
        .map(
          (signal) => `
            <article class="hero__signal-item">
              <strong>${signal.value}</strong>
              <span>${signal.label}</span>
            </article>
          `,
        )
        .join("")}
    </div>
  `;
};

const heroPathList = () => {
  if (!heroStartPath.length) return "";

  return `
    <ol class="hero__path" aria-label="Pasos para empezar">
      ${heroStartPath
        .map(
          (item, index) => `
            <li><span>${index + 1}</span><p>${item}</p></li>
          `,
        )
        .join("")}
    </ol>
  `;
};

const launchPathSection = () => {
  if (!launchPath.length) return "";

  return `
    <section id="ruta" class="section section--path section--white" aria-labelledby="ruta-title">
      <div class="section-inner section-heading section-heading--compact">
        <p class="section-kicker">Ruta de arranque</p>
        <h2 id="ruta-title">Tu progreso real en tres semanas</h2>
        <p>Combinamos diagnóstico real, práctica guiada y seguimiento para que avances sin esperar meses para ver resultados.</p>
      </div>
      <div class="section-inner path-grid">
        ${launchPath
          .map(
            (item, index) => `
              <article class="path-card">
                <span class="path-card__step">Semana ${index + 1}</span>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <p class="path-card__outcome">${item.outcome}</p>
              </article>
            `,
          )
          .join("")}
      </div>
      <div class="section-inner path-cta">
        <a class="button button--primary" href="${site.whatsappHref}?text=${contactMessage}">Agenda tu clase de muestra</a>
        <a class="button button--ghost" href="#cursos">Ver programas disponibles</a>
      </div>
    </section>
  `;
};

const spotlightSection = () => {
  const clip = instructorClips[0];
  const proofItems = [
    { value: "1:08", label: "clase real con habla guiada" },
    { value: "Live", label: "video local de alta calidad" },
    { value: "100%", label: "enfoque humano y práctico" },
  ];

  return `
    <section id="experiencia" class="section section--spotlight" aria-labelledby="experiencia-title">
      <div class="section-inner spotlight-grid">
        <div class="spotlight-media">
          ${clipMedia(clip)}
          <div class="spotlight-media__badge">Mira la clase en acción</div>
        </div>
        <div class="spotlight-copy">
          <p class="section-kicker">Experiencia real</p>
          <h2 id="experiencia-title">Antes de inscribirte, mira cómo se siente practicar con una instructora que corrige en vivo.</h2>
          <p>
            La diferencia es tangible: se ve, se escucha y se entiende. Esta es la parte que más confianza
            construye, porque el estudiante deja de imaginar el método y empieza a percibirlo.
          </p>
          <ul class="spotlight-points">
            ${joinList([
              "Video local de alta calidad para mostrar conversación real sin depender de embeds externos.",
              "Correcciones inmediatas para que la pronunciación y la estructura se afinen mientras hablas.",
              "Ritmo visual pensado para que los padres y estudiantes entiendan la propuesta en segundos.",
            ])}
          </ul>
          <blockquote class="spotlight-quote">
            “Pensábamos que aprender inglés era difícil. Con este método gráfico empezamos a comprender y hablar con mucho más contexto y seguridad.”
          </blockquote>
          <div class="spotlight-proof" aria-label="Indicadores del video">
            ${proofItems
              .map(
                (item) => `
                  <article>
                    <strong>${item.value}</strong>
                    <span>${item.label}</span>
                  </article>
                `,
              )
              .join("")}
          </div>
          <div class="spotlight-actions">
            <a class="button button--primary" href="${site.whatsappHref}?text=${contactMessage}">Quiero una muestra</a>
            <a class="button button--ghost" href="#cursos">Ver opciones de curso</a>
          </div>
        </div>
      </div>
    </section>
  `;
};
const clipMedia = (clip) => {
  if (clip.video) {
    return `
      <video
        class="clip-card__media-player"
        src="${clip.video}"
        poster="${clip.videoPoster || clip.image}"
        preload="none"
        muted
        playsinline
        controls
        aria-label="${clip.title}"
      ></video>
    `;
  }

  return `<img src="${clip.image}" alt="${clip.imageAlt}" loading="${clip.mediaPriority === "hero" ? "eager" : "lazy"}" />`;
};
const playIcon = `
  <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
    <path d="M8 5.5v13l10.5-6.5L8 5.5Z" />
  </svg>
`;
const heroVideoBackground = () => {
  if (!heroVideoSources.length) return "";

  return `
    <div class="hero__video-bg-wrap" data-hero-bg-wrap>
      <video
        class="hero__video-bg"
        data-hero-bg-player
        autoplay
        muted
        playsinline
        loop
        preload="metadata"
        poster="${heroMediaPoster}"
        aria-hidden="true"
      >
        ${heroVideoSources.map((source) => `<source src="${source}" type="video/mp4" />`).join("")}
        Tu navegador no soporta video HTML5.
      </video>
    </div>
  `;
};
const heroMedia = () => {
  if (heroGallery.length && !heroVideoSources.length) {
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
          <div class="hero__media-tag">Video real · 1:08</div>
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

  if (heroVideoSources.length) {
    return `
      <div class="hero__media-frame hero__media-frame--hero-carousel">
        <video
          data-hero-player
          class="hero__media-player"
          controls
          autoplay
          muted
          playsinline
          loop
          preload="metadata"
          poster="${heroMediaPoster}"
          data-hero-poster="${heroMediaPoster}"
          aria-label="Video de clase de muestra de AiT USA Institute">
          <source data-hero-source src="${heroVideoSources[0]}" type="video/mp4" />
          Tu navegador no soporta video HTML5.
        </video>
        <img
          data-hero-fallback
          class="hero__media-fallback is-hidden"
          loading="eager"
          src="${heroMediaPoster}"
          alt="${site.heroQuote}"
        />
        <div class="hero__media-overlay">
          <div class="hero__media-tag">Video real · 1:08</div>
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
  if (heroVideoSources.length || heroGallery.length < 2) return;

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

  let interval;

  const startShowcase = () => {
    if (interval || reduceMotion) return;

    interval = setInterval(() => {
      const nextIndex = (active + 1) % heroGallery.length;
      setHeroSlide(nextIndex);
    }, 4200);
  };

  const stopShowcase = () => {
    clearInterval(interval);
    interval = null;
  };

  if (reduceMotion) {
    return;
  }

  startShowcase();

  const frame = document.querySelector("[data-hero-frame]");
  if (frame) {
    frame.addEventListener("mouseenter", stopShowcase);
    frame.addEventListener("mouseleave", startShowcase);
    frame.addEventListener("focusin", stopShowcase);
    frame.addEventListener("focusout", startShowcase);
  }

  frame?.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (active + direction + heroGallery.length) % heroGallery.length;
    stopShowcase();
    setHeroSlide(nextIndex);
    startShowcase();
  });

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      stopShowcase();
      setHeroSlide(Number(dot.dataset.heroDot));
      startShowcase();
    });
  });
};

const initHeroFallbacks = () => {
  const heroVideo = document.querySelector("[data-hero-player]");
  if (!heroVideo) return;

  const heroSource = heroVideo.querySelector("[data-hero-source]");
  const heroFallbackImage = document.querySelector("[data-hero-fallback]");

  if (!heroSource || !heroFallbackImage) return;

  let attempt = 0;
  const setNextSource = () => {
    if (attempt + 1 >= heroVideoSources.length) return false;

    attempt += 1;
    heroSource.src = heroVideoSources[attempt];
    heroVideo.load();
    return true;
  };

  const revealFallbackImage = () => {
    heroVideo.classList.add("is-hidden");
    heroFallbackImage.classList.remove("is-hidden");
  };

  const onVideoError = () => {
    if (!setNextSource()) {
      revealFallbackImage();
      heroVideo.removeEventListener("error", onVideoError);
    }
  };

  heroVideo.addEventListener("error", onVideoError);

  heroVideo.addEventListener("loadeddata", () => {
    heroVideo.classList.remove("is-hidden");
    heroFallbackImage.classList.add("is-hidden");
  });
};

const initHeroBackground = () => {
  const heroVideoBg = document.querySelector("[data-hero-bg-player]");
  if (!heroVideoBg) return;

  const heroVideoBgWrap = document.querySelector("[data-hero-bg-wrap]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) {
    heroVideoBgWrap?.classList.add("is-hidden");
    return;
  }

  const heroVideoBgSource = heroVideoBg.querySelector("source");
  if (!heroVideoBgSource) return;

  let attempt = 0;
  const setNextSource = () => {
    if (attempt + 1 >= heroVideoSources.length) {
      heroVideoBgWrap?.classList.add("is-hidden");
      return false;
    }

    attempt += 1;
    heroVideoBgSource.src = heroVideoSources[attempt];
    heroVideoBg.load();
    return true;
  };

  const onBgError = () => {
    if (!setNextSource()) {
      heroVideoBg.removeEventListener("error", onBgError);
    }
  };

  heroVideoBg.addEventListener("error", onBgError);
};

const renderVariants = (variants = []) => {
  if (!variants.length) return "";
  const preview = variants.slice(0, 3);
  const remaining = variants.length - preview.length;

  return `<ul class="variant-list">${preview
    .map((variant) => `<li><span>${variant.name}</span><strong>${variant.price}</strong></li>`)
    .join("")}${remaining ? `<li><span>+ ${remaining} variantes más</span><strong>Ver opciones</strong></li>` : ""}</ul>`;
};

app.innerHTML = `
  <a class="skip-link" href="#inicio">Saltar al contenido principal</a>
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
      ${nav
        .map(
          ([label, id], index) =>
            `<a href="#${id}" data-nav-link="${id}" ${index === 0 ? 'aria-current="page"' : ""}>${label}</a>`,
        )
        .join("")}
      </nav>
    <a class="header-cta" href="${site.whatsappHref}?text=${contactMessage}" aria-label="Escribir por WhatsApp para recibir orientación">WhatsApp directo</a>
  </header>

  <main>
    <section id="inicio" class="hero" style="--hero-image: url('${site.images.hero}')">
      ${heroVideoBackground()}
      <div class="hero__inner">
        <div class="hero__content">
          <p class="section-kicker">${site.tagline}</p>
          <h1>${site.heroHeadline || site.name}</h1>
          <p class="hero__lead">${site.heroLead || site.description}</p>
          <div class="hero__actions">
            <a class="button button--primary" href="${site.whatsappHref}?text=${contactMessage}">Agenda tu clase de muestra</a>
            <a class="button button--ghost" href="#horarios">Ver horarios</a>
          </div>
          <p class="hero__microcopy">
            Te ayudamos a elegir nivel, sede y modalidad en el primer mensaje.
            <a href="#experiencia">Ver la clase real primero</a>
          </p>
          <div class="hero__highlights" aria-label="Beneficios">
            <span>Respuesta en menos de 24h</span>
            <span>Rutas para jóvenes, adultos y familias</span>
            <span>Clases en Nueva Jersey y online</span>
          </div>
          ${heroSignalCards()}
          ${heroPathList()}
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
          <p class="hero__media-note">Video real de clases con instructoras bilingües, cargado desde los archivos locales del proyecto.</p>
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
    ${launchPathSection()}
    ${spotlightSection()}

    <section class="section section--reel" aria-labelledby="reel-title">
      <div class="section-inner reel-grid">
        <div class="reel-copy">
          <p class="section-kicker">Clases con presencia humana</p>
          <h2 id="reel-title">Voces reales, corrección visible y una energía de aula que sí se siente.</h2>
          <p>
            Las instructoras hablan, corrigen y acompañan en video para que entiendas cómo se ve una sesión real
            antes de inscribirte. Llegas con menos dudas y más confianza para empezar.
          </p>
          <ul class="reel-copy__points" aria-label="Lo que muestran los clips">
            <li>Video real de clase, sin simulaciones genéricas.</li>
            <li>Corrección puntual y seguimiento que se ve en la práctica.</li>
            <li>Momentos distintos de aula, Zoom y conversación guiada.</li>
          </ul>
          <a class="button button--primary" href="#horarios">Ver horarios</a>
        </div>
        <div class="instructor-reel" aria-label="Momentos de clases e instructoras">
          ${instructorClips
        .map(
            (clip, index) => `
                <article class="clip-card clip-card--${index + 1}">
                  <div class="clip-card__media">
                    ${clipMedia(clip)}
                    ${clip.video ? "" : `<span class="clip-card__play" aria-hidden="true">${playIcon}</span>`}
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
        <div class="course-pill-row" aria-label="Enfoques principales">
          <span>ESL en vivo</span>
          <span>Apoyo académico</span>
          <span>Tecnología práctica</span>
        </div>
      </div>
      <div class="section-inner course-guide" aria-label="Ayuda para elegir el curso correcto">
        ${courseGuides
          .map(
            (item) => `
              <article>
                <strong>${item.title}</strong>
                <p>${item.text}</p>
                <a class="course-guide__link" href="${item.href}">Ver cursos</a>
              </article>
            `,
          )
          .join("")}
      </div>
      <div class="section-inner filter-bar" role="group" aria-label="Filtrar cursos">
        ${initials
          .map(
            (label, index) => `
              <button class="filter-button" type="button" data-filter="${categoryLabel[label]}" aria-pressed="${index === 0 ? "true" : "false"}">
                <span class="filter-button__label" data-base-label="${label}">${label}</span>
                <span class="filter-button__count">${programCounts[categoryLabel[label]]}</span>
              </button>
            `,
          )
          .join("")}
        <button class="filter-button filter-button--reset" type="button" data-clear-filters>Limpiar filtros</button>
      </div>
      <p class="section-inner course-count" data-course-count aria-live="polite">Mostrando ${programs.length} programas.</p>
      <div class="section-inner program-grid" data-program-grid>
        ${programs
          .map(
            (program, index) => `
              <article class="program-card ${index === 0 ? "program-card--featured" : ""}" data-category="${program.category}">
                <div class="program-card__media">
                  <img src="${program.image}" alt="${program.imageAlt}" loading="lazy" />
                  <span class="program-card__badge">${program.mode}</span>
                </div>
                <div class="program-card__body">
                  <p class="program-card__eyebrow">${program.audience}</p>
                  <h3>${program.title}</h3>
                  <p class="program-card__fit">${program.fit}</p>
                  <p class="program-card__summary">${program.summary}</p>
                  <ul class="program-card__details">${joinList(program.details)}</ul>
                  <div class="program-card__footer">
                    <a class="program-card__cta" href="${site.whatsappHref}?text=${programInquiryMessage(program)}">Preguntar por este curso</a>
                  </div>
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
      <div class="section-inner books-strip">
        <article>
          <strong>Secuencia clara</strong>
          <span>De la introducción al avance progresivo por niveles.</span>
        </article>
        <article>
          <strong>Práctica diaria</strong>
          <span>Diseñado para repasar sin depender solo de la clase.</span>
        </article>
        <article>
          <strong>Ritmo realista</strong>
          <span>Material pensado para sostener continuidad y confianza.</span>
        </article>
      </div>
      <div class="section-inner book-grid">
        ${books
          .map(
            (book) => `
              <article class="book-card">
                <img src="${book.image}" alt="${book.title}" loading="lazy" />
                <div class="book-card__body">
                  <p class="book-card__level">${book.level}</p>
                  <h3>${book.title}</h3>
                  <span>${book.subtitle}</span>
                  <p>${book.text}</p>
                </div>
              </article>
            `,
          )
          .join("")}
      </div>
      <div class="section-inner books-cta">
        <div>
          <p class="section-kicker">Material y apoyo</p>
          <h3>Te ayudamos a elegir el libro correcto según tu nivel y modalidad.</h3>
          <p>Si no sabes cuál corresponde a tu etapa, escríbenos y te orientamos en minutos.</p>
        </div>
        <div class="books-cta__actions">
          <a class="button button--primary" href="${site.whatsappHref}?text=${bookInquiryMessage}">Consultar libros</a>
          <a class="button button--ghost" href="#contacto">Hablar con el equipo</a>
        </div>
      </div>
    </section>

    <section id="horarios" class="section section--white" aria-labelledby="horarios-title">
      <div class="section-inner split split--center">
        <div>
          <p class="section-kicker">Horarios y modalidad</p>
          <h2 id="horarios-title">Elige el horario y la modalidad que mejor se adapta a tu semana.</h2>
          <div class="schedule-intro">
            <article>
              <strong>Flexible</strong>
              <span>Turnos de mañana, noche, sábado y domingo.</span>
            </article>
            <article>
              <strong>Guiado</strong>
              <span>Te ayudamos a escoger el horario con mejor continuidad.</span>
            </article>
          </div>
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
                <article class="schedule-card">
                  <h3>${schedule.label}</h3>
                  <p>${schedule.bestFor}</p>
                  <div class="schedule-chip-list">${schedule.times
                    .map((time) => `<span>${time}</span>`)
                    .join("")}</div>
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
                <p class="location-card__highlight">${location.highlight}</p>
                <span>${location.note}</span>
                <div class="location-card__actions">
                  <a href="${site.whatsappHref}?text=${encodeURIComponent(`Hola AiT USA Institute, quiero información sobre la sede de ${location.city}.`)}">Consultar sede</a>
                </div>
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
        <div class="about-copy">
          <p class="section-kicker">Nosotros</p>
          <h2 id="about-title">Una institución de New Jersey enfocada en inglés práctico y resultados visibles.</h2>
          <p>
            Con más de 20 años de experiencia, ayudamos a estudiantes dentro y fuera de Estados Unidos
            a aprender inglés mediante una metodología visual, práctica y centrada en objetivos reales.
          </p>
          <div class="about-note">
            <strong>Lo que cambia en tu primera etapa</strong>
            <p>Dejas de estudiar en abstracciones y empiezas a reconocer patrones, responder con más naturalidad y mantener continuidad.</p>
          </div>
          <a class="button button--primary" href="#cursos">Explorar cursos</a>
        </div>
        <div class="outcome-grid" aria-label="Resultados que ofrece el método">
          ${learningOutcomes
            .map(
              (item, index) => `
                <article class="outcome-card outcome-card--${index + 1}">
                  <span>${String(index + 1).padStart(2, "0")}</span>
                  <h3>${item.title}</h3>
                  <p>${item.text}</p>
                </article>
              `,
            )
            .join("")}
        </div>
        <p class="reel-note">El primer clip muestra la clase más completa; los demás acercan diferentes ritmos de acompañamiento y conversación.</p>
      </div>
    </section>

    <section class="section section--blue" aria-labelledby="testimonios-title">
      <div class="section-inner section-heading section-heading--inverted">
        <p class="section-kicker">Testimonios y profesores</p>
        <h2 id="testimonios-title">Se nota en la clase, en la rutina y en la confianza con la que responden.</h2>
        <p>Escucha a quienes ya viven el método y conoce al equipo que acompaña cada avance con práctica guiada, seguimiento y corrección en tiempo real.</p>
      </div>
      <div class="section-inner trust-strip" aria-label="Puntos clave del servicio">
        ${trustHighlights
          .map(
            (item) => `
              <article>
                <strong>${item.title}</strong>
                <span>${item.text}</span>
              </article>
            `,
          )
          .join("")}
      </div>
      <div class="section-inner trust-grid">
        <div class="trust-panel">
          <div class="trust-metrics" aria-label="Datos de confianza">
            <article>
              <strong>20+</strong>
              <span>años enseñando en New Jersey</span>
            </article>
            <article>
              <strong>1:1</strong>
              <span>seguimiento y orientación por WhatsApp</span>
            </article>
            <article>
              <strong>3</strong>
              <span>formatos para aprender con flexibilidad</span>
            </article>
          </div>
          <div class="trust-copy">
            <p class="section-kicker">Nuestro equipo</p>
            <h3>Personas reales detrás de la experiencia.</h3>
            <ul class="teacher-list teacher-list--chips">${joinList(teachers)}</ul>
          </div>
          <div class="trust-actions">
            <a class="button button--primary" href="${site.whatsappHref}?text=${contactMessage}">Hablar con un asesor</a>
            <a class="button button--ghost" href="#contacto">Ir al formulario</a>
          </div>
        </div>
        <div class="testimonial-grid">
          ${testimonials
            .map(
              (item, index) => `
                <article class="testimonial-card ${index === 0 ? "testimonial-card--featured" : ""}">
                  <div class="testimonial-card__media">
                    <img src="${item.image}" alt="${item.imageAlt}" loading="lazy" />
                  </div>
                  <div class="testimonial-card__body">
                    <p>“${item.text}”</p>
                    <strong>${item.name}</strong>
                  </div>
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
      <div class="section-inner utility-strip">
        <article>
          <strong>Compatible</strong>
          <span>iPhone, iPad, Mac, Android y Windows.</span>
        </article>
        <article>
          <strong>Listo para usar</strong>
          <span>Recursos pensados para estudiar sin configuración complicada.</span>
        </article>
        <article>
          <strong>Seguimiento</strong>
          <span>Material alineado con tu progreso semanal y tus clases.</span>
        </article>
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
      <div class="section-inner payment-note">
        <p>
          Si no ves tu modalidad exacta, escríbenos por WhatsApp y te indicamos la opción correcta según
          tu país, horario y tipo de acceso.
        </p>
      </div>
      <div class="section-inner payment-guide" aria-label="Ayuda para elegir producto">
        ${paymentGuides
          .map(
            (item) => `
              <article>
                <strong>${item.title}</strong>
                <p>${item.text}</p>
                <span>${item.cta}</span>
              </article>
            `,
          )
          .join("")}
      </div>
      <div class="section-inner payment-grid">
        ${storeProducts
          .map(
            (item) => `
              <article class="payment-card">
                <img src="${item.image}" alt="${item.imageAlt}" loading="lazy" />
                <div class="payment-card__body">
                  <h3>${item.title}</h3>
                  <p class="payment-card__best-for">${item.bestFor}</p>
                  <div class="payment-card__meta">
                    <strong class="payment-card__price">${item.price}</strong>
                    <span>${item.status}${item.sku ? ` · SKU ${item.sku}` : ""}</span>
                  </div>
                  <p>${item.note}</p>
                  ${renderVariants(item.variants)}
                  <div class="payment-card__footer">
                    <a class="payment-card__cta" href="${site.whatsappHref}?text=${productInquiryMessage(item)}">Consultar este plan</a>
                  </div>
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
        <p>Si todavía estás comparando opciones, aquí tienes una vista rápida de lo que normalmente aclaramos antes de arrancar.</p>
      </div>
      <div class="section-inner faq-intro">
        <article class="faq-callout">
          <p class="section-kicker">Antes de empezar</p>
          <h3>Qué pasa después de enviar el formulario</h3>
          <ol>
            <li>Te contactamos por WhatsApp y confirmamos tu objetivo.</li>
            <li>Revisamos nivel, horario y modalidad recomendada.</li>
            <li>Te compartimos la ruta inicial para comenzar sin demora.</li>
          </ol>
        </article>
        <article class="faq-callout faq-callout--accent">
          <p class="section-kicker">Respuesta rápida</p>
          <h3>Si prefieres hablar antes de llenar el formulario</h3>
          <p>También puedes escribirnos por WhatsApp o llamar para validar disponibilidad, horarios y el mejor punto de inicio.</p>
          <a class="button button--primary" href="${site.whatsappHref}?text=${contactMessage}">Escribir por WhatsApp</a>
        </article>
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
          <div class="contact-prep" aria-label="Qué conviene tener listo antes de enviar el formulario">
            ${contactPrep
              .map(
                (item) => `
                  <article>
                    <strong>${item.title}</strong>
                    <span>${item.text}</span>
                  </article>
                `,
              )
              .join("")}
          </div>
          <div class="contact-steps" aria-label="Qué sucede al enviar el formulario">
            <article>
              <strong>1</strong>
              <span>Te respondemos con una ruta clara.</span>
            </article>
            <article>
              <strong>2</strong>
              <span>Ajustamos horario, nivel y modalidad.</span>
            </article>
            <article>
              <strong>3</strong>
              <span>Empiezas con el plan de arranque.</span>
            </article>
          </div>
          <div class="direct-contact">
            <a href="${site.phoneHref}">${site.phone}</a>
            <a href="${site.whatsappHref}?text=${contactMessage}">${site.whatsapp}</a>
            <a href="${site.forms.registration}" target="_blank" rel="noreferrer">Formulario de inscripción</a>
          </div>
          <p>Primero validamos tu nivel y horario; después confirmamos tu inscripción y el punto de arranque más adecuado.</p>
          <p>Mientras completas el formulario, el botón de WhatsApp se adapta con tus datos para que enviar la información sea más rápido.</p>
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
          <label>Curso de interés
            <select name="interes">
              <option ${initialCourseInterest === "No estoy seguro" ? "selected" : ""}>No estoy seguro</option>
              <option ${initialCourseInterest === "Inglés" ? "selected" : ""}>Inglés</option>
              <option ${initialCourseInterest === "Niños" ? "selected" : ""}>Niños</option>
              <option ${initialCourseInterest === "Académico" ? "selected" : ""}>Académico</option>
              <option ${initialCourseInterest === "Tecnología" ? "selected" : ""}>Tecnología</option>
              <option ${initialCourseInterest === "Idiomas" ? "selected" : ""}>Idiomas</option>
            </select>
          </label>
          <div class="form-row">
            <label>Código país (+1) <input name="codigo" placeholder="+1" /></label>
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
  
  <div class="mobile-action-bar" aria-label="Acciones rápidas">
    <a class="button button--ghost" href="${site.phoneHref}" aria-label="Llamar para recibir orientación">Llamar ahora</a>
    <a class="button button--primary" href="${site.whatsappHref}?text=${contactMessage}" aria-label="Escribir por WhatsApp para agendar una clase de muestra">WhatsApp directo</a>
  </div>

  <footer class="site-footer">
    <div class="site-footer__brand">
      <strong>${site.name}</strong>
      <span>${site.legal}</span>
      <p>Una experiencia web más clara, humana y enfocada en convertir interés en una primera conversación real.</p>
    </div>
    <div class="site-footer__facts" aria-label="Resumen rápido">
      ${footerFacts
        .map(
          (item) => `
            <article>
              <strong>${item.title}</strong>
              <span>${item.text}</span>
            </article>
          `,
        )
        .join("")}
    </div>
    <div class="site-footer__contact" aria-label="Contactos directos">
      <a href="${site.phoneHref}">${site.phone}</a>
      <a href="${site.whatsappHref}?text=${contactMessage}">${site.whatsapp}</a>
      <a href="${site.emailHref}">info@aitusainstitute.com</a>
    </div>
    <div class="site-footer__links" aria-label="Enlaces de pie de página">
      <a href="#inicio">Inicio</a>
      <a href="#cursos">Cursos</a>
      <a href="#faq">FAQ</a>
      <a href="#contacto">Contacto</a>
    </div>
    <p>Experiencia web renovada para una comunicación más clara y efectiva. © ${site.founded} ${site.name}.</p>
  </footer>
`;
initHeroBackground();
initHeroShowcase();
initHeroFallbacks();

const menuToggle = document.querySelector(".menu-toggle");
const navEl = document.querySelector(".site-nav");
const navLinks = [...document.querySelectorAll("[data-nav-link]")];

const setActiveNav = (id) => {
  navLinks.forEach((link) => {
    const isActive = link.dataset.navLink === id;
    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

const initNavSpy = () => {
  const sectionAnchors = navLinks
    .map((link) => document.getElementById(link.dataset.navLink))
    .filter(Boolean);

  if (!sectionAnchors.length) return;
  setActiveNav("inicio");

  const observer = new IntersectionObserver(
    (entries) => {
      const active = [...entries]
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!active?.target?.id) return;
      setActiveNav(active.target.id);
    },
    { rootMargin: "-30% 0px -55% 0px", threshold: [0.2, 0.4, 0.6, 0.8] },
  );

  sectionAnchors.forEach((section) => {
    observer.observe(section);
  });
};

initNavSpy();

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  navEl.classList.toggle("is-open", !isOpen);
});

navEl.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    setActiveNav(event.target.dataset.navLink);
    menuToggle.setAttribute("aria-expanded", "false");
    navEl.classList.remove("is-open");
  }
});

const filterButtons = [...document.querySelectorAll(".filter-button[data-filter]")];
const programCards = [...document.querySelectorAll(".program-card")];
const programGrid = document.querySelector("[data-program-grid]");
const courseCount = document.querySelector("[data-course-count]");
const clearFiltersButton = document.querySelector("[data-clear-filters]");
const courseInterestSelect = document.querySelector('select[name="interes"]');
const programFilters = new Set(Object.values(categoryLabel));
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const initialCourseFilter = (() => {
  const param = new URL(window.location.href).searchParams.get("curso");
  return param && programFilters.has(param) ? param : "todos";
})();

const initialCourseInterest = courseInterestMap[initialCourseFilter] || courseInterestMap.todos;

const applyProgramFilter = (filter, activeButton = null, { updateHistory = true, scrollToResults = false } = {}) => {
  const nextFilter = programFilters.has(filter) ? filter : "todos";
  filterButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === activeButton)));

  let visibleCount = 0;
  programCards.forEach((card) => {
    const matches = nextFilter === "todos" || card.dataset.category === nextFilter;
    card.hidden = !matches;
    if (matches) visibleCount += 1;
  });

  if (courseCount) {
    const activeLabel = activeButton?.querySelector(".filter-button__label")?.textContent || "este filtro";
    courseCount.textContent =
      nextFilter === "todos"
        ? `Mostrando ${visibleCount} programas.`
        : `Mostrando ${visibleCount} programas para ${activeLabel.toLowerCase()}.`;
  }

  if (courseInterestSelect) {
    courseInterestSelect.value = courseInterestMap[nextFilter] || courseInterestMap.todos;
  }

  if (clearFiltersButton) {
    if (nextFilter === "todos") {
      clearFiltersButton.textContent = "Todos los cursos";
      clearFiltersButton.disabled = true;
    } else {
      clearFiltersButton.textContent = "Ver todos";
      clearFiltersButton.disabled = false;
    }
  }

  filterButtons.forEach((button) => {
    const label = button.querySelector(".filter-button__label");
    const count = button.querySelector(".filter-button__count");
    if (!label || !count) return;

    const baseLabel = label.dataset.baseLabel || label.textContent || "";
    label.dataset.baseLabel = baseLabel;

    if (button === activeButton) {
      label.textContent = `${baseLabel} · ${programCounts[button.dataset.filter || "todos"]}`;
      count.hidden = true;
    } else {
      label.textContent = baseLabel;
      count.hidden = false;
    }
  });

  if (updateHistory) {
    const url = new URL(window.location.href);
    if (nextFilter === "todos") {
      url.searchParams.delete("curso");
    } else {
      url.searchParams.set("curso", nextFilter);
    }
    window.history.pushState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }

  if (scrollToResults && programGrid) {
    programGrid.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  }
};

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyProgramFilter(button.dataset.filter || "todos", button, { scrollToResults: true });
  });
});

clearFiltersButton?.addEventListener("click", () => {
  const allButton = filterButtons.find((button) => button.dataset.filter === "todos") || filterButtons[0];
  applyProgramFilter("todos", allButton, { scrollToResults: true });
});

const activeFilterButton = filterButtons.find((button) => button.dataset.filter === initialCourseFilter) || filterButtons[0];
applyProgramFilter(initialCourseFilter, activeFilterButton, { updateHistory: false });

window.addEventListener("popstate", () => {
  const param = new URL(window.location.href).searchParams.get("curso");
  const nextFilter = param && programFilters.has(param) ? param : "todos";
  const nextButton = filterButtons.find((button) => button.dataset.filter === nextFilter) || filterButtons[0];
  applyProgramFilter(nextFilter, nextButton, { updateHistory: false });
});

const form = document.querySelector("[data-lead-form]");
const status = document.querySelector("[data-form-status]");
const whatsappDraft = document.querySelector("[data-form-whatsapp]");

if (form && status && whatsappDraft) {
  const buildLeadMessage = (data) => [
    "Hola AiT USA Institute, quiero información.",
    `Nombre: ${data.get("nombre") || "No indicado"} ${data.get("apellido") || ""}`.trim(),
    `Email: ${data.get("email") || "No indicado"}`,
    `Para: ${data.get("para") || "No indicado"}`,
    `Curso de interés: ${data.get("interes") || "No indicado"}`,
    `Edad: ${data.get("edad") || "No indicado"}`,
    `Teléfono: ${(data.get("codigo") || "").trim()} ${data.get("telefono") || "No indicado"}`.trim(),
    `Ubicación: ${data.get("ubicacion") || "No indicada"}`,
  ].join("\n");

  const syncWhatsAppDraft = () => {
    const data = new FormData(form);
    const message = buildLeadMessage(data);
    whatsappDraft.href = `${site.whatsappHref}?text=${encodeURIComponent(message)}`;
    return message;
  };

  syncWhatsAppDraft();
  form.addEventListener("input", syncWhatsAppDraft);
  form.addEventListener("change", syncWhatsAppDraft);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = syncWhatsAppDraft();
    status.textContent = "Mensaje listo. Haz clic en WhatsApp para enviarlo al equipo y recibir respuesta inmediata.";
    whatsappDraft.focus();
    whatsappDraft.setAttribute("aria-label", `Enviar a WhatsApp: ${message.split("\n")[0]}`);
  });
}

})();

