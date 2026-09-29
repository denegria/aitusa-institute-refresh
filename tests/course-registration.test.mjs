import assert from "node:assert/strict";
import { test } from "node:test";

import { courseRegistrationAction } from "../src/courseRegistration.js";
import { programs } from "../src/content.js";
import { isPricedRegistrationChoice, registrationSelectionForContext } from "../src/registration/contract.js";

test("every primary course registration CTA opens its advertised priced modality", () => {
  for (const program of programs) {
    const action = courseRegistrationAction(program.slug);
    assert.ok(action, program.slug);
    assert.equal(action.href, `/inscribete/?curso=${program.slug}`);
    const selection = registrationSelectionForContext(program.slug);
    assert.equal(selection.learningModality, action.mode, program.slug);
    assert.equal(isPricedRegistrationChoice(selection.programCode, selection.learningModality, "US", "US"), true, program.slug);
  }
});

test("Spanish online and math in-person CTAs state the modality they can sell", () => {
  assert.equal(courseRegistrationAction("espanol-extranjeros").label, "Inscribirme online");
  assert.equal(courseRegistrationAction("tutorias-matematicas").label, "Inscribirme presencial");
  assert.equal(courseRegistrationAction("unknown"), null);
});
