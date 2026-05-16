const asset = (name) => `./public/assets/wix/${name}`;

const site = {
  name: "AiT USA Institute",
  legal: "Division of Arrieta Institute LLC",
  tagline: "Una escuela de inglés ESL no tradicional",
  founded: "2004",
  phone: "+1 732-271-0011",
  phoneHref: "tel:+17322710011",
  whatsapp: "+1 732-379-0593",
  whatsappHref: "https://wa.me/17323790593",
  emailHref:
    "mailto:info@aitusainstitute.com?subject=Informacion%20sobre%20clases%20AiT%20USA%20Institute",
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
    hero: asset("079-background7.jpg"),
    adultEnglish: asset("099-hablando-ingles.jpg"),
    onlineEnglish: asset("083-persona-20con-20microfono-edited.jpg"),
    kidsEnglish: asset("087-motheranddaugther.jpg"),
    computing: asset("081-laptop-work.jpg"),
    office: asset("085-cursos-2520de-2520oficina-edited-edited.jpg"),
    repair: asset("089-reparacion-de-computadoras.jpg"),
    spanish: asset("091-spanish-classes.jpg"),
    ged: asset("093-ged-classes.png"),
    math: asset("095-math-class.jpg"),
    method: asset("103-metodologia.jpg"),
    tutoring: asset("101-background10.jpeg"),
    level: asset("109-niveles-20de-20ingles-edited.jpg"),
    scholarship: asset("111-becas.jpg"),
    contact: asset("153-f0e785-fd00796923204eefa8fc070811dd7598f000.jpg"),
    headset: asset("169-audifono-y-microfono.jpg"),
    devices: asset("171-laptop-and-phonhe-3.jpg"),
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
  ["Metodo", "metodo"],
  ["Libros", "libros"],
  ["Horarios", "horarios"],
  ["Sedes", "sedes"],
  ["FAQ", "faq"],
  ["Contacto", "contacto"],
];

const heroPoints = [
  "Tecnicas para comprender ingles sin traducir palabra por palabra.",
  "Tecnicas para hablar sin depender de memorizar miles de palabras.",
  "Modalidad presencial, hibrida y online para estudiantes dentro y fuera de USA.",
];

const stats = [
  { value: "20+", label: "anos trabajando con la comunidad" },
  { value: "10 meses", label: "meta hacia nivel intermedio" },
  { value: "GC", label: "metodo Graphic Concept" },
  { value: "NJ + online", label: "sedes y clases remotas" },
];

const differentiators = [
  {
    title: "Comprension antes que traduccion",
    text:
      "El metodo busca que el estudiante entienda como funciona el ingles americano y pueda reaccionar sin traducir mentalmente cada frase.",
  },
  {
    title: "Hablar con estructura visual",
    text:
      "Graphic Concept organiza tiempos, palabras y patrones en una forma grafica para que presente, pasado y futuro se vuelvan practicables.",
  },
  {
    title: "Acompanamiento real",
    text:
      "Profesores norteamericanos y bilingues apoyan el proceso con clases, tutorias, talleres y seguimiento segun el nivel de cada estudiante.",
  },
];

