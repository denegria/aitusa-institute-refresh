"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "../../../src/content";

const primaryNavigation = [
  { label: "Inicio", href: "/", page: "home" },
  { label: "Cursos", href: "/cursos/", page: "courses" },
  { label: "Examen de nivel", href: "/placement-test/", page: "placement" },
];

export function SiteHeader({ activePage = "home" }) {
  const [open, setOpen] = useState(false);
  const menuButton = useRef(null);
  const navigation = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      window.requestAnimationFrame(() => menuButton.current?.focus());
    };
    const onPointerDown = (event) => {
      if (
        menuButton.current?.contains(event.target) ||
        navigation.current?.contains(event.target)
      ) {
        return;
      }
      setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <>
      <a className="skip-link" href="#main-content">Saltar al contenido</a>
      <header className="site-header">
        <a className="brand" href="/" aria-label="AIT USA Institute, inicio">
          <img src={site.images.logo} alt="Logo de AiT USA Institute" />
          <span>
            <strong>AIT USA</strong>
            <small>INSTITUTE</small>
          </span>
        </a>
        <button
          ref={menuButton}
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="site-nav"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((value) => !value)}
        >
          <i className="menu-toggle__open" data-lucide="menu" aria-hidden="true" />
          <i className="menu-toggle__close" data-lucide="x" aria-hidden="true" />
        </button>
        <nav
          ref={navigation}
          className={`site-nav${open ? " is-open" : ""}`}
          id="site-nav"
          aria-label="Navegación principal"
        >
          {primaryNavigation.map(({ label, href, page }) => {
            const current = activePage === page ? "page" : undefined;
            return (
              <a key={href} href={href} aria-current={current} onClick={closeMenu}>
                {label}
              </a>
            );
          })}
        </nav>
        <a
          className="student-portal-entry"
          href="/portal/sign-in/"
          aria-label="Portal de estudiantes: iniciar sesión"
          title="Portal de estudiantes"
        >
          <i data-lucide="user-round" aria-hidden="true" />
        </a>
        <a className="header-cta" href={site.phoneHref}>
          <i data-lucide="phone" aria-hidden="true" />
          Llámanos
        </a>
      </header>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="section-inner site-footer__compact">
        <div className="site-footer__link-rows">
          <div className="site-footer__group">
            <p className="site-footer__group-label" id="footer-contact-label">Contacto</p>
            <div className="site-footer__contact" aria-labelledby="footer-contact-label">
              <a href={site.phoneHref} aria-label={`Llamar a ${site.phone}`}>
                <i data-lucide="phone" aria-hidden="true" />
                Llamar
              </a>
              <a href={site.whatsappHref} target="_blank" rel="noreferrer">
                <i data-lucide="message-circle" aria-hidden="true" />
                WhatsApp
              </a>
              <a href={site.emailHref}>
                <i data-lucide="mail" aria-hidden="true" />
                Email
              </a>
            </div>
          </div>
          <div className="site-footer__group">
            <p className="site-footer__group-label" id="footer-nav-label">Explora</p>
            <nav className="site-footer__nav" aria-labelledby="footer-nav-label">
              <a href="/cursos/"><span>Cursos</span><i data-lucide="arrow-right" aria-hidden="true" /></a>
              <a href="/placement-test/"><span>Examen de nivel</span><i data-lucide="arrow-right" aria-hidden="true" /></a>
              <a href="/portal/sign-in/"><span>Portal estudiantil</span><i data-lucide="arrow-right" aria-hidden="true" /></a>
              <a href="/employee/sign-in/"><span>Acceso de empleados</span><i data-lucide="arrow-right" aria-hidden="true" /></a>
              <a href={site.legalLinks.contact}><span>Contacto</span><i data-lucide="arrow-right" aria-hidden="true" /></a>
            </nav>
          </div>
        </div>
        <div className="site-footer__legal">
          <span className="site-footer__identity">
            <strong>AIT USA</strong> · © {new Date().getFullYear()} {site.legal}
          </span>
          <div className="site-footer__legal-links">
            <a href={site.legalLinks.privacy}>Privacidad</a>
            <a href={site.legalLinks.terms}>Términos</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
