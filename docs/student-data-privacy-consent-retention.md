# AIT USA Student Data Privacy, Consent, And Retention Policy

Date: 2026-07-08
Linear: MIS-279
Status: Docs/spec only

## Purpose

Define privacy, consent, retention, access, deletion/export, and audit
requirements before the AIT USA portal stores student, guardian, attendance,
learning, payment-adjacent, audio, transcript, or AI-practice data.

This document does not approve implementation. It is a product and platform
contract for future builders. It is not legal advice and should be reviewed by
the approved business/legal/privacy owner before production data collection.

## Scope

In scope:

- Data categories and collection boundaries.
- Required versus optional data.
- Consent records and consent lifecycle.
- Minor/guardian access and consent posture.
- Retention and deletion/export defaults.
- Role-based access controls.
- Admin audit requirements.
- AI audio/transcript storage policy.
- Payment-adjacent privacy gates.
- Implementation gates for MIS-271 through MIS-278.

Out of scope until explicitly approved:

- A public privacy policy or legal terms copy.
- Production database schema, migrations, or durable storage.
- Auth provider, payment provider, CRM, or AI provider configuration.
- Live CRM writes.
- Live payment capture.
- Recording, storing, or training on raw student audio/transcripts.
- Production data export/delete automation.
- Messaging, email, SMS, or WhatsApp sends.

## Compliance Review Posture

AIT USA should treat this as an internal requirements baseline, not a final
legal policy.

Before production launch, a qualified reviewer should confirm:

- which federal, state, and local privacy laws apply to AIT USA;
- whether any program, funding, age range, or credentialing status changes
  education-record obligations;
- whether COPPA, FERPA, state student privacy rules, consumer privacy rules,
  payment rules, biometric/voice rules, or breach-notification rules apply;
- what retention periods are legally required or prohibited;
- what notices, opt-ins, guardian flows, and student rights workflows are
  required.

Product default: if applicability is unclear, choose the stricter data-minimizing
path and block collection until reviewed.

## Policy Principles

- AIT CRM remains the operational system of record.
- The portal is a student-facing surface, not a second CRM.
- Collect the minimum data needed for the approved feature.
- Separate required account data from optional/sensitive feature data.
- Store raw audio and transcripts for zero days by default.
- Keep CRM event payloads summary-only unless a specific contract approves more.
- Do not call AIT CRM, payment providers, or LLM providers directly from the
  browser.
- Do not expose raw CRM IDs, payment details, barcode tokens, private staff
  notes, or raw student submissions to client-visible code.
- Use role-based access and verified CRM links before showing student records.
- Make consent explicit, versioned, revocable, and auditable.
- Preserve audit trails without making audit logs a dumping ground for private
  data.
- Use fixture data in preview/local environments unless production-data use is
  explicitly approved.

## Data Classification

### Public Content

Examples:

- public marketing copy;
- course descriptions;
- public location and schedule information;
- approved public images and videos.

Default handling:

- Public content can live in the static site or approved CMS.
- Do not mix enrolled-student records into public content assets or metadata.

### Lead And Contact Data

Examples:

- name;
- phone;
- email;
- course interest;
- placement-test interest;
- advisor/support request;
- preferred language;
- source/UTM attribution.

Default handling:

- Public-site lead/contact collection requires approved notice and consent copy.
- AIT CRM should own durable lead/contact records.
- The site should send data through a backend or approved CRM adapter, not
  directly from browser code to AIT CRM.
- Source attribution should avoid raw IP addresses by default.

### Portal Account Data

Examples:

- auth provider subject;
- portal account ID;
- verified email/phone;
- display name;
- preferred language;
- role;
- status;
- last sign-in timestamp;
- CRM contact link reference.

Default handling:

- Auth provider owns credentials, sessions, password reset, MFA, and recovery.
- Portal app stores only account references and authorization state needed for
  the portal.
- Raw tokens, passwords, recovery codes, and provider secrets must never be
  stored in the browser or CRM timeline.

