import { createHash } from "node:crypto";
import {
  buildCrmEventResponse,
  toCrmTimelineSummary,
  validateCrmEventEnvelope,
} from "../crm/eventContract.js";
import { DIAGNOSTIC_VERSIONS } from "../diagnostic/contract.js";
import {
  DIAGNOSTIC_QUESTION_BANK,
  scoreSelectedAnswers,
} from "../diagnostic/questionBank.server.js";

export const PLACEMENT_TEST_CONTRACT = Object.freeze({
  sourceKey: "aitusa-placement-test-v2-preview",
  sourceName: "AIT USA Placement Diagnostic",
  productContractVersion: DIAGNOSTIC_VERSIONS.productContract,
  questionBankVersion: DIAGNOSTIC_VERSIONS.questionBank,
  answerKeyVersion: DIAGNOSTIC_VERSIONS.answerKey,
  levelMapVersion: DIAGNOSTIC_VERSIONS.levelMap,
  scoringContractVersion: DIAGNOSTIC_VERSIONS.scoring,
  resultCopyVersion: DIAGNOSTIC_VERSIONS.resultCopy,
  crmWrite: false,
  storageEnabled: true,
  anonymousResultEnabled: true,
  durableResumeEnabled: true,
  durableResumeEligibility: "age_13_plus_only",
  advisorConfirmationRequired: true,
  guardianRequiredUnderAge: 13,
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
export const PLACEMENT_BLOCK_PASS_RATE = 0.7;
export const PLACEMENT_WRITING_REVIEW_MODE = "advisor_only";

export const PLACEMENT_LEVEL_BLOCKS = Object.freeze([
  Object.freeze({ key: "level-1", label: "Level 1", book: "Book 1", start: 0, count: 12, passCount: 9 }),
  Object.freeze({ key: "level-2", label: "Level 2", book: "Book 1", start: 12, count: 13, passCount: 10 }),
  Object.freeze({ key: "level-3", label: "Level 3", book: "Book 2", start: 25, count: 10, passCount: 7 }),
  Object.freeze({ key: "level-4", label: "Level 4", book: "Book 2", start: 35, count: 7, passCount: 5 }),
  Object.freeze({ key: "level-5", label: "Level 5", book: "Book 3", start: 42, count: 8, passCount: 6 }),
  Object.freeze({ key: "level-6", label: "Level 6", book: "Book 3", start: 50, count: 12, passCount: 9 }),
]);

let expectedBlockStart = 0;
for (const block of PLACEMENT_LEVEL_BLOCKS) {
  if (
    block.start !== expectedBlockStart ||
    block.passCount !== Math.ceil(block.count * PLACEMENT_BLOCK_PASS_RATE)
  ) {
    throw new Error(`placement_level_block_contract_invalid:${block.key}`);
  }
  expectedBlockStart += block.count;
}
if (expectedBlockStart !== PLACEMENT_QUIZ_QUESTION_COUNT) {
  throw new Error("placement_level_block_coverage_invalid");
}

export const PLACEMENT_RECOMMENDATIONS = Object.freeze([
  Object.freeze({
    key: "foundation",
    level: "Nivel 1 / Book 1 base",
    copy:
      "Te conviene empezar con una ruta base enfocada en comprensión, frases útiles y práctica guiada.",
    bestFit: "Inglés presencial u online para construir confianza desde cero.",
  }),
  Object.freeze({
    key: "book-1-bridge",
    level: "Nivel 2 / Book 1 alto",
    copy:
      "Ya tienes algunas bases y puedes avanzar con corrección en vivo, estructura visual y práctica semanal.",
    bestFit: "Inglés presencial u online según tu agenda y ubicación.",
  }),
  Object.freeze({
    key: "book-2-entry",
    level: "Nivel 3 / Book 2 inicial",
    copy:
      "Puedes trabajar estructuras de pasado, comparaciones y comunicación cotidiana con más continuidad.",
    bestFit:
      "Ruta conversacional con confirmación de nivel antes de cerrar horario o inscripción.",
  }),
  Object.freeze({
    key: "book-2-upper",
    level: "Nivel 4 / Book 2 alto",
    copy:
      "Tienes base para una clase con más conversación, corrección puntual y objetivos específicos.",
    bestFit:
      "Grupo intermedio presencial u online según disponibilidad y meta principal.",
  }),
  Object.freeze({
    key: "book-3-entry",
    level: "Nivel 5 / Book 3 inicial",
    copy:
      "Puedes practicar estructuras más avanzadas, fluidez, escritura corta y situaciones de trabajo o estudio.",
    bestFit:
      "Ruta intermedia alta con práctica oral y confirmación académica antes de inscripción final.",
  }),
  Object.freeze({
    key: "book-3-upper",
    level: "Nivel 6 / Book 3 alto",
    copy:
      "Tu resultado sugiere una ruta avanzada o de objetivos específicos, sujeta a entrevista o revisión de escritura.",
    bestFit:
      "Ruta conversacional, online o presencial, según disponibilidad y meta principal.",
  }),
]);

export function getPlacementTestConfig() {
  return {
    contract: PLACEMENT_TEST_CONTRACT,
    selfAssessments: PLACEMENT_SELF_ASSESSMENTS,
    quizQuestionCount: PLACEMENT_QUIZ_QUESTION_COUNT,
    source: {
      title: "PLACEMENT EXAM (EXAMEN DE NIVELACION) COMMUNICATIVE ENGLISH",
      legacyLevels: 6,
      freeWritingIncluded: true,
      gradingMode: "automatic_consecutive_block_mastery",
      answerKeyStatus: "approved",
      finalScoringModel: "next_level_after_consecutive_block_mastery",
      finalScoringStatus: "approved",
      blockPassRate: PLACEMENT_BLOCK_PASS_RATE,
      borderlineRule: "one_question_below_pass_count",
      writingReviewMode: PLACEMENT_WRITING_REVIEW_MODE,
      note:
        "AIT aprobó la llave de respuestas, los seis bloques y la regla de dominio consecutivo. La recomendación sigue requiriendo confirmación de un asesor antes de la inscripción.",
    },
    levelBlocks: PLACEMENT_LEVEL_BLOCKS,
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

  const scoredAnswers = scoreSelectedAnswers(input.selectedAnswers);
  if (!scoredAnswers.ok) {
    return {
      status: 422,
      body: {
        ok: false,
        errors: [scoredAnswers.code],
        crmWrite: false,
      },
    };
  }
  const normalizedInput = normalizePlacementInput({
    ...input,
    quizAnswers: scoredAnswers.quizAnswers,
    skippedQuestionIndexes: scoredAnswers.skippedQuestionIndexes,
  });
  const submittedAt = normalizedInput.submittedAt ?? new Date().toISOString();
  const scores = calculatePlacementScore(normalizedInput);
  const recommendation = selectPlacementRecommendation(scores);
  const advisorMessage = buildAdvisorHandoffMessage({
    student: normalizedInput.student,
    goal: normalizedInput.goal,
    recommendation,
    scores,
  });
  const crmPayloadPreview = buildPlacementCrmPayloadPreview({
    input: normalizedInput,
    recommendation,
    scores,
    submittedAt,
  });
  const crmSyncPreview = buildPlacementCrmSyncPreview({
    input: normalizedInput,
    recommendation,
    scores,
    submittedAt,
    crmPayloadPreview,
  });

  return {
    status: 200,
    body: {
      ok: true,
      attemptId: normalizedInput.attemptId || null,
      recommendation,
      scores,
      resultStatus: {
        advisorConfirmationRequired: true,
        academicKeyStatus: scores.answerKeyStatus,
        finalScoringStatus: scores.finalScoringStatus,
        borderlineReviewRequired: scores.borderlineReviewRequired,
        writingReviewMode: scores.writingReviewMode,
        certifiedAssessment: false,
      },
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
  const skippedQuestionIndexes = new Set(input.skippedQuestionIndexes || []);
  const rawBlockScores = PLACEMENT_LEVEL_BLOCKS.map((block) => {
    const answers = input.quizAnswers.slice(block.start, block.start + block.count);
    const skippedCount = Array.from(
      { length: block.count },
      (_, localIndex) => block.start + localIndex,
    ).filter((index) => skippedQuestionIndexes.has(index)).length;
    const correct = answers.reduce((total, value) => total + Number(value), 0);
    const borderlineCount = block.passCount - 1;
    return {
      key: block.key,
      label: block.label,
      book: block.book,
      correct,
      answered: block.count - skippedCount,
      skipped: skippedCount,
      questionCount: block.count,
      passRate: PLACEMENT_BLOCK_PASS_RATE,
      passCount: block.passCount,
      borderlineCount,
      passStatus:
        correct >= block.passCount
          ? "passed"
          : correct === borderlineCount
            ? "borderline"
            : "not_passed",
    };
  });
  let consecutivePassedBlockCount = 0;
  while (
    consecutivePassedBlockCount < rawBlockScores.length &&
    rawBlockScores[consecutivePassedBlockCount].passStatus === "passed"
  ) {
    consecutivePassedBlockCount += 1;
  }
  const firstUnvalidatedBlock = rawBlockScores[consecutivePassedBlockCount] || null;
  const allBlocksPassed = consecutivePassedBlockCount === rawBlockScores.length;
  const borderlineReviewRequired = firstUnvalidatedBlock?.passStatus === "borderline";
  const recommendedPlacementIndex = Math.min(
    consecutivePassedBlockCount,
    PLACEMENT_RECOMMENDATIONS.length - 1,
  );
  const blockScores = rawBlockScores.map((blockScore, index) => ({
    ...blockScore,
    countsTowardPlacement: index < consecutivePassedBlockCount,
  }));

  return {
    quizScore,
    quizQuestionCount: PLACEMENT_QUIZ_QUESTION_COUNT,
    answeredQuestionCount:
      PLACEMENT_QUIZ_QUESTION_COUNT - skippedQuestionIndexes.size,
    skippedQuestionCount: skippedQuestionIndexes.size,
    blockScores,
    consecutivePassedBlockCount,
    highestValidatedBlockKey:
      consecutivePassedBlockCount > 0
        ? PLACEMENT_LEVEL_BLOCKS[consecutivePassedBlockCount - 1].key
        : null,
    recommendedPlacementIndex,
    placementReason: allBlocksPassed
      ? "advanced_cap_reached"
      : consecutivePassedBlockCount === 0
        ? "foundation_required"
        : "next_level_after_mastery",
    borderlineReviewRequired,
    advisorReviewRequired: borderlineReviewRequired || allBlocksPassed,
    selfAssessmentScore,
    selfAssessmentAverage,
    selfAssessmentAffectsPlacement: false,
    totalScore: quizScore,
    maxScore: PLACEMENT_QUIZ_QUESTION_COUNT,
    gradingMode: "automatic_consecutive_block_mastery",
    answerKeyStatus: "approved",
    finalScoringModel: "next_level_after_consecutive_block_mastery",
    finalScoringStatus: allBlocksPassed
      ? "advisor_review"
      : borderlineReviewRequired
        ? "borderline"
        : "validated",
    writingAffectsPlacement: false,
    writingReviewMode: PLACEMENT_WRITING_REVIEW_MODE,
  };
}

export function selectPlacementRecommendation(scores) {
  return PLACEMENT_RECOMMENDATIONS[scores?.recommendedPlacementIndex]
    ?? PLACEMENT_RECOMMENDATIONS[0];
}

export function buildAdvisorHandoffMessage({
  student,
  goal,
  recommendation,
  scores,
}) {
  const message = [
    "Hola AIT USA, ya complete el examen de ubicacion.",
    student.name ? `Nombre: ${student.name}` : null,
    student.city ? `Ciudad/Pais: ${student.city}` : null,
    student.phone ? `WhatsApp/telefono: ${student.phone}` : null,
    student.email ? `Email: ${student.email}` : null,
    student.ageGroup ? `Grupo de edad: ${student.ageGroup}` : null,
    `Objetivo: ${goal}`,
    `Resultado sugerido: ${recommendation.level}`,
    `Preguntas correctas: ${scores.quizScore} de ${scores.quizQuestionCount}`,
    `Bloques consecutivos aprobados: ${scores.consecutivePassedBlockCount} de ${PLACEMENT_LEVEL_BLOCKS.length}`,
    scores.borderlineReviewRequired
      ? "Revision academica: quedo a una respuesta del siguiente nivel."
      : null,
    scores.finalScoringStatus === "advisor_review"
      ? "Revision academica: completo todos los bloques; confirmar ubicacion avanzada."
      : null,
    `Detalle: ${recommendation.copy}`,
    "Quiero confirmar esta recomendacion con un asesor.",
  ];
  return message.filter(Boolean).join("\n");
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
      name: Boolean(input.student?.name),
      phone: Boolean(input.student?.phone),
      email: Boolean(input.student?.email),
      city: Boolean(input.student?.city),
      ageGroup: Boolean(input.student?.ageGroup),
    },
    placement: {
      goal: input.goal,
      totalScore: scores.totalScore,
      quizScore: scores.quizScore,
      quizQuestionCount: scores.quizQuestionCount,
      answeredQuestionCount: scores.answeredQuestionCount,
      skippedQuestionCount: scores.skippedQuestionCount,
      selfAssessmentAverage: scores.selfAssessmentAverage,
      selfAssessmentAffectsPlacement: false,
      recommendationKey: recommendation.key,
      recommendationLevel: recommendation.level,
      advisorConfirmationRequired: true,
      gradingMode: scores.gradingMode,
      answerKeyStatus: scores.answerKeyStatus,
      finalScoringModel: scores.finalScoringModel,
      finalScoringStatus: scores.finalScoringStatus,
      consecutivePassedBlockCount: scores.consecutivePassedBlockCount,
      highestValidatedBlockKey: scores.highestValidatedBlockKey,
      borderlineReviewRequired: scores.borderlineReviewRequired,
      writingReviewMode: scores.writingReviewMode,
    },
    consent: {
      advisorHandoff: input.consent?.advisorHandoff === true,
      crmStorageApproved: false,
      marketingSmsOptIn: false,
      marketingSmsSource: "not_collected_on_placement_test",
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
      finalScoringStatus: scores.finalScoringStatus,
      consecutivePassedBlockCount: scores.consecutivePassedBlockCount,
      highestValidatedBlockKey: scores.highestValidatedBlockKey,
      borderlineReviewRequired: scores.borderlineReviewRequired,
      writingReviewMode: scores.writingReviewMode,
      contactFieldsProvided: crmPayloadPreview.contactFieldsProvided,
      advisorConfirmationRequired: true,
      crmStorageApproved: false,
      marketingSmsOptIn: false,
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
  if (!isRecord(input)) {
    return {
      ok: false,
      errors: ["request_body_invalid"],
    };
  }

  const errors = [];

  if (input.student !== undefined && !isRecord(input.student)) {
    errors.push("student_invalid");
  } else if (isRecord(input.student)) {
    for (const field of ["name", "phone", "email", "city", "ageGroup"]) {
      if (
        input.student[field] !== undefined &&
        input.student[field] !== "" &&
        !isNonEmptyString(input.student[field])
      ) {
        errors.push(`student_${field}_invalid`);
      }
    }
  }

  if (input.selfAssessment !== undefined && !isRecord(input.selfAssessment)) {
    errors.push("self_assessment_invalid");
  } else if (isRecord(input.selfAssessment)) {
    for (const key of PLACEMENT_SELF_ASSESSMENTS) {
      if (
        input.selfAssessment[key] !== undefined &&
        !isScoreValue(input.selfAssessment[key])
      ) {
        errors.push(`self_assessment_${key}_invalid`);
      }
    }
  }

  if (!Array.isArray(input.selectedAnswers)) {
    errors.push("selected_answers_required");
  } else if (input.selectedAnswers.length !== PLACEMENT_QUIZ_QUESTION_COUNT) {
    errors.push("selected_answers_count_invalid");
  } else {
    input.selectedAnswers.forEach((value, index) => {
      if (
        value !== null &&
        (
          typeof value !== "string" ||
          !DIAGNOSTIC_QUESTION_BANK[index].options.includes(value)
        )
      ) {
        errors.push(`selected_answer_${index}_invalid`);
      }
    });
  }

  if (input.quizAnswers !== undefined) {
    errors.push("client_score_submission_forbidden");
  }

  if (!isNonEmptyString(input.goal)) {
    errors.push("goal_required");
  }

  if (
    input.attemptId !== undefined &&
    (!isNonEmptyString(input.attemptId) || input.attemptId.length > 128)
  ) {
    errors.push("attempt_id_invalid");
  }

  if (input.skippedQuestionIndexes !== undefined) {
    if (!Array.isArray(input.skippedQuestionIndexes)) {
      errors.push("skipped_question_indexes_invalid");
    } else {
      const seen = new Set();
      for (const index of input.skippedQuestionIndexes) {
        if (
          !Number.isInteger(index) ||
          index < 0 ||
          index >= PLACEMENT_QUIZ_QUESTION_COUNT ||
          seen.has(index)
        ) {
          errors.push("skipped_question_indexes_invalid");
          break;
        }
        seen.add(index);
      }
    }
  }

  if (
    input.submittedAt !== undefined &&
    input.submittedAt !== null &&
    (!isNonEmptyString(input.submittedAt) ||
      Number.isNaN(Date.parse(input.submittedAt)))
  ) {
    errors.push("submitted_at_invalid");
  }

  return errors.length === 0 ? { ok: true } : { ok: false, errors };
}

function createSubmissionFingerprint(input) {
  return createHash("sha256")
    .update(
      [
        input.attemptId,
        input.student?.email,
        input.quizAnswers.join(""),
        input.goal,
      ].join("|"),
    )
    .digest("hex")
    .slice(0, 20);
}

function normalizePlacementInput(input) {
  return {
    ...input,
    student: isRecord(input.student) ? input.student : {},
    selfAssessment: Object.fromEntries(
      PLACEMENT_SELF_ASSESSMENTS.map((key) => [
        key,
        Number(input.selfAssessment?.[key] || 0),
      ]),
    ),
    skippedQuestionIndexes: Array.isArray(input.skippedQuestionIndexes)
      ? input.skippedQuestionIndexes
      : [],
    consent: isRecord(input.consent) ? input.consent : {},
  };
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
