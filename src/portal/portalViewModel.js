const COURSE_BY_LEVEL = Object.freeze({
  basic: Object.freeze({
    eyebrow: "Inglés básico",
    title: "Construye una base para conversaciones reales",
    href: "/cursos/ingles-jovenes-adultos/",
  }),
  intermediate: Object.freeze({
    eyebrow: "Inglés intermedio",
    title: "Gana fluidez y confianza al comunicarte",
    href: "/cursos/ingles-jovenes-adultos/",
  }),
  advanced: Object.freeze({
    eyebrow: "Inglés avanzado",
    title: "Refina precisión, naturalidad y comprensión",
    href: "/cursos/ingles-jovenes-adultos/",
  }),
});

const FALLBACK_COURSE = COURSE_BY_LEVEL.basic;

export const PORTAL_NAVIGATION = Object.freeze([
  Object.freeze({ id: "home", label: "Inicio", icon: "home", href: "/portal/" }),
  Object.freeze({ id: "results", label: "Mi nivel", icon: "spark", href: "/portal/results/" }),
  Object.freeze({ id: "courses", label: "Mis cursos", icon: "courses", href: "/portal/courses/" }),
  Object.freeze({ id: "attendance", label: "Asistencia", icon: "calendar", href: "/portal/attendance/" }),
  Object.freeze({ id: "study", label: "Estudiar", icon: "study", href: "/portal/study/" }),
  Object.freeze({ id: "account", label: "Cuenta", icon: "account", href: "/portal/account/" }),
]);

export function createAuthenticatedPortalViewModel(snapshot, { welcome = false } = {}) {
  if (!snapshot?.account || snapshot.account.status !== "active") {
    throw new Error("active_portal_snapshot_required");
  }

  const firstName = cleanText(snapshot.account.firstName, "Estudiante");
  const result = snapshot.result ? normalizeResult(snapshot.result) : null;
  const course = result ? resolveCourse(result.recommendedLevelKey) : null;
  const practice = normalizePractice(snapshot.practice, result);
  const advisor = normalizeAdvisor(snapshot.advisor);

  return {
    state: "ready",
    welcome,
    account: {
      firstName,
      email: cleanText(snapshot.account.email, ""),
      accountType: snapshot.account.accountType || "adult_student",
      preferredLanguage: snapshot.account.preferredLanguage || "es",
    },
    greeting: timeGreeting(new Date()),
    navigation: PORTAL_NAVIGATION,
    result,
    course,
    practice,
    advisor,
    enrollment: normalizeEnrollment(snapshot.enrollment),
    recentPractice: Array.isArray(snapshot.recentPractice)
      ? snapshot.recentPractice.map(normalizePracticeSummary).slice(0, 3)
      : [],
    guardianChild: normalizeGuardianChild(snapshot.guardianChild),
  };
}

function normalizeGuardianChild(child) {
  if (!child?.id || !child.firstName) return null;
  return {
    id: String(child.id),
    firstName: cleanText(child.firstName, "Menor vinculado"),
    status: ["active", "deletion_requested"].includes(child.status)
      ? child.status
      : "active",
    receiptCode: cleanText(child.receiptCode, ""),
    policyVersion: cleanText(child.policyVersion, ""),
    permissions: {
      aiPracticeApproved: child.permissions?.aiPracticeApproved === true,
      advisorContactApproved: child.permissions?.advisorContactApproved === true,
      marketingSmsOptIn: false,
    },
  };
}

