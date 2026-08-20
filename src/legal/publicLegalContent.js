export const LEGAL_EFFECTIVE_DATE_ISO = "2026-08-20";
export const LEGAL_EFFECTIVE_DATE_ES = "20 de agosto de 2026";
export const PRIVACY_EFFECTIVE_DATE_ISO = LEGAL_EFFECTIVE_DATE_ISO;
export const PRIVACY_EFFECTIVE_DATE_ES = LEGAL_EFFECTIVE_DATE_ES;
export const PRIVACY_POLICY_VERSION = "aitusa-privacy-2026-08-20-v3";
export const TERMS_VERSION = "aitusa-terms-2026-08-20-v2";
export const MARKETING_SMS_DISCLOSURE_VERSION =
  "aitusa-sms-consent-marketing-2026-08-20-v2";
export const SERVICE_SMS_DISCLOSURE_VERSION =
  "aitusa-sms-consent-service-2026-08-20-v1";

// Backward-compatible aliases for the existing /contactanos marketing opt-in.
export const SMS_DISCLOSURE_VERSION = MARKETING_SMS_DISCLOSURE_VERSION;

export const PUBLIC_LEGAL_LINKS = Object.freeze({
  privacy: "/privacy-policy",
  terms: "/terms-and-conditions",
  contact: "/contactanos",
});

export const MARKETING_SMS_CONSENT_COPY_ES =
  "Sí, quiero recibir mensajes de texto promocionales recurrentes de AIT USA Institute.";

export const MARKETING_SMS_DISCLOSURE_ES =
  "Al marcar esta casilla, acepto recibir mensajes de texto promocionales recurrentes de AIT USA Institute, incluidos anuncios de programas, fechas de inscripción, eventos y ofertas, mediante sistemas automatizados. Hasta 8 mensajes al mes. Pueden aplicarse tarifas de mensajes y datos. Responde STOP para cancelar y HELP para obtener ayuda. El consentimiento no es una condición para comprar ni recibir servicios. No compartimos información móvil con terceros o afiliados para sus fines promocionales o de marketing.";

export const SERVICE_SMS_CONSENT_COPY_ES =
  "Sí, quiero recibir por SMS confirmaciones y actualizaciones de servicio de AIT USA Institute.";

export const SERVICE_SMS_DISCLOSURE_ES =
  "Al marcar esta casilla, acepto recibir mensajes de servicio de AIT USA Institute sobre mi examen de ubicación, nivel confirmado, inscripción, clases, citas y recordatorios, incluidos mensajes enviados mediante sistemas automatizados. La frecuencia varía según mi actividad. Pueden aplicarse tarifas de mensajes y datos. Responde STOP para cancelar y HELP para obtener ayuda. El consentimiento no es una condición para comprar ni recibir servicios. No compartimos información móvil con terceros o afiliados para sus fines promocionales o de marketing.";

export const SMS_CONSENT_COPY_ES = MARKETING_SMS_CONSENT_COPY_ES;
export const SMS_DISCLOSURE_ES = MARKETING_SMS_DISCLOSURE_ES;

export const CONTACT_PERMISSION_COPY_ES =
  "Autorizo a AIT USA Institute a responder esta solicitud por teléfono, correo electrónico o una conversación individual por WhatsApp. Esta autorización no incluye SMS promocionales ni mensajes automatizados o promocionales de WhatsApp.";

