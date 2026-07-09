# AIT USA Student Portal Auth And Account Model

Date: 2026-07-08
Linear: MIS-271
Status: Docs/spec only

## Purpose

Define how students sign in to the future AIT USA portal and how those portal
accounts map to AIT CRM contacts, leads, enrollments, courses, guardians/minors,
and payment records.

This document does not approve implementation. It gives the next builder a
bounded model for auth, account lifecycle, and CRM identity linking before any
framework, provider, backend, or durable student-data storage is added.

## Scope

In scope:

- Auth/provider direction.
- Student account lifecycle.
- Account-to-CRM identity mapping.
- Student, guardian, teacher, and admin role boundaries.
- Migration path from the current static public site.
- Decision gates before code implementation.

Out of scope until explicitly approved:

- Adding an auth provider or SDK.
- Adding a backend, database, framework migration, or portal runtime.
- Writing student, attendance, payment, lesson, audio, transcript, or AI data.
- Calling AIT CRM from the browser.
- Live payment capture or account-linked invoices.
- AI study buddy audio/transcript storage.

## Recommended Direction

Use a backend-owned portal auth boundary with a managed, OIDC-capable identity
provider.

The provider should own credentials, sessions, email verification, password
reset, and optional MFA. The AIT USA portal backend should own authorization,
CRM identity linking, rate limits, audit logs, and safe data shaping for the
browser. AIT CRM remains the durable business record.

Do not make the AIT CRM login the student login. CRM users are internal
operators. Student/guardian accounts need a separate student-facing identity
surface that links back to CRM records through server-side contracts.

Do not pick a final vendor until the portal app/runtime decision is approved.
Clerk, Auth0, Supabase Auth, and framework-native auth can all be evaluated
against the same requirements:

- OIDC/session support for the chosen app stack.
- Email verification and password reset.
- Optional MFA for staff/admin roles.
- Webhook or API support for account lifecycle events.
- Role/organization/group support or enough hooks to model it in the portal.
- Data export/deletion support for MIS-279 privacy requirements.
- Clean server-side integration with AIT CRM API contracts.

Director update, 2026-07-08: WorkOS AuthKit is the recommended future provider
candidate for the real portal auth path, subject to runtime and setup approval.
Do not configure a live WorkOS project, add secrets, install provider SDKs, or
wire production auth in the next implementation slice. WorkOS should be
evaluated first because it keeps identity/session ownership outside AIT CRM,
supports hosted auth and user management patterns, and has documented Next.js
and SvelteKit paths. Clerk, Auth0, Supabase Auth, and framework-native auth stay
as fallbacks or comparison points. Final provider setup remains approval-gated.

## Source Of Truth

- Auth provider: credentials, login sessions, verified email/phone factors, and
  provider subject IDs.
- Portal app/runtime: student-facing session, authorization checks, minimal
  profile display, CRM link references, and UX state.
- AIT CRM: contacts, leads, enrollments, courses, attendance, payments,
  receipts, events, follow-up, reporting, and staff-owned corrections.

The portal may cache or store derived state only after MIS-279 privacy/retention
rules and MIS-277 CRM event contracts are approved.

## Core Entities

### Portal Account

Represents one authenticated person who can enter the portal.

Suggested fields:

- `portalAccountId`
- `authProvider`
- `authProviderSubject`
- `status`: `invited`, `active`, `locked`, `disabled`, `merged`
- `primaryEmail`
- `primaryPhone`
- `displayName`
- `preferredLanguage`
- `roles`: `student`, `guardian`, `teacher`, `admin`
- `crmContactId`
- `crmLeadId`
- `createdAt`
- `lastSignedInAt`

Sensitive fields such as passwords, recovery codes, raw tokens, and provider
secrets must stay with the auth provider or server-side secret storage, never in
client code or CRM timeline notes.

### CRM Contact Link

Connects a portal account to the AIT CRM person record.

Suggested fields:

- `portalAccountId`
- `crmContactId`
- `linkStatus`: `pending`, `verified`, `needs_review`, `revoked`
- `linkMethod`: `invite`, `staff_match`, `verified_email`, `verified_phone`
- `verifiedBy`
- `verifiedAt`
- `revokedAt`

The primary link path should be invite-based or staff-confirmed. Self-service
matching by email/phone can assist discovery, but should not grant access to
enrollment, attendance, payment, or minor records without verification.

