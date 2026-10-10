# Homepage copy annotations — October 10, 2026

- Issue: explicit Alvaro request in browser comments 1–13.
- Brief/reference: production homepage annotation selectors and supplied screenshots.
- Synced production baseline: `5ac02218bfd1a8c765c33fc13f5cfa9daf6a7ba6` (main).
- Synced staging baseline: `3f66671b7cc7c9087ba9eef9ae71dd0b47e77740`.
- Implementation commit: `4e09483c752bd789029f6e45bc228402bb62472b`.
- Validation: `npm run validate` passed repository policy, assets, 403 Node tests, and the Next.js production build.
- Release surfaces: `VERIFY_BASE_URL=http://127.0.0.1:3010 npm run verify:release-surfaces` passed; 49 deterministic screenshots, no reported runtime errors or horizontal overflow.
- Visual evidence: `../artifacts/copy-annotations-20261010/{homepage,method,portal-entry}-{desktop,mobile}.png`; accompanying manifest records all checked surfaces and viewports.
- Browser inspection: Codex in-app browser confirmed revised copy and four program tiles. Desktop/mobile captured evidence reviewed. Long headlines intentionally wrap; short viewports scroll without clipping.
- Deployment URL: https://staging.aitusainstitute.com/ — pending automatic Git deployment at packet creation; exact deployed SHA and rendered live QA to be verified after push.
- Sentry status: unavailable for this copy-only pass; no Sentry data or instrumentation changed. Browser runtime checks passed.
- Approval state: Alvaro authorized staging implementation in this request; production promotion is not authorized.
- Safety: no production push, manual Vercel deployment, dependency installation, form submission, provider send, auth change, or database write.

## Annotation mapping

1. Ribbon: 30% discount for new students plus 10% additional for couples/groups; existing Spain/online label preserved.
2. Eyebrow: different English school for people with purpose.
3. Headline: learn differently without translating or memorizing in only 10 months.
4. Alternate link: another goal different from English.
5. GED tile: obtain high school diploma; description stays exam preparation.
6. Added math tutoring tile linking to the existing math course.
7–8. Computing and Spanish class titles.
9. Unique, patented methodology tested for more than 20 years.
10–11. Comprehension without translation and speaking without memorizing thousands of words.
12. Testimonials heading shortened to Testimonios.
13. International reach moved first in the institutional proof data order.

The requested discount and 10-month wording are owner-supplied marketing copy. This change does not configure discounts or modify tuition, payment, enrollment, or course duration data.
