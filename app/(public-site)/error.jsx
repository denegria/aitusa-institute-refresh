"use client";

import { useEffect } from "react";
import { SiteFooter, SiteHeader } from "../_components/site/SiteChrome";

export default function PublicError({ reset }) {
  useEffect(() => {
    console.error("Public site route error");
  }, []);

  return (
    <>
      <SiteHeader activePage="error" />
      <main id="main-content">
        <section className="page-hero" aria-labelledby="public-error-title">
          <div className="section-inner">
            <div className="hero__copy">
              <p className="section-kicker">AIT USA Institute</p>
              <h1 id="public-error-title">Algo no cargó como esperábamos.</h1>
              <p>Intenta nuevamente o vuelve al inicio para continuar explorando AiT USA Institute.</p>
              <div className="hero__actions">
                <button className="button button--primary" type="button" onClick={() => reset()}>
                  Intentar de nuevo
                </button>
                <a className="inline-link" href="/">Volver al inicio</a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
