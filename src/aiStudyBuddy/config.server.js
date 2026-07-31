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
  maxSessionMicroUsd: 0,
  maxDayMicroUsd: 0,
});

export function getStudyBuddyConfig(environment = process.env) {
  const executionEnabled = environment.STUDY_BUDDY_EXECUTION_ENABLED === "true";
  const providerApproved = environment.STUDY_BUDDY_PROVIDER_APPROVED === "true";
  const guardianSourceApproved = environment.STUDY_BUDDY_GUARDIAN_SOURCE_APPROVED === "true";
  const budget = Number(environment.STUDY_BUDDY_MAX_SESSION_MICRO_USD || 0);
  const enabled =
    executionEnabled &&
    providerApproved &&
    guardianSourceApproved &&
    Number.isInteger(budget) &&
    budget > 0;
  return Object.freeze({
    enabled,
    models: LOCKED_MODELS,
    limits: { ...STUDY_BUDDY_LIMITS, maxSessionMicroUsd: enabled ? budget : 0 },
  });
}

export function assertLiveProviderConstructionAllowed(environment = process.env) {
  const config = getStudyBuddyConfig(environment);
  if (environment.NODE_ENV === "test" || environment.CI || !config.enabled) {
    throw new Error("study_buddy_live_provider_disabled");
  }
  return config;
}
