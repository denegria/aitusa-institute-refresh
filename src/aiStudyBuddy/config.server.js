const LOCKED_MODELS = Object.freeze({
  transcription: "openai/gpt-4o-mini-transcribe",
  teaching: "openai/gpt-5.4-mini",
  speech: "openai/tts-1",
});

export const STUDY_BUDDY_LIMITS = Object.freeze({
  version: "mis-340-limits-v1",
  maxLearnerTurns: 5,
  maxRetriesPerTurn: 1,
  sessionMinutes: 5,
  maxTextCharacters: 480,
  maxAudioBytes: 262144,
  maxAudioSeconds: 20,
  maxAudioTypeCharacters: 64,
  maxJsonBodyBytes: 16_384,
  providerDeadlineMs: 10_000,
  circuitFailureThreshold: 3,
  circuitOpenMs: 60_000,
  maxSessionMicroUsd: 0,
  maxDayMicroUsd: 0,
});

export function getStudyBuddyConfig(environment = process.env) {
  const executionEnabled = environment.STUDY_BUDDY_EXECUTION_ENABLED === "true";
  const providerApproved = environment.STUDY_BUDDY_PROVIDER_APPROVED === "true";
  const guardianSourceApproved = environment.STUDY_BUDDY_GUARDIAN_SOURCE_APPROVED === "true";
  const sessionBudget = positiveInteger(environment.STUDY_BUDDY_MAX_SESSION_MICRO_USD);
  const dailyBudget = positiveInteger(environment.STUDY_BUDDY_MAX_DAY_MICRO_USD);
  const validBudgets = sessionBudget !== null && dailyBudget !== null && dailyBudget >= sessionBudget;
  const enabled =
    executionEnabled &&
    providerApproved &&
    guardianSourceApproved &&
    validBudgets;
  return Object.freeze({
    enabled,
    models: LOCKED_MODELS,
    limits: {
      ...STUDY_BUDDY_LIMITS,
      maxSessionMicroUsd: enabled ? sessionBudget : 0,
      maxDayMicroUsd: enabled ? dailyBudget : 0,
    },
  });
}

function positiveInteger(value) {
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

export function assertLiveProviderConstructionAllowed(environment = process.env) {
  const config = getStudyBuddyConfig(environment);
  if (environment.NODE_ENV === "test" || environment.CI || !config.enabled) {
    throw new Error("study_buddy_live_provider_disabled");
  }
  return config;
}
