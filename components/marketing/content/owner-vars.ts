import { BRAND } from "@/lib/constants";
import { isFilled } from "@/lib/hebrew/text";

/**
 * Owner variables used inside long-form content (Part 02 §10.1). Content files keep the
 * `{{NAME}}` tokens verbatim; this map resolves them from `BRAND` at render time.
 * A value that is still `{{…}}` (or missing) resolves to null.
 */
const VALUES: Record<string, string | undefined> = {
  BRAND_NAME: BRAND.nameHe,
  BRAND_NAME_EN: BRAND.nameEn,
  DOMAIN: BRAND.domain,
  LEGAL_ENTITY_NAME: BRAND.legal.entityName,
  COMPANY_ID: BRAND.legal.companyId,
  LEGAL_ADDRESS: BRAND.legal.address,
  LEGAL_EFFECTIVE_DATE: BRAND.legal.effectiveDate,
  JURISDICTION_CITY: BRAND.legal.jurisdictionCity,
  DPO_NAME: BRAND.legal.dpoName,
  SUPPORT_PHONE: BRAND.phone,
  WHATSAPP_NUMBER: BRAND.whatsapp,
  A11Y_COORDINATOR_TITLE: BRAND.a11y.coordinatorTitle,
  A11Y_COORDINATOR_NAME: BRAND.a11y.coordinatorName,
  A11Y_COORDINATOR_PHONE: BRAND.a11y.coordinatorPhone,
  A11Y_COORDINATOR_EMAIL: BRAND.a11y.coordinatorEmail,
  A11Y_STATEMENT_DATE: BRAND.a11y.statementDate,
  // Not in BRAND yet (requested from the lead): always pending until added.
  A11Y_AUDIT_DATE: undefined,
  A11Y_AUDITOR: undefined,
};

/** Variables whose values are LTR tokens (phones, ids, domains) and get a bidi-isolate. */
export const LTR_VARS = new Set(["DOMAIN", "COMPANY_ID", "SUPPORT_PHONE", "WHATSAPP_NUMBER", "A11Y_COORDINATOR_PHONE", "A11Y_COORDINATOR_EMAIL", "BRAND_NAME_EN"]);

export function resolveOwnerVar(name: string): string | null {
  if (!(name in VALUES)) throw new Error(`Unknown content variable {{${name}}}`);
  const v = VALUES[name];
  return isFilled(v) ? v : null;
}

/** Marker text for values the owner has not filled yet — legal pages only. */
export const PENDING_MARKER_HE = "[יושלם לפני ההשקה]";
