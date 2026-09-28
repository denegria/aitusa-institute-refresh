import { ContactForm } from "../../_components/ContactForm.jsx";
import { SiteFooter, SiteHeader } from "../../_components/site/SiteChrome.jsx";
import styles from "../../_components/public.module.css";
import { admissionContext } from "../../../src/admissions.js";
import { site } from "../../../src/content.js";
import { courseInquiryHref } from "../../../src/courseDiscovery.js";

export const metadata = {
  title: "Contáctanos | AIT USA Institute",
  description:
    "Habla con admisiones de AIT USA Institute sobre cursos, precios, horarios y modalidades antes de inscribirte.",
  alternates: { canonical: "https://www.aitusainstitute.com/contactanos" },
};

export default async function ContactPage({ searchParams }) {
  const context = admissionContext((await searchParams)?.curso);
  return (
    <div className={`${styles.pageShell} ${styles.contactPage}`}>
      <SiteHeader activePage="contact" />
      <main id="main-content" className={styles.contactMain}>
        <div className={styles.contactLayout}>
          <section className={styles.contactIntro}>
            <p className={styles.eyebrow}>Habla con admisiones</p>
            <h1>¿Tienes dudas antes de inscribirte?</h1>
            <p>
              Cuéntanos qué curso te interesa o si necesitas ayuda para elegir.
              Un asesor te responderá sobre precios, horarios y modalidades.
            </p>
            <div className={styles.contactActions}>
              <a className={styles.whatsappLink} href={courseInquiryHref(site.whatsappHref, context.slug === "orientacion" ? "mi próximo curso" : context.title)} target="_blank" rel="noreferrer">Prefiero WhatsApp <span aria-hidden="true">↗</span></a>
            </div>
          </section>
          <ContactForm key={context.slug} courseSlug={context.slug} />
          <aside className={styles.contactAside} aria-label="Otras formas de contacto">
            <h2>Otras formas de contacto</h2>
            <nav className={styles.directContact} aria-label="Contacto directo">
              <a href={site.phoneHref}>Llamar al {site.phone}</a>
              <a href={site.emailHref}>Enviar un correo</a>
              <a href="/#sedes">Ver sedes y direcciones</a>
            </nav>
            <details className={styles.optionalDetails}>
              <summary>Qué ocurre al enviar el formulario</summary>
              <p>Guardamos tu solicitud de forma segura para que un asesor pueda darle seguimiento. También podrás abrir WhatsApp y enviar la conversación preparada.</p>
            </details>
          </aside>
        </div>
      </main>
      <SiteFooter variant="utility" />
    </div>
  );
}
