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

Focused `git diff --check` and exact-scope diff review are performed in the implementation worktree. Full repository validation, release-surface verification, live visual review, and staging delivery are owned by the parent task.
