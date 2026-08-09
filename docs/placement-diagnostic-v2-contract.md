# AIT USA Placement Diagnostic V2 Contract

Status: product direction and academic scoring approved
Contract version: `aitusa-placement-v2-approved-2026-08-01`
Linear: MIS-335, MIS-336, MIS-337, MIS-338, MIS-339, MIS-340

## Product outcome

The diagnostic gives a prospective student useful placement value before asking
for identity or contact information. It should feel like a focused web
application: one question at a time, visible momentum, purposeful motion, safe
back/skip behavior, and a clear result-to-practice conversion moment.

## Locked interaction contract

- Preserve the 62 graded questions from the current source test.
- Start anonymously; no name, email, phone, city, or account is required to
  answer questions or see the initial result.
- Show one active question visually and to assistive technology.
- Allow Back, Skip, answer changes, and a skipped-question review queue.
- A skipped question counts as unanswered.
- Do not reveal correct/incorrect answers during the diagnostic.
- Separate completion progress from academic exploration:
  - `Pregunta 18 de 62 · cerca de 8 min restantes`
  - an Intro Book → Book 1 → Book 2 → Book 3 → Book 4 → Book 5 path with copy such as
    `Explorando preguntas de Nivel 2`
- Never say a learner has qualified for a level before the approved scoring
  service produces the completed result.
- Self-assessment and writing may personalize recommendations and help an
  advisor, but they do not alter automatic academic placement.
- Show the initial AIT placement estimate before contact capture.
- The result remains orientative and requires advisor confirmation.
- Account claim should request first name and email only, then use an in-page
  one-time code. Phone and WhatsApp consent are separate and optional.
- Users under 13 may take the anonymous diagnostic, but saving a result,
  creating an account, or using Study Buddy requires a verified guardian flow.
- Retakes are limited to once every 30 days unless an advisor unlocks one.

## Motion and accessibility

- Selecting an answer gives a brief visual confirmation before advancing.
- Forward navigation moves the question card left; Back moves it right.
- Use restrained checkpoint moments between academic blocks, not confetti after
  every answer.
- Keep the application shell stable with no page reload or layout jump.
- Preserve visible focus, keyboard selection, at-least-44px controls, screen
  reader labels, and a complete reduced-motion mode.

## Academic scoring contract

Final placement must be based on the highest validated academic level block the
learner passes. Total correct answers may be displayed as diagnostic context,
but total-correct scoring and self-assessment must not define the final level.

Approved academic rules:

- The client-supplied 62-answer key is authoritative, with the grammatically
  correct `had already begun` retained for Q51 and `through` added to Q37.
- The six source blocks remain Q1–12, Q13–25, Q26–35, Q36–42, Q43–50, and
  Q51–62.
- A block is passed at 70%, rounded up: 9/12, 10/13, 7/10, 5/7, 6/8, and 9/12.
- Blocks must be passed consecutively. Passing a block demonstrates mastery of
  that level and recommends entry into the next level; failing an earlier block
  prevents a later isolated pass from advancing placement.
- Exactly one question below the current block threshold is `borderline` and
  requires advisor review.
- Passing every block caps the automatic recommendation at Level 6 and requires
  advanced advisor review.
- Self-assessment and the free-writing comparison do not add automatic points.
  Writing is advisor-only evidence for borderline and advanced confirmation.
- Results remain placement recommendations rather than CEFR certifications, and
  advisor confirmation remains required before enrollment.

## Study Buddy acquisition reward

- One free guided voice conversation per verified email.
- Target duration: 3–5 minutes.
- Maximum: five learner turns.
- Initial mode: level-matched conversation roleplay with pronunciation support.
- Interaction: push-to-talk/tap-to-record, one concise correction, one retry,
  and a short next-practice recommendation.
- Text fallback is required.
- Raw audio and raw transcripts are not retained.
- Browser-to-provider calls remain forbidden; the server owns provider access,
  prompts, safety, limits, usage, and cost controls.
- Users under 13 require a verified guardian before practice starts.

## V2 state machine

1. `intro`
2. `graded_question`
3. `skipped_review` when unanswered questions remain
4. `reflection` for optional self-assessment
5. `goal_and_writing`
6. `submitting`
7. `anonymous_result`
8. `account_claim` or `continue_without_account`
9. `practice_unlock` after successful claim and applicable guardian gate

Eligible users age 13+ use a server-owned anonymous attempt with a seven-day
HttpOnly resume credential. When portal storage is unavailable, the interaction
degrades to session-only browser recovery without blocking the result. Users
under 13 always remain session-only until the guardian verification and consent
mechanism is approved.

## Data and consent boundaries

- Raw answers, writing samples, and Study Buddy transcripts do not go to CRM.
- CRM writes remain disabled. Durable portal storage is limited to eligible
  anonymous attempts and is isolated from CRM.
- Contact, WhatsApp, SMS, AI practice, guardian access, audio recording, and
  transcript storage are separate consent concepts.
- No checkbox is preselected and no consent is inferred from a phone number.
- Session-only browser resume may contain answers but no contact identity.

## Events

Approved event names for later server/analytics implementation:

- `diagnostic_started`
- `diagnostic_question_answered`
- `diagnostic_question_skipped`
- `diagnostic_block_entered`
- `diagnostic_review_opened`
- `diagnostic_completed`
- `diagnostic_result_viewed`
- `diagnostic_claim_started`
- `diagnostic_claim_completed`
- `diagnostic_advisor_requested`
- `study_buddy_trial_started`
- `study_buddy_trial_completed`

Do not include raw answers, writing text, audio, or transcripts in generic
analytics or CRM event payloads.

## Explicit non-goals for the MIS-337 staging slice

- No final academic scoring rule.
- No passwordless account or guardian verification backend.
- No CRM write.
- No external AI provider call.
- No raw audio or transcript retention.
- No production promotion or branded-domain launch.
