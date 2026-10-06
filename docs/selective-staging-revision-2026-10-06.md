# Selective AIT staging revision

## Scope and authority

Alvaro approved the staging revision on October 6: restore the current production homepage completely, return the optional four-week tuition choice to step one, retain improved individual-course sizing and other functional changes, and remove daylight-saving copy and unconfirmed class schedules. Staging publication is authorized; production promotion is excluded.

Baseline staging: `6567827c54a4fdab2961184af7ba8dc9228d5ac6`.
Homepage reference: production `5ac02218bfd1a8c765c33fc13f5cfa9daf6a7ba6`.
Candidate: isolated `codex/ait-selective-review` checkout, authored as Denegria.

## Changes

- Restore production homepage section order, hero/ribbon art, Method/books, testimonials and gallery, homepage header styling, and matching homepage checks. Keep the accepted smaller header for course and registration pages, callback contact accessibility hints, and other non-home improvements.
- Retain staging course layout and `src/course-detail.css`; replace numeric timetables with direct admissions phone and information-request links. Office inquiries are explicitly labeled as office inquiries and distinguished from class hours.
- Remove unconfirmed numeric class schedules from all eight programs' editorial and legacy detail data, the legacy homepage schedule inventory, and GED weekly-hour claims. Remove the daylight-saving paragraph. Leave learning content and accepted program duration wording otherwise in place.
- Move the direct optional tuition checkbox to purchase step one; default is unchecked. Step two collects information. Automatically obtain validated base/optional quotes, preserve explicit selections, reset them when course/modality/country changes, reject inconsistent optional prices, and retain base enrollment if optional pricing is unavailable. CRM, checkout, portal and provider contracts are unchanged.

## Provenance and office hours

The permitted repository history traces the current Bound Brook office hours and in-person schedule to August 11 commit `750a5d5a978f72db357e663b3cefda845f73121a`. Older `content/site-content.md` records different public English blocks and cautions against presenting older Sunday/8:30 availability without client confirmation. Implementation history and tests establish where the claims entered the code; they do not establish independent current owner confirmation. No such confirmation was found in permitted local memory summaries or source documentation. Therefore this revision uses office-contact guidance without numeric office hours. It does not label the prior claims fabricated.

## Ownership and preservation

The source main checkout and the `aitusa-site-cohesion` worktree were clean at inspection. Four older worktrees contained unrelated dirty artifacts or assets and were left untouched: `1d4a`, `aitusa-hero-design-reset`, `aitusa-approved-hero`, and `aitusa-prueba-real`. No permitted task summary identified Giuseppe as a current AIT writer; his ownership could not be confirmed. Implementation took place in an isolated clone without editing existing worktrees or their branches. GitHub staging and main heads matched the two baselines before publishing.

## Validation and evidence

- `npm run validate`: repository policy, assets, 403 Node tests, and production build passed.
- `npm run verify:release-surfaces` against the local production server: 49 screenshots, including desktop/mobile homepage, Method, portal entry, course/catalog and access surfaces; no unexplained horizontal overflow or runtime exceptions.
- `node scripts/verify-selective-review.mjs`: 60 screenshots at 1440, 390 and 320 pixels, all eight course pages and schedule inquiries, and mocked step-one/step-two purchase flows. Tests cover unchecked defaults, direct checkbox visibility, explicit opt-in, back navigation, base-only selection, optional-price failure, no step-two purchase control, and no remaining numeric course timetables or daylight-saving copy.
- Screenshots were inspected for homepage desktop/mobile, course desktop/mobile, and enrollment mobile. The final screenshots and manifests are in the task's `qa-release` and `qa-selective` directories, outside the repository.
- Restoring production intentionally restores its homepage scroll depth at short desktop heights. The visual verifier records that depth instead of requiring the rejected redesigned first-viewport fit. Horizontal overflow and control usability remain gates, and visible scrollbars are retained.
- No real contact/registration submission, account creation, payment, data migration, production write or production promotion was performed. Registration browser QA mocks pricing and blocks real submissions. Sentry configuration is unchanged; private telemetry was not queried.

## Delivery

Publish only by the authorized Git push to `staging`, which triggers Vercel. Verify that the resulting deployment is READY and points to this candidate commit, then inspect the preview. Production remains at the baseline main commit. Do not run an additional manual Vercel deployment.