### Education And Learning Operations Data

Examples:

- course and section enrollment links;
- class session references;
- attendance records;
- attendance correction requests;
- lesson recap assignments;
- module progress summaries;
- homework/checklist completion.

Default handling:

- AIT CRM owns durable enrollment and attendance records.
- Portal can display student-facing summaries after identity, event, and
  privacy gates are approved.
- Store minimal progress states first. Avoid detailed video analytics, quiz
  answers, free-text homework, and uploads until approved.

### Minor And Guardian Data

Examples:

- minor/student age flag;
- guardian relationship;
- guardian verification status;
- guardian access level;
- guardian consent state;
- linked student references.

Default handling:

- Guardian access must be explicit, verified, revocable, and scoped.
- Do not infer guardian rights only from shared email, phone, address, or
  payment behavior.
- When a student reaches the relevant legal/adult threshold, consent and access
  should be reviewed before continuing guardian visibility.
- If a student is under 13 or the product is used by children under 13, block
  optional online collection until COPPA applicability and parental-consent
  requirements are reviewed.

### Payment-Adjacent Data

Examples:

- invoice reference;
- provider customer ID;
- receipt ID;
- payment status summary;
- balance summary;
- refund/failure status.

Default handling:

- Do not store card numbers, CVC, raw bank data, full payment method details, or
  provider secrets.
- Payment provider and AIT CRM ledger own durable payment records after MIS-278.
- Portal may show approved summaries only after guardian/student visibility and
  ledger/receipt rules are approved.

### AI Practice Data

Examples:

- lesson/module context selected for practice;
- practice started/completed event;
- topic;
- level;
- score/progress summary;
- safety/escalation flag;
- prompt template version;
- raw transcript;
- raw audio.

Default handling:

- Portal UI calls a backend/API boundary, never an LLM provider directly.
- Backend owns auth, rate limits, prompt construction, curriculum retrieval,
  safety/moderation, provider choice, cost controls, and logging.
- CRM receives safe summary events only by default.
- Raw audio and transcripts are not persisted by default.
- Raw audio/transcript storage requires separate explicit approval covering
  purpose, consent, access, retention, deletion, provider use, and student/guardian
  visibility.

### Scanner And Check-In Token Data

Examples:

- barcode/check-in token;
- token hash;
- scanner station ID;
- scan timestamp;
- selected session ID;
- scan result.

Default handling:

- Do not encode raw CRM IDs in student-visible barcodes.
- Do not store raw scanned tokens in CRM event metadata.
- Store a hash or safe lookup reference only.
- Do not log scanned tokens in browser console, server logs, analytics, or
  support screenshots.

### Security And Audit Data

Examples:

- account sign-in events;
- failed sign-in events;
- admin role changes;
- guardian link changes;
- consent changes;
- export/delete requests;
- IP hash;
- user-agent hash;
- request ID;
- service account action.

Default handling:

- Audit data should prove who did what, when, and why.
- Audit data should not include raw secrets, full free-text student content,
  raw audio, transcripts, payment details, barcode tokens, or private staff notes
  unless specifically required and approved.

## Required, Optional, And Blocked Data

### Required For Portal Access

Minimum required data:

- verified auth identity from provider;
- portal account status;
- role;
- verified CRM contact link;
- active enrollment reference when showing course data;
- consent policy version acknowledgment when required.

### Optional Student Preferences

Optional low-risk data:

- preferred display name;
- preferred language;
- contact preference;
- accessibility/support preference.

Optional data should have a clear edit and removal path.

### Sensitive Data Requiring Approval

Do not collect or store these until the owning contract and privacy review are
approved:

- date of birth or exact age;
- minor/guardian relationship evidence;
- emergency contacts;
- raw attendance reason notes;
- homework free text or uploads;
- placement-test answers tied to identity;
- detailed learning analytics;
- payment ledger details;
- payment provider identifiers beyond approved references;
- AI prompts tied to student identity;
- AI raw transcripts;
- AI raw audio;
- support free text containing health, immigration, financial, or family
  details.

