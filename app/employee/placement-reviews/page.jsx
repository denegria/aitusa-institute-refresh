import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getPlacementReviewService } from "../../../src/placementReview/runtime.server.js";
import { resolvePlacementReviewActor } from "../../../src/placementReview/auth.server.js";
import { isOpaqueReviewId, PLACEMENT_REVIEW_COPY } from "../../../src/placementReview/contract.js";
import styles from "./placement-reviews.module.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Revisiones de ubicación | AIT USA", robots: { index: false, follow: false } };

export default async function PlacementReviewsPage({ searchParams }) {
  const params = await searchParams;
  const reviewId = typeof params?.review === "string" ? params.review : null;
  if (reviewId && !isOpaqueReviewId(reviewId)) notFound();
  try {
    const requestHeaders = await headers();
    const request = new Request("https://employee.aitusa.local/employee/placement-reviews", { headers: requestHeaders });
    const actor = await resolvePlacementReviewActor(request);
    const service = getPlacementReviewService();
    const reviews = await service.listReviews(actor);
    const selected = reviewId ? await service.getReview(reviewId, actor) : reviews[0] || null;
    return <ReviewSurface reviews={reviews} selected={selected} />;
  } catch {
    // Employee access is deliberately indistinguishable from a missing route.
    notFound();
  }
}

function ReviewSurface({ reviews, selected }) {
  return <main className={styles.page} aria-labelledby="placement-reviews-title">
    <a className={styles.skip} href="#placement-review-detail">Saltar a la revisión</a>
    <header className={styles.header}><p>AIT USA · Operaciones académicas</p><h1 id="placement-reviews-title">Revisiones de ubicación</h1><span>{PLACEMENT_REVIEW_COPY.pending}</span></header>
    <div className={styles.grid}>
      <section className={styles.queue} aria-label="Cola de revisiones">
        <h2>Cola</h2>
        {reviews.length ? <ul>{reviews.map((review) => <li key={review.id}><a href={`/employee/placement-reviews?review=${encodeURIComponent(review.id)}`} aria-current={selected?.id === review.id ? "page" : undefined}><strong>{statusLabel(review.status)}</strong><span>{review.recommendedLevel}</span><small>Actualización {new Intl.DateTimeFormat("es", { dateStyle: "medium" }).format(new Date(review.updatedAt))}</small></a></li>)}</ul> : <p role="status">No hay revisiones asignadas.</p>}
      </section>
      <section className={styles.detail} id="placement-review-detail" aria-live="polite">
        {selected ? <><p className={styles.eyebrow}>{statusLabel(selected.status)}</p><h2>{selected.finalLevel || selected.recommendedLevel}</h2><dl><div><dt>{PLACEMENT_REVIEW_COPY.recommended}</dt><dd>{selected.recommendedLevel}</dd></div><div><dt>Versión</dt><dd>{selected.revision}</dd></div></dl><ReviewActions review={selected} /></> : <><h2>Selecciona una revisión</h2><p>La cola muestra únicamente el estado académico necesario para la decisión.</p></>}
      </section>
    </div>
  </main>;
}
function ReviewActions({ review }) {
  if (["confirmed", "adjusted"].includes(review.status)) return <p role="status">{PLACEMENT_REVIEW_COPY.confirmed}</p>;
  return <form className={styles.actions} action={`/api/employee/placement-reviews/${review.id}`} method="post"><input type="hidden" name="expectedRevision" value={review.revision} /><button name="action" value="start" disabled={review.status !== "pending" && review.status !== "additional_review_required"}>Iniciar revisión</button><button name="action" value="confirm" disabled={review.status !== "in_review"}>Confirmar nivel</button><button name="action" value="additional" disabled={review.status !== "in_review"}>Solicitar revisión adicional</button><p>Las decisiones quedan auditadas; no incluyas respuestas, textos ni datos de contacto aquí.</p></form>;
}
function statusLabel(status) { return ({ pending: PLACEMENT_REVIEW_COPY.pending, in_review: "En revisión", confirmed: PLACEMENT_REVIEW_COPY.confirmed, adjusted: "Nivel ajustado por AIT", additional_review_required: PLACEMENT_REVIEW_COPY.additional })[status] || PLACEMENT_REVIEW_COPY.pending; }
