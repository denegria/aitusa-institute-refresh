# Stack, Payments, CRM, and WhatsApp Decision Memo

Date: 2026-06-28
Owner: Giuseppe

## Current State

The temporary AIT USA refresh is not React. It is a plain static site:

- `index.html`
- `src/content.js`
- `src/main.js`
- `src/styles.css`
- `scripts/build-static.mjs`

No framework is currently installed. That means we can either keep the near-term refresh static or use this moment to move into a real app framework.

## Stack Decision

### Recommendation

Use a two-phase approach:

1. Ship the current product-led refresh on the existing static architecture if the goal is speed.
2. Move to SvelteKit for the next app-grade version if we are adding durable placement test flows, CRM submits, language switching, accounts, and payments.

Do not migrate to Next/React by default just because AIT CRM uses Next. This public website has different needs.

### Why SvelteKit Is A Strong Candidate

SvelteKit is a good fit if the website becomes:

- content-heavy;
- multi-page;
- form-heavy;
- lightweight on lower-end phones;
- hosted on Vercel;
- integrated with server endpoints for placement tests and CRM lead creation.

Official docs support Vercel deployment through the SvelteKit Vercel adapter.

Svelte's value here is not magical "device compatibility." Compatibility comes from HTML, CSS, accessibility, image discipline, and restrained JS. But SvelteKit can help ship less client-side JS than a React-heavy app and keep the authoring model clean.

### Why Next/React Is Still Viable

Next is the stronger default if we need:

- shared components or conventions with AIT CRM;
- deeper account/auth integration soon;
- React ecosystem integrations;
- a team workflow already standardized on Next.

The tradeoff is complexity and bundle weight for a site whose first job is marketing, placement, and lead capture.

### Keep Static If We Need Speed

For the immediate refresh, the existing static repo can still ship:

- homepage funnel;
- `/courses`;
- `/placement-test` client-side MVP;
- WhatsApp handoff;
- static SEO.

Static becomes weaker when we need:

- CRM writes;
- language picker at scale;
- account sessions;
- payment/customer portal integration;
- server-side validation.

## Language Picker

Decision:

- Near term: Spanish-first with selective English support.
- Future: add language picker with at least Spanish and English.

Recommendation:

- Do not make a full bilingual system part of the first homepage rebuild.
- Make the content model i18n-ready now:
  - stable content keys;
  - no hard-coded user-facing strings in render code;
  - language switch space in header/footer;
  - Spanish as default.

Future implementation:

- Static phase: data object with `es` and `en` fields where needed.
- SvelteKit phase: route or cookie-based locale with `/es` and `/en` paths if SEO matters.

## Payments Decision

### Recommendation

Payment should become account-associated over time.

Reason:

- It creates student history.
- It supports receipts and balances.
- It increases brand longevity and LTV.
- It avoids staff reconciling anonymous partial payments manually.

### Near-Term Payment Path

For the first launch:

- Do not collect money directly on the site unless the payment/account model is approved.
- Use `$95 registration + book` as a CTA that routes to advisor/contact or a verified hosted payment link.
- Treat weekly/monthly partial payments as a separate payment architecture slice.

### Stripe

Best default for online/account-linked payments.

Why:

- Stripe supports hosted invoices and invoice payment pages.
- Stripe customer portal can let students view/pay invoices and manage billing details.
- Stripe API/webhooks are strong for CRM reconciliation.
- Stripe is easier to connect to AIT CRM student/contact records over time.

Likely path:

1. CRM creates or matches student/contact.
2. Staff or automation creates Stripe customer.
3. CRM creates invoice/payment request or stores Stripe invoice/payment link.
4. Student pays hosted invoice.
5. Stripe webhook updates CRM financial timeline.

### Clover

Worth investigating because the client already uses Clover in person.

Strengths:

- Existing merchant relationship.
- Hosted Checkout can redirect students to Clover-hosted payment.
- Useful if the client wants one payment processor across in-person and online.

Concerns:

- Clover Hosted Checkout sessions are short-lived.
- Dynamic amounts require creating a Hosted Checkout session through the API, not a simple reusable button.
- It may be less clean than Stripe for account-linked invoices, partial balances, and CRM financial history.

