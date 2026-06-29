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
    { label: "Ingles", key: "ingles" },
    { label: "Ninos", key: "ninos" },
    { label: "Academico", key: "academico" },
    { label: "Tecnologia", key: "tecnologia" },
    { label: "Idiomas", key: "idiomas" },
  ];

  const route = getRoute();
  const selectedProgram =
    route.slug ? programs.find((program) => program.slug === route.slug) || null : null;

  renderPage();
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
      return;
    }

    app.innerHTML = renderHomePage();
    initSolutionCarousel(document);
    initCatalogInteractions(document);
    initLeadForm(document);
    initFaqs(document);
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
      home: "AiT USA Institute | Ingles en New Jersey con ruta clara para empezar",
      courses: selectedProgram
        ? `${selectedProgram.title} | Cursos AiT USA Institute`
        : "Cursos AiT USA Institute | Catalogo detallado",
      placement: "Examen de ubicacion | AiT USA Institute",
    };

    const descriptionMap = {
      home:
        "AIT USA ordena tu siguiente paso: examen de ubicacion, ingles presencial como oferta principal, programas de apoyo y testimonios reales.",
      courses: selectedProgram
        ? `${selectedProgram.title}. ${selectedProgram.summary}`
        : "Explora el catalogo detallado de ingles, GED, computacion y programas de apoyo de AiT USA Institute.",
      placement:
        "Completa una evaluacion inicial de ingles y recibe una recomendacion orientativa antes de confirmar tu nivel con un asesor.",
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
        educationalCredentialAwarded: "Recomendacion academica inicial",
        url: absoluteUrl(`/courses/${selectedProgram.slug}/`),
      },
      null,
      2,
    );
  }

  function renderHomePage() {
    return `
      ${renderHeader("home")}
      <main id="main-content">
        ${renderHero()}
        ${renderSolutionSection()}
        ${renderOfferingPathSection()}
        ${renderLocationsSection()}
        ${renderProofSection()}
        ${renderFinalCtaSection()}
        ${renderCourseTeaserSection()}
        ${renderFaqSection()}
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
              <p class="section-kicker">Catalogo detallado</p>
              <h1>Explora cursos, formatos y proximos pasos con mas detalle.</h1>
              <p>
                Esta pagina concentra el detalle que no conviene cargar en la portada: modalidades,
                objetivos, horarios y orientacion para ingles, GED, computacion y programas de apoyo.
              </p>
              <div class="button-row">
                <a class="button button--primary" href="${conversionCtas.placement?.href || "/placement-test/"}">Hacer examen de ubicacion</a>
                <a class="button button--ghost" href="${conversionCtas.advisor?.href || site.whatsappHref}" target="_blank" rel="noreferrer">Hablar con un asesor</a>
              </div>
            </div>
            <div class="page-hero__media card">
              <img src="${asset(site.images.routeLevels)}" alt="${escapeHtml(site.images.contactAlt || "Ruta por niveles de AiT USA.")}" />
              <p class="eyebrow-chip">Ruta guiada</p>
              <h2>Ingles presencial sigue siendo la oferta principal.</h2>
              <p>Tambien puedes comparar opciones hibridas, online y programas de apoyo antes de hablar con el equipo.</p>
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
              <h1>${escapeHtml(placementTest.title || "Examen de ubicacion")}</h1>
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
                <fieldset class="goal-options">
                  <legend>Selecciona el motivo principal por el que quieres estudiar ahora.</legend>
                  ${renderGoalOptions()}
                </fieldset>
              </section>

              <section class="placement-panel placement-panel--result" data-placement-panel="4" hidden>
                <h2>Tu recomendacion inicial</h2>
                <div class="result-card" data-placement-result>
                  <p>Completa los pasos anteriores para ver tu recomendacion.</p>
                </div>
                <div class="result-actions" data-placement-actions hidden>
                  <a class="button button--primary" data-placement-whatsapp target="_blank" rel="noreferrer">Enviar resultado por WhatsApp</a>
                  <a class="button button--ghost" href="/courses/">Ver cursos detallados</a>
                </div>
                <p class="placement-footnote">
                  Esta recomendacion es orientativa y debe ser confirmada por un asesor antes de tu inscripcion final.
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
        <a class="brand" href="/">
          <img src="${asset(site.images.logo)}" alt="Logo de AiT USA Institute" />
          <span>
            <strong>${escapeHtml(site.name || "AiT USA Institute")}</strong>
            <small>Ingles practico desde 2004</small>
          </span>
        </a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
          <span class="menu-toggle__icon" aria-hidden="true"></span>
          Menu
        </button>
        <nav class="site-nav" id="site-nav" aria-label="Navegacion principal">
          <a href="/" ${activePage === "home" ? 'aria-current="page"' : ""}>Inicio</a>
          <a href="${homeLink("#metodo")}">Metodo</a>
          <a href="${homeLink("#cursos")}">Oferta</a>
          <a href="${homeLink("#experiencia")}">Resultados</a>
          <a href="${homeLink("#sedes")}">Sedes</a>
          <a href="${homeLink("#contacto")}">Contacto</a>
        </nav>
        <a class="header-cta" href="${site.phoneHref}">
          Llama ahora
        </a>
      </header>
    `;
  }

  function renderHero() {
    return `
      <section class="hero section" id="inicio">
        <div class="section-inner hero__grid">
          <div class="hero__copy">
            <p class="section-kicker">${escapeHtml(painHero.eyebrow || "")}</p>
            <h1>
              <span>${escapeHtml(painHero.headlineLines?.[0] || painHero.headline || "")}</span>
              <span>${escapeHtml(painHero.headlineLines?.[1] || "")}</span>
            </h1>
            <div class="hero__lead-stack">
              ${(painHero.leadLines || [painHero.subheadline || ""])
                .map((line) => `<p>${escapeHtml(line)}</p>`)
                .join("")}
            </div>
            <p class="hero__trust">${escapeHtml(painHero.trust || "")}</p>
            <div class="button-row">
              <a class="button button--primary" href="${conversionCtas.placement?.href || "/placement-test/"}">${escapeHtml(painHero.ctas?.primary || "Hacer examen de ubicacion")}</a>
              <a class="button button--ghost" href="${site.phoneHref}">${escapeHtml(painHero.ctas?.secondary || "Llama ahora")}</a>
            </div>
            <ul class="hero-bullets">
              <li>Presencial como oferta principal para practicar de cerca.</li>
              <li>Rutas hibridas y online para quien necesita flexibilidad real.</li>
              <li>Orientacion clara antes de definir horario, nivel y siguiente paso.</li>
            </ul>
          </div>
          <div class="hero__media">
            <img src="${asset(site.images.heroClassroom)}" alt="${escapeHtml(site.images.contactAlt || "Clase real de AiT USA.")}" />
            <div class="hero__route-panel">
              <p class="eyebrow-chip">Ruta clara</p>
              <ol>
                <li><strong>Ubica tu nivel</strong><span>10 minutos para saber por donde empezar.</span></li>
                <li><strong>Elige formato</strong><span>Presencial, hibrido u online segun tu semana.</span></li>
                <li><strong>Empieza con guia</strong><span>Correccion en vivo y seguimiento constante.</span></li>
              </ol>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function renderSolutionSection() {
    return `
      <section class="section section--white" id="metodo">
        <div class="section-inner">
          <div class="section-heading">
            <p class="section-kicker">La solucion</p>
            <h2>Entender, practicar y continuar sin sentir que empiezas de cero cada semana.</h2>
          </div>
          <div class="solution-carousel" data-solution-carousel>
            ${solutionCharacteristics
              .map(
                (item, index) => `
                  <article class="solution-slide${index === 0 ? " is-active" : ""}" data-solution-slide ${index === 0 ? "" : "hidden"}>
                    <div class="solution-card__media">
                      <video class="clip-card__media-player" controls playsinline preload="metadata" poster="${asset(item.videoPoster)}">
                        <source src="${asset(item.video)}" type="video/mp4" />
                      </video>
                    </div>
                    <div class="solution-card__copy">
                      <p class="eyebrow-chip">${escapeHtml(item.label)}</p>
                      <h3>${escapeHtml(item.title)}</h3>
                      <p>${escapeHtml(item.body)}</p>
                      <p class="proof-line">${escapeHtml(item.proof)}</p>
                    </div>
                  </article>
                `,
              )
              .join("")}
            <div class="carousel-controls" aria-label="Cambiar caracteristica">
              <button class="icon-button" type="button" data-solution-prev aria-label="Anterior">←</button>
              <div class="carousel-dots">
                ${solutionCharacteristics
                  .map(
                    (_, index) => `
                      <button class="carousel-dot${index === 0 ? " is-active" : ""}" type="button" data-solution-dot="${index}" aria-label="Ver caracteristica ${index + 1}"></button>
                    `,
                  )
                  .join("")}
              </div>
              <button class="icon-button" type="button" data-solution-next aria-label="Siguiente">→</button>
            </div>
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
            <p class="section-kicker">Oferta principal</p>
            <h2>Primero elige cómo quieres aprender inglés. El curso exacto vive en la pagina de detalle.</h2>
          </div>
          <div class="offer-map" aria-label="Opciones principales de estudio">
            ${productOfferings
              .map(
                (item, index) => `
                  <article class="offer-node offer-node--${escapeHtml(item.emphasis || "secondary")}">
                    <span class="offer-node__number">0${index + 1}</span>
                    <div>
                      <p class="eyebrow-chip">${escapeHtml(item.badge || "")}</p>
                      <h3>${escapeHtml(item.title)}</h3>
                      <p>${escapeHtml(item.summary)}</p>
                    </div>
                  </article>
                `,
              )
              .join("")}
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
            <p class="section-kicker">Oferta principal</p>
            <h2>Empieza por ingles presencial y luego compara el formato que mejor encaja contigo.</h2>
            <p>La portada resume las rutas. El detalle completo esta en la pagina de cursos y en cada ficha desplegable.</p>
          </div>
          <div class="offering-grid">
            ${productOfferings.map(renderOfferingCard).join("")}
          </div>
          <div class="catalog-links">
            <a class="button button--primary" href="/courses/">Ver cursos detallados</a>
            <a class="button button--ghost" href="/placement-test/">Hacer examen de ubicacion</a>
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
          <p class="section-kicker">Vista rapida del catalogo</p>
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
    return `
      <section class="section section--white" id="sedes">
        <div class="section-inner">
          <div class="section-heading">
            <p class="section-kicker">Sedes y alcance</p>
            <h2 id="sedes-title">Estudia en Nueva Jersey o avanza desde donde estes con opcion online.</h2>
            <p>North Plainfield aparece solo como referencia pendiente hasta confirmar direccion y operacion final.</p>
          </div>
          <div class="location-grid">
            ${locations.map(renderLocationCard).join("")}
          </div>
        </div>
      </section>
    `;
  }

  function renderProofSection() {
    const featured = testimonials[0];
    const rest = testimonials.slice(1);

    return `
      <section class="section section--blue" id="experiencia">
        <div class="section-inner">
          <div class="section-heading section-heading--inverted">
            <p class="section-kicker">Prueba real</p>
            <h2>No tienes que creernos. Mira los resultados por ti mismo.</h2>
            <p>Clases reales, estudiantes reales y una experiencia que se puede escuchar antes de escribir.</p>
          </div>
          ${featured ? `
            <article class="proof-feature card card--dark">
              <div class="proof-feature__media">
                <video class="testimonial-card__video" controls playsinline preload="metadata" poster="${asset(featured.videoPoster || featured.image)}">
                  <source src="${asset(featured.video)}" type="video/mp4" />
                </video>
              </div>
              <div class="proof-feature__copy">
                <p class="eyebrow-chip">Testimonio destacado</p>
                <h3>${escapeHtml(featured.name)}</h3>
                <p>${escapeHtml(featured.text)}</p>
                <p class="proof-line">${escapeHtml(featured.result)} · ${escapeHtml(featured.duration || "")}</p>
              </div>
            </article>
          ` : ""}
          <div class="testimonial-grid">
            ${rest.map(renderTestimonialCard).join("")}
          </div>
        </div>
      </section>
    `;
  }

  function renderFinalCtaSection() {
    return `
      <section class="section section--white" id="contacto">
        <div class="section-inner final-cta-layout">
          <div class="final-cta-copy">
            <div class="section-heading">
              <p class="section-kicker">Siguiente paso</p>
              <h2 id="contacto-title">Elige una puerta de entrada. El equipo te ayuda a ordenar lo demás.</h2>
              <p>La inscripción + libro por $95 se maneja como contacto con el equipo. Esta versión no procesa pagos en línea.</p>
            </div>
            <div class="next-step-list">
              ${renderCtaBox("Llama ahora", "Resuelve dudas de horario, sede y formato con una persona.", site.phoneHref, "Llamar", false, "01")}
              ${renderCtaBox("Haz el examen de ubicacion", conversionCtas.placement?.description, conversionCtas.placement?.href, conversionCtas.placement?.label, false, "02")}
              ${renderCtaBox("Inscripcion + libro $95", conversionCtas.registration?.description, conversionCtas.registration?.href, conversionCtas.registration?.label, true, "03")}
            </div>
          </div>

          <div class="contact-card card">
            <h3>Prefieres hablar con alguien primero?</h3>
            <p>Completa este formulario breve y preparamos un mensaje de WhatsApp con tu interes principal.</p>
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
                  <input name="email" type="email" required />
                </label>
                <label>
                  Telefono
                  <input name="telefono" type="tel" required />
                </label>
                <label>
                  Interes
                  <select name="interes">
                    <option value="Ingles">Ingles</option>
                    <option value="Ninos">Ninos</option>
                    <option value="GED">GED</option>
                    <option value="Computacion">Computacion</option>
                    <option value="Otro">Otro</option>
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
                  Ubicacion
                  <input name="ubicacion" type="text" placeholder="Ciudad / Estado o pais" />
                </label>
              </div>
              <button class="button button--primary" type="submit">Hablar con un asesor</button>
              <p class="form-status" data-form-status aria-live="polite"></p>
            </form>
          </div>
        </div>
      </section>
    `;
  }

  function renderCourseTeaserSection() {
    return `
      <section class="course-teaser" aria-labelledby="catalogo-mini-title">
        <div class="section-inner course-teaser__inner">
          <div>
            <p class="section-kicker">Catalogo completo</p>
            <h2 id="catalogo-mini-title">¿Quieres comparar todos los programas?</h2>
          </div>
          <p>El detalle de inglés, niños, GED, computación y español vive en una página separada para no cargar la portada.</p>
          <a class="button button--ghost" href="/courses/">Ver cursos detallados</a>
        </div>
      </section>
    `;
  }

  function renderCourseCatalogSection() {
    return `
      <section class="section section--soft" id="catalogo-detallado">
        <div class="section-inner">
          <div class="section-heading">
            <p class="section-kicker">Catalogo completo</p>
            <h2>Compara formato, audiencia, horarios y metas antes de escribir.</h2>
            <p>La portada te orienta; aqui ves el detalle por programa y las fichas completas que puedes compartir o revisar con un asesor.</p>
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
      <section class="section section--white">
        <div class="section-inner">
          <div class="section-heading">
            <p class="section-kicker">Preguntas frecuentes</p>
            <h2>Resuelve dudas antes de hablar con el equipo.</h2>
          </div>
          <div class="faq-list">
            ${faqs
              .map(
                (faq) => `
                  <details>
                    <summary>${escapeHtml(faq.question)}</summary>
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
            <p>Ingles presencial, hibrido y online con metodo visual, practica guiada y orientacion para elegir tu siguiente paso.</p>
          </div>
          <div>
            <h3>Rutas</h3>
            <a href="/courses/">Cursos detallados</a>
            <a href="/placement-test/">Examen de ubicacion</a>
            <a href="${conversionCtas.registration?.href || site.whatsappHref}" target="_blank" rel="noreferrer">Inscripcion + libro $95</a>
          </div>
          <div>
            <h3>Contacto</h3>
            <a href="${site.phoneHref}">${escapeHtml(site.phone)}</a>
            <a href="${site.whatsappHref}" target="_blank" rel="noreferrer">${escapeHtml(site.whatsapp)}</a>
            <a href="${site.emailHref}">${escapeHtml(site.email)}</a>
          </div>
        </div>
      </footer>
    `;
  }

  function renderOfferingCard(item) {
    return `
      <article class="offering-card card offering-card--${escapeHtml(item.emphasis || "secondary")}">
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
    const buttonLabel = directRouteLink ? "Abrir ficha completa" : "Ver resumen rapido";

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
            <a class="button button--primary" href="/placement-test/">Hacer examen de ubicacion</a>
            <a class="button button--ghost" href="${site.whatsappHref}" target="_blank" rel="noreferrer">Confirmar con un asesor</a>
          </div>
        </div>
      </details>
    `;
  }

  function renderLocationCard(location) {
    const statusLabel = {
      active: "Activa",
      limited: "Confirmar disponibilidad",
      online: "Online",
      pending: "Pendiente / no activa",
    };

    return `
      <article class="location-card card location-card--${escapeHtml(location.status || "active")}">
        <p class="eyebrow-chip">${escapeHtml(statusLabel[location.status] || "Sede")}</p>
        <h3>${escapeHtml(location.city)}</h3>
        <p class="location-address">${escapeHtml(location.address)}</p>
        <p>${escapeHtml(location.note)}</p>
        <p class="proof-line">${escapeHtml(location.highlight)}</p>
      </article>
    `;
  }

  function renderTestimonialCard(item) {
    return `
      <article class="testimonial-card card">
        <video controls playsinline preload="metadata" poster="${asset(item.videoPoster || item.image)}">
          <source src="${asset(item.video)}" type="video/mp4" />
        </video>
        <div class="testimonial-card__body">
          <h3>${escapeHtml(item.name)}</h3>
          <p>${escapeHtml(item.text)}</p>
          <p class="proof-line">${escapeHtml(item.result)} · ${escapeHtml(item.duration || "")}</p>
        </div>
      </article>
    `;
  }

  function renderCtaBox(title, body, href, label, external, number) {
    return `
      <article class="cta-box card">
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
                <option value="">Selecciona una opcion</option>
                ${field.options.map((option) => `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`).join("")}
              </select>
            </label>
          `;
        }

        return `
          <label>
            ${escapeHtml(field.label)}
            <input name="${escapeHtml(field.name)}" type="${escapeHtml(field.type)}" ${field.required ? "required" : ""} />
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
    return (placementTest.questions || [])
      .map(
        (question, qIndex) => `
          <fieldset class="quiz-card">
            <legend>${escapeHtml(question.prompt)}</legend>
            ${question.options
              .map(
                (option, index) => `
                  <label>
                    <input type="radio" name="question-${qIndex}" value="${option.score}" ${index === 0 ? "required" : ""} />
                    <span>${escapeHtml(option.label)}</span>
                  </label>
                `,
              )
              .join("")}
          </fieldset>
        `,
      )
      .join("");
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
      });
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

  function initSolutionCarousel(scope) {
    const carousel = scope.querySelector("[data-solution-carousel]");
    if (!carousel) return;

    const slides = [...carousel.querySelectorAll("[data-solution-slide]")];
    const dots = [...carousel.querySelectorAll("[data-solution-dot]")];
    const prev = carousel.querySelector("[data-solution-prev]");
    const next = carousel.querySelector("[data-solution-next]");
    let activeIndex = 0;

    const showSlide = (index) => {
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        const active = slideIndex === activeIndex;
        slide.hidden = !active;
        slide.classList.toggle("is-active", active);
      });
      dots.forEach((dot, dotIndex) => {
        const active = dotIndex === activeIndex;
        dot.classList.toggle("is-active", active);
        dot.setAttribute("aria-current", active ? "true" : "false");
      });
    };

    prev?.addEventListener("click", () => showSlide(activeIndex - 1));
    next?.addEventListener("click", () => showSlide(activeIndex + 1));
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => showSlide(index));
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

    if (!form || !status) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const name = `${formData.get("nombre") || ""} ${formData.get("apellido") || ""}`.trim();
      const interest = formData.get("interes") || "Ingles";
      const audience = formData.get("para") || "Para mi";
      const location = formData.get("ubicacion") || "Sin ubicacion indicada";
      const phone = formData.get("telefono") || "";

      const message = [
        "Hola AIT USA, quiero ayuda para elegir mi siguiente paso.",
        `Nombre: ${name || "Sin nombre"}`,
        `Interes: ${interest}`,
        `Para: ${audience}`,
        `Ubicacion: ${location}`,
        `Telefono: ${phone}`,
      ].join("\n");

      status.textContent = "Abriendo WhatsApp con tu informacion para que un asesor te responda.";
      window.open(`${site.whatsappHref}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
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
      nextButton.textContent = step === panels.length - 2 ? "Ver recomendacion" : step === panels.length - 1 ? "Reiniciar" : "Siguiente";
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

    const buildResult = () => {
      const formData = new FormData(form);
      const quizScore = (placementTest.questions || []).reduce((total, _, index) => {
        return total + Number(formData.get(`question-${index}`) || 0);
      }, 0);
      const selfAssessmentScore = (placementTest.selfAssessments || []).reduce((total, group) => {
        return total + Number(formData.get(group.key) || 0);
      }, 0);
      const totalScore = quizScore + Math.round(selfAssessmentScore / Math.max(1, (placementTest.selfAssessments || []).length));
      const recommendation = (placementTest.recommendations || []).find((item) => totalScore >= item.min && totalScore <= item.max)
        || (placementTest.recommendations || [])[0];
      const goal = formData.get("goal") || "Sin objetivo indicado";
      const name = formData.get("name") || "Estudiante";
      const city = formData.get("city") || "Sin ciudad";

      resultBox.innerHTML = `
        <p class="eyebrow-chip">Recomendacion orientativa</p>
        <h3>${escapeHtml(recommendation.level)}</h3>
        <p>${escapeHtml(recommendation.recommendation)}</p>
        <p><strong>Formato sugerido:</strong> ${escapeHtml(recommendation.bestFit)}</p>
        <p><strong>Objetivo principal:</strong> ${escapeHtml(goal)}</p>
        <p><strong>Importante:</strong> esta recomendacion necesita confirmacion de un asesor antes de cerrar inscripcion u horario.</p>
      `;

      const message = [
        "Hola AIT USA, ya complete el examen de ubicacion.",
        `Nombre: ${name}`,
        `Ciudad/Pais: ${city}`,
        `Objetivo: ${goal}`,
        `Resultado sugerido: ${recommendation.level}`,
        `Detalle: ${recommendation.recommendation}`,
        "Quiero confirmar esta recomendacion con un asesor.",
      ].join("\n");

      if (whatsappLink) {
        whatsappLink.href = `${site.whatsappHref}?text=${encodeURIComponent(message)}`;
      }

      resultActions.hidden = false;

      // TODO: connect to AIT CRM once the endpoint contract and required fields are approved.
      window.dispatchEvent(
        new CustomEvent("aitusa:placement-ready", {
          detail: {
            totalScore,
            goal,
            recommendation,
            submittedAt: new Date().toISOString(),
          },
        }),
      );
    };

    nextButton?.addEventListener("click", () => {
      if (step === panels.length - 1) {
        form.reset();
        resultActions.hidden = true;
        resultBox.innerHTML = "<p>Completa los pasos anteriores para ver tu recomendacion.</p>";
        showStep(0);
        return;
      }

      if (!validateCurrentStep()) return;

      if (step === panels.length - 2) {
        buildResult();
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
