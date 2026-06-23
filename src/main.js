(function () {
const {
  books,
  differentiators,
  downloads,
  faqs,
  heroVideoHighlights,
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
  trustFeature,
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

const heroMediaPoster = site.heroVideoPoster || site.images.heroVideoPoster || site.images.heroPoster || site.images.hero;
const heroBackgroundImage = site.images.heroVideoPoster || site.images.heroPoster || site.images.hero || heroMediaPoster;
const heroVideoSources = (() => {
  const isMobile = window.matchMedia("(max-width: 900px)").matches;
  const desktopFirst = site.images.heroVideo || site.images.heroVideoPortrait;
  const mobileFirst = site.images.heroVideoPortrait || site.images.heroVideo;

  return (isMobile ? [mobileFirst, desktopFirst, site.images.heroVideoFallback] : [desktopFirst, mobileFirst, site.images.heroVideoFallback])
    .filter(Boolean)
    .filter((value, index, list) => list.indexOf(value) === index);
})();

const initHeroQuickCaptureBridge = () => {
  const quickCaptureForm = document.querySelector("[data-hero-quick-capture]");
  const leadForm = document.querySelector("[data-lead-form]");
  const leadStatus = document.querySelector("[data-form-status]");

  if (!quickCaptureForm || !leadForm) {
    return false;
  }

  const goalToInterest = {
    "Quiero comprobar método y estilo en clase real": "Inglés",
    "Quiero validar método y estilo en clase real": "Inglés",
    "Quiero revisar opciones de horario": "Inglés",
    "Necesito ruta para mi hijo o hija": "Niños",
    "Quiero una ruta para niños o adultos": "Inglés",
    "Quiero validar método y estilo con clase real": "Inglés",
    "Busco ruta para niños o adultos": "Inglés",
    "Quiero clase real primero": "Inglés",
    "Quiero clase real": "Inglés",
    "Quiero revisar horarios": "Inglés",
    "Necesito opción para mi hijo/a": "Niños",
    "Quiero ruta para niños o adultos": "Inglés",
  };

  const normalizeGoal = (value = "") =>
    `${value || ""}`
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/\s+/g, " ")
      .trim();

  const quickName = quickCaptureForm.querySelector("[data-hero-quick-name]");
  const quickPhone = quickCaptureForm.querySelector("[data-hero-quick-phone]");
  const quickGoal = quickCaptureForm.querySelector("[data-hero-quick-goal]");
  const quickStatus = quickCaptureForm.querySelector("[data-hero-quick-status]");

  const leadName = leadForm.querySelector('input[name="nombre"]');
  const leadLastName = leadForm.querySelector('input[name="apellido"]');
  const leadCode = leadForm.querySelector('input[name="codigo"]');
  const leadPhone = leadForm.querySelector('input[name="telefono"]');
  const leadInterest = leadForm.querySelector('select[name="interes"]');
  const leadPersona = leadForm.querySelector('select[name="para"]');
  const leadLocation = leadForm.querySelector('input[name="ubicacion"]');

  if (!leadName || !leadPhone || !quickName || !quickPhone) {
    return false;
  }

  const toDigits = (value) => `${value || ""}`.replace(/\D/g, "");

  const buildName = (value) => {
    const clean = `${value || ""}`.trim();
    return clean.length ? clean : "";
  };

  const syncQuickCaptureToForm = () => {
    const quickNameValue = buildName(quickName.value);
    const quickPhoneValue = toDigits(quickPhone.value);
    const quickGoalValue = quickGoal?.value || "";

    if (quickNameValue) {
      leadName.value = quickNameValue;
      if (leadLastName) {
        const names = quickNameValue.split(" ").filter(Boolean);
        if (names.length > 1) {
          const first = names.shift();
          leadName.value = first || "";
          leadLastName.value = names.length ? names.join(" ") : leadLastName.value;
        }
      }
    }

    if (quickPhoneValue) {
      if (quickPhoneValue.length > 10) {
        const normalized = quickPhoneValue.startsWith("1")
          ? quickPhoneValue.slice(1)
          : quickPhoneValue;
        if (leadCode) {
          leadCode.value = "+1";
        }
        leadPhone.value = normalized.slice(-10);
      } else {
        leadPhone.value = quickPhoneValue;
        if (leadCode && !leadCode.value.trim()) {
          leadCode.value = "+1";
        }
      }
    }

    if (leadInterest) {
      const normalizedGoal = normalizeGoal(quickGoalValue);
      const matchedGoal = goalToInterest[quickGoalValue] || (() => {
        if (normalizedGoal.includes("hijo") || normalizedGoal.includes("hija")) {
          return "Niños";
        }
        if (
          normalizedGoal.includes("niños") ||
          normalizedGoal.includes("nino") ||
          normalizedGoal.includes("joven")
        ) {
          return "Niños";
        }
        if (
          normalizedGoal.includes("ingles") ||
          normalizedGoal.includes("clase real") ||
          normalizedGoal.includes("horario")
        ) {
          return "Inglés";
        }
        return "";
      })();

      if (matchedGoal) {
        leadInterest.value = matchedGoal;
      }
    }

    if (leadPersona && !leadPersona.value) {
      leadPersona.value = "Para mí";
    }

    if (leadLocation && !leadLocation.value.trim()) {
      leadLocation.value = "Nueva Jersey / Estados Unidos";
    }

    leadForm.dispatchEvent(new Event("input", { bubbles: true }));
    if (quickStatus) {
      quickStatus.textContent =
        "Información copiada al formulario. En 1 paso te conectas con tu ruta inicial.";
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    syncQuickCaptureToForm();

    if (leadStatus) {
      leadStatus.textContent =
        "Te dejé tu información en el formulario. Completa 2 campos para abrir WhatsApp.";
    }

    const contactSection = document.querySelector("#contacto");
    if (contactSection) {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      contactSection.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
      const nameInput = leadForm.querySelector('input[name="nombre"]');
      if (nameInput) {
        nameInput.focus({ preventScroll: true });
      }
    }
  };

  quickCaptureForm.addEventListener("input", syncQuickCaptureToForm);
  quickCaptureForm.addEventListener("change", syncQuickCaptureToForm);
  quickCaptureForm.addEventListener("submit", handleSubmit);
  return true;
};
const contactMessage = encodeURIComponent(
  "Hola AiT USA Institute, vi su clase real y quiero una ruta inicial para decidir hoy con claridad: objetivo, nivel y horario.",
);

const heroQuickCaptureWidget = () => {
  if (!heroQuickCaptureData) return "";

  const options = Array.isArray(heroQuickCaptureData.options)
    ? heroQuickCaptureData.options
    : ["Ver clase real y decidir", "Revisar opciones con mi agenda", "Necesito ruta familiar"];
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
    message:
      "quiero una ruta inicial de inglés y decidir hoy con criterio práctico sin perder tiempo.",
    panelTitle: "Ruta sugerida: decisión con criterio",
    panelCopy:
      "Te dejamos un plan claro de objetivo, horario y formato para pasar de duda a acción en menos de 5 minutos.",
    panelAction: "Ver opciones y confirmar mi ruta inicial",
  },
  classSample: {
    intent: "Clase real",
    interest: "Inglés",
    forWhom: "Para mí",
    message:
      "quiero ver una clase real y recibir una recomendación clara de inicio para mi caso.",
    panelTitle: "Ruta sugerida: primera mirada práctica",
    panelCopy:
      "Mira un fragmento real y valida método, ritmo y encaje antes de avanzar.",
    panelAction: "Ver clase real y decidir mi siguiente paso",
  },
  scheduleFlex: {
    intent: "Agenda flexible",
    interest: "Inglés",
    forWhom: "Para mí",
    message:
      "tengo agenda limitada y necesito horario con ruta realista para empezar sin fricción.",
    panelTitle: "Ruta sugerida: horario inteligente",
    panelCopy:
      "Compara mañana, noche o fin de semana y elige una ruta que se ajuste a tu rutina real.",
    panelAction: "Revisar horarios y reservar mi ruta inicial",
  },
  familySupport: {
    intent: "Opciones familiares",
    interest: "Niños",
    forWhom: "Para mi hijo/a",
    message:
      "quiero una ruta para mi hijo/a con seguimiento y continuidad real desde el inicio.",
    panelTitle: "Ruta sugerida: decisión familiar",
    panelCopy:
      "Compara opciones para familias y dejamos una ruta clara con continuidad desde el primer paso.",
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

const initialCourseFilter = (() => {
  const param = new URL(window.location.href).searchParams.get("curso");
  return param && Object.prototype.hasOwnProperty.call(courseInterestMap, param) ? param : "todos";
})();

const initialCourseInterest = courseInterestMap[initialCourseFilter] || courseInterestMap.todos;

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
    name: "Preguntas frecuentes de AiT USA Institute",
    inLanguage: "es",
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

const syncCoreSchemas = () => {
  const schemaTarget = (name) =>
    document.querySelector(`script[type="application/ld+json"][data-schema="${name}"]`);
  const setSchema = (name, payload) => {
    const script = schemaTarget(name);
    if (!script) return;
    script.textContent = JSON.stringify(payload, null, 2);
  };

  const canonical = site.canonical || `${window.location.origin}/`;
  const websiteUrl = toAbsoluteSiteUrl(canonical);
  const today = new Date().toISOString().split("T")[0];
  const seoImage = toAbsoluteSiteUrl(site.seoImage || site.images?.heroPoster || site.images?.hero);
  const seoVideo = toAbsoluteSiteUrl(site.seoVideo || site.heroVideo || site.images?.heroVideo);
  const schemaCourses = (programs || []).slice(0, 4).map((program, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Course",
      name: program.title,
      description: program.fit || program.description || "",
      provider: {
        "@type": "EducationalOrganization",
        name: site.name,
        "@id": `${websiteUrl}#organization`,
      },
      courseMode: `${program.mode || "Presencial, Híbrido, Online"}`
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      inLanguage: "en",
      offers: {
        "@type": "Offer",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        name: program.title,
      },
    },
  }));

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: site.name,
    alternateName: site.legal,
    url: websiteUrl,
    "@id": `${websiteUrl}#organization`,
    logo: toAbsoluteSiteUrl(site.images.logo),
    image: seoImage,
    description: site.seoDescription || site.description || site.tagline,
    telephone: site.phone,
    email: site.email,
    foundingDate: site.founded,
    sameAs: [site.facebookHref].filter(Boolean),
    address: (site.locations || []).map((location) => ({
      "@type": "PostalAddress",
      streetAddress: location.streetAddress,
      addressLocality: location.addressLocality,
      addressRegion: location.addressRegion,
      postalCode: location.postalCode,
      addressCountry: location.addressCountry || "US",
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Cursos de AiT USA Institute",
      itemListElement: (programs || []).slice(0, 6).map((program) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Course",
          name: program.title,
          description: program.description || program.fit || "",
        },
      })),
    },
  };

  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${websiteUrl}#webpage`,
    url: websiteUrl,
    name: site.seoTitle || site.heroHeadline,
    description: site.seoDescription || site.description,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["#inicio h1", "#inicio .hero__lead", "#contacto-title"],
    },
    isPartOf: {
      "@id": `${websiteUrl}#website`,
    },
    about: {
      "@id": `${websiteUrl}#organization`,
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: seoImage,
    },
    inLanguage: "es-US",
    breadcrumb: {
      "@id": `${websiteUrl}#breadcrumb`,
    },
  };

  const heroSchemaPoster =
    (site.images && (site.images.hero || site.images.heroPoster || site.images.heroVideoPoster)) ||
    heroGallery[0]?.videoPoster ||
    heroGallery[0]?.image ||
    "";

  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "@id": `${websiteUrl}#clase-real-video`,
    name: "Clase real en vivo de AiT USA Institute",
    description: site.heroLead || site.heroMicrocopy || "Clase real en vivo de inglés con corrección inmediata.",
    inLanguage: "en-US",
    isFamilyFriendly: true,
    uploadDate: today,
    contentUrl: seoVideo,
    embedUrl: `${websiteUrl}#experiencia`,
    thumbnailUrl: [seoImage, toAbsoluteSiteUrl(heroSchemaPoster)].filter(Boolean),
    duration: site.seoVideoDuration || "PT1M8S",
    encodingFormat: "video/mp4",
    hasPart: [
      {
        "@type": "Clip",
        name: "Clase real de entrevista y conversación guiada",
        startOffset: "PT0S",
        endOffset: site.seoVideoDuration || "PT1M8S",
      },
    ],
    mainEntityOfPage: {
      "@id": `${websiteUrl}#webpage`,
    },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: {
        "@type": "ImageObject",
        url: toAbsoluteSiteUrl(site.images.logo),
      },
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: websiteUrl,
    "@id": `${websiteUrl}#website`,
    inLanguage: "es",
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Clases de inglés con clase real y ruta personalizada",
    description: site.seoDescription || site.description,
    provider: {
      "@id": `${websiteUrl}#organization`,
    },
    serviceType: "English language training",
    areaServed: {
      "@type": "AdministrativeArea",
      name: "New Jersey, United States",
    },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: `${websiteUrl}#contacto`,
      serviceSmsNumber: "+1-732-379-0593",
    },
    audience: {
      "@type": "PeopleAudience",
      audienceType: ["Jóvenes", "Adultos", "Familias"],
    },
    offers: {
      "@type": "Offer",
      url: websiteUrl,
      availability: "https://schema.org/InStock",
      priceCurrency: "USD",
      areaServed: "New Jersey",
      itemOffered: {
        "@type": "Service",
        name: "Clase inicial de diagnóstico y recomendación",
      },
    },
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Cursos destacados AiT USA Institute",
    itemListElement: schemaCourses,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${websiteUrl}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: websiteUrl },
      { "@type": "ListItem", position: 2, name: "Cursos", item: `${websiteUrl}#cursos` },
      { "@type": "ListItem", position: 3, name: "Horario", item: `${websiteUrl}#horarios` },
      { "@type": "ListItem", position: 4, name: "Contacto", item: `${websiteUrl}#contacto` },
    ],
  };

  const firstLocation = (site.locations || [])[0];
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.name,
    foundingDate: site.founded,
    image: seoImage,
    "@id": `${websiteUrl}`,
    url: websiteUrl,
    telephone: site.phone,
    email: site.email,
    priceRange: "$",
    address: firstLocation
      ? {
          "@type": "PostalAddress",
          streetAddress: firstLocation.streetAddress,
          addressLocality: firstLocation.addressLocality,
          addressRegion: firstLocation.addressRegion,
          postalCode: firstLocation.postalCode,
          addressCountry: firstLocation.addressCountry || "US",
        }
      : undefined,
    geo: firstLocation?.geo
      ? {
          "@type": "GeoCoordinates",
          latitude: firstLocation.geo.latitude,
          longitude: firstLocation.geo.longitude,
        }
      : undefined,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "08:20",
        closes: "22:00",
      },
    ],
    sameAs: [site.facebookHref].filter(Boolean),
    paymentAccepted: ["Cash", "Credit Card"],
    areaServed: "New Jersey",
  };

  setSchema("organization", organizationSchema);
  setSchema("webpage", webpageSchema);
  setSchema("video", videoSchema);
  setSchema("website", websiteSchema);
  setSchema("service", serviceSchema);
  setSchema("itemlist", itemListSchema);
  setSchema("breadcrumb", breadcrumbSchema);
  setSchema("localbusiness", localBusinessSchema);
};

