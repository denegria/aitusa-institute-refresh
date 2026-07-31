import { sql } from "drizzle-orm";

export function createNeonPortalAuthRepository(database) {
  if (!database) throw new Error("portal_database_required");

  return {
    async reserveAuthAttempt({
      id,
      eventType,
      keyVersion,
      emailKeyHash,
      ipKeyHash,
      now,
      expiresAt,
      windowMinutes,
      emailCooldownSeconds,
      ipCooldownSeconds,
      emailBudget,
      ipBudget,
    }) {
      const nowIso = now.toISOString();
      const result = await database.execute(sql`
        with ordered_lock_keys as materialized (
          select lock_key
          from (
            values
              (${"email:" + keyVersion + ":" + emailKeyHash}),
              (${"ip:" + keyVersion + ":" + ipKeyHash})
          ) as lock_keys(lock_key)
          order by lock_key
        ),
        acquired_locks as materialized (
          select pg_advisory_xact_lock(hashtextextended(lock_key, 0))
          from ordered_lock_keys
        ),
        recent as materialized (
          select
            max(event.occurred_at) filter (
              where event.email_key_hash = ${emailKeyHash}
            ) as last_email_allowed_at,
            max(event.occurred_at) filter (
              where event.ip_key_hash = ${ipKeyHash}
            ) as last_ip_allowed_at,
            count(*) filter (
              where event.email_key_hash = ${emailKeyHash}
            )::int as email_attempt_count,
            count(*) filter (
              where event.ip_key_hash = ${ipKeyHash}
            )::int as ip_attempt_count
          from portal_auth_events event
          where event.event_type = ${eventType}
            and event.key_version = ${keyVersion}
            and event.decision = 'allowed'
            and event.occurred_at >=
              ${nowIso}::timestamptz -
              (${windowMinutes}::int * interval '1 minute')
            and event.expires_at > ${nowIso}::timestamptz
            and (
              event.email_key_hash = ${emailKeyHash}
              or event.ip_key_hash = ${ipKeyHash}
            )
            and (select count(*) from acquired_locks) = 2
        ),
        rate_decision as (
          select
            case
              when ${emailCooldownSeconds}::int > 0
                and recent.last_email_allowed_at >
                  ${nowIso}::timestamptz -
                  (${emailCooldownSeconds}::int * interval '1 second')
                then 'blocked_cooldown'
              when ${ipCooldownSeconds}::int > 0
                and recent.last_ip_allowed_at >
                  ${nowIso}::timestamptz -
                  (${ipCooldownSeconds}::int * interval '1 second')
                then 'blocked_cooldown'
              when recent.email_attempt_count >= ${emailBudget}::int
                then 'blocked_email_budget'
              when recent.ip_attempt_count >= ${ipBudget}::int
                then 'blocked_ip_budget'
              else 'allowed'
            end as decision
          from recent
        )
        insert into portal_auth_events (
          id,
          event_type,
          key_version,
          email_key_hash,
          ip_key_hash,
          decision,
          outcome,
          occurred_at,
          expires_at
        )
        select
          ${id}::uuid,
          ${eventType},
          ${keyVersion},
          ${emailKeyHash},
          ${ipKeyHash},
          rate_decision.decision,
          case
            when rate_decision.decision = 'allowed' then 'pending'
            else 'rate_limited'
          end,
          ${nowIso}::timestamptz,
          ${expiresAt.toISOString()}::timestamptz
        from rate_decision
        returning id, decision
      `);
      const row = rows(result)[0];
      if (!row) throw new Error("portal_auth_rate_limit_reservation_failed");
      return {
        id: row.id,
        allowed: row.decision === "allowed",
        decision: row.decision,
      };
    },

    async completeAuthAttempt({ id, outcome }) {
      await database.execute(sql`
        update portal_auth_events
        set outcome = ${outcome}
        where id = ${id}::uuid
          and outcome = 'pending'
      `);
    },

    async recordAuthEvent({
      id,
      eventType,
      keyVersion,
      emailKeyHash,
      ipKeyHash,
      decision,
      outcome,
      occurredAt,
      expiresAt,
    }) {
      await database.execute(sql`
        insert into portal_auth_events (
          id,
          event_type,
          key_version,
          email_key_hash,
          ip_key_hash,
          decision,
          outcome,
          occurred_at,
          expires_at
        )
        values (
          ${id}::uuid,
          ${eventType},
          ${keyVersion},
          ${emailKeyHash},
          ${ipKeyHash},
          ${decision},
          ${outcome},
          ${occurredAt.toISOString()}::timestamptz,
          ${expiresAt.toISOString()}::timestamptz
        )
      `);
    },

    async hasActivePortalAccountByEmail(email) {
      const result = await database.execute(sql`
        select exists(
          select 1
          from portal_accounts account
          where lower(account.primary_email) = ${email}
            and account.status = 'active'
        ) as has_active_account
      `);
      return toBoolean(rows(result)[0]?.has_active_account);
    },

    async getAuthorizedStudyBuddyContext(identity) {
      const result = await database.execute(sql`
        with matching_accounts as (
          select id, status, account_type
          from portal_accounts
          where workos_user_id = ${identity.providerUserId}
            and lower(primary_email) = ${identity.email.trim().toLowerCase()}
            and status = 'active'
          order by id
          limit 2
        ),
        single_account as (
          select * from matching_accounts
          where (select count(*) from matching_accounts) = 1
        )
        select
          account.id as account_id,
          account.status as account_status,
          account.account_type,
          result.id as result_id,
          result.result_status,
          result.recommended_level_key,
          result.recommended_level_label
        from single_account account
        left join lateral (
          select result.*
          from diagnostic_attempts attempt
          join diagnostic_results result on result.attempt_id = attempt.id
          where attempt.claimed_account_id = account.id
            and attempt.status = 'claimed'
          order by attempt.claimed_at desc nulls last, result.created_at desc
          limit 1
        ) result on true
        limit 1
      `);
      const row = rows(result)[0];
      if (!row) return null;
      return {
        snapshot: {
          state: "authenticated",
          account: { status: row.account_status, accountType: row.account_type },
          result: row.result_id
            ? {
                status: row.result_status,
                recommendedLevelKey: row.recommended_level_key,
                recommendedLevelLabel: row.recommended_level_label,
              }
            : null,
          practice: { eligible: false, reason: "feature_not_approved" },
        },
        ownership: { accountId: row.account_id, resultId: row.result_id },
      };
    },

    async getActivePortalSnapshot(identity) {
      const result = await database.execute(sql`
        with matching_accounts as (
          select
            pa.id,
            pa.status,
            pa.account_type,
            pa.first_name,
            pa.primary_email,
            pa.preferred_language
          from portal_accounts pa
          where pa.workos_user_id = ${identity.providerUserId}
            and lower(pa.primary_email) = ${identity.email.trim().toLowerCase()}
            and pa.status = 'active'
          order by pa.id
          limit 2
        ),
        single_account as (
          select ma.*
          from matching_accounts ma
          where (select count(*) from matching_accounts) = 1
        )
        select
          account.id as account_id,
          account.status as account_status,
          account.account_type,
          account.first_name,
          account.primary_email,
          account.preferred_language,
          latest.attempt_id,
          latest.result_status,
          latest.recommended_level_key,
          latest.recommended_level_label,
          latest.answered_question_count,
          latest.skipped_question_count,
          latest.advisor_confirmation_required,
          latest.product_contract_version,
          latest.question_bank_version,
          latest.scoring_contract_version,
          latest.result_copy_version,
          latest.goal,
          latest.completed_at,
          latest.advisor_contact_requested,
          account_consent.decision as account_consent_decision,
          account_consent.policy_version as account_consent_policy_version,
          account_consent.occurred_at as account_consent_occurred_at,
          advisor_consent.decision as advisor_consent_decision,
          advisor_consent.policy_version as advisor_consent_policy_version,
          advisor_consent.occurred_at as advisor_consent_occurred_at,
          delivery.status as outbox_status,
          delivery.delivered_at as outbox_delivered_at,
          practice_history.items as recent_practice
        from single_account account
        left join lateral (
          select
            attempt.id as attempt_id,
            result.result_status,
            result.recommended_level_key,
            result.recommended_level_label,
            result.answered_question_count,
            result.skipped_question_count,
            result.advisor_confirmation_required,
            result.product_contract_version,
            result.question_bank_version,
            result.scoring_contract_version,
            result.result_copy_version,
            context.goal,
            attempt.completed_at,
            claimed.claim_id,
            claimed.advisor_contact_requested
          from diagnostic_attempts attempt
          join diagnostic_results result on result.attempt_id = attempt.id
          left join diagnostic_contexts context
            on context.attempt_id = attempt.id
          join lateral (
            select
              challenge.claim_id,
              challenge.advisor_contact_requested
            from result_claims result_claim
            join portal_auth_challenges challenge
              on challenge.result_claim_id = result_claim.id
             and challenge.status = 'consumed'
            where result_claim.attempt_id = attempt.id
              and result_claim.claimed_account_id = account.id
              and result_claim.status = 'consumed'
            order by challenge.consumed_at desc nulls last
            limit 1
          ) claimed on true
          where attempt.claimed_account_id = account.id
            and attempt.status = 'claimed'
          order by
            attempt.claimed_at desc nulls last,
            attempt.completed_at desc nulls last,
            result.created_at desc
          limit 1
        ) latest on true
        left join lateral (
          select
            consent.decision,
            consent.policy_version,
            consent.occurred_at
          from consent_records consent
          where consent.account_id = account.id
            and consent.purpose = 'portal_account_creation'
          order by consent.occurred_at desc
          limit 1
        ) account_consent on true
        left join lateral (
          select
            consent.decision,
            consent.policy_version,
            consent.occurred_at
          from consent_records consent
          where consent.account_id = account.id
            and consent.attempt_id = latest.attempt_id
            and consent.purpose = 'advisor_contact'
          order by consent.occurred_at desc
          limit 1
        ) advisor_consent on true
        left join lateral (
          select
            outbox.status,
            outbox.delivered_at
          from crm_outbox outbox
          where outbox.correlation_id = latest.claim_id
            and outbox.event_type = 'advisor_handoff_requested'
          order by outbox.created_at desc
          limit 1
        ) delivery on true
        left join lateral (
          select coalesce(
            jsonb_agg(
              jsonb_build_object(
                'scenario', practice.scenario,
                'state', practice.state,
                'turnCount', practice.turn_count,
                'successCode', practice.safe_success_code,
                'focusCode', practice.safe_focus_code,
                'completedAt', practice.completed_at
              ) order by practice.completed_at desc
            ),
            '[]'::jsonb
          ) as items
          from (
            select
              session.scenario,
              session.state,
              session.turn_count,
              session.safe_success_code,
              session.safe_focus_code,
              session.completed_at
            from ai_practice_sessions session
            where session.account_id = account.id
              and session.state in ('completed', 'escalated')
            order by session.completed_at desc
            limit 3
          ) practice
        ) practice_history on true
        limit 1
      `);

      const row = rows(result)[0];
      return row ? toSafePortalSnapshot(row) : null;
    },
  };
}

