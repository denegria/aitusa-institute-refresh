export const LEGAL_EFFECTIVE_DATE_ISO = "2026-07-17";
export const LEGAL_EFFECTIVE_DATE_ES = "17 de julio de 2026";
export const PRIVACY_EFFECTIVE_DATE_ISO = "2026-08-02";
export const PRIVACY_EFFECTIVE_DATE_ES = "2 de agosto de 2026";
export const PRIVACY_POLICY_VERSION = "aitusa-privacy-2026-08-02-v2";
export const TERMS_VERSION = "aitusa-terms-2026-07-17-v1";
export const SMS_DISCLOSURE_VERSION = "aitusa-sms-consent-2026-07-17-v1";

export const PUBLIC_LEGAL_LINKS = Object.freeze({
  privacy: "/privacy-policy",
  terms: "/terms-and-conditions",
  contact: "/contactanos",
});

export const SMS_CONSENT_COPY_ES =
  "Sí, deseo recibir mensajes de texto de AIT USA Institute.";

export const SMS_DISCLOSURE_ES =
  "Al marcar esta casilla, acepto recibir mensajes de texto de AIT USA Institute sobre consultas, inscripción, clases, exámenes de ubicación, recordatorios y promociones. La frecuencia de los mensajes puede variar. Pueden aplicarse tarifas de mensajes y datos. Responde STOP para cancelar y HELP para obtener ayuda. El consentimiento no es una condición para comprar ni recibir servicios.";

export const CONTACT_PERMISSION_COPY_ES =
  "Autorizo a AIT USA Institute a responder esta solicitud por teléfono, correo electrónico o WhatsApp. Esta autorización no incluye mensajes de texto promocionales.";

