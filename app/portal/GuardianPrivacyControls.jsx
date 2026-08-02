"use client";

import { useState } from "react";

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
        <li>Contacto por email: {child.permissions.advisorContactApproved ? "autorizado" : "no autorizado"}</li>
        <li>SMS promocional: no autorizado</li>
      </ul>
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
