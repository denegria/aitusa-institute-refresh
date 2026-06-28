# AIT USA Product Refresh Strategy

Date: 2026-06-28

## Objective

Move the refresh site from an informational school brochure into a product-led enrollment funnel. The homepage should answer, in order:

1. What problem is the student struggling with?
2. Why is AIT USA the better way to solve it?
3. What can the student buy or start today?
4. Where can they study?
5. What proof makes the promise believable?
6. What is the next action?

The site should still feel like a real institute, but the conversion path should be much clearer: placement, course selection, registration/book purchase, and contact.

## Current Repo Context

- The site is a static HTML/CSS/JS rebuild, not a Next app.
- Main structured data lives in `src/content.js`.
- Homepage rendering and interactions live in `src/main.js`.
- Styles live in `src/styles.css`.
- Captured Wix products, course data, videos, testimonials, locations, and raw pages already exist under `content/` and `public/assets/wix/`.
- Existing known follow-ups already call out payment provider work, lead form backend work, and public placement-test link cleanup.

## Recommended Homepage Flow

### 1. Pain / Hook

Purpose: stop leading with "we offer classes" and lead with the student's problem.

Message angle:

- "You have tried classes, apps, videos, or memorization, but English still does not come out when you need it."
- "You need English for work, interviews, school, daily life, or your child, but you need a route that fits your real schedule."
- "AIT USA helps you stop translating word by word and start practicing with structure."

Recommended first-screen elements:

- Strong headline around the struggle.
- Short supporting copy.
- Real class or testimonial media, not a generic hero.
- Two primary actions:
  - "Start with placement test"
  - "Talk to an advisor"
- Secondary link:
  - "View course options"

### 2. Solution / Why AIT USA

Purpose: convert the brand differentiators into product trust.

Use three characteristics:

1. Graphic Concept method
   - Visual structure that helps students understand English without translating everything.
2. Guided practice with real teachers
   - Correction, repetition, conversation, and teacher-led structure.
3. Personalized continuity
   - Level path, schedules, follow-up, books, tutoring, and future AI-supported study tools.

Recommended treatment:

- Three high-impact cards or panels.
- Each characteristic should have proof: video, classroom image, or short quote.
- Avoid generic "quality teachers" language. Make it specific: visual method, live correction, guided weekly progress.

### 3. Offerings / Products

Purpose: show the actual ways to enroll or study.

Priority order:

1. In-person English classes
   - Most prominent. This is the flagship.
2. Hybrid English
   - For students who need flexibility but still value local support.
3. Digital / online programs
   - Future-facing, international student path, online classes, digital books, upcoming AI tutors and AI study assistants.

Supporting offerings can appear as secondary product cards:

- English for kids.
- GED.
- Basic computing / office computing.
- Spanish for foreigners.
- Technical courses.

Important: the homepage should not try to explain every course in full. It should sell the product categories and send detailed exploration to the courses page.

### 4. Locations

Purpose: show local presence and reduce uncertainty for in-person students.

Include all currently represented locations plus North Plainfield:

- Bound Brook.
- Plainfield.
- Piscataway.
- Flemington.
- New York / Online.
- North Plainfield.

North Plainfield should not be published as a normal location until the real address and final service posture are approved. Do not assume "by appointment."

### 5. Proof / Testimonials

Purpose: make the promise believable before asking for payment.

Use the existing video assets:

- International student testimonial.
- Eric interview.
- Jessica interview.
- Leila testimonial.
- Additional student interview/testimonial videos as they are organized.

Recommended treatment:

- Featured video first.
- Short result labels.
- Avoid over-copying the testimonial section. Let the videos carry trust.
- Add a small "real students, real classes, real results" proof strip.

### 6. Conversion / Final CTA

Purpose: make the next step obvious.

Primary offer:

- "Sign up now and get your book today"
- Price: $95
- This maps to registration + book.

Secondary offer:

- "Contact us for more information"
- WhatsApp / phone / advisor contact.

Course exploration link:

- Place a strong but secondary click-through before the final CTA and again near offerings:
  - "View detailed courses"
  - Route: `/courses`

## New Pages

### `/courses`

Goal: detailed course catalog and future course home.

Should include:

- English in-person, hybrid, and online as the primary group.
- Kids English.
- GED.
- Computing / office / repair / technical courses.
- Spanish for foreigners.
- Filters by goal, modality, audience, and schedule.
- Detailed course cards with duration, format, levels, schedules, and CTA.
- Future course slots so new products can be added without redesigning the homepage.

MVP route approach for this static repo:

- Generate `courses/index.html` from the same static renderer or add route-style static files in the build script.
- Reuse existing `programs` data, but separate homepage product cards from full course details.

### `/placement-test`

