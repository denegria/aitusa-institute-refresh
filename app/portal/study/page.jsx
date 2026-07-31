import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isPortalPrototypeAvailable } from "../../../src/portal/portalAvailability.js";
import { createPortalAccessViewModel } from "../../../src/portal/portalViewModel.js";
import { resolveAuthenticatedPortalSnapshot } from "../../../src/portalAuth/sessionResolver.server.js";
import { getStudyBuddyRuntime } from "../../../src/aiStudyBuddy/runtime.server.js";
import { safePracticeResult } from "../../../src/aiStudyBuddy/studyBuddyContract.js";
import { createPracticeExperienceModel } from "../../../src/aiStudyBuddy/practiceExperience.js";
import { PortalAccessState } from "../PortalDashboard.jsx";
import { StudyBuddyExperience } from "./StudyBuddyExperience.jsx";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Study Buddy | AIT USA Institute",
  robots: { index: false, follow: false },
};

export default async function StudyBuddyPage() {
  if (!isPortalPrototypeAvailable()) notFound();

  try {
    const snapshot = await resolveAuthenticatedPortalSnapshot(await portalRequest());
    const runtime = getStudyBuddyRuntime();
    const eligibility = runtime.service
      ? await runtime.service.eligibility(snapshot)
      : safePracticeResult("provider_disabled");
    const model = createPracticeExperienceModel({
      result: snapshot.result,
      eligibility,
    });
    return (
      <StudyBuddyExperience
        account={{ firstName: snapshot.account.firstName }}
        model={model}
      />
    );
  } catch (error) {
    return (
      <PortalAccessState
        model={createPortalAccessViewModel(error?.code || "portal_unexpected_error")}
      />
    );
  }
}

async function portalRequest() {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ||
    requestHeaders.get("host") ||
    "localhost";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ||
    (host.startsWith("localhost") ? "http" : "https");
  return new Request(`${protocol}://${host}/portal/study/`, {
    headers: requestHeaders,
  });
}
