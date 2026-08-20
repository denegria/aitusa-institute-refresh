import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { toSafePortalSnapshot } from "../src/portalAuth/neonRepository.server.js";
import { createPortalAuthService } from "../src/portalAuth/service.js";
import { createPortalSessionResolver } from "../src/portalAuth/sessionResolver.server.js";
import { createWorkOSAuthProvider } from "../src/portalClaim/workosAdapter.server.js";

const identity = Object.freeze({
  providerUserId: "workos-user-fixture",
  email: "student@example.com",
  emailVerified: true,
});

function safeSnapshot() {
  return {
    state: "authenticated",
    account: {
      status: "active",
      accountType: "adult_student",
      firstName: "Ana",
      email: "student@example.com",
      preferredLanguage: "es",
    },
    result: {
      status: "provisional",
      recommendedLevelKey: "basic",
      recommendedLevelLabel: "Inglés básico",
      goal: "Trabajo",
    },
    consents: {
      accountCreation: {
        decision: true,
        policyVersion: "privacy+terms",
        occurredAt: "2026-07-30T20:00:00.000Z",
      },
      advisorContact: {
        decision: true,
        policyVersion: "privacy",
        occurredAt: "2026-07-30T20:00:00.000Z",
      },
    },
    advisor: {
      requested: true,
      deliveryStatus: "pending",
      delivery: {
        queued: true,
        status: "pending",
        deliveredAt: null,
      },
    },
    practice: {
      eligible: false,
      reason: "feature_not_approved",
    },
  };
}

function fixture({
  snapshot = safeSnapshot(),
  sendError = null,
  verifyError = null,
  revokeError = null,
  hasActiveAccount = true,
  authDecision = "allowed",
  observeOutcome = null,
} = {}) {
  const providerCalls = [];
  const repositoryCalls = [];
  const authEventCalls = [];
  const authProvider = {
    async sendCode(input) {
      providerCalls.push({ type: "send", input });
      if (sendError) throw sendError;
      return {
        providerChallengeId: "challenge-fixture",
        providerUserId: identity.providerUserId,
        expiresAt: "2026-07-30T20:10:00.000Z",
      };
    },
    async verifyCode(input) {
      providerCalls.push({ type: "verify", input });
      if (verifyError) throw verifyError;
      return {
        identity,
        sessionData: "sealed-session-fixture",
      };
    },
    async authenticateSession(sessionData) {
      providerCalls.push({ type: "session", sessionData });
      return {
        ...identity,
        sessionId: "session-fixture",
      };
    },
    async revokeSession(sessionId) {
      providerCalls.push({ type: "revoke", sessionId });
      if (revokeError) throw revokeError;
    },
  };
  const repository = {
    async reserveAuthAttempt(input) {
      const reservation = {
        id: "auth-attempt-fixture",
        allowed: authDecision === "allowed",
        decision: authDecision,
      };
      authEventCalls.push({
        type: "reserve",
        input: structuredClone(input),
        reservation,
      });
      return reservation;
    },
    async completeAuthAttempt(input) {
      authEventCalls.push({
        type: "complete",
        input: structuredClone(input),
      });
    },
    async recordAuthEvent(input) {
      authEventCalls.push({
        type: "record",
        input: structuredClone(input),
      });
    },
    async hasActivePortalAccountByEmail(email, audience) {
      repositoryCalls.push({ type: "account-by-email", email, audience });
      return hasActiveAccount;
    },
    async getActivePortalSnapshot(value) {
      repositoryCalls.push({
        type: "snapshot",
        identity: structuredClone(value),
      });
      return snapshot ? structuredClone(snapshot) : null;
    },
    async getActivePortalIdentity(value) {
      repositoryCalls.push({ type: "identity", identity: structuredClone(value) });
      if (!snapshot?.account) return null;
      return {
        accountId: "00000000-0000-4000-8000-000000000001",
        ...structuredClone(snapshot.account),
      };
    },
    async getActiveEmployeeIdentity(value) {
      repositoryCalls.push({ type: "employee-identity", identity: structuredClone(value) });
      if (!snapshot?.account) return null;
      return {
        state: "authenticated",
        account: {
          accountId: "00000000-0000-4000-8000-000000000001",
          ...structuredClone(snapshot.account),
        },
        employeeAccess: { businessUnit: "ait_usa", role: "senior" },
      };
    },
  };
  return {
    authEventCalls,
    providerCalls,
    repositoryCalls,
    service: createPortalAuthService({
      authProvider,
      repository,
      hashSecret: "portal-auth-service-test-secret-32-bytes",
      monotonicNow: () => 0,
      sleep: async () => {},
      observeOutcome,
    }),
  };
}

