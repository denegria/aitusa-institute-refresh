import { sql } from "drizzle-orm";

export function createNeonPlacementContactRepository(database) {
  if (!database) throw new Error("portal_database_required");
  return {
    async save({ id, accountId, attemptId, preference, occurredAt }) {
      const result = await database.execute(sql`
        with owned_attempt as (
          select attempt.id
          from diagnostic_attempts attempt
          where attempt.id = ${attemptId}::uuid and attempt.status = 'claimed'
            and (attempt.claimed_account_id = ${accountId}::uuid or exists (
              select 1 from guardian_child_links link
              where link.guardian_account_id = ${accountId}::uuid
                and link.child_profile_id = attempt.claimed_child_profile_id and link.status = 'active'
            ))
        ), previous as (
          select preference.*
          from placement_contact_preferences preference
          join owned_attempt owned on owned.id = preference.attempt_id
          order by preference.occurred_at desc, preference.id desc
          limit 1
        ), inserted as (
          insert into placement_contact_preferences (id, account_id, attempt_id, preferred_channel, mobile_e164, verified_mobile, verified_email, guardian_owned, disclosure_version, disclosure_hash, source_url, opt_in_action, occurred_at)
          select ${id}::uuid, ${accountId}::uuid, owned.id, ${preference.preferredChannel}, ${preference.mobile}, ${preference.verifiedMobile}::boolean, ${preference.verifiedEmail}::boolean, ${preference.guardianOwned}::boolean, ${preference.disclosureVersion}, ${preference.disclosureHash}, ${preference.sourceUrl}, ${preference.optInAction}, ${occurredAt}::timestamptz from owned_attempt owned
          returning id, attempt_id
        ), consents as (
          insert into placement_channel_consents (id, preference_id, channel, purpose, decision, disclosure_version, disclosure_hash, source_url, opt_in_action, occurred_at)
          select md5(inserted.id::text || ':email')::uuid, inserted.id, 'email', 'advisor_contact', ${preference.consents.email}::boolean, ${preference.disclosureVersion}, ${preference.disclosureHash}, ${preference.sourceUrl}, ${preference.optInAction}, ${occurredAt}::timestamptz from inserted
          union all select md5(inserted.id::text || ':sms-service')::uuid, inserted.id, 'sms', 'service_sms', ${preference.consents.serviceSms}::boolean, ${preference.disclosureVersion}, ${preference.disclosureHash}, ${preference.sourceUrl}, ${preference.optInAction}, ${occurredAt}::timestamptz from inserted
          union all select md5(inserted.id::text || ':sms-marketing')::uuid, inserted.id, 'sms', 'marketing_sms', ${preference.consents.marketingSms}::boolean, ${preference.disclosureVersion}, ${preference.disclosureHash}, ${preference.sourceUrl}, ${preference.optInAction}, ${occurredAt}::timestamptz from inserted
          union all select md5(inserted.id::text || ':phone')::uuid, inserted.id, 'phone', 'phone_call', ${preference.consents.phone}::boolean, ${preference.disclosureVersion}, ${preference.disclosureHash}, ${preference.sourceUrl}, ${preference.optInAction}, ${occurredAt}::timestamptz from inserted
          union all select md5(inserted.id::text || ':whatsapp')::uuid, inserted.id, 'whatsapp', 'whatsapp_contact', ${preference.consents.whatsapp}::boolean, ${preference.disclosureVersion}, ${preference.disclosureHash}, ${preference.sourceUrl}, ${preference.optInAction}, ${occurredAt}::timestamptz from inserted
          returning preference_id
        ), change_audit as (
          insert into placement_contact_change_audits (id, account_id, attempt_id, previous_preference_id, replacement_preference_id, previous_channel, replacement_channel, change_reason, occurred_at)
          select
            md5('placement-contact-change:' || inserted.id::text)::uuid,
            ${accountId}::uuid,
            inserted.attempt_id,
            previous.id,
            inserted.id,
            previous.preferred_channel,
            ${preference.preferredChannel},
            case when previous.mobile_e164 is distinct from ${preference.mobile} then 'mobile_replaced' else 'channel_changed' end,
            ${occurredAt}::timestamptz
          from inserted cross join previous
          where previous.preferred_channel is distinct from ${preference.preferredChannel}
             or previous.mobile_e164 is distinct from ${preference.mobile}
        ), handoff_context as (
          select
            inserted.id as preference_id,
            inserted.attempt_id,
            account.first_name,
            account.primary_email,
            result.id as result_id,
            result.result_status,
            result.recommended_level_key,
            result.recommended_level_label,
            result.answered_question_count,
            result.skipped_question_count,
            result.advisor_confirmation_required,
            result.scoring_contract_version,
            coalesce(challenge.claim_id, inserted.attempt_id::text) as correlation_id
          from inserted
          join portal_accounts account on account.id = ${accountId}::uuid
          join diagnostic_results result on result.attempt_id = inserted.attempt_id
          left join lateral (
            select auth.claim_id
            from portal_auth_challenges auth
            where auth.attempt_id = inserted.attempt_id and auth.status = 'consumed'
            order by auth.consumed_at desc nulls last
            limit 1
          ) challenge on true
        ), outbox_write as (
          insert into crm_outbox (
            id, event_type, idempotency_key, correlation_id, payload,
            status, attempt_count, next_attempt_at, created_at
          )
          select
            md5('placement-contact-handoff:' || context.preference_id::text)::uuid,
            'advisor_handoff_requested',
            'aitusa:advisor-handoff-contact:' || context.preference_id::text,
            context.correlation_id,
            jsonb_build_object(
              'schemaVersion', 'aitusa-crm-event-v1',
              'eventId', 'aitusa:advisor-handoff-contact:' || context.preference_id::text,
              'eventType', 'advisor_handoff_requested',
              'idempotencyKey', 'aitusa:advisor-handoff-contact:' || context.preference_id::text,
              'correlationId', context.correlation_id,
              'occurredAt', ${occurredAt}::timestamptz,
              'source', jsonb_build_object(
                'product', 'aitusa_refresh',
                'surface', 'portal',
                'path', '/placement-test/',
                'version', 'mis-397-v3'
              ),
              'contact', jsonb_strip_nulls(jsonb_build_object(
                'firstName', context.first_name,
                'email', context.primary_email,
                'phone', ${preference.mobile}::text
              )),
              'consent', jsonb_build_object(
                'email', ${preference.consents.email}::boolean,
                'sms', ${preference.consents.serviceSms}::boolean,
                'whatsapp', ${preference.consents.whatsapp}::boolean,
                'advisorContactEmail', ${preference.consents.email}::boolean,
                'advisorContact', true,
                'serviceSms', ${preference.consents.serviceSms}::boolean,
                'marketingSms', false,
                'policyVersion', ${preference.disclosureVersion}::text,
                'consentedAt', ${occurredAt}::timestamptz
              ),
              'placement', jsonb_build_object(
                'resultId', context.result_id,
                'resultStatus', context.result_status,
                'recommendedLevelKey', context.recommended_level_key,
                'recommendedLevelLabel', context.recommended_level_label,
                'communicationPreference', ${preference.preferredChannel}::text,
                'verifiedEmail', ${preference.verifiedEmail}::boolean,
                'verifiedMobile', ${preference.verifiedMobile}::boolean,
                'answeredQuestionCount', context.answered_question_count,
                'skippedQuestionCount', context.skipped_question_count,
                'advisorConfirmationRequired', context.advisor_confirmation_required = 1,
                'scoringContractVersion', context.scoring_contract_version
              )
            ),
            'pending', 0, ${occurredAt}::timestamptz, ${occurredAt}::timestamptz
          from handoff_context context
          on conflict (idempotency_key) do nothing
          returning id
        ) select id, attempt_id from inserted
      `);
      const row = rows(result)[0]; return row ? { id: row.id, attemptId: row.attempt_id } : null;
    },
  };
}
function rows(result) { return Array.isArray(result) ? result : result?.rows || []; }
