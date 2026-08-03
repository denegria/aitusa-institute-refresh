import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  createPracticeExperienceModel,
  recoveryForStudyBuddyCode,
  toPortalPracticeState,
} from "../src/aiStudyBuddy/practiceExperience.js";
import {
  normalizePracticeLevel,
  resolvePracticePlan,
} from "../src/aiStudyBuddy/practicePlan.js";

describe("MIS-342 personalized Study Buddy experience", () => {
  it("normalizes real diagnostic block keys into server-owned practice plans", () => {
    assert.equal(normalizePracticeLevel("book-1-entry"), "basic");
    assert.equal(normalizePracticeLevel("book-2-entry"), "intermediate");
    assert.equal(normalizePracticeLevel("book-3-entry"), "advanced");
    assert.equal(normalizePracticeLevel("pending-review"), null);
    assert.deepEqual(resolvePracticePlan({ recommendedLevelKey: "book-2-entry" }), {
      scenario: "workplace_exchange",
      useCase: "conversation_roleplay",
      version: "mis-340-plan-v1",
    });
  });

  it("creates one authored five-turn mission from the saved diagnostic", () => {
    const model = createPracticeExperienceModel({
      result: {
        recommendedLevelKey: "book-2-entry",
        recommendedLevelLabel: "Nivel 2 · Intermedio",
        goal: "Trabajo",
      },
      eligibility: { code: "authenticated" },
    });

    assert.equal(model.state, "ready");
    assert.equal(model.levelLabel, "Nivel 2 · Intermedio");
    assert.equal(model.goalLabel, "Trabajo");
    assert.equal(model.mission.scenario, "workplace_exchange");
    assert.equal(model.mission.prompts.length, 5);
    assert.deepEqual(model.mission.prompts.map((prompt) => prompt.turn), [1, 2, 3, 4, 5]);
    assert.equal(JSON.stringify(model).match(/provider|model selection|accountId|prompt override/i), null);
  });

  it("keeps guardian, provider, limit, and consumed states explicit and recoverable", () => {
    for (const code of [
      "guardian_unresolved",
      "provider_unavailable",
      "provider_disabled",
      "daily_limit_reached",
      "session_limit_reached",
      "trial_consumed",
    ]) {
      const model = createPracticeExperienceModel({
        result: { recommendedLevelKey: "basic" },
        eligibility: { code },
      });
      assert.equal(model.state, "blocked");
      assert.ok(model.recovery.title);
      assert.ok(model.recovery.summary);
      assert.match(model.recovery.actionHref, /^\//);
    }
    assert.match(recoveryForStudyBuddyCode("provider_unavailable").summary, /audio o texto/i);
  });

  it("maps only safe server eligibility into the Portal action", () => {
    assert.deepEqual(
      toPortalPracticeState(
        { code: "authenticated" },
        { recommendedLevelKey: "book-3-entry" },
      ),
      {
        eligible: true,
        status: "ready",
        scenarioKey: "guided_discussion",
        headline: "Expresa y matiza una opinión",
        summary: "Presenta una idea, apóyala y reconoce otra perspectiva.",
      },
    );
    assert.equal(
      toPortalPracticeState({ code: "guardian_unresolved" }, {}).reason,
      "guardian_required",
    );
    assert.equal(
      toPortalPracticeState({ code: "provider_disabled" }, {}).reason,
      "provider_unavailable",
    );
  });

  it("does not persist learner audio/text or expose provider controls in the browser", () => {
    const source = readFileSync(
      new URL("../app/portal/study/StudyBuddyExperience.jsx", import.meta.url),
      "utf8",
    );
    assert.doesNotMatch(source, /localStorage|sessionStorage|indexedDB|sendBeacon|analytics/i);
    assert.doesNotMatch(source, /accountId|resultId|providerProfile|model:/i);
    assert.match(source, /chunksRef\.current = \[\]/);
    assert.match(source, /track\.stop\(\)/);
  });

  it("uses the approved AIT identity instead of a separate Study Buddy brand", () => {
    const source = readFileSync(
      new URL("../app/portal/study/StudyBuddyExperience.jsx", import.meta.url),
      "utf8",
    );
    const styles = readFileSync(
      new URL("../app/portal/study/StudyBuddyExperience.module.css", import.meta.url),
      "utf8",
    );

    assert.match(source, /076-solo-logo-4-x-4-clases1\.png/);
    assert.match(source, /<strong>AIT USA<\/strong>/);
    assert.match(source, /<small>Study Buddy<\/small>/);
    assert.match(styles, /Plus Jakarta Sans/);
    assert.match(styles, /--study-navy-950: #001a3d/);
    assert.match(styles, /--study-blue: #8a6412/);
    assert.match(styles, /--study-gold: #c4932d/);
    assert.match(styles, /--study-canvas: #f7f2e8/);
    assert.doesNotMatch(styles, /#2c5cff/);
    assert.doesNotMatch(styles, /#1748bd|rgba\(60, 103, 255|rgba\(74, 114, 255/);
    assert.doesNotMatch(styles, /Georgia|Times New Roman/);
  });
});