### Blocked By Default

Forbidden until explicit approval:

- raw passwords or recovery codes;
- raw auth tokens;
- CRM API keys in browser code;
- payment card data;
- raw barcode tokens in logs or CRM metadata;
- raw AI audio/transcripts in CRM timeline;
- AI provider training on student audio/transcripts;
- public analytics that identify students;
- production data in local fixtures or screenshots.

## Consent Model

### Consent Record

Suggested fields:

- `consentRecordId`
- `subjectType`: `student`, `guardian`, `lead`, `staff`
- `subjectPortalAccountId`
- `subjectCrmContactId`
- `guardianPortalAccountId` when applicable
- `feature`: `lead`, `portal`, `attendance`, `lesson_progress`, `ai_practice`,
  `audio_recording`, `payment_visibility`, `messaging`, `guardian_access`
- `dataCategories`
- `status`: `not_required`, `pending`, `granted`, `declined`, `withdrawn`,
  `expired`
- `policyVersion`
- `noticeVersion`
- `captureMethod`: `form_checkbox`, `portal_setting`, `staff_recorded`,
  `provider_webhook`, `not_applicable`
- `capturedAt`
- `capturedBy`
- `expiresAt`
- `withdrawnAt`
- `withdrawalReason`
- `evidenceReference`

Do not store handwritten signatures, government IDs, or detailed relationship
proof in the portal unless an approved verification workflow requires it.

### Consent Rules

- Consent must be specific to feature and data category.
- Optional sensitive features cannot be bundled into required portal access.
- Consent copy should be Spanish-first with approved English support when
  needed.
- Audio recording consent must be separate from general AI practice consent.
- Transcript storage consent must be separate from transient transcription for
  one live practice response.
- Guardian access consent must define what the guardian can see and do.
- Payment visibility consent must define student versus guardian visibility.
- Marketing or messaging consent must be separate from operational support.
- Consent withdrawal stops new optional collection immediately after the backend
  receives the request.

### Consent Withdrawal

When consent is withdrawn:

- stop new collection for that feature;
- hide or disable the feature if required;
- queue deletion or redaction for optional stored artifacts;
- keep minimum audit records needed to prove the withdrawal happened;
- do not delete CRM-owned operational records without CRM/legal approval;
- notify staff if the withdrawal affects an active class, payment, support, or
  safety workflow.

## Minor And Guardian Rules

Default rules:

- Verify guardian relationship before showing student data.
- Scope guardian access to approved linked students only.
- Store guardian access level separately from the student's account.
- Make guardian access revocable by staff/admin and by policy workflow.
- Avoid showing raw AI transcripts/audio to guardians by default.
- Avoid showing payment details to guardians until MIS-278 approves access.
- Re-check consent and access when the student becomes an adult or when legal
  status changes.

Guardian access levels:

- `none`: no portal access to the student.
- `view_summary`: attendance/course/study summaries only.
- `support`: summary plus support requests.
- `support_and_payment`: support plus approved payment/receipt visibility.
- `full_guardian`: broader access only when explicitly approved.

Staff should be able to see why guardian access exists, who approved it, when it
was last reviewed, and when it expires.

## Retention Defaults

These are proposed platform defaults for review. Production implementation needs
approved legal/business retention values before storing real data.

