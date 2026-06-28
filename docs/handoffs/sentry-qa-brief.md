# Sentry QA Brief - AIT USA Product Refresh

Date: 2026-06-28
Requested by: Giuseppe
Owner: Sentry

## Objective

Verify the AIT USA product-led refresh is launch-ready on the built static output.

## Primary User Paths

1. Prospective adult student lands on homepage, understands the pain hook, starts placement test.
2. Student compares in-person, hybrid, and online offerings.
3. Student opens detailed courses page.
4. Student watches or sees testimonial proof.
5. Student clicks `$95 registration + book` CTA.
6. Student contacts advisor by WhatsApp/phone.
7. Student checks nearest location, including North Plainfield status if present.

## Commands

Run:

```bash
npm run build
npm run check:assets
npm run verify:browser
git diff --check
```

## Browser Checks

Check desktop and mobile:

- Homepage first viewport.
- Offerings section.
- Locations section.
- Testimonials/video section.
- Final CTA section.
- `/courses`
- `/placement-test`

## Functional Checks

- Primary CTAs are visible and clickable.
- WhatsApp URLs include sensible prefilled text.
- `/courses` loads from built output.
- `/placement-test` loads from built output.
- Placement test can be completed on mobile.
- Videos do not break page layout if poster/video fails.
- No obvious text overflow in buttons/cards.
- Header navigation works after multi-page changes.

## Content Checks

- No unsupported claims like guaranteed fluency or guaranteed job outcomes.
- AI tutor/study assistant language is clearly future-facing if present.
- North Plainfield is not presented as a fully open location unless address/status is confirmed.
- Payment page or CTA does not collect money unless explicitly approved.
- `$95` CTA accurately represents registration + book.
- AI tutor/study assistant copy says coming soon if present.
- Placement test result is framed as a recommendation pending advisor confirmation unless scoring has been approved.
- Lead submission either posts to approved AIT CRM endpoint or clearly degrades to contact/WhatsApp path.

## SEO Checks

- Page title/meta description reflect product-led English classes.
- Sitemap includes new routes if build supports it.
- Robots file remains valid.
- Organization/location data is not inaccurate.

## Evidence To Return

- Validation commands and pass/fail.
- Screenshot paths from `screenshots/`.
- Broken links or asset issues.
- Mobile UX issues.
- Residual launch risks.

## Stop Conditions

Stop and report instead of guessing if:

- A route exists locally but not in built output.
- Payment code is present without approved provider/ledger decision.
- Placement test claims authoritative level placement without review.
- Source asset paths are missing or video files fail across multiple key sections.
- A new framework migration appears without a documented stack decision.