### Enrollment Link

Connects a verified student contact to the courses/classes they can see.

Suggested fields:

- `crmEnrollmentId`
- `crmContactId`
- `courseId`
- `sectionId`
- `enrollmentStatus`
- `accessStartsAt`
- `accessEndsAt`

Enrollment remains CRM-owned. Portal access should follow CRM enrollment state.

### Guardian Link

Models parent/guardian access for a minor student.

Suggested fields:

- `guardianPortalAccountId`
- `guardianCrmContactId`
- `studentCrmContactId`
- `relationship`
- `consentStatus`
- `accessLevel`: `view_only`, `support_and_payment`, `full_guardian`
- `verifiedBy`
- `verifiedAt`

Guardian access should be explicit and revocable. Minor/guardian requirements
depend on MIS-279.

### Payment Reference

Payment records should not be invented in the portal before MIS-278.

Allowed future reference shape:

- `crmPaymentAccountId`
- `providerCustomerId`
- `invoiceId`
- `receiptId`
- `balanceSummary`

The portal may display payment/receipt data only after CRM ledger and provider
contracts are approved.

## Account Lifecycle

### 1. Invite

Preferred path:

- Staff creates or verifies a CRM contact/enrollment.
- CRM or portal admin creates an invite tied to `crmContactId`.
- Student receives a time-limited invite link.
- Invite includes only an opaque token, not CRM IDs or student PII.

Do not allow unrestricted public account creation for portal access. Public site
lead forms and placement flows can create leads, but portal access should wait
for a verified CRM identity link.

### 2. Claim Account

Student opens invite, verifies email or phone, and creates the auth account.

Minimum requirements:

- Confirm invite has not expired or been used.
- Confirm the claimed email/phone matches the intended contact or is approved by
  staff.
- Create `authProviderSubject`.
- Create or activate `portalAccountId`.
- Emit a safe CRM event such as `portal_account_activated` after MIS-277.

### 3. Sign In

The browser signs in through the provider, then calls the portal backend. The
backend validates the session and returns only the student-safe portal shape.

Do not call AIT CRM directly from the browser. Do not place CRM API tokens,
provider secrets, or broad role claims in client-visible code.

### 4. Profile Updates

Students may request updates to editable basics such as preferred name, language,
phone, or emergency contact only after the CRM update contract is approved.

Default rule:

- Low-risk display preferences can live in portal state.
- Legal name, enrollment, guardian links, attendance corrections, and payment
  identity changes require staff/CRM approval.

### 5. Password Reset And Recovery

The auth provider owns password reset, magic link, recovery, and email
verification flows.

Portal responsibilities:

- Keep reset UX linked from the login page.
- Log safe lifecycle events after MIS-277.
- Lock or flag accounts after suspicious reset patterns.
- Escalate identity conflicts to staff.

### 6. Deactivation

Disabling portal access should not delete the CRM contact.

Supported states:

- `locked`: temporary risk or support issue.
- `disabled`: no active portal access.
- `merged`: duplicate account resolved into another account.
- `revoked`: guardian or role relationship removed.

Deletion/export/retention behavior depends on MIS-279.

## Roles And Permissions

### Student

Can:

- View own profile summary.
- View own enrolled courses and portal dashboard.
- View own attendance summary after MIS-272.
- View lesson recaps/modules after MIS-274.
- Start AI study buddy entry points after MIS-275 and MIS-279.
- View payment/receipt summaries after MIS-278.
- Request profile/support changes.

Cannot:

- Edit CRM identity, enrollment, attendance, grades/progress summaries, payment
  ledger, or guardian links directly.
- Access another student's records.

### Guardian

Can:

- View approved minor/student information according to `accessLevel`.
- Help with support requests and payments when approved.
- Receive notifications approved for the guardian relationship.

Cannot:

- Access unlinked students.
- Override attendance, course status, or payment ledger.
- Access AI transcripts/audio unless consent and policy explicitly allow it.

### Teacher

Can:

- View assigned course/section rosters.
- View attendance context for assigned sessions after MIS-272.
- Publish or draft lesson recaps after MIS-274.
- See limited student progress context needed for instruction.

Cannot:

- Manage payment records.
- Change CRM identity links.
- View unrelated classes or financial history.

### Admin

Can:

- Create and revoke invites.
- Verify account-to-CRM links.
- Resolve duplicate/merged accounts.
- Manage role assignments.
- Review audit trails and support escalations.

