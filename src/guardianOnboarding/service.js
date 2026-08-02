import { createHash, randomUUID } from "node:crypto";
import { evaluatePlacementTestSubmission } from "../placement/placementTestModel.js";
import { addDays, DIAGNOSTIC_RETENTION, DIAGNOSTIC_VERSIONS } from "../diagnostic/contract.js";
import { DIAGNOSTIC_QUESTION_BANK } from "../diagnostic/questionBank.server.js";
import {
  GUARDIAN_CONSENT_POLICY_VERSION,
  GUARDIAN_DIRECT_NOTICE_HASH,
} from "../privacy/guardianConsentPolicy.js";
import { PortalClaimError } from "../portalClaim/errors.js";
import {
  normalizeGuardianEmail,
  validateGuardianCodeRequest,
  validateGuardianControl,
  validateGuardianFinalize,
  validateGuardianVerification,
} from "./validation.js";

export function createGuardianOnboardingService({
  repository,
  authProvider,
  now = () => new Date(),
  createId = () => randomUUID(),
}) {
  if (!repository) throw new Error("guardian_repository_required");
  if (!authProvider) throw new Error("guardian_auth_provider_required");

  return {
    async requestCode(input, metadata = {}) {
      const request = validateGuardianCodeRequest(input);
      const existing = await repository.getChallengeByRequestId(request.requestId);
      if (existing) {
        assertRequestMatches(existing, request);
        if (existing.status === "pending" && new Date(existing.expiresAt) > now()) {
          return safeChallenge(existing, true);
        }
        throw new PortalClaimError("guardian_request_conflict", 409);
      }
      const provider = await authProvider.sendCode({ email: request.guardianEmail, ...metadata });
      const current = now();
      const challenge = await repository.createChallenge({
        id: createId(),
        ...request,
        status: "pending",
        providerChallengeId: provider.providerChallengeId,
        providerUserId: provider.providerUserId,
        policyVersion: GUARDIAN_CONSENT_POLICY_VERSION,
        noticeHash: GUARDIAN_DIRECT_NOTICE_HASH,
        expiresAt: provider.expiresAt,
        verifiedAt: null,
        consumedAt: null,
        createdAt: current.toISOString(),
        updatedAt: current.toISOString(),
      });
      return safeChallenge(challenge, false);
    },

    async verifyCode(input, metadata = {}) {
      const request = validateGuardianVerification(input);
      const challenge = await requireChallenge(repository, request, now());
      const verified = await authProvider.verifyCode({
        email: challenge.guardianEmail,
        code: request.code,
        ...metadata,
      });
      assertIdentity(challenge, verified.identity);
      await repository.markChallengeVerified({
        challengeId: challenge.id,
        requestId: challenge.requestId,
        providerUserId: verified.identity.providerUserId,
        verifiedAt: now().toISOString(),
      });
      return { sessionData: verified.sessionData };
    },

    async authenticateSession(sessionData) {
      if (!sessionData) throw new PortalClaimError("portal_session_required", 401);
      return authProvider.authenticateSession(sessionData);
    },

    async finalize(input, identity) {
      const request = validateGuardianFinalize(input);
      const challenge = await requireChallenge(repository, request, now(), { allowConsumed: true });
      assertIdentity(challenge, identity);
      if (challenge.status === "consumed") {
        return repository.getReceipt({ challengeId: challenge.id, identity });
      }
      if (challenge.status !== "verified") {
        throw new PortalClaimError("guardian_email_verification_required", 409);
      }

      const current = now();
      const attemptId = createId();
      const evaluated = evaluatePlacementTestSubmission({
        attemptId,
        student: {},
        ...request.submission,
        consent: { advisorHandoff: false },
        submittedAt: current.toISOString(),
      });
      if (evaluated.status !== 200) {
        throw new PortalClaimError("guardian_submission_invalid", 422);
      }
      const response = { ...evaluated.body, storageEnabled: true, durableResumeEnabled: false };
      const accountId = createId();
      const childProfileId = createId();
      const receiptCode = `AIT-G-${createId()}`;
      return repository.finalizeOnboarding({
        challenge,
        identity,
        now: current,
        accountId,
        childProfileId,
        linkId: createId(),
        receiptId: createId(),
        receiptCode,
        attempt: {
          id: attemptId,
          requestId: `guardian:${challenge.requestId}`,
          status: "claimed",
          revision: 62,
          resumeTokenHash: createHash("sha256").update(`guardian:${createId()}`).digest("hex"),
          ...DIAGNOSTIC_VERSIONS,
          completionId: createId(),
          startedAt: current.toISOString(),
          lastActivityAt: current.toISOString(),
          completedAt: current.toISOString(),
          claimedAt: current.toISOString(),
          expiresAt: addDays(current, 365).toISOString(),
          rawAnswersPurgeAt: addDays(current, DIAGNOSTIC_RETENTION.claimedRawAnswerDays).toISOString(),
          claimedAccountId: accountId,
          claimedChildProfileId: childProfileId,
        },
        answers: DIAGNOSTIC_QUESTION_BANK.map((question, index) => ({
          questionKey: question.key,
          answerState: request.submission.selectedAnswers[index] === null ? "skipped" : "answered",
          answerValue: request.submission.selectedAnswers[index],
        })),
        context: request.submission,
        result: {
          id: createId(),
          ...DIAGNOSTIC_VERSIONS,
          resultStatus: evaluated.body.scores.finalScoringStatus,
          recommendedLevelKey: evaluated.body.recommendation.key,
          recommendedLevelLabel: evaluated.body.recommendation.level,
          quizScore: evaluated.body.scores.quizScore,
          answeredQuestionCount: evaluated.body.scores.answeredQuestionCount,
          skippedQuestionCount: evaluated.body.scores.skippedQuestionCount,
          scoreSummary: evaluated.body.scores,
          responsePayload: response,
          advisorConfirmationRequired: true,
        },
        childFirstName: request.childFirstName,
        permissions: {
          aiPracticeApproved: challenge.aiPracticeApproved === true,
          advisorContactApproved: challenge.advisorContactApproved === true,
          marketingSmsOptIn: false,
        },
        consentIds: {
          guardian: createId(),
          aiPractice: createId(),
          advisor: createId(),
        },
      });
    },

    async manageChild(input, identity) {
      const request = validateGuardianControl(input);
      if (identity?.emailVerified !== true || !identity.providerUserId) {
        throw new PortalClaimError("portal_session_invalid", 401);
      }
      return repository.manageChild({ ...request, identity, now: now() });
    },
  };
}

