import { notFound } from "next/navigation";
import { CourseProgramPage } from "../../../_components/site/CourseProgramPage";
import { CoursesPage, getCourseMetadata } from "../../../_components/site/CoursesPage";
import { programs, site } from "../../../../src/content";

export function generateStaticParams() {
  return programs.map((program) => ({ slug: program.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return getCourseMetadata(slug) || {};
}

function buildCourseSchema(program) {
  const courseUrl = new URL(`/cursos/${program.slug}/`, site.canonical).toString();
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${courseUrl}#course`,
    name: program.title,
    description: program.summary,
    provider: {
      "@type": "EducationalOrganization",
      name: site.name,
      url: site.canonical,
    },
    url: courseUrl,
    hasCourseInstance: [buildCourseInstanceSchema(program, courseUrl)],
  };
}

function buildCourseLocations(program, courseUrl) {
  const mode = program.mode.toLowerCase();
  const hasPhysicalLocation = mode.includes("presencial");
  const hasVirtualLocation = mode.includes("online") || mode.includes("remoto");
  const physicalLocations = site.locations.map((location) => ({
    "@type": "Place",
    name: `${location.addressLocality}, ${location.addressRegion}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: location.streetAddress,
      addressLocality: location.addressLocality,
      addressRegion: location.addressRegion,
      postalCode: location.postalCode,
      addressCountry: location.addressCountry,
    },
  }));
  const virtualLocation = {
    "@type": "VirtualLocation",
    name: "Clases online",
    url: courseUrl,
  };

  if (hasPhysicalLocation && hasVirtualLocation) return [...physicalLocations, virtualLocation];
  if (hasVirtualLocation) return virtualLocation;
  return physicalLocations;
}

function buildCourseSchedule(program) {
  const schedule = program.editorial?.schedule || [];
  return {
    "@type": "Schedule",
    name: "Horarios publicados",
    description: schedule
      .map(({ label, times }) => `${label}: ${times.join("; ")}`)
      .join(". "),
    scheduleTimezone: "America/New_York",
  };
}

function buildCourseInstanceSchema(program, courseUrl) {
  return {
    "@type": "CourseInstance",
    "@id": `${courseUrl}#course-instance`,
    courseMode: program.mode,
    location: buildCourseLocations(program, courseUrl),
    courseSchedule: buildCourseSchedule(program),
  };
}

function buildBreadcrumbSchema(program) {
  const courseUrl = new URL(`/cursos/${program.slug}/`, site.canonical).toString();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Cursos",
        item: new URL("/cursos/", site.canonical).toString(),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: program.title,
        item: courseUrl,
      },
    ],
  };
}

function buildFaqSchema(program) {
  const faqs = program.editorial?.faqs || [];
  if (!faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export default async function CourseDetailPage({ params }) {
  const { slug } = await params;
  const program = programs.find((item) => item.slug === slug);
  if (!program) notFound();

  const courseSchema = buildCourseSchema(program);
  const breadcrumbSchema = buildBreadcrumbSchema(program);
  const faqSchema = buildFaqSchema(program);

  return (
    <>
      <script data-schema="course" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />
      <script data-schema="breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema ? (
        <script data-schema="faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      ) : null}
      {program.editorial ? <CourseProgramPage program={program} /> : <CoursesPage />}
    </>
  );
}
