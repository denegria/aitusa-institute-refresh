import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { PortalAccessState, PortalDashboard } from "./PortalDashboard.jsx";
import { isPortalPrototypeAvailable } from "../../src/portal/portalAvailability.js";
import { createAuthenticatedPortalViewModel, createPortalAccessViewModel } from "../../src/portal/portalViewModel.js";
import { resolveAuthenticatedPortalSnapshot } from "../../src/portalAuth/sessionResolver.server.js";
import { getStudyBuddyRuntime } from "../../src/aiStudyBuddy/runtime.server.js";
import { safePracticeResult } from "../../src/aiStudyBuddy/studyBuddyContract.js";
import { toPortalPracticeState } from "../../src/aiStudyBuddy/practiceExperience.js";
import { callPortalPaymentsCrm } from "../../src/portalPayments/crm.server.js";
import { portalPaymentsUnavailable, safePortalPaymentsSnapshot } from "../../src/portalPayments/contract.js";

export const PORTAL_SECTIONS = Object.freeze(["home", "results", "courses", "attendance", "payments", "account"]);

export async function PortalRoute({ section = "home", searchParams }) {
  if (!PORTAL_SECTIONS.includes(section) || !isPortalPrototypeAvailable()) notFound();
  const params = await searchParams;
  try {
    const snapshot = await resolveAuthenticatedPortalSnapshot(await portalRequest(section));
    const studyBuddyRuntime = getStudyBuddyRuntime();
    const [eligibility, payments] = await Promise.all([
      studyBuddyRuntime.service ? studyBuddyRuntime.service.eligibility(snapshot) : safePracticeResult("provider_disabled"),
      section === "payments" ? loadPortalPayments(snapshot.account) : Promise.resolve(portalPaymentsUnavailable()),
    ]);
    const model = createAuthenticatedPortalViewModel({ ...snapshot, payments, practice: toPortalPracticeState(eligibility, snapshot.result) }, { welcome: section === "home" && params?.welcome === "1" && Boolean(snapshot.result) });
    const paymentKind = params?.payment === "failed" ? "declined" : params?.payment;
    const paymentReturn = ["return", "declined", "cancelled"].includes(paymentKind)
      ? { kind: paymentKind, state: typeof params?.state === "string" ? params.state : "" }
      : null;
    return <PortalDashboard model={model} section={section} paymentReturn={paymentReturn} />;
  } catch (error) {
    return <PortalAccessState model={createPortalAccessViewModel(error?.code || "portal_unexpected_error")} />;
  }
}

async function loadPortalPayments(account) {
  try {
    return safePortalPaymentsSnapshot(await callPortalPaymentsCrm("snapshot", account));
  } catch (error) {
    return portalPaymentsUnavailable(error?.code);
  }
}

async function portalRequest(section) {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "localhost";
  const protocol = requestHeaders.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  const path = section === "home" ? "/portal/" : `/portal/${section}/`;
  return new Request(`${protocol}://${host}${path}`, { headers: requestHeaders });
}
