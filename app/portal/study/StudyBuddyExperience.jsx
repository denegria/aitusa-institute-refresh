"use client";

import { useEffect, useRef, useState } from "react";
import { recoveryForStudyBuddyCode } from "../../../src/aiStudyBuddy/practiceExperience.js";
import styles from "./StudyBuddyExperience.module.css";

const MAX_RECORDING_MS = 20_000;

export function StudyBuddyExperience({ account, model }) {
  const [phase, setPhase] = useState(model.state === "ready" ? "ready" : "blocked");
  const [session, setSession] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [recovery, setRecovery] = useState(model.recovery || null);
  const [textMode, setTextMode] = useState(true);
  const [text, setText] = useState("");
  const [retryUsed, setRetryUsed] = useState(false);
  const [isRetry, setIsRetry] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const inputRef = useRef(null);
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const recordingStartedRef = useRef(0);
  const stopTimerRef = useRef(null);

  const mission = model.mission || null;
  const completedTurns = session?.turnCount || 0;
  const activeTurn = isRetry
    ? Math.max(completedTurns, 1)
    : Math.min(completedTurns + 1, 5);
  const prompt = mission?.prompts?.[activeTurn - 1] || mission?.prompts?.at(-1);

  useEffect(() => {
    if (phase === "active" && textMode) inputRef.current?.focus();
  }, [phase, textMode, activeTurn]);

  useEffect(() => () => releaseMicrophone(), []);

  async function startPractice() {
    setPhase("starting");
    setAnnouncement("Preparando tu misión.");
    try {
      const response = await fetch("/api/portal/ai-study-buddy/sessions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{}",
      });
      const body = await safeJson(response);
      if (!response.ok || !body.session) return showRecovery(body.code);
      setSession(body.session);
      setPhase(body.session.state === "completed" ? "completed" : "active");
      setAnnouncement(
        body.replayed ? "Retomamos tu práctica." : "Tu primera pregunta está lista.",
      );
    } catch {
      showRecovery("network_interruption");
    }
  }

  async function submitText(event) {
    event.preventDefault();
    const value = text.trim();
    if (!value) return;
    await submitTurn({ text: value });
  }

  async function submitTurn(input) {
    if (!session?.id) return showRecovery("session_expired");
    setPhase("processing");
    setAnnouncement("Revisando tu respuesta.");
    const operationId = createOperationId();
    try {
      const response = await fetch(
        `/api/portal/ai-study-buddy/sessions/${encodeURIComponent(session.id)}/turns`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            operationId,
            retryAttempt: isRetry ? 1 : 0,
            ...input,
          }),
        },
      );
      const body = await safeJson(response);
      setText("");
      if (!response.ok) return showRecovery(body.code);
      if (body.session) setSession(body.session);
      if (["completed", "escalated"].includes(body.code)) {
        setPhase(body.code === "completed" ? "completed" : "escalated");
        setAnnouncement(
          body.code === "completed"
            ? "Misión completada. Tu resumen está listo."
            : "La práctica terminó y puedes pedir ayuda a un asesor.",
        );
        return;
      }
      const feedbackCode = body.feedback || "meaning_acknowledged";
      setFeedback(model.feedback[feedbackCode] || model.feedback.meaning_acknowledged);
      setRetryUsed(isRetry || retryUsed);
      setIsRetry(false);
      setPhase("feedback");
      setAnnouncement("Recibiste una corrección enfocada.");
    } catch {
      showRecovery("network_interruption");
    }
  }

  function continuePractice() {
    setFeedback(null);
    setRetryUsed(false);
    setIsRetry(false);
    setPhase("active");
    setAnnouncement(`Turno ${Math.min((session?.turnCount || 0) + 1, 5)} de 5.`);
  }

  function retryTurn() {
    setFeedback(null);
    setRetryUsed(true);
    setIsRetry(true);
    setPhase("active");
    setAnnouncement("Puedes repetir este turno una vez.");
  }

  async function requestMicrophone() {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setTextMode(true);
      setAnnouncement("El micrófono no está disponible. Puedes escribir tu respuesta.");
      return;
    }
    setPhase("microphone_request");
    setAnnouncement("Esperando permiso para usar el micrófono.");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      streamRef.current = stream;
      recorderRef.current = recorder;
      chunksRef.current = [];
      recorder.addEventListener("dataavailable", (event) => {
        if (event.data.size) chunksRef.current.push(event.data);
      });
      recorder.addEventListener("stop", finishRecording, { once: true });
      recordingStartedRef.current = performance.now();
      recorder.start();
      stopTimerRef.current = window.setTimeout(stopRecording, MAX_RECORDING_MS);
      setPhase("recording");
      setAnnouncement("Grabando. Activa Detener cuando termines.");
    } catch {
      releaseMicrophone();
      setTextMode(true);
      setPhase("active");
      setAnnouncement("No pudimos usar el micrófono. Puedes escribir tu respuesta.");
    }
  }

  function stopRecording() {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
  }

  async function finishRecording() {
    const durationSeconds = Math.max(
      0.1,
      Math.min(20, (performance.now() - recordingStartedRef.current) / 1000),
    );
    const type = recorderRef.current?.mimeType || "audio/webm";
    const blob = new Blob(chunksRef.current, { type });
    const bytes = blob.size;
    chunksRef.current = [];
    releaseMicrophone();
    if (bytes < 1 || bytes > 262144) {
      setPhase("active");
      setTextMode(true);
      setAnnouncement("La grabación no se pudo usar. Escribe tu respuesta para continuar.");
      return;
    }
    await submitTurn({
      audio: {
        bytes,
        durationSeconds: Math.round(durationSeconds * 10) / 10,
        contentType: supportedAudioType(type),
      },
    });
  }

  function showRecovery(code) {
    releaseMicrophone();
    setRecovery(
      code === "network_interruption"
        ? {
            eyebrow: "Conexión interrumpida",
            title: "No sabemos si el turno llegó completo",
            summary:
              "Para proteger tu límite, no enviaremos el mismo turno otra vez. Vuelve al portal e inténtalo más tarde.",
            actionLabel: "Volver al portal",
            actionHref: "/portal/",
          }
        : recoveryForStudyBuddyCode(code),
    );
    setPhase("blocked");
    setAnnouncement("La práctica se pausó con una opción segura para continuar.");
  }

  function releaseMicrophone() {
    if (stopTimerRef.current) window.clearTimeout(stopTimerRef.current);
    stopTimerRef.current = null;
    for (const track of streamRef.current?.getTracks?.() || []) track.stop();
    streamRef.current = null;
    recorderRef.current = null;
    chunksRef.current = [];
  }

  return (
    <main className={styles.page}>
      <a className={styles.skipLink} href="#practice-main">Saltar a la práctica</a>
      <header className={styles.topbar}>
        <a className={styles.brand} href="/portal/" aria-label="Volver al portal de AIT USA">
          <span aria-hidden="true">AIT</span>
          <strong>Study Buddy</strong>
        </a>
        <div className={styles.sessionMeta}>
          <span>3–5 min</span>
          <span>5 turnos</span>
        </div>
      </header>

      <div className={styles.announcement} aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      <section className={styles.shell} id="practice-main">
        <aside className={styles.context} aria-label="Contexto de la misión">
          <a className={styles.backLink} href="/portal/">← Volver al portal</a>
          {mission ? (
            <>
              <p className={styles.eyebrow}>Tu misión · {mission.eyebrow}</p>
              <h1>{mission.title}</h1>
              <p>{mission.goal}</p>
              <dl className={styles.contextFacts}>
                <div><dt>Nivel</dt><dd>{model.levelLabel}</dd></div>
                <div><dt>Objetivo</dt><dd>{model.goalLabel}</dd></div>
              </dl>
              <div className={styles.privacyNote}>
                <strong>Práctica privada</strong>
                <p>El audio y el texto se descartan al terminar cada turno. Solo guardamos un resumen de progreso.</p>
              </div>
            </>
          ) : null}
        </aside>

        <div className={styles.stage}>
          {phase === "blocked" ? <RecoveryCard recovery={recovery} /> : null}
          {phase === "ready" ? (
            <ReadyCard account={account} mission={mission} onStart={startPractice} />
          ) : null}
          {phase === "starting" ? <StatusCard label="Preparando tu misión…" /> : null}
          {["active", "microphone_request", "recording", "processing"].includes(phase) ? (
            <ActiveTurn
              activeTurn={activeTurn}
              isRetry={isRetry}
              mission={mission}
              onRequestMicrophone={requestMicrophone}
              onStopRecording={stopRecording}
              onSubmitText={submitText}
              phase={phase}
              prompt={prompt}
              setText={setText}
              setTextMode={setTextMode}
              text={text}
              textMode={textMode}
              inputRef={inputRef}
            />
          ) : null}
          {phase === "feedback" ? (
            <FeedbackCard
              activeTurn={Math.max(session?.turnCount || 1, 1)}
              feedback={feedback}
              hint={mission.prompts[Math.max((session?.turnCount || 1) - 1, 0)]?.hint}
              onContinue={continuePractice}
              onRetry={retryTurn}
              retryUsed={retryUsed}
            />
          ) : null}
          {phase === "completed" ? <CompletionCard mission={mission} /> : null}
          {phase === "escalated" ? (
            <RecoveryCard recovery={recoveryForStudyBuddyCode("account_blocked")} />
          ) : null}
        </div>
      </section>
    </main>
  );
}

