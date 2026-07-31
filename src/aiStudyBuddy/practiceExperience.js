import { resolvePracticePlan } from "./practicePlan.js";

const MISSIONS = Object.freeze({
  daily_routine: Object.freeze({
    eyebrow: "Vida diaria",
    title: "Cuenta cómo empieza tu día",
    goal: "Usa frases cortas para describir una rutina con claridad.",
    model: "I usually wake up at seven. Then I make coffee.",
    phrases: Object.freeze(["I usually…", "Then I…"]),
    successLabel: "Describiste una rutina en inglés",
    nextLabel: "Próxima práctica: hablar de planes para mañana",
    prompts: Object.freeze([
      prompt("Completa el modelo", "Dime a qué hora empieza tu día.", "I usually wake up at…"),
      prompt("Añade una acción", "Cuenta qué haces después.", "Then I…"),
      prompt("Conecta dos ideas", "Describe dos pasos de tu mañana.", "First I… Then I…"),
      prompt("Hazlo personal", "Cuenta una parte de tu rutina que disfrutas.", "I like… because…"),
      prompt("Cierra la misión", "Resume tu mañana en dos o tres frases.", "Usually I… Then I…"),
    ]),
  }),
  workplace_exchange: Object.freeze({
    eyebrow: "Inglés para el trabajo",
    title: "Pide ayuda con claridad",
    goal: "Explica una necesidad y confirma el próximo paso con confianza.",
    model: "Could you help me with this report? I need it by Friday.",
    phrases: Object.freeze(["Could you help me…?", "I need… by…"]),
    successLabel: "Pediste ayuda y aclaraste un plazo",
    nextLabel: "Próxima práctica: confirmar detalles en una reunión",
    prompts: Object.freeze([
      prompt("Haz una petición", "Pide ayuda con una tarea sencilla.", "Could you help me with…?"),
      prompt("Añade el plazo", "Explica cuándo necesitas terminarla.", "I need it by…"),
      prompt("Aclara un detalle", "Pregunta qué información falta.", "What information do you need?"),
      prompt("Responde con confianza", "Confirma lo que harás después.", "I’ll send it…"),
      prompt("Cierra el intercambio", "Une la petición, el plazo y el próximo paso.", "Could you…? I need… I’ll…"),
    ]),
  }),
  guided_discussion: Object.freeze({
    eyebrow: "Conversación avanzada",
    title: "Expresa y matiza una opinión",
    goal: "Presenta una idea, apóyala y reconoce otra perspectiva.",
    model: "In my view, flexible schedules help people focus, although they require clear communication.",
    phrases: Object.freeze(["In my view…", "Although…"]),
    successLabel: "Expresaste una opinión con un matiz claro",
    nextLabel: "Próxima práctica: defender una recomendación",
    prompts: Object.freeze([
      prompt("Toma una posición", "Da tu opinión sobre horarios flexibles.", "In my view…"),
      prompt("Da una razón", "Explica por qué piensas así.", "One reason is…"),
      prompt("Añade un ejemplo", "Apoya tu idea con una situación concreta.", "For example…"),
      prompt("Reconoce otro punto", "Menciona una limitación o perspectiva diferente.", "Although…"),
      prompt("Cierra la discusión", "Resume tu posición y su principal matiz.", "Overall… although…"),
    ]),
  }),
});

const FEEDBACK = Object.freeze({
  meaning_acknowledged: Object.freeze({
    eyebrow: "Mensaje claro",
    title: "Se entendió lo que querías decir",
    detail: "Ahora repítelo una vez con el modelo o continúa al siguiente paso.",
  }),
  try_again: Object.freeze({
    eyebrow: "Casi listo",
    title: "La idea está ahí; prueba una frase más corta",
    detail: "Usa la ayuda de este turno y vuelve a intentarlo una vez.",
  }),
  session_complete: Object.freeze({
    eyebrow: "Misión cumplida",
    title: "Completaste los cinco turnos",
    detail: "Tu resumen guarda solo el logro y el próximo enfoque.",
  }),
  support_recommended: Object.freeze({
    eyebrow: "Pausa útil",
    title: "Un asesor puede ayudarte a continuar",
    detail: "Tu resultado sigue guardado y no necesitas repetir el examen.",
  }),
});

