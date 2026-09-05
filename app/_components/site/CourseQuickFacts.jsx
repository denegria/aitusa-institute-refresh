import { courseComparison } from "../../../src/courseDiscovery";

export function CourseQuickFacts({ slug }) {
  const facts = courseComparison[slug];
  if (!facts) return null;
  return (
    <dl className="course-quick-facts">
      <div><dt>Dónde y cómo</dt><dd>{facts.format}</dd></div>
      <div><dt>Duración</dt><dd>{facts.duration}</dd></div>
      <div><dt>Para empezar</dt><dd>{facts.requirements}</dd></div>
    </dl>
  );
}
