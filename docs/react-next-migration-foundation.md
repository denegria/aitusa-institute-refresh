# React/Next migration foundation

Linear issue: MIS-298

This slice introduces the AIT USA Refresh repository to a Next.js App Router
runtime without changing approved product boundaries for portal data, auth,
payments, CRM writes, or AI features.

## Current routing shape

- `/` and the current public acquisition routes continue to render the existing
  static site through a generated legacy bridge.
- `/portal` is now an App Router page that reuses the MIS-271/MIS-276 fixture
  model directly inside the integrated app.
- `/public/:path*` rewrites to Next's public asset root so existing static asset
  references keep working during migration.

## Why this bridge exists

The public site is still the active acquisition surface and should not be
visually redesigned in this platform lane. The bridge keeps that surface stable
while giving the platform workstream a real React/Next application boundary for
portal, auth, attendance, CRM events, privacy gates, and later API routes.

Future slices can port the public homepage section by section from the legacy
static renderer into React components after visual QA and product approval.

## Boundaries

- No auth provider SDK or secret wiring is added.
- No student data is stored.
- No AIT CRM writes are made.
- No payment provider or capture flow is added.
- No AI provider is called from the browser or server.

## Validation target

Use these checks for this foundation slice:

```bash
npm run test:portal-auth
npm run test:portal-shell
npm run check:assets
npm run build
```

For QA, deploy the `staging` branch through Vercel and smoke-check `/` and
`/portal` before issue-specific visual QA begins.
