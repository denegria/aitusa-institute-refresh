import { notFound } from "next/navigation";
import { isPortalPrototypeAvailable } from "../../../src/portal/portalAvailability.js";
import { PasswordResetExperience } from "./PasswordResetExperience.jsx";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Crear contraseña | AIT USA Institute",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function PortalPasswordResetPage({ searchParams }) {
  if (!isPortalPrototypeAvailable()) notFound();
  const params = await searchParams;
  return (
    <PasswordResetExperience
      initialError={params?.error === "invalid_link" ? "invalid_link" : ""}
    />
  );
}
