import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";

describe("homepage selective concept integration", () => {
  it("keeps the homepage in one proof-led funnel sequence", async () => {
    const source = await readFile("src/main.js", "utf8");
    const methodIndex = source.indexOf("${renderSolutionSection()}");
    const proofIndex = source.indexOf("${renderProofSection()}");
    const offeringsIndex = source.indexOf("${renderOfferingPathSection()}");
    const locationsIndex = source.indexOf("${renderLocationsSection()}");
    const faqIndex = source.indexOf("${renderFaqSection()}");
    const finalCtaIndex = source.indexOf("${renderFinalCtaSection()}");

    assert.ok(methodIndex >= 0);
    assert.ok(proofIndex > methodIndex);
    assert.ok(offeringsIndex > proofIndex);
    assert.ok(locationsIndex > offeringsIndex);
    assert.ok(faqIndex > locationsIndex);
    assert.ok(finalCtaIndex > faqIndex);
    assert.doesNotMatch(source, /renderCommunitySection/);
    assert.match(source, /Historias de estudiantes AIT/);
    assert.match(source, /Desliza para conocer más historias/);
    assert.doesNotMatch(source, /Un espacio para practicar, equivocarse y seguir avanzando con confianza/);
    assert.match(source, /methodNarrative\.heading/);
    assert.match(source, /class="method-reasons"/);
    assert.doesNotMatch(source, /data-method-tabs/);
    assert.doesNotMatch(source, /Luego elige<br \/>cómo estudiar/);
    assert.doesNotMatch(source, /asset\(site\.images\.testimonialAntonina\)/);
    assert.doesNotMatch(source, /De estudiante a profesor/);
    assert.doesNotMatch(source, /cuidadosamente seleccionados/);
    assert.doesNotMatch(
      source.slice(source.indexOf("function renderHomePage"), source.indexOf("function renderCoursesPage")),
      /renderCourseTeaserSection/,
    );
    assert.match(
      source,
      /initFaqs\(document\);\s*initSectionNavigation\(document\);\s*scrollToInitialHash\(\);/,
    );
  });

  it("keeps three primary modality choices and moves support programs into catalog copy", async () => {
    const source = await readFile("src/main.js", "utf8");
    const section = source.slice(
      source.indexOf("function renderOfferingPathSection"),
      source.indexOf("function renderOfferingsSection"),
    );

    assert.match(section, /productOfferings\s*\.slice\(0, 3\)/);
    assert.match(section, /offer-node__marker/);
    assert.match(section, /offer-node__link/);
    assert.doesNotMatch(section, /eyebrow-chip/);
    assert.match(section, /También ofrecemos inglés para niños, GED, computación/);
    assert.doesNotMatch(section, /Ver catálogo completo/);
  });

  it("uses placement as the primary conversion action and callback as the sole secondary action", async () => {
    const source = await readFile("src/main.js", "utf8");
    const section = source.slice(
      source.indexOf("function renderFinalCtaSection"),
      source.indexOf("function renderCourseTeaserSection"),
    );

    assert.equal((section.match(/renderCtaBox\(/g) || []).length, 0);
    assert.match(section, /¿Listo para empezar\?/);
    assert.match(section, /Encuentra tu nivel/);
    assert.match(section, /final-cta-contact-row/);
    assert.match(section, /Solicitar llamada/);
    assert.equal((section.match(/class="final-cta-contact-link"/g) || []).length, 1);
    assert.doesNotMatch(section, />WhatsApp</);
    assert.match(section, /final-cta-actions/);
    assert.match(section, /conversionCtas\.placement/);
    assert.doesNotMatch(section, /conversionCtas\.advisor/);
    assert.doesNotMatch(section, /callback-launcher/);
    assert.doesNotMatch(section, /final-cta-note/);
    assert.match(section, /<dialog[\s\S]*data-callback-dialog/);
    assert.match(section, /aria-haspopup="dialog"/);
    assert.match(section, /name="nombre"/);
    assert.match(section, /name="telefono"/);
    assert.match(section, /name="email"/);
    assert.match(section, /name="ubicacion"/);
    assert.match(section, /name="mejorHorario"/);
    assert.doesNotMatch(section, /name="apellido"/);
    assert.doesNotMatch(section, /name="interes"/);
    assert.doesNotMatch(section, /name="para"/);
  });

  it("uses a real map with compact location rows and one shared schedule", async () => {
    const source = await readFile("src/main.js", "utf8");
    const section = source.slice(
      source.indexOf("function renderLocationsSection"),
      source.indexOf("function renderProofSection"),
    );
    const locationRenderers = source.slice(
      source.indexOf("function renderRealMapPin"),
      source.indexOf("function renderPendingLocationNote"),
    );

    assert.match(section, /location-explorer/);
    assert.match(section, /real-map-card__image/);
    assert.match(section, /new-jersey-campus-map\.jpg/);
    assert.match(section, /© OpenStreetMap/);
    assert.match(section, /real-map-card__attribution/);
    assert.match(section, /aria-label="Ampliar mapa en OpenStreetMap"/);
    assert.match(section, /mappedLocations\.map\(renderRealMapPin\)/);
    assert.match(section, /mappedLocations\.map\(renderCompactLocationRow\)/);
    assert.match(section, /onlineLocation \? renderCompactLocationRow/);
    assert.doesNotMatch(section, /location-online-option/);
    assert.match(section, /location-hours-panel/);
    assert.match(section, /mainCampusHours\.map/);
    assert.match(locationRenderers, /compact-location-row/);
    assert.match(locationRenderers, /google\.com\/maps\/search/);
    assert.doesNotMatch(section, /<iframe/);
    assert.doesNotMatch(section, /<svg/);
    assert.doesNotMatch(section, /real-map-card__footer/);
    assert.doesNotMatch(section, /location-map__art/);
    assert.doesNotMatch(section, /status !== "pending"\)\.map/);
  });

  it("tracks the active homepage section in the sticky navigation", async () => {
    const source = await readFile("src/main.js", "utf8");

    assert.match(source, /data-nav-section/);
    assert.match(source, /function initSectionNavigation/);
    assert.match(source, /aria-current", "location"/);
    assert.match(source, /window\.requestAnimationFrame\(setActiveSection\)/);
    assert.match(source, /window\.addEventListener\("scroll", requestUpdate/);
  });

  it("keeps homepage transitions conversational instead of exposing funnel scaffolding", async () => {
    const source = await readFile("src/main.js", "utf8");
    const homepageSections = source.slice(
      source.indexOf("function renderOfferingPathSection"),
      source.indexOf("function renderProofSection"),
    );

    assert.match(homepageSections, /¿Cómo quieres estudiar\?/);
    assert.match(homepageSections, /Sedes cerca de ti\./);
    assert.doesNotMatch(homepageSections, /mejor encaja/);
    assert.doesNotMatch(homepageSections, /sin salir de esta sección/);
  });

  it("keeps the verified schedule on the three active New Jersey campuses", async () => {
    const content = await readFile("src/content.js", "utf8");

    assert.match(content, /Lunes a jueves: 8:30 am, 9:30 am y 10:30 am/);
    assert.match(content, /Lunes a jueves: 6:20 pm, 7:30 pm y 8:40 pm/);
    assert.match(content, /Sábados: 10:00 am a 1:00 pm y 3:00 pm a 5:30 pm/);
    assert.match(content, /Domingos: 10:00 am a 12:30 pm/);
    assert.equal((content.match(/\.\.\.centralLocationContact/g) || []).length, 5);
  });

  it("keeps the approved mobile polish legible and touch friendly", async () => {
    const source = await readFile("src/main.js", "utf8");
    const styles = await readFile("src/styles.css", "utf8");
    const content = await readFile("src/content.js", "utf8");
    const hero = source.slice(source.indexOf("function renderHero"), source.indexOf("function renderOfferingsSection"));

    assert.match(styles, /\.hero__kicker\s*\{[\s\S]*color: #8a6412/);
    assert.match(content, /headline: "Comprende el inglés\. Exprésate con confianza\."/);
    assert.match(content, /headlineAccent: ""/);
    assert.match(content, /primary: "Conoce tu nivel"/);
    assert.match(content, /secondary: "Explora el método"/);
    assert.match(content, /Graphic Concept es nuestro método visual/);
    assert.match(content, /comunicarte en el trabajo, los estudios y la vida diaria/);
    assert.match(content, /¿Quieres hablar inglés rápido, fácil y sin estrés\?/);
    assert.match(content, /¿Llevas tiempo intentando hablar inglés y todavía no lo logras\?/);
    assert.match(content, /¿Te obligan a memorizar miles de palabras y sientes que no te alcanzan ni el tiempo ni la cabeza\?/);
    assert.match(hero, /class="hero__title-block"/);
    assert.match(hero, /<ul class="hero__objections"/);
    assert.doesNotMatch(hero, /padStart/);
    assert.match(hero, /class="hero__conversion"/);
    assert.ok(hero.indexOf("hero__summary") < hero.indexOf("hero__objections"));
    assert.ok(hero.indexOf("hero__objections") < hero.indexOf("hero__conversion"));
    assert.doesNotMatch(hero, /hero__community-line/);
    assert.doesNotMatch(hero, /hero__proof-band/);
    assert.equal((hero.match(/class="button button--/g) || []).length, 2);
    assert.match(styles, /\.hero__headline-emphasis\s*\{[\s\S]*text-transform: none/);
    assert.match(styles, /\.hero h1\s*\{[\s\S]*font-family: var\(--font-display\)/);
    assert.doesNotMatch(styles, /\.hero h1\s*\{[\s\S]*transform: scaleX/);
    assert.match(styles, /\.hero__headline-lead\s*\{[\s\S]*font-size: 1em;[\s\S]*font-weight: 600/);
    assert.match(styles, /\.hero__headline-emphasis\s*\{[\s\S]*font-weight: 700/);
    assert.match(styles, /\.hero__headline-accent\s*\{[\s\S]*font-family: var\(--font-display\)/);
    assert.match(styles, /\.method-editorial__intro h2\s*\{[\s\S]*font-family: var\(--font-display\)/);
    assert.match(styles, /\.proof-shelf__rail\s*\{[\s\S]*scroll-snap-type: x mandatory/);
    assert.match(styles, /\.proof-dialog__media video\s*\{[\s\S]*object-fit: contain/);
    assert.match(styles, /\.home-page \.real-map-pin\s*\{[\s\S]*width: 44px;[\s\S]*height: 44px/);
    assert.match(styles, /\.home-page \.compact-location-row\s*\{[\s\S]*grid-template-areas:[\s\S]*"number copy"[\s\S]*"number action"/);
    assert.match(styles, /\.home-page \.compact-location-row__copy strong,[\s\S]*white-space: normal/);
    assert.match(styles, /\.site-footer__contact a,[\s\S]*\.site-footer__nav a\s*\{[\s\S]*min-height: 44px/);
    assert.match(styles, /\.final-cta-contact-link\s*\{[\s\S]*min-height: 44px/);
    assert.match(styles, /\.site-footer\s*\{[\s\S]*background: #001a3d/);
    assert.match(styles, /\.site-footer__contact\s*\{[\s\S]*grid-template-columns: repeat\(3/);
    assert.match(styles, /\.site-footer__nav\s*\{[\s\S]*display: flex;[\s\S]*flex-wrap: wrap/);
    assert.match(styles, /\.site-footer \.site-footer__group-label\s*\{[\s\S]*color: #d9b45d/);
    assert.match(styles, /\.site-footer__legal\s*\{[\s\S]*color: rgba\(255, 255, 255, 0\.64\)/);
    assert.match(styles, /\.site-footer__legal a\s*\{[\s\S]*color: rgba\(255, 255, 255, 0\.72\)/);
    assert.match(
      styles,
      /@media \(min-width: 960px\)[\s\S]*\.site-footer__contact a,[\s\S]*color: rgba\(255, 255, 255, 0\.92\);[\s\S]*\.site-footer__legal\s*\{[\s\S]*color: rgba\(255, 255, 255, 0\.76\);[\s\S]*\.site-footer__legal a\s*\{[\s\S]*color: rgba\(255, 255, 255, 0\.86\)/,
    );
    assert.match(
      styles,
      /@media \(min-width: 960px\)[\s\S]*\.site-footer__nav\s*\{[\s\S]*display: grid;[\s\S]*grid-template-columns: repeat\(3, minmax\(0, 1fr\)\);[\s\S]*\.site-footer__nav a\s*\{[\s\S]*width: 100%;/,
    );
    assert.doesNotMatch(styles, /\.site-footer__contact a\s*\{[\s\S]*background: rgba\(255, 255, 255, 0\.07\)/);
    assert.match(styles, /\.callback-dialog__shell\s*\{[\s\S]*max-height: min\(760px, 92dvh\)/);
    assert.match(
      styles,
      /@media \(max-width: 719px\)[\s\S]*\.home-page > \.section\s*\{[\s\S]*padding-block: 26px;[\s\S]*\.home-page \.final-cta-section\s*\{[\s\S]*padding-block: 44px 48px;/,
    );
    assert.match(styles, /\.home-page \.final-cta-copy\s*\{[\s\S]*gap: 24px;/);
    assert.match(styles, /\.home-page \.final-cta-conversion\s*\{[\s\S]*gap: 14px;/);
    assert.match(
      styles,
      /@media \(max-width: 719px\)[\s\S]*\.home-page \.offer-node\s*\{[\s\S]*gap: 14px;[\s\S]*padding: 18px/,
    );
    assert.match(
      styles,
      /@media \(max-width: 719px\)[\s\S]*\.site-footer__contact a,[\s\S]*font-size: 0\.81rem;[\s\S]*\.site-footer__nav\s*\{[\s\S]*gap: 4px 10px;/,
    );
    assert.match(styles, /Viewport rhythm: keep each homepage chapter within one comfortable screen/);
    assert.match(
      styles,
      /@media \(max-width: 719px\)[\s\S]*\.hero__modalities,[\s\S]*\.hero__proof-band\s*\{\s*display: none/,
    );
    assert.match(
      styles,
      /@media \(max-width: 719px\)[\s\S]*\.hero__visual\s*\{\s*height: clamp\(350px, 46svh, 390px\)/,
    );
    assert.match(
      styles,
      /@media \(min-width: 1041px\) and \(max-height: 820px\)[\s\S]*\.home-page #cursos\s*\{[\s\S]*padding-block: 34px/,
    );
    assert.match(
      styles,
      /@media \(min-width: 1041px\) and \(max-height: 820px\)[\s\S]*\.home-page #sedes \.real-map-card__frame\s*\{[\s\S]*min-height: 320px/,
    );
    assert.match(
      styles,
      /\.hero__objections\s*\{\s*display: none;[\s\S]*@media \(min-width: 1600px\) and \(min-height: 960px\)[\s\S]*\.hero__copy\s*\{[\s\S]*display: flex;[\s\S]*justify-content: flex-start;[\s\S]*clamp\(54px, 6svh, 66px\)[\s\S]*\.hero__objections\s*\{[\s\S]*display: grid/,
    );
    assert.match(
      styles,
      /@media \(min-width: 1181px\) and \(max-width: 1599px\) and \(min-height: 768px\)[\s\S]*max-height: 959px[\s\S]*\.hero__copy\s*\{[\s\S]*display: flex;[\s\S]*clamp\(48px, 7svh, 64px\)[\s\S]*\.hero__objections\s*\{[\s\S]*display: grid/,
    );
    assert.match(
      styles,
      /@media \(min-width: 1600px\) and \(min-height: 960px\)[\s\S]*\.hero__conversion\s*\{[\s\S]*margin-top: clamp\(28px, 4svh, 44px\)[\s\S]*\.hero__actions\s*\{[\s\S]*max-width: clamp\(560px, 33vw, 620px\)[\s\S]*\.hero__modalities\s*\{[\s\S]*margin-top: clamp\(24px, 3svh, 34px\)/,
    );
    assert.match(
      styles,
      /@media \(min-width: 2200px\) and \(min-height: 1200px\)[\s\S]*--hero-main-height: min\(1120px, calc\(100svh - 94px\)\)[\s\S]*\.hero__copy\s*\{[\s\S]*justify-content: center/,
    );
    assert.match(
      styles,
      /@media \(min-width: 720px\)[\s\S]*\.home-page \.final-cta-conversion\s*\{[\s\S]*justify-items: center;[\s\S]*\.home-page \.final-cta-contact-row\s*\{[\s\S]*justify-content: center/,
    );
    assert.match(
      styles,
      /@media \(min-width: 960px\)[\s\S]*\.home-page \.final-cta-copy\s*\{[\s\S]*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\);[\s\S]*gap: 24px;/,
    );
    assert.match(
      styles,
      /@media \(min-width: 960px\)[\s\S]*\.home-page \.final-cta-section\s*\{[\s\S]*padding-top: clamp\(44px, 4\.8svh, 52px\);[\s\S]*padding-bottom: clamp\(64px, 6svh, 72px\);[\s\S]*\.home-page \.final-cta-conversion\s*\{[\s\S]*transform: translateY\(10px\)/,
    );
    assert.match(
      styles,
      /@media \(min-width: 960px\)[\s\S]*\.home-page \.final-cta-actions \.button\s*\{[\s\S]*min-height: 46px;[\s\S]*padding-block: 9px;[\s\S]*padding-inline: 18px;[\s\S]*\.home-page \.final-cta-contact-link\s*\{[\s\S]*font-size: 0\.82rem/,
    );
    assert.match(
      styles,
      /@media \(min-width: 960px\)[\s\S]*\.home-page \.final-cta-copy \.section-heading > p:not\(\.section-kicker\)\s*\{[\s\S]*margin-top: 20px;/,
    );
    assert.match(
      styles,
      /@media \(min-width: 960px\) and \(max-width: 1040px\)[\s\S]*\.home-page \.final-cta-copy \.section-heading h2\s*\{[\s\S]*font-size: clamp\(2\.75rem, 4\.6vw, 3rem\)/,
    );
    assert.match(
      styles,
      /@media \(min-width: 1041px\)[\s\S]*\.home-page \.location-hours-panel ul\s*\{[\s\S]*gap: 8px clamp\(16px, 1\.4vw, 24px\)[\s\S]*\.home-page \.location-hours-panel li\s*\{[\s\S]*font-size: 0\.82rem/,
    );
    assert.match(
      styles,
      /@media \(min-width: 1041px\)[\s\S]*\.proof-editorial--complete-row \.proof-shelf__controls\s*\{[\s\S]*position: absolute;[\s\S]*bottom: -10px/,
    );
    assert.match(styles, /\.method-editorial\s*\{[\s\S]*grid-template-areas:/);
    assert.match(styles, /\.home-page \.offer-map\s*\{[\s\S]*display: flex;[\s\S]*scroll-snap-type: x mandatory/);
    assert.match(styles, /\.home-page \.location-compact-list\s*\{[\s\S]*display: flex;[\s\S]*scroll-snap-type: x mandatory/);
    assert.match(source, /id="footer-contact-label">Contacto/);
    assert.match(source, /id="footer-nav-label">Explora/);
    assert.match(source, /site-footer__nav[\s\S]*data-lucide="arrow-right"/);
    assert.doesNotMatch(source, />Inscripción<\/a>/);
    assert.doesNotMatch(source, /Información de inscripción y libro \(\$95\)/);
  });

  it("uses one semantic homepage palette with deliberate section contrast", async () => {
    const styles = await readFile("src/styles.css", "utf8");

    assert.match(styles, /--home-navy: #001a3d/);
    assert.match(styles, /--home-body: #475569/);
    assert.match(styles, /--home-gold-text: #8a6412/);
    assert.match(styles, /--home-paper: #ffffff/);
    assert.match(styles, /--home-warm: #f7f2e8/);
    assert.match(styles, /--home-cool: #eef4ff/);
    assert.match(styles, /--home-mist: #f5f7fa/);
    assert.match(
      styles,
      /\.home-page #inicio,[\s\S]*\.home-page #cursos\s*\{[\s\S]*background: var\(--home-paper\)/,
    );
    assert.match(
      styles,
      /\.home-page #metodo,[\s\S]*\.home-page #sedes\s*\{[\s\S]*background: var\(--home-warm\)/,
    );
    assert.match(styles, /\.home-page #experiencia\s*\{[\s\S]*background: var\(--home-navy\)/);
    assert.match(
      styles,
      /\.home-page #experiencia \.proof-shelf__heading h2\s*\{[\s\S]*color: #ffffff/,
    );
    assert.match(
      styles,
      /\.home-page #experiencia \.proof-shelf__controls button\s*\{[\s\S]*background: rgba\(255, 255, 255, 0\.08\)/,
    );
    assert.match(styles, /\.home-page \.faq-section\s*\{[\s\S]*background: var\(--home-mist\)/);
    assert.match(
      styles,
      /\.home-page #metodo \.method-editorial__intro h2,[\s\S]*\.home-page \.faq-section \.section-heading h2\s*\{[\s\S]*font-weight: 700/,
    );
    assert.match(styles, /--method-gold: var\(--home-gold-text\)/);
    assert.match(
      styles,
      /@media \(max-width: 719px\)[\s\S]*\.home-page \.real-map-card__attribution\s*\{[\s\S]*min-height: 44px/,
    );
  });
});
