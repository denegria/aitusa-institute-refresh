# AIT USA Product Refresh Execution Handoff

Date: 2026-06-28
Owner: Giuseppe
Repo: `aitusa-institute-refresh`

## Decision

Use repo docs plus OpenClaw TaskFlow-style orchestration for this work. Do not use Linear as the primary tracker for this slice.

Why:

- This is a contained website refresh with tight copy, design, implementation, and QA handoffs.
- The source of truth should live beside the code because the work depends on the static site structure, captured assets, and page copy.
- TaskFlow is better for coordinating sequential child tasks, wait gates, and handoffs.
- Linear can be added later only if this becomes a broader client roadmap with stakeholder-facing status, approvals, or multi-repo dependencies.

## Operating Model

- Giuseppe owns product direction, acceptance criteria, task sequencing, and final merge/deploy recommendation.
- Walter owns copy voice and conversion language only.
- Senior Builder owns architecture-sensitive implementation and homepage/product-flow composition.
- Builder can own bounded mechanical slices after the content model and page patterns are clear.
- Sentry owns QA, browser verification, link checks, and conversion-path evidence.
- Titan is not needed unless payment, auth, student data storage, or gateway code enters scope.

## Source-Of-Truth Inputs

- Strategy: `docs/product-refresh-strategy.md`
- Content/data: `src/content.js`
- Rendering: `src/main.js`
- Styles: `src/styles.css`
- Captured source material: `content/site-content.md`, `content/raw/`, `content/wix-backend/`
- Existing media: `public/assets/wix/`

## Recommended TaskFlow Shape

Flow goal:

> Convert AIT USA refresh from informational static site to product-led enrollment funnel with handoff-ready copy, homepage rebuild, detailed courses page, placement-test MVP plan/build, and QA evidence.

State bag:

```json
{
  "project": "aitusa-institute-refresh",
  "phase": "prepared",
  "approvedDecisions": {
    "tracker": "repo-docs-plus-taskflow",
    "homepageFlow": ["pain", "solution", "offerings", "locations", "proof", "final-cta"],
    "payments": "spec-only-until-gateway-ledger-identity-approved",
    "language": "spanish-first-now-language-picker-later",
    "leads": "post-to-ait-crm",
    "placement": "automate-with-advisor-confirmation",
    "aiStudySupport": "coming-soon-only"
  },
  "openDecisions": [
    "north_plainfield_address_status",
    "placement_scoring_rules",
    "registration_cta_destination",
    "framework_migration",
    "payment_provider",
    "student_account_payment_model",
    "whatsapp_crm_operating_model"
  ],
  "children": {
    "walter_copy": "not_started",
    "content_model": "not_started",
    "homepage_build": "not_started",
    "courses_page": "not_started",
    "placement_test": "not_started",
    "payment_spec": "not_started",
    "sentry_qa": "not_started"
  }
}
```

Wait gates:

- Wait for Alvaro approval on copy direction before implementation hardens visible text.
- Wait for North Plainfield real address before publishing as a normal location.
- Wait for placement-test scoring approval before presenting results as authoritative.
- Wait for provider/sign-in/ledger decision before collecting payment.
- Wait for WhatsApp CRM operating-model decision before building business WhatsApp handling into AIT CRM.

## Slice 0 - Strategy Lock

Owner: Giuseppe
Status: prepared

Deliverables:

- Product strategy documented.
- Execution packet documented.
- Role handoffs prepared.
- Decision: Linear is not primary tracker for this slice.

Acceptance criteria:

- A future agent can understand goal, scope, sequencing, and open decisions without rereading the Telegram thread.
- Payment is explicitly held behind product/ops decisions.

Files:

- `docs/product-refresh-strategy.md`
- `docs/product-refresh-execution-handoff.md`
- `docs/handoffs/walter-copy-brief.md`
- `docs/handoffs/builder-implementation-brief.md`
- `docs/handoffs/sentry-qa-brief.md`
- `docs/stack-payments-crm-decision-memo.md`

