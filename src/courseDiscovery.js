// Comparison copy condensed from each published program's detail and FAQ.
// Unknown logistics stay explicit; these are not new promises or availability.
export const catalogChoices = [
  { key: "english-paths", label: "Inglés", goal: "Hablar inglés con confianza", description: "Compara presencial en Nueva Jersey, híbrido y online.", icon: "messages-square" },
  { key: "academic-support", label: "GED y matemáticas", goal: "Avanzar en mis estudios", description: "Preparación GED y tutorías para una meta académica concreta.", icon: "graduation-cap" },
  { key: "digital-technical", label: "Computación", goal: "Usar mejor la computadora", description: "Desde lo básico hasta Word, Excel y PowerPoint para oficina.", icon: "laptop" },
  { key: "additional-languages", label: "Español", goal: "Aprender español", description: "Español online para extranjeros, según tu nivel y objetivo.", icon: "languages" },
];

export function normalizeCatalogGroup(value) {
  return catalogChoices.some((choice) => choice.key === value) ? value : "all-offerings";
}

export function catalogHref(group = "all-offerings", slug = "") {
  const key = normalizeCatalogGroup(group);
  const query = key === "all-offerings" ? "" : `?grupo=${key}`;
  return `/cursos/${query}${slug ? `#curso-${encodeURIComponent(slug)}` : ""}`;
}

export const courseComparison = {
  "ingles-jovenes-adultos": {
    fit: "Jóvenes y adultos que quieren practicar cara a cara.",
    format: "Presencial · Nueva Jersey. Confirma sede y grupo.",
    duration: "Según nivel inicial, frecuencia y práctica; sin plazo único.",
    requirements: "Evaluación inicial para orientar tu nivel y grupo.",
    interest: "ingles-presencial",
  },
  "ingles-hibrido-adultos": {
    fit: "Quienes necesitan combinar encuentros presenciales y apoyo remoto.",
    format: "Nueva Jersey + remoto. Alternancia a confirmar con el grupo.",
    duration: "Confirma una ruta según tu nivel y disponibilidad.",
    requirements: "Evaluación inicial; confirma sede y acceso remoto.",
    interest: "ingles-hibrido",
  },
  "ingles-online-adultos": {
    fit: "Adultos que buscan practicar inglés en vivo a distancia.",
    format: "Online en vivo. Confirma país, zona horaria y grupo.",
    duration: "Confirma una ruta según tu nivel y frecuencia.",
    requirements: "Evaluación inicial y conexión estable; confirma equipo.",
    interest: "ingles-online",
  },
  ged: {
    fit: "Personas que buscan prepararse para el examen GED.",
    format: "Presencial · confirma sede y bloque disponible.",
    duration: "6 meses estimados; depende de tu base y práctica, sin garantía de aprobación.",
    requirements: "Confirma tu base académica y, por separado, elegibilidad para el examen oficial.",
    interest: "ged",
  },
  "tutorias-matematicas": {
    fit: "Estudiantes con una duda, materia o meta académica puntual.",
    format: "Presencial u online, según materia y disponibilidad.",
    duration: "Sesiones a coordinar según el tema y la meta.",
    requirements: "Comparte materia, nivel, material y fecha objetivo.",
    interest: "otro",
  },
  "computacion-basica": {
    fit: "Principiantes que quieren realizar tareas digitales con autonomía.",
    format: "Sede y modalidad por confirmar con admisiones.",
    duration: "Por confirmar; no hay un plazo publicado.",
    requirements: "Desde cero. Confirma equipo y sistema Windows o Mac.",
    interest: "computacion",
  },
  "computacion-oficina": {
    fit: "Quienes quieren crear documentos, hojas de cálculo y presentaciones.",
    format: "Sede y modalidad por confirmar con admisiones.",
    duration: "Word y PowerPoint: 4 semanas cada uno; Excel: 8. Estimaciones por módulo.",
    requirements: "Confirma módulo, conocimientos previos, equipo y versión de software.",
    interest: "computacion",
  },
  "espanol-extranjeros": {
    fit: "Personas que quieren usar el español en la vida diaria, estudios o trabajo.",
    format: "Online · grupo y horario según país y disponibilidad.",
    duration: "Según nivel, frecuencia y objetivo; sin plazo garantizado.",
    requirements: "Comparte tu experiencia previa y confirma plataforma y equipo.",
    interest: "espanol",
  },
};

export function courseInquiryHref(baseHref, title) {
  const url = new URL(baseHref);
  url.searchParams.set("text", `Hola AIT USA, quiero orientación sobre ${title}. Quisiera confirmar costo, duración, requisitos, materiales, modalidad, sede y próximo grupo disponible.`);
  return url.toString();
}