export function toSafePortalSnapshot(row) {
  const result = row.attempt_id
    ? {
        status: row.result_status,
        recommendedLevelKey: row.recommended_level_key,
        recommendedLevelLabel: row.recommended_level_label,
        answeredQuestionCount: Number(row.answered_question_count),
        skippedQuestionCount: Number(row.skipped_question_count),
        advisorConfirmationRequired:
          Number(row.advisor_confirmation_required) === 1,
        goal: cleanNullableText(row.goal),
        completedAt: toIso(row.completed_at),
        productContractVersion: row.product_contract_version,
        questionBankVersion: row.question_bank_version,
        scoringContractVersion: row.scoring_contract_version,
        resultCopyVersion: row.result_copy_version,
      }
    : null;
  const accountCreationConsent = consentSnapshot(
    row.account_consent_policy_version,
    row.account_consent_decision,
    row.account_consent_occurred_at,
  );
  const advisorContactConsent = consentSnapshot(
    row.advisor_consent_policy_version,
    row.advisor_consent_decision,
    row.advisor_consent_occurred_at,
  );
  const requested =
    advisorContactConsent?.decision === true ||
    toBoolean(row.advisor_contact_requested);
  const outboxStatus = row.outbox_status || null;

  return {
    state: "authenticated",
    account: {
      status: "active",
      accountType: row.account_type,
      firstName: row.first_name,
      email: row.primary_email,
      preferredLanguage: row.preferred_language,
    },
    result,
    consents: {
      accountCreation: accountCreationConsent,
      advisorContact: advisorContactConsent,
    },
    advisor: {
      requested,
      deliveryStatus: advisorDeliveryStatus(requested, outboxStatus),
      delivery: {
        queued: Boolean(outboxStatus),
        status: outboxStatus || (requested ? "not_queued" : "not_requested"),
        deliveredAt: toIso(row.outbox_delivered_at),
      },
    },
    practice: {
      eligible: false,
      reason: "feature_not_approved",
    },
    recentPractice: normalizeRecentPractice(row.recent_practice),
  };
}

