import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getPlacementReviewService } from "../../../src/placementReview/runtime.server.js";
import { resolvePlacementReviewActor } from "../../../src/placementReview/auth.server.js";
import { PlacementReviewError } from "../../../src/placementReview/errors.js";
import { isOpaqueReviewId, PLACEMENT_REVIEW_COPY } from "../../../src/placementReview/contract.js";
import { EmployeeHeading, EmployeeShell } from "../EmployeeShell.jsx";
import { PlacementReviewActions } from "./PlacementReviewActions.jsx";
import styles from "./placement-reviews.module.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Revisiones de ubicación | AIT USA", robots: { index: false, follow: false } };

export default async function PlacementReviewsPage({ searchParams }) {
  const params = await searchParams;
  const reviewId = typeof params?.review === "string" ? params.review : null;
  if (reviewId && !isOpaqueReviewId(reviewId)) notFound();
  const actor = await employeeActor(reviewId);
  try {
    const service = getPlacementReviewService();
    const reviews = await service.listReviews(actor);
    const selectedId = reviewId || reviews[0]?.id || null;
    const selected = selectedId ? await service.getReviewDetail(selectedId, actor) : null;
    return <EmployeeShell actor={actor} active="reviews">
      <EmployeeHeading eyebrow="Cola académica" title="Revisiones de ubicación" summary="Compara la recomendación con la evidencia completa y deja una decisión auditable." aside={<span className={styles.queueCount}>{reviews.filter((review) => !["confirmed", "adjusted"].includes(review.status)).length} activas</span>} />
      {params?.actionError ? <p className={styles.routeError} role="alert">No pudimos guardar la acción. La revisión no cambió; vuelve a intentarlo.</p> : null}
      <div className={styles.workspace}>
        <ReviewQueue reviews={reviews} selectedId={selected?.id} />
        <ReviewDetail review={selected} />
      </div>
    </EmployeeShell>;
  } catch (error) {
    if (error instanceof PlacementReviewError && error.code === "placement_review_not_found") notFound();
    throw error;
  }
}

async function employeeActor(reviewId) {
  try {
    const requestHeaders = await headers();
    return await resolvePlacementReviewActor(new Request("https://employee.aitusa.local/employee/placement-reviews", { headers: requestHeaders }));
  } catch (error) {
    if (error instanceof PlacementReviewError && error.code === "placement_review_unauthenticated") {
      const returnTo = reviewId ? `/employee/placement-reviews?review=${encodeURIComponent(reviewId)}` : "/employee/placement-reviews";
      redirect(`/employee/sign-in/?returnTo=${encodeURIComponent(returnTo)}`);
    }
    notFound();
  }
}

function ReviewQueue({ reviews, selectedId }) {
  return <section className={styles.queue} aria-label="Cola de revisiones">
    <div className={styles.queueHeading}><div><p>Trabajo asignado</p><h2>Cola</h2></div><span>{reviews.length}</span></div>
    {reviews.length ? <ul>{reviews.map((review) => <li key={review.id}><a href={`/employee/placement-reviews?review=${encodeURIComponent(review.id)}`} aria-current={selectedId === review.id ? "page" : undefined}><span className={styles.statusDot} data-status={review.status} aria-hidden="true" /><div><strong>{statusLabel(review.status)}</strong><span>{review.finalLevel || review.recommendedLevel}</span><small>{formatDate(review.updatedAt)}</small></div></a></li>)}</ul> : <div className={styles.queueEmpty}><strong>Todo al día</strong><p>No hay revisiones asignadas.</p></div>}
  </section>;
}

