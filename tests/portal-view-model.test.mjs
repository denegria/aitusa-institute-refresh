import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createAuthenticatedPortalViewModel,
  createPortalAccessViewModel,
} from "../src/portal/portalViewModel.js";

const snapshot = {
  account: {
    status: "active",
    accountType: "adult_student",
    firstName: "Alvaro",
    email: "alvaro@example.com",
    preferredLanguage: "es",
  },
  result: {
    status: "provisional",
    recommendedLevelKey: "book-2-entry",
    recommendedLevelLabel: "Nivel 2 · Intermedio",
    answeredQuestionCount: 56,
    skippedQuestionCount: 6,
    advisorConfirmationRequired: true,
    goal: "Trabajo",
    completedAt: "2026-07-30T22:00:00.000Z",
  },
  advisor: {
    requested: false,
  },
  practice: {
    eligible: false,
    reason: "feature_not_approved",
  },
};

describe("MIS-341 authenticated portal view model", () => {
  it("builds a safe, action-first student dashboard", () => {
    const model = createAuthenticatedPortalViewModel(snapshot, { welcome: true });

    assert.equal(model.state, "ready");
    assert.equal(model.welcome, true);
    assert.equal(model.account.firstName, "Alvaro");
    assert.equal(model.result.recommendedLevelLabel, "Nivel 2 · Intermedio");
    assert.equal(model.course.eyebrow, "Inglés intermedio");
    assert.deepEqual(
      model.navigation.map((item) => item.label),
      ["Inicio", "Mi nivel", "Mis cursos", "Asistencia", "Estudiar", "Cuenta"],
    );
    assert.deepEqual(
      model.navigation.map((item) => item.href),
      ["/portal/", "/portal/results/", "/portal/courses/", "/portal/attendance/", "/portal/study/", "/portal/account/"],
    );
  });

  it("keeps unfinished Study Buddy explicit instead of looking broken", () => {
    const model = createAuthenticatedPortalViewModel(snapshot);

    assert.equal(model.practice.eligible, false);
    assert.equal(model.practice.status, "pending");
    assert.equal(
      model.practice.headline,
      "La práctica guiada todavía no está disponible",
    );
    assert.equal(model.practice.href, "#resultado");
    assert.match(model.practice.statusLabel, /todavía no está disponible/);
  });

  it("preserves distinct guardian and provider recovery states", () => {
    const guardian = createAuthenticatedPortalViewModel({
      ...snapshot,
      practice: { eligible: false, reason: "guardian_required" },
    });
    const provider = createAuthenticatedPortalViewModel({
      ...snapshot,
      practice: { eligible: false, reason: "provider_unavailable" },
    });

    assert.equal(guardian.practice.status, "locked");
    assert.match(guardian.practice.headline, /adulto responsable/i);
    assert.equal(provider.practice.status, "unavailable");
    assert.match(provider.practice.summary, /no necesitas repetir/i);
  });

  it("exposes only the linked child's minimal profile, receipt, and separate permissions", () => {
    const model = createAuthenticatedPortalViewModel({
      ...snapshot,
      account: { ...snapshot.account, accountType: "guardian" },
      guardianChild: {
        id: "00000000-0000-4000-8000-000000000099",
        firstName: "Luis",
        status: "active",
        receiptCode: "AIT-G-fixture",
        policyVersion: "guardian-v1",
        permissions: { aiPracticeApproved: true, advisorContactApproved: false },
        dateOfBirth: "must-not-pass",
        childEmail: "must-not-pass",
      },
    });
    assert.deepEqual(model.guardianChild, {
      id: "00000000-0000-4000-8000-000000000099",
      firstName: "Luis",
      status: "active",
      receiptCode: "AIT-G-fixture",
      policyVersion: "guardian-v1",
      permissions: {
        aiPracticeApproved: true,
        advisorContactApproved: false,
         marketingSmsOptIn: false,
       },
       contactPreference: null,
     });
    assert.equal(JSON.stringify(model.guardianChild).includes("must-not-pass"), false);
  });

  it("unlocks the bounded five-turn practice action from server eligibility", () => {
    const model = createAuthenticatedPortalViewModel({
      ...snapshot,
      practice: {
        eligible: true,
        status: "ready",
        scenarioKey: "introductions",
      },
    });

    assert.equal(model.practice.eligible, true);
    assert.equal(model.practice.durationLabel, "3–5 min");
    assert.equal(model.practice.turnLabel, "5 turnos");
    assert.equal(model.practice.href, "/portal/study/");
  });

  it("fails closed when the server omits or malforms practice eligibility", () => {
    const omitted = createAuthenticatedPortalViewModel({
      ...snapshot,
      practice: undefined,
    });
    const malformed = createAuthenticatedPortalViewModel({
      ...snapshot,
      practice: {},
    });

    assert.equal(omitted.practice.eligible, false);
    assert.equal(malformed.practice.eligible, false);
    assert.equal(omitted.practice.status, "unavailable");
    assert.notEqual(omitted.practice.href, "/portal/study/");
  });

  it("does not fabricate enrollment or practice history", () => {
    const model = createAuthenticatedPortalViewModel(snapshot);

    assert.equal(model.enrollment.active, false);
    assert.match(model.enrollment.title, /no vemos un curso activo/i);
    assert.deepEqual(model.recentPractice, []);
  });

  it("does not fabricate a basic course without a result or recognized level", () => {
    const withoutResult = createAuthenticatedPortalViewModel({
      ...snapshot,
      result: null,
    });
    const unknownLevel = createAuthenticatedPortalViewModel({
      ...snapshot,
      result: { ...snapshot.result, recommendedLevelKey: "pending-review" },
    });

    assert.equal(withoutResult.course, null);
    assert.equal(unknownLevel.course, null);
  });

  it("returns a recovery-first signed-out model", () => {
    const model = createPortalAccessViewModel("portal_session_invalid");

    assert.equal(model.state, "signed_out");
    assert.match(model.title, /Vuelve a entrar/);
    assert.equal(model.actionHref, "/portal/sign-in/");
  });

  it("distinguishes an auth outage from an expired session", () => {
    const model = createPortalAccessViewModel("identity_provider_unavailable");

    assert.equal(model.state, "unavailable");
    assert.match(model.title, /información sigue segura/i);
    assert.equal(model.actionHref, "/portal/");
  });

  it("rejects inactive or browser-shaped snapshots", () => {
    assert.throws(
      () =>
        createAuthenticatedPortalViewModel({
          account: {
            status: "locked",
            firstName: "Blocked",
          },
        }),
      /active_portal_snapshot_required/,
    );
  });
});
