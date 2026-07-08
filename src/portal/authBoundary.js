import { PORTAL_AUTH_FIXTURES } from "./authFixtures.js";

const ACTIVE_STATUS = "active";
const BLOCKED_STATUSES = new Set(["disabled", "locked"]);
const SENSITIVE_AREAS = new Set([
  "attendance",
  "lesson_progress",
  "payments",
  "ai_practice",
]);

export function resolvePortalSession(accountKey, fixtures = PORTAL_AUTH_FIXTURES) {
  const account = fixtures.accounts[accountKey];

  if (!account) {
    return {
      state: "unauthenticated",
      reason: "unknown_fixture_identity",
      supportAction: "sign_in",
    };
  }

  if (account.status === "invited") {
    return {
      state: "invite_pending",
      reason: "invite_not_claimed",
      supportAction: "claim_invite",
      account: safeAccount(account),
    };
  }

  if (BLOCKED_STATUSES.has(account.status)) {
    return {
      state: "blocked",
      reason: `account_${account.status}`,
      supportAction: "contact_support",
      account: safeAccount(account),
    };
  }

  if (account.status !== ACTIVE_STATUS) {
    return {
      state: "blocked",
      reason: "unsupported_account_status",
      supportAction: "contact_support",
      account: safeAccount(account),
    };
  }

  if (!account.verifiedCrmLink || !account.crmContactRef) {
    return {
      state: "blocked",
      reason: "crm_link_required",
      supportAction: "contact_support",
      account: safeAccount(account),
    };
  }

  return {
    state: "authenticated",
    account: safeAccount(account),
    crm: {
      contactRef: account.crmContactRef,
      linkStatus: "verified",
    },
    privacy: {
      gateSatisfied: Boolean(account.privacyGateSatisfied),
    },
  };
}

export function canAccessArea(session, area) {
  if (session.state !== "authenticated") {
    return denied(session.reason ?? "not_authenticated");
  }

  if (SENSITIVE_AREAS.has(area) && !session.privacy.gateSatisfied) {
    return denied("privacy_gate_required");
  }

  if (area === "admin_accounts") {
    return hasRole(session, "admin")
      ? allowed()
      : denied("admin_role_required");
  }

  if (area === "teacher_classes") {
    return hasRole(session, "teacher")
      ? allowed()
      : denied("teacher_role_required");
  }

  if (area === "payments" || area === "ai_practice") {
    return denied("feature_not_approved");
  }

  return allowed();
}

export function canViewStudentReference(
  session,
  studentCrmContactRef,
  fixtures = PORTAL_AUTH_FIXTURES,
) {
  if (session.state !== "authenticated") {
    return denied(session.reason ?? "not_authenticated");
  }

  if (hasRole(session, "admin")) {
    return allowed({ visibility: "admin_safe_summary" });
  }

  if (hasRole(session, "student")) {
    return session.crm.contactRef === studentCrmContactRef
      ? allowed({ visibility: "self_safe_summary" })
      : denied("student_scope_mismatch");
  }

  if (hasRole(session, "guardian")) {
    const link = fixtures.guardianLinks.find(
      (candidate) =>
        candidate.guardianPortalAccountId === session.account.portalAccountId &&
        candidate.studentCrmContactRef === studentCrmContactRef &&
        candidate.linkStatus === "verified",
    );

    return link
      ? allowed({ visibility: "guardian_summary", accessLevel: link.accessLevel })
      : denied("guardian_link_required");
  }

  if (hasRole(session, "teacher")) {
    const assignment = fixtures.teacherAssignments.find(
      (candidate) =>
        candidate.teacherPortalAccountId === session.account.portalAccountId &&
        candidate.studentCrmContactRefs.includes(studentCrmContactRef),
    );

    return assignment
      ? allowed({ visibility: "teacher_section_summary" })
      : denied("teacher_assignment_required");
  }

  return denied("unsupported_role");
}

export function getAdminAccountSummary(session, fixtures = PORTAL_AUTH_FIXTURES) {
  if (session.state !== "authenticated") {
    return denied(session.reason ?? "not_authenticated");
  }

  if (!hasRole(session, "admin")) {
    return denied("admin_role_required");
  }

  return allowed({
    accounts: Object.values(fixtures.accounts).map((account) => ({
      portalAccountId: account.portalAccountId,
      status: account.status,
      roles: [...account.roles],
      verifiedCrmLink: Boolean(account.verifiedCrmLink),
      needsSupport: account.status !== ACTIVE_STATUS || !account.verifiedCrmLink,
    })),
  });
}

function safeAccount(account) {
  return {
    portalAccountId: account.portalAccountId,
    status: account.status,
    roles: [...account.roles],
    displayName: account.displayName,
    preferredLanguage: account.preferredLanguage,
    verifiedCrmLink: Boolean(account.verifiedCrmLink),
    mfaRequired: Boolean(account.mfaRequired),
  };
}

function hasRole(session, role) {
  return session.account?.roles?.includes(role) === true;
}

function allowed(extra = {}) {
  return { allowed: true, ...extra };
}

function denied(reason) {
  return { allowed: false, reason };
}
