import {
  clearResumeCookie,
  readResumeCookie,
  serializeResumeCookie,
} from "./credentials.js";
import {
  DiagnosticDomainError,
  toDiagnosticErrorResponse,
} from "./errors.js";

export function diagnosticJson(body, { status = 200, cookie } = {}) {
  const headers = new Headers({ "cache-control": "no-store" });
  if (cookie) headers.append("set-cookie", cookie);
  return Response.json(body, { status, headers });
}

export function diagnosticFailure(error) {
  const response = toDiagnosticErrorResponse(error);
  return diagnosticJson(response.body, { status: response.status });
}

export function getResumeAuthorization(request, expectedAttemptId) {
  const cookie = readResumeCookie(request);
  if (!cookie || (expectedAttemptId && cookie.attemptId !== expectedAttemptId)) {
    return null;
  }
  return cookie;
}

export function buildResumeCookie(started) {
  return serializeResumeCookie({
    attemptId: started.attempt.id,
    credential: started.resumeCredential,
    expiresAt: started.attempt.expiresAt,
    secure: process.env.NODE_ENV === "production",
  });
}

export function buildExpiredResumeCookie() {
  return clearResumeCookie({ secure: process.env.NODE_ENV === "production" });
}

export function assertSameOrigin(request) {
  const origin = request.headers.get("origin");
  if (!origin) return;
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  if (!host) return;
  const protocol = request.headers.get("x-forwarded-proto") || "https";
  if (origin !== `${protocol}://${host}`) {
    throw new DiagnosticDomainError("cross_origin_request_forbidden", 403);
  }
}