function ReviewDetail({ review }) {
  if (!review) return <section className={styles.detail}><div className={styles.blank}><p>Cola académica</p><h2>Selecciona una revisión</h2><span>La evidencia y las decisiones aparecerán aquí.</span></div></section>;
  const groups = groupAnswers(review.evidence.answers);
  return <section className={styles.detail} id="placement-review-detail" aria-live="polite">
    <header className={styles.detailHeader}>
      <div><p>{statusLabel(review.status)}</p><h2>{review.finalLevel || review.recommendedLevel}</h2><span>Revisión #{review.id.slice(0, 8)} · Versión {review.revision}</span></div>
      <span className={styles.levelBadge}>{PLACEMENT_REVIEW_COPY.recommended}: {review.recommendedLevel}</span>
    </header>
    <div className={styles.summaryGrid}>
      <article><small>Puntaje</small><strong>{review.evidence.quizScore}</strong><span>de 62 preguntas</span></article>
      <article><small>Respondidas</small><strong>{review.evidence.answeredQuestionCount}</strong><span>{review.evidence.skippedQuestionCount} omitidas</span></article>
      <article><small>Estado del resultado</small><strong>{resultStatusLabel(review.evidence.resultStatus)}</strong><span>{formatDate(review.evidence.completedAt)}</span></article>
    </div>
    <section className={styles.evidenceSection} aria-labelledby="academic-context-title"><div className={styles.sectionHeading}><div><p>Evidencia cualitativa</p><h3 id="academic-context-title">Contexto académico</h3></div></div><div className={styles.contextGrid}><article><small>Objetivo</small><p>{review.evidence.goal || "No proporcionado"}</p></article><article><small>Muestra escrita</small><p className={styles.writing}>{review.evidence.writingSample || "No se proporcionó una muestra escrita."}</p></article></div></section>
    <section className={styles.evidenceSection} aria-labelledby="answers-title"><div className={styles.sectionHeading}><div><p>Detalle objetivo</p><h3 id="answers-title">Respuestas del examen</h3></div><span>{review.evidence.answers.length ? `${review.evidence.answers.filter((answer) => answer.correct).length} correctas` : "Sin respuestas retenidas"}</span></div>{groups.length ? <div className={styles.answerGroups}>{groups.map((group) => <details key={group.label}><summary><span>{group.label}</span><strong>{group.correct}/{group.answers.length}</strong></summary><ol>{group.answers.map((answer) => <li data-correct={answer.correct} key={answer.questionKey}><p>{answer.prompt}</p><span>Respuesta: {answer.selectedAnswer || "Omitida"}</span><small>Clave: {answer.correctAnswer}</small></li>)}</ol></details>)}</div> : <div className={styles.noEvidence}><strong>No hay respuestas crudas disponibles</strong><p>Este intento registró {review.evidence.skippedQuestionCount} preguntas omitidas o los datos ya cumplieron su período de retención.</p></div>}</section>
    <section className={styles.evidenceSection} aria-labelledby="audit-title"><div className={styles.sectionHeading}><div><p>Trazabilidad</p><h3 id="audit-title">Historial de la revisión</h3></div></div><ol className={styles.timeline}>{review.events.map((event, index) => <li key={`${event.eventType}-${event.revision}-${index}`}><span aria-hidden="true" /><div><strong>{eventLabel(event.eventType)}</strong><time dateTime={event.occurredAt}>{formatDateTime(event.occurredAt)}</time>{event.internalRationale ? <p>{event.internalRationale}</p> : null}</div></li>)}</ol></section>
    <PlacementReviewActions review={review} />
  </section>;
}

function groupAnswers(answers) { const groups = new Map(); for (const answer of answers || []) { const label = `${answer.levelLabel}${answer.book ? ` · ${answer.book}` : ""}`; if (!groups.has(label)) groups.set(label, []); groups.get(label).push(answer); } return [...groups].map(([label, items]) => ({ label, answers: items, correct: items.filter((item) => item.correct).length })); }
function statusLabel(status) { return ({ pending: PLACEMENT_REVIEW_COPY.pending, in_review: "En revisión", confirmed: PLACEMENT_REVIEW_COPY.confirmed, adjusted: "Nivel ajustado por AIT", additional_review_required: PLACEMENT_REVIEW_COPY.additional })[status] || PLACEMENT_REVIEW_COPY.pending; }
function resultStatusLabel(status) { return ({ provisional: "Provisional", validated: "Validado", borderline: "Límite", advisor_review: "Revisión requerida" })[status] || "Provisional"; }
function eventLabel(type) { return ({ placement_review_created: "Revisión creada", placement_review_started: "Revisión iniciada", placement_review_confirmed: "Nivel confirmado", placement_review_adjusted: "Nivel ajustado", placement_review_additional_review_required: "Revisión adicional solicitada" })[type] || "Actualización registrada"; }
function formatDate(value) { if (!value) return "Sin fecha"; return new Intl.DateTimeFormat("es-US", { month: "short", day: "numeric", year: "numeric", timeZone: "America/New_York" }).format(new Date(value)); }
function formatDateTime(value) { if (!value) return "Sin fecha"; return new Intl.DateTimeFormat("es-US", { dateStyle: "medium", timeStyle: "short", timeZone: "America/New_York" }).format(new Date(value)); }
