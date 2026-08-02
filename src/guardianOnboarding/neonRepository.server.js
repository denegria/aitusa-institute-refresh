import { and, eq, sql } from "drizzle-orm";
import { guardianConsentChallenges } from "../diagnostic/schema.js";
import { PortalClaimError } from "../portalClaim/errors.js";

export function createNeonGuardianRepository(database) {
  if (!database) throw new Error("guardian_database_required");

  return {
    async getChallengeByRequestId(requestId) {
      const [row] = await database.select().from(guardianConsentChallenges)
        .where(eq(guardianConsentChallenges.requestId, requestId)).limit(1);
      return row ? normalizeChallenge(row) : null;
    },
    async getChallenge({ challengeId, requestId }) {
      const [row] = await database.select().from(guardianConsentChallenges)
        .where(and(
          eq(guardianConsentChallenges.id, challengeId),
          eq(guardianConsentChallenges.requestId, requestId),
        )).limit(1);
      return row ? normalizeChallenge(row) : null;
    },
    async createChallenge(input) {
      const [row] = await database.insert(guardianConsentChallenges).values({
        ...input,
        expiresAt: new Date(input.expiresAt),
        createdAt: new Date(input.createdAt),
        updatedAt: new Date(input.updatedAt),
      }).onConflictDoNothing({ target: guardianConsentChallenges.requestId }).returning();
      if (row) return normalizeChallenge(row);
      const existing = await this.getChallengeByRequestId(input.requestId);
      if (!existing) throw new PortalClaimError("guardian_request_conflict", 409);
      return existing;
    },
    async markChallengeVerified({ challengeId, requestId, providerUserId, verifiedAt }) {
      const [row] = await database.update(guardianConsentChallenges).set({
        status: "verified",
        providerUserId,
        verifiedAt: new Date(verifiedAt),
        updatedAt: new Date(verifiedAt),
      }).where(and(
        eq(guardianConsentChallenges.id, challengeId),
        eq(guardianConsentChallenges.requestId, requestId),
        eq(guardianConsentChallenges.status, "pending"),
      )).returning();
      if (!row) throw new PortalClaimError("guardian_challenge_not_eligible", 409);
      return normalizeChallenge(row);
    },
    async finalizeOnboarding(input) {
      const at = input.now.toISOString();
      const answersJson = JSON.stringify(input.answers.map((answer) => ({
        question_key: answer.questionKey,
        answer_state: answer.answerState,
        answer_value: answer.answerValue,
      })));
      const permissionsJson = JSON.stringify(input.permissions);
      const selfAssessmentJson = JSON.stringify(input.context.selfAssessment);
      const scoreSummaryJson = JSON.stringify(input.result.scoreSummary);
      const responsePayloadJson = JSON.stringify(input.result.responsePayload);
      const rows = await database.execute(sql`
        with eligible as (
          select * from guardian_consent_challenges
          where id = ${input.challenge.id}::uuid
            and request_id = ${input.challenge.requestId}
            and status = 'verified'
            and expires_at > ${at}::timestamptz
            and guardian_email = ${input.identity.email}
            and provider_user_id = ${input.identity.providerUserId}
        ),
        identity_conflict as (
          select id from portal_accounts
          where primary_email = ${input.identity.email}
            and workos_user_id <> ${input.identity.providerUserId}
            and status <> 'deleted'
        ),
        account_write as (
          insert into portal_accounts (
            id, workos_user_id, status, account_type, first_name, primary_email,
            preferred_language, created_at, updated_at, last_signed_in_at
          )
          select ${input.accountId}::uuid, ${input.identity.providerUserId}, 'active', 'guardian',
            e.guardian_first_name, e.guardian_email, 'es', ${at}::timestamptz,
            ${at}::timestamptz, ${at}::timestamptz
          from eligible e where not exists (select 1 from identity_conflict)
          on conflict (workos_user_id) do update set
            account_type = 'guardian', primary_email = excluded.primary_email,
            last_signed_in_at = excluded.last_signed_in_at, updated_at = excluded.updated_at
          returning id, first_name, primary_email
        ),
        child_write as (
          insert into child_profiles (id, first_name, age_band, status, created_at, updated_at)
          select ${input.childProfileId}::uuid, ${input.childFirstName}, 'under_13', 'active',
            ${at}::timestamptz, ${at}::timestamptz from account_write
          returning *
        ),
        link_write as (
          insert into guardian_child_links (id, guardian_account_id, child_profile_id, status, linked_at)
          select ${input.linkId}::uuid, aw.id, cw.id, 'active', ${at}::timestamptz
          from account_write aw, child_write cw returning id
        ),
        attempt_write as (
          insert into diagnostic_attempts (
            id, request_id, status, revision, resume_token_hash, product_contract_version,
            question_bank_version, answer_key_version, level_map_version, scoring_contract_version,
            result_copy_version, completion_id, started_at, last_activity_at, completed_at,
            claimed_at, expires_at, raw_answers_purge_at, claimed_account_id, claimed_child_profile_id
          ) select
            ${input.attempt.id}::uuid, ${input.attempt.requestId}, 'claimed', ${input.attempt.revision},
            ${input.attempt.resumeTokenHash}, ${input.attempt.productContract}, ${input.attempt.questionBank},
            ${input.attempt.answerKey}, ${input.attempt.levelMap}, ${input.attempt.scoring},
            ${input.attempt.resultCopy}, ${input.attempt.completionId}, ${at}::timestamptz,
            ${at}::timestamptz, ${at}::timestamptz, ${at}::timestamptz,
            ${input.attempt.expiresAt}::timestamptz, ${input.attempt.rawAnswersPurgeAt}::timestamptz,
            aw.id, cw.id from account_write aw, child_write cw returning id
        ),
        answer_write as (
          insert into diagnostic_answers (attempt_id, question_key, answer_state, answer_value, updated_at)
          select a.id, item.question_key, item.answer_state, item.answer_value, ${at}::timestamptz
          from attempt_write a,
          jsonb_to_recordset(${answersJson}::jsonb) as item(question_key text, answer_state text, answer_value text)
          returning attempt_id
        ),
        context_write as (
          insert into diagnostic_contexts (attempt_id, goal, self_assessment, writing_sample, updated_at)
          select a.id, ${input.context.goal}, ${selfAssessmentJson}::jsonb,
            ${input.context.writingSample || null}, ${at}::timestamptz from attempt_write a returning attempt_id
        ),
        result_write as (
          insert into diagnostic_results (
            id, attempt_id, product_contract_version, question_bank_version, answer_key_version,
            level_map_version, scoring_contract_version, result_copy_version, result_status,
            recommended_level_key, recommended_level_label, quiz_score, answered_question_count,
            skipped_question_count, score_summary, response_payload, advisor_confirmation_required, created_at
          ) select ${input.result.id}::uuid, a.id, ${input.result.productContract},
            ${input.result.questionBank}, ${input.result.answerKey}, ${input.result.levelMap},
            ${input.result.scoring}, ${input.result.resultCopy}, ${input.result.resultStatus},
            ${input.result.recommendedLevelKey}, ${input.result.recommendedLevelLabel},
            ${input.result.quizScore}, ${input.result.answeredQuestionCount}, ${input.result.skippedQuestionCount},
            ${scoreSummaryJson}::jsonb, ${responsePayloadJson}::jsonb, 1, ${at}::timestamptz
          from attempt_write a returning id, result_status, recommended_level_key, recommended_level_label
        ),
        guardian_consent as (
          insert into consent_records (id, account_id, attempt_id, purpose, channel, decision,
            policy_version, disclosure_hash, capture_method, correlation_id, occurred_at, created_at)
          select ${input.consentIds.guardian}::uuid, aw.id, a.id, 'guardian_account_and_result', 'web', true,
            e.policy_version, e.notice_hash, 'verified_email_plus_attestation', e.request_id,
            ${at}::timestamptz, ${at}::timestamptz from account_write aw, attempt_write a, eligible e returning id
        ),
        ai_consent as (
          insert into consent_records (id, account_id, attempt_id, purpose, channel, decision,
            policy_version, disclosure_hash, capture_method, correlation_id, occurred_at, created_at)
          select ${input.consentIds.aiPractice}::uuid, aw.id, a.id, 'ai_practice', 'web',
            ${input.permissions.aiPracticeApproved}, e.policy_version, e.notice_hash, 'explicit_checkbox',
            e.request_id, ${at}::timestamptz, ${at}::timestamptz from account_write aw, attempt_write a, eligible e returning id
        ),
        advisor_consent as (
          insert into consent_records (id, account_id, attempt_id, purpose, channel, decision,
            policy_version, disclosure_hash, capture_method, correlation_id, occurred_at, created_at)
          select ${input.consentIds.advisor}::uuid, aw.id, a.id, 'advisor_contact', 'email',
            ${input.permissions.advisorContactApproved}, e.policy_version, e.notice_hash, 'explicit_checkbox',
            e.request_id, ${at}::timestamptz, ${at}::timestamptz from account_write aw, attempt_write a, eligible e returning id
        ),
        receipt_write as (
          insert into guardian_consent_receipts (
            id, challenge_id, guardian_account_id, child_profile_id, receipt_code, status,
            policy_version, notice_hash, verification_method, permissions, captured_at, created_at
          ) select ${input.receiptId}::uuid, e.id, aw.id, cw.id, ${input.receiptCode}, 'active',
            e.policy_version, e.notice_hash, 'verified_email_plus_attestation', ${permissionsJson}::jsonb,
            ${at}::timestamptz, ${at}::timestamptz from eligible e, account_write aw, child_write cw
          returning *
        ),
        challenge_update as (
          update guardian_consent_challenges c set status = 'consumed', consumed_at = ${at}::timestamptz,
            updated_at = ${at}::timestamptz from receipt_write r where c.id = r.challenge_id returning c.id
        )
        select aw.id as account_id, aw.first_name as guardian_first_name, aw.primary_email,
          cw.id as child_profile_id, cw.first_name as child_first_name, cw.age_band, cw.status as child_status,
          rw.receipt_code, rw.policy_version, rw.permissions,
          rr.result_status, rr.recommended_level_key, rr.recommended_level_label
        from account_write aw, child_write cw, receipt_write rw, result_write rr, challenge_update cu
      `);
      const row = resultRows(rows)[0];
      if (!row) throw new PortalClaimError("guardian_finalize_conflict", 409);
      return toReceipt(row);
    },
    async getReceipt({ challengeId, identity }) {
      const rows = await database.execute(sql`
        select a.id as account_id, a.first_name as guardian_first_name, a.primary_email,
          c.id as child_profile_id, c.first_name as child_first_name, c.age_band, c.status as child_status,
          r.receipt_code, r.policy_version, r.permissions,
          dr.result_status, dr.recommended_level_key, dr.recommended_level_label
        from guardian_consent_receipts r
        join portal_accounts a on a.id = r.guardian_account_id
        join child_profiles c on c.id = r.child_profile_id
        join diagnostic_attempts da on da.claimed_child_profile_id = c.id
        join diagnostic_results dr on dr.attempt_id = da.id
        where r.challenge_id = ${challengeId}::uuid
          and a.workos_user_id = ${identity.providerUserId}
          and a.primary_email = ${identity.email}
        limit 1
      `);
      const row = resultRows(rows)[0];
      if (!row) throw new PortalClaimError("guardian_receipt_not_found", 404);
      return toReceipt(row);
    },
    async manageChild({ childProfileId, action, identity, now }) {
      const at = now.toISOString();
      const childStatus = action === "request_deletion" ? "deletion_requested" : "unlinked";
      const receiptStatus = action === "request_deletion" ? "deletion_requested" : action === "withdraw_consent" ? "withdrawn" : "active";
      const rows = await database.execute(sql`
        with owned as (
          select c.id from child_profiles c
          join guardian_child_links l on l.child_profile_id = c.id
          join portal_accounts a on a.id = l.guardian_account_id
          where c.id = ${childProfileId}::uuid and a.workos_user_id = ${identity.providerUserId}
            and a.primary_email = ${identity.email} and l.status = 'active'
        ),
        child_update as (
          update child_profiles c set status = ${childStatus}, updated_at = ${at}::timestamptz
          from owned o where c.id = o.id returning c.id, c.status
        ),
        link_update as (
          update guardian_child_links l set
            status = case when ${action} in ('withdraw_consent', 'unlink_child') then 'revoked' else l.status end,
            revoked_at = case when ${action} in ('withdraw_consent', 'unlink_child') then ${at}::timestamptz else l.revoked_at end
          from child_update c where l.child_profile_id = c.id returning l.id
        ),
        receipt_update as (
          update guardian_consent_receipts r set status = ${receiptStatus},
            withdrawn_at = case when ${action} = 'withdraw_consent' then ${at}::timestamptz else r.withdrawn_at end
          from child_update c where r.child_profile_id = c.id returning r.id
        )
        select c.id as child_profile_id, c.status from child_update c, link_update l, receipt_update r
      `);
      const row = resultRows(rows)[0];
      if (!row) throw new PortalClaimError("guardian_child_not_found", 404);
      return { childProfileId: row.child_profile_id, action, status: row.status, effectiveAt: at };
    },
  };
}

