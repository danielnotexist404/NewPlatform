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
      { href: "/campaigns", label: "קמפיינים" },
      { href: "/examples", label: "דוגמאות" },
      { href: "/templates", label: "תבניות" },
      { href: "/pricing", label: "מחירים" },
    ],
  },
  {
    title: "השראה",
    links: [
      { href: "/hooks", label: "ספריית ההוקים" },
      { href: "/trends", label: "טרנדים" },
      { href: "/niches", label: "נישות" },
      { href: "/blog", label: "בלוג" },
    ],
  },
  {
    title: "החברה",
    links: [
      { href: "/about", label: "אודות" },
      { href: "/faq", label: "שאלות נפוצות" },
      { href: "/contact", label: "יצירת קשר" },
    ],
  },
];

const LEGAL = [
  { href: "/legal/terms", label: "תנאי שימוש" },
  { href: "/legal/privacy", label: "פרטיות" },
  { href: "/legal/cookies", label: "עוגיות" },
  { href: "/legal/accessibility", label: "נגישות" },
  { href: "/legal/cancellation", label: "ביטול והחזרים" },
  { href: "/app/billing/cancel", label: "ביטול מנוי" },
  { href: "/legal", label: "כל המסמכים" },
];

/** Quiet ink footer: brand, 3 link columns, one legal line (incl. "ביטול מנוי" and the Meta disclaimer). */
export function MarketingFooter() {
  return (
    <footer className="theme-ink relative mt-24 overflow-hidden bg-bg pb-28 md:pb-10">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-l from-transparent via-primary/60 to-transparent" />
      <div className="container-marketing relative grid gap-12 py-16 md:grid-cols-[1.6fr_repeat(3,1fr)] md:py-20">
        <div className="flex flex-col items-start gap-5">
          <Logo />
          <p className="max-w-xs text-body text-text-2">מהסרטון ועד הקמפיין, במקום אחד.</p>
          <WhatsAppButton />
        </div>
        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="mb-4 text-small font-semibold text-muted">{col.title}</h2>
            <ul className="flex flex-col gap-3 text-body">
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
        <div className="flex flex-col gap-5 border-t border-border pt-7 text-micro font-normal text-muted">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <nav aria-label="מסמכים משפטיים">
              <ul className="flex flex-wrap gap-x-5 gap-y-2 text-small">
                {LEGAL.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-text-2 transition-colors hover:text-text">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="shrink-0"><DisplaySettings /></div>
          </div>
          <p>
            {isFilled(BRAND.legal.entityName) && <>© <CurrentYear /> {BRAND.legal.entityName}{isFilled(BRAND.legal.companyId) && <>, ח״פ <bdi>{BRAND.legal.companyId}</bdi></>}. </>}
            המחירים כוללים מע״מ. פייסבוק, אינסטגרם ומטא הם סימנים מסחריים של Meta Platforms. {BRAND.nameHe} אינה קשורה למטא ואינה מאושרת על ידה.
          </p>
        </div>
      </div>
    </footer>
  );
}
