import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import {
  credentialMatches,
  hashCredential,
  readResumeCookie,
  serializeResumeCookie,
} from "../src/diagnostic/credentials.js";
import { DIAGNOSTIC_VERSIONS } from "../src/diagnostic/contract.js";

const component = await readFile(
  new URL("../app/_components/site/PlacementExperience.jsx", import.meta.url),
  "utf8",
);
const content = await readFile(new URL("../src/content.js", import.meta.url), "utf8");
const schema = await readFile(
  new URL("../src/diagnostic/schema.js", import.meta.url),
  "utf8",
);
const migration = await readFile(
  new URL("../drizzle/0000_diagnostic_foundation.sql", import.meta.url),
  "utf8",
);
const crmRoute = await readFile(
  new URL("../app/api/placement-test/route.js", import.meta.url),
  "utf8",
);

describe("MIS-337 diagnostic data and browser contract", () => {
  it("does not ship or calculate the answer key in the browser component", () => {
    assert.doesNotMatch(component, /question\.answer/);
    assert.doesNotMatch(component, /quizAnswers/);
    const placementSection = content.slice(
      content.indexOf("const placementTest ="),
      content.indexOf("export const siteData"),
    );
    assert.doesNotMatch(placementSection, /\{ prompt:[^\n]+, answer:/);
    assert.match(component, /selectedAnswers: answers/);
  });

  it("records every version required to reproduce an approved academic result", () => {
    assert.deepEqual(Object.keys(DIAGNOSTIC_VERSIONS).sort(), [
      "answerKey",
      "levelMap",
      "productContract",
      "questionBank",
      "resultCopy",
      "scoring",
    ]);
    for (const column of [
      "product_contract_version",
      "question_bank_version",
      "answer_key_version",
      "level_map_version",
      "scoring_contract_version",
      "result_copy_version",
    ]) {
      assert.match(schema, new RegExp(column));
    }
    assert.match(DIAGNOSTIC_VERSIONS.answerKey, /approved-2026-08-01/);
    assert.equal(DIAGNOSTIC_VERSIONS.scoring, "consecutive-block-mastery-v1");
  });

  it("separates raw answers and context from immutable result summaries", () => {
    assert.match(schema, /diagnostic_answers/);
    assert.match(schema, /diagnostic_contexts/);
    assert.match(schema, /diagnostic_results/);
    assert.match(schema, /response_payload/);
    assert.doesNotMatch(crmRoute, /selectedAnswers/);
  });

  it("ships a self-contained portal migration with cascade cleanup and no CRM tables", () => {
    assert.equal((migration.match(/CREATE TABLE/g) || []).length, 6);
    assert.match(migration, /diagnostic_attempts_request_id_uidx/);
    assert.match(migration, /diagnostic_results_attempt_id_uidx/);
    assert.match(migration, /result_claims_token_hash_uidx/);
    assert.equal((migration.match(/ON DELETE cascade/g) || []).length, 5);
    assert.doesNotMatch(migration, /\bcrm_/i);
  });

  it("uses an HttpOnly bounded resume cookie and hash-only verification", () => {
    const credential = "resume-credential-fixture";
    const serialized = serializeResumeCookie({
      attemptId: "00000000-0000-4000-8000-000000000001",
      credential,
      expiresAt: "2026-08-06T19:00:00.000Z",
      secure: true,
    });
    assert.match(serialized, /HttpOnly/);
    assert.match(serialized, /SameSite=Lax/);
    assert.match(serialized, /Secure/);

    const request = new Request("https://example.com", {
      headers: { cookie: serialized.split(";")[0] },
    });
    const parsed = readResumeCookie(request);
    assert.equal(parsed.credential, credential);
    assert.equal(credentialMatches(credential, hashCredential(credential)), true);
    assert.equal(credentialMatches("wrong", hashCredential(credential)), false);
  });
});