export const privacyPolicy = Object.freeze({
  eyebrow: "Privacidad y confianza",
  title: "Política de Privacidad",
  summary:
    "Esta política explica qué información recopila AIT USA Institute, por qué la usa, con quién puede compartirla para operar sus servicios y qué opciones tienes. Nuestro compromiso más importante para el programa de mensajes es simple: no vendemos ni compartimos tus datos de suscripción SMS para marketing de terceros.",
  version: PRIVACY_POLICY_VERSION,
  effectiveDateIso: PRIVACY_EFFECTIVE_DATE_ISO,
  effectiveDateEs: PRIVACY_EFFECTIVE_DATE_ES,
  sections: Object.freeze([
    Object.freeze({
      id: "alcance",
      title: "1. Quiénes somos y alcance",
      paragraphs: Object.freeze([
        "AIT USA Institute es una división de Arrieta Institute LLC. Esta Política de Privacidad se aplica al sitio web, formularios, evaluaciones de ubicación, comunicaciones, inscripciones y demás interacciones que AIT USA Institute administra.",
        "Algunos enlaces pueden llevarte a servicios de terceros. Sus prácticas se rigen por sus propias políticas, pero una política general de un tercero no sustituye las obligaciones de AIT USA Institute sobre la información recopilada en su nombre.",
      ]),
    }),
    Object.freeze({
      id: "informacion",
      title: "2. Información que podemos recopilar",
      paragraphs: Object.freeze([
        "Recopilamos la información que decides proporcionar y datos técnicos limitados necesarios para operar y proteger el sitio.",
      ]),
      bullets: Object.freeze([
        "Datos de contacto, como nombre, correo electrónico, dirección postal, ciudad, idioma preferido y teléfono móvil opcional.",
        "Intereses académicos, modalidad, horario, sede, metas, información de inscripción y comunicaciones con nuestro equipo.",
        "Respuestas y resultados de evaluaciones de ubicación, cuando decides completarlas.",
        "Registros de consentimiento, incluida la fuente, fecha, hora y versión del texto que aceptaste.",
        "Datos técnicos como tipo de navegador, dispositivo, dirección IP, páginas visitadas, página de referencia y datos de cookies o analítica.",
      ]),
    }),
    Object.freeze({
      id: "fuentes",
      title: "3. Cómo obtenemos la información",
      paragraphs: Object.freeze([
        "Podemos obtener información directamente de ti; de un padre, tutor o representante autorizado; de formularios y plataformas que operan en nuestro nombre; y automáticamente mediante tecnologías necesarias, de seguridad o analítica. No debes incluir números de Seguro Social, información médica, datos bancarios ni otra información altamente sensible en campos de texto libre.",
      ]),
    }),
    Object.freeze({
      id: "usos",
      title: "4. Cómo usamos la información",
      bullets: Object.freeze([
        "Responder preguntas y solicitudes y orientar sobre programas, niveles, sedes, horarios y próximos pasos.",
        "Administrar evaluaciones, inscripción, clases, asistencia, apoyo estudiantil y comunicaciones de servicio.",
        "Crear, actualizar o relacionar registros operativos en AIT CRM cuando el flujo correspondiente esté aprobado y habilitado.",
        "Enviar comunicaciones promocionales únicamente cuando exista el consentimiento específico requerido.",
        "Mantener, proteger, analizar y mejorar el sitio, los programas, los registros y la seguridad.",
        "Cumplir obligaciones legales y proteger derechos, seguridad e integridad de AIT USA Institute y de otras personas.",
      ]),
    }),
    Object.freeze({
      id: "base-eleccion",
      title: "5. Elección y consentimiento",
      paragraphs: Object.freeze([
        "Identificamos los campos obligatorios y opcionales. Puedes no proporcionar información opcional. Cuando solicitamos un consentimiento específico, puedes negarte sin perder acceso a servicios que no dependan de ese consentimiento.",
        "El permiso para responder una consulta es distinto del consentimiento para recibir mensajes de texto promocionales. Una casilla general, un número de teléfono existente o el simple envío de un formulario no se interpretan como consentimiento SMS.",
      ]),
    }),
    Object.freeze({
      id: "sms",
      title: "6. Programa de mensajes SMS y datos móviles",
      paragraphs: Object.freeze([
        "Si marcas voluntariamente la casilla específica de mensajes de texto, AIT USA Institute puede enviarte mensajes sobre consultas, inscripción, clases, exámenes de ubicación, horarios, recordatorios, actualizaciones de servicio y promociones. La frecuencia varía. Pueden aplicarse tarifas de mensajes y datos. Responde STOP para cancelar y HELP para obtener ayuda. El consentimiento SMS no es una condición para comprar ni recibir servicios.",
        "No vendemos, alquilamos, compartimos ni transferimos a terceros o afiliados, para sus propios fines de marketing o promoción, los números móviles, los datos de suscripción SMS ni los registros de consentimiento. Podemos revelar esa información únicamente a proveedores que nos ayudan a operar y respaldar el programa de mensajería, y solo en la medida necesaria para prestar esos servicios. Esos proveedores no pueden usarla para su propio marketing.",
        "Los registros históricos que contienen un teléfono no se convierten automáticamente en suscriptores. Solo una elección afirmativa, específica y verificable crea permiso para mensajes promocionales.",
      ]),
    }),
    Object.freeze({
      id: "divulgaciones",
      title: "7. Cuándo podemos divulgar información",
      paragraphs: Object.freeze([
        "Podemos divulgar información a proveedores que trabajan bajo nuestras instrucciones, como alojamiento web, formularios, CRM, comunicaciones, analítica, pagos y soporte tecnológico. También podemos divulgarla cuando la ley lo exija, para responder solicitudes legales válidas, proteger derechos o seguridad, investigar fraude o incidentes, o como parte de una transacción empresarial permitida por ley.",
        "No vendemos información personal. Cualquier transferencia empresarial seguiría sujeta a esta política y a las restricciones específicas aplicables a datos SMS.",
      ]),
    }),
    Object.freeze({
      id: "cookies",
      title: "8. Cookies y analítica",
      paragraphs: Object.freeze([
        "El sitio puede usar cookies y tecnologías similares necesarias para su funcionamiento, seguridad y medición. Puedes limitar cookies desde tu navegador, aunque algunas funciones podrían dejar de operar correctamente. Si incorporamos analítica o publicidad que requiera opciones adicionales, actualizaremos los avisos y controles correspondientes.",
      ]),
    }),
    Object.freeze({
      id: "retencion",
      title: "9. Retención y eliminación",
      paragraphs: Object.freeze([
        "Conservamos información solo durante el tiempo razonablemente necesario para los fines descritos, las operaciones educativas, obligaciones contables o legales, resolución de disputas, seguridad y auditoría. El plazo depende del tipo de registro y de la relación con la persona.",
        "Las solicitudes de eliminación se evalúan conforme a la ley y a obligaciones legítimas de conservación. Los registros mínimos de exclusión pueden conservarse para respetar una solicitud STOP y evitar mensajes futuros no deseados.",
      ]),
    }),
    Object.freeze({
      id: "seguridad",
      title: "10. Seguridad",
      paragraphs: Object.freeze([
        "Usamos medidas administrativas, técnicas y físicas razonables diseñadas para proteger la información. Limitamos el acceso según funciones y proveedores autorizados. Ningún método de transmisión o almacenamiento es completamente seguro, por lo que no podemos garantizar seguridad absoluta.",
      ]),
    }),
    Object.freeze({
      id: "menores",
      title: "11. Menores de edad",
      paragraphs: Object.freeze([
        "Un menor de 13 años puede completar el examen de ubicación y ver el resultado sin registrarse. Antes de esa autorización no solicitamos identidad del menor y sus respuestas permanecen solo en la sesión del navegador.",
        "Guardar el resultado, crear acceso al Portal o usar funciones de práctica requiere una cuenta del padre, madre o tutor, control del email verificado, una declaración de autorización y el aviso de privacidad correspondiente. Solicitamos solo el nombre y la banda de edad necesarios para vincular el perfil infantil; no exigimos la fecha de nacimiento para este flujo.",
        "El permiso para práctica con IA, el contacto con un asesor y los mensajes de texto promocionales son decisiones separadas. El tutor puede revisar, retirar su autorización, desvincular el perfil o solicitar la eliminación conforme a esta política. No buscamos conscientemente consentimiento de marketing directamente de menores.",
      ]),
    }),
    Object.freeze({
      id: "derechos",
      title: "12. Tus opciones y solicitudes",
      bullets: Object.freeze([
        "Mensajes de texto: responde STOP para cancelar y HELP para obtener ayuda.",
        "Correo promocional: usa el enlace de cancelación cuando esté disponible.",
        "Datos: puedes solicitar acceso, corrección o eliminación conforme a la ley aplicable.",
        "Consentimiento: retirar el consentimiento no afecta el tratamiento legítimo realizado antes del retiro.",
      ]),
    }),
    Object.freeze({
      id: "procesamiento",
      title: "13. Procesamiento en Estados Unidos",
      paragraphs: Object.freeze([
        "AIT USA Institute opera en Estados Unidos. Si accedes desde otro país, entiendes que la información puede procesarse en Estados Unidos y en las ubicaciones donde operan nuestros proveedores, sujeta a las protecciones contractuales y legales aplicables.",
      ]),
    }),
    Object.freeze({
      id: "cambios",
      title: "14. Cambios a esta política",
      paragraphs: Object.freeze([
        "Podemos actualizar esta política cuando cambien nuestras prácticas o requisitos. Publicaremos la versión revisada y su fecha de vigencia. Los cambios materiales se aplicarán de forma prospectiva, salvo que la ley permita otra cosa, y solicitaremos nuevo consentimiento cuando sea necesario.",
      ]),
    }),
  ]),
  englishSummary: Object.freeze({
    title: "English SMS privacy summary",
    paragraphs: Object.freeze([
      "AIT USA Institute does not sell, rent, share, or transfer SMS opt-in information, mobile numbers, or consent records to third parties or affiliates for their own marketing or promotional purposes.",
      "We may disclose mobile information only to vendors that help us operate and support our messaging program, and only as necessary to provide those services. Consent to receive text messages is not a condition of purchase or receiving services. Reply STOP to opt out or HELP for help.",
    ]),
  }),
});

