import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  LEARNING_CONTENT_TYPES,
  buildLessonProgressCrmPreview,
  getLearningLibraryForStudent,
  getPortalLearningResponse,
} from "../src/learning/learningContentModel.js";
import { resolvePortalSession } from "../src/portal/authBoundary.js";

describe("MIS-274 learning content model", () => {
  it("defines the expected content taxonomy", () => {
    assert.deepEqual(LEARNING_CONTENT_TYPES, [
      "lesson_recap",
      "video_module",
      "handout_link",
      "homework",
    ]);
  });

  it("returns published modules for enrolled students and excludes drafts", () => {
    const modules = getLearningLibraryForStudent("crm_contact_fixture_student_001");

    assert.equal(modules.length, 1);
    assert.equal(modules[0].status, "published");
    assert.equal(modules[0].content.length, 4);
    assert.equal(
      modules.some((module) => module.moduleRef.includes("draft")),
      false,
    );
  });

  it("blocks learning access when the privacy gate is not satisfied", () => {
    const response = getPortalLearningResponse(
      "studentActive",
      "crm_contact_fixture_student_001",
    );

    assert.equal(response.status, 403);
    assert.equal(response.body.reason, "privacy_gate_required");
  });

  it("allows a guardian to view linked student learning modules", () => {
    const response = getPortalLearningResponse(
      "guardianActive",
      "crm_contact_fixture_minor_001",
    );

    assert.equal(response.status, 200);
    assert.equal(response.body.modules[0].content[0].type, "lesson_recap");
    assert.equal(response.body.durableProgressStorage, false);
  });

  it("builds a CRM-safe lesson progress preview without writing to CRM", () => {
    const session = resolvePortalSession("guardianActive");
    const module = getLearningLibraryForStudent("crm_contact_fixture_minor_001")[0];
    const preview = buildLessonProgressCrmPreview({
      session,
      studentCrmContactRef: "crm_contact_fixture_minor_001",
      module,
      content: module.content[0],
      progressState: "completed",
    });

    assert.equal(preview.accepted, true);
    assert.equal(preview.delivery.crmWrite, false);
    assert.equal(preview.crmTimelinePreview.eventType, "lesson_completed");
    assert.equal(preview.event.payload.retentionClass, "student_record_3y");
  });
});