| Data category | Default owner | Proposed retention | Notes |
| --- | --- | --- | --- |
| Public content | Website repo/CMS | Indefinite until replaced | No enrolled-student data in metadata. |
| Lead/contact data | AIT CRM | CRM policy | Requires notice/consent and source attribution rules. |
| Portal account reference | Portal/auth provider | Active account plus approved deactivation window | Do not delete CRM contact when portal access is disabled. |
| Auth sessions | Auth provider | Provider session policy, short-lived by default | No raw session secrets in portal logs. |
| Invite tokens | Portal backend | Expire in 7 to 14 days | Store hashed token after use/expiry only for audit. |
| CRM identity links | AIT CRM/portal | While relationship is active plus audit window | Revoked links remain audit-visible to staff. |
| Consent records | Portal/CRM | As long as dependent data is retained plus audit window | Needed to prove consent state and withdrawal. |
| Attendance records | AIT CRM | CRM student-record policy | Portal should read or cache briefly, not own ledger. |
| Attendance corrections | AIT CRM | Same as attendance audit policy | Never overwrite without previous/new value trail. |
| Raw scanner token | None | 0 days | Hash in transit/backend only; raw token not persisted. |
| Scanner token hash | Portal/CRM event | Until scan is resolved plus audit window | Must not be reversible. |
| Lesson progress summary | Portal/CRM event | Active enrollment plus approved post-access window | Minimal states only. |
| Detailed video analytics | None | 0 days by default | Block until approved. |
| Homework free text/uploads | None | 0 days by default | Block until storage and access policy is approved. |
| Support requests | AIT CRM | CRM support policy | Sanitize sensitive free text where practical. |
| Payment ledger/receipts | Payment provider/AIT CRM | Ledger/provider policy | Portal displays approved summaries only. |
| Payment card data | Payment provider only | Portal retention forbidden | Never store in portal or CRM metadata. |
| AI safe summary | CRM/portal event | Approved AI progress window | Summary-only by default. |
| AI raw transcript | None | 0 days by default | Requires separate approval to store. |
| AI raw audio | None | 0 days by default | Requires separate approval to store. |
| Security logs | Portal/backend | 30 to 90 days by default | Longer only for incident/audit needs. |
| Admin audit trail | Portal/CRM | Approved audit window | Keep minimal, tamper-resistant, and searchable. |
| Backups | Hosting/provider | Approved backup window | Delete requests should age out through backup lifecycle. |

## Deletion And Export

### Request Intake

Deletion/export requests should support:

- student request;
- guardian request when authorized;
- staff/admin request;
- legal/privacy owner request.

Minimum workflow:

1. Verify requester identity and role.
2. Identify data systems involved: auth provider, portal backend, AIT CRM,
   payment provider, AI provider, storage, logs, backups.
3. Classify records as user-controlled, operational, ledger, audit, legal hold,
   or backup-only.
4. Export eligible portal-held data in a readable format.
5. Delete, redact, anonymize, or retain each category according to approved
   retention policy.
6. Record an audit event with request ID, actor, scope, decision, and timestamp.

### Deletion Rules

- Do not delete active payment, attendance, support, or educational operations
  records without CRM/legal review.
- Do not destroy records while a valid access/amendment/review request is
  outstanding.
- Deleting portal access should not delete the CRM contact.
- Delete optional AI audio/transcripts if ever approved for storage and later
  withdrawn or requested, unless legal hold applies.
- Use tombstones or redacted audit references where deletion would otherwise
  break audit integrity.
- Backups should age out according to backup lifecycle unless the provider
  supports targeted deletion.

### Export Rules

Exports should include only records the requester is allowed to receive:

- account profile summary;
- consent records;
- portal-owned preferences;
- student-facing attendance summaries;
- lesson progress summaries;
- support requests created by the requester when approved.

Exports should exclude by default:

- staff-only notes;
- internal risk/security analysis;
- other students' data;
- raw secrets/tokens;
- CRM operational metadata not approved for disclosure;
- provider-internal logs.

## Access Controls

### Role Defaults

Student:

- Own account, courses, attendance summaries, study materials, consent records,
  and approved payment summaries only.

Guardian:

- Linked student summaries according to verified access level.

Teacher:

- Assigned sections/classes, attendance snapshots, learning content publishing,
  and limited progress summaries needed for instruction.

Admin:

- Account linking, support, consent/audit review, guardian access, and feature
  gates. Durable operational work should remain in AIT CRM when applicable.

System/service:

