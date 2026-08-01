import { placementTest } from "../content.js";
import { DIAGNOSTIC_VERSIONS } from "./contract.js";

const CORRECT_ANSWERS = Object.freeze([
  "is",
  "Am",
  "Where",
  "in",
  "are",
  "What",
  "nephew",
  "his",
  "eating",
  "in",
  "are",
  "These",
  "not",
  "do",
  "stay",
  "them",
  "Does",
  "speak",
  "washes",
  "She doesn't",
  "Do",
  "did",
  "were",
  "watches",
  "is going to",
  "I gave her a plant.",
  "many",
  "went",
  "a few",
  "carefully",
  "took",
  "easier than",
  "more intelligent than",
  "should",
  "might",
  "Could",
  "through",
  "fewer",
  "must",
  "any",
  "anybody",
  "be",
  "with",
  "about",
  "to",
  "been / for",
  "Either",
  "ever seen",
  "worn",
  "flown",
  "had already begun",
  "to bite",
  "Swimming",
  "about moving",
  "throw them out",
  "got over it",
  "avoids driving",
  "have given",
  "would go",
  "would have said",
  "should have",
  "could have",
]);

const publicQuestions = placementTest.questions.flatMap((level, levelIndex) =>
  level.items.map((question) => ({
    prompt: question.prompt,
    options: Object.freeze([...question.options]),
    levelIndex,
    levelLabel: level.level,
  })),
);

if (publicQuestions.length !== CORRECT_ANSWERS.length) {
  throw new Error("diagnostic_question_bank_answer_count_mismatch");
}

const invalidAnswerIndex = publicQuestions.findIndex(
  (question, index) => !question.options.includes(CORRECT_ANSWERS[index]),
);
if (invalidAnswerIndex !== -1) {
  throw new Error(`diagnostic_question_bank_answer_option_mismatch:${invalidAnswerIndex + 1}`);
}

export const DIAGNOSTIC_QUESTION_BANK = Object.freeze(
  publicQuestions.map((question, index) =>
    Object.freeze({
      ...question,
      key: `q-${String(index + 1).padStart(3, "0")}`,
      correctAnswer: CORRECT_ANSWERS[index],
      version: DIAGNOSTIC_VERSIONS.questionBank,
    })),
);

const questionsByKey = new Map(
  DIAGNOSTIC_QUESTION_BANK.map((question) => [question.key, question]),
);

export function getDiagnosticQuestion(questionKey) {
  return questionsByKey.get(questionKey) || null;
}

export function validateSelectedAnswer(questionKey, answerState, answerValue) {
  const question = getDiagnosticQuestion(questionKey);
  if (!question) return { ok: false, code: "question_not_found" };
  if (answerState === "skipped" && answerValue === null) {
    return { ok: true, question };
  }
  if (
    answerState !== "answered" ||
    typeof answerValue !== "string" ||
    !question.options.includes(answerValue)
  ) {
    return { ok: false, code: "answer_invalid" };
  }
  return { ok: true, question };
}

export function scoreSelectedAnswers(selectedAnswers) {
  if (!Array.isArray(selectedAnswers) || selectedAnswers.length !== DIAGNOSTIC_QUESTION_BANK.length) {
    return { ok: false, code: "selected_answers_count_invalid" };
  }

  const quizAnswers = [];
  const skippedQuestionIndexes = [];
  for (let index = 0; index < DIAGNOSTIC_QUESTION_BANK.length; index += 1) {
    const selected = selectedAnswers[index];
    const question = DIAGNOSTIC_QUESTION_BANK[index];
    if (selected === null) {
      quizAnswers.push(0);
      skippedQuestionIndexes.push(index);
      continue;
    }
    if (typeof selected !== "string" || !question.options.includes(selected)) {
      return { ok: false, code: `selected_answer_${index}_invalid` };
    }
    quizAnswers.push(selected === question.correctAnswer ? 1 : 0);
  }

  return {
    ok: true,
    quizAnswers,
    skippedQuestionIndexes,
  };
}
