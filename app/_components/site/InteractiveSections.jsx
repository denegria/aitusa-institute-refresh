"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { communityGallery, courseCatalog, faqs, site, testimonials } from "../../../src/content";
import { admissionContext, admissionMessage, admissionOptions } from "../../../src/admissions.js";

const COMMUNITY_TAB_CYCLE_MS = 8000;
const COMMUNITY_PHOTO_CYCLE_MS = 2600;

const SPANISH_SPEAKING_COUNTRIES = [
  { name: "Argentina", src: "/assets/flags/ar.svg" },
  { name: "Bolivia", src: "/assets/flags/bo.svg" },
  { name: "Chile", src: "/assets/flags/cl.svg" },
  { name: "Colombia", src: "/assets/flags/co.svg" },
  { name: "Costa Rica", src: "/assets/flags/cr.svg" },
  { name: "Cuba", src: "/assets/flags/cu.svg" },
  { name: "Ecuador", src: "/assets/flags/ec.svg" },
  { name: "El Salvador", src: "/assets/flags/sv.svg" },
  { name: "España", src: "/assets/flags/es.svg" },
  { name: "Guatemala", src: "/assets/flags/gt.svg" },
  { name: "Guinea Ecuatorial", src: "/assets/flags/gq.svg" },
  { name: "Honduras", src: "/assets/flags/hn.svg" },
  { name: "México", src: "/assets/flags/mx.svg" },
  { name: "Nicaragua", src: "/assets/flags/ni.svg" },
  { name: "Panamá", src: "/assets/flags/pa.svg" },
  { name: "Paraguay", src: "/assets/flags/py.svg" },
  { name: "Perú", src: "/assets/flags/pe.svg" },
  { name: "Puerto Rico", src: "/assets/flags/pr.svg" },
  { name: "República Dominicana", src: "/assets/flags/do.svg" },
  { name: "Uruguay", src: "/assets/flags/uy.svg" },
  { name: "Venezuela", src: "/assets/flags/ve.svg" },
];

const communityPhotoClassName = (photo) => [
  photo.tone === "warm" ? "community-proof__image--warm" : "",
  photo.category === "celebrations" ? "community-proof__image--celebration" : "",
  photo.fit === "contain" ? "community-proof__image--contain" : "",
].filter(Boolean).join(" ") || undefined;

export function MethodVideo({ narrative }) {
  const enterMobileFullscreen = (event) => {
    const video = event.currentTarget;
    if (!window.matchMedia("(max-width: 719px)").matches) return;
    if (document.fullscreenElement === video || video.webkitDisplayingFullscreen) return;
    if (typeof video.webkitEnterFullscreen === "function") {
      try {
        video.webkitEnterFullscreen();
      } catch {
        // Mobile Safari still uses its native player when inline playback is omitted.
      }
    } else {
      video.requestFullscreen?.().catch?.(() => {});
    }
  };

  return (
    <figure className="method-story__media">
      <div className="method-story__video-frame">
        <video
          className="method-story__video"
          controls
          preload="metadata"
          width={narrative.videoWidth || 464}
          height={narrative.videoHeight || 832}
          poster={narrative.videoPoster}
          aria-label={narrative.videoAriaLabel || "Conoce el método completo"}
          data-method-video
          onPlay={enterMobileFullscreen}
        >
          <source src={narrative.video} type="video/mp4" />
        </video>
      </div>
      <figcaption>
        <i data-lucide="circle-play" aria-hidden="true" />
        <span>{narrative.videoLabel || "Conoce el método completo · 1:45"}</span>
      </figcaption>
    </figure>
  );
}

