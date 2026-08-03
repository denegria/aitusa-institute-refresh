import { getPortalDatabase } from "../diagnostic/db.server.js";
import { buildLeadCrmDeliveryEvent, evaluateLeadContactSubmission } from "./leadContactModel.js";
import { createNeonLeadCrmRepository } from "./neonRepository.server.js";

export function createLeadContactService({ repository, repositoryFactory } = {}) {
  if (!repository && !repositoryFactory) throw new Error("lead_crm_repository_required");

  return {
    async submit(input) {
      const evaluated = evaluateLeadContactSubmission(input);
      if (evaluated.status !== 200 || evaluated.body.ok !== true) return evaluated;

      const submittedAt = input.submittedAt ?? new Date().toISOString();
      const sourcePath = evaluated.body.crmPayloadPreview.sourcePath;
      const event = buildLeadCrmDeliveryEvent({ input, sourcePath, submittedAt });
      const activeRepository = repository || repositoryFactory();
      const receipt = await activeRepository.enqueue(event);

      return {
        status: receipt.duplicate ? 202 : 201,
        body: {
          ...evaluated.body,
          decision: {
            ...evaluated.body.decision,
            destination: "ait_crm_outbox",
          },
          crmQueued: true,
          crmWrite: false,
          storageEnabled: true,
          duplicate: receipt.duplicate,
        },
      };
    },
  };
}

let cachedService = null;

export function getLeadContactService() {
  if (!cachedService) {
    cachedService = createLeadContactService({
      repositoryFactory: () => createNeonLeadCrmRepository(getPortalDatabase()),
    });
  }
  return cachedService;
}
