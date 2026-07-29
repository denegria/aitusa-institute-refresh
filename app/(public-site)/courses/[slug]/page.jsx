import { notFound } from "next/navigation";
import { CoursesPage, getCourseMetadata } from "../../../_components/site/CoursesPage";
import { programs, site } from "../../../../src/content";

export function generateStaticParams() {
  return programs.map((program) => ({ slug: program.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return getCourseMetadata(slug) || {};
}

export default async function CourseDetailPage({ params }) {
  const { slug } = await params;
  const program = programs.find((item) => item.slug === slug);
  if (!program) notFound();

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: program.title,
    description: program.summary,
    provider: {
      "@type": "EducationalOrganization",
      name: site.name,
      url: site.canonical,
    },
    courseMode: program.mode,
    educationalCredentialAwarded: "Recomendación académica inicial",
    url: new URL(`/courses/${program.slug}/`, site.canonical).toString(),
  };

  return (
    <>
      <script data-schema="course" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />
      <CoursesPage selectedSlug={slug} />
    </>
  );
}
