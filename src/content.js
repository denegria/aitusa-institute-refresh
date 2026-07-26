const asset = (name) => `./public/assets/wix/${name}`;
const assetHires = (name) => asset(`hires/${name}`);
const assetVideo = (name) => asset(`videos/${name}`);
const assetVideoPoster = (name) => asset(`videos/posters/${name}`);

const site = {
  name: "AiT USA Institute",
  legal: "Division of Arrieta Institute LLC",
  tagline:
    "Una escuela de inglés diferente desde 2004.",
  description:
    "Aprende inglés con práctica guiada, clases reales y opciones presenciales, híbridas u online.",
  heroHeadline:
    "Aprende inglés sin traducir ni memorizar miles de palabras.",
  heroLead:
    "Método Graphic Concept, práctica guiada, videos reales y una ruta clara para saber por dónde empezar.",
  heroQuote:
    "Conoce el método. Después compara curso, horario y formato con menos dudas.",
  heroMicrocopy:
    "Mira el video real y después pide una ruta inicial por WhatsApp.",
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
    "Tecnicas de comprension para dejar de traducir palabra por palabra.",
    "Practica para hablar sin memorizar miles de palabras sueltas.",
    "Ruta presencial, híbrida u online según tu horario real.",
  ],
  canonical: "https://www.aitusainstitute.com/",
  founded: "2004",
  phone: "+1 732-271-0011",
  phoneHref: "tel:+17322710011",
  whatsapp: "+1 732-379-0593",
  whatsappHref: "https://wa.me/17323790593",
  legalLinks: {
    privacy: "/privacy-policy",
    terms: "/terms-and-conditions",
    contact: "/contactanos",
  },
  smsConsent: {
    disclosureVersion: "aitusa-sms-consent-2026-07-17-v1",
    contactPermission:
      "Autorizo a AIT USA Institute a responder esta solicitud por teléfono, correo electrónico o WhatsApp. Esta autorización no incluye mensajes de texto promocionales.",
    checkboxLabel:
      "Sí, deseo recibir mensajes de texto de AIT USA Institute.",
    disclosure:
      "Al marcar esta casilla, acepto recibir mensajes de texto de AIT USA Institute sobre consultas, inscripción, clases, exámenes de ubicación, recordatorios y promociones. La frecuencia de los mensajes puede variar. Pueden aplicarse tarifas de mensajes y datos. Responde STOP para cancelar y HELP para obtener ayuda. El consentimiento no es una condición para comprar ni recibir servicios.",
  },
  twitterHandle: "@AiTUSA_Institute",
  seoTitle:
    "AiT USA Institute | Inglés, GED y computación en Nueva Jersey",
  seoDescription:
    "Aprende inglés con el método Graphic Concept, práctica guiada y clases reales en Nueva Jersey o desde donde estés.",
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
    level: "/placement-test/",
    offer: "https://wa.me/17323790593",
    registration: "https://wa.me/17323790593",
  },
  images: {
    logo: asset("076-solo-logo-4-x-4-clases1.png"),
    approvedHero: "./public/assets/hero/approved-concept-1-clean.png",
    hero: assetHires("graphic-concept-method.jpg"),
    heroPoster: assetHires("graphic-concept-method.jpg"),
    heroVideo: assetVideo("intro-video-great.mp4"),
    heroVideoPortrait: assetVideo("intro-video-great.mp4"),
    heroVideoPoster: assetVideoPoster("intro-video-great.jpg"),
    introVideo: assetVideo("intro-video-great.mp4"),
    introVideoPoster: assetVideoPoster("intro-video-great.jpg"),
    thirdCharacteristicVideo: assetVideo("third-characteristic.mp4"),
    thirdCharacteristicVideoPoster: assetVideoPoster("third-characteristic.jpg"),
    differenceVideo: assetVideo("what-makes-us-different.mp4"),
    methodStudioPoster: assetVideoPoster("what-makes-us-different.jpg"),
    internationalStudentVideo: assetVideo("international-student-testimonial.mp4"),
    internationalStudentVideoPoster: assetVideoPoster("international-student-testimonial.jpg"),
    ericInterviewVideo: assetVideo("student-interview-eric-great.mp4"),
    ericInterviewVideoPoster: assetVideoPoster("student-interview-eric-great.jpg"),
    jessicaInterviewVideo: assetVideo("student-interview-jessica-great.mp4"),
    jessicaInterviewVideoPoster: assetVideoPoster("student-interview-jessica-great.jpg"),
    heroClassroom: assetHires("hero-classroom.jpg"),
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
    contactAlt:
      "Salón de AiT USA preparado para una clase de inglés con estudiantes.",
    headset: assetHires("online-instructor-headset.jpg"),
    devices: assetHires("devices-study.jpg"),
    productGed: asset("products/product-ged.jpg"),
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
  "Conoce el método antes de inscribirte",
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
      note: "Los formatos y horarios pueden variar por sede. Confirma tu grupo antes de inscribirte.",
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
            "Meta del programa: comprender presente, pasado y futuro en aproximadamente 10 meses con práctica constante.",
            "Becas para alumnos destacados al concluir niveles básico e intermedio.",
          ],
        },
      ],
      schedule: [
        "Formato online desde cualquier país.",
        "Requiere equipo con internet, audífono y micrófono para participar con claridad.",
      ],
      note: "Pregunta por tutorías, niveles, talleres y becas disponibles para tu grupo.",
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
      note: "El nivel y el horario recomendado se confirman con la familia antes de la inscripción.",
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
          title: "Cómo se desarrolla",
          items: [
            "Práctica conversacional con situaciones de estudio, trabajo y vida diaria.",
            "Actividades guiadas para ganar vocabulario y responder con más seguridad.",
            "Seguimiento remoto para resolver dudas y mantener continuidad.",
          ],
        },
      ],
      schedule: ["Horario online a confirmar por WhatsApp según país y disponibilidad."],
      note: "Confirma el grupo disponible y la zona horaria antes de inscribirte.",
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
          title: "Cómo funciona",
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
      note: "Confirma el bloque disponible y tu punto de inicio antes de inscribirte.",
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
      note: "La materia, el nivel y el horario se confirman antes de empezar.",
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
            "Duración estimada: 4 semanas.",
          ],
        },
        {
          title: "Microsoft Excel",
          items: [
            "Formatos, bases de datos, gráficos estadísticos y operadores matemáticos.",
            "Aplicación en casos reales de oficina.",
            "Duración estimada: 8 semanas.",
          ],
        },
        {
          title: "Microsoft PowerPoint",
          items: [
            "Diapositivas con imágenes, texto, efectos y animación.",
            "Presentaciones para vender, capacitar o presentar proyectos.",
            "Duración estimada: 4 semanas.",
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
          title: "Lo que aprenderás",
          items: [
            "Aprender a reparar cualquier marca y modelo de computadora, laptop o desktop.",
            "Base de diagnóstico y mantenimiento para problemas frecuentes.",
            "Orientación por WhatsApp para confirmar nivel y ruta técnica.",
          ],
        },
        {
          title: "Ruta técnica relacionada",
          items: [
            "Pregunta por la modalidad online de Computer Repair & Networking.",
            "También puedes consultar opciones relacionadas con Diseño Gráfico y Web Design.",
            "Confirma duración, horario y precio antes de inscribirte.",
          ],
        },
      ],
      schedule: [
        "Ruta técnica online: viernes 10:00 am a 12:30 pm, sábado 10:00 am a 12:30 pm o viernes 6:00 pm a 8:30 pm.",
        "Preguntar por otros horarios disponibles.",
      ],
      note: "La disponibilidad de esta ruta técnica puede variar. Confirma grupo y modalidad con un asesor.",
    },
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
    value: "8",
    label: "videos reales activos para validar método, ritmo y encaje antes de tomar tu siguiente paso.",
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

