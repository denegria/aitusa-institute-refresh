const asset = (name) => `./public/assets/wix/${name}`;
const assetHires = (name) => asset(`hires/${name}`);

const site = {
  name: "AiT USA Institute",
  legal: "Division of Arrieta Institute LLC",
  tagline: "Habla inglés con confianza desde la primera clase, con práctica real y guía humana.",
  description:
    "Clases presenciales, híbridas y online en Nueva Jersey para hablar inglés con más seguridad: conversación guiada, método visual y seguimiento semanal para avanzar desde hoy.",
  heroHeadline:
    "Empieza a hablar inglés con más seguridad desde la primera semana con un método visual, guiado y pensado para resultados reales.",
  heroLead:
    "Entrena con sesiones en vivo, retroalimentación inmediata y tareas orientadas a contexto para que avances con una ruta clara, sin perder tiempo en memorizar sin contexto.",
  heroQuote:
    "No se trata de memorizar más. Se trata de comunicarte con soltura en entrevistas, universidad, trabajo y vida cotidiana.",
  canonical: "https://www.aitusainstitute.com/",
  founded: "2004",
  phone: "+1 732-271-0011",
  phoneHref: "tel:+17322710011",
  whatsapp: "+1 732-379-0593",
  whatsappHref: "https://wa.me/17323790593",
  emailHref:
    "mailto:info@aitusainstitute.com?subject=Informaci%C3%B3n%20sobre%20clases%20AiT%20USA%20Institute",
  facebookHref: "https://www.facebook.com/aitusainstitute/",
  originalSite: "https://www.aitusainstitute.com/",
  forms: {
    level:
      "https://docs.google.com/forms/d/1B_rhVh4lmOIySRtOTOs1rrjas7vns9zRzamncquwcQg/edit?pli=1",
    offer:
      "https://docs.google.com/forms/d/1YurGiSiF03j2WZm2eABawja6FJ_8q5RrowbyQML_yN8/edit",
    registration:
      "https://docs.google.com/forms/d/e/1FAIpQLSensXqOZWJD6is9dnGIJe-gooMJEdR4rf2xdClVYW9as1cbFg/viewform?usp=sf_link",
  },
  images: {
    logo: asset("006-solo-logo-4-x-4-clases1.png"),
    hero: "./public/assets/wix/live/hero-female-teacher.jpg",
    heroPoster: "./public/assets/wix/live/hero-female-teacher.jpg",
    heroVideo: asset("live/hero-female-speaking-360p.mp4"),
    heroVideoPortrait: asset("live/hero-female-speaking-1080p.mp4"),
    heroVideoFallback: asset("live/hero-female-speaking-360p.mp4"),
    heroVideoPoster: "./public/assets/wix/live/hero-female-teacher.jpg",
    adultEnglish: assetHires("adult-english-speaking.jpg"),
    onlineEnglish: assetHires("online-instructor-headset.jpg"),
    kidsEnglish: assetHires("kids-online-class.jpg"),
    computing: asset("081-laptop-work.jpg"),
    office: asset("085-cursos-2520de-2520oficina-edited-edited.jpg"),
    repair: asset("089-reparacion-de-computadoras.jpg"),
    spanish: asset("091-spanish-classes.jpg"),
    ged: asset("093-ged-classes.png"),
    math: asset("095-math-class.jpg"),
    method: assetHires("graphic-concept-method.jpg"),
    tutoring: assetHires("tutoring-session.jpeg"),
    level: assetHires("english-levels.jpg"),
    scholarship: assetHires("scholarships.jpg"),
    contact: asset("153-f0e785-fd00796923204eefa8fc070811dd7598f000.jpg"),
    headset: asset("169-audifono-y-microfono.jpg"),
    devices: asset("171-laptop-and-phonhe-3.jpg"),
    testimonialAntonina: "./public/assets/wix/hires/testimonial-antonina-1200.jpg",
    testimonialMarisol: "./public/assets/wix/hires/testimonial-marisol-1200.jpg",
    productEuropa: asset("products/product-europa-mes-4weeks.jpg"),
    productLibro: asset("products/product-libro.jpg"),
    productRegistrationBook: asset("products/product-registracion-y-libro.jpg"),
    productRegistration: asset("products/product-solo-registracion-pago-unico.jpg"),
    productProgramming: asset("products/product-cursos-de-programming.jpg"),
    productLatam: asset("products/product-latinoamerica-mes-4-weeks.jpg"),
    productGed: asset("products/product-ged.jpg"),
    productComputing: asset("products/product-computacion.jpg"),
  },
};

