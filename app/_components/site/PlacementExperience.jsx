"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { placementTest, site } from "../../../src/content";

const SESSION_KEY = "aitusa:placement-v2:session";
const SESSION_VERSION = 2;
const SECONDS_PER_GRADED_QUESTION = 11;

function createAttemptId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `placement-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createRequestSecret() {
  return `${createAttemptId()}${createAttemptId()}`;
}

function createEmptyAnswers(count) {
  return Array.from({ length: count }, () => null);
}

function questionKey(index) {
  return `q-${String(index + 1).padStart(3, "0")}`;
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

function buildServerResumeSnapshot(body, questionCount) {
  if (body?.ok !== true || body?.durable !== true || !body.attempt) return null;
  const answers = createEmptyAnswers(questionCount);
  const skipped = [];
  for (const answer of body.answers || []) {
    const index = Number.parseInt(answer.questionKey?.slice(2), 10) - 1;
    if (!Number.isInteger(index) || index < 0 || index >= questionCount) continue;
    answers[index] = answer.answerState === "answered" ? answer.answerValue : null;
    if (answer.answerState === "skipped") skipped.push(index);
  }
  const firstUnanswered = answers.findIndex(
    (value, index) => value === null && !skipped.includes(index),
  );
  return {
    version: SESSION_VERSION,
    attemptId: body.attempt.id,
    ageBand: "age_13_plus",
    durable: true,
    serverRevision: body.attempt.revision,
    screen: body.result ? "result" : "question",
    questionIndex: firstUnanswered >= 0 ? firstUnanswered : questionCount - 1,
    answers,
    skipped,
    selfAssessment: {},
    reflectionIndex: 0,
    goal: body.goal || body.result?.crmPayloadPreview?.placement?.goal || "",
    writingSample: "",
    result: body.result || null,
  };
}

function serverSnapshotMatchesLocal(serverSnapshot, localSnapshot) {
  return (
    serverSnapshot.answers.every(
      (answer, index) => answer === localSnapshot.answers[index],
    ) &&
    serverSnapshot.skipped.length === localSnapshot.skipped.length &&
    serverSnapshot.skipped.every((index) => localSnapshot.skipped.includes(index))
  );
}

const BOOK_PATH = Object.freeze([
  Object.freeze({ key: "level-1", label: "Level 1", book: "Intro Book" }),
  Object.freeze({ key: "level-2", label: "Level 2", book: "Book 1" }),
  Object.freeze({ key: "level-3", label: "Level 3", book: "Book 2" }),
  Object.freeze({ key: "level-4", label: "Level 4", book: "Book 3" }),
  Object.freeze({ key: "level-5", label: "Level 5", book: "Book 4" }),
  Object.freeze({ key: "level-6", label: "Level 6", book: "Book 5" }),
]);

function getBookKey(bookLabel) {
  return BOOK_PATH.find((level) => level.book === bookLabel)?.key || BOOK_PATH[0].key;
}

function getBookLabel(bookKey) {
  return BOOK_PATH.find((book) => book.key === bookKey)?.label || BOOK_PATH[0].label;
}

function ProgressHeader({ question, questionIndex, questionCount }) {
  const progress = ((questionIndex + 1) / questionCount) * 100;
  const remainingMinutes = Math.max(
    1,
    Math.ceil(
      ((questionCount - questionIndex - 1) * SECONDS_PER_GRADED_QUESTION) / 60,
    ),
  );
  const currentBook = getBookKey(question.book);
  const currentLevelRef = useRef(null);

  useEffect(() => {
    currentLevelRef.current?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [currentBook]);

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
        {BOOK_PATH.map(({ key: bookKey }) => (
          <span
            className={bookKey === currentBook ? "is-current" : ""}
            aria-current={bookKey === currentBook ? "step" : undefined}
            key={bookKey}
            ref={bookKey === currentBook ? currentLevelRef : undefined}
          >
            {getBookLabel(bookKey)}
          </span>
        ))}
      </div>
    </header>
  );
}

function Under13Dialog({ onContinue, onClose, triggerRef }) {
  const dialogRef = useRef(null);
  const continueRef = useRef(null);

  useEffect(() => {
    const previousFocus = document.activeElement;
    continueRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (triggerRef.current) triggerRef.current.focus();
      else if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [onClose, triggerRef]);

  return (
    <div className="placement-dialog" role="presentation">
      <button
        className="placement-dialog__backdrop"
        type="button"
        aria-label="Cerrar información para menores de 13"
        onClick={onClose}
      />
      <section
        aria-describedby="under13-description"
        aria-labelledby="under13-title"
        aria-modal="true"
        className="placement-dialog__panel"
        ref={dialogRef}
        role="dialog"
        tabIndex={-1}
      >
        <button
          className="placement-dialog__close"
          type="button"
          aria-label="Cerrar"
          onClick={onClose}
        >
          ×
        </button>
        <p className="eyebrow-chip">Información importante</p>
        <h2 id="under13-title">¿El estudiante es menor de 13?</h2>
        <p id="under13-description">
          Puede completar el examen y ver su resultado. Para guardarlo o entrar
          al Portal se necesita un tutor con email verificado.
        </p>
        <div className="placement-dialog__actions">
          <button
            className="button button--primary"
            ref={continueRef}
            type="button"
            onClick={() => onContinue("under_13")}
          >
            Continuar como menor de 13
          </button>
          <button className="button button--ghost" type="button" onClick={onClose}>
            Volver
          </button>
        </div>
      </section>
    </div>
  );
}

function IntroScreen({ busy, error, resumeSnapshot, onStart, onResume }) {
  const [under13Open, setUnder13Open] = useState(false);
  const under13TriggerRef = useRef(null);

  return (
    <section className="diagnostic-intro" data-diagnostic-screen="intro">
      <div>
        <p className="eyebrow-chip">Evaluación inicial</p>
        <h2>Descubre tu punto de partida</h2>
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
            <button
              className="button button--ghost"
              type="button"
              onClick={() => onStart("age_13_plus")}
            >
              Empezar de nuevo
            </button>
          </>
        ) : (
          <>
            <button
              className="button button--primary"
              disabled={busy}
              type="button"
              onClick={() => onStart("age_13_plus")}
            >
              {busy ? "Preparando…" : "Comenzar examen"}
            </button>
            <button
              className="diagnostic-age-link"
              disabled={busy}
              ref={under13TriggerRef}
              type="button"
              onClick={() => setUnder13Open(true)}
            >
              ¿El estudiante es menor de 13?
            </button>
          </>
        )}
      </div>
      {error ? (
        <div className="diagnostic-error" role="alert">
          <strong>No pudimos activar el respaldo de siete días.</strong>
          <span>{error}</span>
        </div>
      ) : null}
      <div className="diagnostic-intro__facts" aria-label="Detalles del examen">
        <article>
          <strong>10–15 min</strong>
          <span>Tiempo aproximado</span>
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
          Esta es una recomendación de ubicación de AIT. Un asesor confirma el
          nivel final antes de la inscripción.
        </p>
      </div>
      {under13Open ? (
        <Under13Dialog
          onClose={() => setUnder13Open(false)}
          onContinue={(ageBand) => {
            setUnder13Open(false);
            onStart(ageBand);
          }}
          triggerRef={under13TriggerRef}
        />
      ) : null}
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
          {busy ? "Preparando tu resultado…" : "Ver mi nivel recomendado"}
        </button>
      </div>
    </section>
  );
}

function getClaimAttribution() {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get("utm_source") || "",
    utmMedium: params.get("utm_medium") || "",
    utmCampaign: params.get("utm_campaign") || "",
    utmContent: params.get("utm_content") || "",
    utmTerm: params.get("utm_term") || "",
    landingPath: `${window.location.pathname}${window.location.search}`,
  };
}

function claimErrorMessage(code) {
  return {
    passwordless_claim_unavailable:
      "El acceso sin contraseña todavía no está configurado. Tu resultado sigue visible y no se perdió.",
    magic_auth_rate_limited:
      "Ya enviamos varios códigos. Espera un minuto antes de solicitar otro.",
    magic_auth_code_invalid:
      "Ese código no es válido o ya venció. Revisa el email e inténtalo de nuevo.",
    claim_challenge_expired:
      "El código venció. Solicita uno nuevo para guardar tu resultado.",
    portal_identity_conflict:
      "Ese email ya está vinculado a otra identidad. Un asesor deberá ayudarte a resolverlo sin duplicar cuentas.",
    employee_account_student_claim_forbidden:
      "Ese email pertenece a una cuenta de empleado. Usa otro email para crear tu cuenta estudiantil.",
    claim_finalize_pending:
      "Tu email quedó verificado, pero todavía no pudimos guardar el resultado. Intenta completar el guardado otra vez.",
    guardian_onboarding_unavailable:
      "El guardado para tutores todavía no está activado. El resultado sigue visible en esta pestaña.",
    guardian_attestation_required:
      "El adulto debe confirmar que es el padre, madre o tutor autorizado.",
    guardian_notice_acceptance_required:
      "Revisa y acepta el aviso directo antes de continuar.",
    guardian_challenge_expired:
      "El código venció. Solicita uno nuevo para continuar.",
    guardian_email_verification_required:
      "Primero verifica el email del adulto.",
  }[code] || "No pudimos completar este paso. Tu resultado sigue visible; inténtalo de nuevo.";
}

function GuardianClaimPanel({ submission }) {
  const [step, setStep] = useState("offer");
  const [requestId, setRequestId] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [guardianFirstName, setGuardianFirstName] = useState("");
  const [guardianEmail, setGuardianEmail] = useState("");
  const [guardianAttested, setGuardianAttested] = useState(false);
  const [noticeAccepted, setNoticeAccepted] = useState(false);
  const [aiPracticeApproved, setAiPracticeApproved] = useState(false);
  const [advisorContactApproved, setAdvisorContactApproved] = useState(false);
  const [code, setCode] = useState("");
  const [childFirstName, setChildFirstName] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const requestCode = async (event) => {
    event.preventDefault();
    if (busy) return;
    const nextRequestId = createAttemptId();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/portal/guardian-onboarding/code", {
        method: "POST",
        credentials: "same-origin",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          requestId: nextRequestId,
          guardianFirstName,
          guardianEmail,
          guardianAttested,
          noticeAccepted,
          aiPracticeApproved,
          advisorContactApproved,
        }),
      });
      const body = await response.json();
      if (!response.ok || body.ok !== true) throw new Error(body.error || "guardian_onboarding_unavailable");
      setRequestId(nextRequestId);
      setChallengeId(body.challengeId);
      setStep("code");
    } catch (requestError) {
      setError(claimErrorMessage(requestError.message));
    } finally {
      setBusy(false);
    }
  };

  const verifyCode = async (event) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/portal/guardian-onboarding/verify", {
        method: "POST",
        credentials: "same-origin",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ challengeId, requestId, code }),
      });
      const body = await response.json();
      if (!response.ok || body.ok !== true) throw new Error(body.error || "magic_auth_code_invalid");
      setStep("child");
    } catch (verifyError) {
      setError(claimErrorMessage(verifyError.message));
    } finally {
      setBusy(false);
    }
  };

  const saveChild = async (event) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/portal/guardian-onboarding/finalize", {
        method: "POST",
        credentials: "same-origin",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ challengeId, requestId, childFirstName, submission }),
      });
      const body = await response.json();
      if (!response.ok || body.ok !== true) throw new Error(body.error || "guardian_finalize_conflict");
      setReceipt(body);
      setStep("success");
    } catch (saveError) {
      setError(claimErrorMessage(saveError.message));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="diagnostic-unlock diagnostic-unlock--guardian">
      {step === "offer" ? (
        <>
          <div>
            <p className="section-kicker">Cuenta de tutor requerida</p>
            <h3>El resultado permanece solo en esta sesión</h3>
            <p>
              No hace falta una cuenta para verlo. Un padre, madre o tutor puede
              guardar el resultado en su propia cuenta con un email verificado.
            </p>
          </div>
          <div className="diagnostic-claim-actions">
            <button className="button button--gold" type="button" onClick={() => setStep("details")}>
              Guardar como tutor
            </button>
          </div>
        </>
      ) : null}
      {step === "details" ? (
        <form className="diagnostic-claim-form" onSubmit={requestCode}>
          <div>
            <p className="section-kicker">Aviso directo al adulto</p>
            <h3>Verifica tu email antes de crear el perfil</h3>
            <p>
              AIT guardará el resultado en tu cuenta y creará un perfil vinculado
              con solo el nombre del menor y la banda “menor de 13”. No pedimos fecha
              de nacimiento ni email del menor.
            </p>
          </div>
          <label>Tu nombre<input autoComplete="given-name" maxLength={80} required type="text" value={guardianFirstName} onChange={(event) => setGuardianFirstName(event.target.value)} /></label>
          <label>Tu email<input autoComplete="email" maxLength={254} required type="email" value={guardianEmail} onChange={(event) => setGuardianEmail(event.target.value)} /></label>
          <label className="diagnostic-claim-check">
            <input checked={guardianAttested} required type="checkbox" onChange={(event) => setGuardianAttested(event.target.checked)} />
            <span>Confirmo que soy el padre, madre o tutor autorizado para dar este consentimiento.</span>
          </label>
          <label className="diagnostic-claim-check">
            <input checked={noticeAccepted} required type="checkbox" onChange={(event) => setNoticeAccepted(event.target.checked)} />
            <span>Leí el aviso y autorizo crear la cuenta del adulto, el perfil mínimo y guardar este resultado.</span>
          </label>
          <label className="diagnostic-claim-check">
            <input checked={aiPracticeApproved} type="checkbox" onChange={(event) => setAiPracticeApproved(event.target.checked)} />
            <span>También autorizo el acceso futuro a Study Buddy. Este permiso es opcional.</span>
          </label>
          <label className="diagnostic-claim-check">
            <input checked={advisorContactApproved} type="checkbox" onChange={(event) => setAdvisorContactApproved(event.target.checked)} />
            <span>También autorizo solicitar contacto de un asesor por email desde el Portal. Este permiso es opcional.</span>
          </label>
          <small>
            Recibirás un comprobante en el Portal con controles para retirar el
            consentimiento, desvincular el perfil o solicitar la eliminación.
          </small>
          {error ? <p className="diagnostic-claim-error" role="alert">{error}</p> : null}
          <div className="diagnostic-claim-form__actions">
            <button className="button button--gold" disabled={busy} type="submit">{busy ? "Enviando…" : "Enviar código al tutor"}</button>
            <button className="diagnostic-unlock__later" disabled={busy} type="button" onClick={() => setStep("offer")}>Ahora no</button>
          </div>
        </form>
      ) : null}
      {step === "code" ? (
        <form className="diagnostic-claim-form" onSubmit={verifyCode}>
          <div><p className="section-kicker">Email del tutor</p><h3>Escribe el código de 6 dígitos</h3><p>Lo enviamos a {guardianEmail}.</p></div>
          <label>Código<input autoComplete="one-time-code" inputMode="numeric" maxLength={6} minLength={6} pattern="[0-9]{6}" required type="text" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))} /></label>
          {error ? <p className="diagnostic-claim-error" role="alert">{error}</p> : null}
          <div className="diagnostic-claim-form__actions">
            <button className="button button--gold" disabled={busy} type="submit">{busy ? "Verificando…" : "Verificar email"}</button>
            <button className="diagnostic-unlock__later" disabled={busy} type="button" onClick={() => setStep("details")}>Cambiar email</button>
          </div>
        </form>
      ) : null}
      {step === "child" ? (
        <form className="diagnostic-claim-form" onSubmit={saveChild}>
          <div><p className="section-kicker">Email verificado</p><h3>Crea el perfil mínimo del menor</h3><p>Ahora sí podemos transferir el resultado de esta sesión.</p></div>
          <label>Nombre del menor<input autoComplete="off" maxLength={80} required type="text" value={childFirstName} onChange={(event) => setChildFirstName(event.target.value)} /></label>
          <small>No pedimos fecha de nacimiento, email, teléfono ni dirección del menor.</small>
          {error ? <p className="diagnostic-claim-error" role="alert">{error}</p> : null}
          <div className="diagnostic-claim-form__actions">
            <button className="button button--gold" disabled={busy} type="submit">{busy ? "Guardando…" : "Guardar resultado"}</button>
          </div>
        </form>
      ) : null}
      {step === "success" ? (
        <div className="diagnostic-claim-success" role="status">
          <p className="section-kicker">Autorización guardada</p>
          <h3>El perfil de {receipt?.child?.firstName} está vinculado</h3>
          <p>Comprobante: {receipt?.consent?.receiptCode}. Los permisos opcionales permanecen separados.</p>
          <a className="button button--gold" href={receipt?.portalHref || "/portal/"}>Abrir el Portal del tutor</a>
        </div>
      ) : null}
    </div>
  );
}

function ResultClaimPanel({ ageBand, attemptId, enabled, submission }) {
  return ageBand === "under_13"
    ? <GuardianClaimPanel submission={submission} />
    : <AdultResultClaimPanel attemptId={attemptId} enabled={enabled} />;
}

function AdultResultClaimPanel({ attemptId, enabled }) {
  const [step, setStep] = useState("offer");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [advisorContactRequested, setAdvisorContactRequested] = useState(false);
  const [code, setCode] = useState("");
  const [claimId, setClaimId] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState(null);

  const requestCode = async (event) => {
    event.preventDefault();
    if (!enabled || busy) return;
    setBusy(true);
    setError("");
    const nextClaimId = createAttemptId();
    try {
      const tokenResponse = await fetch(
        `/api/diagnostic/attempts/${encodeURIComponent(attemptId)}/claim-token`,
        {
          method: "POST",
          credentials: "same-origin",
        },
      );
      const tokenBody = await tokenResponse.json();
      if (!tokenResponse.ok || tokenBody.ok !== true) {
        throw new Error(tokenBody.error || "claim_token_unavailable");
      }
      const response = await fetch("/api/portal/result-claim/code", {
        method: "POST",
        credentials: "same-origin",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          attemptId,
          claimId: nextClaimId,
          claimToken: tokenBody.claimToken,
          firstName,
          email,
          advisorContactRequested,
          attribution: getClaimAttribution(),
        }),
      });
      const body = await response.json();
      if (!response.ok || body.ok !== true) {
        throw new Error(body.error || "magic_auth_delivery_failed");
      }
      setClaimId(nextClaimId);
      setChallengeId(body.challengeId);
      setStep("code");
    } catch (requestError) {
      setError(claimErrorMessage(requestError.message));
    } finally {
      setBusy(false);
    }
  };

  const verifyCode = async (event) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      let response = await fetch("/api/portal/result-claim/verify", {
        method: "POST",
        credentials: "same-origin",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ challengeId, claimId, code }),
      });
      let body = await response.json();
      if (body.error === "claim_finalize_pending" && body.retryable === true) {
        response = await fetch("/api/portal/result-claim/finalize", {
          method: "POST",
          credentials: "same-origin",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ challengeId, claimId }),
        });
        body = await response.json();
      }
      if (!response.ok || body.ok !== true) {
        throw new Error(body.error || "portal_claim_failed");
      }
      setReceipt(body);
      setStep("success");
      window.dispatchEvent(
        new CustomEvent("aitusa:placement-claimed", {
          detail: {
            accountCreated: true,
            advisorContactRequested,
            crmQueued: body.crmQueued === true,
            resultStatus: body.result?.status,
          },
        }),
      );
    } catch (verifyError) {
      setError(claimErrorMessage(verifyError.message));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="diagnostic-unlock">
      {step === "offer" ? (
        <>
          <div>
            <p className="section-kicker">Tu siguiente paso</p>
            <h3>Guarda tu resultado y practica 3–5 minutos</h3>
            <p>
              Crea acceso sin contraseña con nombre y email. Después podrás
              abrir tu plan y la práctica guiada de cinco turnos.
            </p>
          </div>
          <span>Sin contraseña · 1 práctica gratis</span>
          <div className="diagnostic-claim-actions">
            <button
              className="button button--gold"
              disabled={!enabled}
              type="button"
              onClick={() => setStep("details")}
            >
              Guardar mi resultado
            </button>
            {!enabled ? (
              <small>
                El guardado requiere el respaldo seguro del intento. Tu resultado
                sigue disponible en esta página.
              </small>
            ) : (
              <button
                className="diagnostic-unlock__later"
                type="button"
                onClick={() => setStep("declined")}
              >
                Ahora no
              </button>
            )}
          </div>
        </>
      ) : null}
      {step === "declined" ? (
        <div>
          <p className="section-kicker">Sin presión</p>
          <h3>Tu resultado sigue visible</h3>
          <p>Puedes revisar cursos o hablar con un asesor sin crear una cuenta.</p>
          <button
            className="diagnostic-unlock__later"
            type="button"
            onClick={() => setStep("offer")}
          >
            Quiero guardarlo
          </button>
        </div>
      ) : null}
      {step === "details" ? (
        <form className="diagnostic-claim-form" onSubmit={requestCode}>
          <div>
            <p className="section-kicker">Acceso sin contraseña</p>
            <h3>¿Dónde enviamos tu código?</h3>
          </div>
          <label>
            Nombre
            <input
              autoComplete="given-name"
              maxLength={80}
              required
              type="text"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
          </label>
          <label>
            Email
            <input
              autoComplete="email"
              maxLength={254}
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label className="diagnostic-claim-check">
            <input
              checked={advisorContactRequested}
              type="checkbox"
              onChange={(event) => setAdvisorContactRequested(event.target.checked)}
            />
            <span>
              Quiero que un asesor me contacte por email sobre mi resultado y
              próximos pasos.
            </span>
          </label>
          <small>
            Al continuar, aceptas los{" "}
            <a href="/terms-and-conditions/" target="_blank">Términos</a> y la{" "}
            <a href="/privacy-policy/" target="_blank">Política de Privacidad</a>.
            El contacto con un asesor es opcional.
          </small>
          {error ? <p className="diagnostic-claim-error" role="alert">{error}</p> : null}
          <div className="diagnostic-claim-form__actions">
            <button className="button button--gold" disabled={busy} type="submit">
              {busy ? "Enviando…" : "Enviar código"}
            </button>
            <button
              className="diagnostic-unlock__later"
              disabled={busy}
              type="button"
              onClick={() => setStep("offer")}
            >
              Volver
            </button>
          </div>
        </form>
      ) : null}
      {step === "code" ? (
        <form className="diagnostic-claim-form" onSubmit={verifyCode}>
          <div>
            <p className="section-kicker">Revisa tu email</p>
            <h3>Escribe el código de 6 dígitos</h3>
            <p>Lo enviamos a {email}. Vence en 10 minutos.</p>
          </div>
          <label>
            Código
            <input
              autoComplete="one-time-code"
              inputMode="numeric"
              maxLength={6}
              minLength={6}
              pattern="[0-9]{6}"
              required
              type="text"
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
            />
          </label>
          {error ? <p className="diagnostic-claim-error" role="alert">{error}</p> : null}
          <div className="diagnostic-claim-form__actions">
            <button className="button button--gold" disabled={busy} type="submit">
              {busy ? "Verificando…" : "Verificar y guardar"}
            </button>
            <button
              className="diagnostic-unlock__later"
              disabled={busy}
              type="button"
              onClick={() => setStep("details")}
            >
              Cambiar email
            </button>
          </div>
        </form>
      ) : null}
      {step === "success" ? (
        <div className="diagnostic-claim-success" role="status">
          <p className="section-kicker">Resultado guardado</p>
          <h3>Tu cuenta ya está lista, {receipt?.account?.firstName}</h3>
          <p>
            Tu email quedó verificado y tu resultado está vinculado de forma
            segura. No necesitas crear una contraseña.
          </p>
          <a className="button button--gold" href={receipt?.portalHref || "/portal/"}>
            Abrir mi portal
          </a>
          <ContactPreferencePanel attemptId={attemptId} />
        </div>
      ) : null}
    </div>
  );
}

function ContactPreferencePanel({ attemptId }) {
  const [choice, setChoice] = useState("");
  const [mobile, setMobile] = useState("");
  const [allowed, setAllowed] = useState(false);
  const [saved, setSaved] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const save = async (event) => {
    event.preventDefault();
    const needsMobile = ["sms", "whatsapp", "phone"].includes(choice);
    if (busy || !choice || (choice !== "none" && !allowed) || (needsMobile && !mobile.trim())) return;
    if (choice === "none") {
      setSaved("none");
      setError("");
      return;
    }
    setBusy(true); setError("");
    try {
      const consents = {
        email: choice === "email",
        serviceSms: choice === "sms",
        marketingSms: false,
        phone: choice === "phone",
        whatsapp: choice === "whatsapp",
      };
      const response = await fetch("/api/portal/placement-contact-preferences", { method: "POST", credentials: "same-origin", headers: { "content-type": "application/json" }, body: JSON.stringify({ attemptId, preferredChannel: choice, mobile: needsMobile ? mobile : undefined, consents, sourceUrl: window.location.href }) });
      const body = await response.json(); if (!response.ok || body.ok !== true) throw new Error(body.error || "placement_contact_unavailable");
      setSaved(choice);
    } catch { setError("No pudimos guardar esta preferencia. Tu resultado permanece guardado."); } finally { setBusy(false); }
  };
  return <form className="diagnostic-claim-form" onSubmit={save}>
    <fieldset disabled={saved || busy}>
      <legend>Preferencia de contacto (opcional)</legend>
      {[["email", "Email"], ["sms", "SMS"], ["whatsapp", "WhatsApp"], ["phone", "Llamada telefónica"]].map(([value, label]) => <label className="diagnostic-claim-check" key={value}><input checked={choice === value} type="radio" name="placement-channel" value={value} onChange={() => { setChoice(value); setAllowed(false); }} /><span>{label}</span></label>)}
      <label className="diagnostic-claim-check"><input checked={choice === "none"} type="radio" name="placement-channel" value="none" onChange={() => { setChoice("none"); setAllowed(false); }} /><span>No quiero contacto adicional por ahora.</span></label>
      {["sms", "whatsapp", "phone"].includes(choice) ? <label>Teléfono móvil<input type="tel" inputMode="tel" autoComplete="tel" value={mobile} onChange={(event) => setMobile(event.target.value)} placeholder="+1 732 555 0123" required /><small>Incluye el código de país. Guardaremos este número como información de contacto; no se usará para iniciar sesión.</small></label> : null}
      {choice !== "none" && choice ? <label className="diagnostic-claim-check"><input checked={allowed} type="checkbox" onChange={(event) => setAllowed(event.target.checked)} /><span>{contactPermissionCopy(choice)}</span></label> : null}
      <small>Esta preferencia no autoriza marketing. WhatsApp se limita al contacto individual de un asesor; no activa mensajes automatizados.</small>
    </fieldset>
    {error ? <p className="diagnostic-claim-error" role="alert">{error}</p> : null}
    {saved && saved !== "none" ? <p role="status">Preferencia de contacto guardada.</p> : null}
    {saved === "none" ? <p role="status">No guardamos una preferencia de contacto adicional.</p> : null}
    {!saved ? <button className="button button--ghost" disabled={!choice || (choice !== "none" && !allowed) || (["sms", "whatsapp", "phone"].includes(choice) && !mobile.trim()) || busy} type="submit">{busy ? "Guardando…" : choice === "none" ? "Continuar sin contacto" : "Guardar preferencia"}</button> : null}
  </form>;
}

function contactPermissionCopy(choice) {
  if (choice === "email") return "Autorizo que AIT USA me contacte por email sobre mi resultado.";
  if (choice === "sms") return "Autorizo SMS de servicio sobre mi resultado. Pueden aplicar tarifas; responde STOP para cancelar.";
  if (choice === "phone") return "Autorizo que un asesor de AIT USA me llame sobre mi resultado.";
  return "Autorizo que un asesor de AIT USA me contacte individualmente por WhatsApp sobre mi resultado.";
}

function ResultScreen({
  ageBand,
  attemptId,
  completedCount,
  durable,
  goal,
  onRestart,
  result,
  skippedCount,
  submission,
  syncNotice,
}) {
  const recommendation = result?.recommendation;
  const scores = result?.scores || {};
  if (!recommendation) return null;

  return (
    <section className="diagnostic-result" data-diagnostic-screen="result">
      <div className="diagnostic-result__hero">
        <p className="eyebrow-chip">Nivel recomendado</p>
        <span className="diagnostic-result__label">Pendiente de confirmación</span>
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
        {scores.borderlineReviewRequired ? (
          <p>
            <strong>Revisión recomendada:</strong> quedaste a una respuesta del
            siguiente nivel. El asesor puede usar tu escritura y contexto para
            confirmar si avanzas.
          </p>
        ) : null}
        <p>
          <strong>Confirmación académica:</strong> un asesor revisa esta
          recomendación contigo antes de definir nivel, horario e inscripción.
        </p>
        {scores.answerKeyStatus === "approved" ? (
          <p className="diagnostic-result__provisional">
            La recomendación usa bloques consecutivos aprobados por AIT. Un
            resultado limítrofe o de Nivel 6 se revisa con la escritura y el
            contexto del estudiante; no representa una certificación CEFR.
          </p>
        ) : (
          <p className="diagnostic-result__provisional">
            Este resultado usa la regla académica disponible cuando completaste
            el examen. Un asesor confirma tu nivel antes de la inscripción.
          </p>
        )}
        {syncNotice ? (
          <p className="diagnostic-result__provisional">{syncNotice}</p>
        ) : null}
      </div>
      <ResultClaimPanel
        ageBand={ageBand}
        attemptId={attemptId}
        enabled={ageBand === "under_13" ? Boolean(submission) : durable && Boolean(attemptId)}
        submission={submission}
      />
      <div className="diagnostic-result__support" aria-label="Otras formas de continuar">
        <p>¿Prefieres decidir con ayuda?</p>
        <div className="diagnostic-result__support-links">
          <a
            className="diagnostic-result__support-link"
            href={result.advisorHandoff?.href || site.whatsappHref}
            rel="noreferrer"
            target="_blank"
          >
            Confirmar con un asesor
          </a>
          <a className="diagnostic-result__support-link" href="/cursos/">
            Ver cursos
          </a>
        </div>
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
        book: level.book,
        levelLabel: level.level.replace(/\s*\(.*\)$/, ""),
      })),
    );
  }, []);

  const advanceTimer = useRef(null);
  const attemptIdRef = useRef("");
  const completionIdRef = useRef("");
  const durableRef = useRef(false);
  const revisionRef = useRef(0);
  const syncFailedRef = useRef(false);
  const syncQueue = useRef(Promise.resolve());
  const [screen, setScreen] = useState("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(() => createEmptyAnswers(flatQuestions.length));
  const [skipped, setSkipped] = useState([]);
  const [selfAssessment, setSelfAssessment] = useState({});
  const [reflectionIndex, setReflectionIndex] = useState(0);
  const [goal, setGoal] = useState("");
  const [writingSample, setWritingSample] = useState("");
  const [attemptId, setAttemptId] = useState("");
  const [ageBand, setAgeBand] = useState("age_13_plus");
  const [durable, setDurable] = useState(false);
  const [serverRevision, setServerRevision] = useState(0);
  const [resumeSnapshot, setResumeSnapshot] = useState(null);
  const [reviewReturn, setReviewReturn] = useState(false);
  const [direction, setDirection] = useState("forward");
  const [pendingAdvance, setPendingAdvance] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [syncNotice, setSyncNotice] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const restore = async () => {
      let saved = null;
      try {
        saved = normalizeSnapshot(
          JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null"),
          flatQuestions.length,
        );
      } catch {
        sessionStorage.removeItem(SESSION_KEY);
      }

      if (saved && saved.durable !== true) {
        if (!cancelled) setResumeSnapshot(saved);
        return;
      }

      try {
        const response = await fetch("/api/diagnostic/attempts/resume", {
          cache: "no-store",
          credentials: "same-origin",
        });
        const body = response.ok ? await response.json() : null;
        const serverSnapshot = buildServerResumeSnapshot(
          body,
          flatQuestions.length,
        );
        if (cancelled) return;
        if (!saved) {
          if (serverSnapshot) setResumeSnapshot(serverSnapshot);
          return;
        }
        if (
          serverSnapshot &&
          (
            serverSnapshot.result ||
            serverSnapshotMatchesLocal(serverSnapshot, saved)
          )
        ) {
          setResumeSnapshot(
            serverSnapshot.result
              ? serverSnapshot
              : { ...saved, serverRevision: serverSnapshot.serverRevision },
          );
          return;
        }
        setResumeSnapshot({
          ...saved,
          durable: false,
          syncNotice:
            "Recuperamos tus respuestas de esta pestaña, pero continuaremos sin respaldo en línea para no perder ningún cambio.",
        });
      } catch {
        if (!cancelled && saved) {
          setResumeSnapshot({
            ...saved,
            durable: false,
            syncNotice:
              "Recuperamos tus respuestas de esta pestaña y continuaremos sin respaldo en línea.",
          });
        }
      }
    };
    restore();
    return () => {
      if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
      cancelled = true;
    };
  }, [flatQuestions.length]);

  useEffect(() => {
    if (!["question", "review", "reflection", "goal"].includes(screen)) return;
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
      version: SESSION_VERSION,
      attemptId,
      ageBand,
      durable,
      serverRevision,
      screen,
      questionIndex,
      answers,
      skipped,
      selfAssessment,
      reflectionIndex,
      goal,
      writingSample,
      syncNotice,
      result,
    }));
  }, [
    answers,
    ageBand,
    attemptId,
    durable,
    goal,
    questionIndex,
    reflectionIndex,
    screen,
    serverRevision,
    selfAssessment,
    skipped,
    syncNotice,
    writingSample,
    result,
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

  const beginNewAttempt = async (nextAgeBand) => {
    if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    sessionStorage.removeItem(SESSION_KEY);
    const requestId = createAttemptId();
    const requestSecret = createRequestSecret();
    let nextAttemptId = requestId;
    let nextDurable = false;
    let nextRevision = 0;
    setBusy(true);
    setError("");
    setSyncNotice("");
    setAgeBand(nextAgeBand);
    if (nextAgeBand === "age_13_plus") {
      try {
        const response = await fetch("/api/diagnostic/attempts", {
          method: "POST",
          credentials: "same-origin",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ requestId, requestSecret, ageBand: nextAgeBand }),
        });
        const body = await response.json();
        if (!response.ok || body.ok !== true || body.durable !== true) {
          throw new Error(body.error || "diagnostic_storage_unavailable");
        }
        nextAttemptId = body.attempt.id;
        nextDurable = true;
        nextRevision = body.attempt.revision;
      } catch {
        setSyncNotice(
          "Puedes continuar de todos modos; el avance quedará guardado solo en esta pestaña.",
        );
      }
    }
    attemptIdRef.current = nextAttemptId;
    completionIdRef.current = "";
    durableRef.current = nextDurable;
    revisionRef.current = nextRevision;
    syncFailedRef.current = false;
    syncQueue.current = Promise.resolve();
    setAttemptId(nextAttemptId);
    setDurable(nextDurable);
    setServerRevision(nextRevision);
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
    setBusy(false);
  };

  const resumeAttempt = () => {
    if (!resumeSnapshot) return;
    const nextAttemptId = resumeSnapshot.attemptId || createAttemptId();
    const nextDurable = resumeSnapshot.durable === true;
    const nextRevision = Number(resumeSnapshot.serverRevision || 0);
    attemptIdRef.current = nextAttemptId;
    completionIdRef.current = "";
    durableRef.current = nextDurable;
    revisionRef.current = nextRevision;
    syncFailedRef.current = false;
    syncQueue.current = Promise.resolve();
    setAttemptId(nextAttemptId);
    setAgeBand(resumeSnapshot.ageBand || "age_13_plus");
    setDurable(nextDurable);
    setServerRevision(nextRevision);
    setAnswers(resumeSnapshot.answers);
    setSkipped(resumeSnapshot.skipped);
    setSelfAssessment(resumeSnapshot.selfAssessment);
    setReflectionIndex(resumeSnapshot.reflectionIndex || 0);
    setQuestionIndex(resumeSnapshot.questionIndex);
    setGoal(resumeSnapshot.goal || "");
    setWritingSample(resumeSnapshot.writingSample || "");
    setSyncNotice(resumeSnapshot.syncNotice || "");
    setResult(resumeSnapshot.result || null);
    setDirection("forward");
    setScreen(
      ["question", "review", "reflection", "goal", "result"].includes(resumeSnapshot.screen)
        ? resumeSnapshot.screen
        : "question",
    );
  };

  const queueAnswerMutation = (index, value) => {
    if (!durableRef.current || syncFailedRef.current) return;
    const mutationId = createAttemptId();
    const currentAttemptId = attemptIdRef.current;
    syncQueue.current = syncQueue.current
      .then(async () => {
        if (syncFailedRef.current) return;
        const response = await fetch(
          `/api/diagnostic/attempts/${encodeURIComponent(currentAttemptId)}`,
          {
            method: "PATCH",
            credentials: "same-origin",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              mutationId,
              expectedRevision: revisionRef.current,
              questionKey: questionKey(index),
              answerState: value === null ? "skipped" : "answered",
              answerValue: value,
            }),
          },
        );
        const body = await response.json();
        if (!response.ok || body.ok !== true) {
          throw new Error(body.error || "diagnostic_answer_sync_failed");
        }
        revisionRef.current = body.revision;
        setServerRevision(body.revision);
      })
      .catch(() => {
        syncFailedRef.current = true;
        setDurable(false);
        setSyncNotice(
          "Perdimos el respaldo en línea, pero tus respuestas siguen seguras en esta pestaña.",
        );
      });
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
    queueAnswerMutation(questionIndex, option);
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
    queueAnswerMutation(questionIndex, null);
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
    const payload = {
      attemptId,
      student: {},
      selfAssessment: Object.fromEntries(
        placementTest.selfAssessments.map((group) => [
          group.key,
          Number(selfAssessment[group.key] || 0),
        ]),
      ),
      selectedAnswers: answers,
      goal,
      writingSample,
      consent: { advisorHandoff: false },
    };

    try {
      await syncQueue.current;
      let body;
      if (durableRef.current && !syncFailedRef.current) {
        if (!completionIdRef.current) completionIdRef.current = createAttemptId();
        const response = await fetch(
          `/api/diagnostic/attempts/${encodeURIComponent(attemptIdRef.current)}/complete`,
          {
            method: "POST",
            credentials: "same-origin",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              completionId: completionIdRef.current,
              expectedRevision: revisionRef.current,
              selfAssessment: payload.selfAssessment,
              goal,
              writingSample,
            }),
          },
        );
        const completed = await response.json();
        if (!response.ok || completed.ok !== true) {
          throw new Error(completed.error || "diagnostic_completion_failed");
        }
        revisionRef.current = completed.attempt.revision;
        setServerRevision(completed.attempt.revision);
        body = completed.result;
      } else {
        const response = await fetch("/api/placement-test", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        });
        body = await response.json();
        if (!response.ok || body.ok !== true) throw new Error("placement_api_rejected");
      }
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
          storageEnabled: durableRef.current && !syncFailedRef.current,
          submittedAt: new Date().toISOString(),
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
    setDurable(false);
    setSyncNotice("");
    durableRef.current = false;
    completionIdRef.current = "";
  };

  return (
    <div className="section-inner diagnostic-shell" data-placement-form>
      <div className="diagnostic-shell__brand" aria-hidden="true">
        <span>AIT</span>
        <small>Placement Diagnostic</small>
      </div>
      {screen === "intro" ? (
        <IntroScreen
          busy={busy}
          error={error}
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
          ageBand={ageBand}
          attemptId={attemptId}
          completedCount={flatQuestions.length - skipped.length}
          durable={durable}
          goal={goal}
          onRestart={restart}
          result={result}
          skippedCount={skipped.length}
          submission={{ selectedAnswers: answers, selfAssessment, goal, writingSample }}
          syncNotice={syncNotice}
        />
      ) : null}
    </div>
  );
}
