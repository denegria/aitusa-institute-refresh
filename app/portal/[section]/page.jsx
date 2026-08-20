import { notFound } from "next/navigation";
import { PortalRoute, PORTAL_SECTIONS } from "../PortalRoute.jsx";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }) { const { section } = await params; const titles = { results: "Mi nivel", courses: "Mis cursos", attendance: "Asistencia", account: "Mi cuenta" }; return { title: `${titles[section] || "Portal"} | AIT USA Institute`, robots: { index: false, follow: false } }; }
export default async function PortalSectionPage({ params, searchParams }) { const { section } = await params; if (!PORTAL_SECTIONS.includes(section) || section === "home") notFound(); return <PortalRoute section={section} searchParams={searchParams} />; }
