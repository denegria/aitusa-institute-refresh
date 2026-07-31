import { getStudyBuddyConfig } from "./config.server.js";

export function getStudyBuddyRuntime() {
  // Runtime execution intentionally has no provider/repository constructor.
  // Tests inject both capabilities; deployed routes stay fail-closed.
  return { config: getStudyBuddyConfig(), service: null };
}
