"use client";

import { useState } from "react";

const ERROR_COPY = Object.freeze({
  invalid_link:
    "Este enlace no es válido o ya venció. Solicita uno nuevo desde la pantalla de acceso.",
  password_reset_invalid:
    "No pudimos aceptar esta contraseña. Revisa los requisitos o solicita un enlace nuevo.",
  password_reset_rate_limited:
    "Demasiados intentos. Espera unos minutos antes de intentar otra vez.",
  password_reset_unavailable:
    "No pudimos actualizar la contraseña en este momento. Intenta de nuevo más tarde.",
  identity_provider_unavailable:
    "El servicio de acceso no está disponible en este momento. Intenta de nuevo.",
  cross_origin_request_forbidden: "Actualiza la página e intenta otra vez.",
});

export function PasswordResetExperience({ initialError = "" }) {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [status, setStatus] = useState(initialError ? "error" : "idle");
  const [error, setError] = useState(initialError ? errorCopy(initialError) : "");

  const busy = status === "submitting";
  const completed = status === "completed";

  async function submitPassword(event) {
    event.preventDefault();
    setError("");
    if (password.length < 10 || password.length > 256 || password !== confirmation) {
      setStatus("error");
      setError(
        password !== confirmation
          ? "Las contraseñas no coinciden."
          : "Usa al menos 10 caracteres y evita contraseñas fáciles de adivinar.",
      );
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch("/api/portal/auth/password-reset/confirm", {
        method: "POST",
        credentials: "same-origin",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password, confirmation }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "password_reset_unavailable");
      setPassword("");
      setConfirmation("");
      setStatus("completed");
    } catch (requestError) {
      setStatus("error");
      setError(errorCopy(requestError.message));
    }
  }

  return (
    <main className="portal-access portal-reset">
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

      <section className="portal-access__card" aria-labelledby="password-reset-title">
        <p className="portal-eyebrow">Acceso seguro</p>
        <h1 id="password-reset-title">
          {completed ? "Contraseña creada" : "Crea una nueva contraseña"}
        </h1>
        <p>
          {completed
            ? "WorkOS protegió tu nueva contraseña y cerró las sesiones anteriores. Entra nuevamente al portal que necesitas."
            : "Usa al menos 10 caracteres. Una frase larga y única suele ser más fácil de recordar y más segura."}
        </p>

        {completed ? (
          <div className="portal-reset__actions">
            <a className="portal-button portal-button--primary" href="/portal/sign-in/">
              Entrar al Portal estudiantil
            </a>
            <a className="portal-button portal-button--quiet" href="/employee/sign-in/">
              Acceso de empleados
            </a>
          </div>
        ) : (
          <form className="portal-signin__form" onSubmit={submitPassword}>
            <label htmlFor="new-password">Nueva contraseña</label>
            <input
              id="new-password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={10}
              maxLength={256}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              disabled={busy || Boolean(initialError)}
            />
            <label htmlFor="confirm-password">Confirmar contraseña</label>
            <input
              id="confirm-password"
              name="confirmation"
              type="password"
              autoComplete="new-password"
              minLength={10}
              maxLength={256}
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              required
              disabled={busy || Boolean(initialError)}
            />
            <button
              className="portal-button portal-button--primary"
              type="submit"
              disabled={busy || Boolean(initialError)}
            >
              {busy ? "Guardando…" : "Guardar contraseña"}
            </button>
          </form>
        )}

        <p className="portal-sr-only" aria-live="polite" aria-atomic="true">
          {busy ? "Guardando contraseña." : completed ? "Contraseña creada." : ""}
        </p>
        {error ? (
          <p className="portal-signin__error" role="alert">
            {error}
          </p>
        ) : null}
        {initialError ? (
          <a className="portal-button portal-button--quiet portal-reset__request-link" href="/portal/sign-in/">
            Solicitar un enlace nuevo
          </a>
        ) : null}

        <div className="portal-signin__trust">
          <span aria-hidden="true">✓</span>
          <p>WorkOS procesa la contraseña. AIT nunca la guarda ni puede verla.</p>
        </div>
        <nav className="portal-signin__footer" aria-label="Ayuda y documentos legales">
          <a href="/contactanos">Ayuda</a>
          <a href="/privacy-policy">Privacidad</a>
          <a href="/terms-and-conditions">Términos</a>
        </nav>
      </section>
    </main>
  );
}

function errorCopy(code) {
  return ERROR_COPY[code] || ERROR_COPY.password_reset_unavailable;
}
