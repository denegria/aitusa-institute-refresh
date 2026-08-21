"use client";

import { useState } from "react";

const CONTACT_CHANNEL_LABELS = Object.freeze({
  email: "Email",
  sms: "SMS de servicio",
  whatsapp: "WhatsApp",
  phone: "Llamada telefónica",
});

export function GuardianPrivacyControls({ child }) {
  const [status, setStatus] = useState(child.status);
  const [busyAction, setBusyAction] = useState("");
  const [message, setMessage] = useState("");

  const applyAction = async (action) => {
    if (busyAction) return;
    setBusyAction(action);
    setMessage("");
    try {
      const response = await fetch(
        `/api/portal/guardian/children/${encodeURIComponent(child.id)}`,
        {
          method: "POST",
          credentials: "same-origin",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ action }),
        },
      );
      const body = await response.json();
      if (!response.ok || body.ok !== true) throw new Error(body.error || "guardian_control_failed");
      setStatus(body.status);
      setMessage({
        withdraw_consent: "La autorización quedó retirada y el perfil fue desvinculado.",
        unlink_child: "El perfil quedó desvinculado de tu cuenta.",
        request_deletion: "Recibimos la solicitud de eliminación para revisión segura.",
      }[action]);
    } catch {
      setMessage("No pudimos completar el cambio. Inténtalo de nuevo o contacta a AIT USA.");
    } finally {
      setBusyAction("");
    }
  };

  return (
    <div className="portal-guardian-controls">
      <div>
        <strong>{child.firstName}</strong>
        <span>
          {status === "deletion_requested" ? "Eliminación solicitada" : "Perfil menor de 13 vinculado"}
        </span>
        {child.receiptCode ? <small>Comprobante {child.receiptCode}</small> : null}
      </div>
      <ul>
        <li>Study Buddy: {child.permissions.aiPracticeApproved ? "autorizado" : "no autorizado"}</li>
        <li>Orientación del asesor: {child.permissions.advisorContactApproved ? "autorizada" : "no autorizada"}</li>
        <li>
          Canal de orientación: {CONTACT_CHANNEL_LABELS[child.contactPreference?.preferredChannel] || "No registrado"}
        </li>
        {child.contactPreference ? (
          <li>
            Registro de servicio: guardado{child.contactPreference.verifiedMobile ? " · teléfono confirmado para contacto, no para iniciar sesión" : ""}
          </li>
        ) : null}
        <li>SMS promocional: no autorizado</li>
      </ul>
      <p className="portal-guardian-controls__service-copy">
        La información de contacto del adulto se usa para gestionar el resultado de
        el Placement Test del menor, revisar opciones de curso y acompañar los
        próximos pasos de inscripción. Es un contacto de servicio y no autoriza
        marketing.
      </p>
      {status === "active" ? (
        <div className="portal-guardian-controls__actions">
          <button disabled={Boolean(busyAction)} type="button" onClick={() => applyAction("withdraw_consent")}>
            {busyAction === "withdraw_consent" ? "Procesando…" : "Retirar autorización"}
          </button>
          <button disabled={Boolean(busyAction)} type="button" onClick={() => applyAction("unlink_child")}>
            {busyAction === "unlink_child" ? "Procesando…" : "Desvincular perfil"}
          </button>
          <button disabled={Boolean(busyAction)} type="button" onClick={() => applyAction("request_deletion")}>
            {busyAction === "request_deletion" ? "Procesando…" : "Solicitar eliminación"}
          </button>
        </div>
      ) : null}
      {message ? <p role="status">{message}</p> : null}
    </div>
  );
}
