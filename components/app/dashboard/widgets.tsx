import Link from "next/link";
import { CircleHelp, MessageCircle, Phone, TrendingDown, TrendingUp, Trophy } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/misc";
import { Button } from "@/components/ui/button";
import { Num, Price } from "@/components/a11y/num";
import { DirIcon } from "@/components/a11y/dir-icon";
import { Plural, fill } from "@/components/projects/plural";
import { APP_CORE } from "@/content/he/app-core";
import { MOCK_BUSINESS, MOCK_CAMPAIGN_KPIS, MOCK_LEADS, MOCK_PLAN_ITEMS, MOCK_PLAN_PROGRESS, type PlanItemKind } from "@/lib/mock/workspace";
import { cn } from "@/lib/utils";

const D = APP_CORE.dashboard;

function WidgetShell({ id, title, link, children, aside }: { id: string; title: string; link: { href: string; label: string }; children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-4 rounded-lg bg-surface-1 p-5 shadow-[inset_0_0_0_1px_var(--color-frame)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 id={id} className="text-body-lg font-bold">{title}</h2>
          {aside}
        </div>
        <Link href={link.href} className="group inline-flex shrink-0 items-center gap-1 text-small font-semibold text-primary-text hover:underline">
          {link.label}
          <DirIcon name="next" className="size-4" />
        </Link>
      </div>
      {children}
    </section>
  );
}

function Delta({ pct, goodWhenDown }: { pct: number; goodWhenDown?: boolean }) {
  const up = pct >= 0;
  const good = goodWhenDown ? !up : up;
  const I = up ? TrendingUp : TrendingDown;
  return (
    <span className={cn("inline-flex items-center gap-1 text-micro", good ? "text-success" : "text-text-2")}>
      <I className="size-3.5" aria-hidden />
      <bdi className="num">{up ? "+" : "−"}{Math.abs(pct)}%</bdi>
      <span className="sr-only">{D.campaigns.vsPrev}</span>
    </span>
  );
}

/** "הקמפיינים ב-7 הימים האחרונים" — the 4 KPIs in fixed order (spec 07–08 §G.1). Sample data. */
export function CampaignKpiWidget() {
  const k = MOCK_CAMPAIGN_KPIS;
  const C = D.campaigns;
  const tiles = [
    { key: "spend", value: <Price ils={k.spendIls} />, delta: k.deltas.spend },
    { key: "reach", value: <Num value={k.reach} />, delta: k.deltas.reach },
    { key: "results", value: <Num value={k.results} />, delta: k.deltas.results },
    { key: "cpr", value: <Price ils={k.costPerResultIls} decimals />, delta: k.deltas.cpr, goodWhenDown: true },
  ] as const;
  return (
    <WidgetShell
      id="w-campaigns"
      title={C.title}
      link={{ href: k.campaignHref, label: C.link }}
      aside={
        <p className="flex items-center gap-2 text-micro font-normal text-muted">
          <span className="inline-flex items-center gap-1 text-success">
            <span className="size-1.5 rounded-full bg-success" aria-hidden />
            <Plural n={k.activeCampaigns} forms={C.active} />
          </span>
          · {C.freshness}
        </p>
      }
    >
      <dl className="grid grid-cols-2 gap-2.5">
        {tiles.map((t) => {
          const copy = C.kpis[t.key];
          return (
            <div key={t.key} className="flex flex-col gap-1.5 rounded-md bg-surface-2 p-3.5">
              <dt className="flex items-center gap-1 text-micro font-semibold text-text-2">
                {copy.label}
                <Tooltip content={copy.help}>
                  <button type="button" className="rounded-full text-muted hover:text-text" aria-label={`${C.explain} ${copy.label}`}>
                    <CircleHelp className="size-3.5" aria-hidden />
                  </button>
                </Tooltip>
              </dt>
              <dd className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                <span className="text-h3 font-extrabold">{t.value}</span>
                <Delta pct={t.delta} goodWhenDown={"goodWhenDown" in t ? t.goodWhenDown : false} />
              </dd>
            </div>
          );
        })}
      </dl>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-micro">
          <span className="text-text-2">{C.capLabel}</span>
          <span className="font-normal text-muted"><Price ils={k.monthSpendIls} /> / <Price ils={k.monthCapIls} /></span>
        </div>
        <Progress value={(k.monthSpendIls / k.monthCapIls) * 100} aria-label={C.capLabel} />
      </div>
      <p className="flex items-start gap-2 rounded-md bg-primary/10 p-3 text-small">
        <Trophy className="mt-0.5 size-4 shrink-0 text-primary-text" aria-hidden />
        <span>
          <span className="font-semibold text-primary-text">{C.winner}: </span>
          <span dir="auto">{k.winnerHook}</span>
        </span>
      </p>
    </WidgetShell>
  );
}

/** "לידים חדשים" (spec 07–08 §H.3). Sample leads; WhatsApp prefill per §H.3. */
export function NewLeadsWidget() {
  const L = D.leads;
  return (
    <WidgetShell
      id="w-leads"
      title={L.title}
      link={{ href: "/app/leads", label: L.link }}
      aside={<p className="text-micro font-normal text-muted"><Plural n={MOCK_LEADS.length} forms={APP_CORE.counts.leadsNew} /></p>}
    >
      <ul className="flex flex-col divide-y divide-border">
        {MOCK_LEADS.map((l) => {
          const text = `היי ${l.name}, כאן ${MOCK_BUSINESS.shortName}. קיבלנו את הפנייה שלכם ונשמח לעזור.`;
          return (
            <li key={l.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-3 text-sm font-bold" aria-hidden>{l.name.slice(0, 1)}</span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 font-semibold">
                  {l.name}
                  <span className="rounded-xs bg-success/15 px-1.5 text-micro text-success">חדש</span>
                </p>
                <p className="truncate text-micro font-normal text-muted">{l.when} · {L.from} &quot;{l.campaign}&quot;</p>
                <p className="truncate text-micro font-normal text-text-2">{l.answer}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button asChild variant="ghost" size="icon-sm" aria-label={`${L.call} ל${l.name}`}>
                  <a href={`tel:${l.tel}`}><Phone aria-hidden /></a>
                </Button>
                <Button asChild variant="secondary" size="icon-sm" aria-label={`${L.whatsapp} ל${l.name}`}>
                  <a href={`https://wa.me/${l.wa}?text=${encodeURIComponent(text)}`} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden /></a>
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </WidgetShell>
  );
}

const KIND_CLASS: Record<PlanItemKind, string> = {
  video: "bg-primary/15 text-primary-text",
  trend: "bg-lemon text-on-primary",
  campaign: "bg-violet/15 text-violet",
  post: "bg-rose/15 text-rose",
};

/** "התוכנית שלי · השבוע" (spec 07–08 §S.3). Sample plan items. */
export function PlanItemsWidget() {
  const P = D.plan;
  return (
    <WidgetShell
      id="w-plan"
      title={P.title}
      link={{ href: "/app/plan", label: P.link }}
      aside={
        <p className="text-micro font-normal text-muted">
          {fill(P.progress, { done: <Num value={MOCK_PLAN_PROGRESS.done} />, total: <Num value={MOCK_PLAN_PROGRESS.total} /> })}
        </p>
      }
    >
      <ol className="flex flex-col gap-2">
        {MOCK_PLAN_ITEMS.map((it) => (
          <li key={it.id} className="flex items-center gap-3 rounded-md bg-surface-2 p-2.5">
            <span className="flex w-12 shrink-0 flex-col items-center rounded-sm bg-surface-3 py-1 text-center leading-tight">
              <span className="text-micro font-normal text-muted">{it.day}</span>
              <bdi className="num text-small font-bold">{it.date}</bdi>
            </span>
            <div className="min-w-0 flex-1">
              <span className={cn("rounded-xs px-1.5 py-0.5 text-micro", KIND_CLASS[it.kind])}>{P.kinds[it.kind]}</span>
              <p className="mt-1 truncate text-small font-semibold">{it.title}</p>
            </div>
            {it.status === "planned" ? (
              <Button asChild size="sm" variant="secondary" className="shrink-0">
                <Link href={it.href}>{P.start}</Link>
              </Button>
            ) : (
              <span className="shrink-0 text-micro text-violet">{P.status[it.status]}</span>
            )}
          </li>
        ))}
      </ol>
    </WidgetShell>
  );
}