const nav = [
  ["Inicio", "inicio"],
  ["Ruta", "ruta"],
  ["Experiencia", "experiencia"],
  ["Cursos", "cursos"],
  ["Método", "metodo"],
  ["Libros", "libros"],
  ["Horarios", "horarios"],
  ["Sedes", "sedes"],
  ["FAQ", "faq"],
  ["Contacto", "contacto"],
];

const heroPoints = [
  "Sesiones en vivo con docentes bilingües que corrigen en tiempo real para que ganes soltura desde tu primera práctica.",
  "Método visual que convierte estructura y vocabulario en conversaciones reales para comunicarte con más claridad.",
  "Tareas breves de práctica semanal para que avances aunque tu agenda esté llena.",
];

const heroStartPath = [
  "Agenda una clase de muestra por WhatsApp con el horario que prefieras.",
  "Recibe un diagnóstico inicial y tu plan de arranque en minutos.",
  "Empieza en tu formato ideal, presencial, híbrido u online, sin perder ritmo.",
];

const heroSignal = [
  {
    value: "20+",
    label: "años guiando estudiantes con resultados visibles.",
  },
  {
    value: "100%",
    label: "práctica guiada para convertir el miedo en acción.",
  },
  {
    value: "3",
    label: "formatos disponibles para estudiar con flexibilidad.",
  },
];

const launchPath = [
  {
    title: "Evaluación diagnóstica y objetivo semanal",
    description:
      "Te explicamos tu nivel actual en 10 minutos y te proponemos un plan de 21 días adaptado a tus horarios y metas inmediatas.",
    outcome: "Terminas esta semana con una ruta personal y tareas concretas para empezar a hablar.",
  },
  {
    title: "Práctica guiada con retroalimentación en vivo",
    description:
      "Entrenas conversaciones reales en clase con correcciones puntuales para que conviertas teoría en respuesta inmediata.",
    outcome: "Tu confianza en reuniones, entrevistas y clase mejora desde la segunda semana.",
  },
  {
    title: "Seguimiento de progreso semanal",
    description:
      "Con tu coach de ruta revisamos avances, detectamos obstáculos y ajustamos tareas de micro-práctica.",
    outcome: "Recibes evidencia de mejora para que continúes con disciplina y constancia.",
  },
];

const stats = [
  { value: "+1000", label: "estudiantes guiados por enfoque práctico" },
  { value: "3", label: "formatos para estudiar: presencial, híbrido y online" },
  { value: "GC", label: "Método Graphic Concept, claro, visual y efectivo" },
  { value: "20+", label: "años construyendo una ruta de confianza en inglés" },
];

const differentiators = [
  {
    title: "Comprender primero, hablar después",
    text:
      "Conecta ideas, intención y contexto. Los estudiantes avanzan más cuando entienden significado, luego convierten esa comprensión en oralidad natural.",
  },
  {
    title: "Hablar con estructura visual",
    text:
      "Graphic Concept traduce reglas y patrones a mapas visuales memorables, para que cada respuesta sea rápida, precisa y con menos errores.",
  },
  {
    title: "Acompañamiento que impulsa resultados",
    text:
      "Seguimiento semanal, tutorías y ajustes de ruta para crear hábitos de inglés con continuidad real, sin abandono a mitad de camino.",
  },
];

const learningOutcomes = [
  {
    title: "Comprensión rápida",
    text: "Empiezas viendo estructura y contexto, no listas aisladas de vocabulario.",
  },
  {
    title: "Habla guiada",
    text: "Cada clase incluye repetición oral con corrección inmediata y práctica real.",
  },
  {
    title: "Rutina sostenible",
    text: "Microtareas semanales para avanzar incluso si tu agenda es muy apretada.",
  },
  {
    title: "Seguimiento real",
    text: "Ajustamos nivel y ritmo según tu progreso, tu horario y tu meta actual.",
  },
];

const courseGuides = [
  {
    title: "Quiero hablar inglés con más seguridad",
    text: "Empieza por Inglés para jóvenes y adultos u online si quieres una ruta clara para conversación real.",
    href: "?curso=ingles#cursos",
  },
  {
    title: "Busco una opción para mi hijo o hija",
    text: "Inglés para niños está pensado para 8 a 13 años con apoyo visual y seguimiento familiar.",
    href: "?curso=ninos#cursos",
  },
  {
    title: "Necesito apoyo académico o técnico",
    text: "GED, matemáticas y tecnología tienen rutas específicas para que avances con un objetivo concreto.",
    href: "?curso=academico#cursos",
  },
];