describe("MIS-341 authenticated portal service", () => {
  it("returns the same code-request response without exposing provider delivery state", async () => {
    const available = fixture();
    const unknown = fixture({ hasActiveAccount: false });
    const unavailable = fixture({ sendError: new Error("provider-down") });
    const rateLimited = fixture({
      authDecision: "blocked_email_budget",
    });
    const input = {
      email: " Student@Example.com ",
      portalAccountId: "browser-controlled-account",
      role: "admin",
      crmContactRef: "browser-controlled-crm-ref",
    };

    const accepted = await available.service.requestSignInCode(input);
    const unknownAccount = await unknown.service.requestSignInCode(input);
    const obscuredFailure = await unavailable.service.requestSignInCode(input);
    const obscuredRateLimit = await rateLimited.service.requestSignInCode(input);

    assert.deepEqual(accepted, {
      accepted: true,
      delivery: "email",
      codeLength: 6,
    });
    assert.deepEqual(unknownAccount, accepted);
    assert.deepEqual(obscuredFailure, accepted);
    assert.deepEqual(obscuredRateLimit, accepted);
    assert.equal(available.providerCalls[0].input.email, "student@example.com");
    assert.deepEqual(Object.keys(available.providerCalls[0].input), ["email"]);
    assert.equal(unknown.providerCalls.length, 0);
    assert.equal(rateLimited.providerCalls.length, 0);
    assert.deepEqual(unknown.repositoryCalls, [
      { type: "account-by-email", email: "student@example.com", audience: "student" },
    ]);
    assert.equal(
      available.authEventCalls[0].input.eventType,
      "code_request",
    );
    assert.equal(
      available.authEventCalls.at(-1).input.outcome,
      "provider_dispatched",
    );
    assert.equal(
      unknown.authEventCalls.at(-1).input.outcome,
      "account_unavailable",
    );
    assert.equal(
      unavailable.authEventCalls.at(-1).input.outcome,
      "provider_error",
    );
    assert.equal(rateLimited.authEventCalls.length, 1);
    assert.equal(
      rateLimited.authEventCalls[0].reservation.decision,
      "blocked_email_budget",
    );
  });

  it("separates employee and student sign-in audiences on the same OTP backend", async () => {
    const employee = fixture();
    const authenticated = await employee.service.verifySignInCode({
      email: "student@example.com",
      code: "123456",
      audience: "employee",
    });
    assert.equal(authenticated.audience, "employee");
    assert.equal(authenticated.snapshot.employeeAccess.role, "senior");
    assert.deepEqual(employee.repositoryCalls, [
      { type: "employee-identity", identity },
    ]);

    const student = fixture();
    const studentAuth = await student.service.verifySignInCode({
      email: "student@example.com",
      code: "123456",
      audience: "student",
    });
    assert.equal(studentAuth.audience, "student");
    assert.equal(student.repositoryCalls[0].type, "snapshot");
  });

  it("reports only safe code-request outcomes without changing the generic response", async () => {
    const observed = [];
    const active = fixture({
      observeOutcome(event) {
        observed.push(structuredClone(event));
      },
    });

    await active.service.requestSignInCode({ email: "student@example.com" });

    assert.deepEqual(observed, [
      { eventType: "code_request", outcome: "provider_dispatched" },
    ]);
    assert.equal(JSON.stringify(observed).match(/student|email|ip|workos/i), null);
  });

  it("issues sealed session data only after provider identity resolves an active account", async () => {
    const active = fixture();
    const authenticated = await active.service.verifySignInCode({
      email: "student@example.com",
      code: "123456",
      portalAccountId: "browser-controlled-account",
      role: "admin",
    });

    assert.equal(authenticated.sessionData, "sealed-session-fixture");
    assert.deepEqual(authenticated.snapshot, safeSnapshot());
    assert.deepEqual(active.repositoryCalls, [
      { type: "snapshot", identity },
    ]);
    assert.equal(active.authEventCalls[0].input.eventType, "code_verify");
    assert.equal(active.authEventCalls.at(-1).input.outcome, "success");

    const missing = fixture({ snapshot: null });
    await assert.rejects(
      missing.service.verifySignInCode({
        email: "student@example.com",
        code: "123456",
      }),
      (error) =>
        error.code === "portal_sign_in_invalid" && error.status === 401,
    );

    const invalidCode = fixture({
      verifyError: new Error("provider-invalid-code"),
    });
    await assert.rejects(
      invalidCode.service.verifySignInCode({
        email: "student@example.com",
        code: "123456",
      }),
      (error) =>
        error.code === "portal_sign_in_invalid" && error.status === 401,
    );

    const rateLimited = fixture({
      authDecision: "blocked_ip_budget",
    });
    await assert.rejects(
      rateLimited.service.verifySignInCode({
        email: "student@example.com",
        code: "123456",
      }),
      (error) =>
        error.code === "portal_sign_in_invalid" && error.status === 401,
    );
    assert.equal(rateLimited.providerCalls.length, 0);
    assert.equal(rateLimited.authEventCalls.length, 1);
  });

  it("authenticates the sealed cookie before loading the safe portal snapshot", async () => {
    const { providerCalls, service } = fixture();
    const resolve = createPortalSessionResolver({ service });
    const snapshot = await resolve(
      new Request("https://example.com/portal/", {
        headers: {
          cookie: "other=value; aitusa_portal_session=sealed-session-fixture",
        },
      }),
    );

    assert.deepEqual(snapshot, safeSnapshot());
    assert.deepEqual(providerCalls.at(-1), {
      type: "session",
      sessionData: "sealed-session-fixture",
    });
  });

  it("resolves employee identity without loading the student dashboard snapshot", async () => {
    const active = fixture();
    const identitySnapshot = await active.service.resolveAuthenticatedIdentity("sealed-session-fixture");
    assert.equal(identitySnapshot.account.accountId, "00000000-0000-4000-8000-000000000001");
    assert.deepEqual(active.repositoryCalls.map((call) => call.type), ["identity"]);
    assert.equal(active.repositoryCalls.some((call) => call.type === "snapshot"), false);
  });

  it("rejects missing or inactive sessions without returning account state", async () => {
    const missing = fixture();
    const resolveMissing = createPortalSessionResolver({
      service: missing.service,
    });
    await assert.rejects(
      resolveMissing(new Request("https://example.com/portal/")),
      (error) =>
        error.code === "portal_session_required" && error.status === 401,
    );

    const inactive = fixture({ snapshot: null });
    const resolveInactive = createPortalSessionResolver({
      service: inactive.service,
    });
    await assert.rejects(
      resolveInactive(
        new Request("https://example.com/portal/", {
          headers: {
            cookie: "aitusa_portal_session=sealed-session-fixture",
          },
        }),
      ),
      (error) =>
        error.code === "portal_session_invalid" && error.status === 401,
    );
  });

  it("revokes the provider session without retaining raw identifiers", async () => {
    const active = fixture();
    const revoked = await active.service.revokeSession(
      "sealed-session-fixture",
      { ipAddress: "203.0.113.25" },
    );

    assert.deepEqual(revoked, { revoked: true });
    assert.deepEqual(active.providerCalls, [
      { type: "session", sessionData: "sealed-session-fixture" },
      { type: "revoke", sessionId: "session-fixture" },
    ]);
    assert.equal(active.authEventCalls.at(-1).type, "record");
    assert.equal(active.authEventCalls.at(-1).input.outcome, "revoked");
    assert.equal("email" in active.authEventCalls.at(-1).input, false);
    assert.equal(
      active.authEventCalls.at(-1).input.emailKeyHash.length,
      64,
    );
    assert.equal(active.authEventCalls.at(-1).input.ipKeyHash.length, 64);

    const unavailable = fixture({
      revokeError: new Error("provider unavailable"),
    });
    assert.deepEqual(
      await unavailable.service.revokeSession("sealed-session-fixture"),
      { revoked: false },
    );
    assert.equal(
      unavailable.authEventCalls.at(-1).input.outcome,
      "revoke_failed",
    );
  });

  it("maps Neon rows to a result-first snapshot without internal identity fields", () => {
    const snapshot = toSafePortalSnapshot({
      account_id: "00000000-0000-4000-8000-000000000001",
      account_status: "active",
      account_type: "adult_student",
      first_name: "Ana",
      primary_email: "student@example.com",
      preferred_language: "es",
      attempt_id: "00000000-0000-4000-8000-000000000002",
      result_status: "provisional",
      recommended_level_key: "basic",
      recommended_level_label: "Inglés básico",
      answered_question_count: 50,
      skipped_question_count: 12,
      advisor_confirmation_required: 1,
      product_contract_version: "diagnostic-v2",
      question_bank_version: "questions-v1",
      scoring_contract_version: "scoring-v1",
      result_copy_version: "copy-v1",
      goal: " Trabajo ",
      completed_at: "2026-07-30T19:00:00.000Z",
      advisor_contact_requested: true,
      account_consent_decision: true,
      account_consent_policy_version: "privacy+terms",
      account_consent_occurred_at: "2026-07-30T19:05:00.000Z",
      advisor_consent_decision: true,
      advisor_consent_policy_version: "privacy",
      advisor_consent_occurred_at: "2026-07-30T19:05:00.000Z",
      outbox_status: "delivered",
      outbox_delivered_at: "2026-07-30T19:06:00.000Z",
      recent_practice: [
        {
          scenario: "workplace_exchange",
          state: "completed",
          turnCount: 5,
          successCode: "success",
          focusCode: "focus_grammar",
          completedAt: "2026-07-31T16:00:00.000Z",
          transcript: "must-not-leak",
        },
        {
          scenario: "raw learner input",
          state: "completed",
          completedAt: "2026-07-31T15:00:00.000Z",
        },
      ],
      workos_user_id: "must-not-leak",
      correlation_id: "must-not-leak",
      crm_payload: { mustNotLeak: true },
    });
    const serialized = JSON.stringify(snapshot);

    assert.equal(snapshot.account.firstName, "Ana");
    assert.equal(snapshot.result.goal, "Trabajo");
    assert.equal(snapshot.advisor.deliveryStatus, "delivered");
    assert.equal(snapshot.practice.reason, "feature_not_approved");
    assert.deepEqual(snapshot.recentPractice, [
      {
        scenarioLabel: "Pedir ayuda en el trabajo",
        completedAt: "2026-07-31T16:00:00.000Z",
        successLabel: "Completaste la conversación",
        focusLabel: "Próximo enfoque: precisión gramatical",
      },
    ]);
    assert.equal(serialized.includes("must-not-leak"), false);
    for (const forbidden of [
      "account_id",
      "portalAccountId",
      "workos",
      "providerUserId",
      "correlation",
      "crm",
      "payload",
      "role",
    ]) {
      assert.equal(serialized.includes(forbidden), false);
    }
  });
});

