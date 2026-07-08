import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  canAccessArea,
  canViewStudentReference,
  getAdminAccountSummary,
  resolvePortalSession,
} from "../src/portal/authBoundary.js";

describe("MIS-271 portal auth boundary prototype", () => {
  it("resolves a safe student session without exposing provider subject", () => {
    const session = resolvePortalSession("studentActive");

    assert.equal(session.state, "authenticated");
    assert.equal(session.account.portalAccountId, "acct_fixture_student_active");
    assert.equal(session.crm.contactRef, "crm_contact_fixture_student_001");
    assert.equal("providerSubject" in session.account, false);
  });

  it("blocks active accounts that do not have a verified CRM link", () => {
    const session = resolvePortalSession("missingCrmLinkStudent");

    assert.equal(session.state, "blocked");
    assert.equal(session.reason, "crm_link_required");
    assert.equal(session.supportAction, "contact_support");
  });

  it("blocks disabled and locked accounts", () => {
    assert.equal(resolvePortalSession("disabledStudent").reason, "account_disabled");
    assert.equal(resolvePortalSession("lockedStudent").reason, "account_locked");
  });

  it("keeps pending invites out of authenticated session state", () => {
    const session = resolvePortalSession("pendingInviteStudent");

    assert.equal(session.state, "invite_pending");
    assert.equal(session.supportAction, "claim_invite");
  });

  it("limits students to their own safe portal data", () => {
    const session = resolvePortalSession("studentActive");

    assert.equal(
      canViewStudentReference(session, "crm_contact_fixture_student_001").allowed,
      true,
    );
    assert.deepEqual(
      canViewStudentReference(session, "crm_contact_fixture_unrelated_001"),
      { allowed: false, reason: "student_scope_mismatch" },
    );
  });

  it("limits guardians to verified linked student references", () => {
    const session = resolvePortalSession("guardianActive");
    const linked = canViewStudentReference(session, "crm_contact_fixture_minor_001");
    const unrelated = canViewStudentReference(
      session,
      "crm_contact_fixture_unrelated_001",
    );

    assert.equal(linked.allowed, true);
    assert.equal(linked.visibility, "guardian_summary");
    assert.deepEqual(unrelated, { allowed: false, reason: "guardian_link_required" });
  });

  it("limits teachers to assigned section student references", () => {
    const session = resolvePortalSession("teacherActive");

    assert.equal(
      canViewStudentReference(session, "crm_contact_fixture_minor_001").allowed,
      true,
    );
    assert.deepEqual(
      canViewStudentReference(session, "crm_contact_fixture_unrelated_001"),
      { allowed: false, reason: "teacher_assignment_required" },
    );
  });

  it("allows admins to see only admin-safe account summaries", () => {
    const session = resolvePortalSession("adminActive");
    const result = getAdminAccountSummary(session);

    assert.equal(result.allowed, true);
    assert.equal(result.accounts.length > 0, true);
    assert.equal("providerSubject" in result.accounts[0], false);
    assert.equal("crmContactRef" in result.accounts[0], false);
  });

  it("requires admin role for admin account summaries", () => {
    const student = resolvePortalSession("studentActive");

    assert.deepEqual(getAdminAccountSummary(student), {
      allowed: false,
      reason: "admin_role_required",
    });
  });

  it("lets the privacy gate block sensitive areas", () => {
    const session = resolvePortalSession("studentActive");

    assert.deepEqual(canAccessArea(session, "attendance"), {
      allowed: false,
      reason: "privacy_gate_required",
    });
    assert.deepEqual(canAccessArea(session, "courses"), { allowed: true });
  });

  it("keeps unapproved payment and AI areas blocked", () => {
    const session = resolvePortalSession("guardianActive");

    assert.deepEqual(canAccessArea(session, "payments"), {
      allowed: false,
      reason: "feature_not_approved",
    });
    assert.deepEqual(canAccessArea(session, "ai_practice"), {
      allowed: false,
      reason: "feature_not_approved",
    });
  });
});
