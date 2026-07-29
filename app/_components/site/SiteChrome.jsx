"use client";

import { useEffect, useState } from "react";
import { site } from "../../../src/content";

const sections = [
  ["Inicio", "inicio"],
  ["Método", "metodo"],
  ["Experiencias", "experiencia"],
  ["Cursos", "cursos"],
  ["Sedes", "sedes"],
  ["Contacto", "contacto"],
];
const readingSectionIds = [...sections.map(([, id]) => id), "faq"];

export function SiteHeader({ activePage = "home" }) {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");

  useEffect(() => {
    if (activePage !== "home") return undefined;

    let frameRequested = false;
    const update = () => {
      const nodes = readingSectionIds
        .map((id) => document.getElementById(id))
        .filter(Boolean)
        .sort((a, b) => a.offsetTop - b.offsetTop);
      if (!nodes.length) return;

      const readingLine = window.scrollY + Math.min(window.innerHeight * 0.32, 280);
      let current = nodes[0];
      for (const node of nodes) {
        if (node.offsetTop <= readingLine) current = node;
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8) {
        current = nodes.at(-1);
      }
      setActiveSection(current.id);
      frameRequested = false;
    };
    const requestUpdate = () => {
      if (frameRequested) return;
      frameRequested = true;
      window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    window.addEventListener("hashchange", requestUpdate);
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      window.removeEventListener("hashchange", requestUpdate);
    };
  }, [activePage]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

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
          className={`site-nav${open ? " is-open" : ""}`}
          id="site-nav"
          aria-label="Navegación principal"
        >
          {sections.map(([label, id]) => {
            const href = activePage === "home" ? `#${id}` : id === "inicio" ? "/" : `/#${id}`;
            const current = activePage === "home" && activeSection === id ? "location" : undefined;
            return (
              <a key={id} href={href} aria-current={current} onClick={closeMenu}>
                {label}
              </a>
            );
          })}
        </nav>
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
              <a href="/courses/"><span>Cursos</span><i data-lucide="arrow-right" aria-hidden="true" /></a>
              <a href="/placement-test/"><span>Examen de nivel</span><i data-lucide="arrow-right" aria-hidden="true" /></a>
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
