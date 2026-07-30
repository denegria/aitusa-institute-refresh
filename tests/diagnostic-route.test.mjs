import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { POST as startAttempt } from "../app/api/diagnostic/attempts/route.js";
import { GET as resumeAttempt } from "../app/api/diagnostic/attempts/resume/route.js";
import { POST as runRetention } from "../app/api/cron/portal-retention/route.js";

function request(url, { body, headers = {}, method = "POST" } = {}) {
  return new Request(url, {
    method,
    headers: {
      ...(body === undefined ? {} : { "content-type": "application/json" }),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

describe("MIS-337 diagnostic route degradation", () => {
  it("keeps the anonymous session flow available when portal storage is not configured", async () => {
    const response = await startAttempt(
      request("https://example.com/api/diagnostic/attempts", {
        body: {
          requestId: "request-route-fixture",
          requestSecret:
            "request-secret-fixture-with-more-than-thirty-two-characters",
          ageBand: "age_13_plus",
        },
      }),
    );
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.ok, true);
    assert.equal(body.durable, false);
    assert.equal(body.sessionFallbackAllowed, true);
  });

  it("never requests durable storage for an under-13 attempt", async () => {
    const response = await startAttempt(
      request("https://example.com/api/diagnostic/attempts", {
        body: {
          requestId: "request-under13-route",
          ageBand: "under_13",
        },
      }),
    );
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.durable, false);
    assert.equal(body.guardianRequired, true);
    assert.equal(body.retention, "session_only");
  });

  it("returns a quiet no-resume result when storage is unavailable", async () => {
    const response = await resumeAttempt(
      request("https://example.com/api/diagnostic/attempts/resume", {
        method: "GET",
      }),
    );
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.ok, true);
    assert.equal(body.durable, false);
  });

  it("returns a quiet no-resume result when storage is active but no cookie exists", async () => {
    const previousDatabaseUrl = process.env.PORTAL_DATABASE_URL;
    const previousResumeSecret = process.env.DIAGNOSTIC_RESUME_SECRET;
    process.env.PORTAL_DATABASE_URL = "postgresql://unused.invalid/neondb";
    process.env.DIAGNOSTIC_RESUME_SECRET =
      "resume-secret-fixture-with-more-than-thirty-two-characters";

    try {
      const response = await resumeAttempt(
        request("https://example.com/api/diagnostic/attempts/resume", {
          method: "GET",
        }),
      );
      const body = await response.json();

      assert.equal(response.status, 200);
      assert.equal(body.ok, true);
      assert.equal(body.durable, false);
      assert.equal(body.resumableAttempt, false);
    } finally {
      if (previousDatabaseUrl === undefined) {
        delete process.env.PORTAL_DATABASE_URL;
      } else {
        process.env.PORTAL_DATABASE_URL = previousDatabaseUrl;
      }
      if (previousResumeSecret === undefined) {
        delete process.env.DIAGNOSTIC_RESUME_SECRET;
      } else {
        process.env.DIAGNOSTIC_RESUME_SECRET = previousResumeSecret;
      }
    }
  });

  it("protects the retention worker when no cron secret is configured", async () => {
    const response = await runRetention(
      request("https://example.com/api/cron/portal-retention"),
    );
    const body = await response.json();

    assert.equal(response.status, 401);
    assert.equal(body.error, "cron_unauthorized");
  });
});