Recommended posture:

- Research Clover as a processor option.
- Do not choose Clover for the student account/ledger architecture unless it can support durable invoice/payment-link workflows cleanly.

## CRM Lead Handling

Decision:

- Site leads should post into AIT CRM.
- WhatsApp remains valuable, but should not be the only system of record.

Near-term lead flow:

1. Website form or placement test submits to AIT CRM.
2. CRM creates lead/contact with source:
   - `aitusa-website`
   - `aitusa-placement-test`
   - `aitusa-registration-book`
3. CRM stores:
   - contact info;
   - selected goal;
   - course interest;
   - location;
   - placement recommendation;
   - original landing page/CTA.
4. User still gets WhatsApp CTA/handoff for fast response.

## WhatsApp CRM Handling

Decision:

- Business WhatsApp should eventually be handled through AIT CRM.

Recommendation:

- Build CRM-owned WhatsApp handling after the site refresh.
- Do not embed a casual WhatsApp widget as the long-term answer.
- Use the WhatsApp Business Platform or a provider gateway only after choosing the operating model.

Important distinction:

- A click-to-WhatsApp button is easy and useful.
- CRM-owned WhatsApp inbox requires WhatsApp Business Platform onboarding, webhooks, message templates, user assignment, consent/window handling, and operational rules.

Potential CRM flow:

1. Incoming WhatsApp webhook creates/updates conversation in AIT CRM.
2. CRM matches phone to contact/student.
3. Staff reply from CRM or via approved provider interface.
4. Conversation timeline is stored on the contact.
5. Lead/status tasks are generated from missed replies or intent.

## Placement Test Automation

Decision:

- Placement should be automated.
- Academic/scoring details can be finalized last with the client.

Near-term:

- Client-side MVP with recommendation language.
- Submit result to CRM when backend path is ready.
- CTA: "Confirmar mi nivel con un asesor."

Later:

- Server-side scoring and CRM record.
- Staff override/confirmation.
- Recommended class and schedule.

## AI Tutor / Study Assistant

Decision:

- "Coming soon" is allowed.

Guardrail:

- No promise that AI tutors are live now.
- Phrase as future study support, not current core value.

## Agent Budget And Reasoning Plan

Use high thinking where judgment matters. Do not waste max reasoning on mechanical implementation.

Recommended lanes:

- Giuseppe: high/xhigh for strategy, sequencing, acceptance, and decisions.
- Walter: medium or high. Copy benefits from taste, but not max reasoning.
- Senior Builder: medium for homepage/static implementation; high only if migrating stack or building CRM/payment/account architecture.
- Builder: low/medium for bounded static implementation.
- Sentry: medium for QA; high only if diagnosing a hard failure.
- Titan: high only if payment/auth/WhatsApp provider boundary enters implementation.

## Final Recommendation

For this slice:

1. Keep current static stack for immediate product refresh unless we deliberately decide to migrate now.
2. Make the content model language-picker ready.
3. Post site leads to AIT CRM.
4. Build placement test as automated recommendation + CRM lead capture.
5. Use Stripe as default recommendation for account-linked online payments, with Clover investigated because of current in-person usage.
6. Treat WhatsApp CRM ownership as a follow-up integration slice.
7. Mention AI tutor/study assistant only as coming soon.

## Source Links

- SvelteKit Vercel adapter: `https://svelte.dev/docs/kit/adapter-vercel`
- Vercel SvelteKit guide: `https://vercel.com/docs/frameworks/full-stack/sveltekit`
- Next.js on Vercel: `https://vercel.com/docs/frameworks/full-stack/nextjs`
- Stripe hosted invoice page: `https://docs.stripe.com/invoicing/hosted-invoice-page`
- Stripe customer portal: `https://docs.stripe.com/customer-management`
- Clover Hosted Checkout: `https://docs.clover.com/dev/docs/hosted-checkout-api`
- Clover hosted checkout sessions: `https://docs.clover.com/dev/docs/creating-a-hosted-checkout-session`
- WhatsApp Cloud API get started: `https://developers.facebook.com/documentation/business-messaging/whatsapp/get-started`
- WhatsApp webhooks overview: `https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/overview/`