const methodCharacteristics = [
  {
    number: "01",
    title: "Ruta visual antes de memorizar",
    eyebrow: "Graphic Concept",
    description:
      "El estudiante ve el mapa de la clase, el objetivo de la semana y la relación entre vocabulario, conversación y práctica.",
    proof: "Menos confusión, más dirección desde la primera sesión.",
  },
  {
    number: "02",
    title: "Práctica guiada con corrección",
    eyebrow: "Corrección activa",
    description:
      "La clase no se queda en teoría: hay conversación, repetición útil y ajustes en vivo para que cada intento sea más claro.",
    proof: "El estudiante entiende qué corregir y cómo repetirlo mejor.",
  },
  {
    number: "03",
    title: "Continuidad hasta ganar confianza",
    eyebrow: "Seguimiento real",
    description:
      "Cada bloque conecta con el siguiente para mantener ritmo, medir avance y adaptar presencial, híbrido u online a la agenda real.",
    proof: "La ruta no depende de motivación suelta; depende de estructura.",
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

const verifiedClassHours = [
  "Lunes a jueves: 8:30 am, 9:30 am y 10:30 am",
  "Lunes a jueves: 6:20 pm, 7:30 pm y 8:40 pm",
  "Sábados: 10:00 am a 1:00 pm y 3:00 pm a 5:30 pm",
  "Domingos: 10:00 am a 12:30 pm",
];

const centralLocationContact = {
  phone: site.phone,
  phoneHref: site.phoneHref,
  whatsapp: site.whatsapp,
  whatsappHref: site.whatsappHref,
  hoursLabel: "Horarios de clase publicados",
  hours: verifiedClassHours,
};

const locations = [
  {
    city: "Bound Brook, New Jersey",
    address: "213 E. Main St., Bound Brook, NJ 08805",
    mapKey: "bound-brook",
    note: "Oficina central / sede principal",
    status: "active",
    bestFor: "Ideal si quieres una sede central con coordinación administrativa directa.",
    highlight: "Recepción principal y coordinación administrativa.",
    cta: "Escribir sobre Bound Brook",
    ...centralLocationContact,
  },
  {
    city: "Plainfield, New Jersey",
    address: "108 Watchung Ave., Plainfield, NJ 07060",
    mapKey: "plainfield",
    note: "Sede presencial",
    status: "active",
    bestFor: "Ideal si vives o trabajas en el centro de Nueva Jersey.",
    highlight: "Acceso fácil para estudiantes del área central de Nueva Jersey.",
    cta: "Escribir sobre Plainfield",
    ...centralLocationContact,
  },
  {
    city: "Piscataway, New Jersey",
    address: "451 S. Washington Ave., Piscataway, NJ 08854",
    mapKey: "piscataway",
    note: "Sede presencial",
    status: "active",
    bestFor: "Ideal si buscas una sede amplia y práctica para asistir con comodidad.",
    highlight: "Buena opción para quienes buscan una sede amplia y práctica.",
    cta: "Escribir sobre Piscataway",
    ...centralLocationContact,
  },
  {
    city: "Flemington, New Jersey",
    address: "Flemington, NJ, USA",
    mapKey: "flemington",
    note: "Atención con cita previa",
    status: "limited",
    bestFor: "Ideal si necesitas atención en el área de Flemington con coordinación previa.",
    highlight: "Atención disponible con cita previa.",
    cta: "Consultar atención en Flemington",
    ...centralLocationContact,
    hoursLabel: "Atención con cita previa",
    hours: ["Coordina el horario y punto de encuentro antes de asistir."],
  },
  {
    city: "New York / Online",
    address: "Atención online",
    note: "Atención para clases en línea",
    status: "online",
    bestFor: "Ideal si prefieres estudiar a distancia sin viajar a Nueva Jersey.",
    highlight: "Conexión remota para estudiantes fuera de Nueva Jersey.",
    cta: "Consultar online",
    ...centralLocationContact,
    hoursLabel: "Horario online",
    hours: ["La disponibilidad se confirma por WhatsApp según tu nivel y zona horaria."],
  },
  {
    city: "North Plainfield, New Jersey",
    address: "Dirección pendiente de confirmación",
    note: "Sede en revisión. No activa para inscripción pública todavía.",
    status: "pending",
    bestFor: "Mención informativa únicamente hasta confirmar dirección y operación final.",
    highlight: "Esta ubicación todavía no está disponible como sede activa.",
    cta: "Pedir actualización de North Plainfield",
  },
];

const testimonials = [
  {
    name: "Testimonio internacional",
    headline: "Una conversación sobre el proceso y lo que ayuda a avanzar con claridad.",
    image: site.images.internationalStudentVideoPoster,
    video: site.images.internationalStudentVideo,
    videoPoster: site.images.internationalStudentVideoPoster,
    videoWidth: 1080,
    videoHeight: 1080,
    duration: "0:46",
    imageAlt: "Una estudiante compartiendo su experiencia real con AiT USA.",
    result: "Testimonio internacional",
    text:
      "Escucha cómo vivió el proceso y qué le ayudó a avanzar con más claridad.",
  },
  {
    name: "Eric",
    headline: "Una entrevista breve sobre el método y el acompañamiento constante.",
    image: site.images.ericInterviewVideoPoster,
    video: site.images.ericInterviewVideo,
    videoPoster: site.images.ericInterviewVideoPoster,
    videoWidth: 480,
    videoHeight: 640,
    duration: "0:42",
    imageAlt:
      "Estudiante compartiendo su entrevista sobre la experiencia de aprendizaje en AiT USA.",
    result: "Entrevista de estudiante",
    text:
      "Una entrevista breve para escuchar qué cambia cuando el método y el acompañamiento se sienten constantes.",
  },
  {
    name: "Jessica",
    headline: "Una conversación sobre el ritmo de clase y la práctica que ayuda a avanzar.",
    image: site.images.jessicaInterviewVideoPoster,
    video: site.images.jessicaInterviewVideo,
    videoPoster: site.images.jessicaInterviewVideoPoster,
    videoWidth: 480,
    videoHeight: 848,
    duration: "2:52",
    imageAlt:
      "Jessica entrevistando a un estudiante sobre su experiencia de aprendizaje en AiT USA.",
    result: "Entrevista completa",
    text:
      "Jessica empezó como estudiante de AiT y hoy es una de las docentes referentes del método. Escucha más contexto sobre su experiencia, el ritmo de clase y los detalles que ayudan a avanzar.",
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

const faqs = [
  {
    question: "¿Cómo sé cuál es mi nivel de inglés?",
    answer:
      "Hacemos una evaluación breve para ubicar tu nivel y recomendarte por dónde empezar.",
    outcome: "Sales con una recomendación clara, sin adivinar.",
    cta: "Ver videos reales",
  },
  {
    question: "¿Es difícil aprender inglés si nunca fui bueno en idiomas?",
    answer:
      "No. Empezamos con ejemplos visuales, frases útiles y práctica guiada. Vas entendiendo primero y hablando poco a poco, sin memorizar listas interminables.",
    outcome: "Cuando entiendes el patrón, practicar se vuelve más claro.",
    cta: "Pedir orientación",
  },
  {
    question: "Voy a clases, pero no logro hablar. ¿Qué puedo hacer?",
    answer:
      "En clase no solo escuchas: practicas conversaciones cortas y recibes corrección en el momento. Así ganas seguridad para usar el inglés fuera del salón.",
    outcome: "Lo que aprendes en clase empieza a servirte en conversaciones reales.",
    cta: "Pedir orientación",
  },
  {
    question: "Entiendo la clase, pero luego se me olvida la práctica. ¿Es normal?",
    answer:
      "Sí, es normal al inicio. Usamos mapas visuales, repetición corta y rutina semanal para que lo que aprendes pase de escuchar a usarlo.",
    outcome: "La práctica breve y constante ayuda a que lo aprendido se quede contigo.",
    cta: "Ver libro",
  },
  {
    question: "No tengo mucho tiempo, pero quiero aprender a hablar inglés. ¿Puedo avanzar?",
    answer:
      "Puedes empezar con 15 a 20 minutos diarios y elegir horario flexible (mañana, noche o fin de semana) con metas pequeñas y medibles.",
    outcome: "Te proponemos un plan realista para avanzar sin desordenar tu agenda.",
    cta: "Ver horarios",
  },
  {
    question: "Trabajo todo el día. ¿Aun así puedo estudiar?",
    answer:
      "Sí. Tenemos opciones presenciales, híbridas y online para estudiar sin romper tu rutina laboral, con continuidad semanal realista.",
    outcome: "Puedes mantener continuidad aunque tu semana cambie.",
    cta: "Ver horarios",
  },
  {
    question: "Nunca fui buen estudiante. ¿Todavía puedo aprender?",
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

const painHero = {
  eyebrow: "Una escuela de inglés diferente",
  headline: "Si lo que buscas es HABLAR INGLÉS",
  headlineLead: "Si lo que buscas es",
  headlineEmphasis: "HABLAR INGLÉS",
  headlineAccent: "rápido, fácil y sin estrés.",
  subheadline:
    "Conoce una forma diferente de aprender, creada junto a nuestra comunidad durante más de 20 años.",
  subheadlineLines: [
    "Conoce una forma diferente de aprender, creada junto a",
    "nuestra comunidad durante más de 20 años.",
  ],
  ctas: {
    primary: "Encuentra tu nivel",
    secondary: "Conoce el método",
    tertiary: "Ver cursos detallados",
  },
};

const methodNarrative = {
  eyebrow: "Método Graphic Concept",
  heading: "Tres razones por las que somos diferentes.",
  introduction:
    "Durante más de 20 años trabajando con nuestra comunidad, conocimos de cerca sus necesidades y frustraciones. Por eso creamos métodos, técnicas y estrategias propias para quienes están cansados de intentarlo o de memorizar miles de palabras sin poder hablar.",
  videoLabel: "Conoce el método completo · 1:45",
  videoAriaLabel: "Conoce el método Graphic Concept completo",
  video: site.images.introVideo,
  videoPoster: site.images.introVideoPoster,
  videoWidth: 464,
  videoHeight: 832,
};

const solutionCharacteristics = [
  {
    key: "understand",
    icon: "ear",
    title: "Comprende sin traducir",
    body:
      "Aprende técnicas de comprensión para entender cuando te hablen en inglés.",
  },
  {
    key: "speak",
    icon: "message-circle",
    title: "Habla sin memorizar miles de palabras",
    body:
      "Practica estructuras que puedas usar, sin depender de listas interminables.",
  },
  {
    key: "graphic-concept",
    icon: "route",
    title: "Un método propio, patentado y probado",
    body:
      "Graphic Concept se adapta a tu nivel para ayudarte a hablar con más facilidad y rapidez.",
  },
];

const productOfferings = [
  {
    key: "in-person-english",
    anchor: "ingles-presencial",
    title: "Inglés presencial",
    badge: "En sedes de Nueva Jersey",
    marker: "Presencial",
    emphasis: "primary",
    audience: "Adultos y jóvenes que quieren practicar más de cerca",
    summary:
      "Practica cara a cara y recibe corrección inmediata en una sede de Nueva Jersey, con horarios publicados para sostener tu rutina.",
    details: [
      "Corrección en vivo y práctica constante.",
      "Sedes activas en Nueva Jersey más apoyo para elegir horario.",
      "Ideal para trabajo, entrevistas, escuela y vida diaria.",
    ],
    image: site.images.adultEnglish,
    imageAlt: "Clase presencial de inglés para adultos en AiT USA.",
    href: "/courses/#ingles-presencial",
    cta: "Ver formato presencial",
    relatedPrograms: ["ingles-jovenes-adultos"],
  },
  {
    key: "hybrid-english",
    anchor: "ingles-hibrido",
    title: "Inglés híbrido",
    badge: "Presencial + remoto",
    marker: "Híbrido",
    emphasis: "secondary",
    audience: "Quienes necesitan flexibilidad sin perder estructura",
    summary:
      "Combina encuentros presenciales con apoyo remoto cuando tu semana cambia, sin perder práctica ni seguimiento.",
    details: [
      "Alterna entre apoyo presencial y acompañamiento remoto.",
      "Mantiene seguimiento con un horario realista.",
      "Pensado para estudiantes con semanas variables.",
    ],
    image: site.images.heroFemaleZoom,
    imageAlt: "Instructora guiando una clase de inglés en formato híbrido.",
    href: "/courses/#ingles-hibrido",
    cta: "Ver formato híbrido",
    relatedPrograms: ["ingles-jovenes-adultos", "ingles-online-adultos"],
  },
  {
    key: "online-english",
    anchor: "ingles-online",
    title: "Inglés online",
    badge: "Desde cualquier lugar",
    marker: "Online",
    emphasis: "secondary",
    audience: "Estudiantes en otros lugares o con agenda remota",
    summary:
      "Conéctate desde casa o desde otro país con práctica en vivo; coordinamos el horario según tu nivel y zona horaria.",
    details: [
      "Ideal para estudiantes fuera de Nueva Jersey.",
      "WhatsApp y orientación para elegir nivel y horario.",
      "Acompañamiento claro para estudiar dentro y fuera de clase.",
    ],
    image: site.images.onlineEnglish,
    imageAlt: "Clase de inglés online con apoyo visual.",
    href: "/courses/#ingles-online",
    cta: "Ver formato online",
    relatedPrograms: ["ingles-online-adultos"],
  },
  {
    key: "support-programs",
    title: "Programas de apoyo",
    badge: "Otros programas",
    marker: "Apoyo",
    emphasis: "secondary",
    audience: "Familias y estudiantes con metas específicas",
    summary:
      "Explora inglés para niños, GED, computación, español para extranjeros y cursos técnicos.",
    details: [
      "Inglés para niños de 8 a 13 años.",
      "GED y tutorías para metas académicas concretas.",
      "Computación, oficina, reparación y español para extranjeros.",
    ],
    image: site.images.computing,
    imageAlt: "Programas de apoyo académico y técnico de AiT USA.",
    href: "/courses/#programas-de-apoyo",
    cta: "Explorar programas de apoyo",
    relatedPrograms: [
      "ingles-ninos",
      "ged",
      "computacion-basica",
      "computacion-oficina",
      "reparacion-computadoras",
      "espanol-extranjeros",
      "tutorias-matematicas",
    ],
  },
];

const courseCatalog = [
  {
    key: "english-paths",
    title: "Rutas principales de inglés",
    description:
      "Compara la experiencia presencial con las alternativas online para elegir cómo quieres estudiar.",
    anchor: "rutas-principales-de-ingles",
    programs: ["ingles-jovenes-adultos", "ingles-online-adultos", "ingles-ninos"],
  },
  {
    key: "academic-support",
    title: "Apoyo académico y metas concretas",
    description:
      "Programas para GED, tutorías y apoyo escolar cuando necesitas una meta puntual además del inglés.",
    anchor: "apoyo-academico",
    programs: ["ged", "tutorias-matematicas"],
  },
  {
    key: "digital-technical",
    title: "Computación y cursos técnicos",
    description:
      "Formación digital práctica para estudiar, trabajar o explorar una ruta técnica complementaria.",
    anchor: "computacion-y-cursos-tecnicos",
    programs: ["computacion-basica", "computacion-oficina", "reparacion-computadoras"],
  },
  {
    key: "additional-languages",
    title: "Otros idiomas y apoyo adicional",
    description:
      "Opciones complementarias para estudiantes que también necesitan español para extranjeros o rutas futuras.",
    anchor: "otros-idiomas-y-apoyo-adicional",
    programs: ["espanol-extranjeros"],
  },
];

const conversionCtas = {
  placement: {
    label: "Ver mi nivel",
    href: "/placement-test/",
    description:
      "Empieza por una recomendación inicial de nivel y luego confirma con un asesor.",
  },
  advisor: {
    label: "Hablar con un asesor",
    href: site.whatsappHref,
    description:
      "Escribe por WhatsApp para elegir programa, modalidad y siguiente paso.",
  },
  courses: {
    label: "Ver cursos detallados",
    href: "/courses/",
    description:
      "Compara inglés presencial, híbrido, online y programas de apoyo.",
  },
  registration: {
    label: "Confirmar proceso",
    href: `${site.whatsappHref}?text=${encodeURIComponent("Hola AIT USA, quiero información para empezar con inscripción + libro por $95 y confirmar mi siguiente paso.")}`,
    description:
      "Si te interesa inscripción + libro por $95, te guiamos por WhatsApp para confirmar el proceso.",
    price: "$95",
  },
};

const placementTest = {
  eyebrow: "Evaluación inicial",
  title: "Descubre tu punto de partida en inglés",
  intro:
    "Completa el cuestionario de nivel directamente aquí. Recibirás una recomendación inicial automática y un asesor debe confirmarla antes de tu inscripción final.",
  privacyNote:
    "Tus respuestas se usan para calcular una recomendación inicial y preparar el mensaje de WhatsApp que tú decides enviar. El teléfono es opcional y no te inscribe en mensajes promocionales.",
  crmNote:
    "El resultado es una guía inicial. Un asesor confirma contigo el nivel, el horario y el siguiente paso antes de la inscripción.",
  steps: {
    student: "Tus datos",
    selfAssessment: "Cómo te sientes hoy",
    quiz: "Cuestionario por niveles",
    goals: "Tu objetivo",
    result: "Recomendación inicial",
  },
  legacySource: {
    title: "PLACEMENT EXAM (EXAMEN DE NIVELACION) COMMUNICATIVE ENGLISH",
    formId: "1B_rhVh4lmOIySRtOTOs1rrjas7vns9zRzamncquwcQg",
    source: "Cuestionario legado del sitio Wix original",
    capturedFields: [
      "Date/Fecha",
      "First Name/Nombre",
      "Last Name/Apellido",
      "Telephone Number/Telefono",
      "Level 1 (Book 1)",
      "Level 2 (Book 1)",
      "Level 3 (Book 2)",
      "Level 4 (Book 2)",
      "Level 5 (Book 3)",
      "Level 6 (Book 3)",
      "Free Writing",
    ],
    questionCount: 62,
    legacyLevels: 6,
    gradingMode: "automatic_provisional",
    answerKeyStatus: "pending_academic_review",
    note:
      "La versión refresh debe presentar y calificar el cuestionario en sitio, sin incrustar ni enlazar servicios externos.",
  },
  studentFields: [
    { name: "name", label: "Nombre completo", type: "text", required: true },
    {
      name: "phone",
      label: "WhatsApp o teléfono (opcional)",
      type: "tel",
      required: false,
      help: "Se usa solo para el seguimiento que solicites; no crea consentimiento para SMS promocional.",
    },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "city", label: "Ciudad / País", type: "text", required: true },
    {
      name: "ageGroup",
      label: "Grupo de edad",
      type: "select",
      required: true,
      options: ["Adulto", "Joven", "Niño / Adolescente"],
    },
  ],
  selfAssessments: [
    {
      key: "speaking",
      label: "Al hablar",
      options: ["Me bloqueo casi siempre", "Puedo decir frases cortas", "Puedo sostener una conversacion simple", "Puedo explicarme con relativa confianza"],
    },
    {
      key: "listening",
      label: "Al escuchar",
      options: ["Entiendo muy poco", "Entiendo ideas basicas", "Entiendo conversaciones simples", "Entiendo gran parte con apoyo"],
    },
    {
      key: "reading",
      label: "Al leer",
      options: ["Se me dificulta mucho", "Puedo leer palabras y frases", "Puedo leer textos simples", "Puedo leer materiales cotidianos con poca ayuda"],
    },
    {
      key: "writing",
      label: "Al escribir",
      options: ["Solo palabras sueltas", "Frases muy cortas", "Mensajes y respuestas simples", "Textos cotidianos con cierta seguridad"],
    },
  ],
  questions: [
    {
      level: "Level 1 (Book 1)",
      items: [
        { prompt: "1. My Father ____ 56 years old.", options: ["has", "are", "is", "I Don't Know"], answer: "is" },
        { prompt: "2. ___ I wrong?", options: ["Is", "Am", "Do", "I Don't Know"], answer: "Am" },
        { prompt: "3. “_______ are you?” “I’m in the classroom.”", options: ["Who", "When", "Where", "I Don't Know"], answer: "Where" },
        { prompt: "4. Lazaro is ___ the hospital.", options: ["on", "to", "in", "I Don't Know"], answer: "in" },
        { prompt: "5. Carla and Maria ___ at the beach.", options: ["are", "is", "goes", "I Don't Know"], answer: "are" },
        { prompt: "6. ___ is Kenneth doing?", options: ["Who", "What", "Where", "I Don't Know"], answer: "What" },
        { prompt: "7. He’s my _________.", options: ["wife", "nephew", "sister", "I Don't Know"], answer: "nephew" },
        { prompt: "8. My son is riding ______ bike.", options: ["her", "his", "he", "I Don't Know"], answer: "his" },
        { prompt: "9. “Is Ana ___?” “No, she isn't.”", options: ["eat", "eating", "ate", "I Don't Know"], answer: "eating" },
        { prompt: "10. We're standing ____ front of our house.", options: ["on", "at", "in", "I Don't Know"], answer: "in" },
        { prompt: "11. How many closets ___ there in the apartment?", options: ["is", "are", "am", "I Don't Know"], answer: "are" },
        { prompt: "12. _______ purses are expensive.", options: ["These", "This", "There", "I Don't Know"], answer: "These" },
      ],
    },
    {
      level: "Level 2 (Book 1)",
      items: [
        { prompt: "13. Bob is _____ married. He’s single.", options: ["was", "not", "only", "I Don't Know"], answer: "not" },
        { prompt: "14. Where _____ your parents live?", options: ["does", "do", "were", "I Don't Know"], answer: "do" },
        { prompt: "15. We ____ at home every day.", options: ["stay", "stays", "be", "I Don't Know"], answer: "stay" },
        { prompt: "16. When my cats are hungry, I always feed _______.", options: ["it", "they", "them", "I Don't Know"], answer: "them" },
        { prompt: "17. ______ Martin cook?", options: ["Do", "Does", "Is", "I Don't Know"], answer: "Does" },
        { prompt: "18. Carla can’t ______ Arabic.", options: ["to speak", "speaks", "speak", "I Don't Know"], answer: "speak" },
        { prompt: "19. Every Sunday, Carlos ____ his clothes at the Super Laundromat.", options: ["washes", "wash", "washing", "I Don't Know"], answer: "washes" },
        { prompt: "20. “Does Melissa sell cars?” “No, ________. She sells computers.”", options: ["She does", "She isn't", "She doesn't", "I Don't Know"], answer: "She doesn't" },
        { prompt: "21. ______ you speak Spanish?", options: ["Does", "Do", "Are", "I Don't Know"], answer: "Do" },
        { prompt: "22. What ______ you buy at the supermarket yesterday?", options: ["do", "did", "were", "I Don't Know"], answer: "did" },
        { prompt: "23. Where ______ you last night?", options: ["do", "were", "did", "I Don't Know"], answer: "were" },
        { prompt: "24. Martin ______ TV every night.", options: ["watching", "are going to watch", "watches", "I Don't Know"], answer: "watches" },
        { prompt: "25. Tomorrow, Helen ______ get up at 7:30am.", options: ["are going to", "not going to", "is going to", "I Don't Know"], answer: "is going to" },
      ],
    },
    {
      level: "Level 3 (Book 2)",
      items: [
        { prompt: "26. What did you give your mother for Christmas?", options: ["I gave her a plant.", "I gave to her a plant.", "I gave a plant.", "I Don't Know"], answer: "I gave her a plant." },
        { prompt: "27. There aren’t ____ cookies on my plate.", options: ["many", "much", "some", "I Don't Know"], answer: "many" },
        { prompt: "28. Yesterday, we _____ to the OMV to register the car.", options: ["go", "went", "goed", "I Don't Know"], answer: "went" },
        { prompt: "29. There are only _____ books left for the students.", options: ["little", "a few", "much", "I Don't Know"], answer: "a few" },
        { prompt: "30. I think she’s a careful worker. She works very _______.", options: ["carelessly", "carefully", "more careful", "I Don't Know"], answer: "carefully" },
        { prompt: "31. The doctor ______ a blood test.", options: ["take", "taken", "took", "I Don't Know"], answer: "took" },
        { prompt: "32. This test is ______ the last test I took.", options: ["more easy then", "easier that", "easier than", "I Don't Know"], answer: "easier than" },
        { prompt: "33. Some teachers are ____ other teachers.", options: ["more intelligent than", "intelligent than", "more intelligent as", "I Don't Know"], answer: "more intelligent than" },
        { prompt: "34. You look very sick. You _____ go to the doctor.", options: ["might", "can", "should", "I Don't Know"], answer: "should" },
        { prompt: "35. I _____ go to the beach on Saturday, but I’m not sure.", options: ["might", "can", "should", "I Don't Know"], answer: "might" },
      ],
    },
    {
      level: "Level 4 (Book 2)",
      items: [
        { prompt: "36. When you were a child, ____ you speak Russian?", options: ["Could", "Can", "Should", "I Don't Know"], answer: "Could" },
        { prompt: "37. I was jogging ______ the park when I slipped and fell.", options: ["at", "on", "up", "I Don't Know"], answer: "at" },
        { prompt: "38. You must eat less bread and ____ cookies.", options: ["less", "fewer", "too less", "I Don't Know"], answer: "fewer" },
        { prompt: "39. I ________ lose some weight.", options: ["must to", "have", "must", "I Don't Know"], answer: "must" },
        { prompt: "40. Do you have _____ money?", options: ["no", "any", "none", "I Don't Know"], answer: "any" },
        { prompt: "41. We didn’t see _________ in the room.", options: ["anybody", "someone", "nobody", "I Don't Know"], answer: "anybody" },
        { prompt: "42. She will _______ coming home very soon.", options: ["be", "was", "does", "I Don't Know"], answer: "be" },
      ],
    },
    {
      level: "Level 5 (Book 3)",
      items: [
        { prompt: "43. You should never argue ____ your parents.", options: ["to", "at", "with", "I Don't Know"], answer: "with" },
        { prompt: "44. Some people always complain _____ the weather.", options: ["at", "on", "about", "I Don't know"], answer: "about" },
        { prompt: "45. “Let's go ___ the beach! This weather calls for it.”", options: ["to", "at", "in", "I Don't Know"], answer: "to" },
        { prompt: "46. We've ____ here _____ more than two hours.", options: ["was / in", "been / since", "been / for", "I Don't Know"], answer: "been / for" },
        { prompt: "47. She couldn’t come yesterday and she can’t come today, ________.", options: ["Neither", "Too", "Either", "I Don't Know"], answer: "Either" },
        { prompt: "48. Have you ______ a rainbow?", options: ["ever seen", "never seen", "ever saw", "I Don't Know"], answer: "ever seen" },
        { prompt: "49. Have you ever ___ a tuxedo?", options: ["used", "wore", "worn", "I Don't Know"], answer: "worn" },
        { prompt: "50. I’ve been ____ in helicopters for years.", options: ["fly", "flown", "flying", "I Don't Know"], answer: "flying" },
      ],
    },
    {
      level: "Level 6 (Book 3)",
      items: [
        { prompt: "51. By the time I got to the concert, it _____.", options: ["has already begun", "already began", "had already begun", "I Don't Know"], answer: "had already begun" },
        { prompt: "52. I decided to stop _____ my nails.", options: ["bite", "to bite", "biting", "I Don't Know"], answer: "biting" },
        { prompt: "53. _____ is a good way to relax.", options: ["Swim", "To swim", "Swimming", "I Don't Know"], answer: "Swimming" },
        { prompt: "54. I thought _______ to France.", options: ["about moving", "to moving", "moving", "I Don't Know"], answer: "about moving" },
        { prompt: "55. “What should I do with these old newspapers?” “I think you should ______.”", options: ["throw out them", "throw them out", "through them out", "I Don't Know"], answer: "throw them out" },
        { prompt: "56. “Are you still sick with the flu?” “No, I _____ three weeks ago.”", options: ["got over it", "got it over", "got over to", "I Don't Know"], answer: "got over it" },
        { prompt: "57. She __________ downtown whenever she can.", options: ["avoid to drive", "avoids driving", "avoids drive", "I Don't Know"], answer: "avoids driving" },
        { prompt: "58. I wanted to give you a tie for Christmas, but then I remembered that I _____ you one last Christmas.", options: ["have given", "had given", "gave", "I Don't Know"], answer: "had given" },
        { prompt: "59. If I could speak Russian, I _____ to a Russian University.", options: ["would have gone", "would go", "went", "I Don't Know"], answer: "would go" },
        { prompt: "60. If I had seen you yesterday, I ______ hello.", options: ["would say", "have said", "would have said", "I Don't Know"], answer: "would have said" },
        { prompt: "61. I'm upset - I burned my cookies. I _____ taken them out of the oven sooner.", options: ["might have", "may have", "should have", "I Don't Know"], answer: "should have" },
        { prompt: "62. I stood on the chair to change the light. I got down safely, but I ______ fallen easily.", options: ["might have", "could have", "should have", "I Don't Know"], answer: "could have" },
      ],
    },
  ],
  writingPrompt: {
    title: "Parte II: escritura breve",
    prompt:
      "Compara dos personas en tres oraciones. Puedes usar ideas como large, thin, heavy, colorful, weak o strong. Escribe \"No sé\" si no sabes cómo contestar.",
    note:
      "La escritura no cambia el puntaje automático; ayuda al asesor a confirmar tu nivel con más contexto.",
  },
  goals: [
    "Trabajo y entrevistas",
    "Escuela o universidad",
    "Vida diaria",
    "Ayuda para mi hijo o hija",
    "Viajes",
    "GED o apoyo académico",
  ],
  recommendations: [
    {
      key: "foundation",
      min: 0,
      max: 12,
      level: "Nivel inicial / Book 1 base",
      recommendation:
        "Te conviene empezar con una ruta base enfocada en comprensión, frases útiles y práctica guiada.",
      bestFit: "Inglés presencial o híbrido para construir confianza desde cero.",
    },
    {
      key: "book-1-bridge",
      min: 13,
      max: 23,
      level: "Book 1 alto / Básico funcional",
      recommendation:
        "Ya tienes algunas bases y puedes avanzar con corrección en vivo, estructura visual y práctica semanal.",
      bestFit: "Inglés presencial, híbrido u online según tu agenda y ubicación.",
    },
    {
      key: "book-2-entry",
      min: 24,
      max: 34,
      level: "Book 2 inicial / Intermedio bajo",
      recommendation:
        "Puedes trabajar estructuras de pasado, comparaciones y comunicación cotidiana con más continuidad.",
      bestFit: "Ruta conversacional con confirmación de nivel antes de cerrar horario o inscripción.",
    },
    {
      key: "book-2-upper",
      min: 35,
      max: 45,
      level: "Book 2 alto / Intermedio",
      recommendation:
        "Tienes base para una clase con más conversación, corrección puntual y objetivos específicos.",
      bestFit: "Grupo intermedio presencial, híbrido u online según disponibilidad y meta principal.",
    },
    {
      key: "book-3-entry",
      min: 46,
      max: 56,
      level: "Book 3 inicial / Intermedio alto",
      recommendation:
        "Puedes practicar estructuras más avanzadas, fluidez, escritura corta y situaciones de trabajo o estudio.",
      bestFit: "Ruta intermedia alta con práctica oral y confirmación académica antes de inscripción final.",
    },
    {
      key: "book-3-upper",
      min: 57,
      max: 65,
      level: "Book 3 alto / Avanzado orientativo",
      recommendation:
        "Tu resultado sugiere una ruta avanzada o de objetivos específicos, sujeta a entrevista o revisión de escritura.",
      bestFit: "Ruta conversacional, online o presencial, según disponibilidad y meta principal.",
    },
  ],
};

window.AITUSA_DATA = {
  painHero,
  methodNarrative,
  solutionCharacteristics,
  productOfferings,
  courseCatalog,
  conversionCtas,
  placementTest,
  heroProof,
  heroVideoHighlights,
  heroHighlights,
  heroQuickCapture,
  differentiators,
  downloads,
  faqs,
  heroPoints,
  locations,
  methodCharacteristics,
  methodBlocks,
  modalities,
  nav,
  programs,
  requirements,
  schedules,
  site,
  stats,
  learningOutcomes,
  heroSignal,
  heroStartPath,
  launchPath,
  testimonials,
  trustHighlights,
  trustFeature,
  contactPrep,
  footerFacts,
  courseGuides,
};