const programs = [
  {
    title: "Ingles para jovenes y adultos",
    category: "ingles",
    mode: "Presencial, hibrido y online",
    audience: "Personas dentro de Estados Unidos",
    image: site.images.adultEnglish,
    summary:
      "Programa ESL para quienes quieren hablar ingles rapido, facil y con menos estres, usando el metodo Graphic Concept.",
    details: [
      "Enfoque en hablar y comprender en presente, pasado y futuro.",
      "Opcion de asistir en New Jersey o conectarse online al grupo.",
      "Talleres, workshops y tutorias para reforzar dudas academicas.",
    ],
  },
  {
    title: "Ingles online para jovenes y adultos",
    category: "ingles",
    mode: "100% online",
    audience: "Personas fuera de Estados Unidos",
    image: site.images.onlineEnglish,
    summary:
      "Clases remotas con profesores en Estados Unidos para estudiantes que quieren aprender desde cualquier pais.",
    details: [
      "Acceso desde laptop, desktop, tableta o telefono con internet.",
      "Metodologia visual para pensar en ingles y reducir la traduccion.",
      "Apoyo por WhatsApp para orientacion y acceso a clases.",
    ],
  },
  {
    title: "Ingles para ninos",
    category: "ninos",
    mode: "100% online",
    audience: "Ninos de 8 a 13 anos",
    image: site.images.kidsEnglish,
    summary:
      "Programa practico y divertido para que los ninos fuera de USA aprendan con profesores norteamericanos y bilingues.",
    details: [
      "Meta de comunicacion en los tres tiempos a mediano plazo.",
      "Padres o tutores reciben informe de avance.",
      "Inscripcion gratuita para ubicar nivel y horario.",
    ],
  },
  {
    title: "Espanol para extranjeros",
    category: "idiomas",
    mode: "Online",
    audience: "Estudiantes que desean aprender espanol",
    image: site.images.spanish,
    summary:
      "Clases de espanol con profesores de Latinoamerica, incluyendo expresiones coloquiales y practica real.",
    details: [
      "Enfoque conversacional.",
      "Profesores de Colombia y Peru, segun el sitio actual.",
      "Atencion por WhatsApp para detalles de horario.",
    ],
  },
  {
    title: "GED",
    category: "academico",
    mode: "Presencial",
    audience: "Adultos que buscan equivalencia de High School",
    image: site.images.ged,
    summary:
      "Preparacion para obtener el diploma equivalente a High School con orientacion sobre el proceso.",
    details: [
      "Acompanamiento academico.",
      "Orientacion previa por telefono o WhatsApp.",
      "Informacion de modalidad a confirmar con la oficina.",
    ],
  },
  {
    title: "Tutorias en matematicas",
    category: "academico",
    mode: "Presencial u online",
    audience: "Secundaria y universidad",
    image: site.images.math,
    summary:
      "Refuerzo para estudiantes con inconvenientes en cursos de matematica de escuela secundaria o universidad.",
    details: [
      "Apoyo para aclarar dudas.",
      "Nivelacion y mejora de habilidades.",
      "Horario coordinado segun disponibilidad.",
    ],
  },
  {
    title: "Computacion basica",
    category: "tecnologia",
    mode: "Curso practico",
    audience: "Principiantes",
    image: site.images.computing,
    summary:
      "Curso para aprender funciones basicas de computadora y navegacion en internet.",
    details: [
      "Uso inicial de computadora.",
      "Conceptos practicos para vida diaria.",
      "Soporte para estudiantes adultos.",
    ],
  },
  {
    title: "Computacion para oficina",
    category: "tecnologia",
    mode: "Herramientas de oficina",
    audience: "Trabajo y administracion",
    image: site.images.office,
    summary:
      "Entrenamiento en herramientas como Word, Excel y PowerPoint para tareas de oficina.",
    details: [
      "Practica con documentos, hojas de calculo y presentaciones.",
      "Enfoque laboral.",
      "Nivel inicial a intermedio segun necesidad.",
    ],
  },
  {
    title: "Reparacion de computadoras",
    category: "tecnologia",
    mode: "Curso tecnico",
    audience: "Laptop y desktop",
    image: site.images.repair,
    summary:
      "Curso introductorio para reparar diferentes marcas y modelos de computadora.",
    details: [
      "Diagnostico basico de equipos.",
      "Laptop y desktop.",
      "Informacion de cupos por telefono.",
    ],
  },
];

const schedules = [
  {
    label: "Mananas",
    times: ["8:30 am a 9:30 am", "9:30 am a 10:30 am", "10:30 am a 11:30 am"],
  },
  {
    label: "Noches",
    times: ["6:20 pm a 7:30 pm", "7:30 pm a 8:40 pm", "8:40 pm a 9:50 pm"],
  },
  {
    label: "Sabados",
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
    title: "Hibrido",
    text:
      "Puedes venir en persona cuando puedas y conectarte online con tu grupo cuando no puedas llegar.",
  },
  {
    title: "Online",
    text:
      "Participas con tu profesor y companeros completamente en linea desde cualquier lugar.",
  },
];

const methodBlocks = [
  {
    title: "Metodologia GC",
    image: site.images.method,
    text:
      "Graphic Concept presenta el idioma de forma visual para que el estudiante comprenda los tiempos y las palabras sin depender de textos extensos.",
  },
  {
    title: "Tutorias",
    image: site.images.tutoring,
    text:
      "El estudiante puede pedir apoyo para aclarar dudas, actualizarse, nivelarse y mejorar habilidades durante el programa.",
  },
  {
    title: "Niveles",
    image: site.images.level,
    text:
      "Basico, intermedio y avanzado organizan la ruta desde vocabulario frecuente hasta conversacion, lectura, escritura y comprension.",
  },
  {
    title: "Becas",
    image: site.images.scholarship,
    text:
      "El sitio actual comunica becas para estudiantes que ocupan el primer puesto al concluir niveles basico e intermedio.",
  },
];

