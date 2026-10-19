import type { Metadata } from "next";
import Link from "next/link";
import { CreditCard, Palette, Settings, Users } from "lucide-react";
import { DirIcon } from "@/components/a11y/dir-icon";
import { SIMPLE_APP } from "@/content/he/simple-app";
import { MOCK_CREDITS, MOCK_PLAN, MOCK_USER } from "@/lib/mock/workspace";

const A = SIMPLE_APP.account;

export const metadata: Metadata = {
  title: A.metaTitle,
  description: A.metaDescription,
};

const CARDS = [
  { href: "/app/brand", icon: Palette, ...A.cards.brand },
  { href: "/app/billing", icon: CreditCard, ...A.cards.billing },
  { href: "/app/settings", icon: Settings, ...A.cards.settings },
  { href: "/app/team", icon: Users, ...A.cards.team },
] as const;

const MORE = [
  { href: "/app/templates", label: A.links.templates },
  { href: "/app/hooks", label: A.links.hooks },
  { href: "/app/library", label: A.links.library },
  { href: "/app/plan", label: A.links.plan },
  { href: "/app/clients", label: A.links.clients },
  { href: "/app/settings/integrations", label: A.links.integrations },
];

/** Account hub: four cards to the existing settings pages, and a quiet row of extra tools. */
export default function AccountPage() {
  return (
    <div className="flex flex-col gap-10">
      <header className="flex items-center gap-4">
        <span className="flex size-14 items-center justify-center rounded-full bg-accent-gradient text-h3 font-black text-ink" aria-hidden>
          {MOCK_USER.firstName.slice(0, 1)}
        </span>
        <div className="flex flex-col">
          <h1 className="text-h1">{A.title}</h1>
          <p className="text-small text-text-2">
            {MOCK_USER.fullName} · {MOCK_PLAN.nameHe} · <bdi className="num">{MOCK_CREDITS.balance.toLocaleString("he-IL")}</bdi> {SIMPLE_APP.nav.credits}
          </p>
        </div>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2 lg:gap-6">
        {CARDS.map((c) => {
          const Icon = c.icon;
          return (
            <li key={c.href}>
              <Link href={c.href} className="group flex h-full items-center gap-5 rounded-xl bg-surface-1 p-6 elev-2 ring-hairline transition-[box-shadow,translate] duration-300 hover:-translate-y-0.5 hover:elev-3 md:p-8">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-primary-text ring-hairline">
                  <Icon className="size-6" aria-hidden />
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="text-h3">{c.title}</span>
                  <span className="text-small text-text-2">{c.body}</span>
                </span>
                <DirIcon name="next" className="size-5 shrink-0 text-muted transition-transform rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1" />
              </Link>
            </li>
          );
        })}
      </ul>

      <nav aria-label={A.more} className="flex flex-col gap-3">
        <h2 className="text-small font-semibold text-muted">{A.more}</h2>
        <ul className="flex flex-wrap gap-2">
          {MORE.map((m) => (
            <li key={m.href}>
              <Link href={m.href} className="inline-flex h-10 items-center rounded-full bg-surface-1 px-4 text-small font-semibold text-text-2 ring-1 ring-border hover:text-text hover:ring-border-strong">
                {m.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