export function createPortalAccessViewModel(reason = "session_required") {
  const unavailable = [
    "portal_auth_unavailable",
    "identity_provider_unavailable",
    "portal_auth_service_not_configured",
  ].includes(reason);
  if (unavailable) {
    return {
      state: "unavailable",
      eyebrow: "Servicio temporalmente pausado",
      title: "Tu información sigue segura",
      summary:
        "No pudimos abrir el portal en este momento. Tu resultado no se perdió; vuelve a intentar en unos minutos.",
      actionLabel: "Intentar de nuevo",
      actionHref: "/portal/",
      secondaryAction: {
        label: "Contactar soporte",
        href: "/contactanos",
      },
    };
  }
  const expired = reason === "portal_session_invalid" || reason === "session_expired";
  const signedOut =
    expired ||
    reason === "portal_session_required" ||
    reason === "session_required";
  if (signedOut) {
    return {
      state: "signed_out",
      eyebrow: expired ? "Tu sesión terminó" : "Acceso seguro",
      title: expired ? "Vuelve a entrar para continuar" : "Entra a tu portal",
      summary: expired
        ? "Tu resultado y tu progreso siguen guardados. Usa el mismo email para recuperar tu cuenta."
        : "Recupera tu resultado guardado y continúa con tu próxima práctica sin contraseña.",
      actionLabel: "Recibir código por email",
      actionHref: "/portal/sign-in/",
      secondaryAction: {
        label: "Todavía no guardé un resultado",
        href: "/placement-test/",
      },
    };
  }
  if (
    [
      "portal_account_unavailable",
      "portal_account_locked",
      "portal_account_disabled",
      "portal_account_review_required",
      "portal_access_denied",
      "guardian_verification_required",
    ].includes(reason)
  ) {
    return {
      state: "blocked",
      eyebrow: "Cuenta en revisión",
      title: "Necesitamos ayudarte con el acceso",
      summary:
        "Tu información sigue guardada, pero esta cuenta necesita una revisión antes de mostrar datos del portal.",
      actionLabel: "Contactar soporte",
      actionHref: "/contactanos",
      secondaryAction: {
        label: "Volver al inicio",
        href: "/",
      },
    };
  }
  return {
    state: "error",
    eyebrow: "No pudimos abrir el portal",
    title: "Tu información sigue guardada",
    summary:
      "Ocurrió un problema al cargar tu cuenta. Intenta de nuevo; si continúa, un asesor puede ayudarte.",
    actionLabel: "Intentar de nuevo",
    actionHref: "/portal/",
    secondaryAction: {
      label: "Contactar soporte",
      href: "/contactanos",
    },
  };
}

function normalizeResult(result) {
  return {
    status: result.status || "provisional",
    attemptId: cleanText(result.attemptId, ""),
    recommendedLevelKey: cleanText(result.recommendedLevelKey, "basic"),
    recommendedLevelLabel: cleanText(
      result.recommendedLevelLabel,
      "Punto de partida por confirmar",
    ),
    answeredQuestionCount: boundedNumber(result.answeredQuestionCount, 0, 62),
    skippedQuestionCount: boundedNumber(result.skippedQuestionCount, 0, 62),
    advisorConfirmationRequired: result.advisorConfirmationRequired !== false,
    placementReviewStatus: cleanText(result.placementReviewStatus, "pending"),
    finalLevel: cleanText(result.finalLevel, ""),
    goal: cleanText(result.goal, ""),
    completedAt: normalizeIso(result.completedAt),
    productContractVersion: cleanText(result.productContractVersion, ""),
  };
}

function normalizePractice(practice, result) {
  if (!result) {
    return {
      eligible: false,
      reason: "placement_result_required",
      status: "locked",
      headline: "Completa tu examen de ubicación",
      summary: "Necesitamos un punto de partida antes de preparar tu práctica.",
      href: "/placement-test/",
      actionLabel: "Hacer examen",
      statusLabel: "Primero completa tu ubicación",
    };
  }

  if (practice?.eligible !== true) {
    const reason =
      practice?.eligible === false
        ? practice.reason || "practice_unavailable"
        : "practice_state_invalid";
    const deniedState = practiceDeniedState(reason);
    return {
      eligible: false,
      reason,
      ...deniedState,
    };
  }

  return {
    eligible: true,
    reason: null,
    status: practice?.status || "ready",
    headline: cleanText(practice?.headline, "Presentarte con confianza"),
    summary: cleanText(
      practice?.summary,
      "Una conversación guiada con cinco turnos, ayuda cuando la necesites y una corrección a la vez.",
    ),
    scenarioKey: cleanText(practice?.scenarioKey, "introductions"),
    durationLabel: "3–5 min",
    turnLabel: "5 turnos",
    href: "/portal/study/",
    actionLabel: practice?.status === "in_progress" ? "Continuar práctica" : "Empezar práctica",
    statusLabel: "Lista para comenzar",
  };
}

