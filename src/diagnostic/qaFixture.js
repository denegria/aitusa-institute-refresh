const QA_STATES = new Set(["contact", "otp", "result", "study"]);
const QA_CHANNELS = new Set(["email", "sms", "whatsapp", "phone"]);

function normalized(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function normalizePlacementQaState(value) {
  const state = normalized(value);
  return QA_STATES.has(state) ? state : "contact";
}

export function normalizePlacementQaChannel(value) {
  const channel = normalized(value);
  return QA_CHANNELS.has(channel) ? channel : "email";
}

export function isPlacementQaFixturePath(pathname) {
  return pathname === "/placement-test/qa" || pathname.startsWith("/placement-test/qa/");
}

export function getPlacementQaFixtureAvailability(environment = process.env) {
  const vercelEnvironment = normalized(environment?.VERCEL_ENV);
  const vercelTargetEnvironment = normalized(environment?.VERCEL_TARGET_ENV);
  const isVercelDeployment = normalized(environment?.VERCEL) === "1";
  const isProduction =
    vercelEnvironment === "production" ||
    vercelTargetEnvironment === "production";

  if (isProduction) return { available: false, reason: "production_disabled" };
  if (vercelEnvironment || vercelTargetEnvironment) {
    return { available: true, reason: "non_production_environment" };
  }
  return {
    available: !isVercelDeployment,
    reason: isVercelDeployment ? "vercel_environment_unknown" : "local_development",
  };
}

export function isPlacementQaFixtureAvailable(environment = process.env) {
  return getPlacementQaFixtureAvailability(environment).available;
}

export function getPlacementQaFixtureGateResponse(environment = process.env) {
  if (isPlacementQaFixtureAvailable(environment)) return null;
  return new Response("Not Found", {
    status: 404,
    headers: {
      "cache-control": "private, no-store",
      "content-type": "text/plain; charset=utf-8",
    },
  });
}

export function createPlacementQaFixture({ state, channel } = {}) {
  const normalizedState = normalizePlacementQaState(state);
  const normalizedChannel = normalizePlacementQaChannel(channel);
  const receipt = {
    account: { firstName: "Estudiante QA" },
    contactPreferenceSaved: true,
    crmQueued: false,
    portalHref: "#qa-portal",
    practiceEligible: true,
    result: { status: "validated" },
  };

  return {
    state: normalizedState,
    channel: normalizedChannel,
    firstName: "Estudiante QA",
    email: "placement.qa@example.test",
    mobile: normalizedChannel === "email" ? "" : "2015550100",
    code: "123456",
    claimId: "qa-claim-0001",
    challengeId: "qa-challenge-0001",
    receipt,
    result: {
      ok: true,
      attemptId: "qa-attempt-0001",
      practiceEligible: true,
      recommendation: {
        key: "book-2-upper",
        level: "Nivel 3 / Book 2",
        recommendation:
          "Tu desempeño muestra una base sólida para trabajar en Book 2. Un asesor confirmará contigo el mejor punto de inicio.",
      },
      scores: {
        quizScore: 38,
        quizQuestionCount: 62,
        answeredQuestionCount: 60,
        skippedQuestionCount: 2,
        answerKeyStatus: "approved",
        borderlineReviewRequired: false,
      },
      advisorHandoff: { href: "#qa-advisor" },
    },
  };
}
