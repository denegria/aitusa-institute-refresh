# Builder Implementation Brief - AIT USA Product Refresh

Date: 2026-06-28
Requested by: Giuseppe
Owner: Senior Builder / Builder

## Objective

Implement the AIT USA product-led refresh in the static site repo without changing platforms.

The homepage should move from informational browsing to enrollment decision flow:

1. Pain hook.
2. Solution/three differentiators.
3. Offerings.
4. Locations.
5. Proof/testimonials.
6. Final CTA.

## Repo Context

- Static site, no package install needed.
- Data: `src/content.js`
- Render: `src/main.js`
- CSS: `src/styles.css`
- Build: `npm run build`
- Asset check: `npm run check:assets`
- Browser verification: `npm run verify:browser`
- Output: `dist/`

## Implementation Principles

- Keep the static architecture.
- Prefer structured data changes over hard-coded strings spread through render functions.
- Do not add dependencies unless strongly justified.
- Keep real AIT USA videos/images visible.
- Reduce homepage directory sprawl; detailed course depth belongs on `/courses`.
- Payment remains spec-only until approved.
- Current repo is plain static JS, not React. Do not introduce a framework during the first implementation unless Giuseppe explicitly chooses a migration.
- Make the content model language-picker ready even if the first release is Spanish-first.

## Slice A - Content Model

Files:

- `src/content.js`

Tasks:

- Add/reshape data groups:
  - `painPoints`
  - `solutionCharacteristics`
  - `productOfferings`
  - `courseCatalog`
  - `locations`
  - `testimonialProof`
  - `conversionCtas`
- Preserve existing `programs`, `testimonials`, `storeProducts`, and media references unless intentionally replaced.
- Add North Plainfield only as pending/non-final until the real address and final status are approved. Block publication as a normal location until then.
- Keep user-facing strings centralized enough to support Spanish/English language picker later.

Acceptance:

- Homepage can render offerings without using every full course detail.
- `/courses` can render detailed course information.
- No factual claims are added without source support.

## Slice B - Homepage Funnel

Files:

- `src/main.js`
- `src/styles.css`
- `src/content.js`

Tasks:

- Reorder homepage:
  - hero pain/problem.
  - solution differentiators.
  - offerings/product paths.
  - locations.
  - testimonials/proof.
  - final CTA.
- Add visible links to:
  - `/courses`
- `/placement-test`
- WhatsApp/advisor.
- `$95 registration + book` action.
- AIT CRM lead submit path when backend endpoint is approved.
- Keep video/testimonial rendering robust.

Acceptance:

- First screen has a clear pain hook and action.
- In-person English is visually primary.
- Hybrid/digital are clear but not over-promised.
- Final CTA has two clear paths: sign up/book and contact.

## Slice C - `/courses`

Files:

- `scripts/build-static.mjs`
- `src/main.js` or a new route renderer if cleaner.
- `src/content.js`
- `src/styles.css`

Tasks:

- Create built route `dist/courses/index.html`.
- Add source route if this repo supports direct static route serving.
- Render detailed course catalog.
- Link back to homepage and placement test.

Acceptance:

- `/courses` works in local dev and built output.
- Course cards/detail sections are readable on mobile.
- Future course additions are data-driven.

## Slice D - `/placement-test`

Files:

- `scripts/build-static.mjs`
- `src/main.js` or new route renderer.
- `src/content.js`
- `src/styles.css`

Tasks:

- Create built route `dist/placement-test/index.html`.
- Build MVP placement flow:
  - student info.
  - self-assessment.
  - multiple-choice questions.
  - goal selection.
  - recommended level.
  - WhatsApp handoff.
- Frame result as recommended starting point pending advisor confirmation.

Acceptance:

- Works with keyboard and mobile.
- Does not persist sensitive info.
- WhatsApp handoff is prefilled with name, goal, and result.
- Scoring is easy to review and adjust.

## Out Of Scope

- Real payment processing.
- Student login.
- WhatsApp CRM inbox handling.
- New provider integration.
- New testimonials or invented proof.

## Validation

Run:

```bash
npm run build
npm run check:assets
npm run verify:browser
git diff --check
```

Report:

- Files changed.
- Routes added.
- Validation results.
- Known risks or decisions still waiting on Alvaro.

## Handoff Notes

- Do not deploy manually.
- If there is unrelated dirty work, do not revert it.
- Keep commits under canonical project identity if committing is requested later.
- Use medium reasoning for straightforward static implementation. Escalate only for stack migration, CRM integration, auth, or payment architecture.
