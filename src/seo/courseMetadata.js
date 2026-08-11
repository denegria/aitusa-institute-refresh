const courseMetaDescriptionSuffixes = Object.freeze({
  "ingles-jovenes-adultos": " Más información en AiT USA.",
  "ingles-hibrido-adultos": " Revisa horarios y modalidad con AiT USA.",
  "ingles-online-adultos": " Conoce la modalidad, horarios y ruta de admisión en AiT USA.",
  "espanol-extranjeros": " Consulta modalidad, horarios y siguiente paso con AiT USA.",
  ged: " Confirma áreas, modalidad, horarios y preparación con AiT USA.",
  "tutorias-matematicas": " Coordina materia, modalidad, horarios y apoyo académico con AiT USA Institute.",
  "computacion-basica": " Consulta modalidad, horarios y ruta de inicio con AiT USA.",
  "computacion-oficina": " Revisa módulos, modalidad y horarios con AiT USA Institute antes de inscribirte.",
});

export function getCourseMetaDescription(program) {
  const suffix = courseMetaDescriptionSuffixes[program.slug] || " Más información en AiT USA.";
  const description = `${program.summary.trim()}${suffix}`;
  if (description.length <= 160) return description;
  return `${description.slice(0, 157).trimEnd()}...`;
}
