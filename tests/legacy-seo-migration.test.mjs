import assert from "node:assert/strict";
import { NextRequest } from "next/server.js";
import { describe, it } from "node:test";
import { proxy } from "../proxy.js";
import {
  getLegacyDestination,
  isLegacyGonePath,
  LEGACY_REDIRECTS,
} from "../src/seo/legacyRoutes.js";

const expectedRedirects = {
  "/copy-of-terms-of-use": "/privacy-policy",
  "/terms-of-use": "/terms-and-conditions",
  "/contact-8": "/contactanos",
  "/copy-of-contáctanos": "/cursos/ingles-online-adultos/",
  "/copy-of-inscripciones": "/contactanos",
  "/copy-of-ofertas": "/contactanos",
  "/inscripciones": "/contactanos",
  "/copy-of-computacion": "/cursos/computacion-basica/",
  "/copy-of-computacion-1": "/cursos/computacion-oficina/",
  "/copy-of-computacion-para-oficina": "/cursos/reparacion-computadoras/",
  "/copy-of-ged-matematicas": "/cursos/ged/",
  "/copy-of-ged-matematicas-1": "/cursos/tutorias-matematicas/",
  "/copy-of-español-para-americanos": "/cursos/espanol-extranjeros/",
  "/copy-of-ingles": "/cursos/ingles-jovenes-adultos/",
  "/copy-of-ingles-1": "/cursos/ingles-online-adultos/",
  "/copy-of-ingles-para-jovenes-adultos": "/cursos/ingles-online-adultos/",
  "/ingles-para-ninos": "/cursos/ingles-ninos/",
  "/copy-of-ingles-para-ninos": "/cursos/ingles-ninos/",
  "/cursos-1": "/cursos/",
  "/nosotros": "/#metodo",
  "/aulas-vivas": "/#metodo",
  "/product-page/ingles-nivel-basico": "/cursos/ingles-online-adultos/",
  "/product-page/europa-mes-4weeks": "/cursos/ingles-online-adultos/",
  "/product-page/copy-of-ingles": "/contactanos",
  "/product-page/ingles-costo-promocional-para-colombia": "/contactanos",
  "/product-page/libro": "/contactanos",
};

describe("legacy Wix SEO migration", () => {
  it("maps every known legacy page and product to one honest canonical destination", () => {
    assert.deepEqual(Object.fromEntries(LEGACY_REDIRECTS.map(({ source, destination }) => [source, destination])), expectedRedirects);
    assert.equal(new Set(LEGACY_REDIRECTS.map(({ source }) => source)).size, LEGACY_REDIRECTS.length);
    assert.ok(LEGACY_REDIRECTS.every(({ destination }) => !destination.startsWith("/courses")));
    assert.equal(getLegacyDestination("/copy-of-cont%C3%A1ctanos"), "/cursos/ingles-online-adultos/");
    assert.equal(getLegacyDestination("/copy-of-espa%C3%B1ol-para-americanos"), "/cursos/espanol-extranjeros/");
  });

  it("consolidates the legacy English host without weakening same-host staging QA", async () => {
    const sameHost = proxy(new NextRequest("https://staging.example/copy-of-ingles?campaign=legacy"));
    const englishHostKnown = proxy(new NextRequest("https://en.aitusainstitute.com/copy-of-ingles?campaign=legacy"));
    const englishHostUnknown = proxy(new NextRequest("https://en.aitusainstitute.com/unknown-old-page"));

    assert.equal(sameHost.status, 308);
    assert.equal(sameHost.headers.get("location"), "https://staging.example/cursos/ingles-jovenes-adultos/?campaign=legacy");
    assert.equal(englishHostKnown.status, 308);
    assert.equal(englishHostKnown.headers.get("location"), "https://www.aitusainstitute.com/cursos/ingles-jovenes-adultos/?campaign=legacy");
    assert.equal(englishHostUnknown.status, 308);
    assert.equal(englishHostUnknown.headers.get("location"), "https://www.aitusainstitute.com/unknown-old-page");
  });

  it("returns an intentional cacheable 410 for retired downloads, surveys, and events", async () => {
    for (const path of ["/descargas", "/landing-page", "/events", "/events-1/thanksgiving-day"]) {
      assert.equal(isLegacyGonePath(path), true);
      const response = proxy(new NextRequest(`https://staging.example${path}`));
      assert.equal(response.status, 410);
      assert.match(response.headers.get("cache-control"), /s-maxage=86400/);
      assert.equal(await response.text(), "Gone");
    }
  });
});
