import { getAiStudyBuddyPlan } from "../../../../src/aiStudyBuddy/studyBuddyContract.js";

export const runtime = "nodejs";

export async function GET(request) {
  const url = new URL(request.url);
  const accountKey = url.searchParams.get("accountKey") ?? "studentActive";
  const studentCrmContactRef =
    url.searchParams.get("studentCrmContactRef") ?? "crm_contact_fixture_student_001";
  const useCase = url.searchParams.get("useCase") ?? "lesson_review";

  return Response.json(
    getAiStudyBuddyPlan({
      accountKey,
      studentCrmContactRef,
      useCase,
    }),
  );
}
