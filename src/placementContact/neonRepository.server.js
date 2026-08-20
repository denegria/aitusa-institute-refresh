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
        ), inserted as (
          insert into placement_contact_preferences (id, account_id, attempt_id, preferred_channel, mobile_e164, verified_mobile, verified_email, guardian_owned, disclosure_version, disclosure_hash, source_url, opt_in_action, occurred_at)
          select ${id}::uuid, ${accountId}::uuid, owned.id, ${preference.preferredChannel}, ${preference.mobile}, ${preference.verifiedMobile}, ${preference.verifiedEmail}, ${preference.guardianOwned}, ${preference.disclosureVersion}, ${preference.disclosureHash}, ${preference.sourceUrl}, ${preference.optInAction}, ${occurredAt}::timestamptz from owned_attempt owned
          returning id, attempt_id
        ), consents as (
          insert into placement_channel_consents (id, preference_id, channel, purpose, decision, disclosure_version, disclosure_hash, source_url, opt_in_action, occurred_at)
          select md5(inserted.id::text || ':email')::uuid, inserted.id, 'email', 'advisor_contact', ${preference.consents.email}, ${preference.disclosureVersion}, ${preference.disclosureHash}, ${preference.sourceUrl}, ${preference.optInAction}, ${occurredAt}::timestamptz from inserted
          union all select md5(inserted.id::text || ':sms-service')::uuid, inserted.id, 'sms', 'service_sms', ${preference.consents.serviceSms}, ${preference.disclosureVersion}, ${preference.disclosureHash}, ${preference.sourceUrl}, ${preference.optInAction}, ${occurredAt}::timestamptz from inserted
          union all select md5(inserted.id::text || ':sms-marketing')::uuid, inserted.id, 'sms', 'marketing_sms', ${preference.consents.marketingSms}, ${preference.disclosureVersion}, ${preference.disclosureHash}, ${preference.sourceUrl}, ${preference.optInAction}, ${occurredAt}::timestamptz from inserted
          union all select md5(inserted.id::text || ':phone')::uuid, inserted.id, 'phone', 'phone_call', ${preference.consents.phone}, ${preference.disclosureVersion}, ${preference.disclosureHash}, ${preference.sourceUrl}, ${preference.optInAction}, ${occurredAt}::timestamptz from inserted
          returning preference_id
        ), outbox_write as (
          insert into crm_outbox (id, event_type, idempotency_key, correlation_id, payload, status, attempt_count, next_attempt_at, created_at)
          select
            md5('crm-placement-contact:' || inserted.id::text)::uuid,
            'placement_review_created',
            'placement-contact-preference:' || inserted.id::text,
            review.id::text,
            jsonb_build_object(
              'schemaVersion', 'aitusa-crm-event-v1',
              'eventId', 'placement-contact-preference:' || inserted.id::text,
              'eventType', 'placement_review_created',
              'idempotencyKey', 'placement-contact-preference:' || inserted.id::text,
              'correlationId', inserted.attempt_id::text,
              'occurredAt', ${occurredAt}::timestamptz,
              'source', jsonb_build_object('product', 'aitusa_refresh', 'surface', 'portal', 'path', '/placement-test/', 'version', 'mis-397-v1'),
              'placementReview', jsonb_build_object('reviewId', review.id::text, 'resultId', review.result_id::text, 'status', review.status),
              'communicationPreference', ${preference.preferredChannel},
              'consent', jsonb_build_object('disclosureVersion', ${preference.disclosureVersion}, 'disclosureHash', ${preference.disclosureHash}, 'sourceUrl', ${preference.sourceUrl}, 'optInAction', ${preference.optInAction}, 'email', ${preference.consents.email}, 'serviceSms', ${preference.consents.serviceSms}, 'marketingSms', ${preference.consents.marketingSms}, 'phone', ${preference.consents.phone}, 'whatsapp', false, 'verifiedEmail', ${preference.verifiedEmail}, 'verifiedMobile', ${preference.verifiedMobile})
            ),
            'pending', 0, ${occurredAt}::timestamptz, ${occurredAt}::timestamptz
          from inserted
          join diagnostic_results result on result.attempt_id = inserted.attempt_id
          join placement_reviews review on review.result_id = result.id
          on conflict (idempotency_key) do nothing
        ) select id, attempt_id from inserted
      `);
      const row = rows(result)[0]; return row ? { id: row.id, attemptId: row.attempt_id } : null;
    },
  };
}
function rows(result) { return Array.isArray(result) ? result : result?.rows || []; }
