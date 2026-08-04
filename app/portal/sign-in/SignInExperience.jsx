"use client";

import { useEffect, useRef, useState } from "react";
import { PORTAL_AUTH_SECURITY } from "../../../src/portalAuth/contract.js";

const ERROR_COPY = Object.freeze({
  magic_auth_code_invalid: "Ese código no es válido o ya venció. Solicita uno nuevo.",
  magic_auth_rate_limited: "Espera un momento antes de solicitar otro código.",
  portal_account_not_found:
    "No pudimos completar el acceso. Revisa el email o comienza con el examen de ubicación.",
  portal_account_unavailable:
    "No pudimos completar el acceso. Revisa el email o solicita ayuda a un asesor.",
  portal_sign_in_invalid:
    "Ese código no es válido, ya venció o no corresponde a una cuenta activa.",
  passwordless_sign_in_unavailable:
    "El acceso por email no está disponible en este momento. Intenta de nuevo.",
  identity_provider_unavailable:
    "El acceso por email no está disponible en este momento. Intenta de nuevo.",
  cross_origin_request_forbidden: "Actualiza la página e intenta otra vez.",
});

export function SignInExperience() {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const emailInput = useRef(null);
  const codeInput = useRef(null);

  useEffect(() => {
    if (cooldownSeconds <= 0) return undefined;
    const timer = window.setInterval(() => {
      setCooldownSeconds((seconds) => Math.max(0, seconds - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [cooldownSeconds]);

  async function requestCode(event) {
    event?.preventDefault();
    if (step === "code" && cooldownSeconds > 0) return;
    setStatus("sending_code");
    setError("");
    setCode("");
    try {
      const response = await postJson("/api/portal/auth/code", {
        email: email.trim().toLowerCase(),
      });
      if (!response.ok) throw new Error(response.error || "request_failed");
      setStep("code");
      setStatus("code_sent");
      setCooldownSeconds(
        PORTAL_AUTH_SECURITY.codeRequest.emailCooldownSeconds,
      );
      requestAnimationFrame(() => codeInput.current?.focus());
    } catch (requestError) {
      setStatus("error");
      setError(errorCopy(requestError.message));
    }
  }

  async function verifyCode(event) {
    event.preventDefault();
    setStatus("verifying");
    setError("");
    try {
      const response = await postJson("/api/portal/auth/verify", {
        email: email.trim().toLowerCase(),
        code: code.replace(/\D/g, ""),
      });
      if (!response.ok) throw new Error(response.error || "verification_failed");
      window.location.assign(response.portalHref || "/portal/");
    } catch (requestError) {
      setStatus("error");
      setError(errorCopy(requestError.message));
    }
  }

  function resetEmail() {
    setStep("email");
    setCode("");
    setError("");
    setStatus("idle");
    setCooldownSeconds(0);
    requestAnimationFrame(() => emailInput.current?.focus());
  }

  const statusMessage =
    status === "sending_code"
      ? "Solicitando código."
      : status === "verifying"
        ? "Verificando código."
      : status === "code_sent"
        ? "Código solicitado. Revisa tu email."
        : "";
  const busy = status === "sending_code" || status === "verifying";

  return (
    <main className="portal-access portal-signin">
      <header className="portal-access__header">
        <a className="portal-access__brand" href="/" aria-label="AIT USA Institute, inicio">
          <img
            src="/assets/wix/076-solo-logo-4-x-4-clases1.png"
            alt=""
            width="40"
            height="40"
          />
          <span>
            <strong>AIT USA</strong>
            <small>INSTITUTE</small>
          </span>
        </a>
        <a className="portal-access__site-link" href="/">
          Volver al sitio
        </a>
      </header>

      <section className="portal-access__card" aria-labelledby="portal-signin-title">
        <div className="portal-signin__progress" aria-label={`Paso ${step === "email" ? 1 : 2} de 2`}>
          <span className="is-complete">1</span>
          <i />
          <span className={step === "code" ? "is-complete" : ""}>2</span>
        </div>
        <p className="portal-eyebrow">Acceso sin contraseña</p>
        <h1 id="portal-signin-title">
          {step === "email" ? "Entra a tu Portal" : "Revisa tu email"}
        </h1>
        <p>
          {step === "email"
            ? "Este acceso es para estudiantes que ya guardaron un resultado. Usa el mismo email y, si corresponde a una cuenta activa, recibirás un código de seis dígitos."
            : `Si ${maskEmail(email)} corresponde a una cuenta activa, recibirás un código que vence en 10 minutos.`}
        </p>

        {step === "email" ? (
          <form className="portal-signin__form" onSubmit={requestCode}>
            <label htmlFor="portal-email">Email</label>
            <input
              id="portal-email"
              ref={emailInput}
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={busy}
            />
            <button
              className="portal-button portal-button--primary"
              type="submit"
              disabled={busy}
            >
              {status === "sending_code" ? "Enviando…" : "Enviar código"}
            </button>
          </form>
        ) : (
          <form className="portal-signin__form" onSubmit={verifyCode}>
            <label htmlFor="portal-code">Código de seis dígitos</label>
            <input
              className="portal-signin__code"
              id="portal-code"
              ref={codeInput}
              name="code"
              type="text"
              autoComplete="one-time-code"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              placeholder="000000"
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
              required
              disabled={busy}
            />
            <button
              className="portal-button portal-button--primary"
              type="submit"
              disabled={busy || code.length !== 6}
            >
              {status === "verifying" ? "Verificando…" : "Entrar a mi portal"}
            </button>
            <div className="portal-signin__secondary-actions">
              <button
                className="portal-signin__change"
                type="button"
                onClick={resetEmail}
              >
                Usar otro email
              </button>
              <button
                className="portal-signin__change"
                type="button"
                onClick={requestCode}
                disabled={busy || cooldownSeconds > 0}
              >
                {cooldownSeconds > 0
                  ? `Reenviar en ${cooldownSeconds} s`
                  : "Reenviar código"}
              </button>
            </div>
          </form>
        )}

        <p className="portal-sr-only" aria-live="polite" aria-atomic="true">
          {statusMessage}
        </p>

        {error ? (
          <p className="portal-signin__error" role="alert">
            {error}
          </p>
        ) : null}

        <div className="portal-signin__trust">
          <span aria-hidden="true">✓</span>
          <p>Recibirás un código seguro por email. No necesitas recordar una contraseña.</p>
        </div>
        {step === "email" ? (
          <div className="portal-signin__new-student">
            <div>
              <strong>¿Primera vez aquí?</strong>
              <span>Haz el examen, conoce tu nivel y guarda el resultado para crear tu acceso.</span>
            </div>
            <a className="portal-button portal-button--quiet" href="/placement-test/">
              Comenzar examen
            </a>
          </div>
        ) : null}
        <nav className="portal-signin__footer" aria-label="Ayuda y documentos legales">
          <a href="/contactanos">Ayuda</a>
          <a href="/privacy-policy">Privacidad</a>
          <a href="/terms-and-conditions">Términos</a>
        </nav>
      </section>
    </main>
  );
}

async function postJson(url, body) {
  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) return { ok: false, error: payload.error };
  return payload;
}

function errorCopy(code) {
  return ERROR_COPY[code] || "No pudimos completar el acceso. Intenta de nuevo.";
}

function maskEmail(value) {
  const [local, domain] = String(value).split("@");
  if (!local || !domain) return value;
  const visible = local.slice(0, Math.min(2, local.length));
  return `${visible}${"•".repeat(Math.max(3, local.length - visible.length))}@${domain}`;
}
