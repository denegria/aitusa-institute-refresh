import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { GET as getAiStudyBuddy } from "../app/api/portal/ai-study-buddy/route.js";
import { GET as getAttendance } from "../app/api/portal/attendance/route.js";
import {
  GET as getCheckIn,
  POST as postCheckIn,
} from "../app/api/portal/check-in/route.js";
import { POST as postEvent } from "../app/api/portal/events/route.js";
import { GET as getLearning } from "../app/api/portal/learning/route.js";
import { GET as getPrivacy } from "../app/api/portal/privacy/route.js";
import { POST as requestPortalCode } from "../app/api/portal/auth/code/route.js";
import { POST as verifyPortalCode } from "../app/api/portal/auth/verify/route.js";
import { POST as signOutPortal } from "../app/api/portal/sign-out/route.js";
import {
  config as portalProxyConfig,
  proxy as portalProxy,
} from "../proxy.js";
import {
  getPortalPrototypeAvailability,
  getPortalPrototypeGateResponse,
} from "../src/portal/portalAvailability.js";

function jsonRequest(path, method = "GET") {
  return new Request(`http://localhost${path}`, {
    method,
    headers: method === "POST" ? { "content-type": "application/json" } : undefined,
    body: method === "POST" ? JSON.stringify({}) : undefined,
  });
}

async function withVercelEnvironment(environment, callback) {
  const previous = {
    PORTAL_PRODUCTION_ENABLED: process.env.PORTAL_PRODUCTION_ENABLED,
    VERCEL: process.env.VERCEL,
    VERCEL_ENV: process.env.VERCEL_ENV,
    VERCEL_TARGET_ENV: process.env.VERCEL_TARGET_ENV,
  };

  Object.assign(process.env, environment);

  try {
    return await callback();
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

describe("portal prototype production gate", () => {
  it("keeps the prototype available in preview, development, and local runs", () => {
    assert.equal(
      getPortalPrototypeAvailability({ VERCEL: "1", VERCEL_ENV: "preview" })
        .available,
      true,
    );
    assert.equal(
      getPortalPrototypeAvailability({ VERCEL: "1", VERCEL_ENV: "development" })
        .available,
      true,
    );
    assert.equal(getPortalPrototypeAvailability({}).available, true);
  });

  it("fails closed for production and unclassified Vercel deployments", () => {
    assert.equal(
      getPortalPrototypeAvailability({ VERCEL: "1", VERCEL_ENV: "production" })
        .available,
      false,
    );
    assert.equal(
      getPortalPrototypeAvailability({
        VERCEL: "1",
        VERCEL_ENV: "preview",
        VERCEL_TARGET_ENV: "production",
      }).available,
      false,
    );
    assert.equal(getPortalPrototypeAvailability({ VERCEL: "1" }).available, false);
  });

  it("allows production only through an exact explicit activation flag", () => {
    assert.deepEqual(
      getPortalPrototypeAvailability({
        VERCEL: "1",
        VERCEL_ENV: "production",
        PORTAL_PRODUCTION_ENABLED: "true",
      }),
      { available: true, reason: "production_enabled" },
    );
    assert.equal(
      getPortalPrototypeAvailability({
        VERCEL: "1",
        VERCEL_ENV: "production",
        PORTAL_PRODUCTION_ENABLED: "TRUE",
      }).available,
      false,
    );
  });

  it("returns a non-cacheable 404 without exposing fixture details", async () => {
    const response = getPortalPrototypeGateResponse({
      VERCEL: "1",
      VERCEL_ENV: "production",
    });

    assert.equal(response.status, 404);
    assert.equal(response.headers.get("cache-control"), "private, no-store");
    assert.equal(await response.text(), "Not Found");
  });

  it("blocks portal pages at the request boundary in production", async () => {
    assert.deepEqual(portalProxyConfig.matcher, [
      "/portal/:path*",
      "/api/portal/:path*",
    ]);

    await withVercelEnvironment(
      {
        VERCEL: "1",
        VERCEL_ENV: "production",
        VERCEL_TARGET_ENV: "production",
      },
      async () => {
        const response = portalProxy();
        assert.equal(response.status, 404);
        assert.equal(response.headers.get("cache-control"), "private, no-store");
        assert.equal(await response.text(), "Not Found");
      },
    );
  });

  it("blocks every portal API handler before fixture evaluation in production", async () => {
    const handlers = [
      () => getAiStudyBuddy(jsonRequest("/api/portal/ai-study-buddy")),
      () => getAttendance(jsonRequest("/api/portal/attendance")),
      () => getCheckIn(jsonRequest("/api/portal/check-in")),
      () => postCheckIn(jsonRequest("/api/portal/check-in", "POST")),
      () => postEvent(jsonRequest("/api/portal/events", "POST")),
      () => getLearning(jsonRequest("/api/portal/learning")),
      () => getPrivacy(jsonRequest("/api/portal/privacy")),
      () => requestPortalCode(jsonRequest("/api/portal/auth/code", "POST")),
      () => verifyPortalCode(jsonRequest("/api/portal/auth/verify", "POST")),
      () => signOutPortal(jsonRequest("/api/portal/sign-out", "POST")),
    ];

    await withVercelEnvironment(
      {
        VERCEL: "1",
        VERCEL_ENV: "production",
        VERCEL_TARGET_ENV: "production",
      },
      async () => {
        for (const invoke of handlers) {
          const response = await invoke();
          assert.equal(response.status, 404);
          assert.equal(await response.text(), "Not Found");
        }
      },
    );
  });
});
