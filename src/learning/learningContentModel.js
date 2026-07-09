import { ATTENDANCE_FIXTURES } from "../attendance/attendanceFixtures.js";
import { buildCrmEventResponse, toCrmTimelineSummary, validateCrmEventEnvelope } from "../crm/eventContract.js";
import { evaluatePrivacyGate } from "../privacy/privacyPolicy.js";
import {
  canAccessArea,
  canViewStudentReference,
  resolvePortalSession,
} from "../portal/authBoundary.js";
import { LEARNING_CONTENT_TYPES, LEARNING_FIXTURES } from "./learningFixtures.js";

export { LEARNING_CONTENT_TYPES };

export function getLearningLibraryForStudent(
  studentCrmContactRef,
  fixtures = LEARNING_FIXTURES,
  attendanceFixtures = ATTENDANCE_FIXTURES,
) {
  const enrollments = attendanceFixtures.enrollments.filter(
    (enrollment) =>
      enrollment.studentCrmContactRef === studentCrmContactRef &&
      enrollment.status === "active",
  );
  const sectionRefs = new Set(enrollments.map((enrollment) => enrollment.sectionRef));

  return fixtures.modules
    .filter((module) => module.status === "published")
    .filter((module) => sectionRefs.has(module.sectionRef))
    .map((module) => ({
      moduleRef: module.moduleRef,
      courseRef: module.courseRef,
      sectionRef: module.sectionRef,
      sessionRef: module.sessionRef,
      title: module.title,
      status: module.status,
      publishedAt: module.publishedAt,
      content: module.content.map(toSafeContentItem),
    }));
}

export function getPortalLearningResponse(accountKey, studentCrmContactRef) {
  const session = resolvePortalSession(accountKey);
  const learningAccess = canAccessArea(session, "lesson_progress");
  if (!learningAccess.allowed) return denied(403, learningAccess.reason);

  const studentAccess = canViewStudentReference(session, studentCrmContactRef);
  if (!studentAccess.allowed) return denied(403, studentAccess.reason);

  const modules = getLearningLibraryForStudent(studentCrmContactRef);
  const firstContent = modules[0]?.content[0] ?? null;

  return {
    status: 200,
    body: {
      ok: true,
      visibility: studentAccess.visibility,
      studentCrmContactRef,
      modules,
      progressPreview: firstContent
        ? buildLessonProgressCrmPreview({
            session,
            studentCrmContactRef,
            module: modules[0],
            content: firstContent,
            progressState: "viewed",
          })
        : null,
      durableProgressStorage: false,
    },
  };
}

export function buildLessonProgressCrmPreview({
  session,
  studentCrmContactRef,
  module,
  content,
  progressState = "viewed",
}) {
  const privacy = evaluatePrivacyGate({
    category: "lesson_progress_summary",
    actor: { ageGroup: "adult" },
    consent: { basis: "contract" },
  });
  if (!privacy.allowed) {
    return {
      accepted: false,
      reason: privacy.reason,
      crmWrite: false,
    };
  }

  const eventType = progressState === "completed" ? "lesson_completed" : "lesson_viewed";
  const occurredAt = "2026-07-09T00:00:00.000Z";
  const envelope = {
    type: eventType,
    idempotencyKey: `lesson:${content.contentRef}:${progressState}:fixture`,
    occurredAt,
    actor: {
      crmContactRef: studentCrmContactRef,
      portalAccountId: session.account.portalAccountId,
      role: session.account.roles[0],
    },
    source: {
      surface: "portal",
      path: "/portal/learning",
    },
    consent: {
      basis: "contract",
      policyVersion: "fixture-v1",
    },
    payload: {
      summary: `${content.title} ${progressState}`,
      moduleRef: module.moduleRef,
      contentRef: content.contentRef,
      contentType: content.type,
      progressState,
      retentionClass: privacy.retentionClass,
    },
  };

  const response = buildCrmEventResponse(envelope);
  if (!response.body.accepted) return response.body;

  const validation = validateCrmEventEnvelope(envelope);
  return {
    ...response.body,
    crmTimelinePreview: toCrmTimelineSummary(validation.event),
  };
}

function toSafeContentItem(item) {
  return {
    contentRef: item.contentRef,
    type: item.type,
    title: item.title,
    summary: item.summary,
    estimatedMinutes: item.estimatedMinutes,
    href: item.href,
    videoRef: item.videoRef,
    dueAt: item.dueAt,
  };
}

function denied(status, reason) {
  return {
    status,
    body: {
      ok: false,
      reason,
      durableProgressStorage: false,
      crmWrite: false,
    },
  };
}
