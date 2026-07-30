import { PortalClaimError, toPortalClaimErrorResponse } from "./errors.js";

export function portalClaimJson(body, { status = 200, cookie } = {}) {
  const headers = new Headers({ "cache-control": "no-store, private" });
  if (cookie) headers.append("set-cookie", cookie);
  return Response.json(body, { status, headers });
}

export function portalClaimFailure(error, { cookie } = {}) {
  const response = toPortalClaimErrorResponse(error);
  return portalClaimJson(response.body, {
    status: response.status,
    cookie,
  });
}

export function assertPortalSameOrigin(request) {
  const origin = request.headers.get("origin");
  if (!origin) return;
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  if (!host) return;
  const protocol = request.headers.get("x-forwarded-proto") || "https";
  if (origin !== `${protocol}://${host}`) {
    throw new PortalClaimError("cross_origin_request_forbidden", 403);
  }
}

export function getRequestMetadata(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ipAddress = forwarded?.split(",")[0]?.trim() || undefined;
  const userAgent = request.headers.get("user-agent")?.slice(0, 512) || undefined;
  return { ipAddress, userAgent };
}

export async function parsePortalClaimJson(request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 16_384) {
    throw new PortalClaimError("request_body_too_large", 413);
  }
  try {
    const value = await request.json();
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new PortalClaimError("request_body_invalid", 400);
    }
    return value;
  } catch (error) {
    if (error instanceof PortalClaimError) throw error;
    throw new PortalClaimError("request_body_invalid", 400);
  }
}