function ReadyCard({ account, mission, onStart }) {
  return (
    <article className={styles.card}>
      <p className={styles.eyebrow}>Lista para comenzar</p>
      <h2>{account.firstName ? `${account.firstName}, esta misión es para ti` : "Esta misión es para ti"}</h2>
      <div className={styles.modelCard}>
        <span>Modelo</span>
        <p lang="en">{mission.model}</p>
      </div>
      <div className={styles.phrases} aria-label="Frases útiles">
        {mission.phrases.map((phrase) => <span lang="en" key={phrase}>{phrase}</span>)}
      </div>
      <p className={styles.disclosure}>Study Buddy usa IA con límites estrictos. En esta versión de prueba, las respuestas son determinísticas y no generan costo.</p>
      <button className={styles.primaryButton} type="button" onClick={onStart}>Comenzar misión</button>
    </article>
  );
}

function ActiveTurn(props) {
  const busy = ["microphone_request", "processing"].includes(props.phase);
  return (
    <article className={styles.card} aria-busy={busy}>
      <Progress current={props.activeTurn} />
      <div className={styles.turnHeading}>
        <p className={styles.eyebrow}>{props.isRetry ? "Reintento" : `Turno ${props.activeTurn} de 5`}</p>
        <h2>{props.prompt.title}</h2>
        <p>{props.prompt.instruction}</p>
      </div>
      <div className={styles.hint}><span>Ayuda</span><p lang="en">{props.prompt.hint}</p></div>
      {props.phase === "recording" ? (
        <div className={styles.recording} role="status">
          <span className={styles.pulse} aria-hidden="true" />
          <strong>Grabando tu respuesta…</strong>
          <button className={styles.stopButton} type="button" onClick={props.onStopRecording}>Detener y enviar</button>
        </div>
      ) : props.phase === "processing" ? (
        <StatusCard label="Revisando una sola mejora…" compact />
      ) : props.phase === "microphone_request" ? (
        <StatusCard label="Esperando permiso para usar el micrófono…" compact />
      ) : props.textMode ? (
        <form className={styles.answerForm} onSubmit={props.onSubmitText}>
          <label htmlFor="study-buddy-answer">Tu respuesta en inglés</label>
          <textarea
            id="study-buddy-answer"
            maxLength={480}
            onChange={(event) => props.setText(event.target.value)}
            placeholder="Escribe una frase corta…"
            ref={props.inputRef}
            rows={3}
            value={props.text}
          />
          <div className={styles.answerActions}>
            <button className={styles.secondaryButton} type="button" onClick={() => props.setTextMode(false)}>Usar micrófono</button>
            <button className={styles.primaryButton} type="submit" disabled={!props.text.trim()}>Enviar respuesta</button>
          </div>
        </form>
      ) : (
        <div className={styles.voiceChoice}>
          <p>El micrófono solo escucha cuando tú lo activas y se detiene automáticamente a los 20 segundos.</p>
          <button className={styles.micButton} type="button" onClick={props.onRequestMicrophone}>Empezar a grabar</button>
          <button className={styles.textButton} type="button" onClick={() => props.setTextMode(true)}>Prefiero escribir</button>
        </div>
      )}
    </article>
  );
}