const programs = [
  {
    title: "Inglés para jóvenes y adultos",
    category: "ingles",
    mode: "Presencial, híbrido y online",
    audience: "Personas dentro de Estados Unidos",
    fit: "Ideal si quieres conversar con más seguridad en trabajo, escuela o trámites diarios.",
    image: site.images.adultEnglish,
    imageAlt: "Estudiante adulto practicando conversación en una clase de inglés ESL.",
    summary:
      "Un camino directo para hablar con confianza, entendiendo situaciones reales: trabajo, estudios, servicios y vida diaria.",
    details: [
      "Objetivo práctico: conversar y comprender con naturalidad en contexto real.",
      "Modalidad presencial o online para adaptarse a tu agenda.",
      "Talleres y tutorías con seguimiento de progreso semanal.",
    ],
  },
  {
    title: "Inglés online para jóvenes y adultos",
    category: "ingles",
    mode: "100% online",
    audience: "Personas fuera de Estados Unidos",
    fit: "Ideal si estudias desde otro país y necesitas sesiones en vivo con guía clara.",
    image: site.images.onlineEnglish,
    imageAlt: "Instructora con audífonos guiando una clase de inglés online.",
    summary:
      "Acceso desde cualquier país con sesiones en vivo y materiales visuales para avanzar más rápido.",
    details: [
      "Conexión desde laptop, tableta o móvil con conexión estable.",
      "Práctica guiada para hablar con menos miedo y más fluidez.",
      "Acompañamiento por WhatsApp para dudas de horarios y tareas.",
    ],
  },
  {
    title: "Inglés para niños",
    category: "ninos",
    mode: "100% online",
    audience: "Niños de 8 a 13 años",
    fit: "Ideal para familias que quieren práctica visual y acompañamiento constante.",
    image: site.images.kidsEnglish,
    imageAlt: "Madre acompañando a su hija durante una clase de inglés online.",
    summary:
      "Aprendizaje divertido y práctico para que niños de 8 a 13 años comprendan y hablen en inglés.",
    details: [
      "Ruta por niveles con metas claras y actividades de uso diario.",
      "Informes mensuales para padres con mejoras concretas.",
      "Inscripción guiada para definir nivel y horario ideal.",
    ],
  },
  {
    title: "Español para extranjeros",
    category: "idiomas",
    mode: "Online",
    audience: "Estudiantes que desean aprender español",
    fit: "Ideal si quieres moverte con más seguridad en contextos de estudio y trabajo.",
    image: site.images.spanish,
    imageAlt: "Estudiantes conversando durante una clase de español para extranjeros.",
    summary:
      "Clases de español conversacional para moverse con más seguridad en estudio y trabajo.",
    details: [
      "Enfoque en comunicación útil para contextos reales.",
      "Profesores de Colombia y Perú con seguimiento práctico.",
      "Horarios flexibles y acompañamiento por WhatsApp.",
    ],
  },
  {
    title: "GED",
    category: "academico",
    mode: "Presencial",
    audience: "Adultos que buscan equivalencia de High School",
    fit: "Ideal si buscas avanzar hacia el diploma equivalente a High School con ruta guiada.",
    image: site.images.ged,
    imageAlt: "Material visual para preparación del examen GED.",
    summary:
      "Acompañamiento estructurado para avanzar hacia el diploma equivalente a High School.",
    details: [
      "Acompañamiento académico por módulos de alto impacto.",
      "Orientación inicial por WhatsApp para elegir formato y ruta.",
      "Modalidad presencial u online según disponibilidad.",
    ],
  },
  {
    title: "Tutorías en matemáticas",
    category: "academico",
    mode: "Presencial u online",
    audience: "Secundaria y universidad",
    fit: "Ideal cuando necesitas recuperar ritmo y aclarar temas críticos sin perder tiempo.",
    image: site.images.math,
    imageAlt: "Estudiante recibiendo apoyo en una tutoría de matemáticas.",
    summary:
      "Refuerzos cortos y focalizados para recuperar ritmo en secuencia académica.",
    details: [
      "Plan de recuperación para problemas críticos de escuela y universidad.",
      "Nivelación progresiva desde la práctica guiada.",
      "Horario coordinado según disponibilidad.",
    ],
  },
  {
    title: "Computación básica",
    category: "tecnologia",
    mode: "Curso práctico",
    audience: "Principiantes",
    fit: "Ideal si quieres aprender desde cero a usar internet, archivos y herramientas básicas.",
    image: site.images.computing,
    imageAlt: "Persona usando una laptop durante un curso básico de computación.",
    summary:
      "Curso práctico para dominar navegación, productividad y herramientas digitales esenciales.",
    details: [
      "Rutinas de uso diario de internet y archivos personales.",
      "Habilidades funcionales para estudiar y trabajar.",
      "Acompañamiento para estudiantes principiantes y adultos.",
    ],
  },
  {
    title: "Computación para oficina",
    category: "tecnologia",
    mode: "Herramientas de oficina",
    audience: "Trabajo y administración",
    fit: "Ideal si buscas mejorar productividad con Word, Excel y PowerPoint.",
    image: site.images.office,
    imageAlt: "Curso de herramientas de oficina como Word, Excel y PowerPoint.",
    summary:
      "Entrenamiento en Word, Excel y PowerPoint para productividad en vida real.",
    details: [
      "Plantillas listas para usar en trabajo, escuela y proyectos.",
      "Proyectos de práctica con documentos y presentaciones.",
      "Ruta desde nivel inicial hasta dominio funcional intermedio.",
    ],
  },
  {
    title: "Reparación de computadoras",
    category: "tecnologia",
    mode: "Curso técnico",
    audience: "Laptop y desktop",
    fit: "Ideal si te interesa soporte básico, diagnóstico y mantenimiento de equipos.",
    image: site.images.repair,
    imageAlt: "Componentes de computadora usados para un curso de reparación técnica.",
    summary:
      "Curso introductorio de diagnóstico, mantenimiento y soporte básico de equipos.",
    details: [
      "Diagnóstico inicial de problemas frecuentes en equipos.",
      "Mantenimiento básico para laptop y desktop.",
      "Acompañamiento para dudas rápidas y continuidad de curso.",
    ],
  },
];