const PRACTICE_SCENARIO_LABELS = Object.freeze({
  daily_routine: "Mi rutina diaria",
  workplace_exchange: "Pedir ayuda en el trabajo",
  guided_discussion: "Expresar una opinión",
});

const PRACTICE_FOCUS_LABELS = Object.freeze({
  meaning_acknowledged: "Mensaje claro",
  focus_pronunciation: "Próximo enfoque: pronunciación",
  focus_grammar: "Próximo enfoque: precisión gramatical",
  escalation_needed: "Apoyo recomendado",
});

function normalizeRecentPractice(value) {
  let entries = value;
  if (typeof entries === "string") {
    try {
      entries = JSON.parse(entries);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(entries)) return [];
  return entries
    .filter((item) =>
      item &&
      PRACTICE_SCENARIO_LABELS[item.scenario] &&
      ["completed", "escalated"].includes(item.state),
    )
    .slice(0, 3)
    .map((item) => ({
      scenarioLabel: PRACTICE_SCENARIO_LABELS[item.scenario],
      completedAt: toIso(item.completedAt),
      successLabel:
        item.state === "completed"
          ? "Completaste la conversación"
          : "La práctica terminó con apoyo recomendado",
      focusLabel: PRACTICE_FOCUS_LABELS[item.focusCode] || "",
    }));
}

function consentSnapshot(policyVersion, decision, occurredAt) {
  if (!policyVersion) return null;
  return {
    decision: toBoolean(decision),
    policyVersion,
    occurredAt: toIso(occurredAt),
  };
}

function advisorDeliveryStatus(requested, outboxStatus) {
  if (!requested) return "not_requested";
  if (!outboxStatus) return "not_queued";
  if (outboxStatus === "delivered") return "delivered";
  if (outboxStatus === "dead_letter") return "needs_attention";
  return "pending";
}

function cleanNullableText(value) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function toBoolean(value) {
  return (
    value === true ||
    value === 1 ||
    value === "1" ||
    value === "t" ||
    value === "true"
  );
}

function toIso(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function rows(result) {
  return Array.isArray(result) ? result : result?.rows || [];
}
