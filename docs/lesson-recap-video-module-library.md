# AIT USA Lesson Recap And Video Module Library

Date: 2026-07-08
Linear: MIS-274
Status: Docs/spec only

## Purpose

Define the student-portal learning content model for lesson recaps, video
modules, handouts/links, homework, optional quizzes/checkpoints, publishing
workflow, access rules, progress logging, and CRM event logging.

This document does not approve implementation. It provides a contract for the
future portal learning library so teachers/admins can publish useful class
follow-up without turning the public static site into a student-data platform.

## Scope

In scope:

- Learning content types.
- Course, section, session, and enrollment associations.
- Student/guardian/teacher/admin access rules.
- Publishing lifecycle.
- Progress/view logging.
- CRM event contract expectations.
- AI study buddy handoff boundaries.
- Open decisions and abort conditions.

Out of scope until explicitly approved:

- Building a CMS or admin UI.
- Storing student progress.
- Uploading or hosting private videos.
- AI tutor implementation.
- Raw transcript/audio handling.
- Live CRM writes.
- Framework or backend migration.

## Content Principles

- Support class continuity: students should know what happened, what to review,
  and what to do next.
- Keep teacher publishing lightweight.
- Tie content to enrollment and session context.
- Do not expose materials to students who are not enrolled unless deliberately
  published as public marketing content.
- Keep content progress summaries safe and minimal until MIS-279 approves
  retention/access details.
- Make content usable on mobile.

## Core Content Types

### Lesson Recap

Short class summary after a live or online session.

Suggested fields:

- `recapId`
- `title`
- `summary`
- `courseId`
- `sectionId`
- `sessionId`
- `publishedBy`
- `publishedAt`
- `language`
- `visibility`: `draft`, `assigned`, `archived`
- `studentTasks`
- `teacherNotesPrivate`

Student-visible content:

- What we practiced.
- Key vocabulary/grammar.
- Homework or next step.
- Linked video/module/handout.
- Support/contact prompt when stuck.

Teacher/admin-only content:

- Internal notes.
- Student concerns.
- Publishing history.
- Drafts.

### Video Module

Structured video lesson or practice module.

Suggested fields:

- `moduleId`
- `title`
- `description`
- `videoAssetId` or approved external video reference
- `durationSeconds`
- `courseId`
- `level`
- `topics`
- `visibility`
- `requiresEnrollment`
- `publishedBy`
- `publishedAt`

Student-visible content:

- Video title.
- Duration.
- Topic/level.
- Watch/start/resume state.
- Completion state when approved.
- Related recap or homework.

### Handout Or Link

PDF, document, worksheet, book page reference, vocabulary list, or external
resource.

Suggested fields:

- `resourceId`
- `type`: `pdf`, `link`, `worksheet`, `book_page`, `vocabulary`, `other`
- `title`
- `url` or asset reference
- `courseId`
- `sectionId`
- `sessionId`
- `visibility`
- `downloadAllowed`

### Homework

Teacher-assigned practice item.

Suggested fields:

- `homeworkId`
- `title`
- `instructions`
- `courseId`
- `sectionId`
- `sessionId`
- `dueAt`
- `submissionMode`: `none`, `external`, `portal_text`, `upload`, `in_class`
- `visibility`

POC default:

- Use checklist/no-submission homework until privacy/storage policy approves
  student submissions.

### Quiz Or Checkpoint

Optional future learning check.

Suggested fields:

- `checkpointId`
- `title`
- `questions`
- `scoringMode`
- `courseId`
- `sectionId`
- `moduleId`
- `resultVisibility`

Keep quizzes/checkpoints out of first implementation unless academic review and
data retention are approved.

## Associations

Content can be associated at several levels:

- Course: visible to all approved enrollments in a course.
- Section: visible to one class/cohort.
- Session: tied to one class occurrence.
- Enrollment: assigned to one student for individualized support.
- Module sequence: ordered path across lessons.

Default access should be section/session based for live class recaps and
course/module based for reusable video lessons.

## Access Rules

Student access:

- Must have verified portal account from MIS-271.
- Must have active or recently active enrollment for assigned content.
- Sees only student-visible fields.
- Can view progress only for own account.

Guardian access:

- Depends on guardian link and MIS-279 consent rules.
- May view linked student's assigned content and progress summary if allowed.
- Should not see teacher private notes.

Teacher access:

- Can view assigned course/section content.
- Can draft/publish recaps for assigned sections when workflow is approved.
- Can see limited progress summaries needed for instruction.

Admin access:

- Can manage content visibility and archive inappropriate/stale items.
- Can assist with publishing/support.
- Should use CRM/admin tooling for durable operations where applicable.

## Publishing Workflow

Recommended lifecycle:

1. Draft
2. Review optional
3. Scheduled or published
4. Student-visible
5. Archived

Draft requirements:

- Course/section/session association.
- Student-visible title/summary.
- Visibility target.
- Publisher actor.

Publish requirements:

- Confirm content has no raw private student data.
- Confirm videos/resources are approved for portal access.
- Confirm access rules.
- Confirm language.
- Emit `lesson.content.published` after MIS-277.

