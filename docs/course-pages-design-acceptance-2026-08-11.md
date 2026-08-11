# Course Pages Design Acceptance — 2026-08-11

## Problem

- User/job: Prospective AIT USA students must move from a homepage course or English-modality chip to a complete, trustworthy program page and understand the next step without scanning a giant catalog.
- Current friction: Homepage English chips land on catalog anchors; the catalog repeats tall offering cards and long inline details; English presencial/híbrido/online are not three distinct detailed journeys; retired English-for-kids and computer-repair offerings remain in content and routes.
- Desired outcome: Every active course has a substantial SEO-ready detail page. Homepage course CTAs deep-link to the relevant page. The catalog remains as a compact overview, not the primary destination.

## Selected Direction

- Interaction model: Detail-first course discovery. Homepage chips and course links open a dedicated program page; `/cursos/` is a compact browsable overview grouped by learning goal.
- Visual direction: Preserve the existing `CourseProgramPage` editorial template and current AIT visual system. Make the catalog shorter and calmer with a compact hero, lightweight modality/category navigation, and responsive course cards.
- Why this direction: It reuses an already strong detailed-page system, improves internal linking and search intent, and eliminates duplicated catalog scanning.
- Rejected alternatives and why: A single long accordion catalog keeps every program buried on one page. A new visual language would add risk without improving the requested journey.

## Locked Contract

- Behavior/state: English presencial, híbrido, and online each have a unique detail route and unique modality-specific content. All active non-English programs keep complete detail pages. Catalog filters/navigation may remain only if they work without hiding crawlable links.
- Permissions/data boundaries: Public, read-only acquisition pages. No authentication, database write, provider send, or form contract change.
- Routes/actions:
  - Preserve `/cursos/ingles-jovenes-adultos/` as the presencial canonical to avoid breaking the established URL.
  - Keep `/cursos/ingles-online-adultos/` as the online canonical.
  - Add `/cursos/ingles-hibrido-adultos/` for the hybrid modality.
  - Keep complete pages for `/cursos/espanol-extranjeros/`, `/cursos/ged/`, `/cursos/tutorias-matematicas/`, `/cursos/computacion-basica/`, and `/cursos/computacion-oficina/`.
  - Remove English-for-kids and computer-repair from active content, catalog, homepage/contact copy, static params, and sitemap. Their old Spanish and legacy aliases must permanently redirect to `/cursos/` rather than produce a broken journey.
  - Homepage modality chips and offering CTAs deep-link to the three English pages. Other named homepage course links deep-link to their detail page; a generic group may link to the catalog only when it cannot truthfully name one course.
- Copy or client-approved language: Spanish-first public copy. Preserve verified schedules, locations, audiences, and program facts already in `src/content.js`. Do not invent tuition, accreditation, certification, job guarantees, dates, seat availability, or outcomes.
- Mobile/desktop variants already accepted: Existing site header/footer and detailed-page template behavior remain authoritative.
- Explicit non-goals: Production promotion; business-data changes; placement-test changes; gallery/homepage redesign outside course-link wiring; new backend; invented pricing or promises.

## Responsive Contract

- Physical display context, if relevant: None; acceptance uses browser CSS pixels.
- Primary browser CSS viewport: 1440×900.
- Regression CSS viewports: 1024×768, 390×844, and 360×800.
- DPR/zoom assumptions: Browser zoom 100%; DPR is not an acceptance metric.
- Section-height or content-span constraints: Catalog top content must not become a multi-card wall. At 1440×900, the hero plus initial navigation should make the first course group visibly discoverable without scrolling through duplicated offerings.
- Whitespace/balance invariants: Preserve the established editorial rhythm and framed headings. Avoid tall empty card columns, stacked nested scroll regions, and uneven card actions.
- Content-growth assumptions: Eight active courses total; three English modalities plus five other programs. Cards must tolerate two-line titles and 2–3 lines of summary without overlapping actions.

## SEO Contract

- Every active detail page has unique title, description, canonical, Open Graph data, and crawlable internal links.
- Emit valid `Course` structured data and add `BreadcrumbList`; emit `FAQPage` only from the page's real visible FAQ content.
- Static params and both published sitemap copies contain only the eight active course routes.
- Retired offerings are absent from discoverable page copy and sitemap.
- Preserve English `/courses/...` aliases as redirects to the Spanish canonical family for active slugs; retired aliases resolve to the catalog redirect.

## Evidence

- Render path/state: `/`, `/cursos/`, the three English detail routes, `/cursos/tutorias-matematicas/`, and one representative technology route.
- Local browser proof: Catalog plus representative presencial, híbrido, online, and mathematics pages at 1440×900 and 390×844.
- Live staging proof: Same critical route set after Director acceptance and staging deployment.
- DOM measurements required: Confirm catalog first group is present in initial desktop flow; no horizontal overflow at regression viewports; every homepage modality link resolves directly to a detail route.
- Screenshot budget: Maximum 10 local screenshots and 8 live screenshots; use DOM/console evidence for the rest.
- Console/runtime checks: No console errors, failed local assets, hydration failures, or broken internal links on checked routes.

## Closeout Questions

1. Does the shipped workflow still use the detail-first interaction model?
2. Did any old long inline-detail catalog return inside a new container?
3. Are locked routes, verified copy, and responsive variants preserved?
4. Does the real CSS viewport match the acceptance claim?
5. Are deviations named and approved?
