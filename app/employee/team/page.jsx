import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { EmployeeHeading, EmployeeShell } from "../EmployeeShell.jsx";
import styles from "../employee.module.css";
import { resolvePlacementReviewActor } from "../../../src/placementReview/auth.server.js";
import { getPlacementReviewService } from "../../../src/placementReview/runtime.server.js";
import { PlacementReviewError } from "../../../src/placementReview/errors.js";

export const dynamic = "force-dynamic";
export default async function EmployeeTeamPage() {
  const actor = await employeeActor();
  const reviewers = await getPlacementReviewService().listActiveReviewers(actor);
  return <EmployeeShell actor={actor} active="team">
    <EmployeeHeading eyebrow="Acceso y permisos" title="Equipo de revisión" summary="Directorio de empleados activos con acceso a decisiones académicas de AIT USA. Los cambios de rol requieren un administrador." />
    {reviewers.length ? <ul className={styles.teamList}>{reviewers.map((reviewer, index) => <li className={styles.card} key={`${reviewer.firstName}-${reviewer.role}-${index}`}><div><strong>{reviewer.firstName}</strong><span> · Cuenta verificada</span></div><span>{reviewer.role === "admin" ? "Administrador" : "Revisor senior"}</span></li>)}</ul> : <section className={`${styles.card} ${styles.empty}`}><h2>No hay revisores activos</h2><p>Un administrador debe conceder acceso antes de que un empleado pueda entrar.</p></section>}
  </EmployeeShell>;
}
async function employeeActor() { try { const requestHeaders = await headers(); return await resolvePlacementReviewActor(new Request("https://employee.aitusa.local/employee/team", { headers: requestHeaders })); } catch (error) { if (error instanceof PlacementReviewError && error.code === "placement_review_unauthenticated") redirect(`/portal/sign-in/?returnTo=${encodeURIComponent("/employee/team")}`); notFound(); } }
