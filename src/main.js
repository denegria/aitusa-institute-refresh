(function () {
const {
  books,
  differentiators,
  downloads,
  faqs,
  heroHighlights,
  heroQuickCapture: heroQuickCaptureData,
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
  const desktopFirst = site.heroVideo || site.heroVideoPortrait;
  const mobileFirst = site.heroVideoPortrait || site.heroVideo;

  return (isMobile ? [mobileFirst, desktopFirst, site.heroVideoFallback] : [desktopFirst, mobileFirst, site.heroVideoFallback])
    .filter(Boolean)
    .filter((value, index, list) => list.indexOf(value) === index);
})();
const contactMessage = encodeURIComponent(
  "Hola AiT USA Institute, vi la clase real y quiero una ruta clara de inicio: clases, horarios y modalidad para mi caso.",
);

const heroQuickCaptureWidget = () => {
  if (!heroQuickCaptureData) return "";

  const options = Array.isArray(heroQuickCaptureData.options)
    ? heroQuickCaptureData.options
    : ["Quiero clase real", "Quiero revisar horarios", "Necesito opción para mi hijo/a"];
  const optionsMarkup = options.map((option) => `<option>${option}</option>`).join("");

  return `
    <form class="hero__quick-capture" data-hero-quick-capture action="#" method="post">
      <p class="hero__quick-capture__title">${heroQuickCaptureData.title || "Tu ruta inicial en 30 segundos"}</p>
      <p class="hero__quick-capture__copy">${heroQuickCaptureData.copy || "Déjanos tu contacto y te escribimos por WhatsApp con una ruta inicial."}</p>
      <div class="hero__quick-capture__row">
        <label class="hero__quick-capture__field">
          Nombre
          <input
            type="text"
            name="hero-quick-name"
            autocomplete="name"
            minlength="2"
            maxlength="64"
            placeholder="Tu nombre"
            data-hero-quick-name
            required
            aria-describedby="hero-quick-capture-note"
          />
        </label>
        <label class="hero__quick-capture__field">
          WhatsApp
          <input
            type="tel"
            name="hero-quick-phone"
            inputmode="tel"
            autocomplete="tel"
            placeholder="+1 555 000 0000"
            data-hero-quick-phone
            required
            maxlength="20"
            aria-describedby="hero-quick-capture-note"
          />
        </label>
      </div>
      <label class="hero__quick-capture__field">
        Objetivo principal
        <select data-hero-quick-goal aria-label="Objetivo principal">
          ${optionsMarkup}
        </select>
      </label>
      <button class="button button--primary" type="submit">${heroQuickCaptureData.button || "Recibir ruta por WhatsApp"}</button>
      <p class="hero__quick-capture__status" data-hero-quick-status aria-live="polite"></p>
      <p id="hero-quick-capture-note" class="hero__quick-capture__note">${heroQuickCaptureData.note || "Sin costo y sin compromiso."}</p>
    </form>
  `;
};

const heroInstructorStrip = () => {
  if (!teachers.length) return "";

  const featuredTeachers = teachers.slice(0, 3).map((teacher) => {
    const href = teacher.href || "#contacto";
    const intent = teacher.intent || "default";
    const name = teacher.name || "Instructora de AiT USA";
    const role = teacher.role || teacher.description || "Acompañamiento real para avanzar con continuidad.";
    const image = teacher.image || site.images.hero;
    const alt = teacher.imageAlt || `${name} de AiT USA Institute.`;

    return `
      <a
        class="hero__teacher-strip__item"
        href="${href}"
        data-intent-action
        data-intent="${intent}"
        aria-label="${name}: ${role}"
      >
        <img src="${image}" alt="${alt}" loading="lazy" decoding="async" />
        <div class="hero__teacher-strip__content">
          <strong>${name}</strong>
          <span>${role}</span>
        </div>
      </a>
    `;
  });

  return `
    <section class="hero__teacher-strip" aria-label="Instructoras de clase real">
      <p class="hero__teacher-strip__title">Conoce quién te guiará</p>
      <div class="hero__teacher-strip__grid" data-hero-teacher-strip>
        ${featuredTeachers.join("")}
      </div>
    </section>
  `;
};

const requiredLeadFields = [
  { name: "nombre" },
  { name: "apellido" },
  { name: "email" },
  { name: "telefono" },
  { name: "ubicacion" },
];
const requiredLeadFieldLabels = {
  nombre: "Nombre",
  apellido: "Apellido",
  email: "Email",
  telefono: "Teléfono",
  ubicacion: "País y ciudad",
};

const leadIntentProfiles = {
  default: {
    intent: "Información general",
    interest: "No estoy seguro",
    forWhom: "Para mí",
    message: "quiero información general sobre sus programas y opciones.",
    panelTitle: "Ruta sugerida: conversación inicial",
    panelCopy:
      "Te ayudamos a definir con claridad tu objetivo, tiempo disponible y formato ideal antes de avanzar.",
    panelAction: "Ver opciones y empezar ruta inicial",
  },
  classSample: {
    intent: "Clase real",
    interest: "Inglés",
    forWhom: "Para mí",
    message: "quiero ver la clase real y recibir una recomendación de inicio.",
    panelTitle: "Ruta sugerida: primera mirada práctica",
    panelCopy:
      "Mira un fragmento real de clase y luego pasamos al formulario con la mejor opción para ti.",
    panelAction: "Ver clase real y definir mi ruta",
  },
  scheduleFlex: {
    intent: "Agenda flexible",
    interest: "Inglés",
    forWhom: "Para mí",
    message: "tengo agenda limitada; por eso quiero ver opciones de horarios flexibles.",
    panelTitle: "Ruta sugerida: horario inteligente",
    panelCopy:
      "Tu caso ideal para comparar opciones de mañana, noche o fin de semana antes de registrarte.",
    panelAction: "Revisar horarios y reservar ruta",
  },
  familySupport: {
    intent: "Opciones familiares",
    interest: "Niños",
    forWhom: "Para mi hijo/a",
    message: "quiero ayuda para elegir opciones para mi familia o para alguien más.",
    panelTitle: "Ruta sugerida: decisión familiar",
    panelCopy:
      "Compara opciones para familias con acompañamiento de seguimiento y te damos un plan sin complicarte el proceso.",
    panelAction: "Ver ruta familiar y reservar orientación",
  },
};

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

const bookInquiryMessage = (bookTitle = "") =>
  encodeURIComponent(
    bookTitle
      ? `Hola AiT USA Institute, quiero información sobre ${bookTitle}.`
      : "Hola AiT USA Institute, quiero información sobre los libros y materiales académicos.",
  );

const productInquiryMessage = (product) =>
  encodeURIComponent(`Hola AiT USA Institute, quiero información sobre ${product.title}.`);

const joinList = (items) => items.map((item) => `<li>${item}</li>`).join("");

const faqShortcuts = () =>
  `<div class="section-inner faq-shortcuts" aria-label="Atajo de preguntas frecuentes">
    ${faqs
      .map(
        (faq, index) => `
          <a
            class="faq-link-chip"
            href="#pregunta-${index + 1}"
            aria-label="Ir a la pregunta: ${faq.question}"
          >${faq.question}</a>
        `,
      )
      .join("")}
  </div>`;

const syncFaqSchema = () => {
  const script = document.querySelector('script[type="application/ld+json"][data-schema="faq"]');
  if (!script) return;

  const payload = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  script.textContent = JSON.stringify(payload, null, 2);
};

const initFaqAccordion = () => {
  const faqItems = [...document.querySelectorAll(".faq-list .faq-item")];
  if (!faqItems.length) return;

  const setOnlyOneOpen = (activeIndex = 0) => {
    faqItems.forEach((item, idx) => {
      item.open = idx === activeIndex;
    });
  };

  const openFromHash = () => {
    const hash = window.location.hash?.replace("#", "") || "";
    if (!hash.startsWith("pregunta-")) return;

    const parsedIndex = Number.parseInt(hash.replace("pregunta-", ""), 10);
    const nextIndex = Number.isNaN(parsedIndex) ? null : parsedIndex - 1;
    const isValidIndex = nextIndex !== null && faqItems[nextIndex];

    if (isValidIndex) {
      setOnlyOneOpen(nextIndex);
    }
  };

  const getActiveFaqIndex = () => faqItems.findIndex((item) => item.open);

  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      const activeIndex = getActiveFaqIndex();

      if (activeIndex === -1) {
        setOnlyOneOpen(0);
      } else {
        setOnlyOneOpen(activeIndex);
      }

      const finalIndex = getActiveFaqIndex();
      const hash = `#pregunta-${finalIndex + 1}`;
      if (window.location.hash !== hash) {
        if (window.history?.replaceState) {
          window.history.replaceState({}, "", hash);
        } else {
          window.location.hash = hash;
        }
      }
    });
  });

  window.addEventListener("hashchange", openFromHash);
  openFromHash();
};

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

