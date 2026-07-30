"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { placementTest, site } from "../../../src/content";

const SESSION_KEY = "aitusa:placement-v2:session";
const SESSION_VERSION = 1;
const SECONDS_PER_GRADED_QUESTION = 11;

function createAttemptId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `placement-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createEmptyAnswers(count) {
  return Array.from({ length: count }, () => null);
}

function normalizeSnapshot(snapshot, questionCount) {
  if (!snapshot || snapshot.version !== SESSION_VERSION) return null;
  if (!Array.isArray(snapshot.answers) || snapshot.answers.length !== questionCount) {
    return null;
  }
  return {
    ...snapshot,
    answers: snapshot.answers.map((answer) =>
      typeof answer === "string" ? answer : null),
    skipped: Array.isArray(snapshot.skipped)
      ? snapshot.skipped.filter(
        (index) => Number.isInteger(index) && index >= 0 && index < questionCount,
      )
      : [],
    selfAssessment:
      snapshot.selfAssessment && typeof snapshot.selfAssessment === "object"
        ? snapshot.selfAssessment
        : {},
    questionIndex: Math.min(
      Math.max(Number(snapshot.questionIndex) || 0, 0),
      questionCount - 1,
    ),
  };
}

function getBookKey(levelIndex) {
  if (levelIndex <= 1) return "book-1";
  if (levelIndex <= 3) return "book-2";
  return "book-3";
}

function getBookLabel(bookKey) {
  return {
    "book-1": "Book 1",
    "book-2": "Book 2",
    "book-3": "Book 3",
  }[bookKey];
}

function ProgressHeader({ question, questionIndex, questionCount }) {
  const progress = ((questionIndex + 1) / questionCount) * 100;
  const remainingMinutes = Math.max(
    1,
    Math.ceil(
      ((questionCount - questionIndex - 1) * SECONDS_PER_GRADED_QUESTION) / 60,
    ),
  );
  const currentBook = getBookKey(question.levelIndex);

  return (
    <header className="diagnostic-progress">
      <div className="diagnostic-progress__summary" aria-live="polite">
        <strong>Pregunta {questionIndex + 1} de {questionCount}</strong>
        <span>cerca de {remainingMinutes} min restantes</span>
      </div>
      <div
        className="diagnostic-progress__track"
        role="progressbar"
        aria-label="Progreso del examen"
        aria-valuemin="1"
        aria-valuemax={questionCount}
        aria-valuenow={questionIndex + 1}
      >
        <span style={{ width: `${progress}%` }} />
      </div>
      <div className="diagnostic-level-path" aria-label="Ruta académica explorada">
        {["book-1", "book-2", "book-3"].map((bookKey) => (
          <span
            className={bookKey === currentBook ? "is-current" : ""}
            aria-current={bookKey === currentBook ? "step" : undefined}
            key={bookKey}
          >
            {getBookLabel(bookKey)}
          </span>
        ))}
      </div>
      <p className="diagnostic-level-note">
        Explorando preguntas de {question.levelLabel}. Tu nivel se estima al final.
      </p>
    </header>
  );
}

function IntroScreen({ resumeSnapshot, onStart, onResume }) {
  return (
    <section className="diagnostic-intro" data-diagnostic-screen="intro">
      <div>
        <p className="eyebrow-chip">Tu resultado antes de tus datos</p>
        <h2>Encuentra tu punto de partida</h2>
        <p className="diagnostic-lead">
          Responde 62 preguntas, una a la vez. Puedes regresar, cambiar una
          respuesta o saltar lo que no sepas.
        </p>
      </div>
      <div className="diagnostic-intro__actions">
        {resumeSnapshot ? (
          <>
            <button className="button button--primary" type="button" onClick={onResume}>
              Continuar donde quedé
            </button>
            <button className="button button--ghost" type="button" onClick={onStart}>
              Empezar de nuevo
            </button>
          </>
        ) : (
          <button className="button button--primary" type="button" onClick={onStart}>
            Comenzar mi examen
          </button>
        )}
      </div>
      <div className="diagnostic-intro__facts" aria-label="Detalles del examen">
        <article>
          <strong>10–15 min</strong>
          <span>Tiempo estimado</span>
        </article>
        <article>
          <strong>Sin registro</strong>
          <span>Primero ves tu resultado</span>
        </article>
        <article>
          <strong>Sin presión</strong>
          <span>No mostramos errores durante el examen</span>
        </article>
      </div>
      <div className="diagnostic-trust">
        <span aria-hidden="true">✓</span>
        <p>
          Esta es una estimación de ubicación de AIT. Un asesor confirma el
          nivel final antes de la inscripción.
        </p>
      </div>
    </section>
  );
}

function QuestionScreen({
  answer,
  direction,
  onAnswer,
  onBack,
  onSkip,
  pendingAdvance,
  question,
  questionCount,
  questionIndex,
}) {
  return (
    <section className="diagnostic-question-screen" data-diagnostic-screen="question">
      <ProgressHeader
        question={question}
        questionCount={questionCount}
        questionIndex={questionIndex}
      />
      <fieldset
        className="diagnostic-question-card"
        data-direction={direction}
        disabled={pendingAdvance}
        key={questionIndex}
      >
        <legend>{question.prompt.replace(/^\d+\.\s*/, "")}</legend>
        <div className="diagnostic-answer-list">
          {question.options.map((option, index) => {
            const selected = answer === option;
            return (
              <button
                aria-pressed={selected}
                className={`diagnostic-answer${selected ? " is-selected" : ""}`}
                key={option}
                onClick={() => onAnswer(option)}
                type="button"
              >
                <span className="diagnostic-answer__key" aria-hidden="true">
                  {String.fromCharCode(65 + index)}
                </span>
                <span>{option === "I Don't Know" || option === "I Don't know" ? "No lo sé" : option}</span>
                <span className="diagnostic-answer__check" aria-hidden="true">✓</span>
              </button>
            );
          })}
        </div>
      </fieldset>
      <nav className="diagnostic-question-nav" aria-label="Navegación del examen">
        <button className="diagnostic-text-action" type="button" onClick={onBack}>
          <span aria-hidden="true">←</span> Atrás
        </button>
        <button className="diagnostic-text-action" type="button" onClick={onSkip}>
          Saltar por ahora <span aria-hidden="true">→</span>
        </button>
      </nav>
    </section>
  );
}

function ReviewScreen({ skipped, onContinue, onOpenQuestion }) {
  return (
    <section className="diagnostic-review" data-diagnostic-screen="review">
      <p className="eyebrow-chip">Revisión rápida</p>
      <h2>
        {skipped.length === 1
          ? "Dejaste una pregunta pendiente"
          : `Dejaste ${skipped.length} preguntas pendientes`}
      </h2>
      <p>
        Puedes responderlas ahora o continuar. Las preguntas sin responder
        cuentan como incorrectas, pero no bloquean tu resultado.
      </p>
      <div className="diagnostic-review__grid" aria-label="Preguntas pendientes">
        {skipped.map((index) => (
          <button key={index} type="button" onClick={() => onOpenQuestion(index)}>
            Pregunta {index + 1}
          </button>
        ))}
      </div>
      <button className="button button--primary" type="button" onClick={onContinue}>
        Continuar con {skipped.length} sin responder
      </button>
    </section>
  );
}

function ReflectionScreen({
  group,
  index,
  onBack,
  onSelect,
  selectedValue,
  total,
}) {
  return (
    <section className="diagnostic-reflection" data-diagnostic-screen="reflection">
      <div className="diagnostic-mini-progress">
        <span>Contexto personal</span>
        <strong>{index + 1} de {total}</strong>
      </div>
      <p className="eyebrow-chip">Esto no cambia tu nivel</p>
      <h2>{group.label}, ¿cómo te sientes hoy?</h2>
      <p>
        Tu respuesta solo ayuda a personalizar la recomendación y la
        conversación con un asesor.
      </p>
      <div className="diagnostic-answer-list">
        {group.options.map((option, optionIndex) => (
          <button
            aria-pressed={selectedValue === optionIndex}
            className={`diagnostic-answer${selectedValue === optionIndex ? " is-selected" : ""}`}
            key={option}
            type="button"
            onClick={() => onSelect(optionIndex)}
          >
            <span className="diagnostic-answer__key" aria-hidden="true">
              {optionIndex + 1}
            </span>
            <span>{option}</span>
            <span className="diagnostic-answer__check" aria-hidden="true">✓</span>
          </button>
        ))}
      </div>
      <nav className="diagnostic-question-nav" aria-label="Navegación del contexto personal">
        <button className="diagnostic-text-action" type="button" onClick={onBack}>
          <span aria-hidden="true">←</span> Atrás
        </button>
        <button className="diagnostic-text-action" type="button" onClick={() => onSelect(null)}>
          Prefiero saltar <span aria-hidden="true">→</span>
        </button>
      </nav>
    </section>
  );
}

function GoalScreen({
  busy,
  error,
  goal,
  onBack,
  onGoalChange,
  onSubmit,
  onWritingChange,
  writingSample,
}) {
  return (
    <section className="diagnostic-goal" data-diagnostic-screen="goal">
      <p className="eyebrow-chip">Último paso</p>
      <h2>¿Qué quieres lograr con tu inglés?</h2>
      <p>Esto no cambia tu nivel; nos ayuda a recomendarte el siguiente paso.</p>
      <fieldset className="diagnostic-goal__options">
        <legend>Elige tu objetivo principal</legend>
        {placementTest.goals.map((item) => (
          <label className={goal === item ? "is-selected" : ""} key={item}>
            <input
              checked={goal === item}
              name="goal"
              onChange={() => onGoalChange(item)}
              type="radio"
              value={item}
            />
            <span>{item}</span>
          </label>
        ))}
      </fieldset>
      <label className="diagnostic-writing">
        <span>
          <strong>{placementTest.writingPrompt.title}</strong>
          {placementTest.writingPrompt.prompt}
        </span>
        <textarea
          onChange={(event) => onWritingChange(event.target.value)}
          placeholder="Opcional: escribe aquí tu respuesta breve."
          rows="4"
          value={writingSample}
        />
        <small>{placementTest.writingPrompt.note}</small>
      </label>
      {error ? (
        <div className="diagnostic-error" role="alert">
          <strong>No pudimos calcular el resultado.</strong>
          <span>{error}</span>
        </div>
      ) : null}
      <div className="diagnostic-goal__actions">
        <button className="button button--ghost" type="button" onClick={onBack}>
          Atrás
        </button>
        <button
          className="button button--primary"
          disabled={busy || !goal}
          type="button"
          onClick={onSubmit}
        >
          {busy ? "Preparando tu resultado…" : "Ver mi nivel estimado"}
        </button>
      </div>
    </section>
  );
}

function ResultScreen({ completedCount, goal, onRestart, result, skippedCount }) {
  const recommendation = result?.recommendation;
  const scores = result?.scores || {};
  if (!recommendation) return null;

  return (
    <section className="diagnostic-result" data-diagnostic-screen="result">
      <div className="diagnostic-result__hero">
        <p className="eyebrow-chip">Estimación de ubicación AIT</p>
        <span className="diagnostic-result__label">Punto de partida recomendado</span>
        <h2>{recommendation.level}</h2>
        <p>{recommendation.recommendation || recommendation.copy}</p>
      </div>
      <div className="diagnostic-result__metrics">
        <article>
          <strong>{scores.quizScore}</strong>
          <span>respuestas correctas de {scores.quizQuestionCount}</span>
        </article>
        <article>
          <strong>{completedCount}</strong>
          <span>preguntas respondidas</span>
        </article>
        <article>
          <strong>{skippedCount}</strong>
          <span>preguntas sin responder</span>
        </article>
      </div>
      <div className="diagnostic-result__explanation">
        <h3>Qué significa</h3>
        <p><strong>Ruta sugerida:</strong> {recommendation.bestFit}</p>
        <p><strong>Tu objetivo:</strong> {goal}</p>
        <p>
          <strong>Confirmación académica:</strong> un asesor revisa esta
          estimación contigo antes de definir nivel, horario e inscripción.
        </p>
        <p className="diagnostic-result__provisional">
          AIT todavía está validando la llave académica y las reglas por nivel.
          Esta estimación es provisional y no representa una certificación CEFR.
        </p>
      </div>
      <div className="diagnostic-unlock">
        <div>
          <p className="section-kicker">Siguiente entrega</p>
          <h3>Guarda tu resultado y practica 3–5 minutos</h3>
          <p>
            El flujo final pedirá solo nombre y email, verificará un código en
            la misma página y desbloqueará una conversación guiada de cinco
            turnos.
          </p>
        </div>
        <span>Sin contraseña · 1 práctica gratis</span>
        <small>
          Menores de 13 años necesitarán una cuenta creada y verificada por su
          padre, madre o tutor.
        </small>
      </div>
      <div className="diagnostic-result__actions">
        <a
          className="button button--primary"
          href={result.advisorHandoff?.href || site.whatsappHref}
          rel="noreferrer"
          target="_blank"
        >
          Confirmar con un asesor
        </a>
        <a className="button button--ghost" href="/courses/">
          Ver cursos
        </a>
        <button className="diagnostic-text-action" type="button" onClick={onRestart}>
          Volver a empezar
        </button>
      </div>
    </section>
  );
}

export function PlacementExperience() {
  const flatQuestions = useMemo(() => {
    let globalIndex = 0;
    return placementTest.questions.flatMap((level, levelIndex) =>
      level.items.map((question) => ({
        ...question,
        globalIndex: globalIndex++,
        levelIndex,
        levelLabel: level.level.replace(/\s*\(.*\)$/, ""),
      })),
    );
  }, []);

  const advanceTimer = useRef(null);
  const [screen, setScreen] = useState("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(() => createEmptyAnswers(flatQuestions.length));
  const [skipped, setSkipped] = useState([]);
  const [selfAssessment, setSelfAssessment] = useState({});
  const [reflectionIndex, setReflectionIndex] = useState(0);
  const [goal, setGoal] = useState("");
  const [writingSample, setWritingSample] = useState("");
  const [attemptId, setAttemptId] = useState("");
  const [resumeSnapshot, setResumeSnapshot] = useState(null);
  const [reviewReturn, setReviewReturn] = useState(false);
  const [direction, setDirection] = useState("forward");
  const [pendingAdvance, setPendingAdvance] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    try {
      const saved = normalizeSnapshot(
        JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null"),
        flatQuestions.length,
      );
      if (saved) setResumeSnapshot(saved);
    } catch {
      sessionStorage.removeItem(SESSION_KEY);
    }
    return () => {
      if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    };
  }, [flatQuestions.length]);

  useEffect(() => {
    if (!["question", "review", "reflection", "goal"].includes(screen)) return;
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
      version: SESSION_VERSION,
      attemptId,
      screen,
      questionIndex,
      answers,
      skipped,
      selfAssessment,
      reflectionIndex,
      goal,
      writingSample,
    }));
  }, [
    answers,
    attemptId,
    goal,
    questionIndex,
    reflectionIndex,
    screen,
    selfAssessment,
    skipped,
    writingSample,
  ]);

  useEffect(() => {
    if (screen === "intro") return;
    const frame = window.requestAnimationFrame(() => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document.querySelector(".diagnostic-shell")?.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start",
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [screen]);

  const beginNewAttempt = () => {
    if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    sessionStorage.removeItem(SESSION_KEY);
    setAttemptId(createAttemptId());
    setAnswers(createEmptyAnswers(flatQuestions.length));
    setSkipped([]);
    setSelfAssessment({});
    setReflectionIndex(0);
    setQuestionIndex(0);
    setGoal("");
    setWritingSample("");
    setResult(null);
    setError("");
    setResumeSnapshot(null);
    setDirection("forward");
    setScreen("question");
  };

  const resumeAttempt = () => {
    if (!resumeSnapshot) return;
    setAttemptId(resumeSnapshot.attemptId || createAttemptId());
    setAnswers(resumeSnapshot.answers);
    setSkipped(resumeSnapshot.skipped);
    setSelfAssessment(resumeSnapshot.selfAssessment);
    setReflectionIndex(resumeSnapshot.reflectionIndex || 0);
    setQuestionIndex(resumeSnapshot.questionIndex);
    setGoal(resumeSnapshot.goal || "");
    setWritingSample(resumeSnapshot.writingSample || "");
    setDirection("forward");
    setScreen(
      ["question", "review", "reflection", "goal"].includes(resumeSnapshot.screen)
        ? resumeSnapshot.screen
        : "question",
    );
  };

  const moveAfterQuiz = (nextSkipped) => {
    setReviewReturn(false);
    setScreen(nextSkipped.length > 0 ? "review" : "reflection");
  };

  const answerQuestion = (option) => {
    if (pendingAdvance) return;
    const nextAnswers = [...answers];
    nextAnswers[questionIndex] = option;
    const nextSkipped = skipped.filter((index) => index !== questionIndex);
    setAnswers(nextAnswers);
    setSkipped(nextSkipped);
    setPendingAdvance(true);
    setDirection("forward");
    advanceTimer.current = window.setTimeout(() => {
      setPendingAdvance(false);
      if (reviewReturn) {
        setReviewReturn(false);
        setScreen("review");
      } else if (questionIndex >= flatQuestions.length - 1) {
        moveAfterQuiz(nextSkipped);
      } else {
        setQuestionIndex((value) => value + 1);
      }
    }, 240);
  };

  const skipQuestion = () => {
    if (pendingAdvance) return;
    const nextAnswers = [...answers];
    nextAnswers[questionIndex] = null;
    const nextSkipped = [...new Set([...skipped, questionIndex])].sort((a, b) => a - b);
    setAnswers(nextAnswers);
    setSkipped(nextSkipped);
    setDirection("forward");
    if (reviewReturn) {
      setReviewReturn(false);
      setScreen("review");
    } else if (questionIndex >= flatQuestions.length - 1) {
      moveAfterQuiz(nextSkipped);
    } else {
      setQuestionIndex((value) => value + 1);
    }
  };

  const backFromQuestion = () => {
    if (pendingAdvance) return;
    setDirection("back");
    if (reviewReturn) {
      setReviewReturn(false);
      setScreen("review");
    } else if (questionIndex > 0) {
      setQuestionIndex((value) => value - 1);
    } else {
      setScreen("intro");
    }
  };

  const openSkippedQuestion = (index) => {
    setReviewReturn(true);
    setQuestionIndex(index);
    setDirection("back");
    setScreen("question");
  };

  const selectReflection = (value) => {
    const group = placementTest.selfAssessments[reflectionIndex];
    setSelfAssessment((current) => ({
      ...current,
      [group.key]: value === null ? 0 : value,
    }));
    setDirection("forward");
    if (reflectionIndex >= placementTest.selfAssessments.length - 1) {
      setScreen("goal");
    } else {
      setReflectionIndex((current) => current + 1);
    }
  };

  const backFromReflection = () => {
    setDirection("back");
    if (reflectionIndex > 0) {
      setReflectionIndex((current) => current - 1);
    } else if (skipped.length > 0) {
      setScreen("review");
    } else {
      setQuestionIndex(flatQuestions.length - 1);
      setScreen("question");
    }
  };

  const submitDiagnostic = async () => {
    if (!goal || busy) return;
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      setError("Parece que no tienes conexión. Tus respuestas siguen en esta pestaña; vuelve a intentar cuando regreses en línea.");
      return;
    }
    setBusy(true);
    setError("");
    const quizAnswers = flatQuestions.map((question, index) =>
      answers[index] === question.answer ? 1 : 0);
    const payload = {
      attemptId,
      student: {},
      selfAssessment: Object.fromEntries(
        placementTest.selfAssessments.map((group) => [
          group.key,
          Number(selfAssessment[group.key] || 0),
        ]),
      ),
      quizAnswers,
      skippedQuestionIndexes: skipped,
      goal,
      writingSample,
      consent: { advisorHandoff: false },
      submittedAt: new Date().toISOString(),
    };

    try {
      const response = await fetch("/api/placement-test", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await response.json();
      if (!response.ok || body.ok !== true) throw new Error("placement_api_rejected");
      setResult(body);
      setScreen("result");
      sessionStorage.removeItem(SESSION_KEY);
      window.dispatchEvent(new CustomEvent("aitusa:placement-ready", {
        detail: {
          attemptId,
          goal,
          recommendation: body.recommendation,
          answeredQuestionCount: flatQuestions.length - skipped.length,
          skippedQuestionCount: skipped.length,
          crmWrite: false,
          storageEnabled: false,
          submittedAt: payload.submittedAt,
        },
      }));
    } catch {
      setError("No se envió ni guardó información. Revisa tu conexión e inténtalo de nuevo.");
    } finally {
      setBusy(false);
    }
  };

  const restart = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setScreen("intro");
    setResult(null);
    setResumeSnapshot(null);
  };

  return (
    <div className="section-inner diagnostic-shell" data-placement-form>
      <div className="diagnostic-shell__brand" aria-hidden="true">
        <span>AIT</span>
        <small>Placement Diagnostic</small>
      </div>
      {screen === "intro" ? (
        <IntroScreen
          onResume={resumeAttempt}
          onStart={beginNewAttempt}
          resumeSnapshot={resumeSnapshot}
        />
      ) : null}
      {screen === "question" ? (
        <QuestionScreen
          answer={answers[questionIndex]}
          direction={direction}
          onAnswer={answerQuestion}
          onBack={backFromQuestion}
          onSkip={skipQuestion}
          pendingAdvance={pendingAdvance}
          question={flatQuestions[questionIndex]}
          questionCount={flatQuestions.length}
          questionIndex={questionIndex}
        />
      ) : null}
      {screen === "review" ? (
        <ReviewScreen
          onContinue={() => setScreen("reflection")}
          onOpenQuestion={openSkippedQuestion}
          skipped={skipped}
        />
      ) : null}
      {screen === "reflection" ? (
        <ReflectionScreen
          group={placementTest.selfAssessments[reflectionIndex]}
          index={reflectionIndex}
          onBack={backFromReflection}
          onSelect={selectReflection}
          selectedValue={selfAssessment[placementTest.selfAssessments[reflectionIndex].key]}
          total={placementTest.selfAssessments.length}
        />
      ) : null}
      {screen === "goal" ? (
        <GoalScreen
          busy={busy}
          error={error}
          goal={goal}
          onBack={() => {
            setReflectionIndex(placementTest.selfAssessments.length - 1);
            setScreen("reflection");
          }}
          onGoalChange={setGoal}
          onSubmit={submitDiagnostic}
          onWritingChange={setWritingSample}
          writingSample={writingSample}
        />
      ) : null}
      {screen === "result" ? (
        <ResultScreen
          completedCount={flatQuestions.length - skipped.length}
          goal={goal}
          onRestart={restart}
          result={result}
          skippedCount={skipped.length}
        />
      ) : null}
    </div>
  );
}
