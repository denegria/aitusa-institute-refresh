# AIT USA Placement Diagnostic V2 Contract

Status: product direction approved; academic scoring approval pending  
Contract version: `aitusa-placement-v2-draft-2026-07-30`  
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
  - a Book 1 → Book 2 → Book 3 path with copy such as
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

The following remain blocked on AIT academic approval:

- final answer key;
- question-to-level mapping confirmation;
- pass threshold for each level block;
- stopping/continuation rules, if any;
- borderline/advisor-review policy;
- public level names and result copy;
- any CEFR equivalence claim.

Until that approval lands, staging may show only the existing explicitly
provisional recommendation with `answerKeyStatus=pending_academic_review`.
Production launch cannot treat that preview as the final academic model.

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

The first staging implementation may use session-only browser resume while the
server-owned anonymous-attempt service and retention policy remain blocked.
It must not claim durable resume, account creation, or CRM delivery.

## Data and consent boundaries

- Raw answers, writing samples, and Study Buddy transcripts do not go to CRM.
- Initial staging delivery keeps CRM writes and storage disabled.
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

## Explicit non-goals for the first staging slice

- No final academic scoring rule.
- No durable anonymous-attempt database.
- No passwordless account or guardian verification backend.
- No CRM write.
- No external AI provider call.
- No raw audio or transcript retention.
- No production promotion or branded-domain launch.
