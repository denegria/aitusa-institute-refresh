export function hasReviewableQuote(result) {
  return result?.state === "quoted" && result.quote &&
    Array.isArray(result.quote.lines) && result.quote.lines.length > 0 &&
    result.quote.lines.every((line) => line.amount !== null && line.amount !== undefined && String(line.amount).trim() !== "" && Number.isFinite(Number(line.amount)) && typeof line.currency === "string" && line.currency.length === 3) &&
    Number.isFinite(Number(result.quote.total)) && Number(result.quote.total) > 0 &&
    typeof result.quote.currency === "string" && result.quote.currency.length === 3 &&
    result.fulfillment?.deliveryMode;
}

const PREPAYMENT_CODE = "tuition_prepayment_four_week";

function matchingPrepaymentQuote(base, candidate) {
  if (!hasReviewableQuote(candidate) || candidate.quote.currency !== base.quote.currency ||
      candidate.fulfillment.deliveryMode !== base.fulfillment.deliveryMode) return false;
  const prepayment = candidate.quote.lines.filter((line) => line.code === PREPAYMENT_CODE);
  if (prepayment.length !== 1 || Number(prepayment[0].amount) <= 0 || prepayment[0].currency !== base.quote.currency) return false;
  const baseLines = base.quote.lines;
  const candidateLines = candidate.quote.lines.filter((line) => line.code !== PREPAYMENT_CODE);
  return candidateLines.length === baseLines.length && baseLines.every((line, index) =>
    candidateLines[index].code === line.code && candidateLines[index].currency === line.currency &&
    Number(candidateLines[index].amount) === Number(line.amount)) &&
    Math.abs(Number(candidate.quote.total) - Number(base.quote.total) - Number(prepayment[0].amount)) < 0.01;
}

// Both calls only read CRM pricing. A missing optional quote must never block the base enrollment.
export async function loadRegistrationQuoteOptions(requestQuote, selection, existingBase = null) {
  const base = existingBase || await requestQuote({ ...selection, includeTuitionPrepayment: false });
  if (!hasReviewableQuote(base)) return { base, withPrepayment: null, prepaymentLine: null };
  let withPrepayment = null;
  try {
    const candidate = await requestQuote({ ...selection, includeTuitionPrepayment: true });
    if (matchingPrepaymentQuote(base, candidate)) withPrepayment = candidate;
  } catch {
    // The base quote remains usable if optional pricing is unavailable.
  }
  return {
    base,
    withPrepayment,
    prepaymentLine: withPrepayment?.quote.lines.find((line) => line.code === PREPAYMENT_CODE) || null,
  };
}

export function quoteForSelection(options, includeTuitionPrepayment) {
  const result = includeTuitionPrepayment ? options?.withPrepayment : options?.base;
  return hasReviewableQuote(result) ? result : null;
}
