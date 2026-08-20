import { notFound } from "next/navigation";
import { SignInExperience } from "../../portal/sign-in/SignInExperience.jsx";
import { isPortalPrototypeAvailable } from "../../../src/portal/portalAvailability.js";
import { sanitizePortalReturnTo } from "../../../src/portalAuth/returnTo.js";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Acceso de empleados | AIT USA Institute",
  robots: { index: false, follow: false },
};

export default async function EmployeeSignInPage({ searchParams }) {
  if (!isPortalPrototypeAvailable()) notFound();
  const params = await searchParams;
  return (
    <SignInExperience
      audience="employee"
      returnTo={sanitizePortalReturnTo(params?.returnTo, "employee")}
    />
  );
}
