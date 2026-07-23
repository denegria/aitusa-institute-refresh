import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";

describe("homepage selective concept integration", () => {
  it("places the verified-media community band between Method and modalities", async () => {
    const source = await readFile("src/main.js", "utf8");
    const methodIndex = source.indexOf("${renderSolutionSection()}");
    const communityIndex = source.indexOf("${renderCommunitySection()}");
    const offeringsIndex = source.indexOf("${renderOfferingPathSection()}");

    assert.ok(methodIndex >= 0);
    assert.ok(communityIndex > methodIndex);
    assert.ok(offeringsIndex > communityIndex);
    assert.match(source, /site\.images\.testimonialAntonina/);
    assert.doesNotMatch(source, /De estudiante a profesor/);
    assert.doesNotMatch(source, /cuidadosamente seleccionados/);
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

  it("reduces the next-step area to two choices with direct phone and WhatsApp links", async () => {
    const source = await readFile("src/main.js", "utf8");
    const section = source.slice(
      source.indexOf("function renderFinalCtaSection"),
      source.indexOf("function renderCourseTeaserSection"),
    );

    assert.equal((section.match(/renderCtaBox\(/g) || []).length, 2);
    assert.match(section, /No sé cuál es mi nivel/);
    assert.match(section, /Estoy listo para empezar/);
    assert.match(section, /next-step-contact/);
    assert.match(section, /site\.phoneHref/);
    assert.match(section, /site\.whatsappHref/);
    assert.match(section, /contact-card--secondary/);
    assert.match(section, /<details class="contact-card/);
    assert.match(section, /Prefiero dejar mis datos/);
  });
});
