import { randomUUID } from "node:crypto";
import { StudyBuddyError } from "./errors.js";

const CIRCUIT_CAPABILITY = "study_buddy_turn";

export function createNeonStudyBuddyRepository({
  client,
  now = () => new Date(),
  createId = randomUUID,
  circuitFailureThreshold = 3,
  circuitOpenMs = 60_000,
} = {}) {
  if (!client || typeof client !== "function" || typeof client.transaction !== "function") {
    throw new Error("study_buddy_neon_client_required");
  }

  async function locked(lockKeys, buildQueries) {
    const keys = [...new Set(lockKeys)].sort();
    return client.transaction((tx) => [
      ...keys.map((key) => tx`select pg_advisory_xact_lock(hashtextextended(${key}, 0))`),
      ...buildQueries(tx),
    ]);
  }

  async function reserveStart({
    accountId,
    resultId,
    verifiedEmailHmac,
    hashVersion,
    plan,
    providerProfile,
    policyVersion,
    limits,
  }) {
    validateStartInput({ providerProfile, policyVersion, limits });
    const at = now();
    await reapExpired(at);
    const utcDay = at.toISOString().slice(0, 10);
    const sessionId = createId();
    const entitlementId = createId();
    const reservationId = createId();
    const outboxId = createId();
    const expiresAt = new Date(at.getTime() + limits.sessionMinutes * 60_000);
    const results = await locked(
      [`study-buddy:entitlement:${hashVersion}:${verifiedEmailHmac}`, `study-buddy:budget:${accountId}:${utcDay}`],
      (tx) => [
        tx`insert into ai_provider_circuit_state (capability) values (${CIRCUIT_CAPABILITY}) on conflict (capability) do nothing`,
        tx`insert into ai_practice_entitlements (id, verified_email_hmac, hash_version, state, created_at, updated_at)
          values (${entitlementId}::uuid, ${verifiedEmailHmac}, ${hashVersion}, 'available', ${at.toISOString()}::timestamptz, ${at.toISOString()}::timestamptz)
          on conflict (verified_email_hmac, hash_version) do nothing`,
        tx`insert into ai_practice_account_day_budgets (account_id, utc_day, updated_at)
          values (${accountId}::uuid, ${utcDay}, ${at.toISOString()}::timestamptz)
          on conflict (account_id, utc_day) do nothing`,
        tx`with existing as (
          select s.*, r.reserved_micro_usd, r.charged_micro_usd as budget_charged_micro_usd,
            r.released_micro_usd,
            coalesce((select sum(o.reserved_micro_usd) from ai_practice_turn_operations o where o.session_id = s.id and o.state in ('claimed', 'ambiguous')), 0)::integer as pending_micro_usd
          from ai_practice_sessions s
          join ai_practice_budget_reservations r on r.session_id = s.id
          where s.account_id = ${accountId}::uuid
            and s.result_id = ${resultId}::uuid
            and s.state = 'active'
            and s.expires_at > ${at.toISOString()}::timestamptz
          order by s.created_at desc
          limit 1
        ),
        entitlement_state as (
          select * from ai_practice_entitlements
          where verified_email_hmac = ${verifiedEmailHmac} and hash_version = ${hashVersion}
        ),
        day_current as (
          select * from ai_practice_account_day_budgets
          where account_id = ${accountId}::uuid and utc_day = ${utcDay}
        ),
        day_reserve as (
          update ai_practice_account_day_budgets d
          set reserved_micro_usd = d.reserved_micro_usd + ${limits.maxSessionMicroUsd},
              updated_at = ${at.toISOString()}::timestamptz
          where d.account_id = ${accountId}::uuid
            and d.utc_day = ${utcDay}
            and d.reserved_micro_usd - d.released_micro_usd + ${limits.maxSessionMicroUsd} <= ${limits.maxDayMicroUsd}
            and not exists (select 1 from existing)
            and exists (select 1 from entitlement_state e where e.state = 'available')
          returning d.*
        ),
        entitlement_reserve as (
          update ai_practice_entitlements e
          set state = 'reserved', updated_at = ${at.toISOString()}::timestamptz
          where e.verified_email_hmac = ${verifiedEmailHmac}
            and e.hash_version = ${hashVersion}
            and e.state = 'available'
            and exists (select 1 from day_reserve)
          returning e.*
        ),
        session_write as (
          insert into ai_practice_sessions (
            id, account_id, result_id, entitlement_id, scenario, use_case, plan_version,
            state, turn_count, retry_count, input_units, output_units, charged_micro_usd,
            provider_profile, policy_version, created_at, updated_at, expires_at
          )
          select ${sessionId}::uuid, ${accountId}::uuid, ${resultId}::uuid, e.id,
            ${plan.scenario}, ${plan.useCase}, ${plan.version}, 'active', 0, 0, 0, 0, 0,
            ${providerProfile}, ${policyVersion}, ${at.toISOString()}::timestamptz,
            ${at.toISOString()}::timestamptz, ${expiresAt.toISOString()}::timestamptz
          from entitlement_reserve e
          returning *
        ),
        reservation_write as (
          insert into ai_practice_budget_reservations (
            id, session_id, account_id, utc_day, state, reserved_micro_usd,
            charged_micro_usd, released_micro_usd, created_at
          )
          select ${reservationId}::uuid, s.id, s.account_id, ${utcDay}, 'reserved',
            ${limits.maxSessionMicroUsd}, 0, 0, ${at.toISOString()}::timestamptz
          from session_write s
          returning *
        ),
        outbox_write as (
          insert into crm_outbox (id, event_type, idempotency_key, correlation_id, payload, status, attempt_count, next_attempt_at, created_at)
          select ${outboxId}::uuid, 'ai_practice_started', 'aitusa:ai-practice-started:' || s.id::text, s.result_id::text,
            jsonb_build_object(
              'schemaVersion', 'aitusa-crm-event-v1', 'eventId', 'aitusa:ai-practice-started:' || s.id::text,
              'eventType', 'ai_practice_started', 'idempotencyKey', 'aitusa:ai-practice-started:' || s.id::text,
              'correlationId', s.result_id::text, 'occurredAt', ${at.toISOString()}::timestamptz,
              'source', jsonb_build_object('product', 'aitusa_refresh', 'surface', 'portal', 'path', '/portal/study', 'version', 'mis-343-v1'),
              'contact', jsonb_build_object('firstName', account.first_name, 'email', account.primary_email),
              'practice', jsonb_build_object('sessionId', s.id::text, 'state', s.state, 'scenario', s.scenario, 'useCase', s.use_case, 'turnCount', s.turn_count, 'planVersion', s.plan_version)
            ), 'pending', 0, ${at.toISOString()}::timestamptz, ${at.toISOString()}::timestamptz
          from session_write s join portal_accounts account on account.id = s.account_id
          on conflict (idempotency_key) do nothing
          returning id
        ),
        selected as (
          select e.*, true as replayed from existing e
          union all
          select s.*, r.reserved_micro_usd, r.charged_micro_usd as budget_charged_micro_usd,
            r.released_micro_usd, 0::integer as pending_micro_usd, false as replayed
          from session_write s join reservation_write r on r.session_id = s.id
        )
        select selected.*,
          (select state from entitlement_state limit 1) as entitlement_state,
          (select reserved_micro_usd - released_micro_usd from day_current limit 1) as day_committed_micro_usd
        from selected
        union all
        select null::uuid as id, null::uuid as account_id, null::uuid as result_id, null::uuid as entitlement_id,
          null::text as scenario, null::text as use_case, null::text as plan_version, null::text as state,
          null::integer as turn_count, null::integer as retry_count, null::text as safe_success_code,
          null::text as safe_focus_code, null::text as limit_code, null::text as escalation_code,
          null::integer as input_units, null::integer as output_units, null::integer as charged_micro_usd,
          null::text as provider_profile, null::text as policy_version, null::timestamptz as created_at,
          null::timestamptz as updated_at, null::timestamptz as expires_at, null::timestamptz as completed_at,
          null::integer as reserved_micro_usd, null::integer as budget_charged_micro_usd,
          null::integer as released_micro_usd, null::integer as pending_micro_usd, false as replayed,
          (select state from entitlement_state limit 1) as entitlement_state,
          (select reserved_micro_usd - released_micro_usd from day_current limit 1) as day_committed_micro_usd
        where not exists (select 1 from selected)
      `],
    );
    const row = results.at(-1)?.[0];
    if (row?.id) return { session: normalizeSession(row), replayed: Boolean(row.replayed) };
    if (row?.entitlement_state !== "available") throw new StudyBuddyError("trial_consumed", 409);
    if (Number(row?.day_committed_micro_usd || 0) + limits.maxSessionMicroUsd > limits.maxDayMicroUsd) {
      throw new StudyBuddyError("daily_limit_reached", 429);
    }
    throw new StudyBuddyError("provider_unavailable", 503);
  }

  async function getSession(sessionId, accountId) {
    await expireOwnedSession(sessionId, accountId, now());
    const rows = await client`
      select s.*, r.reserved_micro_usd, r.charged_micro_usd as budget_charged_micro_usd,
        r.released_micro_usd,
        coalesce((select sum(o.reserved_micro_usd) from ai_practice_turn_operations o where o.session_id = s.id and o.state in ('claimed', 'ambiguous')), 0)::integer as pending_micro_usd
      from ai_practice_sessions s
      join ai_practice_budget_reservations r on r.session_id = s.id
      where s.id = ${sessionId}::uuid and s.account_id = ${accountId}::uuid
      limit 1
    `;
    if (!rows[0]) throw new StudyBuddyError("foreign_session", 404);
    return normalizeSession(rows[0]);
  }

  async function claimTurn({ sessionId, accountId, learnerTurn, retryAttempt, operationId, at }) {
    if (!Number.isInteger(retryAttempt) || ![0, 1].includes(retryAttempt)) throw new StudyBuddyError("invalid_request", 400);
    // A completed-session replay is calculated by the service as turn 6 before
    // the repository recognizes the already-persisted operation ID. New writes
    // remain constrained to turns 1..5 by SQL and the migration check.
    if (!Number.isInteger(learnerTurn) || learnerTurn < 1 || learnerTurn > 6) throw new StudyBuddyError("invalid_request", 400);
    await expireOwnedSession(sessionId, accountId, at);
    const operationIdValue = createId();
    const results = await locked(
      [`study-buddy:circuit:${CIRCUIT_CAPABILITY}`, `study-buddy:session:${sessionId}`],
      (tx) => [tx`
        with circuit_seed as (
          insert into ai_provider_circuit_state (capability)
          values (${CIRCUIT_CAPABILITY}) on conflict (capability) do nothing
        ),
        circuit_transition as (
          update ai_provider_circuit_state
          set state = 'half_open', probe_in_flight = false, updated_at = ${at.toISOString()}::timestamptz
          where capability = ${CIRCUIT_CAPABILITY}
            and state = 'open' and open_until <= ${at.toISOString()}::timestamptz
          returning *
        ),
        session_row as (
          select s.*, r.reserved_micro_usd, r.charged_micro_usd as budget_charged_micro_usd,
            r.released_micro_usd,
            coalesce((select sum(o.reserved_micro_usd) from ai_practice_turn_operations o where o.session_id = s.id and o.state in ('claimed', 'ambiguous')), 0)::integer as pending_micro_usd
          from ai_practice_sessions s
          join ai_practice_budget_reservations r on r.session_id = s.id
          where s.id = ${sessionId}::uuid and s.account_id = ${accountId}::uuid
          limit 1
        ),
        prior as (
          select o.* from ai_practice_turn_operations o
          where o.session_id = ${sessionId}::uuid and o.client_operation_id = ${operationId}
          limit 1
        ),
        base_attempt as (
          select o.* from ai_practice_turn_operations o
          where o.session_id = ${sessionId}::uuid and o.learner_turn = ${learnerTurn} and o.retry_attempt = 0
          limit 1
        ),
        eligible as (
          select s.*, (s.reserved_micro_usd - s.budget_charged_micro_usd - s.released_micro_usd - s.pending_micro_usd)::integer as remaining_micro_usd
          from session_row s
          where s.state = 'active'
            and s.expires_at > ${at.toISOString()}::timestamptz
            and not exists (select 1 from prior)
            and (
              (${retryAttempt} = 0 and ${learnerTurn} = s.turn_count + 1)
              or (${retryAttempt} = 1 and exists (select 1 from base_attempt))
            )
            and s.reserved_micro_usd - s.budget_charged_micro_usd - s.released_micro_usd - s.pending_micro_usd > 0
        ),
        probe as (
          update ai_provider_circuit_state c
          set probe_in_flight = true, updated_at = ${at.toISOString()}::timestamptz
          where c.capability = ${CIRCUIT_CAPABILITY}
            and c.state = 'half_open' and c.probe_in_flight = false
            and exists (select 1 from eligible)
          returning c.*
        ),
        operation_write as (
          insert into ai_practice_turn_operations (
            id, session_id, client_operation_id, learner_turn, retry_attempt, state,
            reserved_micro_usd, created_at
          )
          select ${operationIdValue}::uuid, ${sessionId}::uuid, ${operationId}, ${learnerTurn},
            ${retryAttempt}, 'claimed', e.remaining_micro_usd, ${at.toISOString()}::timestamptz
          from eligible e
          where exists (
            select 1 from ai_provider_circuit_state c
            where c.capability = ${CIRCUIT_CAPABILITY}
              and (c.state = 'closed' or exists (select 1 from probe))
          )
          returning *
        ),
        retry_count_update as (
          update ai_practice_sessions s
          set retry_count = retry_count + case when ${retryAttempt} = 1 then 1 else 0 end,
              updated_at = ${at.toISOString()}::timestamptz
          where s.id = ${sessionId}::uuid and exists (select 1 from operation_write)
          returning s.*
        ),
        selected_operation as (
          select p.*, true as replayed from prior p
          union all
          select w.*, false as replayed from operation_write w
        )
        select o.*, s.*, o.id as operation_id, o.state as operation_state,
          o.created_at as operation_created_at, o.completed_at as operation_completed_at,
          o.charged_micro_usd as operation_charged_micro_usd,
          o.reserved_micro_usd as operation_reserved_micro_usd,
          o.replayed
        from selected_operation o cross join session_row s
      `],
    );
    const row = results.at(-1)?.[0];
    if (row) return normalizeClaim(row);
    await diagnoseClaimFailure({ sessionId, accountId, learnerTurn, retryAttempt, operationId, at });
    throw new StudyBuddyError("provider_unavailable", 503);
  }

  async function completeTurn({ sessionId, accountId, operationId, outcomeCode, focusCode, usage, at }) {
    validateUsage(usage);
    const outboxId = createId();
    const results = await locked([`study-buddy:session:${sessionId}`], (tx) => [tx`
      with session_row as (
        select s.*, r.reserved_micro_usd, r.charged_micro_usd as budget_charged_micro_usd,
          r.released_micro_usd
        from ai_practice_sessions s
        join ai_practice_budget_reservations r on r.session_id = s.id
        where s.id = ${sessionId}::uuid and s.account_id = ${accountId}::uuid
        limit 1
      ),
      operation_row as (
        select * from ai_practice_turn_operations
        where session_id = ${sessionId}::uuid and client_operation_id = ${operationId}
        limit 1
      ),
      transition as (
        select s.*, o.id as operation_id, o.learner_turn, o.retry_attempt,
          o.reserved_micro_usd as operation_reserved_micro_usd,
          (s.expires_at <= ${at.toISOString()}::timestamptz or s.state = 'expired') as expired,
          (case when o.retry_attempt = 0 or not exists (
            select 1 from ai_practice_turn_operations base
            where base.session_id = o.session_id and base.learner_turn = o.learner_turn
              and base.retry_attempt = 0 and base.state = 'completed'
          ) then 1 else 0 end) as turn_increment
        from session_row s cross join operation_row o
        where o.state = 'claimed' and ${usage.microUsd} <= o.reserved_micro_usd
      ),
      operation_update as (
        update ai_practice_turn_operations o
        set state = case when t.expired then 'failed' else 'completed' end,
            safe_outcome_code = case when t.expired then 'deadline_exceeded' else ${outcomeCode} end,
            input_units = ${usage.inputUnits}, output_units = ${usage.outputUnits},
            charged_micro_usd = ${usage.microUsd}, completed_at = ${at.toISOString()}::timestamptz
        from transition t where o.id = t.operation_id
        returning o.*
      ),
      session_update as (
        update ai_practice_sessions s
        set turn_count = case when t.expired then s.turn_count else s.turn_count + t.turn_increment end,
            state = case
              when t.expired then 'expired'
              when ${outcomeCode} = 'escalated' then 'escalated'
              when s.turn_count + t.turn_increment >= 5 then 'completed'
              else s.state end,
            safe_success_code = case when not t.expired and ${outcomeCode} = 'success' then 'success' else s.safe_success_code end,
            safe_focus_code = case when not t.expired then ${focusCode} else s.safe_focus_code end,
            escalation_code = case when not t.expired and ${outcomeCode} = 'escalated' then 'provider_escalated' else s.escalation_code end,
            input_units = s.input_units + ${usage.inputUnits}, output_units = s.output_units + ${usage.outputUnits},
            charged_micro_usd = s.charged_micro_usd + ${usage.microUsd},
            updated_at = ${at.toISOString()}::timestamptz,
            completed_at = case when t.expired or ${outcomeCode} = 'escalated' or s.turn_count + t.turn_increment >= 5 then ${at.toISOString()}::timestamptz else s.completed_at end
        from transition t where s.id = t.id and exists (select 1 from operation_update)
        returning s.*
      ),
      budget_before as (
        select r.*, (r.reserved_micro_usd - r.charged_micro_usd - r.released_micro_usd - ${usage.microUsd})::integer as release_delta
        from ai_practice_budget_reservations r where r.session_id = ${sessionId}::uuid
      ),
      budget_update as (
        update ai_practice_budget_reservations r
        set charged_micro_usd = r.charged_micro_usd + ${usage.microUsd},
            released_micro_usd = case when su.state in ('completed', 'expired', 'escalated') then r.reserved_micro_usd - r.charged_micro_usd - ${usage.microUsd} else r.released_micro_usd end,
            state = case when su.state in ('completed', 'expired', 'escalated') then 'released' else r.state end,
            released_at = case when su.state in ('completed', 'expired', 'escalated') then ${at.toISOString()}::timestamptz else r.released_at end
        from session_update su where r.session_id = su.id
        returning r.*
      ),
      day_update as (
        update ai_practice_account_day_budgets d
        set charged_micro_usd = d.charged_micro_usd + ${usage.microUsd},
            released_micro_usd = d.released_micro_usd + case when su.state in ('completed', 'expired', 'escalated') then greatest(0, bb.release_delta) else 0 end,
            updated_at = ${at.toISOString()}::timestamptz
        from session_update su, budget_before bb
        where d.account_id = su.account_id and d.utc_day = bb.utc_day
        returning d.*
      ),
      entitlement_update as (
        update ai_practice_entitlements e set state = 'consumed', updated_at = ${at.toISOString()}::timestamptz
        from session_update su where e.id = su.entitlement_id and su.state in ('completed', 'expired', 'escalated')
        returning e.id
      ),
      outbox_write as (
        insert into crm_outbox (id, event_type, idempotency_key, correlation_id, payload, status, attempt_count, next_attempt_at, created_at)
        select ${outboxId}::uuid,
          case when su.state = 'escalated' then 'ai_practice_escalated' when su.state = 'expired' then 'ai_practice_limit_reached' else 'ai_practice_completed' end,
          'aitusa:ai-practice-terminal:' || su.id::text || ':' || su.state, su.result_id::text,
          jsonb_build_object(
            'schemaVersion', 'aitusa-crm-event-v1', 'eventId', 'aitusa:ai-practice-terminal:' || su.id::text || ':' || su.state,
            'eventType', case when su.state = 'escalated' then 'ai_practice_escalated' when su.state = 'expired' then 'ai_practice_limit_reached' else 'ai_practice_completed' end,
            'idempotencyKey', 'aitusa:ai-practice-terminal:' || su.id::text || ':' || su.state,
            'correlationId', su.result_id::text, 'occurredAt', ${at.toISOString()}::timestamptz,
            'source', jsonb_build_object('product', 'aitusa_refresh', 'surface', 'portal', 'path', '/portal/study', 'version', 'mis-343-v1'),
            'contact', jsonb_build_object('firstName', account.first_name, 'email', account.primary_email),
            'practice', jsonb_strip_nulls(jsonb_build_object('sessionId', su.id::text, 'state', su.state, 'scenario', su.scenario, 'useCase', su.use_case, 'focusCode', su.safe_focus_code, 'outcomeCode', ou.safe_outcome_code, 'limitCode', case when su.state = 'expired' then 'session_limit_reached' else su.limit_code end, 'turnCount', su.turn_count, 'planVersion', su.plan_version))
          ), 'pending', 0, ${at.toISOString()}::timestamptz, ${at.toISOString()}::timestamptz
        from session_update su cross join operation_update ou join portal_accounts account on account.id = su.account_id
        where su.state in ('completed', 'escalated', 'expired')
        on conflict (idempotency_key) do nothing
        returning id
      )
      select su.*, bu.reserved_micro_usd, bu.charged_micro_usd as budget_charged_micro_usd,
        bu.released_micro_usd, 0::integer as pending_micro_usd,
        ou.id as operation_id, ou.state as operation_state, ou.client_operation_id,
        ou.learner_turn, ou.retry_attempt, ou.safe_outcome_code,
        ou.input_units as operation_input_units, ou.output_units as operation_output_units,
        ou.charged_micro_usd as operation_charged_micro_usd,
        ou.reserved_micro_usd as operation_reserved_micro_usd,
        ou.created_at as operation_created_at, ou.completed_at as operation_completed_at,
        false as replayed
      from session_update su cross join budget_update bu cross join operation_update ou
    `]);
    const row = results.at(-1)?.[0];
    if (row) {
      return {
        session: normalizeSession(row),
        operation: normalizeOperation(row),
        replayed: false,
        ...(row.state === "expired" ? { terminalCode: "session_expired" } : {}),
      };
    }
    return replayOrThrow({ sessionId, accountId, operationId, usage });
  }

  async function failTurn({ sessionId, accountId, operationId, ambiguous = true, at }) {
    const results = await locked([`study-buddy:session:${sessionId}`], (tx) => [tx`
      with operation_update as (
        update ai_practice_turn_operations o
        set state = ${ambiguous ? "ambiguous" : "failed"}, completed_at = ${at.toISOString()}::timestamptz
        from ai_practice_sessions s
        where o.session_id = s.id and s.id = ${sessionId}::uuid and s.account_id = ${accountId}::uuid
          and o.client_operation_id = ${operationId} and o.state = 'claimed'
        returning o.*
      )
      select * from operation_update
    `]);
    const changed = results.at(-1)?.[0];
    if (!changed) return replayOrThrow({ sessionId, accountId, operationId });
    if (!ambiguous) await releaseFailedReservation({ sessionId, accountId, operationId, at });
    return {
      session: await getSession(sessionId, accountId),
      operation: normalizeOperationRow(changed),
      replayed: false,
    };
  }

  async function reconcileLateTurn({ sessionId, accountId, operationId, usage, at }) {
    validateUsage(usage);
    const results = await locked([`study-buddy:session:${sessionId}`], (tx) => [tx`
      with operation_row as (
        select o.* from ai_practice_turn_operations o join ai_practice_sessions s on s.id = o.session_id
        where o.session_id = ${sessionId}::uuid and s.account_id = ${accountId}::uuid
          and o.client_operation_id = ${operationId} limit 1
      ),
      session_update as (
        update ai_practice_sessions s
        set state = case when s.expires_at <= ${at.toISOString()}::timestamptz then 'expired' else s.state end,
            completed_at = case when s.expires_at <= ${at.toISOString()}::timestamptz then ${at.toISOString()}::timestamptz else s.completed_at end,
            input_units = s.input_units + ${usage.inputUnits}, output_units = s.output_units + ${usage.outputUnits},
            charged_micro_usd = s.charged_micro_usd + ${usage.microUsd}, updated_at = ${at.toISOString()}::timestamptz
        from operation_row o
        where s.id = ${sessionId}::uuid and o.state = 'ambiguous' and ${usage.microUsd} <= o.reserved_micro_usd
        returning s.*
      ),
      operation_update as (
        update ai_practice_turn_operations o
        set state = 'failed', safe_outcome_code = 'deadline_exceeded',
          input_units = ${usage.inputUnits}, output_units = ${usage.outputUnits}, charged_micro_usd = ${usage.microUsd},
          completed_at = ${at.toISOString()}::timestamptz
        from session_update s where o.session_id = s.id and o.client_operation_id = ${operationId}
        returning o.*
      ),
      budget_before as (
        select r.*, (r.reserved_micro_usd - r.charged_micro_usd - r.released_micro_usd - ${usage.microUsd})::integer as release_delta
        from ai_practice_budget_reservations r where r.session_id = ${sessionId}::uuid
      ),
      budget_update as (
        update ai_practice_budget_reservations r
        set charged_micro_usd = r.charged_micro_usd + ${usage.microUsd},
          released_micro_usd = case when s.state = 'expired' then r.reserved_micro_usd - r.charged_micro_usd - ${usage.microUsd} else r.released_micro_usd end,
          state = case when s.state = 'expired' then 'released' else r.state end,
          released_at = case when s.state = 'expired' then ${at.toISOString()}::timestamptz else r.released_at end
        from session_update s where r.session_id = s.id
        returning r.*
      ),
      day_update as (
        update ai_practice_account_day_budgets d
        set charged_micro_usd = d.charged_micro_usd + ${usage.microUsd},
          released_micro_usd = d.released_micro_usd + case when s.state = 'expired' then greatest(0, b.release_delta) else 0 end,
          updated_at = ${at.toISOString()}::timestamptz
        from session_update s, budget_before b
        where d.account_id = s.account_id and d.utc_day = b.utc_day
        returning d.*
      ),
      entitlement_update as (
        update ai_practice_entitlements e set state = 'consumed', updated_at = ${at.toISOString()}::timestamptz
        from session_update s where e.id = s.entitlement_id and s.state = 'expired' returning e.id
      ),
      outbox_write as (
        insert into crm_outbox (id, event_type, idempotency_key, correlation_id, payload, status, attempt_count, next_attempt_at, created_at)
        select md5('aitusa:ai-practice-terminal:' || s.id::text || ':expired')::uuid,
          'ai_practice_limit_reached', 'aitusa:ai-practice-terminal:' || s.id::text || ':expired', s.result_id::text,
          jsonb_build_object(
            'schemaVersion', 'aitusa-crm-event-v1', 'eventId', 'aitusa:ai-practice-terminal:' || s.id::text || ':expired',
            'eventType', 'ai_practice_limit_reached', 'idempotencyKey', 'aitusa:ai-practice-terminal:' || s.id::text || ':expired',
            'correlationId', s.result_id::text, 'occurredAt', ${at.toISOString()}::timestamptz,
            'source', jsonb_build_object('product', 'aitusa_refresh', 'surface', 'portal', 'path', '/portal/study', 'version', 'mis-343-v1'),
            'contact', jsonb_build_object('firstName', account.first_name, 'email', account.primary_email),
            'practice', jsonb_build_object('sessionId', s.id::text, 'state', s.state, 'scenario', s.scenario, 'useCase', s.use_case, 'limitCode', 'session_limit_reached', 'turnCount', s.turn_count, 'planVersion', s.plan_version)
          ), 'pending', 0, ${at.toISOString()}::timestamptz, ${at.toISOString()}::timestamptz
        from session_update s join portal_accounts account on account.id = s.account_id
        where s.state = 'expired'
        on conflict (idempotency_key) do nothing
        returning id
      )
      select s.*, b.reserved_micro_usd, b.charged_micro_usd as budget_charged_micro_usd,
        b.released_micro_usd, 0::integer as pending_micro_usd,
        o.id as operation_id, o.state as operation_state, o.client_operation_id,
        o.learner_turn, o.retry_attempt, o.safe_outcome_code,
        o.input_units as operation_input_units, o.output_units as operation_output_units,
        o.charged_micro_usd as operation_charged_micro_usd, o.reserved_micro_usd as operation_reserved_micro_usd,
        o.created_at as operation_created_at, o.completed_at as operation_completed_at
      from session_update s cross join budget_update b cross join operation_update o
    `]);
    const row = results.at(-1)?.[0];
    if (!row) return replayOrThrow({ sessionId, accountId, operationId, usage });
    return {
      session: normalizeSession(row), operation: normalizeOperation(row), replayed: false,
      terminalCode: row.state === "expired" ? "session_expired" : "provider_unavailable",
    };
  }

  async function reapExpired(at = now()) {
    const results = await locked(["study-buddy:reaper"], (tx) => [tx`
      with candidates as (
        select s.id as session_id, s.entitlement_id, r.id as reservation_id, r.account_id, r.utc_day,
          greatest(0, r.reserved_micro_usd - r.charged_micro_usd - r.released_micro_usd)::integer as release_delta
        from ai_practice_sessions s join ai_practice_budget_reservations r on r.session_id = s.id
        where s.state = 'active' and s.expires_at <= ${at.toISOString()}::timestamptz
      ),
      session_update as (
        update ai_practice_sessions s set state = 'expired', completed_at = ${at.toISOString()}::timestamptz,
          updated_at = ${at.toISOString()}::timestamptz
        from candidates c where s.id = c.session_id returning s.*
      ),
      budget_update as (
        update ai_practice_budget_reservations r set state = 'released',
          released_micro_usd = r.reserved_micro_usd - r.charged_micro_usd,
          released_at = ${at.toISOString()}::timestamptz
        from candidates c where r.id = c.reservation_id returning r.id
      ),
      entitlement_update as (
        update ai_practice_entitlements e set state = 'consumed', updated_at = ${at.toISOString()}::timestamptz
        from candidates c where e.id = c.entitlement_id returning e.id
      ),
      day_deltas as (
        select account_id, utc_day, sum(release_delta)::integer as release_delta from candidates group by account_id, utc_day
      ),
      day_update as (
        update ai_practice_account_day_budgets d set released_micro_usd = d.released_micro_usd + x.release_delta,
          updated_at = ${at.toISOString()}::timestamptz
        from day_deltas x where d.account_id = x.account_id and d.utc_day = x.utc_day returning d.account_id
      ),
      outbox_write as (
        insert into crm_outbox (id, event_type, idempotency_key, correlation_id, payload, status, attempt_count, next_attempt_at, created_at)
        select md5('aitusa:ai-practice-terminal:' || s.id::text || ':expired')::uuid,
          'ai_practice_limit_reached', 'aitusa:ai-practice-terminal:' || s.id::text || ':expired', s.result_id::text,
          jsonb_build_object(
            'schemaVersion', 'aitusa-crm-event-v1', 'eventId', 'aitusa:ai-practice-terminal:' || s.id::text || ':expired',
            'eventType', 'ai_practice_limit_reached', 'idempotencyKey', 'aitusa:ai-practice-terminal:' || s.id::text || ':expired',
            'correlationId', s.result_id::text, 'occurredAt', ${at.toISOString()}::timestamptz,
            'source', jsonb_build_object('product', 'aitusa_refresh', 'surface', 'portal', 'path', '/portal/study', 'version', 'mis-343-v1'),
            'contact', jsonb_build_object('firstName', account.first_name, 'email', account.primary_email),
            'practice', jsonb_build_object('sessionId', s.id::text, 'state', s.state, 'scenario', s.scenario, 'useCase', s.use_case, 'limitCode', 'session_limit_reached', 'turnCount', s.turn_count, 'planVersion', s.plan_version)
          ), 'pending', 0, ${at.toISOString()}::timestamptz, ${at.toISOString()}::timestamptz
        from session_update s join portal_accounts account on account.id = s.account_id
        on conflict (idempotency_key) do nothing
        returning id
      )
      select count(*)::integer as count from session_update
    `]);
    return Number(results.at(-1)?.[0]?.count || 0);
  }

  async function recordProviderFailure(at = now()) {
    const until = new Date(at.getTime() + circuitOpenMs);
    const results = await locked([`study-buddy:circuit:${CIRCUIT_CAPABILITY}`], (tx) => [tx`
      insert into ai_provider_circuit_state (capability, failure_count, state, open_until, probe_in_flight, updated_at)
      values (${CIRCUIT_CAPABILITY}, 1, 'closed', null, false, ${at.toISOString()}::timestamptz)
      on conflict (capability) do update set
        failure_count = ai_provider_circuit_state.failure_count + 1,
        state = case when ai_provider_circuit_state.state = 'half_open' or ai_provider_circuit_state.failure_count + 1 >= ${circuitFailureThreshold} then 'open' else ai_provider_circuit_state.state end,
        open_until = case when ai_provider_circuit_state.state = 'half_open' or ai_provider_circuit_state.failure_count + 1 >= ${circuitFailureThreshold} then ${until.toISOString()}::timestamptz else ai_provider_circuit_state.open_until end,
        probe_in_flight = false, updated_at = ${at.toISOString()}::timestamptz
      returning *
    `]);
    return normalizeCircuit(results.at(-1)?.[0]);
  }

  async function recordProviderSuccess(at = now()) {
    const results = await locked([`study-buddy:circuit:${CIRCUIT_CAPABILITY}`], (tx) => [tx`
      insert into ai_provider_circuit_state (capability, failure_count, state, open_until, probe_in_flight, updated_at)
      values (${CIRCUIT_CAPABILITY}, 0, 'closed', null, false, ${at.toISOString()}::timestamptz)
      on conflict (capability) do update set failure_count = 0, state = 'closed', open_until = null,
        probe_in_flight = false, updated_at = excluded.updated_at
      returning *
    `]);
    return normalizeCircuit(results.at(-1)?.[0]);
  }

  async function setCircuitOpen(until) {
    const results = await locked([`study-buddy:circuit:${CIRCUIT_CAPABILITY}`], (tx) => [tx`
      insert into ai_provider_circuit_state (capability, failure_count, state, open_until, probe_in_flight, updated_at)
      values (${CIRCUIT_CAPABILITY}, ${circuitFailureThreshold}, 'open', ${until.toISOString()}::timestamptz, false, ${now().toISOString()}::timestamptz)
      on conflict (capability) do update set state = 'open', open_until = excluded.open_until,
        probe_in_flight = false, updated_at = excluded.updated_at
      returning *
    `]);
    return normalizeCircuit(results.at(-1)?.[0]);
  }

  async function getCircuit() {
    const rows = await client`select * from ai_provider_circuit_state where capability = ${CIRCUIT_CAPABILITY} limit 1`;
    return normalizeCircuit(rows[0] || { state: "closed", failure_count: 0, open_until: null, probe_in_flight: false });
  }

  async function getOperation(sessionId, operationId, accountId) {
    const rows = await client`
      select o.* from ai_practice_turn_operations o join ai_practice_sessions s on s.id = o.session_id
      where o.session_id = ${sessionId}::uuid and o.client_operation_id = ${operationId}
        and s.account_id = ${accountId}::uuid limit 1
    `;
    if (!rows[0]) throw new StudyBuddyError("foreign_session", 404);
    return normalizeOperationRow(rows[0]);
  }

  async function getBudget(accountId, at = now()) {
    const rows = await client`
      select * from ai_practice_account_day_budgets
      where account_id = ${accountId}::uuid and utc_day = ${at.toISOString().slice(0, 10)} limit 1
    `;
    return rows[0] ? {
      reservedMicroUsd: Number(rows[0].reserved_micro_usd),
      chargedMicroUsd: Number(rows[0].charged_micro_usd),
      releasedMicroUsd: Number(rows[0].released_micro_usd),
    } : null;
  }

  async function expireOwnedSession(sessionId, accountId, at) {
    const results = await locked([`study-buddy:session:${sessionId}`], (tx) => [tx`
      with candidate as (
        select s.id as session_id, s.entitlement_id, r.id as reservation_id, r.account_id, r.utc_day,
          greatest(0, r.reserved_micro_usd - r.charged_micro_usd - r.released_micro_usd)::integer as release_delta
        from ai_practice_sessions s join ai_practice_budget_reservations r on r.session_id = s.id
        where s.id = ${sessionId}::uuid and s.account_id = ${accountId}::uuid
          and s.state = 'active' and s.expires_at <= ${at.toISOString()}::timestamptz
      ),
      session_update as (
        update ai_practice_sessions s set state = 'expired', completed_at = ${at.toISOString()}::timestamptz,
          updated_at = ${at.toISOString()}::timestamptz from candidate c where s.id = c.session_id returning s.*
      ),
      budget_update as (
        update ai_practice_budget_reservations r set state = 'released',
          released_micro_usd = r.reserved_micro_usd - r.charged_micro_usd,
          released_at = ${at.toISOString()}::timestamptz from candidate c where r.id = c.reservation_id returning r.id
      ),
      entitlement_update as (
        update ai_practice_entitlements e set state = 'consumed', updated_at = ${at.toISOString()}::timestamptz
        from candidate c where e.id = c.entitlement_id returning e.id
      ),
      day_update as (
        update ai_practice_account_day_budgets d set released_micro_usd = d.released_micro_usd + c.release_delta,
          updated_at = ${at.toISOString()}::timestamptz from candidate c
        where d.account_id = c.account_id and d.utc_day = c.utc_day returning d.account_id
      ),
      outbox_write as (
        insert into crm_outbox (id, event_type, idempotency_key, correlation_id, payload, status, attempt_count, next_attempt_at, created_at)
        select md5('aitusa:ai-practice-terminal:' || s.id::text || ':expired')::uuid,
          'ai_practice_limit_reached', 'aitusa:ai-practice-terminal:' || s.id::text || ':expired', s.result_id::text,
          jsonb_build_object(
            'schemaVersion', 'aitusa-crm-event-v1', 'eventId', 'aitusa:ai-practice-terminal:' || s.id::text || ':expired',
            'eventType', 'ai_practice_limit_reached', 'idempotencyKey', 'aitusa:ai-practice-terminal:' || s.id::text || ':expired',
            'correlationId', s.result_id::text, 'occurredAt', ${at.toISOString()}::timestamptz,
            'source', jsonb_build_object('product', 'aitusa_refresh', 'surface', 'portal', 'path', '/portal/study', 'version', 'mis-343-v1'),
            'contact', jsonb_build_object('firstName', account.first_name, 'email', account.primary_email),
            'practice', jsonb_build_object('sessionId', s.id::text, 'state', s.state, 'scenario', s.scenario, 'useCase', s.use_case, 'limitCode', 'session_limit_reached', 'turnCount', s.turn_count, 'planVersion', s.plan_version)
          ), 'pending', 0, ${at.toISOString()}::timestamptz, ${at.toISOString()}::timestamptz
        from session_update s join portal_accounts account on account.id = s.account_id
        on conflict (idempotency_key) do nothing
        returning id
      )
      select count(*)::integer as count from session_update
    `]);
    return Number(results.at(-1)?.[0]?.count || 0);
  }

  async function diagnoseClaimFailure({ sessionId, accountId, learnerTurn, retryAttempt, operationId, at }) {
    const rows = await client`
      select s.state, s.turn_count, s.expires_at,
        exists(select 1 from ai_practice_turn_operations o where o.session_id = s.id and o.client_operation_id = ${operationId}) as replay,
        exists(select 1 from ai_practice_turn_operations o where o.session_id = s.id and o.learner_turn = ${learnerTurn} and o.retry_attempt = 0) as base_exists,
        r.reserved_micro_usd - r.charged_micro_usd - r.released_micro_usd -
          coalesce((select sum(o.reserved_micro_usd) from ai_practice_turn_operations o where o.session_id = s.id and o.state in ('claimed', 'ambiguous')), 0) as remaining,
        c.state as circuit_state, c.open_until, c.probe_in_flight
      from ai_practice_sessions s join ai_practice_budget_reservations r on r.session_id = s.id
      left join ai_provider_circuit_state c on c.capability = ${CIRCUIT_CAPABILITY}
      where s.id = ${sessionId}::uuid and s.account_id = ${accountId}::uuid limit 1
    `;
    const row = rows[0];
    if (!row) throw new StudyBuddyError("foreign_session", 404);
    if (row.state !== "active" || new Date(row.expires_at) <= at) throw new StudyBuddyError("session_expired", 409);
    if (retryAttempt === 1 && !row.base_exists) throw new StudyBuddyError("retry_limit_reached", 409);
    const expected = retryAttempt === 0 ? Number(row.turn_count) + 1 : learnerTurn;
    if (learnerTurn !== expected) throw new StudyBuddyError("invalid_request", 400);
    if (Number(row.remaining) <= 0) throw new StudyBuddyError("session_limit_reached", 429);
    if (row.circuit_state === "open" || (row.circuit_state === "half_open" && row.probe_in_flight)) {
      throw new StudyBuddyError("circuit_open", 503);
    }
  }

  async function replayOrThrow({ sessionId, accountId, operationId, usage = null }) {
    const session = await getSession(sessionId, accountId);
    const operation = await getOperation(sessionId, operationId, accountId);
    if (usage && operation.state === "claimed" && usage.microUsd > operation.reservedMicroUsd) {
      throw new StudyBuddyError("provider_unavailable", 503);
    }
    return { session, operation, replayed: true };
  }

  async function releaseFailedReservation({ sessionId, accountId, operationId, at }) {
    await locked([`study-buddy:session:${sessionId}`], (tx) => [tx`
      with operation_row as (
        select o.* from ai_practice_turn_operations o join ai_practice_sessions s on s.id = o.session_id
        where o.session_id = ${sessionId}::uuid and s.account_id = ${accountId}::uuid
          and o.client_operation_id = ${operationId} and o.state = 'failed' limit 1
      ),
      budget_before as (
        select r.*, greatest(0, r.reserved_micro_usd - r.charged_micro_usd - r.released_micro_usd)::integer as release_delta
        from ai_practice_budget_reservations r where r.session_id = ${sessionId}::uuid
      ),
      budget_update as (
        update ai_practice_budget_reservations r set state = 'released',
          released_micro_usd = r.reserved_micro_usd - r.charged_micro_usd,
          released_at = ${at.toISOString()}::timestamptz
        from operation_row o where r.session_id = o.session_id returning r.*
      )
      update ai_practice_account_day_budgets d set released_micro_usd = d.released_micro_usd + b.release_delta,
        updated_at = ${at.toISOString()}::timestamptz
      from budget_before b where d.account_id = b.account_id and d.utc_day = b.utc_day
    `]);
  }

  return {
    reserveStart, claimTurn, completeTurn, failTurn, reconcileLateTurn, reapExpired,
    recordProviderFailure, recordProviderSuccess, setCircuitOpen, getSession,
    getOperation, getBudget, getCircuit,
  };
}

