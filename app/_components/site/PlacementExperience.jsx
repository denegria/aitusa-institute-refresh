"use client";

import { useMemo, useRef, useState } from "react";
import { placementTest, site } from "../../../src/content";

function StudentFields() {
  return placementTest.studentFields.map((field) => (
    <label key={field.name}>
      {field.label}
      {field.type === "select" ? (
        <select name={field.name} required={field.required} defaultValue="">
          <option value="">Selecciona una opción</option>
          {field.options.map((option) => <option value={option} key={option}>{option}</option>)}
        </select>
      ) : (
        <input name={field.name} type={field.type} required={field.required} />
      )}
      {field.help ? <small>{field.help}</small> : null}
    </label>
  ));
}

function SelfAssessmentFields() {
  return placementTest.selfAssessments.map((group) => (
    <fieldset className="assessment-card" key={group.key}>
      <legend>{group.label}</legend>
      {group.options.map((option, index) => (
        <label key={option}>
          <input type="radio" name={group.key} value={index} required={index === 0} />
          <span>{option}</span>
        </label>
      ))}
    </fieldset>
  ));
}

function QuizQuestions() {
  let offset = 0;
  return placementTest.questions.map((level) => {
    const start = offset;
    offset += level.items.length;
    return (
      <section className="quiz-level" key={level.level}>
        <div className="quiz-level__heading">
          <h3>{level.level}</h3>
          <span>{level.items.length} preguntas</span>
        </div>
        <div className="quiz-level__items">
          {level.items.map((question, localIndex) => {
            const questionIndex = start + localIndex;
            return (
              <fieldset className="quiz-card" key={question.prompt}>
                <legend>{question.prompt}</legend>
                {question.options.map((option, index) => (
                  <label key={`${questionIndex}-${option}`}>
                    <input
                      type="radio"
                      name={`question-${questionIndex}`}
                      value={option === question.answer ? 1 : 0}
                      required={index === 0}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </fieldset>
            );
          })}
        </div>
      </section>
    );
  });
}

function RecommendationResult({ body, goal }) {
  if (!body) return <p>Completa los pasos anteriores para ver tu recomendación.</p>;
  const recommendation = body.recommendation;
  const scores = body.scores || {};
  return (
    <>
      <p className="eyebrow-chip">Recomendación orientativa</p>
      <h3>{recommendation.level}</h3>
      <p>{recommendation.recommendation || recommendation.copy}</p>
      <p><strong>Puntaje:</strong> {scores.totalScore} de {scores.maxScore} puntos.</p>
      <p><strong>Preguntas:</strong> {scores.quizScore} de {scores.quizQuestionCount} respuestas correctas.</p>
      <p><strong>Formato sugerido:</strong> {recommendation.bestFit || ""}</p>
      <p><strong>Objetivo principal:</strong> {goal || "Sin objetivo indicado"}</p>
      <p><strong>Confirmación:</strong> un asesor revisa el resultado contigo antes de definir nivel, horario e inscripción.</p>
      <p><strong>Importante:</strong> esta recomendación necesita confirmación de un asesor antes de cerrar inscripción u horario.</p>
    </>
  );
}

export function PlacementExperience() {
  const formRef = useRef(null);
  const flatQuestions = useMemo(
    () => placementTest.questions.flatMap((level) => level.items || []),
    [],
  );
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [goal, setGoal] = useState("");

  const buildPayload = () => {
    const formData = new FormData(formRef.current);
    return {
      student: Object.fromEntries(
        placementTest.studentFields.map((field) => [
          field.name,
          String(formData.get(field.name) || "").trim(),
        ]),
      ),
      selfAssessment: Object.fromEntries(
        placementTest.selfAssessments.map((group) => [
          group.key,
          Number(formData.get(group.key) || 0),
        ]),
      ),
      quizAnswers: flatQuestions.map((_, index) => Number(formData.get(`question-${index}`) || 0)),
      goal: String(formData.get("goal") || "").trim(),
      writingSample: String(formData.get("writingSample") || "").trim(),
      consent: { advisorHandoff: true },
      submittedAt: new Date().toISOString(),
    };
  };

  const buildFallbackResult = (payload) => {
    const quizScore = payload.quizAnswers.reduce((total, value) => total + Number(value || 0), 0);
    const selfAssessmentScore = placementTest.selfAssessments.reduce(
      (total, group) => total + Number(payload.selfAssessment[group.key] || 0),
      0,
    );
    const average = Math.round(selfAssessmentScore / Math.max(1, placementTest.selfAssessments.length));
    const totalScore = quizScore + average;
    const recommendation = placementTest.recommendations.find(
      (item) => totalScore >= item.min && totalScore <= item.max,
    ) || placementTest.recommendations[0];
    const message = [
      "Hola AIT USA, ya completé el examen de ubicación.",
      `Nombre: ${payload.student.name || "Estudiante"}`,
      `Ciudad/Pais: ${payload.student.city || "Sin ciudad"}`,
      `WhatsApp/telefono: ${payload.student.phone || "Sin telefono"}`,
      `Email: ${payload.student.email || "Sin email"}`,
      `Grupo de edad: ${payload.student.ageGroup || "Sin grupo indicado"}`,
      `Objetivo: ${payload.goal || "Sin objetivo indicado"}`,
      `Resultado sugerido: ${recommendation.level}`,
      `Puntaje orientativo: ${totalScore}`,
      `Detalle: ${recommendation.recommendation || recommendation.copy}`,
      "Quiero confirmar esta recomendación con un asesor.",
    ].join("\n");
    return {
      ok: true,
      recommendation,
      scores: {
        quizScore,
        quizQuestionCount: payload.quizAnswers.length,
        selfAssessmentScore,
        selfAssessmentAverage: average,
        totalScore,
        maxScore: payload.quizAnswers.length + 3,
        gradingMode: "automatic_provisional",
        answerKeyStatus: "pending_academic_review",
      },
      advisorHandoff: {
        href: `${site.whatsappHref}?text=${encodeURIComponent(message)}`,
        message,
        confirmationRequired: true,
      },
      crmWrite: false,
      storageEnabled: false,
    };
  };

  const validateStep = () => {
    const panel = formRef.current?.querySelector(`[data-step-panel="${step}"]`);
    const fields = [...(panel?.querySelectorAll("input, select") || [])];
    for (const field of fields) {
      if (!field.checkValidity()) {
        field.reportValidity();
        return false;
      }
    }
    return true;
  };

  const buildResult = async () => {
    const payload = buildPayload();
    setGoal(payload.goal);
    setBusy(true);
    try {
      const response = await fetch("/api/placement-test", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await response.json();
      if (!response.ok || !body.ok) throw new Error("placement_api_rejected");
      setResult(body);
      window.dispatchEvent(new CustomEvent("aitusa:placement-ready", {
        detail: {
          totalScore: body.scores?.totalScore,
          goal: payload.goal,
          recommendation: body.recommendation,
          crmWrite: false,
          storageEnabled: false,
          submittedAt: new Date().toISOString(),
        },
      }));
    } catch {
      const fallback = buildFallbackResult(payload);
      setResult(fallback);
      window.dispatchEvent(new CustomEvent("aitusa:placement-ready", {
        detail: {
          totalScore: fallback.scores.totalScore,
          goal: payload.goal,
          recommendation: fallback.recommendation,
          crmWrite: false,
          storageEnabled: false,
          submittedAt: new Date().toISOString(),
        },
      }));
    } finally {
      setBusy(false);
    }
  };

  const next = async () => {
    if (step === 4) {
      formRef.current?.reset();
      setResult(null);
      setGoal("");
      setStep(0);
      return;
    }
    if (!validateStep()) return;
    if (step === 3) {
      await buildResult();
      setStep(4);
      return;
    }
    setStep((value) => value + 1);
  };

  return (
    <div className="section-inner placement-layout">
      <aside className="placement-sidebar card">
        <p className="section-kicker">Pasos</p>
        <ol className="placement-steps">
          {[
            placementTest.steps.student,
            placementTest.steps.selfAssessment,
            placementTest.steps.quiz,
            placementTest.steps.goals,
            placementTest.steps.result,
          ].map((label, index) => (
            <li className={step === index ? "is-active" : ""} data-step-indicator={index} key={label}>{label}</li>
          ))}
        </ol>
        <p className="sidebar-note">{placementTest.crmNote || ""}</p>
      </aside>
      <form className="placement-form card" data-placement-form ref={formRef} noValidate onSubmit={(event) => event.preventDefault()}>
        <section className={`placement-panel${step === 0 ? " is-active" : ""}`} data-step-panel="0" data-placement-panel="0" hidden={step !== 0}>
          <h2>Tus datos</h2>
          <div className="form-grid"><StudentFields /></div>
        </section>
        <section className={`placement-panel${step === 1 ? " is-active" : ""}`} data-step-panel="1" data-placement-panel="1" hidden={step !== 1}>
          <h2>Cómo te sientes hoy</h2>
          <div className="assessment-grid"><SelfAssessmentFields /></div>
        </section>
        <section className={`placement-panel${step === 2 ? " is-active" : ""}`} data-step-panel="2" data-placement-panel="2" hidden={step !== 2}>
          <h2>Preguntas rápidas</h2>
          <div className="quiz-stack"><QuizQuestions /></div>
        </section>
        <section className={`placement-panel${step === 3 ? " is-active" : ""}`} data-step-panel="3" data-placement-panel="3" hidden={step !== 3}>
          <h2>Tu objetivo principal</h2>
          <label className="writing-prompt">
            <span><strong>{placementTest.writingPrompt.title}</strong>{placementTest.writingPrompt.prompt}</span>
            <textarea name="writingSample" rows="5" placeholder="Escribe aquí tu respuesta breve." />
            <small>{placementTest.writingPrompt.note || ""}</small>
          </label>
          <fieldset className="goal-options">
            <legend>Selecciona el motivo principal por el que quieres estudiar ahora.</legend>
            {placementTest.goals.map((item, index) => (
              <label className="goal-option" key={item}>
                <input type="radio" name="goal" value={item} required={index === 0} />
                <span>{item}</span>
              </label>
            ))}
          </fieldset>
        </section>
        <section className={`placement-panel placement-panel--result${step === 4 ? " is-active" : ""}`} data-step-panel="4" data-placement-panel="4" hidden={step !== 4}>
          <h2>Tu recomendación inicial</h2>
          <div className="result-card" data-placement-result><RecommendationResult body={result} goal={goal} /></div>
          <div className="result-actions" data-placement-actions hidden={!result}>
            <a className="button button--primary" data-placement-whatsapp href={result?.advisorHandoff?.href || site.whatsappHref} target="_blank" rel="noreferrer">
              Enviar resultado por WhatsApp
            </a>
            <a className="button button--ghost" href="/courses/">Ver cursos detallados</a>
          </div>
          <p className="placement-footnote">Esta recomendación es orientativa y debe ser confirmada por un asesor antes de tu inscripción final.</p>
        </section>
        <div className="placement-nav">
          <button className="button button--ghost" type="button" data-placement-back hidden={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))}>Atrás</button>
          <button className="button button--primary" type="button" data-placement-next disabled={busy} onClick={next}>
            {busy ? "Calculando recomendación..." : step === 3 ? "Ver recomendación" : step === 4 ? "Reiniciar" : "Siguiente"}
          </button>
        </div>
      </form>
    </div>
  );
}
