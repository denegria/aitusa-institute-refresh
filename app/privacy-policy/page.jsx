import { LegalPage } from "../_components/LegalPage.jsx";
import { privacyPolicy } from "../../src/legal/publicLegalContent.js";

export const metadata = {
  title: "Política de Privacidad | AIT USA Institute",
  description:
    "Cómo AIT USA Institute recopila, usa y protege información, incluidos datos de consentimiento y mensajes SMS.",
  alternates: { canonical: "https://www.aitusainstitute.com/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return <LegalPage policy={privacyPolicy} />;
}

