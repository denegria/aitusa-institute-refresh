# MIS-271 Auth Implementation Packet

Date: 2026-07-08
Linear: MIS-271
Base branch: staging
Status: Implementation packet only

## Purpose

Translate the approved MIS-271 auth/account model into a narrow, reviewable
implementation plan for the first portal auth slice.

This packet does not approve provider setup, framework migration, database
migrations, durable student storage, CRM writes, payment work, or AI/audio
features. It gives the next builder a clear boundary for an auth/runtime
decision and a fixture-backed prototype path.

## Why This Issue First

MIS-271 should remain the first implementation lane because every portal surface
depends on verified identity and role-scoped access:

- MIS-276 needs student, guardian, teacher, and admin visibility rules.
- MIS-277 needs a stable actor/account shape before events can be logged.
- MIS-272, MIS-273, and MIS-274 need enrollment-derived access.
- MIS-275 and MIS-278 are blocked until identity, privacy, and provider
  boundaries are approved.

## Inputs

Use these merged docs as source material:

- `docs/student-portal-auth-account-model.md`
- `docs/student-portal-ux-shell-navigation.md`
- `docs/crm-event-api-contract.md`
- `docs/student-data-privacy-consent-retention.md`
- `docs/student-portal-platform-plan.md`

Linear source:

- MIS-271: student accounts and portal authentication model.
- Parent MIS-270: student portal, attendance, and learning operations expansion.

## Recommended First Slice

Start with a docs/prototype-only auth boundary spike, not a live provider.

The first implementation PR after this packet should prove:

- portal runtime direction is explicit;
- browser never receives CRM credentials or privileged provider tokens;
- fixture account/session data can drive role-gated portal views;
- account-to-CRM links are represented as safe references;
- invite claim and sign-in states are modeled without production writes;
- privacy and consent gates are visible in the account/session shape.

Do not install an auth SDK or create production auth settings until Alvaro
approves the runtime/provider decision.

## Runtime Decision Checklist

Before code implementation, choose one of these runtime paths:

### Option A: Keep Static Site Plus Separate Portal App

Use the current static site for public marketing and create a separate future
portal app/runtime.

Best when:

- the public site should remain simple and low-risk;
- portal work will need backend routes, sessions, auth middleware, and CRM
  adapters;
- implementation can progress without refactoring the marketing site.

Risks:

- shared navigation/brand elements need duplication or packaging later;
- deployment and routing strategy must define how `/portal` is served.

### Option B: Migrate Site Into Full-Stack App

Move the public site and portal into one approved app/runtime.

Best when:

- the team wants one app for public pages and authenticated portal routes;
- routing, i18n, forms, backend endpoints, and auth should share one framework.

Risks:

- larger migration surface;
- public site regressions;
- more code review required before portal value appears.

### Default Recommendation

Use Option A for the first MIS-271/MIS-276 prototype unless Alvaro explicitly
approves a full-site framework migration.

Reason: it preserves the current public site while allowing portal architecture
to mature behind fixture data and server-side contracts.

## Auth Provider Evaluation

Do not choose a final vendor silently. Evaluate provider candidates against the
same scorecard.

Required capabilities:

- OIDC or standards-based session support for the approved runtime.
- Email verification.
- Password reset or passwordless recovery.
- Optional MFA for teacher/admin roles.
- Webhooks or API support for account lifecycle events.
- Stable provider subject ID.
- Server-side token/session validation.
- Role/group/organization support or enough backend hooks to model roles in the
  portal app.
- Export/delete support for MIS-279 privacy workflows.
- Environment separation for local, preview, staging, and production.
- Admin audit evidence.
- Clear subprocessors and data-retention documentation.

Candidate set for review:

- Clerk.
- Auth0.
- Supabase Auth.
- Framework-native auth using an approved identity provider.

Evaluation output should include:

