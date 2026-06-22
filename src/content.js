const asset = (name) => `./public/assets/wix/${name}`;
const assetHires = (name) => asset(`hires/${name}`);

const site = {
  name: "AiT USA Institute",
  legal: "Division of Arrieta Institute LLC",
  tagline:
    "Mira una clase real en 1:08 y decide con evidencia si esta ruta te conviene hoy.",
  description:
    "Mira una clase real de inglés y decide en minutos si nuestro método, ritmo y seguimiento encajan con tus metas, tu tiempo y tu objetivo.",
  heroHeadline:
    "Mira una clase real de 1:08 y valida con evidencia si esta ruta encaja con tu meta.",
  heroLead:
    "Mira una clase real realista: corrección en vivo, método visual y seguimiento semanal para pasar de entender a comunicarte con seguridad.",
  heroQuote:
    "Lo que ves es la clase real: conversación auténtica, feedback inmediato y práctica aplicada en vivo desde el primer minuto.",
  heroMicrocopy:
    "Compárala, marca el formato que te conviene y decide hoy con menos incertidumbre.",
  heroQuickCapture: {
    title: "Tu ruta inicial en 60 segundos",
    copy:
      "Déjanos tu nombre y WhatsApp y te enviamos una ruta inicial en 60 segundos: objetivo, formato y horario.",
    options: [
      "Validar método y estilo con una clase real de 1:08",
      "Comparar presencial, híbrido y online con mi agenda",
      "Encontrar la mejor opción para mi hijo/hija (8-13)",
      "Mejorar inglés para entrevista, trabajo o universidad",
      "Empezar esta semana",
    ],
    button: "Recibir mi ruta inicial",
    note: "Sin costo ni compromiso. En 10-15 minutos te compartimos una ruta inicial concreta y honesta.",
  },
  heroHighlights: [
    "Clase real desde el primer minuto para validar método, ritmo y estilo.",
    "Compara presencial, híbrido y online con evidencia, no con suposiciones.",
    "Recibe un plan de arranque y empieza con más claridad hoy.",
  ],
  canonical: "https://www.aitusainstitute.com/",
  founded: "2004",
  phone: "+1 732-271-0011",
  phoneHref: "tel:+17322710011",
  whatsapp: "+1 732-379-0593",
  whatsappHref: "https://wa.me/17323790593",
  twitterHandle: "@AiTUSA_Institute",
  seoTitle:
    "AiT USA Institute | Clase real de inglés en 1:08 | Nueva Jersey",
  seoDescription:
    "Mira una clase real de inglés de 1:08 y decide con evidencia si esta ruta te conviene. Compara presencial, híbrido y online, y define tu mejor horario en Nueva Jersey.",
  seoKeywords:
    "AiT USA Institute, clase real de inglés, clases de inglés Nueva Jersey, clases presenciales de inglés, clases híbridas, clases online, demo de clase de inglés, método visual, ruta personalizada de estudio, Bound Brook, Plainfield, Piscataway, entrevista de trabajo en inglés, clases para familias, inglés conversacional para adultos",
  seoImage: assetHires("hero-classroom.jpg"),
  seoImageAlt:
    "Instructora de AiT USA enseñando una clase real de inglés con cámara activa para corregir en vivo.",
  seoVideo: asset("live/hero-female-speaking-1080p.mp4"),
  seoVideoDuration: "PT1M8S",
  email: "info@aitusainstitute.com",
  emailHref:
    "mailto:info@aitusainstitute.com?subject=Informaci%C3%B3n%20sobre%20clases%20AiT%20USA%20Institute",
  facebookHref: "https://www.facebook.com/aitusainstitute/",
  locations: [
    {
      streetAddress: "213 E. Main St.",
      addressLocality: "Bound Brook",
      addressRegion: "NJ",
      postalCode: "08805",
      addressCountry: "US",
      geo: {
        latitude: 40.5689,
        longitude: -74.5386,
      },
    },
    {
      streetAddress: "108 Watchung Ave.",
      addressLocality: "Plainfield",
      addressRegion: "NJ",
      postalCode: "07060",
      addressCountry: "US",
    },
    {
      streetAddress: "451 S. Washington Ave.",
      addressLocality: "Piscataway",
      addressRegion: "NJ",
      postalCode: "08854",
      addressCountry: "US",
    },
  ],
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
    hero: assetHires("hero-classroom.jpg"),
    heroPoster: assetHires("hero-classroom.jpg"),
    heroVideo: asset("live/hero-female-speaking-1080p.mp4"),
    heroVideoPortrait: asset("live/hero-female-speaking-360p.mp4"),
    heroVideoFallback: asset("live/hero-female-speaking-360p.mp4"),
    heroVideoPoster: assetHires("hero-female-teacher.jpg"),
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
    testimonialAntonina: assetHires("testimonial-antonina-1200.jpg"),
    testimonialMarisol: assetHires("testimonial-marisol-1200.jpg"),
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
const heroQuickCapture = site.heroQuickCapture;

const nav = [
  ["Inicio", "inicio"],
  ["Ruta", "ruta"],
  ["Experiencia", "experiencia"],
  ["Cursos", "cursos"],
  ["Método", "metodo"],
  ["Libros", "libros"],
  ["Horarios", "horarios"],
  ["Sedes", "sedes"],
  ["Preguntas frecuentes", "faq"],
  ["Contacto", "contacto"],
];

const heroPoints = [
  "Clase real de 1:08 para validar método, ritmo y encaje antes de invertir en una ruta.",
  "Ruta inicial visual para entrevistas, trabajo y vida diaria desde esta semana.",
  "Seguimiento semanal para mantener práctica constante aunque tu agenda esté llena.",
];
const heroHighlights = site.heroHighlights || [];

const heroVideoHighlights = [
  "Clase real de 1:08 con corrección en vivo",
  "Audio e imagen nítidos para evaluar la dinámica real",
  "Corrección instantánea + seguimiento semanal",
  "Sin costo ni compromiso en consulta inicial",
  "Presencial, híbrido y online en Nueva Jersey",
];

const heroStartPath = [
  "Mira una clase real de 1:08 y valida ritmo, método y encaje.",
  "Define objetivo, horario y nivel de compromiso en minutos.",
  "Compara opciones y deja lista una ruta realista para comenzar esta semana.",
];

const heroSignal = [
  {
    value: "20+",
    label: "años acompañando rutas reales con método visual y práctica activa.",
  },
  {
    value: "1:08",
    label: "para validar método, ritmo y formato antes de decidir con claridad.",
  },
  {
    value: "7 días",
    label: "para recibir una ruta inicial con plan y horario claros.",
  },
];

const launchPath = [
  {
    title: "Semana 1: diagnóstico y objetivo",
    description:
      "En 10 minutos validamos nivel, objetivo y agenda para diseñar una ruta inicial realista.",
    outcome: "Sales con recomendación, formato y horario inicial para avanzar hoy.",
  },
  {
    title: "Semana 2: práctica guiada",
    description:
      "Entrenas conversaciones reales con corrección puntual para convertir teoría en respuesta inmediata.",
    outcome: "Con cada práctica tu inglés se vuelve más utilizable y con menos bloqueo.",
  },
  {
    title: "Semana 3: seguimiento y ajuste",
    description:
      "Con tu coach de ruta revisamos avances, detectamos obstáculos y ajustamos micro-prácticas.",
    outcome: "Ves evidencia de mejora y sabes exactamente el siguiente ajuste semanal.",
  },
];

const stats = [
  { value: "+1000", label: "estudiantes guiados con experiencia práctica de clase real" },
  { value: "3", label: "formatos: presencial, híbrido y online" },
  { value: "GC", label: "Método Graphic Concept: visual, práctico y directo" },
  { value: "20+", label: "años de método aplicado a resultados en Nueva Jersey" },
];

const differentiators = [
  {
    title: "Comprender primero, hablar después",
    text:
      "Conecta intención, contexto y vocabulario. Comprender primero reduce el bloqueo y acelera cada intervención oral.",
  },
  {
    title: "Hablar con estructura visual",
    text:
      "Graphic Concept traduce reglas y patrones en mapas visuales memorables para hablar más rápido y con menos errores.",
  },
  {
    title: "Acompañamiento que impulsa resultados",
    text:
      "Seguimiento semanal, tutorías y ajustes de ruta para crear hábitos de inglés con continuidad real y progresión constante.",
  },
];

const learningOutcomes = [
  {
    title: "Comprensión rápida",
    text:
      "Comienzas construyendo estructura y contexto para entender primero y responder después con más seguridad.",
  },
  {
    title: "Habla guiada",
    text:
      "Cada clase incluye repetición oral con corrección inmediata para pasar de escuchar a hablar sin improvisar.",
  },
  {
    title: "Rutina sostenible",
    text: "Microtareas semanales diseñadas para avanzar incluso con agendas muy apretadas.",
  },
  {
    title: "Seguimiento real",
    text:
      "Ajustamos nivel y ritmo según tu progreso, tu horario y tu meta, semana tras semana.",
  },
];

const courseGuides = [
  {
    title: "Quiero hablar inglés con más seguridad",
    text: "Empieza por Inglés para jóvenes y adultos u online si quieres una ruta clara para conversación real.",
    href: "?curso=ingles#cursos",
    cta: "Ver inglés",
  },
  {
    title: "Busco una opción para mi hijo o hija",
    text: "Inglés para niños está pensado para 8 a 13 años con apoyo visual y seguimiento familiar.",
    href: "?curso=ninos#cursos",
    cta: "Ver niños",
  },
  {
    title: "Necesito apoyo académico o técnico",
    text: "GED, matemáticas y tecnología tienen rutas específicas para que avances con un objetivo concreto.",
    href: "?curso=academico#cursos",
    cta: "Ver apoyo académico",
  },
];

const programs = [
  {
    title: "Inglés para jóvenes y adultos",
    category: "ingles",
    mode: "Presencial, híbrido y online",
    audience: "Adultos y jóvenes en EE. UU.",
    bestFor: "Ideal si quieres hablar con más seguridad en trabajo, escuela o trámites.",
    fit: "Ideal si quieres conversar con más seguridad en trabajo, escuela o trámites diarios.",
    cta: "Ver inglés",
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
    audience: "Adultos y jóvenes fuera de EE. UU.",
    bestFor: "Ideal si estudias desde otro país y necesitas clases en vivo.",
    fit: "Ideal si estudias desde otro país y necesitas sesiones en vivo con guía clara.",
    cta: "Ver online",
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
    bestFor: "Ideal para familias que quieren práctica visual y seguimiento constante.",
    fit: "Ideal para familias que quieren práctica visual y acompañamiento constante.",
    cta: "Ver niños",
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
    audience: "Personas que quieren aprender español",
    bestFor: "Ideal si quieres moverte con más seguridad en estudio y trabajo.",
    fit: "Ideal si quieres moverte con más seguridad en contextos de estudio y trabajo.",
    cta: "Ver español",
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
    audience: "Adultos que buscan el GED",
    bestFor: "Ideal si buscas avanzar hacia el diploma equivalente a High School.",
    fit: "Ideal si buscas avanzar hacia el diploma equivalente a High School con ruta guiada.",
    cta: "Ver GED",
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
    bestFor: "Ideal cuando necesitas recuperar ritmo y aclarar temas críticos.",
    fit: "Ideal cuando necesitas recuperar ritmo y aclarar temas críticos sin perder tiempo.",
    cta: "Ver tutorías",
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
    bestFor: "Ideal si quieres aprender desde cero a usar internet y archivos.",
    fit: "Ideal si quieres aprender desde cero a usar internet, archivos y herramientas básicas.",
    cta: "Ver computación",
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
    bestFor: "Ideal si buscas mejorar productividad con Word, Excel y PowerPoint.",
    fit: "Ideal si buscas mejorar productividad con Word, Excel y PowerPoint.",
    cta: "Ver oficina",
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
    audience: "Soporte técnico y mantenimiento",
    bestFor: "Ideal si te interesa soporte básico, diagnóstico y mantenimiento.",
    fit: "Ideal si te interesa soporte básico, diagnóstico y mantenimiento de equipos.",
    cta: "Ver reparación",
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
    label: "Clase real de apertura",
    title:
      "Interacción auténtica por Zoom para entrenar comprensión y respuesta en tiempo real con una instructora real.",
    image: assetHires("hero-female-teacher.jpg"),
    video: site.images.heroVideo,
    videoPoster: assetHires("hero-female-teacher.jpg"),
    imageAlt:
      "Instructora de AiT USA interactuando con estudiantes en una sesión online de inglés.",
  },
  {
    label: "Clase en vivo",
    title: "Corrección instantánea y conversación guiada para hablar con más claridad desde el primer bloque.",
    image: assetHires("hero-classroom.jpg"),
    video: site.images.heroVideo,
    videoPoster: assetHires("hero-classroom.jpg"),
    imageAlt:
      "Docente femenina de AiT USA guiando una clase en vivo de conversación en inglés.",
  },
  {
    label: "Seguimiento con presencia",
    title: "Docentes bilingües corrigen en vivo para que avances con menos incertidumbre.",
    image: assetHires("hero-classroom.jpg"),
    video: site.images.heroVideo,
    videoPoster: assetHires("hero-classroom.jpg"),
    imageAlt:
      "Instructora de AiT USA corrigiendo y motivando a una estudiante durante conversación oral.",
  },
  {
    label: "Clase con foco visual",
    title: "Material visual claro y práctica guiada para reforzar lo aprendido en vivo.",
    image: assetHires("hero-classroom.jpg"),
    video: site.images.heroVideo,
    videoPoster: assetHires("hero-classroom.jpg"),
    imageAlt: "Grupo en clase presencial practicando conversación y pronunciación en inglés.",
  },
  {
    label: "Ruta semanal clara",
    title: "Plan semanal con acciones concretas para convertir práctica en hábito.",
    image: assetHires("hero-classroom.jpg"),
    video: site.images.heroVideo,
    videoPoster: assetHires("hero-classroom.jpg"),
    imageAlt:
      "Instructora de AiT USA trabajando con una estudiante para mejorar la fluidez y la seguridad.",
  },
  {
    label: "Resultados reales",
    title: "Seguimiento de progreso con evidencia visual de resultados en cada módulo.",
    image: assetHires("hero-female-teacher.jpg"),
    video: site.images.heroVideo,
    videoPoster: assetHires("hero-female-teacher.jpg"),
    imageAlt: "Estudiantes de AiT USA aplicando lo aprendido en clase de inglés.",
  },
];

const heroProof = [
  {
    value: "20+",
    label: "años con clases reales en Nueva Jersey, enfocadas en progreso continuo y medible.",
    href: "#about",
    cta: "Ver trayectoria",
    intent: "default",
  },
  {
    value: "1:08",
    label: "para validar método, ritmo y encaje antes de tomar tu siguiente paso.",
    href: "#experiencia",
    cta: "Ver clase real",
    intent: "classSample",
  },
  {
    value: "3",
    label: "formatos para estudiar sin romper tu agenda: presencial, híbrido y online.",
    href: "#horarios",
    cta: "Comparar horarios",
    intent: "scheduleFlex",
  },
];

const instructorClips = [
  {
    title: "Clase de entrevista en vivo",
    eyebrow: "Muestra real",
    image: assetHires("hero-female-teacher.jpg"),
    video: site.images.heroVideo,
    videoPoster: assetHires("hero-female-teacher.jpg"),
    imageAlt:
      "Instructora de AiT USA guiando una práctica de entrevista en clase con método visual en inglés.",
    caption:
      "Simulación de entrevista con corrección instantánea para responder con intención y naturalidad.",
    duration: "1:08",
  },
  {
    title: "Escucha y responde al instante",
    eyebrow: "Metodología visual",
    image: assetHires("hero-classroom.jpg"),
    video: site.images.heroVideo,
    videoPoster: assetHires("hero-classroom.jpg"),
    imageAlt: "Instructora y estudiante practicando inglés mediante Zoom con enfoque visual y conversación real.",
    caption:
      "Escucha guiada con pausas estratégicas para responder con significado desde el primer bloqueo.",
    duration: "0:48",
  },
  {
    title: "Conexión auténtica en clases online",
    eyebrow: "8 a 13 años",
    image: assetHires("hero-female-teacher.jpg"),
    video: site.images.heroVideoPortrait,
    videoPoster: assetHires("hero-female-teacher.jpg"),
    imageAlt:
      "Estudiante practicando inglés en una clase remota con acompañamiento de la instructora.",
    caption:
      "Conversación guiada para recuperar estructura, ganar espontaneidad y hablar con más seguridad.",
    duration: "0:38",
  },
  {
    title: "Respuesta guiada en clase",
    eyebrow: "Sesión de progreso",
    image: assetHires("hero-classroom.jpg"),
    video: site.images.heroVideo,
    videoPoster: assetHires("hero-classroom.jpg"),
    imageAlt: "Instructora de AiT USA interactuando con estudiantes en una clase de inglés.",
    caption:
      "Estrategias y corrección puntual para pasar de comprender a comunicar ideas con mayor naturalidad.",
    duration: "0:50",
  },
];

const schedules = [
  {
    label: "Mañanas",
    timeProfile: "mañana",
    times: ["8:30 am a 9:30 am", "9:30 am a 10:30 am", "10:30 am a 11:30 am"],
    bestFor: "Ideal para quienes quieren aprender al inicio de la semana con energía y constancia.",
    badge: "Más elegido",
    duration: "Sesión de 60 min",
    availability: "4 cupos disponibles por clase",
    commitment: "Ideal si puedes asegurar 1 día por semana de forma estable.",
    cta: "Ver mañanas",
    whatsappHint: "Me conviene más el turno de mañana.",
  },
  {
    label: "Noches",
    timeProfile: "noche",
    times: ["6:20 pm a 7:30 pm", "7:30 pm a 8:40 pm", "8:40 pm a 9:50 pm"],
    bestFor: "Pensado para después del trabajo o de las clases de la semana.",
    badge: "Máxima flexibilidad",
    duration: "Sesión de 60 min",
    availability: "5 cupos disponibles por clase",
    commitment: "Útil si tu rutina cambia entre semana o teletrabajas.",
    cta: "Ver noches",
    whatsappHint: "Me conviene más el turno de noche.",
  },
  {
    label: "Sábados",
    timeProfile: "fin-de-semana",
    times: ["10:00 am a 1:00 pm", "3:00 pm a 5:30 pm"],
    bestFor: "Perfecto si entre semana estás ocupado y prefieres recuperar el ritmo en fin de semana.",
    badge: "Para familias",
    duration: "Sesión de 60 o 90 min",
    availability: "3 cupos por horario",
    commitment: "Buen ajuste para quienes tienen agenda académica o laboral variable.",
    cta: "Ver sábados",
    whatsappHint: "Me conviene más el turno de sábado.",
  },
  {
    label: "Domingos",
    timeProfile: "fin-de-semana",
    times: ["10:00 am a 12:30 pm"],
    bestFor: "Conserva el impulso semanal sin sacrificar tus días laborales.",
    badge: "Reentrada",
    duration: "Sesión de 90 min",
    availability: "2 cupos por semana",
    commitment: "Te conviene si solo tienes un bloque fuerte disponible los domingos.",
    cta: "Ver domingos",
    whatsappHint: "Me conviene más el turno de domingo.",
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
    bestFor: "Ideal si estás dando tu primer paso y quieres entender la base del método.",
    text: "Aquí empieza la familiarización con el inglés y con la ruta académica del método.",
  },
  {
    title: "Paso Plus 1",
    subtitle: "Libro del estudiante",
    level: "Básico",
    image: asset("035-step-plus-1-portada.jpg"),
    bestFor: "Ideal para empezar a construir estructura y confianza desde cero.",
    text: "Introducción al método, la técnica y la estrategia.",
  },
  {
    title: "Paso Plus 2",
    subtitle: "Libro del estudiante",
    level: "Básico",
    image: asset("037-step-plus-2-portada.jpg"),
    bestFor: "Ideal si ya viste lo básico y quieres practicar patrones esenciales.",
    text: "Continuación de la base visual para practicar patrones esenciales.",
  },
  {
    title: "Paso Plus 3",
    subtitle: "Libro del estudiante",
    level: "Intermedio",
    image: asset("039-step-plus-3-portada.jpg"),
    bestFor: "Ideal si quieres pasar a presente, pasado y futuro con más control.",
    text: "Trabajo sobre tiempos presente, pasado y futuro.",
  },
  {
    title: "Paso Plus 4",
    subtitle: "Libro del estudiante",
    level: "Intermedio",
    image: asset("041-step-plus-4-portada.jpg"),
    bestFor: "Ideal para usar los tiempos con mayor seguridad en conversación real.",
    text: "Refuerzo para usar los tiempos con mayor seguridad.",
  },
  {
    title: "Paso Plus 5",
    subtitle: "Libro del estudiante",
    level: "Avanzado",
    image: asset("043-step-plus-5-portada.jpg"),
    bestFor: "Ideal si ya tienes base y quieres expresarte con más libertad.",
    text: "Preparación para expresarse con más libertad.",
  },
  {
    title: "Paso Plus 6",
    subtitle: "Libro del estudiante",
    level: "Avanzado",
    image: asset("045-step-plus-6-portada.jpg"),
    bestFor: "Ideal si estás listo para cerrar la ruta y avanzar a mayor fluidez.",
    text: "Cierre de ruta para estudiantes listos para avanzar.",
  },
];

const locations = [
  {
    city: "Bound Brook, New Jersey",
    address: "213 E. Main St., Bound Brook, NJ 08805",
    note: "Oficina central / sede principal",
    bestFor: "Ideal si quieres una sede central con coordinación administrativa directa.",
    highlight: "Recepción principal y coordinación administrativa.",
    cta: "Escribir sobre Bound Brook",
  },
  {
    city: "Plainfield, New Jersey",
    address: "108 Watchung Ave., Plainfield, NJ 07060",
    note: "Sede presencial",
    bestFor: "Ideal si vives o trabajas en el centro de Nueva Jersey.",
    highlight: "Acceso fácil para estudiantes del área central de Nueva Jersey.",
    cta: "Escribir sobre Plainfield",
  },
  {
    city: "Piscataway, New Jersey",
    address: "451 S. Washington Ave., Piscataway, NJ 08854",
    note: "Sede presencial",
    bestFor: "Ideal si buscas una sede amplia y práctica para asistir con comodidad.",
    highlight: "Buena opción para quienes buscan una sede amplia y práctica.",
    cta: "Escribir sobre Piscataway",
  },
  {
    city: "Flemington, New Jersey",
    address: "Flemington, NJ, USA",
    note: "Confirmar detalles de sede",
    bestFor: "Ideal si quieres confirmar disponibilidad antes de desplazarte.",
    highlight: "Disponible según disponibilidad y coordinación previa.",
    cta: "Confirmar Flemington",
  },
  {
    city: "New York / Online",
    address: "Atención online",
    note: "Atención para clases en línea",
    bestFor: "Ideal si prefieres estudiar a distancia sin viajar a Nueva Jersey.",
    highlight: "Conexión remota para estudiantes fuera de Nueva Jersey.",
    cta: "Consultar online",
  },
];

const testimonials = [
  {
    name: "Antonina Silvero y Zulma",
    image: assetHires("testimonial-antonina-1200.jpg"),
    imageAlt: "Antonina y Zulma compartiendo su experiencia real en una clase de inglés de AiT USA.",
    result: "Comprender y hablar con más contexto",
    text:
      "Entramos sin saber por dónde empezar. Tras ver una clase real, entendimos estructura, ritmo y empezamos a hablar con menos bloqueo desde la primera semana.",
  },
  {
    name: "Marisol Guardado",
    image: assetHires("testimonial-marisol-1200.jpg"),
    imageAlt:
      "Marisol, estudiante de AiT USA Institute, compartiendo cómo mejoró su confianza con clases en vivo.",
    result: "Escuchar, comprender y responder sin trabarse",
    text:
      "Ver clase real desde el primer momento me quitó la incertidumbre. Hoy entiendo mejor, respondo con mayor seguridad y sostengo la práctica con más constancia.",
  },
];

const teachers = [
  {
    name: "Instructora de inglés conversacional",
    intent: "classSample",
    href: "#experiencia",
    image: assetHires("hero-female-teacher.jpg"),
    imageAlt: "Instructora de AiT USA corrigiendo pronunciación durante una clase real de conversación.",
    role: "Corrección en vivo con seguimiento semanal.",
    description:
      "Trabaja contigo para que cada intervención sea más natural, clara y útil desde el primer bloque.",
    badge: "Clase real",
  },
  {
    name: "Instructora de práctica online",
    intent: "classSample",
    href: "#experiencia",
    image: assetHires("hero-classroom.jpg"),
    imageAlt: "Instructora de AiT USA guiando una clase de inglés por videollamada.",
    role: "Aprendizaje remoto con participación guiada.",
    description:
      "Guía la dinámica desde la distancia para que practiques confianza oral con apoyo y estructura.",
    badge: "Formato online",
  },
  {
    name: "Instructora de continuidad académica",
    intent: "default",
    href: "#contacto",
    image: assetHires("hero-classroom.jpg"),
    imageAlt: "Instructora de AiT USA motivando a estudiantes en una clase práctica.",
    role: "Soporte constante y ruta personalizada.",
    description:
      "Acompaña el seguimiento de metas semanales para que avances sin perder ritmo ni motivación.",
    badge: "Seguimiento semanal",
  },
];

const trustHighlights = [
  {
    title: "Corrección visible",
    text: "Docentes bilingües corrigen en vivo para que identifiques tu progreso antes de decidir.",
  },
  {
    title: "Seguimiento continuo",
    text: "WhatsApp y seguimiento semanal para mantenerte con práctica, no con dudas pendientes.",
  },
  {
    title: "Horarios flexibles",
    text: "Presencial, híbrido y online para adaptar la rutina de clases a tu agenda real.",
  },
];

const paymentGuides = [
  {
    title: "Quiero empezar a hablar inglés",
    text: "Empieza con la mensualidad o la combinación registración + libro si quieres una ruta completa.",
    cta: "Ver ruta recomendada",
    href: "#cursos",
  },
  {
    title: "Solo necesito material de estudio",
    text: "El libro individual funciona bien si ya estás en clase y quieres reforzar la ruta en casa.",
    cta: "Ver material",
    href: "#libros",
  },
  {
    title: "Busco otra área académica o técnica",
    text: "GED, computación básica y oficina tienen su propio camino según tu objetivo inmediato.",
    cta: "Explorar opción",
    href: "#cursos",
  },
];

const contactPrep = [
  {
    title: "Nivel de entrada",
    text: "Si no lo sabes, no pasa nada. Te orientamos rápido para ubicar tu punto real de arranque.",
  },
  {
    title: "Horario ideal",
    text: "Te sugerimos un bloque realista de mañana, noche o fin de semana para mantener continuidad.",
  },
  {
    title: "Meta principal",
    text: "Trabajo, universidad, entrevista, niño/a o apoyo técnico: afinamos la ruta a tu meta.",
  },
];

const footerFacts = [
  {
    title: "Ver la clase primero",
    text: "Mira el video real de experiencia antes de escribirnos si quieres comparar con calma.",
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
    title: "iPhone y iPad",
    text: "Acceso para Apple con seguimiento de clase y recursos listos para revisar desde el móvil o tablet.",
    image: asset("155-apple-20logo-edited.jpg"),
    imageAlt: "Logo de Apple para descarga en iPhone y iPad.",
  },
  {
    title: "Mac",
    text: "Acceso para Mac con materiales de estudio optimizados para laptop y trabajo diario.",
    image: asset("157-5bfb6f-c2ae26a3c5004bca9ea2b860a535f4ab.jpg"),
    imageAlt: "Logo de Apple para descarga en laptop Mac.",
  },
  {
    title: "Android",
    text: "Acceso para Android con práctica y seguimiento desde cualquier lugar.",
    image: asset("161-android-logo.png"),
    imageAlt: "Logo de Android para descarga de aplicación.",
  },
  {
    title: "Windows",
    text: "Acceso para Windows con seguimiento de clases y recursos listos para continuar.",
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
    cta: "Consultar Europa",
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
    cta: "Quiero este libro",
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
    cta: "Consultar paquete",
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
    cta: "Pedir registración",
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
    cta: "Ver cursos técnicos",
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
    cta: "Consultar Latinoamérica",
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
    cta: "Consultar GED",
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
    cta: "Ver computación",
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
    question: "¿Cómo sé qué nivel me toca en inglés?",
    answer:
      "Hacemos un diagnóstico inicial de 10 minutos para ubicar tu nivel (básico, intermedio o avanzado) y definir un plan de avance que sí encaje con tu semana.",
    outcome: "Sin perder tiempo, saldrás con claridad de por dónde arrancas.",
    cta: "Ver clase real",
  },
  {
    question: "¿Puedo ver una clase real antes de inscribirme?",
    answer:
      "Sí. Ve el video de experiencia para observar el ritmo de clase, la corrección en vivo y cómo se maneja la práctica oral con tus mismas dudas iniciales.",
    outcome: "Si el formato te funciona, ya sabes qué esperar antes de escribir.",
    cta: "Ver clase real",
  },
  {
    question: "¿Es difícil aprender inglés si nunca fui bueno en idiomas?",
    answer:
      "No cuando trabajamos con práctica guiada y hábitos consistentes. Empezamos con comprensión funcional, pasamos a expresión y luego repetición estructurada en contexto real.",
    outcome: "La dificultad baja cuando el método te da un camino de práctica corto y medible.",
    cta: "Pedir orientación",
  },
  {
    question: "Voy a clases pero no logro hablar, ¿qué hago?",
    answer:
      "Necesitas más práctica oral de baja presión. Aquí corregimos en vivo y te damos micro-objetivos para que, en pocos días, hables con más naturalidad.",
    outcome: "La corrección llega al instante y te evita practicar con errores repetidos.",
    cta: "Pedir orientación",
  },
  {
    question: "Entiendo la clase, pero luego se me olvida la práctica, ¿es normal?",
    answer:
      "Sí, es normal al inicio. Usamos mapas visuales, repetición corta y rutina semanal para que lo que aprendes pase de escuchar a usarlo.",
    outcome: "En una sola semana pasas de memorización aislada a conversación útil.",
    cta: "Ver libro",
  },
  {
    question: "No tengo mucho tiempo, pero quiero aprender a hablar inglés.",
    answer:
      "Puedes empezar con 15 a 20 minutos diarios y elegir horario flexible (mañana, noche o fin de semana) con metas pequeñas y medibles.",
    outcome: "Te proponemos un plan realista para avanzar sin colapsar tu agenda.",
    cta: "Ver horarios",
  },
  {
    question: "Trabajo todo el día, ¿sí puedo estudiar?",
    answer:
      "Sí. Tenemos opciones presenciales, híbridas y online para estudiar sin romper tu rutina laboral, con continuidad semanal realista.",
    outcome: "Puedes mantener continuidad aunque tu semana cambie.",
    cta: "Ver horarios",
  },
  {
    question: "Nunca fui buen estudiante, ¿todavía puedo aprender?",
    answer:
      "Sí. Si te cuesta mantener ritmo, esta ruta se enfoca en objetivos semanales claros, práctica oral guiada y seguimiento cercano para recuperar confianza.",
    outcome: "Lo difícil deja de ser confuso y se convierte en un proceso con metas.",
    cta: "Pedir orientación",
  },
  {
    question: "¿Puedo estudiar desde otro país o por videollamada?",
    answer:
      "Sí. Nuestra modalidad online permite asistir desde cualquier lugar con conexión estable; te ayudamos con requisitos técnicos mínimos para empezar rápido.",
    outcome: "No te limitas a una ubicación para probar si esta ruta te conviene.",
    cta: "Ver horarios",
  },
  {
    question: "¿Qué pasa si no puedo cubrir una clase o me atraso?",
    answer:
      "Contáctanos y te ayudamos a recuperar con un plan corto para que no pierdas continuidad: ajustes de horario, repaso dirigido y próximos pasos claros.",
    outcome: "Te devolvemos ritmo sin sanciones ni vueltas innecesarias.",
    cta: "Pedir orientación",
  },
];

window.AITUSA_DATA = {
  heroProof,
  heroVideoHighlights,
  heroHighlights,
  heroQuickCapture,
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

