import { notFound } from "next/navigation";
import { SignInExperience } from "./SignInExperience.jsx";
import { isPortalPrototypeAvailable } from "../../../src/portal/portalAvailability.js";
import { sanitizePortalReturnTo } from "../../../src/portalAuth/returnTo.js";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Entrar al Portal | AIT USA Institute",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function PortalSignInPage({ searchParams }) {
  if (!isPortalPrototypeAvailable()) notFound();
  const params = await searchParams;
  return <SignInExperience audience="student" returnTo={sanitizePortalReturnTo(params?.returnTo, "student")} />;
}
