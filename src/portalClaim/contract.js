import { createHash } from "node:crypto";
import {
  PRIVACY_POLICY_VERSION,
  TERMS_VERSION,
} from "../legal/publicLegalContent.js";

export const PORTAL_SESSION_COOKIE_NAME = "aitusa_portal_session";
export const PORTAL_AUTH_CHALLENGE_MINUTES = 10;
export const PORTAL_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
export const PORTAL_CLAIM_SOURCE_PATH = "/placement-test/";
export const PORTAL_ACCOUNT_NOTICE =
  "Al continuar, AIT USA Institute guardará tu resultado y creará una cuenta sin contraseña vinculada a tu email verificado.";
export const ADVISOR_EMAIL_NOTICE =
  "Quiero que un asesor de AIT USA Institute me contacte por email sobre mi resultado y los próximos pasos.";

export const PORTAL_CLAIM_POLICY = Object.freeze({
  privacyPolicyVersion: PRIVACY_POLICY_VERSION,
  termsVersion: TERMS_VERSION,
  accountNoticeHash: disclosureHash(PORTAL_ACCOUNT_NOTICE),
  advisorEmailNoticeHash: disclosureHash(ADVISOR_EMAIL_NOTICE),
});

export function disclosureHash(value) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}
