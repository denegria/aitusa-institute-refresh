# MIS-428 production registration configuration load

This release rebuilds the AIT USA production site at its approved `main` code
after adding server-side production registration settings. No public pricing or
application code changes are introduced by this document.

Production Vercel configuration must include:

- `AIT_CRM_REGISTRATION_URL`: the public AIT CRM production
  `/api/public-registration` endpoint (not a protected preview alias).
- `AIT_CRM_REGISTRATION_SECRET`: distinct production-only secret, matching CRM's
  `AITUSA_REGISTRATION_SHARED_SECRET`.
- `REGISTRATION_STATE_SECRET`: separate production-only return-state signing
  secret.

Read-only quote and form validation may be checked after deployment. Payment
creation, real registration, hosted card entry, and callback reconciliation
remain separately gated by MIS-428. The AIT USA portal payment configuration is
not part of this release and must not be inferred ready from registration smoke.
Never store secret values, card data, or student form payloads here.
