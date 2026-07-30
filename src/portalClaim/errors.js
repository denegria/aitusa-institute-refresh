export class PortalClaimError extends Error {
  constructor(code, status = 400, details = {}) {
    super(code);
    this.name = "PortalClaimError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export function toPortalClaimErrorResponse(error) {
  if (error instanceof PortalClaimError) {
    return {
      status: error.status,
      body: {
        ok: false,
        error: error.code,
        ...(Object.keys(error.details).length > 0 ? { details: error.details } : {}),
      },
    };
  }
  return {
    status: 500,
    body: { ok: false, error: "portal_claim_failed" },
  };
}
