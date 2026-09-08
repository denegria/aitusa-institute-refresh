import { ContactForm } from "../../_components/ContactForm.jsx";
import { SiteFooter, SiteHeader } from "../../_components/site/SiteChrome.jsx";
import styles from "../../_components/public.module.css";
import { admissionContext } from "../../../src/admissions.js";
import { site } from "../../../src/content.js";
import { courseInquiryHref } from "../../../src/courseDiscovery.js";

export const metadata = {
  title: "Contáctanos | AIT USA Institute",
  description:
    "Habla con AIT USA Institute sobre programas, nivel, horarios y modalidad. El consentimiento SMS es siempre opcional.",
  alternates: { canonical: "https://www.aitusainstitute.com/contactanos" },
};

export default async function ContactPage({ searchParams }) {
  const context = admissionContext((await searchParams)?.curso);
  return (
    <div className={styles.pageShell}>
      <SiteHeader activePage="contact" />
      <main id="main-content" className={styles.contactMain}>
        <div className={styles.contactLayout}>
          <section className={styles.contactIntro}>
            <p className={styles.eyebrow}>Orientación de admisiones</p>
            <h1>Encuentra tu próximo paso.</h1>
            <p>
              Confirma tu curso, costo y horario con un asesor antes de inscribirte.
            </p>
            <a className={styles.formJump} href="#solicitar-orientacion">Completar el formulario <span aria-hidden="true">↓</span></a>
            <ul className={styles.trustList}>
              <li>Compara las opciones que encajan con tu objetivo.</li>
              <li>Consulta requisitos, materiales y grupos disponibles.</li>
            </ul>
            <nav className={styles.directContact} aria-label="Contacto directo">
              <a href={courseInquiryHref(site.whatsappHref, context.slug === "orientacion" ? "elegir un curso" : context.title)} target="_blank" rel="noreferrer">Escribir por WhatsApp</a>
              <a href={site.phoneHref}>Llamar al {site.phone}</a>
              <a href={site.emailHref}>Enviar un correo</a>
              <a href="/#sedes">Ver sedes y direcciones</a>
            </nav>
            <details className={styles.optionalDetails}>
              <summary>Qué ocurre al enviar el formulario</summary>
              <p>Guardamos tu solicitud de forma segura para que un asesor pueda darle seguimiento. También podrás abrir WhatsApp y enviar la conversación preparada.</p>
              <p>El formulario funciona aunque no aceptes mensajes SMS. El consentimiento promocional es opcional y separado.</p>
            </details>
          </section>
          <ContactForm key={context.slug} courseSlug={context.slug} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
