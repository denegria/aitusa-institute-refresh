import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import { createPortalPasswordHandler } from "../app/api/portal/auth/password/route.js";
import { createPortalPasswordResetHandler } from "../app/api/portal/auth/password-reset/route.js";
import { createPortalPasswordResetConfirmHandler } from "../app/api/portal/auth/password-reset/confirm/route.js";
import { createPortalPasswordSetupHandler } from "../app/api/portal/auth/password-setup/route.js";
import { createPortalPasswordResetStartHandler } from "../app/portal/reset-password/start/route.js";
import { createPortalAuthService } from "../src/portalAuth/service.js";
import { PortalClaimError } from "../src/portalClaim/errors.js";
import { createWorkOSAuthProvider } from "../src/portalClaim/workosAdapter.server.js";
import {
  sealPortalPasswordResetToken,
  unsealPortalPasswordResetToken,
} from "../src/portalAuth/passwordResetSession.server.js";

const identity = Object.freeze({
  providerUserId: "workos-user-fixture",
  email: "student@example.com",
  emailVerified: true,
});

function serviceFixture({
  active = true,
  employee = false,
  passwordError = null,
  resetError = null,
  resetConfirmError = null,
  reservationAllowed = true,
} = {}) {
  const calls = [];
  const repository = {
    async reserveAuthAttempt(input) {
      calls.push({ type: "reserve", input: structuredClone(input) });
      return { id: `attempt-${calls.length}`, allowed: reservationAllowed };
    },
    async completeAuthAttempt(input) {
      calls.push({ type: "complete", input: structuredClone(input) });
    },
    async hasActivePortalAccountByEmail(email, audience) {
      calls.push({ type: "eligible", email, audience });
      return active;
    },
    async getActivePortalSnapshot(value) {
      calls.push({ type: "student", identity: structuredClone(value) });
      return active && !employee ? { state: "authenticated", account: { email: value.email } } : null;
    },
    async getActiveEmployeeIdentity(value) {
      calls.push({ type: "employee", identity: structuredClone(value) });
      return active && employee
        ? { state: "authenticated", employeeAccess: { businessUnit: "ait_usa", role: "senior" } }
        : null;
    },
    async getActivePortalIdentity(value) {
      calls.push({ type: "portal-identity", identity: structuredClone(value) });
      return active ? { accountId: "account-fixture", email: value.email } : null;
    },
  };
  const authProvider = {
    async authenticatePassword(input) {
      calls.push({
        type: "password",
        email: input.email,
        credentialLength: input.password.length,
        ipAddress: input.ipAddress,
      });
      if (passwordError) throw passwordError;
      return { identity, sessionData: "sealed-session-fixture" };
    },
    async sendPasswordReset(input) {
      calls.push({ type: "reset", input: structuredClone(input) });
      if (resetError) throw resetError;
      return { accepted: true };
    },
    async confirmPasswordReset(input) {
      calls.push({
        type: "reset-confirm",
        tokenLength: input.token.length,
        credentialLength: input.password.length,
      });
      if (resetConfirmError) throw resetConfirmError;
      return { completed: true, identity };
    },
    async authenticateSession(sessionData) {
      calls.push({ type: "session", sessionData });
      return { ...identity, sessionId: "session-fixture" };
    },
  };
  return {
    calls,
    service: createPortalAuthService({
      repository,
      authProvider,
      hashSecret: "portal-auth-password-test-secret-32-bytes",
      monotonicNow: () => 0,
      sleep: async () => {},
    }),
  };
}

