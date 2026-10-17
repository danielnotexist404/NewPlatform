import Link from "next/link";
import { Logo } from "./logo";
import { WhatsAppButton } from "./whatsapp-button";
import { CurrentYear } from "./current-year";
import { DisplaySettings } from "@/components/a11y/display-settings";
import { BRAND } from "@/lib/constants";
import { isFilled } from "@/lib/hebrew/text";

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "המוצר",
    links: [
      { href: "/#how-it-works", label: "איך זה עובד" },
      { href: "/campaigns", label: "קמפיינים בפייסבוק ובאינסטגרם" },
      { href: "/examples", label: "דוגמאות" },
      { href: "/templates", label: "תבניות" },
      { href: "/pricing", label: "מחירים" },
    ],
  },
  {
    title: "משאבים",
    links: [
      { href: "/niches", label: "נישות" },
      { href: "/hooks", label: "ספריית ההוקים" },
      { href: "/trends", label: "טרנדים השבוע" },
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

/** Dark, quiet footer: brand + 3 link columns + legal line. Token scope via `theme-ink`. */
export function MarketingFooter() {
  return (
    <footer className="theme-ink relative mt-20 overflow-hidden bg-bg pb-28 md:pb-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-l from-transparent via-primary/60 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 inset-x-0 mx-auto h-72 max-w-3xl rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(closest-side, color-mix(in oklab, var(--color-coral) 45%, transparent), transparent)" }}
      />
      <div className="container-marketing relative grid gap-12 py-16 md:grid-cols-[1.5fr_repeat(3,1fr)] md:py-20">
        <div className="flex flex-col items-start gap-5">
          <Logo />
          <p className="max-w-xs text-small text-text-2">{BRAND.taglineHe} מהסרטון ועד הקמפיין, במקום אחד.</p>
          <WhatsAppButton />
        </div>
        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="mb-4 text-micro text-muted">{col.title}</h2>
            <ul className="flex flex-col gap-2.5 text-small">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-text-2 transition-colors hover:text-text">{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="container-marketing relative">
        <div className="flex flex-col gap-4 border-t border-border pt-6 text-micro font-normal text-muted md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-1.5">
            {isFilled(BRAND.legal.entityName) && <p>© <CurrentYear /> {BRAND.legal.entityName}. כל הזכויות שמורות.</p>}
            {isFilled(BRAND.legal.entityName) && isFilled(BRAND.legal.companyId) && (
              <p>{BRAND.nameHe} הוא שם מסחרי של {BRAND.legal.entityName}, ח״פ <bdi>{BRAND.legal.companyId}</bdi>.</p>
            )}
            <p>כל המחירים באתר בשקלים וכוללים מע״מ (אלא אם מסומן &quot;לפני מע״מ&quot;).</p>
            <p>פייסבוק, אינסטגרם ומטא הם סימנים מסחריים של Meta Platforms. {BRAND.nameHe} אינה קשורה למטא ואינה מאושרת על ידה.</p>
          </div>
          <div className="shrink-0"><DisplaySettings /></div>
        </div>
      </div>
    </footer>
  );
}
