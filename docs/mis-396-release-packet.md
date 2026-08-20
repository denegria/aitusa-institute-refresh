# MIS-396 release packet

- Issue: `MIS-396`
- Brief/reference: Alvaro's 2026-08-20 approval to lock the legal slice before
  placement-review and messaging implementation
- Implementation commit: `cc71d8ed2d4f6c46e2ad9c1e07fc7c6cfcc1ac31`
- Validation: `npm run validate` — passed; 280 tests, asset/repository checks,
  TypeScript, and Next.js production build passed
- Focused validation: `npm run test:sms-compliance` (43 tests) and
  `npm run test:privacy` (11 tests) passed
- Visual evidence: local `verify:release-surfaces` passed with six desktop/mobile
  screenshots; local desktop Privacy Policy and mobile `/contactanos` consent
  form were inspected with no browser console or runtime errors
- Deployment URL:
  `https://aitusa-institute-refresh-git-staging-alvaros-projects-efb8ae58.vercel.app`
  (validated Ready deployment `dpl_2etzEdM6dbwSZraQJyRyai2fX38w`, staging
  commit `4bca70b195ee08ab5e9404fce998bdc027e20537`)
- Sentry status: connector unavailable in this session; Vercel reported no
  build errors and no preview runtime error clusters in the validation window.
  Protected staging browser QA passed after clearing the Vercel-login console.
- Approval state: staged for Human Review; production remains unapproved
- Safety: no production data write, SMS send, Telnyx campaign/profile mutation,
  campaign submission, secret export, or manual Vercel deployment occurred
- Residual gates:
  - business-owner and counsel review of final Spanish/English legal copy;
  - MIS-397 service-SMS consent surface and evidence;
  - live branded consent screenshots and STOP/HELP/START provider QA;
  - authenticated Telnyx brand-use-case enum check and new campaign fee approval;
  - existing `nanoid@3.3.16` audit advisory inherited through the pinned PostCSS
    override (outside this legal slice).
