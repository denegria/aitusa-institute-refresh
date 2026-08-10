"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { communityGallery, faqs, site, testimonials } from "../../../src/content";

const COMMUNITY_TAB_CYCLE_MS = 8000;

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

export function ProofStories() {
  const shortLabels = {
    Jessica: "Jessica",
    "Testimonio internacional": "Experiencia internacional",
    Eric: "Eric",
    Leila: "Leila",
  };
  const orderedStories = [
    testimonials.find((item) => item.name === "Jessica"),
    ...testimonials.filter((item) => item.name !== "Jessica"),
  ].filter(Boolean);
  const sectionRef = useRef(null);
  const videoDialogRef = useRef(null);
  const imageDialogRef = useRef(null);
  const triggerRef = useRef(null);
  const pauseTimerRef = useRef(null);
  const [activeTab, setActiveTab] = useState("stories");
  const [cycleIndex, setCycleIndex] = useState(0);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [lightboxTab, setLightboxTab] = useState("graduations");
  const [isInView, setIsInView] = useState(false);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [interactionPaused, setInteractionPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [showAllGraduations, setShowAllGraduations] = useState(false);

  const tabMeta = {
    stories: {
      eyebrow: "Entrevistas en inglés",
    },
    graduations: {
      eyebrow: "Graduaciones",
    },
    classroom: {
      eyebrow: "En clase",
    },
    celebrations: {
      eyebrow: "Celebraciones",
    },
  };

  const photosForTab = activeTab === "stories" ? [] : (communityGallery[activeTab] || []);
  const activeStoryCycleIndex = orderedStories.length ? cycleIndex % orderedStories.length : 0;
  const activeStoryCycle = orderedStories[activeStoryCycleIndex] || orderedStories[0];
  const activePhotoCycleIndex = photosForTab.length ? cycleIndex % photosForTab.length : 0;
  const activePhotoCycle = photosForTab[activePhotoCycleIndex] || communityGallery.graduations[0];
  const sideStories = Array.from({ length: 2 }, (_, offset) => {
    const index = orderedStories.length ? (activeStoryCycleIndex + offset + 1) % orderedStories.length : 0;
    return { story: orderedStories[index], index };
  }).filter((item) => item.story);
  const sidePhotos = Array.from({ length: 2 }, (_, offset) => {
    const index = photosForTab.length ? (activePhotoCycleIndex + offset + 1) % photosForTab.length : 0;
    return { photo: photosForTab[index], index };
  }).filter((item) => item.photo);
  const activeStory = orderedStories[activeStoryIndex] || orderedStories[0];
  const lightboxPhotos = communityGallery[lightboxTab] || communityGallery.graduations;
  const activePhoto = lightboxPhotos[activePhotoIndex] || lightboxPhotos[0];
  const featuredGraduationIds = ["0031", "0022", "0033", "0028"];
  const graduationWall = showAllGraduations
    ? communityGallery.graduations.map((photo, index) => ({ photo, index }))
    : featuredGraduationIds
        .map((id) => {
          const index = communityGallery.graduations.findIndex((photo) => photo.id === id);
          return { photo: communityGallery.graduations[index], index };
        })
        .filter(({ photo }) => photo);

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
    if (!isInView || hoverPaused || interactionPaused || prefersReducedMotion) return undefined;
    const timer = window.setInterval(() => {
      setActiveTab((currentTab) => {
        const currentIndex = communityGallery.tabs.findIndex((tab) => tab.id === currentTab);
        return communityGallery.tabs[(currentIndex + 1) % communityGallery.tabs.length].id;
      });
      setCycleIndex((index) => index + 1);
      setActivePhotoIndex(0);
    }, COMMUNITY_TAB_CYCLE_MS);
    return () => window.clearInterval(timer);
  }, [hoverPaused, interactionPaused, isInView, prefersReducedMotion]);

  useEffect(() => {
    if (!isInView) return;
    const activeTabButton = document.getElementById(`community-tab-${activeTab}`);
    activeTabButton?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeTab, isInView, prefersReducedMotion]);

  useEffect(() => {
    window.lucide?.createIcons?.();
  }, [activePhotoIndex, activeStoryIndex, activeTab, cycleIndex, showAllGraduations]);

  useEffect(
    () => () => {
      window.clearTimeout(pauseTimerRef.current);
    },
    [],
  );

  const selectTab = (tabId) => {
    setActiveTab(tabId);
    setCycleIndex(0);
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

  const openStory = (index, trigger) => {
    const dialog = videoDialogRef.current;
    if (!dialog?.showModal) return;
    triggerRef.current = trigger;
    setActiveStoryIndex(index);
    dialog.showModal();
    document.documentElement.classList.add("has-proof-dialog");
  };

  const closeVideoDialog = () => videoDialogRef.current?.close();
  const closeVideoCleanup = () => {
    const video = videoDialogRef.current?.querySelector("video");
    video?.pause();
    document.documentElement.classList.remove("has-proof-dialog");
    triggerRef.current?.focus();
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
    >
      <div className="community-proof__inner">
        <header className="community-proof__heading" style={{ "--reveal-order": 0 }}>
          <span className="chapter-accent" aria-hidden="true" />
          <p className="section-kicker">{communityGallery.eyebrow}</p>
          <h2>{communityGallery.title}</h2>
          <p>{communityGallery.introduction}</p>
        </header>

        <div
          className={`community-proof__tabs${isInView && !hoverPaused && !interactionPaused && !prefersReducedMotion ? " is-auto-cycling" : ""}`}
          role="tablist"
          aria-label="Explorar experiencias de AIT; las pestañas avanzan automáticamente"
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
          {activeTab === "stories" ? (
            <a
              className="community-proof__feature community-proof__feature--video"
              href={activeStoryCycle.video}
              aria-haspopup="dialog"
              aria-label={`Ver entrevista en inglés con ${shortLabels[activeStoryCycle.name] || activeStoryCycle.name}`}
              key={activeStoryCycle.video}
              onClick={(event) => {
                if (!videoDialogRef.current?.showModal) return;
                event.preventDefault();
                pauseAfterInteraction();
                openStory(activeStoryCycleIndex, event.currentTarget);
              }}
            >
              <Image
                src={activeStoryCycle.videoPoster || activeStoryCycle.image}
                alt={activeStoryCycle.imageAlt || ""}
                fill
                sizes="(max-width: 719px) calc(100vw - 32px), 48vw"
                style={{ objectPosition: activeStoryCycle.posterPosition }}
              />
              <span className="community-proof__media-shade" aria-hidden="true" />
              <span className="community-proof__play" aria-hidden="true"><i data-lucide="play" /></span>
              <span className="community-proof__video-duration">{activeStoryCycle.duration}</span>
            </a>
          ) : (
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
                sizes="(max-width: 719px) calc(100vw - 32px), 48vw"
                style={{ objectPosition: activePhotoCycle.position }}
              />
              <span className="community-proof__media-shade" aria-hidden="true" />
            </button>
          )}

          <div className="community-proof__mosaic" aria-label={`Selección de ${tabMeta[activeTab].eyebrow.toLowerCase()}`}>
            {activeTab === "stories"
              ? sideStories.map(({ story, index }, tileIndex) => (
                  <a
                    className="community-proof__tile community-proof__tile--video"
                    href={story.video}
                    aria-haspopup="dialog"
                    aria-label={`Ver entrevista en inglés con ${shortLabels[story.name] || story.name}`}
                    key={`${cycleIndex}-${story.video}`}
                    style={{ "--tile-order": tileIndex }}
                    onClick={(event) => {
                      if (!videoDialogRef.current?.showModal) return;
                      event.preventDefault();
                      pauseAfterInteraction();
                      openStory(index, event.currentTarget);
                    }}
                  >
                    <Image
                      src={story.videoPoster || story.image}
                      alt=""
                      fill
                      sizes="(max-width: 719px) 44vw, 24vw"
                      style={{ objectPosition: story.posterPosition }}
                    />
                    <span className="community-proof__media-shade" aria-hidden="true" />
                    <span className="community-proof__play community-proof__play--small" aria-hidden="true"><i data-lucide="play" /></span>
                    <span className="community-proof__video-duration">{story.duration}</span>
                  </a>
                ))
              : sidePhotos.map(({ photo, index }, tileIndex) => (
                  <button
                    className="community-proof__tile"
                    type="button"
                    key={`${activeTab}-${cycleIndex}-${photo.id}`}
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
                      sizes="(max-width: 719px) 44vw, 24vw"
                      style={{ objectPosition: photo.position }}
                    />
                  </button>
                ))}
          </div>
        </div>

        <section className="community-proof__graduations" aria-labelledby="graduation-wall-title" style={{ "--reveal-order": 3 }}>
          <div className="community-proof__graduation-heading">
            <h3 id="graduation-wall-title">Graduaciones recientes</h3>
          </div>

          <div className={`community-proof__wall${showAllGraduations ? " is-expanded" : ""}`}>
            {graduationWall.map(({ photo, index }) => (
              <button
                className="community-proof__wall-tile"
                type="button"
                key={photo.id}
                style={{ "--tile-order": index }}
                onClick={(event) => {
                  const trigger = event.currentTarget;
                  selectTab("graduations");
                  setActivePhotoIndex(index);
                  window.requestAnimationFrame(() => openPhoto(index, trigger, "graduations"));
                }}
                aria-label={`Ampliar: ${photo.alt}`}
              >
                <Image
                  src={photo.src}
                  alt=""
                  fill
                  sizes="(max-width: 719px) 50vw, (max-width: 1040px) 25vw, 17vw"
                  style={{ objectPosition: photo.position }}
                />
              </button>
            ))}
          </div>

          <button
            className="community-proof__graduation-action"
            type="button"
            aria-expanded={showAllGraduations}
            onClick={() => setShowAllGraduations((value) => !value)}
          >
            <span>{showAllGraduations ? "Ver graduaciones destacadas" : "Ver las 27 graduaciones"}</span>
            <i data-lucide={showAllGraduations ? "arrow-up" : "arrow-right"} aria-hidden="true" />
          </button>
        </section>

        <dialog
          className="proof-dialog"
          aria-labelledby="proof-dialog-title"
          ref={videoDialogRef}
          data-proof-dialog
          onClose={closeVideoCleanup}
          onClick={(event) => {
            if (event.target === videoDialogRef.current) closeVideoDialog();
          }}
        >
          <div className="proof-dialog__shell">
            <button className="proof-dialog__close" type="button" onClick={closeVideoDialog} aria-label="Cerrar entrevista">
              <i data-lucide="x" aria-hidden="true" />
            </button>
            <div className="proof-dialog__media">
              <div
                className="proof-dialog__video-frame"
                style={{ aspectRatio: `${activeStory.videoWidth || 16} / ${activeStory.videoHeight || 9}` }}
              >
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
                  data-proof-dialog-video
                />
              </div>
            </div>
            <div className="proof-dialog__footer">
              <div className="proof-dialog__copy">
                <span>{activeStory.result} · {activeStory.duration || ""}</span>
                <h3 id="proof-dialog-title" data-proof-dialog-title>{shortLabels[activeStory.name] || activeStory.name}</h3>
                <p>{activeStory.headline || activeStory.text}</p>
              </div>
              <div className="proof-dialog__nav" aria-label="Cambiar entrevista">
                <button type="button" data-proof-dialog-prev onClick={() => setActiveStoryIndex((activeStoryIndex - 1 + orderedStories.length) % orderedStories.length)}>
                  <i data-lucide="arrow-left" aria-hidden="true" /><span>Anterior</span>
                </button>
                <button type="button" data-proof-dialog-next onClick={() => setActiveStoryIndex((activeStoryIndex + 1) % orderedStories.length)}>
                  <span>Siguiente</span><i data-lucide="arrow-right" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </dialog>

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
                    sizes="(max-width: 719px) calc(100vw - 20px), min(1120px, calc(100vw - 36px))"
                    style={{ objectPosition: activePhoto.position }}
                  />
                </div>
                <footer className="community-lightbox__footer">
                  <div>
                    <span>{tabMeta[lightboxTab]?.eyebrow || "Experiencia AIT"}</span>
                    <p id="community-lightbox-title">{activePhoto.alt}</p>
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
      {faqs.slice(0, 6).map((faq, index) => (
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

export function CallbackDialog() {
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
    const location = String(formData.get("ubicacion") || "Sin ubicación indicada");
    const preferredSchedule = String(formData.get("mejorHorario") || "Prefiero coordinar");
    const message = [
      "Hola AIT USA, quiero coordinar una llamada.",
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
        interest: location === "Online" ? "ingles-online" : "ingles-presencial",
        preferredSchedule,
        message: "Solicitud de llamada desde la página principal.",
      },
      source: {
        path: `${window.location.pathname || "/"}#contacto`,
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

    setStatus({ text: "Preparando tu solicitud de forma segura…" });
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
        text: "Recibimos tu solicitud de llamada. Un asesor podrá darle seguimiento. ",
        href: body.advisorHandoff.href,
        label: "Abrir WhatsApp",
      });
    } catch {
      setStatus({
        text: "No pudimos preparar la solicitud. ",
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
          className="final-cta-contact-link"
          type="button"
          aria-haspopup="dialog"
          aria-controls="callback-dialog"
          data-callback-dialog-open
          onClick={openDialog}
        >
          <i data-lucide="phone-call" aria-hidden="true" />
          <span>Solicitar llamada</span>
        </button>
      </div>
      <dialog
        className="callback-dialog"
        id="callback-dialog"
        aria-labelledby="callback-dialog-title"
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
              <p className="section-kicker">Una alternativa simple</p>
              <h3 id="callback-dialog-title">Solicita una llamada</h3>
            </div>
            <button className="callback-dialog__close" type="button" aria-label="Cerrar solicitud de llamada" data-callback-dialog-close onClick={closeDialog}>
              <i data-lucide="x" aria-hidden="true" />
            </button>
          </header>
          <div className="callback-dialog__content">
            <p>Déjanos lo esencial para coordinar una llamada. Te preguntaremos el resto cuando hablemos.</p>
            <form className="lead-form" data-lead-form onSubmit={submit} aria-busy={busy}>
              <div className="form-grid callback-form-grid">
                <label>Nombre<input name="nombre" type="text" autoComplete="name" required /></label>
                <label>Teléfono<input name="telefono" type="tel" inputMode="tel" autoComplete="tel" /></label>
                <label>Email<input name="email" type="email" autoComplete="email" /><small>Escribe un teléfono o un email.</small></label>
                <label>
                  Sede o modalidad preferida
                  <select name="ubicacion" required defaultValue="">
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
              <button className="button button--primary" type="submit" data-lead-submit disabled={busy}>Solicitar llamada</button>
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
