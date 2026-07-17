import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import {
  CONTACT_PERMISSION_COPY_ES,
  PRIVACY_POLICY_VERSION,
  SMS_CONSENT_COPY_ES,
  SMS_DISCLOSURE_ES,
  SMS_DISCLOSURE_VERSION,
  TERMS_VERSION,
  privacyPolicy,
  termsAndConditions,
} from "../src/legal/publicLegalContent.js";

function policyText(policy) {
  return JSON.stringify(policy);
}

describe("MIS-327 public legal and SMS compliance", () => {
  it("publishes versioned, brand-specific privacy protections for mobile data", () => {
    const text = policyText(privacyPolicy);

    assert.equal(privacyPolicy.version, PRIVACY_POLICY_VERSION);
    assert.match(text, /AIT USA Institute/);
    assert.match(text, /Arrieta Institute LLC/);
    assert.match(text, /No vendemos, alquilamos, compartimos ni transferimos/);
    assert.match(text, /terceros o afiliados/);
    assert.match(text, /STOP/);
    assert.match(text, /HELP/);
    assert.match(text, /English SMS privacy summary/);
  });

  it("publishes complete, versioned SMS terms", () => {
    const text = policyText(termsAndConditions);

    assert.equal(termsAndConditions.version, TERMS_VERSION);
    assert.match(text, /Tipos de mensajes/);
    assert.match(text, /Frecuencia/);
    assert.match(text, /tarifas de mensajes y datos/);
    assert.match(text, /no es una condición/);
    assert.match(text, /operadores móviles no son responsables/i);
    assert.match(text, /English SMS terms summary/);
  });

  it("keeps general response permission separate from optional SMS consent", () => {
    assert.notEqual(CONTACT_PERMISSION_COPY_ES, SMS_CONSENT_COPY_ES);
    assert.match(CONTACT_PERMISSION_COPY_ES, /no incluye mensajes de texto promocionales/i);
    assert.match(SMS_DISCLOSURE_ES, /consultas, inscripción, clases/);
    assert.match(SMS_DISCLOSURE_ES, /STOP/);
    assert.match(SMS_DISCLOSURE_ES, /HELP/);
    assert.match(SMS_DISCLOSURE_VERSION, /^aitusa-sms-consent-/);
  });

  it("renders the canonical form with optional phone and an unchecked SMS checkbox", async () => {
    const source = await readFile("app/_components/ContactForm.jsx", "utf8");

    assert.match(source, /name="phone"/);
    assert.doesNotMatch(source, /name="phone"[\s\S]{0,120}required/);
    assert.match(source, /name="smsConsent"[\s\S]{0,100}type="checkbox"[\s\S]{0,100}value="yes"/);
    assert.doesNotMatch(source, /name="smsConsent"[^>]*defaultChecked/);
    assert.match(source, /marketingSmsEvidence/);
    assert.match(source, /smsConsent: marketingSmsOptIn/);
    assert.match(source, /disclosureVersion: SMS_DISCLOSURE_VERSION/);
    assert.match(source, /sourcePath: "\/contactanos"/);
    assert.match(source, /consentedAt: submittedAt/);
    assert.match(source, /href="\/privacy-policy"/);
    assert.match(source, /href="\/terms-and-conditions"/);
  });

  it("marks the placement phone as optional and not an SMS opt-in source", async () => {
    const content = await readFile("src/content.js", "utf8");
    const model = await readFile("src/placement/placementTestModel.js", "utf8");

    assert.match(content, /WhatsApp o teléfono \(opcional\)/);
    assert.match(content, /no crea consentimiento para SMS promocional/);
    assert.match(model, /marketingSmsOptIn: false/);
    assert.match(model, /not_collected_on_placement_test/);
  });
});
