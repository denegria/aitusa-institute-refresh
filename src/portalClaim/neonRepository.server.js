import { and, eq, sql } from "drizzle-orm";
import { portalAccounts, portalAuthChallenges } from "../diagnostic/schema.js";
import { PortalClaimError } from "./errors.js";

export function createNeonPortalClaimRepository(database) {
  if (!database) throw new Error("portal_database_required");

  return {
    async getChallengeByClaimId(claimId) {
      const [row] = await database
        .select()
        .from(portalAuthChallenges)
        .where(eq(portalAuthChallenges.claimId, claimId))
        .limit(1);
      return row ? normalizeChallenge(row) : null;
    },

    async getChallenge({ challengeId, claimId }) {
      const [row] = await database
        .select()
        .from(portalAuthChallenges)
        .where(
          and(
            eq(portalAuthChallenges.id, challengeId),
            eq(portalAuthChallenges.claimId, claimId),
          ),
        )
        .limit(1);
      return row ? normalizeChallenge(row) : null;
    },

    async createChallenge(input) {
      const [created] = await database
        .insert(portalAuthChallenges)
        .values({
          ...input,
          expiresAt: new Date(input.expiresAt),
          createdAt: new Date(input.createdAt),
          updatedAt: new Date(input.updatedAt),
        })
        .onConflictDoNothing({ target: portalAuthChallenges.claimId })
        .returning();
      if (created) return { challenge: normalizeChallenge(created), replayed: false };

      const existing = await this.getChallengeByClaimId(input.claimId);
      if (
        !existing ||
        existing.attemptId !== input.attemptId ||
        existing.email !== input.email ||
        existing.firstName !== input.firstName
      ) {
        throw new PortalClaimError("claim_idempotency_conflict", 409);
      }
      return { challenge: existing, replayed: true };
    },

    async finalizeClaim({
      challengeId,
      claimId,
      identity,
      accountId,
      consentAccountId,
      consentAdvisorId,
      outboxIds,
      now,
      rawAnswersPurgeAt,
    }) {
      const nowIso = now.toISOString();
      try {
        const result = await database.execute(sql`
          with eligible as (
            select
              ch.*,
              rc.id as result_claim_id,
              r.id as result_id,
              r.result_status,
              r.recommended_level_key,
              r.recommended_level_label,
              r.answered_question_count,
              r.skipped_question_count,
              r.advisor_confirmation_required,
              r.product_contract_version,
              r.question_bank_version,
              r.answer_key_version,
              r.level_map_version,
              r.scoring_contract_version,
              r.result_copy_version,
              a.started_at,
              a.completed_at,
              c.goal
            from portal_auth_challenges ch
            join result_claims rc
              on rc.id = ch.result_claim_id
             and rc.attempt_id = ch.attempt_id
            join diagnostic_attempts a
              on a.id = ch.attempt_id
            join diagnostic_results r
              on r.attempt_id = ch.attempt_id
            left join diagnostic_contexts c
              on c.attempt_id = ch.attempt_id
            where ch.id = ${challengeId}::uuid
              and ch.claim_id = ${claimId}
              and ch.status in ('pending', 'verified')
              and ch.expires_at > ${nowIso}::timestamptz
              and rc.status = 'pending'
              and rc.expires_at > ${nowIso}::timestamptz
              and a.status in ('completed', 'claim_pending')
          ),
          identity_conflict as (
            select pa.id
            from portal_accounts pa
            join eligible e on lower(pa.primary_email) = e.email
            where pa.workos_user_id <> ${identity.providerUserId}
              and pa.status <> 'deleted'
          ),
          employee_conflict as (
            select pa.id
            from portal_accounts pa
            join employee_review_roles role
              on role.portal_account_id = pa.id
             and role.active = true
            join eligible e on pa.primary_email = e.email
            where pa.workos_user_id = ${identity.providerUserId}
              and pa.status = 'active'
          ),
          account_write as (
            insert into portal_accounts (
              id,
              workos_user_id,
              status,
              account_type,
              first_name,
              primary_email,
              preferred_language,
              created_at,
              updated_at,
              last_signed_in_at
            )
            select
              ${accountId}::uuid,
              ${identity.providerUserId},
              'active',
              e.account_type,
              e.first_name,
              e.email,
              'es',
              ${nowIso}::timestamptz,
              ${nowIso}::timestamptz,
              ${nowIso}::timestamptz
            from eligible e
            where not exists (select 1 from identity_conflict)
              and not exists (select 1 from employee_conflict)
            on conflict (workos_user_id) do update
            set last_signed_in_at = excluded.last_signed_in_at,
                updated_at = excluded.updated_at,
                first_name = case
                  when portal_accounts.first_name = '' then excluded.first_name
                  else portal_accounts.first_name
                end,
                primary_email = excluded.primary_email
            returning *
          ),
          challenge_update as (
            update portal_auth_challenges ch
            set status = 'consumed',
                verified_at = coalesce(ch.verified_at, ${nowIso}::timestamptz),
                consumed_at = ${nowIso}::timestamptz,
                updated_at = ${nowIso}::timestamptz
            from eligible e, account_write aw
            where ch.id = e.id
            returning ch.*, aw.id as account_id
          ),
          claim_update as (
            update result_claims rc
            set status = 'consumed',
                consumed_at = ${nowIso}::timestamptz,
                claimed_account_id = cu.account_id
            from challenge_update cu
            where rc.id = cu.result_claim_id
            returning rc.*, cu.account_id
          ),
          attempt_update as (
            update diagnostic_attempts a
            set status = 'claimed',
                claimed_at = ${nowIso}::timestamptz,
                claimed_account_id = cu.account_id,
                raw_answers_purge_at = ${rawAnswersPurgeAt.toISOString()}::timestamptz,
                last_activity_at = ${nowIso}::timestamptz
            from challenge_update cu, claim_update rc
            where a.id = cu.attempt_id
              and rc.id = cu.result_claim_id
            returning a.id, cu.account_id
          ),
          account_consent as (
            insert into consent_records (
              id,
              account_id,
              attempt_id,
              purpose,
              channel,
              decision,
              policy_version,
              disclosure_hash,
              capture_method,
              correlation_id,
              occurred_at,
              created_at
            )
            select
              ${consentAccountId}::uuid,
              au.account_id,
              au.id,
              'portal_account_creation',
              'web',
              true,
              e.privacy_policy_version || '+' || e.terms_version,
              e.disclosure_hash,
              'verified_email_action',
              e.claim_id,
              ${nowIso}::timestamptz,
              ${nowIso}::timestamptz
            from attempt_update au
            join eligible e on e.attempt_id = au.id
            on conflict (correlation_id, purpose) do nothing
            returning id
          ),
          advisor_consent as (
            insert into consent_records (
              id,
              account_id,
              attempt_id,
              purpose,
              channel,
              decision,
              policy_version,
              disclosure_hash,
              capture_method,
              correlation_id,
              occurred_at,
              created_at
            )
            select
              ${consentAdvisorId}::uuid,
              au.account_id,
              au.id,
              'advisor_contact',
              'email',
              e.advisor_contact_requested,
              e.privacy_policy_version,
              e.advisor_disclosure_hash,
              'explicit_checkbox',
              e.claim_id,
              ${nowIso}::timestamptz,
              ${nowIso}::timestamptz
            from attempt_update au
            join eligible e on e.attempt_id = au.id
            on conflict (correlation_id, purpose) do nothing
            returning id
          ),
          outbox_write as (
            insert into crm_outbox (
              id,
              event_type,
              idempotency_key,
              correlation_id,
              payload,
              status,
              attempt_count,
              next_attempt_at,
              created_at
            )
            select
              events.id,
              events.event_type,
              events.idempotency_key,
              e.claim_id,
              jsonb_build_object(
                'schemaVersion', 'aitusa-crm-event-v1',
                'eventId', events.idempotency_key,
                'eventType', events.event_type,
                'idempotencyKey', events.idempotency_key,
                'correlationId', e.claim_id,
                'occurredAt', events.occurred_at,
                'source', jsonb_build_object(
                  'product', 'aitusa_refresh',
                  'surface', 'portal',
                  'path', '/portal/result-claim',
                  'version', 'mis-343-v1'
                ),
                'contact', jsonb_build_object('firstName', e.first_name, 'email', e.email),
                'consent', jsonb_build_object('advisorContactEmail', e.advisor_contact_requested, 'policyVersion', e.privacy_policy_version),
                'placement', jsonb_build_object(
                  'resultId', e.result_id,
                  'resultStatus', e.result_status,
                  'recommendedLevelKey', e.recommended_level_key,
                  'recommendedLevelLabel', e.recommended_level_label,
                  'answeredQuestionCount', e.answered_question_count,
                  'skippedQuestionCount', e.skipped_question_count,
                  'advisorConfirmationRequired', e.advisor_confirmation_required = 1,
                  'scoringContractVersion', e.scoring_contract_version
                )
              ),
              'pending',
              0,
              ${nowIso}::timestamptz,
              ${nowIso}::timestamptz
            from eligible e
            join attempt_update au on au.id = e.attempt_id
            cross join lateral (
              select ${outboxIds.placementStarted}::uuid as id, 'placement_started'::text as event_type,
                'aitusa:placement-started:' || e.attempt_id::text as idempotency_key, e.started_at as occurred_at
              union all select ${outboxIds.placementCompleted}::uuid, 'placement_completed',
                'aitusa:placement-completed:' || e.attempt_id::text, e.completed_at
              union all select ${outboxIds.resultClaimed}::uuid, 'result_claimed',
                'aitusa:result-claimed:' || e.claim_id, ${nowIso}::timestamptz
              union all select ${outboxIds.portalAccountActivated}::uuid, 'portal_account_activated',
                'aitusa:portal-account-activated:' || au.account_id::text, ${nowIso}::timestamptz
              union all select ${outboxIds.advisorHandoff}::uuid, 'advisor_handoff_requested',
                'aitusa:advisor-handoff:' || e.claim_id, ${nowIso}::timestamptz
                where e.advisor_contact_requested = true
            ) events
            on conflict (idempotency_key) do nothing
            returning id
          )
          select
            aw.id as account_id,
            aw.first_name,
            aw.primary_email,
            e.attempt_id,
            e.result_id,
            e.result_status,
            e.recommended_level_key,
            e.recommended_level_label,
            e.answered_question_count,
            e.skipped_question_count,
            e.advisor_confirmation_required,
            e.advisor_contact_requested,
            exists(select 1 from outbox_write) as crm_queued
          from account_write aw
          join challenge_update cu on cu.account_id = aw.id
          join eligible e on e.id = cu.id
          where exists(select 1 from account_consent)
             or exists(
               select 1
               from consent_records cr
               where cr.correlation_id = e.claim_id
                 and cr.purpose = 'portal_account_creation'
             )
        `);
        const row = rows(result)[0];
        if (row) return normalizeReceipt(row);
      } catch (error) {
        if (error?.code === "23505") {
          throw new PortalClaimError("portal_identity_conflict", 409);
        }
        throw error;
      }

      const challenge = await this.getChallenge({ challengeId, claimId });
      if (!challenge) throw new PortalClaimError("claim_challenge_not_found", 404);
      if (challenge.status === "consumed") {
        return this.getClaimReceipt({ challengeId, claimId, identity });
      }
      if (new Date(challenge.expiresAt) <= now) {
        throw new PortalClaimError("claim_challenge_expired", 410);
      }
      const [emailOwner] = await database
        .select({
          workosUserId: portalAccounts.workosUserId,
        })
        .from(portalAccounts)
        .where(eq(portalAccounts.primaryEmail, challenge.email))
        .limit(1);
      if (emailOwner && emailOwner.workosUserId !== identity.providerUserId) {
        throw new PortalClaimError("portal_identity_conflict", 409);
      }
      const employee = await database.execute(sql`
        select exists(
          select 1 from portal_accounts account
          join employee_review_roles role
            on role.portal_account_id = account.id
           and role.active = true
          where account.workos_user_id = ${identity.providerUserId}
            and lower(account.primary_email) = ${challenge.email}
            and account.status = 'active'
        ) as employee_account
      `);
      if (toBool(rows(employee)[0]?.employee_account)) {
        throw new PortalClaimError("employee_account_student_claim_forbidden", 409);
      }
      throw new PortalClaimError("result_claim_not_eligible", 409);
    },

    async getClaimReceipt({ challengeId, claimId, identity }) {
      const result = await database.execute(sql`
        select
          pa.id as account_id,
          pa.first_name,
          pa.primary_email,
          ch.attempt_id,
          r.id as result_id,
          r.result_status,
          r.recommended_level_key,
          r.recommended_level_label,
          r.answered_question_count,
          r.skipped_question_count,
          r.advisor_confirmation_required,
          ch.advisor_contact_requested,
          exists(
            select 1
            from crm_outbox o
            where o.idempotency_key = 'aitusa:advisor-handoff:' || ch.claim_id
          ) as crm_queued
        from portal_auth_challenges ch
        join result_claims rc on rc.id = ch.result_claim_id
        join portal_accounts pa on pa.id = rc.claimed_account_id
        join diagnostic_results r on r.attempt_id = ch.attempt_id
        where ch.id = ${challengeId}::uuid
          and ch.claim_id = ${claimId}
          and ch.status = 'consumed'
          and rc.status = 'consumed'
          and pa.workos_user_id = ${identity.providerUserId}
          and lower(pa.primary_email) = ${identity.email.trim().toLowerCase()}
          and not exists (
            select 1 from employee_review_roles role
            where role.portal_account_id = pa.id
              and role.active = true
          )
        limit 1
      `);
      const row = rows(result)[0];
      if (!row) throw new PortalClaimError("result_claim_not_eligible", 409);
      return normalizeReceipt(row);
    },
  };
}

