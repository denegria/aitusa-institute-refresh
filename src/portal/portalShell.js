import { canAccessArea, resolvePortalSession } from "./authBoundary.js";

export const PORTAL_NAV_ITEMS = Object.freeze([
  Object.freeze({ id: "home", label: "Inicio", area: "dashboard" }),
  Object.freeze({ id: "courses", label: "Mis cursos", area: "courses" }),
  Object.freeze({ id: "attendance", label: "Asistencia", area: "attendance" }),
  Object.freeze({ id: "study", label: "Estudiar", area: "lesson_progress" }),
  Object.freeze({ id: "account", label: "Cuenta", area: "account" }),
]);

const FEATURE_CARDS = Object.freeze([
  Object.freeze({
    id: "next-class",
    title: "Proxima clase",
    summary: "Ingles presencial - seccion fixture",
    area: "courses",
    state: "ready",
  }),
  Object.freeze({
    id: "attendance",
    title: "Asistencia",
    summary: "Resumen disponible despues de aprobar privacidad y reglas MIS-272.",
    area: "attendance",
    state: "gated",
  }),
  Object.freeze({
    id: "study",
    title: "Estudiar",
    summary: "Recapitulaciones, videos y tareas de practica con datos fixture.",
    area: "lesson_progress",
    state: "gated",
  }),
  Object.freeze({
    id: "placement",
    title: "Historial de nivel",
    summary: "Resultado o recomendacion pendiente de contrato CRM.",
    area: "placement",
    state: "pending",
  }),
  Object.freeze({
    id: "payments",
    title: "Pagos y recibos",
    summary: "Bloqueado hasta aprobar MIS-278.",
    area: "payments",
    state: "blocked",
  }),
  Object.freeze({
    id: "ai-practice",
    title: "Practica con IA",
    summary: "Bloqueado hasta aprobar MIS-275 y MIS-279.",
    area: "ai_practice",
    state: "blocked",
  }),
]);

const ROLE_LABELS = Object.freeze({
  student: "Estudiante",
  guardian: "Guardian",
  teacher: "Profesor",
  admin: "Admin",
});

export function createPortalShellModel(accountKey = "studentActive") {
  const session = resolvePortalSession(accountKey);

  if (session.state !== "authenticated") {
    return {
      state: session.state,
      reason: session.reason,
      supportAction: session.supportAction,
      account: session.account ?? null,
      navItems: [],
      cards: [
        {
          id: "account-support",
          title: "Necesitamos revisar tu cuenta",
          summary: supportCopy(session.reason),
          state: "blocked",
          action: "Contactar soporte",
        },
      ],
    };
  }

  const roles = session.account.roles;
  const navItems = PORTAL_NAV_ITEMS.map((item) => ({
    ...item,
    access: canAccessArea(session, item.area),
  }));

  const roleCards = [];
  if (roles.includes("guardian")) {
    roleCards.push({
      id: "guardian-summary",
      title: "Estudiante vinculado",
      summary: "Solo resumen autorizado del estudiante enlazado.",
      area: "guardian",
      state: "ready",
    });
  }
  if (roles.includes("teacher")) {
    roleCards.push({
      id: "teacher-classes",
      title: "Clases asignadas",
      summary: "Vista limitada a secciones asignadas.",
      area: "teacher_classes",
      state: "ready",
    });
  }
  if (roles.includes("admin")) {
    roleCards.push({
      id: "admin-review",
      title: "Revision de cuentas",
      summary: "Resumen admin seguro para invitaciones y enlaces CRM.",
      area: "admin_accounts",
      state: "ready",
    });
  }

  return {
    state: "ready",
    account: session.account,
    roleLabel: roles.map((role) => ROLE_LABELS[role] ?? role).join(" / "),
    navItems,
    cards: [...roleCards, ...FEATURE_CARDS].map((card) => ({
      ...card,
      access: canAccessArea(session, card.area),
    })),
    states: [
      "loading",
      "empty",
      "pending",
      "blocked",
      "error",
      "unauthorized",
      "expired_session",
    ],
  };
}

export function renderPortalShell(root, model = createPortalShellModel()) {
  root.replaceChildren();
  root.append(
    portalHeader(model),
    portalLayout(model),
  );
}

function portalHeader(model) {
  const header = element("header", "portal-topbar");
  header.append(
    element("div", "portal-brand", "AIT USA Portal"),
    element("div", "portal-role", model.roleLabel ?? "Cuenta pendiente"),
  );
  return header;
}

function portalLayout(model) {
  const shell = element("main", "portal-shell");
  const nav = element("nav", "portal-nav");

  if (model.navItems.length === 0) {
    nav.append(element("span", "portal-nav__item is-blocked", "Soporte"));
  } else {
    for (const item of model.navItems) {
      const className = item.access.allowed
        ? "portal-nav__item"
        : "portal-nav__item is-blocked";
      nav.append(element("span", className, item.label));
    }
  }

  const content = element("section", "portal-content");
  const title = model.state === "ready"
    ? `Hola, ${model.account.displayName}`
    : "Cuenta en revision";
  content.append(
    element("p", "portal-kicker", "Prototype fixture"),
    element("h1", "portal-title", title),
    cardGrid(model.cards),
  );

  shell.append(nav, content);
  return shell;
}

function cardGrid(cards) {
  const grid = element("div", "portal-card-grid");
  for (const card of cards) {
    const state = card.access?.allowed === false ? card.access.reason : card.state;
    const item = element("article", `portal-card portal-card--${state}`);
    item.append(
      element("span", "portal-card__state", stateLabel(state)),
      element("h2", "portal-card__title", card.title),
      element("p", "portal-card__summary", card.summary),
    );
    grid.append(item);
  }
  return grid;
}

function supportCopy(reason) {
  if (reason === "crm_link_required") {
    return "Tu cuenta necesita un enlace CRM verificado antes de mostrar cursos.";
  }
  if (reason === "invite_not_claimed") {
    return "Tu invitacion todavia no ha sido reclamada.";
  }
  if (reason === "account_disabled" || reason === "account_locked") {
    return "Tu acceso esta pausado. Un asesor puede ayudarte.";
  }
  return "No pudimos confirmar acceso al portal con este fixture.";
}

function stateLabel(state) {
  const labels = {
    ready: "Listo",
    gated: "Con regla",
    pending: "Pendiente",
    blocked: "Bloqueado",
    privacy_gate_required: "Privacidad",
    feature_not_approved: "No aprobado",
  };
  return labels[state] ?? state;
}

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

if (typeof document !== "undefined") {
  const root = document.querySelector("#portal-root");
  if (root) {
    renderPortalShell(root, createPortalShellModel(root.dataset.accountKey));
  }
}