- recommended provider;
- rejected alternatives and why;
- pricing/support note;
- data retention and deletion note;
- MFA/staff-admin note;
- webhook/event note;
- lock-in and migration note;
- proof that CRM secrets remain server-side.

## Backend Boundary

Future browser flow:

1. Browser authenticates with the approved provider.
2. Browser calls the portal backend with a session/cookie/token appropriate to
   the runtime.
3. Backend validates the session server-side.
4. Backend resolves a safe portal account shape.
5. Backend returns only role-scoped student-safe data.
6. Backend calls AIT CRM only through approved server-side adapters.

Forbidden:

- Browser calls AIT CRM directly.
- Browser stores CRM API tokens, provider management tokens, or service secrets.
- Client-side role claims grant access without backend verification.
- Account self-match by email/phone unlocks attendance, payments, minor, or
  enrollment records without staff/CRM verification.

## Logical Account Shapes

These are logical shapes, not database migrations.

### Portal Session

```json
{
  "portalAccountId": "acct_fixture_student",
  "authProvider": "fixture",
  "authProviderSubject": "fixture|student-001",
  "status": "active",
  "roles": ["student"],
  "preferredLanguage": "es",
  "crmContactRef": "crm_contact_fixture_001",
  "verifiedCrmLink": true,
  "consent": {
    "portalPolicyVersion": "pending-review",
    "privacyGateSatisfied": false
  }
}
```

### CRM Contact Link

```json
{
  "portalAccountId": "acct_fixture_student",
  "crmContactRef": "crm_contact_fixture_001",
  "linkStatus": "verified",
  "linkMethod": "invite",
  "verifiedBy": "staff_fixture",
  "verifiedAt": "2026-07-08T00:00:00.000Z"
}
```

### Invite

```json
{
  "inviteId": "invite_fixture_001",
  "status": "pending",
  "targetCrmContactRef": "crm_contact_fixture_001",
  "roles": ["student"],
  "expiresAt": "2026-07-22T00:00:00.000Z",
  "tokenStorage": "hash_only"
}
```

### Guardian Link

```json
{
  "guardianPortalAccountId": "acct_fixture_guardian",
  "studentCrmContactRef": "crm_contact_fixture_minor",
  "relationship": "guardian",
  "accessLevel": "view_summary",
  "consentStatus": "pending",
  "verifiedBy": "staff_fixture"
}
```

## Future Endpoint Inventory

Endpoint names are planning names only. Final routes should follow the approved
runtime.

Student/account:

- `GET /portal/api/session`
- `GET /portal/api/account/me`
- `POST /portal/api/account/profile-request`
- `POST /portal/api/account/support-request`

Invite/account lifecycle:

- `POST /portal/api/invites/claim`
- `POST /portal/api/invites/resend`
- `POST /portal/api/account/deactivate`
- `POST /portal/api/account/recovery-flag`

Admin/staff:

- `POST /portal/api/admin/invites`
- `POST /portal/api/admin/crm-links/verify`
- `POST /portal/api/admin/crm-links/revoke`
- `POST /portal/api/admin/guardian-links`
- `POST /portal/api/admin/roles`

All endpoints require:

- server-side auth/session validation;
- role authorization;
- rate limiting appropriate to the action;
- safe audit event;
- no raw secrets in request or response bodies;
- no live CRM write until MIS-277 and the CRM adapter are approved.

## CRM Event Hooks

MIS-271 implementation should prepare for these MIS-277 events:

- `portal.invite.created`
- `portal.invite.claimed`
- `portal.sign_in.succeeded`
- `portal.sign_in.failed`
- `portal.profile_update.requested`
- `portal.support.requested`
- `portal.account.locked`
- `portal.account.disabled`
- `portal.crm_link.verified`
- `portal.crm_link.revoked`
- `portal.guardian_link.created`
- `portal.guardian_link.revoked`

Each event should include:

- idempotency key;
- source `aitusa-portal`;
- actor role;
- portal account reference when available;
- CRM contact reference only when verified;
- safe metadata only.

