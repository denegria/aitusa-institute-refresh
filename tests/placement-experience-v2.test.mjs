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
    assert.doesNotMatch(component, /Explorando preguntas de/);
    assert.doesNotMatch(component, /Tu nivel se estima al final/);
    assert.doesNotMatch(component, /Calificaste para/);
  });

  it("renders a scrollable six-level academic path", () => {
    for (const level of ["Level 1", "Level 2", "Level 3", "Level 4", "Level 5", "Level 6"]) {
      assert.match(component, new RegExp(`label: "${level}"`));
    }
    assert.match(component, /const currentBook = getBookKey\(question\.book\)/);
    assert.match(component, /scrollIntoView/);
    assert.match(styles, /\.diagnostic-level-path \{[\s\S]*overflow-x: auto;/);
  });

  it("does not calculate a fallback result in the browser", () => {
    assert.match(component, /fetch\("\/api\/placement-test"/);
    assert.doesNotMatch(component, /buildFallbackResult/);
    assert.doesNotMatch(component, /placementTest\.recommendations\.find/);
    assert.doesNotMatch(component, /question\.answer/);
  });

  it("exposes the guardian boundary and passwordless Study Buddy conversion", () => {
    assert.match(component, /practica 3–5 minutos/);
    assert.match(component, /cinco\s+turnos/);
    assert.match(component, /Puede completar el examen y ver su resultado/);
    assert.match(component, /Continuar como menor de 13/);
    assert.match(component, /role="dialog"/);
    assert.match(component, /No hace falta una cuenta para verlo/);
    assert.match(component, /Este permiso es opcional/);
    assert.match(component, /api\/portal\/guardian-onboarding\/code/);
    assert.match(component, /No pedimos fecha de nacimiento/);
    assert.match(component, /api\/portal\/result-claim\/code/);
    assert.match(component, /Ahora no/);
    assert.match(component, /Tu resultado sigue visible/);
  });

  it("keeps the result save CTA visible and readable across interaction states", () => {
    assert.match(styles, /\.diagnostic-unlock \.button--gold \{[\s\S]*border-color: var\(--accent\);[\s\S]*background: var\(--accent\);[\s\S]*color: var\(--blue-deep\);[\s\S]*\}/);
    assert.match(styles, /\.diagnostic-unlock \.button--gold:hover \{/);
    assert.match(styles, /\.diagnostic-unlock \.button--gold:focus-visible \{/);
    assert.match(styles, /\.diagnostic-unlock \.button--gold:active \{/);
    assert.match(styles, /\.diagnostic-unlock \.button--gold:disabled \{[\s\S]*opacity: 0\.5;/);
    assert.match(component, /className="button button--gold"[\s\S]*Guardar mi resultado/);
  });

  it("reuses one completion identifier across safe retries", () => {
    assert.match(component, /const completionIdRef = useRef\(""\)/);
    assert.match(component, /if \(!completionIdRef\.current\) completionIdRef\.current = createAttemptId\(\)/);
    assert.match(component, /completionId: completionIdRef\.current/);
    assert.doesNotMatch(component, /completionId: createAttemptId\(\)/);
  });

  it("captures an explicit optional preference without treating the number as authentication evidence", () => {
    assert.match(component, /choice === "email"/);
    assert.match(component, /choice === "none"/);
    assert.match(component, /No quiero contacto adicional por ahora/);
    assert.match(component, /\["email", "Email"\], \["sms", "SMS"\], \["whatsapp", "WhatsApp"\], \["phone", "Llamada telefónica"\]/);
    assert.match(component, /no se usará para iniciar sesión/);
    assert.match(component, /no autoriza marketing/);
    assert.doesNotMatch(component, /<input checked type="radio" readOnly name="placement-channel"/);
  });

  it("keeps one dominant result action and demotes the remaining pathways", () => {
    assert.match(component, /className="diagnostic-result__support"/);
    assert.match(component, /className="diagnostic-result__support-link"[\s\S]*Confirmar con un asesor/);
    assert.match(component, /className="diagnostic-result__support-link" href="\/cursos\/"/);
    assert.doesNotMatch(component, /diagnostic-result__actions/);
    assert.match(styles, /\.diagnostic-result__support \{[\s\S]*grid-template-columns: auto minmax\(0, 1fr\) auto;/);
  });

  it("uses the institutional navy, gold, and warm-surface system", () => {
    assert.match(styles, /\.placement-page \{[\s\S]*--blue-deep: #001a3d;[\s\S]*--gold: #c4932d;[\s\S]*background: #001a3d;/);
    assert.match(styles, /\.placement-page__hero \{[\s\S]*background: #f7f2e8;/);
    assert.match(styles, /\.diagnostic-shell \{[\s\S]*background: #fffdf9;/);
    assert.match(styles, /\.diagnostic-progress__track span \{[\s\S]*background: var\(--gold\);/);
  });

  it("includes directional motion and a reduced-motion override", () => {
    assert.match(styles, /@keyframes diagnostic-card-forward/);
    assert.match(styles, /@keyframes diagnostic-card-back/);
    assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
    assert.match(styles, /\.diagnostic-question-card \{\s*animation: none;/);
  });
});
