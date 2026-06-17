const asset = (name) => `./public/assets/wix/${name}`;
const assetHires = (name) => asset(`hires/${name}`);

const site = {
  name: "AiT USA Institute",
  legal: "Division of Arrieta Institute LLC",
  tagline: "Habla inglés con presencia real desde la primera semana, sin memorizar listas infinitas.",
  description:
    "Clases presenciales, híbridas y online en Nueva Jersey para hablar inglés con presencia real: conversación guiada, método visual y seguimiento semanal para avanzar desde hoy.",
  heroHeadline:
    "Consigue fluidez real para entrevistas, estudios y vida diaria con un método práctico que te pone a hablar desde la primera semana.",
  heroLead:
    "Entrena con sesiones en vivo, retroalimentación inmediata y tareas orientadas a contexto para que hables con claridad en clase, trabajo y cualquier escenario real.",
  heroQuote:
    "No se trata de perfección. Se trata de comunicarte con presencia en entrevistas, universidad, trabajo y vida cotidiana.",
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
    hero: "./public/assets/wix/hires/hero-classroom.jpg",
    heroPoster: "./public/assets/wix/hires/hero-classroom.jpg",
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
  ["Cursos", "cursos"],
  ["Método", "metodo"],
  ["Libros", "libros"],
  ["Horarios", "horarios"],
  ["Sedes", "sedes"],
  ["FAQ", "faq"],
  ["Contacto", "contacto"],
];

const heroPoints = [
  "Sesiones en vivo con docentes bilingües que corrigen en tiempo real para responder con naturalidad desde tu 1ª práctica.",
  "Método visual que transforma estructura y vocabulario en conversaciones reales para comunicarte con claridad cada día.",
  "Tareas de práctica semanal para que avances incluso cuando tu agenda esté llena.",
];

const heroStartPath = [
  "Agenda una clase de muestra por WhatsApp con tu horario preferido.",
  "Recibe un diagnóstico inicial y tu plan de arranque en minutos.",
  "Empieza en tu formato ideal (presencial, híbrido o online) sin perder ritmo.",
];