function validateStartInput({ providerProfile, policyVersion, limits }) {
  if (typeof providerProfile !== "string" || providerProfile.length < 1 || providerProfile.length > 80) throw new StudyBuddyError("provider_disabled", 503);
  if (policyVersion !== "mis-340-policy-v1") throw new StudyBuddyError("provider_disabled", 503);
  if (!Number.isSafeInteger(limits?.maxSessionMicroUsd) || limits.maxSessionMicroUsd <= 0 ||
      !Number.isSafeInteger(limits?.maxDayMicroUsd) || limits.maxDayMicroUsd < limits.maxSessionMicroUsd ||
      !Number.isSafeInteger(limits?.sessionMinutes) || limits.sessionMinutes <= 0) {
    throw new StudyBuddyError("provider_disabled", 503);
  }
}

function validateUsage(usage) {
  for (const key of ["inputUnits", "outputUnits", "microUsd"]) {
    if (!Number.isSafeInteger(usage?.[key]) || usage[key] < 0) throw new StudyBuddyError("provider_unavailable", 503);
  }
}

function normalizeSession(row) {
  return {
    id: row.id, accountId: row.account_id, resultId: row.result_id,
    scenario: row.scenario, useCase: row.use_case, planVersion: row.plan_version,
    state: row.state, turnCount: Number(row.turn_count), retryCount: Number(row.retry_count),
    lastLearnerTurn: Number(row.last_learner_turn || row.turn_count || 0),
    reservedMicroUsd: Number(row.reserved_micro_usd || 0),
    pendingMicroUsd: Number(row.pending_micro_usd || 0),
    usedMicroUsd: Number(row.budget_charged_micro_usd ?? row.charged_micro_usd ?? 0),
    releasedMicroUsd: Number(row.released_micro_usd || 0),
    providerProfile: row.provider_profile,
    createdAt: toDate(row.created_at), updatedAt: toDate(row.updated_at),
    expiresAt: toDate(row.expires_at), completedAt: toDate(row.completed_at),
  };
}

