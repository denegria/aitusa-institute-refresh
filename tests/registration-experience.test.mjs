import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import { sanitizePortalReturnTo } from "../src/portalAuth/returnTo.js";

const component = await readFile(new URL("../app/_components/site/RegistrationExperience.jsx", import.meta.url), "utf8");
const header = await readFile(new URL("../app/_components/site/SiteChrome.jsx", import.meta.url), "utf8");
const course = await readFile(new URL("../app/_components/site/CourseProgramPage.jsx", import.meta.url), "utf8");
const placement = await readFile(new URL("../app/_components/site/PlacementExperience.jsx", import.meta.url), "utf8");
const portal = await readFile(new URL("../app/portal/PortalDashboard.jsx", import.meta.url), "utf8");
const signIn = await readFile(new URL("../app/portal/sign-in/SignInExperience.jsx", import.meta.url), "utf8");
const css = await readFile(new URL("../src/registration.css", import.meta.url), "utf8");

describe("MIS-421 registration experience", () => {
  it("keeps the three-step, provider-hosted, redirect-independent flow explicit", () => {
    assert.match(component, /\["Ruta", "Datos", "Revisar"\]/);
    assert.match(component, /aria-current=\{draft\.step === index \+ 1 \? "step"/);
    assert.match(component, /Sin datos de tarjeta en AIT/);
    assert.match(component, /La redirección no es una confirmación/);
    assert.match(component, /sessionStorage/);
    assert.doesNotMatch(component, /setInterval|cardNumber|cvv|cvc/i);
  });

  it("offers optional Portal sign-in while retaining guest checkout", () => {
    assert.match(component, /\/portal\/sign-in\/\?returnTo=/);
    assert.match(component, /Entrar al Portal <small>\(opcional\)<\/small>/);
    assert.match(component, /onClick=\{\(\) => sessionStorage\.setItem\(REGISTRATION_DRAFT_KEY, JSON\.stringify\(draft\)\)\}/);
    assert.match(component, /portalStudentEmail\.toLowerCase\(\) === draft\.student\.email/);
  });

  it("returns to the selected registration route and offers a way back without signing in", () => {
    assert.equal(sanitizePortalReturnTo("/inscribete/?curso=ged", "student"), "/inscribete/?curso=ged");
    assert.equal(sanitizePortalReturnTo("/inscribete/", "student"), "/inscribete/");
    assert.match(signIn, /registrationReturn \? returnTo : "\/"/);
    assert.match(signIn, /Volver a inscripción/);
  });

  it("collects shipping only for the authoritative shipment mode", () => {
    assert.match(component, /deliveryMode === "shipment"/);
    assert.match(component, /mode === "shipment"/);
    assert.match(component, /Envío a domicilio/);
    assert.match(component, /Solo la pedimos para estudiantes online dentro de Estados Unidos/);
  });

  it("blocks legacy Spanish checkout migration until CRM confirms no prior payment request", () => {
    assert.match(component, /needsLegacySpanishDraftReconciliation\(saved\)/);
    assert.match(component, /request\("\/api\/registration\/reconcile\/", \{ idempotencyKey: saved\.idempotencyKey \}\)/);
    assert.match(component, /result\.exists === true\) setLegacyDraftReview\(\{ state: "blocked"/);
    assert.match(component, /result\.exists === false\) \{[\s\S]*setDraft\(migrateUnsubmittedSpanishDraft\(restored, saved\)\)/);
    assert.match(component, /if \(legacyDraftReview\) return <section/);
  });

  it("provides contextual registration CTAs across public, placement, and portal surfaces", () => {
    for (const source of [header, placement, portal]) assert.match(source, /\/inscribete\//);
    assert.match(course, /courseRegistrationAction\(program\.slug\)/);
    assert.match(course, /href=\{registration\.href\}/);
  });

  it("has explicit mobile and narrow-width guards", () => {
    assert.match(css, /@media \(max-width: 820px\)/);
    assert.match(css, /@media \(max-width: 380px\)/);
    assert.match(css, /grid-template-columns: 1fr/);
  });
});
