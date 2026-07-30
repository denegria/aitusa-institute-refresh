import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createPortalClaimService } from "../src/portalClaim/service.js";
import { serializePortalSessionCookie } from "../src/portalClaim/session.server.js";

const ids = [
  "00000000-0000-4000-8000-000000000101",
  "00000000-0000-4000-8000-000000000102",
  "00000000-0000-4000-8000-000000000103",
  "00000000-0000-4000-8000-000000000104",
  "00000000-0000-4000-8000-000000000105",
  "00000000-0000-4000-8000-000000000106",
];
const attemptId = "00000000-0000-4000-8000-000000000011";
const resultClaimId = "00000000-0000-4000-8000-000000000012";
const claimId = "00000000-0000-4000-8000-000000000013";

function fixture() {
  const challenges = new Map();
  const receipts = new Map();
  const providerCalls = [];
  let idIndex = 0;
  const repository = {
    async getChallengeByClaimId(value) {
      return [...challenges.values()].find((item) => item.claimId === value) || null;
    },
    async getChallenge({ challengeId, claimId: expectedClaimId }) {
      const item = challenges.get(challengeId);
      return item?.claimId === expectedClaimId ? structuredClone(item) : null;
    },
    async createChallenge(input) {
      challenges.set(input.id, structuredClone(input));
      return { challenge: structuredClone(input), replayed: false };
    },
    async finalizeClaim(input) {
      const challenge = challenges.get(input.challengeId);
      challenge.status = "consumed";
      challenge.consumedAt = input.now.toISOString();
      const receipt = {
        account: {
          id: input.accountId,
          firstName: challenge.firstName,
          email: challenge.email,
        },
        result: {
          id: "00000000-0000-4000-8000-000000000099",
          status: "provisional",
          recommendedLevelKey: "book-2",
          recommendedLevelLabel: "Book 2",
        },
        advisorContactRequested: challenge.advisorContactRequested,
        crmQueued: challenge.advisorContactRequested,
        portalHref: "/portal/?welcome=1",
      };
      receipts.set(challenge.id, receipt);
      return structuredClone(receipt);
    },
    async getClaimReceipt({ challengeId }) {
      return structuredClone(receipts.get(challengeId));
    },
  };
  const diagnosticService = {
    async validateClaimToken(input) {
      assert.equal(input.attemptId, attemptId);
      assert.equal(input.claimToken.length >= 32, true);
      return {
        eligible: true,
        attemptId,
        claimId: resultClaimId,
        expiresAt: "2026-07-30T20:15:00.000Z",
      };
    },
  };
  const authProvider = {
    async sendCode(input) {
      providerCalls.push({ type: "send", ...input });
      return {
        providerChallengeId: "magic_auth_fixture",
        providerUserId: "user_fixture",
        expiresAt: "2026-07-30T20:10:00.000Z",
      };
    },
    async verifyCode(input) {
      providerCalls.push({ type: "verify", ...input });
      return {
        identity: {
          providerUserId: "user_fixture",
          email: input.email,
          emailVerified: true,
        },
        sessionData: "sealed-session-fixture",
      };
    },
    async authenticateSession(sessionData) {
      assert.equal(sessionData, "sealed-session-fixture");
      return {
        providerUserId: "user_fixture",
        email: "student@example.com",
        emailVerified: true,
      };
    },
  };
  const service = createPortalClaimService({
    repository,
    diagnosticService,
    authProvider,
    now: () => new Date("2026-07-30T20:00:00.000Z"),
    createId: () => ids[idIndex++],
  });
  return { challenges, providerCalls, service };
}

describe("MIS-338 passwordless result claim", () => {
  it("requests a six-digit email code only after a valid one-time claim token", async () => {
    const { challenges, providerCalls, service } = fixture();
    const response = await service.requestCode({
      attemptId,
      claimId,
      claimToken: "claim-token-fixture-with-more-than-thirty-two-characters",
      firstName: "  Ana  ",
      email: "ANA@Example.com",
      advisorContactRequested: false,
      attribution: {
        utmSource: "newsletter",
        selectedAnswers: "must-not-pass",
      },
    });

    assert.equal(response.codeLength, 6);
    assert.equal(response.delivery, "email");
    assert.equal(Object.hasOwn(response, "claimToken"), false);
    assert.equal(Object.hasOwn(response, "providerChallengeId"), false);
    assert.equal(providerCalls[0].email, "ana@example.com");
    const challenge = [...challenges.values()][0];
    assert.equal(challenge.firstName, "Ana");
    assert.deepEqual(challenge.attribution, { utmSource: "newsletter" });
    assert.equal(challenge.resultClaimId, resultClaimId);
  });

  it("verifies the provider identity and finalizes an idempotent local claim", async () => {
    const { service } = fixture();
    const requested = await service.requestCode({
      attemptId,
      claimId,
      claimToken: "claim-token-fixture-with-more-than-thirty-two-characters",
      firstName: "Ana",
      email: "student@example.com",
      advisorContactRequested: true,
    });
    const verified = await service.verifyCode({
      challengeId: requested.challengeId,
      claimId,
      code: "123456",
    });
    assert.equal(verified.sessionData, "sealed-session-fixture");

    const first = await service.finalizeClaim(
      { challengeId: requested.challengeId, claimId },
      verified.identity,
    );
    const replay = await service.finalizeClaim(
      { challengeId: requested.challengeId, claimId },
      verified.identity,
    );
    assert.equal(first.account.email, "student@example.com");
    assert.equal(first.crmQueued, true);
    assert.deepEqual(replay, first);
  });

  it("rejects an authenticated identity that does not match the requested email", async () => {
    const { service } = fixture();
    const requested = await service.requestCode({
      attemptId,
      claimId,
      claimToken: "claim-token-fixture-with-more-than-thirty-two-characters",
      firstName: "Ana",
      email: "student@example.com",
    });
    await assert.rejects(
      service.finalizeClaim(
        { challengeId: requested.challengeId, claimId },
        {
          providerUserId: "user_fixture",
          email: "attacker@example.com",
          emailVerified: true,
        },
      ),
      (error) => error.code === "verified_identity_mismatch",
    );
  });

  it("sets an HttpOnly SameSite session cookie without exposing it to browser code", () => {
    const cookie = serializePortalSessionCookie("sealed-session-fixture", {
      secure: true,
    });
    assert.match(cookie, /^aitusa_portal_session=/);
    assert.match(cookie, /HttpOnly/);
    assert.match(cookie, /SameSite=Lax/);
    assert.match(cookie, /Secure/);
  });
});
