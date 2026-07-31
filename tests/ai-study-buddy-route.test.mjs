import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GET } from "../app/api/portal/ai-study-buddy/route.js";
import { createStudyBuddyRouteHandler } from "../src/aiStudyBuddy/http.server.js";
import { createStudyBuddyService } from "../src/aiStudyBuddy/service.js";
import { createMemoryStudyBuddyRepository } from "../src/aiStudyBuddy/memoryRepository.js";
import { createFakeStudyBuddyProvider } from "../src/aiStudyBuddy/fakeStudyBuddyProvider.js";
import { PortalClaimError } from "../src/portalClaim/errors.js";
import { StudyBuddyError } from "../src/aiStudyBuddy/errors.js";
import { POST as postTurnRoute } from "../app/api/portal/ai-study-buddy/sessions/[sessionId]/turns/route.js";

const config = Object.freeze({ enabled: true, limits: { maxSessionMicroUsd: 5, maxDayMicroUsd: 10, sessionMinutes: 5 } });
const context = (account = "00000000-0000-4000-8000-000000000001", result = "00000000-0000-4000-8000-000000000011", hash = "a") => Object.freeze({
  snapshot: { state: "authenticated", account: { status: "active", accountType: "adult_student" }, result: { recommendedLevelKey: "basic" }, practice: { guardianVerified: true } },
  ownership: { accountId: account, resultId: result, verifiedEmailHmac: hash.repeat(64), hashVersion: "hmac-sha256-v1" },
});
const mutation = (url, body, headers = {}) => new Request(url, { method: "POST", headers: { origin: new URL(url).origin, "content-type": "application/json", ...headers }, ...(body === undefined ? {} : { body: typeof body === "string" ? body : JSON.stringify(body) }) });

describe("MIS-340 Study Buddy route contracts", () => {
  it("removes query-string fixture identity and fails safely without configured Portal auth", async () => {
    const response = await GET(new Request("http://localhost/api/portal/ai-study-buddy?accountKey=guardianActive&studentCrmContactRef=crm&useCase=lesson_review"));
    const body = await response.json();
    assert.equal(response.status, 503);
    assert.equal(response.headers.get("cache-control"), "private, no-store");
    assert.equal(body.code, "provider_unavailable");
    assert.equal(JSON.stringify(body).match(/accountKey|studentCrm|useCase|workos|email/i), null);
  });

  it("uses private ownership while keeping the public session DTO identity-free", async () => {
    const service = createStudyBuddyService({ repository: createMemoryStudyBuddyRepository(), provider: createFakeStudyBuddyProvider(), config });
    const route = createStudyBuddyRouteHandler({ resolveContext: async () => context(), service });
    const blocked = await route.start(new Request("https://portal.example/api", { method: "POST" }));
    assert.equal((await blocked.json()).code, "invalid_origin");
    const started = await route.start(mutation("https://portal.example/api", undefined));
    const body = await started.json();
    assert.equal(started.status, 201);
    assert.deepEqual(Object.keys(body.session).sort(), ["expiresAt", "id", "scenario", "state", "turnCount", "useCase"]);
    assert.equal(JSON.stringify(body).match(/account|result|hmac|email/i), null);
  });

  it("compares scheme, host, and effective port and rejects policy overrides", async () => {
    const service = createStudyBuddyService({ repository: createMemoryStudyBuddyRepository(), provider: createFakeStudyBuddyProvider(), config });
    const route = createStudyBuddyRouteHandler({ resolveContext: async () => context(), service });
    const wrongScheme = await route.start(new Request("https://portal.example:443/api", { method: "POST", headers: { origin: "http://portal.example" } }));
    assert.equal(wrongScheme.status, 403);
    const wrongPort = await route.start(new Request("https://portal.example:444/api", { method: "POST", headers: { origin: "https://portal.example" } }));
    assert.equal(wrongPort.status, 403);
    const startOverride = await route.start(mutation("https://portal.example/api", { accountId: "other", scenario: "other" }));
    assert.equal(startOverride.status, 400);
    const started = await route.start(mutation("https://portal.example/api", undefined));
    const { session } = await started.json();
    const turn = await route.turn(mutation("https://portal.example/turn", { operationId: "operation-1", retryAttempt: 0, text: "hello", model: "other", accountId: "other" }), session.id);
    assert.equal((await turn.json()).code, "invalid_request");
  });

  it("maps Portal session errors and preserves safe Study Buddy statuses", async () => {
    for (const code of ["portal_session_required", "portal_session_invalid", "portal_session_expired"]) {
      const route = createStudyBuddyRouteHandler({ resolveContext: async () => { throw new PortalClaimError(code, 401); } });
      const response = await route.get(new Request("https://portal.example/api"));
      assert.equal(response.status, 401);
      assert.equal((await response.json()).code, "unauthenticated");
    }
    for (const status of [403, 404, 429, 503]) {
      const route = createStudyBuddyRouteHandler({ resolveContext: async () => context(), service: { async eligibility() { throw new StudyBuddyError("provider_unavailable", status); } } });
      assert.equal((await route.get(new Request("https://portal.example/api"))).status, status);
    }
  });

  it("awaits Next 16 promised params and validates the actual exported route session id", async () => {
    const response = await postTurnRoute(mutation("https://portal.example/turn", { operationId: "operation-1", retryAttempt: 0, text: "hello" }), { params: Promise.resolve({ sessionId: "not/valid" }) });
    assert.equal(response.status, 400);
    assert.equal((await response.json()).code, "invalid_request");
  });

  it("returns the explicit missing-result state without manufacturing ownership", async () => {
    const missing = { snapshot: { state: "authenticated", account: { status: "active" }, result: null, practice: { guardianVerified: false } }, ownership: { accountId: "00000000-0000-4000-8000-000000000001", resultId: null, verifiedEmailHmac: "d".repeat(64), hashVersion: "hmac-sha256-v1" } };
    const service = createStudyBuddyService({ repository: createMemoryStudyBuddyRepository(), provider: createFakeStudyBuddyProvider(), config });
    const response = await createStudyBuddyRouteHandler({ resolveContext: async () => missing, service }).get(new Request("https://portal.example/api"));
    assert.equal(response.status, 200);
    assert.equal((await response.json()).code, "missing_result");
  });

  it("rejects malformed, oversized, and invalid audio metadata bodies", async () => {
    const service = createStudyBuddyService({ repository: createMemoryStudyBuddyRepository(), provider: createFakeStudyBuddyProvider(), config });
    const route = createStudyBuddyRouteHandler({ resolveContext: async () => context(), service });
    const started = await route.start(mutation("https://portal.example/start", undefined));
    const { session } = await started.json();
    const malformed = await route.turn(mutation("https://portal.example/turn", "{"), session.id);
    assert.equal(malformed.status, 400);
    const oversized = await route.turn(mutation("https://portal.example/turn", JSON.stringify({ text: "x".repeat(17_000) })), session.id);
    assert.equal(oversized.status, 413);
    const audio = await route.turn(mutation("https://portal.example/turn", { operationId: "operation-2", retryAttempt: 0, audio: { bytes: 999999, durationSeconds: 1, contentType: "audio/webm", raw: "forbidden" } }), session.id);
    assert.equal(audio.status, 400);
  });
});
