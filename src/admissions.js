import { programs } from "./content.js";
import { courseComparison } from "./courseDiscovery.js";

// Public course labels remain distinct even when CRM interests share a category.
export const admissionOptions = programs.map(({ slug, title }) => ({ slug, title }));

export function admissionContext(value) {
  const program = typeof value === "string" && admissionOptions.find(({ slug }) => slug === value);
  return program
    ? { ...program, interest: courseComparison[program.slug].interest }
    : { slug: "orientacion", title: "Necesito ayuda para elegir", interest: "otro" };
}

export function contactCourseHref(value) {
  const { slug } = admissionContext(value);
  return slug === "orientacion" ? "/contactanos/" : `/contactanos/?curso=${encodeURIComponent(slug)}`;
}

export function admissionMessage(value, question = "") {
  const { title } = admissionContext(value);
  return [`Curso de interés: ${title}.`, String(question).trim()].filter(Boolean).join("\n").slice(0, 800);
}
