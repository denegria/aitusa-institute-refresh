# Public React Migration — Design Acceptance Contract

## Problem

- User/job: Spanish-first prospective students and families need to understand AIT USA, compare programs, choose a study format, find a location, take the placement test, and contact an advisor.
- Current friction: the site is deployed through Next.js but the homepage, course, and placement surfaces are still generated HTML driven by a legacy DOM runtime. React pages and legacy pages therefore maintain separate chrome, routing, state, and form boundaries.
- Desired outcome: one React App Router surface with the accepted public experience preserved exactly and with clean boundaries for later CRM and portal integration.

## Selected Direction

- Interaction model: Server-rendered public pages with narrowly scoped client components for navigation, dialogs, video controls, course filtering, placement-test progression, and form states.
- Visual direction: preserve the production-approved layout, content, assets, responsive variants, and existing CSS class system.
- Why this direction: it removes the duplicate runtime without reopening design decisions or adding migration-only visual risk.
- Rejected alternatives:
  - Hydrating the old DOM renderer inside a React wrapper: this would preserve the split instead of completing the migration.
  - Redesigning while migrating: this would make parity failures impossible to isolate.
  - Productionizing the portal or AI Study Buddy in this slice: those features still require real auth, CRM-backed data, privacy enforcement, and provider approval.

## Locked Contract

- Behavior/state:
  - Desktop and mobile header/navigation behavior remains unchanged.
  - Homepage section navigation, video behavior, testimonial shelf/dialog, callback dialog, and location actions remain available.
  - Course filters and course-detail routes remain available.
  - Placement-test questions, scoring state, SMS-consent separation, success/failure copy, and WhatsApp fallback remain unchanged.
- Permissions/data boundaries:
  - Public intake APIs retain their current no-CRM-write gate.
  - Portal routes remain preview-only and fail closed in production.
  - AI provider calls, raw audio/transcript storage, and portal CRM writes remain disabled.
- Routes/actions:
  - `/`, `/courses`, `/courses/[slug]`, `/cursos/[slug]`, and `/placement-test` become native App Router pages.
  - `/contactanos` and the legal pages join the shared public header/footer while preserving their form, consent, and legal-content behavior.
  - APIs and `/portal` keep their current behavior.
  - Existing redirects, sitemap paths, canonical URLs, and course aliases remain intact.
- Copy or client-approved language: all currently deployed Spanish-first content is locked.
- Mobile/desktop variants already accepted: current production desktop and mobile compositions are locked.
- Explicit non-goals: visual redesign, content editing, CRM ingestion, auth-provider setup, portal production enablement, AI-provider integration, payments, or schema changes.

## Responsive Contract

- Physical display context: Alvaro reviews primarily on large desktop displays.
- Primary browser CSS viewport: 1440×900.
- Regression CSS viewports: 1536×864, 1920×930, 1920×1080, and 390×844.
- DPR/zoom assumptions: DPR 1 and 100% browser zoom for acceptance captures.
- Section-height/content-span constraints: preserve current section ordering, major content spans, hero split, story grid, course cards, location balance, FAQ rhythm, and final CTA.
- Whitespace/balance invariants: no new broad empty regions, column imbalance, or header/content drift.
- Content-growth assumptions: current program, location, testimonial, FAQ, and placement-question counts are authoritative for this migration.

## Evidence

- Render path/state: native App Router HTML without `/legacy/` rewrites or `src/main.js`.
- Local browser proof: route matrix, desktop/mobile screenshots, primary interactions, direct-route refreshes, and browser console.
- Live staging proof: exact deployed commit, public/portal route matrix, desktop/mobile captures, and runtime error scan.
- DOM measurements required: viewport, document/body width, horizontal overflow, H1/title, broken images, and route-specific interactive state.
- Screenshot budget: one baseline per required viewport plus focused interaction evidence only when DOM state is insufficient.
- Console/runtime checks: no product console errors, hydration errors, or Vercel error/fatal runtime logs.

## Closeout Questions

1. Does the shipped workflow still use the selected interaction model?
2. Did any legacy DOM renderer return inside a React wrapper?
3. Are locked behaviors, permissions, copy, and responsive variants preserved?
4. Does the real CSS viewport match each acceptance claim?
5. Are deviations named and approved?
