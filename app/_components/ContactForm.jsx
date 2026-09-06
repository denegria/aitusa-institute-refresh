"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { admissionContext, admissionMessage, admissionOptions } from "../../src/admissions.js";
import { courseInquiryHref } from "../../src/courseDiscovery.js";
import {
  CONTACT_PERMISSION_COPY_ES,
  SMS_CONSENT_COPY_ES,
  SMS_DISCLOSURE_ES,
  SMS_DISCLOSURE_VERSION,
} from "../../src/legal/publicLegalContent.js";
import styles from "./public.module.css";

export function ContactForm({ courseSlug = "orientacion" }) {
  const startedAt = useRef(new Date().toISOString());
  const submissionId = useRef(globalThis.crypto?.randomUUID?.() || `contact-${Date.now()}`);
  const phoneRef = useRef(null);
  const emailRef = useRef(null);
  const [selectedCourse, setSelectedCourse] = useState(admissionContext(courseSlug).slug);
  const [status, setStatus] = useState({ state: "idle", message: "", href: "" });

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const phone = String(data.get("phone") || "").trim();
    const email = String(data.get("email") || "").trim();
    const marketingSmsOptIn = data.get("smsConsent") === "yes";

    if (!phone && !email) {
      const input = form.elements.namedItem("email");
      input?.setCustomValidity("Ingresa un teléfono o un correo electrónico para que podamos contactarte.");
      input?.reportValidity();
      input?.focus();
      return;
    }

    if (marketingSmsOptIn && !phone) {
      const phoneInput = form.elements.namedItem("phone");
      phoneInput?.setCustomValidity("Ingresa un teléfono móvil para recibir mensajes de texto.");
      phoneInput?.reportValidity();
      phoneInput?.focus();
      return;
    }

    setStatus({ state: "submitting", message: "Enviando tu solicitud…", href: "" });

    const submittedAt = new Date().toISOString();
    const payload = {
      formType: "contact_form",
      submissionId: submissionId.current,
      lead: {
        name: String(data.get("name") || "").trim(),
        phone,
        email,
        city: String(data.get("city") || "").trim(),
        interest: admissionContext(data.get("course")).interest,
        preferredMode: String(data.get("preferredMode") || "").trim(),
        preferredSchedule: String(data.get("preferredSchedule") || "").trim(),
        message: admissionMessage(data.get("course"), data.get("message") || ""),
      },
      source: {
        path: "/contactanos",
        referrer: document.referrer || undefined,
      },
      consent: {
        contactPermission: data.get("contactPermission") === "yes",
        marketingSmsOptIn,
        smsConsent: marketingSmsOptIn,
        marketingSmsEvidence: marketingSmsOptIn
          ? {
              disclosureVersion: SMS_DISCLOSURE_VERSION,
              sourcePath: "/contactanos",
              consentedAt: submittedAt,
            }
          : null,
      },
      honeypot: String(data.get("companyWebsite") || ""),
      startedAt: startedAt.current,
      submittedAt,
    };

    try {
      const response = await fetch("/api/leads/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await response.json();
      if (!response.ok || !body.ok) throw new Error("invalid_submission");

      submissionId.current = globalThis.crypto?.randomUUID?.() || `contact-${Date.now()}`;

      setStatus({
        state: "ready",
        message:
          "Recibimos tu solicitud. Un asesor podrá darle seguimiento; también puedes continuar por WhatsApp.",
        href: body.advisorHandoff.href,
      });
    } catch {
      setStatus({
        state: "error",
        message:
          "No pudimos confirmar la recepción de tu solicitud. Reintenta o escríbenos por WhatsApp.",
        href: courseInquiryHref("https://wa.me/17323790593", admissionContext(data.get("course")).title),
      });
    }
  }

  return (
    <form className={styles.contactForm} data-lead-form onSubmit={handleSubmit} aria-busy={status.state === "submitting"}>
      <h2>Solicitar orientación</h2>
      <p id="contact-method-hint" className={styles.formHint}>Deja tu nombre y un teléfono o correo electrónico. Te ayudaremos a confirmar curso, costo y disponibilidad.</p>
      <div className={styles.formGrid}>
        <label className={styles.fullField}>
          Curso de interés
          <select name="course" required value={selectedCourse} onChange={(event) => setSelectedCourse(event.target.value)}>
            {admissionOptions.map(({ slug, title }) => <option value={slug} key={slug}>{title}</option>)}
            <option value="orientacion">Necesito ayuda para elegir</option>
          </select>
        </label>
        <label>
          Nombre completo
          <input name="name" autoComplete="name" required />
        </label>
        <label>
          Correo electrónico
          <input
            ref={emailRef}
            name="email"
            type="email"
            autoComplete="email"
            aria-describedby="contact-method-hint"
            onInput={(event) => {
              event.currentTarget.setCustomValidity("");
              phoneRef.current?.setCustomValidity("");
            }}
          />
        </label>
        <label>
          Teléfono móvil <span className={styles.optional}>(opcional)</span>
          <input
            ref={phoneRef}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            aria-describedby="contact-method-hint"
            onInput={(event) => {
              event.currentTarget.setCustomValidity("");
              emailRef.current?.setCustomValidity("");
            }}
          />
          <small>No recibirás SMS promocionales salvo que marques la casilla separada.</small>
        </label>
      </div>
      <details className={styles.optionalDetails}>
        <summary>Añadir ubicación, modalidad o una pregunta (opcional)</summary>
        <div className={styles.formGrid}>
        <label>
          Ciudad / País <span className={styles.optional}>(opcional)</span>
          <input name="city" autoComplete="address-level2" />
        </label>
        <label>
          Modalidad preferida <span className={styles.optional}>(opcional)</span>
          <select name="preferredMode" defaultValue="">
            <option value="">Sin preferencia</option>
            <option value="Presencial">Presencial</option>
            <option value="Híbrido">Híbrido</option>
            <option value="Online">Online</option>
          </select>
        </label>
        <label className={styles.fullField}>
          Horario o pregunta <span className={styles.optional}>(opcional)</span>
          <textarea name="message" rows="4" maxLength={799 - admissionMessage(selectedCourse).length} />
        </label>
      </div>
      </details>

      <label className={styles.honeypot} aria-hidden="true">
        Sitio web de empresa
        <input name="companyWebsite" tabIndex="-1" autoComplete="off" />
      </label>

      <fieldset className={styles.consentGroup}>
        <legend>Permisos de contacto</legend>
        <label className={styles.checkboxRow}>
          <input name="contactPermission" type="checkbox" value="yes" required />
          <span>{CONTACT_PERMISSION_COPY_ES}</span>
        </label>
        <label className={`${styles.checkboxRow} ${styles.smsConsent}`}>
          <input
            name="smsConsent"
            type="checkbox"
            value="yes"
            onChange={(event) => {
              if (!event.currentTarget.checked) phoneRef.current?.setCustomValidity("");
            }}
          />
          <span>
            <strong>{SMS_CONSENT_COPY_ES}</strong>
            <small>{SMS_DISCLOSURE_ES}</small>
          </span>
        </label>
        <p className={styles.legalLinks}>
          Consulta nuestra <Link href="/privacy-policy">Política de Privacidad</Link> y{" "}
          <Link href="/terms-and-conditions">Términos y Condiciones</Link>.
        </p>
      </fieldset>

      <button className={styles.primaryButton} type="submit" disabled={status.state === "submitting"}>
        {status.state === "submitting" ? "Enviando…" : "Solicitar orientación"}
      </button>

      <div className={styles.formStatus} data-state={status.state} aria-live="polite">
        {status.message ? <p>{status.message}</p> : null}
        {status.href ? (
          <a className={styles.statusAction} href={status.href} target="_blank" rel="noreferrer">
            Abrir WhatsApp
          </a>
        ) : null}
      </div>
    </form>
  );
}