Archive requirements:

- Preserve audit trail.
- Remove from normal student dashboard.
- Keep historical progress if retention policy allows it.

## Progress And View Logging

Progress should be event-based and minimal at first.

Recommended event types from MIS-277:

- `lesson.recap.viewed`
- `lesson.module.started`
- `lesson.module.completed`
- `lesson.homework.submitted`
- `lesson.content.published`

Recommended progress states:

- `not_started`
- `viewed`
- `in_progress`
- `completed`
- `skipped`
- `needs_help`

Minimum metadata:

- `portalAccountId`
- `crmContactId`
- `crmEnrollmentId`
- `courseId`
- `sectionId`
- `sessionId` when relevant
- `recapId` or `moduleId`
- `progressState`
- `occurredAt`

Do not store detailed viewing analytics, raw quiz answers, free-text homework,
or AI-generated feedback until MIS-279 approves retention and access policy.

## Student Portal Display

Use MIS-276 `Estudiar` area.

Recommended student sections:

- Latest recap.
- Assigned video modules.
- Handouts/resources.
- Homework/checklist.
- "Need help?" support path.
- AI study buddy entry only after MIS-275 and MIS-279.

Empty states:

- No recap yet.
- No modules assigned.
- Course not active.
- Content unavailable due to enrollment/access state.

Error states:

- Content failed to load.
- Video unavailable.
- Resource access expired.
- Enrollment mismatch.

## Teacher/Admin Publishing Surface

Future teacher/admin tools should support:

- Create recap from assigned session.
- Attach video module.
- Attach handout/link.
- Assign homework checklist.
- Preview student view.
- Publish/archive.
- See who has viewed/completed content at summary level.

Do not require developer edits for routine lesson recaps once the portal is
implemented.

## CRM Event Effects

Default CRM effects:

- `lesson.content.published`: admin/teacher audit.
- `lesson.recap.viewed`: student timeline/progress summary.
- `lesson.module.started`: progress signal.
- `lesson.module.completed`: progress/reporting event.
- `lesson.homework.submitted`: teacher/admin task or progress event.

Avoid noisy CRM tasks for every view. Tasks should be reserved for:

- student requests help;
- homework needs review;
- teacher flags a concern;
- AI practice escalation after MIS-275.

## Video Hosting And Asset Rules

Open decisions:

- public vs private video hosting;
- signed URLs or provider-level access controls;
- whether existing Wix/video assets can be reused;
- download restrictions;
- captions/transcripts;
- language versions.

Default rules:

- Do not expose private class videos publicly.
- Do not include student PII in video metadata.
- Do not assume public marketing videos are suitable as enrolled-student modules.
- Prefer approved provider controls over obscurity.

## AI Study Buddy Handoff

Lesson modules can become the safe context for future AI practice.

Allowed planning shape:

- AI practice starts from one approved lesson/module.
- AI receives limited curriculum/context selected by backend.
- CRM receives safe summary events only.
- Raw audio/transcripts require MIS-279 approval.

Do not add wide-open chat or browser-direct LLM calls.

## Privacy And Retention

MIS-279 must define:

- content view/progress retention;
- guardian visibility;
- teacher access to progress;
- homework submission storage;
- video access logs;
- export/delete behavior;
- minor/student consent;
- whether transcripts/captions contain sensitive data.

Default posture:

- Store minimal progress states.
- Keep teacher private notes separate from student-facing recap content.
- Avoid free-text student submissions until policy is approved.

## Dependencies

- MIS-271: verified student/guardian/teacher/admin identity.
- MIS-276: portal `Estudiar` IA and states.
- MIS-277: CRM event/API contract.
- MIS-272: session/course attendance context for recaps.
- MIS-275: AI study buddy architecture.
- MIS-279: privacy, retention, minor/guardian, and audit requirements.

## Open Decisions

- Who can publish lesson recaps.
- Whether content requires review before publishing.
- Video hosting/provider and privacy controls.
- Whether homework submissions are in portal or external.
- Whether progress completion is manual, video watch-based, quiz-based, or
  teacher-confirmed.
- How long content remains visible after enrollment ends.
- Whether guardians can view all study content.
- Caption/transcript policy.
- Content language/versioning strategy.

## Abort Conditions

Stop before implementation if:

- Content access does not derive from verified enrollment.
- Teacher private notes could become student-visible.
- Student submissions or progress are stored before MIS-279 approval.
- Private videos would be exposed as public assets.
- CRM would receive noisy view events without reporting/task rules.
- AI practice is added before MIS-275 and MIS-279 boundaries.

## Acceptance Mapping

MIS-274 acceptance coverage:

- Content types: lesson recap, video module, handout/link, homework, and optional
  quiz/checkpoint are defined.
- Course/session associations: course, section, session, enrollment, and module
  sequence associations are defined.
- Access rules by enrollment: student/guardian/teacher/admin rules are defined.
- Progress/view logging: event types, states, and metadata are defined.
- Admin publishing workflow: draft/review/publish/archive and teacher/admin
  tooling are defined.
- CRM event logging: lesson event effects and gates are defined.

This spec is ready for review as a docs-only MIS-274 slice.
