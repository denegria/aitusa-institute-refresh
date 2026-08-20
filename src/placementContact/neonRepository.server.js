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
          select ${id}::uuid, ${accountId}::uuid, owned.id, ${preference.preferredChannel}, ${preference.mobile}, ${preference.verifiedMobile}, ${preference.verifiedEmail}, ${preference.guardianOwned}, ${preference.disclosureVersion}, ${preference.disclosureHash}, ${preference.sourceUrl}, ${preference.optInAction}, ${occurredAt}::timestamptz from owned_attempt owned
          returning id, attempt_id
        ), consents as (
          insert into placement_channel_consents (id, preference_id, channel, purpose, decision, disclosure_version, disclosure_hash, source_url, opt_in_action, occurred_at)
          select md5(inserted.id::text || ':email')::uuid, inserted.id, 'email', 'advisor_contact', ${preference.consents.email}, ${preference.disclosureVersion}, ${preference.disclosureHash}, ${preference.sourceUrl}, ${preference.optInAction}, ${occurredAt}::timestamptz from inserted
          union all select md5(inserted.id::text || ':sms-service')::uuid, inserted.id, 'sms', 'service_sms', ${preference.consents.serviceSms}, ${preference.disclosureVersion}, ${preference.disclosureHash}, ${preference.sourceUrl}, ${preference.optInAction}, ${occurredAt}::timestamptz from inserted
          union all select md5(inserted.id::text || ':sms-marketing')::uuid, inserted.id, 'sms', 'marketing_sms', ${preference.consents.marketingSms}, ${preference.disclosureVersion}, ${preference.disclosureHash}, ${preference.sourceUrl}, ${preference.optInAction}, ${occurredAt}::timestamptz from inserted
          union all select md5(inserted.id::text || ':phone')::uuid, inserted.id, 'phone', 'phone_call', ${preference.consents.phone}, ${preference.disclosureVersion}, ${preference.disclosureHash}, ${preference.sourceUrl}, ${preference.optInAction}, ${occurredAt}::timestamptz from inserted
          union all select md5(inserted.id::text || ':whatsapp')::uuid, inserted.id, 'whatsapp', 'whatsapp_contact', ${preference.consents.whatsapp}, ${preference.disclosureVersion}, ${preference.disclosureHash}, ${preference.sourceUrl}, ${preference.optInAction}, ${occurredAt}::timestamptz from inserted
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
        ) select id, attempt_id from inserted
      `);
      const row = rows(result)[0]; return row ? { id: row.id, attemptId: row.attempt_id } : null;
    },
  };
}
function rows(result) { return Array.isArray(result) ? result : result?.rows || []; }