const heroGallery = [
  {
    label: "Clase en vivo",
    title: "Corrección instantánea y conversación guiada para hablar con más claridad desde el primer bloque.",
    image: "./public/assets/wix/hires/hero-classroom.jpg",
    imageAlt:
      "Docente de AiT USA y estudiantes practicando inglés en una clase en vivo con enfoque visual.",
  },
  {
    label: "Atención con presencia",
    title: "Docentes bilingües corrigen en vivo para que avances con menos incertidumbre.",
    image: "./public/assets/wix/live/hero-female-teacher.jpg",
    imageAlt:
      "Instructora de AiT USA corrigiendo y motivando a una estudiante durante conversación oral.",
  },
  {
    label: "Escucha y retroalimentación",
    title: "Interacción real por Zoom para entrenar comprensión y respuesta en tiempo real.",
    image: "./public/assets/wix/live/hero-female-zoom.jpg",
    imageAlt:
      "Instructora de AiT USA interactuando con estudiantes en una sesión online de inglés.",
  },
  {
    label: "Práctica en contexto",
    title: "Aprendizaje flexible para practicar inglés desde cualquier lugar.",
    image: "./public/assets/wix/live/hero-female-classroom.jpg",
    imageAlt: "Grupo en clase presencial practicando conversación y pronunciación en inglés.",
  },
  {
    label: "Seguimiento semanal",
    title: "Ruta semanal con acciones claras para convertir práctica en hábito.",
    image: "./public/assets/wix/live/testimonial-marisol-live.jpg",
    imageAlt:
      "Instructora de AiT USA trabajando con una estudiante para mejorar la fluidez y la seguridad.",
  },
  {
    label: "Resultados reales",
    title: "Seguimiento de progreso con evidencia de resultados en cada módulo.",
    image: "./public/assets/wix/live/testimonial-antonina-live.jpg",
    imageAlt: "Estudiantes de AiT USA aplicando lo aprendido en clase de inglés.",
  },
];

const heroProof = [
  { value: "20+", label: "años de experiencia bilingüe" },
  { value: "1ª", label: "clase orientada a conversación real" },
  { value: "3", label: "formatos para estudiar: presencial, híbrido y online" },
];

