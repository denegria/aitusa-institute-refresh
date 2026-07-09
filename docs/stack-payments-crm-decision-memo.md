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

### 2026-07-09 Update

Alvaro clarified that the client currently accepts:

- Clover in person;
- Zelle;
- cash.

Recommended next step: ask the client simple operating questions before choosing
online payment implementation. Clover may be the best default if its online
checkout, invoice/payment-link behavior, fees, and reporting are good enough,
because the client already uses it in person. Stripe remains the clean fallback
for account-linked online invoices and webhooks if Clover cannot support the
needed workflow cleanly.

No live payment collection should be added until these questions are answered.

## AIT Refresh Site: Client Questions

Use this section in the next client conversation. Keep the wording simple.

### Current Payments

1. How do students usually pay today?
   - Clover/card in person?
   - Zelle?
   - Cash?
   - Any checks or other methods?
2. Which payment method do students use most often?
3. Who receives and records each payment today?
4. When a student pays by Zelle or cash, where is that written down?
5. Do you give a receipt today? If yes, is it printed, emailed, texted, or handwritten?

### Online Payment Goal

1. What should the website help students pay first?
   - Registration plus book fee?
   - Tuition?
   - A payment plan/installment?
   - A custom amount approved by the office?
2. Should a student be allowed to pay online before speaking with the office?
3. Or should the office first confirm the student, class, price, and schedule, then send a payment link?
4. Should the website show a public "pay now" button, or should payment links be sent only after staff review?

### Clover And Other Processors

1. Does the current Clover account support online payment links or online checkout?
2. Can Clover send a payment link by text or email?
3. Can Clover show what student or class a payment belongs to?
4. Can Clover handle a custom amount, like a partial tuition payment?
5. Can Clover notify our system automatically when a payment succeeds, fails, or is refunded?
6. What are the current Clover online fees?
7. Can the client share a recent Clover processing statement or online pricing page so we can compare it against Stripe, Square, or another processor?

### Student Payment History

Plain-English definition for the client:

"Payment history" means a simple list for each student showing what they were
charged, what they paid, how they paid, what is still owed, and any refunds.
It is like a small account statement for each student.

Questions:

1. Should each student have a payment history in the CRM?
2. Should that history include card payments, Zelle, and cash together in one place?
3. Should staff be able to see the remaining balance for each student?
4. Should staff be able to add a cash or Zelle payment manually?
5. Should parents, spouses, or employers be allowed to pay for a student?

### Payment Requests

Plain-English definition for the client:

"Payment request" means the office creates an amount for a specific student and
sends that student a link to pay.

Questions:

1. Who should create payment requests?
   - Admin?
   - Advisor?
   - Teacher?
2. Should a request always be tied to a student name?
3. Should a request always say what it is for, like registration, book, monthly tuition, or missed balance?
4. Should students be able to pay less than the requested amount?
5. Should payment requests expire after a certain number of days?

### Receipts

1. What should the receipt show?
   - Student name?
   - Course or class?
   - Location?
   - Amount paid?
   - Payment method?
   - Remaining balance?
2. Should the receipt be in Spanish, English, or both?
3. Should the receipt come from Clover/Stripe, from AIT CRM, or both?
4. Should staff receive a copy when a student pays?

### Payment Plans And Balances

1. Do students commonly pay tuition in installments?
2. Are installments fixed amounts or flexible amounts?
3. Are due dates the same for everyone, or different per student?
4. Do late fees exist?
5. Should the CRM show a warning when a student has a balance due?
6. Should a student be blocked from some portal features if they have not paid?

### Refunds, Failed Payments, And Mistakes

1. Who is allowed to approve a refund?
2. Should refunds be handled only inside Clover/Stripe, or should staff also start them from the CRM later?
3. If a payment fails, who should be notified?
4. If a staff member records a cash/Zelle payment by mistake, who can correct it?
5. Should deleted/corrected payments stay visible in history for safety?

### Recommended Starting Assumption For Client Review

Start with staff-created payment requests:

1. Staff confirms the student, class, price, and due amount.
2. Staff sends a payment link.
3. Student pays through a hosted checkout page.
4. The CRM records that payment under the student.
5. Cash and Zelle are recorded manually in the same student payment history.

This avoids anonymous payments and keeps every payment connected to a real
student, class, and balance.

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