export function TestimonialsSection() {
  const shortLabels = {
    Jessica: "Jessica",
    "Testimonio internacional": "Experiencia internacional",
    Eric: "Eric",
  };
  const orderedStories = [
    testimonials.find((item) => item.name === "Jessica"),
    ...testimonials.filter((item) => item.name !== "Jessica"),
  ].filter(Boolean);
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const activeStory = orderedStories[activeStoryIndex] || orderedStories[0];

  useEffect(() => {
    window.lucide?.createIcons?.();
  }, [activeStoryIndex]);

  const openStory = (index, trigger) => {
    if (!dialogRef.current?.showModal) return;
    triggerRef.current = trigger;
    setActiveStoryIndex(index);
    dialogRef.current.showModal();
    document.documentElement.classList.add("has-proof-dialog");
  };

  const closeStory = () => dialogRef.current?.close();
  const closeStoryCleanup = () => {
    dialogRef.current?.querySelector("video")?.pause();
    document.documentElement.classList.remove("has-proof-dialog");
    triggerRef.current?.focus();
  };

  return (
    <section className="section testimonials-section" id="testimonios" aria-labelledby="testimonials-title">
      <div className="section-inner testimonials-section__inner">
        <header className="section-heading section-heading--framed testimonials-section__heading">
          <p className="section-kicker">Testimonios</p>
          <h2 id="testimonials-title">Historias que se cuentan en primera persona.</h2>
          <p>Escucha a estudiantes y docentes contar qué cambia cuando el método y el acompañamiento se sienten reales.</p>
        </header>

        <div className="testimonials-grid">
          {orderedStories.map((story, index) => (
            <button
              className="testimonial-card"
              type="button"
              key={story.video}
              onClick={(event) => openStory(index, event.currentTarget)}
              aria-label={`Ver entrevista en inglés con ${shortLabels[story.name] || story.name}`}
            >
              <span className="testimonial-card__media">
                <Image
                  src={story.videoPoster || story.image}
                  alt=""
                  fill
                  sizes="(max-width: 719px) 100vw, (max-width: 1040px) 50vw, 33vw"
                  style={{ objectPosition: story.posterPosition }}
                />
                <span className="testimonial-card__shade" aria-hidden="true" />
                <span className="community-proof__play" aria-hidden="true"><i data-lucide="play" /></span>
                <span className="testimonial-card__duration">{story.duration}</span>
              </span>
              <span className="testimonial-card__copy">
                <span>{story.result}</span>
                <strong>{shortLabels[story.name] || story.name}</strong>
                <small>{story.headline}</small>
              </span>
            </button>
          ))}
        </div>

        <aside className="country-proof" aria-labelledby="country-proof-title">
          <div className="country-proof__copy">
            <span>Una comunidad sin fronteras</span>
            <strong id="country-proof-title">Estudiantes de todo el mundo han aprendido con AIT USA.</strong>
          </div>
          <ul className="country-proof__flags" aria-label="Países hispanohablantes de nuestra comunidad">
            {SPANISH_SPEAKING_COUNTRIES.map((country) => (
              <li key={country.name} title={country.name}>
                <Image
                  src={country.src}
                  alt={`Bandera de ${country.name}`}
                  width={36}
                  height={27}
                  unoptimized
                  loading="lazy"
                  decoding="async"
                />
              </li>
            ))}
          </ul>
        </aside>

        <dialog
          className="proof-dialog testimonial-dialog"
          aria-labelledby="testimonial-dialog-title"
          ref={dialogRef}
          onClose={closeStoryCleanup}
          onClick={(event) => {
            if (event.target === dialogRef.current) closeStory();
          }}
        >
          <div className="proof-dialog__shell">
            <button className="proof-dialog__close" type="button" onClick={closeStory} aria-label="Cerrar testimonio">
              <i data-lucide="x" aria-hidden="true" />
            </button>
            <div className="proof-dialog__media">
              <div className="proof-dialog__video-frame">
                <video
                  key={activeStory.video}
                  controls
                  playsInline
                  preload="metadata"
                  src={activeStory.video}
                  poster={activeStory.videoPoster || activeStory.image}
                  width={activeStory.videoWidth || 16}
                  height={activeStory.videoHeight || 9}
                  aria-label={shortLabels[activeStory.name] || activeStory.name}
                  aria-describedby="testimonial-dialog-description"
                  data-testimonial-dialog-video
                />
              </div>
            </div>
            <div className="proof-dialog__footer">
              <div className="proof-dialog__copy">
                <span>{activeStory.result} · {activeStory.duration || ""}</span>
                <h3 id="testimonial-dialog-title">{shortLabels[activeStory.name] || activeStory.name}</h3>
                <p id="testimonial-dialog-description">{activeStory.headline || activeStory.text}</p>
                <p className="video-access-note">Subtítulos y transcripción aún no disponibles.</p>
              </div>
              <div className="proof-dialog__nav" aria-label="Cambiar testimonio">
                <button type="button" onClick={() => setActiveStoryIndex((activeStoryIndex - 1 + orderedStories.length) % orderedStories.length)}>
                  <i data-lucide="arrow-left" aria-hidden="true" /><span>Anterior</span>
                </button>
                <button type="button" onClick={() => setActiveStoryIndex((activeStoryIndex + 1) % orderedStories.length)}>
                  <span>Siguiente</span><i data-lucide="arrow-right" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </dialog>
      </div>
    </section>
  );
}

