import Link from "next/link";
import { Logo } from "./logo";
import { WhatsAppButton } from "./whatsapp-button";
import { CurrentYear } from "./current-year";
import { BRAND } from "@/lib/constants";
import { isFilled } from "@/lib/hebrew/text";
import { launchNiches, nicheShortName } from "@/lib/data/seed";

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "המוצר",
    links: [
      { href: "/#how-it-works", label: "איך זה עובד" },
      { href: "/campaigns", label: "קמפיינים בפייסבוק ובאינסטגרם" },
      { href: "/trends", label: "טרנדים השבוע" },
      { href: "/examples", label: "דוגמאות" },
      { href: "/templates", label: "תבניות" },
      { href: "/pricing", label: "מחירים" },
      { href: "/pricing#credit-costs", label: "כמה עולה סרטון" },
    ],
  },
  {
    title: "ספריית ההוקים",
    links: [
      { href: "/hooks", label: "ספריית ההוקים" },
      { href: "/hooks/types", label: "סוגי הוקים" },
      { href: "/hooks/platform/reels", label: "הוקים לרילס לעסקים" },
    ],
  },
  {
    title: "משאבים",
    links: [
      { href: "/blog", label: "בלוג" },
      { href: "/faq", label: "שאלות נפוצות" },
      { href: "/about", label: "אודות" },
      { href: "/contact", label: "יצירת קשר" },
    ],
  },
  {
    title: "משפטי ועזרה",
    links: [
      { href: "/legal/terms", label: "תנאי שימוש" },
      { href: "/legal/privacy", label: "מדיניות פרטיות" },
      { href: "/legal/cookies", label: "מדיניות עוגיות" },
      { href: "/legal/accessibility", label: "הצהרת נגישות" },
      { href: "/legal/cancellation", label: "מדיניות ביטול והחזרים" },
      { href: "/app/billing/cancel", label: "ביטול מנוי" },
      { href: "/legal/ai-policy", label: "מדיניות שימוש הוגן ב-AI" },
    ],
  },
];

export function MarketingFooter() {
  const niches = launchNiches().slice(0, 10);
  return (
    <footer className="mt-24 border-t border-border bg-surface-1/40 pb-28 md:pb-10">
      <div className="container-marketing grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(5,1fr)]">
        <div className="flex flex-col gap-4">
          <Logo />
          <p className="text-text-2">{BRAND.taglineHe} מהסרטון ועד הקמפיין, במקום אחד.</p>
          <WhatsAppButton />
        </div>
        <nav aria-label="נישות">
          <h2 className="mb-3 text-micro text-muted">נישות</h2>
          <ul className="flex flex-col gap-2 text-small">
            {niches.map((n) => (
              <li key={n.slug}>
                <Link href={`/niches/${n.slug}`} className="text-text-2 hover:text-text">
                  סרטון תדמית ל{nicheShortName(n)}
                </Link>
              </li>
            ))}
            <li><Link href="/niches" className="font-semibold text-primary-text hover:underline">לכל הנישות ←</Link></li>
          </ul>
        </nav>
        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="mb-3 text-micro text-muted">{col.title}</h2>
            <ul className="flex flex-col gap-2 text-small">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-text-2 hover:text-text">{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="container-marketing flex flex-col gap-2 border-t border-border pt-6 text-micro font-normal text-muted">
        {isFilled(BRAND.legal.entityName) && <p>© <CurrentYear /> {BRAND.legal.entityName}. כל הזכויות שמורות.</p>}
        {isFilled(BRAND.legal.entityName) && isFilled(BRAND.legal.companyId) && (
          <p>{BRAND.nameHe} הוא שם מסחרי של {BRAND.legal.entityName}, ח״פ <bdi>{BRAND.legal.companyId}</bdi>.</p>
        )}
        <p>כל המחירים באתר בשקלים וכוללים מע״מ (אלא אם מסומן &quot;לפני מע״מ&quot;).</p>
        <p>פייסבוק, אינסטגרם ומטא הם סימנים מסחריים של Meta Platforms. {BRAND.nameHe} אינה קשורה למטא ואינה מאושרת על ידה.</p>
      </div>
    </footer>
  );
}
