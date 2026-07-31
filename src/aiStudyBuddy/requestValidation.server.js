import { StudyBuddyError } from "./errors.js";
import { STUDY_BUDDY_LIMITS } from "./config.server.js";

export function validateTurnRequest(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new StudyBuddyError("invalid_request");
  if (typeof value.operationId !== "string" || !/^[a-zA-Z0-9_-]{8,80}$/.test(value.operationId)) {
    throw new StudyBuddyError("invalid_request");
  }
  if (!Number.isInteger(value.retryAttempt) || ![0, 1].includes(value.retryAttempt)) throw new StudyBuddyError("invalid_request");
  if (Object.keys(value).some((key) => ["accountId", "resultId", "guardian", "model", "prompt", "scenario", "budget", "policy"].includes(key))) {
    throw new StudyBuddyError("invalid_request");
  }
  const allowed = new Set(["operationId", "retryAttempt", "text", "audio"]);
  if (Object.keys(value).some((key) => !allowed.has(key))) throw new StudyBuddyError("invalid_request");
  const hasText = typeof value.text === "string";
  const hasAudio = value.audio !== undefined;
  if (hasText === hasAudio) throw new StudyBuddyError("invalid_request");
  if (hasText) {
    if (value.text.trim().length === 0 || value.text.length > STUDY_BUDDY_LIMITS.maxTextCharacters) throw new StudyBuddyError("invalid_request");
    return { operationId: value.operationId, retryAttempt: value.retryAttempt, input: { kind: "text", value: value.text.trim() } };
  }
  const audio = value.audio;
  if (!audio || typeof audio !== "object" || Array.isArray(audio) || Object.keys(audio).some((key) => !["bytes", "durationSeconds", "contentType"].includes(key))) {
    throw new StudyBuddyError("invalid_request");
  }
  if (!Number.isInteger(audio.bytes) || audio.bytes < 1 || audio.bytes > STUDY_BUDDY_LIMITS.maxAudioBytes) throw new StudyBuddyError("invalid_request");
  if (typeof audio.durationSeconds !== "number" || !Number.isFinite(audio.durationSeconds) || audio.durationSeconds <= 0 || audio.durationSeconds > STUDY_BUDDY_LIMITS.maxAudioSeconds) throw new StudyBuddyError("invalid_request");
  if (typeof audio.contentType !== "string" || audio.contentType.length > STUDY_BUDDY_LIMITS.maxAudioTypeCharacters || !["audio/webm", "audio/mp4", "audio/ogg", "audio/wav"].includes(audio.contentType)) throw new StudyBuddyError("invalid_request");
  return { operationId: value.operationId, retryAttempt: value.retryAttempt, input: { kind: "audio_metadata", ...audio } };
}

export async function parseBoundedJson(request, maxBytes = STUDY_BUDDY_LIMITS.maxJsonBodyBytes) {
  const length = Number(request.headers.get("content-length") || 0);
  if (!Number.isFinite(length) || length < 0 || length > maxBytes) throw new StudyBuddyError("request_too_large", 413);
  if (!request.body) throw new StudyBuddyError("invalid_request", 400);
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let bytes = 0;
  let body = "";
  while (true) {
    const chunk = await reader.read();
    if (chunk.done) break;
    bytes += chunk.value.byteLength;
    if (bytes > maxBytes) {
      await reader.cancel().catch(() => {});
      throw new StudyBuddyError("request_too_large", 413);
    }
    body += decoder.decode(chunk.value, { stream: true });
  }
  try {
    return JSON.parse(body + decoder.decode());
  } catch {
    throw new StudyBuddyError("invalid_request", 400);
  }
}

export async function assertEmptyStartBody(request) {
  if (!request.body) return;
  const value = await parseBoundedJson(request);
  if (!value || typeof value !== "object" || Array.isArray(value) || Object.keys(value).length > 0) {
    throw new StudyBuddyError("invalid_request", 400);
  }
}

export function enforceSameOrigin(request, configuredOrigin = null) {
  const supplied = request.headers.get("origin");
  let expected;
  try {
    expected = new URL(configuredOrigin || request.url).origin;
    if (!supplied || new URL(supplied).origin !== supplied || supplied !== expected) throw new Error("origin_mismatch");
  } catch {
    throw new StudyBuddyError("invalid_origin", 403);
  }
}

export function validateSessionId(value) {
  if (typeof value !== "string" || !/^[a-zA-Z0-9-]{1,128}$/.test(value)) throw new StudyBuddyError("invalid_request", 400);
  return value;
}
