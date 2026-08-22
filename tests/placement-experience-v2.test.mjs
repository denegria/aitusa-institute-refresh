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
    assert.match(component, /Descubrir mi nivel/);
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
    assert.match(component, /Progreso guardado/);
    assert.match(component, /Continúa tu prueba/);
    assert.match(component, /Continuar mi prueba/);
    assert.match(component, /Para ver y guardar el resultado/);
    assert.match(component, /Continuar como menor de 13/);
    assert.match(component, /role="dialog"/);
    assert.match(component, /Este permiso es opcional/);
    assert.match(component, /api\/portal\/guardian-onboarding\/code/);
    assert.match(component, /No pedimos fecha de nacimiento/);
    assert.match(component, /api\/portal\/result-claim\/code/);
    assert.doesNotMatch(component, /No hace falta una cuenta para verlo/);
    assert.doesNotMatch(component, /Ahora no/);
    assert.match(component, /opciones de curso/);
    assert.match(component, /no autoriza comunicaciones de marketing/);
  });

  it("keeps the result save CTA visible and readable across interaction states", () => {
    assert.match(styles, /\.diagnostic-unlock \.button--gold \{[\s\S]*border-color: var\(--accent\);[\s\S]*background: var\(--accent\);[\s\S]*color: var\(--blue-deep\);[\s\S]*\}/);
    assert.match(styles, /\.diagnostic-unlock \.button--gold:hover \{/);
    assert.match(styles, /\.diagnostic-unlock \.button--gold:focus-visible \{/);
    assert.match(styles, /\.diagnostic-unlock \.button--gold:active \{/);
    assert.match(styles, /\.diagnostic-unlock \.button--gold:disabled \{[\s\S]*opacity: 0\.5;/);
    assert.match(component, /className="button button--gold"[\s\S]*Verificar y ver mi resultado/);
  });

  it("reuses one completion identifier across safe retries", () => {
    assert.match(component, /const completionIdRef = useRef\(""\)/);
    assert.match(component, /if \(!completionIdRef\.current\) completionIdRef\.current = createAttemptId\(\)/);
    assert.match(component, /completionId: completionIdRef\.current/);
    assert.doesNotMatch(component, /completionId: createAttemptId\(\)/);
  });

  it("requires one explicit advisor preference without treating the number as authentication evidence", () => {
    for (const channel of ["email", "sms", "whatsapp", "phone"]) {
      assert.match(component, new RegExp(`value: "${channel}"`));
    }
    assert.doesNotMatch(component, /value: "none"/);
    assert.match(component, /¿Cómo prefieres que un asesor te contacte\?/);
    assert.match(component, /no se usará para iniciar sesión/);
    assert.match(component, /no autoriza marketing/);
    assert.match(component, /required\s+type="radio"/);
  });

  it("gates the academic result until the verified handoff succeeds", () => {
    assert.match(component, /data-diagnostic-screen="result-gate"/);
    assert.match(component, /Resultado listo/);
    assert.match(component, /if \(!claimReceipt\)/);
    assert.match(component, /onClaimed=\{setClaimReceipt\}/);
    assert.match(component, /Resultado del Placement Test/);
    assert.match(component, /Código de acceso/);
    assert.match(component, /Verificar y ver mi resultado/);
    assert.match(component, /Solo falta verificar tu email para ver tu resultado/);
    assert.match(component, /Abrir mi Portal/);
    assert.match(component, /diagnostic-claim-form--retry/);
    assert.match(component, /Tu acceso está listo/);
    assert.match(component, /resultClaimed: body\.attempt\.status === "claimed"/);
    assert.match(component, /attempt_already_claimed/);
  });

  it("reveals the result through the same adult and guardian success handoff used by production", () => {
    const guardian = component.slice(
      component.indexOf("function GuardianClaimPanel"),
      component.indexOf("function ResultClaimPanel"),
    );
    const adult = component.slice(
      component.indexOf("function AdultResultClaimPanel"),
      component.indexOf("function contactPermissionCopy"),
    );

    assert.equal((guardian.match(/onClaimed\?\./g) || []).length, 2);
    assert.match(guardian, /onClaimed\?\.\(\{ \.\.\.body, preferredChannel \}\)/);
    assert.match(guardian, /onClaimed\?\.\(\{ \.\.\.receipt, preferredChannel \}\)/);
    assert.match(adult, /const revealResult = \(claimed\) => \{[\s\S]*onClaimed\?\.\(\{ \.\.\.claimed, preferredChannel \}\)/);
  });

  it("keeps one dominant result action and demotes the remaining pathways", () => {
    assert.match(component, /className="diagnostic-result__actions"/);
    assert.match(component, /Hablar con un asesor/);
    assert.match(component, /Abrir mi Portal/);
    assert.match(styles, /\.diagnostic-result__actions \.button--gold \{[\s\S]*background: var\(--gold\);/);
    assert.doesNotMatch(component, /Misión 2 desbloqueada/);
    assert.doesNotMatch(component, /diagnostic-mission-path/);
    assert.match(styles, /\.diagnostic-result__actions \{[\s\S]*gap: 12px;/);
  });

  it("uses the institutional navy, gold, and warm-surface system", () => {
    assert.match(styles, /\.placement-page \{[\s\S]*--blue-deep: #001a3d;[\s\S]*--gold: #c4932d;[\s\S]*background: #001a3d;/);
    assert.match(styles, /\.placement-page__hero \{[\s\S]*background: #f7f2e8;/);
    assert.match(styles, /\.diagnostic-shell \{[\s\S]*background: #fffdf9;/);
    assert.match(styles, /\.diagnostic-progress__track span \{[\s\S]*background: var\(--gold\);/);
  });

  it("keeps the contact stage compact and aligned across mobile viewports", () => {
    assert.match(component, /className="diagnostic-gate-heading"/);
    assert.match(component, /className="diagnostic-contact-choice__copy"/);
    assert.doesNotMatch(component, /diagnostic-value-preview/);
    assert.match(styles, /\.diagnostic-contact-choice__grid > label \{[\s\S]*grid-template-columns: 18px minmax\(0, 1fr\);[\s\S]*align-items: center;/);
    assert.match(styles, /@media \(max-width: 720px\)[\s\S]*\.diagnostic-contact-choice__grid \{[\s\S]*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\);/);
    assert.match(styles, /\.diagnostic-contact-choice__grid input \{[\s\S]*-webkit-appearance: none;[\s\S]*appearance: none;[\s\S]*min-width: 17px;[\s\S]*min-height: 17px;[\s\S]*padding: 0;/);
  });

  it("includes directional motion and a reduced-motion override", () => {
    assert.match(styles, /@keyframes diagnostic-card-forward/);
    assert.match(styles, /@keyframes diagnostic-card-back/);
    assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
    assert.match(styles, /\.diagnostic-question-card \{\s*animation: none;/);
  });
});
