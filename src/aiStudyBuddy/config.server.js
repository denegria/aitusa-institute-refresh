export const STUDY_BUDDY_FAKE_PROFILE = "fake-v1";

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
  const fakeProviderRequested = environment.STUDY_BUDDY_FAKE_PROVIDER_ENABLED === "true";
  const fakeProviderAllowed =
    environment.VERCEL_ENV === "preview" ||
    environment.NODE_ENV === "development" ||
    environment.NODE_ENV === "test";
  const sessionBudget = positiveInteger(environment.STUDY_BUDDY_MAX_SESSION_MICRO_USD);
  const dailyBudget = positiveInteger(environment.STUDY_BUDDY_MAX_DAY_MICRO_USD);
  const validBudgets = sessionBudget !== null && dailyBudget !== null && dailyBudget >= sessionBudget;
  const enabled =
    executionEnabled &&
    fakeProviderRequested &&
    fakeProviderAllowed &&
    validBudgets;
  return Object.freeze({
    enabled,
    providerMode: enabled ? "fake" : "disabled",
    providerProfile: STUDY_BUDDY_FAKE_PROFILE,
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
  void environment;
  throw new Error("study_buddy_live_provider_deferred_to_mis_345");
}

export function assertFakeProviderConstructionAllowed(environment = process.env) {
  const config = getStudyBuddyConfig(environment);
  if (!config.enabled || config.providerMode !== "fake" || environment.VERCEL_ENV === "production") {
    throw new Error("study_buddy_fake_provider_disabled");
  }
  return config;
}