Admin access should require stronger security controls than student access,
including MFA and audit logging.

## CRM Link Rules

- Account access to student records requires a verified CRM contact link.
- Enrollment access is derived from CRM enrollment state.
- Payment access is derived from CRM/payment ledger state after MIS-278.
- Lesson/content access is derived from CRM enrollment and content publishing
  rules after MIS-274.
- Attendance access is derived from CRM/session attendance rules after MIS-272.
- A portal account can link to multiple CRM contacts only for approved guardian
  or staff use cases.
- Duplicate account detection should use provider subject, email, phone, and CRM
  contact ID, but merge decisions should be staff-reviewed.

Every future CRM event should include:

- `eventType`
- `eventId` or idempotency key
- `occurredAt`
- `source`: `aitusa-portal`
- `actorType`: `student`, `guardian`, `teacher`, `admin`, `system`
- `portalAccountId`
- `crmContactId` when verified
- `crmEnrollmentId` when relevant
- safe metadata only

## Public Site To Portal Migration

Phase 0: Current static site

- Keep public site static.
- Keep placement/contact flows as public acquisition flows.
- Do not store portal data.
- Link to "portal coming later" only if product copy is approved.

Phase 1: Portal planning

- Finalize MIS-271 auth/account model.
- Finalize MIS-276 portal shell IA.
- Finalize MIS-277 CRM event/API contract.
- Finalize MIS-279 privacy/retention requirements before storing sensitive data.

Phase 2: Runtime decision

- Use React/Next as the preferred app/runtime path unless a later review finds
  a blocker.
- Keep SvelteKit and other runtimes as fallbacks, not the default path.
- Choose auth provider against the requirements above.
- Define server-side CRM adapter boundaries.
- Define environment, secret, preview, and audit requirements.

Phase 3: Prototype

- Build a non-production portal shell with fixture data.
- Prove sign-in, invite claim, and CRM identity-link shape without production CRM
  writes.
- Validate mobile dashboard and empty/error states.

Phase 4: Pilot

- Enable a small staff-reviewed student cohort.
- Use real CRM contracts only after consent, retention, and audit policy are
  approved.
- Monitor account conflicts, invite failures, and support requests.

## Dependencies

- MIS-276 should use this role/account model for portal IA.
- MIS-277 is required before logging account lifecycle events to AIT CRM.
- MIS-279 is required before storing sensitive portal, minor, audio/transcript,
  attendance, or payment-adjacent student data.
- MIS-272 depends on verified student/enrollment identity before attendance can
  appear in the portal.
- MIS-274 depends on enrollment-derived content access rules.
- MIS-275 depends on verified identity plus privacy/cost/safety gates.
- MIS-278 depends on verified student identity plus ledger/provider decisions.

## Open Decisions

- Portal app/runtime: React/Next is the preferred integrated app direction; the
  remaining decision is migration sequence and scope.
- Auth provider shortlist and final vendor.
- Email-only vs email plus SMS verification.
- MFA requirement for teacher/admin roles.
- Guardian consent and minor account rules.
- CRM API endpoints for identity lookup, invite creation, event logging, and
  profile update requests.
- Retention/deletion policy for account links and audit logs.
- Support process for duplicate records, mistaken identity, and lost access.

## Abort Conditions

Stop before implementation if:

- The chosen provider requires browser-side CRM secrets or privileged tokens.
- Portal identity cannot be linked to CRM without manual ambiguity.
- Minor/guardian data rules are not approved.
- Payment, attendance, AI, or lesson progress storage is being added before
  MIS-279 and the relevant feature contract are approved.
- The work starts turning the portal into a second CRM instead of a
  student-facing surface.

## Acceptance Mapping

MIS-271 acceptance coverage:

- Auth/provider direction: backend-owned auth boundary with managed OIDC-capable
  identity provider; final vendor gated by runtime decision.
- Account lifecycle: invite, claim, sign-in, profile update, reset/recovery, and
  deactivation states are defined.
- CRM link rules: portal account, contact link, enrollment link, guardian link,
  and payment reference rules are defined.
- Role boundaries: student, guardian, teacher, and admin permissions are defined.
- Migration path: static site to planning, runtime decision, prototype, and pilot
  phases are defined.

This spec is ready for review as a docs-only MIS-271 slice.
