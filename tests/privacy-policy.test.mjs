import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  PRIVACY_DATA_CATEGORY_NAMES,
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
      "ai_practice_summary",
      "ai_audio_raw",
      "ai_transcript_raw",
      "payment_ledger_summary",
      "payment_sensitive_payload",
    ]) {
      assert.equal(PRIVACY_DATA_CATEGORY_NAMES.includes(category), true);
    }
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

  it("requires guardian approval for minor AI practice summaries", () => {
    const blocked = evaluatePrivacyGate({
      category: "ai_practice_summary",
      actor: { ageGroup: "minor" },
      consent: { basis: "explicit" },
    });
    const allowed = evaluatePrivacyGate({
      category: "ai_practice_summary",
      actor: { ageGroup: "minor" },
      consent: { basis: "explicit", guardianApproval: true },
    });

    assert.equal(blocked.allowed, false);
    assert.equal(blocked.reason, "guardian_consent_required");
    assert.equal(allowed.allowed, true);
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
  });
});
