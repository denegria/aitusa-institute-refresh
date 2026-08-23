"use client";

import { useEffect, useRef, useState } from "react";
import { PORTAL_AUTH_SECURITY } from "../../../src/portalAuth/contract.js";

const ERROR_COPY = Object.freeze({
  magic_auth_code_invalid: "Ese código no es válido o ya venció. Solicita uno nuevo.",
  magic_auth_rate_limited: "Espera un momento antes de solicitar otro código.",
  portal_account_not_found:
    "No pudimos completar el acceso. Revisa el email o comienza con el Placement Test.",
  portal_account_unavailable:
    "No pudimos completar el acceso. Revisa el email o solicita ayuda a un asesor.",
  portal_sign_in_invalid:
    "No pudimos completar el acceso. Revisa tus datos o usa un código por email.",
  passwordless_sign_in_unavailable:
    "El acceso por email no está disponible en este momento. Intenta de nuevo.",
  password_sign_in_unavailable:
    "El acceso con contraseña no está disponible en este momento. Usa un código por email.",
  password_auth_rate_limited:
    "Demasiados intentos. Espera un momento o usa un código por email.",
  password_reset_unavailable:
    "No pudimos iniciar la recuperación. Intenta de nuevo dentro de unos minutos.",
  identity_provider_unavailable:
    "El acceso por email no está disponible en este momento. Intenta de nuevo.",
  cross_origin_request_forbidden: "Actualiza la página e intenta otra vez.",
});

export function SignInExperience({ audience = "student", returnTo = "/portal/" }) {
  const employee = audience === "employee";
  const [method, setMethod] = useState("password");
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        audience,
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

  async function signInWithPassword(event) {
    event.preventDefault();
    setStatus("verifying_password");
    setError("");
    try {
      const response = await postJson("/api/portal/auth/password", {
        email: email.trim().toLowerCase(),
        password,
        audience,
        returnTo,
      });
      if (!response.ok) throw new Error(response.error || "portal_sign_in_invalid");
      window.location.assign(response.portalHref || "/portal/");
    } catch (requestError) {
      setStatus("error");
      setError(errorCopy(requestError.message));
    }
  }

  async function requestPasswordReset() {
    if (!emailInput.current?.reportValidity()) return;
    setStatus("requesting_reset");
    setError("");
    try {
      const response = await postJson("/api/portal/auth/password-reset", {
        email: email.trim().toLowerCase(),
        audience,
      });
      if (!response.ok) throw new Error(response.error || "password_reset_unavailable");
      setStatus("reset_requested");
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
        audience,
        returnTo,
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

  function chooseMethod(nextMethod) {
    setMethod(nextMethod);
    setStep("email");
    setCode("");
    setPassword("");
    setError("");
    setStatus("idle");
    setCooldownSeconds(0);
    requestAnimationFrame(() => emailInput.current?.focus());
  }

  const statusMessage =
    status === "sending_code"
      ? "Solicitando código."
      : status === "verifying_password"
        ? "Verificando acceso."
        : status === "requesting_reset"
          ? "Solicitando recuperación."
          : status === "reset_requested"
            ? "Solicitud aceptada. Revisa tu email para crear o restablecer tu contraseña."
            : status === "verifying"
              ? "Verificando código."
              : status === "code_sent"
                ? "Código solicitado. Revisa tu email."
                : "";
  const busy = [
    "sending_code",
    "verifying",
    "verifying_password",
    "requesting_reset",
  ].includes(status);

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
        {method === "code" && step === "code" ? (
          <div className="portal-signin__progress" aria-label="Paso 2 de 2">
            <span className="is-complete">1</span>
            <i />
            <span className="is-complete">2</span>
          </div>
        ) : null}
        <p className="portal-eyebrow">Acceso seguro</p>
        <h1 id="portal-signin-title">
          {method === "code" && step === "code"
            ? "Revisa tu email"
            : employee
              ? "Entra al Portal de empleados"
              : "Entra a tu Portal"}
        </h1>
        <p>
          {method === "code" && step === "code"
            ? `Si ${maskEmail(email)} corresponde a una cuenta activa, recibirás un código que vence en 10 minutos.`
            : method === "password"
              ? employee
                ? "Acceso exclusivo para personal autorizado. Usa tu email de empleado y contraseña."
                : "Usa el email con el que guardaste tu resultado y tu contraseña."
              : employee
                ? "Usa tu email de empleado y recibirás un código de seis dígitos."
                : "Usa el email con el que guardaste tu resultado y recibirás un código de seis dígitos."}
        </p>

        {step === "email" ? (
          <div className="portal-signin__methods" aria-label="Método de acceso">
            <button
              aria-pressed={method === "password"}
              type="button"
              onClick={() => chooseMethod("password")}
            >
              Contraseña
            </button>
            <button
              aria-pressed={method === "code"}
              type="button"
              onClick={() => chooseMethod("code")}
            >
              Código por email
            </button>
          </div>
        ) : null}

        {method === "password" ? (
          <form className="portal-signin__form" onSubmit={signInWithPassword}>
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
            <label htmlFor="portal-password">Contraseña</label>
            <input
              id="portal-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              disabled={busy}
            />
            <button
              className="portal-button portal-button--primary"
              type="submit"
              disabled={busy}
            >
              {status === "verifying_password"
                ? "Entrando…"
                : employee
                  ? "Entrar al portal de empleados"
                  : "Entrar a mi portal"}
            </button>
            <button
              className="portal-signin__change"
              type="button"
              disabled={busy}
              onClick={requestPasswordReset}
            >
              {status === "requesting_reset" ? "Solicitando…" : "Olvidé mi contraseña"}
            </button>
          </form>
        ) : step === "email" ? (
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
              {status === "verifying" ? "Verificando…" : employee ? "Entrar al portal de empleados" : "Entrar a mi portal"}
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

        {status === "reset_requested" ? (
          <p className="portal-signin__notice" role="status">
            Si el email corresponde a una cuenta activa, recibirás un enlace seguro para crear o restablecer tu contraseña.
          </p>
        ) : null}

        {error ? (
          <p className="portal-signin__error" role="alert">
            {error}
          </p>
        ) : null}

        <div className="portal-signin__trust">
          <span aria-hidden="true">✓</span>
          <p>
            {method === "password"
              ? "WorkOS protege tu contraseña. AIT nunca la guarda ni puede verla."
              : "Recibirás un código seguro por email. No necesitas recordar una contraseña."}
          </p>
        </div>
        {step === "email" && !employee ? (
          <div className="portal-signin__new-student">
            <div>
              <strong>¿Primera vez aquí?</strong>
              <span>Completa el Placement Test, conoce tu punto de partida y guarda el resultado para crear tu acceso.</span>
            </div>
            <a className="portal-button portal-button--quiet" href="/placement-test/">
              Comenzar el Placement Test
            </a>
          </div>
        ) : null}
        <nav className="portal-signin__footer" aria-label="Ayuda y documentos legales">
          <a href="/contactanos">Ayuda</a>
          <a href={employee ? "/portal/sign-in/" : "/employee/sign-in/"}>
            {employee ? "Portal estudiantil" : "Acceso de empleados"}
          </a>
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
