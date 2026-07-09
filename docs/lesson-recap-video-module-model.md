# Lesson recap and video module model

Linear issue: MIS-274

This slice adds a fixture-backed student learning content model for the portal.
It prepares the data shape and API boundary without introducing video hosting,
durable progress storage, admin publishing UI, or live CRM writes.

## Content types

- `lesson_recap`
- `video_module`
- `handout_link`
- `homework`

## Associations

Learning modules attach to:

- course reference;
- section reference;
- session reference;
- published/draft status;
- ordered content items.

The model currently uses MIS-272 enrollment fixtures to determine whether a
student can view a published module. Draft modules are excluded from student
responses.

## Access and progress

The read-only route `/api/portal/learning` uses the MIS-271 privacy/access
boundary. Lesson progress remains sensitive student data, so the default
student fixture stays blocked until the privacy gate is satisfied.

Progress previews use:

- MIS-279 `lesson_progress_summary` privacy category;
- MIS-277 `lesson_viewed` and `lesson_completed` CRM event types;
- local contract responses only.

No durable progress record is stored in this slice.