export function ProofStories() {
  const sectionRef = useRef(null);
  const imageDialogRef = useRef(null);
  const triggerRef = useRef(null);
  const pauseTimerRef = useRef(null);
  const [activeTab, setActiveTab] = useState("classroom");
  const [mediaCycleIndex, setMediaCycleIndex] = useState(0);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [lightboxTab, setLightboxTab] = useState("graduations");
  const [isInView, setIsInView] = useState(false);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const [interactionPaused, setInteractionPaused] = useState(false);
  const [manuallyPaused, setManuallyPaused] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const tabMeta = {
    graduations: {
      eyebrow: "Graduaciones",
    },
    classroom: {
      eyebrow: "En clase",
    },
    celebrations: {
      eyebrow: "Celebraciones",
    },
    "community-service": {
      eyebrow: "Servicio comunitario",
    },
  };

  const photosForTab = communityGallery[activeTab] || [];
  const photoAutoRotates = activeTab === "graduations" || activeTab === "celebrations";
  const activePhotoCycleIndex = photosForTab.length && photoAutoRotates
    ? mediaCycleIndex % photosForTab.length
    : 0;
  const activePhotoCycle = photosForTab[activePhotoCycleIndex] || communityGallery.graduations[0];
  const sidePhotoCount = activeTab === "classroom" ? 1 : 2;
  const sidePhotos = Array.from({ length: sidePhotoCount }, (_, offset) => {
    const index = photosForTab.length ? (activePhotoCycleIndex + offset + 1) % photosForTab.length : 0;
    return { photo: photosForTab[index], index };
  }).filter((item) => item.photo);
  const lightboxPhotos = communityGallery[lightboxTab] || communityGallery.graduations;
  const activePhoto = lightboxPhotos[activePhotoIndex] || lightboxPhotos[0];

  const pauseAfterInteraction = () => {
    setInteractionPaused(true);
    window.clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = window.setTimeout(() => setInteractionPaused(false), 12000);
  };

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(media.matches);
    updatePreference();
    media.addEventListener?.("change", updatePreference);
    return () => media.removeEventListener?.("change", updatePreference);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !("IntersectionObserver" in window)) {
      setIsInView(true);
      return undefined;
    }

    const bounds = section.getBoundingClientRect();
    setIsInView(bounds.bottom > 0 && bounds.top < window.innerHeight);

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.02 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView || hoverPaused || focusPaused || interactionPaused || manuallyPaused || prefersReducedMotion) return undefined;
    const timer = window.setInterval(() => {
      setActiveTab((currentTab) => {
        const currentIndex = communityGallery.tabs.findIndex((tab) => tab.id === currentTab);
        return communityGallery.tabs[(currentIndex + 1) % communityGallery.tabs.length].id;
      });
      setActivePhotoIndex(0);
    }, COMMUNITY_TAB_CYCLE_MS);
    return () => window.clearInterval(timer);
  }, [focusPaused, hoverPaused, interactionPaused, manuallyPaused, isInView, prefersReducedMotion]);

  useEffect(() => {
    if (
      !photoAutoRotates
      || !isInView
      || hoverPaused
      || focusPaused
      || interactionPaused
      || manuallyPaused
      || prefersReducedMotion
    ) return undefined;

    const timer = window.setInterval(() => {
      setMediaCycleIndex((index) => index + 1);
    }, COMMUNITY_PHOTO_CYCLE_MS);
    return () => window.clearInterval(timer);
  }, [focusPaused, hoverPaused, interactionPaused, manuallyPaused, isInView, photoAutoRotates, prefersReducedMotion]);

  useEffect(() => {
    window.lucide?.createIcons?.();
  }, [activePhotoIndex, activeTab, mediaCycleIndex]);

  useEffect(
    () => () => {
      window.clearTimeout(pauseTimerRef.current);
    },
    [],
  );

  const selectTab = (tabId) => {
    setActiveTab(tabId);
    setMediaCycleIndex(0);
    setActivePhotoIndex(0);
    pauseAfterInteraction();
  };

  const handleTabKeyDown = (event, index) => {
    const lastIndex = communityGallery.tabs.length - 1;
    let nextIndex = null;
    if (event.key === "ArrowRight") nextIndex = index === lastIndex ? 0 : index + 1;
    if (event.key === "ArrowLeft") nextIndex = index === 0 ? lastIndex : index - 1;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = lastIndex;
    if (nextIndex === null) return;
    event.preventDefault();
    const nextTab = communityGallery.tabs[nextIndex];
    selectTab(nextTab.id);
    window.requestAnimationFrame(() => document.getElementById(`community-tab-${nextTab.id}`)?.focus());
  };

  const openPhoto = (index, trigger, tabId = activeTab) => {
    const dialog = imageDialogRef.current;
    if (!dialog?.showModal) return;
    triggerRef.current = trigger;
    setLightboxTab(tabId);
    setActivePhotoIndex(index);
    dialog.showModal();
    document.documentElement.classList.add("has-proof-dialog");
  };

  const closeImageDialog = () => imageDialogRef.current?.close();
  const closeImageCleanup = () => {
    document.documentElement.classList.remove("has-proof-dialog");
    triggerRef.current?.focus();
  };

  const showPreviousPhoto = () => {
    setActivePhotoIndex((index) => (index - 1 + lightboxPhotos.length) % lightboxPhotos.length);
  };

  const showNextPhoto = () => {
    setActivePhotoIndex((index) => (index + 1) % lightboxPhotos.length);
  };

  return (
    <section
      className={`section community-proof${isInView ? " is-visible" : ""}`}
      id="experiencia"
      ref={sectionRef}
      data-community-proof
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => setHoverPaused(false)}
      onFocusCapture={() => setFocusPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocusPaused(false);
      }}
    >
      <div className="community-proof__inner">
        <header className="community-proof__heading" style={{ "--reveal-order": 0 }}>
          <span className="chapter-accent" aria-hidden="true" />
          <p className="section-kicker">{communityGallery.eyebrow}</p>
          <h2>{communityGallery.title}</h2>
          <p>{communityGallery.introduction}</p>
        </header>

        <div
          className={`community-proof__tabs${isInView && !hoverPaused && !focusPaused && !interactionPaused && !manuallyPaused && !prefersReducedMotion ? " is-auto-cycling" : ""}`}
          role="tablist"
          aria-label="Explorar experiencias de AIT"
          style={{ "--community-cycle-duration": `${COMMUNITY_TAB_CYCLE_MS}ms`, "--reveal-order": 1 }}
        >
          {communityGallery.tabs.map((tab, index) => (
            <button
              className={activeTab === tab.id ? "is-active" : ""}
              type="button"
              role="tab"
              id={`community-tab-${tab.id}`}
              aria-selected={activeTab === tab.id}
              aria-controls="community-proof-panel"
              tabIndex={activeTab === tab.id ? 0 : -1}
              key={tab.id}
              onClick={() => selectTab(tab.id)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          className="community-proof__stage"
          id="community-proof-panel"
          role="tabpanel"
          aria-labelledby={`community-tab-${activeTab}`}
          key={activeTab}
          style={{ "--reveal-order": 2 }}
        >
          <button
              className="community-proof__feature community-proof__feature--photo"
              type="button"
              key={activePhotoCycle.id}
              onClick={(event) => {
                pauseAfterInteraction();
                openPhoto(activePhotoCycleIndex, event.currentTarget);
              }}
              aria-label={`Ampliar: ${activePhotoCycle.alt}`}
            >
              <Image
                src={activePhotoCycle.src}
                alt=""
                fill
                className={communityPhotoClassName(activePhotoCycle)}
                loading={isInView ? "eager" : "lazy"}
                sizes="(max-width: 719px) calc(100vw - 32px), 48vw"
                style={{ objectPosition: activePhotoCycle.position }}
              />
              <span className="community-proof__media-shade" aria-hidden="true" />
              {photoAutoRotates ? (
                <span className="community-proof__photo-count" aria-hidden="true">
                  {String(activePhotoCycleIndex + 1).padStart(2, "0")} / {String(photosForTab.length).padStart(2, "0")}
                </span>
              ) : null}
            </button>

          <div
            className={`community-proof__mosaic${sidePhotos.length === 1 ? " community-proof__mosaic--single" : ""}`}
            aria-label={`Selección de ${tabMeta[activeTab].eyebrow.toLowerCase()}`}
          >
            {sidePhotos.map(({ photo, index }, tileIndex) => (
                  <button
                    className="community-proof__tile"
                    type="button"
                    key={`${activeTab}-${mediaCycleIndex}-${photo.id}`}
                    style={{ "--tile-order": tileIndex }}
                    onClick={(event) => {
                      pauseAfterInteraction();
                      openPhoto(index, event.currentTarget);
                    }}
                    aria-label={`Ampliar: ${photo.alt}`}
                  >
                    <Image
                      src={photo.src}
                      alt=""
                      fill
                      className={communityPhotoClassName(photo)}
                      sizes="(max-width: 719px) 44vw, 24vw"
                      style={{ objectPosition: photo.position }}
                    />
                  </button>
                ))}
          </div>
        </div>

        {activeTab === "community-service" ? (
          <aside className="community-proof__service-note" aria-label={`Servicio comunitario: ${communityGallery.serviceNote.eyebrow}`}>
            <span className="community-proof__service-note-kicker">{communityGallery.serviceNote.eyebrow}</span>
            <div>
              <h3>{communityGallery.serviceNote.title}</h3>
              <p>{communityGallery.serviceNote.text}</p>
            </div>
          </aside>
        ) : null}

        <div className="community-proof__toolbar">
          <button className="home-secondary-button" type="button" onClick={(event) => openPhoto(0, event.currentTarget)}>
            Ver las {photosForTab.length} fotografías de {tabMeta[activeTab].eyebrow.toLowerCase()}
            <i data-lucide="arrow-right" aria-hidden="true" />
          </button>
          {!prefersReducedMotion ? (
            <button className="community-pause" type="button" aria-pressed={!manuallyPaused} onClick={() => setManuallyPaused((paused) => !paused)}>
              {manuallyPaused ? "Activar avance automático" : "Pausar avance automático"}
            </button>
          ) : <p className="community-pause-note">Galería sin avance automático. Elige una categoría para explorar.</p>}
        </div>

        <dialog
          className="community-lightbox"
          aria-labelledby="community-lightbox-title"
          ref={imageDialogRef}
          onClose={closeImageCleanup}
          onClick={(event) => {
            if (event.target === imageDialogRef.current) closeImageDialog();
          }}
        >
          <div className="community-lightbox__shell">
            <button className="community-lightbox__close" type="button" onClick={closeImageDialog} aria-label="Cerrar fotografía">
              <i data-lucide="x" aria-hidden="true" />
            </button>
            {activePhoto ? (
              <>
                <div className="community-lightbox__media">
                  <Image
                    src={activePhoto.src}
                    alt={activePhoto.alt}
                    fill
                    className={activePhoto.tone === "warm" ? "community-proof__image--warm" : undefined}
                    sizes="(max-width: 719px) calc(100vw - 20px), min(1120px, calc(100vw - 36px))"
                    style={{ objectPosition: activePhoto.position }}
                  />
                </div>
                <footer className="community-lightbox__footer">
                  <div>
                    <span>{tabMeta[lightboxTab]?.eyebrow || "Experiencia AIT"}</span>
                    <p id="community-lightbox-title">{activePhoto.alt}</p>
                    <p className="community-lightbox__count" aria-live="polite">Fotografía {activePhotoIndex + 1} de {lightboxPhotos.length}</p>
                  </div>
                  <nav aria-label="Cambiar fotografía">
                    <button type="button" onClick={showPreviousPhoto} aria-label="Fotografía anterior"><i data-lucide="arrow-left" aria-hidden="true" /></button>
                    <button type="button" onClick={showNextPhoto} aria-label="Fotografía siguiente"><i data-lucide="arrow-right" aria-hidden="true" /></button>
                  </nav>
                </footer>
              </>
            ) : null}
          </div>
        </dialog>
      </div>
    </section>
  );
}

export function FaqList() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="faq-list">
      {faqs.map((faq, index) => (
        <details
          key={faq.question}
          open={openIndex === index}
          onToggle={(event) => {
            if (event.currentTarget.open) setOpenIndex(index);
            else if (openIndex === index) setOpenIndex(null);
          }}
        >
          <summary><span>{faq.question}</span></summary>
          <p>{faq.answer}</p>
          <p className="proof-line">{faq.outcome || ""}</p>
        </details>
      ))}
    </div>
  );
}