function normalizeChallenge(row) {
  return {
    id: row.id,
    requestId: row.requestId ?? row.request_id,
    status: row.status,
    guardianFirstName: row.guardianFirstName ?? row.guardian_first_name,
    guardianEmail: row.guardianEmail ?? row.guardian_email,
    providerChallengeId: row.providerChallengeId ?? row.provider_challenge_id,
    providerUserId: row.providerUserId ?? row.provider_user_id,
    guardianAttested: row.guardianAttested ?? row.guardian_attested,
    noticeAccepted: row.noticeAccepted ?? row.notice_accepted,
    aiPracticeApproved: row.aiPracticeApproved ?? row.ai_practice_approved,
    advisorContactApproved: row.advisorContactApproved ?? row.advisor_contact_approved,
    policyVersion: row.policyVersion ?? row.policy_version,
    noticeHash: row.noticeHash ?? row.notice_hash,
    expiresAt: iso(row.expiresAt ?? row.expires_at),
    verifiedAt: iso(row.verifiedAt ?? row.verified_at),
    consumedAt: iso(row.consumedAt ?? row.consumed_at),
    createdAt: iso(row.createdAt ?? row.created_at),
    updatedAt: iso(row.updatedAt ?? row.updated_at),
  };
}

function toReceipt(row) {
  const accountId = row.account_id ?? row.accountId;
  const childId = row.child_profile_id ?? row.childProfileId;
  const permissions = row.permissions || {};
  return {
    account: { id: accountId, firstName: row.guardian_first_name, email: row.primary_email, accountType: "guardian" },
    child: { id: childId, firstName: row.child_first_name, ageBand: row.age_band, status: row.child_status },
    result: {
      status: row.result_status,
      recommendedLevelKey: row.recommended_level_key,
      recommendedLevelLabel: row.recommended_level_label,
    },
    consent: {
      receiptCode: row.receipt_code,
      policyVersion: row.policy_version,
      permissions,
      withdrawalHref: "/portal/#privacidad-tutor",
    },
    portalHref: "/portal/?welcome=guardian",
  };
}

function iso(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function resultRows(result) {
  return Array.isArray(result) ? result : result?.rows || [];
}
