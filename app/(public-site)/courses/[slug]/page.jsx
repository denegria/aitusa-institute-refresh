import { permanentRedirect } from "next/navigation";
import { programs, retiredCourseSlugs } from "../../../../src/content";

export function generateStaticParams() {
  return programs.map((program) => ({ slug: program.slug }));
}

export default async function EnglishCourseAlias({ params }) {
  const { slug } = await params;
  if (retiredCourseSlugs.has(slug)) permanentRedirect("/cursos/");
  permanentRedirect(`/cursos/${slug}/`);
}
