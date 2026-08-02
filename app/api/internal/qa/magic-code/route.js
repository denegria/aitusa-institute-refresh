import { timingSafeEqual } from "node:crypto";
import { WorkOS } from "@workos-inc/node";
import { getPortalSqlClient } from "../../../../../src/diagnostic/db.server.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const QA_EMAIL = "openclawagent.giuseppe@gmail.com";

export async function POST(request) {
  if (
    process.env.VERCEL_ENV !== "preview" ||
    process.env.VERCEL_GIT_COMMIT_REF !== "staging" ||
    !safeEqual(request.headers.get("x-funnel-qa-secret"), process.env.FUNNEL_QA_SECRET)
  ) {
    return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  if (!/^[0-9a-f-]{36}$/i.test(body.claimId || "")) {
    return Response.json({ ok: false, error: "claim_id_invalid" }, { status: 422 });
  }

  const sql = getPortalSqlClient();
  const rows = await sql`
    select provider_challenge_id, email
    from portal_auth_challenges
    where claim_id = ${body.claimId}::uuid
    limit 1
  `;
  const challenge = rows[0];
  if (!challenge || challenge.email !== QA_EMAIL) {
    return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  const workos = new WorkOS(process.env.WORKOS_API_KEY, {
    clientId: process.env.WORKOS_CLIENT_ID,
  });
  const magicAuth = await workos.userManagement.getMagicAuth(
    challenge.provider_challenge_id,
  );
  return Response.json({ ok: true, code: magicAuth.code }, {
    headers: { "cache-control": "no-store" },
  });
}

function safeEqual(actual, expected) {
  if (!actual || !expected) return false;
  const left = Buffer.from(actual);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}
