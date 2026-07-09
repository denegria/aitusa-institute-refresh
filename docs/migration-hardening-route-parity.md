# Migration hardening and route parity

Linear issue: MIS-300

This slice hardens the React/Next migration bridge after MIS-298 without making
homepage design changes or treating the site as launch-ready.

## What is hardened

- The Next build path now publishes `robots.txt`, `sitemap.xml`, and
  `site.webmanifest` through `public/`, which is the static asset root used by
  the Vercel Next.js preset.
- The legacy/static build path continues to emit `robots.txt` and `sitemap.xml`
  in `dist/`.
- The sitemap is generated from `src/content.js` program slugs so course detail
  routes do not drift from the content model.
- The sitemap includes only public acquisition routes:
  - `/`
  - `/courses/`
  - `/placement-test/`
  - `/courses/:slug/`
- The sitemap intentionally excludes `/portal` and `/api/*` because portal,
  attendance, CRM, payment, and AI features are still fixture/API-boundary work,
  not public indexed surfaces.
- Route parity tests verify that the Next rewrites still match generated legacy
  HTML for `/`, `/courses`, `/courses/:slug`, `/cursos/:slug`, `/placement-test`,
  and existing `/public/*` asset references.

## Still deferred

- Final production-domain cutover and rollback plan remain launch QA work.
- Homepage conversion polish remains blocked on design/client feedback.
- North Plainfield publication status remains client-confirmation gated.
- Placement answer key remains `pending_academic_review`.
- CRM writes/storage, payment capture, auth provider wiring, and production
  portal data remain disabled until separately approved.

## Validation

Run:

```bash
npm run test:migration
npm run test:courses-seo
npm run test:content-hygiene
npm run test:placement
npm run check:assets
npm run build:static
npm run build
```
