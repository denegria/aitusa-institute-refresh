import { PlacementReviewError } from "./errors.js";

export function assertTrustedEmployeeOrigin(request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "https";
  if (!origin || !host) throw new PlacementReviewError("cross_origin_request_forbidden", 403);
  let expected;
  try { expected = new URL(`${protocol}://${host}`).origin; } catch { throw new PlacementReviewError("cross_origin_request_forbidden", 403); }
  if (origin !== expected) throw new PlacementReviewError("cross_origin_request_forbidden", 403);
}
