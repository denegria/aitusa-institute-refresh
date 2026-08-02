import Link from "next/link";
import { LEGAL_EFFECTIVE_DATE_ES } from "../../src/legal/publicLegalContent.js";
import { SiteFooter, SiteHeader } from "./site/SiteChrome.jsx";
import styles from "./public.module.css";

export function LegalPage({ policy }) {
  return (
    <div className={styles.pageShell}>
      <SiteHeader activePage="legal" />
      <main id="main-content" className={styles.legalMain}>
        <header className={styles.legalHero}>
          <p className={styles.eyebrow}>{policy.eyebrow}</p>
          <h1>{policy.title}</h1>
          <p className={styles.legalSummary}>{policy.summary}</p>
          <div className={styles.policyMeta}>
            <span>Vigente desde: {policy.effectiveDateEs || LEGAL_EFFECTIVE_DATE_ES}</span>
            <span>Versión: {policy.version}</span>
          </div>
        </header>

        <div className={styles.legalLayout}>
          <aside className={styles.legalToc} aria-label={`Contenido de ${policy.title}`}>
            <strong>En esta página</strong>
            {policy.sections.map((section) => (
              <a key={section.id} href={`#${section.id}`}>{section.title}</a>
            ))}
            <a href="#contacto-legal">Contacto</a>
          </aside>

          <article className={styles.legalArticle}>
            {policy.sections.map((section) => (
              <section id={section.id} key={section.id} className={styles.legalSection}>
                <h2>{section.title}</h2>
                {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.bullets ? (
                  <ul>
                    {section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                  </ul>
                ) : null}
              </section>
            ))}

            <section className={styles.englishSummary} aria-labelledby="english-summary">
              <p className={styles.eyebrow}>For carrier and compliance review</p>
              <h2 id="english-summary">{policy.englishSummary.title}</h2>
              {policy.englishSummary.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </section>

            <section id="contacto-legal" className={styles.contactPanel}>
              <p className={styles.eyebrow}>Contacto legal y de privacidad</p>
              <h2>¿Tienes una pregunta o solicitud?</h2>
              <p>AIT USA Institute, una división de Arrieta Institute LLC</p>
              <p>213 E. Main St., Bound Brook, NJ 08805, Estados Unidos</p>
              <p>
                Escribe a <a href="mailto:info@aitusainstitute.com">info@aitusainstitute.com</a>,
                llama al <a href="tel:+17322710011">+1 732-271-0011</a> o usa nuestro{" "}
                <Link href="/contactanos">formulario de contacto</Link>.
              </p>
              <p>
                Para dejar de recibir mensajes de texto, responde <strong>STOP</strong>. Para ayuda,
                responde <strong>HELP</strong>.
              </p>
            </section>
          </article>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
