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

  it("keeps homepage location cards concise and sends schedule detail one click deeper", async () => {
    const source = await readFile("src/main.js", "utf8");
    const section = source.slice(
      source.indexOf("function renderLocationCard"),
      source.indexOf("function renderPendingLocationNote"),
    );

    assert.match(section, /Ver horarios/);
    assert.match(section, /Consultar disponibilidad/);
    assert.match(section, /location-card__action/);
    assert.doesNotMatch(section, /location-contact-list/);
    assert.doesNotMatch(section, /location-hours/);
  });
});
