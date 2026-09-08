# MIS-407 — Public staging review polish

- Issue: https://linear.app/mission-control-v2/issue/MIS-407
- Brief/reference: September 8 production/staging comparison; Alvaro approved implementation and staging push (Telegram 21406).
- Base: `cf7a730747779a24c8ef8a7649eaf6be5a0346de` (`origin/staging`).
- Candidate commit: the commit containing this packet; final SHA and deployment receipt recorded on MIS-407.
- Approval state: Director accepted for staging after the checks below; production not authorized.

## Scope

Preserve the new course-discovery/contextual-admissions journey. Add a compact preview of Eric's already-published interview after the study goals, linking to his existing keyboard-focusable testimonial card. No fabricated quotes or new outcome claims. Reduce homepage chapter minimum-height whitespace; compact mobile goal cards; restore a prominent framed Graphic Concept title and contrasting question band. Clarify that the format comparison is for English. Align acquisition button shapes, tighten catalog/admissions copy, add a focusable form anchor, and label email-or-phone alternatives consistently. Form/service/consent logic, portal/auth, course facts and original media are unchanged.

Prices, next starts, location/format details and verified media captions/transcripts still need source confirmation; they were not invented as part of this styling pass.

## Validation

- `npm run validate`: repository/asset contracts, 357/357 tests, production Next.js build passed.
- `npm run verify:release-surfaces`: 38 desktop/mobile captures passed, including course-to-contact context, category keyboard/Back/scroll restoration, menu Escape/focus and portal/employee entry regression checks.
- Additional read-only capture of homepage, catalog, Office course and contextual contact at 320, 390, 768, 1024 and 1440px: no horizontal overflow or broken images in 20 route/viewports.
- New preview anchor focuses Eric's card; keyboard Enter opens Eric's existing dialog; Escape closes and returns focus. Form shortcut focuses the form below the sticky header and retains Office selection. Required/marketing consent remain unchecked. Passed at 390 and 1440px. No form, account, provider or CRM submission performed.
- First custom Enter probe omitted CDP carriage-return text and did not activate the native button. Correct native key delivery passed; no application change was needed.
- React review: proof remains server-rendered with existing content, stable image dimensions, no added client state/dependency; native fragment links preserve focus order. No new data boundary or sensitive logging.

## Visual evidence

Fresh local production-build evidence (not prior committed screenshots):
`artifacts/aitusa-review-20260908/polish-release-surfaces/`, `polish-shots/`, `polish-interactions/`, `polish-validate.log` in the main agent workspace.

Compared with pre-polish staging at the same desktop/mobile sizes:
- Homepage: 10,166 → 9,262px desktop; 13,133 → 12,552px mobile, despite adding a real student preview.
- Preview now appears at 1,730px desktop / 2,085px mobile. Full gallery remains later.
- Mobile contact: 2,517 → 2,461px, plus a direct form shortcut.
- Existing course facts are preserved; no claim of measured conversion lift or production performance is made.

## Deployment and observability

- Deployment URL: https://aitusa-institute-refresh-git-staging-alvaros-projects-efb8ae58.vercel.app/
- Exact final SHA, CI and READY receipt: recorded on MIS-407 after Git-triggered deployment.
- Current staging browser access redirects to Vercel login; no protection/auth configuration changed. Local screenshots are not full live QA. Retain candidate worktree while live browser QA is blocked.
- Sentry status: no separate Sentry scan or production monitoring certification; local browser runtime exception checks passed. No student/lead data captured.