export const privacyPolicy = Object.freeze({
  eyebrow: "Privacidad y confianza",
  title: "Política de Privacidad",
  summary:
    "Esta política explica qué información recopila AIT USA Institute, cómo la usa, cuánto tiempo la conserva y qué opciones tienes. No vendemos información personal ni compartimos datos de suscripción SMS para marketing de terceros.",
  version: PRIVACY_POLICY_VERSION,
  effectiveDateIso: PRIVACY_EFFECTIVE_DATE_ISO,
  effectiveDateEs: PRIVACY_EFFECTIVE_DATE_ES,
  sections: Object.freeze([
    Object.freeze({
      id: "alcance",
      title: "1. Quiénes somos y alcance",
      paragraphs: Object.freeze([
        "AIT USA Institute es una división de Arrieta Institute LLC. Esta Política de Privacidad se aplica al sitio web, Portal, formularios, evaluaciones de ubicación, comunicaciones, inscripciones, clases y demás interacciones que AIT USA Institute administra.",
        "Algunos enlaces pueden llevarte a servicios de terceros. Sus prácticas se rigen por sus propias políticas, pero una política general de un tercero no sustituye las obligaciones de AIT USA Institute sobre información recopilada en su nombre.",
      ]),
    }),
    Object.freeze({
      id: "informacion",
      title: "2. Información que podemos recopilar",
      paragraphs: Object.freeze([
        "Recopilamos la información que decides proporcionar y datos técnicos limitados necesarios para operar, medir y proteger nuestros servicios.",
      ]),
      bullets: Object.freeze([
        "Datos de contacto, como nombre, correo electrónico, dirección postal, ciudad, idioma preferido y teléfono móvil opcional.",
        "Intereses académicos, modalidad, horario, sede, metas, información de inscripción, asistencia y comunicaciones con nuestro equipo.",
        "Respuestas, muestra escrita, nivel recomendado, nivel confirmado, decisiones de revisión y datos necesarios para administrar una evaluación de ubicación.",
        "Preferencias de canal, verificación o corrección de un número móvil, historial de entrega, fallas y solicitudes de exclusión.",
        "Registros de consentimiento, incluida la finalidad, decisión, fuente, fecha, hora, versión del aviso y evidencia técnica razonable.",
        "Datos técnicos como tipo de navegador, dispositivo, dirección IP, páginas visitadas, página de referencia y datos de cookies o analítica.",
      ]),
    }),
    Object.freeze({
      id: "fuentes",
      title: "3. Cómo obtenemos la información",
      paragraphs: Object.freeze([
        "Podemos obtener información directamente de ti; de un padre, tutor o representante autorizado; de empleados autorizados durante una revisión académica; de formularios y plataformas que operan en nuestro nombre; y automáticamente mediante tecnologías necesarias, de seguridad o analítica. No debes incluir números de Seguro Social, información médica, datos bancarios ni otra información altamente sensible en campos de texto libre.",
      ]),
    }),
    Object.freeze({
      id: "usos",
      title: "4. Cómo usamos la información",
      bullets: Object.freeze([
        "Responder preguntas y solicitudes y orientar sobre programas, niveles, sedes, horarios y próximos pasos.",
        "Administrar evaluaciones, revisión humana, confirmación de nivel, inscripción, clases, asistencia y apoyo estudiantil.",
        "Crear, actualizar o relacionar registros operativos, tareas y auditorías en AIT CRM y en el Portal de AIT USA.",
        "Enviar comunicaciones de servicio por los canales autorizados y comunicaciones promocionales únicamente cuando exista el consentimiento específico requerido.",
        "Mantener, proteger, analizar y mejorar el sitio, los programas, los registros y la seguridad.",
        "Cumplir obligaciones legales y proteger derechos, seguridad e integridad de AIT USA Institute y de otras personas.",
      ]),
    }),
    Object.freeze({
      id: "base-eleccion",
      title: "5. Elección, consentimiento y canales",
      paragraphs: Object.freeze([
        "Identificamos los campos obligatorios y opcionales. Puedes no proporcionar información opcional. Cuando solicitamos un consentimiento específico, puedes negarte sin perder acceso a servicios que no dependan de ese consentimiento; el correo electrónico y el Portal pueden seguir disponibles como respaldo.",
        "El contacto de un asesor, los mensajes SMS de servicio, los SMS promocionales, las llamadas y cualquier futuro mensaje automatizado o promocional de WhatsApp son permisos separados y desactivados por defecto. Una casilla general, un número existente, una conversación iniciada por ti, el envío de un formulario o la aceptación de Términos no crean permiso para otro canal o finalidad.",
        "Podemos pedir una verificación razonable de que controlas el número móvil y ofrecer corrección cuando exista un número equivocado. Retirar un permiso detiene el uso futuro de ese canal o finalidad, sujeto al tiempo razonable necesario para procesar la solicitud.",
      ]),
    }),
    Object.freeze({
      id: "sms",
      title: "6. Programas SMS y datos móviles",
      paragraphs: Object.freeze([
        "AIT USA Institute mantiene permisos separados para (a) mensajes de servicio, como confirmaciones de examen de ubicación, nivel, inscripción, clases, citas y recordatorios, y (b) mensajes promocionales, como anuncios de programas, eventos, fechas de inscripción y ofertas. El registro del proveedor puede agrupar categorías técnicas, pero cada destinatario solo es elegible para las finalidades que aceptó expresamente.",
        "Los mensajes de servicio tienen frecuencia variable según tu actividad. Los mensajes promocionales pueden enviarse hasta 8 veces al mes. Pueden aplicarse tarifas de mensajes y datos. Responde STOP para cancelar todos los SMS al número y HELP para obtener ayuda. El consentimiento SMS no es una condición para comprar ni recibir servicios.",
        "No vendemos, alquilamos, compartimos ni transferimos a terceros o afiliados, para sus propios fines promocionales o de marketing, los números móviles, los datos de suscripción SMS ni los registros de consentimiento. Podemos revelarlos únicamente a proveedores que operan el programa bajo nuestras instrucciones y no pueden usarlos para su propio marketing.",
        "Los registros históricos de estudiantes o interesados que contienen un teléfono no se convierten automáticamente en suscriptores. AIT USA Institute no enviará un primer mensaje promocional para pedir permiso: se requiere una elección afirmativa, específica y verificable antes del envío.",
      ]),
    }),
    Object.freeze({
      id: "otros-canales",
      title: "7. Correo electrónico, llamadas y WhatsApp",
      paragraphs: Object.freeze([
        "Podemos enviar correos operativos relacionados con una solicitud, cuenta, resultado o servicio. Los correos cuyo propósito principal sea comercial incluirán la identificación y el mecanismo de cancelación exigidos por la ley.",
        "Una autorización para responder una solicitud permite el seguimiento individual descrito en el formulario, pero no autoriza automáticamente campañas de llamadas, SMS o WhatsApp. Los enlaces actuales de WhatsApp permiten que tú inicies la conversación; cualquier futuro programa automatizado o promocional de WhatsApp requerirá su propio aviso, permiso y mecanismo de exclusión antes de activarse.",
      ]),
    }),
    Object.freeze({
      id: "divulgaciones",
      title: "8. Cuándo podemos divulgar información",
      paragraphs: Object.freeze([
        "Podemos divulgar información a proveedores que trabajan bajo nuestras instrucciones, como alojamiento web, formularios, CRM, comunicaciones, analítica, pagos y soporte tecnológico. También podemos divulgarla cuando la ley lo exija, para responder solicitudes legales válidas, proteger derechos o seguridad, investigar fraude o incidentes, o como parte de una transacción empresarial permitida por ley.",
        "No vendemos información personal. Cualquier transferencia empresarial seguiría sujeta a esta política y a las restricciones específicas aplicables a datos móviles y consentimiento.",
      ]),
    }),
    Object.freeze({
      id: "cookies",
      title: "9. Cookies, analítica y publicidad futura",
      paragraphs: Object.freeze([
        "El sitio puede usar cookies y tecnologías similares necesarias para su funcionamiento, seguridad y medición. Puedes limitar cookies desde tu navegador, aunque algunas funciones podrían dejar de operar correctamente.",
        "AIT USA Institute no tratará el interés previo, una cuenta o una aceptación general como consentimiento para publicidad dirigida. Antes de activar retargeting o tecnologías publicitarias que requieran aviso, consentimiento u opción de exclusión, actualizaremos los controles y esta política. Cuando corresponda, podrás excluirte de la publicidad dirigida y del tratamiento regulado por la ley aplicable.",
      ]),
    }),
    Object.freeze({
      id: "retencion",
      title: "10. Retención y eliminación",
      paragraphs: Object.freeze([
        "Aplicamos plazos por categoría; cinco años es el plazo general para decisiones de ubicación y relaciones operativas, no una autorización para conservar todos los datos durante cinco años.",
      ]),
      bullets: Object.freeze([
        "Intentos anónimos sin reclamar para personas de 13 años o más: hasta 7 días. Intentos de menores de 13 antes de autorización: solo durante la sesión del navegador.",
        "Respuestas y muestra escrita reclamadas: hasta 30 días después de la revisión final; si la revisión no concluye, hasta 90 días después de reclamar el resultado.",
        "Nivel recomendado, nivel confirmado, identidad del revisor, fundamento de la decisión y auditoría asociada: hasta 5 años después de la última actividad educativa o de cuenta.",
        "Registros de contactos, oportunidades y comunicaciones en CRM: hasta 5 años después de la última interacción significativa, salvo que una relación activa o una obligación legal justifique más tiempo.",
        "Perfil del Portal: durante la cuenta y hasta 2 años después de su cierre. Asistencia, pagos y registros académicos o contables: hasta 7 años cuando sean necesarios para la operación o la ley.",
        "Evidencia de consentimiento y elegibilidad: hasta 5 años después del último mensaje, retiro o vencimiento. Podemos conservar un registro mínimo de supresión durante más tiempo para respetar STOP, números equivocados y solicitudes de no contacto.",
        "Metadatos de entrega de comunicaciones: hasta 2 años. Registros de seguridad y acceso: normalmente hasta 12 meses. Resúmenes de práctica permitidos: hasta 1 año; audio y transcripciones sin procesar de práctica con IA no se almacenan.",
      ]),
    }),
    Object.freeze({
      id: "eliminacion-excepciones",
      title: "11. Solicitudes, eliminación y excepciones",
      paragraphs: Object.freeze([
        "Puedes solicitar acceso, corrección o eliminación conforme a la ley aplicable. Podemos conservar información limitada cuando sea necesaria para cumplir la ley, llevar registros contables o académicos, resolver disputas, aplicar acuerdos, investigar fraude, mantener seguridad o cumplir una retención legal. Cuando sea viable, eliminaremos o desidentificaremos lo que ya no sea necesario.",
      ]),
    }),
    Object.freeze({
      id: "seguridad",
      title: "12. Seguridad y acceso de empleados",
      paragraphs: Object.freeze([
        "Usamos medidas administrativas, técnicas y físicas razonables diseñadas para proteger la información. Limitamos el acceso de empleados y proveedores según funciones, autenticación y necesidad operativa. Las revisiones de ubicación deben registrar al revisor, la decisión y los cambios; los enlaces internos no incluyen respuestas, correos ni tokens reutilizables. Ningún método de transmisión o almacenamiento es completamente seguro.",
      ]),
    }),
    Object.freeze({
      id: "menores",
      title: "13. Menores de edad",
      paragraphs: Object.freeze([
        "Un menor de 13 años puede completar el examen de ubicación y ver su nivel recomendado sin registrarse. Antes de la autorización de un adulto no solicitamos la identidad del menor y sus respuestas permanecen solo en la sesión del navegador.",
        "Guardar el resultado, crear acceso al Portal o usar funciones de práctica requiere una cuenta del padre, madre o tutor, control del correo verificado, una declaración de autorización y el aviso de privacidad correspondiente. Solicitamos solo el nombre y la banda de edad necesarios para vincular el perfil infantil; no exigimos fecha de nacimiento para este flujo.",
        "El contacto con un asesor, la práctica con IA, los SMS de servicio y el marketing son decisiones separadas. Para un estudiante menor de 13 años, cualquier teléfono y consentimiento permitido debe pertenecer al tutor verificado. No buscamos conscientemente consentimiento de marketing directamente de menores.",
      ]),
    }),
    Object.freeze({
      id: "derechos",
      title: "14. Tus opciones y solicitudes",
      bullets: Object.freeze([
        "Mensajes de texto: responde STOP para cancelar y HELP para obtener ayuda.",
        "Correo promocional: usa el enlace de cancelación incluido en el mensaje.",
        "Datos: solicita acceso, corrección, portabilidad o eliminación cuando corresponda.",
        "Publicidad dirigida, venta o ciertos perfiles: puedes solicitar exclusión cuando la actividad y la ley aplicable otorguen ese derecho.",
        "Consentimiento: puedes retirar permisos futuros sin afectar el tratamiento legítimo realizado antes del retiro.",
      ]),
    }),
    Object.freeze({
      id: "procesamiento",
      title: "15. Procesamiento en Estados Unidos",
      paragraphs: Object.freeze([
        "AIT USA Institute opera en Estados Unidos. Si accedes desde otro país, entiendes que la información puede procesarse en Estados Unidos y en las ubicaciones donde operan nuestros proveedores, sujeta a las protecciones contractuales y legales aplicables.",
      ]),
    }),
    Object.freeze({
      id: "cambios",
      title: "16. Cambios a esta política",
      paragraphs: Object.freeze([
        "Podemos actualizar esta política cuando cambien nuestras prácticas o requisitos. Publicaremos la versión revisada y su fecha de vigencia. Los cambios materiales se aplicarán de forma prospectiva, salvo que la ley permita otra cosa, y solicitaremos nuevo consentimiento cuando sea necesario.",
      ]),
    }),
  ]),
  englishSummary: Object.freeze({
    title: "English mobile privacy summary",
    paragraphs: Object.freeze([
      "AIT USA Institute does not sell, rent, share, or transfer SMS opt-in information, mobile numbers, or consent records to third parties or affiliates for their own marketing or promotional purposes.",
      "Service SMS and marketing SMS permissions are separate. Historical students and leads are not automatically opted in. We may disclose mobile information only to vendors that operate our messaging program under our instructions. Reply STOP to opt out or HELP for help.",
    ]),
  }),
});