describe("WorkOS portal auth adapter", () => {
  it("resolves and revokes the exact provider session", async () => {
    const calls = [];
    const provider = createWorkOSAuthProvider({
      apiKey: "test-api-key",
      clientId: "test-client-id",
      cookiePassword: "workos-cookie-password-test-32-bytes",
      workosClient: {
        userManagement: {
          async authenticateWithSessionCookie(input) {
            calls.push({ type: "authenticate", input });
            return {
              authenticated: true,
              sessionId: "provider-session-fixture",
              user: {
                id: "workos-user-fixture",
                email: " Student@Example.com ",
                emailVerified: true,
              },
            };
          },
          async revokeSession(input) {
            calls.push({ type: "revoke", input });
          },
        },
      },
    });

    assert.deepEqual(
      await provider.authenticateSession("sealed-session-fixture"),
      {
        providerUserId: "workos-user-fixture",
        email: "student@example.com",
        emailVerified: true,
        sessionId: "provider-session-fixture",
      },
    );
    await provider.revokeSession("provider-session-fixture");
    assert.deepEqual(calls, [
      {
        type: "authenticate",
        input: {
          sessionData: "sealed-session-fixture",
          cookiePassword: "workos-cookie-password-test-32-bytes",
        },
      },
      {
        type: "revoke",
        input: { sessionId: "provider-session-fixture" },
      },
    ]);
  });
});
