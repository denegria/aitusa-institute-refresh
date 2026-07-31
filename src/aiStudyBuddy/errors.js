import { safePracticeResult } from "./studyBuddyContract.js";

export class StudyBuddyError extends Error {
  constructor(code, status = 400) {
    super(code);
    this.name = "StudyBuddyError";
    this.code = code;
    this.status = status;
  }
}

export function toSafeStudyBuddyError(error) {
  if (error instanceof StudyBuddyError) return safePracticeResult(error.code);
  return safePracticeResult("provider_unavailable");
}
