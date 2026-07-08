import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createPortalShellModel } from "../src/portal/portalShell.js";

describe("MIS-276 portal shell model", () => {
  it("builds a student shell with the expected primary navigation", () => {
    const model = createPortalShellModel("studentActive");

    assert.equal(model.state, "ready");
    assert.deepEqual(
      model.navItems.map((item) => item.label),
      ["Inicio", "Mis cursos", "Asistencia", "Estudiar", "Cuenta"],
    );
  });

  it("uses MIS-271 privacy gates for sensitive student areas", () => {
    const model = createPortalShellModel("studentActive");
    const attendance = model.cards.find((card) => card.id === "attendance");
    const study = model.cards.find((card) => card.id === "study");

    assert.equal(attendance.access.allowed, false);
    assert.equal(attendance.access.reason, "privacy_gate_required");
    assert.equal(study.access.reason, "privacy_gate_required");
  });

  it("keeps payment and AI cards blocked even when privacy gate is satisfied", () => {
    const model = createPortalShellModel("guardianActive");
    const payments = model.cards.find((card) => card.id === "payments");
    const ai = model.cards.find((card) => card.id === "ai-practice");

    assert.equal(payments.access.reason, "feature_not_approved");
    assert.equal(ai.access.reason, "feature_not_approved");
  });

  it("adds role-specific shell cards for guardians, teachers, and admins", () => {
    assert.equal(
      createPortalShellModel("guardianActive").cards.some(
        (card) => card.id === "guardian-summary",
      ),
      true,
    );
    assert.equal(
      createPortalShellModel("teacherActive").cards.some(
        (card) => card.id === "teacher-classes",
      ),
      true,
    );
    assert.equal(
      createPortalShellModel("adminActive").cards.some(
        (card) => card.id === "admin-review",
      ),
      true,
    );
  });

  it("returns a support shell when CRM identity is missing", () => {
    const model = createPortalShellModel("missingCrmLinkStudent");

    assert.equal(model.state, "blocked");
    assert.equal(model.reason, "crm_link_required");
    assert.equal(model.navItems.length, 0);
    assert.equal(model.cards[0].id, "account-support");
  });
});
