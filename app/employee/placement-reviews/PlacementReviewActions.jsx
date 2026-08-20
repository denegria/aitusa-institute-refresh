"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./placement-reviews.module.css";

const ERROR_COPY = {
  placement_review_revision_conflict: "Otra persona actualizó esta revisión. Recargamos la evidencia para mostrar la versión más reciente.",
  placement_review_transition_invalid: "Esta acción ya no está disponible para el estado actual.",
  placement_review_final_level_invalid: "Escribe un nivel final válido antes de ajustar.",
  placement_review_rationale_invalid: "Explica brevemente por qué ajustas el nivel o solicitas otra revisión.",
  placement_review_unauthenticated: "Tu sesión terminó. Vuelve a entrar para continuar.",
  placement_review_unavailable: "El servicio no está disponible ahora. La revisión no cambió; vuelve a intentarlo.",
};

export function PlacementReviewActions({ review }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState(null);
  const complete = ["confirmed", "adjusted"].includes(review.status);
  if (complete) return <section className={styles.decisionComplete} role="status"><strong>Decisión completada</strong><p>El nivel final quedó guardado y la actualización está lista para CRM.</p></section>;

  async function submit(event) {
    event.preventDefault();
    const submitter = event.nativeEvent.submitter || document.activeElement;
    if (!submitter || pending) return;
    const action = submitter.value;
    const form = event.currentTarget;
    const body = new FormData(form);
    body.set("action", action);
    body.set("mutationId", crypto.randomUUID());
    if (["adjust", "additional"].includes(action) && !String(body.get("internalRationale") || "").trim()) {
      setMessage({ type: "error", text: ERROR_COPY.placement_review_rationale_invalid });
      return;
    }
    setPending(true); setMessage(null);
    try {
      const response = await fetch(`/api/employee/placement-reviews/${review.id}`, { method: "POST", body, headers: { accept: "application/json" } });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (response.status === 401) {
          window.location.assign(`/portal/sign-in/?returnTo=${encodeURIComponent(`/employee/placement-reviews?review=${review.id}`)}`);
          return;
        }
        setMessage({ type: "error", text: ERROR_COPY[payload.error] || "No pudimos guardar la acción. La revisión no cambió." });
        if (response.status === 409) router.refresh();
        return;
      }
      setMessage({ type: "success", text: "Acción guardada. Actualizando la revisión…" });
      router.refresh();
    } catch {
      setMessage({ type: "error", text: "Se perdió la conexión. La revisión no cambió; vuelve a intentarlo." });
    } finally { setPending(false); }
  }

  return <section className={styles.decision} aria-labelledby="decision-title"><div className={styles.sectionHeading}><div><p>Decisión académica</p><h3 id="decision-title">Registrar siguiente paso</h3></div></div><form onSubmit={submit}><input type="hidden" name="expectedRevision" value={review.revision} /><div className={styles.decisionFields}><label>Nivel final<input name="finalLevel" maxLength="120" minLength="1" pattern="[^<>]{1,120}" placeholder="Ej. Nivel 4" defaultValue={review.finalLevel || ""} /></label><label>Razonamiento interno<textarea name="internalRationale" maxLength="1000" rows="3" placeholder="Obligatorio al ajustar o solicitar otra revisión" /></label></div>{message ? <p className={message.type === "error" ? styles.actionError : styles.actionSuccess} role={message.type === "error" ? "alert" : "status"}>{message.text}</p> : null}<div className={styles.actionBar}>{review.status === "pending" || review.status === "additional_review_required" ? <button type="submit" name="action" value="start" disabled={pending}>Iniciar revisión</button> : <><button type="submit" name="action" value="confirm" disabled={pending}>Confirmar recomendación</button><button type="submit" className={styles.secondaryAction} name="action" value="adjust" disabled={pending}>Ajustar nivel</button><button type="submit" className={styles.tertiaryAction} name="action" value="additional" disabled={pending}>Solicitar revisión adicional</button></>}</div><small>Las decisiones se auditan. El razonamiento interno nunca se envía a CRM.</small></form></section>;
}
