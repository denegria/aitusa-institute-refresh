import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import {
  CONTACT_PERMISSION_COPY_ES,
  MARKETING_SMS_CONSENT_COPY_ES,
  MARKETING_SMS_DISCLOSURE_ES,
  MARKETING_SMS_DISCLOSURE_VERSION,
  PRIVACY_POLICY_VERSION,
  PRIVACY_EFFECTIVE_DATE_ISO,
  SERVICE_SMS_CONSENT_COPY_ES,
  SERVICE_SMS_DISCLOSURE_ES,
  SERVICE_SMS_DISCLOSURE_VERSION,
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
    assert.equal(privacyPolicy.effectiveDateIso, PRIVACY_EFFECTIVE_DATE_ISO);
    assert.match(text, /AIT USA Institute/);
    assert.match(text, /Arrieta Institute LLC/);
    assert.match(text, /No vendemos, alquilamos, compartimos ni transferimos/);
    assert.match(text, /terceros o afiliados/);
    assert.match(text, /STOP/);
    assert.match(text, /HELP/);
    assert.match(text, /English mobile privacy summary/);
  });

  it("publishes complete, versioned SMS terms", () => {
    const text = policyText(termsAndConditions);

    assert.equal(termsAndConditions.version, TERMS_VERSION);
    assert.match(text, /SMS de servicio/);
    assert.match(text, /SMS promocionales/);
    assert.match(text, /La frecuencia varía/);
    assert.match(text, /tarifas de mensajes y datos/);
    assert.match(text, /no es una condición/);
    assert.match(text, /operadores móviles no son responsables/i);
    assert.match(text, /English SMS terms summary/);
  });

  it("keeps response, service SMS, and marketing SMS permissions separate", () => {
    assert.notEqual(CONTACT_PERMISSION_COPY_ES, SMS_CONSENT_COPY_ES);
    assert.notEqual(SERVICE_SMS_CONSENT_COPY_ES, MARKETING_SMS_CONSENT_COPY_ES);
    assert.match(CONTACT_PERMISSION_COPY_ES, /no incluye SMS promocionales/i);
    assert.match(CONTACT_PERMISSION_COPY_ES, /WhatsApp/i);
    assert.equal(SMS_DISCLOSURE_ES, MARKETING_SMS_DISCLOSURE_ES);
    assert.equal(SMS_DISCLOSURE_VERSION, MARKETING_SMS_DISCLOSURE_VERSION);
    assert.match(MARKETING_SMS_DISCLOSURE_ES, /promocionales recurrentes/i);
    assert.match(MARKETING_SMS_DISCLOSURE_ES, /Hasta 8 mensajes al mes/i);
    assert.match(MARKETING_SMS_DISCLOSURE_ES, /sistemas automatizados/i);
    assert.match(SERVICE_SMS_DISCLOSURE_ES, /examen de ubicación/i);
    assert.match(SERVICE_SMS_DISCLOSURE_ES, /La frecuencia varía/i);
    assert.match(SERVICE_SMS_DISCLOSURE_ES, /STOP/);
    assert.match(SERVICE_SMS_DISCLOSURE_ES, /HELP/);
    assert.match(SERVICE_SMS_DISCLOSURE_VERSION, /^aitusa-sms-consent-service-/);
  });

  it("publishes purpose-specific retention and historical-lead boundaries", () => {
    const text = policyText(privacyPolicy);

    assert.match(text, /cinco años es el plazo general.*no una autorización/s);
    assert.match(text, /Respuestas y muestra escrita.*30 días.*90 días/s);
    assert.match(text, /hasta 5 años después de la última interacción significativa/i);
    assert.match(text, /registros históricos.*no se convierten automáticamente en suscriptores/s);
    assert.match(text, /no enviará un primer mensaje promocional para pedir permiso/i);
    assert.match(text, /publicidad dirigida/i);
  });

  it("publishes the permissive under-13 diagnostic boundary without bundling permissions", () => {
    const text = policyText(privacyPolicy);

    assert.match(text, /menor de 13 años puede completar el examen/);
    assert.match(text, /respuestas permanecen solo en la sesión/);
    assert.match(text, /correo verificado/);
    assert.match(text, /contacto con un asesor.*práctica con IA.*SMS de servicio.*marketing/s);
    assert.match(text, /decisiones separadas/i);
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

  it("keeps the Telnyx replacement manifest gated on both digital opt-in paths", async () => {
    const manifest = await readFile(
      "docs/telnyx-10dlc-replacement-campaign-manifest.md",
      "utf8",
    );

    assert.match(manifest, /do not submit yet/i);
    assert.match(manifest, /LOW_VOLUME/);
    assert.match(manifest, /CUSTOMER_CARE/);
    assert.match(manifest, /MARKETING/);
    assert.match(manifest, /\/contactanos/);
    assert.match(manifest, /MIS-397/);
    assert.match(manifest, /historical students or leads are not/i);
    assert.match(manifest, /STOP/);
    assert.match(manifest, /HELP/);
  });

  it("describes durable advisor follow-up without exposing an internal rollout gate", async () => {
    const source = await readFile("app/(public-site)/contactanos/page.jsx", "utf8");

    assert.match(source, /Guardamos tu solicitud de forma segura/);
    assert.match(source, /asesor pueda darle seguimiento/);
    assert.doesNotMatch(source, /gate de producción|no guardamos esta solicitud/i);
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
