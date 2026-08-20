export class PlacementReviewError extends Error {
  constructor(code, status = 400, details = {}) {
    super(code);
    this.name = "PlacementReviewError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export function placementReviewFailure(error) {
  if (error instanceof PlacementReviewError) {
    return { status: error.status, body: { ok: false, error: error.code, ...error.details } };
  }
  return { status: 503, body: { ok: false, error: "placement_review_unavailable" } };
}
