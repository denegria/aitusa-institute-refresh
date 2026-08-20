import { PortalRoute } from "./PortalRoute.jsx";

export const dynamic = "force-dynamic";
export const metadata = { title: "Portal estudiantil | AIT USA Institute", robots: { index: false, follow: false } };
export default async function PortalPage({ searchParams }) { return <PortalRoute section="home" searchParams={searchParams} />; }
