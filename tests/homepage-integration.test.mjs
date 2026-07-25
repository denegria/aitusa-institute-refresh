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
    assert.match(source, /Un espacio para practicar, equivocarse y seguir avanzando con confianza/);
    assert.match(source, /Así funciona <br class="method-heading__desktop-break" \/>el método\./);
    assert.match(source, /Comprende,<br class="method-heading__desktop-break" \/> practica y avanza\./);
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

  it("uses placement as the primary conversion action and WhatsApp as the human fallback", async () => {
    const source = await readFile("src/main.js", "utf8");
    const section = source.slice(
      source.indexOf("function renderFinalCtaSection"),
      source.indexOf("function renderCourseTeaserSection"),
    );

    assert.equal((section.match(/renderCtaBox\(/g) || []).length, 0);
    assert.match(section, /¿Listo para empezar\?/);
    assert.match(section, /Encuentra tu nivel/);
    assert.match(section, /Hablar por WhatsApp/);
    assert.match(section, /final-cta-actions/);
    assert.match(section, /conversionCtas\.placement/);
    assert.match(section, /conversionCtas\.advisor/);
    assert.match(section, /contact-card--secondary/);
    assert.match(section, /<details class="contact-card/);
    assert.match(section, /¿Prefieres que te llamemos\?/);
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

    assert.match(styles, /\.hero__kicker\s*\{[\s\S]*color: #8a6412/);
    assert.match(styles, /\.method-heading__desktop-break\s*\{\s*display: none/);
    assert.match(styles, /\.proof-editorial__tab-meta\s*\{\s*display: none/);
    assert.match(styles, /\.home-page \.real-map-pin\s*\{[\s\S]*width: 44px;[\s\S]*height: 44px/);
    assert.match(styles, /\.home-page \.compact-location-row\s*\{[\s\S]*grid-template-areas:[\s\S]*"number copy"[\s\S]*"number action"/);
    assert.match(styles, /\.home-page \.compact-location-row__copy strong,[\s\S]*white-space: normal/);
    assert.match(styles, /\.site-footer__grid > div:not\(:first-child\) a\s*\{[\s\S]*min-height: 44px/);
    assert.match(
      styles,
      /@media \(max-width: 719px\)[\s\S]*\.home-page \.offer-node\s*\{[\s\S]*gap: 14px;[\s\S]*padding: 18px/,
    );
    assert.match(styles, /Viewport rhythm: keep each homepage chapter within one comfortable screen/);
    assert.match(styles, /\.hero__proof-inner\s*\{[\s\S]*scroll-snap-type: x mandatory/);
    assert.match(styles, /\.method-tabs\s*\{[\s\S]*grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
    assert.match(styles, /\.home-page \.offer-map\s*\{[\s\S]*display: flex;[\s\S]*scroll-snap-type: x mandatory/);
    assert.match(styles, /\.home-page \.location-compact-list\s*\{[\s\S]*display: flex;[\s\S]*scroll-snap-type: x mandatory/);
    assert.match(source, /Información de inscripción y libro \(\$95\)/);
  });
});
