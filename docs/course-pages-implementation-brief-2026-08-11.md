# AIT USA Course Pages Implementation Brief — 2026-08-11

## Dispatch Summary

- Objective: Build and locally validate the approved detail-first course journey.
- Owner: Builder on the named Luna lane.
- Repo: `aitusa-institute-refresh` in the isolated worktree named below.
- Branch: `builder/2026-08-11-aitusa-course-pages`, based on the exact staging SHA below.
- Acceptance: The eight-page inventory, direct homepage routing, compact catalog, retirement behavior, SEO contract, tests, and responsive render evidence all pass.
- Allowed actions: Patch, test, build, render in a local browser, and commit files in the isolated worktree only.
- Validation: Use the `ui` profile plus all repository-specific commands listed below; the render-path test must cover the catalog and representative course pages.
- Access: Local unauthenticated public routes only. Builder has no staging-protection bypass or production credentials and does not need either.
- Stop conditions: Stop on missing business facts, branch divergence, unrelated dirty changes, dependency changes, template-contract conflict, or required validation failure.
- Delivery: Return one local candidate commit and the complete evidence packet to Giuseppe in the parent session; Telegram, email, WhatsApp, and all external-channel activity are outside scope.
- Production safety: No production data writes, no production promotion, and no production mutation. Production requires separate explicit approval.

## Objective And Owner

- Owner: Builder (`agentId=builder`), requested model `openai/gpt-5.6-luna`, requested reasoning `max`.
- Objective: Implement the approved detail-first AIT USA course journey and SEO contract in one authoritative candidate lane.
- Source request: Alvaro, Telegram voice request, 2026-08-11.

## Target And Source Of Truth

- Repo: `/root/.openclaw/giuseppe-workspace/aitusa-institute-refresh`
- Isolated worktree: `/root/.openclaw/giuseppe-workspace/.worktrees/builder-2026-08-11-aitusa-course-pages`
- Branch: `builder/2026-08-11-aitusa-course-pages`
- Exact base: `origin/staging` at `fc0be61232bf321892ab3338ae066f37b4cf0c60`
- Environment/surface: local candidate for AIT USA staging; public homepage, course catalog, and course detail routes.
- Product/design authority: `docs/course-pages-design-acceptance-2026-08-11.md`, then the user request, current `src/content.js`, current course template, existing tests, and `TOOLS.md` staging mapping.

## Scope And Acceptance Criteria

1. Preserve the existing reusable `CourseProgramPage` visual/editorial template.
2. Produce exactly eight active, complete course records/pages:
   - `ingles-jovenes-adultos` retitled/refocused as English presencial for youth/adults.
   - new `ingles-hibrido-adultos` with unique hybrid content.
   - `ingles-online-adultos` with unique online content.
   - `espanol-extranjeros`, `ged`, `tutorias-matematicas`, `computacion-basica`, `computacion-oficina`.
3. Remove `ingles-ninos` and `reparacion-computadoras` from active program/content/catalog/contact/home/sitemap discovery. Redirect their old canonical and legacy aliases permanently to `/cursos/`.
4. Replace catalog duplication with a compact overview: no `OfferingsSection` wall and no inline `course-detail-stack` accordion. Keep direct, crawlable cards/links grouped cleanly. The first group should become discoverable in the initial 1440×900 flow.
5. Wire homepage presencial/híbrido/online chips and offering CTAs directly to the corresponding detail route. Named non-English course links must go directly to their course page.
6. Keep verified schedules and program facts; do not invent pricing, claims, credentials, outcomes, or availability.
7. Strengthen SEO with unique metadata, canonical/OG, `Course`, `BreadcrumbList`, visible-FAQ-backed `FAQPage`, active-only sitemap entries, and related-course internal links.
8. Update/add regression tests for the eight-page inventory, retired-course absence/redirects, homepage deep links, schema/metadata, aliases, and catalog composition.

## Allowed Actions

- Read repo files and local docs.
- Patch only the isolated worktree.
- Add/update tests and documentation needed for this slice.
- Reuse the warm lane's dependencies via a non-committed symlink if needed; do not run a duplicate install unless a package-lock change or genuine missing-module blocker requires it.
- Run targeted tests, full local test suite, asset check, diff check, and build.
- Commit locally with `Builder <alvarodenegri98@gmail.com>`.

## Forbidden Actions And Non-Goals

- No push, merge, deploy, staging-lane mutation, production promotion, production/client-data write, provider send, public message, migration, destructive cleanup, dependency upgrade, or broad redesign.
- The dirty canonical `main` checkout and durable `.worktrees/aitusa-staging` worktree remain untouched by Builder.
- Do not change placement, portal, CRM/API behavior, gallery design, auth, or unrelated homepage sections.
- Do not delete physical image assets merely because retired courses no longer reference them; asset cleanup is out of scope.

## Validation Profile

- Profile: `ui` plus repository-specific SEO/content gates.
- Required commands from the candidate worktree:
  - `git diff --check origin/staging...HEAD`
  - `npm run test:courses-seo`
  - `npm run test:migration`
  - `npm run test:content-hygiene`
  - relevant homepage tests (`node --test tests/homepage-integration.test.mjs` at minimum)
  - full `node --test tests/*.test.mjs`
  - `npm run check:assets`
  - `npm run build`
- The repo has no lint script; report that fact rather than inventing a substitute.
- Local browser proof for the routes/viewports in the design contract when runtime support is available. Record an exact blocker if browser proof is unavailable.

## Stop Conditions

- Stop and return to Giuseppe if verified course facts needed for hybrid content are absent, if implementing the split would require inventing business policy, if the exact base diverges, if unrelated dirty changes appear, if package/dependency changes become necessary, or if the existing template cannot meet the contract without a broad redesign.
- One unchanged/repeated failure gets diagnosis, not blind retries.
- A failing required validation blocks candidate acceptance.

## Delivery Contract

- Deliver one clean local commit only; do not push.
- Report: exact worktree/branch/base, candidate SHA, touched paths, functional changes, all validation outcomes, browser evidence/blockers, remaining risk, actual `agentId`, actual model/reasoning, fallback status/model, and run/session id.
- Independent reviewer: Sentry, dispatched only after Giuseppe verifies the candidate commit. Builder must not self-approve staging.
- Delivery phase ends at `candidate` or `local-validation`; Giuseppe owns closeout, Director acceptance, staging promotion, deployment checks, live QA, and production boundary.
