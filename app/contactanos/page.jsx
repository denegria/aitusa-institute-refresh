import { ContactForm } from "../_components/ContactForm.jsx";
import { PublicFooter, PublicHeader } from "../_components/PublicChrome.jsx";
import styles from "../_components/public.module.css";

export const metadata = {
  title: "Contáctanos | AIT USA Institute",
  description:
    "Habla con AIT USA Institute sobre programas, nivel, horarios y modalidad. El consentimiento SMS es siempre opcional.",
  alternates: { canonical: "https://www.aitusainstitute.com/contactanos" },
};

export default function ContactPage() {
  return (
    <div className={styles.pageShell}>
      <PublicHeader />
      <main className={styles.contactMain}>
        <div className={styles.contactLayout}>
          <section className={styles.contactIntro}>
            <p className={styles.eyebrow}>Respuesta humana</p>
            <h1>Cuéntanos qué necesitas.</h1>
            <p>
              Te ayudamos a elegir programa, nivel, modalidad y horario. Tu teléfono es opcional y
              recibir mensajes de texto promocionales siempre requiere una elección separada.
            </p>
            <ul className={styles.trustList}>
              <li>El formulario funciona aunque no aceptes mensajes SMS.</li>
              <li>No guardamos esta solicitud en AIT CRM mientras el gate de producción siga deshabilitado.</li>
              <li>Tú decides si abres y envías la conversación preparada por WhatsApp.</li>
            </ul>
          </section>
          <ContactForm />
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