const instructorClips = [
  {
    title: "Clase de entrevista en vivo",
    eyebrow: "Muestra real",
    image: "./public/assets/wix/live/hero-female-teacher.jpg",
    video: "./public/assets/wix/live/hero-female-speaking-1080p.mp4",
    videoPoster: "./public/assets/wix/live/hero-female-classroom.jpg",
    imageAlt:
      "Instructora de AiT USA guiando práctica de entrevista en una clase con método visual.",
    caption:
      "Simulación de entrevista con corrección instantánea para responder con intención y naturalidad.",
    duration: "1:08",
  },
  {
    title: "Escucha y responde al instante",
    eyebrow: "Metodología visual",
    image: "./public/assets/wix/live/hero-female-zoom.jpg",
    imageAlt: "Instructora y estudiante practicando inglés mediante Zoom con enfoque visual y conversación real.",
    caption:
      "Escucha guiada con pausas estratégicas para dominar respuestas rápidas y con significado, no solo pronunciación.",
    duration: "0:48",
  },
  {
    title: "Conexión auténtica en clases online",
    eyebrow: "8 a 13 años",
    image: "./public/assets/wix/live/testimonial-antonina-live.jpg",
    imageAlt:
      "Estudiante practicando inglés en una clase remota con acompañamiento de la instructora.",
    caption:
      "Conversación guiada para recuperar estructura, ganar espontaneidad y hablar con más seguridad.",
    duration: "0:38",
  },
  {
    title: "Respuesta guiada en clase",
    eyebrow: "Sesión de progreso",
    image: "./public/assets/wix/live/testimonial-marisol-live.jpg",
    imageAlt: "Instructora de AiT USA interactuando con estudiantes en una clase de inglés.",
    caption:
      "Estrategias y corrección puntual para pasar de comprender a comunicar ideas con mayor naturalidad.",
    duration: "0:50",
  },
];

const schedules = [
  {
    label: "Mañanas",
    times: ["8:30 am a 9:30 am", "9:30 am a 10:30 am", "10:30 am a 11:30 am"],
    bestFor: "Ideal para quienes quieren empezar el día con una rutina fija.",
  },
  {
    label: "Noches",
    times: ["6:20 pm a 7:30 pm", "7:30 pm a 8:40 pm", "8:40 pm a 9:50 pm"],
    bestFor: "Pensado para después del trabajo o de las clases escolares.",
  },
  {
    label: "Sábados",
    times: ["10:00 am a 1:00 pm", "3:00 pm a 5:30 pm"],
    bestFor: "Útil para quienes trabajan entre semana o tienen horarios variables.",
  },
  {
    label: "Domingos",
    times: ["10:00 am a 12:30 pm"],
    bestFor: "Buena opción para mantener continuidad sin afectar la semana laboral.",
  },
];

const modalities = [
  {
    title: "Presencial",
    text: "Asiste al horario elegido en una sede disponible.",
  },
  {
    title: "Híbrido",
    text:
      "Puedes venir en persona cuando puedas y conectarte online con tu grupo cuando no puedas llegar.",
  },
  {
    title: "Online",
    text:
      "Participas con tu profesor y compañeros completamente en línea desde cualquier lugar.",
  },
];

const methodBlocks = [
  {
    title: "Metodología GC",
    image: site.images.method,
    imageAlt: "Material del método Graphic Concept para aprender inglés de forma visual.",
    text:
      "Graphic Concept presenta el idioma con mapas visuales de tiempo verbal y funciones, para que hablar deje de ser memorizar.",
  },
  {
    title: "Tutorías",
    image: site.images.tutoring,
    imageAlt: "Sesión de tutoría académica individual.",
    text:
      "Apoyo presencial y virtual para reforzar dudas, nivelación y práctica intensiva.",
  },
  {
    title: "Niveles",
    image: site.images.level,
    imageAlt: "Material de niveles básico, intermedio y avanzado de inglés.",
    text:
      "Básico, intermedio y avanzado para una progresión clara desde comprensión a producción oral.",
  },
  {
    title: "Becas",
    image: site.images.scholarship,
    imageAlt: "Imagen promocional de becas para estudiantes destacados.",
    text:
      "Sistema de incentivos por asistencia, rendimiento y constancia para impulsar continuidad.",
  },
];

const books = [
  {
    title: "Introducción Plus",
    subtitle: "Libro introductorio de inglés",
    level: "Introductorio",
    image: asset("031-intro-book-portada.jpg"),
    text: "Aquí empieza la familiarización con el inglés y con la ruta académica del método.",
  },
  {
    title: "Paso Plus 1",
    subtitle: "Libro del estudiante",
    level: "Básico",
    image: asset("035-step-plus-1-portada.jpg"),
    text: "Introducción al método, la técnica y la estrategia.",
  },
  {
    title: "Paso Plus 2",
    subtitle: "Libro del estudiante",
    level: "Básico",
    image: asset("037-step-plus-2-portada.jpg"),
    text: "Continuación de la base visual para practicar patrones esenciales.",
  },
  {
    title: "Paso Plus 3",
    subtitle: "Libro del estudiante",
    level: "Intermedio",
    image: asset("039-step-plus-3-portada.jpg"),
    text: "Trabajo sobre tiempos presente, pasado y futuro.",
  },
  {
    title: "Paso Plus 4",
    subtitle: "Libro del estudiante",
    level: "Intermedio",
    image: asset("041-step-plus-4-portada.jpg"),
    text: "Refuerzo para usar los tiempos con mayor seguridad.",
  },
  {
    title: "Paso Plus 5",
    subtitle: "Libro del estudiante",
    level: "Avanzado",
    image: asset("043-step-plus-5-portada.jpg"),
    text: "Preparación para expresarse con más libertad.",
  },
  {
    title: "Paso Plus 6",
    subtitle: "Libro del estudiante",
    level: "Avanzado",
    image: asset("045-step-plus-6-portada.jpg"),
    text: "Cierre de ruta para estudiantes listos para avanzar.",
  },
];

