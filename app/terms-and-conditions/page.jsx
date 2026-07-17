import { LegalPage } from "../_components/LegalPage.jsx";
import { termsAndConditions } from "../../src/legal/publicLegalContent.js";

export const metadata = {
  title: "Términos y Condiciones | AIT USA Institute",
  description:
    "Términos de uso del sitio y condiciones del programa de mensajes SMS de AIT USA Institute.",
  alternates: { canonical: "https://www.aitusainstitute.com/terms-and-conditions" },
};

export default function TermsAndConditionsPage() {
  return <LegalPage policy={termsAndConditions} />;
}

