import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { hasReviewableQuote, loadRegistrationQuoteOptions, quoteForSelection } from "../src/registration/quoteOptions.js";

const selection = Object.freeze({ programCode: "english_program", learningModality: "online", residenceCountryCode: "US", includeTuitionPrepayment: false });
function quote(includePrepayment = false) {
  return {
    state: "quoted",
    quote: {
      currency: "USD", total: includePrepayment ? "225.00" : "85.00",
      lines: [
        { code: "registration_book_bundle", label: "Bundle", amount: "85.00", currency: "USD" },
        ...(includePrepayment ? [{ code: "tuition_prepayment_four_week", label: "Tuition", amount: "140.00", currency: "USD" }] : []),
      ],
    },
    fulfillment: { deliveryMode: "shipment" },
  };
}

describe("reviewable registration and optional tuition quotes", () => {
  it("gets actual base and optional prices without changing the learner's selection", async () => {
    const calls = [];
    const options = await loadRegistrationQuoteOptions(async (input) => {
      calls.push(input);
      return quote(input.includeTuitionPrepayment);
    }, selection);
    assert.deepEqual(calls.map((input) => input.includeTuitionPrepayment), [false, true]);
    assert.equal(selection.includeTuitionPrepayment, false);
    assert.equal(options.prepaymentLine.amount, "140.00");
    assert.equal(quoteForSelection(options, false).quote.total, "85.00");
    assert.equal(quoteForSelection(options, true).quote.total, "225.00");
    assert.equal(quoteForSelection(options, false).quote.lines.length, 1);
  });

  it("keeps the base price usable when optional pricing fails", async () => {
    const options = await loadRegistrationQuoteOptions(async (input) => {
      if (input.includeTuitionPrepayment) throw new Error("Pricing temporarily unavailable");
      return quote();
    }, selection);
    assert.equal(quoteForSelection(options, false).quote.total, "85.00");
    assert.equal(options.prepaymentLine, null);
    assert.equal(quoteForSelection(options, true), null);
  });

  it("can look up the optional amount after the learner already reviewed the base quote", async () => {
    const calls = [];
    const base = quote();
    const options = await loadRegistrationQuoteOptions(async (input) => {
      calls.push(input);
      return quote(input.includeTuitionPrepayment);
    }, selection, base);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].includeTuitionPrepayment, true);
    assert.equal(quoteForSelection(options, false), base);
    assert.equal(options.prepaymentLine.amount, "140.00");
  });

  it("does not request optional pricing for an advisor-only route", async () => {
    let calls = 0;
    const options = await loadRegistrationQuoteOptions(async () => {
      calls += 1;
      return { state: "advisor_required" };
    }, selection);
    assert.equal(calls, 1);
    assert.equal(options.base.state, "advisor_required");
    assert.equal(quoteForSelection(options, false), null);
  });

  for (const [name, change] of [
    ["missing tuition price", (result) => { result.quote.lines[1].amount = ""; }],
    ["different base price", (result) => { result.quote.lines[0].amount = "99.00"; }],
    ["incorrect total", (result) => { result.quote.total = "199.00"; }],
    ["different delivery mode", (result) => { result.fulfillment.deliveryMode = "digital"; }],
    ["different currency", (result) => { result.quote.currency = "EUR"; }],
  ]) {
    it(`rejects optional pricing with a ${name}`, async () => {
      const options = await loadRegistrationQuoteOptions(async (input) => {
        const result = quote(input.includeTuitionPrepayment);
        if (input.includeTuitionPrepayment) change(result);
        return result;
      }, selection);
      assert.equal(quoteForSelection(options, true), null);
      assert.equal(options.prepaymentLine, null);
      assert.equal(quoteForSelection(options, false).quote.total, "85.00");
    });
  }

  it("never presents an incomplete quote as ready for review", () => {
    for (const amount of [null, undefined, "", "not-a-price"]) {
      const result = quote();
      result.quote.lines[0].amount = amount;
      assert.equal(Boolean(hasReviewableQuote(result)), false);
    }
    assert.equal(quoteForSelection(null, true), null);
  });
});
