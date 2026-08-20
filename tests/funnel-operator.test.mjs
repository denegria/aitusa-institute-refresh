import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createFunnelOperatorService } from "../src/observability/operatorService.js";

const now = new Date("2026-08-02T12:00:00.000Z");

test("operator health exposes only aggregate fixed-shape data and raises launch alerts", async () => {
  const service = createFunnelOperatorService({
    now: () => now,
    repository: {
      async readSummary() {
        return {
          events: [
            { eventName: "diagnostic_started", safeOutcomeCode: "started", count: 10 },
            { eventName: "result_save_completed", safeOutcomeCode: "saved", count: 3 },
            { eventName: "portal_auth_success", safeOutcomeCode: "success", count: 2 },
            { eventName: "portal_auth_failure", safeOutcomeCode: "invalid", count: 5 },
          ],
          outbox: [{ status: "dead_letter", count: 1 }, { status: "pending", count: 2 }],
          staleDeliveryCount: 2,
          oldestOpenAt: "2026-08-02T10:00:00.000Z",
        };
      },
    },
  });
  const health = await service.getHealth({ hours: 999 });
  assert.equal(health.window.hours, 168);
  assert.equal(health.status, "critical");
  assert.deepEqual(health.alerts.map((item) => item.code), [
    "crm_dead_letters_present",
    "crm_delivery_stale",
    "diagnostic_completion_rate_low",
    "portal_auth_failure_rate_high",
  ]);
  assert.equal(JSON.stringify(health).match(/email|phone|payload|answer|writing|token|provider/i), null);
});

test("operator route, repository, scheduler, and immediate dispatch keep launch boundaries explicit", async () => {
  const [route, repository, vercel, claim, start, turns] = await Promise.all([
    readFile("app/api/ops/funnel-health/route.js", "utf8"),
    readFile("src/observability/operatorNeonRepository.server.js", "utf8"),
    readFile("vercel.json", "utf8"),
    readFile("app/api/portal/result-claim/finalize/route.js", "utf8"),
    readFile("app/api/portal/ai-study-buddy/sessions/route.js", "utf8"),
    readFile("app/api/portal/ai-study-buddy/sessions/[sessionId]/turns/route.js", "utf8"),
  ]);
  assert.match(route, /operator_unauthorized/);
  assert.match(route, /CRON_SECRET/);
  assert.doesNotMatch(repository, /select[\s\S]*payload/i);
  assert.doesNotMatch(repository, /email|phone|answer|writing|transcript|prompt|provider/i);
  const cron = JSON.parse(vercel).crons.find((item) => item.path === "/api/cron/crm-outbox");
  assert.deepEqual(cron, { path: "/api/cron/crm-outbox", schedule: "0 5 * * *" });
  assert.match(claim, /after\(async \(\) => \{[\s\S]*reconcileClaimedPlacementReviewsBestEffort[\s\S]*dispatchCrmOutboxBestEffort\(\)/);
  for (const source of [start, turns]) {
    assert.match(source, /after\(\(\) => dispatchCrmOutboxBestEffort\(\)\)/);
    assert.match(source, /process\.env\.VERCEL/);
  }
  assert.match(claim, /process\.env\.VERCEL/);
});