const toAbsoluteSiteUrl = (value) => {
  if (!value) return "";
  if (/^(https?:|mailto:|tel:)/i.test(value)) return value;

  try {
    return new URL(value, site.canonical || window.location.href).toString();
  } catch {
    return value;
  }
};

const syncSeoHead = () => {
  const setContent = (selector, value) => {
    if (!value) return;
    const node = document.querySelector(selector);
    if (node) {
      node.setAttribute("content", value);
    }
  };

  const setHref = (selector, value) => {
    if (!value) return;
    const node = document.querySelector(selector);
    if (node) {
      node.setAttribute("href", value);
    }
  };

  const canonical = site.canonical || `${window.location.origin}/`;
  const seoTitle = `${site.seoTitle || `${site.name} | ${site.heroHeadline}`}`.trim();
  const seoDescription = site.seoDescription || site.description || "";
  const seoImage = toAbsoluteSiteUrl(site.seoImage || site.images?.heroPoster || site.images?.hero);
  const seoVideo = toAbsoluteSiteUrl(site.seoVideo || site.heroVideo || site.images?.heroVideo);
  const seoImageAlt = site.seoImageAlt || `${site.name} en clase real.`;
  const seoKeywords = site.seoKeywords || "";
  const seoVideoDuration = site.seoVideoDuration || "PT1M8S";
  const seoVideoSeconds = (() => {
    const minutesMatch = seoVideoDuration.match(/PT(?:(\d+)M)?(?:(\d+)S)?/i);
    if (!minutesMatch) return "68";

    const minutes = Number(minutesMatch[1] || 0);
    const seconds = Number(minutesMatch[2] || 0);
    return String(minutes * 60 + seconds);
  })();

  const setMeta = (selector, attributes) => {
    const existing = document.querySelector(selector);
    const node = existing || document.createElement("meta");
    if (!existing) document.head.appendChild(node);

    Object.entries(attributes).forEach(([key, value]) => {
      if (value) node.setAttribute(key, String(value));
    });
  };

  const ensurePreload = (href, as, type) => {
    if (!href) return;
    const already = [...document.querySelectorAll('link[rel="preload"]')].some((link) => link.getAttribute("href") === href && link.getAttribute("as") === as);
    if (already) return;

    const link = document.createElement("link");
    link.rel = "preload";
    link.as = as;
    link.href = href;
    if (type) link.type = type;
    document.head.appendChild(link);
  };

  const titleNode = document.querySelector("title");
  if (titleNode && seoTitle) {
    titleNode.textContent = seoTitle;
  }

  setContent('meta[name="description"]', seoDescription);
  setContent('meta[name="keywords"]', seoKeywords);
  setContent('meta[property="og:title"]', seoTitle);
  setContent('meta[property="og:description"]', seoDescription);
  setContent('meta[property="og:url"]', canonical);
  setContent('meta[property="og:image"]', seoImage);
  setContent('meta[property="og:image:secure_url"]', seoImage);
  setContent('meta[property="og:image:alt"]', seoImageAlt);
  setContent("meta[property='og:video']", seoVideo);
  setContent("meta[property='og:video:secure_url']", seoVideo);
  setContent("meta[property='og:video:duration']", site.seoVideoDuration || "PT1M8S");
  setContent("meta[name='twitter:card']", "summary_large_image");
  setContent("meta[name='twitter:title']", seoTitle);
  setContent("meta[name='twitter:description']", seoDescription);
  setContent("meta[name='twitter:image']", seoImage);
  setContent("meta[name='twitter:image:alt']", seoImageAlt);
  setContent("meta[name='twitter:site']", site.twitterHandle || "@AiTUSA_Institute");
  setContent("meta[name='twitter:creator']", site.twitterHandle || "@AiTUSA_Institute");
  setContent("meta[name='twitter:label1']", "Objetivo");
  setContent("meta[name='twitter:data1']", "Rutas de inglés en Nueva Jersey");
  setContent("meta[name='twitter:label2']", "Duración");
  setContent("meta[name='twitter:data2']", "1:08");

  setHref("link[rel='canonical']", canonical);
  setHref("link[rel='alternate'][hreflang='es-US']", canonical);
  setHref("link[rel='alternate'][hreflang='x-default']", canonical);

  setMeta("meta[property='og:video:type']", { property: "og:video:type", content: "video/mp4" });
  setMeta("meta[property='og:video:width']", { property: "og:video:width", content: "1920" });
  setMeta("meta[property='og:video:height']", { property: "og:video:height", content: "1080" });
  setMeta("meta[property='og:video:duration']", { property: "og:video:duration", content: seoVideoSeconds });
  setMeta("meta[property='og:site_name']", { property: "og:site_name", content: site.name });
  setMeta("meta[property='og:locale']", { property: "og:locale", content: "es_US" });
  setMeta("meta[name='robots']", { name: "robots", content: "index, follow" });
  setMeta("meta[name='googlebot']", { name: "googlebot", content: "index, follow" });

  ensurePreload(heroVideoSources[0], "video", "video/mp4");
  ensurePreload(seoImage, "image");
};