export const termsAndConditions = Object.freeze({
  eyebrow: "Reglas claras",
  title: "Términos y Condiciones",
  summary:
    "Estos términos regulan el uso del sitio y explican las reglas del programa de mensajes de AIT USA Institute. Las condiciones específicas de inscripción, pagos, cancelación o reembolso pueden aparecer en documentos separados antes de completar una transacción.",
  version: TERMS_VERSION,
  sections: Object.freeze([
    Object.freeze({
      id: "aceptacion",
      title: "1. Aceptación y entidad responsable",
      paragraphs: Object.freeze([
        "Estos Términos y Condiciones se celebran entre tú y AIT USA Institute, una división de Arrieta Institute LLC. Al usar el sitio aceptas estos términos. Si no estás de acuerdo, no utilices el sitio.",
      ]),
    }),
    Object.freeze({
      id: "sitio",
      title: "2. Información del sitio y servicios educativos",
      paragraphs: Object.freeze([
        "El sitio ofrece información sobre programas, cursos, modalidades, sedes, evaluaciones, inscripción y servicios relacionados. Podemos actualizar contenido, disponibilidad, horarios y requisitos sin previo aviso razonable.",
        "Las recomendaciones de nivel son orientativas hasta que AIT USA Institute confirme la ubicación académica. No garantizamos un resultado educativo, migratorio, laboral, académico o profesional específico.",
      ]),
    }),
    Object.freeze({
      id: "elegibilidad",
      title: "3. Elegibilidad y menores",
      paragraphs: Object.freeze([
        "Debes tener capacidad legal para aceptar estos términos. Cuando un servicio involucra a un menor, el padre, tutor o adulto autorizado es responsable de proporcionar autorizaciones e información correcta y de supervisar el uso correspondiente.",
      ]),
    }),
    Object.freeze({
      id: "informacion-exacta",
      title: "4. Información exacta y seguridad",
      paragraphs: Object.freeze([
        "Aceptas proporcionar información exacta y actual. No debes suplantar a otra persona, enviar información ilícita o altamente sensible en campos no destinados para ella, ni intentar obtener acceso no autorizado a sistemas o registros.",
      ]),
    }),
    Object.freeze({
      id: "inscripcion-pagos",
      title: "5. Inscripción, precios, pagos y reembolsos",
      paragraphs: Object.freeze([
        "Los precios o llamadas a la acción publicados no constituyen por sí solos una inscripción final. Antes de cualquier pago aplicable, AIT USA Institute debe mostrar o proporcionar el importe, concepto, modalidad, calendario y las políticas vigentes de cancelación o reembolso.",
        "Los pagos pueden procesarse mediante proveedores externos sujetos a sus propios términos. No envíes números de tarjeta por formularios generales, mensajes de texto ni campos de comentarios.",
      ]),
    }),
    Object.freeze({
      id: "uso-aceptable",
      title: "6. Uso aceptable",
      bullets: Object.freeze([
        "No interfieras con el funcionamiento o seguridad del sitio.",
        "No introduzcas código malicioso ni intentes eludir controles de acceso.",
        "No uses el sitio para fraude, acoso, contenido ilícito o violación de derechos de terceros.",
        "No extraigas, reproduzcas o comercialices contenido o datos del sitio sin autorización.",
      ]),
    }),
    Object.freeze({
      id: "propiedad",
      title: "7. Propiedad intelectual",
      paragraphs: Object.freeze([
        "El sitio, la marca, textos, gráficos, videos, materiales educativos y demás contenido pertenecen a AIT USA Institute, Arrieta Institute LLC o sus licenciantes y están protegidos por la ley. Se permite el uso personal y no comercial del sitio. Ningún otro derecho se concede sin autorización escrita.",
      ]),
    }),
    Object.freeze({
      id: "terceros",
      title: "8. Enlaces y servicios de terceros",
      paragraphs: Object.freeze([
        "Podemos enlazar formularios, plataformas, mapas, medios sociales, pagos u otros servicios de terceros. No controlamos su disponibilidad, seguridad o contenido. Tu uso puede estar sujeto a sus términos y políticas. Un enlace no implica respaldo de todo el contenido del tercero.",
      ]),
    }),
    Object.freeze({
      id: "sms-programa",
      title: "9. Programa de mensajes de AIT USA Institute",
      bullets: Object.freeze([
        "Nombre del programa y remitente: AIT USA Institute, una división de Arrieta Institute LLC.",
        "Tipos de mensajes: consultas, inscripción, clases, exámenes de ubicación, horarios, recordatorios, actualizaciones de servicio y promociones.",
        "Inscripción: solo mediante una elección afirmativa en la casilla SMS separada. La casilla es opcional y no está marcada previamente.",
        "Frecuencia: varía según tus interacciones, inscripción y actividad del programa.",
        "Cargos: pueden aplicarse tarifas de mensajes y datos según tu plan móvil.",
        "Cancelación: responde STOP para dejar de recibir mensajes. Podemos enviar una confirmación final de exclusión.",
        "Ayuda: responde HELP, llama al +1 732-271-0011 o visita /contactanos.",
        "Consentimiento: no es una condición para comprar ni recibir productos o servicios.",
        "Operadores: los operadores móviles no son responsables por mensajes retrasados o no entregados. La disponibilidad depende del operador y dispositivo.",
        "Privacidad: el tratamiento de información y consentimiento SMS se describe en nuestra Política de Privacidad.",
      ]),
    }),
    Object.freeze({
      id: "renuncia",
      title: "10. Renuncias de garantía",
      paragraphs: Object.freeze([
        "En la medida permitida por ley, el sitio se ofrece “tal cual” y “según disponibilidad”. No garantizamos funcionamiento ininterrumpido, ausencia de errores ni compatibilidad con todos los dispositivos. Nada en estos términos limita garantías o derechos que no puedan excluirse legalmente.",
      ]),
    }),
    Object.freeze({
      id: "responsabilidad",
      title: "11. Limitación de responsabilidad",
      paragraphs: Object.freeze([
        "En la medida permitida por ley, AIT USA Institute y Arrieta Institute LLC no serán responsables por daños indirectos, incidentales, especiales, consecuentes o punitivos derivados del uso o imposibilidad de uso del sitio. Esta limitación no se aplica donde la ley lo prohíba ni excluye responsabilidad que legalmente no pueda excluirse.",
      ]),
    }),
    Object.freeze({
      id: "indemnizacion",
      title: "12. Indemnización",
      paragraphs: Object.freeze([
        "En la medida permitida por ley, aceptas indemnizar a AIT USA Institute y Arrieta Institute LLC frente a reclamaciones derivadas de tu uso ilícito del sitio, información fraudulenta o violación de estos términos o derechos de terceros.",
      ]),
    }),
    Object.freeze({
      id: "ley",
      title: "13. Ley aplicable",
      paragraphs: Object.freeze([
        "Estos términos se rigen por las leyes del Estado de Nueva Jersey, sin considerar reglas sobre conflicto de leyes, salvo que la ley aplicable exija otra cosa. Las partes conservan cualquier derecho a presentar reclamaciones ante organismos o tribunales que la ley no permita limitar.",
      ]),
    }),
    Object.freeze({
      id: "separabilidad",
      title: "14. Separabilidad y acuerdo completo",
      paragraphs: Object.freeze([
        "Si una disposición es inválida, las demás continuarán vigentes y la disposición se interpretará en la máxima medida permitida. Estos términos, junto con la Política de Privacidad y cualquier acuerdo específico presentado durante una inscripción o compra, constituyen el acuerdo aplicable sobre el uso del sitio.",
      ]),
    }),
    Object.freeze({
      id: "cambios",
      title: "15. Cambios a estos términos",
      paragraphs: Object.freeze([
        "Podemos actualizar estos términos. Publicaremos la versión revisada y la fecha de vigencia. El uso posterior a una actualización constituye aceptación en la medida permitida por ley; si un cambio requiere consentimiento adicional, lo solicitaremos por separado.",
      ]),
    }),
  ]),
  englishSummary: Object.freeze({
    title: "English SMS terms summary",
    paragraphs: Object.freeze([
      "By separately opting in, you agree to receive texts from AIT USA Institute about inquiries, enrollment, classes, placement testing, reminders, service updates, and promotions. Message frequency varies. Message and data rates may apply.",
      "Reply STOP to opt out or HELP for help. Consent is not a condition of purchase or receiving services. Mobile carriers are not liable for delayed or undelivered messages.",
    ]),
  }),
});
