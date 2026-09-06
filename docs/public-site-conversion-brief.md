# Public prospect journey implementation

Reference: the September 5, 2026 full public-site UX/CRO audit, captured from staging commit `f9508317562cdae985caf3b57d7e14d9c9beab7c`. User authorized implementation and publication to staging. Production promotion is not included.

## Target journey

Understand the offer → choose a study goal → compare courses → check practical details → ask admissions with the selected course retained → receive a truthful request status and optional WhatsApp handoff.

The English placement assessment is optional before requesting orientation. Its public introduction describes the email/account step needed to view the result. Assessment logic, identity, portal, CRM delivery and consent policy are unchanged.

## Implemented

- Put study formats and locations before the extended method/proof chapters. Keep the Spanish-first message, actual proof/media, Graphic Concept identity and responsive chapter composition.
- Add Sedes and Orientación to the shared public navigation; retain course filters and category/Back continuity.
- Use one published course taxonomy for the contact form and callback dialogs. Preserve all eight course identities in the existing lead message while mapping to the existing allowed CRM interests. Validate the course URL parameter against published slugs.
- Lead course pages with orientation and explicit WhatsApp actions. Provide section links, put schedules immediately after the opening chapter and group requirements with cost/material/start-date questions. Preserve published schedule blocks, estimates and limits.
- Make Office module durations visible with their module names; add beginner-versus-Office guidance in the catalog and an English overview on the Spanish course.
- Replace overlapping map targets with a named native location selector and decorative geographic markers. Keep list/card selection and directions linked to the selected location; show Bound Brook hours only in the overview or when Bound Brook is selected.
- Constrain testimonial videos to their media area, preserve attribution and accessible close/navigation controls, and remove mobile description clipping. Clearly distinguish an interview summary from a transcript.
- Simplify the citizenship page to current status, direct inquiry and official resources. Make legal contents collapsible without removing policy text, versions or consent disclosures.
- Make the contact page explain the value of the request, show direct channels, offer optional extra details and distinguish sending, receipt and uncertain/error states. Promotional SMS remains separate, optional and unchecked.

## Acceptance and verification

`npm run validate` must pass. `npm run verify:release-surfaces` checks desktop/mobile public routes plus the existing required portal/employee entry regressions. Browser evidence must also cover course-to-contact preselection, native map selection, testimonial sizing and Escape/focus return, legal contents, mobile navigation and the English overview. No live form, message, account or payment submission is needed for this UI release.

Use the same staging commit for deployment metadata and live browser evidence. A READY deployment or local test alone does not prove request delivery, enrollment completion or conversion lift.

## Measurement contract requiring an approved analytics destination

Measure course selection, detail views, orientation starts, successful request receipts, failed requests, optional placement starts and WhatsApp opens. Use course slug, catalog group, page family, viewport bucket and channel only. Do not send names, email, phone, message text, form payloads, arbitrary query strings, result data or account identifiers.

Define an orientation conversion as a successful server receipt. Treat a WhatsApp open as an outbound intent, not a sent message or completed lead. Deduplicate successful receipts in the chosen analytics adapter without exporting the form submission identifier. Evaluate mobile and desktop separately and compare equivalent acquisition sources. Establish baseline traffic and qualified-lead outcomes before claiming improvement or choosing an experiment size. No analytics provider, network transmission or new storage was added in this release.

## Needs confirmation

- Current prices, inclusions, next starts, capacity, response ownership and any response-time commitment.
- Computing delivery format, location, device/software prerequisites and basic-course duration.
- Hybrid attendance pattern, online country eligibility and active groups. Existing facts are retained; a universal eligibility or attendance promise is not inferred.
- Whether GED weekday/Saturday blocks are cumulative or alternatives, and what official registration/exam fees are included.
- Citizenship support availability and the scope of any eventual formal offer.
- Verified captions/transcripts for original method and testimonial media. The supplied summaries are not equivalent transcripts; full media accessibility remains outstanding.
- The intended English-speaking audience for the Spanish course and any broader translation plan.
- Analytics provider/consent configuration, baseline and lead-quality reporting. This release has no measured CRO lift.