function jsonRequest(pathname, body = {}, headers = {}) {
  return new Request(`https://example.com${pathname}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      host: "example.com",
      origin: "https://example.com",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

describe("MIS-403 provider-owned password service", () => {
  it("authenticates a student password into the same sealed WorkOS identity", async () => {
    const fixture = serviceFixture();
    const authenticated = await fixture.service.signInWithPassword(
      {
        email: " Student@Example.com ",
        password: ["synthetic", "credential"].join("-"),
        audience: "student",
      },
      { ipAddress: "192.0.2.10" },
    );

    assert.equal(authenticated.sessionData, "sealed-session-fixture");
    assert.equal(authenticated.audience, "student");
    assert.equal(fixture.calls[0].input.eventType, "password_verify");
    assert.deepEqual(
      fixture.calls.find((call) => call.type === "password"),
      {
        type: "password",
        email: "student@example.com",
        credentialLength: 20,
        ipAddress: "192.0.2.10",
      },
    );
    assert.ok(fixture.calls.some((call) => call.type === "student"));
    assert.ok(!fixture.calls.some((call) => call.type === "employee"));
  });

  it("keeps employee password authorization on the employee identity boundary", async () => {
    const fixture = serviceFixture({ employee: true });
    const authenticated = await fixture.service.signInWithPassword({
      email: "student@example.com",
      password: ["synthetic", "credential"].join("-"),
      audience: "employee",
    });

    assert.equal(authenticated.audience, "employee");
    assert.equal(authenticated.snapshot.employeeAccess.businessUnit, "ait_usa");
    assert.ok(fixture.calls.some((call) => call.type === "employee"));
    assert.ok(!fixture.calls.some((call) => call.type === "student"));
  });

  it("returns the same public failure for an unknown account and a wrong password", async () => {
    const unknown = serviceFixture({ active: false });
    const invalid = serviceFixture({
      passwordError: new PortalClaimError("password_auth_invalid", 401),
    });
    const input = {
      email: "student@example.com",
      password: ["synthetic", "credential"].join("-"),
      audience: "student",
    };

    for (const fixture of [unknown, invalid]) {
      await assert.rejects(
        fixture.service.signInWithPassword(input),
        (error) => error.code === "portal_sign_in_invalid" && error.status === 401,
      );
    }
    assert.ok(unknown.calls.some((call) => call.type === "password"));
  });

  it("keeps password reset enumeration-safe across account and provider states", async () => {
    const available = serviceFixture();
    const unknown = serviceFixture({ active: false });
    const unavailable = serviceFixture({ resetError: new Error("provider unavailable") });
    const input = { email: "student@example.com", audience: "student" };

    const expected = { accepted: true, delivery: "email" };
    assert.deepEqual(await available.service.requestPasswordReset(input), expected);
    assert.deepEqual(await unknown.service.requestPasswordReset(input), expected);
    assert.deepEqual(await unavailable.service.requestPasswordReset(input), expected);
    assert.ok(!unknown.calls.some((call) => call.type === "reset"));
    assert.deepEqual(
      available.calls.find((call) => call.type === "reset"),
      { type: "reset", input: { email: "student@example.com" } },
    );
  });

  it("derives post-placement password setup from the sealed session identity", async () => {
    const fixture = serviceFixture();
    assert.deepEqual(
      await fixture.service.requestAuthenticatedPasswordSetup(
        "sealed-session-fixture",
        { ipAddress: "192.0.2.20" },
      ),
      { accepted: true, delivery: "email" },
    );
    assert.ok(fixture.calls.some((call) => call.type === "portal-identity"));
    assert.deepEqual(
      fixture.calls.find((call) => call.type === "reset"),
      { type: "reset", input: { email: "student@example.com" } },
    );
  });

  it("confirms a reset through WorkOS without persisting token or credential material", async () => {
    const fixture = serviceFixture();
    const token = "provider-reset-token-fixture";
    const credential = ["synthetic", "credential"].join("-");
    assert.deepEqual(
      await fixture.service.confirmPasswordReset(
        token,
        { password: credential, confirmation: credential },
        { ipAddress: "192.0.2.30" },
      ),
      {
        completed: true,
        audience: "student",
        portalHref: "/portal/sign-in/",
      },
    );
    assert.deepEqual(
      fixture.calls.find((call) => call.type === "reset-confirm"),
      {
        type: "reset-confirm",
        tokenLength: token.length,
        credentialLength: credential.length,
      },
    );
    assert.doesNotMatch(JSON.stringify(fixture.calls), new RegExp(token));
    assert.doesNotMatch(JSON.stringify(fixture.calls), new RegExp(credential));
  });

  it("returns only the employee destination for an employee reset", async () => {
    const fixture = serviceFixture({ employee: true });
    const credential = ["synthetic", "credential"].join("-");
    assert.deepEqual(
      await fixture.service.confirmPasswordReset(
        "provider-reset-token-fixture",
        { password: credential, confirmation: credential },
      ),
      {
        completed: true,
        audience: "employee",
        portalHref: "/employee/sign-in/",
      },
    );
  });

  it("falls back to the site instead of exposing a portal chooser", async () => {
    const fixture = serviceFixture({ active: false });
    const credential = ["synthetic", "credential"].join("-");
    assert.deepEqual(
      await fixture.service.confirmPasswordReset(
        "provider-reset-token-fixture",
        { password: credential, confirmation: credential },
      ),
      { completed: true, audience: null, portalHref: "/" },
    );
  });
});

describe("MIS-403 WorkOS password adapter", () => {
  it("seals password authentication and never returns password-reset material", async () => {
    const calls = [];
    const provider = createWorkOSAuthProvider({
      apiKey: "test-api-key",
      clientId: "test-client-id",
      cookiePassword: "workos-cookie-password-test-32-bytes",
      workosClient: {
        userManagement: {
          async authenticateWithPassword(input) {
            calls.push({ type: "authenticate", email: input.email, clientId: input.clientId });
            return {
              user: {
                id: "workos-user-fixture",
                email: " Student@Example.com ",
                emailVerified: true,
              },
              accessToken: "provider-token-not-returned",
            };
          },
          async sealSessionDataFromAuthenticationResponse() {
            calls.push({ type: "seal" });
            return "sealed-session-fixture";
          },
          async createPasswordReset(input) {
            calls.push({ type: "reset", input });
            return {
              id: "reset-fixture",
              passwordResetToken: "provider-reset-material-not-returned",
              passwordResetUrl: "https://provider.example/reset/not-returned",
            };
          },
          async resetPassword(input) {
            calls.push({
              type: "reset-confirm",
              tokenLength: input.token.length,
              credentialLength: input.newPassword.length,
            });
            return {
              user: {
                id: "workos-user-fixture",
                email: "student@example.com",
              },
            };
          },
        },
      },
    });

    const authenticated = await provider.authenticatePassword({
      email: "student@example.com",
      password: ["synthetic", "credential"].join("-"),
    });
    assert.deepEqual(authenticated, {
      identity,
      sessionData: "sealed-session-fixture",
    });
    assert.deepEqual(await provider.sendPasswordReset({ email: identity.email }), {
      accepted: true,
    });
    assert.deepEqual(
      await provider.confirmPasswordReset({
        token: "provider-reset-token-fixture",
        password: ["synthetic", "credential"].join("-"),
      }),
      { completed: true, identity },
    );
    assert.deepEqual(calls, [
      { type: "authenticate", email: "student@example.com", clientId: "test-client-id" },
      { type: "seal" },
      { type: "reset", input: { email: "student@example.com" } },
      { type: "reset-confirm", tokenLength: 28, credentialLength: 20 },
    ]);
  });
});

describe("MIS-403 password reset token boundary", () => {
  it("encrypts the provider token and rejects expired or tampered reset cookies", () => {
    const secret = "portal-password-reset-cookie-secret-32-bytes";
    const token = "provider-reset-token-fixture";
    const now = new Date("2026-08-23T02:00:00.000Z");
    const sealed = sealPortalPasswordResetToken(token, {
      secret,
      now: () => now,
      random: () => Buffer.alloc(12, 7),
    });

    assert.doesNotMatch(sealed, new RegExp(token));
    assert.equal(
      unsealPortalPasswordResetToken(sealed, { secret, now: () => now }),
      token,
    );
    assert.equal(
      unsealPortalPasswordResetToken(sealed, {
        secret,
        now: () => new Date("2026-08-23T02:16:00.000Z"),
      }),
      null,
    );
    assert.equal(
      unsealPortalPasswordResetToken(`${sealed.slice(0, -1)}x`, {
        secret,
        now: () => now,
      }),
      null,
    );
  });

  it("removes the provider token from the visible URL before rendering the form", async () => {
    const token = "provider-reset-token-fixture";
    const handler = createPortalPasswordResetStartHandler({
      getGateResponse: () => null,
      sealToken: (value) => {
        assert.equal(value, token);
        return "encrypted-reset-cookie";
      },
      serializeCookie: (value) =>
        `aitusa_password_reset=${value}; Path=/; HttpOnly; SameSite=Lax`,
    });
    const response = await handler(
      new Request(`https://example.com/portal/reset-password/start?token=${token}`),
    );
    assert.equal(response.status, 303);
    assert.equal(response.headers.get("location"), "https://example.com/portal/reset-password");
    assert.match(response.headers.get("set-cookie"), /HttpOnly/);
    assert.doesNotMatch(response.headers.get("set-cookie"), new RegExp(token));
    assert.equal(response.headers.get("referrer-policy"), "no-referrer");
  });
});