async function requireChallenge(repository, request, current, { allowConsumed = false } = {}) {
  const challenge = await repository.getChallenge(request);
  if (!challenge) throw new PortalClaimError("guardian_challenge_not_found", 404);
  if (allowConsumed && challenge.status === "consumed") return challenge;
  if (!["pending", "verified"].includes(challenge.status)) {
    throw new PortalClaimError("guardian_challenge_not_eligible", 409);
  }
  if (new Date(challenge.expiresAt) <= current) {
    throw new PortalClaimError("guardian_challenge_expired", 410);
  }
  return challenge;
}

function assertIdentity(challenge, identity) {
  if (
    identity?.emailVerified !== true ||
    normalizeGuardianEmail(identity.email) !== challenge.guardianEmail ||
    !identity.providerUserId ||
    (challenge.providerUserId && challenge.providerUserId !== identity.providerUserId)
  ) {
    throw new PortalClaimError("verified_identity_mismatch", 409);
  }
}

function assertRequestMatches(challenge, request) {
  if (
    challenge.guardianEmail !== request.guardianEmail ||
    challenge.guardianFirstName !== request.guardianFirstName ||
    challenge.guardianAttested !== true ||
    challenge.noticeAccepted !== true ||
    challenge.aiPracticeApproved !== request.aiPracticeApproved ||
    challenge.advisorContactApproved !== request.advisorContactApproved
  ) {
    throw new PortalClaimError("guardian_request_conflict", 409);
  }
}

function safeChallenge(challenge, replayed) {
  return {
    challengeId: challenge.id,
    expiresAt: challenge.expiresAt,
    delivery: "email",
    codeLength: 6,
    policyVersion: challenge.policyVersion,
    replayed,
  };
}
