import { randomUUID } from "node:crypto";
import { addDays } from "../diagnostic/contract.js";
import { PORTAL_CLAIM_POLICY } from "./contract.js";
import { PortalClaimError } from "./errors.js";
import {
  normalizeEmail,
  validateClaimRequest,
  validateCodeRequest,
  validateFinalizeRequest,
} from "./validation.js";

export function createPortalClaimService({
  repository,
  diagnosticService,
  authProvider,
  now = () => new Date(),
  createId = () => randomUUID(),
}) {
  if (!repository) throw new Error("portal_claim_repository_required");
  if (!diagnosticService) throw new Error("diagnostic_service_required");
  if (!authProvider) throw new Error("portal_auth_provider_required");

  return {
    async requestCode(input, requestMetadata = {}) {
      const request = validateClaimRequest(input);
      const eligibility = await diagnosticService.validateClaimToken({
        attemptId: request.attemptId,
        claimToken: request.claimToken,
      });

      const existing = await repository.getChallengeByClaimId(request.claimId);
      if (existing) {
        assertChallengeRequestMatches(existing, request);
        if (
          existing.status === "pending" &&
          new Date(existing.expiresAt) > now()
        ) {
          return toSafeChallenge(existing, true);
        }
        throw new PortalClaimError("claim_idempotency_conflict", 409);
      }

      const providerChallenge = await authProvider.sendCode({
        email: request.email,
        ...requestMetadata,
      });
      const currentTime = now();
      const expiresAt = earlierIso(
        providerChallenge.expiresAt,
        eligibility.expiresAt,
      );
      const created = await repository.createChallenge({
        id: createId(),
        claimId: request.claimId,
        attemptId: request.attemptId,
        resultClaimId: eligibility.claimId,
        status: "pending",
        email: request.email,
        firstName: request.firstName,
        providerChallengeId: providerChallenge.providerChallengeId,
        providerUserId: providerChallenge.providerUserId,
        accountType: "adult_student",
        advisorContactRequested: request.advisorContactRequested,
        privacyPolicyVersion: PORTAL_CLAIM_POLICY.privacyPolicyVersion,
        termsVersion: PORTAL_CLAIM_POLICY.termsVersion,
        disclosureHash: PORTAL_CLAIM_POLICY.accountNoticeHash,
        advisorDisclosureHash: PORTAL_CLAIM_POLICY.advisorEmailNoticeHash,
        attribution: request.attribution,
        expiresAt,
        verifiedAt: null,
        consumedAt: null,
        createdAt: currentTime.toISOString(),
        updatedAt: currentTime.toISOString(),
      });
      return toSafeChallenge(created.challenge, created.replayed);
    },

    async verifyCode(input, requestMetadata = {}) {
      const request = validateCodeRequest(input);
      const challenge = await requireChallenge(repository, request, now());
      if (challenge.status === "consumed") {
        throw new PortalClaimError("claim_already_consumed", 409);
      }
      const verified = await authProvider.verifyCode({
        email: challenge.email,
        code: request.code,
        ...requestMetadata,
      });
      assertVerifiedIdentity(challenge, verified.identity);
      return {
        challenge,
        identity: verified.identity,
        sessionData: verified.sessionData,
      };
    },

    async authenticateSession(sessionData) {
      if (!sessionData) throw new PortalClaimError("portal_session_required", 401);
      return authProvider.authenticateSession(sessionData);
    },

    async finalizeClaim(input, identity) {
      const request = validateFinalizeRequest(input);
      const challenge = await requireChallenge(repository, request, now(), {
        allowConsumed: true,
      });
      assertVerifiedIdentity(challenge, identity);
      if (challenge.status === "consumed") {
        return repository.getClaimReceipt({
          ...request,
          identity,
        });
      }
      const currentTime = now();
      return repository.finalizeClaim({
        ...request,
        identity,
        accountId: createId(),
        consentAccountId: createId(),
        consentAdvisorId: createId(),
        outboxIds: {
          placementStarted: createId(),
          placementCompleted: createId(),
          resultClaimed: createId(),
          portalAccountActivated: createId(),
          advisorHandoff: createId(),
        },
        now: currentTime,
        rawAnswersPurgeAt: addDays(currentTime, 30),
      });
    },
  };
}

function assertChallengeRequestMatches(challenge, request) {
  if (
    challenge.attemptId !== request.attemptId ||
    challenge.email !== request.email ||
    challenge.firstName !== request.firstName ||
    challenge.advisorContactRequested !== request.advisorContactRequested
  ) {
    throw new PortalClaimError("claim_idempotency_conflict", 409);
  }
}

async function requireChallenge(
  repository,
  request,
  currentTime,
  { allowConsumed = false } = {},
) {
  const challenge = await repository.getChallenge(request);
  if (!challenge) throw new PortalClaimError("claim_challenge_not_found", 404);
  if (challenge.status === "consumed" && allowConsumed) return challenge;
  if (!["pending", "verified"].includes(challenge.status)) {
    throw new PortalClaimError("claim_challenge_not_eligible", 409);
  }
  if (new Date(challenge.expiresAt) <= currentTime) {
    throw new PortalClaimError("claim_challenge_expired", 410);
  }
  return challenge;
}

function assertVerifiedIdentity(challenge, identity) {
  if (
    identity?.emailVerified !== true ||
    normalizeEmail(identity.email) !== challenge.email ||
    !identity.providerUserId ||
    (
      challenge.providerUserId &&
      challenge.providerUserId !== identity.providerUserId
    )
  ) {
    throw new PortalClaimError("verified_identity_mismatch", 409);
  }
}

function toSafeChallenge(challenge, replayed) {
  return {
    challengeId: challenge.id,
    expiresAt: challenge.expiresAt,
    delivery: "email",
    codeLength: 6,
    replayed,
  };
}

function earlierIso(...values) {
  return new Date(
    Math.min(...values.map((value) => new Date(value).getTime())),
  ).toISOString();
}
