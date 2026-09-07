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
  it("offers a course choice before the method and proof chapters", async () => {
    const { page } = await readSources();
    const method = page.indexOf("<MethodSection");
    const testimonials = page.indexOf("<TestimonialsSection");
    const proof = page.indexOf("<ProofStories");
    const offerings = page.indexOf("<OfferingPathSection");
    const studyGoals = page.indexOf("<StudyGoalsSection");
    const locations = page.indexOf("<LocationsSection");
    const books = page.indexOf("<BooksSection");
    const faq = page.indexOf("<FaqSection");
    const finalCta = page.indexOf("<FinalCtaSection");

    assert.ok(studyGoals > page.indexOf("<HeroSection"));
    assert.ok(method > studyGoals);
    assert.ok(testimonials > method);
    assert.ok(proof > method);
    assert.ok(proof > testimonials);
    assert.ok(offerings > studyGoals);
    assert.ok(locations > offerings);
    assert.ok(method > locations);
    assert.ok(books > method);
    assert.ok(books < testimonials);
    assert.ok(faq > books);
    assert.ok(finalCta > faq);
    assert.doesNotMatch(page, /dangerouslySetInnerHTML[\s\S]*legacy|src\/main\.js/);
  });

  it("keeps three primary modality choices and moves support programs below", async () => {
    const { productOfferings } = await import("../src/content.js");
    const { sections } = await readSources();
    const start = sections.indexOf("const supportingPrograms");
    const end = sections.indexOf("export function LocationsSection");
    const source = sections.slice(start, end);

    assert.match(source, /productOfferings\.slice\(0, 3\)/);
    assert.doesNotMatch(source, /offer-node__marker/);
    assert.match(source, /offer-node__status/);
    assert.match(source, /Programa principal/);
    assert.match(source, /SupportingCoursesSection/);
    assert.match(source, /supporting-courses-grid/);
    assert.doesNotMatch(source, /Inglés para niños/);
    assert.doesNotMatch(source, /\/cursos\/ingles-ninos\//);
    assert.match(source, /\/cursos\/ged\//);
    assert.match(source, /\/cursos\/computacion-basica\//);
    assert.match(source, /\/cursos\/computacion-oficina\//);
    assert.match(source, /\/cursos\/espanol-extranjeros\//);
    assert.match(source, /Tutorías de matemáticas/);
    assert.match(source, /\/cursos\/tutorias-matematicas\//);
    assert.match(source, /Ciudadanía/);
    assert.match(source, /Consultar ciudadanía/);
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
    assert.match(source, /offer-node offer-node--secondary supporting-course-card/);
    assert.match(source, /offer-node__link supporting-course-card__link/);
    assert.doesNotMatch(source, /supporting-course-card__icon|program\.icon/);
  });

  it("labels the English assessment and offers course-aware guidance", async () => {
    const { sections, interactive } = await readSources();
    const source = `${sections}\n${interactive}`;

    assert.match(source, /¿Listo para empezar\?/);
    assert.match(source, /Conoce tu nivel de inglés/);
    assert.match(source, /62 preguntas · 10–15 minutos/);
    assert.match(source, /final-cta-contact-row/);
    assert.match(source, /Solicitar orientación/);
    assert.match(source, /name="programa"/);
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
    assert.match(sections, /hours=\{mapped\.find\(\(location\) => location\.mapKey === "bound-brook"\)\?\.hours \|\| \[\]\}/);
    assert.match(sections, /hoursTitle="Bound Brook · Sede principal"/);
    assert.match(sections, /hoursEyebrow="Horario de atención"/);
    assert.match(sections, /const locationList = \[/);
    assert.match(sections, /mapKey: "new-york-hq"/);
    assert.doesNotMatch(sections, /location-headquarters/);
    assert.match(locationExplorer, /headquarters: "HQ"/);
    assert.match(locationExplorer, /mapFocus\[location\.mapKey\]/);
    assert.match(locationExplorer, /<h3 id="location-hours-title">\{hoursTitle\}<\/h3>/);
    assert.doesNotMatch(source, /<details|<summary|location-hours-panel__toggle/);
    assert.match(sections, /location\.status !== "online"/);
    assert.doesNotMatch(sections, /\{online \? <LocationRow/);
    assert.doesNotMatch(source, /real-map-card__expand/);
    assert.doesNotMatch(source, /<iframe|<svg/);
  });

  it("uses the approved route-first navigation and preserves mobile close behavior", async () => {
    const { chrome } = await readSources();
    assert.match(chrome, /label: "Inicio", href: "\/", page: "home"/);
    assert.match(chrome, /label: "Cursos", href: "\/cursos\/", page: "courses"/);
    assert.match(chrome, /label: "Examen de nivel", href: "\/placement-test\/", page: "placement"/);
    assert.doesNotMatch(chrome, /href: "#|`\/#\$\{/);
    assert.match(chrome, /aria-current=\{current\}/);
    assert.match(chrome, /event\.key !== "Escape"/);
    assert.match(chrome, /document\.addEventListener\("pointerdown"/);
    assert.match(chrome, /menuButton\.current\?\.focus/);
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
    assert.match(hero, /hero__spain-launch/);
    assert.match(hero, /Nos enorgullece anunciar que AIT USA ya está en España/);
    assert.doesNotMatch(hero, /España es nuestra próxima parada|Muy pronto|Próximamente/);
    assert.doesNotMatch(hero, /hero__conversion/);
    assert.doesNotMatch(hero, /hero__summary|hero__objections/);
    assert.equal((hero.match(/className="button button--/g) || []).length, 1);
    assert.match(hero, /href="\/cursos\/">Ver cursos/);
    assert.match(method, /method-story__intro-copy/);
    assert.doesNotMatch(method, /method-story__promise|method-story__bridge/);
    assert.match(method, /method-story__questions/);
    assert.match(method, /Preguntas comunes al aprender inglés/);
  });

  it("keeps the institutional proof band factual, visible, and non-duplicative", async () => {
    const { headquarters, institutionalProof, locations, painHero } = await import("../src/content.js");
    const { sections } = await readSources();
    const publishedLocationCount = locations.filter((location) => location.status !== "online").length + 1;

    assert.equal(painHero.eyebrow, "Una escuela de inglés diferente para gente con propósito");
    assert.equal(institutionalProof.length, 4);
    assert.equal(headquarters.status, "headquarters");
    assert.equal(publishedLocationCount, 7);
    assert.deepEqual(
      institutionalProof.map((proof) => proof.value),
      ["Desde 2004", "+1,000", `${publishedLocationCount} Puntos de atención`, "Alcance Internacional"],
    );
    assert.equal(institutionalProof[2].label, "Sedes, atención con cita y coordinación administrativa");
    assert.doesNotMatch(institutionalProof.map((proof) => proof.value).join(" "), /4 sedes/);
    assert.match(institutionalProof.at(-1).label, /EE\. UU\., Centroamérica, Sudamérica y Europa/);
    assert.match(sections, /className="hero__institutional-band"/);
    assert.match(sections, /institutionalProof\.map/);
  });

  it("preserves the accepted responsive and semantic visual rules", async () => {
    const { sections, interactive, styles } = await readSources();
    const launchPolish = styles.slice(styles.lastIndexOf("/* MIS-394 launch-week homepage polish"));
    assert.match(styles, /\.hero__kicker\s*\{[\s\S]*color: #c28a26/);
    assert.match(styles, /\.hero__modalities svg\s*\{[\s\S]*color: #c28a26/);
    assert.match(styles, /\.hero__spain-launch\s*\{[\s\S]*animation: heroSpainLaunchSweep/);
    assert.match(styles, /heroSpainLaunchPulse/);
    assert.match(styles, /method-story__conclusion \.method-reasons\s*\{[\s\S]*transform: translateY/);
    assert.match(styles, /method-reason__icon::before/);
    assert.match(launchPolish, /method-reason__icon::before\s*\{[\s\S]*content: none/);
    assert.match(launchPolish, /method-reason__icon-image\s*\{[\s\S]*width: 58px;[\s\S]*height: 58px/);
    assert.match(launchPolish, /method-reasons li\s*\{[\s\S]*align-items: center/);
    assert.match(interactive, /className="country-proof"/);
    assert.match(interactive, /SPANISH_SPEAKING_COUNTRIES\.map/);
    assert.equal((interactive.match(/\{ name: "/g) || []).length, 21);
    assert.match(interactive, /src=\{country\.src\}/);
    assert.doesNotMatch(interactive, /flag: "[🇦-🇿]/u);
    assert.match(launchPolish, /\.country-proof__flags\s*\{[\s\S]*display: flex/);
    assert.match(launchPolish, /supporting-course-card__link\s*\{[\s\S]*border: 1px solid[\s\S]*border-radius: 6px/);
    assert.match(sections, /Nos enorgullece anunciar que AIT USA ya está en España\./);
    assert.doesNotMatch(sections, /España es nuestra próxima parada|Muy pronto, una nueva comunidad|Próximamente en España/);
    assert.doesNotMatch(sections, /supporting-course-card__status|>Curso de apoyo</);
    assert.match(styles, /\.hero__headline-emphasis\s*\{[\s\S]*text-transform: none/);
    assert.match(styles, /\.community-proof__tabs\s*\{[\s\S]*grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
    assert.match(styles, /\.home-page \.real-map-pin\s*\{[\s\S]*width: 44px;[\s\S]*height: 44px/);
    assert.match(styles, /\.final-cta-contact-link\s*\{[\s\S]*min-height: 44px/);
    assert.match(styles, /\.site-footer\s*\{[\s\S]*background: #001a3d/);
    assert.match(styles, /Viewport rhythm: keep each homepage chapter within one comfortable screen/);
    assert.match(
      styles,
      /@media \(max-width: 1040px\) and \(min-width: 720px\)[\s\S]*\.home-page #inicio \.hero__copy[\s\S]*padding-top: calc\(var\(--home-spain-launch-height, 62px\) \+ 16px\)/,
    );
  });

  it("ships a real local flag image for every named country", async () => {
    const { interactive } = await readSources();
    const sources = [...interactive.matchAll(/\{ name: "[^"]+", src: "(\/assets\/flags\/[a-z]{2}\.svg)" \}/g)]
      .map((match) => match[1]);

    assert.equal(sources.length, 21);
    await Promise.all(sources.map((source) => readFile(`public${source}`, "utf8")));
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
      /\.supporting-courses-grid\s*\{[\s\S]*grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/,
    );
    assert.match(
      styles,
      /\.supporting-course-card\s*\{[\s\S]*min-height: 210px/,
    );
    assert.match(
      styles,
      /Location focus and final chapter-accent pass:[\s\S]*\.home-page #sedes \.location-compact-list\s*\{[\s\S]*display: flex;[\s\S]*overflow-x: auto;[\s\S]*scroll-snap-type: x mandatory/,
    );
    assert.match(interactive, /className="community-proof__heading"/);
    assert.match(interactive, /className="chapter-accent"/);
    assert.match(sections, /className="section faq-section" id="faq"/);
    assert.match(sections, /className="section books-section" id="libros"/);
    assert.match(sections, /bookLibrary\.levels\.flatMap/);
    assert.match(sections, /books-gallery/);
    assert.match(sections, /Ruta Graphic Concept/);
    assert.doesNotMatch(sections, /books-showcase/);
    assert.match(content, /intro-book-portada\.avif/);
    assert.match(sections, /chapter-accent chapter-accent--mobile/);
    assert.doesNotMatch(chrome, /readingSectionIds/);
    assert.match(
      styles,
      /Final design-lock polish:[\s\S]*mobile chapter marker[\s\S]*grid-template-areas:\s*"intro intro"\s*"media reasons"/,
    );
    assert.match(
      styles,
      /:is\(#metodo, #cursos, #cursos-apoyo, #sedes, \.faq-section, #contacto\)[\s\S]*linear-gradient\(90deg, #4f84f6, #d9b45d\)/,
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

  it("keeps books discoverable on the homepage without expanding the launch menu", async () => {
    const { chrome, sections } = await readSources();
    assert.match(sections, /className="section books-section" id="libros"/);
    assert.doesNotMatch(chrome, /href: "\/#libros"/);
  });

  it("presents the books as one featured Intro cover and an ordered two-row curriculum", async () => {
    const { sections, styles } = await readSources();

    assert.equal((sections.match(/books-gallery__intro/g) || []).length, 1);
    assert.equal((sections.match(/books-gallery__book--\$\{index \+ 1\}/g) || []).length, 1);
    assert.match(
      styles,
      /MIS-378 homepage rhythm polish:[\s\S]*books-section__heading\s*\{[\s\S]*padding-left: 24px;[\s\S]*border-left: 0/,
    );
    assert.match(
      styles,
      /MIS-378 homepage rhythm polish:[\s\S]*books-gallery\s*\{[\s\S]*grid-template-columns: minmax\(220px, \.9fr\) repeat\(3, minmax\(0, 1fr\)\);[\s\S]*grid-template-rows: repeat\(2, minmax\(230px, auto\)\)/,
    );
    assert.match(styles, /books-gallery > \.books-gallery__intro\s*\{[\s\S]*grid-column: 1;[\s\S]*grid-row: 1 \/ span 2/);
    assert.match(styles, /books-gallery > \.books-gallery__book--1\s*\{ grid-column: 2; grid-row: 1; \}/);
    assert.match(styles, /books-gallery > \.books-gallery__book--3\s*\{ grid-column: 4; grid-row: 1; \}/);
    assert.match(styles, /books-gallery > \.books-gallery__book--4\s*\{ grid-column: 2; grid-row: 2; \}/);
    assert.match(styles, /books-gallery > \.books-gallery__book--6\s*\{ grid-column: 4; grid-row: 2; \}/);
    assert.match(styles, /books-gallery__intro img\s*\{[\s\S]*max-width: 210px/);
    assert.match(
      styles,
      /@media \(max-width: 719px\)[\s\S]*books-gallery > \.books-gallery__intro\s*\{[\s\S]*grid-column: 1 \/ -1;[\s\S]*grid-row: auto/,
    );
  });
});