## Fixture Data Requirements

First prototype fixtures should include:

- active student with verified CRM link;
- invited student with pending claim;
- student with missing/needs-review CRM link;
- guardian linked to one minor/student;
- guardian with no verified link;
- teacher assigned to one section;
- admin with MFA-required state;
- disabled account;
- locked account;
- duplicate account review case.

Fixtures must not use production student data, real CRM IDs, real emails, real
phone numbers, or screenshots containing private records.

## Acceptance Tests For First Code Slice

When implementation is approved, the first code PR should prove:

- fixture student can resolve a safe `PortalSession`;
- missing CRM link returns an unauthorized/support state;
- guardian can only see linked student references;
- teacher cannot see unassigned student/account data;
- admin-only actions reject student and teacher roles;
- invite token is represented as opaque and hash-only after creation;
- sign-in/session response omits CRM secrets and provider management tokens;
- audit/event payloads are safe summaries;
- privacy gate can block sensitive areas before MIS-279 approval;
- no endpoint performs a live CRM write.

## Validation Plan

For this packet:

- `npm.cmd run check:assets`
- `npm.cmd run build`
- `git diff --check origin/staging...HEAD`

For future code slices:

- targeted unit tests for auth/session/role helpers;
- fixture tests for student, guardian, teacher, and admin visibility;
- static build/lint according to approved runtime;
- browser verification for portal shell states only when UI is added;
- security review before provider SDKs or secrets are introduced.

## Decisions Needed Before Provider Setup

- Portal runtime path: separate app or full-stack migration.
- Provider shortlist and evaluation owner.
- Required staff/admin MFA policy.
- Email-only versus email plus SMS verification.
- Invite expiration and resend policy.
- Guardian verification workflow.
- Whether portal account references live in portal storage, CRM, or both.
- CRM adapter endpoint shape for account link lookup and invite events.
- Legal/privacy owner for data processing and retention review.

## Abort Conditions

Stop before code implementation if:

- runtime decision is still unclear;
- provider choice would be made only because an SDK is convenient;
- implementation requires browser-side CRM or provider management secrets;
- production student data is needed for fixtures;
- account matching can expose unrelated enrollment, minor, attendance, payment,
  or learning records;
- guardian access cannot be verified and scoped;
- audit events would store raw tokens, CRM secrets, or sensitive free text.

## Suggested Worker Prompt

Use this prompt after Alvaro approves MIS-271 implementation:

```text
You are working in the AIT USA Institute Refresh repo on MIS-271.

Create a small, issue-specific PR from `staging` for a fixture-backed auth
boundary prototype. Do not install a real auth provider, add durable student
storage, or call AIT CRM. Use the approved docs as source of truth:

- docs/student-portal-auth-account-model.md
- docs/student-data-privacy-consent-retention.md
- docs/crm-event-api-contract.md
- docs/mis-271-auth-implementation-packet.md

Goal:
- define safe portal session/account/CRM-link fixture shapes;
- add pure helper functions or a prototype module if the approved runtime allows;
- prove student/guardian/teacher/admin role boundaries with tests;
- return blocked/support states when CRM identity is missing or privacy gates
  are not satisfied;
- keep all data fake and local.

Do not:
- choose a final auth provider silently;
- add provider SDKs or secrets;
- add database migrations;
- write to CRM;
- store payment, attendance, AI audio/transcript, or production student data.

Validation:
- run targeted tests if code is added;
- run npm.cmd run check:assets;
- run npm.cmd run build;
- run git diff --check origin/staging...HEAD.

Report issue id, branch/commit, files touched, validation, risks, and next step.
```

## Review Outcome

This packet is ready when reviewers agree that:

- MIS-271 should proceed before MIS-276 implementation;
- the first code slice is fixture-backed and provider-neutral;
- runtime/provider decisions are explicit gates;
- CRM, privacy, payment, and AI boundaries remain blocked until approved.