## Slice 1 - Walter Copy Deck

Owner: Walter
Type: copy/messaging
Parallel-safe: yes, before implementation

Objective:

Produce conversion-ready Spanish-first copy for the new funnel without inventing proof, metrics, or unsupported capabilities.

Scope:

- Pain-hook headline set.
- Hero subcopy and CTA variants.
- Three differentiators:
  - Graphic Concept method.
  - Guided practice/live correction.
  - Personalized continuity and study support.
- Offering copy:
  - In-person English flagship.
  - Hybrid English.
  - Online/digital/international path.
  - Secondary offerings.
- Final CTA copy:
  - $95 registration + book.
  - Contact/advisor.
  - Placement test.
  - Detailed courses page.

Out of scope:

- IA changes.
- Payment policy.
- Placement scoring.
- New factual claims.

Acceptance criteria:

- Spanish-first copy is concise and clear for prospective students and parents.
- Copy includes CTA variants for testing.
- Every claim is traceable to existing strategy/source material or explicitly marked as future-facing/coming soon.

Handoff:

- See `docs/handoffs/walter-copy-brief.md`.

## Slice 2 - Content Model Refactor

Owner: Builder or Senior Builder
Type: implementation
Parallel-safe: after Walter draft, or before if placeholders are used

Objective:

Restructure content data so homepage product cards, detailed course catalog, placement content, locations, testimonials, and CTAs are distinct.

Scope:

- `src/content.js`
- Maybe small helpers in `src/main.js` if data access needs cleanup.
- Add North Plainfield only after real address/status is provided. If placeholder is needed before final launch, mark it clearly as pending and block publication until confirmed.
- Add future-facing AI tutor/study assistant language only as non-promissory "coming soon" support.
- Keep content language-picker ready even if the first release is Spanish-first.

Acceptance criteria:

- Homepage can render a product-led summary without pulling the entire detailed course directory into the main flow.
- Course detail data remains available for `/courses`.
- Existing assets and testimonials remain referenced correctly.
- No payment functionality is introduced.

Risks:

- Static data can become bloated. Keep the split simple and readable.
- Avoid breaking existing course-detail query behavior unless replacing it intentionally.

## Slice 3 - Homepage Product Funnel

Owner: Senior Builder
Type: implementation/design
Parallel-safe: after Slice 1 and Slice 2

Objective:

Rebuild the homepage around the approved product-led sequence:

1. Pain hook.
2. Solution/three differentiators.
3. Offerings.
4. Locations.
5. Proof/testimonials.
6. Final CTA.

Scope:

- `src/main.js`
- `src/styles.css`
- `src/content.js` as needed.

Acceptance criteria:

- First viewport sells the pain/problem and next action, not a generic school overview.
- In-person English is visibly the flagship offering.
- Hybrid and digital paths feel credible and future-facing.
- The detailed courses page link is visible but secondary to conversion.
- Final CTA clearly presents `$95` registration + book and contact/advisor option.
- The design uses real AIT USA assets/videos, not generic decoration.

Risks:

- The current page already has many sections. Remove/reorder with intent instead of adding more vertical length.
- Copy overflow on mobile is likely; QA must check.

## Slice 4 - Courses Page

Owner: Builder or Senior Builder
Type: implementation
Parallel-safe: after content model refactor

Objective:

Create `/courses` as the detailed catalog and future-course home.

Scope:

- Static route generation, likely `courses/index.html` via `scripts/build-static.mjs`.
- Reuse existing `programs` and course-detail data.
- Add navigation between homepage and `/courses`.
- Add filters or segmented sections by goal/modality/audience if low-risk.

Acceptance criteria:

- `/courses` loads directly and from built output.
- All existing course categories remain discoverable.
- English in-person/hybrid/online is the lead group.
- Future courses can be added without homepage redesign.

Risks:

- Current repo is a static single page. Multi-page support should be kept minimal and clear.

## Slice 5 - Placement Test MVP

Owner: Senior Builder for architecture, Builder for implementation if scoped
Type: implementation plus academic review
Parallel-safe: after homepage CTA path is defined

