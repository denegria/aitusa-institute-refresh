import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";
import { createFakeStudyBuddyProvider } from "../src/aiStudyBuddy/fakeStudyBuddyProvider.js";
import { createNeonStudyBuddyRepository } from "../src/aiStudyBuddy/neonRepository.server.js";
import { createStudyBuddyService } from "../src/aiStudyBuddy/service.js";

const connectionString = process.env.PORTAL_DATABASE_URL;
if (!connectionString) throw new Error("PORTAL_DATABASE_URL is required");

const sql = neon(connectionString, { fetchOptions: { cache: "no-store" } });
const migration = await readFile(new URL("../drizzle/0003_study_buddy_runtime.sql", import.meta.url), "utf8");
const statements = migration.split("--> statement-breakpoint").map((value) => value.trim()).filter(Boolean);
await sql.transaction(statements.map((statement) => sql.query(statement)));

const accountId = "34000000-0000-4000-8000-000000000001";
const attemptId = "34000000-0000-4000-8000-000000000002";
const resultId = "34000000-0000-4000-8000-000000000003";
const now = new Date("2026-07-31T15:00:00.000Z");

await sql.transaction([
  sql`insert into portal_accounts (id, workos_user_id, status, account_type, first_name, primary_email, preferred_language, created_at, updated_at, last_signed_in_at)
      values (${accountId}::uuid, 'mis-340-validation-user', 'active', 'adult_student', 'Synthetic', 'mis-340-validation@example.invalid', 'en', ${now.toISOString()}::timestamptz, ${now.toISOString()}::timestamptz, ${now.toISOString()}::timestamptz)
      on conflict (id) do nothing`,
  sql`insert into diagnostic_attempts (id, request_id, status, revision, resume_token_hash, product_contract_version, question_bank_version, answer_key_version, level_map_version, scoring_contract_version, result_copy_version, completion_id, started_at, last_activity_at, completed_at, claimed_at, expires_at, claimed_account_id)
      values (${attemptId}::uuid, 'mis-340-validation-request', 'claimed', 1, 'mis-340-validation-resume-hash', 'v2', 'v2', 'v2', 'v2', 'v2', 'v2', 'mis-340-validation-completion', ${now.toISOString()}::timestamptz, ${now.toISOString()}::timestamptz, ${now.toISOString()}::timestamptz, ${now.toISOString()}::timestamptz, ${(new Date(now.getTime() + 86_400_000)).toISOString()}::timestamptz, ${accountId}::uuid)
      on conflict (id) do nothing`,
  sql`insert into diagnostic_results (id, attempt_id, product_contract_version, question_bank_version, answer_key_version, level_map_version, scoring_contract_version, result_copy_version, result_status, recommended_level_key, recommended_level_label, quiz_score, answered_question_count, skipped_question_count, score_summary, response_payload, advisor_confirmation_required, created_at)
      values (${resultId}::uuid, ${attemptId}::uuid, 'v2', 'v2', 'v2', 'v2', 'v2', 'v2', 'provisional', 'basic', 'Basic', 1, 1, 0, '{}'::jsonb, '{}'::jsonb, 1, ${now.toISOString()}::timestamptz)
      on conflict (id) do nothing`,
]);

const repository = createNeonStudyBuddyRepository({
  client: sql,
  now: () => new Date(now),
});
const config = Object.freeze({
  enabled: true,
  providerMode: "fake",
  providerProfile: "fake-v1",
  limits: Object.freeze({
    maxSessionMicroUsd: 10,
    maxDayMicroUsd: 20,
    sessionMinutes: 5,
    providerDeadlineMs: 10_000,
  }),
});
const context = Object.freeze({
  snapshot: Object.freeze({
    state: "authenticated",
    account: Object.freeze({ status: "active", accountType: "adult_student" }),
    result: Object.freeze({ recommendedLevelKey: "basic" }),
    practice: Object.freeze({ guardianVerified: true }),
  }),
  ownership: Object.freeze({
    accountId,
    resultId,
    verifiedEmailHmac: "a".repeat(64),
    hashVersion: "hmac-sha256-v1",
  }),
});
const service = createStudyBuddyService({
  repository,
  provider: createFakeStudyBuddyProvider(),
  config,
  now: () => new Date(now),
});

const starts = await Promise.all([
  service.start({ context }),
  service.start({ context }),
]);
assert.equal(new Set(starts.map((value) => value.session.id)).size, 1);
assert.equal(starts.filter((value) => value.replayed).length, 1);
const sessionId = starts[0].session.id;

for (let learnerTurn = 1; learnerTurn <= 5; learnerTurn += 1) {
  const result = await service.turn({
    context,
    sessionId,
    payload: {
      operationId: `validation-${learnerTurn}`,
      retryAttempt: 0,
      text: "synthetic validation input",
    },
  });
  assert.equal(result.ok, true);
}

const replay = await service.turn({
  context,
  sessionId,
  payload: { operationId: "validation-5", retryAttempt: 0, text: "synthetic validation input" },
});
assert.equal(replay.code, "completed");

const session = await repository.getSession(sessionId, accountId);
const budget = await repository.getBudget(accountId, now);
const counts = await sql`
  select
    (select count(*)::integer from ai_practice_entitlements) as entitlements,
    (select count(*)::integer from ai_practice_sessions) as sessions,
    (select count(*)::integer from ai_practice_turn_operations) as operations,
    (select count(*)::integer from ai_practice_budget_reservations) as reservations
`;

assert.equal(session.state, "completed");
assert.equal(session.turnCount, 5);
assert.equal(session.providerProfile, "fake-v1");
assert.equal(budget.chargedMicroUsd, 0);
assert.equal(budget.releasedMicroUsd, 10);
assert.deepEqual(counts[0], { entitlements: 1, sessions: 1, operations: 5, reservations: 1 });

console.log(JSON.stringify({
  migrationStatements: statements.length,
  duplicateStartReplayed: true,
  terminalState: session.state,
  learnerTurns: session.turnCount,
  providerProfile: session.providerProfile,
  chargedMicroUsd: budget.chargedMicroUsd,
  releasedMicroUsd: budget.releasedMicroUsd,
  counts: counts[0],
}));
