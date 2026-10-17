import { isFilled, withPrefix } from "@/lib/hebrew/text";

/**
 * The only place in code where owner variables live (Part 00, Part 02 §1.2).
 * Brand defaults were applied because the variables were not filled (see DECISIONS.md).
 * Unfilled legal/contact values stay as {{…}} and are hidden by `isFilled()` until the owner fills them.
 */
const NAME_HE = "קדימון";

export const BRAND = {
  nameHe: NAME_HE,
  nameHeWith: {
    b: withPrefix("ב", NAME_HE),
    l: withPrefix("ל", NAME_HE),
    m: withPrefix("מ", NAME_HE),
    sh: withPrefix("ש", NAME_HE),
    h: withPrefix("ה", NAME_HE),
    v: withPrefix("ו", NAME_HE),
  },
  watermarkHe: `נוצר ${withPrefix("ב", NAME_HE)}`,
  nameEn: "Kdimon",
  domain: "kdimon.co.il",
  taglineHe: "סרטוני תדמית ורילס בעברית, לפי נישה.",
  emails: {
    hello: "hello@kdimon.co.il",
    support: "support@kdimon.co.il",
    privacy: "privacy@kdimon.co.il",
    accessibility: "accessibility@kdimon.co.il",
    abuse: "abuse@kdimon.co.il",
    billing: "billing@kdimon.co.il",
  },
  whatsapp: "{{WHATSAPP_NUMBER}}",
  phone: "{{SUPPORT_PHONE}}",
  social: { instagram: "", tiktok: "", youtube: "", facebook: "", linkedin: "" },
  legal: {
    entityName: "{{LEGAL_ENTITY_NAME}}",
    companyId: "{{COMPANY_ID}}",
    address: "{{LEGAL_ADDRESS}}",
    effectiveDate: "{{LEGAL_EFFECTIVE_DATE}}",
    jurisdictionCity: "{{JURISDICTION_CITY}}",
    dpoName: "{{DPO_NAME}}",
  },
  a11y: {
    coordinatorName: "{{A11Y_COORDINATOR_NAME}}",
    coordinatorTitle: "{{A11Y_COORDINATOR_TITLE}}",
    coordinatorPhone: "{{A11Y_COORDINATOR_PHONE}}",
    coordinatorEmail: "accessibility@kdimon.co.il",
    statementDate: "{{A11Y_STATEMENT_DATE}}",
  },
} as const;

export const WHATSAPP_PREFILL_HE = `היי, יש לי שאלה על ${NAME_HE}`;

/** Returns null when the WhatsApp number was not filled yet — callers must hide the button. */
export function whatsappHref(text: string = WHATSAPP_PREFILL_HE): string | null {
  if (!isFilled(BRAND.whatsapp)) return null;
  return `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(text)}`;
}

export const SIGNUP_HREF = "/login?next=/app/create";
