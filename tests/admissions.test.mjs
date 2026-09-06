import assert from "node:assert/strict";
import { test } from "node:test";
import { admissionContext, admissionMessage, admissionOptions, contactCourseHref } from "../src/admissions.js";
import { programs } from "../src/content.js";
import { validateLeadContactInput } from "../src/leads/leadContactModel.js";

test("each public course survives the contact URL and the existing lead contract", () => {
  assert.equal(admissionOptions.length, 8);
  for (const program of programs) {
    const url = new URL(contactCourseHref(program.slug), "https://ait.example");
    const context = admissionContext(url.searchParams.get("curso"));
    assert.equal(url.pathname, "/contactanos/");
    assert.equal(context.slug, program.slug);
    assert.equal(context.title, program.title);
    const question = "Quiero conocer el costo y horario.";
    const message = admissionMessage(context.slug, question);
    assert.ok(message.includes(program.title));
    assert.ok(message.includes(question));
    assert.deepEqual(validateLeadContactInput({
      formType: "contact_form", submissionId: "test-admissions-0001",
      lead: { name: "Test Prospect", email: "test@example.com", interest: context.interest, message },
      consent: { contactPermission: true, marketingSmsOptIn: false, smsConsent: false, marketingSmsEvidence: null },
    }), { ok: true, errors: [] });
  }
  assert.notEqual(admissionMessage("computacion-basica"), admissionMessage("computacion-oficina"));
  assert.equal(admissionContext("espanol-extranjeros").interest, "espanol");
  assert.equal(admissionContext("tutorias-matematicas").interest, "otro");
});

test("untrusted course values cannot create a destination or inject lead context", () => {
  for (const value of [null, undefined, "", ["ged"], {}, "__proto__", "ged&interest=kids", "https://example.com", "../portal/"]) {
    assert.equal(contactCourseHref(value), "/contactanos/");
    assert.deepEqual(admissionContext(value), { slug: "orientacion", title: "Necesito ayuda para elegir", interest: "otro" });
    assert.equal(admissionMessage(value), "Curso de interés: Necesito ayuda para elegir.");
  }
});

test("optional questions stay within the lead contract while preserving exact course identity", () => {
  for (const { slug, title } of admissionOptions) {
    const message = admissionMessage(slug, "x".repeat(1000));
    assert.equal(message.length, 800);
    assert.ok(message.startsWith(`Curso de interés: ${title}.`));
  }
});