describe("MIS-403 password HTTP boundaries", () => {
  it("sets the sealed cookie only after password authorization", async () => {
    const handler = createPortalPasswordHandler({
      isConfigured: () => true,
      getGateResponse: () => null,
      getService: () => ({
        async signInWithPassword(input) {
          assert.equal(input.audience, "employee");
          return { sessionData: "sealed-session-fixture", audience: "employee" };
        },
      }),
      serializeSessionCookie: (value) => `aitusa_portal_session=${value}; HttpOnly`,
    });
    const response = await handler(jsonRequest("/api/portal/auth/password", {
      email: "employee@example.com",
      password: ["synthetic", "credential"].join("-"),
      audience: "employee",
      returnTo: "/employee/placement-reviews",
    }));
    assert.equal(response.status, 200);
    assert.match(response.headers.get("set-cookie"), /HttpOnly/);
    assert.equal((await response.json()).portalHref, "/employee/placement-reviews");
  });

  it("returns an enumeration-safe reset response", async () => {
    const handler = createPortalPasswordResetHandler({
      isConfigured: () => true,
      getGateResponse: () => null,
      getService: () => ({
        async requestPasswordReset() {
          return { accepted: true, delivery: "email" };
        },
      }),
    });
    const response = await handler(jsonRequest("/api/portal/auth/password-reset", {
      email: "unknown@example.com",
      audience: "student",
    }));
    assert.equal(response.status, 202);
    assert.deepEqual(await response.json(), { ok: true, accepted: true, delivery: "email" });
  });

  it("requires the sealed session for post-placement setup", async () => {
    const calls = [];
    const handler = createPortalPasswordSetupHandler({
      isConfigured: () => true,
      getGateResponse: () => null,
      readSessionCookie: () => "sealed-session-fixture",
      getService: () => ({
        async requestAuthenticatedPasswordSetup(sessionData) {
          calls.push(sessionData);
          return { accepted: true, delivery: "email" };
        },
      }),
    });
    const response = await handler(jsonRequest("/api/portal/auth/password-setup"));
    assert.equal(response.status, 202);
    assert.deepEqual(calls, ["sealed-session-fixture"]);
  });

  it("confirms the password with the encrypted reset cookie and clears stale sessions", async () => {
    const calls = [];
    const handler = createPortalPasswordResetConfirmHandler({
      isConfigured: () => true,
      getGateResponse: () => null,
      readResetCookie: () => "encrypted-reset-cookie",
      unsealToken: (value) => {
        assert.equal(value, "encrypted-reset-cookie");
        return "provider-reset-token-fixture";
      },
      expireResetCookie: () => "aitusa_password_reset=; Max-Age=0; HttpOnly",
      expireSessionCookie: () => "aitusa_portal_session=; Max-Age=0; HttpOnly",
      getService: () => ({
        async confirmPasswordReset(token, input) {
          calls.push({ tokenLength: token.length, credentialLength: input.password.length });
          return {
            completed: true,
            audience: "student",
            portalHref: "/portal/sign-in/",
          };
        },
      }),
    });
    const credential = ["synthetic", "credential"].join("-");
    const response = await handler(jsonRequest(
      "/api/portal/auth/password-reset/confirm",
      { password: credential, confirmation: credential },
    ));
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
      ok: true,
      completed: true,
      audience: "student",
      portalHref: "/portal/sign-in/",
    });
    assert.deepEqual(calls, [{ tokenLength: 28, credentialLength: 20 }]);
    assert.match(response.headers.get("set-cookie"), /aitusa_password_reset=.*Max-Age=0/);
    assert.match(response.headers.get("set-cookie"), /aitusa_portal_session=.*Max-Age=0/);
  });
});