const locations = [
  {
    city: "Bound Brook, New Jersey",
    address: "213 E. Main St., Bound Brook, NJ 08805",
    note: "Oficina central / sede principal",
    highlight: "Recepción principal y coordinación administrativa.",
  },
  {
    city: "Plainfield, New Jersey",
    address: "108 Watchung Ave., Plainfield, NJ 07060",
    note: "Sede presencial",
    highlight: "Acceso fácil para estudiantes del área central de Nueva Jersey.",
  },
  {
    city: "Piscataway, New Jersey",
    address: "451 S. Washington Ave., Piscataway, NJ 08854",
    note: "Sede presencial",
    highlight: "Buena opción para quienes buscan una sede amplia y práctica.",
  },
  {
    city: "Flemington, New Jersey",
    address: "Flemington, NJ, USA",
    note: "Confirmar detalles de sede",
    highlight: "Disponible según disponibilidad y coordinación previa.",
  },
  {
    city: "New York / Online",
    address: "Atención online",
    note: "Atención para clases en línea",
    highlight: "Conexión remota para estudiantes fuera de Nueva Jersey.",
  },
];

const testimonials = [
  {
    name: "Antonina Silvero y Zulma",
    image: site.images.testimonialAntonina,
    imageAlt: "Estudiantes de AiT USA Institute compartiendo su experiencia.",
    text:
      "Pensábamos que aprender inglés era difícil. Con este método gráfico empezamos a comprender y hablar con mucho más contexto y seguridad.",
  },
  {
    name: "Marisol Guardado",
    image: site.images.testimonialMarisol,
    imageAlt: "Estudiante de AiT USA Institute después de ganar confianza hablando inglés.",
    text:
      "Gracias a la guía diaria, gané confianza para escuchar, comprender y responder sin bloquearme.",
  },
];

const teachers = [
  "Profesoras y profesores bilingües con experiencia en enseñanza conversacional.",
  "Mentoría personalizada para convertir objetivos en hábitos de práctica diaria.",
  "Equipo con experiencia en distintos niveles, ritmos y zonas horarias.",
];

const trustHighlights = [
  {
    title: "Corrección real",
    text: "Docentes bilingües corrigen en vivo para que veas el avance desde la primera clase.",
  },
  {
    title: "Seguimiento continuo",
    text: "WhatsApp y orientación semanal para resolver dudas y no perder el ritmo.",
  },
  {
    title: "Horarios flexibles",
    text: "Presencial, híbrido y online para adaptarse a tu semana sin fricción.",
  },
];

const paymentGuides = [
  {
    title: "Quiero empezar a hablar inglés",
    text: "Empieza con la mensualidad o la combinación registración + libro si quieres una ruta completa.",
    cta: "Pedir orientación por WhatsApp",
  },
  {
    title: "Solo necesito material de estudio",
    text: "El libro individual funciona bien si ya estás en clase y quieres reforzar la ruta en casa.",
    cta: "Consultar este material",
  },
  {
    title: "Busco otra área académica o técnica",
    text: "GED, computación básica y oficina tienen su propio camino según tu objetivo inmediato.",
    cta: "Ver la opción correcta",
  },
];

const contactPrep = [
  {
    title: "Tu nivel",
    text: "Si no lo sabes, no pasa nada. Lo revisamos contigo en el primer contacto.",
  },
  {
    title: "Tu horario",
    text: "Nos ayuda a sugerirte un bloque realista de mañana, noche o fin de semana.",
  },
  {
    title: "Tu meta",
    text: "Trabajo, universidad, entrevista, niño/a o apoyo técnico: así afinamos la ruta.",
  },
];

