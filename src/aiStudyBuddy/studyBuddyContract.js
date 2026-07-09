import { buildCrmEventResponse, toCrmTimelineSummary, validateCrmEventEnvelope } from "../crm/eventContract.js";
import { evaluatePrivacyGate } from "../privacy/privacyPolicy.js";
import {
  canAccessArea,
  canViewStudentReference,
  resolvePortalSession,
} from "../portal/authBoundary.js";

export const AI_STUDY_BUDDY_USE_CASES = Object.freeze({
  pronunciation_drill: Object.freeze({
    label: "Pronunciation drill",
    mode: "speech_practice",
    escalationThreshold: "repeated_mispronunciation",
  }),
  conversation_roleplay: Object.freeze({
    label: "Conversation roleplay",
    mode: "conversation",
    escalationThreshold: "student_confused",
  }),
  lesson_review: Object.freeze({
    label: "Lesson review",
    mode: "lesson_support",
    escalationThreshold: "low_score",
  }),
  vocabulary_quiz: Object.freeze({
    label: "Vocabulary quiz",
    mode: "quiz",
    escalationThreshold: "low_score",
  }),
});

export const AI_PROVIDER_GATE = Object.freeze({
  browserProviderCallsAllowed: false,
  serverProviderCallsAllowed: false,
  providerDecisionRequired: true,
  rawAudioStorageAllowed: false,
  rawTranscriptStorageAllowed: false,
  backendBoundary: "/api/portal/ai-study-buddy",
});

export const AI_COST_CONTROLS = Object.freeze({
  dailySessionLimit: 2,
  maxTurnsPerSession: 8,
  maxEstimatedCentsPerSession: 0,
  hardStopUntilProviderApproval: true,
});

export const AI_ESCALATION_REASONS = Object.freeze([
  "low_score",
  "repeated_mispronunciation",
  "student_confused",
  "safety_concern",
  "teacher_requested",
]);

export function evaluateAiPracticeRequest({
  useCase,
  actor = {},
  consent = {},
  requestedRetention = {},
}) {
  if (!AI_STUDY_BUDDY_USE_CASES[useCase]) {
    return denied("unsupported_use_case");
  }

  const summaryGate = evaluatePrivacyGate({
    category: "ai_practice_summary",
    actor,
    consent,
  });
  if (!summaryGate.allowed) return denied(summaryGate.reason);

  if (requestedRetention.rawAudio === true) {
    return denied("raw_audio_storage_not_approved");
  }

  if (requestedRetention.rawTranscript === true) {
    return denied("raw_transcript_storage_not_approved");
  }

  if (AI_PROVIDER_GATE.providerDecisionRequired) {
    return denied("provider_decision_required");
  }

  return {
    allowed: true,
    useCase: AI_STUDY_BUDDY_USE_CASES[useCase],
  };
}

export function getAiStudyBuddyPlan({
  accountKey = "studentActive",
  studentCrmContactRef = "crm_contact_fixture_student_001",
  useCase = "lesson_review",
} = {}) {
  const session = resolvePortalSession(accountKey);
  const areaAccess = canAccessArea(session, "ai_practice");
  const studentAccess = canViewStudentReference(session, studentCrmContactRef);
  const requestGate = evaluateAiPracticeRequest({
    useCase,
    actor: { ageGroup: "adult" },
    consent: { basis: "explicit", guardianApproval: true },
  });

  const available =
    areaAccess.allowed === true &&
    studentAccess.allowed === true &&
    requestGate.allowed === true;

  return {
    ok: true,
    practiceAvailable: available,
    blockedReasons: [
      areaAccess.allowed ? null : areaAccess.reason,
      studentAccess.allowed ? null : studentAccess.reason,
      requestGate.allowed ? null : requestGate.reason,
    ].filter(Boolean),
    selectedUseCase: AI_STUDY_BUDDY_USE_CASES[useCase] ?? null,
    providerGate: AI_PROVIDER_GATE,
    costControls: AI_COST_CONTROLS,
    escalationReasons: AI_ESCALATION_REASONS,
    crmSummaryPreview: buildAiPracticeCrmSummaryPreview({
      session,
      studentCrmContactRef,
      useCase,
      progressState: "started",
    }),
    rawAudioStorage: false,
    rawTranscriptStorage: false,
  };
}

export function buildAiPracticeCrmSummaryPreview({
  session,
  studentCrmContactRef,
  useCase,
  progressState = "started",
}) {
  if (session.state !== "authenticated") {
    return {
      accepted: false,
      reason: session.reason ?? "not_authenticated",
      crmWrite: false,
    };
  }

  const eventType =
    progressState === "completed" ? "ai_practice_completed" : "ai_practice_started";
  const envelope = {
    type: eventType,
    idempotencyKey: `ai:${studentCrmContactRef}:${useCase}:${progressState}:fixture`,
    occurredAt: "2026-07-09T00:00:00.000Z",
    actor: {
      crmContactRef: studentCrmContactRef,
      portalAccountId: session.account.portalAccountId,
      role: session.account.roles[0],
    },
    source: {
      surface: "portal",
      path: "/portal/ai-study-buddy",
    },
    consent: {
      basis: "explicit",
      policyVersion: "fixture-v1",
    },
    payload: {
      summary: `${AI_STUDY_BUDDY_USE_CASES[useCase]?.label ?? useCase} ${progressState}`,
      useCase,
      progressState,
      escalationNeeded: false,
      rawAudioStored: false,
      rawTranscriptStored: false,
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

function denied(reason) {
  return {
    allowed: false,
    reason,
  };
}