function FeedbackCard({ activeTurn, feedback, hint, onContinue, onRetry, retryUsed }) {
  return (
    <article className={`${styles.card} ${styles.feedbackCard}`}>
      <Progress current={activeTurn} completedThrough={activeTurn} />
      <p className={styles.eyebrow}>{feedback.eyebrow}</p>
      <h2>{feedback.title}</h2>
      <p>{feedback.detail}</p>
      <div className={styles.correction}><span>Un enfoque</span><p lang="en">{hint}</p></div>
      <div className={styles.feedbackActions}>
        <button className={styles.primaryButton} type="button" onClick={onContinue}>Continuar</button>
        <button className={styles.secondaryButton} type="button" onClick={onRetry} disabled={retryUsed}>{retryUsed ? "Reintento utilizado" : "Intentar una vez más"}</button>
      </div>
    </article>
  );
}

function CompletionCard({ mission }) {
  return (
    <article className={`${styles.card} ${styles.completionCard}`}>
      <div className={styles.completionMark} aria-hidden="true">✓</div>
      <p className={styles.eyebrow}>Misión cumplida</p>
      <h2>{mission.successLabel}</h2>
      <p>Completaste cinco turnos. Guardamos el logro y el próximo enfoque, nunca tus frases ni tu audio.</p>
      <div className={styles.nextMission}><span>Siguiente paso</span><strong>{mission.nextLabel}</strong></div>
      <a className={styles.primaryButton} href="/portal/#historial-practica">Ver mi resumen</a>
    </article>
  );
}