const footerFacts = [
  {
    title: "Respuesta rápida",
    text: "Te contestamos por WhatsApp para avanzar con el siguiente paso sin perder tiempo.",
  },
  {
    title: "Horarios flexibles",
    text: "Mañanas, noches, sábados y domingos, con opciones presencial, híbrida y online.",
  },
  {
    title: "Sedes y online",
    text: "Nueva Jersey o distancia, según tu ubicación y el formato que mejor te funcione.",
  },
];

const downloads = [
  {
    title: "iPhone / iPad",
    text: "Acceso para dispositivos Apple con recursos y seguimiento de clases listos para usar.",
    image: asset("155-apple-20logo-edited.jpg"),
    imageAlt: "Logo de Apple para descarga en iPhone y iPad.",
  },
  {
    title: "Mac",
    text: "Acceso para Mac con materiales y herramientas de estudio optimizados para laptop.",
    image: asset("157-5bfb6f-c2ae26a3c5004bca9ea2b860a535f4ab.jpg"),
    imageAlt: "Logo de Apple para descarga en laptop Mac.",
  },
  {
    title: "Android",
    text: "Acceso para teléfono o tableta Android con práctica y seguimiento desde cualquier lugar.",
    image: asset("161-android-logo.png"),
    imageAlt: "Logo de Android para descarga de aplicación.",
  },
  {
    title: "Windows",
    text: "Acceso para usuarios de Windows con seguimiento de clases y recursos listos para continuar.",
    image: asset("163-window-logo.jpg"),
    imageAlt: "Logo de Windows para descarga de aplicación.",
  },
];

const requirements = [
  {
    title: "Audífono y micrófono",
    image: site.images.headset,
    imageAlt: "Audífonos con micrófono para clases online.",
    text: "Recomendado para escuchar mejor, hablar con claridad y evitar interferencias.",
  },
  {
    title: "Dispositivo con internet",
    image: site.images.devices,
    imageAlt: "Laptop y teléfono para conectarse a clases online.",
    text: "Laptop, desktop, tableta o teléfono con conexión estable.",
  },
];

const storeProducts = [
  {
    title: "Europa - mensualidad",
    price: "$175.00",
    status: "Disponible",
    sku: "",
    image: site.images.productEuropa,
    imageAlt: "Plan Europa mensual para clases de inglés online.",
    bestFor: "Ideal para estudiantes en Europa que quieren estudiar 100% online.",
    note:
      "Plan 100% online para estudiantes en Europa, con pago y acceso coordinados por WhatsApp.",
    variants: [],
  },
  {
    title: "Libro de estudio",
    price: "$55.00",
    status: "Disponible",
    sku: "",
    image: site.images.productLibro,
    imageAlt: "Libro físico de AiT USA Institute para estudiantes de inglés.",
    bestFor: "Ideal si ya estás inscrito y solo necesitas el material de estudio.",
    note:
      "Libro físico para clases presenciales u online dentro de Estados Unidos; fuera de USA se coordina la versión digital por WhatsApp.",
    variants: [],
  },
  {
    title: "Registración + libro",
    price: "$95.00",
    status: "Disponible",
    sku: "",
    image: site.images.productRegistrationBook,
    imageAlt: "Paquete de registración y libro para clases de inglés.",
    bestFor: "Recomendado para comenzar una ruta nueva con seguimiento completo.",
    note:
      "Paquete de registración más libro para iniciar el curso y mantener la ruta de seguimiento.",
    variants: [
      { name: "Online", price: "$95.00" },
      { name: "Presencial", price: "$95.00" },
    ],
  },
  {
    title: "Solo registración",
    price: "$55.00",
    status: "Disponible",
    sku: "",
    image: site.images.productRegistration,
    imageAlt: "Opciones de solo registración para clases de inglés.",
    bestFor: "Ideal si solo necesitas asegurar tu cupo en el nivel correcto.",
    note:
      "Pago único de registración para niveles básico, intermedio y avanzado, disponible online o presencial.",
    variants: [
      { name: "Básico | Online", price: "$55.00" },
      { name: "Intermedio | Online", price: "$55.00" },
      { name: "Avanzado | Online", price: "$55.00" },
      { name: "Básico | Presencial", price: "$55.00" },
      { name: "Intermedio | Presencial", price: "$55.00" },
      { name: "Avanzado | Presencial", price: "$55.00" },
    ],
  },
  {
    title: "Cursos de programación",
    price: "$3,500.00",
    status: "Disponible",
    sku: "",
    image: site.images.productProgramming,
    imageAlt: "Paquete de cursos de programación, diseño y reparación de computadoras.",
    bestFor: "Perfecto para estudiantes que buscan formación técnica con salida laboral.",
    note:
      "Cursos online de tres meses: diseño gráfico, diseño web y reparación de computadoras y redes, con opciones de inicio mensual.",
    variants: [
      { name: "Diseño gráfico", price: "$3,500.00" },
      { name: "Diseño web", price: "$3,500.00" },
      { name: "Reparación de computadoras y redes", price: "$2,400.00" },
    ],
  },
  {
    title: "Latinoamérica - mensualidad",
    price: "$145.00",
    status: "Disponible",
    sku: "364215376135191",
    image: site.images.productLatam,
    imageAlt: "Plan Latinoamérica mensual para clases de inglés online.",
    bestFor: "Ideal para estudiantes de Latinoamérica que quieren avanzar cada mes.",
    note:
      "Mensualidad cada 4 semanas para niveles básico, intermedio y avanzado, con opciones online y presencial.",
    variants: [
      { name: "Básico | Online | Mensual", price: "$145.00" },
      { name: "Intermedio | Online | Mensual", price: "$145.00" },
      { name: "Avanzado | Online | Mensual", price: "$145.00" },
      { name: "Básico | Presencial | Mensual", price: "$145.00" },
      { name: "Intermedio | Presencial | Mensual", price: "$145.00" },
      { name: "Avanzado | Presencial | Mensual", price: "$145.00" },
    ],
  },
  {
    title: "Preparación GED",
    price: "$240.00",
    status: "Disponible",
    sku: "364215375135191",
    image: site.images.productGed,
    imageAlt: "Programa GED para preparación académica.",
    bestFor: "Pensado para adultos que buscan completar equivalencia de High School.",
    note:
      "Curso estimado de seis meses, con dos clases de una hora por semana, horario de sábados y seguimiento de progreso.",
    variants: [],
  },
  {
    title: "Computación básica y oficina",
    price: "$325.00",
    status: "Disponible",
    sku: "364115376135191",
    image: site.images.productComputing,
    imageAlt: "Programa de computación para cursos básicos y de oficina.",
    bestFor: "Ideal para principiantes que necesitan habilidades de computadora y oficina.",
    note:
      "Cursos básicos de internet, Mac o Windows, más cursos de oficina en Word, Excel y PowerPoint con horarios de mañana, tarde y noche.",
    variants: [
      { name: "Internet", price: "$325.00" },
      { name: "Mac o Windows", price: "$325.00" },
      { name: "Microsoft Office", price: "$325.00" },
    ],
  },
];

