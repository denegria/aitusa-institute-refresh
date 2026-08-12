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

  it("keeps active-location contact details and scopes verified hours to Bound Brook", async () => {
    const { headquarters, locations, site } = await loadSiteData();
    const activeLocations = locations.filter((location) => location.status === "active");

    assert.equal(activeLocations.length >= 3, true);
    for (const location of activeLocations) {
      assert.match(location.address, /NJ \d{5}$/);
      assert.equal(location.phone, site.phone);
      assert.equal(location.phoneHref, site.phoneHref);
      assert.equal(location.whatsapp, site.whatsapp);
      assert.equal(location.whatsappHref, site.whatsappHref);
    }
    assert.equal(headquarters.city, "Nueva York");
    assert.equal(headquarters.address, "Nueva York · Coordinación administrativa y atención online");
    assert.equal(headquarters.status, "headquarters");
    const boundBrook = locations.find((location) => location.mapKey === "bound-brook");
    assert.equal(headquarters.hours, undefined);
    assert.equal(headquarters.note, "HQ");
    assert.equal(boundBrook.note, "Sede principal");
    assert.equal(boundBrook.hours.length, 2);
    assert.equal(boundBrook.hours.flatMap((group) => group.slots).length, 4);
    assert.deepEqual(boundBrook.hours, [
      {
        label: "Entre semana",
        slots: [
          { label: "Lun–jue", times: "9:30 am–10:00 pm" },
          { label: "Vie", times: "9:30 am–8:00 pm" },
        ],
      },
      {
        label: "Fin de semana",
        slots: [
          { label: "Sáb", times: "9:30 am–6:00 pm" },
          { label: "Dom", times: "10:30 am–1:30 pm" },
        ],
      },
    ]);
    assert.equal(locations.filter((location) => location.status === "limited").length, 3);
  });

  it("keeps appointment-only locations explicit without inventing addresses", async () => {
    const { locations } = await loadSiteData();
    const northPlainfield = locations.find((location) => location.city.includes("North Plainfield"));
    const somerville = locations.find((location) => location.city.includes("Somerville"));

    assert.equal(northPlainfield.status, "limited");
    assert.equal(somerville.status, "limited");
    assert.equal(northPlainfield.note, "Atención con cita previa");
    assert.equal(somerville.note, "Atención con cita previa");
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
    assert.equal(placementTest.legacySource.gradingMode, "automatic_consecutive_block_mastery");
    assert.equal(placementTest.legacySource.answerKeyStatus, "approved");
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
