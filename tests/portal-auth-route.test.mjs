import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createPortalAuthCodeHandler,
} from "../app/api/portal/auth/code/route.js";
import {
  createPortalAuthVerifyHandler,
} from "../app/api/portal/auth/verify/route.js";
import {
  createPortalSignOutHandler,
} from "../app/api/portal/sign-out/route.js";
import { PortalClaimError } from "../src/portalClaim/errors.js";
import { serializeExpiredPortalSessionCookie } from "../src/portalClaim/session.server.js";

function jsonRequest(url, body, headers = {}) {
  return new Request(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

describe("MIS-341 authenticated portal routes", () => {
  it("keeps returning-user code requests generic", async () => {
    const inputs = [];
    const handler = createPortalAuthCodeHandler({
      isConfigured: () => true,
      getService: () => ({
        async requestSignInCode(input, metadata) {
          inputs.push({ input, metadata });
          return {
            accepted: true,
            delivery: "email",
            codeLength: 6,
          };
        },
      }),
    });
    const response = await handler(
      jsonRequest(
        "https://example.com/api/portal/auth/code",
        { email: "student@example.com", accountId: "browser-controlled" },
        {
          origin: "https://example.com",
          host: "example.com",
          "user-agent": "route-test",
        },
      ),
    );

    assert.equal(response.status, 202);
    assert.deepEqual(await response.json(), {
      ok: true,
      accepted: true,
      delivery: "email",
      codeLength: 6,
    });
    assert.equal(response.headers.get("set-cookie"), null);
    assert.equal(inputs[0].input.accountId, "browser-controlled");
    assert.equal(inputs[0].metadata.userAgent, "route-test");
  });

  it("rejects cross-origin and oversized bodies before auth service work", async () => {
    let calls = 0;
    const handler = createPortalAuthCodeHandler({
      isConfigured: () => true,
      getService: () => ({
        async requestSignInCode() {
          calls += 1;
        },
      }),
    });
    const crossOrigin = await handler(
      jsonRequest(
        "https://example.com/api/portal/auth/code",
        { email: "student@example.com" },
        {
          origin: "https://evil.example",
          host: "example.com",
        },
      ),
    );
    const oversized = await handler(
      jsonRequest(
        "https://example.com/api/portal/auth/code",
        { email: "student@example.com" },
        {
          "content-length": "20000",
        },
      ),
    );
    const chunkedOversized = await handler(
      jsonRequest("https://example.com/api/portal/auth/code", {
        email: "student@example.com",
        padding: "x".repeat(17_000),
      }),
    );

    assert.equal(crossOrigin.status, 403);
    assert.equal((await crossOrigin.json()).error, "cross_origin_request_forbidden");
    assert.equal(oversized.status, 413);
    assert.equal((await oversized.json()).error, "request_body_too_large");
    assert.equal(chunkedOversized.status, 413);
    assert.equal(
      (await chunkedOversized.json()).error,
      "request_body_too_large",
    );
    assert.equal(calls, 0);
  });

  it("sets the HttpOnly cookie only after active-account verification", async () => {
    const success = createPortalAuthVerifyHandler({
      isConfigured: () => true,
      getService: () => ({
        async verifySignInCode() {
          return {
            sessionData: "sealed-session-fixture",
            snapshot: {
              account: {
                status: "active",
              },
            },
          };
        },
      }),
    });
    const accepted = await success(
      jsonRequest("https://example.com/api/portal/auth/verify", {
        email: "student@example.com",
        code: "123456",
      }),
    );
    const acceptedBody = await accepted.json();

    assert.equal(accepted.status, 200);
    assert.deepEqual(acceptedBody, {
      ok: true,
      authenticated: true,
      portalHref: "/portal/",
    });
    assert.match(accepted.headers.get("set-cookie"), /HttpOnly/);
    assert.match(accepted.headers.get("set-cookie"), /SameSite=Lax/);
    assert.equal(JSON.stringify(acceptedBody).includes("sealed-session"), false);
    assert.equal(JSON.stringify(acceptedBody).includes("account"), false);

    const rejected = createPortalAuthVerifyHandler({
      isConfigured: () => true,
      getService: () => ({
        async verifySignInCode() {
          throw new PortalClaimError("portal_sign_in_invalid", 401);
        },
      }),
    });
    const denied = await rejected(
      jsonRequest("https://example.com/api/portal/auth/verify", {
        email: "unknown@example.com",
        code: "123456",
      }),
    );

    assert.equal(denied.status, 401);
    assert.deepEqual(await denied.json(), {
      ok: false,
      error: "portal_sign_in_invalid",
    });
    assert.equal(denied.headers.get("set-cookie"), null);
  });

  it("clears the sealed cookie and redirects a native sign-out form", async () => {
    const revocations = [];
    const signOut = createPortalSignOutHandler({
      isConfigured: () => true,
      getService: () => ({
        async revokeSession(sessionData, metadata) {
          revocations.push({ sessionData, metadata });
          return { revoked: true };
        },
      }),
    });
    const response = await signOut(
      new Request("https://example.com/api/portal/sign-out", {
        method: "POST",
        headers: {
          origin: "https://example.com",
          host: "example.com",
          cookie: "aitusa_portal_session=sealed-session-fixture",
          "user-agent": "route-test",
          "x-forwarded-for": "203.0.113.25",
        },
      }),
    );
    const cookie = response.headers.get("set-cookie");

    assert.equal(response.status, 303);
    assert.equal(
      response.headers.get("location"),
      "https://example.com/portal/sign-in/",
    );
    assert.match(cookie, /^aitusa_portal_session=;/);
    assert.match(cookie, /Max-Age=0/);
    assert.match(cookie, /Expires=Thu, 01 Jan 1970 00:00:00 GMT/);
    assert.match(cookie, /Path=\//);
    assert.match(cookie, /HttpOnly/);
    assert.match(cookie, /SameSite=Lax/);
    assert.deepEqual(revocations, [
      {
        sessionData: "sealed-session-fixture",
        metadata: {
          ipAddress: "203.0.113.25",
          userAgent: "route-test",
        },
      },
    ]);
    assert.match(
      serializeExpiredPortalSessionCookie({ secure: true }),
      /Secure/,
    );

    const providerUnavailable = createPortalSignOutHandler({
      isConfigured: () => true,
      getService: () => ({
        async revokeSession() {
          throw new Error("provider unavailable");
        },
      }),
    });
    const localOnly = await providerUnavailable(
      new Request("https://example.com/api/portal/sign-out", {
        method: "POST",
        headers: {
          origin: "https://example.com",
          host: "example.com",
          cookie: "aitusa_portal_session=sealed-session-fixture",
        },
      }),
    );
    assert.equal(localOnly.status, 303);
    assert.match(localOnly.headers.get("set-cookie"), /Max-Age=0/);
  });
});
