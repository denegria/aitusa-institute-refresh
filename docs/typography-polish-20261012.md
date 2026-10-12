# Public Typography Polish — 2026-10-12

## Scope

Approved CSS-only typography correction for the public site. The audited staging design remains the faithful baseline; only the accepted typography deviations were adjusted.

## Changes

- Unified public header wordmark scale at 24/22px, 21/19px, 20/18px, and 16/14px across the approved desktop/tablet/mobile breakpoints; retained header geometry and institute gold.
- Reduced the homepage hero title only at widths ≤374px and set the approved mobile line-height.
- Set contact and enrollment form labels to 14px/700 and controls to 16px/500 without changing control geometry or buttons.
- Improved mobile homepage proof captions and ensured location address/help text remains at least 13px without truncation; adjusted the map focus label typography.

## Locked

All copy, media, layout, interactions, navigation behavior, business logic, and non-target heading roles remain unchanged. No JSX, dependencies, data writes, form submissions, secrets, production promotion, or deployment actions are included.

## Verification status

- Implementation commit: `bae20689cd51962224ba26ef2f376977ff0b4df6`; base `b8a54deb95848fbdc87c44751e9fba25403e9ae1`.
- `npm run validate`: repository contract and assets passed, 403 tests passed; initial build was blocked by an out-of-root dependency symlink. Corrected only the isolated worktree dependency layout, then `npm run build` passed. No dependency or build configuration changed.
- `VERIFY_BASE_URL=http://127.0.0.1:3012 npm run verify:release-surfaces`: passed, 49 deterministic screenshots across desktop/mobile and regression viewports.
- Independent Director diff and visual review: accepted with only the four approved typography deviations; copy, media, interaction model and non-target heading roles preserved. Narrow-mobile, mobile contact/course/Method/portal entry and short-laptop evidence inspected.
- Current-run live before screenshots: 19 full-resolution section/viewport captures across desktop 1440×1000, mobile 390×844 and narrow mobile 320×844. Matching after screenshots and safe deployment proofs will be filed in workspace `runtime/audits/aitusa-typography-2026-10-12/` after staging deployment.
- Delivery target: `https://staging.aitusainstitute.com/`, normal Git-triggered staging deployment only. Live after QA is pending at this packet revision; production promotion remains unauthorized.
- Browser QA is read-only: no form submissions, personal test data or payment/provider sends. Sentry was not queried for this CSS-only pass; no instrumentation changed.