function RecoveryCard({ recovery }) {
  return (
    <article className={`${styles.card} ${styles.recoveryCard}`}>
      <p className={styles.eyebrow}>{recovery.eyebrow}</p>
      <h1>{recovery.title}</h1>
      <p>{recovery.summary}</p>
      <a className={styles.primaryButton} href={recovery.actionHref}>{recovery.actionLabel}</a>
      <a className={styles.textButton} href="/contactanos">Contactar soporte</a>
    </article>
  );
}

function StatusCard({ label, compact = false }) {
  return <div className={compact ? styles.statusCompact : styles.card} role="status"><span className={styles.spinner} aria-hidden="true" />{label}</div>;
}

function Progress({ current, completedThrough = 0 }) {
  return (
    <ol className={styles.progress} aria-label={`Progreso: turno ${current} de 5`}>
      {[1, 2, 3, 4, 5].map((step) => (
        <li className={step <= completedThrough ? styles.complete : step === current ? styles.current : ""} key={step} aria-current={step === current ? "step" : undefined}>
          <span>{step}</span>
        </li>
      ))}
    </ol>
  );
}

function createOperationId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `turn-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

async function safeJson(response) {
  try { return await response.json(); } catch { return {}; }
}

function supportedAudioType(value) {
  for (const type of ["audio/webm", "audio/mp4", "audio/ogg", "audio/wav"]) {
    if (String(value).toLowerCase().startsWith(type)) return type;
  }
  return "audio/webm";
}
