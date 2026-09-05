import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { catalogChoices, catalogHref, normalizeCatalogGroup, courseComparison, courseInquiryHref } from "../src/courseDiscovery.js";
import { courseCatalog, programs, catalogInformationRoutes } from "../src/content.js";
import { LEAD_INTERESTS } from "../src/leads/leadContactModel.js";

describe("prospect journey context", () => {
  it("accepts only known categories and keeps untrusted URL values inside the catalog", () => {
    for (const invalid of [undefined, null, "", ["digital-technical"], "https://example.com", "../portal", "digital-technical&admin=1"]) {
      assert.equal(normalizeCatalogGroup(invalid), "all-offerings");
      assert.equal(catalogHref(invalid), "/cursos/");
    }
    for (const choice of catalogChoices) {
      assert.equal(normalizeCatalogGroup(choice.key), choice.key);
      assert.equal(new URL(catalogHref(choice.key), "https://ait.example").searchParams.get("grupo"), choice.key);
    }
    assert.equal(catalogHref("digital-technical", "computacion-oficina"), "/cursos/?grupo=digital-technical#curso-computacion-oficina");
  });

  it("covers every published course without promoting informational citizenship to a course", () => {
    assert.deepEqual(Object.keys(courseComparison).sort(), programs.map((program) => program.slug).sort());
    assert.deepEqual(catalogChoices.map((choice) => choice.key), courseCatalog.map((group) => group.key));
    for (const route of catalogInformationRoutes) assert.equal(courseComparison[route.key], undefined);
    for (const facts of Object.values(courseComparison)) {
      assert.ok(facts.fit && facts.format && facts.duration && facts.requirements);
      assert.ok(LEAD_INTERESTS.includes(facts.interest));
    }
    assert.equal(courseComparison.ged.interest, "ged");
    assert.equal(courseComparison["computacion-oficina"].interest, "computacion");
    assert.equal(courseComparison["espanol-extranjeros"].interest, "espanol");
  });

  it("preserves the chosen subject in the WhatsApp handoff without adding URL parameters from its text", () => {
    const title = "GED & matemáticas? nivel=1";
    const url = new URL(courseInquiryHref("https://wa.me/17323790593", title));
    assert.equal(url.hostname, "wa.me");
    assert.equal(url.pathname, "/17323790593");
    assert.ok(url.searchParams.get("text").includes(title));
    assert.equal([...url.searchParams.keys()].length, 1);
  });
});
