# MIS-396 release packet

- Issue: `MIS-396`
- Brief/reference: Alvaro's 2026-08-20 approval to lock the legal slice before
  placement-review and messaging implementation
- Integrated staging commit: `c430596074ee2e100caf08db29606151593b1114`
- Validation: `npm run validate` — passed; 295 tests, asset/repository checks,
  TypeScript, and Next.js production build passed
- Focused validation: `npm run test:sms-compliance` (43 tests) and
  `npm run test:privacy` (11 tests) passed
- Visual evidence: local `verify:release-surfaces` passed with six desktop/mobile
  screenshots; local desktop Privacy Policy and mobile `/contactanos` consent
  form were inspected with no browser console or runtime errors
- Deployment URL:
  `https://aitusa-institute-refresh-git-staging-alvaros-projects-efb8ae58.vercel.app`
  (validated Ready deployment `dpl_86dEEgxecuHhfwKJTbEWEgZ5qPMA`)
- Independent review: Sentry and Titan acceptance reviews passed after the
  integrated placement-review corrections; Vercel reported no build errors.
- Approval state: staged for Human Review. Production promotion is authorized
  only after the remaining MIS-344 gates pass.
- Safety: no production data write, SMS send, Telnyx campaign/profile mutation,
  campaign submission, secret export, or manual Vercel deployment occurred
- Residual gates:
  - business-owner and counsel review of final Spanish/English legal copy;
  - MIS-397 service-SMS consent surface and evidence;
  - live branded consent screenshots and STOP/HELP/START provider QA;
  - authenticated Telnyx brand-use-case enum check and new campaign fee approval;
  - existing `nanoid@3.3.16` audit advisory inherited through the pinned PostCSS
    override (outside this legal slice).

## Integrated staging evidence addendum (2026-08-20)

- Public `/contactanos` email-only submission completed on live staging with no
  phone number and no marketing-SMS consent.
- Desktop capture SHA-256:
  `896bd041fdd682ce792fdbd45c8c65782b0ec62616f43ec108d8b35289849079`.
- Mobile consent-panel capture SHA-256:
  `786dcac3b2f03a42a591c8906b5066d3e6c576b227f8fe20f2797f9e96863643`.
- The corresponding CRM staging contact, lead, task, timeline, and notification
  were observed once; replay was idempotent.
- Evidence is attached directly to MIS-396. The rejected Telnyx campaign was
  not edited or resubmitted.