function normalizeChallenge(row) {
  return {
    ...row,
    expiresAt: toIso(row.expiresAt),
    verifiedAt: toIso(row.verifiedAt),
    consumedAt: toIso(row.consumedAt),
    createdAt: toIso(row.createdAt),
    updatedAt: toIso(row.updatedAt),
  };
}

function normalizeReceipt(row) {
  return {
    account: {
      id: row.account_id,
      firstName: row.first_name,
      email: row.primary_email,
      accountType: "adult_student",
    },
    result: {
      id: row.result_id,
      attemptId: row.attempt_id,
      status: row.result_status,
      recommendedLevelKey: row.recommended_level_key,
      recommendedLevelLabel: row.recommended_level_label,
      answeredQuestionCount: Number(row.answered_question_count),
      skippedQuestionCount: Number(row.skipped_question_count),
      advisorConfirmationRequired:
        Number(row.advisor_confirmation_required) === 1,
    },
    advisorContactRequested: Boolean(row.advisor_contact_requested),
    crmQueued: Boolean(row.crm_queued),
    portalHref: "/portal/?welcome=1",
  };
}

function rows(result) {
  return Array.isArray(result) ? result : result?.rows || [];
}

function toBool(value) {
  return value === true || value === "t" || value === 1 || value === "1";
}

function toIso(value) {
  if (!value) return null;
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}
