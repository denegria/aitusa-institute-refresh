import { createHash } from "node:crypto";
import {
  buildCrmEventResponse,
  toCrmTimelineSummary,
  validateCrmEventEnvelope,
} from "../crm/eventContract.js";

export const PLACEMENT_TEST_CONTRACT = Object.freeze({
  sourceKey: "aitusa-placement-test-v1",
  sourceName: "AIT USA Placement Test",
  crmWrite: false,
  storageEnabled: false,
  advisorConfirmationRequired: true,
  whatsappNumber: "+1 732-379-0593",
  whatsappHref: "https://wa.me/17323790593",
});

export const PLACEMENT_SELF_ASSESSMENTS = Object.freeze([
  "speaking",
  "listening",
  "reading",
  "writing",
]);

export const PLACEMENT_QUIZ_QUESTION_COUNT = 62;

export const PLACEMENT_RECOMMENDATIONS = Object.freeze([
  Object.freeze({
    key: "foundation",
    min: 0,
    max: 12,
    level: "Nivel inicial / Book 1 base",
    copy:
      "Te conviene empezar con una ruta base enfocada en comprension, frases utiles y practica guiada.",
    bestFit: "Ingles presencial o hibrido para construir confianza desde cero.",
  }),
  Object.freeze({
    key: "book-1-bridge",
    min: 13,
    max: 23,
    level: "Book 1 alto / Basico funcional",
    copy:
      "Ya tienes algunas bases y puedes avanzar con correccion en vivo, estructura visual y practica semanal.",
    bestFit: "Ingles presencial, hibrido u online segun tu agenda y ubicacion.",
  }),
  Object.freeze({
    key: "book-2-entry",
    min: 24,
    max: 34,
    level: "Book 2 inicial / Intermedio bajo",
    copy:
      "Puedes trabajar estructuras de pasado, comparaciones y comunicacion cotidiana con mas continuidad.",
    bestFit:
      "Ruta conversacional con confirmacion de nivel antes de cerrar horario o inscripcion.",
  }),
  Object.freeze({
    key: "book-2-upper",
    min: 35,
    max: 45,
    level: "Book 2 alto / Intermedio",
    copy:
      "Tienes base para una clase con mas conversacion, correccion puntual y objetivos especificos.",
    bestFit:
      "Grupo intermedio presencial, hibrido u online segun disponibilidad y meta principal.",
  }),
  Object.freeze({
    key: "book-3-entry",
    min: 46,
    max: 56,
    level: "Book 3 inicial / Intermedio alto",
    copy:
      "Puedes practicar estructuras mas avanzadas, fluidez, escritura corta y situaciones de trabajo o estudio.",
    bestFit:
      "Ruta intermedia alta con practica oral y confirmacion academica antes de inscripcion final.",
  }),
  Object.freeze({
    key: "book-3-upper",
    min: 57,
    max: 65,
    level: "Book 3 alto / Avanzado orientativo",
    copy:
      "Tu resultado sugiere una ruta avanzada o de objetivos especificos, sujeta a entrevista o revision de escritura.",
    bestFit:
      "Ruta conversacional, online o presencial, segun disponibilidad y meta principal.",
  }),
]);

const REQUIRED_STUDENT_FIELDS = ["name", "phone", "email", "city", "ageGroup"];

export function getPlacementTestConfig() {
  return {
    contract: PLACEMENT_TEST_CONTRACT,
    selfAssessments: PLACEMENT_SELF_ASSESSMENTS,
    quizQuestionCount: PLACEMENT_QUIZ_QUESTION_COUNT,
    source: {
      title: "PLACEMENT EXAM (EXAMEN DE NIVELACION) COMMUNICATIVE ENGLISH",
      legacyLevels: 6,
      freeWritingIncluded: true,
      gradingMode: "automatic_provisional",
      answerKeyStatus: "pending_academic_review",
      note:
        "Las preguntas vienen del cuestionario legado. La calificacion automatica es orientativa hasta que AIT confirme la llave academica final.",
    },
    recommendations: PLACEMENT_RECOMMENDATIONS,
    crmWrite: false,
  };
}