function practiceDeniedState(reason) {
  const states = {
    trial_consumed: {
      status: "complete",
      headline: "Tu primera práctica ya está completa",
      summary: "Puedes revisar lo que practicaste y ver tu próximo paso.",
      href: "#historial-practica",
      actionLabel: "Ver resumen",
      statusLabel: "Práctica inicial completada",
    },
    guardian_required: {
      status: "locked",
      headline: "Falta verificar al adulto responsable",
      summary:
        "Para menores de 13 años, la práctica se habilita después de verificar y vincular la cuenta del adulto responsable.",
      href: "/contactanos",
      actionLabel: "Solicitar ayuda",
      statusLabel: "Verificación del adulto requerida",
    },
    trial_limit_reached: {
      status: "complete",
      headline: "Tu práctica inicial ya fue utilizada",
      summary:
        "Tu resultado sigue guardado. Revisa el resumen o habla con un asesor sobre el siguiente paso.",
      href: "#historial-practica",
      actionLabel: "Ver resumen",
      statusLabel: "Límite de la práctica inicial alcanzado",
    },
    provider_unavailable: {
      status: "unavailable",
      headline: "La práctica no está disponible ahora",
      summary:
        "Tu resultado sigue guardado. Intenta de nuevo más tarde; no necesitas repetir el examen.",
      href: "/portal/",
      actionLabel: "Intentar de nuevo",
      statusLabel: "Servicio temporalmente pausado",
    },
    feature_not_approved: {
      status: "pending",
      headline: "La práctica guiada todavía no está disponible",
      summary:
        "Tu resultado sigue guardado. Esta función todavía no está disponible en tu cuenta.",
      href: "#resultado",
      actionLabel: "Ver mi resultado",
      statusLabel: "Esta función todavía no está disponible",
    },
  };

  return (
    states[reason] || {
      status: "unavailable",
      headline: "La práctica todavía no está disponible",
      summary:
        "Tu resultado sigue guardado. Vuelve más tarde o habla con un asesor si necesitas ayuda.",
      href: "/contactanos",
      actionLabel: "Contactar soporte",
      statusLabel: "Función no disponible",
    }
  );
}

function normalizeAdvisor(advisor) {
  const requested = advisor?.requested === true;
  const deliveryStatus = advisor?.deliveryStatus || (requested ? "pending" : "not_requested");
  if (!requested) {
    return {
      requested: false,
      deliveryStatus,
      label: "Hablar con un asesor",
      summary: "Aclara horarios, modalidad y el nivel recomendado antes de inscribirte.",
    };
  }
  const acknowledged = deliveryStatus === "delivered";
  const needsAttention = deliveryStatus === "needs_attention" || deliveryStatus === "not_queued";
  return {
    requested: true,
    deliveryStatus,
    label: acknowledged
      ? "Solicitud confirmada"
      : needsAttention
        ? "Solicitud pendiente de revisión"
        : "Solicitud pendiente de confirmación",
    summary: acknowledged
      ? "Un asesor recibió tu solicitud y confirmará el nivel final contigo."
      : needsAttention
        ? "Tu resultado sigue guardado. Vuelve a intentarlo más tarde o contacta soporte."
        : "Tu resultado sigue guardado. Estamos confirmando tu solicitud con un asesor.",
  };
}

function normalizeEnrollment(enrollment) {
  if (!enrollment?.active) {
    return {
      active: false,
      title: "Todavía no vemos un curso activo",
      summary: "Tu resultado está guardado mientras eliges el programa que mejor encaja contigo.",
    };
  }
  return {
    active: true,
    title: cleanText(enrollment.title, "Curso activo"),
    summary: cleanText(enrollment.summary, ""),
  };
}

function normalizePracticeSummary(item) {
  return {
    scenarioLabel: cleanText(item?.scenarioLabel, "Práctica guiada"),
    completedAt: normalizeIso(item?.completedAt),
    successLabel: cleanText(item?.successLabel, "Completaste la conversación"),
    focusLabel: cleanText(item?.focusLabel, ""),
  };
}

function resolveCourse(levelKey = "") {
  const normalized = String(levelKey).toLowerCase();
  if (
    normalized.includes("advanced") ||
    normalized.includes("nivel-3") ||
    normalized.startsWith("book-3")
  ) {
    return COURSE_BY_LEVEL.advanced;
  }
  if (
    normalized.includes("intermediate") ||
    normalized.includes("nivel-2") ||
    normalized.startsWith("book-2")
  ) {
    return COURSE_BY_LEVEL.intermediate;
  }
  if (
    normalized.includes("basic") ||
    normalized.includes("nivel-1") ||
    normalized.startsWith("book-1")
  ) {
    return FALLBACK_COURSE;
  }
  return null;
}

function timeGreeting(date) {
  const hour = Number.parseInt(
    new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      hourCycle: "h23",
      timeZone: "America/New_York",
    }).format(date),
    10,
  );
  if (hour < 12) return "Buenos días";
  if (hour < 19) return "Buenas tardes";
  return "Buenas noches";
}

function cleanText(value, fallback) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function boundedNumber(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.min(max, Math.max(min, Math.round(number)));
}

function normalizeIso(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}