- Least-privilege API access scoped to one integration purpose.

### Access Requirements

- Verify portal account, role, and CRM link before returning student data.
- Require stronger authentication, ideally MFA, for teacher/admin access.
- Log admin access to student records.
- Scope teacher access by assigned section.
- Scope guardian access by verified relationship and access level.
- Keep staff-only CRM notes outside student/guardian portal views.
- Do not expose payment ledgers, AI transcripts, audio, or raw attendance notes
  unless specifically approved.

## Admin Audit Requirements

Audit events are required for:

- invite creation, resend, expiration, and claim;
- account activation, lock, disable, merge, and recovery;
- CRM contact link creation, verification, revocation, and merge;
- role changes;
- guardian link creation, access-level change, revocation, and expiry;
- consent grant, decline, withdrawal, and expiry;
- attendance check-in, correction, override, void, and manual edit;
- lesson content publish, archive, and private-note access;
- support request creation and staff assignment;
- payment summary visibility change after MIS-278;
- AI practice start/completion/escalation after MIS-275;
- audio/transcript consent changes if the feature is ever approved;
- export/delete request intake, decision, completion, and failure;
- failed auth, suspicious rate-limit events, and security incidents;
- service account or integration errors affecting CRM sync.

Suggested audit event fields:

- `auditEventId`
- `eventType`
- `actorType`
- `actorPortalAccountId`
- `actorCrmContactId`
- `targetType`
- `targetPortalAccountId`
- `targetCrmContactId`
- `source`
- `environment`
- `occurredAt`
- `reasonCode`
- `requestId`
- `previousValueHash`
- `newValueHash`
- `metadata`

Rules:

- Store hashes or safe references for sensitive previous/new values.
- Keep raw free text out of audit metadata when a reason code is enough.
- Audit logs should be tamper-resistant and staff-searchable.
- Student-facing exports should not include internal security details by
  default.

## Feature-Specific Gates

### MIS-271 Auth And Accounts

Implementation can start only when:

- auth provider data handling is reviewed;
- account lifecycle events are safe to audit;
- CRM link rules do not expose broad CRM data;
- invite tokens are opaque, expiring, and hashed after use.

### MIS-276 Portal Shell

Implementation can start with fixture data only.

Production data display requires:

- verified CRM identity link;
- role visibility rules;
- approved privacy/consent records area;
- safe empty/blocked states for sensitive features.

### MIS-277 CRM Events

Implementation can start only when:

- consent fields are included in event envelopes;
- event metadata is minimized;
- source attribution avoids raw IP by default;
- retry/dead-letter storage has retention rules;
- CRM effects are timeline/task/reporting/ledger/audit scoped.

### MIS-272 Attendance

Implementation can start only when:

- attendance retention owner and period are approved;
- guardian/student visibility is approved;
- correction audit trail is required;
- student edit limits are enforced;
- portal is not the durable attendance ledger.

### MIS-273 Barcode Check-In

Implementation can start only when:

- raw barcode token retention is zero days;
- token hashing and rotation rules are approved;
- station authorization is defined;
- unknown scan behavior does not leak student existence;
- offline mode does not require broad local PII cache.

### MIS-274 Lesson Recaps And Modules

Implementation can start only when:

- content access derives from verified enrollment;
- teacher private notes are separated;
- progress summary retention is approved;
- homework upload/free-text storage is explicitly approved or disabled;
- video/caption/transcript privacy is reviewed.

### MIS-275 AI Study Buddy

Implementation can start only when:

- backend API boundary is approved;
- raw audio/transcript default is no-store;
- AI provider data-use terms are approved;
- consent copy separates AI practice, audio recording, and transcript storage;
- safe CRM summary event shape is approved;
- rate limits, moderation, escalation, and cost controls are defined.

### MIS-278 Payment Portal

Implementation can start only when:

- provider and ledger owner are approved;
- portal stores no card data;
- payment summary visibility is approved for student/guardian roles;
- receipts/refunds/failures map to CRM ledger;
- payment support and reconciliation workflows are defined.

