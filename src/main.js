/* global window, document */
(function () {
  const data = window.AITUSA_DATA || {};
  const app = document.querySelector("#app");

  if (!app) return;

  const {
    courseCatalog = [],
    conversionCtas = {},
    faqs = [],
    locations = [],
    methodNarrative = {},
    painHero = {},
    placementTest = {},
    productOfferings = [],
    programs = [],
    site = {},
    solutionCharacteristics = [],
    testimonials = [],
  } = data;

  const filters = [
    { label: "Todos", key: "todos" },
    { label: "Inglés", key: "ingles" },
    { label: "Niños", key: "ninos" },
    { label: "Académico", key: "academico" },
    { label: "Tecnología", key: "tecnologia" },
    { label: "Idiomas", key: "idiomas" },
  ];

  const route = getRoute();
  const selectedProgram =
    route.slug ? programs.find((program) => program.slug === route.slug) || null : null;

  renderPage();
  initIcons();
  bindGlobalInteractions();
  updateSeo();

  function renderPage() {
    if (route.page === "placement") {
      app.innerHTML = renderPlacementPage();
      initPlacementTest();
      return;
    }

    if (route.page === "courses") {
      app.innerHTML = renderCoursesPage();
      initCallbackDialog(document);
      initCatalogInteractions(document);
      initLeadForm(document);
      initFaqs(document);
      initCourseRouteState();
      scrollToInitialHash();
      return;
    }

    app.innerHTML = renderHomePage();
    initMethodVideo(document);
    initProofShelf(document);
    initCallbackDialog(document);
    initCatalogInteractions(document);
    initLeadForm(document);
    initFaqs(document);
    initSectionNavigation(document);
    scrollToInitialHash();
  }

  function getRoute() {
    const path = decodeURIComponent(window.location.pathname || "/")
      .replace(/index\.html$/, "")
      .replace(/\/+$/, "") || "/";

    if (path === "/placement-test") {
      return { page: "placement", slug: null };
    }

    const courseMatch = path.match(/^\/(?:courses|cursos)\/([^/]+)$/);
    if (courseMatch) {
      return { page: "courses", slug: courseMatch[1] };
    }

    if (path === "/courses") {
      return { page: "courses", slug: null };
    }

    return { page: "home", slug: null };
  }

  function updateSeo() {
    const titleMap = {
      home: "AiT USA Institute | Aprende inglés con confianza en New Jersey",
      courses: selectedProgram
        ? `${selectedProgram.title} | Cursos AiT USA Institute`
        : "Cursos AiT USA Institute | Catálogo detallado",
      placement: "Examen de ubicación | AiT USA Institute",
    };

    const descriptionMap = {
      home:
        "Aprende inglés con el método Graphic Concept, práctica guiada, clases reales y opciones presenciales, híbridas u online.",
      courses: selectedProgram
        ? `${selectedProgram.title}. ${selectedProgram.summary}`
        : "Explora el catálogo detallado de inglés, GED, computación y programas de apoyo de AiT USA Institute.",
      placement:
        "Completa una evaluación inicial de inglés y recibe una recomendación orientativa antes de confirmar tu nivel con un asesor.",
    };

    const canonicalMap = {
      home: "/",
      courses: selectedProgram ? `/courses/${selectedProgram.slug}/` : "/courses/",
      placement: "/placement-test/",
    };

    document.title = titleMap[route.page] || site.seoTitle || site.name || "AiT USA Institute";
    setMeta("meta[name='description']", descriptionMap[route.page]);
    setMeta("meta[property='og:title']", document.title);
    setMeta("meta[property='og:description']", descriptionMap[route.page]);
    setMeta("meta[name='twitter:title']", document.title);
    setMeta("meta[name='twitter:description']", descriptionMap[route.page]);
    setCanonical(canonicalMap[route.page] || "/");
    setCourseSchema();
  }

  function setMeta(selector, content) {
    const node = document.querySelector(selector);
    if (node && content) {
      node.setAttribute("content", content);
    }
  }

  function setCanonical(path) {
    const canonical = document.querySelector("link[rel='canonical']");
    if (canonical) {
      canonical.setAttribute("href", absoluteUrl(path));
    }
  }

  function setCourseSchema() {
    let schemaNode = document.querySelector("script[data-schema='course']");
    if (!schemaNode) {
      schemaNode = document.createElement("script");
      schemaNode.type = "application/ld+json";
      schemaNode.dataset.schema = "course";
      document.head.appendChild(schemaNode);
    }

    if (!selectedProgram) {
      schemaNode.textContent = "{}";
      return;
    }

    schemaNode.textContent = JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "Course",
        name: selectedProgram.title,
        description: selectedProgram.summary,
        provider: {
          "@type": "EducationalOrganization",
          name: site.name,
          url: absoluteUrl("/"),
        },
        courseMode: selectedProgram.mode,
        educationalCredentialAwarded: "Recomendación académica inicial",
        url: absoluteUrl(`/courses/${selectedProgram.slug}/`),
      },
      null,
      2,
    );
  }

  function renderHomePage() {
    return `
      ${renderHeader("home")}
      <main id="main-content" class="home-page">
        ${renderHero()}
        ${renderSolutionSection()}
        ${renderProofSection()}
        ${renderOfferingPathSection()}
        ${renderLocationsSection()}
        ${renderFaqSection()}
        ${renderFinalCtaSection()}
      </main>
      ${renderFooter()}
    `;
  }

  function renderCoursesPage() {
    return `
      ${renderHeader("courses")}
      <main id="main-content">
        <section class="page-hero section" id="inicio">
          <div class="section-inner page-hero__grid">
            <div class="page-hero__copy">
              <p class="section-kicker">Catálogo detallado</p>
              <h1>Explora cursos, formatos y próximos pasos con más detalle.</h1>
              <p>
                Compara modalidades, objetivos y horarios para inglés, GED, computación
                y programas de apoyo.
              </p>
              <div class="button-row">
                <a class="button button--primary" href="${conversionCtas.placement?.href || "/placement-test/"}">Hacer examen de ubicación</a>
                <a class="button button--ghost" href="${conversionCtas.advisor?.href || site.whatsappHref}" target="_blank" rel="noreferrer">Hablar con un asesor</a>
              </div>
            </div>
            <div class="page-hero__media card">
              <img src="${asset(site.images.routeLevels)}" alt="${escapeHtml(site.images.contactAlt || "Ruta por niveles de AiT USA.")}" />
              <p class="eyebrow-chip">Ruta guiada</p>
              <h2>Inglés presencial sigue siendo la oferta principal.</h2>
              <p>También puedes comparar opciones híbridas, online y programas de apoyo antes de hablar con el equipo.</p>
            </div>
          </div>
        </section>
        ${renderOfferingsSection(false)}
        ${renderCourseCatalogSection()}
        ${renderFinalCtaSection()}
        ${renderFaqSection()}
      </main>
      ${renderFooter()}
    `;
  }

  function renderPlacementPage() {
    return `
      ${renderHeader("placement")}
      <main id="main-content">
        <section class="page-hero section" id="inicio">
          <div class="section-inner placement-hero">
            <div class="page-hero__copy">
              <p class="section-kicker">${escapeHtml(placementTest.eyebrow || "Evaluacion inicial")}</p>
              <h1>${escapeHtml(placementTest.title || "Examen de ubicación")}</h1>
              <p>${escapeHtml(placementTest.intro || "")}</p>
              <div class="notice-box">
                <strong>Importante:</strong>
                <span>${escapeHtml(placementTest.privacyNote || "")}</span>
              </div>
            </div>
          </div>
        </section>

        <section class="section section--white" id="placement-test">
          <div class="section-inner placement-layout">
            <aside class="placement-sidebar card">
              <p class="section-kicker">Pasos</p>
              <ol class="placement-steps" data-placement-steps>
                <li data-step-indicator="0" class="is-active">${escapeHtml(placementTest.steps?.student || "Tus datos")}</li>
                <li data-step-indicator="1">${escapeHtml(placementTest.steps?.selfAssessment || "Como te sientes hoy")}</li>
                <li data-step-indicator="2">${escapeHtml(placementTest.steps?.quiz || "Preguntas rapidas")}</li>
                <li data-step-indicator="3">${escapeHtml(placementTest.steps?.goals || "Tu objetivo")}</li>
                <li data-step-indicator="4">${escapeHtml(placementTest.steps?.result || "Recomendacion inicial")}</li>
              </ol>
              <p class="sidebar-note">${escapeHtml(placementTest.crmNote || "")}</p>
            </aside>

            <form class="placement-form card" data-placement-form novalidate>
              <section class="placement-panel is-active" data-placement-panel="0">
                <h2>Tus datos</h2>
                <div class="form-grid">
                  ${renderPlacementStudentFields()}
                </div>
              </section>

              <section class="placement-panel" data-placement-panel="1" hidden>
                <h2>Como te sientes hoy</h2>
                <div class="assessment-grid">
                  ${renderSelfAssessmentFields()}
                </div>
              </section>

              <section class="placement-panel" data-placement-panel="2" hidden>
                <h2>Preguntas rapidas</h2>
                <div class="quiz-stack">
                  ${renderPlacementQuestions()}
                </div>
              </section>

              <section class="placement-panel" data-placement-panel="3" hidden>
                <h2>Tu objetivo principal</h2>
                ${renderWritingPrompt()}
                <fieldset class="goal-options">
                  <legend>Selecciona el motivo principal por el que quieres estudiar ahora.</legend>
                  ${renderGoalOptions()}
                </fieldset>
              </section>

              <section class="placement-panel placement-panel--result" data-placement-panel="4" hidden>
                <h2>Tu recomendación inicial</h2>
                <div class="result-card" data-placement-result>
                  <p>Completa los pasos anteriores para ver tu recomendación.</p>
                </div>
                <div class="result-actions" data-placement-actions hidden>
                  <a class="button button--primary" data-placement-whatsapp target="_blank" rel="noreferrer">Enviar resultado por WhatsApp</a>
                  <a class="button button--ghost" href="/courses/">Ver cursos detallados</a>
                </div>
                <p class="placement-footnote">
                  Esta recomendación es orientativa y debe ser confirmada por un asesor antes de tu inscripción final.
                </p>
              </section>

              <div class="placement-nav">
                <button class="button button--ghost" type="button" data-placement-back hidden>Atras</button>
                <button class="button button--primary" type="button" data-placement-next>Siguiente</button>
              </div>
            </form>
          </div>
        </section>
      </main>
      ${renderFooter()}
    `;
  }

  function renderHeader(activePage) {
    const sectionLinkAttribute = (sectionId) =>
      activePage === "home" ? `data-nav-section="${sectionId}"` : "";

    return `
      <a class="skip-link" href="#main-content">Saltar al contenido</a>
      <header class="site-header">
        <a class="brand" href="/" aria-label="AIT USA Institute, inicio">
          <img src="${asset(site.images.logo)}" alt="Logo de AiT USA Institute" />
          <span>
            <strong>AIT USA</strong>
            <small>INSTITUTE</small>
          </span>
        </a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Abrir menú">
          <i class="menu-toggle__open" data-lucide="menu" aria-hidden="true"></i>
          <i class="menu-toggle__close" data-lucide="x" aria-hidden="true"></i>
        </button>
        <nav class="site-nav" id="site-nav" aria-label="Navegación principal">
          <a href="${activePage === "home" ? "#inicio" : "/"}" ${sectionLinkAttribute("inicio")} ${activePage === "home" ? 'aria-current="location"' : ""}>Inicio</a>
          <a href="${homeLink("#metodo")}" ${sectionLinkAttribute("metodo")}>Método</a>
          <a href="${homeLink("#experiencia")}" ${sectionLinkAttribute("experiencia")}>Experiencias</a>
          <a href="${homeLink("#cursos")}" ${sectionLinkAttribute("cursos")}>Cursos</a>
          <a href="${homeLink("#sedes")}" ${sectionLinkAttribute("sedes")}>Sedes</a>
          <a href="${homeLink("#contacto")}" ${sectionLinkAttribute("contacto")}>Contacto</a>
        </nav>
        <a class="header-cta" href="${site.phoneHref}">
          <i data-lucide="phone" aria-hidden="true"></i>
          Llámanos
        </a>
      </header>
    `;
  }

  function renderHero() {
    return `
      <section class="hero" id="inicio">
        <div class="hero__main">
          <div class="hero__copy">
            <div class="hero__title-block">
              <p class="hero__kicker">${escapeHtml(painHero.eyebrow || "")}</p>
              <h1>
                <span class="hero__headline-lead">${escapeHtml(painHero.headlineLead || "")}</span>
                <span class="hero__headline-emphasis">${escapeHtml(painHero.headlineEmphasis || painHero.headline || "")}</span>
              </h1>
              ${painHero.headlineAccent
                ? `<p class="hero__headline-accent">${escapeHtml(painHero.headlineAccent)}</p>`
                : ""}
            </div>
            <p class="hero__summary">
              ${(painHero.subheadlineLines || [painHero.subheadline || ""])
                .map((line) => `<span>${escapeHtml(line)}</span>`)
                .join("")}
            </p>
            ${(painHero.objections || []).length
              ? `
                <ul class="hero__objections" aria-label="Preguntas comunes al aprender inglés">
                  ${painHero.objections
                    .map(
                      (item) => `
                        <li>
                          <p>${escapeHtml(item)}</p>
                        </li>
                      `,
                    )
                    .join("")}
                </ul>
              `
              : ""}
            <div class="hero__conversion">
              <div class="button-row hero__actions">
                <a class="button button--primary" href="${conversionCtas.placement?.href || "/placement-test/"}">
                  ${escapeHtml(painHero.ctas?.primary || "Conoce tu nivel")}
                  <i data-lucide="arrow-right" aria-hidden="true"></i>
                </a>
                <a class="button button--ghost" href="#metodo">
                  <i data-lucide="circle-play" aria-hidden="true"></i>
                  ${escapeHtml(painHero.ctas?.secondary || "Explora el método")}
                </a>
              </div>
            </div>
            <nav class="hero__modalities" aria-label="Formatos de clase">
              <a href="/courses/#ingles-presencial">
                <i data-lucide="users-round" aria-hidden="true"></i>
                <span>Presencial</span>
              </a>
              <a href="/courses/#ingles-online">
                <i data-lucide="laptop" aria-hidden="true"></i>
                <span>Online</span>
              </a>
              <a href="/courses/#ingles-hibrido">
                <i data-lucide="monitor-smartphone" aria-hidden="true"></i>
                <span>Híbrido</span>
              </a>
            </nav>
          </div>
          <figure class="hero__visual">
            <img
              src="${asset(site.images.approvedHero)}"
              alt="Asesora de AIT USA orientando a una estudiante adulta en un salón de inglés."
              width="1536"
              height="1024"
              fetchpriority="high"
            />
          </figure>
        </div>
      </section>
    `;
  }

  function renderSolutionSection() {
    return `
      <section class="method-section" id="metodo" aria-labelledby="method-title">
        <div class="method-editorial">
          <header class="method-editorial__intro">
            <p class="method-kicker">${escapeHtml(methodNarrative.eyebrow || "Método Graphic Concept")}</p>
            <h2 id="method-title">${escapeHtml(methodNarrative.heading || "")}</h2>
            <p>${escapeHtml(methodNarrative.introduction || "")}</p>
          </header>
          <figure class="method-editorial__media">
            <div class="method-video-frame">
              <video
                class="method-editorial__video"
                controls
                preload="metadata"
                width="${methodNarrative.videoWidth || 464}"
                height="${methodNarrative.videoHeight || 832}"
                poster="${asset(methodNarrative.videoPoster)}"
                aria-label="${escapeHtml(methodNarrative.videoAriaLabel || "Conoce el método completo")}"
                data-method-video
              >
                <source src="${asset(methodNarrative.video)}" type="video/mp4" />
              </video>
            </div>
            <figcaption>
              <i data-lucide="circle-play" aria-hidden="true"></i>
              <span>${escapeHtml(methodNarrative.videoLabel || "Conoce el método completo · 1:45")}</span>
            </figcaption>
          </figure>
          <ul class="method-reasons" aria-label="Resumen del método en tres razones">
            ${solutionCharacteristics
              .map(
                (item) => `
                  <li>
                    <span class="method-reason__icon" aria-hidden="true">
                      <i data-lucide="${escapeHtml(item.icon || "circle-check")}"></i>
                    </span>
                    <div>
                      <h3>${escapeHtml(item.title)}</h3>
                      <p>${escapeHtml(item.body)}</p>
                    </div>
                  </li>
                `,
              )
              .join("")}
          </ul>
        </div>
      </section>
    `;
  }

  function initMethodVideo(scope) {
    const video = scope.querySelector("[data-method-video]");
    if (!video) return;

    const mobileViewport = window.matchMedia("(max-width: 719px)");
    const enterMobileFullscreen = () => {
      if (!mobileViewport.matches) return;
      if (document.fullscreenElement === video || video.webkitDisplayingFullscreen) return;

      if (typeof video.webkitEnterFullscreen === "function") {
        try {
          video.webkitEnterFullscreen();
        } catch {
          // iOS will still use native fullscreen because playsinline is intentionally omitted.
        }
        return;
      }

      if (typeof video.requestFullscreen === "function") {
        const request = video.requestFullscreen();
        request?.catch?.(() => {});
      }
    };

    video.addEventListener("play", enterMobileFullscreen);
  }

  function renderOfferingPathSection() {
    return `
      <section class="section section--soft" id="cursos">
        <div class="section-inner offer-path">
          <div class="section-heading section-heading--framed">
            <p class="section-kicker">Presencial, híbrido u online</p>
            <h2>¿Cómo quieres estudiar?</h2>
            <p>Compara las clases presenciales, híbridas y online. Si buscas otra meta, también puedes explorar nuestros programas de apoyo.</p>
          </div>
          <div class="offer-map" aria-label="Opciones principales de estudio">
            ${productOfferings
              .slice(0, 3)
              .map(
                (item) => `
                  <article class="offer-node offer-node--${escapeHtml(item.emphasis || "secondary")}">
                    <span class="offer-node__marker" aria-hidden="true">${escapeHtml(item.marker || item.shortLabel || "")}</span>
                    <div>
                      <h3>${escapeHtml(item.title)}</h3>
                      <p>${escapeHtml(item.summary)}</p>
                    </div>
                    <a class="offer-node__link" href="${escapeHtml(item.href)}">
                      ${escapeHtml(item.cta)}
                      <i data-lucide="arrow-right" aria-hidden="true"></i>
                    </a>
                  </article>
                `,
              )
              .join("")}
          </div>
          <p class="catalog-note">También ofrecemos inglés para niños, GED, computación, español para extranjeros y programas de apoyo.</p>
        </div>
      </section>
    `;
  }

  function renderOfferingsSection(includeCatalogPreview) {
    return `
      <section class="section section--soft" id="cursos">
        <div class="section-inner">
          <div class="section-heading">
            <p class="section-kicker">Por dónde empezar</p>
            <h2>Empieza por inglés presencial o compara otras modalidades.</h2>
            <p>Revisa cursos, horarios y requisitos antes de elegir tu ruta.</p>
          </div>
          <div class="offering-grid">
            ${productOfferings.map(renderOfferingCard).join("")}
          </div>
          <div class="catalog-links">
            <a class="button button--primary" href="/courses/">Ver cursos detallados</a>
            <a class="button button--ghost" href="/placement-test/">Hacer examen de ubicación</a>
          </div>
        </div>
        ${includeCatalogPreview ? renderCatalogPreview() : ""}
      </section>
    `;
  }

  function renderCatalogPreview() {
    return `
      <div class="section-inner catalog-preview">
        <div class="section-heading compact">
          <p class="section-kicker">Vista rápida del catálogo</p>
          <h2>Explora por objetivo antes de entrar al detalle.</h2>
        </div>
        ${renderFilterBar()}
        <p class="course-count" data-course-count>Mostrando ${programs.length} programas.</p>
        <div class="program-grid">
          ${programs.map((program) => renderProgramCard(program, false)).join("")}
        </div>
        <div class="course-detail-stack">
          ${programs.map((program) => renderCourseDetail(program, selectedProgram?.slug === program.slug)).join("")}
        </div>
      </div>
    `;
  }

  function renderLocationsSection() {
    const publishedLocations = locations.filter((location) => location.status !== "pending");
    const mappedLocations = publishedLocations.filter((location) => location.status !== "online");
    const onlineLocation = publishedLocations.find((location) => location.status === "online");
    const mainCampusHours = publishedLocations.find((location) => location.status === "active")?.hours || [];

    return `
      <section class="section section--white" id="sedes">
        <div class="section-inner">
          <div class="section-heading section-heading--framed">
            <p class="section-kicker">Sedes</p>
            <h2 id="sedes-title">Sedes cerca de ti.</h2>
            <p>Revisa ubicaciones y horarios para elegir la alternativa más conveniente.</p>
          </div>
          <div class="location-explorer">
            <div class="real-map-card">
              <div class="real-map-card__frame">
                <img
                  class="real-map-card__image"
                  src="/public/assets/maps/new-jersey-campus-map.jpg"
                  alt="Mapa real del centro de Nueva Jersey con Bound Brook, Plainfield, Piscataway y Flemington."
                  width="874"
                  height="660"
                  loading="eager"
                  decoding="async"
                />
                <div class="real-map-card__pins" aria-label="Sedes marcadas en el mapa">
                  ${mappedLocations.map(renderRealMapPin).join("")}
                </div>
                <a
                  class="real-map-card__attribution"
                  href="https://www.openstreetmap.org/copyright"
                  target="_blank"
                  rel="noreferrer"
                >
                  © OpenStreetMap
                </a>
                <a
                  class="real-map-card__expand"
                  href="https://www.openstreetmap.org/#map=11/40.57/-74.61"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Ampliar mapa en OpenStreetMap"
                >
                  <i data-lucide="external-link" aria-hidden="true"></i>
                </a>
              </div>
            </div>
            <div class="location-compact-panel">
              <div class="location-compact-list" aria-label="Sedes presenciales en Nueva Jersey">
                ${mappedLocations.map(renderCompactLocationRow).join("")}
                ${onlineLocation ? renderCompactLocationRow(onlineLocation, mappedLocations.length) : ""}
              </div>
              <div class="location-hours-panel">
                <div class="location-hours-panel__heading">
                  <span class="location-hours-panel__icon"><i data-lucide="clock-3" aria-hidden="true"></i></span>
                  <div>
                    <p class="eyebrow-chip">Horarios publicados</p>
                    <h3>Bound Brook · Plainfield · Piscataway</h3>
                  </div>
                </div>
                <ul>
                  ${mainCampusHours.map((hour) => `<li>${escapeHtml(hour)}</li>`).join("")}
                </ul>
                <p class="location-hours-panel__note">Los cupos pueden variar. Confirma tu turno antes de inscribirte.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function renderProofSection() {
    const shortLabels = {
      Jessica: "Jessica",
      "Testimonio internacional": "Experiencia internacional",
      Eric: "Eric",
      Leila: "Leila",
    };
    const orderedTestimonials = [
      testimonials.find((item) => item.name === "Jessica"),
      ...testimonials.filter((item) => item.name !== "Jessica"),
    ].filter(Boolean);
    const fillsDesktopRow = orderedTestimonials.length === 3;

    return `
      <section
        class="section proof-editorial${fillsDesktopRow ? " proof-editorial--complete-row" : ""}"
        id="experiencia"
        data-proof-shelf
      >
        <div class="proof-shelf__inner">
          <div class="proof-shelf__heading">
            <div>
              <p class="section-kicker">Experiencias reales</p>
              <h2>Historias de estudiantes AIT.</h2>
              <p>Conoce las clases, la práctica y el acompañamiento desde la voz de quienes ya viven la experiencia.</p>
            </div>

            <div class="proof-shelf__controls" aria-label="Navegar historias">
              <span>${orderedTestimonials.length} historias</span>
              <button type="button" data-proof-rail-prev aria-label="Ver historias anteriores">
                <i data-lucide="arrow-left" aria-hidden="true"></i>
              </button>
              <button type="button" data-proof-rail-next aria-label="Ver más historias">
                <i data-lucide="arrow-right" aria-hidden="true"></i>
              </button>
            </div>
          </div>

          <div class="proof-shelf__rail" role="list" aria-label="Historias de estudiantes en video" data-proof-rail>
            ${orderedTestimonials.map((item, index) => `
              <a
                class="proof-story"
                href="${asset(item.video)}"
                role="listitem"
                aria-haspopup="dialog"
                data-proof-story
                data-proof-index="${index}"
                data-proof-video="${asset(item.video)}"
                data-proof-poster="${asset(item.videoPoster || item.image)}"
                data-proof-name="${escapeHtml(shortLabels[item.name] || item.name)}"
                data-proof-headline="${escapeHtml(item.headline || item.text)}"
                data-proof-meta="${escapeHtml(item.result)} · ${escapeHtml(item.duration || "")}"
                data-proof-width="${item.videoWidth || 16}"
                data-proof-height="${item.videoHeight || 9}"
              >
                <img
                  src="${asset(item.videoPoster || item.image)}"
                  alt="${escapeHtml(item.imageAlt || "")}"
                  loading="${index < 3 ? "eager" : "lazy"}"
                />
                <span class="proof-story__shade" aria-hidden="true"></span>
                <span class="proof-story__duration">${escapeHtml(item.duration || "")}</span>
                <span class="proof-story__play" aria-hidden="true">
                  <i data-lucide="play"></i>
                </span>
                <span class="proof-story__copy">
                  <small>${escapeHtml(item.result)}</small>
                  <strong>${escapeHtml(shortLabels[item.name] || item.name)}</strong>
                  <span>${escapeHtml(item.headline || item.text)}</span>
                </span>
              </a>
            `).join("")}
          </div>

          <p class="proof-shelf__hint">
            <i data-lucide="move-horizontal" aria-hidden="true"></i>
            <span>Desliza para conocer más historias.</span>
          </p>

          <dialog class="proof-dialog" aria-labelledby="proof-dialog-title" data-proof-dialog>
            <div class="proof-dialog__shell">
              <button class="proof-dialog__close" type="button" data-proof-dialog-close aria-label="Cerrar historia">
                <i data-lucide="x" aria-hidden="true"></i>
              </button>

              <div class="proof-dialog__media">
                <div class="proof-dialog__video-frame" data-proof-dialog-video-frame>
                  <video controls playsinline preload="metadata" data-proof-dialog-video></video>
                </div>
              </div>

              <div class="proof-dialog__footer">
                <div class="proof-dialog__copy">
                  <span data-proof-dialog-meta></span>
                  <h3 id="proof-dialog-title" data-proof-dialog-title></h3>
                  <p data-proof-dialog-headline></p>
                </div>

                <div class="proof-dialog__nav" aria-label="Cambiar historia">
                  <button type="button" data-proof-dialog-prev>
                    <i data-lucide="arrow-left" aria-hidden="true"></i>
                    <span>Anterior</span>
                  </button>
                  <button type="button" data-proof-dialog-next>
                    <span>Siguiente</span>
                    <i data-lucide="arrow-right" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            </div>
          </dialog>
        </div>
      </section>
    `;
  }

  function renderFinalCtaSection() {
    return `
      <section class="section final-cta-section" id="contacto" aria-labelledby="contacto-title">
        <div class="section-inner final-cta-layout">
          <div class="final-cta-copy">
            <div class="section-heading section-heading--framed">
              <p class="section-kicker">Empieza aquí</p>
              <h2 id="contacto-title">¿Listo para empezar?</h2>
              <p>Haz el examen de ubicación y te ayudamos a elegir tu nivel, horario y modalidad. La orientación inicial es gratuita.</p>
            </div>
            <div class="final-cta-conversion">
              <div class="final-cta-actions">
                <a class="button button--primary" href="${conversionCtas.placement?.href || "/placement-test/"}">
                  Encuentra tu nivel
                  <i data-lucide="arrow-right" aria-hidden="true"></i>
                </a>
              </div>
              <div class="final-cta-contact-row" aria-label="Otra forma de contactarnos">
                <button
                  class="final-cta-contact-link"
                  type="button"
                  aria-haspopup="dialog"
                  aria-controls="callback-dialog"
                  data-callback-dialog-open
                >
                  <i data-lucide="phone-call" aria-hidden="true"></i>
                  <span>Solicitar llamada</span>
                </button>
              </div>
            </div>
          </div>

          <dialog
            class="callback-dialog"
            id="callback-dialog"
            aria-labelledby="callback-dialog-title"
            data-callback-dialog
          >
            <div class="callback-dialog__shell">
              <header class="callback-dialog__header">
                <div>
                  <p class="section-kicker">Una alternativa simple</p>
                  <h3 id="callback-dialog-title">Solicita una llamada</h3>
                </div>
                <button
                  class="callback-dialog__close"
                  type="button"
                  aria-label="Cerrar solicitud de llamada"
                  data-callback-dialog-close
                >
                  <i data-lucide="x" aria-hidden="true"></i>
                </button>
              </header>

              <div class="callback-dialog__content">
                <p>Déjanos lo esencial para coordinar una llamada. Te preguntaremos el resto cuando hablemos.</p>
              <form class="lead-form" data-lead-form>
              <div class="form-grid callback-form-grid">
                <label>
                  Nombre
                  <input name="nombre" type="text" autocomplete="name" required />
                </label>
                <label>
                  Teléfono
                  <input name="telefono" type="tel" inputmode="tel" autocomplete="tel" />
                </label>
                <label>
                  Email
                  <input name="email" type="email" autocomplete="email" />
                  <small>Escribe un teléfono o un email.</small>
                </label>
                <label>
                  Sede o modalidad preferida
                  <select name="ubicacion" required>
                    <option value="">Selecciona una opción</option>
                    <option value="Bound Brook">Bound Brook</option>
                    <option value="Plainfield">Plainfield</option>
                    <option value="Piscataway">Piscataway</option>
                    <option value="Flemington">Flemington con cita previa</option>
                    <option value="Online">Online</option>
                    <option value="No estoy seguro">No estoy seguro</option>
                  </select>
                </label>
                <label>
                  Mejor momento para llamarte
                  <select name="mejorHorario" required>
                    <option value="">Selecciona una opción</option>
                    <option value="Mañana">Mañana</option>
                    <option value="Tarde">Tarde</option>
                    <option value="Noche">Noche</option>
                    <option value="Fin de semana">Fin de semana</option>
                    <option value="Prefiero coordinar">Prefiero coordinar</option>
                  </select>
                </label>
              </div>
              <label class="form-honeypot" aria-hidden="true">
                Sitio web de empresa
                <input name="companyWebsite" type="text" tabindex="-1" autocomplete="off" />
              </label>
              <label class="callback-consent">
                <input name="contactPermission" type="checkbox" value="yes" required />
                <span>${escapeHtml(site.smsConsent?.contactPermission || "Autorizo a AIT USA Institute a responder esta solicitud.")}</span>
              </label>
              <p class="callback-privacy">
                Consulta nuestra <a href="${escapeHtml(site.legalLinks?.privacy || "/privacy-policy")}">Política de Privacidad</a>.
              </p>
              <button class="button button--primary" type="submit" data-lead-submit>Solicitar llamada</button>
              <p class="form-status" data-form-status aria-live="polite"></p>
              </form>
              </div>
            </div>
          </dialog>
        </div>
      </section>
    `;
  }

  function renderCourseTeaserSection() {
    return `
      <section class="course-teaser" aria-labelledby="catalogo-mini-title">
        <div class="section-inner course-teaser__inner">
          <div>
            <p class="section-kicker">Catálogo completo</p>
            <h2 id="catalogo-mini-title">Ver todos los cursos.</h2>
          </div>
          <div class="course-teaser__copy">
            <p>Revisa modalidades, horarios y requisitos de cada programa antes de elegir.</p>
          </div>
          <a class="button button--ghost" href="/courses/">Ver cursos</a>
        </div>
      </section>
    `;
  }

  function renderCourseCatalogSection() {
    return `
      <section class="section section--soft" id="catalogo-detallado">
        <div class="section-inner">
          <div class="section-heading">
            <p class="section-kicker">Catálogo completo</p>
            <h2>Compara formatos, horarios y objetivos antes de elegir.</h2>
            <p>Revisa cada programa con calma o comparte la ficha con un asesor para resolver tus dudas.</p>
          </div>
          ${renderFilterBar()}
          <p class="course-count" data-course-count>Mostrando ${programs.length} programas.</p>
          ${courseCatalog
            .map(
              (group) => `
                <section class="catalog-group" id="${escapeHtml(group.anchor)}">
                  <div class="catalog-group__heading">
                    <h3>${escapeHtml(group.title)}</h3>
                    <p>${escapeHtml(group.description)}</p>
                  </div>
                  <div class="program-grid">
                    ${group.programs
                      .map((slug) => programs.find((program) => program.slug === slug))
                      .filter(Boolean)
                      .map((program) => renderProgramCard(program, true))
                      .join("")}
                  </div>
                </section>
              `,
            )
            .join("")}
          <div class="course-detail-stack">
            ${programs.map((program) => renderCourseDetail(program, selectedProgram?.slug === program.slug)).join("")}
          </div>
        </div>
      </section>
    `;
  }

  function renderFaqSection() {
    return `
      <section class="section faq-section">
        <div class="section-inner faq-layout">
          <div class="section-heading section-heading--framed">
            <p class="section-kicker">Preguntas frecuentes</p>
            <h2>¿Todavía tienes dudas?</h2>
            <p>Aquí respondemos las preguntas que más escuchamos de nuestros estudiantes.</p>
          </div>
          <div class="faq-list">
            ${faqs
              .slice(0, 6)
              .map(
                (faq) => `
                  <details>
                    <summary><span>${escapeHtml(faq.question)}</span></summary>
                    <p>${escapeHtml(faq.answer)}</p>
                    <p class="proof-line">${escapeHtml(faq.outcome || "")}</p>
                  </details>
                `,
              )
              .join("")}
          </div>
        </div>
      </section>
    `;
  }

  function renderFooter() {
    const currentYear = new Date().getFullYear();

    return `
      <footer class="site-footer">
        <div class="section-inner site-footer__compact">
          <div class="site-footer__link-rows">
            <div class="site-footer__group">
              <p class="site-footer__group-label" id="footer-contact-label">Contacto</p>
              <div class="site-footer__contact" aria-labelledby="footer-contact-label">
                <a href="${site.phoneHref}" aria-label="Llamar a ${escapeHtml(site.phone)}">
                  <i data-lucide="phone" aria-hidden="true"></i>
                  Llamar
                </a>
                <a href="${site.whatsappHref}" target="_blank" rel="noreferrer">
                  <i data-lucide="message-circle" aria-hidden="true"></i>
                  WhatsApp
                </a>
                <a href="${site.emailHref}">
                  <i data-lucide="mail" aria-hidden="true"></i>
                  Email
                </a>
              </div>
            </div>

            <div class="site-footer__group">
              <p class="site-footer__group-label" id="footer-nav-label">Explora</p>
              <nav class="site-footer__nav" aria-labelledby="footer-nav-label">
                <a href="/courses/">
                  <span>Cursos</span>
                  <i data-lucide="arrow-right" aria-hidden="true"></i>
                </a>
                <a href="/placement-test/">
                  <span>Examen de nivel</span>
                  <i data-lucide="arrow-right" aria-hidden="true"></i>
                </a>
                <a href="${escapeHtml(site.legalLinks?.contact || "/contactanos")}">
                  <span>Contacto</span>
                  <i data-lucide="arrow-right" aria-hidden="true"></i>
                </a>
              </nav>
            </div>
          </div>

          <div class="site-footer__legal">
            <span class="site-footer__identity"><strong>AIT USA</strong> · © ${currentYear} ${escapeHtml(site.legal || "Arrieta Institute LLC")}</span>
            <div class="site-footer__legal-links">
              <a href="${escapeHtml(site.legalLinks?.privacy || "/privacy-policy")}">Privacidad</a>
              <a href="${escapeHtml(site.legalLinks?.terms || "/terms-and-conditions")}">Términos</a>
            </div>
          </div>
        </div>
      </footer>
    `;
  }

  function renderOfferingCard(item) {
    return `
      <article
        class="offering-card card offering-card--${escapeHtml(item.emphasis || "secondary")}"
        id="${escapeHtml(item.anchor || item.key)}"
      >
        <img src="${asset(item.image)}" alt="${escapeHtml(item.imageAlt)}" />
        <div class="offering-card__body">
          <p class="eyebrow-chip">${escapeHtml(item.badge || "")}</p>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.summary)}</p>
          <ul>
            ${item.details.map((detail) => `<li>${escapeHtml(detail)}</li>`).join("")}
          </ul>
          <a class="button ${item.emphasis === "primary" ? "button--primary" : "button--ghost"}" href="${item.href}">${escapeHtml(item.cta)}</a>
        </div>
      </article>
    `;
  }

  function renderProgramCard(program, directRouteLink) {
    const href = directRouteLink ? `/courses/${program.slug}/` : `#detalle-${program.slug}`;
    const buttonLabel = directRouteLink ? "Abrir ficha completa" : "Ver resumen rápido";

    return `
      <article class="program-card" data-category="${escapeHtml(program.category)}">
        <img src="${asset(program.image)}" alt="${escapeHtml(program.imageAlt)}" />
        <div class="program-card__body">
          <p class="eyebrow-chip">${escapeHtml(program.mode)}</p>
          <h3>${escapeHtml(program.title)}</h3>
          <p>${escapeHtml(program.summary)}</p>
          <dl class="program-meta">
            <div><dt>Ideal para</dt><dd>${escapeHtml(program.bestFor)}</dd></div>
            <div><dt>Audiencia</dt><dd>${escapeHtml(program.audience)}</dd></div>
          </dl>
          <div class="button-row">
            <a class="button button--primary" href="${href}" data-course-detail-link="${escapeHtml(program.slug)}">${buttonLabel}</a>
            <a class="button button--ghost" href="/placement-test/">Ver mi nivel</a>
          </div>
        </div>
      </article>
    `;
  }

  function renderCourseDetail(program, isOpen) {
    const sections = program.courseDetail?.sections || [];
    const schedule = program.courseDetail?.schedule || [];
    return `
      <details class="course-detail" id="detalle-${program.slug}" data-course-detail="${escapeHtml(program.slug)}" ${isOpen ? "open" : ""}>
        <summary>
          <span>${escapeHtml(program.title)}</span>
          <span>${escapeHtml(program.mode)}</span>
        </summary>
        <div class="course-detail__content">
          <p>${escapeHtml(program.courseDetail?.lead || program.summary)}</p>
          <div class="course-detail__grid">
            ${sections
              .map(
                (section) => `
                  <section>
                    <h4>${escapeHtml(section.title)}</h4>
                    <ul>
                      ${section.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
                    </ul>
                  </section>
                `,
              )
              .join("")}
            <section>
              <h4>Horarios y formato</h4>
              <ul>
                ${schedule.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
              </ul>
            </section>
          </div>
          <p class="course-note">${escapeHtml(program.courseDetail?.note || "")}</p>
          <div class="button-row">
            <a class="button button--primary" href="/placement-test/">Hacer examen de ubicación</a>
            <a class="button button--ghost" href="${site.whatsappHref}" target="_blank" rel="noreferrer">Confirmar con un asesor</a>
          </div>
        </div>
      </details>
    `;
  }

  function renderRealMapPin(location, index) {
    const locationId = location.mapKey || `location-${index + 1}`;

    return `
      <a
        class="real-map-pin real-map-pin--${escapeHtml(locationId)}"
        href="#sede-${escapeHtml(locationId)}"
        aria-label="Ver ${escapeHtml(location.city)}"
      >
        <i data-lucide="map-pin" aria-hidden="true"></i>
        <strong>${String(index + 1).padStart(2, "0")}</strong>
      </a>
    `;
  }

  function renderCompactLocationRow(location, index) {
    const statusLabel = {
      active: location.note?.includes("principal") ? "Principal" : "Presencial",
      limited: "Con cita",
      online: "Online",
      pending: "Pendiente / no activa",
    };
    const isLimited = location.status === "limited";
    const isOnline = location.status === "online";
    const locationId = location.mapKey || "online";
    const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`;
    const actionHref = isLimited
      ? `${site.whatsappHref}?text=${encodeURIComponent(`Hola AIT USA, quiero consultar la atención con cita previa en ${location.city}.`)}`
      : isOnline
        ? "/courses/#ingles-online"
        : mapsHref;
    const actionTarget = isLimited || !isOnline ? 'target="_blank" rel="noreferrer"' : "";
    const shortCity = isOnline ? "Clases online" : location.city.split(",")[0];
    const supportingText = isLimited
      ? "Atención disponible con coordinación previa"
      : isOnline
        ? "Disponible según nivel y zona horaria"
        : location.address;
    const actionLabel = isLimited ? "Consultar" : isOnline ? "Ver online" : "Cómo llegar";

    return `
      <a
        class="compact-location-row compact-location-row--${escapeHtml(location.status || "active")}"
        id="sede-${escapeHtml(locationId)}"
        href="${escapeHtml(actionHref)}"
        ${actionTarget}
      >
        <span class="compact-location-row__number" aria-hidden="true">
          ${isOnline ? '<i data-lucide="monitor"></i>' : String(index + 1).padStart(2, "0")}
        </span>
        <span class="compact-location-row__copy">
          <span>
            <strong>${escapeHtml(shortCity)}</strong>
            <em>${escapeHtml(statusLabel[location.status] || "Sede")}</em>
          </span>
          <small>${escapeHtml(supportingText)}</small>
        </span>
        <span class="compact-location-row__action">
          ${escapeHtml(actionLabel)}
          <i data-lucide="${isOnline ? "arrow-right" : "navigation"}" aria-hidden="true"></i>
        </span>
      </a>
    `;
  }

  function renderPendingLocationNote() {
    const pending = locations.find((location) => location.status === "pending");
    if (!pending) return "";

    return `
      <aside class="pending-location-note">
        <p class="section-kicker">Sede en revisión</p>
        <h3>${escapeHtml(pending.city)}</h3>
        <p>Esta ubicación requiere confirmación previa de disponibilidad antes de presentarla como sede activa.</p>
      </aside>
    `;
  }

  function renderCtaBox(title, body, href, label, external, number, tone = "secondary") {
    return `
      <article class="cta-box cta-box--${escapeHtml(tone)} card">
        ${number ? `<span class="cta-box__number">${escapeHtml(number)}</span>` : ""}
        <div>
          <h3>${escapeHtml(title || "")}</h3>
          <p>${escapeHtml(body || "")}</p>
        </div>
        <a class="button button--primary" href="${href || "#"}" ${external ? 'target="_blank" rel="noreferrer"' : ""}>${escapeHtml(label || "Continuar")}</a>
      </article>
    `;
  }

  function renderFilterBar() {
    return `
      <div class="filter-bar" role="group" aria-label="Filtrar cursos">
        ${filters
          .map(
            (filter, index) => `
              <button
                class="filter-chip${index === 0 ? " is-active" : ""}"
                type="button"
                data-filter="${escapeHtml(filter.key)}"
                aria-pressed="${index === 0 ? "true" : "false"}"
              >
                ${escapeHtml(filter.label)}
              </button>
            `,
          )
          .join("")}
      </div>
    `;
  }

  function renderPlacementStudentFields() {
    return (placementTest.studentFields || [])
      .map((field) => {
        if (field.type === "select") {
          return `
            <label>
              ${escapeHtml(field.label)}
              <select name="${escapeHtml(field.name)}" ${field.required ? "required" : ""}>
              <option value="">Selecciona una opción</option>
                ${field.options.map((option) => `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`).join("")}
              </select>
            </label>
          `;
        }

        return `
          <label>
            ${escapeHtml(field.label)}
            <input name="${escapeHtml(field.name)}" type="${escapeHtml(field.type)}" ${field.required ? "required" : ""} />
            ${field.help ? `<small>${escapeHtml(field.help)}</small>` : ""}
          </label>
        `;
      })
      .join("");
  }

  function renderSelfAssessmentFields() {
    return (placementTest.selfAssessments || [])
      .map(
        (group) => `
          <fieldset class="assessment-card">
            <legend>${escapeHtml(group.label)}</legend>
            ${group.options
              .map(
                (option, index) => `
                  <label>
                    <input type="radio" name="${escapeHtml(group.key)}" value="${index}" ${index === 0 ? "required" : ""} />
                    <span>${escapeHtml(option)}</span>
                  </label>
                `,
              )
              .join("")}
          </fieldset>
        `,
      )
      .join("");
  }

  function renderPlacementQuestions() {
    let questionIndex = 0;
    return (placementTest.questions || [])
      .map((level) => {
        const items = (level.items || [])
          .map((question) => {
            const currentIndex = questionIndex;
            questionIndex += 1;
            return `
              <fieldset class="quiz-card">
                <legend>${escapeHtml(question.prompt)}</legend>
                ${question.options
                  .map((option, index) => {
                    const score = option === question.answer ? 1 : 0;
                    return `
                      <label>
                        <input type="radio" name="question-${currentIndex}" value="${score}" ${index === 0 ? "required" : ""} />
                        <span>${escapeHtml(option)}</span>
                      </label>
                    `;
                  })
                  .join("")}
              </fieldset>
            `;
          })
          .join("");

        return `
          <section class="quiz-level">
            <div class="quiz-level__heading">
              <h3>${escapeHtml(level.level)}</h3>
              <span>${(level.items || []).length} preguntas</span>
            </div>
            <div class="quiz-level__items">
              ${items}
            </div>
          </section>
        `;
      })
      .join("");
  }

  function renderWritingPrompt() {
    const prompt = placementTest.writingPrompt;
    if (!prompt) return "";

    return `
      <label class="writing-prompt">
        <span>
          <strong>${escapeHtml(prompt.title)}</strong>
          ${escapeHtml(prompt.prompt)}
        </span>
        <textarea name="writingSample" rows="5" placeholder="Escribe aquí tu respuesta breve."></textarea>
        <small>${escapeHtml(prompt.note || "")}</small>
      </label>
    `;
  }

  function renderGoalOptions() {
    return (placementTest.goals || [])
      .map(
        (goal, index) => `
          <label class="goal-option">
            <input type="radio" name="goal" value="${escapeHtml(goal)}" ${index === 0 ? "required" : ""} />
            <span>${escapeHtml(goal)}</span>
          </label>
        `,
      )
      .join("");
  }

  function bindGlobalInteractions() {
    const menuButton = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".site-nav");

    if (menuButton && nav) {
      menuButton.addEventListener("click", () => {
        const open = nav.classList.toggle("is-open");
        menuButton.setAttribute("aria-expanded", String(open));
        menuButton.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      });

      nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          nav.classList.remove("is-open");
          menuButton.setAttribute("aria-expanded", "false");
          menuButton.setAttribute("aria-label", "Abrir menú");
        });
      });

      document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape" || !nav.classList.contains("is-open")) return;
        nav.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Abrir menú");
        menuButton.focus();
      });
    }
  }

  function initSectionNavigation(scope) {
    const links = [...scope.querySelectorAll("[data-nav-section]")];
    const sections = links
      .map((link) => ({
        link,
        section: scope.getElementById(link.dataset.navSection),
      }))
      .filter((item) => item.section)
      .sort((a, b) => a.section.offsetTop - b.section.offsetTop);

    if (sections.length === 0) return;

    let frameRequested = false;

    const setActiveSection = () => {
      const readingLine = window.scrollY + Math.min(window.innerHeight * 0.32, 280);
      let active = sections[0];

      sections.forEach((item) => {
        if (item.section.offsetTop <= readingLine) active = item;
      });

      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8) {
        active = sections.at(-1);
      }

      sections.forEach((item) => {
        if (item === active) {
          item.link.setAttribute("aria-current", "location");
        } else {
          item.link.removeAttribute("aria-current");
        }
      });

      frameRequested = false;
    };

    const requestUpdate = () => {
      if (frameRequested) return;
      frameRequested = true;
      window.requestAnimationFrame(setActiveSection);
    };

    setActiveSection();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    window.addEventListener("hashchange", requestUpdate);
  }

  function initIcons() {
    if (window.lucide?.createIcons) {
      window.lucide.createIcons();
    }
  }

  function scrollToInitialHash() {
    const hash = decodeURIComponent(window.location.hash || "").replace(/^#/, "");
    if (!hash) return;

    const target = document.getElementById(hash);
    if (!target) return;

    const alignTarget = () => {
      target.scrollIntoView({ block: "start" });
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    };

    window.requestAnimationFrame(alignTarget);
    window.setTimeout(alignTarget, 450);
    window.setTimeout(alignTarget, 1500);

    if (document.readyState === "complete") {
      window.setTimeout(alignTarget, 120);
    } else {
      window.addEventListener("load", () => window.requestAnimationFrame(alignTarget), { once: true });
    }
  }

  function initCatalogInteractions(scope) {
    const filterButtons = [...scope.querySelectorAll("[data-filter]")];
    const cards = [...scope.querySelectorAll(".program-card")];
    const count = scope.querySelector("[data-course-count]");
    const detailLinks = [...scope.querySelectorAll("[data-course-detail-link]")];
    const details = [...scope.querySelectorAll("[data-course-detail]")];

    const applyFilter = (value) => {
      let visible = 0;
      cards.forEach((card) => {
        const match = value === "todos" || card.dataset.category === value;
        card.hidden = !match;
        if (match) visible += 1;
      });
      if (count) {
        count.textContent = `Mostrando ${visible} programas.`;
      }
      filterButtons.forEach((button) => {
        const active = button.dataset.filter === value;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });
    };

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => applyFilter(button.dataset.filter || "todos"));
    });

    detailLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        const slug = link.dataset.courseDetailLink;
        const detail = scope.querySelector(`[data-course-detail="${slug}"]`);
        if (!detail) return;

        event.preventDefault();
        details.forEach((item) => {
          item.open = item === detail;
        });
        detail.open = true;
        detail.scrollIntoView({ behavior: "smooth", block: "start" });

        if (route.page === "courses" && window.history?.pushState) {
          window.history.pushState({ course: slug }, "", `/courses/${slug}/`);
          updateSeo();
        }
      });
    });

    const urlFilter = new URLSearchParams(window.location.search).get("curso");
    if (urlFilter && filters.some((item) => item.key === urlFilter)) {
      applyFilter(urlFilter);
    } else {
      applyFilter(selectedProgram?.category || "todos");
    }
  }

  function initProofShelf(scope) {
    const shelf = scope.querySelector("[data-proof-shelf]");
    if (!shelf) return;

    const rail = shelf.querySelector("[data-proof-rail]");
    const stories = [...shelf.querySelectorAll("[data-proof-story]")];
    const railPrevious = shelf.querySelector("[data-proof-rail-prev]");
    const railNext = shelf.querySelector("[data-proof-rail-next]");
    const dialog = shelf.querySelector("[data-proof-dialog]");
    const dialogMedia = shelf.querySelector(".proof-dialog__media");
    const dialogVideoFrame = shelf.querySelector("[data-proof-dialog-video-frame]");
    const dialogVideo = shelf.querySelector("[data-proof-dialog-video]");
    const dialogTitle = shelf.querySelector("[data-proof-dialog-title]");
    const dialogMeta = shelf.querySelector("[data-proof-dialog-meta]");
    const dialogHeadline = shelf.querySelector("[data-proof-dialog-headline]");
    const dialogPrevious = shelf.querySelector("[data-proof-dialog-prev]");
    const dialogNext = shelf.querySelector("[data-proof-dialog-next]");
    const dialogClose = shelf.querySelector("[data-proof-dialog-close]");
    let activeIndex = 0;
    let activeVideoWidth = 16;
    let activeVideoHeight = 9;
    let lastTrigger = null;

    const updateRailControls = () => {
      if (!rail) return;
      const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth);
      if (railPrevious) railPrevious.disabled = rail.scrollLeft <= 4;
      if (railNext) railNext.disabled = rail.scrollLeft >= maxScroll - 4;
    };

    const scrollRail = (direction) => {
      if (!rail || !stories[0]) return;
      const gap = Number.parseFloat(window.getComputedStyle(rail).columnGap) || 0;
      const distance = stories[0].getBoundingClientRect().width + gap;
      rail.scrollBy({ left: distance * direction, behavior: "smooth" });
    };

    const sizeDialogVideo = () => {
      if (!dialog?.open || !dialogMedia || !dialogVideoFrame) return;
      const mediaStyle = window.getComputedStyle(dialogMedia);
      const horizontalPadding =
        (Number.parseFloat(mediaStyle.paddingLeft) || 0) +
        (Number.parseFloat(mediaStyle.paddingRight) || 0);
      const verticalPadding =
        (Number.parseFloat(mediaStyle.paddingTop) || 0) +
        (Number.parseFloat(mediaStyle.paddingBottom) || 0);
      const availableWidth = Math.max(1, dialogMedia.clientWidth - horizontalPadding);
      const availableHeight = Math.max(1, dialogMedia.clientHeight - verticalPadding);
      const ratio = activeVideoWidth / activeVideoHeight;
      const width = Math.min(availableWidth, availableHeight * ratio);
      const height = width / ratio;

      dialogVideoFrame.style.width = `${Math.round(width)}px`;
      dialogVideoFrame.style.height = `${Math.round(height)}px`;
    };

    const showStory = (index) => {
      if (!dialogVideo || stories.length === 0) return;
      activeIndex = (index + stories.length) % stories.length;
      const story = stories[activeIndex];

      dialogVideo.pause();
      dialogVideo.src = story.dataset.proofVideo || story.href;
      dialogVideo.poster = story.dataset.proofPoster || "";
      const videoWidth = Number(story.dataset.proofWidth) || 16;
      const videoHeight = Number(story.dataset.proofHeight) || 9;
      activeVideoWidth = videoWidth;
      activeVideoHeight = videoHeight;
      dialogVideo.width = videoWidth;
      dialogVideo.height = videoHeight;
      dialogVideo.setAttribute("aria-label", story.dataset.proofName || "Historia de estudiante");
      dialogVideo.load();

      if (dialogTitle) dialogTitle.textContent = story.dataset.proofName || "";
      if (dialogMeta) dialogMeta.textContent = story.dataset.proofMeta || "";
      if (dialogHeadline) dialogHeadline.textContent = story.dataset.proofHeadline || "";
      window.requestAnimationFrame(sizeDialogVideo);
    };

    const openStory = (index, trigger) => {
      if (!dialog?.showModal) return;
      lastTrigger = trigger;
      showStory(index);
      dialog.showModal();
      document.documentElement.classList.add("has-proof-dialog");
      window.requestAnimationFrame(sizeDialogVideo);
      dialogClose?.focus();
    };

    stories.forEach((story, index) => {
      story.addEventListener("click", (event) => {
        if (!dialog?.showModal) return;
        event.preventDefault();
        openStory(index, story);
      });
    });

    railPrevious?.addEventListener("click", () => scrollRail(-1));
    railNext?.addEventListener("click", () => scrollRail(1));
    rail?.addEventListener("scroll", updateRailControls, { passive: true });
    window.addEventListener("resize", () => {
      updateRailControls();
      sizeDialogVideo();
    });

    dialogPrevious?.addEventListener("click", () => showStory(activeIndex - 1));
    dialogNext?.addEventListener("click", () => showStory(activeIndex + 1));
    dialogClose?.addEventListener("click", () => dialog?.close());
    dialog?.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
    dialog?.addEventListener("close", () => {
      dialogVideo?.pause();
      document.documentElement.classList.remove("has-proof-dialog");
      lastTrigger?.focus();
    });

    updateRailControls();
  }

  function initCallbackDialog(scope) {
    const dialog = scope.querySelector("[data-callback-dialog]");
    const openButton = scope.querySelector("[data-callback-dialog-open]");
    const closeButton = scope.querySelector("[data-callback-dialog-close]");
    let lastTrigger = null;

    if (!dialog || !openButton) return;

    openButton.addEventListener("click", () => {
      if (!dialog.showModal) return;
      lastTrigger = openButton;
      dialog.showModal();
      document.documentElement.classList.add("has-callback-dialog");
      closeButton?.focus();
    });

    closeButton?.addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener("close", () => {
      document.documentElement.classList.remove("has-callback-dialog");
      lastTrigger?.focus();
    });
  }

  function initCourseRouteState() {
    if (!selectedProgram) return;

    const detail = document.querySelector(`[data-course-detail="${selectedProgram.slug}"]`);
    if (!detail) return;

    detail.open = true;
    setTimeout(() => {
      detail.scrollIntoView({ behavior: "auto", block: "start" });
    }, 50);
  }

  function initLeadForm(scope) {
    const form = scope.querySelector("[data-lead-form]");
    const status = scope.querySelector("[data-form-status]");
    const submitButton = scope.querySelector("[data-lead-submit]");
    const phoneInput = form?.elements?.namedItem("telefono");
    const emailInput = form?.elements?.namedItem("email");
    const startedAt = new Date().toISOString();

    if (!form || !status) return;

    const clearContactValidity = () => {
      phoneInput?.setCustomValidity("");
      emailInput?.setCustomValidity("");
    };

    phoneInput?.addEventListener("input", clearContactValidity);
    emailInput?.addEventListener("input", clearContactValidity);

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const name = String(formData.get("nombre") || "").trim();
      const location = formData.get("ubicacion") || "Sin ubicación indicada";
      const preferredSchedule = formData.get("mejorHorario") || "Prefiero coordinar";
      const phone = String(formData.get("telefono") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const interest = location === "Online" ? "ingles-online" : "ingles-presencial";

      if (!phone && !email) {
        const contactInput = phoneInput || emailInput;
        contactInput?.setCustomValidity("Escribe un teléfono o un email para que podamos contactarte.");
        contactInput?.reportValidity();
        contactInput?.focus();
        return;
      }

      const submittedAt = new Date().toISOString();
      const sourcePath = `${window.location.pathname || "/"}#contacto`;
      const payload = {
        lead: {
          name,
          phone,
          email,
          city: String(location === "Sin ubicación indicada" ? "" : location),
          interest,
          preferredSchedule,
          message: "Solicitud de llamada desde la página principal.",
        },
        source: {
          path: sourcePath,
          referrer: document.referrer || undefined,
        },
        consent: {
          contactPermission: formData.get("contactPermission") === "yes",
          marketingSmsOptIn: false,
          smsConsent: false,
          marketingSmsEvidence: null,
        },
        honeypot: String(formData.get("companyWebsite") || ""),
        startedAt,
        submittedAt,
      };

      const message = [
        "Hola AIT USA, quiero coordinar una llamada.",
        `Nombre: ${name || "Sin nombre"}`,
        `Sede o modalidad: ${location}`,
        `Mejor momento: ${preferredSchedule}`,
        phone ? `Teléfono: ${phone}` : "",
        email ? `Email: ${email}` : "",
      ].filter(Boolean).join("\n");

      const fallbackUrl = `${site.whatsappHref}?text=${encodeURIComponent(message)}`;
      status.textContent = "Preparando tu solicitud de forma segura…";
      form.setAttribute("aria-busy", "true");
      if (submitButton) submitButton.disabled = true;

      try {
        const response = await fetch("/api/leads/contact", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        });
        const body = await response.json();
        if (!response.ok || !body.ok) throw new Error("invalid_submission");

        status.innerHTML = [
          "Tu información no se guardó todavía. Tú decides si deseas enviarla. ",
          `<a href="${escapeHtml(body.advisorHandoff.href)}" target="_blank" rel="noreferrer">Abrir WhatsApp</a>.`,
        ].join("");
      } catch {
        status.innerHTML = [
          "No pudimos preparar la solicitud. ",
          `<a href="${escapeHtml(fallbackUrl)}" target="_blank" rel="noreferrer">Escribir directamente por WhatsApp</a>.`,
        ].join("");
      } finally {
        form.removeAttribute("aria-busy");
        if (submitButton) submitButton.disabled = false;
      }
    });
  }

  function initFaqs(scope) {
    scope.querySelectorAll(".faq-list details").forEach((detail) => {
      detail.addEventListener("toggle", () => {
        if (!detail.open) return;
        scope.querySelectorAll(".faq-list details").forEach((other) => {
          if (other !== detail) other.open = false;
        });
      });
    });
  }

  function initPlacementTest() {
    const form = document.querySelector("[data-placement-form]");
    if (!form) return;

    const panels = [...form.querySelectorAll("[data-placement-panel]")];
    const indicators = [...document.querySelectorAll("[data-step-indicator]")];
    const nextButton = form.querySelector("[data-placement-next]");
    const backButton = form.querySelector("[data-placement-back]");
    const resultBox = form.querySelector("[data-placement-result]");
    const resultActions = form.querySelector("[data-placement-actions]");
    const whatsappLink = form.querySelector("[data-placement-whatsapp]");
    let step = 0;

    const showStep = (nextStep) => {
      step = nextStep;
      panels.forEach((panel, index) => {
        const active = index === step;
        panel.hidden = !active;
        panel.classList.toggle("is-active", active);
      });
      indicators.forEach((indicator, index) => {
        indicator.classList.toggle("is-active", index === step);
      });
      backButton.hidden = step === 0;
      nextButton.textContent = step === panels.length - 2 ? "Ver recomendación" : step === panels.length - 1 ? "Reiniciar" : "Siguiente";
    };

    const validateCurrentStep = () => {
      const activePanel = panels[step];
      const fields = [...activePanel.querySelectorAll("input, select")];
      for (const field of fields) {
        if (!field.checkValidity()) {
          field.reportValidity();
          return false;
        }
      }
      return true;
    };

    const getFlatPlacementQuestions = () => (placementTest.questions || [])
      .flatMap((level) => level.items || []);

    const buildPlacementPayload = () => {
      const formData = new FormData(form);
      const flatQuestions = getFlatPlacementQuestions();
      const quizAnswers = flatQuestions.map((_, index) => Number(formData.get(`question-${index}`) || 0));
      const student = {};
      (placementTest.studentFields || []).forEach((field) => {
        student[field.name] = String(formData.get(field.name) || "").trim();
      });

      return {
        student,
        selfAssessment: Object.fromEntries(
          (placementTest.selfAssessments || []).map((group) => [
            group.key,
            Number(formData.get(group.key) || 0),
          ]),
        ),
        quizAnswers,
        goal: String(formData.get("goal") || "").trim(),
        writingSample: String(formData.get("writingSample") || "").trim(),
        consent: {
          advisorHandoff: true,
        },
        submittedAt: new Date().toISOString(),
      };
    };

    const buildFallbackResult = (payload) => {
      const quizScore = payload.quizAnswers.reduce((total, value) => total + Number(value || 0), 0);
      const selfAssessmentScore = (placementTest.selfAssessments || []).reduce((total, group) => {
        return total + Number(payload.selfAssessment[group.key] || 0);
      }, 0);
      const totalScore = quizScore + Math.round(selfAssessmentScore / Math.max(1, (placementTest.selfAssessments || []).length));
      const recommendation = (placementTest.recommendations || []).find((item) => totalScore >= item.min && totalScore <= item.max)
        || (placementTest.recommendations || [])[0];
      const message = buildAdvisorMessage({
        student: payload.student,
        goal: payload.goal,
        recommendation,
        totalScore,
      });

      return {
        ok: true,
        recommendation,
        scores: {
          quizScore,
          quizQuestionCount: payload.quizAnswers.length,
          selfAssessmentScore,
          selfAssessmentAverage: Math.round(selfAssessmentScore / Math.max(1, (placementTest.selfAssessments || []).length)),
          totalScore,
          maxScore: payload.quizAnswers.length + 3,
          gradingMode: "automatic_provisional",
          answerKeyStatus: "pending_academic_review",
        },
        advisorHandoff: {
          href: `${site.whatsappHref}?text=${encodeURIComponent(message)}`,
          message,
          confirmationRequired: true,
        },
        crmWrite: false,
        storageEnabled: false,
      };
    };

    const buildAdvisorMessage = ({ student, goal, recommendation, totalScore }) => [
      "Hola AIT USA, ya completé el examen de ubicación.",
      `Nombre: ${student.name || "Estudiante"}`,
      `Ciudad/Pais: ${student.city || "Sin ciudad"}`,
      `WhatsApp/telefono: ${student.phone || "Sin telefono"}`,
      `Email: ${student.email || "Sin email"}`,
      `Grupo de edad: ${student.ageGroup || "Sin grupo indicado"}`,
      `Objetivo: ${goal || "Sin objetivo indicado"}`,
      `Resultado sugerido: ${recommendation.level}`,
      `Puntaje orientativo: ${totalScore}`,
      `Detalle: ${recommendation.recommendation || recommendation.copy}`,
      "Quiero confirmar esta recomendación con un asesor.",
    ].join("\n");

    const renderResult = (body) => {
      const recommendation = body.recommendation;
      const scores = body.scores || {};
      const goal = buildPlacementPayload().goal || "Sin objetivo indicado";

      resultBox.innerHTML = `
        <p class="eyebrow-chip">Recomendacion orientativa</p>
        <h3>${escapeHtml(recommendation.level)}</h3>
        <p>${escapeHtml(recommendation.recommendation || recommendation.copy)}</p>
        <p><strong>Puntaje:</strong> ${escapeHtml(scores.totalScore ?? "")} de ${escapeHtml(scores.maxScore ?? "")} puntos.</p>
        <p><strong>Preguntas:</strong> ${escapeHtml(scores.quizScore ?? "")} de ${escapeHtml(scores.quizQuestionCount ?? "")} respuestas correctas.</p>
        <p><strong>Formato sugerido:</strong> ${escapeHtml(recommendation.bestFit || "")}</p>
        <p><strong>Objetivo principal:</strong> ${escapeHtml(goal)}</p>
        <p><strong>Confirmación:</strong> un asesor revisa el resultado contigo antes de definir nivel, horario e inscripción.</p>
        <p><strong>Importante:</strong> esta recomendación necesita confirmación de un asesor antes de cerrar inscripción u horario.</p>
      `;

      if (whatsappLink) whatsappLink.href = body.advisorHandoff?.href || site.whatsappHref;

      resultActions.hidden = false;

      window.dispatchEvent(
        new CustomEvent("aitusa:placement-ready", {
          detail: {
            totalScore: scores.totalScore,
            goal,
            recommendation,
            crmWrite: false,
            storageEnabled: false,
            submittedAt: new Date().toISOString(),
          },
        }),
      );
    };

    const buildResult = async () => {
      const payload = buildPlacementPayload();
      resultBox.innerHTML = "<p>Calculando recomendación...</p>";
      resultActions.hidden = true;
      nextButton.disabled = true;

      try {
        const response = await fetch("/api/placement-test", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        const body = await response.json();
        if (!response.ok || !body.ok) throw new Error("placement_api_rejected");
        renderResult(body);
      } catch {
        renderResult(buildFallbackResult(payload));
      } finally {
        nextButton.disabled = false;
      }
    };

    nextButton?.addEventListener("click", async () => {
      if (step === panels.length - 1) {
        form.reset();
        resultActions.hidden = true;
        resultBox.innerHTML = "<p>Completa los pasos anteriores para ver tu recomendación.</p>";
        showStep(0);
        return;
      }

      if (!validateCurrentStep()) return;

      if (step === panels.length - 2) {
        await buildResult();
        showStep(step + 1);
        return;
      }

      showStep(step + 1);
    });

    backButton?.addEventListener("click", () => {
      if (step > 0) showStep(step - 1);
    });

    showStep(0);
  }

  function homeLink(hash) {
    return route.page === "home" ? hash : `/${hash}`;
  }

  function absoluteUrl(path) {
    return new URL(path, site.canonical || window.location.origin).toString();
  }

  function asset(value) {
    if (!value) return "";
    if (value.startsWith("http")) return value;
    if (value.startsWith("./")) return value.slice(1);
    return value;
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
})();
