import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GET } from "../app/api/portal/ai-study-buddy/route.js";
import { createStudyBuddyRouteHandler } from "../src/aiStudyBuddy/http.server.js";
import { createStudyBuddyService } from "../src/aiStudyBuddy/service.js";
import { createMemoryStudyBuddyRepository } from "../src/aiStudyBuddy/memoryRepository.js";
import { createFakeStudyBuddyProvider } from "../src/aiStudyBuddy/fakeStudyBuddyProvider.js";

const snapshot = Object.freeze({ state: "authenticated", account: { id: "account-1", status: "active" }, result: { recommendedLevelKey: "basic" }, practice: { guardianVerified: true } });
const config = Object.freeze({ enabled: true, limits: { maxSessionMicroUsd: 1, maxDayMicroUsd: 2, sessionMinutes: 5 } });

describe("MIS-340 Study Buddy route contracts", () => {
  it("removes query-string fixture identity and fails safely without configured Portal auth", async () => {
    const response = await GET(new Request("http://localhost/api/portal/ai-study-buddy?accountKey=guardianActive&studentCrmContactRef=crm&useCase=lesson_review"));
    const body = await response.json();
    assert.equal(response.status, 503);
    assert.equal(response.headers.get("cache-control"), "private, no-store");
    assert.equal(body.code, "provider_unavailable");
    assert.equal(JSON.stringify(body).match(/accountKey|studentCrm|useCase|workos|email/i), null);
  });

  it("requires same origin and sealed-session-derived ownership for mutations", async () => {
    const service = createStudyBuddyService({ repository: createMemoryStudyBuddyRepository(), provider: createFakeStudyBuddyProvider(), config });
    const route = createStudyBuddyRouteHandler({ resolveSnapshot: async () => snapshot, service, hashEmail: () => "a".repeat(64) });
    const blocked = await route.start(new Request("https://portal.example/api/portal/ai-study-buddy/sessions", { method: "POST" }));
    assert.equal((await blocked.json()).code, "invalid_origin");
    const started = await route.start(new Request("https://portal.example/api/portal/ai-study-buddy/sessions", { method: "POST", headers: { origin: "https://portal.example", host: "portal.example" } }));
    const body = await started.json();
    assert.equal(started.status, 201);
    assert.deepEqual(Object.keys(body.session).sort(), ["expiresAt", "id", "scenario", "state", "turnCount", "useCase"]);
  });

  it("does not let request bodies select account, result, model, prompt, policy, or budget", async () => {
    const service = createStudyBuddyService({ repository: createMemoryStudyBuddyRepository(), provider: createFakeStudyBuddyProvider(), config });
    const route = createStudyBuddyRouteHandler({ resolveSnapshot: async () => snapshot, service, hashEmail: () => "b".repeat(64) });
    const started = await route.start(new Request("https://portal.example/start", { method: "POST", headers: { origin: "https://portal.example", host: "portal.example" } }));
    const { session } = await started.json();
    const turn = await route.turn(new Request("https://portal.example/turn", { method: "POST", headers: { origin: "https://portal.example", host: "portal.example", "content-type": "application/json" }, body: JSON.stringify({ operationId: "operation-1", text: "hello", model: "other", accountId: "other" }) }), session.id);
    assert.equal((await turn.json()).code, "invalid_request");
  });
});
