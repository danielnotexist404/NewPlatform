/**
 * SAMPLE LEADS (דוגמה) for the leads inbox — spec 07–08 §H, §S.1 (`lead_source`).
 * Names are invented first names + an initial; phone numbers use the 555 fictional range.
 * Replaced by `GET /api/leads` once lead forms are connected (Part 07 §H).
 */
import { MOCK_NOW } from "./campaigns";

export type LeadStatus = "new" | "in_progress" | "closed";
export type LeadSource = "meta_form" | "whatsapp" | "landing_page" | "manual";

export interface Lead {
  id: string;
  fullName: string;
  phoneDisplay: string; // 050-555-0142
  phoneE164: string; // +972505550142
  email?: string;
  city?: string;
  source: LeadSource;
  campaignId?: string;
  campaignName?: string;
  hookKey?: "A" | "B" | "C";
  hookText?: string;
  receivedAt: string;
  minutesAgo: number;
  status: LeadStatus;
  answers: { q: string; a: string }[];
  notes: string;
  isTest?: boolean;
  assignee?: string;
}

export const LEADS_NOW = MOCK_NOW;

const W = { id: "cmp-wedding-leads", name: "תספורת לחתונה: טופס לידים" };

export const leads: Lead[] = [
  { id: "ld-01", fullName: "יואב ל.", phoneDisplay: "050-555-0142", phoneE164: "+972505550142", city: "רמת גן", source: "landing_page", receivedAt: "2026-10-17T10:18:00+03:00", minutesAgo: 12, status: "new", answers: [{ q: "מה מעניין אתכם?", a: "תספורת ועיצוב זקן" }, { q: "מתי נוח לכם?", a: "מחר אחר הצהריים" }], notes: "" },
  { id: "ld-02", fullName: "מיכל ש.", phoneDisplay: "052-555-0187", phoneE164: "+972525550187", email: "michal@example.com", city: "גבעתיים", source: "meta_form", campaignId: W.id, campaignName: W.name, hookKey: "A", hookText: "תספורת לחתונה: מתי לקבוע תור? רמז: לא יום לפני", receivedAt: "2026-10-17T09:51:00+03:00", minutesAgo: 39, status: "new", answers: [{ q: "למי התספורת?", a: "לבן הזוג, לפני החתונה" }, { q: "תאריך האירוע", a: "בעוד חודש בערך" }], notes: "" },
  { id: "ld-03", fullName: "אור ב.", phoneDisplay: "054-555-0119", phoneE164: "+972545550119", source: "whatsapp", campaignId: "cmp-after-holidays", campaignName: "אחרי החגים: תור בלי לחכות", hookKey: "B", hookText: "POV: הספר הקבוע שלכם בחופש, ואתם אצל מישהו חדש", receivedAt: "2026-10-17T08:05:00+03:00", minutesAgo: 145, status: "in_progress", answers: [{ q: "ההודעה הראשונה", a: "היי, יש תור להיום?" }], notes: "קבענו ל-17:30. לשלוח תזכורת שעה לפני.", assignee: "בעל העסק" },
  { id: "ld-04", fullName: "נועה ג.", phoneDisplay: "053-555-0163", phoneE164: "+972535550163", email: "noa.g@example.com", city: "בני ברק", source: "meta_form", campaignId: W.id, campaignName: W.name, hookKey: "B", hookText: "3 שאלות שספר טוב שואל לפני שהוא נוגע במספריים", receivedAt: "2026-10-16T21:40:00+03:00", minutesAgo: 770, status: "new", answers: [{ q: "למי התספורת?", a: "חתן ושני אחים" }, { q: "תאריך האירוע", a: "4 בנובמבר" }], notes: "" },
  { id: "ld-05", fullName: "דניאל ר.", phoneDisplay: "050-555-0175", phoneE164: "+972505550175", source: "whatsapp", campaignId: "cmp-after-holidays", campaignName: "אחרי החגים: תור בלי לחכות", hookKey: "B", hookText: "POV: הספר הקבוע שלכם בחופש, ואתם אצל מישהו חדש", receivedAt: "2026-10-16T18:22:00+03:00", minutesAgo: 968, status: "closed", answers: [{ q: "ההודעה הראשונה", a: "כמה עולה פייד?" }], notes: "הגיע ושילם. ביקש תור קבוע כל שלושה שבועות." },
  { id: "ld-06", fullName: "תמר א.", phoneDisplay: "058-555-0128", phoneE164: "+972585550128", city: "רמת גן", source: "landing_page", receivedAt: "2026-10-16T13:10:00+03:00", minutesAgo: 1280, status: "in_progress", answers: [{ q: "מה מעניין אתכם?", a: "תספורת לילד בן 6" }, { q: "מתי נוח לכם?", a: "יום שישי בבוקר" }], notes: "השארתי הודעה קולית. לנסות שוב אחרי 16:00." },
  { id: "ld-07", fullName: "עידו מ.", phoneDisplay: "052-555-0154", phoneE164: "+972525550154", source: "whatsapp", campaignId: "cmp-after-holidays", campaignName: "אחרי החגים: תור בלי לחכות", hookKey: "A", hookText: "פייד מושלם ב-60 שניות", receivedAt: "2026-10-15T19:47:00+03:00", minutesAgo: 2323, status: "closed", answers: [{ q: "ההודעה הראשונה", a: "אפשר לבוא עכשיו?" }], notes: "" },
  { id: "ld-08", fullName: "שירה ק.", phoneDisplay: "054-555-0191", phoneE164: "+972545550191", email: "shira.k@example.com", city: "רמת גן", source: "meta_form", campaignId: W.id, campaignName: W.name, hookKey: "A", hookText: "תספורת לחתונה: מתי לקבוע תור? רמז: לא יום לפני", receivedAt: "2026-10-14T11:02:00+03:00", minutesAgo: 4408, status: "closed", answers: [{ q: "למי התספורת?", a: "לי, לפני חתונה של אח" }, { q: "תאריך האירוע", a: "22 באוקטובר" }], notes: "נקבע ל-21.10 בשעה 18:00." },
  { id: "ld-09", fullName: "בדיקה מטא", phoneDisplay: "050-555-0100", phoneE164: "+972505550100", source: "meta_form", campaignId: W.id, campaignName: W.name, receivedAt: "2026-10-13T16:30:00+03:00", minutesAgo: 5640, status: "closed", answers: [{ q: "למי התספורת?", a: "test" }], notes: "", isTest: true },
  { id: "ld-10", fullName: "רון פ.", phoneDisplay: "053-555-0137", phoneE164: "+972535550137", source: "manual", receivedAt: "2026-10-12T12:00:00+03:00", minutesAgo: 7110, status: "in_progress", answers: [{ q: "איך הגיע", a: "המלצה של לקוח קבוע" }], notes: "רוצה הנחה לשלושה אחים. לחזור אליו עם הצעה.", assignee: "בעל העסק" },
];

export const sourceCounts = leads.reduce<Record<LeadSource, number>>(
  (a, l) => ({ ...a, [l.source]: a[l.source] + 1 }),
  { meta_form: 0, whatsapp: 0, landing_page: 0, manual: 0 },
);