function normalizeClaim(row) {
  return {
    sessionId: row.session_id, accountId: row.account_id,
    learnerTurn: Number(row.learner_turn), retryAttempt: Number(row.retry_attempt),
    operationId: row.client_operation_id, state: row.operation_state,
    reservedMicroUsd: Number(row.operation_reserved_micro_usd),
    replayed: Boolean(row.replayed), session: normalizeSession(row),
    createdAt: toDate(row.operation_created_at), completedAt: toDate(row.operation_completed_at),
  };
}

function normalizeOperation(row) {
  return {
    sessionId: row.id ? row.id : row.session_id,
    operationId: row.client_operation_id,
    learnerTurn: Number(row.learner_turn), retryAttempt: Number(row.retry_attempt),
    state: row.operation_state, safeOutcomeCode: row.safe_outcome_code,
    inputUnits: Number(row.operation_input_units || 0), outputUnits: Number(row.operation_output_units || 0),
    chargedMicroUsd: Number(row.operation_charged_micro_usd || 0),
    reservedMicroUsd: Number(row.operation_reserved_micro_usd || 0),
    createdAt: toDate(row.operation_created_at), completedAt: toDate(row.operation_completed_at),
  };
}

function normalizeOperationRow(row) {
  return {
    sessionId: row.session_id, operationId: row.client_operation_id,
    learnerTurn: Number(row.learner_turn), retryAttempt: Number(row.retry_attempt),
    state: row.state, safeOutcomeCode: row.safe_outcome_code,
    inputUnits: Number(row.input_units || 0), outputUnits: Number(row.output_units || 0),
    chargedMicroUsd: Number(row.charged_micro_usd || 0), reservedMicroUsd: Number(row.reserved_micro_usd || 0),
    createdAt: toDate(row.created_at), completedAt: toDate(row.completed_at),
  };
}

function normalizeCircuit(row) {
  return {
    state: row.state,
    failureCount: Number(row.failure_count || 0),
    openUntil: toDate(row.open_until),
    probeInFlight: Boolean(row.probe_in_flight),
  };
}

function toDate(value) {
  return value ? (value instanceof Date ? value : new Date(value)) : null;
}
