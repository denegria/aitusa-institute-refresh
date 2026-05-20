const asset = (name) => `./public/assets/wix/${name}`;
const assetHires = (name) => asset(`hires/${name}`);

const site = {
  name: "AiT USA Institute",
  legal: "Division of Arrieta Institute LLC",
  tagline: "Una escuela de inglés ESL no tradicional",
  description:
    "Clases de inglés ESL presenciales, híbridas y online con el método Graphic Concept, profesoras bilingües, sedes en New Jersey y atención por WhatsApp.",
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
    hero: assetHires("hero-classroom.jpg"),
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
  "Técnicas para comprender inglés sin traducir palabra por palabra.",
  "Técnicas para hablar sin depender de memorizar miles de palabras.",
  "Modalidad presencial, híbrida y online para estudiantes dentro y fuera de USA.",
];

const stats = [
  { value: "20+", label: "años trabajando con la comunidad" },
  { value: "10 meses", label: "meta hacia nivel intermedio" },
  { value: "GC", label: "método Graphic Concept" },
  { value: "NJ + online", label: "sedes y clases remotas" },
];

const differentiators = [
  {
    title: "Comprensión antes que traducción",
    text:
      "El método busca que el estudiante entienda cómo funciona el inglés americano y pueda reaccionar sin traducir mentalmente cada frase.",
  },
  {
    title: "Hablar con estructura visual",
    text:
      "Graphic Concept organiza tiempos, palabras y patrones en una forma grafica para que presente, pasado y futuro se vuelvan practicables.",
  },
  {
    title: "Acompañamiento real",
    text:
      "Profesores norteamericanos y bilingües apoyan el proceso con clases, tutorías, talleres y seguimiento según el nivel de cada estudiante.",
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
      "Programa ESL para quienes quieren hablar inglés rápido, fácil y con menos estrés, usando el método Graphic Concept.",
    details: [
      "Enfoque en hablar y comprender en presente, pasado y futuro.",
      "Opción de asistir en New Jersey o conectarse online al grupo.",
      "Talleres, workshops y tutorías para reforzar dudas académicas.",
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
      "Clases remotas con profesores en Estados Unidos para estudiantes que quieren aprender desde cualquier país.",
    details: [
      "Acceso desde laptop, desktop, tableta o teléfono con internet.",
      "Metodología visual para pensar en inglés y reducir la traducción.",
      "Apoyo por WhatsApp para orientación y acceso a clases.",
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
      "Programa práctico y divertido para que los niños fuera de USA aprendan con profesores norteamericanos y bilingües.",
    details: [
      "Meta de comunicación en los tres tiempos a mediano plazo.",
      "Padres o tutores reciben informe de avance.",
      "Inscripción gratuita para ubicar nivel y horario.",
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
      "Clases de español con profesores de Latinoamérica, incluyendo expresiones coloquiales y práctica real.",
    details: [
      "Enfoque conversacional.",
      "Profesores de Colombia y Perú, según el sitio actual.",
      "Atención por WhatsApp para detalles de horario.",
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
      "Preparación para obtener el diploma equivalente a High School con orientación sobre el proceso.",
    details: [
      "Acompañamiento académico.",
      "Orientación previa por teléfono o WhatsApp.",
      "Información de modalidad a confirmar con la oficina.",
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
      "Refuerzo para estudiantes con inconvenientes en cursos de matemática de escuela secundaria o universidad.",
    details: [
      "Apoyo para aclarar dudas.",
      "Nivelación y mejora de habilidades.",
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
      "Curso para aprender funciones básicas de computadora y navegación en internet.",
    details: [
      "Uso inicial de computadora.",
      "Conceptos practicos para vida diaria.",
      "Soporte para estudiantes adultos.",
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
      "Entrenamiento en herramientas como Word, Excel y PowerPoint para tareas de oficina.",
    details: [
      "Práctica con documentos, hojas de cálculo y presentaciones.",
      "Enfoque laboral.",
      "Nivel inicial a intermedio según necesidad.",
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
      "Curso introductorio para reparar diferentes marcas y modelos de computadora.",
    details: [
      "Diagnóstico básico de equipos.",
      "Laptop y desktop.",
      "Información de cupos por teléfono.",
    ],
  },
];

const instructorClips = [
  {
    title: "Clase online en vivo",
    eyebrow: "Profesora bilingüe",
    image: site.images.onlineEnglish,
    imageAlt: "Instructora bilingüe con audífonos dictando una clase de inglés online.",
    caption: "Corrección inmediata, práctica oral y seguimiento por WhatsApp.",
    duration: "0:42",
  },
  {
    title: "Práctica para hablar",
    eyebrow: "Método visual",
    image: site.images.adultEnglish,
    imageAlt: "Estudiante practicando conversación de inglés con apoyo del método visual.",
    caption: "Presente, pasado y futuro se trabajan con estructura clara.",
    duration: "0:35",
  },
  {
    title: "Niños online",
    eyebrow: "8 a 13 años",
    image: site.images.kidsEnglish,
    imageAlt: "Niña aprendiendo inglés online con acompañamiento de su madre.",
    caption: "Clases remotas con guía para padres y avance por nivel.",
    duration: "0:28",
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
      "Graphic Concept presenta el idioma de forma visual para que el estudiante comprenda los tiempos y las palabras sin depender de textos extensos.",
  },
  {
    title: "Tutorías",
    image: site.images.tutoring,
    imageAlt: "Sesión de tutoría académica individual.",
    text:
      "El estudiante puede pedir apoyo para aclarar dudas, actualizarse, nivelarse y mejorar habilidades durante el programa.",
  },
  {
    title: "Niveles",
    image: site.images.level,
    imageAlt: "Material de niveles básico, intermedio y avanzado de inglés.",
    text:
      "Basico, intermedio y avanzado organizan la ruta desde vocabulario frecuente hasta conversacion, lectura, escritura y comprension.",
  },
  {
    title: "Becas",
    image: site.images.scholarship,
    imageAlt: "Imagen promocional de becas para estudiantes destacados.",
    text:
      "El sitio actual comunica becas para estudiantes que ocupan el primer puesto al concluir niveles básico e intermedio.",
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
    note: "Atencion para clases en linea",
  },
];

const testimonials = [
  {
    name: "Antonina Silvero y Zulma",
    image: site.images.testimonialAntonina,
    imageAlt: "Estudiantes de AiT USA Institute compartiendo su experiencia.",
    text:
      "Nos hablaron de AiT USA Institute y pensábamos que era difícil aprender, pero el instituto utiliza un método gráfico que nos hizo comprender el idioma rápido y fácil.",
  },
  {
    name: "Marisol Guardado",
    image: site.images.testimonialMarisol,
    imageAlt: "Estudiante de AiT USA Institute después de ganar confianza hablando inglés.",
    text:
      "Una amiga me recomendo el instituto. Gracias a la forma como explican el idioma gane confianza; ahora puedo comprender y expresarme.",
  },
];

const teachers = [
  "Profesores norteamericanos y bilingües localizados en Estados Unidos.",
  "Equipo comprometido con que los estudiantes hablen inglés en corto tiempo.",
  "Acompañamiento para estudiantes de distintos países, horarios y niveles académicos.",
];

const downloads = [
  {
    title: "Apple iPhone / iPad",
    text: "Aplicación para dispositivo móvil Apple, IOS 7 o superior.",
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
    text: "Aplicación para teléfono móvil o tableta Android.",
    image: asset("161-android-logo.png"),
    imageAlt: "Logo de Android para descarga de aplicación.",
  },
  {
    title: "Windows",
    text: "Aplicación para usuarios de Windows, todas las versiones.",
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
      "100% clases de inglés en línea para estudiantes en Europa. El dashboard indica reportar el pago por WhatsApp.",
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
      "Paquete de registro más libro. Las variantes del dashboard mantienen el mismo precio para online y presencial.",
    variants: [
      { name: "Online", price: "$95.00" },
      { name: "In Person", price: "$95.00" },
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
      { name: "Básico | In Person", price: "$55.00" },
      { name: "Intermedio | In Person", price: "$55.00" },
      { name: "Avanzado | In Person", price: "$55.00" },
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
      "Cursos online de tres meses: Graphic Design, Web Design y Computer Repair & Networking. El dashboard muestra el curso técnico con precio reducido.",
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
      { name: "Básico | In Person | Mensual", price: "$145.00" },
      { name: "Intermedio | In Person | Mensual", price: "$145.00" },
      { name: "Avanzado | In Person | Mensual", price: "$145.00" },
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
      "Curso estimado de seis meses, dos clases de una hora por semana. Horarios capturados: sábados 9-11, 11-1, 2-4 y 4-6.",
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
      "Si quien enseña no utiliza métodos apropiados, puede sentirse difícil. AiT USA Institute comunica que su método busca convertir lo difícil en fácil y lo imposible en posible.",
  },
  {
    question: "Asisto a clases pero no logro memorizar, ¿qué hago?",
    answer:
      "El enfoque no es memorizar todas las palabras, sino comprender cómo funciona el método y practicar las palabras comunes en contexto.",
  },
  {
    question: "Voy a clases pero no puedo hablar, ¿por qué?",
    answer:
      "El sitio actual explica que muchas escuelas se basan en completar libros; AiT USA se enfoca en un método gráfico para pensar y no traducir.",
  },
  {
    question: "Entiendo la clase pero luego me olvido.",
    answer:
      "El método visual busca que lo aprendido se recuerde como una estructura gráfica, no solo como texto o palabras aisladas.",
  },
  {
    question: "No tengo tiempo para estudiar, pero quiero hablar inglés.",
    answer:
      "El programa se presenta como simple, visual, práctico y colorido para personas que trabajan y no pueden estudiar todo el día.",
  },
  {
    question: "Nunca fui buen estudiante, ¿es posible aprender?",
    answer:
      "El primer paso es tener el deseo de aprender. La persistencia del estudiante y el método son parte central del mensaje de la escuela.",
  },
];

window.AITUSA_DATA = {
  books,
  differentiators,
  downloads,
  faqs,
  heroPoints,
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
  teachers,
  testimonials,
};
