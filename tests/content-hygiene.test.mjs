import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import { siteData } from "../src/content.js";

async function loadSiteData() {
  return siteData;
}

describe("MIS-267 content hygiene", () => {
  it("keeps Google Form URLs out of runtime site content", async () => {
    const { site } = await loadSiteData();

    assert.equal(site.forms.level, "/placement-test/");
    assert.equal(site.forms.offer.includes("docs.google.com"), false);
    assert.equal(site.forms.registration.includes("docs.google.com"), false);
    assert.equal(JSON.stringify(site.forms).includes("Google Form"), false);
  });

  it("keeps verified active locations populated with phone, WhatsApp, and class hours", async () => {
    const { locations, site } = await loadSiteData();
    const activeLocations = locations.filter((location) => location.status === "active");

    assert.equal(activeLocations.length >= 3, true);
    for (const location of activeLocations) {
      assert.match(location.address, /NJ \d{5}$/);
      assert.equal(location.phone, site.phone);
      assert.equal(location.phoneHref, site.phoneHref);
      assert.equal(location.whatsapp, site.whatsapp);
      assert.equal(location.whatsappHref, site.whatsappHref);
      assert.equal(location.hours.length, 4);
    }
  });

  it("keeps North Plainfield pending until source facts are approved", async () => {
    const { locations } = await loadSiteData();
    const northPlainfield = locations.find((location) => location.city.includes("North Plainfield"));

    assert.equal(northPlainfield.status, "pending");
    assert.match(northPlainfield.address, /pendiente/i);
  });

  it("captures the legacy placement exam source for the on-site handoff", async () => {
    const { placementTest } = await loadSiteData();
    const questionCount = placementTest.questions.reduce(
      (total, level) => total + level.items.length,
      0,
    );

    assert.match(placementTest.legacySource.title, /PLACEMENT EXAM/);
    assert.equal(placementTest.legacySource.formId, "1B_rhVh4lmOIySRtOTOs1rrjas7vns9zRzamncquwcQg");
    assert.equal(placementTest.legacySource.legacyLevels, 6);
    assert.equal(placementTest.legacySource.questionCount, 62);
    assert.equal(placementTest.legacySource.gradingMode, "automatic_provisional");
    assert.equal(placementTest.legacySource.answerKeyStatus, "pending_academic_review");
    assert.equal(placementTest.legacySource.capturedFields.includes("Free Writing"), true);
    assert.equal(placementTest.questions.length, 6);
    assert.equal(questionCount, 62);
    assert.equal(Boolean(placementTest.writingPrompt), true);
    assert.equal(JSON.stringify(placementTest).includes("docs.google.com"), false);
    assert.equal(JSON.stringify(placementTest).includes("Google Form"), false);
  });

  it("keeps public-facing copy free of source-capture and implementation notes", async () => {
    const {
      courseCatalog,
      faqs,
      locations,
      placementTest,
      productOfferings,
      programs,
      site,
    } = await loadSiteData();
    const publicCopy = JSON.stringify({
      courseCatalog,
      faqs,
      locations,
      placementTest: {
        intro: placementTest.intro,
        privacyNote: placementTest.privacyNote,
        crmNote: placementTest.crmNote,
        writingPrompt: placementTest.writingPrompt,
      },
      productOfferings,
      programs,
      site,
    });

    assert.doesNotMatch(
      publicCopy,
      /sitio original|página (?:original|pública)|contenido original|capturad[oa]|producto Wix|esta versión|estructura recuperada|lo que comunica|llave académica/i,
    );

    const renderedSource = [
      await readFile("app/_components/site/PublicSections.jsx", "utf8"),
      await readFile("app/_components/site/PlacementExperience.jsx", "utf8"),
    ].join("\n");
    assert.doesNotMatch(
      renderedSource,
      /llave de respuestas|pendiente de revisión académica|sin salir de esta sección|antes de escribir/i,
    );
  });
});