## Vendor And Provider Requirements

Any auth, payment, video, storage, CRM, analytics, or AI provider should support:

- data export and deletion workflows;
- access logs or admin audit evidence;
- role/service-account separation;
- secure webhooks or API authentication;
- documented retention and backup behavior;
- subprocessors/vendor list review;
- data-use controls for AI or analytics;
- environment separation for local, preview, staging, and production;
- contractual review before sensitive student data is sent.

AI providers require special review for:

- whether prompts, audio, transcripts, or outputs are retained;
- whether data can be used for training or product improvement;
- whether zero-retention or enterprise controls are available;
- how moderation and abuse logs are handled;
- how deletion/export requests are honored.

## Security Baseline

Minimum requirements before storing sensitive student data:

- HTTPS everywhere.
- Server-side secrets only.
- Encryption at rest for portal-held sensitive data.
- Least-privilege service accounts.
- Input validation and output encoding.
- Rate limiting for public, portal, scanner, and AI endpoints.
- Webhook signature verification for providers.
- Redacted logs by default.
- No production PII in local screenshots, fixtures, browser captures, or test
  artifacts.
- Dependency and vulnerability review before provider SDKs are added.
- Incident response owner and escalation path.

## Open Decisions

- Final legal/privacy owner for policy approval.
- Whether FERPA, COPPA, state student privacy laws, or other rules apply to AIT
  USA's exact programs and student age ranges.
- Final retention periods by record category.
- Final privacy notice and consent copy in Spanish and English.
- Whether date of birth is needed, or whether coarse minor/adult flags are
  enough.
- Guardian verification workflow and evidence handling.
- Data export/delete SLA and support owner.
- Whether any AI transcript storage is allowed.
- Whether any AI audio storage is allowed.
- Whether homework uploads/free-text submissions are allowed in the first portal
  version.
- Whether portal analytics can be student-identifiable or aggregate only.
- Approved vendor/subprocessor list.
- Incident response and breach notification workflow.

## Abort Conditions

Stop before implementation if:

- A feature requires durable sensitive data before retention and consent are
  approved.
- Raw audio or transcripts would be stored without explicit policy approval.
- Browser code would call AIT CRM, payment providers, or LLM providers directly.
- Payment card data would touch portal or CRM storage.
- Guardian access cannot be verified and scoped.
- Teachers can see unrelated students, payment records, or full CRM timelines.
- Admin actions cannot be audited.
- Raw barcode tokens, secrets, or provider tokens appear in logs.
- Production student data is needed in local/dev fixtures.
- The portal becomes a parallel CRM instead of a student-facing surface.

## Reference Checkpoints

These references are prompts for legal/privacy review, not compliance findings:

- FTC children's privacy guidance for COPPA and parental-consent review:
  https://www.ftc.gov/business-guidance/privacy-security/childrens-privacy
- U.S. Department of Education FERPA regulations and guidance:
  https://studentprivacy.ed.gov/ferpa

## Acceptance Mapping

MIS-279 acceptance coverage:

- What data is collected: data classifications and feature matrices define
  public, lead/contact, account, education, guardian, payment, AI, scanner, and
  audit data.
- What is optional: required, optional, sensitive, and blocked data are defined.
- Retention/deletion policy: retention defaults plus deletion/export workflows
  are defined for review.
- Access controls: role defaults and access requirements define student,
  guardian, teacher, admin, and service-account boundaries.
- Minor/guardian considerations: guardian verification, access levels, revocation,
  and adult-transition review are defined.
- Recording/audio consent: AI practice, audio recording, transcript storage, and
  no-store defaults are defined separately.
- AI transcript storage policy: raw transcripts/audio are zero-retention by
  default and require explicit approval before storage.
- Admin audit requirements: required audit events, fields, and rules are defined.

This spec is ready for review as a docs-only MIS-279 slice.
