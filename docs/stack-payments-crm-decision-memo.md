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
2. Move to a React-based app, preferably Next.js, for the next app-grade version
   if we are adding durable placement test flows, CRM submits, language
   switching, accounts, portal routes, and payments.

Director update, 2026-07-08: the preferred direction is now an integrated
React/Next path for the AIT USA refresh plus portal. Do not ship the portal as a
separate long-term site. The current `/portal/` static route is a fixture-backed
prototype in the same repo and should be treated as a bridge toward an
integrated app migration, not as the final portal runtime.

### Why React/Next Is The Preferred Direction

Next is the stronger default if we need:

- integrated public site and portal routes;
- WorkOS/AuthKit or comparable hosted auth integration;
- server-side route handlers for CRM adapters and consent gates;
- shared components or conventions with AIT CRM;
- React ecosystem integrations;
- a team workflow already comfortable with React/Next;
- Vercel-native previews and deployment behavior.

React is not automatically more compatible with older desktop or mobile
devices. Compatibility comes from HTML, CSS, accessibility, image discipline,
server-rendered/static output, restrained client-side JavaScript, and careful
hydration. The reason to prefer React/Next here is ecosystem and operating
model fit, not that devices are inherently more React-friendly.

### Why SvelteKit Remains A Fallback

SvelteKit remains viable if the team later prioritizes smaller client bundles
and a lighter authoring model over React/Next ecosystem alignment. It should be
kept as a fallback, not the default, unless React/Next migration cost becomes
larger than expected.

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

Static routes can still be useful for prototypes and fixture-backed review, but
they should not define the final portal architecture.

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
- React/Next phase: route or cookie-based locale with `/es` and `/en` paths if
  SEO matters.

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

1. Use current static routes only as temporary review/prototype scaffolding.
2. Make React/Next the preferred app-grade migration direction for the
   integrated public site plus portal.
3. Make the content model language-picker ready.
4. Post site leads to AIT CRM.
5. Build placement test as automated recommendation + CRM lead capture.
6. Use Stripe as default recommendation for account-linked online payments, with Clover investigated because of current in-person usage.
7. Treat WhatsApp CRM ownership as a follow-up integration slice.
8. Mention AI tutor/study assistant only as coming soon.

## Source Links

- Next.js on Vercel: `https://vercel.com/docs/frameworks/full-stack/nextjs`
- Vercel SvelteKit guide, fallback only: `https://vercel.com/docs/frameworks/full-stack/sveltekit`
- Stripe hosted invoice page: `https://docs.stripe.com/invoicing/hosted-invoice-page`
- Stripe customer portal: `https://docs.stripe.com/customer-management`
- Clover Hosted Checkout: `https://docs.clover.com/dev/docs/hosted-checkout-api`
- Clover hosted checkout sessions: `https://docs.clover.com/dev/docs/creating-a-hosted-checkout-session`
- WhatsApp Cloud API get started: `https://developers.facebook.com/documentation/business-messaging/whatsapp/get-started`
- WhatsApp webhooks overview: `https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/overview/`
