# MIS-353 Design Acceptance Contract

## Problem

- User/job: prospective students must begin the placement test immediately; returning students must sign into the Portal without unrelated navigation.
- Current friction: placement repeats its promise in a public hero and diagnostic intro, exposes rare under-13 policy copy to everyone, and keeps a full marketing footer during the task. Portal sign-in is focused but lacks deliberate institutional framing and uses 10px supporting text.
- Desired outcome: polished, centered, single-viewport entry surfaces on desktop and mobile with no clipping, hanging content, unnecessary page scroll, or tiny typography.

## Selected Direction

- Interaction model: focused task shells. Placement uses the common path by default and progressive disclosure for the rare under-13 branch. Portal keeps a dedicated authentication shell.
- Visual direction: preserve AIT navy, gold, cream, typography, radii, and restrained institutional tone; improve hierarchy, balance, and whitespace distribution.
- Why this direction: it removes repeated information and off-task navigation without altering business logic or privacy protections.
- Rejected alternatives and why: shrinking the existing page preserves crowding; adding the full public menu to Portal adds distraction; leaving the minor-policy paragraph visible prioritizes a rare branch over the common path.

## Locked Contract

- Behavior/state: preserve placement questions, scoring, session resume, age-band value, guardian onboarding, result claim, auth, API, privacy, and observability behavior. Under-13 state begins only after explicit continuation in the disclosure.
- Permissions/data boundaries: no auth, database, policy, provider, or production-data changes.
- Routes/actions: `/placement-test/` and `/portal/sign-in/`; existing legal/help/home destinations remain valid.
- Copy or client-approved language: primary placement CTA `Comenzar examen`; age control `¿El estudiante es menor de 13?`; under-13 confirmation `Continuar como menor de 13`; Portal utility action `Volver al sitio`.
- Mobile/desktop variants already accepted: modal on desktop and bottom sheet or equivalently polished responsive dialog on mobile; minimal white Portal header at both sizes.
- Explicit non-goals: scoring, question count, APIs, database, guardian policy, Portal dashboard, courses, global site-navigation redesign, design-system rewrite, DNS, production promotion.

## Responsive Contract

- Physical display context, if relevant: none; browser CSS viewport is authoritative.
- Primary browser CSS viewport: 1440x900 desktop and 390x844 mobile.
- Regression CSS viewports: 1280x720, 1024x768, 768x1024, and 360x800.
- DPR/zoom assumptions: DPR 1, browser zoom 100% for baseline evidence.
- Section-height or content-span constraints: each default entry state fits without page-level scroll at both primary viewports. Active first placement question fits without the removed marketing hero/footer. Smaller regression viewports may scroll only when unavoidable, with no nested competing scrollbars.
- Whitespace/balance invariants: center the task surface deliberately; avoid large dead zones, clipped bottoms, edge-to-edge mobile cards, or elements hanging below the viewport.
- Content-growth assumptions: current Spanish copy and six-digit auth state; under-13 disclosure supports the approved copy without requiring smaller text.

## Typography And Interaction Invariants

- Standard body copy is at least 14px where space allows; helper, trust, and legal copy is at least 12px.
- Inputs, buttons, and interactive legal links retain at least 44px hit targets.
- Do not meet viewport fit by compressing line-height or making text uncomfortably small.
- Dialog supports semantic labelling, focus entry, Escape close, overlay close where safe, and return focus.

## Evidence

- Render path/state: Portal default sign-in; placement intro; under-13 disclosure open; active first question.
- Local browser proof: all four states at primary viewports and fit checks at every regression viewport.
- Live staging proof: repeat primary and regression viewport checks after Director-accepted staging deployment.
- DOM measurements required: viewport, document scroll height/width, task/card bounds, header bounds, legal/footer bounds, and overflow state.
- Screenshot budget: one baseline per route/state/primary viewport plus one per distinct regression failure; no duplicate-state captures.
- Console/runtime checks: zero console/runtime errors on changed routes and interaction states.

## Closeout Questions

1. Does the shipped workflow still use the focused task-shell and progressive-disclosure interaction model?
2. Did the repeated marketing hero/footer or visible minor-policy wall return?
3. Are behavior, privacy, auth, copy, and responsive variants preserved?
4. Do measured CSS viewports prove the one-screen claims?
5. Are any deviations named and approved?