export function CallbackDialog({ defaultSubject = "", subjectGroup = "all-offerings", primary = false }) {
  const dialogId = useId();
  const group = courseCatalog.find((item) => item.key === subjectGroup);
  const subjectOptions = group ? admissionOptions.filter((program) => group.programs.includes(program.slug)) : admissionOptions;
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);
  const startedAt = useRef(new Date().toISOString());
  const submissionId = useRef(globalThis.crypto?.randomUUID?.() || `callback-${Date.now()}`);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState(null);

  const openDialog = (event) => {
    triggerRef.current = event.currentTarget;
    dialogRef.current?.showModal();
    document.documentElement.classList.add("has-callback-dialog");
  };
  const closeDialog = () => dialogRef.current?.close();
  const closeCleanup = () => {
    document.documentElement.classList.remove("has-callback-dialog");
    triggerRef.current?.focus();
  };

  const submit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const phone = String(formData.get("telefono") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phoneInput = form.elements.namedItem("telefono");
    const emailInput = form.elements.namedItem("email");

    phoneInput?.setCustomValidity("");
    emailInput?.setCustomValidity("");
    if (!phone && !email) {
      const input = phoneInput || emailInput;
      input?.setCustomValidity("Escribe un teléfono o un email para que podamos contactarte.");
      input?.reportValidity();
      input?.focus();
      return;
    }

    const name = String(formData.get("nombre") || "").trim();
    const subject = String(formData.get("programa") || "");
    const context = admissionContext(subject);
    const subjectLabel = context.title;
    const location = String(formData.get("ubicacion") || "Sin ubicación indicada");
    const preferredSchedule = String(formData.get("mejorHorario") || "Prefiero coordinar");
    const message = [
      "Hola AIT USA, quiero recibir orientación.",
      `Programa: ${subjectLabel}`,
      `Nombre: ${name || "Sin nombre"}`,
      `Sede o modalidad: ${location}`,
      `Mejor momento: ${preferredSchedule}`,
      phone ? `Teléfono: ${phone}` : "",
      email ? `Email: ${email}` : "",
    ].filter(Boolean).join("\n");
    const fallbackUrl = `${site.whatsappHref}?text=${encodeURIComponent(message)}`;
    const payload = {
      formType: "callback_request",
      submissionId: submissionId.current,
      lead: {
        name,
        phone,
        email,
        city: location === "Sin ubicación indicada" ? "" : location,
        interest: context.interest,
        preferredSchedule,
        message: admissionMessage(subject),
      },
      source: {
        path: window.location.pathname || "/",
        referrer: document.referrer || undefined,
      },
      consent: {
        contactPermission: formData.get("contactPermission") === "yes",
        marketingSmsOptIn: false,
        smsConsent: false,
        marketingSmsEvidence: null,
      },
      honeypot: String(formData.get("companyWebsite") || ""),
      startedAt: startedAt.current,
      submittedAt: new Date().toISOString(),
    };

    setStatus({ text: "Enviando tu solicitud…" });
    setBusy(true);
    try {
      const response = await fetch("/api/leads/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await response.json();
      if (!response.ok || !body.ok) throw new Error("invalid_submission");
      submissionId.current = globalThis.crypto?.randomUUID?.() || `callback-${Date.now()}`;
      setStatus({
        text: "Recibimos tu solicitud de orientación. Un asesor podrá contactarte por teléfono o email. ",
        href: body.advisorHandoff.href,
        label: "Abrir WhatsApp",
      });
    } catch {
      setStatus({
        text: "No pudimos confirmar la recepción de tu solicitud. Reintenta o ",
        href: fallbackUrl,
        label: "Escribir directamente por WhatsApp",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="final-cta-contact-row" aria-label="Otra forma de contactarnos">
        <button
          className={primary ? "button button--primary" : "final-cta-contact-link"}
          type="button"
          aria-haspopup="dialog"
          aria-controls={dialogId}
          data-callback-dialog-open
          onClick={openDialog}
        >
          <i data-lucide="message-circle" aria-hidden="true" />
          <span>Solicitar orientación</span>
        </button>
      </div>
      <dialog
        className="callback-dialog"
        id={dialogId}
        aria-labelledby={`${dialogId}-title`}
        ref={dialogRef}
        data-callback-dialog
        onClose={closeCleanup}
        onClick={(event) => {
          if (event.target === dialogRef.current) closeDialog();
        }}
      >
        <div className="callback-dialog__shell">
          <header className="callback-dialog__header">
            <div>
              <p className="section-kicker">Admisiones</p>
              <h3 id={`${dialogId}-title`}>Solicita orientación</h3>
            </div>
            <button className="callback-dialog__close" type="button" aria-label="Cerrar solicitud de orientación" data-callback-dialog-close onClick={closeDialog}>
              <i data-lucide="x" aria-hidden="true" />
            </button>
          </header>
          <div className="callback-dialog__content">
            <p>Indica tu curso y un teléfono o email para que admisiones pueda contactarte. Te ayudaremos a confirmar requisitos y disponibilidad.</p>
            <form className="lead-form" data-lead-form onSubmit={submit} aria-busy={busy}>
              <div className="form-grid callback-form-grid">
                <label>Curso de interés
                  <select name="programa" required defaultValue={defaultSubject}>
                    <option value="" disabled>Selecciona un curso</option>
                    {subjectOptions.map((program) => <option value={program.slug} key={program.slug}>{program.title}</option>)}
                    <option value="orientacion">Necesito ayuda para elegir</option>
                  </select>
                </label>
                <label>Nombre<input name="nombre" type="text" autoComplete="name" required /></label>
                <label>Teléfono<input name="telefono" type="tel" inputMode="tel" autoComplete="tel" onInput={(event) => {
                  event.currentTarget.form.elements.namedItem("telefono")?.setCustomValidity("");
                  event.currentTarget.form.elements.namedItem("email")?.setCustomValidity("");
                }} /></label>
                <label>Email<input name="email" type="email" autoComplete="email" onInput={(event) => {
                  event.currentTarget.form.elements.namedItem("telefono")?.setCustomValidity("");
                  event.currentTarget.form.elements.namedItem("email")?.setCustomValidity("");
                }} /><small>Escribe un teléfono o un email.</small></label>
                <label>
                  Sede o modalidad preferida (opcional)
                  <select name="ubicacion" defaultValue="">
                    <option value="">Sin preferencia</option>
                    <option value="Bound Brook">Bound Brook</option>
                    <option value="Plainfield">Plainfield</option>
                    <option value="Piscataway">Piscataway</option>
                    <option value="Flemington">Flemington con cita previa</option>
                    <option value="Online">Online</option>
                    <option value="No estoy seguro">No estoy seguro</option>
                  </select>
                </label>
                <label>
                  Mejor momento para contactarte
                  <select name="mejorHorario" required defaultValue="">
                    <option value="">Selecciona una opción</option>
                    <option value="Mañana">Mañana</option>
                    <option value="Tarde">Tarde</option>
                    <option value="Noche">Noche</option>
                    <option value="Fin de semana">Fin de semana</option>
                    <option value="Prefiero coordinar">Prefiero coordinar</option>
                  </select>
                </label>
              </div>
              <label className="form-honeypot" aria-hidden="true">
                Sitio web de empresa
                <input name="companyWebsite" type="text" tabIndex="-1" autoComplete="off" />
              </label>
              <label className="callback-consent">
                <input name="contactPermission" type="checkbox" value="yes" required />
                <span>{site.smsConsent.contactPermission}</span>
              </label>
              <p className="callback-privacy">
                Consulta nuestra <a href={site.legalLinks.privacy}>Política de Privacidad</a>.
              </p>
              <button className="button button--primary" type="submit" data-lead-submit disabled={busy}>Solicitar orientación</button>
              <p className="form-status" data-form-status aria-live="polite">
                {status?.text}
                {status?.href ? <a href={status.href} target="_blank" rel="noreferrer">{status.label}</a> : null}
                {status?.href ? "." : null}
              </p>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