const RECOVERY = Object.freeze({
  guardian_unresolved: recovery(
    "Verificación necesaria",
    "Falta verificar al adulto responsable",
    "Para menores de 13 años, la práctica se habilita después de verificar y vincular la cuenta del adulto responsable.",
    "Solicitar ayuda",
    "/contactanos",
  ),
  missing_result: recovery(
    "Primero tu ubicación",
    "Necesitamos un punto de partida",
    "Completa el examen para preparar una práctica acorde con tu resultado guardado.",
    "Hacer examen",
    "/placement-test/",
  ),
  trial_consumed: recovery(
    "Práctica completada",
    "Tu primera misión ya está guardada",
    "Puedes revisar el resumen y continuar con el próximo paso recomendado.",
    "Volver al portal",
    "/portal/#historial-practica",
  ),
  daily_limit_reached: recovery(
    "Límite diario",
    "Tu práctica de hoy terminó",
    "Tu progreso está seguro. Vuelve mañana para continuar.",
    "Volver al portal",
    "/portal/",
  ),
  session_limit_reached: recovery(
    "Límite de sesión",
    "Esta misión llegó a su límite",
    "Tu resultado sigue guardado. Vuelve al portal para revisar el próximo paso.",
    "Volver al portal",
    "/portal/",
  ),
  provider_disabled: recovery(
    "Práctica temporalmente pausada",
    "Study Buddy todavía no está disponible",
    "Tu resultado sigue guardado. No necesitas repetir el examen y no se realizó ninguna llamada de IA.",
    "Volver al portal",
    "/portal/",
  ),
  provider_unavailable: recovery(
    "Interrupción temporal",
    "No pudimos completar este turno",
    "Descartamos el audio o texto de este intento. Tu resultado y resumen siguen seguros.",
    "Volver al portal",
    "/portal/",
  ),
  circuit_open: recovery(
    "Servicio en recuperación",
    "La práctica está tomando una pausa",
    "Protegimos tu sesión mientras el servicio se recupera. Intenta de nuevo más tarde.",
    "Volver al portal",
    "/portal/",
  ),
  account_blocked: recovery(
    "Cuenta en revisión",
    "Necesitamos ayudarte con el acceso",
    "Tu información sigue guardada, pero la cuenta requiere revisión antes de practicar.",
    "Contactar soporte",
    "/contactanos",
  ),
  unauthenticated: recovery(
    "Sesión terminada",
    "Vuelve a entrar para continuar",
    "Tu resultado y progreso siguen guardados.",
    "Recibir código por email",
    "/portal/sign-in/",
  ),
});

export function createPracticeExperienceModel({ result, eligibility }) {
  const code = eligibility?.code || "provider_unavailable";
  const plan = resolvePracticePlan(result);
  if (code !== "authenticated" || !plan) {
    return {
      state: "blocked",
      code: plan ? code : "missing_result",
      recovery: RECOVERY[plan ? code : "missing_result"] || RECOVERY.provider_unavailable,
    };
  }
  const mission = MISSIONS[plan.scenario];
  return {
    state: "ready",
    code,
    levelLabel: cleanText(result?.recommendedLevelLabel, "Nivel recomendado"),
    goalLabel: cleanText(result?.goal, "Conversación práctica"),
    contractVersion: "mis-342-experience-v1",
    mission: {
      scenario: plan.scenario,
      useCase: plan.useCase,
      ...mission,
      prompts: mission.prompts.map((item, index) => ({ ...item, turn: index + 1 })),
    },
    feedback: FEEDBACK,
  };
}

export function toPortalPracticeState(eligibility, result) {
  const code = eligibility?.code || "provider_unavailable";
  if (code === "authenticated") {
    const plan = resolvePracticePlan(result);
    if (!plan) return { eligible: false, reason: "practice_unavailable" };
    const mission = MISSIONS[plan.scenario];
    return {
      eligible: true,
      status: "ready",
      scenarioKey: plan.scenario,
      headline: mission.title,
      summary: mission.goal,
    };
  }
  const reasonByCode = {
    guardian_unresolved: "guardian_required",
    trial_consumed: "trial_consumed",
    daily_limit_reached: "daily_limit_reached",
    session_limit_reached: "trial_limit_reached",
    provider_disabled: "provider_unavailable",
    provider_unavailable: "provider_unavailable",
    circuit_open: "provider_unavailable",
    missing_result: "placement_result_required",
  };
  return { eligible: false, reason: reasonByCode[code] || "practice_unavailable" };
}

export function recoveryForStudyBuddyCode(code) {
  return RECOVERY[code] || RECOVERY.provider_unavailable;
}

function prompt(title, instruction, hint) {
  return Object.freeze({ title, instruction, hint });
}

function recovery(eyebrow, title, summary, actionLabel, actionHref) {
  return Object.freeze({ eyebrow, title, summary, actionLabel, actionHref });
}

function cleanText(value, fallback) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}
