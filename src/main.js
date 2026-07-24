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
      initCatalogInteractions(document);
      initLeadForm(document);
      initFaqs(document);
      initCourseRouteState();
      scrollToInitialHash();
      return;
    }

    app.innerHTML = renderHomePage();
    initMethodTabs(document);
    initProofGallery(document);
    initCatalogInteractions(document);
    initLeadForm(document);
    initFaqs(document);
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
        ${renderCommunitySection()}
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
          <a href="/" ${activePage === "home" ? 'aria-current="page"' : ""}>Inicio</a>
          <a href="${homeLink("#metodo")}">Método</a>
          <a href="${homeLink("#cursos")}">Cursos</a>
          <a href="${homeLink("#sedes")}">Sedes</a>
          <a href="${homeLink("#experiencia")}">Recursos</a>
          <a href="${homeLink("#contacto")}">Contacto</a>
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
            <p class="hero__kicker">${escapeHtml(painHero.eyebrow || "")}</p>
            <h1>
              ${(painHero.headlineLines || [painHero.headline || ""])
                .map((line) => `<span>${escapeHtml(line)}</span>`)
                .join("")}
            </h1>
            <p class="hero__summary">
              ${(painHero.subheadlineLines || [painHero.subheadline || ""])
                .map((line) => `<span>${escapeHtml(line)}</span>`)
                .join("")}
            </p>
            <div class="button-row hero__actions">
              <a class="button button--primary" href="${conversionCtas.placement?.href || "/placement-test/"}">
                ${escapeHtml(painHero.ctas?.primary || "Encuentra tu nivel")}
                <i data-lucide="arrow-right" aria-hidden="true"></i>
              </a>
              <a class="button button--ghost" href="#metodo">
                <i data-lucide="circle-play" aria-hidden="true"></i>
                ${escapeHtml(painHero.ctas?.secondary || "Conoce nuestro método")}
              </a>
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
        <div class="hero__proof-band" aria-label="Qué hace diferente a AIT USA">
          <div class="hero__proof-inner">
            <article>
              <i data-lucide="brain" aria-hidden="true"></i>
              <div>
                <h2>Comprendemos, no traducimos</h2>
                <p>Técnicas de comprensión que te permiten entender el inglés de forma natural.</p>
              </div>
            </article>
            <article>
              <i data-lucide="message-circle" aria-hidden="true"></i>
              <div>
                <h2>Hablamos, no memorizamos</h2>
                <p>Técnicas para hablar inglés sin memorizar miles de palabras.</p>
              </div>
            </article>
            <article>
              <i data-lucide="book-open" aria-hidden="true"></i>
              <div>
                <h2>Método Graphic Concept</h2>
                <p>Nuestro método único, patentado y probado por más de 20 años de experiencia.</p>
              </div>
            </article>
          </div>
        </div>
        <div class="hero__community-line" aria-label="Compromiso con la comunidad">
          <span aria-hidden="true"></span>
          <p>Clases reales. Profesores reales. Estudiantes reales. En tu comunidad.</p>
          <span aria-hidden="true"></span>
        </div>
      </section>
    `;
  }

  function renderSolutionSection() {
    return `
      <section class="method-section" id="metodo" aria-label="Método AiT USA">
        <div class="method-showcase" data-method-tabs>
          <div class="method-showcase__panels">
            ${solutionCharacteristics
              .map(
                (item, index) => `
                  <article
                    class="method-panel${index === 0 ? " is-active" : ""}"
                    id="method-panel-${index + 1}"
                    role="tabpanel"
                    aria-labelledby="method-tab-${index + 1}"
                    data-method-panel
                    style="--method-poster: url('${asset(item.videoPoster)}')"
                    ${index === 0 ? "" : "hidden"}
                  >
                    <div class="method-panel__copy">
                      <div class="method-panel__heading">
                        <p class="method-kicker">Método</p>
                        <h2>
                          <span>Así funciona<br />el método.</span>
                          <span class="method-heading__accent">Comprende,<br />practica y avanza.</span>
                        </h2>
                      </div>
                      <div class="method-panel__detail">
                        <p class="method-detail__label">${escapeHtml(item.label)}</p>
                        <span class="method-detail__rule" aria-hidden="true"></span>
                        <h3>${escapeHtml(item.title)}.</h3>
                      </div>
                    </div>
                    <div class="method-panel__media">
                      <video
                        class="method-panel__video"
                        controls
                        playsinline
                        preload="metadata"
                        width="${item.videoWidth || 16}"
                        height="${item.videoHeight || 9}"
                        poster="${asset(item.videoPoster)}"
                        aria-label="${escapeHtml(item.label)}: ${escapeHtml(item.title)}"
                      >
                        <source src="${asset(item.video)}" type="video/mp4" />
                      </video>
                      <p class="method-panel__media-label">
                        <i data-lucide="video" aria-hidden="true"></i>
                        <span>Video real · Método AIT USA</span>
                      </p>
                    </div>
                  </article>
                `,
              )
              .join("")}
          </div>
          <div class="method-tabs" role="tablist" aria-label="Características del método AiT USA">
            ${solutionCharacteristics
              .map(
                (item, index) => `
                  <button
                    class="method-tab${index === 0 ? " is-active" : ""}"
                    id="method-tab-${index + 1}"
                    type="button"
                    role="tab"
                    aria-selected="${index === 0 ? "true" : "false"}"
                    aria-controls="method-panel-${index + 1}"
                    tabindex="${index === 0 ? "0" : "-1"}"
                    data-method-tab="${index}"
                  >
                    <span class="method-tab__number" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
                    <span class="method-tab__rule" aria-hidden="true"></span>
                    <span class="method-tab__label">${escapeHtml(item.tabLabel || item.label)}</span>
                  </button>
                `,
              )
              .join("")}
          </div>
        </div>
      </section>
    `;
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
                      <p class="eyebrow-chip">${escapeHtml(item.badge || "")}</p>
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
          <p class="catalog-note">
            También ofrecemos inglés para niños, GED, computación, español para extranjeros y programas de apoyo.
            <a href="/courses/#programas-de-apoyo">Ver catálogo completo</a>.
          </p>
        </div>
      </section>
    `;
  }

  function renderCommunitySection() {
    return `
      <section class="community-band" id="comunidad" aria-labelledby="comunidad-title">
        <div class="community-band__inner">
          <figure class="community-band__media">
            <img
              src="${site.images.testimonialAntonina}"
              alt="Estudiantes reales de AIT USA con sus libros de inglés."
              width="1200"
              height="800"
            />
            <figcaption>
              <i data-lucide="users-round" aria-hidden="true"></i>
              Estudiantes reales · AIT USA Institute
            </figcaption>
          </figure>
          <div class="community-band__copy">
            <p class="section-kicker">Una comunidad que abre puertas</p>
            <h2 id="comunidad-title">El progreso se comparte.</h2>
            <p class="community-band__lead">
              Nuestros profesores conocen la metodología y acompañan cada paso. Los estudiantes encuentran un espacio acogedor para practicar, equivocarse y seguir avanzando.
            </p>
            <div class="community-band__points">
              <article>
                <i data-lucide="messages-square" aria-hidden="true"></i>
                <div>
                  <h3>Acompañamiento cercano</h3>
                  <p>Orientación clara para comprender el método, practicar y avanzar con constancia.</p>
                </div>
              </article>
              <article>
                <i data-lucide="book-open-check" aria-hidden="true"></i>
                <div>
                  <h3>Espacio para practicar</h3>
                  <p>Una comunidad donde aprender también significa preguntar, intentar y avanzar con confianza.</p>
                </div>
              </article>
            </div>
          </div>
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
          <div class="section-heading">
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
              <div class="location-compact-list" aria-label="Sedes">
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
    const featured = testimonials.find((item) => item.name === "Jessica") || testimonials[0];
    const orderedTestimonials = [
      featured,
      ...testimonials.filter((item) => item !== featured),
    ].filter(Boolean).slice(0, 4);

    const shortLabels = {
      Jessica: "Jessica",
      "Testimonio internacional": "Testimonio internacional",
      Eric: "Eric · entrevista",
      Leila: "Leila · testimonio",
    };

    return `
      <section class="section proof-editorial" id="experiencia" data-proof-gallery>
        <div class="proof-editorial__inner">
          <div class="proof-editorial__heading">
            <p class="section-kicker">Prueba real</p>
            <h2>No tienes que creernos. Mira los resultados por ti mismo.</h2>
            <p>Mira cómo se viven las clases y escucha a quienes ya pasaron por el proceso.</p>
          </div>

          <div class="proof-editorial__stage" aria-live="polite">
            ${orderedTestimonials.map((item, index) => `
              <article
                class="proof-editorial__panel${index === 0 ? " is-active" : ""}"
                id="proof-panel-${index}"
                role="tabpanel"
                aria-labelledby="proof-tab-${index}"
                data-proof-panel
                ${index === 0 ? "" : "hidden"}
              >
                <video
                  controls
                  playsinline
                  preload="metadata"
                  width="${item.videoWidth || 16}"
                  height="${item.videoHeight || 9}"
                  poster="${asset(item.videoPoster || item.image)}"
                  aria-label="${escapeHtml(shortLabels[item.name] || item.name)}"
                >
                  <source src="${asset(item.video)}" type="video/mp4" />
                </video>
                <div class="proof-editorial__caption">
                  <strong>${escapeHtml(shortLabels[item.name] || item.name)}</strong>
                  <span>${escapeHtml(item.result)} · ${escapeHtml(item.duration || "")}</span>
                </div>
              </article>
            `).join("")}
          </div>

          <div class="proof-editorial__tabs" role="tablist" aria-label="Videos de testimonios reales">
            ${orderedTestimonials.map((item, index) => `
              <button
                class="proof-editorial__tab${index === 0 ? " is-active" : ""}"
                id="proof-tab-${index}"
                type="button"
                role="tab"
                aria-controls="proof-panel-${index}"
                aria-selected="${index === 0 ? "true" : "false"}"
                tabindex="${index === 0 ? "0" : "-1"}"
                data-proof-tab
              >
                <span class="proof-editorial__tab-number" aria-hidden="true">${index + 1}</span>
                <span class="proof-editorial__thumb">
                  <img src="${asset(item.videoPoster || item.image)}" alt="" loading="lazy" />
                  <i data-lucide="circle-play" aria-hidden="true"></i>
                </span>
                <span class="proof-editorial__tab-copy">
                  <strong>${escapeHtml(shortLabels[item.name] || item.name)}</strong>
                  <span>${escapeHtml(item.result)}</span>
                  <span>${escapeHtml(item.duration || "")}</span>
                </span>
              </button>
            `).join("")}
          </div>

          <p class="proof-editorial__note">
            <i data-lucide="film" aria-hidden="true"></i>
            <span>Cuatro videos reales para conocer el método y la experiencia AIT USA.</span>
          </p>
        </div>
      </section>
    `;
  }

  function renderFinalCtaSection() {
    return `
      <section class="section final-cta-section" id="contacto">
        <div class="section-inner final-cta-layout">
          <div class="final-cta-copy">
            <div class="section-heading section-heading--framed">
              <p class="section-kicker">Empieza aquí</p>
              <h2 id="contacto-title">¿Listo para empezar?</h2>
              <p>Haz el examen de ubicación y te ayudamos a elegir tu nivel, horario y modalidad.</p>
            </div>
            <div class="final-cta-actions">
              <a class="button button--primary" href="${conversionCtas.placement?.href || "/placement-test/"}">
                Encuentra tu nivel
                <i data-lucide="arrow-right" aria-hidden="true"></i>
              </a>
              <a class="button button--ghost" href="${conversionCtas.advisor?.href || site.whatsappHref}" target="_blank" rel="noreferrer">
                <i data-lucide="message-circle" aria-hidden="true"></i>
                Hablar por WhatsApp
              </a>
            </div>
            <p class="final-cta-note">
              <i data-lucide="shield-check" aria-hidden="true"></i>
              La recomendación inicial es gratuita. Un asesor confirma contigo el nivel y el horario antes de la inscripción.
            </p>
          </div>

          <details class="contact-card contact-card--secondary card">
            <summary>
              <span>
                <small>Respuesta humana</small>
                <strong>Prefiero que me contacten</strong>
              </span>
              <i class="contact-card__chevron" data-lucide="chevron-down" aria-hidden="true"></i>
            </summary>
            <div class="contact-card__content">
              <p>Completa este formulario breve y preparamos un mensaje de WhatsApp con tu interés principal.</p>
              <form class="lead-form" data-lead-form>
              <div class="form-grid">
                <label>
                  Nombre
                  <input name="nombre" type="text" required />
                </label>
                <label>
                  Apellido
                  <input name="apellido" type="text" required />
                </label>
                <label>
                  Email
                  <input name="email" type="email" />
                </label>
                <label>
                  Teléfono móvil <small>(opcional)</small>
                  <input name="telefono" type="tel" inputmode="tel" autocomplete="tel" />
                  <small>No recibirás SMS promocionales salvo que marques la casilla separada.</small>
                </label>
                <label>
                  Interés
                  <select name="interes" required>
                    <option value="ingles-presencial">Inglés presencial</option>
                    <option value="ingles-hibrido">Inglés híbrido</option>
                    <option value="ingles-online">Inglés online</option>
                    <option value="kids">Inglés para niños</option>
                    <option value="ged">GED</option>
                    <option value="computacion">Computación</option>
                    <option value="otro">Otro</option>
                  </select>
                </label>
                <label>
                  Para
                  <select name="para">
                    <option value="Para mi">Para mi</option>
                    <option value="Para mi hijo o hija">Para mi hijo o hija</option>
                    <option value="Para otra persona">Para otra persona</option>
                  </select>
                </label>
                <label class="form-grid__full">
                  Ubicación
                  <input name="ubicacion" type="text" placeholder="Ciudad / Estado o país" />
                </label>
              </div>
              <label class="form-honeypot" aria-hidden="true">
                Sitio web de empresa
                <input name="companyWebsite" type="text" tabindex="-1" autocomplete="off" />
              </label>
              <fieldset class="consent-panel">
                <legend>Permisos de contacto</legend>
                <label class="consent-check consent-check--required">
                  <input name="contactPermission" type="checkbox" value="yes" required />
                  <span>${escapeHtml(site.smsConsent?.contactPermission || "Autorizo a AIT USA Institute a responder esta solicitud.")}</span>
                </label>
                <label class="consent-check consent-check--sms">
                  <input name="smsConsent" type="checkbox" value="yes" />
                  <span>
                    <strong>${escapeHtml(site.smsConsent?.checkboxLabel || "Sí, deseo recibir mensajes de texto de AIT USA Institute.")}</strong>
                    <small>${escapeHtml(site.smsConsent?.disclosure || "La frecuencia puede variar. Pueden aplicarse tarifas. Responde STOP para cancelar y HELP para ayuda.")}</small>
                  </span>
                </label>
                <p class="consent-links">
                  Consulta nuestra <a href="${escapeHtml(site.legalLinks?.privacy || "/privacy-policy")}">Política de Privacidad</a>
                  y nuestros <a href="${escapeHtml(site.legalLinks?.terms || "/terms-and-conditions")}">Términos y Condiciones</a>.
                </p>
              </fieldset>
              <button class="button button--primary" type="submit" data-lead-submit>Preparar conversación</button>
              <p class="form-status" data-form-status aria-live="polite"></p>
              </form>
              <div class="contact-card__footnote">
                <strong>También puedes escribir directo.</strong>
                <a href="${site.whatsappHref}" target="_blank" rel="noreferrer">${escapeHtml(site.whatsapp)}</a>
              </div>
            </div>
          </details>
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
    return `
      <footer class="site-footer">
        <div class="section-inner site-footer__grid">
          <div>
            <a class="site-footer__logo" href="/">
              <img src="${asset(site.images.logo)}" alt="Logo de AiT USA Institute" />
              <span>
                <strong>${escapeHtml(site.name || "AiT USA Institute")}</strong>
                <small>${escapeHtml(site.legal || "")}</small>
              </span>
            </a>
            <p>Inglés presencial, híbrido y online con método visual, práctica guiada y acompañamiento para avanzar con confianza.</p>
          </div>
          <div>
            <h3>Explora</h3>
            <a href="/courses/">Cursos detallados</a>
            <a href="/placement-test/">Examen de ubicación</a>
            <a href="${conversionCtas.registration?.href || site.whatsappHref}" target="_blank" rel="noreferrer">Inscripción + libro $95</a>
          </div>
          <div>
            <h3>Contacto</h3>
            <a href="${site.phoneHref}">${escapeHtml(site.phone)}</a>
            <a href="${site.whatsappHref}" target="_blank" rel="noreferrer">${escapeHtml(site.whatsapp)}</a>
            <a href="${site.emailHref}">${escapeHtml(site.email)}</a>
          </div>
          <div>
            <h3>Legal</h3>
            <a href="${escapeHtml(site.legalLinks?.privacy || "/privacy-policy")}">Política de Privacidad</a>
            <a href="${escapeHtml(site.legalLinks?.terms || "/terms-and-conditions")}">Términos y Condiciones</a>
            <a href="${escapeHtml(site.legalLinks?.contact || "/contactanos")}">Formulario de contacto</a>
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
      limited: "Confirmar",
      online: "Online",
      pending: "Pendiente / no activa",
    };
    const isLimited = location.status === "limited";
    const isOnline = location.status === "online";
    const locationId = location.mapKey || "online";
    const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`;
    const actionHref = isLimited
      ? `${site.whatsappHref}?text=${encodeURIComponent(`Hola AIT USA, quiero confirmar disponibilidad para ${location.city}.`)}`
      : isOnline
        ? "/courses/#ingles-online"
        : mapsHref;
    const actionTarget = isLimited || !isOnline ? 'target="_blank" rel="noreferrer"' : "";
    const shortCity = isOnline ? "Clases online" : location.city.split(",")[0];
    const supportingText = isLimited
      ? "Horario y punto de encuentro por confirmar"
      : isOnline
        ? "Disponible según nivel y zona horaria"
        : location.address;

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
        <i class="compact-location-row__arrow" data-lucide="${isOnline ? "arrow-right" : "navigation"}" aria-hidden="true"></i>
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

  function initMethodTabs(scope) {
    const method = scope.querySelector("[data-method-tabs]");
    if (!method) return;

    const panels = [...method.querySelectorAll("[data-method-panel]")];
    const tabs = [...method.querySelectorAll("[data-method-tab]")];
    let activeIndex = 0;

    const showPanel = (index, moveFocus = false) => {
      activeIndex = (index + panels.length) % panels.length;
      panels.forEach((panel, panelIndex) => {
        const active = panelIndex === activeIndex;
        const video = panel.querySelector("video");
        panel.hidden = !active;
        panel.classList.toggle("is-active", active);

        if (active && video && video.readyState < 1) {
          video.load();
        } else if (!active) {
          video?.pause();
        }
      });
      tabs.forEach((tab, tabIndex) => {
        const active = tabIndex === activeIndex;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
      });

      if (moveFocus) tabs[activeIndex]?.focus();
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => showPanel(index));
      tab.addEventListener("keydown", (event) => {
        const keyActions = {
          ArrowLeft: () => showPanel(activeIndex - 1, true),
          ArrowRight: () => showPanel(activeIndex + 1, true),
          Home: () => showPanel(0, true),
          End: () => showPanel(tabs.length - 1, true),
        };

        if (!keyActions[event.key]) return;
        event.preventDefault();
        keyActions[event.key]();
      });
    });

    showPanel(0);
  }

  function initProofGallery(scope) {
    const gallery = scope.querySelector("[data-proof-gallery]");
    if (!gallery) return;

    const panels = [...gallery.querySelectorAll("[data-proof-panel]")];
    const tabs = [...gallery.querySelectorAll("[data-proof-tab]")];
    let activeIndex = 0;

    const showPanel = (index, moveFocus = false) => {
      activeIndex = (index + panels.length) % panels.length;

      panels.forEach((panel, panelIndex) => {
        const active = panelIndex === activeIndex;
        const video = panel.querySelector("video");
        panel.hidden = !active;
        panel.classList.toggle("is-active", active);

        if (active && video && video.readyState < 1) {
          video.load();
        } else if (!active) {
          video?.pause();
        }
      });

      tabs.forEach((tab, tabIndex) => {
        const active = tabIndex === activeIndex;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
      });

      if (moveFocus) tabs[activeIndex]?.focus();
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => showPanel(index));
      tab.addEventListener("keydown", (event) => {
        const keyActions = {
          ArrowLeft: () => showPanel(activeIndex - 1, true),
          ArrowRight: () => showPanel(activeIndex + 1, true),
          Home: () => showPanel(0, true),
          End: () => showPanel(tabs.length - 1, true),
        };

        if (!keyActions[event.key]) return;
        event.preventDefault();
        keyActions[event.key]();
      });
    });

    showPanel(0);
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
    const smsInput = form?.elements?.namedItem("smsConsent");
    const startedAt = new Date().toISOString();

    if (!form || !status) return;

    phoneInput?.addEventListener("input", () => phoneInput.setCustomValidity(""));
    smsInput?.addEventListener("change", () => {
      if (!smsInput.checked) phoneInput?.setCustomValidity("");
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const name = `${formData.get("nombre") || ""} ${formData.get("apellido") || ""}`.trim();
      const interest = formData.get("interes") || "ingles-presencial";
      const audience = formData.get("para") || "Para mi";
      const location = formData.get("ubicacion") || "Sin ubicación indicada";
      const phone = String(formData.get("telefono") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const marketingSmsOptIn = formData.get("smsConsent") === "yes";

      if (marketingSmsOptIn && !phone) {
        phoneInput?.setCustomValidity("Ingresa un teléfono móvil para recibir mensajes de texto.");
        phoneInput?.reportValidity();
        phoneInput?.focus();
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
          ageGroup: audience,
        },
        source: {
          path: sourcePath,
          referrer: document.referrer || undefined,
        },
        consent: {
          contactPermission: formData.get("contactPermission") === "yes",
          marketingSmsOptIn,
          smsConsent: marketingSmsOptIn,
          marketingSmsEvidence: marketingSmsOptIn
            ? {
                disclosureVersion: site.smsConsent?.disclosureVersion,
                sourcePath,
                consentedAt: submittedAt,
              }
            : null,
        },
        honeypot: String(formData.get("companyWebsite") || ""),
        startedAt,
        submittedAt,
      };

      const message = [
        "Hola AIT USA, quiero ayuda para elegir el programa y horario que me convienen.",
        `Nombre: ${name || "Sin nombre"}`,
        `Interés: ${interest}`,
        `Para: ${audience}`,
        `Ubicación: ${location}`,
        `Teléfono: ${phone}`,
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
