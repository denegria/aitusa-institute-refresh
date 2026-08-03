import { permanentRedirect } from "next/navigation";
import { programs } from "../../../../src/content";

export function generateStaticParams() {
  return programs.map((program) => ({ slug: program.slug }));
}

export default async function EnglishCourseAlias({ params }) {
  const { slug } = await params;
  permanentRedirect(`/cursos/${slug}/`);
}
