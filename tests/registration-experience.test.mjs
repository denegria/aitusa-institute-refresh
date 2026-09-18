import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";

const component = await readFile(new URL("../app/_components/site/RegistrationExperience.jsx", import.meta.url), "utf8");
const header = await readFile(new URL("../app/_components/site/SiteChrome.jsx", import.meta.url), "utf8");
const course = await readFile(new URL("../app/_components/site/CourseProgramPage.jsx", import.meta.url), "utf8");
const placement = await readFile(new URL("../app/_components/site/PlacementExperience.jsx", import.meta.url), "utf8");
const portal = await readFile(new URL("../app/portal/PortalDashboard.jsx", import.meta.url), "utf8");
const css = await readFile(new URL("../src/registration.css", import.meta.url), "utf8");

describe("MIS-421 registration experience", () => {
  it("keeps the three-step, provider-hosted, redirect-independent flow explicit", () => {
    assert.match(component, /Tu ruta/);
    assert.match(component, /Estudiante y pago/);
    assert.match(component, /Revisar y pagar/);
    assert.match(component, /Sin datos de tarjeta en AIT/);
    assert.match(component, /La redirección no es una confirmación/);
    assert.match(component, /sessionStorage/);
    assert.doesNotMatch(component, /setInterval|cardNumber|cvv|cvc/i);
  });

  it("collects shipping only for the authoritative shipment mode", () => {
    assert.match(component, /deliveryMode === "shipment"/);
    assert.match(component, /Solo la pedimos para estudiantes online dentro de Estados Unidos/);
  });

  it("provides contextual registration CTAs across public, placement, and portal surfaces", () => {
    for (const source of [header, course, placement, portal]) assert.match(source, /\/inscribete\//);
  });

  it("has explicit mobile and narrow-width guards", () => {
    assert.match(css, /@media \(max-width: 820px\)/);
    assert.match(css, /@media \(max-width: 380px\)/);
    assert.match(css, /grid-template-columns: 1fr/);
  });
});