const faqs = [
  {
    question: "¿Cómo sé qué nivel me toca?",
    answer:
      "Te orientamos con un diagnóstico inicial y una primera conversación para ubicarte en básico, intermedio o avanzado.",
  },
  {
    question: "¿Es difícil aprender inglés?",
    answer:
      "No cuando la metodología es práctica. Primero entiendes la estructura y luego la conviertes en conversación real con apoyo constante.",
  },
  {
    question: "Voy a clases pero no logro hablar, ¿qué hago?",
    answer:
      "Necesitas más práctica oral, no más teoría. Corregimos en vivo para que pases de entender a responder con seguridad.",
  },
  {
    question: "Entiendo la clase pero luego me olvido, ¿es normal?",
    answer:
      "Sí, y por eso usamos apoyo visual, repetición breve y rutina semanal para que el contenido se vuelva recordable y útil.",
  },
  {
    question: "No tengo tiempo para estudiar, pero quiero hablar inglés.",
    answer:
      "Puedes avanzar con micro-rutinas de 15 a 20 minutos diarios y horarios de mañana, noche o fin de semana.",
  },
  {
    question: "Trabajo todo el día, ¿sí puedo estudiar?",
    answer:
      "Sí. Tenemos formatos presencial, híbrido y online para que el estudio encaje con tu agenda, no al revés.",
  },
  {
    question: "Nunca fui buen estudiante, ¿todavía puedo aprender?",
    answer:
      "Sí. La ruta está pensada para recuperar ritmo con apoyo real, metas pequeñas y seguimiento que te mantiene avanzando.",
  },
];

window.AITUSA_DATA = {
  heroProof,
  books,
  differentiators,
  downloads,
  faqs,
  heroPoints,
  heroGallery,
  instructorClips,
  locations,
  methodBlocks,
  modalities,
  nav,
  programs,
  requirements,
  schedules,
  site,
  stats,
  storeProducts,
  learningOutcomes,
  heroSignal,
  heroStartPath,
  launchPath,
  teachers,
  testimonials,
  trustHighlights,
  paymentGuides,
  contactPrep,
  footerFacts,
  courseGuides,
};


