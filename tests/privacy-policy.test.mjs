import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  GUARDIAN_CONSENT_POLICY,
  GUARDIAN_CONSENT_POLICY_VERSION,
  PRIVACY_DATA_CATEGORY_NAMES,
  evaluateGuardianAccess,
  evaluatePrivacyGate,
  findSensitiveDataField,
  getPrivacyPolicyStatus,
} from "../src/privacy/privacyPolicy.js";

describe("MIS-279 privacy policy gate", () => {
  it("defines the required portal-sensitive data categories", () => {
    for (const category of [
      "portal_profile_summary",
      "attendance_record",
      "lesson_progress_summary",
      "placement_review_record",
      "ai_practice_summary",
      "ai_audio_raw",
      "ai_transcript_raw",
      "payment_ledger_summary",
      "payment_sensitive_payload",
    ]) {
      assert.equal(PRIVACY_DATA_CATEGORY_NAMES.includes(category), true);
    }
  });

  it("retains the placement decision and reviewer audit for five years", () => {
    const result = evaluatePrivacyGate({
      category: "placement_review_record",
      actor: { ageGroup: "adult" },
      consent: { basis: "contract" },
    });

    assert.equal(result.allowed, true);
    assert.equal(result.retentionClass, "student_record_5y");
    assert.equal(result.auditRequired, true);
    assert.equal(result.deletionPolicy, "review_before_delete_academic_record");
  });

  it("allows contract-based attendance records with audit metadata", () => {
    const result = evaluatePrivacyGate({
      category: "attendance_record",
      actor: { ageGroup: "adult" },
      consent: { basis: "contract" },
    });

    assert.equal(result.allowed, true);
    assert.equal(result.retentionClass, "student_record_7y");
    assert.equal(result.auditRequired, true);
  });

  it("blocks raw AI audio storage even with explicit consent", () => {
    const result = evaluatePrivacyGate({
      category: "ai_audio_raw",
      actor: { ageGroup: "adult" },
      consent: { basis: "explicit" },
    });

    assert.equal(result.allowed, false);
    assert.equal(result.reason, "storage_not_approved");
    assert.equal(result.policy.deletionPolicy, "do_not_store");
  });

  it("requires guardian approval only for under-13 AI practice summaries", () => {
    const blocked = evaluatePrivacyGate({
      category: "ai_practice_summary",
      actor: { ageBand: "under_13" },
      consent: { basis: "explicit" },
    });
    const allowed = evaluatePrivacyGate({
      category: "ai_practice_summary",
      actor: { ageBand: "under_13" },
      consent: { basis: "explicit", guardianApproval: true },
    });
    const teenager = evaluatePrivacyGate({
      category: "ai_practice_summary",
      actor: { ageBand: "age_13_plus" },
      consent: { basis: "explicit" },
    });

    assert.equal(blocked.allowed, false);
    assert.equal(blocked.reason, "guardian_consent_required");
    assert.equal(allowed.allowed, true);
    assert.equal(teenager.allowed, true);
  });

  it("allows an under-13 learner to test and view a result without identity", () => {
    for (const action of ["take_diagnostic", "view_result"]) {
      const result = evaluateGuardianAccess({ ageBand: "under_13", action });
      assert.equal(result.allowed, true);
      assert.equal(result.guardianRequired, false);
      assert.equal(result.retention, "session_only");
      assert.equal(result.identityCollectionAllowed, false);
    }
  });

  it("requires a guardian-owned verified consent record before durable child access", () => {
    const blocked = evaluateGuardianAccess({
      ageBand: "under_13",
      action: "create_portal_account",
      consent: { guardianAttested: true },
    });
    const consent = {
      policyVersion: GUARDIAN_CONSENT_POLICY_VERSION,
      status: "verified",
      verificationMethod: GUARDIAN_CONSENT_POLICY.guardianVerificationMethod,
      guardianAttested: true,
    };
    const allowed = evaluateGuardianAccess({
      ageBand: "under_13",
      action: "create_portal_account",
      consent,
    });

    assert.equal(blocked.allowed, false);
    assert.equal(blocked.reason, "verified_guardian_consent_required");
    assert.equal(allowed.allowed, true);
    assert.equal(allowed.guardianRequired, true);
    assert.equal(GUARDIAN_CONSENT_POLICY.guardianOwnsAccount, true);
    assert.deepEqual(GUARDIAN_CONSENT_POLICY.childProfileFieldsAfterConsent, [
      "firstName",
      "ageBand",
    ]);
    assert.equal(GUARDIAN_CONSENT_POLICY.childDateOfBirthRequired, false);
    assert.equal(GUARDIAN_CONSENT_POLICY.directNoticeRequired, true);
    assert.equal(
      GUARDIAN_CONSENT_POLICY.confirmationAndWithdrawalReceiptRequired,
      true,
    );
  });

  it("keeps AI, advisor, and marketing permissions separate and default-off", () => {
    const baseConsent = {
      policyVersion: GUARDIAN_CONSENT_POLICY_VERSION,
      status: "verified",
      verificationMethod: GUARDIAN_CONSENT_POLICY.guardianVerificationMethod,
      guardianAttested: true,
    };

    assert.equal(evaluateGuardianAccess({
      ageBand: "under_13",
      action: "use_study_buddy",
      consent: baseConsent,
    }).reason, "guardian_ai_practice_consent_required");
    assert.equal(evaluateGuardianAccess({
      ageBand: "under_13",
      action: "request_advisor_contact",
      consent: baseConsent,
    }).reason, "guardian_advisor_contact_consent_required");
    assert.equal(evaluateGuardianAccess({
      ageBand: "under_13",
      action: "marketing_sms",
      consent: baseConsent,
    }).reason, "guardian_marketing_sms_consent_required");
    assert.equal(evaluateGuardianAccess({
      ageBand: "under_13",
      action: "use_study_buddy",
      consent: { ...baseConsent, aiPracticeApproved: true },
    }).allowed, true);
  });

  it("detects sensitive nested payload fields", () => {
    const field = findSensitiveDataField({
      practice: {
        topic: "Interview",
        transcript: "raw transcript is blocked",
      },
    });

    assert.equal(field, "transcript");
  });

  it("returns a safe account policy status without provider subjects", () => {
    const status = getPrivacyPolicyStatus("guardianActive");

    assert.equal(status.sessionState, "authenticated");
    assert.equal(status.account.privacyGateSatisfied, true);
    assert.equal("providerSubject" in status.account, false);
    assert.equal(status.categories.length >= 8, true);
    assert.equal(status.guardianPolicy.minimumSelfServiceAge, 13);
    assert.equal(
      status.guardianPolicy.guardianVerificationMethod,
      "verified_email_plus_attestation",
    );
  });
});
