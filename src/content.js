const asset = (name) => `/assets/wix/${name}`;
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
    approvedHero: "/assets/hero/approved-concept-1-clean.png",
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

const admissionsCourseHref = (course) =>
  `${site.whatsappHref}?text=${encodeURIComponent(
    `Hola AIT USA, quiero información sobre ${course}, mi punto de inicio y los horarios disponibles.`,
  )}`;

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
        "Lunes a jueves por la mañana: 9:30 am–10:30 am y 10:30 am–11:30 am.",
        "Lunes a jueves por la noche: 6:20 pm–7:30 pm, 7:30 pm–8:40 pm y 8:40 pm–9:50 pm.",
        "Sábados: 10:00 am–1:00 pm y 2:00 pm–5:00 pm.",
      ],
      note: "Los formatos y horarios pueden variar por sede. Confirma tu grupo antes de inscribirte.",
    },
    editorial: {
      version: "course-editorial-v1",
      eyebrow: "Programa principal de inglés",
      lead:
        "Una ruta práctica para comprender, conversar y responder con más seguridad en el trabajo, los estudios, los trámites y la vida diaria.",
      heroImage: site.images.adultEnglish,
      heroImageAlt:
        "Estudiante adulta practicando inglés con materiales digitales y un cuaderno.",
      proofLedger: [
        {
          label: "Modalidades",
          value: "Presencial · híbrido · online",
        },
        {
          label: "Ruta académica",
          value: "Básico · intermedio · avanzado",
        },
        {
          label: "Práctica",
          value: "Talleres y tutorías",
        },
        {
          label: "Experiencia",
          value: "Grupos pequeños",
        },
      ],
      outcomes: [
        {
          number: "01",
          title: "Comprender en contexto",
          text:
            "Reconoce estructuras y expresiones frecuentes sin depender de una traducción palabra por palabra.",
        },
        {
          number: "02",
          title: "Responder con seguridad",
          text:
            "Practica conversaciones útiles para el trabajo, la escuela, los servicios y situaciones cotidianas.",
        },
        {
          number: "03",
          title: "Sostener una rutina",
          text:
            "Avanza con corrección en clase, talleres y tutorías que ayudan a mantener continuidad.",
        },
      ],
      pathway: [
        {
          stage: "Etapa 01",
          title: "Básico",
          text:
            "Construye expresiones frecuentes, presente y la base visual para comprender sin traducir cada frase, con apoyo de docentes bilingües.",
          focus: "Base funcional",
        },
        {
          stage: "Etapa 02",
          title: "Intermedio",
          text:
            "Integra pasado y futuro mientras amplías conversación, escucha y respuesta en situaciones reales.",
          focus: "Mayor autonomía",
        },
        {
          stage: "Etapa 03",
          title: "Avanzado",
          text:
            "Profundiza conversación, lectura, escritura y comprensión con práctica guiada y docentes norteamericanos.",
          focus: "Comunicación amplia",
        },
      ],
      method: {
        eyebrow: "Método Graphic Concept",
        title: "Primero entiendes la estructura. Después la usas para hablar.",
        text:
          "Graphic Concept organiza tiempos, palabras y contexto de forma visual. La clase conecta esa estructura con conversación, repetición oral y corrección inmediata.",
        image: site.images.routeConcept,
        imageAlt:
          "Instructora explicando una secuencia visual para comprender y practicar inglés.",
        points: [
          "Explicación visual antes de memorizar listas extensas.",
          "Práctica oral con corrección durante la clase.",
          "Docentes bilingües en los niveles básicos y transición progresiva a docentes estadounidenses.",
          "Talleres y tutorías para reforzar dudas y nivelarse.",
        ],
      },
      schedule: [
        {
          label: "Lun–jue · mañanas",
          times: ["9:30–10:30 am", "10:30–11:30 am"],
        },
        {
          label: "Lun–jue · noches",
          times: ["6:20–7:30 pm", "7:30–8:40 pm", "8:40–9:50 pm"],
        },
        {
          label: "Sábados",
          times: ["10:00 am–1:00 pm", "2:00–5:00 pm"],
        },
      ],
      formats: [
        {
          icon: "building-2",
          title: "Presencial",
          text:
            "Práctica cara a cara y corrección inmediata en una sede de Nueva Jersey.",
        },
        {
          icon: "monitor-smartphone",
          title: "Híbrido",
          text:
            "Combina encuentros presenciales con apoyo remoto cuando el grupo lo permite.",
        },
        {
          icon: "laptop",
          title: "Online",
          text:
            "Participa en tiempo real con un profesor: las clases son interactivas y no pregrabadas.",
        },
      ],
      logisticsNote:
        "Puedes solicitar otro bloque cuando lo necesites, sujeto a cupo. Un asesor confirma sede, modalidad y horario antes de la inscripción.",
      story: {
        eyebrow: "Historia AIT",
        name: "Jessica",
        role: "De estudiante a docente referente",
        title: "Conocer el método también significa escuchar a quienes lo vivieron.",
        text:
          "Jessica empezó como estudiante de AiT y hoy es una de las docentes referentes del método. En esta conversación comparte más contexto sobre el ritmo de clase, la práctica y los detalles que ayudan a avanzar.",
        video: site.images.jessicaInterviewVideo,
        poster: site.images.jessicaInterviewVideoPoster,
        width: 480,
        height: 848,
        duration: "2:52",
        videoLabel: "Ver la conversación con Jessica",
      },
      faqs: [
        {
          question: "¿Necesito saber mi nivel antes de empezar?",
          answer:
            "No. El examen de ubicación ofrece una recomendación inicial y un asesor confirma contigo el punto de entrada antes de la inscripción.",
        },
        {
          question: "¿Puedo estudiar presencial, híbrido u online?",
          answer:
            "El programa contempla las tres modalidades. La opción disponible se confirma según tu nivel, sede, horario y el grupo activo.",
        },
        {
          question: "¿En qué sede se ofrece el programa?",
          answer:
            "AIT cuenta con atención en Nueva Jersey y opción online. La sede concreta del curso se confirma antes de inscribirte porque los grupos pueden variar.",
        },
        {
          question: "¿Cuánto tarda completar la ruta?",
          answer:
            "No publicamos una duración única: depende de tu nivel inicial, frecuencia, práctica y continuidad. La evaluación inicial ayuda a definir una ruta realista.",
        },
        {
          question: "¿Hay apoyo además de las clases?",
          answer:
            "El programa contempla talleres y tutorías para reforzar dudas, actualizarse y nivelarse. Confirma la disponibilidad correspondiente a tu grupo.",
        },
        {
          question: "¿Las clases online son grabadas?",
          answer:
            "No. Son clases en tiempo real con un profesor, para que puedas interactuar, practicar y recibir corrección durante la sesión.",
        },
      ],
      closing: {
        eyebrow: "Tu punto de partida",
        title: "No elijas un curso a ciegas.",
        text:
          "Descubre tu nivel inicial y llega a la conversación con admisiones con una recomendación más clara.",
        primaryLabel: "Descubrir mi nivel",
        advisorLabel: "¿Prefieres preguntar primero? Habla con admisiones",
      },
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
    editorial: {
      version: "course-editorial-v1",
      eyebrow: "Inglés en vivo desde cualquier país",
      lead:
        "Una ruta 100% online para comprender, conversar y avanzar con un profesor en tiempo real, materiales visuales y acompañamiento remoto.",
      heroImage: site.images.onlineEnglish,
      heroImageAlt:
        "Instructora con audífonos guiando una clase de inglés online en tiempo real.",
      heroNote:
        "La evaluación inicial orienta tu nivel. El grupo y la hora se confirman según tu país y zona horaria.",
      proofLedger: [
        {
          label: "Modalidad",
          value: "100% online y en vivo",
        },
        {
          label: "Ruta académica",
          value: "Básico · intermedio · avanzado",
        },
        {
          label: "Participación",
          value: "Profesor y compañeros",
        },
        {
          label: "Acceso",
          value: "Desde cualquier país",
        },
      ],
      outcomes: [
        {
          number: "01",
          title: "Comprender sin traducir cada frase",
          text:
            "Usa estructuras visuales para reconocer tiempos y expresiones antes de llevarlas a la conversación.",
        },
        {
          number: "02",
          title: "Practicar con una persona real",
          text:
            "Interactúa con tu profesor y otros estudiantes durante la sesión; las clases no son videos pregrabados.",
        },
        {
          number: "03",
          title: "Sostener el avance a distancia",
          text:
            "Combina clase en vivo, materiales visuales y orientación remota para mantener continuidad desde tu país.",
        },
      ],
      pathway: [
        {
          stage: "Etapa 01",
          title: "Básico",
          text:
            "Construye expresiones frecuentes, presente y la base visual para comprender sin traducir cada palabra, con apoyo bilingüe.",
          focus: "Base funcional",
        },
        {
          stage: "Etapa 02",
          title: "Intermedio",
          text:
            "Integra pasado y futuro mientras amplías conversación, escucha y respuesta en situaciones cotidianas.",
          focus: "Mayor autonomía",
        },
        {
          stage: "Etapa 03",
          title: "Avanzado",
          text:
            "Refuerza conversación, lectura, escritura y comprensión con práctica guiada en inglés.",
          focus: "Comunicación amplia",
        },
      ],
      method: {
        eyebrow: "Método Graphic Concept",
        title: "La pantalla no reemplaza la interacción: la organiza.",
        text:
          "Graphic Concept presenta tiempos, palabras y contexto de forma visual. El profesor conecta esa estructura con práctica oral y corrección durante la sesión.",
        image: site.images.routeConcept,
        imageAlt:
          "Instructora explicando una secuencia visual usada durante una clase de inglés online.",
        points: [
          "Explicación visual antes de memorizar listas extensas.",
          "Clases en tiempo real con un profesor y participación del grupo.",
          "Docentes bilingües en la base y transición progresiva a práctica en inglés.",
          "Tutoría remota para reforzar dudas, sujeta a disponibilidad del grupo.",
        ],
      },
      schedule: [
        {
          label: "Lun–jue · mañanas",
          times: ["9:30–10:30 am", "10:30–11:30 am"],
        },
        {
          label: "Lun–jue · noches",
          times: ["6:20–7:30 pm", "7:30–8:40 pm", "8:40–9:50 pm"],
        },
        {
          label: "Sábados",
          times: ["10:00 am–1:00 pm", "2:00–5:00 pm"],
        },
      ],
      formats: [
        {
          icon: "video",
          title: "Clase en vivo",
          text:
            "Participas con un profesor y otros compañeros; la sesión es interactiva y no pregrabada.",
        },
        {
          icon: "globe-2",
          title: "Desde tu país",
          text:
            "Conéctate desde fuera de Estados Unidos y confirma el bloque correspondiente a tu zona horaria.",
        },
        {
          icon: "headphones",
          title: "Equipo flexible",
          text:
            "Puedes usar laptop, desktop, tableta o teléfono con internet estable, audífonos y micrófono.",
        },
      ],
      logisticsNote:
        "Los horarios se publican en hora de Nueva Jersey. Admisiones confirma la conversión a tu zona horaria, el nivel y el grupo activo antes de la inscripción.",
      sectionCopy: {
        logistics: {
          eyebrow: "Experiencia online y horarios",
          title: "Una clase remota debe sentirse presente, no grabada.",
          text:
            "Revisa cómo participar y los bloques publicados. Tu horario final depende del nivel, el grupo activo y tu zona horaria.",
          formatsLabel: "Claves de la experiencia online",
          scheduleLabel: "Hora de Nueva Jersey",
          actionLabel: "Confirmar mi zona horaria",
        },
      },
      faqs: [
        {
          question: "¿Las clases son grabadas?",
          answer:
            "No. Son sesiones en tiempo real con un profesor y otros estudiantes, para que puedas interactuar, practicar y recibir corrección.",
        },
        {
          question: "¿Puedo estudiar desde cualquier país?",
          answer:
            "Sí. Este programa está dirigido a jóvenes y adultos fuera de Estados Unidos. Admisiones confirma la disponibilidad y convierte el horario publicado a tu zona.",
        },
        {
          question: "¿Qué equipo necesito?",
          answer:
            "Puedes participar desde laptop, desktop, tableta o teléfono con conexión estable. Audífonos y micrófono ayudan a escuchar y hablar con claridad.",
        },
        {
          question: "¿Necesito saber mi nivel antes de empezar?",
          answer:
            "No. El examen de ubicación ofrece una recomendación inicial y un asesor confirma contigo el punto de entrada.",
        },
        {
          question: "¿Qué niveles ofrece la ruta?",
          answer:
            "La ruta publicada contempla básico, intermedio y avanzado. El nivel inicial depende de tu evaluación y de la conversación con admisiones.",
        },
        {
          question: "¿Puedo cambiar de horario?",
          answer:
            "Puedes solicitar otro bloque, pero el cambio depende del cupo, tu nivel y el grupo activo. Confírmalo antes de reorganizar tu asistencia.",
        },
      ],
      closing: {
        eyebrow: "Tu aula puede estar donde estés",
        title: "Primero ubica tu nivel. Después confirma la hora correcta.",
        text:
          "Llega a admisiones con una recomendación inicial y tu zona horaria para elegir un grupo online con menos dudas.",
        primaryLabel: "Descubrir mi nivel",
        advisorLabel: "¿Prefieres preguntar primero? Habla con admisiones",
      },
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
    editorial: {
      version: "course-editorial-v1",
      eyebrow: "Inglés online para niños de 8 a 13 años",
      lead:
        "Clases en vivo con apoyo visual, práctica guiada y seguimiento para que cada familia entienda el punto de inicio y el avance.",
      heroImage: site.images.kidsEnglish,
      heroImageAlt:
        "Instructora guiando a una niña durante una clase de inglés online con apoyo visual.",
      heroNote:
        "La familia confirma edad, nivel y horario con admisiones antes de la inscripción.",
      primaryCta: {
        label: "Consultar el programa infantil",
        href: admissionsCourseHref("el programa de inglés online para niños"),
        external: true,
      },
      advisorCta: {
        label: "Ver otras formas de contacto",
        href: site.legalLinks.contact,
        external: false,
      },
      proofLedger: [
        {
          label: "Edades",
          value: "8 a 13 años",
        },
        {
          label: "Modalidad",
          value: "100% online",
        },
        {
          label: "Método",
          value: "Graphic Concept",
        },
        {
          label: "Seguimiento",
          value: "Familia informada",
        },
      ],
      outcomes: [
        {
          number: "01",
          title: "Comprender con apoyo visual",
          text:
            "Relaciona tiempos, palabras y situaciones con una estructura gráfica antes de depender de traducciones.",
        },
        {
          number: "02",
          title: "Practicar de forma guiada",
          text:
            "Trabaja presente, pasado y futuro con actividades acordes a la edad y corrección durante la clase.",
        },
        {
          number: "03",
          title: "Compartir el avance",
          text:
            "Padres o tutores reciben información sobre el progreso para acompañar la continuidad fuera de clase.",
        },
      ],
      pathway: [
        {
          stage: "Paso 01",
          marker: "01",
          title: "Ubicar edad y nivel",
          text:
            "Admisiones revisa la edad, la experiencia previa y el horario de la familia para orientar el grupo inicial.",
          focus: "Punto de partida",
        },
        {
          stage: "Paso 02",
          marker: "02",
          title: "Construir una base visual",
          text:
            "La clase conecta vocabulario y estructuras con apoyos gráficos para comprender antes de responder.",
          focus: "Comprensión",
        },
        {
          stage: "Paso 03",
          marker: "03",
          title: "Practicar y dar seguimiento",
          text:
            "La práctica oral y los informes a la familia ayudan a sostener una rutina y observar el avance.",
          focus: "Continuidad",
        },
      ],
      method: {
        eyebrow: "Graphic Concept para niños",
        title: "Una estructura visual convierte la pantalla en una clase activa.",
        text:
          "AIT presenta Graphic Concept como una forma de visualizar la relación entre tiempos y palabras. La guía del docente convierte esa estructura en práctica, no en contenido pregrabado.",
        image: site.images.routeConcept,
        imageAlt:
          "Instructora explicando una secuencia visual para practicar estructuras de inglés.",
        figcaption: "Graphic Concept · apoyo visual y práctica guiada",
        points: [
          "Docentes bilingües apoyan los niveles básicos.",
          "La transición incorpora práctica cada vez más amplia en inglés.",
          "Las actividades se organizan para niños de 8 a 13 años.",
          "Padres o tutores reciben información sobre el avance.",
        ],
      },
      schedule: [
        {
          label: "Lun–jue · mañanas",
          times: ["9:30–10:30 am", "10:30–11:30 am"],
        },
        {
          label: "Lun–jue · tardes/noches",
          times: ["6:30–7:30 pm", "7:30–8:30 pm", "8:30–9:30 pm"],
        },
        {
          label: "Sábados",
          times: ["10:00 am–1:00 pm", "2:00–5:00 pm"],
        },
      ],
      formats: [
        {
          icon: "monitor-smartphone",
          title: "Clase online en vivo",
          text:
            "El estudiante participa a distancia con guía docente y práctica durante la sesión.",
        },
        {
          icon: "book-open-check",
          title: "Ruta apropiada para la edad",
          text:
            "El grupo inicial se orienta según la edad y la experiencia previa del niño o la niña.",
        },
        {
          icon: "calendar-days",
          title: "Seguimiento familiar",
          text:
            "La familia recibe información del avance y confirma cualquier ajuste de grupo con admisiones.",
        },
      ],
      logisticsNote:
        "Estos son los bloques publicados por AIT. La zona horaria, el cupo y cualquier cambio dependen del grupo activo y deben confirmarse con la familia.",
      sectionCopy: {
        outcomes: {
          eyebrow: "Aprendizaje acompañado",
          title: "El niño practica; la familia entiende cómo va avanzando.",
          text:
            "La experiencia combina comprensión visual, uso guiado del idioma y comunicación con padres o tutores.",
        },
        pathway: {
          id: "ruta-infantil",
          eyebrow: "Ruta de inicio",
          title: "Edad, nivel y horario se coordinan antes de comenzar.",
          text:
            "No usamos el examen de adultos como entrada automática. Admisiones orienta a la familia según el caso.",
          actionLabel: "Consultar el punto de inicio",
          actionHref: admissionsCourseHref("el punto de inicio del programa de inglés para niños"),
          external: true,
        },
        logistics: {
          eyebrow: "Clase y horarios",
          title: "Un bloque útil es el que funciona para el niño y su familia.",
          text:
            "Revisa los horarios publicados y confirma la zona horaria y el grupo vigente antes de organizar la semana.",
          formatsLabel: "Claves del programa infantil",
          scheduleLabel: "Bloques publicados",
          actionLabel: "Confirmar grupo y horario",
        },
        faq: {
          eyebrow: "Antes de inscribir",
          title: "Respuestas para decidir en familia.",
          text:
            "Admisiones puede confirmar edad, nivel, tecnología necesaria, zona horaria y cupo del grupo.",
        },
      },
      faqs: [
        {
          question: "¿Para qué edades es el programa?",
          answer:
            "La página actual de AIT publica el programa para niños de 8 a 13 años. Confirma con admisiones si la edad está cerca del límite.",
        },
        {
          question: "¿Las clases son online?",
          answer:
            "Sí. AIT presenta esta ruta como clases online. La familia debe confirmar el grupo activo y la zona horaria antes de inscribirse.",
        },
        {
          question: "¿Cómo se define el nivel inicial?",
          answer:
            "Admisiones revisa la edad, la experiencia previa y el horario de la familia para orientar el punto de inicio. No asumimos que el examen de adultos sea la entrada adecuada.",
        },
        {
          question: "¿La familia recibe información del progreso?",
          answer:
            "AIT indica que padres o tutores son informados sobre los avances de sus hijos. La frecuencia y el formato concreto se confirman con el grupo.",
        },
        {
          question: "¿Puede cambiarse de horario?",
          answer:
            "AIT permite solicitar cambios, pero no garantizamos disponibilidad automática. Todo cambio depende del nivel, la zona horaria y el cupo del grupo activo.",
        },
        {
          question: "¿Cuánto tarda en llegar a un nivel intermedio?",
          answer:
            "No publicamos una garantía de duración. El avance depende del punto de inicio, la asistencia, la práctica y la continuidad de cada estudiante.",
        },
      ],
      closing: {
        eyebrow: "El siguiente paso es familiar",
        title: "Confirma edad, nivel y horario antes de elegir un grupo.",
        text:
          "Comparte con admisiones la edad del estudiante, su experiencia previa y la zona horaria para recibir una orientación más útil.",
        primaryLabel: "Consultar el programa infantil",
        primaryCta: {
          href: admissionsCourseHref("el programa de inglés online para niños"),
          external: true,
        },
        advisorLabel: "Ver otras formas de contacto",
        advisorCta: {
          href: site.legalLinks.contact,
          external: false,
        },
      },
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
    editorial: {
      version: "course-editorial-v1",
      eyebrow: "Español conversacional online",
      lead:
        "Una ruta para practicar español útil en situaciones de estudio, trabajo y vida diaria con acompañamiento remoto.",
      heroImage: site.images.spanish,
      heroImageAlt:
        "Persona adulta practicando conversación durante una clase de idioma online.",
      heroNote:
        "El grupo, el nivel inicial y la zona horaria se confirman con admisiones.",
      primaryCta: {
        label: "Consultar español online",
        href: admissionsCourseHref("el curso online de español para extranjeros"),
        external: true,
      },
      advisorCta: {
        label: "Ver otras formas de contacto",
        href: site.legalLinks.contact,
        external: false,
      },
      proofLedger: [
        {
          label: "Modalidad",
          value: "Online",
        },
        {
          label: "Enfoque",
          value: "Conversación útil",
        },
        {
          label: "Contextos",
          value: "Estudio · trabajo · vida diaria",
        },
        {
          label: "Horario",
          value: "Según país y grupo",
        },
      ],
      outcomes: [
        {
          number: "01",
          title: "Entender situaciones comunes",
          text:
            "Trabaja vocabulario y expresiones que aparecen en conversaciones de estudio, trabajo y vida diaria.",
        },
        {
          number: "02",
          title: "Responder con más recursos",
          text:
            "Practica cómo formular preguntas, explicar necesidades y sostener intercambios breves con guía.",
        },
        {
          number: "03",
          title: "Mantener continuidad",
          text:
            "Coordina una rutina online acorde con tu país, disponibilidad y punto de partida.",
        },
      ],
      pathway: [
        {
          stage: "Paso 01",
          marker: "01",
          title: "Definir tu punto de partida",
          text:
            "Comparte con admisiones tu experiencia previa, tu objetivo principal y la zona horaria desde la que estudiarás.",
          focus: "Orientación",
        },
        {
          stage: "Paso 02",
          marker: "02",
          title: "Construir recursos útiles",
          text:
            "Amplía vocabulario, comprensión y estructuras alrededor de situaciones que necesitas resolver.",
          focus: "Base práctica",
        },
        {
          stage: "Paso 03",
          marker: "03",
          title: "Llevarlo a conversación",
          text:
            "Usa lo aprendido en actividades guiadas para ganar precisión y responder con menos pausa.",
          focus: "Uso real",
        },
      ],
      method: {
        eyebrow: "Práctica conversacional",
        title: "Aprender una lengua también significa usarla con un propósito.",
        text:
          "La ruta se organiza alrededor de comprensión, vocabulario y práctica para situaciones reales. El grupo y el nivel determinan el ritmo concreto.",
        image: site.images.spanish,
        imageAlt:
          "Persona adulta participando en una práctica conversacional de idioma.",
        figcaption: "Español online · comprensión y conversación guiada",
        points: [
          "Situaciones relacionadas con estudio, trabajo y vida diaria.",
          "Actividades guiadas para ampliar vocabulario.",
          "Práctica de preguntas, respuestas y expresiones frecuentes.",
          "Seguimiento remoto para coordinar continuidad y dudas.",
        ],
      },
      schedule: [
        {
          label: "Grupo online",
          times: ["Horario por confirmar según país y disponibilidad"],
        },
      ],
      formats: [
        {
          icon: "monitor-smartphone",
          title: "Participación online",
          text:
            "Estudia a distancia y confirma la plataforma y los requisitos técnicos con el grupo activo.",
        },
        {
          icon: "book-open-check",
          title: "Punto de partida",
          text:
            "La experiencia previa y la meta del estudiante orientan el contenido inicial.",
        },
        {
          icon: "calendar-days",
          title: "Zona horaria",
          text:
            "El horario se coordina según el país del estudiante y la disponibilidad vigente.",
        },
      ],
      logisticsNote:
        "AIT no muestra actualmente un bloque público detallado para esta ruta. Admisiones debe confirmar nivel, zona horaria, plataforma y disponibilidad antes de la inscripción.",
      sectionCopy: {
        outcomes: {
          eyebrow: "Comunicación útil",
          title: "Practica el español que necesitas usar fuera de clase.",
          text:
            "La ruta prioriza comprensión y respuesta en contextos cotidianos, académicos y laborales.",
        },
        pathway: {
          id: "ruta-espanol",
          eyebrow: "Ruta de aprendizaje",
          title: "Tu objetivo y experiencia previa definen dónde empezar.",
          text:
            "No publicamos una duración ni un nivel final garantizados. El punto de partida se confirma antes de comenzar.",
          actionLabel: "Consultar mi punto de partida",
          actionHref: admissionsCourseHref("mi punto de partida para español online"),
          external: true,
        },
        logistics: {
          eyebrow: "Modalidad y coordinación",
          title: "Confirma el horario en tu zona antes de organizar la semana.",
          text:
            "AIT identifica la ruta como online, pero la disponibilidad concreta debe validarse con admisiones.",
          formatsLabel: "Claves de la modalidad online",
          scheduleLabel: "Disponibilidad",
          actionLabel: "Confirmar horario online",
        },
        faq: {
          eyebrow: "Antes de empezar",
          title: "Lo que conviene confirmar para una ruta online.",
          text:
            "Una conversación breve con admisiones aclara nivel, meta, horario y tecnología necesaria.",
        },
      },
      faqs: [
        {
          question: "¿El curso es online?",
          answer:
            "Sí. AIT presenta Español para extranjeros como una ruta online. La plataforma y el grupo activo se confirman con admisiones.",
        },
        {
          question: "¿Necesito saber español antes de empezar?",
          answer:
            "No publicamos un requisito único. Comparte tu experiencia previa para que admisiones pueda orientar el punto de entrada.",
        },
        {
          question: "¿Qué tipo de español se practica?",
          answer:
            "La descripción disponible prioriza conversación útil para estudio, trabajo y vida diaria. El contenido concreto depende del nivel del grupo.",
        },
        {
          question: "¿Hay un horario fijo?",
          answer:
            "No mostramos un bloque público confirmado. El horario se coordina según el país, la zona horaria y la disponibilidad vigente.",
        },
        {
          question: "¿Cuánto dura el curso?",
          answer:
            "No publicamos una duración garantizada. El tiempo depende del punto de inicio, la frecuencia, la práctica y la meta del estudiante.",
        },
        {
          question: "¿Cómo sé si el grupo es adecuado para mí?",
          answer:
            "Indica tu nivel aproximado, país, zona horaria y objetivo principal. Admisiones puede confirmar si hay un grupo que encaje.",
        },
      ],
      closing: {
        eyebrow: "Tu objetivo marca la ruta",
        title: "Cuéntanos dónde estás y para qué quieres usar el español.",
        text:
          "Con tu experiencia previa, objetivo y zona horaria, admisiones puede darte una orientación más concreta.",
        primaryLabel: "Consultar español online",
        primaryCta: {
          href: admissionsCourseHref("el curso online de español para extranjeros"),
          external: true,
        },
        advisorLabel: "Ver otras formas de contacto",
        advisorCta: {
          href: site.legalLinks.contact,
          external: false,
        },
      },
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
    editorial: {
      version: "course-editorial-v1",
      eyebrow: "Preparación académica para el GED",
      lead:
        "Una ruta presencial y guiada para preparar las cuatro áreas del examen GED y entender el proceso antes de registrarte para la evaluación oficial.",
      heroImage: site.images.ged,
      heroImageAlt:
        "Materiales de preparación GED con cuaderno, calculadora y útiles de estudio.",
      heroNote:
        "AIT ofrece preparación académica. El examen y el diploma oficial se gestionan por las vías autorizadas de GED y Nueva Jersey.",
      primaryCta: {
        label: "Consultar preparación GED",
        href: `${site.whatsappHref}?text=${encodeURIComponent(
          "Hola AIT USA, quiero información sobre la preparación para el GED, mi punto de inicio y los horarios disponibles.",
        )}`,
        external: true,
      },
      advisorCta: {
        label: "Ver otras formas de contacto",
        href: site.legalLinks.contact,
        external: false,
      },
      proofLedger: [
        {
          label: "Objetivo",
          value: "Preparación para el GED",
        },
        {
          label: "Evaluación oficial",
          value: "4 áreas académicas",
        },
        {
          label: "Ritmo publicado",
          value: "2 clases por semana",
        },
        {
          label: "Bloques publicados",
          value: "Sábados",
        },
      ],
      outcomes: [
        {
          number: "01",
          title: "Entender tu punto de partida",
          text:
            "Identifica las áreas que necesitan más refuerzo antes de organizar una rutina de preparación.",
        },
        {
          number: "02",
          title: "Practicar las cuatro materias",
          text:
            "Trabaja razonamiento matemático, artes del lenguaje, ciencias y estudios sociales con guía académica.",
        },
        {
          number: "03",
          title: "Llegar con un proceso claro",
          text:
            "Distingue la preparación de AIT del registro y la evaluación oficial para evitar promesas o pasos confusos.",
        },
      ],
      pathway: [
        {
          stage: "Área 01",
          marker: "01",
          title: "Razonamiento matemático",
          text:
            "Refuerza matemáticas básicas, geometría, álgebra, gráficas y funciones incluidas en la evaluación oficial.",
          focus: "Números y resolución",
        },
        {
          stage: "Área 02",
          marker: "02",
          title: "Artes del lenguaje",
          text:
            "Practica comprensión de lectura, argumentos, gramática y respuesta escrita para la sección de lenguaje.",
          focus: "Lectura y escritura",
        },
        {
          stage: "Área 03",
          marker: "03",
          title: "Ciencias",
          text:
            "Trabaja lectura científica, interpretación de experimentos y uso de números, tablas y gráficos.",
          focus: "Análisis e interpretación",
        },
        {
          stage: "Área 04",
          marker: "04",
          title: "Estudios sociales",
          text:
            "Practica lectura de contexto, análisis de hechos y argumentos históricos, y comprensión de datos y gráficas.",
          focus: "Contexto y evidencia",
        },
      ],
      method: {
        eyebrow: "Preparación guiada",
        title: "Refuerza por áreas antes de reservar el examen oficial.",
        text:
          "La preparación organiza el trabajo académico y el seguimiento. El ritmo real depende de tu base, asistencia y práctica; la duración publicada es una estimación.",
        image: site.images.math,
        imageAlt:
          "Tutora guiando ejercicios académicos con calculadora, cuaderno y material de práctica.",
        figcaption: "Preparación GED · práctica y seguimiento académico",
        points: [
          "Orientación inicial para entender el proceso y el punto de arranque.",
          "Ruta alrededor de las cuatro áreas que componen el examen GED actual.",
          "Dos clases de una hora por semana según la información publicada por AIT.",
          "Duración estimada de seis meses, sin garantía de fecha de aprobación.",
        ],
      },
      schedule: [
        {
          label: "Sábado · bloque 1",
          times: ["9:00–11:00 am"],
        },
        {
          label: "Sábado · bloque 2",
          times: ["11:00 am–1:00 pm"],
        },
        {
          label: "Sábado · bloque 3",
          times: ["2:00–4:00 pm"],
        },
        {
          label: "Sábado · bloque 4",
          times: ["4:00–6:00 pm"],
        },
      ],
      formats: [
        {
          icon: "book-open-check",
          title: "Preparación presencial",
          text:
            "AIT publica el programa como preparación presencial; confirma la sede correspondiente al grupo activo.",
        },
        {
          icon: "calendar-days",
          title: "Rutina semanal",
          text:
            "La información publicada contempla dos clases de una hora por semana y bloques de atención los sábados.",
        },
        {
          icon: "badge-check",
          title: "Examen oficial separado",
          text:
            "Prepararte con AIT no sustituye el registro, la elegibilidad ni la evaluación administrada por las vías oficiales.",
        },
      ],
      logisticsNote:
        "Los bloques son los publicados por AIT y pueden cambiar según sede, cupo y grupo. Confirma disponibilidad antes de organizar tu semana.",
      sectionCopy: {
        outcomes: {
          eyebrow: "Una meta, sin atajos confusos",
          title: "Prepararte mejor empieza por separar estudio, examen y diploma.",
          text:
            "AIT acompaña la preparación académica. La aprobación depende de cumplir los requisitos y puntajes del examen oficial.",
        },
        pathway: {
          id: "areas",
          eyebrow: "Cuatro áreas del examen",
          title: "Una preparación completa necesita cubrir más que matemáticas.",
          text:
            "El GED actual se divide en cuatro evaluaciones. Tu punto de partida ayuda a decidir dónde concentrar más práctica.",
          actionLabel: "Consultar mi punto de inicio",
          actionHref: `${site.whatsappHref}?text=${encodeURIComponent(
            "Hola AIT USA, quiero orientación sobre mi punto de inicio para la preparación GED.",
          )}`,
          external: true,
        },
        logistics: {
          eyebrow: "Modalidad y horarios",
          title: "Confirma el bloque antes de planificar tu preparación.",
          text:
            "Estos son los horarios publicados por AIT. La sede, el cupo y la organización del grupo se confirman con admisiones.",
          formatsLabel: "Claves de la preparación GED",
          scheduleLabel: "Bloques publicados",
          actionLabel: "Confirmar sede y bloque",
        },
        faq: {
          eyebrow: "Antes de empezar",
          title: "Lo que AIT prepara y lo que debes gestionar oficialmente.",
          text:
            "La preparación académica es una parte del proceso. Elegibilidad, registro, examen y diploma siguen las reglas oficiales de GED y Nueva Jersey.",
        },
      },
      faqs: [
        {
          question: "¿AIT entrega el diploma GED?",
          answer:
            "No presentamos a AIT como emisor del diploma. AIT ofrece preparación académica; el examen y el diploma estatal se gestionan mediante las vías oficiales autorizadas.",
        },
        {
          question: "¿Cuántas áreas tiene el examen?",
          answer:
            "El GED actual tiene cuatro: razonamiento matemático, artes del lenguaje, ciencias y estudios sociales. Cada área se evalúa por separado.",
        },
        {
          question: "¿Cuánto dura la preparación?",
          answer:
            "AIT publica una duración estimada de seis meses. No es una garantía: el tiempo real depende de tu base académica, asistencia, práctica y resultados.",
        },
        {
          question: "¿Cuántas clases hay por semana?",
          answer:
            "La información publicada por AIT indica dos clases de una hora por semana. Admisiones confirma cómo se organiza ese ritmo dentro del bloque disponible.",
        },
        {
          question: "¿Cuáles son los requisitos para presentar el examen en Nueva Jersey?",
          answer:
            "Nueva Jersey aplica requisitos de edad, residencia, situación escolar e identificación. Los casos de 16 o 17 años requieren consentimiento adicional. Confirma tu elegibilidad en GED.com o con un centro autorizado antes de registrarte.",
        },
        {
          question: "¿La inscripción al curso incluye el examen oficial?",
          answer:
            "No lo asumimos. La preparación, el registro oficial y las tarifas del examen son pasos distintos; admisiones puede explicar únicamente qué incluye el programa de AIT.",
        },
      ],
      closing: {
        eyebrow: "Tu siguiente paso",
        title: "Empieza con una orientación, no con una promesa.",
        text:
          "Confirma tu punto de inicio, la sede y el bloque disponible. Después verifica por separado los requisitos del examen oficial.",
        primaryLabel: "Consultar preparación GED",
        primaryCta: {
          href: `${site.whatsappHref}?text=${encodeURIComponent(
            "Hola AIT USA, quiero información sobre la preparación para el GED, mi punto de inicio y los horarios disponibles.",
          )}`,
          external: true,
        },
        advisorLabel: "Ver otras formas de contacto",
        advisorCta: {
          href: site.legalLinks.contact,
          external: false,
        },
      },
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
    editorial: {
      version: "course-editorial-v1",
      eyebrow: "Apoyo focalizado en matemáticas",
      lead:
        "Tutorías para estudiantes de secundaria o universidad que necesitan aclarar un bloqueo, recuperar base y organizar la siguiente práctica.",
      heroImage: site.images.math,
      heroImageAlt:
        "Tutora guiando ejercicios de matemáticas con calculadora, cuaderno y material de práctica.",
      heroNote:
        "La materia, el nivel, la modalidad y el horario se confirman antes de comenzar.",
      primaryCta: {
        label: "Consultar una tutoría",
        href: admissionsCourseHref("las tutorías en matemáticas"),
        external: true,
      },
      advisorCta: {
        label: "Ver otras formas de contacto",
        href: site.legalLinks.contact,
        external: false,
      },
      proofLedger: [
        {
          label: "Nivel",
          value: "Secundaria · universidad",
        },
        {
          label: "Modalidad",
          value: "Presencial u online",
        },
        {
          label: "Enfoque",
          value: "Bloqueos concretos",
        },
        {
          label: "Horario",
          value: "Coordinado por caso",
        },
      ],
      outcomes: [
        {
          number: "01",
          title: "Identificar el bloqueo",
          text:
            "Delimita el tema, procedimiento o requisito previo que está frenando el avance.",
        },
        {
          number: "02",
          title: "Reconstruir el proceso",
          text:
            "Repasa la base necesaria y resuelve ejercicios con explicación guiada, paso a paso.",
        },
        {
          number: "03",
          title: "Practicar con dirección",
          text:
            "Sale de la sesión con ejercicios o próximos pasos alineados con la materia y el objetivo inmediato.",
        },
      ],
      pathway: [
        {
          stage: "Paso 01",
          marker: "01",
          title: "Compartir materia y nivel",
          text:
            "Indica el curso, el tema actual y si existe una fecha próxima de examen o entrega.",
          focus: "Contexto",
        },
        {
          stage: "Paso 02",
          marker: "02",
          title: "Revisar la base necesaria",
          text:
            "La tutoría ubica errores, conocimientos previos y procedimientos que necesitan refuerzo.",
          focus: "Nivelación",
        },
        {
          stage: "Paso 03",
          marker: "03",
          title: "Aplicar y verificar",
          text:
            "El estudiante practica problemas relacionados y confirma qué puede resolver con mayor autonomía.",
          focus: "Práctica",
        },
      ],
      method: {
        eyebrow: "Tutoría por objetivo",
        title: "Primero se delimita el problema; después se practica lo que lo desbloquea.",
        text:
          "Una tutoría útil no intenta cubrir toda la materia a la vez. Se concentra en el tema actual, la base que falta y los próximos ejercicios.",
        image: site.images.math,
        imageAlt:
          "Sesión de tutoría matemática con ejercicios escritos y calculadora.",
        figcaption: "Tutoría matemática · explicación, práctica y verificación",
        points: [
          "Contexto del curso y tema antes de la sesión.",
          "Explicación guiada del procedimiento que causa dificultad.",
          "Ejercicios relacionados para comprobar comprensión.",
          "Siguiente práctica acordada según la necesidad del estudiante.",
        ],
      },
      schedule: [
        {
          label: "Tutoría",
          times: ["Horario por confirmar según materia, nivel y disponibilidad"],
        },
      ],
      formats: [
        {
          icon: "building-2",
          title: "Opción presencial",
          text:
            "La sede y la disponibilidad se confirman según el tema y el tutor correspondiente.",
        },
        {
          icon: "monitor-smartphone",
          title: "Opción online",
          text:
            "La modalidad remota se coordina cuando el tema, el material y la disponibilidad lo permiten.",
        },
        {
          icon: "calendar-days",
          title: "Sesión coordinada",
          text:
            "No se asume un bloque fijo: materia, nivel y horario se validan antes de empezar.",
        },
      ],
      logisticsNote:
        "AIT no publica un horario único para todas las tutorías. Comparte la materia, el nivel y la fecha objetivo para confirmar tutor y modalidad.",
      sectionCopy: {
        outcomes: {
          eyebrow: "Refuerzo con foco",
          title: "Menos repaso genérico; más claridad sobre el tema que te detiene.",
          text:
            "La tutoría organiza diagnóstico, explicación y práctica alrededor de una necesidad académica concreta.",
        },
        pathway: {
          id: "proceso-tutoria",
          eyebrow: "Cómo se coordina",
          title: "Llegar con contexto permite aprovechar mejor la sesión.",
          text:
            "Comparte el curso, el tema, el material y cualquier fecha importante antes de confirmar.",
          actionLabel: "Explicar lo que necesito",
          actionHref: admissionsCourseHref("una tutoría de matemáticas para mi materia y nivel"),
          external: true,
        },
        logistics: {
          eyebrow: "Modalidad y horario",
          title: "El formato depende de la materia, el tutor y la disponibilidad.",
          text:
            "Presencial u online se confirma caso por caso; no publicamos disponibilidad automática.",
          formatsLabel: "Opciones de coordinación",
          scheduleLabel: "Horario",
          actionLabel: "Confirmar tutoría disponible",
        },
        faq: {
          eyebrow: "Antes de reservar",
          title: "La información que ayuda a coordinar una tutoría útil.",
          text:
            "Materia, nivel, tema y fecha objetivo permiten confirmar si AIT puede atender el caso.",
        },
      },
      faqs: [
        {
          question: "¿Para qué niveles hay tutorías?",
          answer:
            "AIT presenta tutorías para secundaria y universidad. La materia y el tema concreto deben confirmarse antes de reservar.",
        },
        {
          question: "¿Pueden ser presenciales u online?",
          answer:
            "La ruta contempla ambas opciones, sujetas al tema, al tutor disponible y a la coordinación previa.",
        },
        {
          question: "¿Debo enviar el material antes?",
          answer:
            "Es recomendable compartir el tema, ejercicios, guía o capítulo antes de la sesión para que admisiones pueda orientar mejor la tutoría.",
        },
        {
          question: "¿Hay un horario fijo?",
          answer:
            "No se publica un bloque único. El horario se confirma según materia, nivel, modalidad y disponibilidad.",
        },
        {
          question: "¿La tutoría garantiza mejorar una nota?",
          answer:
            "No. La tutoría ofrece explicación y práctica; el resultado depende de la base, el trabajo del estudiante, la asistencia y los criterios de su curso.",
        },
        {
          question: "¿Puede ayudar antes de un examen?",
          answer:
            "Puede orientarse a un examen si existe disponibilidad y si se comparte el material con tiempo. No se garantiza cubrir todo el temario en una sola sesión.",
        },
      ],
      closing: {
        eyebrow: "Trae el problema concreto",
        title: "Materia, tema y fecha: esos tres datos aceleran la orientación.",
        text:
          "Comparte lo que estás estudiando y dónde aparece la dificultad para confirmar modalidad, tutor y horario.",
        primaryLabel: "Consultar una tutoría",
        primaryCta: {
          href: admissionsCourseHref("las tutorías en matemáticas"),
          external: true,
        },
        advisorLabel: "Ver otras formas de contacto",
        advisorCta: {
          href: site.legalLinks.contact,
          external: false,
        },
      },
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
    editorial: {
      version: "course-editorial-v1",
      eyebrow: "Independencia digital desde la base",
      lead:
        "Un curso práctico para principiantes que quieren usar internet, archivos, programas y funciones cotidianas de la computadora con más seguridad.",
      heroImage: site.images.computing,
      heroImageAlt:
        "Instructora guiando una clase de computación básica con distintos dispositivos.",
      heroNote:
        "El sistema operativo, el nivel inicial y el bloque vigente se confirman antes de comenzar.",
      primaryCta: {
        label: "Consultar computación básica",
        href: admissionsCourseHref("el curso de computación básica"),
        external: true,
      },
      advisorCta: {
        label: "Ver otras formas de contacto",
        href: site.legalLinks.contact,
        external: false,
      },
      proofLedger: [
        {
          label: "Nivel",
          value: "Principiantes",
        },
        {
          label: "Uso",
          value: "Internet · archivos · programas",
        },
        {
          label: "Sistemas",
          value: "Windows o Mac",
        },
        {
          label: "Enfoque",
          value: "Tareas cotidianas",
        },
      ],
      outcomes: [
        {
          number: "01",
          title: "Navegar con más criterio",
          text:
            "Practica búsquedas, correo, direcciones, formularios y otras tareas frecuentes de internet.",
        },
        {
          number: "02",
          title: "Organizar archivos y programas",
          text:
            "Aprende operaciones básicas para guardar, encontrar, instalar, desinstalar y mantener orden.",
        },
        {
          number: "03",
          title: "Resolver tareas cotidianas",
          text:
            "Aplica la base digital a comunicación, estudio, trabajo, pagos y gestiones personales.",
        },
      ],
      pathway: [
        {
          stage: "Módulo 01",
          marker: "01",
          title: "Equipo y entorno",
          text:
            "Reconoce funciones esenciales del sistema, contraseñas, ventanas, carpetas y programas.",
          focus: "Base del sistema",
        },
        {
          stage: "Módulo 02",
          marker: "02",
          title: "Internet y comunicación",
          text:
            "Practica navegación, búsquedas, correo, fotos y comunicación con atención a hábitos seguros.",
          focus: "Uso online",
        },
        {
          stage: "Módulo 03",
          marker: "03",
          title: "Archivos y mantenimiento",
          text:
            "Organiza documentos y revisa acciones preventivas básicas para cuidar el equipo.",
          focus: "Continuidad",
        },
      ],
      method: {
        eyebrow: "Aprender haciendo",
        title: "Cada función se entiende mejor cuando resuelve una tarea real.",
        text:
          "La ruta conecta explicaciones básicas con acciones cotidianas: buscar, escribir, guardar, compartir, instalar y mantener orden.",
        image: site.images.computing,
        imageAlt:
          "Dispositivos digitales usados para practicar tareas básicas de computación.",
        figcaption: "Computación básica · práctica para tareas cotidianas",
        points: [
          "Operaciones esenciales en Windows o Mac según el grupo.",
          "Internet, correo, búsqueda y comunicación.",
          "Archivos, fotos, contraseñas y programas.",
          "Hábitos preventivos básicos para el equipo.",
        ],
      },
      schedule: [
        {
          label: "Lun y mié · mañana",
          times: ["10:00–11:00 am"],
        },
        {
          label: "Lun y mié · noche",
          times: ["6:00–7:00 pm"],
        },
        {
          label: "Sábados",
          times: ["2:00–4:00 pm"],
        },
      ],
      formats: [
        {
          icon: "book-open-check",
          title: "Desde cero",
          text:
            "La ruta está pensada para personas que necesitan construir una base funcional.",
        },
        {
          icon: "laptop",
          title: "Windows o Mac",
          text:
            "Confirma el sistema y el equipo que usarás para orientar la práctica del grupo.",
        },
        {
          icon: "calendar-days",
          title: "Bloques publicados",
          text:
            "AIT publica opciones de mañana, noche y sábado, sujetas a grupo y cupo.",
        },
      ],
      logisticsNote:
        "Los bloques provienen de la información publicada por AIT y pueden cambiar. Confirma sistema, sede o modalidad, cupo y horario antes de inscribirte.",
      sectionCopy: {
        outcomes: {
          eyebrow: "Habilidades funcionales",
          title: "La meta es depender menos de otra persona para tareas digitales básicas.",
          text:
            "Navegación, archivos y programas se practican alrededor de acciones que aparecen en la vida diaria.",
        },
        pathway: {
          id: "modulos-computacion-basica",
          eyebrow: "Ruta de práctica",
          title: "Primero entiende el equipo; después amplía lo que puedes hacer con él.",
          text:
            "El contenido concreto se ajusta al sistema operativo y al punto de partida del grupo.",
          actionLabel: "Consultar mi punto de inicio",
          actionHref: admissionsCourseHref("mi punto de inicio para computación básica"),
          external: true,
        },
        logistics: {
          eyebrow: "Equipo y horarios",
          title: "Confirma qué llevar y qué bloque sigue activo.",
          text:
            "La práctica depende del sistema operativo, el equipo disponible y la organización del grupo.",
          formatsLabel: "Claves del curso",
          scheduleLabel: "Bloques publicados",
          actionLabel: "Confirmar equipo y horario",
        },
        faq: {
          eyebrow: "Antes de comenzar",
          title: "Respuestas para quien está empezando desde cero.",
          text:
            "Admisiones puede confirmar equipo, sistema, sede o modalidad, horario y punto de inicio.",
        },
      },
      faqs: [
        {
          question: "¿Necesito experiencia previa?",
          answer:
            "No se publica un requisito previo. El curso está descrito para principiantes, pero conviene explicar qué tareas ya puedes hacer.",
        },
        {
          question: "¿Se trabaja con Windows o Mac?",
          answer:
            "La información de AIT menciona ambos sistemas. Confirma cuál corresponde al grupo y qué equipo debes llevar o usar.",
        },
        {
          question: "¿Qué temas incluye?",
          answer:
            "La ruta publicada incluye internet, comunicación, archivos, contraseñas, instalación y desinstalación de programas, y mantenimiento preventivo básico.",
        },
        {
          question: "¿Los horarios publicados están garantizados?",
          answer:
            "No. Son bloques de referencia y dependen del grupo activo, la sede o modalidad y el cupo disponible.",
        },
        {
          question: "¿Este curso incluye Word, Excel y PowerPoint?",
          answer:
            "La ruta básica construye la base digital. Para herramientas de oficina existe un programa separado; admisiones puede orientar cuál conviene primero.",
        },
        {
          question: "¿Debo tener mi propia computadora?",
          answer:
            "No asumimos un requisito único. Confirma con admisiones si necesitas llevar equipo y qué sistema operativo usará el grupo.",
        },
      ],
      closing: {
        eyebrow: "Empieza por lo que necesitas resolver",
        title: "Cuéntanos qué equipo usas y qué tarea quieres dominar primero.",
        text:
          "Esa información ayuda a confirmar el grupo, el bloque y si computación básica es la ruta correcta.",
        primaryLabel: "Consultar computación básica",
        primaryCta: {
          href: admissionsCourseHref("el curso de computación básica"),
          external: true,
        },
        advisorLabel: "Ver otras formas de contacto",
        advisorCta: {
          href: site.legalLinks.contact,
          external: false,
        },
      },
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
    editorial: {
      version: "course-editorial-v1",
      eyebrow: "Herramientas para oficina y estudio",
      lead:
        "Una ruta práctica por Word, Excel y PowerPoint para crear documentos, organizar información y presentar ideas con más claridad.",
      heroImage: site.images.office,
      heroImageAlt:
        "Persona trabajando en una computadora con herramientas de productividad de oficina.",
      heroNote:
        "El módulo, el nivel inicial, el software y el horario vigente se confirman con admisiones.",
      primaryCta: {
        label: "Consultar computación para oficina",
        href: admissionsCourseHref("el curso de computación para oficina"),
        external: true,
      },
      advisorCta: {
        label: "Ver otras formas de contacto",
        href: site.legalLinks.contact,
        external: false,
      },
      proofLedger: [
        {
          label: "Herramientas",
          value: "Word · Excel · PowerPoint",
        },
        {
          label: "Uso",
          value: "Trabajo · estudio · administración",
        },
        {
          label: "Enfoque",
          value: "Proyectos prácticos",
        },
        {
          label: "Entrada",
          value: "Según base digital",
        },
      ],
      outcomes: [
        {
          number: "01",
          title: "Crear documentos útiles",
          text:
            "Practica cartas, informes, estimados, recibos, avisos y otros formatos frecuentes en Word.",
        },
        {
          number: "02",
          title: "Organizar y analizar datos",
          text:
            "Trabaja formatos, tablas, operaciones, bases de datos y gráficos dentro de Excel.",
        },
        {
          number: "03",
          title: "Presentar una idea",
          text:
            "Combina texto e imágenes en PowerPoint para explicar, capacitar o presentar un proyecto.",
        },
      ],
      pathway: [
        {
          stage: "Módulo 01",
          marker: "W",
          title: "Microsoft Word",
          text:
            "Crea y da formato a cartas, informes, recibos, memos, hojas de vida, flyers y otros documentos.",
          focus: "Documentos",
        },
        {
          stage: "Módulo 02",
          marker: "X",
          title: "Microsoft Excel",
          text:
            "Organiza datos, aplica operaciones y convierte información en tablas y gráficos comprensibles.",
          focus: "Datos",
        },
        {
          stage: "Módulo 03",
          marker: "P",
          title: "Microsoft PowerPoint",
          text:
            "Construye presentaciones con texto, imágenes y una secuencia clara para comunicar proyectos.",
          focus: "Presentaciones",
        },
      ],
      method: {
        eyebrow: "Productividad aplicada",
        title: "No se trata de memorizar menús; se trata de completar un trabajo real.",
        text:
          "Cada módulo conecta funciones del software con documentos, hojas de cálculo o presentaciones que aparecen en oficina, estudio y administración.",
        image: site.images.office,
        imageAlt:
          "Espacio de trabajo digital con aplicaciones de oficina en una computadora.",
        figcaption: "Computación para oficina · documentos, datos y presentaciones",
        points: [
          "Ejercicios alrededor de tareas reales.",
          "Documentos y formatos que pueden reutilizarse.",
          "Datos, operaciones y gráficos en Excel.",
          "Presentaciones con una secuencia visual clara.",
        ],
      },
      schedule: [
        {
          label: "Mar y jue · mañana",
          times: ["10:00–11:00 am"],
        },
        {
          label: "Mar y jue · noche",
          times: ["6:00–7:00 pm"],
        },
        {
          label: "Sábados",
          times: ["4:00–6:00 pm"],
        },
      ],
      formats: [
        {
          icon: "book-open-check",
          title: "Ruta por módulos",
          text:
            "Word, Excel y PowerPoint tienen objetivos distintos y pueden requerir ritmos diferentes.",
        },
        {
          icon: "laptop",
          title: "Práctica en software",
          text:
            "Confirma la versión, el equipo y cualquier requisito antes de iniciar el módulo.",
        },
        {
          icon: "calendar-days",
          title: "Bloques publicados",
          text:
            "AIT publica opciones de mañana, noche y sábado, sujetas a grupo y cupo.",
        },
      ],
      logisticsNote:
        "AIT publica estimaciones de cuatro semanas para Word y PowerPoint y ocho para Excel. Son referencias, no garantías; confirma módulo, versión, grupo y horario vigente.",
      sectionCopy: {
        outcomes: {
          eyebrow: "Trabajo visible",
          title: "Cada herramienta debe terminar en algo que puedas usar.",
          text:
            "La ruta convierte funciones de oficina en documentos, análisis y presentaciones concretas.",
        },
        pathway: {
          id: "modulos-oficina",
          eyebrow: "Tres módulos",
          title: "Documentos, datos y presentaciones requieren habilidades distintas.",
          text:
            "Admisiones puede orientar si conviene comenzar con computación básica o entrar directamente a un módulo de oficina.",
          actionLabel: "Consultar el módulo adecuado",
          actionHref: admissionsCourseHref("el módulo adecuado de computación para oficina"),
          external: true,
        },
        logistics: {
          eyebrow: "Software y horarios",
          title: "Confirma el módulo activo antes de organizar tu calendario.",
          text:
            "Los bloques y duraciones publicados son referencias; la oferta concreta depende de grupo, cupo y software.",
          formatsLabel: "Claves de la ruta de oficina",
          scheduleLabel: "Bloques publicados",
          actionLabel: "Confirmar módulo y horario",
        },
        faq: {
          eyebrow: "Antes de inscribirte",
          title: "Lo que conviene saber sobre módulos, software y duración.",
          text:
            "Admisiones puede confirmar el punto de entrada, la versión del software, el equipo y el bloque vigente.",
        },
      },
      faqs: [
        {
          question: "¿Qué programas se trabajan?",
          answer:
            "La ruta publicada incluye Microsoft Word, Excel y PowerPoint. Confirma qué módulo está activo y la versión de software correspondiente.",
        },
        {
          question: "¿Debo empezar por Word?",
          answer:
            "No se publica una secuencia obligatoria. Tu base digital y la disponibilidad del módulo ayudan a decidir el punto de entrada.",
        },
        {
          question: "¿Cuánto dura cada módulo?",
          answer:
            "AIT publica estimaciones de cuatro semanas para Word, ocho para Excel y cuatro para PowerPoint. No son garantías y deben confirmarse con el grupo vigente.",
        },
        {
          question: "¿Qué se practica en Excel?",
          answer:
            "La descripción incluye formatos, datos, gráficos y operaciones matemáticas aplicadas a situaciones de oficina.",
        },
        {
          question: "¿Los horarios publicados están garantizados?",
          answer:
            "No. Son bloques de referencia y dependen del módulo activo, el grupo, el cupo y la modalidad disponible.",
        },
        {
          question: "¿Necesito computadora propia o Microsoft Office instalado?",
          answer:
            "No asumimos un requisito único. Confirma con admisiones qué equipo, cuenta o versión de software necesitarás.",
        },
      ],
      closing: {
        eyebrow: "Elige por el trabajo que necesitas hacer",
        title: "Documento, hoja de cálculo o presentación: empieza por tu objetivo.",
        text:
          "Comparte tu nivel y la herramienta que necesitas para confirmar el módulo, el software y el horario correcto.",
        primaryLabel: "Consultar computación para oficina",
        primaryCta: {
          href: admissionsCourseHref("el curso de computación para oficina"),
          external: true,
        },
        advisorLabel: "Ver otras formas de contacto",
        advisorCta: {
          href: site.legalLinks.contact,
          external: false,
        },
      },
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
    editorial: {
      version: "course-editorial-v1",
      eyebrow: "Introducción al soporte técnico",
      lead:
        "Una ruta práctica para comenzar a entender diagnóstico, mantenimiento y reparación básica de laptops y computadoras de escritorio.",
      heroImage: site.images.repair,
      heroImageAlt:
        "Técnico revisando una computadora portátil con herramientas y componentes visibles.",
      heroNote:
        "El nivel, la modalidad, el equipo de práctica y el grupo activo se confirman antes de comenzar.",
      primaryCta: {
        label: "Consultar reparación de computadoras",
        href: admissionsCourseHref("el curso de reparación de computadoras"),
        external: true,
      },
      advisorCta: {
        label: "Ver otras formas de contacto",
        href: site.legalLinks.contact,
        external: false,
      },
      proofLedger: [
        {
          label: "Nivel",
          value: "Introductorio",
        },
        {
          label: "Equipos",
          value: "Laptop · desktop",
        },
        {
          label: "Enfoque",
          value: "Diagnóstico · mantenimiento",
        },
        {
          label: "Grupo",
          value: "Disponibilidad variable",
        },
      ],
      outcomes: [
        {
          number: "01",
          title: "Observar antes de intervenir",
          text:
            "Aprende a recopilar síntomas y revisar causas probables antes de cambiar piezas o software.",
        },
        {
          number: "02",
          title: "Aplicar mantenimiento básico",
          text:
            "Practica acciones preventivas y procedimientos introductorios para cuidar laptops y desktops.",
        },
        {
          number: "03",
          title: "Entender el siguiente nivel",
          text:
            "Distingue lo que puede resolverse con una base inicial de lo que requiere formación o soporte especializado.",
        },
      ],
      pathway: [
        {
          stage: "Módulo 01",
          marker: "01",
          title: "Componentes y síntomas",
          text:
            "Reconoce partes básicas del equipo y organiza la información necesaria para describir una falla.",
          focus: "Observación",
        },
        {
          stage: "Módulo 02",
          marker: "02",
          title: "Diagnóstico inicial",
          text:
            "Relaciona síntomas con revisiones básicas de hardware, sistema y mantenimiento.",
          focus: "Proceso",
        },
        {
          stage: "Módulo 03",
          marker: "03",
          title: "Mantenimiento y reparación básica",
          text:
            "Aplica procedimientos introductorios con cuidado y reconoce cuándo escalar un problema.",
          focus: "Práctica",
        },
      ],
      method: {
        eyebrow: "Proceso técnico",
        title: "Diagnosticar bien evita convertir una falla pequeña en un problema mayor.",
        text:
          "La ruta organiza observación, hipótesis, revisión y práctica básica. No sustituye certificaciones ni promete dominio de todos los equipos.",
        image: site.images.repair,
        imageAlt:
          "Computadora portátil abierta durante una revisión técnica introductoria.",
        figcaption: "Reparación de computadoras · diagnóstico y mantenimiento básico",
        points: [
          "Reconocimiento inicial de componentes y síntomas.",
          "Proceso básico para revisar fallas frecuentes.",
          "Mantenimiento preventivo de laptops y desktops.",
          "Criterio para identificar cuándo se necesita soporte especializado.",
        ],
      },
      schedule: [
        {
          label: "Viernes · mañana",
          times: ["10:00 am–12:30 pm"],
        },
        {
          label: "Viernes · noche",
          times: ["6:00–8:30 pm"],
        },
        {
          label: "Sábados",
          times: ["10:00 am–12:30 pm"],
        },
      ],
      formats: [
        {
          icon: "book-open-check",
          title: "Base introductoria",
          text:
            "El programa se presenta como una entrada al diagnóstico, mantenimiento y reparación básica.",
        },
        {
          icon: "laptop",
          title: "Laptop y desktop",
          text:
            "Confirma qué equipos y herramientas se usarán en el grupo antes de comenzar.",
        },
        {
          icon: "calendar-days",
          title: "Ruta técnica por confirmar",
          text:
            "AIT publica bloques de viernes y sábado, pero la disponibilidad puede variar.",
        },
      ],
      logisticsNote:
        "Los bloques publicados son referencias históricas de AIT y pueden no estar activos. Confirma modalidad, herramientas, equipo de práctica, cupo y horario antes de inscribirte.",
      sectionCopy: {
        outcomes: {
          eyebrow: "Pensamiento técnico básico",
          title: "La reparación empieza con un proceso, no con una pieza al azar.",
          text:
            "La ruta introduce observación, diagnóstico y mantenimiento para problemas frecuentes.",
        },
        pathway: {
          id: "ruta-reparacion",
          eyebrow: "Ruta introductoria",
          title: "Componentes, diagnóstico y práctica forman una misma secuencia.",
          text:
            "No prometemos reparar cualquier marca o modelo ni sustituir una certificación profesional.",
          actionLabel: "Consultar mi punto de entrada",
          actionHref: admissionsCourseHref("mi punto de entrada al curso de reparación de computadoras"),
          external: true,
        },
        logistics: {
          eyebrow: "Equipo y horarios",
          title: "Confirma que el grupo y las herramientas estén disponibles.",
          text:
            "Esta ruta técnica puede variar más que un curso regular; valida modalidad, equipo de práctica y bloque vigente.",
          formatsLabel: "Claves de la ruta técnica",
          scheduleLabel: "Bloques publicados",
          actionLabel: "Confirmar grupo técnico",
        },
        faq: {
          eyebrow: "Antes de comenzar",
          title: "Límites claros para una ruta técnica introductoria.",
          text:
            "Admisiones puede confirmar nivel, modalidad, herramientas, equipo, horario y alcance del grupo activo.",
        },
      },
      faqs: [
        {
          question: "¿El curso es para principiantes?",
          answer:
            "La descripción disponible lo presenta como una ruta introductoria. Comparte tu experiencia previa para confirmar si el grupo es adecuado.",
        },
        {
          question: "¿Se trabajan laptops y computadoras de escritorio?",
          answer:
            "Sí, la información de AIT menciona ambos tipos de equipo. El hardware concreto de práctica debe confirmarse con el grupo.",
        },
        {
          question: "¿Aprenderé a reparar cualquier marca o modelo?",
          answer:
            "No hacemos esa promesa. El curso ofrece una base de diagnóstico, mantenimiento y reparación; cada equipo y falla puede requerir procedimientos o formación especializados.",
        },
        {
          question: "¿Incluye certificación o garantía de empleo?",
          answer:
            "No publicamos certificación ni garantía de empleo. Confirma con admisiones cualquier documento de participación que corresponda al grupo.",
        },
        {
          question: "¿Los horarios publicados están activos?",
          answer:
            "No se garantizan. Son bloques publicados por AIT y deben validarse porque la disponibilidad de esta ruta técnica puede cambiar.",
        },
        {
          question: "¿Necesito llevar herramientas o una computadora?",
          answer:
            "No asumimos un requisito único. Confirma qué equipo, herramientas y medidas de seguridad exige el grupo antes de comenzar.",
        },
      ],
      closing: {
        eyebrow: "Primero confirma el grupo técnico",
        title: "Nivel, equipo y herramientas deben estar claros antes de inscribirte.",
        text:
          "Comparte tu experiencia y el tipo de computadora que te interesa para validar el punto de entrada y la disponibilidad.",
        primaryLabel: "Consultar reparación de computadoras",
        primaryCta: {
          href: admissionsCourseHref("el curso de reparación de computadoras"),
          external: true,
        },
        advisorLabel: "Ver otras formas de contacto",
        advisorCta: {
          href: site.legalLinks.contact,
          external: false,
        },
      },
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

const verifiedHeadquartersHours = [
  {
    label: "Entre semana",
    slots: [
      { label: "Lun–jue", times: "8:30 am–10 pm" },
      { label: "Vie", times: "9:30 am–8 pm" },
    ],
  },
  {
    label: "Fin de semana",
    slots: [
      { label: "Sáb", times: "9:30 am–6 pm" },
      { label: "Dom", times: "10 am–1 pm" },
    ],
  },
];

const centralLocationContact = {
  phone: site.phone,
  phoneHref: site.phoneHref,
  whatsapp: site.whatsapp,
  whatsappHref: site.whatsappHref,
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
    hoursLabel: "Horario de atención",
    hours: verifiedHeadquartersHours,
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
  eyebrow: "Escuela de inglés en Nueva Jersey",
  headline: "Comprende el inglés. Exprésate con confianza.",
  headlineLead: "Comprende el inglés.",
  headlineEmphasis: "Exprésate con confianza.",
  headlineAccent: "",
  subheadline:
    "Graphic Concept es nuestro método visual para ayudarte a pensar en inglés y comunicarte en el trabajo, los estudios y la vida diaria.",
  subheadlineLines: [
    "Graphic Concept es nuestro método visual para ayudarte a pensar en inglés y comunicarte en el trabajo, los estudios y la vida diaria.",
  ],
  objections: [
    "¿Quieres hablar inglés rápido, fácil y sin estrés?",
    "¿Llevas tiempo intentando hablar inglés y todavía no lo logras?",
    "¿Te obligan a memorizar miles de palabras y sientes que no te alcanzan ni el tiempo ni la cabeza?",
  ],
  ctas: {
    primary: "Conoce tu nivel",
    secondary: "Explora el método",
    tertiary: "Ver cursos detallados",
  },
};

const institutionalProof = [
  {
    value: "Desde 2004",
    label: "Educación en Nueva Jersey",
  },
  {
    value: "+1,000",
    label: "Estudiantes guiados",
  },
  {
    value: "4 sedes",
    label: "En Nueva Jersey",
  },
  {
    value: "Alcance internacional",
    label: "EE. UU., Centroamérica y Sudamérica",
  },
];

const methodNarrative = {
  eyebrow: "Método Graphic Concept",
  heading: "Tres razones por las que somos diferentes.",
  introduction:
    "Durante más de 20 años hemos escuchado las necesidades y frustraciones de nuestra comunidad. Así nació Graphic Concept: una forma diferente de aprender, creada para ayudarte a comprender y hablar inglés sin memorizar listas interminables.",
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
      "Entrena tu comprensión para entender inglés directamente, sin traducir palabra por palabra.",
  },
  {
    key: "speak",
    icon: "message-circle",
    title: "Habla sin memorizar",
    body:
      "Practica estructuras útiles para hablar desde la primera clase, sin listas interminables.",
  },
  {
    key: "graphic-concept",
    icon: "route",
    title: "Avanza a tu ritmo",
    body:
      "Graphic Concept se adapta a tu nivel: un método propio, patentado y probado para hablar con más facilidad.",
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
    mobileSummary:
      "Práctica cara a cara con corrección inmediata en Nueva Jersey.",
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
    mobileSummary:
      "Combina clases presenciales y apoyo remoto.",
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
    mobileSummary:
      "Estudia en vivo desde casa o desde otro país.",
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
  eyebrow: "AIT Placement Diagnostic",
  title: "Descubre tu punto de partida sin registrarte",
  intro:
    "Una pregunta a la vez, con progreso claro y libertad para regresar o saltar. Primero recibes una estimación de nivel; después decides si quieres guardarla o hablar con un asesor.",
  privacyNote:
    "No pedimos nombre, email ni teléfono para completar el examen o ver tu estimación inicial. Para personas de 13 años o más, el avance anónimo puede recuperarse durante siete días; para menores de 13 permanece solo en esta pestaña. Las respuestas nunca se envían al CRM.",
  crmNote:
    "El resultado es una estimación inicial de AIT. Un asesor confirma contigo el nivel, horario y siguiente paso antes de la inscripción.",
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
        { prompt: "1. My Father ____ 56 years old.", options: ["has", "are", "is", "I Don't Know"] },
        { prompt: "2. ___ I wrong?", options: ["Is", "Am", "Do", "I Don't Know"] },
        { prompt: "3. “_______ are you?” “I’m in the classroom.”", options: ["Who", "When", "Where", "I Don't Know"] },
        { prompt: "4. Lazaro is ___ the hospital.", options: ["on", "to", "in", "I Don't Know"] },
        { prompt: "5. Carla and Maria ___ at the beach.", options: ["are", "is", "goes", "I Don't Know"] },
        { prompt: "6. ___ is Kenneth doing?", options: ["Who", "What", "Where", "I Don't Know"] },
        { prompt: "7. He’s my _________.", options: ["wife", "nephew", "sister", "I Don't Know"] },
        { prompt: "8. My son is riding ______ bike.", options: ["her", "his", "he", "I Don't Know"] },
        { prompt: "9. “Is Ana ___?” “No, she isn't.”", options: ["eat", "eating", "ate", "I Don't Know"] },
        { prompt: "10. We're standing ____ front of our house.", options: ["on", "at", "in", "I Don't Know"] },
        { prompt: "11. How many closets ___ there in the apartment?", options: ["is", "are", "am", "I Don't Know"] },
        { prompt: "12. _______ purses are expensive.", options: ["These", "This", "There", "I Don't Know"] },
      ],
    },
    {
      level: "Level 2 (Book 1)",
      items: [
        { prompt: "13. Bob is _____ married. He’s single.", options: ["was", "not", "only", "I Don't Know"] },
        { prompt: "14. Where _____ your parents live?", options: ["does", "do", "were", "I Don't Know"] },
        { prompt: "15. We ____ at home every day.", options: ["stay", "stays", "be", "I Don't Know"] },
        { prompt: "16. When my cats are hungry, I always feed _______.", options: ["it", "they", "them", "I Don't Know"] },
        { prompt: "17. ______ Martin cook?", options: ["Do", "Does", "Is", "I Don't Know"] },
        { prompt: "18. Carla can’t ______ Arabic.", options: ["to speak", "speaks", "speak", "I Don't Know"] },
        { prompt: "19. Every Sunday, Carlos ____ his clothes at the Super Laundromat.", options: ["washes", "wash", "washing", "I Don't Know"] },
        { prompt: "20. “Does Melissa sell cars?” “No, ________. She sells computers.”", options: ["She does", "She isn't", "She doesn't", "I Don't Know"] },
        { prompt: "21. ______ you speak Spanish?", options: ["Does", "Do", "Are", "I Don't Know"] },
        { prompt: "22. What ______ you buy at the supermarket yesterday?", options: ["do", "did", "were", "I Don't Know"] },
        { prompt: "23. Where ______ you last night?", options: ["do", "were", "did", "I Don't Know"] },
        { prompt: "24. Martin ______ TV every night.", options: ["watching", "are going to watch", "watches", "I Don't Know"] },
        { prompt: "25. Tomorrow, Helen ______ get up at 7:30am.", options: ["are going to", "not going to", "is going to", "I Don't Know"] },
      ],
    },
    {
      level: "Level 3 (Book 2)",
      items: [
        { prompt: "26. What did you give your mother for Christmas?", options: ["I gave her a plant.", "I gave to her a plant.", "I gave a plant.", "I Don't Know"] },
        { prompt: "27. There aren’t ____ cookies on my plate.", options: ["many", "much", "some", "I Don't Know"] },
        { prompt: "28. Yesterday, we _____ to the OMV to register the car.", options: ["go", "went", "goed", "I Don't Know"] },
        { prompt: "29. There are only _____ books left for the students.", options: ["little", "a few", "much", "I Don't Know"] },
        { prompt: "30. I think she’s a careful worker. She works very _______.", options: ["carelessly", "carefully", "more careful", "I Don't Know"] },
        { prompt: "31. The doctor ______ a blood test.", options: ["take", "taken", "took", "I Don't Know"] },
        { prompt: "32. This test is ______ the last test I took.", options: ["more easy then", "easier that", "easier than", "I Don't Know"] },
        { prompt: "33. Some teachers are ____ other teachers.", options: ["more intelligent than", "intelligent than", "more intelligent as", "I Don't Know"] },
        { prompt: "34. You look very sick. You _____ go to the doctor.", options: ["might", "can", "should", "I Don't Know"] },
        { prompt: "35. I _____ go to the beach on Saturday, but I’m not sure.", options: ["might", "can", "should", "I Don't Know"] },
      ],
    },
    {
      level: "Level 4 (Book 2)",
      items: [
        { prompt: "36. When you were a child, ____ you speak Russian?", options: ["Could", "Can", "Should", "I Don't Know"] },
        { prompt: "37. I was jogging ______ the park when I slipped and fell.", options: ["at", "on", "up", "I Don't Know"] },
        { prompt: "38. You must eat less bread and ____ cookies.", options: ["less", "fewer", "too less", "I Don't Know"] },
        { prompt: "39. I ________ lose some weight.", options: ["must to", "have", "must", "I Don't Know"] },
        { prompt: "40. Do you have _____ money?", options: ["no", "any", "none", "I Don't Know"] },
        { prompt: "41. We didn’t see _________ in the room.", options: ["anybody", "someone", "nobody", "I Don't Know"] },
        { prompt: "42. She will _______ coming home very soon.", options: ["be", "was", "does", "I Don't Know"] },
      ],
    },
    {
      level: "Level 5 (Book 3)",
      items: [
        { prompt: "43. You should never argue ____ your parents.", options: ["to", "at", "with", "I Don't Know"] },
        { prompt: "44. Some people always complain _____ the weather.", options: ["at", "on", "about", "I Don't know"] },
        { prompt: "45. “Let's go ___ the beach! This weather calls for it.”", options: ["to", "at", "in", "I Don't Know"] },
        { prompt: "46. We've ____ here _____ more than two hours.", options: ["was / in", "been / since", "been / for", "I Don't Know"] },
        { prompt: "47. She couldn’t come yesterday and she can’t come today, ________.", options: ["Neither", "Too", "Either", "I Don't Know"] },
        { prompt: "48. Have you ______ a rainbow?", options: ["ever seen", "never seen", "ever saw", "I Don't Know"] },
        { prompt: "49. Have you ever ___ a tuxedo?", options: ["used", "wore", "worn", "I Don't Know"] },
        { prompt: "50. I’ve been ____ in helicopters for years.", options: ["fly", "flown", "flying", "I Don't Know"] },
      ],
    },
    {
      level: "Level 6 (Book 3)",
      items: [
        { prompt: "51. By the time I got to the concert, it _____.", options: ["has already begun", "already began", "had already begun", "I Don't Know"] },
        { prompt: "52. I decided to stop _____ my nails.", options: ["bite", "to bite", "biting", "I Don't Know"] },
        { prompt: "53. _____ is a good way to relax.", options: ["Swim", "To swim", "Swimming", "I Don't Know"] },
        { prompt: "54. I thought _______ to France.", options: ["about moving", "to moving", "moving", "I Don't Know"] },
        { prompt: "55. “What should I do with these old newspapers?” “I think you should ______.”", options: ["throw out them", "throw them out", "through them out", "I Don't Know"] },
        { prompt: "56. “Are you still sick with the flu?” “No, I _____ three weeks ago.”", options: ["got over it", "got it over", "got over to", "I Don't Know"] },
        { prompt: "57. She __________ downtown whenever she can.", options: ["avoid to drive", "avoids driving", "avoids drive", "I Don't Know"] },
        { prompt: "58. I wanted to give you a tie for Christmas, but then I remembered that I _____ you one last Christmas.", options: ["have given", "had given", "gave", "I Don't Know"] },
        { prompt: "59. If I could speak Russian, I _____ to a Russian University.", options: ["would have gone", "would go", "went", "I Don't Know"] },
        { prompt: "60. If I had seen you yesterday, I ______ hello.", options: ["would say", "have said", "would have said", "I Don't Know"] },
        { prompt: "61. I'm upset - I burned my cookies. I _____ taken them out of the oven sooner.", options: ["might have", "may have", "should have", "I Don't Know"] },
        { prompt: "62. I stood on the chair to change the light. I got down safely, but I ______ fallen easily.", options: ["might have", "could have", "should have", "I Don't Know"] },
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

export const siteData = {
  painHero,
  methodNarrative,
  solutionCharacteristics,
  productOfferings,
  courseCatalog,
  conversionCtas,
  placementTest,
  heroProof,
  institutionalProof,
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

if (typeof window !== "undefined") {
  window.AITUSA_DATA = siteData;
}

export {
  contactPrep,
  conversionCtas,
  courseCatalog,
  courseGuides,
  differentiators,
  downloads,
  faqs,
  footerFacts,
  heroHighlights,
  heroPoints,
  heroProof,
  institutionalProof,
  heroQuickCapture,
  heroSignal,
  heroStartPath,
  heroVideoHighlights,
  launchPath,
  learningOutcomes,
  locations,
  methodBlocks,
  methodCharacteristics,
  methodNarrative,
  modalities,
  nav,
  painHero,
  placementTest,
  productOfferings,
  programs,
  requirements,
  schedules,
  site,
  solutionCharacteristics,
  stats,
  testimonials,
  trustFeature,
  trustHighlights,
};

export default siteData;