const heroSignal = [
  {
    value: "20+",
    label: "años diseñando resultados reales.",
  },
  {
    value: "100%",
    label: "práctica guiada para convertirte en más seguro.",
  },
  {
    value: "3",
    label: "formatos disponibles para estudiar con flexibilidad.",
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

const programs = [
  {
    title: "Inglés para jóvenes y adultos",
    category: "ingles",
    mode: "Presencial, híbrido y online",
    audience: "Personas dentro de Estados Unidos",
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
  { value: "100%", label: "práctica guiada para convertir miedo en acción" },
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
  },
  {
    label: "Noches",
    times: ["6:20 pm a 7:30 pm", "7:30 pm a 8:40 pm", "8:40 pm a 9:50 pm"],
  },
  {
    label: "Sábados",
    times: ["10:00 am a 1:00 pm", "3:00 pm a 5:30 pm"],
  },
  {
    label: "Domingos",
    times: ["10:00 am a 12:30 pm"],
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
    title: "Intro Plus",
    subtitle: "English Introductory Book",
    image: asset("031-intro-book-portada.jpg"),
    text: "Aquí empieza la familiarización con el inglés y con la ruta académica del método.",
  },
  {
    title: "Step Plus 1",
    subtitle: "Student's Book",
    image: asset("035-step-plus-1-portada.jpg"),
    text: "Introducción al método, la técnica y la estrategia.",
  },
  {
    title: "Step Plus 2",
    subtitle: "Student's Book",
    image: asset("037-step-plus-2-portada.jpg"),
    text: "Continuación de la base visual para practicar patrones esenciales.",
  },
  {
    title: "Step Plus 3",
    subtitle: "Student's Book",
    image: asset("039-step-plus-3-portada.jpg"),
    text: "Trabajo sobre tiempos presente, pasado y futuro.",
  },
  {
    title: "Step Plus 4",
    subtitle: "Student's Book",
    image: asset("041-step-plus-4-portada.jpg"),
    text: "Refuerzo para usar los tiempos con mayor seguridad.",
  },
  {
    title: "Step Plus 5",
    subtitle: "Student's Book",
    image: asset("043-step-plus-5-portada.jpg"),
    text: "Preparación para expresarse con más libertad.",
  },
  {
    title: "Step Plus 6",
    subtitle: "Student's Book",
    image: asset("045-step-plus-6-portada.jpg"),
    text: "Cierre de ruta para estudiantes listos para avanzar.",
  },
];

const locations = [
  {
    city: "Bound Brook, New Jersey",
    address: "213 E. Main St., Bound Brook, NJ 08805",
    note: "Oficina central / Headquarter",
  },
  {
    city: "Plainfield, New Jersey",
    address: "108 Watchung Ave., Plainfield, NJ 07060",
    note: "Sede presencial",
  },
  {
    city: "Piscataway, New Jersey",
    address: "451 S. Washington Ave., Piscataway, NJ 08854",
    note: "Sede presencial",
  },
  {
    city: "Flemington, New Jersey",
    address: "Flemington, NJ, USA",
    note: "Confirmar detalles de sede",
  },
  {
    city: "New York / Online",
    address: "Online Headquarter",
    note: "Atención para clases en línea",
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

const downloads = [
  {
    title: "Apple iPhone / iPad",
    text: "Aplicación para dispositivos Apple con sincronización básica de clases.",
    image: asset("155-apple-20logo-edited.jpg"),
    imageAlt: "Logo de Apple para descarga en iPhone y iPad.",
  },
  {
    title: "Apple laptop",
    text: "Aplicación para laptop Apple, Mac OS X 10.8 o superior.",
    image: asset("157-5bfb6f-c2ae26a3c5004bca9ea2b860a535f4ab.jpg"),
    imageAlt: "Logo de Apple para descarga en laptop Mac.",
  },
  {
    title: "Android",
    text: "Aplicación para teléfono móvil o tableta Android, práctica desde cualquier lugar.",
    image: asset("161-android-logo.png"),
    imageAlt: "Logo de Android para descarga de aplicación.",
  },
  {
    title: "Windows",
    text: "Aplicación para usuarios de Windows para seguimiento de clases y recursos.",
    image: asset("163-window-logo.jpg"),
    imageAlt: "Logo de Windows para descarga de aplicación.",
  },
];

const requirements = [
  {
    title: "Audífono y micrófono",
    image: site.images.headset,
    imageAlt: "Audífonos con micrófono para clases online.",
    text: "Necesario para escuchar mejor, hablar con claridad y evitar interferencias.",
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
    title: "Europa - Mes (4 weeks)",
    price: "$175.00",
    status: "In stock",
    sku: "",
    image: site.images.productEuropa,
    imageAlt: "Producto Europa - Mes para clases de inglés online.",
    note:
      "100% clases de inglés en línea para estudiantes en Europa, con pagos y acceso coordinados por WhatsApp.",
    variants: [],
  },
  {
    title: "Libro",
    price: "$55.00",
    status: "In stock",
    sku: "",
    image: site.images.productLibro,
    imageAlt: "Libro físico de AiT USA Institute para estudiantes de inglés.",
    note:
      "Libro físico para clases presenciales u online dentro de Estados Unidos; fuera de USA se solicita versión digital por WhatsApp.",
    variants: [],
  },
  {
    title: "Registración y Libro",
    price: "$95.00",
    status: "In stock",
    sku: "",
    image: site.images.productRegistrationBook,
    imageAlt: "Producto de registración y libro para clases de inglés.",
    note:
      "Paquete de registro más libro para iniciar en el curso y conservar ruta de seguimiento.",
    variants: [
      { name: "Online", price: "$95.00" },
      { name: "Presencial", price: "$95.00" },
    ],
  },
  {
    title: "Solo Registración - Pago único",
    price: "$55.00",
    status: "In stock",
    sku: "",
    image: site.images.productRegistration,
    imageAlt: "Producto de solo registración para clases de inglés.",
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
    title: "Cursos de Programming",
    price: "$3,500.00",
    status: "In stock",
    sku: "",
    image: site.images.productProgramming,
    imageAlt: "Producto de cursos de programación, diseño y reparación de computadoras.",
    note:
      "Cursos online de tres meses: Graphic Design, Web Design y Computer Repair & Networking con opciones de inicio mensual.",
    variants: [
      { name: "Graphic Design", price: "$3,500.00" },
      { name: "Web Design", price: "$3,500.00" },
      { name: "Computer Repair & Networking", price: "$2,400.00" },
    ],
  },
  {
    title: "Latinoamérica - Mes (4 weeks)",
    price: "$145.00",
    status: "In stock",
    sku: "364215376135191",
    image: site.images.productLatam,
    imageAlt: "Producto Latinoamérica - Mes para clases de inglés online.",
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
    title: "GED",
    price: "$240.00",
    status: "In stock",
    sku: "364215375135191",
    image: site.images.productGed,
    imageAlt: "Producto GED para preparación académica.",
    note:
      "Curso estimado de seis meses, dos clases de una hora por semana con horario de sábados y seguimiento de progreso.",
    variants: [],
  },
  {
    title: "Computación",
    price: "$325.00",
    status: "In stock",
    sku: "364115376135191",
    image: site.images.productComputing,
    imageAlt: "Producto Computación para cursos básicos y de oficina.",
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
    question: "¿Es difícil aprender inglés?",
    answer:
      "Depende de la metodología. Aquí aprenderás con un enfoque práctico y repetición dirigida para que hables con confianza.",
  },
  {
    question: "Asisto a clases pero no logro memorizar, ¿qué hago?",
    answer:
      "No memorizar, practicar de forma repetida en contexto real. Cambiamos la ruta de memorización por acción comunicativa.",
  },
  {
    question: "Voy a clases pero no puedo hablar, ¿por qué?",
    answer:
      "Por eso existe la práctica guiada: primero comprender la estructura, luego hablar con apoyo de patrones y corrección rápida.",
  },
  {
    question: "Entiendo la clase pero luego me olvido.",
    answer:
      "El método visual convierte ideas en una secuencia mental reutilizable: cuanto más practicable, más fácil recordar.",
  },
  {
    question: "No tengo tiempo para estudiar, pero quiero hablar inglés.",
    answer:
      "Puedes usar micro-rutinas de 15 a 20 minutos diarios: audios, repeticiones y práctica oral guiada por niveles.",
  },
  {
    question: "Nunca fui buen estudiante, ¿es posible aprender?",
    answer:
      "Sí. La constancia y la práctica dirigida funcionan mejor que el talento. Este enfoque está pensado para recuperar ritmo y confianza.",
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
  heroGallery,
  heroPoints,
  heroSignal,
  heroStartPath,
  teachers,
  testimonials,
};


