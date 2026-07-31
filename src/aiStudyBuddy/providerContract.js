export function assertStudyBuddyProvider(provider) {
  if (!provider || typeof provider.runTurn !== "function") {
    throw new Error("study_buddy_provider_required");
  }
  return provider;
}
