import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";

const component = await readFile(
  new URL("../app/_components/site/PlacementExperience.jsx", import.meta.url),
  "utf8",
);
const styles = await readFile(
  new URL("../src/styles.css", import.meta.url),
  "utf8",
);

describe("MIS-339 placement diagnostic V2 interaction shell", () => {
  it("starts anonymously and renders one question screen instead of contact fields", () => {
    assert.match(component, /Sin registro/);
    assert.match(component, /data-diagnostic-screen="question"/);
    assert.match(component, /flatQuestions\[questionIndex\]/);
    assert.doesNotMatch(component, /function StudentFields/);
    assert.doesNotMatch(component, /<QuizQuestions/);
  });

  it("supports back, skip, review, and session-only refresh recovery", () => {
    assert.match(component, /Saltar por ahora/);
    assert.match(component, /data-diagnostic-screen="review"/);
    assert.match(component, /sessionStorage\.setItem/);
    assert.match(component, /reviewReturn/);
  });

  it("keeps progress separate from academic qualification", () => {
    assert.match(component, /role="progressbar"/);
    assert.match(component, /Explorando preguntas de/);
    assert.match(component, /Tu nivel se estima al final/);
    assert.doesNotMatch(component, /Calificaste para/);
  });

  it("does not calculate a fallback result in the browser", () => {
    assert.match(component, /fetch\("\/api\/placement-test"/);
    assert.doesNotMatch(component, /buildFallbackResult/);
    assert.doesNotMatch(component, /placementTest\.recommendations\.find/);
    assert.doesNotMatch(component, /question\.answer/);
  });

  it("exposes the guardian and Study Buddy trial decisions without enabling them", () => {
    assert.match(component, /practica 3–5 minutos/);
    assert.match(component, /cinco\s+turnos/);
    assert.match(component, /Menores de 13 años/);
    assert.match(component, /Siguiente entrega/);
  });

  it("includes directional motion and a reduced-motion override", () => {
    assert.match(styles, /@keyframes diagnostic-card-forward/);
    assert.match(styles, /@keyframes diagnostic-card-back/);
    assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
    assert.match(styles, /\.diagnostic-question-card \{\s*animation: none;/);
  });
});