export function evaluatePlacementTestSubmission(input = {}) {
  const validation = validatePlacementInput(input);
  if (!validation.ok) {
    return {
      status: 422,
      body: {
        ok: false,
        errors: validation.errors,
        crmWrite: false,
      },
    };
  }

  const submittedAt = input.submittedAt ?? new Date().toISOString();
  const scores = calculatePlacementScore(input);
  const recommendation = selectPlacementRecommendation(scores.totalScore);
  const advisorMessage = buildAdvisorHandoffMessage({
    student: input.student,
    goal: input.goal,
    recommendation,
    scores,
  });
  const crmPayloadPreview = buildPlacementCrmPayloadPreview({
    input,
    recommendation,
    scores,
    submittedAt,
  });
  const crmSyncPreview = buildPlacementCrmSyncPreview({
    input,
    recommendation,
    scores,
    submittedAt,
    crmPayloadPreview,
  });

  return {
    status: 200,
    body: {
      ok: true,
      recommendation,
      scores,
      advisorHandoff: {
        channel: "whatsapp",
        label: "Enviar resultado por WhatsApp",
        message: advisorMessage,
        href: `${PLACEMENT_TEST_CONTRACT.whatsappHref}?text=${encodeURIComponent(advisorMessage)}`,
        confirmationRequired: true,
      },
      crmPayloadPreview,
      crmSyncPreview,
      crmWrite: false,
      storageEnabled: false,
    },
  };
}

export function calculatePlacementScore(input) {
  const quizScore = input.quizAnswers.reduce((total, value) => total + Number(value), 0);
  const selfAssessmentScore = PLACEMENT_SELF_ASSESSMENTS.reduce(
    (total, key) => total + Number(input.selfAssessment[key]),
    0,
  );
  const selfAssessmentAverage = Math.round(
    selfAssessmentScore / PLACEMENT_SELF_ASSESSMENTS.length,
  );

  return {
    quizScore,
    quizQuestionCount: PLACEMENT_QUIZ_QUESTION_COUNT,
    selfAssessmentScore,
    selfAssessmentAverage,
    totalScore: quizScore + selfAssessmentAverage,
    maxScore: PLACEMENT_QUIZ_QUESTION_COUNT + 3,
    gradingMode: "automatic_provisional",
    answerKeyStatus: "pending_academic_review",
  };
}

export function selectPlacementRecommendation(totalScore) {
  return (
    PLACEMENT_RECOMMENDATIONS.find(
      (recommendation) =>
        totalScore >= recommendation.min && totalScore <= recommendation.max,
    ) ?? PLACEMENT_RECOMMENDATIONS[0]
  );
}

export function buildAdvisorHandoffMessage({
  student,
  goal,
  recommendation,
  scores,
}) {
  return [
    "Hola AIT USA, ya complete el examen de ubicacion.",
    `Nombre: ${student.name}`,
    `Ciudad/Pais: ${student.city}`,
    `WhatsApp/telefono: ${student.phone}`,
    `Email: ${student.email}`,
    `Grupo de edad: ${student.ageGroup}`,
    `Objetivo: ${goal}`,
    `Resultado sugerido: ${recommendation.level}`,
    `Puntaje orientativo: ${scores.totalScore}`,
    `Detalle: ${recommendation.copy}`,
    "Quiero confirmar esta recomendacion con un asesor.",
  ].join("\n");
}