describe("MIS-403 password UX and schema contract", () => {
  it("offers password, code fallback, reset, and optional post-placement setup", async () => {
    const signIn = await readFile(
      new URL("../app/portal/sign-in/SignInExperience.jsx", import.meta.url),
      "utf8",
    );
    const placement = await readFile(
      new URL("../app/_components/site/PlacementExperience.jsx", import.meta.url),
      "utf8",
    );
    const reset = await readFile(
      new URL("../app/portal/reset-password/PasswordResetExperience.jsx", import.meta.url),
      "utf8",
    );
    const resetSession = await readFile(
      new URL("../src/portalAuth/passwordResetSession.server.js", import.meta.url),
      "utf8",
    );
    assert.match(signIn, /type="password"/);
    assert.match(signIn, /Código por email/);
    assert.match(signIn, /Olvidé mi contraseña/);
    assert.match(signIn, /WorkOS protege tu contraseña/);
    assert.doesNotMatch(signIn, /localStorage|sessionStorage/);
    assert.match(placement, /Crea una contraseña para entrar más rápido/);
    assert.match(placement, /\/api\/portal\/auth\/password-setup/);
    assert.match(placement, /Ahora no/);
    assert.match(placement, /claimReceipt\?\.alreadyClaimed !== true/);
    assert.match(reset, /autoComplete="new-password"/);
    assert.match(reset, /Guardar contraseña/);
    assert.match(reset, /Entrar a mi Portal/);
    assert.match(reset, /Entrar al Portal de empleados/);
    assert.doesNotMatch(reset, /Entrar al Portal estudiantil/);
    assert.doesNotMatch(reset, /useSearchParams|localStorage|sessionStorage/);
    assert.match(resetSession, /aes-256-gcm/);
    assert.match(resetSession, /HttpOnly/);
  });

  it("keeps the database event constraint synchronized", async () => {
    const contract = await readFile(
      new URL("../src/portalAuth/contract.js", import.meta.url),
      "utf8",
    );
    const migration = await readFile(
      new URL("../drizzle/0011_password_auth_events.sql", import.meta.url),
      "utf8",
    );
    for (const eventType of ["password_verify", "password_reset_request"]) {
      assert.match(contract, new RegExp(`"${eventType}"`));
      assert.match(migration, new RegExp(`'${eventType}'`));
    }
  });
});