const heroVideoFacts = () => `
  <div class="hero__media-quickfacts" aria-label="Qué verás en este recorte de clase">
    <span>Clase real de práctica</span>
    <span>Corrección en vivo</span>
    <span>Sin costo de consulta</span>
    <span>Formato híbrido y presencial</span>
  </div>
`;

const heroIntentCards = () => `
  <div class="hero__intent" aria-label="¿Qué objetivo tienes hoy?">
    <a class="hero__intent-card" href="#experiencia" data-intent-card data-intent="classSample">
      <span class="hero__intent-card__label">Quiero ver la clase real</span>
      <strong>Ver experiencia de 1:08</strong>
    </a>
    <a class="hero__intent-card" href="#horarios" data-intent-card data-intent="scheduleFlex">
      <span class="hero__intent-card__label">Tengo agenda limitada</span>
      <strong>Ver horarios y opciones</strong>
    </a>
    <a class="hero__intent-card" href="#contacto" data-intent-card data-intent="familySupport">
      <span class="hero__intent-card__label">Busco opción para familia</span>
      <strong>Consultar rutas para mi hijo/a</strong>
    </a>
  </div>
`;

const heroCommitment = () => `
  <div class="hero__commitment" aria-label="Compromiso de calidad del hero">
    <article>
      <strong>Clases reales primero</strong>
      <span>Todo parte de una sesión real grabada para que entiendas la dinámica sin dudas.</span>
    </article>
    <article>
      <strong>Decisión en 60 segundos</strong>
      <span>Dos pasos para ver muestra, validar disponibilidad y recibir orientación inicial.</span>
    </article>
    <article>
      <strong>Rutas listas para arrancar</strong>
      <span>Objetivo, horario y formato adaptados a lo que puedes sostener hoy.</span>
    </article>
  </div>
`;

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

  const pathIntents = ["classSample", "scheduleFlex", "familySupport"];
  const pathIntentsLabel = {
    classSample: "Ver clase real y empezar",
    scheduleFlex: "Ver horarios y continuar",
    familySupport: "Recibir ruta familiar",
  };
  const pathSecondaryLabel = {
    classSample: "Empezar con clase real",
    scheduleFlex: "Ver opciones de agenda",
    familySupport: "Ruta para familias",
  };

  return `
    <section id="ruta" class="section section--path section--white" aria-labelledby="ruta-title">
      <div class="section-inner section-heading section-heading--compact">
        <p class="section-kicker">Ruta de arranque</p>
        <h2 id="ruta-title">Sin ambigüedad: estas son tus tres decisiones para empezar.</h2>
        <p>Ves la clase real, validamos agenda y elegimos formato sin promesas vacías; luego te proponemos una ruta que sí se puede ejecutar.</p>
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
                <a
                  class="button button--ghost path-card__cta"
                  href="#contacto"
                  data-intent-card
                  data-intent="${pathIntents[index] || "default"}"
                >${pathIntentsLabel[pathIntents[index]] || "Definir mi ruta"} — ${pathSecondaryLabel[pathIntents[index]] || "ruta inicial"}</a>
              </article>
            `,
          )
          .join("")}
      </div>
      <div class="section-inner path-cta">
        <a class="button button--primary" href="#experiencia">Ver la clase real</a>
        <a class="button button--ghost" href="#cursos">Explorar cursos</a>
      </div>
    </section>
  `;
};

const spotlightSection = () => {
  const clip = instructorClips[0];
  const proofItems = [
    { value: "1:08", label: "muestra real de clase en vivo" },
    { value: "100%", label: "corrección personalizada al instante" },
    { value: "Local", label: "video alojado en el sitio, sin dependencias externas" },
  ];
  const steps = [
    {
      title: "Reproduce la clase",
      description:
        "Mira exactamente cómo suena y se siente aprender con una instructora guiándote en vivo.",
    },
    {
      title: "Compara modalidad",
      description:
        "Escoge online o presencial y revisa qué opción se adapta mejor a tu agenda y objetivos.",
    },
    {
      title: "Habla por WhatsApp",
      description:
        "Solicita una muestra más larga o pide que te ayude el asesor para arrancar esta semana.",
    },
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
          <h2 id="experiencia-title">Antes de decidir, mira cómo se siente una clase real de principio a fin.</h2>
          <p>
            Aquí puedes ver una clase local de alta calidad para que evalúes si el método, el ritmo y la forma de
            corrección encajan contigo. En menos de un minuto tienes una idea real de la experiencia.
          </p>
          <ul class="spotlight-points">
            ${joinList([
              "Verás la dinámica de clase completa, no un clip promocional editado.",
              "La profesora corrige pronunciación y estructura en tiempo real.",
              "El enfoque visual facilita entender la metodología incluso en el primer vistazo.",
            ])}
          </ul>
          <blockquote class="spotlight-quote">
            “Con esta clase entendimos rápido el tipo de enseñanza. Se siente práctico, claro y fácil de seguir.”
          </blockquote>
          <div class="spotlight-journey" aria-label="Ruta para empezar">
            ${steps
              .map(
                (step) => `
                  <article>
                    <span class="spotlight-journey-step">${step.title}</span>
                    <p>${step.description}</p>
                  </article>
                `,
              )
              .join("")}
          </div>
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
            <a class="button button--primary" href="${site.whatsappHref}?text=${contactMessage}">Quiero una muestra completa</a>
            <a class="button button--ghost" href="#cursos">Ver modalidades y cursos</a>
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
          <a class="hero__video-chip hero__video-chip--ghost" href="#experiencia" aria-label="Ir al bloque de experiencia y ver la clase real">
            <span class="hero__video-chip-icon" aria-hidden="true">▶</span>
            Ver experiencia completa
          </a>
          <div class="hero__media-dots" data-hero-dots>${chips}</div>
        </div>
      </div>
    `;
  }

  if (heroVideoSources.length) {
    const previewItems = heroGallery.slice(0, 3);
    return `
      <div class="hero__media-frame hero__media-frame--hero-primary hero__media-frame--hero-carousel">
          <video
            data-hero-player
            class="hero__media-player"
            autoplay
            controls
            muted
            playsinline
            loop
            preload="auto"
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
        <div class="hero__media-overlay hero__media-overlay--hero">
          <div class="hero__media-tag">Video real · 1:08</div>
          ${heroVideoFacts()}
          <div class="hero__media-route">
            <p class="hero__media-route__title">Tu ruta inicial en 60 segundos</p>
            <p class="hero__media-route__copy">1) mira la clase real · 2) valida tu estilo · 3) recibe opción de horario.</p>
          </div>
          <button class="hero__video-chip" type="button" data-hero-play-button aria-label="Reproducir video de clase real">
            <span class="hero__video-chip-icon" aria-hidden="true">▶</span>
            Ver video de muestra
          </button>
          <a class="hero__video-chip hero__video-chip--ghost" href="#experiencia" aria-label="Ir al bloque de experiencia y ver la clase real">
            <span class="hero__video-chip-icon" aria-hidden="true">▶</span>
            Ver experiencia completa
          </a>
        </div>
      </div>
        <div class="hero__preview-rail" aria-label="Momentos reales de clase">
      ${previewItems
        .map(
          (item, index) => `
              <button
                class="hero__preview-card ${index === 0 ? "hero__preview-card--featured" : ""}"
                type="button"
                data-hero-preview="${index}"
                data-hero-preview-source="${item.video || ""}"
                data-hero-preview-poster="${item.videoPoster || item.image}"
                aria-label="${item.label}: ${item.title}"
              >
                ${item.video ? '<span class="hero__preview-card__video-badge">VIDEO REAL</span>' : ""}
                <img src="${item.image}" alt="${item.imageAlt}" loading="${index === 0 ? "eager" : "lazy"}" decoding="async" />
                <div class="hero__preview-copy">
                  <span>${item.label}</span>
                  <strong>${item.title}</strong>
                </div>
              </button>
            `,
          )
          .join("")}
      </div>
      <p class="hero__media-note">Tres momentos reales de clase para que veas la experiencia antes de escribirnos.</p>
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

const initHeroPreviewCards = () => {
  if (!heroVideoSources.length) return;

  const previewCards = [...document.querySelectorAll("[data-hero-preview]")];
  const kicker = document.querySelector("[data-hero-kicker]");
  const title = document.querySelector("[data-hero-title]");
  const poster = document.querySelector("[data-hero-poster]");
  const heroVideo = document.querySelector("[data-hero-player]");
  const heroSource = heroVideo.querySelector("[data-hero-source]");
  const heroFallbackImage = document.querySelector("[data-hero-fallback]");

  if (!previewCards.length || !kicker || !title || !poster || !heroSource || !heroFallbackImage) return;

  const setPreviewFocus = (nextIndex) => {
    previewCards.forEach((card, cardIndex) => {
      card.classList.toggle("hero__preview-card--featured", cardIndex === nextIndex);
      card.setAttribute("aria-pressed", String(cardIndex === nextIndex));
    });
  };

  const setHeroContext = (nextIndex) => {
    const card = previewCards[nextIndex];
    const item = heroGallery[nextIndex];
    if (!card || !item) return;

    const nextSource = card.dataset.heroPreviewSource || "";
    const nextPoster = card.dataset.heroPreviewPoster || item.image;

    poster.src = nextPoster || item.image || poster.src;
    poster.alt = item.imageAlt || poster.alt;
    kicker.textContent = item.label;
    title.textContent = item.title;

    if (nextSource) {
      heroSource.src = nextSource;
      heroVideo.load();
      heroVideo.play().catch(() => {});
      heroVideo.classList.remove("is-hidden");
      heroFallbackImage.classList.add("is-hidden");
    } else {
      heroVideo.pause();
      heroSource.src = heroVideoSources[0];
      heroVideo.load();
      heroVideo.classList.remove("is-hidden");
      heroFallbackImage.classList.add("is-hidden");
    }
  };

  previewCards.forEach((card) => {
    const nextIndex = Number(card.dataset.heroPreview || 0);

    card.addEventListener("click", () => {
      setHeroContext(nextIndex);
      setPreviewFocus(nextIndex);
    });
  });

  setHeroContext(0);
  setPreviewFocus(0);
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

const initHeroPlayButton = () => {
  const heroVideo = document.querySelector("[data-hero-player]");
  const heroPlayButton = document.querySelector("[data-hero-play-button]");

  if (!heroVideo || !heroPlayButton) return;

  heroPlayButton.addEventListener("click", () => {
    heroVideo.play().catch(() => {
      heroPlayButton.textContent = "Toca aquí para reproducir";
    });
  });
};

const initHeroQuickCapture = () => {
  const form = document.querySelector("[data-hero-quick-capture]");
  if (!form) return;

  const quickName = form.querySelector("[data-hero-quick-name]");
  const quickPhone = form.querySelector("[data-hero-quick-phone]");
  const quickGoal = form.querySelector("[data-hero-quick-goal]");
  const quickStatus = form.querySelector("[data-hero-quick-status]");
  if (!quickName || !quickPhone || !quickGoal || !quickStatus) return;

  const getCleanPhone = (value) => String(value || "").replace(/\D/g, "");
  const isValidPhone = (value) => {
    const digits = getCleanPhone(value);
    return digits.length >= 10 && digits.length <= 15;
  };
  const toWaPhone = (value) => {
    const digits = getCleanPhone(value);
    if (!digits) return "";
    if (digits.length === 10) return `+1${digits}`;
    if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
    return `+${digits}`;
  };
  const setQuickStatus = (message, isError = false) => {
    quickStatus.textContent = message;
    quickStatus.classList.toggle("is-error", Boolean(isError));
    if (!message) quickStatus.classList.remove("is-error");
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = String(quickName.value || "un interesado").trim();
    const phone = String(quickPhone.value || "").trim();
    const goal = String(quickGoal.value || "ruta inicial").trim();

    if (name.length < 2) {
      setQuickStatus("Escribe tu nombre para personalizar el mensaje.", true);
      quickName.focus();
      return;
    }

    if (!isValidPhone(phone)) {
      setQuickStatus("Tu número debe tener al menos 10 dígitos. Ejemplo: +1 555 000 0000.", true);
      quickPhone.focus();
      return;
    }

    const normalizedPhone = toWaPhone(phone);
    const message = encodeURIComponent(
      `Hola AiT USA Institute, soy ${name} y quiero una ruta inicial para ${goal}. Mi número de contacto es ${normalizedPhone || "el que me registran"}.`
      + " Quiero clases, horarios y modalidad para empezar.",
    );

    setQuickStatus("Abriendo WhatsApp con tu mensaje listo para enviar…");
    window.location.href = `${site.whatsappHref}?text=${message}`;
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
    <a class="header-cta" href="#experiencia" aria-label="Ver la clase real antes de escribir por WhatsApp">Ver clase real ahora</a>
  </header>

  <div class="quick-cta" aria-label="Acciones rápidas de inicio">
    <a class="button button--primary" href="#experiencia">Ver clase real en 1:08</a>
    <a class="button button--ghost" href="${site.whatsappHref}?text=${contactMessage}">Quiero ruta guiada por WhatsApp</a>
  </div>

  <main>
      <section id="inicio" class="hero" style="--hero-image: url('${site.heroVideoPoster || site.images.heroPoster || site.images.hero}')">
      ${heroVideoBackground()}
      <div class="hero__inner">
        <div class="hero__media">
          ${heroMedia()}
        </div>
        <div class="hero__content">
          <p class="section-kicker">${site.tagline}</p>
          <h1>${site.heroHeadline || site.name}</h1>
          <p class="hero__lead">${site.heroLead || site.description}</p>
          <div class="hero__actions">
            <a class="button button--primary" href="#experiencia">Ver clase real ahora</a>
            <a class="button button--ghost" href="${site.whatsappHref}?text=${contactMessage}">Quiero hablar por WhatsApp</a>
          </div>
          ${heroIntentCards()}
          ${heroCommitment()}
        <p class="hero__microcopy">
            ${site.heroMicrocopy || "Empieza en 60 segundos: mira una clase real, valida ritmo y decide con menos incertidumbre."}
          </p>
          ${heroInstructorStrip()}
          <div class="hero__conversion-strip">
            <a class="button button--primary" href="#contacto" data-intent-action data-intent="default">Quiero mi ruta personalizada</a>
            <a class="button button--ghost" href="#horarios" data-intent-action data-intent="scheduleFlex">Ver horarios disponibles</a>
          </div>
          ${heroQuickCaptureWidget()}
          <div class="hero__highlights" aria-label="Beneficios">
            ${(site.heroHighlights || site.heroHighlight || [])
              .map((copy) => `<span>${copy}</span>`)
              .join("")}
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
          <p>
            El objetivo es práctico: comprender rápido, hablar con precisión y usar el inglés en
            escenarios cotidianos y académicos sin fricción.
          </p>
        </div>
        <div>
          <p>
            Nuestro método visual traduce estructura y vocabulario en hábitos de comunicación para
            resultados visibles.
          </p>
        </div>
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
        <h2 id="cursos-title">En 45 segundos tienes una ruta de curso clara.</h2>
        <p>Elegimos entre inglés realista, apoyo académico y tecnología. Si quieres resultados rápidos, primero filtra por necesidad y luego compara horario + modalidad.</p>
        <div class="course-quick-paths" aria-label="Ruta rápida según tu objetivo">
          <button class="course-quick-path" type="button" data-course-filter-quick="todos">
            <span class="course-quick-path__title">Comparar todo</span>
            <span class="course-quick-path__copy">Revisa todas las opciones y encuentra tu mejor ajuste.</span>
          </button>
          <button class="course-quick-path" type="button" data-course-filter-quick="ingles">
            <span class="course-quick-path__title">Hablar inglés rápido</span>
            <span class="course-quick-path__copy">Prioriza práctica comunicativa para trabajo, escuela y vida diaria.</span>
          </button>
          <button class="course-quick-path" type="button" data-course-filter-quick="ninos">
            <span class="course-quick-path__title">Soy padre o madre</span>
            <span class="course-quick-path__copy">Empieza por rutas para 8-13 años con apoyo y seguimiento.</span>
          </button>
          <button class="course-quick-path" type="button" data-course-filter-quick="academico">
            <span class="course-quick-path__title">Mejora resultados académicos</span>
            <span class="course-quick-path__copy">Enfócate en examen GED, matemáticas y soporte escolar.</span>
          </button>
        </div>
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
                <a class="course-guide__link" href="${item.href}">${item.cta}</a>
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
      <div class="course-shortcuts">
        <a class="course-shortcuts__primary button button--primary" href="#horarios">Ver horarios y modalidad</a>
        <a
          class="course-shortcuts__ghost button button--ghost"
          href="${site.whatsappHref}?text=${encodeURIComponent(
            "Hola AiT USA Institute, quiero una recomendación de curso según mi disponibilidad y objetivo."
          )}"
        >
          Hablar con asesor
        </a>
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
                  <p class="program-card__best-for">${program.bestFor}</p>
                  <p class="program-card__fit">${program.fit}</p>
                  <p class="program-card__summary">${program.summary}</p>
                  <ul class="program-card__details">${joinList(program.details)}</ul>
                  <div class="program-card__footer">
                    <a class="program-card__cta" href="${site.whatsappHref}?text=${programInquiryMessage(program)}">${program.cta || "Hablar de esta ruta"}</a>
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
          <p class="section-kicker">Cómo enseñamos</p>
          <h2 id="metodo-title">Comprender. Practicar. Hablar. Repetir.</h2>
          <p>
            Nuestro método visual organiza vocabulario, tiempos y estructura para acelerar la comprensión.
            Cada bloque está diseñado para pasar de lo teórico a lo útil con más práctica y menos confusión.
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
                  <p class="book-card__best-for">${book.bestFor}</p>
                  <p>${book.text}</p>
                  <div class="payment-card__footer">
                    <a class="payment-card__cta" href="${site.whatsappHref}?text=${bookInquiryMessage(book.title)}">Pedir este libro</a>
                  </div>
                </div>
              </article>
            `,
          )
          .join("")}
      </div>
      <div class="section-inner books-cta">
        <div>
          <p class="section-kicker">Material y apoyo</p>
          <h3>Elige el libro correcto según tu nivel y la forma en que estudias.</h3>
          <p>Si no sabes cuál corresponde a tu etapa, escríbenos y te decimos cuál te conviene en minutos.</p>
        </div>
        <div class="books-cta__actions">
          <a class="button button--primary" href="${site.whatsappHref}?text=${bookInquiryMessage()}">Ver libros</a>
          <a class="button button--ghost" href="#contacto">Pedir ayuda</a>
        </div>
      </div>
    </section>

    <section id="horarios" class="section section--white" aria-labelledby="horarios-title">
          <div class="section-inner split split--center">
            <div>
              <p class="section-kicker">Horarios y modalidad</p>
              <h2 id="horarios-title">Selecciona tu horario ideal en 30 segundos.</h2>
              <p class="section-kicker">Filtra por horario y combina modalidad con disponibilidad real.</p>
              <div class="schedule-intro">
                <article>
                  <strong>Flexible</strong>
                  <span>Turnos de mañana, noche, sábado y domingo.</span>
                </article>
                <article>
                  <strong>Guiado</strong>
                  <span>Te ayudamos a escoger el horario con mejor continuidad.</span>
                </article>
                <article>
                  <strong>Ritmo</strong>
                  <span>Todas las clases son de 60 o 90 minutos según el horario.</span>
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
          <div class="schedule-filter-bar" data-schedule-filter-bar aria-label="Filtrar horarios por momento del día">
            <button class="schedule-filter-button is-active" type="button" data-schedule-filter="todos" aria-pressed="true">Todos</button>
            <button class="schedule-filter-button" type="button" data-schedule-filter="mañana" aria-pressed="false">Mañana</button>
            <button class="schedule-filter-button" type="button" data-schedule-filter="noche" aria-pressed="false">Noche</button>
            <button class="schedule-filter-button" type="button" data-schedule-filter="fin-de-semana" aria-pressed="false">Fin de semana</button>
          </div>
          <p class="schedule-count" data-schedule-count aria-live="polite">Mostrando ${schedules.length} opciones de horario.</p>
        </div>
        <div class="schedule-panel">
          ${schedules
            .map(
              (schedule) => `
                <article class="schedule-card" data-schedule-profile="${schedule.timeProfile}">
                  ${schedule.badge ? `<p class="schedule-card__badge">${schedule.badge}</p>` : ""}
                  <h3>${schedule.label}</h3>
                  <p>${schedule.bestFor}</p>
                  <p class="schedule-card__meta">${schedule.duration} · ${schedule.availability}</p>
                  <div class="schedule-chip-list">${schedule.times
                    .map((time) => `<span>${time}</span>`)
                    .join("")}</div>
                  ${schedule.commitment ? `<p class="schedule-card__commitment">${schedule.commitment}</p>` : ""}
                  <a
                    class="schedule-card__cta button button--ghost"
                    href="${site.whatsappHref}?text=${encodeURIComponent(`Hola AiT USA Institute, quiero más información sobre el horario de ${schedule.label.toLowerCase()}. ${schedule.whatsappHint}`)}"
                  >
                    ${schedule.cta || "Quiero este horario"}
                  </a>
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
        <h2 id="sedes-title">Encuentra tu sede o estudia online sin dar vueltas.</h2>
        <p>Opciones presenciales y remotas para aprender con la flexibilidad que tu calendario necesita, y ayuda directa para elegir la mejor.</p>
      </div>
      <div class="section-inner location-grid">
        ${locations
          .map(
            (location) => `
              <article class="location-card">
                <h3>${location.city}</h3>
                <p>${location.address}</p>
                <p class="location-card__best-for">${location.bestFor}</p>
                <p class="location-card__highlight">${location.highlight}</p>
                <span>${location.note}</span>
                <div class="location-card__actions">
                  <a href="${site.whatsappHref}?text=${encodeURIComponent(`Hola AiT USA Institute, quiero información sobre ${location.city}.`)}">${location.cta}</a>
                </div>
              </article>
            `,
          )
          .join("")}
      </div>
      <div class="section-inner books-cta">
        <div>
          <p class="section-kicker">¿No sabes cuál sede te conviene?</p>
          <h3>Te ayudamos a comparar ubicación, horario y modalidad antes de elegir.</h3>
          <p>Escríbenos y te orientamos con la opción más práctica según tu zona, tu rutina y tu forma de estudiar.</p>
        </div>
        <div class="books-cta__actions">
          <a class="button button--primary" href="${site.whatsappHref}?text=${contactMessage}">Pedir orientación</a>
          <a class="button button--ghost" href="#horarios">Ver horarios</a>
        </div>
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
          <p class="section-kicker">Quiénes somos</p>
          <h2 id="about-title">Una escuela de New Jersey enfocada en inglés práctico y resultados visibles.</h2>
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
        <p class="section-kicker">Prueba social y equipo</p>
        <h2 id="testimonios-title">Dos historias reales, una misma sensación: hablar con más seguridad.</h2>
        <p>Escucha cómo cambió la experiencia de estudiantes que hoy entienden mejor, responden con menos bloqueo y se sienten acompañadas por un equipo que corrige en vivo.</p>
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
            <h3>Personas reales detrás de la clase.</h3>
            <div class="teacher-grid" aria-label="Instructoras de AiT USA">
              ${teachers
                .map(
                  (teacher) => `
                    <a
                      class="teacher-card"
                      href="${teacher.href || "#contacto"}"
                      data-intent-card
                      data-intent="${teacher.intent || "default"}"
                      aria-label="${teacher.name}"
                    >
                      <img src="${teacher.image}" alt="${teacher.imageAlt}" loading="lazy" />
                      <div class="teacher-card__body">
                        <span class="teacher-card__badge">${teacher.badge}</span>
                        <p class="teacher-card__name">${teacher.name}</p>
                        <p class="teacher-card__role">${teacher.role}</p>
                        <p class="teacher-card__description">${teacher.description}</p>
                      </div>
                    </a>
                  `,
                )
                .join("")}
            </div>
          </div>
          <div class="trust-actions">
            <a class="button button--primary" href="#experiencia">Ver clase real</a>
            <a class="button button--ghost" href="${site.whatsappHref}?text=${contactMessage}">Hablar con un asesor</a>
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
                    <p class="testimonial-card__eyebrow">${item.result}</p>
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
        <p class="section-kicker">Acceso y preparación</p>
        <h2 id="downloads-title">Ten listo tu dispositivo y tu material antes de la primera clase.</h2>
        <p>Si estudias online o híbrido, aquí te dejamos lo mínimo para que tu clase funcione sin tropiezos.</p>
      </div>
      <div class="section-inner utility-strip">
        <article>
          <strong>Compatible</strong>
          <span>iPhone, iPad, Mac, Android y Windows para estudiar con flexibilidad.</span>
        </article>
        <article>
          <strong>Listo para usar</strong>
          <span>Te guiamos para que abras recursos y clases sin configuración complicada.</span>
        </article>
        <article>
          <strong>Seguimiento</strong>
          <span>Material alineado con tu progreso semanal para que no estudies a ciegas.</span>
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
      <div class="section-inner books-cta">
        <div>
          <p class="section-kicker">¿Necesitas ayuda para configurarte?</p>
          <h3>Si no estás seguro de qué equipo usar, te dejamos listo antes de tu primera clase.</h3>
          <p>Escríbenos por WhatsApp o completa el formulario y te ayudamos a dejarlo listo antes de empezar.</p>
        </div>
        <div class="books-cta__actions">
          <a class="button button--primary" href="${site.whatsappHref}?text=${contactMessage}">Pedir ayuda</a>
          <a class="button button--ghost" href="#contacto">Ver contacto</a>
        </div>
      </div>
    </section>

    <section class="section section--soft" aria-labelledby="pagos-title">
      <div class="section-inner section-heading">
        <p class="section-kicker">Tu punto de entrada</p>
        <h2 id="pagos-title">Elige la ruta que mejor encaja con tu meta y tu momento.</h2>
        <p>Si ya sabes lo que buscas, ve directo al plan; si no, te dejamos una guía rápida para elegir sin perder tiempo.</p>
      </div>
      <div class="section-inner payment-note">
        <p>
          Si no ves tu modalidad exacta, escríbenos por WhatsApp y te diremos cuál encaja mejor según tu país, horario y nivel.
        </p>
      </div>
      <div class="section-inner payment-guide" aria-label="Ayuda para elegir producto">
        ${paymentGuides
          .map(
            (item) => `
              <article>
                <strong>${item.title}</strong>
                <p>${item.text}</p>
                <a href="${item.href}">${item.cta}</a>
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
                    <a class="payment-card__cta" href="${site.whatsappHref}?text=${productInquiryMessage(item)}">${item.cta || "Elegir este plan"}</a>
                  </div>
                </div>
              </article>
            `,
          )
          .join("")}
      </div>
      <div class="section-inner books-cta">
        <div>
          <p class="section-kicker">¿Aún comparas opciones?</p>
          <h3>Te ayudamos a decidir entre mensualidad, libro, registración o una ruta técnica.</h3>
          <p>Escríbenos y te decimos cuál conviene según tu meta, tu ritmo y tu presupuesto.</p>
        </div>
        <div class="books-cta__actions">
          <a class="button button--primary" href="${site.whatsappHref}?text=${contactMessage}">Pedir recomendación</a>
          <a class="button button--ghost" href="#faq">Ver dudas frecuentes</a>
        </div>
      </div>
    </section>

    <section id="faq" class="section section--white" aria-labelledby="faq-title">
      <div class="section-inner section-heading">
        <p class="section-kicker">Preguntas frecuentes</p>
        <h2 id="faq-title">Resolvemos tus dudas antes de inscribirte.</h2>
        <p>Si todavía estás comparando opciones, aquí tienes una vista rápida de lo que normalmente aclaramos antes de arrancar, incluyendo cómo se ve una clase real.</p>
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
          <h3>Si quieres ver la clase primero</h3>
          <p>Empieza por el video real de la experiencia y luego escríbenos por WhatsApp o llama para validar disponibilidad, horarios y el mejor punto de inicio.</p>
          <a class="button button--ghost" href="#experiencia">Ver clase real</a>
          <a class="button button--primary" href="${site.whatsappHref}?text=${contactMessage}">Escribir por WhatsApp</a>
        </article>
      </div>
      ${faqShortcuts()}
      <div class="section-inner faq-list">
        ${faqs
          .map(
            (faq, index) => `
              <details id="pregunta-${index + 1}" class="faq-item" ${index === 0 ? "open" : ""}>
                <summary>${faq.question}</summary>
                <p>${faq.answer}</p>
                <a class="faq-link" href="${
                  faq.cta === "Ver clase real"
                    ? "#experiencia"
                    : faq.cta === "Ver horarios"
                      ? "#horarios"
                      : faq.cta === "Ver libro"
                        ? "#libros"
                        : faq.cta === "Pedir orientación"
                          ? `${site.whatsappHref}?text=${contactMessage}`
                          : "#contacto"
                }">${faq.cta}</a>
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
          <h2 id="contacto-title">Cuéntanos tu meta y armamos tu ruta en minutos.</h2>
          <p>
            Completa el formulario y en minutos te proponemos nivel, horario y formato ideal.
            Si quieres, primero ve la clase real y luego regresas para avanzar más rápido.
          </p>
          <p class="contact-quick-intent__label">Elige tu prioridad y te preparamos el mensaje inicial exacto:</p>
          <div class="contact-quick-intent" role="group" aria-label="Prioridad para iniciar">
            <button class="contact-quick-intent__chip" type="button" data-contact-intent-quick="classSample">Ver clase real primero</button>
            <button class="contact-quick-intent__chip" type="button" data-contact-intent-quick="scheduleFlex">Necesito horario rápido</button>
            <button class="contact-quick-intent__chip" type="button" data-contact-intent-quick="familySupport">Busco opción para mi familia</button>
            <button class="contact-quick-intent__chip" type="button" data-contact-intent-quick="default">Sin definir aún</button>
          </div>
          <div class="contact-trust" aria-label="Compromisos de atención">
            <article>
              <strong>⚡</strong>
              <span><strong>Respuesta rápida:</strong> normalmente en menos de 2 horas hábiles.</span>
            </article>
            <article>
              <strong>🎯</strong>
              <span><strong>Plan personalizado:</strong> no te mandamos un mensaje genérico.</span>
            </article>
            <article>
              <strong>✅</strong>
              <span><strong>Sin presión:</strong> solo pasos concretos para empezar.</span>
            </article>
          </div>
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
          <div class="contact-intent" data-contact-intent-panel>
            <p class="contact-intent__title" data-contact-intent-title>Ruta sugerida: conversación inicial</p>
            <p class="contact-intent__copy" data-contact-intent-copy>Te ayudamos a definir con claridad tu objetivo, tiempo disponible y formato ideal antes de avanzar.</p>
            <a
              class="button button--ghost"
              href="${site.whatsappHref}?text=${contactMessage}"
              data-contact-intent-action
              aria-label="Continuar por WhatsApp: Ruta sugerida"
            >Ver opciones y empezar ruta inicial</a>
          </div>
          <div class="direct-contact">
            <a href="${site.phoneHref}">${site.phone}</a>
            <a href="${site.whatsappHref}?text=${contactMessage}">${site.whatsapp}</a>
            <a href="${site.forms.registration}" target="_blank" rel="noreferrer">Ver formulario oficial</a>
          </div>
          <p>Primero validamos tu nivel, horario y modalidad; después confirmamos tu punto de arranque más adecuado.</p>
          <p>Mientras completas el formulario, el botón de WhatsApp se adapta con tus datos para que enviar la información sea más rápido y claro.</p>
        </div>
        <form class="lead-form" data-lead-form>
          <p class="form-required-note">Campos obligatorios: nombre, apellido, email, teléfono y ciudad.</p>
          <div class="form-row">
            <label>Nombre <input name="nombre" autocomplete="given-name" placeholder="Tu nombre" required /></label>
            <label>Apellido <input name="apellido" autocomplete="family-name" placeholder="Tu apellido" required /></label>
          </div>
          <label>Email <input name="email" type="email" autocomplete="email" placeholder="tucorreo@ejemplo.com" required /></label>
          <div class="form-row">
            <label>Para quién es
              <select name="para">
                <option>Para mí</option>
                <option>Para mi hijo/a</option>
                <option>Para otra persona</option>
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
            <label>Teléfono <input name="telefono" type="tel" autocomplete="tel" placeholder="+1 555 000 0000" required /></label>
          </div>
          <label>País y ciudad <input name="ubicacion" placeholder="Ej. Miami, FL" required /></label>
          <p class="form-field-note">Revisaremos tu consulta y te responderemos con una ruta recomendada por WhatsApp.</p>
          <button class="button button--primary" type="submit">Quiero mi ruta inicial</button>
          <p class="form-progress" role="status" aria-live="polite" data-form-progress></p>
          <p class="form-status" role="status" data-form-status></p>
          <a class="button button--ghost form-whatsapp" data-form-whatsapp href="${site.whatsappHref}?text=${contactMessage}">Continuar por WhatsApp</a>
        </form>
      </div>
    </section>
  </main>
  
  <div class="mobile-action-bar" aria-label="Acciones rápidas" data-mobile-action-bar>
    <a
      class="button button--ghost"
      href="#experiencia"
      data-intent-action
      data-intent="classSample"
      data-mobile-action
      aria-label="Ver clase real en el bloque de experiencia"
    >Ver clase real</a>
    <a
      class="button button--primary"
      href="#contacto"
      data-intent-action
      data-intent="default"
      data-mobile-action
      data-mobile-target="#contacto"
      aria-label="WhatsApp para empezar tu ruta de inglés hoy"
    >Quiero mi ruta por WhatsApp</a>
  </div>

  <footer class="site-footer">
    <div class="site-footer__brand">
      <strong>${site.name}</strong>
      <span>${site.legal}</span>
      <p>Una experiencia web más clara, humana y enfocada en mostrar la clase real antes de dar el siguiente paso.</p>
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
      <a href="#experiencia">Ver clase real</a>
      <a href="#cursos">Cursos</a>
      <a href="#faq">Preguntas frecuentes</a>
      <a href="#contacto">Contacto</a>
    </div>
    <p>Experiencia web renovada para mostrar video real de clase y una ruta más clara antes de escribirnos. © ${site.founded} ${site.name}.</p>
  </footer>
`;
initHeroBackground();
initHeroShowcase();
initHeroPreviewCards();
initHeroFallbacks();
initHeroPlayButton();
initHeroQuickCapture();

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
initFaqAccordion();
syncFaqSchema();

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
const quickCourseFilters = [...document.querySelectorAll("[data-course-filter-quick]")];
const courseInterestSelect = document.querySelector('select[name="interes"]');
const programFilters = new Set(Object.values(categoryLabel));
const scheduleFilterButtons = [...document.querySelectorAll("[data-schedule-filter]")];
const scheduleCards = [...document.querySelectorAll(".schedule-card[data-schedule-profile]")];
const scheduleFilterValues = new Set(scheduleFilterButtons.map((button) => button.dataset.scheduleFilter).filter(Boolean));
const scheduleCount = document.querySelector("[data-schedule-count]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const mobileActionBar = document.querySelector("[data-mobile-action-bar]");

  const initMobileActionBar = () => {
    if (!mobileActionBar) return;
    const mobileMatcher = window.matchMedia("(max-width: 720px)");
    const applyState = () => {
      mobileActionBar.classList.toggle("is-visible", mobileMatcher.matches);
  };

  applyState();
  mobileMatcher.addEventListener("change", applyState);
};
initMobileActionBar();

const initialCourseFilter = (() => {
  const param = new URL(window.location.href).searchParams.get("curso");
  return param && programFilters.has(param) ? param : "todos";
})();

const initialCourseInterest = courseInterestMap[initialCourseFilter] || courseInterestMap.todos;

const applyScheduleFilter = (filter = "todos", activeButton = null) => {
  const nextFilter = scheduleFilterValues.has(filter) ? filter : "todos";
  let visibleCount = 0;

  scheduleFilterButtons.forEach((item) => item.classList.toggle("is-active", item === activeButton));
  scheduleFilterButtons.forEach((item) =>
    item.setAttribute("aria-pressed", String(item === activeButton)),
  );

  scheduleCards.forEach((card) => {
    const matches = nextFilter === "todos" || card.dataset.scheduleProfile === nextFilter;
    card.hidden = !matches;
    if (matches) visibleCount += 1;
  });

  if (scheduleCount) {
    scheduleCount.textContent =
      nextFilter === "todos" ? `Mostrando ${visibleCount} opciones de horario.` : `Mostrando ${visibleCount} opciones para ${nextFilter}.`;
  }
};

const applyProgramFilter = (filter, activeButton = null, { updateHistory = true, scrollToResults = false } = {}) => {
  const nextFilter = programFilters.has(filter) ? filter : "todos";
  filterButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === activeButton)));
  quickCourseFilters.forEach((button) =>
    button.classList.toggle("is-active", button.dataset.courseFilterQuick === nextFilter),
  );

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

quickCourseFilters.forEach((button) => {
  button.addEventListener("click", () => {
    const nextFilter = button.dataset.courseFilterQuick || "todos";
    const matchButton = filterButtons.find((item) => item.dataset.filter === nextFilter) || filterButtons[0];
    applyProgramFilter(nextFilter, matchButton, { scrollToResults: true });
  });
});

scheduleFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyScheduleFilter(button.dataset.scheduleFilter || "todos", button);
  });
});

clearFiltersButton?.addEventListener("click", () => {
  const allButton = filterButtons.find((button) => button.dataset.filter === "todos") || filterButtons[0];
  applyProgramFilter("todos", allButton, { scrollToResults: true });
});

const activeFilterButton = filterButtons.find((button) => button.dataset.filter === initialCourseFilter) || filterButtons[0];
applyProgramFilter(initialCourseFilter, activeFilterButton, { updateHistory: false });
const activeScheduleButton = scheduleFilterButtons.find((button) => button.dataset.scheduleFilter === "todos") || scheduleFilterButtons[0];
applyScheduleFilter("todos", activeScheduleButton);

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
  const leadIntentCards = [...document.querySelectorAll("[data-intent-card]")];
  const contactQuickIntentButtons = [...document.querySelectorAll("[data-contact-intent-quick]")];
  const leadPersonaSelect = form.querySelector('select[name="para"]');
  const contactIntentTitle = form.querySelector("[data-contact-intent-title]");
  const contactIntentCopy = form.querySelector("[data-contact-intent-copy]");
  const contactIntentAction = form.querySelector("[data-contact-intent-action]");
  const progressIndicator = form.querySelector("[data-form-progress]");
  const getRequiredMissingFields = (data) =>
    requiredLeadFields
      .map((field) => field.name)
      .filter((fieldName) => `${data.get(fieldName) || ""}`.trim().length === 0)
      .map((fieldName) => requiredLeadFieldLabels[fieldName] || fieldName);

  let activeLeadIntent = "default";

  const getLeadIntentProfile = (intent) => leadIntentProfiles[intent] || leadIntentProfiles.default;
  const setActiveLeadIntent = (intent = "default", { silent = false } = {}) => {
    const profile = getLeadIntentProfile(intent);
    activeLeadIntent = intent;

    if (courseInterestSelect) {
      courseInterestSelect.value = profile.interest;
    }

    if (leadPersonaSelect && profile.forWhom) {
      leadPersonaSelect.value = profile.forWhom;
    }

    leadIntentCards.forEach((card) => {
      card.classList.toggle("is-active", card.dataset.intent === activeLeadIntent);
    });
    contactQuickIntentButtons.forEach((button) => {
      const isActive = button.dataset.contactIntentQuick === activeLeadIntent;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    if (contactIntentTitle && contactIntentCopy && contactIntentAction) {
      contactIntentTitle.textContent = profile.panelTitle;
      contactIntentCopy.textContent = profile.panelCopy;
      contactIntentAction.textContent = profile.panelAction;
      contactIntentAction.setAttribute("href", whatsappDraft.href);
      contactIntentAction.setAttribute("aria-label", `Continuar por WhatsApp: ${profile.panelAction}`);
    }

    if (!silent) {
      syncWhatsAppDraft();
    }
  };

  const navigateFromIntentAction = (trigger, event) => {
    if (!trigger) return;
    const rawTarget = trigger.getAttribute("data-mobile-target") || trigger.getAttribute("href") || "#contacto";
    const targetHash = rawTarget.trim();
    const intent = trigger.dataset.intent || "default";
    const isExternal = /^https?:\/\//i.test(targetHash);

    if (!isExternal) {
      event?.preventDefault();
    }

    setActiveLeadIntent(intent, { silent: true });
    syncWhatsAppDraft();

    if (targetHash === "#horarios") {
      const scheduleSection = document.querySelector("#horarios");
      const activeScheduleButton =
        scheduleFilterButtons.find((button) => button.dataset.scheduleFilter === "todos") || scheduleFilterButtons[0];

      if (activeScheduleButton) {
        applyScheduleFilter("todos", activeScheduleButton);
      }

      if (scheduleSection) {
        scheduleSection.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      }
    } else if (
      targetHash === "#contacto" ||
      (targetHash.startsWith("#") && intent !== "classSample")
    ) {
      const contactSection = document.querySelector("#contacto");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
        const nameInput = form?.querySelector('input[name="nombre"]');
        if (nameInput) {
          nameInput.focus({ preventScroll: true });
        }
      }
    } else if (targetHash.startsWith("#")) {
      const target = document.querySelector(targetHash);
      if (target) {
        target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      }
    }

    if (!isExternal && window.history?.pushState) {
      window.history.pushState({}, "", targetHash);
    } else if (!isExternal) {
      window.location.hash = targetHash || "#contacto";
    }
  };

  const buildLeadMessage = (data) => {
    const profile = getLeadIntentProfile(activeLeadIntent);
    return [
      `Hola AiT USA Institute, ${profile.message}`,
      `Objetivo: ${profile.intent}`,
      `Nombre: ${data.get("nombre") || "No indicado"} ${data.get("apellido") || ""}`.trim(),
      `Email: ${data.get("email") || "No indicado"}`,
      `Es para: ${data.get("para") || "No indicado"}`,
      `Curso de interés: ${data.get("interes") || "No indicado"}`,
      `Edad: ${data.get("edad") || "No indicado"}`,
      `Teléfono: ${(data.get("codigo") || "").trim()} ${data.get("telefono") || "No indicado"}`.trim(),
      `Ubicación: ${data.get("ubicacion") || "No indicada"}`,
    ].join("\n");
  };

  const syncWhatsAppDraft = () => {
    const data = new FormData(form);
    const message = buildLeadMessage(data);
    whatsappDraft.href = `${site.whatsappHref}?text=${encodeURIComponent(message)}`;
    if (contactIntentAction) {
      contactIntentAction.href = whatsappDraft.href;
    }
    updateLeadProgress();
    return message;
  };

  const updateLeadProgress = () => {
    if (!progressIndicator) return;

    const data = new FormData(form);
    const total = requiredLeadFields.length;
    const done = total - getRequiredMissingFields(data).length;
    const isComplete = done === total;
    const missingFields = getRequiredMissingFields(data);

    progressIndicator.textContent =
      isComplete
        ? "✅ Todo listo. Cuando envíes, te compartimos tu ruta personalizada en el día."
        : `⚙️ Campos completados: ${done} de ${total}. Te faltan: ${missingFields.join(", ")}.`;

    if (isComplete) {
      whatsappDraft.classList.remove("form-whatsapp--disabled");
      whatsappDraft.setAttribute("aria-disabled", "false");
      whatsappDraft.removeAttribute("tabindex");
    } else {
      whatsappDraft.classList.add("form-whatsapp--disabled");
      whatsappDraft.setAttribute("aria-disabled", "true");
      whatsappDraft.setAttribute("tabindex", "-1");
    }

    return isComplete;
  };

  const initLeadIntentFromHero = () => {
    leadIntentCards.forEach((card) => {
      card.addEventListener("click", (event) => {
        navigateFromIntentAction(card, event);
      });
    });
  };

  const initContactQuickIntents = () => {
    contactQuickIntentButtons.forEach((button) => {
      button.addEventListener("click", () => {
        setActiveLeadIntent(button.dataset.contactIntentQuick || "default");
        const nameInput = form?.querySelector('input[name="nombre"]');
        if (nameInput) {
          nameInput.focus({ preventScroll: true });
        }
      });
    });
  };

  const initIntentActionLinks = () => {
    const intentActionLinks = [...document.querySelectorAll("[data-intent-action]")];
    intentActionLinks.forEach((link) => {
      link.addEventListener("click", (event) => navigateFromIntentAction(link, event));
    });
  };

  syncWhatsAppDraft();
  initIntentActionLinks();
  initLeadIntentFromHero();
  initContactQuickIntents();
  const initialLeadIntent = new URLSearchParams(window.location.search).get("intento") || "default";
  setActiveLeadIntent(initialLeadIntent, { silent: true });
  if (initialLeadIntent === "scheduleFlex") {
    const activeScheduleButton =
      scheduleFilterButtons.find((button) => button.dataset.scheduleFilter === "todos") ||
      scheduleFilterButtons[0];
    if (activeScheduleButton) {
      applyScheduleFilter("todos", activeScheduleButton);
    }
  }

  form.addEventListener("input", syncWhatsAppDraft);
  form.addEventListener("change", syncWhatsAppDraft);
  whatsappDraft.addEventListener("click", (event) => {
    const isReady = updateLeadProgress();
    if (!isReady) {
      event.preventDefault();
      const data = new FormData(form);
      const missingFields = getRequiredMissingFields(data);
      status.textContent = `Completa ${missingFields.length} campo(s) clave para enviar por WhatsApp: ${missingFields.join(", ")}.`;
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      status.textContent = "Completa los campos marcados como obligatorios para enviar una ruta precisa.";
      const missingFields = getRequiredMissingFields(new FormData(form));
      const firstMissing = missingFields[0];
      if (firstMissing) {
        const fieldName = Object.keys(requiredLeadFieldLabels).find(
          (name) => requiredLeadFieldLabels[name] === firstMissing,
        );
        const missingInput = form.querySelector(`[name="${fieldName || firstMissing}"]`);
        if (missingInput) {
          missingInput.focus();
        }
      }
      form.reportValidity();
      return;
    }

    const message = syncWhatsAppDraft();
    status.textContent = "Listo. Abre WhatsApp para enviar tu mensaje y recibir una recomendación más rápida.";
    whatsappDraft.focus();
    whatsappDraft.setAttribute("aria-label", `Enviar a WhatsApp: ${message.split("\n")[0]}`);
  });
}

})();