export function buildPlacementCrmPayloadPreview({
  input,
  recommendation,
  scores,
  submittedAt,
}) {
  return {
    sourceKey: PLACEMENT_TEST_CONTRACT.sourceKey,
    sourceName: PLACEMENT_TEST_CONTRACT.sourceName,
    sourcePath: "/placement-test",
    submittedAt,
    crmWrite: false,
    storageEnabled: false,
    contactFieldsProvided: {
      name: Boolean(input.student.name),
      phone: Boolean(input.student.phone),
      email: Boolean(input.student.email),
      city: Boolean(input.student.city),
      ageGroup: Boolean(input.student.ageGroup),
    },
    placement: {
      goal: input.goal,
      totalScore: scores.totalScore,
      quizScore: scores.quizScore,
      quizQuestionCount: scores.quizQuestionCount,
      selfAssessmentAverage: scores.selfAssessmentAverage,
      recommendationKey: recommendation.key,
      recommendationLevel: recommendation.level,
      advisorConfirmationRequired: true,
      gradingMode: scores.gradingMode,
      answerKeyStatus: scores.answerKeyStatus,
    },
    consent: {
      advisorHandoff: input.consent.advisorHandoff === true,
      crmStorageApproved: false,
    },
  };
}

export function buildPlacementCrmSyncPreview({
  input,
  recommendation,
  scores,
  submittedAt,
  crmPayloadPreview,
}) {
  const fingerprint = createSubmissionFingerprint(input);
  const envelope = {
    type: "placement_completed",
    idempotencyKey: `public:placement:${fingerprint}:${submittedAt.slice(0, 10)}`,
    occurredAt: submittedAt,
    actor: {
      anonymousId: `placement_${fingerprint}`,
    },
    source: {
      surface: "public_site",
      path: "/placement-test",
    },
    consent: {
      basis: "explicit",
      policyVersion: "placement-static-v1",
    },
    payload: {
      summary: `Placement test completed: ${recommendation.level}`,
      sourceKey: PLACEMENT_TEST_CONTRACT.sourceKey,
      recommendationKey: recommendation.key,
      recommendationLevel: recommendation.level,
      totalScore: scores.totalScore,
      goal: input.goal,
      gradingMode: scores.gradingMode,
      answerKeyStatus: scores.answerKeyStatus,
      contactFieldsProvided: crmPayloadPreview.contactFieldsProvided,
      advisorConfirmationRequired: true,
      crmStorageApproved: false,
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

export function validatePlacementInput(input = {}) {
  const errors = [];

  if (!isRecord(input.student)) {
    errors.push("student_required");
  } else {
    for (const field of REQUIRED_STUDENT_FIELDS) {
      if (!isNonEmptyString(input.student[field])) {
        errors.push(`student_${field}_required`);
      }
    }
  }

  if (!isRecord(input.selfAssessment)) {
    errors.push("self_assessment_required");
  } else {
    for (const key of PLACEMENT_SELF_ASSESSMENTS) {
      if (!isScoreValue(input.selfAssessment[key])) {
        errors.push(`self_assessment_${key}_invalid`);
      }
    }
  }

  if (!Array.isArray(input.quizAnswers)) {
    errors.push("quiz_answers_required");
  } else if (input.quizAnswers.length !== PLACEMENT_QUIZ_QUESTION_COUNT) {
    errors.push("quiz_answers_count_invalid");
  } else {
    input.quizAnswers.forEach((value, index) => {
      if (!isQuizScoreValue(value)) {
        errors.push(`quiz_answer_${index}_invalid`);
      }
    });
  }

  if (!isNonEmptyString(input.goal)) {
    errors.push("goal_required");
  }

  if (input.consent?.advisorHandoff !== true) {
    errors.push("advisor_handoff_consent_required");
  }

  if (input.submittedAt && Number.isNaN(Date.parse(input.submittedAt))) {
    errors.push("submitted_at_invalid");
  }

  return errors.length === 0 ? { ok: true } : { ok: false, errors };
}

function createSubmissionFingerprint(input) {
  return createHash("sha256")
    .update(
      [
        input.student?.name,
        input.student?.phone,
        input.student?.email,
        input.student?.city,
        input.goal,
      ].join("|"),
    )
    .digest("hex")
    .slice(0, 20);
}

function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isScoreValue(value) {
  const number = Number(value);
  return Number.isInteger(number) && number >= 0 && number <= 3;
}

function isQuizScoreValue(value) {
  const number = Number(value);
  return Number.isInteger(number) && number >= 0 && number <= 1;
}
