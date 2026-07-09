# AI study buddy architecture boundary

Linear issue: MIS-275

This slice defines the safe backend/API contract for a future AI study buddy and
speech-practice feature. It does not call any LLM provider, does not store raw
audio or transcripts, and does not write to AIT CRM.

## MVP use cases

- Pronunciation drill
- Conversation roleplay
- Lesson review
- Vocabulary quiz

## Provider boundary

The browser must not call an LLM provider directly. Portal UI should call a
backend/API boundary. The backend owns:

- auth and access checks;
- rate limits and cost controls;
- prompt/context selection;
- provider/model choice;
- safety/moderation checks;
- CRM-safe summary logging.

The current route `/api/portal/ai-study-buddy` returns a safe plan only. Provider
calls are disabled until a provider/model decision is approved.

## Privacy boundary

Raw audio and raw transcripts remain blocked. The only CRM-safe default event is
a practice started/completed summary with topic/use case, progress state, and
whether escalation is needed.

## Escalation

Escalation reasons currently modeled:

- low score;
- repeated mispronunciation;
- student confusion;
- safety concern;
- teacher requested.

Future implementation should create a teacher/advisor review task in AIT CRM
only through the approved MIS-277 CRM adapter and after MIS-279 consent/retention
requirements are finalized.
