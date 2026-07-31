import { notFound } from "next/navigation";
import { SignInExperience } from "./SignInExperience.jsx";
import { isPortalPrototypeAvailable } from "../../../src/portal/portalAvailability.js";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Entrar al Portal | AIT USA Institute",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PortalSignInPage() {
  if (!isPortalPrototypeAvailable()) notFound();
  return <SignInExperience />;
}
