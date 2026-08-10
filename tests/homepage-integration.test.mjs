import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";

const readSources = async () => ({
  page: await readFile("app/(public-site)/page.jsx", "utf8"),
  sections: await readFile("app/_components/site/PublicSections.jsx", "utf8"),
  interactive: await readFile("app/_components/site/InteractiveSections.jsx", "utf8"),
  locationExplorer: await readFile("app/_components/site/LocationExplorer.jsx", "utf8"),
  chrome: await readFile("app/_components/site/SiteChrome.jsx", "utf8"),
  styles: await readFile("src/styles.css", "utf8"),
});

describe("homepage React integration", () => {
  it("keeps the homepage in one proof-led React funnel sequence", async () => {
    const { page } = await readSources();
    const method = page.indexOf("<MethodSection");
    const proof = page.indexOf("<ProofStories");
    const offerings = page.indexOf("<OfferingPathSection");
    const locations = page.indexOf("<LocationsSection");
    const books = page.indexOf("<BooksSection");
    const faq = page.indexOf("<FaqSection");
    const finalCta = page.indexOf("<FinalCtaSection");

    assert.ok(method >= 0);
    assert.ok(proof > method);
    assert.ok(offerings > proof);
    assert.ok(locations > offerings);
    assert.ok(books > locations);
    assert.ok(faq > books);
    assert.ok(finalCta > faq);
    assert.doesNotMatch(page, /dangerouslySetInnerHTML[\s\S]*legacy|src\/main\.js/);
  });

  it("keeps three primary modality choices and the approved support-program rail", async () => {
    const { productOfferings } = await import("../src/content.js");
    const { sections } = await readSources();
    const start = sections.indexOf("const supportingPrograms");
    const end = sections.indexOf("export function LocationsSection");
    const source = sections.slice(start, end);

    assert.match(source, /productOfferings\.slice\(0, 3\)/);
    assert.doesNotMatch(source, /offer-node__marker/);
    assert.match(source, /offer-node__status/);
    assert.match(source, /Programa principal/);
    assert.match(source, /catalog-programs/);
    assert.doesNotMatch(source, /Inglés para niños/);
    assert.doesNotMatch(source, /\/cursos\/ingles-ninos\//);
    assert.match(source, /\/cursos\/ged\//);
    assert.match(source, /computacion-y-cursos-tecnicos/);
    assert.match(source, /\/cursos\/espanol-extranjeros\//);
    assert.match(source, /Tutorías de matemáticas/);
    assert.match(source, /\/cursos\/tutorias-matematicas\//);
    assert.doesNotMatch(source, /apoyo-academico/);
    assert.deepEqual(
      productOfferings.slice(0, 3).map((offering) => offering.mobileSummary),
      [
        "Práctica cara a cara con corrección inmediata en Nueva Jersey.",
        "Combina clases presenciales y apoyo remoto.",
        "Clases en vivo, nunca grabadas, desde casa o desde otro país.",
      ],
    );
    assert.match(source, /offer-node__summary-compact/);
    assert.doesNotMatch(source, /offer-node__link-compact/);
    assert.match(source, /aria-label=\{item\.cta\}/);
  });

  it("uses placement as the primary final conversion and callback as the sole secondary action", async () => {
    const { sections, interactive } = await readSources();
    const source = `${sections}\n${interactive}`;

    assert.match(source, /¿Listo para empezar\?/);
    assert.match(source, /Encuentra tu nivel/);
    assert.match(source, /final-cta-contact-row/);
    assert.match(source, /Solicitar llamada/);
    assert.match(source, /<dialog/);
    assert.match(source, /name="nombre"/);
    assert.match(source, /name="telefono"/);
    assert.match(source, /name="email"/);
    assert.match(source, /name="ubicacion"/);
    assert.match(source, /name="mejorHorario"/);
    assert.doesNotMatch(source, /name="apellido"|name="interes"|name="para"/);
  });

  it("keeps the real map, linked location controls, and always-visible shared schedule", async () => {
    const { sections, locationExplorer } = await readSources();
    const source = `${sections}\n${locationExplorer}`;

    assert.match(sections, /<LocationExplorer/);
    assert.match(source, /new-jersey-campus-map\.jpg/);
    assert.match(source, /© OpenStreetMap/);
    assert.match(source, /function MapPin/);
    assert.match(source, /function LocationRow/);
    assert.match(source, /data-map-focused/);
    assert.match(source, /aria-pressed=\{selected\}/);
    assert.match(source, /location-rail-toolbar/);
    assert.match(source, /onScroll=\{handleRailScroll\}/);
    assert.match(source, /real-map-card__overview/);
    assert.match(source, /google\.com\/maps\/search/);
    assert.match(source, /<section className="location-hours-panel"/);
    assert.match(source, /<ScheduleGroup key=\{group\.label\} group=\{group\}/);
    assert.match(source, /data-schedule-slot/);
    assert.match(sections, /hoursTitle="Bound Brook · Sede principal"/);
    assert.match(sections, /hoursEyebrow="Horario de atención administrativo"/);
    assert.match(locationExplorer, /<h3 id="location-hours-title">\{hoursTitle\}<\/h3>/);
    assert.doesNotMatch(source, /<details|<summary|location-hours-panel__toggle/);
    assert.match(sections, /!?\["pending", "online"\]\.includes\(location\.status\)/);
    assert.doesNotMatch(sections, /\{online \? <LocationRow/);
    assert.doesNotMatch(source, /real-map-card__expand/);
    assert.doesNotMatch(source, /<iframe|<svg/);
  });

  it("tracks active homepage sections and preserves the mobile menu keyboard escape", async () => {
    const { chrome } = await readSources();
    assert.match(chrome, /setActiveSection/);
    assert.match(chrome, /readingSectionIds[\s\S]*"faq"/);
    assert.match(chrome, /window\.requestAnimationFrame\(update\)/);
    assert.match(chrome, /window\.addEventListener\("scroll"/);
    assert.match(chrome, /aria-current=\{current\}/);
    assert.match(chrome, /event\.key === "Escape"/);
  });

  it("offers a discreet global returning-student path without changing account rules", async () => {
    const { chrome, styles } = await readSources();
    assert.match(chrome, /className="student-portal-entry"/);
    assert.match(chrome, /href="\/portal\/sign-in\/"/);
    assert.match(chrome, /Portal de estudiantes: iniciar sesión/);
    assert.match(chrome, /title="Portal de estudiantes"/);
    assert.doesNotMatch(chrome, /student-portal-entry__label/);
    assert.match(styles, /\.student-portal-entry\s*\{[\s\S]*width: 44px;[\s\S]*min-width: 44px;[\s\S]*min-height: 44px;/);
  });

  it("keeps the placement entry viewport focused on the diagnostic", async () => {
    const placement = await readFile("app/(public-site)/placement-test/page.jsx", "utf8");
    assert.doesNotMatch(placement, /Primero recibes valor|privacyNote|notice-box/);
  });

  it("keeps the approved hero hierarchy while moving the method story below", async () => {
    const { sections } = await readSources();
    const hero = sections.slice(
      sections.indexOf("export function HeroSection"),
      sections.indexOf("export function MethodSection"),
    );
    const method = sections.slice(
      sections.indexOf("export function MethodSection"),
      sections.indexOf("const supportingPrograms"),
    );
    assert.match(hero, /hero__title-block/);
    assert.match(hero, /hero__modalities/);
    assert.doesNotMatch(hero, /hero__conversion/);
    assert.doesNotMatch(hero, /hero__summary|hero__objections/);
    assert.equal((hero.match(/className="button button--/g) || []).length, 0);
    assert.match(method, /method-story__promise/);
    assert.match(method, /method-story__questions/);
    assert.match(method, /Preguntas comunes al aprender inglés/);
  });

  it("keeps the institutional proof band factual, visible, and non-duplicative", async () => {
    const { institutionalProof, painHero } = await import("../src/content.js");
    const { sections } = await readSources();

    assert.equal(painHero.eyebrow, "Una escuela de inglés diferente para gente con propósito");
    assert.equal(institutionalProof.length, 4);
    assert.deepEqual(
      institutionalProof.map((proof) => proof.value),
      ["Desde 2004", "+1,000", "4 sedes", "Alcance internacional"],
    );
    assert.match(institutionalProof.at(-1).label, /EE\. UU\., Centroamérica, Sudamérica y Europa/);
    assert.match(sections, /className="hero__institutional-band"/);
    assert.match(sections, /institutionalProof\.map/);
  });

  it("preserves the accepted responsive and semantic visual rules", async () => {
    const { styles } = await readSources();
    assert.match(styles, /\.hero__kicker\s*\{[\s\S]*color: #8a6412/);
    assert.match(styles, /\.hero__headline-emphasis\s*\{[\s\S]*text-transform: none/);
    assert.match(styles, /\.proof-shelf__rail\s*\{[\s\S]*scroll-snap-type: x mandatory/);
    assert.match(styles, /\.home-page \.real-map-pin\s*\{[\s\S]*width: 44px;[\s\S]*height: 44px/);
    assert.match(styles, /\.final-cta-contact-link\s*\{[\s\S]*min-height: 44px/);
    assert.match(styles, /\.site-footer\s*\{[\s\S]*background: #001a3d/);
    assert.match(styles, /Viewport rhythm: keep each homepage chapter within one comfortable screen/);
  });

  it("shares the desktop chapter grid and makes mobile lookup rails explicit", async () => {
    const { sections, interactive, chrome, styles } = await readSources();
    const content = await readFile("src/content.js", "utf8");

    assert.match(
      sections,
      /method-story__intro section-heading section-heading--framed/,
    );
    assert.match(
      styles,
      /Homepage consistency pass:[\s\S]*\.home-page #metodo \.method-editorial,[\s\S]*\.home-page \.final-cta-layout,[\s\S]*\.home-page \+ \.site-footer \.site-footer__compact[\s\S]*1320px/,
    );
    assert.match(
      styles,
      /\.home-page #cursos \.offer-map\s*\{[\s\S]*overflow-x: visible;[\s\S]*scroll-snap-type: none/,
    );
    assert.match(
      styles,
      /\.home-page #cursos \.catalog-programs__links\s*\{[\s\S]*flex-wrap: wrap;[\s\S]*overflow-x: visible/,
    );
    assert.match(
      styles,
      /Compact mobile study decision ledger:[\s\S]*\.home-page #cursos \.offer-node\s*\{[\s\S]*grid-template-columns: minmax\(0, 1fr\) auto;[\s\S]*\.home-page #cursos \.catalog-programs__links\s*\{[\s\S]*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/,
    );
    assert.match(
      styles,
      /Location focus and final chapter-accent pass:[\s\S]*\.home-page #sedes \.location-compact-list\s*\{[\s\S]*display: flex;[\s\S]*overflow-x: auto;[\s\S]*scroll-snap-type: x mandatory/,
    );
    assert.match(interactive, /proof-shelf__heading proof-shelf__heading--mobile-framed/);
    assert.match(interactive, /className="chapter-accent"/);
    assert.match(sections, /className="section faq-section" id="faq"/);
    assert.match(sections, /className="section books-section" id="libros"/);
    assert.match(sections, /bookLibrary\.levels\.flatMap/);
    assert.match(sections, /books-gallery/);
    assert.match(sections, /Ruta Graphic Concept/);
    assert.doesNotMatch(sections, /books-showcase/);
    assert.match(content, /intro-book-portada\.avif/);
    assert.match(sections, /chapter-accent chapter-accent--mobile/);
    assert.match(chrome, /readingSectionIds/);
    assert.match(
      styles,
      /Final design-lock polish:[\s\S]*mobile chapter marker[\s\S]*grid-template-areas:\s*"intro intro"\s*"media reasons"/,
    );
    assert.match(
      styles,
      /:is\(#metodo, #cursos, #sedes, \.faq-section, #contacto\)[\s\S]*linear-gradient\(90deg, #4f84f6, #d9b45d\)/,
    );
    assert.match(styles, /\.home-page #sedes \.real-map-card__frame\s*\{[\s\S]*height: 158px/);
    assert.match(styles, /\.home-page #sedes \.location-rail-toolbar\s*\{[\s\S]*display: flex/);
    assert.match(
      styles,
      /Homepage balance pass:[\s\S]*grid-template-rows: minmax\(0, 1fr\) auto;[\s\S]*method-editorial__questions[\s\S]*grid-template-columns: minmax\(0, 1fr\);[\s\S]*#libros[\s\S]*background: var\(--home-navy\)/,
    );
    assert.match(sections, /method-story__opening/);
    assert.match(sections, /method-story__community/);
    assert.match(sections, /method-story__conclusion/);
    assert.doesNotMatch(sections, /graphic-concept-compass-source\.png/);
    assert.doesNotMatch(sections, /graphic-concept-path\.webp/);
    assert.doesNotMatch(sections, /className="method-editorial__principles"|className="method-editorial__closing"/);
    assert.match(content, /¿Te suena familiar\?/);
    assert.match(
      styles,
      /Graphic Concept reference pass:[\s\S]*method-editorial__opening[\s\S]*method-editorial__bridge-art[\s\S]*method-editorial__principles[\s\S]*method-editorial__closing/,
    );
  });

  it("keeps the book route in the section-reading order", async () => {
    const chrome = await readFile("app/_components/site/SiteChrome.jsx", "utf8");
    assert.match(chrome, /readingSectionIds = .*"libros", "faq"/);
  });
});
