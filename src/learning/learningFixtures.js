export const LEARNING_CONTENT_TYPES = Object.freeze([
  "lesson_recap",
  "video_module",
  "handout_link",
  "homework",
]);

export const LEARNING_FIXTURES = Object.freeze({
  modules: Object.freeze([
    Object.freeze({
      moduleRef: "module_fixture_esl_101_week_1",
      courseRef: "course_fixture_esl_101",
      sectionRef: "section_fixture_english_101",
      sessionRef: "session_fixture_english_101_001",
      title: "Week 1: Daily introductions",
      status: "published",
      publishedAt: "2026-07-02T14:00:00.000Z",
      content: Object.freeze([
        Object.freeze({
          contentRef: "content_fixture_recap_001",
          type: "lesson_recap",
          title: "Class recap",
          summary: "Practice greetings, personal details, and short workplace introductions.",
          estimatedMinutes: 5,
        }),
        Object.freeze({
          contentRef: "content_fixture_video_001",
          type: "video_module",
          title: "Pronunciation drill: name and job",
          summary: "Short fixture video module for repetition practice.",
          videoRef: "video_fixture_intro_drill_001",
          estimatedMinutes: 12,
        }),
        Object.freeze({
          contentRef: "content_fixture_handout_001",
          type: "handout_link",
          title: "Graphic Concept worksheet",
          summary: "Downloadable worksheet placeholder for classroom review.",
          href: "/portal/fixtures/handouts/graphic-concept-week-1.pdf",
          estimatedMinutes: 10,
        }),
        Object.freeze({
          contentRef: "content_fixture_homework_001",
          type: "homework",
          title: "Homework",
          summary: "Record three introduction sentences and review vocabulary list.",
          dueAt: "2026-07-05T03:59:00.000Z",
          estimatedMinutes: 20,
        }),
      ]),
    }),
    Object.freeze({
      moduleRef: "module_fixture_esl_101_week_2_draft",
      courseRef: "course_fixture_esl_101",
      sectionRef: "section_fixture_english_101",
      sessionRef: "session_fixture_english_101_002",
      title: "Week 2: Directions and errands",
      status: "draft",
      publishedAt: null,
      content: Object.freeze([
        Object.freeze({
          contentRef: "content_fixture_recap_002",
          type: "lesson_recap",
          title: "Draft recap",
          summary: "This draft should not be visible to students.",
          estimatedMinutes: 5,
        }),
      ]),
    }),
  ]),
});
