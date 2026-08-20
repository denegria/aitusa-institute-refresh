import { PortalClaimError } from "../portalClaim/errors.js";

export function createMemoryGuardianRepository() {
  const challenges = new Map();
  const receipts = new Map();
  const children = new Map();
  const persisted = [];

  return {
    async getChallengeByRequestId(requestId) {
      return clone([...challenges.values()].find((item) => item.requestId === requestId) || null);
    },
    async getChallenge({ challengeId, requestId }) {
      const item = challenges.get(challengeId);
      return clone(item?.requestId === requestId ? item : null);
    },
    async createChallenge(input) {
      challenges.set(input.id, clone(input));
      return clone(input);
    },
    async markChallengeVerified({ challengeId, requestId, providerUserId, verifiedAt }) {
      const item = challenges.get(challengeId);
      if (!item || item.requestId !== requestId) throw new PortalClaimError("guardian_challenge_not_found", 404);
      item.status = "verified";
      item.providerUserId = providerUserId;
      item.verifiedAt = verifiedAt;
      item.updatedAt = verifiedAt;
      return clone(item);
    },
    async finalizeOnboarding(input) {
      const challenge = challenges.get(input.challenge.id);
      if (challenge.status === "consumed") return clone(receipts.get(challenge.id));
      challenge.status = "consumed";
      challenge.consumedAt = input.now.toISOString();
      const child = {
        id: input.childProfileId,
        firstName: input.childFirstName,
        ageBand: "under_13",
        status: "active",
        guardianProviderUserId: input.identity.providerUserId,
      };
      children.set(child.id, child);
      persisted.push(clone(input));
      const receipt = {
        account: {
          id: input.accountId,
          firstName: challenge.guardianFirstName,
          email: challenge.guardianEmail,
          accountType: "guardian",
        },
        child,
        result: {
          attemptId: input.attempt.id,
          status: input.result.resultStatus,
          recommendedLevelKey: input.result.recommendedLevelKey,
          recommendedLevelLabel: input.result.recommendedLevelLabel,
        },
        consent: {
          receiptCode: input.receiptCode,
          policyVersion: challenge.policyVersion,
          permissions: input.permissions,
          withdrawalHref: "/portal/#privacidad-tutor",
        },
        portalHref: "/portal/?welcome=guardian",
      };
      receipts.set(challenge.id, receipt);
      return clone(receipt);
    },
    async getReceipt({ challengeId, identity }) {
      const receipt = receipts.get(challengeId);
      if (!receipt || receipt.account.email !== identity.email) {
        throw new PortalClaimError("guardian_receipt_not_found", 404);
      }
      return clone(receipt);
    },
    async manageChild({ childProfileId, action, identity, now }) {
      const child = children.get(childProfileId);
      if (!child || child.guardianProviderUserId !== identity.providerUserId) {
        throw new PortalClaimError("guardian_child_not_found", 404);
      }
      child.status = {
        withdraw_consent: "unlinked",
        unlink_child: "unlinked",
        request_deletion: "deletion_requested",
      }[action];
      child.updatedAt = now.toISOString();
      return { childProfileId, action, status: child.status, effectiveAt: child.updatedAt };
    },
    inspect() {
      return { challenges, receipts, children, persisted };
    },
  };
}

function clone(value) {
  return value == null ? value : structuredClone(value);
}
