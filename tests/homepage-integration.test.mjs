import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import { siteData } from "../src/content.js";
import { catalogChoices, catalogHref } from "../src/courseDiscovery.js";

const readSources = async () => ({
  page: await readFile("app/(public-site)/page.jsx", "utf8"),
  sections: await readFile("app/_components/site/PublicSections.jsx", "utf8"),
  interactive: await readFile("app/_components/site/InteractiveSections.jsx", "utf8"),
  locationExplorer: await readFile("app/_components/site/LocationExplorer.jsx", "utf8"),
  chrome: await readFile("app/_components/site/SiteChrome.jsx", "utf8"),
});

const sectionSource = (source, name, nextName) => source.slice(
  source.indexOf(`export function ${name}`),
  nextName ? source.indexOf(`export function ${nextName}`) : undefined,
);

describe("homepage React integration", () => {
  it("orders choices, teaching, human proof, practical details, and orientation as one journey", async () => {
    const { page, sections } = await readSources();
    const main = page.split('<main id="main-content"')[1].split("</main>")[0];
    const chapters = [...main.matchAll(/<(\w+Section|ProofStories)\s*\/>/g)].map((match) => match[1]);

    assert.deepEqual(chapters, [
      "HeroSection", "OfferingPathSection", "MethodSection", "TestimonialsSection", "ProofStories",
      "LocationsSection", "StudyGoalsSection", "FaqSection", "FinalCtaSection",
    ]);
    assert.doesNotMatch(main, /<BooksSection|<SupportingCoursesSection/);
    assert.match(sectionSource(sections, "MethodSection", "StudyGoalsSection"), /<BooksSection\s*\/>/);
    assert.doesNotMatch(page, /dangerouslySetInnerHTML[\s\S]*legacy|src\/main\.js/);
  });

  it("keeps the opening focused on finding a class or asking admissions", async () => {
    const { sections } = await readSources();
    const hero = sectionSource(sections, "HeroSection", "MethodSection");

    assert.equal((hero.match(/<h1\b/g) || []).length, 1);
    assert.match(hero, /id="home-hero-title"/);
    assert.equal((hero.match(/<Link\b/g) || []).length, 2);
    assert.match(hero, /className="approved-hero__cta" href="#cursos">Encuentra tu clase de inglés/);
    assert.match(hero, /href="\/contactanos\/">Prefiero hablar con admisiones/);
    assert.match(hero, /src=\{site\.images\.classroomHero\}/);
    assert.match(hero, /fetchPriority="high"/);
    assert.doesNotMatch(hero, /placement-test|inscribete|approved-hero__modalities|approved-hero__spain|<details/);
  });

  it("offers all three English formats with visible destination labels on mobile", async () => {
    const { productOfferings } = siteData;
    const { sections } = await readSources();
    const choices = sectionSource(sections, "OfferingPathSection", "SupportingCoursesSection");
    const cohesion = await readFile("src/site-cohesion.css", "utf8");

    assert.deepEqual(productOfferings.slice(0, 3).map(({ title, href, cta }) => ({ title, href, cta })), [
      { title: "Inglés presencial", href: "/cursos/ingles-jovenes-adultos/", cta: "Ver formato presencial" },
      { title: "Inglés híbrido", href: "/cursos/ingles-hibrido-adultos/", cta: "Ver formato híbrido" },
      { title: "Inglés online", href: "/cursos/ingles-online-adultos/", cta: "Ver formato online" },
    ]);
    assert.deepEqual(productOfferings.slice(0, 3).map((offering) => offering.mobileSummary), [
      "Práctica cara a cara con corrección inmediata en Nueva Jersey.",
      "Combina clases presenciales y apoyo remoto.",
      "Clases en vivo, nunca grabadas, desde casa o desde otro país.",
    ]);
    assert.match(choices, /productOfferings\.slice\(0, 3\)\.map/);
    assert.match(choices, /<h3>\{item\.title\}<\/h3>/);
    assert.match(choices, /href=\{item\.href\} aria-label=\{item\.cta\}/);
    assert.match(choices, /<span className="offer-node__link-full">\{item\.cta\}<\/span>/);
    assert.match(cohesion, /@media \(max-width: 719px\)[\s\S]*\.offer-node__link-full\s*\{\s*display: inline/);
    assert.doesNotMatch(choices, /ingles-ninos|supportingPrograms\.map/);
  });

  it("discloses diagnostic effort and account requirements before the optional exam link", async () => {
    const { sections } = await readSources();
    const choices = sectionSource(sections, "OfferingPathSection", "SupportingCoursesSection");
    const diagnostic = choices.match(/<details className="placement-effort">([\s\S]*?)<\/details>/)?.[1];

    assert.ok(diagnostic);
    assert.match(diagnostic, /62 preguntas/);
    assert.match(diagnostic, /10–15 minutos/);
    assert.match(diagnostic, /verificar tu email y crear tu cuenta/);
    assert.match(diagnostic, /href="\/placement-test\/"/);
    assert.ok(diagnostic.indexOf("verificar tu email") < diagnostic.indexOf('href="/placement-test/"'));
    assert.match(choices, /href="\/contactanos\/">Pedir orientación/);
    assert.match(choices, /España o en otro país/);
    assert.match(choices, /href="\/cursos\/ingles-online-adultos\/">Consulta las clases online y tu zona horaria/);
    assert.doesNotMatch(choices, /Muy pronto|Próximamente en España/);
  });

  it("keeps all other program routes discoverable without repeating the English choices", async () => {
    const { sections } = await readSources();
    const goals = sectionSource(sections, "StudyGoalsSection", "OfferingPathSection");
    const otherChoices = catalogChoices.filter((choice) => choice.key !== "english-paths");

    assert.deepEqual(otherChoices.map((choice) => catalogHref(choice.key)), [
      "/cursos/?grupo=academic-support", "/cursos/?grupo=digital-technical", "/cursos/?grupo=additional-languages",
    ]);
    assert.match(goals, /choice\.key !== "english-paths"/);
    assert.match(goals, /href=\{catalogHref\(choice\.key\)\}/);
    assert.match(goals, /Ciudadanía:[\s\S]*aún no es un curso publicado/);
    assert.match(goals, /href="\/ciudadania\/"/);
    const linkedPrograms = otherChoices.flatMap((choice) => siteData.courseCatalog.find((group) => group.key === choice.key).programs);
    assert.deepEqual(linkedPrograms, ["ged", "tutorias-matematicas", "computacion-basica", "computacion-oficina", "espanol-extranjeros"]);
  });

  it("makes school-wide orientation the final action while preserving direct enrollment", async () => {
    const { sections, interactive } = await readSources();
    const finalCta = sectionSource(sections, "FinalCtaSection");

    assert.match(finalCta, /¿Listo para empezar\?/);
    assert.match(finalCta, /<CallbackDialog primary compact triggerLabel="Pedir orientación gratuita" \/>/);
    assert.match(finalCta, /href="\/inscribete\/">Inscribirme directamente/);
    assert.doesNotMatch(finalCta, /placement-test/);
    for (const field of ["programa", "nombre", "telefono", "email", "ubicacion", "mejorHorario"]) {
      assert.ok(interactive.includes(`name="${field}"`));
    }
    assert.match(interactive, /if \(!phone && !email\)/);
    assert.match(interactive, /name="contactPermission" type="checkbox" value="yes" required/);
    assert.match(interactive, /href=\{site\.legalLinks\.privacy\}/);
    assert.doesNotMatch(interactive, /name="apellido"|name="interes"|name="para"/);
  });

  it("keeps the real map, location controls, and published Bound Brook office hours accessible", async () => {
    const { sections, locationExplorer } = await readSources();
    const locations = sectionSource(sections, "LocationsSection", "BooksSection");
    const source = `${locations}\n${locationExplorer}`;

    assert.match(locations, /<LocationExplorer/);
    assert.match(source, /new-jersey-campus-map\.jpg/);
    assert.match(source, /© OpenStreetMap/);
    assert.match(locationExplorer, /function MapPin/);
    assert.match(locationExplorer, /function LocationRow/);
    assert.match(locationExplorer, /aria-pressed=\{selected\}/);
    assert.match(locationExplorer, /data-map-focused/);
    assert.match(locationExplorer, /mapFocus\[location\.mapKey\]/);
    assert.match(source, /google\.com\/maps\/search/);
    assert.match(locationExplorer, /<section className="location-hours-panel"/);
    assert.match(locationExplorer, /data-schedule-slot/);
    assert.match(locations, /hours=\{mapped\.find\(\(location\) => location\.mapKey === "bound-brook"\)\?\.hours \|\| \[\]\}/);
    assert.match(locations, /hoursTitle="Bound Brook · Sede principal"/);
    assert.match(locations, /hoursEyebrow="Horario de atención"/);
    assert.match(locations, /location\.status !== "online"/);
    assert.match(locations, /mapKey: "new-york-hq"/);
    assert.match(locationExplorer, /headquarters: "HQ"/);
    assert.doesNotMatch(source, /<details|<summary|<iframe|<svg/);
  });

  it("preserves factual institutional proof inside the opening chapter", async () => {
    const { headquarters, institutionalProof, locations, painHero } = siteData;
    const { sections } = await readSources();
    const hero = sectionSource(sections, "HeroSection", "MethodSection");
    const publishedLocationCount = locations.filter((location) => location.status !== "online").length + 1;

    assert.equal(painHero.eyebrow, "Una escuela de inglés para lo que quieres lograr.");
    assert.equal(institutionalProof.length, 4);
    assert.equal(headquarters.status, "headquarters");
    assert.equal(publishedLocationCount, 7);
    assert.deepEqual(institutionalProof.map((proof) => proof.value), [
      "Desde 2004", "+1,000", `${publishedLocationCount} Puntos de atención`, "Alcance Internacional",
    ]);
    assert.equal(institutionalProof[2].label, "Sedes, atención con cita y coordinación administrativa");
    assert.match(institutionalProof.at(-1).label, /EE\. UU\., Centroamérica, Sudamérica y Europa/);
    assert.doesNotMatch(institutionalProof.map((proof) => proof.value).join(" "), /4 sedes/);
    assert.match(hero, /aria-label="Trayectoria de AIT USA Institute"/);
    assert.match(hero, /institutionalProof\.map/);
  });

  it("preserves public and returning-student routes with accessible mobile menu dismissal", async () => {
    const { chrome } = await readSources();

    assert.match(chrome, /label: "Inicio", href: "\/", page: "home"/);
    assert.match(chrome, /label: "Cursos", href: "\/cursos\/", page: "courses"/);
    assert.match(chrome, /label: "Sedes", href: "\/#sedes", page: "locations"/);
    assert.match(chrome, /label: "Orientación", href: "\/contactanos\/", page: "contact"/);
    assert.match(chrome, /label: "Examen de nivel", href: "\/placement-test\/", page: "placement"/);
    assert.match(chrome, /label: "Inscríbete", href: "\/inscribete\/", page: "registration"/);
    assert.match(chrome, /href="\/portal\/sign-in\/"/);
    assert.match(chrome, /Portal de estudiantes: iniciar sesión/);
    assert.match(chrome, /href="\/employee\/sign-in\/"/);
    assert.match(chrome, /aria-current=\{current\}/);
    assert.match(chrome, /aria-expanded=\{open\}/);
    assert.match(chrome, /event\.key !== "Escape"/);
    assert.match(chrome, /document\.addEventListener\("pointerdown"/);
    assert.match(chrome, /menuButton\.current\?\.focus/);
    assert.match(chrome, /onClick=\{closeMenu\}/);
    assert.match(chrome, /className="skip-link" href="#main-content"/);
  });

  it("retains Spanish-first identity and legal links across shared public surfaces", async () => {
    const { chrome, page } = await readSources();
    const layout = await readFile("app/layout.jsx", "utf8");

    assert.match(layout, /<html lang="es"/);
    assert.match(layout, /https:\/\/www\.aitusainstitute\.com/);
    assert.match(page, /canonical: "\/"/);
    assert.match(chrome, /src=\{site\.images\.logo\}/);
    assert.match(chrome, /site\.legalLinks\.privacy/);
    assert.match(chrome, /site\.legalLinks\.terms/);
    assert.match(chrome, /site\.legal/);
  });

  it("keeps the placement entry focused and retains every real country flag asset", async () => {
    const { interactive } = await readSources();
    const placement = await readFile("app/(public-site)/placement-test/page.jsx", "utf8");
    const sources = [...interactive.matchAll(/\{ name: "[^"]+", src: "(\/assets\/flags\/[a-z]{2}\.svg)" \}/g)]
      .map((match) => match[1]);

    assert.doesNotMatch(placement, /Primero recibes valor|privacyNote|notice-box/);
    assert.equal(sources.length, 21);
    assert.match(interactive, /SPANISH_SPEAKING_COUNTRIES\.map/);
    assert.match(interactive, /src=\{country\.src\}/);
    await Promise.all(sources.map((source) => readFile(`public${source}`, "utf8")));
  });
});