export const termsAndConditions = Object.freeze({
  eyebrow: "Reglas claras",
  title: "Términos y Condiciones",
  summary:
    "Estos términos regulan el sitio, el Portal, las evaluaciones de ubicación y los programas de comunicaciones de AIT USA Institute. Las condiciones de inscripción, pagos, cancelación o reembolso pueden aparecer en documentos separados antes de una transacción.",
  version: TERMS_VERSION,
  effectiveDateIso: LEGAL_EFFECTIVE_DATE_ISO,
  effectiveDateEs: LEGAL_EFFECTIVE_DATE_ES,
  sections: Object.freeze([
    Object.freeze({
      id: "aceptacion",
      title: "1. Aceptación y entidad responsable",
      paragraphs: Object.freeze([
        "Estos Términos y Condiciones se celebran entre tú y AIT USA Institute, una división de Arrieta Institute LLC. Al usar el sitio aceptas estos términos; si no estás de acuerdo, no lo utilices. Un consentimiento opcional de comunicaciones nunca se obtiene solo por aceptar estos Términos.",
      ]),
    }),
    Object.freeze({
      id: "sitio",
      title: "2. Información del sitio y servicios educativos",
      paragraphs: Object.freeze([
        "El sitio ofrece información sobre programas, cursos, modalidades, sedes, evaluaciones, inscripción y servicios relacionados. Podemos actualizar contenido, disponibilidad, horarios y requisitos sin previo aviso razonable.",
        "El resultado inmediato de una evaluación es un Nivel recomendado y permanece Pendiente de confirmación hasta que un empleado autorizado de AIT USA Institute lo revise. Después puede mostrarse como Nivel confirmado por AIT o Revisión adicional requerida. La evaluación no es un certificado, crédito académico, admisión ni garantía de un resultado educativo, migratorio, laboral o profesional.",
      ]),
    }),
    Object.freeze({
      id: "revision",
      title: "3. Revisión de evaluaciones y Portal",
      paragraphs: Object.freeze([
        "Los empleados autorizados pueden revisar respuestas y muestras escritas en un Portal protegido, confirmar o ajustar el nivel y documentar un fundamento interno. AIT USA Institute puede corregir errores, solicitar información adicional o recomendar una nueva evaluación cuando sea necesario.",
        "La notificación por correo, SMS u otro canal indica que existe una actualización; el Portal y los registros autorizados de AIT USA Institute son la fuente operativa del estado confirmado.",
      ]),
    }),
    Object.freeze({
      id: "elegibilidad",
      title: "4. Elegibilidad y menores",
      paragraphs: Object.freeze([
        "Debes tener capacidad legal para aceptar estos términos. Cuando un servicio involucra a un menor, el padre, tutor o adulto autorizado es responsable de proporcionar autorizaciones e información correcta y de supervisar el uso correspondiente. Las opciones de comunicaciones y práctica no se agrupan con la autorización de la cuenta.",
      ]),
    }),
    Object.freeze({
      id: "informacion-exacta",
      title: "5. Información exacta y seguridad",
      paragraphs: Object.freeze([
        "Aceptas proporcionar información exacta y actual, incluido un teléfono que controlas cuando decides usarlo. No debes suplantar a otra persona, enviar información ilícita o altamente sensible en campos no destinados para ella, ni intentar obtener acceso no autorizado a sistemas o registros.",
      ]),
    }),
    Object.freeze({
      id: "inscripcion-pagos",
      title: "6. Inscripción, precios, pagos y reembolsos",
      paragraphs: Object.freeze([
        "Los precios o llamadas a la acción publicados no constituyen por sí solos una inscripción final. Antes de cualquier pago aplicable, AIT USA Institute debe mostrar o proporcionar el importe, concepto, modalidad, calendario y las políticas vigentes de cancelación o reembolso.",
        "Los pagos pueden procesarse mediante proveedores externos sujetos a sus propios términos. No envíes números de tarjeta por formularios generales, mensajes de texto ni campos de comentarios.",
      ]),
    }),
    Object.freeze({
      id: "uso-aceptable",
      title: "7. Uso aceptable",
      bullets: Object.freeze([
        "No interfieras con el funcionamiento o seguridad del sitio.",
        "No introduzcas código malicioso ni intentes eludir controles de acceso.",
        "No uses el sitio para fraude, acoso, contenido ilícito o violación de derechos de terceros.",
        "No extraigas, reproduzcas o comercialices contenido o datos del sitio sin autorización.",
      ]),
    }),
    Object.freeze({
      id: "propiedad",
      title: "8. Propiedad intelectual",
      paragraphs: Object.freeze([
        "El sitio, la marca, textos, gráficos, videos, materiales educativos y demás contenido pertenecen a AIT USA Institute, Arrieta Institute LLC o sus licenciantes y están protegidos por la ley. Se permite el uso personal y no comercial del sitio. Ningún otro derecho se concede sin autorización escrita.",
      ]),
    }),
    Object.freeze({
      id: "terceros",
      title: "9. Enlaces y servicios de terceros",
      paragraphs: Object.freeze([
        "Podemos enlazar formularios, plataformas, mapas, medios sociales, pagos u otros servicios de terceros. No controlamos su disponibilidad, seguridad o contenido. Tu uso puede estar sujeto a sus términos y políticas. Un enlace no implica respaldo de todo el contenido del tercero.",
      ]),
    }),
    Object.freeze({
      id: "sms-programa",
      title: "10. Programas SMS de AIT USA Institute",
      bullets: Object.freeze([
        "Remitente: AIT USA Institute, una división de Arrieta Institute LLC.",
        "SMS de servicio: confirmaciones de examen de ubicación y nivel, inscripción, clases, citas, horarios, recordatorios y actualizaciones solicitadas. La frecuencia varía según tu actividad.",
        "SMS promocionales: anuncios de programas, fechas de inscripción, eventos y ofertas. Hasta 8 mensajes por mes.",
        "Permisos separados: cada finalidad exige una elección afirmativa, opcional y no marcada previamente. Dar permiso de servicio no autoriza marketing y viceversa.",
        "Tecnología: los mensajes pueden enviarse mediante sistemas automatizados al número proporcionado.",
        "Cargos: pueden aplicarse tarifas de mensajes y datos según tu plan móvil.",
        "Cancelación: responde STOP para dejar de recibir SMS en ese número. Podemos enviar una confirmación final de exclusión. Una nueva suscripción requiere una nueva acción afirmativa.",
        "Ayuda: responde HELP, llama al +1 732-271-0011 o visita /contactanos.",
        "Consentimiento: no es una condición para comprar ni recibir productos o servicios.",
        "Operadores: los operadores móviles no son responsables por mensajes retrasados o no entregados. La disponibilidad depende del operador y dispositivo.",
        "Privacidad: no compartimos información móvil con terceros o afiliados para sus fines promocionales o de marketing. Consulta la Política de Privacidad para más detalles.",
      ]),
    }),
    Object.freeze({
      id: "otros-canales",
      title: "11. Otros canales de comunicación",
      paragraphs: Object.freeze([
        "Las llamadas, los correos promocionales y cualquier futuro programa automatizado o promocional de WhatsApp se rigen por permisos y mecanismos de exclusión separados cuando corresponda. Iniciar una conversación mediante un enlace de WhatsApp no autoriza una campaña futura. Los correos comerciales incluirán la identificación, dirección postal y opción de cancelación exigidas por la ley.",
      ]),
    }),
    Object.freeze({
      id: "renuncia",
      title: "12. Renuncias de garantía",
      paragraphs: Object.freeze([
        "En la medida permitida por ley, el sitio se ofrece “tal cual” y “según disponibilidad”. No garantizamos funcionamiento ininterrumpido, ausencia de errores ni compatibilidad con todos los dispositivos. Nada en estos términos limita garantías o derechos que no puedan excluirse legalmente.",
      ]),
    }),
    Object.freeze({
      id: "responsabilidad",
      title: "13. Limitación de responsabilidad",
      paragraphs: Object.freeze([
        "En la medida permitida por ley, AIT USA Institute y Arrieta Institute LLC no serán responsables por daños indirectos, incidentales, especiales, consecuentes o punitivos derivados del uso o imposibilidad de uso del sitio. Esta limitación no se aplica donde la ley lo prohíba ni excluye responsabilidad que legalmente no pueda excluirse.",
      ]),
    }),
    Object.freeze({
      id: "indemnizacion",
      title: "14. Indemnización",
      paragraphs: Object.freeze([
        "En la medida permitida por ley, aceptas indemnizar a AIT USA Institute y Arrieta Institute LLC frente a reclamaciones derivadas de tu uso ilícito del sitio, información fraudulenta o violación de estos términos o derechos de terceros.",
      ]),
    }),
    Object.freeze({
      id: "ley",
      title: "15. Ley aplicable",
      paragraphs: Object.freeze([
        "Estos términos se rigen por las leyes del Estado de Nueva Jersey, sin considerar reglas sobre conflicto de leyes, salvo que la ley aplicable exija otra cosa. Las partes conservan cualquier derecho a presentar reclamaciones ante organismos o tribunales que la ley no permita limitar.",
      ]),
    }),
    Object.freeze({
      id: "separabilidad",
      title: "16. Separabilidad y acuerdo completo",
      paragraphs: Object.freeze([
        "Si una disposición es inválida, las demás continuarán vigentes y la disposición se interpretará en la máxima medida permitida. Estos términos, junto con la Política de Privacidad y cualquier acuerdo específico presentado durante una inscripción o compra, constituyen el acuerdo aplicable sobre el uso del sitio.",
      ]),
    }),
    Object.freeze({
      id: "cambios",
      title: "17. Cambios a estos términos",
      paragraphs: Object.freeze([
        "Podemos actualizar estos términos. Publicaremos la versión revisada y la fecha de vigencia. Los cambios se aplicarán de forma prospectiva en la medida exigida; si un cambio requiere consentimiento adicional, lo solicitaremos por separado.",
      ]),
    }),
  ]),
  englishSummary: Object.freeze({
    title: "English SMS terms summary",
    paragraphs: Object.freeze([
      "AIT USA Institute offers separate service and marketing SMS programs. Service message frequency varies; marketing frequency is up to 8 messages per month. Messages may be sent using automated technology. Message and data rates may apply.",
      "Each permission is optional, separate, and unchecked by default. Consent is not a condition of purchase or receiving services. Reply STOP to opt out or HELP for help. Mobile carriers are not liable for delayed or undelivered messages.",
    ]),
  }),
});
