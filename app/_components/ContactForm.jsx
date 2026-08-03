"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  CONTACT_PERMISSION_COPY_ES,
  SMS_CONSENT_COPY_ES,
  SMS_DISCLOSURE_ES,
  SMS_DISCLOSURE_VERSION,
} from "../../src/legal/publicLegalContent.js";
import styles from "./public.module.css";

const interests = [
  ["ingles-presencial", "Inglés presencial"],
  ["ingles-hibrido", "Inglés híbrido"],
  ["ingles-online", "Inglés online"],
  ["kids", "Inglés para niños"],
  ["ged", "GED"],
  ["computacion", "Computación"],
  ["otro", "Otro"],
];

export function ContactForm() {
  const startedAt = useRef(new Date().toISOString());
  const submissionId = useRef(globalThis.crypto?.randomUUID?.() || `contact-${Date.now()}`);
  const phoneRef = useRef(null);
  const emailRef = useRef(null);
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

    setStatus({ state: "submitting", message: "Preparando tu solicitud de forma segura…", href: "" });

    const submittedAt = new Date().toISOString();
    const payload = {
      formType: "contact_form",
      submissionId: submissionId.current,
      lead: {
        name: String(data.get("name") || "").trim(),
        phone,
        email,
        city: String(data.get("city") || "").trim(),
        interest: String(data.get("interest") || "").trim(),
        preferredMode: String(data.get("preferredMode") || "").trim(),
        preferredSchedule: String(data.get("preferredSchedule") || "").trim(),
        message: String(data.get("message") || "").trim(),
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
          "No pudimos preparar el mensaje. Puedes escribir directamente por WhatsApp o llamarnos.",
        href: "https://wa.me/17323790593",
      });
    }
  }

  return (
    <form className={styles.contactForm} data-lead-form onSubmit={handleSubmit} noValidate={false}>
      <div className={styles.formGrid}>
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
            onInput={(event) => {
              event.currentTarget.setCustomValidity("");
              emailRef.current?.setCustomValidity("");
            }}
          />
          <small>No recibirás SMS promocionales salvo que marques la casilla separada.</small>
        </label>
        <label>
          Ciudad / País <span className={styles.optional}>(opcional)</span>
          <input name="city" autoComplete="address-level2" />
        </label>
        <label>
          Programa de interés
          <select name="interest" required defaultValue="">
            <option value="" disabled>Selecciona una opción</option>
            {interests.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
          </select>
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
          <textarea name="message" rows="4" maxLength="800" />
        </label>
      </div>

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
        {status.state === "submitting" ? "Preparando…" : "Preparar conversación con un asesor"}
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
