# AIT USA Institute Refresh — Agent Contract

## Product and stack

- Spanish-first public acquisition site and preview-gated student portal.
- Next.js 16 App Router, React 19, Node 22+, Neon/Drizzle service boundaries.
- `app/(public-site)` owns public routes; `app/portal` owns the portal UI; `app/api` owns HTTP boundaries; reusable domain mechanics live under `src`.

## Branch and delivery policy

- Source: `main`; QA/staging: `staging`; production: `main` only after explicit Alvaro approval.
- Work in a fresh issue-bound worktree. Never use the durable staging worktree as a scratch lane.
- Git pushes trigger deployment. Do not run an additional manual Vercel deploy.
- Use `Builder <alvarodenegri98@gmail.com>` for project commits.
- Do not delete or overwrite uncommitted work in another checkout.

## Required validation

Run `npm run validate` for every candidate. It covers repository policy, asset integrity, the complete Node test suite, and the production build.

For any UI, navigation, Method, or portal-entry change, also run:

```bash
npm run start
VERIFY_BASE_URL=http://127.0.0.1:3000 npm run verify:release-surfaces
```

The release-surface check must produce deterministic desktop and mobile evidence for the homepage, `#metodo`, and `/portal/sign-in/`.

## Product and security boundaries

- Preserve the approved Spanish-first funnel and real AIT USA proof/media.
- Keep portal routes preview-gated until auth, privacy, CRM-backed identity, and production approval are complete.
- No payment capture, production data writes, private Wix access, provider sends, or production promotion without explicit approval.
- Routes/actions own auth, policy, state transitions, and user-facing failures. Services own reusable mechanics and provider boundaries.
- Never log or attach credentials, phone numbers, student records, form payloads, transcripts, or other sensitive data to Sentry or release artifacts.

## Definition of done

- `npm run validate` passes.
- Required desktop/mobile visual evidence passes with no unexplained overflow or console/runtime errors.
- A release packet records issue, brief/reference, commit, validation, screenshots, deployment URL or pending state, privacy-safe Sentry status, and approval state.
- Staging deployment and live QA are named separately from production completion.