const initFaqAccordion = () => {
  const faqItems = [...document.querySelectorAll(".faq-list .faq-item")];
  if (!faqItems.length) return;
  let userOpenedFaq = false;

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
    item.querySelector("summary")?.addEventListener("click", () => {
      userOpenedFaq = true;
    });

    item.addEventListener("toggle", () => {
      const activeIndex = getActiveFaqIndex();

      if (activeIndex === -1) {
        setOnlyOneOpen(0);
      } else {
        setOnlyOneOpen(activeIndex);
      }

      const finalIndex = getActiveFaqIndex();
      const hash = `#pregunta-${finalIndex + 1}`;
      const shouldSyncHash = userOpenedFaq || window.location.hash.startsWith("#pregunta-");
      if (shouldSyncHash && window.location.hash !== hash) {
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
    ${(heroVideoHighlights?.length
      ? heroVideoHighlights
      : [
          "Clase real grabada",
          "Corrección en vivo",
          "Sin costo de consulta inicial",
          "Formato híbrido y presencial",
        ]
    )
      .map((text) => `<span>${text}</span>`)
      .join("")}
  </div>
`;

const heroIntentCards = () => `
  <div class="hero__intent" aria-label="¿Qué objetivo tienes hoy?">
    <a class="hero__intent-card" href="#experiencia" data-intent-card data-intent="classSample">
      <span class="hero__intent-card__label">Clase real en 1:08</span>
      <strong>Validar método y ritmo en vivo</strong>
    </a>
    <a class="hero__intent-card" href="#horarios" data-intent-card data-intent="scheduleFlex">
      <span class="hero__intent-card__label">Necesito empezar esta semana</span>
      <strong>Comparar opciones con mi agenda real</strong>
    </a>
    <a class="hero__intent-card" href="#contacto" data-intent-card data-intent="familySupport">
      <span class="hero__intent-card__label">Ruta familiar para mi hijo o hija</span>
      <strong>Decidir con menos incertidumbre desde hoy</strong>
    </a>
  </div>
`;

const heroCommitment = () => `
  <div class="hero__commitment" aria-label="Compromiso de calidad del hero">
    <article>
      <strong>Clases reales primero</strong>
      <span>Ves una clase real para validar si el método funciona para ti sin adivinar.</span>
    </article>
    <article>
      <strong>Decisión en 60 segundos</strong>
      <span>En 1–2 pasos: reproduce el clip, valida horario y recibe una sugerencia inicial.</span>
    </article>
    <article>
      <strong>Rutas listas para arrancar</strong>
      <span>Objetivo, horario y formato preparados para que comiences con criterio.</span>
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
    classSample: "Ver clase real",
    scheduleFlex: "Ver horarios",
    familySupport: "Recibir ruta familiar",
  };
  const pathSecondaryLabel = {
    classSample: "sin vueltas",
    scheduleFlex: "con agenda real",
    familySupport: "para tu familia",
  };

  return `
    <section id="ruta" class="section section--path section--white" aria-labelledby="ruta-title">
      <div class="section-inner section-heading section-heading--compact">
        <p class="section-kicker">Ruta de arranque</p>
        <h2 id="ruta-title">Tres pasos simples para decidir con criterio hoy.</h2>
        <p>Primero observas una clase real, luego validamos agenda y objetivo, y finalmente definimos una ruta que sí puedas ejecutar.</p>
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
                >${pathIntentsLabel[pathIntents[index]] || "Definir mi ruta"} · ${pathSecondaryLabel[pathIntents[index]] || "ruta inicial"}</a>
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
    { value: "1:08", label: "clase real para validar método y ritmo" },
    { value: "100%", label: "corrección personalizada en vivo, no scripts" },
    { value: "Video local", label: "calidad HD sin redirecciones ni enlaces rotos" },
  ];
  const steps = [
    {
      title: "Verifica el estilo de clase",
      description:
        "Observa inicio, dinámica y cierre en un solo clip para confirmar si el ritmo de trabajo te resulta natural.",
    },
    {
      title: "Compara formato y agenda",
      description:
        "Decide entre presencial, híbrido y online con base en tu tiempo real, no en una promesa genérica.",
    },
    {
      title: "Pide tu ruta inicial",
      description:
        "Solicita ruta inicial personalizada para empezar esta semana si el método te encaja de verdad.",
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
          <h2 id="experiencia-title">Mira la clase real primero y decide con criterio en menos de un minuto.</h2>
          <p>
            Te mostramos una clase real de alta calidad para que veas rápidamente si el método, el ritmo y el enfoque de
            corrección realmente encajan contigo antes de avanzar.
          </p>
          <ul class="spotlight-points">
            ${joinList([
              "La clase se muestra completa y contextual, no un fragmento aislado.",
              "La instructora corrige pronunciación y estructura en vivo para que avances sin adivinar.",
              "La metodología visual te deja una decisión clara sin esperar semanas para validar.",
            ])}
          </ul>
          <blockquote class="spotlight-quote">
            “Con esta clase vimos el estilo real: ritmo práctico, corrección puntual y una dinámica clara para empezar sin miedo.”
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
            <a class="button button--primary" href="${site.whatsappHref}?text=${contactMessage}">Quiero mi ruta inicial hoy</a>
            <a class="button button--ghost" href="#cursos">Ver modalidades y precios</a>
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
            <p class="hero__media-route__title">Primero mira la clase real</p>
            <p class="hero__media-route__copy">Después comparas ritmo, formato y encaje con menos incertidumbre.</p>
          </div>
          <button class="hero__video-chip" type="button" data-hero-play-button aria-label="Reproducir video de clase real">
            <span class="hero__video-chip-icon" aria-hidden="true">▶</span>
            <span class="hero__video-chip__label" data-hero-play-label>Ver clase real en HD</span>
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
  const heroPlayButtonLabel = heroPlayButton?.querySelector("[data-hero-play-label]");
  const heroPlayButtonIcon = heroPlayButton?.querySelector(".hero__video-chip-icon");

  if (!heroVideo || !heroPlayButton) return;

  const setPlayState = (isPlaying) => {
    if (!heroPlayButtonLabel) return;
    heroPlayButtonLabel.textContent = isPlaying ? "Pausar clase real" : "Ver clase real en HD";
    if (heroPlayButtonIcon) heroPlayButtonIcon.textContent = isPlaying ? "⏸" : "▶";
    heroPlayButton.setAttribute("aria-pressed", String(isPlaying));
  };

  const handlePlayFailure = () => {
    if (!heroPlayButtonLabel) {
      heroPlayButton.textContent = "Toca aquí para reproducir";
      return;
    }

    heroPlayButtonLabel.textContent = "Toca aquí para reproducir";
    if (heroPlayButtonIcon) heroPlayButtonIcon.textContent = "▶";
    heroPlayButton.setAttribute("aria-pressed", "false");
  };

  const syncPlayState = () => setPlayState(!heroVideo.paused);

  heroVideo.addEventListener("play", syncPlayState);
  heroVideo.addEventListener("pause", syncPlayState);
  heroVideo.addEventListener("ended", () => setPlayState(false));
  heroVideo.addEventListener("loadedmetadata", syncPlayState);

  heroPlayButton.addEventListener("click", () => {
    if (heroVideo.paused) {
      heroVideo.play().catch(handlePlayFailure);
      return;
    }

    heroVideo.pause();
    syncPlayState();
  });

  syncPlayState();
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
    <a
      class="header-cta"
      href="#experiencia"
      data-intent-action
      data-intent="classSample"
      aria-label="Ver la clase real antes de escribir por WhatsApp"
    >Ver clase real en 1:08</a>
  </header>

  <div class="quick-cta" aria-label="Acciones rápidas de inicio">
    <a
      class="button button--primary"
      href="#experiencia"
      data-intent-action
      data-intent="classSample"
    >Ver clase real y comparar</a>
    <a
      class="button button--ghost"
      href="${site.whatsappHref}?text=${contactMessage}"
      data-intent-action
      data-intent="default"
    >Quiero ruta inicial por WhatsApp</a>
  </div>

    <main>
      <section id="inicio" class="hero" style="--hero-image: url('${heroBackgroundImage}')">
      ${heroVideoBackground()}
      <div class="hero__inner">
        <div class="hero__content">
          <p class="section-kicker">${site.tagline}</p>
          <h1>${site.heroHeadline || site.name}</h1>
          <p class="hero__lead">${site.heroLead || site.description}</p>
          <div class="hero__actions">
            <a
              class="button button--primary"
              href="#experiencia"
              data-intent-action
              data-intent="classSample"
            >Ver clase real de 1:08</a>
            <a
              class="button button--ghost"
              href="${site.whatsappHref}?text=${contactMessage}"
              data-intent-action
              data-intent="default"
            >Hablar con un asesor</a>
          </div>
          ${heroQuickCaptureWidget()}
          ${heroIntentCards()}
          <p class="hero__microcopy">
            ${site.heroMicrocopy || "Empieza en 60 segundos: mira una clase real, valida ritmo y decide con menos incertidumbre."}
          </p>
          <div class="hero__conversion-strip">
            <a class="button button--primary" href="#contacto" data-intent-action data-intent="default">Recibir ruta inicial ahora</a>
            <a class="button button--ghost" href="#horarios" data-intent-action data-intent="scheduleFlex">Ver horarios según mi agenda</a>
          </div>
          <div class="hero__highlights" aria-label="Beneficios">
            ${(site.heroHighlights || site.heroHighlight || [])
              .map((copy) => `<span>${copy}</span>`)
              .join("")}
          </div>
        </div>
        <div class="hero__media">
          ${heroMedia()}
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
          <h2 id="reel-title">Clase real, corrección visible y energía de clase que se siente en directo.</h2>
          <p>
            Mira cómo trabaja el aula en vivo: conversación real, corrección puntual y acompañamiento. Así validas si este
            formato encaja con tu meta y tu ritmo antes de inscribirte.
          </p>
          <ul class="reel-copy__points" aria-label="Lo que muestran los clips">
            <li>Video real de clase, sin simulaciones ni promesas vacías.</li>
            <li>Corrección puntual y seguimiento aplicado desde el primer bloque.</li>
            <li>Momentos de aula, Zoom y conversación guiada para comparar estilos con claridad.</li>
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
          <h2 id="diferente-title">Una ruta visual para entender rápido, hablar con precisión y avanzar con confianza.</h2>
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
        <h2 id="cursos-title">En menos de 45 segundos, identifica tu ruta de curso.</h2>
        <p>Comparamos inglés para vida diaria y trabajo, apoyo académico y tecnología práctica para que halles la opción más funcional para tu rutina.</p>
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
      <div class="section-inner split method-shell">
        <div class="method-copy">
          <p class="section-kicker">Cómo enseñamos</p>
          <h2 id="metodo-title">Comprender. Practicar. Hablar. Repetir.</h2>
          <p>
            Te mostramos una clase real, corregimos en vivo y luego te damos una ruta concreta por nivel y horario para
            avanzar con menos incertidumbre.
          </p>
          <ul class="method-points" aria-label="Lo que verás en el método">
            ${joinList([
              "Clase real primero para validar el enfoque antes de inscribirte.",
              "Corrección visible mientras hablas para no arrastrar errores.",
              "Apoyo flexible y rutas por nivel para sostener tu progreso.",
            ])}
          </ul>
        </div>
        <div class="method-list">
          ${methodBlocks
            .map(
              (block, index) => `
                <article class="method-item ${index === 0 ? "method-item--featured" : ""}">
                  <img src="${block.image}" alt="${block.imageAlt}" loading="lazy" />
                  <div>
                    <span class="method-item__step">${String(index + 1).padStart(2, "0")}</span>
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

    <section id="about" class="section section--white" aria-labelledby="about-title">
      <div class="section-inner about-grid">
        <div class="about-copy">
          <p class="section-kicker">Quiénes somos</p>
          <h2 id="about-title">Una escuela de Nueva Jersey enfocada en inglés práctico y resultados visibles.</h2>
          <p>
            Con más de 20 años de experiencia, acompañamos a estudiantes en Estados Unidos y en línea con una metodología
            visual, práctica y orientada a conversación real para avanzar con confianza desde el inicio.
          </p>
          <div class="about-note">
            <strong>Lo que cambia desde la primera semana</strong>
            <p>
              Dejamos la teoría suelta y pasamos a práctica guiada para que avances con menos incertidumbre, más continuidad
              y criterio para decidir si esta modalidad es la correcta para ti.
            </p>
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
        <h2 id="testimonios-title">Antes de inscribirte, valida que este método realmente te encaje.</h2>
        <p>
          Revisamos experiencia real, no promesas. Aquí ves clases visibles, corrección en vivo y una ruta concreta para
          decidir con evidencia y avanzar con más claridad.
        </p>
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
          <div class="trust-feature-grid" aria-label="Momentos reales de clase">
            ${trustFeature
              .map(
                (feature, index) => `
                  <article class="trust-feature-card ${index === 0 ? "trust-feature-card--featured" : ""}">
                    <img src="${feature.image}" alt="${feature.imageAlt}" loading="lazy" />
                    <div class="trust-feature-card__overlay">
                      <p class="section-kicker">Lo que ves en clase</p>
                      <h3>${feature.title}</h3>
                      <p>${feature.copy}</p>
                      <div class="trust-feature-card__chips" aria-label="Detalle de la experiencia">
                        ${feature.chips.map((chip) => `<span>${chip}</span>`).join("")}
                      </div>
                    </div>
                  </article>
                `,
              )
              .join("")}
          </div>
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
                    <p class="testimonial-card__quote">${item.text}</p>
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
        <h2 id="downloads-title">Llega con tu equipo, audio y material listos para la primera clase.</h2>
        <p>Si estudias online o híbrido, te guiamos para entrar sin tropiezos y con una rutina que sí te deja avanzar.</p>
      </div>
      <div class="section-inner utility-strip">
        <article>
          <strong>Tu pantalla, tu ritmo</strong>
          <span>Laptop, tablet o móvil para entrar desde donde ya estudias.</span>
        </article>
        <article>
          <strong>Sin vueltas técnicas</strong>
          <span>Te ayudamos a abrir la clase y el material sin configuración pesada.</span>
        </article>
        <article>
          <strong>Seguimiento claro</strong>
          <span>Cada recurso queda alineado con tu nivel y tu siguiente paso.</span>
        </article>
      </div>
      <div class="section-inner download-grid">
        ${downloads
          .map(
            (item) => `
              <article class="download-card">
                <img src="${item.image}" alt="${item.imageAlt}" loading="lazy" />
                <div class="download-card__body">
                  <p class="download-card__eyebrow">${item.eyebrow}</p>
                  <h3>${item.title}</h3>
                  <p>${item.text}</p>
                </div>
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
                <div class="requirement__body">
                  <p class="requirement__eyebrow">${item.eyebrow}</p>
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
        <h2 id="pagos-title">Invierte en la ruta que mueve tu meta sin distracciones.</h2>
        <p>Si ya sabes lo que buscas, ve directo al plan; si estás comparando opciones, aquí te ayudamos a elegir sin ruido.</p>
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
          <h2 id="faq-title">Resolvemos tus dudas para que avances con velocidad.</h2>
          <p>Antes de decidir, te mostramos las respuestas que más definen si esta ruta encaja con tu rutina y tus metas.</p>
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
                ${faq.outcome ? `<p class="faq-item__outcome"><strong>Resultado:</strong> ${faq.outcome}</p>` : ""}
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
          <h2 id="contacto-title">Cuéntanos tu meta y armamos tu ruta inicial en minutos.</h2>
          <p>
            Completa el formulario y en pocos minutos te proponemos nivel, horario y formato ideal para empezar sin fricción.
            Si prefieres, primero mira la clase real y luego te ayudamos a avanzar con una decisión mucho más precisa.
          </p>
          <p class="contact-quick-intent__label">Elige tu prioridad y te preparamos el mensaje inicial exacto:</p>
          <div class="contact-quick-intent" role="group" aria-label="Prioridad para iniciar">
            <button class="contact-quick-intent__chip" type="button" data-contact-intent-quick="classSample">Clase real primero</button>
            <button class="contact-quick-intent__chip" type="button" data-contact-intent-quick="scheduleFlex">Horario para empezar</button>
            <button class="contact-quick-intent__chip" type="button" data-contact-intent-quick="familySupport">Ruta familiar</button>
            <button class="contact-quick-intent__chip" type="button" data-contact-intent-quick="default">Aún no decido</button>
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
          <p class="form-required-note">Campos obligatorios: nombre, apellido, teléfono y ciudad.</p>
          <div class="form-row">
            <label>Nombre <input name="nombre" autocomplete="given-name" placeholder="Tu nombre" required /></label>
            <label>Apellido <input name="apellido" autocomplete="family-name" placeholder="Tu apellido" required /></label>
          </div>
          <label>Email (opcional) <input name="email" type="email" autocomplete="email" placeholder="tucorreo@ejemplo.com" /></label>
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
initHeroQuickCaptureBridge();

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
  syncCoreSchemas();
syncSeoHead();

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  const nextState = !isOpen;
  menuToggle.setAttribute("aria-expanded", String(nextState));
  menuToggle.setAttribute("aria-label", nextState ? "Cerrar menú" : "Abrir menú");
  navEl.classList.toggle("is-open", nextState);
  document.body.classList.toggle("menu-open", nextState);
});

window.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || !navEl?.classList.contains("is-open")) {
    return;
  }
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menú");
  navEl.classList.remove("is-open");
  document.body.classList.remove("menu-open");
});

navEl.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    setActiveNav(event.target.dataset.navLink);
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menú");
    navEl.classList.remove("is-open");
    document.body.classList.remove("menu-open");
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
    const targetHash = rawTarget.trim() || "#contacto";
    const intent = trigger.dataset.intent || "default";
    const isExternal = /^https?:\/\//i.test(targetHash);
    const isHashTarget = targetHash.startsWith("#");
    const targetSection = isHashTarget ? document.querySelector(targetHash) : null;

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
    } else if (isHashTarget && targetSection) {
      targetSection.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      if (targetHash === "#contacto") {
        const nameInput = form?.querySelector('input[name="nombre"]');
        if (nameInput) {
          nameInput.focus({ preventScroll: true });
        }
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

