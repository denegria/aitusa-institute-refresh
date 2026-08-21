import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import {
  createPlacementQaFixture,
  getPlacementQaFixtureAvailability,
  getPlacementQaFixtureGateResponse,
  isPlacementQaFixturePath,
  normalizePlacementQaChannel,
  normalizePlacementQaState,
} from "../src/diagnostic/qaFixture.js";

const component = await readFile(
  new URL("../app/_components/site/PlacementExperience.jsx", import.meta.url),
  "utf8",
);
const page = await readFile(
  new URL("../app/(public-site)/placement-test/qa/page.jsx", import.meta.url),
  "utf8",
);
const proxySource = await readFile(new URL("../proxy.js", import.meta.url), "utf8");

describe("MIS-400 placement QA fixture", () => {
  it("is available locally and on previews but fails closed on production", async () => {
    assert.deepEqual(getPlacementQaFixtureAvailability({}), {
      available: true,
      reason: "local_development",
    });
    assert.equal(
      getPlacementQaFixtureAvailability({ VERCEL: "1", VERCEL_ENV: "preview" }).available,
      true,
    );
    assert.equal(
      getPlacementQaFixtureAvailability({ VERCEL: "1", VERCEL_ENV: "production" }).available,
      false,
    );
    assert.equal(
      getPlacementQaFixtureAvailability({ VERCEL: "1" }).available,
      false,
    );

    const response = getPlacementQaFixtureGateResponse({
      VERCEL: "1",
      VERCEL_ENV: "production",
    });
    assert.equal(response.status, 404);
    assert.equal(response.headers.get("cache-control"), "private, no-store");
    assert.equal(await response.text(), "Not Found");
  });

  it("normalizes deterministic deep-link states and synthetic channels", () => {
    for (const state of ["contact", "otp", "result", "study"]) {
      assert.equal(normalizePlacementQaState(state), state);
    }
    for (const channel of ["email", "sms", "whatsapp", "phone"]) {
      assert.equal(normalizePlacementQaChannel(channel), channel);
    }
    assert.equal(normalizePlacementQaState("unknown"), "contact");
    assert.equal(normalizePlacementQaChannel("unknown"), "email");

    const fixture = createPlacementQaFixture({ state: "study", channel: "sms" });
    assert.equal(fixture.state, "study");
    assert.equal(fixture.channel, "sms");
    assert.equal(fixture.result.practiceEligible, true);
    assert.equal(fixture.receipt.crmQueued, false);
    assert.equal(fixture.email.endsWith(".test"), true);
  });

  it("gates the complete fixture route at the request and page boundaries", () => {
    assert.equal(isPlacementQaFixturePath("/placement-test/qa"), true);
    assert.equal(isPlacementQaFixturePath("/placement-test/qa/"), true);
    assert.equal(isPlacementQaFixturePath("/placement-test"), false);
    assert.match(proxySource, /isPlacementQaFixturePath\(pathname\)/);
    assert.match(proxySource, /getPlacementQaFixtureGateResponse\(\)/);
    assert.match(page, /if \(!isPlacementQaFixtureAvailable\(\)\) notFound\(\)/);
    assert.match(page, /robots: \{ index: false, follow: false \}/);
  });

  it("short-circuits claim actions locally and exposes all post-test states", () => {
    assert.match(component, /export function PlacementQaFixture/);
    assert.match(component, /qaFixture\?\.state === "otp" \? "code" : "details"/);
    assert.match(component, /if \(qaFixture\) \{[\s\S]*setStep\("code"\);[\s\S]*return;/);
    assert.match(component, /if \(qaFixture\) \{[\s\S]*onClaimed\?\.\(qaFixture\.receipt\);[\s\S]*return;/);
    assert.match(component, /qaFixture \? "#qa-portal"/);
    assert.match(component, /qaFixture \? "#qa-advisor"/);
    assert.match(component, /qaFixture \? "#qa-study"/);
  });
});
