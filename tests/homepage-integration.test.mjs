import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";

const readSources = async () => ({
  page: await readFile("app/(public-site)/page.jsx", "utf8"),
  sections: await readFile("app/_components/site/PublicSections.jsx", "utf8"),
  interactive: await readFile("app/_components/site/InteractiveSections.jsx", "utf8"),
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
    const faq = page.indexOf("<FaqSection");
    const finalCta = page.indexOf("<FinalCtaSection");

    assert.ok(method >= 0);
    assert.ok(proof > method);
    assert.ok(offerings > proof);
    assert.ok(locations > offerings);
    assert.ok(faq > locations);
    assert.ok(finalCta > faq);
    assert.doesNotMatch(page, /dangerouslySetInnerHTML[\s\S]*legacy|src\/main\.js/);
  });

  it("keeps three primary modality choices and the approved support-program rail", async () => {
    const { sections } = await readSources();
    const start = sections.indexOf("const supportingPrograms");
    const end = sections.indexOf("function MapPin");
    const source = sections.slice(start, end);

    assert.match(source, /productOfferings\.slice\(0, 3\)/);
    assert.match(source, /offer-node__marker/);
    assert.match(source, /offer-node__status/);
    assert.match(source, /Programa principal/);
    assert.match(source, /catalog-programs/);
    assert.match(source, /Inglés para niños/);
    assert.match(source, /\/courses\/ingles-ninos\//);
    assert.match(source, /\/courses\/ged\//);
    assert.match(source, /computacion-y-cursos-tecnicos/);
    assert.match(source, /\/courses\/espanol-extranjeros\//);
    assert.match(source, /apoyo-academico/);
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

  it("keeps the real map, compact location rows, and shared schedule", async () => {
    const { sections } = await readSources();
    assert.match(sections, /location-explorer/);
    assert.match(sections, /new-jersey-campus-map\.jpg/);
    assert.match(sections, /© OpenStreetMap/);
    assert.match(sections, /function MapPin/);
    assert.match(sections, /function LocationRow/);
    assert.match(sections, /google\.com\/maps\/search/);
    assert.match(sections, /location-hours-panel/);
    assert.doesNotMatch(sections, /<iframe|<svg/);
  });

  it("tracks active homepage sections and preserves the mobile menu keyboard escape", async () => {
    const { chrome } = await readSources();
    assert.match(chrome, /setActiveSection/);
    assert.match(chrome, /window\.requestAnimationFrame\(update\)/);
    assert.match(chrome, /window\.addEventListener\("scroll"/);
    assert.match(chrome, /aria-current=\{current\}/);
    assert.match(chrome, /event\.key === "Escape"/);
  });

  it("keeps the approved hero hierarchy and two primary actions", async () => {
    const { sections } = await readSources();
    const hero = sections.slice(
      sections.indexOf("export function HeroSection"),
      sections.indexOf("export function MethodSection"),
    );
    assert.match(hero, /hero__title-block/);
    assert.match(hero, /hero__summary/);
    assert.match(hero, /hero__objections/);
    assert.match(hero, /hero__conversion/);
    assert.equal((hero.match(/className="button button--/g) || []).length, 2);
    assert.ok(hero.indexOf("hero__summary") < hero.indexOf("hero__objections"));
    assert.ok(hero.indexOf("hero__objections") < hero.indexOf("hero__conversion"));
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
});
