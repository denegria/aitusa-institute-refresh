const asset = (name) => `./public/assets/wix/${name}`;
const assetHires = (name) => asset(`hires/${name}`);
const assetVideo = (name) => asset(`videos/${name}`);
const assetVideoPoster = (name) => asset(`videos/posters/${name}`);

const site = {
  name: "AiT USA Institute",
  legal: "Division of Arrieta Institute LLC",
  tagline:
    "Clases reales, ruta clara y apoyo humano.",
  description:
    "Explora clases de inglés, GED, computación y español con videos reales, horarios claros y orientación directa para elegir tu mejor ruta.",
  heroHeadline:
    "Inglés, GED y computación con una ruta clara desde el primer día.",
  heroLead:
    "Conoce cómo enseñamos, revisa programas reales y recibe una recomendación sencilla para empezar presencial, híbrido u online.",
  heroQuote:
    "Los videos reales te muestran ritmo, corrección y presencia humana desde el primer minuto.",
  heroMicrocopy:
    "Empieza por el video real y luego elige la ruta que mejor encaje con tu horario.",
  heroQuickCapture: {
    title: "Tu ruta inicial en menos de 60 segundos",
    copy:
      "Déjanos tu nombre y WhatsApp y te enviamos objetivo, formato y horario recomendado para empezar con menos dudas.",
    options: [
      "Validar si los videos reales encajan con mi estilo de aprendizaje",
      "Comparar presencial, híbrido y online con mi agenda",
      "Encontrar la mejor opción para mi hijo/hija (8-13)",
      "Mejorar inglés para entrevista, trabajo o universidad",
      "Empezar esta semana con un plan real",
    ],
    button: "Recibir mi ruta inicial",
    note: "Sin costo ni compromiso. En 10-15 minutos te compartimos ruta, nivel sugerido y próximos pasos.",
  },
  heroHighlights: [
    "Videos reales para validar método, ritmo y estilo antes de decidir.",
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
    "AiT USA Institute | Inglés, GED y computación en Nueva Jersey",
  seoDescription:
    "Mira videos reales de AiT USA y explora programas de inglés, niños, GED, computación y español en Nueva Jersey. Compara presencial, híbrido y online y recibe una ruta inicial clara.",
  seoKeywords:
    "AiT USA Institute, clases de inglés Nueva Jersey, GED, computación, español, clases para niños, videos reales de inglés, clases presenciales, clases híbridas, clases online, entrevista de trabajo en inglés, ruta inicial personalizada, Bound Brook, Plainfield, Piscataway, inglés conversacional para adultos",
  seoImage: assetVideoPoster("intro-video-great.jpg"),
  seoImageAlt:
    "Frame real del video introductorio de AiT USA Institute.",
  seoVideo: assetVideo("intro-video-great.mp4"),
  seoVideoDuration: "PT1M45S",
  seoVideoWidth: 464,
  seoVideoHeight: 832,
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
    logo: asset("076-solo-logo-4-x-4-clases1.png"),
    hero: assetHires("graphic-concept-method.jpg"),
    heroPoster: assetHires("graphic-concept-method.jpg"),
    heroVideo: assetVideo("intro-video-great.mp4"),
    heroVideoPortrait: assetVideo("intro-video-great.mp4"),
    heroVideoFallback: assetVideo("promo-video-great.mp4"),
    heroVideoPoster: assetVideoPoster("intro-video-great.jpg"),
    introVideo: assetVideo("intro-video-great.mp4"),
    introVideoPoster: assetVideoPoster("intro-video-great.jpg"),
    promoVideo: assetVideo("promo-video-great.mp4"),
    promoVideoPoster: assetVideoPoster("promo-video-great.jpg"),
    firstCharacteristicVideo: assetVideo("first-characteristic.mp4"),
    firstCharacteristicVideoPoster: assetVideoPoster("first-characteristic.jpg"),
    secondCharacteristicVideo: assetVideo("second-characteristic.mp4"),
    secondCharacteristicVideoPoster: assetVideoPoster("second-characteristic.jpg"),
    thirdCharacteristicVideo: assetVideo("third-characteristic.mp4"),
    thirdCharacteristicVideoPoster: assetVideoPoster("third-characteristic.jpg"),
    differenceVideo: assetVideo("what-makes-us-different.mp4"),
    differenceVideoPoster: assetVideoPoster("what-makes-us-different.jpg"),
    internationalStudentVideo: assetVideo("international-student-testimonial.mp4"),
    internationalStudentVideoPoster: assetVideoPoster("international-student-testimonial.jpg"),
    ericInterviewVideo: assetVideo("student-interview-eric-great.mp4"),
    ericInterviewVideoPoster: assetVideoPoster("student-interview-eric-great.jpg"),
    jessicaInterviewVideo: assetVideo("student-interview-jessica-great.mp4"),
    jessicaInterviewVideoPoster: assetVideoPoster("student-interview-jessica-great.jpg"),
    leilaTestimonialVideo: assetVideo("student-testimonial-leila-needs-reduced-volume.mp4"),
    leilaTestimonialVideoPoster: assetVideoPoster("student-testimonial-leila-needs-reduced-volume.jpg"),
    heroClassroom: assetHires("hero-classroom.jpg"),
    heroFemaleClassroom: assetHires("contact-female-speaking.jpg"),
    heroFemaleTeacher: assetHires("contact-female-speaking.jpg"),
    heroFemaleZoom: assetHires("online-instructor-headset.jpg"),
    heroFemaleSpeakingPoster: asset("live/hero-female-speaking-poster.jpg"),
    adultEnglish: assetHires("adult-speaking-class.jpg"),
    onlineEnglish: assetHires("online-instructor-headset.jpg"),
    kidsEnglish: assetHires("kids-online-class.jpg"),
    computing: assetHires("devices-study.jpg"),
    office: asset("081-laptop-work.jpg"),
    repair: asset("089-reparacion-de-computadoras.jpg"),
    spanish: assetHires("adult-english-speaking.jpg"),
    ged: asset("products/product-ged.jpg"),
    math: asset("095-math-class.jpg"),
    method: assetHires("graphic-concept-method.jpg"),
    tutoring: assetHires("online-instructor-headset.jpg"),
    level: assetHires("adult-speaking-class.jpg"),
    routeLevels: assetHires("english-levels.jpg"),
    routeConcept: assetHires("graphic-concept-method.jpg"),
    scholarship: assetHires("scholarships.jpg"),
    contact: assetHires("contact-female-speaking.jpg"),
    contactAlt:
      "Instructora de AiT USA explicando frente al pizarrón durante una clase real.",
    headset: assetHires("online-instructor-headset.jpg"),
    devices: assetHires("devices-study.jpg"),
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
  ["Videos", "experiencia"],
  ["Cursos", "cursos"],
  ["Horarios", "horarios"],
  ["Sedes", "sedes"],
  ["Preguntas frecuentes", "faq"],
  ["Contacto", "contacto"],
];

const heroPoints = [
  "Videos reales para validar método, ritmo y encaje antes de invertir en una ruta.",
  "Ruta inicial visual para entrevistas, trabajo y vida diaria desde esta semana.",
  "Seguimiento semanal para mantener práctica constante aunque tu agenda esté llena.",
];
const heroHighlights = site.heroHighlights || [];

const heroVideoHighlights = [
  "Conoce el método antes de escribir",
  "Programas presenciales, híbridos y online",
  "Orientación por WhatsApp para elegir ruta",
];

const heroStartPath = [
  "Mira videos reales y valida ritmo, método y encaje.",
  "Define objetivo, horario y nivel de compromiso en minutos.",
  "Compara opciones y deja lista una ruta realista para comenzar esta semana.",
];

const heroSignal = [
  {
    value: "20+",
    label: "años acompañando rutas reales con método visual y práctica activa.",
  },
  {
    value: "10",
    label: "videos locales organizados por introducción, método y testimonios.",
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
  { value: "+1000", label: "estudiantes guiados con experiencia práctica y videos reales" },
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
    slug: "ingles-jovenes-adultos",
    title: "Inglés para jóvenes y adultos",
    category: "ingles",
    mode: "Presencial, híbrido y online",
    audience: "Adultos y jóvenes en EE. UU.",
    bestFor: "Ideal si quieres hablar con más seguridad en trabajo, escuela o trámites.",
    fit: "Ideal si quieres conversar con más seguridad en trabajo, escuela o trámites diarios.",
    cta: "Ver inglés",
    image: site.images.adultEnglish,
    imageAlt: "Estudiante adulta practicando conversación en una clase de inglés con apoyo visual.",
    summary:
      "Un camino directo para hablar con confianza, entendiendo situaciones reales: trabajo, estudios, servicios y vida diaria.",
    details: [
      "Objetivo práctico: conversar y comprender con naturalidad en contexto real.",
      "Modalidad presencial o online para adaptarse a tu agenda.",
      "Talleres y tutorías con seguimiento de progreso semanal.",
    ],
    courseDetail: {
      lead:
        "Programa principal para adultos y jóvenes dentro de Estados Unidos que quieren hablar y comprender inglés sin depender de traducción constante.",
      sections: [
        {
          title: "Lo que trabaja el programa",
          items: [
            "Hablar y comprender inglés en presente, pasado y futuro con una meta de nivel intermedio a mediano plazo.",
            "Pensar en inglés usando el método Graphic Concept en vez de memorizar listas extensas.",
            "Practicar conversación para trabajo, escuela, trámites y vida diaria.",
          ],
        },
        {
          title: "Experiencia de clase",
          items: [
            "Talleres y workshops con aulas vivas dentro y fuera del instituto.",
            "Tutorías para aclarar dudas, actualizarse, nivelarse y mejorar habilidades.",
            "Docentes bilingües y norteamericanos entrenados en la metodología de AiT USA.",
          ],
        },
        {
          title: "Niveles",
          items: [
            "Básico: palabras y expresiones frecuentes, presente y base de no traducción.",
            "Intermedio: pasado y futuro con refuerzo visual del método.",
            "Avanzado: conversación con profesores americanos, escritura, lectura y comprensión.",
          ],
        },
      ],
      schedule: [
        "Mañanas: 8:30 am, 9:30 am y 10:30 am.",
        "Noches: 6:20 pm, 7:30 pm y 8:40 pm.",
        "Sábados y domingos disponibles según bloque.",
      ],
      note: "El sitio original comunica presencial, híbrido y online; conviene confirmar sede y horario antes de inscribirse.",
    },
  },
  {
    slug: "ingles-online-adultos",
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
    courseDetail: {
      lead:
        "Ruta 100% online para estudiantes fuera de Estados Unidos que necesitan clases en vivo, guía visual y acompañamiento remoto.",
      sections: [
        {
          title: "Metodología online",
          items: [
            "Graphic Concept ayuda a visualizar la armonía de tiempos y palabras sin textos engorrosos.",
            "El objetivo es comprender inglés americano y responder sin traducir palabra por palabra.",
            "El proceso se apoya en sesiones en vivo, material visual y seguimiento por WhatsApp.",
          ],
        },
        {
          title: "Soporte académico",
          items: [
            "Tutoría virtual gratuita para dudas de gramática, vocabulario y otras necesidades académicas.",
            "Docentes seleccionados y entrenados en metodologías aplicadas por más de 17 años.",
            "Talleres y workshops para llevar la práctica a escenarios reales.",
          ],
        },
        {
          title: "Ruta por niveles",
          items: [
            "Básico, intermedio y avanzado.",
            "Meta comunicada por el sitio original: comprender presente, pasado y futuro en aproximadamente 10 meses con persistencia.",
            "Becas para alumnos destacados al concluir niveles básico e intermedio.",
          ],
        },
      ],
      schedule: [
        "Formato online desde cualquier país.",
        "Requiere equipo con internet, audífono y micrófono para participar con claridad.",
      ],
      note: "La página original prioriza metodología, tutorías, niveles, workshops y becas.",
    },
  },
  {
    slug: "ingles-ninos",
    title: "Inglés para niños",
    category: "ninos",
    mode: "100% online",
    audience: "Niños de 8 a 13 años",
    bestFor: "Ideal para familias que quieren práctica visual y seguimiento constante.",
    fit: "Ideal para familias que quieren práctica visual y acompañamiento constante.",
    cta: "Ver niños",
    image: site.images.kidsEnglish,
    imageAlt: "Instructora guiando a una niña en una clase de inglés online con materiales visuales.",
    summary:
      "Aprendizaje divertido y práctico para que niños de 8 a 13 años comprendan y hablen en inglés.",
    details: [
      "Ruta por niveles con metas claras y actividades de uso diario.",
      "Informes mensuales para padres con mejoras concretas.",
      "Inscripción guiada para definir nivel y horario ideal.",
    ],
    courseDetail: {
      lead:
        "Clases online para niños de 8 a 13 años con enfoque práctico, divertido y seguimiento para padres o tutores.",
      sections: [
        {
          title: "Objetivo para niños",
          items: [
            "Hablar inglés en presente, pasado y futuro a mediano plazo con una meta de nivel intermedio.",
            "Aprender a pensar en inglés y evitar traducir cada frase.",
            "Usar Graphic Concept para entender visualmente tiempos y palabras.",
          ],
        },
        {
          title: "Acompañamiento familiar",
          items: [
            "Docentes bilingües ayudan en la transición hacia docentes americanos.",
            "Padres o tutores reciben informes de avance.",
            "La inscripción inicial ayuda a ubicar nivel y horario sin exigir pago inmediato.",
          ],
        },
      ],
      schedule: [
        "Lunes a jueves por la mañana: 9:30 am a 10:30 am y 10:30 am a 11:30 am.",
        "Lunes a jueves por la tarde/noche: 6:30 pm, 7:30 pm y 8:30 pm.",
        "Sábados: 10:00 am a 1:00 pm y 2:00 pm a 5:00 pm.",
      ],
      note: "El contenido original repite algunos bloques; aquí quedó consolidado para lectura clara.",
    },
  },
  {
    slug: "espanol-extranjeros",
    title: "Español para extranjeros",
    category: "idiomas",
    mode: "Online",
    audience: "Personas que quieren aprender español",
    bestFor: "Ideal si quieres moverte con más seguridad en estudio y trabajo.",
    fit: "Ideal si quieres moverte con más seguridad en contextos de estudio y trabajo.",
    cta: "Ver español",
    image: site.images.spanish,
    imageAlt: "Instructora guiando una clase conversacional por videollamada con apoyo visual.",
    summary:
      "Clases de español conversacional para moverse con más seguridad en estudio y trabajo.",
    details: [
      "Enfoque en comunicación útil para contextos reales.",
      "Profesores de Colombia y Perú con seguimiento práctico.",
      "Horarios flexibles y acompañamiento por WhatsApp.",
    ],
    courseDetail: {
      lead:
        "Curso online para estudiantes que quieren vivir la experiencia de aprender español con profesores desde Latinoamérica.",
      sections: [
        {
          title: "Enfoque",
          items: [
            "Conversación útil para estudio, trabajo y vida diaria.",
            "Contacto con expresiones coloquiales de Colombia y Perú.",
            "Acompañamiento remoto para resolver dudas y elegir horario.",
          ],
        },
        {
          title: "Lo que falta por enriquecer",
          items: [
            "La página pública de detalle aparece casi vacía en la captura actual.",
            "El resumen visible del curso viene principalmente del listado público de cursos.",
            "Podemos ampliar esta página cuando recuperemos material interno de Wix o nuevo copy del equipo.",
          ],
        },
      ],
      schedule: ["Horario online a confirmar por WhatsApp según país y disponibilidad."],
      note: "Buen candidato para reforzar con copy adicional antes de publicar.",
    },
  },
  {
    slug: "ged",
    title: "GED",
    category: "academico",
    mode: "Presencial",
    audience: "Adultos que buscan el GED",
    bestFor: "Ideal si buscas avanzar hacia el diploma equivalente a High School.",
    fit: "Ideal si buscas avanzar hacia el diploma equivalente a High School con ruta guiada.",
    cta: "Ver GED",
    image: site.images.ged,
    imageAlt: "Tutora guiando preparación GED con workbook, lápices y calculadora.",
    summary:
      "Acompañamiento estructurado para avanzar hacia el diploma equivalente a High School.",
    details: [
      "Acompañamiento académico por módulos de alto impacto.",
      "Orientación inicial por WhatsApp para elegir formato y ruta.",
      "Modalidad presencial u online según disponibilidad.",
    ],
    courseDetail: {
      lead:
        "Preparación para adultos que buscan obtener el diploma equivalente a High School con una ruta guiada.",
      sections: [
        {
          title: "Estructura recuperada",
          items: [
            "Tiempo estimado: 6 meses.",
            "Dos clases por semana, una hora por clase.",
            "Orientación inicial para explicar proceso, nivel y punto de arranque.",
          ],
        },
        {
          title: "Ideal para",
          items: [
            "Adultos que necesitan avanzar hacia equivalencia de High School.",
            "Estudiantes que requieren estructura semanal y seguimiento.",
            "Personas que prefieren confirmar proceso y horarios antes de pagar.",
          ],
        },
      ],
      schedule: [
        "Sábados: 9:00 am a 11:00 am.",
        "Sábados: 11:00 am a 1:00 pm.",
        "Sábados: 2:00 pm a 4:00 pm o 4:00 pm a 6:00 pm.",
      ],
      note: "La página pública de detalle es escasa; los horarios vienen del producto GED capturado desde Wix.",
    },
  },
  {
    slug: "tutorias-matematicas",
    title: "Tutorías en matemáticas",
    category: "academico",
    mode: "Presencial u online",
    audience: "Secundaria y universidad",
    bestFor: "Ideal cuando necesitas recuperar ritmo y aclarar temas críticos.",
    fit: "Ideal cuando necesitas recuperar ritmo y aclarar temas críticos sin perder tiempo.",
    cta: "Ver tutorías",
    image: site.images.math,
    imageAlt: "Tutora guiando una clase de matemáticas con calculadora, cuaderno y ejercicios.",
    summary:
      "Refuerzos cortos y focalizados para recuperar ritmo en secuencia académica.",
    details: [
      "Plan de recuperación para problemas críticos de escuela y universidad.",
      "Nivelación progresiva desde la práctica guiada.",
      "Horario coordinado según disponibilidad.",
    ],
    courseDetail: {
      lead:
        "Tutorías para estudiantes de secundaria o universidad que necesitan recuperar ritmo y aclarar temas críticos.",
      sections: [
        {
          title: "Cuándo conviene",
          items: [
            "Cuando hay dificultades con cursos de escuela secundaria o universidad.",
            "Cuando el estudiante necesita nivelación y explicación guiada.",
            "Cuando hace falta un refuerzo corto antes de exámenes o entregas importantes.",
          ],
        },
        {
          title: "Cómo se coordina",
          items: [
            "Diagnóstico rápido del tema que está bloqueando el avance.",
            "Horario coordinado según disponibilidad del estudiante.",
            "Seguimiento por WhatsApp para acordar próximos pasos.",
          ],
        },
      ],
      schedule: ["Horario presencial u online a confirmar según materia, nivel y disponibilidad."],
      note: "La página pública de detalle aparece casi vacía; el resumen visible viene del listado de cursos.",
    },
  },
  {
    slug: "computacion-basica",
    title: "Computación básica",
    category: "tecnologia",
    mode: "Curso práctico",
    audience: "Principiantes",
    bestFor: "Ideal si quieres aprender desde cero a usar internet y archivos.",
    fit: "Ideal si quieres aprender desde cero a usar internet, archivos y herramientas básicas.",
    cta: "Ver computación",
    image: site.images.computing,
    imageAlt: "Instructora guiando una clase de computación básica con laptop, tablet y teléfono.",
    summary:
      "Curso práctico para dominar navegación, productividad y herramientas digitales esenciales.",
    details: [
      "Rutinas de uso diario de internet y archivos personales.",
      "Habilidades funcionales para estudiar y trabajar.",
      "Acompañamiento para estudiantes principiantes y adultos.",
    ],
    courseDetail: {
      lead:
        "Curso práctico para principiantes que quieren usar computadora e internet con más independencia.",
      sections: [
        {
          title: "Cursos básicos",
          items: [
            "Internet: ver, hablar y escribir con familia y amigos, buscar trabajo, direcciones, inmigración, música, correos, fotos, pagos y más.",
            "Mac o Windows: administrar, proteger, limpiar virus, manejar claves, instalar y desinstalar programas.",
            "Mantenimiento preventivo y habilidades de uso diario.",
          ],
        },
        {
          title: "Ideal para",
          items: [
            "Personas que empiezan desde cero.",
            "Adultos que quieren independencia digital para trámites, pagos y comunicación.",
            "Estudiantes que necesitan base antes de pasar a herramientas de oficina.",
          ],
        },
      ],
      schedule: [
        "Cursos básicos: lunes y miércoles 10:00 am a 11:00 am.",
        "Sábados: 2:00 pm a 4:00 pm.",
        "Noches: lunes y miércoles 6:00 pm a 7:00 pm.",
      ],
      note: "Preguntar por otros horarios disponibles.",
    },
  },
  {
    slug: "computacion-oficina",
    title: "Computación para oficina",
    category: "tecnologia",
    mode: "Herramientas de oficina",
    audience: "Trabajo y administración",
    bestFor: "Ideal si buscas mejorar productividad con Word, Excel y PowerPoint.",
    fit: "Ideal si buscas mejorar productividad con Word, Excel y PowerPoint.",
    cta: "Ver oficina",
    image: site.images.office,
    imageAlt: "Herramientas de Microsoft Office y una persona trabajando en computadora.",
    summary:
      "Entrenamiento en Word, Excel y PowerPoint para productividad en vida real.",
    details: [
      "Plantillas listas para usar en trabajo, escuela y proyectos.",
      "Proyectos de práctica con documentos y presentaciones.",
      "Ruta desde nivel inicial hasta dominio funcional intermedio.",
    ],
    courseDetail: {
      lead:
        "Entrenamiento para usar Word, Excel y PowerPoint en tareas reales de oficina, estudio y administración.",
      sections: [
        {
          title: "Microsoft Word",
          items: [
            "Procesador de textos para cartas, estimados, facturas, recibos, memos e informes.",
            "Preparación de resúmenes, flyers, avisos y documentos prácticos.",
            "Duración capturada: 4 semanas.",
          ],
        },
        {
          title: "Microsoft Excel",
          items: [
            "Formatos, bases de datos, gráficos estadísticos y operadores matemáticos.",
            "Aplicación en casos reales de oficina.",
            "Duración capturada: 8 semanas.",
          ],
        },
        {
          title: "Microsoft PowerPoint",
          items: [
            "Diapositivas con imágenes, texto, efectos y animación.",
            "Presentaciones para vender, capacitar o presentar proyectos.",
            "Duración capturada: 4 semanas.",
          ],
        },
      ],
      schedule: [
        "Cursos de oficina: martes y jueves 10:00 am a 11:00 am.",
        "Sábados: 4:00 pm a 6:00 pm.",
        "Noches: martes y jueves 6:00 pm a 7:00 pm.",
      ],
      note: "Preguntar por otros horarios disponibles.",
    },
  },
  {
    slug: "reparacion-computadoras",
    title: "Reparación de computadoras",
    category: "tecnologia",
    mode: "Curso técnico",
    audience: "Soporte técnico y mantenimiento",
    bestFor: "Ideal si te interesa soporte básico, diagnóstico y mantenimiento.",
    fit: "Ideal si te interesa soporte básico, diagnóstico y mantenimiento de equipos.",
    cta: "Ver reparación",
    image: site.images.repair,
    imageAlt: "Técnico reparando una computadora portátil con herramientas y placa base.",
    summary:
      "Curso introductorio de diagnóstico, mantenimiento y soporte básico de equipos.",
    details: [
      "Diagnóstico inicial de problemas frecuentes en equipos.",
      "Mantenimiento básico para laptop y desktop.",
      "Acompañamiento para dudas rápidas y continuidad de curso.",
    ],
    courseDetail: {
      lead:
        "Curso técnico introductorio para aprender diagnóstico, mantenimiento y reparación básica de laptops y desktops.",
      sections: [
        {
          title: "Lo que comunica el sitio original",
          items: [
            "Aprender a reparar cualquier marca y modelo de computadora, laptop o desktop.",
            "Base de diagnóstico y mantenimiento para problemas frecuentes.",
            "Orientación por WhatsApp para confirmar nivel y ruta técnica.",
          ],
        },
        {
          title: "Ruta técnica relacionada",
          items: [
            "El producto Wix también menciona Computer Repair & Networking como curso online de 3 meses.",
            "Ese producto aparece junto a Diseño Gráfico y Web Design.",
            "Precio de referencia capturado para Computer Repair & Networking: $2,400.",
          ],
        },
      ],
      schedule: [
        "Ruta técnica online: viernes 10:00 am a 12:30 pm, sábado 10:00 am a 12:30 pm o viernes 6:00 pm a 8:30 pm.",
        "Preguntar por otros horarios disponibles.",
      ],
      note: "La página pública de reparación está escasa; esta versión combina el listado público con datos del producto técnico capturado.",
    },
  },
];

const heroGallery = [
  {
    label: "Video de introducción",
    title: "Conoce el punto de partida antes de elegir programa.",
    image: site.images.introVideoPoster,
    video: site.images.introVideo,
    videoPoster: site.images.introVideoPoster,
    imageAlt: "Frame del video introductorio de AiT USA Institute.",
  },
  {
    label: "Promoción general",
    title:
      "Una vista rápida de la experiencia, programas y acompañamiento.",
    image: site.images.promoVideoPoster,
    video: site.images.promoVideo,
    videoPoster: site.images.promoVideoPoster,
    imageAlt:
      "Frame del video promocional de AiT USA Institute.",
  },
  {
    label: "Lo que nos diferencia",
    title: "Método visual, práctica guiada y seguimiento cercano.",
    image: site.images.differenceVideoPoster,
    video: site.images.differenceVideo,
    videoPoster: site.images.differenceVideoPoster,
    imageAlt: "Frame del video sobre lo que diferencia a AiT USA.",
  },
  {
    label: "Característica clave",
    title: "Un primer vistazo a cómo se ordena la ruta de estudio.",
    image: site.images.firstCharacteristicVideoPoster,
    video: site.images.firstCharacteristicVideo,
    videoPoster: site.images.firstCharacteristicVideoPoster,
    imageAlt: "Frame del primer video de características del método.",
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
    value: "10",
    label: "videos reales para validar método, ritmo y encaje antes de tomar tu siguiente paso.",
    href: "#experiencia",
    cta: "Ver videos",
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
    title: "Qué hace diferente a AiT USA",
    eyebrow: "Diferenciador",
    image: site.images.differenceVideoPoster,
    video: site.images.differenceVideo,
    videoPoster: site.images.differenceVideoPoster,
    imageAlt: "Frame del video sobre lo que diferencia a AiT USA.",
    caption:
      "Una explicación breve de lo que hace distinta la experiencia frente a una clase genérica.",
    duration: "0:38",
  },
  {
    title: "Tercera característica del método",
    eyebrow: "Característica 3",
    image: site.images.thirdCharacteristicVideoPoster,
    video: site.images.thirdCharacteristicVideo,
    videoPoster: site.images.thirdCharacteristicVideoPoster,
    imageAlt:
      "Instructora mostrando el progreso por niveles mientras guía una clase visual.",
    caption:
      "El tercer clip resume la continuidad: objetivo, práctica y seguimiento para avanzar sin perder ritmo.",
    duration: "0:17",
  },
  {
    title: "Primera característica del método",
    eyebrow: "Característica 1",
    image: site.images.firstCharacteristicVideoPoster,
    video: site.images.firstCharacteristicVideo,
    videoPoster: site.images.firstCharacteristicVideoPoster,
    imageAlt:
      "Frame del primer video de características del método.",
    caption:
      "El primer clip explica cómo el método organiza el aprendizaje para que el estudiante vea la ruta.",
    duration: "0:33",
  },
  {
    title: "Segunda característica del método",
    eyebrow: "Característica 2",
    image: site.images.secondCharacteristicVideoPoster,
    video: site.images.secondCharacteristicVideo,
    videoPoster: site.images.secondCharacteristicVideoPoster,
    imageAlt:
      "Frame del segundo video de características del método.",
    caption:
      "Un segundo clip muestra cómo la práctica se vuelve concreta, repetible y fácil de seguir.",
    duration: "0:26",
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
    title: "Ves videos reales",
    image: site.images.method,
    imageAlt: "Instructora explicando el método con un diagrama visual en el pizarrón.",
    text:
      "Empiezas con un ejemplo real para entender la dinámica antes de invertir en la ruta completa.",
  },
  {
    title: "Practicas con corrección",
    image: site.images.tutoring,
    imageAlt: "Estudiante recibiendo corrección y apoyo en una tutoría virtual.",
    text:
      "La docente corrige pronunciación y estructura mientras participas, no después.",
  },
  {
    title: "Pides apoyo flexible",
    image: site.images.level,
    imageAlt: "Estudiante practicando con laptop y cuaderno mientras recibe apoyo flexible.",
    text:
      "Si necesitas refuerzo, sumamos tutoría online o presencial para destrabar ese punto.",
  },
  {
    title: "Avanzas por niveles",
    image: site.images.routeLevels,
    imageAlt: "Instructora guiando el avance por niveles con una escala de progreso colorida.",
    text:
      "Básico, intermedio y avanzado avanzan con metas claras y continuidad semanal.",
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
    name: "Estudiante internacional",
    image: site.images.internationalStudentVideoPoster,
    video: site.images.internationalStudentVideo,
    videoPoster: site.images.internationalStudentVideoPoster,
    duration: "0:46",
    imageAlt: "Antonina y Zulma compartiendo su experiencia real en una clase de inglés de AiT USA.",
    result: "Testimonio internacional",
    text:
      "Una perspectiva de estudiante que ayuda a entender cómo se vive la experiencia cuando necesitas una ruta clara desde otro contexto.",
  },
  {
    name: "Eric",
    image: site.images.ericInterviewVideoPoster,
    video: site.images.ericInterviewVideo,
    videoPoster: site.images.ericInterviewVideoPoster,
    duration: "0:42",
    imageAlt:
      "Estudiante compartiendo su entrevista sobre la experiencia de aprendizaje en AiT USA.",
    result: "Entrevista de estudiante",
    text:
      "Una entrevista breve para escuchar de primera mano qué cambia cuando el método y el acompañamiento son constantes.",
  },
  {
    name: "Jessica",
    image: site.images.jessicaInterviewVideoPoster,
    video: site.images.jessicaInterviewVideo,
    videoPoster: site.images.jessicaInterviewVideoPoster,
    duration: "2:52",
    imageAlt:
      "Estudiante adulta compartiendo su experiencia de aprendizaje en AiT USA.",
    result: "Entrevista completa",
    text:
      "La versión completa permite escuchar más contexto, ritmo y detalles de la experiencia real.",
  },
  {
    name: "Leila",
    image: site.images.leilaTestimonialVideoPoster,
    video: site.images.leilaTestimonialVideo,
    videoPoster: site.images.leilaTestimonialVideoPoster,
    duration: "1:06",
    imageAlt:
      "Estudiante compartiendo testimonio en video sobre su avance y experiencia.",
    result: "Testimonio en video",
    text:
      "Este testimonio se mantiene como reproducción manual para que el usuario controle el audio desde el inicio.",
  },
];

const teachers = [
  {
    name: "Instructora de inglés conversacional",
    intent: "classSample",
    href: "#experiencia",
    image: site.images.contact,
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
    image: site.images.heroFemaleZoom,
    imageAlt: "Instructora de AiT USA guiando una clase online con audífonos y micrófono.",
    role: "Aprendizaje remoto con participación guiada.",
    description:
      "Guía la dinámica desde la distancia para que practiques confianza oral con apoyo y estructura.",
    badge: "Formato online",
  },
  {
    name: "Instructora de continuidad académica",
    intent: "default",
    href: "#contacto",
    image: site.images.routeLevels,
    imageAlt: "Instructora de AiT USA mostrando el avance por niveles y metas semanales.",
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

const trustFeature = [
  {
    title: "Clase real en vivo",
    copy:
      "Mira una docente real guiando la práctica por Zoom mientras corrige pronunciación, ritmo y seguridad en el momento.",
    image: site.images.heroFemaleZoom,
    imageAlt: "Instructora de AiT USA guiando una clase online con audífonos y micrófono.",
    chips: ["Corrección inmediata", "Voz real", "Formato online"],
  },
  {
    title: "Aprendizaje con presencia",
    copy:
      "La experiencia no se siente genérica: ves una profesora, una dinámica real y una conversación que avanza con claridad.",
    image: site.images.heroClassroom,
    imageAlt: "Instructora de AiT USA liderando una clase real frente al pizarrón con apoyo visual.",
    chips: ["Clase visible", "Seguimiento", "Confianza"],
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
    title: "Necesito ajustar mi presupuesto",
    text: "Compararemos mensualidad, libro, registración y modalidad para encontrar la ruta que encaje contigo sin perder claridad.",
    cta: "Hablar con asesor",
    href: "#contacto",
    image: site.images.scholarship,
    imageAlt: "Dos estudiantes revisando opciones de estudio con laptop y cuaderno.",
    tag: "Apoyo y presupuesto",
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
    eyebrow: "Equipo",
    title: "Laptop, tablet o móvil",
    text:
      "Accede desde el dispositivo que ya usas para ver tu clase, repasar y seguir tu ruta sin complicaciones.",
    image: site.images.devices,
    imageAlt: "Laptop, tablet y teléfono listos para una clase online y repaso en casa.",
  },
  {
    eyebrow: "En vivo",
    title: "Clase online en vivo",
    text: "Escucha, participa y corrige con una instructora real que guía la sesión en tiempo real.",
    image: site.images.onlineEnglish,
    imageAlt: "Instructora con audífonos guiando una clase online en vivo.",
  },
  {
    eyebrow: "Corrección",
    title: "Zoom con instructora real",
    text: "La clase se siente cercana y clara, aunque estés a distancia, porque ves la corrección mientras ocurre.",
    image: site.images.heroFemaleZoom,
    imageAlt: "Instructora guiando una clase online con audífonos y micrófono.",
  },
  {
    eyebrow: "Repaso",
    title: "Repaso guiado en casa",
    text: "Refuerza tu progreso con conversación real y material visual que sí te ayuda a recordar.",
    image: site.images.adultEnglish,
    imageAlt: "Estudiante adulta practicando conversación y tomando notas con apoyo visual.",
  },
];

const requirements = [
  {
    eyebrow: "Recomendado",
    title: "Audífono y micrófono",
    image: site.images.onlineEnglish,
    imageAlt: "Instructora usando audífonos con micrófono en una clase online.",
    text: "Recomendado para escuchar mejor, hablar con claridad y evitar interferencias.",
  },
  {
    eyebrow: "Básico",
    title: "Dispositivo con internet",
    image: site.images.devices,
    imageAlt: "Laptop, tablet y teléfono para conectarse a clases online.",
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
    imageAlt: "Estudiante adulta tomando clase online desde casa con laptop y cuaderno.",
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
    imageAlt: "Estudiante estudiando con libro abierto, cuaderno y laptop.",
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
    imageAlt: "Instructora guiando registración + libro con workbook y laptop en la mesa.",
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
    imageAlt: "Estudiante completando registración con apoyo de una instructora y tablet en la mesa.",
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
    imageAlt: "Instructora guiando una clase de programación y diseño con código y wireframes en pantalla.",
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
    imageAlt: "Tutora guiando preparación GED con workbook, lápices y calculadora.",
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
    imageAlt: "Instructora guiando a una estudiante en computación para oficina con laptop y gráficos en pantalla.",
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
    cta: "Ver videos reales",
  },
  {
    question: "¿Puedo ver videos reales antes de inscribirme?",
    answer:
      "Sí. Ve el video de experiencia para observar el ritmo de clase, la corrección en vivo y cómo se maneja la práctica oral con tus mismas dudas iniciales.",
    outcome: "Si el formato te funciona, ya sabes qué esperar antes de escribir.",
    cta: "Ver videos reales",
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
  trustFeature,
  paymentGuides,
  contactPrep,
  footerFacts,
  courseGuides,
};

