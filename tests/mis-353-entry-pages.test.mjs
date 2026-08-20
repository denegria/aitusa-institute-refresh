import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";

const placementPage = await readFile(
  new URL("../app/(public-site)/placement-test/page.jsx", import.meta.url),
  "utf8",
);
const placementExperience = await readFile(
  new URL("../app/_components/site/PlacementExperience.jsx", import.meta.url),
  "utf8",
);
const portalExperience = await readFile(
  new URL("../app/portal/sign-in/SignInExperience.jsx", import.meta.url),
  "utf8",
);
const employeeSignIn = await readFile(
  new URL("../app/employee/sign-in/page.jsx", import.meta.url),
  "utf8",
);
const placementStyles = await readFile(
  new URL("../src/styles.css", import.meta.url),
  "utf8",
);
const portalStyles = await readFile(
  new URL("../src/portal/portalShell.css", import.meta.url),
  "utf8",
);

describe("MIS-353 focused entry surfaces", () => {
  it("keeps placement in a compact task shell with utility links", () => {
    assert.match(placementPage, /<PlacementExperience \/>/);
    assert.match(placementPage, /className="placement-utility"/);
    assert.doesNotMatch(placementPage, /<SiteFooter/);
    assert.doesNotMatch(placementPage, /page-hero/);
  });

  it("progressively discloses the under-13 path", () => {
    assert.match(placementExperience, /Descubrir mi nivel/);
    assert.match(placementExperience, /¿El estudiante es menor de 13\?/);
    assert.match(placementExperience, /role="dialog"/);
    assert.match(placementExperience, /Continuar como menor de 13/);
    assert.match(placementExperience, /aria-modal="true"/);
    assert.match(placementExperience, /event\.key === "Escape"/);
    assert.doesNotMatch(placementExperience, /Un menor de 13 puede completar el examen\. Sus respuestas/);
  });

  it("frames Portal auth with a minimal institutional header", () => {
    assert.match(portalExperience, /className="portal-access__header"/);
    assert.match(portalExperience, /Volver al sitio/);
    assert.match(portalStyles, /\.portal-access__header \{/);
    assert.match(portalStyles, /background: #fffdf9;/);
    assert.match(portalStyles, /\.portal-signin__trust p \{[\s\S]*font-size: 12px;/);
    assert.match(portalStyles, /\.portal-signin__footer a \{[\s\S]*font-size: 12px;/);
    assert.match(portalExperience, /Acceso de empleados/);
    assert.match(employeeSignIn, /audience="employee"/);
    assert.match(portalExperience, /Acceso exclusivo para personal autorizado/);
  });

  it("defines the primary viewport fit and mobile disclosure variants", () => {
    assert.match(placementStyles, /\.placement-utility \{/);
    assert.match(placementStyles, /\.placement-dialog__panel \{/);
    assert.match(placementStyles, /max-height: min\(86svh, 620px\);/);
    assert.match(placementStyles, /\.diagnostic-shell \{[\s\S]*overflow: visible;/);
    assert.match(placementStyles, /\.section\.placement-page__app \{[\s\S]*padding-block: 12px 8px;/);
    assert.match(placementStyles, /\.diagnostic-shell \{[\s\S]*min-height: 0;/);
    assert.match(placementStyles, /@media \(min-width: 721px\) and \(max-height: 820px\)/);
    assert.match(placementStyles, /\.diagnostic-intro \{[\s\S]*gap: 12px;[\s\S]*padding-block: 36px 18px;/);
    assert.match(placementStyles, /@media \(max-width: 720px\) and \(max-height: 820px\)/);
    assert.match(placementStyles, /\.diagnostic-intro \{[\s\S]*gap: 10px;[\s\S]*padding-block: 34px 10px;/);
    assert.match(
      placementStyles,
      /@media \(min-width: 721px\) and \(max-height: 820px\) \{[\s\S]*\.diagnostic-shell__brand \{[\s\S]*display: none;/,
    );
    assert.match(portalStyles, /\.portal-access \{[\s\S]*box-sizing: border-box;/);
    assert.match(portalStyles, /grid-template-rows: 68px minmax\(0, 1fr\);/);
    assert.match(
      portalStyles,
      /\.portal-access__header \{[\s\S]*justify-self: stretch;[\s\S]*min-height: 68px;/,
    );
    assert.doesNotMatch(
      portalStyles,
      /\.portal-access__header \{[\s\S]*position: absolute;/,
    );
    assert.match(portalStyles, /grid-template-rows: 64px minmax\(0, 1fr\);/);
    assert.match(portalStyles, /@media \(min-width: 521px\) and \(max-height: 820px\)/);
    assert.match(portalStyles, /@media \(max-width: 520px\) and \(max-height: 820px\)/);
  });
});
