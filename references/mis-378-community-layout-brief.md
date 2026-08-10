# MIS-378 — Implement selected community-story Method layout

Objective: Rebuild the homepage Method section from selected ideation option 2,
with only the homepage-consistency refinements named in the acceptance contract.

Agent: Senior Builder using Terra at high reasoning.

Repo: `/root/.openclaw/giuseppe-workspace/aitusa-institute-refresh`.

Worktree: `/root/.openclaw/giuseppe-workspace/.worktrees/builder-mis-378-community-layout`.

Branch: `builder/mis-378-community-layout` from exact `origin/staging` commit
`9bdc6d66da96eab6c7b74d3c3578117e501ad28d`.

Surface: local homepage Method section (`/`, `#metodo`).

Access: no authenticated or protected surface is needed during implementation.

Allowed actions: patch focused Method source, content, styles, tests, and the
reference contract; run local checks; create one local commit. Do not push or
deploy. No production writes and no production reads.

Validation: run the focused Method tests, full Node test suite, asset audit,
webpack production build, browser render at the locked viewports, and
`git diff --check`.

Render-path test: update the focused component/source contract to assert the
rendered community band, unnumbered questions/fundamentals, and exactly one
native Method video; browser QA must verify the rendered output.

Delivery: return evidence to Giuseppe only; do not send an external message.

Stop conditions: stop on a dirty/wrong worktree or base, inaccessible selected
reference, copy conflict, required out-of-scope change, unresolved product
decision, or unrelated validation failure.

Acceptance: the exact selected layout and approved refinements render at every
locked viewport, all required checks pass, and the report includes routing
evidence plus the local candidate commit.

## Routing

- Target agent: Senior Builder.
- Requested model/reasoning: Terra / high.
- Delivery: return report only; Giuseppe will relay.
- Closeout must report actual agentId, model, reasoning, fallback status, child
  run id, candidate commit, and validation outcomes.

## Target and authority

- Repo: `/root/.openclaw/giuseppe-workspace/aitusa-institute-refresh`.
- Editing worktree: `/root/.openclaw/giuseppe-workspace/.worktrees/builder-mis-378-community-layout`.
- Branch: `builder/mis-378-community-layout`, based on exact `origin/staging`
  commit `9bdc6d66da96eab6c7b74d3c3578117e501ad28d`.
- Environment: local candidate only during implementation.
- Allowed: inspect, patch Method-section source/content/styles/focused tests and
  the supplied contract, run local validation, and create one local commit.
- Forbidden: push, deploy, edit staging/main directly, production mutation,
  data writes, external sends, unrelated cleanup, new generated assets, or
  changes outside the approved Method slice.

## Goal

Implement displayed ideation option 2 as a homepage-consistent Method section,
with the approved refinements in
`references/design-acceptance-contract-method-concept.md`.

## Source of truth

- Selected reference:
  `/root/.openclaw/agents/main/agent/codex-home/generated_images/019fe93c-f7d7-74b3-a028-645810fd1508/exec-cfe97fae-5833-4226-a5d8-0a9a3064aebd.png`
- Acceptance contract:
  `references/design-acceptance-contract-method-concept.md`
- Homepage tokens and patterns: `src/styles.css` `.home-page` layers.
- Content and implementation: `src/content.js`,
  `app/_components/site/PublicSections.jsx`, and
  `app/_components/site/InteractiveSections.jsx`.
- Focused tests: `tests/homepage-method.test.mjs` and
  `tests/homepage-integration.test.mjs`.

## Source-to-render map

- Warm opening → one copy-led homepage-width editorial grid; no image/video.
- Navy community band → `Lo que escuchamos`, heading/intro, and three
  unnumbered questions with restrained gold separators.
- Warm solution bridge → two-column `La respuesta` heading and concise intro;
  no illustration.
- Final warm chapter → fundamentals copy/list beside the single real native video.

## Acceptance

- Preserve all locked copy verbatim.
- Remove compass, path, pain/principle artwork, visible/accessibility numbering,
  `Tres preguntas`, redundant video chapter copy, trust/footer filler, and all
  unused Method artwork imports/arrays from the render path.
- Keep the video once, with current source/poster/native controls and mobile
  behavior.
- Match the existing homepage typography, width, tokens, 8px radius language,
  and vertical rhythm.
- Use semantic heading order and unordered lists.
- Responsive at 1440×900, 1280×720, 768×1024, and 390×844 with no horizontal
  overflow or clipped text/controls.
- Do not rasterize text or recreate visible assets with CSS/SVG art.

## Validation profile

- `node --test tests/homepage-method.test.mjs tests/homepage-integration.test.mjs`
- `node --test tests/*.test.mjs`
- `npm run check:assets`
- `NEXT_PRIVATE_WORKER=webpack npm run build`
- `git diff --check`
- If local browser tooling is available, render the homepage and capture the
  Method section at 1440×900, 768×1024, and 390×844; implementation screenshots
  are evidence, not the independent fidelity verdict.

## Stop conditions

- Stop if the selected reference cannot be opened, copy conflicts with current
  product truth, the worktree is not clean/on the named branch/base, changes
  outside the Method slice become necessary, validation exposes an unrelated
  failure, or a product/design decision not resolved by the contract is needed.
- Do not infer or silently broaden scope.
