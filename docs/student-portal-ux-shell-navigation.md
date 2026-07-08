# AIT USA Student Portal UX Shell And Navigation

Date: 2026-07-08
Linear: MIS-276
Status: Docs/spec only

## Purpose

Define the authenticated student portal experience before any portal runtime,
framework, backend, storage, or visual implementation is approved.

The portal should help a student answer four questions quickly:

- What do I need to do next?
- What am I enrolled in?
- What happened in class, and what should I study?
- How do I get help or resolve account/payment/class questions?

This document extends the MIS-271 auth/account model. It describes shell,
navigation, information architecture, states, and edit boundaries. It does not
approve building a portal UI yet.

## Scope

In scope:

- Mobile-first portal shell and navigation IA.
- Dashboard sections and priority order.
- Student, guardian, teacher, and admin visibility boundaries.
- Empty, loading, error, and blocked states.
- What users can and cannot edit.
- Dependencies on auth, CRM events, attendance, learning content, AI, payments,
  and privacy policy.

Out of scope until explicitly approved:

- UI code, route implementation, framework migration, or styling.
- Auth provider setup.
- Database schema or storage.
- Live AIT CRM API writes.
- Payment capture, invoice payment pages, or ledger changes.
- AI provider calls, raw audio capture, transcript storage, or speech scoring.

## Product Principles

- Spanish-first by default, with future English support.
- Mobile-first: many students will use the portal from a phone before or after
  class.
- Action-first: surface the next useful action before secondary history.
- CRM-aligned: show student-facing summaries of CRM-owned records instead of
  creating a second CRM.
- Permission-aware: students, guardians, teachers, and admins should never see
  records simply because they can sign in.
- Honest states: say when something is pending, unavailable, or staff-reviewed.
- Safe defaults: hide or block sensitive areas until MIS-279 privacy/retention
  rules and the relevant feature contracts are approved.

## Primary Users

### Student

Goal: see class status, attendance, study materials, placement/result history,
support options, and approved payment/receipt summaries.

### Guardian

Goal: help a minor/student stay on track, view approved information, and handle
support or payment tasks when allowed.

### Teacher

Goal: view assigned class context, attendance snapshots, and lesson recap or
module publishing tasks after the relevant content workflow is approved.

### Admin

Goal: resolve account access, identity links, support requests, and operational
exceptions. Admins should use AIT CRM for durable business operations, not the
student portal as a replacement CRM.

## Shell Structure

Recommended shell:

- Top bar:
  - AIT USA logo/name.
  - Current role or account switcher when a user has multiple roles.
  - Language switch placeholder.
  - Support entry.
- Main navigation:
  - Mobile: bottom navigation with five primary entries.
  - Desktop: left rail using the same entry order.
- Content area:
  - One primary task per screen.
  - Summary cards that link to detail screens.
  - Clear disabled/coming-soon states for blocked features.
- Footer/help strip:
  - WhatsApp/advisor contact.
  - Location/class support.
  - Privacy and account help links.

Recommended primary navigation order:

1. `Inicio`
2. `Mis cursos`
3. `Asistencia`
4. `Estudiar`
5. `Cuenta`

Secondary destinations can live behind cards, tabs, or the account/support area:

- Placement history.
- Payments/receipts.
- AI study buddy.
- Support requests.
- Notifications.

## Student IA

### Inicio

Purpose: show a concise student dashboard.

Recommended sections:

- Next class or next enrollment action.
- Current course card.
- Attendance snapshot.
- Latest lesson recap or module.
- Placement/result status.
- Payment/receipt status placeholder when approved.
- AI study buddy entry placeholder when approved.
- Support/contact action.

Priority order:

1. Urgent account/class/support blockers.
2. Next class or next action.
3. Active course and attendance.
4. Latest study material.
5. Secondary history and settings.

### Mis Cursos

Purpose: show enrolled courses and course context.

Student-visible content:

- Course name.
- Modality: in-person, hybrid, online.
- Level or program.
- Schedule summary.
- Location or online access state.
- Teacher name when approved.
- Enrollment status.
- Linked study materials.

Blocked until later contracts:

- Staff-only notes.
- Internal CRM status codes.
- Full roster.
- Attendance corrections.
- Payment balance details before MIS-278.

### Asistencia

Purpose: show attendance as a trust-building summary, not an editable ledger.

Student-visible content after MIS-272:

- Attendance percentage or simple status summary.
- Recent class sessions.
- Present/absent/late/excused states.
- Staff-reviewed correction status.
- Support path for questions.

Default edit rule:

- Students can request review or contact support.
- Students cannot directly edit attendance records.

### Estudiar

Purpose: collect lesson recaps, video modules, handouts, homework, and approved
practice tools.

Student-visible content after MIS-274:

- Latest recap.
- Assigned video modules.
- Handouts/links.
- Homework or practice checklist.
- Completion status when approved.

AI study buddy entry after MIS-275 and MIS-279:

- Start from an assigned lesson/module.
- Show privacy/cost/teacher-escalation boundaries before use.
- Do not provide a wide-open chat surface by default.

### Cuenta

Purpose: account profile, settings, support, and safe history.

Student-visible content:

- Display name.
- Preferred language.
- Email/phone verification status.
- Support/contact preferences.
- Linked guardian access summary when relevant.
- Privacy and consent records after MIS-279.

Editable by student only when approved:

- Preferred display name.
- Preferred language.
- Contact preference.
- Support request details.

Staff-reviewed or CRM-owned:

- Legal name.
- Date of birth.
- Guardian links.
- Enrollment.
- Payment identity.
- Attendance corrections.
- Course level/status.

## Guardian IA

