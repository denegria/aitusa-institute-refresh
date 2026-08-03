"use client";

import { useEffect, useRef, useState } from "react";
import { faqs, site, testimonials } from "../../../src/content";

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
    <figure className="method-editorial__media">
      <div className="method-video-frame">
        <video
          className="method-editorial__video"
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
  const ordered = [
    testimonials.find((item) => item.name === "Jessica"),
    ...testimonials.filter((item) => item.name !== "Jessica"),
  ].filter(Boolean);
  const railRef = useRef(null);
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [railState, setRailState] = useState({ atStart: true, atEnd: false });
  const active = ordered[activeIndex] || ordered[0];

  const updateRailState = () => {
    const rail = railRef.current;
    if (!rail) return;
    const max = Math.max(0, rail.scrollWidth - rail.clientWidth);
    setRailState({ atStart: rail.scrollLeft <= 4, atEnd: rail.scrollLeft >= max - 4 });
  };

  useEffect(() => {
    updateRailState();
    window.addEventListener("resize", updateRailState);
    return () => window.removeEventListener("resize", updateRailState);
  }, []);

  const scrollRail = (direction) => {
    const rail = railRef.current;
    const story = rail?.querySelector(".proof-story");
    if (!rail || !story) return;
    const gap = Number.parseFloat(window.getComputedStyle(rail).columnGap) || 0;
    rail.scrollBy({
      left: (story.getBoundingClientRect().width + gap) * direction,
      behavior: "smooth",
    });
  };

  const openStory = (index, trigger) => {
    const dialog = dialogRef.current;
    if (!dialog?.showModal) return;
    triggerRef.current = trigger;
    setActiveIndex(index);
    dialog.showModal();
    document.documentElement.classList.add("has-proof-dialog");
  };

  const closeDialog = () => dialogRef.current?.close();
  const closeCleanup = () => {
    const video = dialogRef.current?.querySelector("video");
    video?.pause();
    document.documentElement.classList.remove("has-proof-dialog");
    triggerRef.current?.focus();
  };

  return (
    <section
      className={`section proof-editorial${ordered.length === 3 ? " proof-editorial--complete-row" : ""}`}
      id="experiencia"
      data-proof-shelf
    >
      <div className="proof-shelf__inner">
        <div className="proof-shelf__heading proof-shelf__heading--mobile-framed">
          <div className="proof-shelf__copy">
            <span className="chapter-accent" aria-hidden="true" />
            <p className="section-kicker">Experiencias reales</p>
            <h2>Historias de estudiantes AIT.</h2>
            <p>Conoce las clases, la práctica y el acompañamiento desde la voz de quienes ya viven la experiencia.</p>
          </div>
          <div className="proof-shelf__controls" aria-label="Navegar historias">
            <span>{ordered.length} historias</span>
            <button type="button" disabled={railState.atStart} onClick={() => scrollRail(-1)} aria-label="Ver historias anteriores">
              <i data-lucide="arrow-left" aria-hidden="true" />
            </button>
            <button type="button" disabled={railState.atEnd} onClick={() => scrollRail(1)} aria-label="Ver más historias">
              <i data-lucide="arrow-right" aria-hidden="true" />
            </button>
          </div>
        </div>
        <div
          className="proof-shelf__rail"
          role="list"
          aria-label="Historias de estudiantes en video"
          ref={railRef}
          data-proof-rail
          onScroll={updateRailState}
        >
          {ordered.map((item, index) => (
            <a
              className="proof-story"
              href={item.video}
              role="listitem"
              aria-haspopup="dialog"
              key={`${item.name}-${item.video}`}
              data-proof-story
              onClick={(event) => {
                if (!dialogRef.current?.showModal) return;
                event.preventDefault();
                openStory(index, event.currentTarget);
              }}
            >
              <img
                src={item.videoPoster || item.image}
                alt={item.imageAlt || ""}
                loading={index < 3 ? "eager" : "lazy"}
              />
              <span className="proof-story__shade" aria-hidden="true" />
              <span className="proof-story__duration">{item.duration || ""}</span>
              <span className="proof-story__play" aria-hidden="true"><i data-lucide="play" /></span>
              <span className="proof-story__copy">
                <small>{item.result}</small>
                <strong>{shortLabels[item.name] || item.name}</strong>
                <span>{item.headline || item.text}</span>
              </span>
            </a>
          ))}
        </div>
        <p className="proof-shelf__hint">
          <i data-lucide="move-horizontal" aria-hidden="true" />
          <span>Desliza para conocer más historias.</span>
        </p>
        <dialog
          className="proof-dialog"
          aria-labelledby="proof-dialog-title"
          ref={dialogRef}
          data-proof-dialog
          onClose={closeCleanup}
          onClick={(event) => {
            if (event.target === dialogRef.current) closeDialog();
          }}
        >
          <div className="proof-dialog__shell">
            <button className="proof-dialog__close" type="button" onClick={closeDialog} aria-label="Cerrar historia">
              <i data-lucide="x" aria-hidden="true" />
            </button>
            <div className="proof-dialog__media">
              <div
                className="proof-dialog__video-frame"
                style={{ aspectRatio: `${active.videoWidth || 16} / ${active.videoHeight || 9}` }}
              >
                <video
                  key={active.video}
                  controls
                  playsInline
                  preload="metadata"
                  src={active.video}
                  poster={active.videoPoster || active.image}
                  width={active.videoWidth || 16}
                  height={active.videoHeight || 9}
                  aria-label={shortLabels[active.name] || active.name}
                  data-proof-dialog-video
                />
              </div>
            </div>
            <div className="proof-dialog__footer">
              <div className="proof-dialog__copy">
                <span>{active.result} · {active.duration || ""}</span>
                <h3 id="proof-dialog-title" data-proof-dialog-title>{shortLabels[active.name] || active.name}</h3>
                <p>{active.headline || active.text}</p>
              </div>
              <div className="proof-dialog__nav" aria-label="Cambiar historia">
                <button type="button" data-proof-dialog-prev onClick={() => setActiveIndex((activeIndex - 1 + ordered.length) % ordered.length)}>
                  <i data-lucide="arrow-left" aria-hidden="true" /><span>Anterior</span>
                </button>
                <button type="button" data-proof-dialog-next onClick={() => setActiveIndex((activeIndex + 1) % ordered.length)}>
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
