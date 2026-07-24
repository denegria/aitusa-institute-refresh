import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";

describe("homepage selective concept integration", () => {
  it("keeps the homepage in one proof-led funnel sequence", async () => {
    const source = await readFile("src/main.js", "utf8");
    const methodIndex = source.indexOf("${renderSolutionSection()}");
    const proofIndex = source.indexOf("${renderProofSection()}");
    const communityIndex = source.indexOf("${renderCommunitySection()}");
    const offeringsIndex = source.indexOf("${renderOfferingPathSection()}");
    const locationsIndex = source.indexOf("${renderLocationsSection()}");
    const faqIndex = source.indexOf("${renderFaqSection()}");
    const finalCtaIndex = source.indexOf("${renderFinalCtaSection()}");

    assert.ok(methodIndex >= 0);
    assert.ok(proofIndex > methodIndex);
    assert.ok(communityIndex > proofIndex);
    assert.ok(offeringsIndex > communityIndex);
    assert.ok(locationsIndex > offeringsIndex);
    assert.ok(faqIndex > locationsIndex);
    assert.ok(finalCtaIndex > faqIndex);
    assert.match(source, /src="\$\{site\.images\.testimonialAntonina\}"/);
    assert.doesNotMatch(source, /asset\(site\.images\.testimonialAntonina\)/);
    assert.doesNotMatch(source, /De estudiante a profesor/);
    assert.doesNotMatch(source, /cuidadosamente seleccionados/);
    assert.doesNotMatch(
      source.slice(source.indexOf("function renderHomePage"), source.indexOf("function renderCoursesPage")),
      /renderCourseTeaserSection/,
    );
    assert.match(source, /initFaqs\(document\);\s*scrollToInitialHash\(\);/);
  });

  it("keeps three primary modality choices and moves support programs into catalog copy", async () => {
    const source = await readFile("src/main.js", "utf8");
    const section = source.slice(
      source.indexOf("function renderOfferingPathSection"),
      source.indexOf("function renderCommunitySection"),
    );

    assert.match(section, /productOfferings\s*\.slice\(0, 3\)/);
    assert.match(section, /offer-node__link/);
    assert.match(section, /También ofrecemos inglés para niños, GED, computación/);
    assert.match(section, /Ver catálogo completo/);
  });

  it("uses placement as the primary conversion action and WhatsApp as the human fallback", async () => {
    const source = await readFile("src/main.js", "utf8");
    const section = source.slice(
      source.indexOf("function renderFinalCtaSection"),
      source.indexOf("function renderCourseTeaserSection"),
    );

    assert.equal((section.match(/renderCtaBox\(/g) || []).length, 0);
    assert.match(section, /¿Listo para empezar\?/);
    assert.match(section, /Encontrar mi nivel/);
    assert.match(section, /Hablar por WhatsApp/);
    assert.match(section, /final-cta-actions/);
    assert.match(section, /conversionCtas\.placement/);
    assert.match(section, /conversionCtas\.advisor/);
    assert.match(section, /contact-card--secondary/);
    assert.match(section, /<details class="contact-card/);
    assert.match(section, /Prefiero que me contacten/);
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

  it("keeps the verified schedule on the three active New Jersey campuses", async () => {
    const content = await readFile("src/content.js", "utf8");

    assert.match(content, /Lunes a jueves: 8:30 am, 9:30 am y 10:30 am/);
    assert.match(content, /Lunes a jueves: 6:20 pm, 7:30 pm y 8:40 pm/);
    assert.match(content, /Sábados: 10:00 am a 1:00 pm y 3:00 pm a 5:30 pm/);
    assert.match(content, /Domingos: 10:00 am a 12:30 pm/);
    assert.equal((content.match(/\.\.\.centralLocationContact/g) || []).length, 5);
  });
});
