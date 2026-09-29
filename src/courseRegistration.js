const IN_PERSON_PROGRAMS = new Set([
  "ged", "tutorias-matematicas", "computacion-basica", "computacion-oficina",
]);

export function courseRegistrationAction(slug) {
  if (slug === "espanol-extranjeros") {
    return { label: "Inscribirme online", href: "/inscribete/?curso=espanol-extranjeros", mode: "online" };
  }
  if (IN_PERSON_PROGRAMS.has(slug)) {
    return { label: "Inscribirme presencial", href: `/inscribete/?curso=${encodeURIComponent(slug)}`, mode: "in_person" };
  }
  if (["ingles-jovenes-adultos", "ingles-hibrido-adultos", "ingles-online-adultos"].includes(slug)) {
    return { label: "Inscribirme", href: `/inscribete/?curso=${encodeURIComponent(slug)}`, mode: slug === "ingles-online-adultos" ? "online" : slug === "ingles-hibrido-adultos" ? "hybrid" : "in_person" };
  }
  return null;
}