Objective:

Create `/placement-test` MVP that recommends a starting level and hands off to WhatsApp/advisor.

Scope:

- Student info step.
- English self-assessment.
- Multiple-choice questions.
- Goal selection.
- Basic client-side scoring.
- Result page with recommended level and CTA.
- WhatsApp message prefilled with result.

Out of scope:

- Backend storage until the AIT CRM endpoint/source contract is selected.
- CRM writes until the endpoint/source contract is selected.
- Payment.
- Authoritative placement language without academic approval.

Acceptance criteria:

- User can complete the flow on mobile.
- Result is understandable and framed as a recommendation pending advisor confirmation.
- No sensitive data is persisted in browser storage or files.
- WhatsApp handoff includes enough context for staff follow-up.

Risks:

- Test content/scoring affects academic credibility. Needs review before launch.
- Collecting student info without backend persistence may confuse users unless copy is clear.

## Slice 6 - Payment Decision Memo

Owner: Giuseppe, with Titan only if implementation/security enters scope
Type: product/ops spec
Parallel-safe: yes

Objective:

Decide the payment architecture before any payment page collects money.

Questions to answer:

- Which provider/gateway?
- Public payment link or student sign-in?
- How does the payer identify the student?
- Does payment map to invoice, balance, contact, or manual note?
- What are minimum amounts and partial-payment rules?
- Who receives receipt/confirmation?
- Where does reconciliation happen: Wix, AIT CRM, payment provider, or manual ops?

Recommendation:

- Do not implement real payment collection in this site slice.
- Use Stripe as the default recommendation for account-linked online invoices/payment history unless Clover proves materially better for the client's existing merchant workflow.
- Investigate Clover because the client uses it in person, but do not assume it is best for durable account-linked partial payments.
- Add only a placeholder/information route if needed.
- Real payment belongs after student identity + ledger + receipt flow are decided.

Acceptance criteria:

- Payment build is either explicitly deferred or implemented only after approved architecture.

## Slice 7 - Sentry QA + Launch Evidence

Owner: Sentry
Type: QA/verification
Parallel-safe: after implementation candidate is ready

Objective:

Verify the refresh behaves correctly on local/built output and produces evidence for launch readiness.

Scope:

- `npm run build`
- `npm run check:assets`
- `npm run verify:browser`
- Desktop/mobile screenshots.
- Conversion path checks:
  - Hero CTAs.
  - Courses link.
  - Placement test link.
  - WhatsApp messages.
  - $95 registration/book CTA.
  - Locations.
  - Testimonials/video rendering.
- SEO metadata and sitemap checks.

Acceptance criteria:

- No missing critical assets.
- No broken primary links.
- No mobile text overflow in major CTAs/cards.
- All new static routes work in built output.
- QA report lists pass/fail evidence and residual risks.

Handoff:

- See `docs/handoffs/sentry-qa-brief.md`.

## Questions For Alvaro

1. North Plainfield: what is the real address and open/status language?
2. Registration/book CTA: should `$95` click to WhatsApp/contact first, Stripe invoice/payment link, Clover checkout, or another temporary flow?
3. Placement test: who approves the questions and level mapping?
4. Framework: ship current static refresh first, or intentionally migrate to SvelteKit now?
5. Payments: confirm Stripe as preferred online default unless Clover wins discovery?
6. WhatsApp CRM: should this become a dedicated post-site integration slice?

## Go/No-Go Recommendation

Go now:

- Walter copy deck.
- Content model prep.
- Homepage funnel implementation.
- Courses page.
- Placement-test MVP with advisor-confirmation framing.
- AIT CRM lead posting design/build if backend endpoint is approved.
- Language-picker-ready content model.

Hold:

- Real payments.
- Payment collection until provider/account/ledger/receipt rules are approved.
- Strong AI tutor promises.
- Treating North Plainfield as a normal open location before details are confirmed.
- Full WhatsApp CRM inbox until operating model/provider boundary is selected.