const books = [
  {
    title: "Intro Plus",
    subtitle: "English Introductory Book",
    image: asset("031-intro-book-portada.jpg"),
    text: "Aqui empieza la familiarizacion con el ingles y con la ruta academica del metodo.",
  },
  {
    title: "Step Plus 1",
    subtitle: "Student's Book",
    image: asset("035-step-plus-1-portada.jpg"),
    text: "Introduccion al metodo, la tecnica y la estrategia.",
  },
  {
    title: "Step Plus 2",
    subtitle: "Student's Book",
    image: asset("037-step-plus-2-portada.jpg"),
    text: "Continuacion de la base visual para practicar patrones esenciales.",
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
    text: "Preparacion para expresarse con mas libertad.",
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
    image: asset("050-img-3178-jpg.jpg"),
    text:
      "Nos hablaron de AiT USA Institute y pensabamos que era dificil aprender, pero el instituto utiliza un metodo grafico que nos hizo comprender el idioma rapido y facil.",
  },
  {
    name: "Marisol Guardado",
    image: asset("054-img-3170-jpg.jpg"),
    text:
      "Una amiga me recomendo el instituto. Gracias a la forma como explican el idioma gane confianza; ahora puedo comprender y expresarme.",
  },
];

const teachers = [
  "Profesores norteamericanos y bilingues localizados en Estados Unidos.",
  "Equipo comprometido con que los estudiantes hablen ingles en corto tiempo.",
  "Acompanamiento para estudiantes de distintos paises, horarios y niveles academicos.",
];

const downloads = [
  {
    title: "Apple iPhone / iPad",
    text: "Aplicacion para dispositivo movil Apple, IOS 7 o superior.",
    image: asset("155-apple-20logo-edited.jpg"),
  },
  {
    title: "Apple laptop",
    text: "Aplicacion para laptop Apple, Mac OS X 10.8 o superior.",
    image: asset("157-5bfb6f-c2ae26a3c5004bca9ea2b860a535f4ab.jpg"),
  },
  {
    title: "Android",
    text: "Aplicacion para telefono movil o tableta Android.",
    image: asset("161-android-logo.png"),
  },
  {
    title: "Windows",
    text: "Aplicacion para usuarios de Windows, todas las versiones.",
    image: asset("163-window-logo.jpg"),
  },
];

const requirements = [
  {
    title: "Audifono y microfono",
    image: site.images.headset,
    text: "Necesario para escuchar mejor, hablar con claridad y evitar interferencias.",
  },
  {
    title: "Dispositivo con internet",
    image: site.images.devices,
    text: "Laptop, desktop, tableta o telefono con conexion estable.",
  },
];

const storeProducts = [
  {
    title: "Europa - Mes (4 weeks)",
    price: "$175.00",
    status: "In stock",
    sku: "",
    image: site.images.productEuropa,
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
    question: "Es dificil aprender ingles?",
    answer:
      "Si quien ensena no utiliza metodos apropiados, puede sentirse dificil. AiT USA Institute comunica que su metodo busca convertir lo dificil en facil y lo imposible en posible.",
  },
  {
    question: "Asisto a clases pero no logro memorizar, que hago?",
    answer:
      "El enfoque no es memorizar todas las palabras, sino comprender como funciona el metodo y practicar las palabras comunes en contexto.",
  },
  {
    question: "Voy a clases pero no puedo hablar, por que?",
    answer:
      "El sitio actual explica que muchas escuelas se basan en completar libros; AiT USA se enfoca en un metodo grafico para pensar y no traducir.",
  },
  {
    question: "Entiendo la clase pero luego me olvido.",
    answer:
      "El metodo visual busca que lo aprendido se recuerde como una estructura grafica, no solo como texto o palabras aisladas.",
  },
  {
    question: "No tengo tiempo para estudiar, pero quiero hablar ingles.",
    answer:
      "El programa se presenta como simple, visual, practico y colorido para personas que trabajan y no pueden estudiar todo el dia.",
  },
  {
    question: "Nunca fui buen estudiante, es posible aprender?",
    answer:
      "El primer paso es tener el deseo de aprender. La persistencia del estudiante y el metodo son parte central del mensaje de la escuela.",
  },
];

window.AITUSA_DATA = {
  books,
  differentiators,
  downloads,
  faqs,
  heroPoints,
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
