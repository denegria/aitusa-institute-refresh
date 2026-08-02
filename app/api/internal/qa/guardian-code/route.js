import { timingSafeEqual } from "node:crypto";
import { WorkOS } from "@workos-inc/node";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  if (
    process.env.VERCEL_ENV !== "preview" ||
    process.env.VERCEL_GIT_COMMIT_REF !== "staging" ||
    !process.env.WORKOS_API_KEY ||
    !process.env.GUARDIAN_QA_BRIDGE_SECRET
  ) {
    return Response.json({ ok: false }, { status: 404 });
  }

  const supplied = request.headers.get("x-guardian-qa-secret") || "";
  const expected = process.env.GUARDIAN_QA_BRIDGE_SECRET;
  const valid = supplied.length === expected.length &&
    timingSafeEqual(Buffer.from(supplied), Buffer.from(expected));
  if (!valid) return Response.json({ ok: false }, { status: 404 });

  const { providerChallengeId } = await request.json();
  if (!/^magic_auth_[A-Za-z0-9]+$/.test(providerChallengeId || "")) {
    return Response.json({ ok: false }, { status: 422 });
  }

  const magicAuth = await new WorkOS(process.env.WORKOS_API_KEY).userManagement
    .getMagicAuth(providerChallengeId);

  return Response.json(
    { ok: true, code: magicAuth.code },
    { headers: { "cache-control": "no-store" } },
  );
}
