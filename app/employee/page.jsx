import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { EmployeeHeading, EmployeeShell } from "./EmployeeShell.jsx";
import styles from "./employee.module.css";
import { resolvePlacementReviewActor } from "../../src/placementReview/auth.server.js";
import { getPlacementReviewService } from "../../src/placementReview/runtime.server.js";
import { PlacementReviewError } from "../../src/placementReview/errors.js";

export const dynamic = "force-dynamic";
export const metadata = { title: "Portal de empleados | AIT USA", robots: { index: false, follow: false } };

export default async function EmployeePage() {
  const actor = await employeeActor("/employee");
  const reviews = await getPlacementReviewService().listReviews(actor);
  const pending = reviews.filter((review) => ["pending", "additional_review_required"].includes(review.status)).length;
  const inReview = reviews.filter((review) => review.status === "in_review").length;
  const completed = reviews.filter((review) => ["confirmed", "adjusted"].includes(review.status)).length;
  return <EmployeeShell actor={actor} active="overview">
    <EmployeeHeading eyebrow="Operaciones académicas" title={`Hola, ${actor.firstName}`} summary="Revisa la carga académica, abre la prioridad actual y deja cada decisión lista para continuar en CRM." />
    <section className={styles.cards} aria-label="Resumen de revisiones">
      <article className={`${styles.card} ${styles.metric}`}><small>Pendientes</small><strong>{pending}</strong><span>Esperan una primera revisión</span></article>
      <article className={`${styles.card} ${styles.metric}`}><small>En revisión</small><strong>{inReview}</strong><span>Decisiones activas</span></article>
      <article className={`${styles.card} ${styles.metric}`}><small>Completadas</small><strong>{completed}</strong><span>Confirmadas o ajustadas</span></article>
    </section>
    <section className={styles.focusCard}><div><h2>{pending ? "La siguiente revisión está lista" : "La cola está al día"}</h2><p>{pending ? "Abre la evidencia, inicia la revisión y toma una decisión académica desde el espacio protegido." : "No hay resultados pendientes en este momento."}</p></div><a className={styles.button} href="/employee/placement-reviews">Abrir revisiones</a></section>
  </EmployeeShell>;
}

async function employeeActor(path) {
  try {
    const requestHeaders = await headers();
    return await resolvePlacementReviewActor(new Request(`https://employee.aitusa.local${path}`, { headers: requestHeaders }));
  } catch (error) {
    if (error instanceof PlacementReviewError && error.code === "placement_review_unauthenticated") redirect(`/portal/sign-in/?returnTo=${encodeURIComponent(path)}`);
    notFound();
  }
}