Goal: own the placement experience on the site instead of relying on a Google Form.

MVP should include:

- Student info step: name, phone, email, city/country, age group.
- English level questions: short multiple-choice sequence.
- Self-assessment: speaking, listening, reading, writing comfort.
- Goal selection: work, interview, school, daily life, child, travel, GED/support.
- Result page: suggested level and next step.
- CTA to WhatsApp/advisor with result prefilled.

Later version:

- Store placement-test submissions in AIT CRM.
- Create lead/contact with source `aitusa-website-placement-test`.
- Route result into recommended course and advisor follow-up.

### `/payments`

Recommendation: do not build real payment collection yet.

Reason: weekly/monthly partial payments require a clear ledger, student identity, receipt policy, and payment provider decision. A public "type any amount" payment page can create reconciliation problems if it is not tied to the student/account record.

Recommended payment discovery decisions:

- Provider/gateway: Stripe, Clover, Square, Zelle/manual, or another gateway. Stripe is the current default recommendation for account-linked online invoices unless Clover proves better because of the client's existing in-person usage.
- Public payment link vs authenticated student portal.
- Payment record owner: website-only, AIT CRM, or future student account.
- Receipt behavior: automatic receipt, manual receipt, or CRM-generated confirmation.
- Partial-payment rules: min amount, student lookup, invoice/account balance, notes, and payment frequency.

Safe interim page:

- A simple "Make a payment" information page with contact instructions and no card capture.
- Or hide the payment page until the provider and student ledger are approved.

My recommendation: hold real payments, but design the IA so `/payments` can be added cleanly after gateway decisions.

## Implementation Slices

### Slice 1: Strategy + IA Lock

Deliverables:

- This strategy document.
- Final sitemap decision.
- Homepage section order approved.
- North Plainfield address/status confirmed.

Risk: low.

### Slice 2: Content Model Refactor

Deliverables:

- Split content into clear data groups:
  - pain points.
  - solution characteristics.
  - product offerings.
  - course catalog.
  - locations.
  - testimonials.
  - CTAs.
- Add North Plainfield with status.
- Add digital/future-facing copy for AI tutors and AI study assistants as "coming soon" language.

Risk: low to medium, mostly copy/structure.

### Slice 3: Homepage Product Funnel

Deliverables:

- Rebuild homepage order:
  - pain hook.
  - solution.
  - offerings.
  - locations.
  - proof.
  - final CTA.
- Keep real visual assets and video proof.
- Add clear `/courses`, `/placement-test`, and registration/book CTA links.

Risk: medium because it changes the primary conversion surface.

### Slice 4: Courses Page

Deliverables:

- Static `/courses` page.
- Full course catalog with filters or segmented navigation.
- Course detail cards based on current captured data.
- Homepage course section reduced to product overview.

Risk: medium.

### Slice 5: Placement Test MVP

Deliverables:

- Static `/placement-test` page with client-side scoring.
- Result recommendation.
- WhatsApp handoff with result and student details.
- No sensitive data stored locally unless backend integration is approved.

Risk: medium, because test design and result mapping must be reviewed academically.

### Slice 6: Payment Spec, Not Payment Build

Deliverables:

- Payment decision memo.
- Provider recommendation.
- Student lookup/ledger model.
- Receipt/reconciliation flow.

Risk: high if implemented too early; low if kept as discovery/spec.

### Slice 7: QA, SEO, and Launch Polish

Deliverables:

- Build output verified.
- Desktop/mobile screenshot pass.
- Link and asset checks.
- SEO metadata updated around product-led English classes, placement test, courses, and local locations.
- Structured data updated for organization, courses, local business, and video proof where appropriate.

Risk: medium.

## Director Recommendations

1. Do not lead with every course. Lead with the pain, then the method, then the product categories.
2. Keep in-person as the flagship. Use hybrid/digital as the growth story.
3. Use AI tutors/study assistants carefully as "coming soon" support, not as the core promise yet.
4. Build placement test before real payments. Placement creates qualified leads; payments without identity/ledger clarity create ops cleanup.
5. Make `/courses` the expandable product catalog. The homepage should sell direction, not become a directory.
6. Tie every CTA to one of three jobs:
   - place me.
   - show me courses.
   - help me sign up.
7. Post website leads into AIT CRM; keep WhatsApp as a fast contact channel, not the only source of truth.
8. Keep the first release Spanish-first, but make the content model ready for an English/Spanish language picker.

## Open Decisions

- North Plainfield real address and final status.
- Academic rules for placement-test scoring.
- Payment gateway and whether payment requires sign-in/account association.
- Framework choice: ship current static site first or migrate intentionally to SvelteKit now.
- WhatsApp CRM operating model after the website refresh.
