import Link from "next/link";
import styles from "./public.module.css";

const logo = "/assets/wix/076-solo-logo-4-x-4-clases1.png";

export function PublicHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link className={styles.brand} href="/" aria-label="AIT USA Institute — inicio">
          <img src={logo} alt="" width="54" height="54" />
          <span>
            <strong>AIT USA Institute</strong>
            <small>Una división de Arrieta Institute LLC</small>
          </span>
        </Link>
        <nav className={styles.nav} aria-label="Navegación principal">
          <Link href="/courses">Cursos</Link>
          <Link href="/placement-test">Examen de ubicación</Link>
          <Link className={styles.navCta} href="/contactanos">Contáctanos</Link>
        </nav>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerGrid}>
        <div>
          <strong className={styles.footerTitle}>AIT USA Institute</strong>
          <p>Inglés, GED y computación con orientación humana en Nueva Jersey.</p>
        </div>
        <div>
          <strong className={styles.footerTitle}>Contacto</strong>
          <a href="tel:+17322710011">+1 732-271-0011</a>
          <a href="mailto:info@aitusainstitute.com">info@aitusainstitute.com</a>
          <Link href="/contactanos">Formulario de contacto</Link>
        </div>
        <div>
          <strong className={styles.footerTitle}>Legal</strong>
          <Link href="/privacy-policy">Política de Privacidad</Link>
          <Link href="/terms-and-conditions">Términos y Condiciones</Link>
        </div>
      </div>
    </footer>
  );
}