Guardians should see a student selector first when linked to more than one
student.

Recommended areas:

- Student summary.
- Attendance summary.
- Course/study overview.
- Support/contact.
- Payments/receipts only after MIS-278 and guardian access approval.
- Consent/privacy records after MIS-279.

Guardians should not see:

- Unlinked students.
- Staff-only CRM notes.
- Raw AI audio/transcripts unless policy explicitly approves it.
- Teacher/admin tools.

## Teacher IA

Teacher access should be separate from the student dashboard and scoped to
assigned sections.

Recommended areas:

- Assigned classes.
- Session attendance snapshot after MIS-272.
- Lesson recap/module publishing after MIS-274.
- Student progress summaries necessary for instruction.
- Support/escalation notes that are safe for teacher visibility.

Teachers should not see:

- Payment ledger or receipts.
- Unassigned classes.
- CRM identity-link admin controls.
- Full operational CRM timeline.

## Admin IA

Admin portal tools should be minimal and should send durable operations back to
AIT CRM.

Recommended areas:

- Account invite/revocation support.
- Identity-link review.
- Duplicate account review.
- Portal access audit.
- Support/escalations.
- Feature-gate status for blocked modules.

Admins should continue to use AIT CRM for:

- Contact/enrollment source of truth.
- Payment ledger.
- Attendance corrections once synced.
- Reporting and follow-up workflows.

## State Model

Every portal surface should define these states before implementation:

- Loading: data is being requested from the portal backend.
- Empty: user has access, but no records exist yet.
- Pending: data exists but needs staff/CRM verification.
- Blocked: feature requires approval or dependency before use.
- Error: backend/API call failed.
- Offline/degraded: user can read cached safe state only if caching is approved.
- Unauthorized: user signed in but lacks a verified link or role.
- Expired session: sign-in needs renewal.

## Empty State Copy Intent

Use calm, direct copy. Examples are intent-level, not final UI text:

- No enrollment yet: "Todavia no vemos un curso activo en tu cuenta."
- No attendance yet: "Tu asistencia aparecera despues de tu primera clase
  registrada."
- No lesson recap yet: "Tu profesor todavia no ha publicado un resumen para esta
  clase."
- Payment blocked: "Los pagos en portal estaran disponibles cuando tu cuenta y
  recibos esten aprobados."
- AI blocked: "La practica con IA estara disponible despues de aprobar privacidad
  y reglas de uso."

## Error And Support Rules

- Account link missing: send to support/advisor, not a blank dashboard.
- Enrollment mismatch: show support path and avoid exposing internal IDs.
- Attendance disagreement: allow request for review, not direct edit.
- Payment confusion: route to staff until MIS-278 is approved.
- AI safety or privacy block: explain that practice is unavailable, not broken.
- CRM/API failure: show a retry option plus support path; do not silently drop
  student actions.

## Route Map

Suggested future route names:

- `/portal`
- `/portal/courses`
- `/portal/courses/:courseId`
- `/portal/attendance`
- `/portal/study`
- `/portal/study/:moduleId`
- `/portal/placement`
- `/portal/payments`
- `/portal/support`
- `/portal/account`
- `/portal/admin/accounts`
- `/portal/teacher/classes`

These are planning names only. Final route design should follow the approved app
runtime and locale strategy.

## Role Visibility Matrix

| Area | Student | Guardian | Teacher | Admin | Gate |
| --- | --- | --- | --- | --- | --- |
| Dashboard | Own account | Linked student | Assigned classes | Support/admin view | MIS-271 |
| Courses | Own enrollments | Linked student | Assigned sections | CRM-linked summary | MIS-271 |
| Attendance | Own summary | Linked student summary | Assigned class summary | Review/audit | MIS-272 |
| Lesson recaps | Own assigned content | Linked student content | Publish assigned content | Admin support | MIS-274 |
| Placement history | Own results | Linked student results | Limited instructional view | CRM/support view | MIS-277 |
| AI study buddy | Own approved sessions | Policy-dependent | Escalation summaries | Audit/support | MIS-275, MIS-279 |
| Payments/receipts | Own approved summary | Approved guardian access | No | CRM/ledger support | MIS-278 |
| Profile/settings | Limited edits | Limited linked edits | Own staff profile | Access/admin support | MIS-271, MIS-279 |

## Dependency Notes

- MIS-271 defines identity, roles, and CRM link rules.
- MIS-277 defines which portal actions become CRM events.
- MIS-272 defines attendance entities and student-facing summaries.
- MIS-274 defines lesson recap/module content and progress rules.
- MIS-275 defines AI study buddy safety, provider, cost, and escalation rules.
- MIS-278 defines payment/receipt visibility.
- MIS-279 defines data collection, consent, retention, export/delete, and minor
  policies.

## Abort Conditions

Stop before UI implementation if:

- The portal shell requires storing sensitive student data before MIS-279.
- A screen requires direct browser calls to AIT CRM.
- A feature exposes payment, attendance, AI, or lesson-progress data before its
  owning contract is approved.
- Student/guardian/teacher/admin roles are not separated.
- The portal starts duplicating CRM operations instead of showing student-facing
  summaries.

## Acceptance Mapping

MIS-276 acceptance coverage:

- Mobile-first dashboard IA: defined in shell structure, navigation, student IA,
  and route map.
- Attendance, enrolled courses, lesson recaps, video modules, placement,
  payments/receipts, AI entry, profile/settings, and support/contact: included
  with gates and visibility rules.
- Empty/loading/error states: defined in the state model and copy intent.
- What students can/cannot edit: defined in account, attendance, course, and
  profile sections.

This spec is ready for review as a docs-only MIS-276 slice.
