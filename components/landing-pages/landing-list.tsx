"use client";
import * as React from "react";
import Link from "next/link";
import {
  Clapperboard, Copy, ExternalLink, Eye, FileText, Globe, Inbox, ListChecks, Lock, MapPin, MessageCircle, Pencil, Shield, Wand, Zap,
} from "lucide-react";
import { toast } from "sonner";
import { MiniPreview } from "./mini-preview";
import { PlanDemoToggle, useDemoPlan, withPlan } from "./plan-demo";
import { LandingStatusBadge } from "./status-badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Num, Price } from "@/components/a11y/num";
import { LP_COST, LP_GATE, LP_LIST } from "@/content/he/landing-pages";
import { BRAND } from "@/lib/constants";
import { PLANS } from "@/lib/data/plans";
import { LANDING_GENERATE_CREDITS, NEW_PAGE_ID, WORKSPACE_PAGES, type LandingPage } from "@/lib/mock/landing-pages";
import { cn } from "@/lib/utils";

const FEATURE_ICON = { video: Clapperboard, services: ListChecks, hours: MapPin, contact: MessageCircle, form: Inbox, privacy: Shield } as const;

export function LandingList() {
  const [plan] = useDemoPlan();
  const free = plan === "free";
  const starter = PLANS.find((p) => p.id === "starter")!;
  const pages = free ? [] : WORKSPACE_PAGES;
  const limit = typeof starter.landingPages === "number" ? starter.landingPages : 1;

  return (
    <div className="flex flex-col gap-8">
      <PlanDemoToggle />

      {free ? (
        <FreeState />
      ) : (
        <section aria-labelledby="lp-mine" className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="lp-mine" className="text-h3">הדפים שלכם</h2>
            <span className="rounded-full bg-surface-2 px-3 py-1 text-small text-text-2">{LP_LIST.usage(pages.length, limit, `תוכנית ${starter.nameHe}`)}</span>
          </div>
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
            {pages.map((p) => <PageCard key={p.id} page={p} />)}
            <div className="flex flex-col justify-between gap-4 rounded-lg border border-dashed border-border-strong p-5">
              <div className="flex flex-col gap-2">
                <span className="flex size-10 items-center justify-center rounded-full bg-surface-2 text-text-2"><Lock aria-hidden className="size-5" /></span>
                <h3 className="text-body-lg font-bold">{LP_LIST.addTitle}</h3>
                <p className="text-small text-text-2">{LP_LIST.addLimit(`תוכנית ${starter.nameHe}`)}</p>
              </div>
              <Link href="/app/billing/plans" className={cn(buttonVariants({ variant: "secondary" }), "self-start")}>{LP_LIST.upgrade}</Link>
            </div>
          </div>
        </section>
      )}

      <section aria-labelledby="lp-features" className="rounded-xl bg-surface-1 p-5 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-8">
        <h2 id="lp-features" className="text-h3">{LP_LIST.featuresTitle}</h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {LP_LIST.features.map((f) => {
            const Icon = FEATURE_ICON[f.key];
            return (
              <li key={f.key} className="flex gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary-text"><Icon aria-hidden className="size-5" /></span>
                <div>
                  <p className="font-bold">{f.title}</p>
                  <p className="text-small text-text-2">{f.body}</p>
                </div>
              </li>
            );
          })}
        </ul>
        <p className="mt-6 flex items-start gap-2 border-t border-border pt-4 text-small text-text-2">
          <Zap aria-hidden className="mt-0.5 size-4 shrink-0 text-primary-text" />
          {LP_COST.note}
        </p>
      </section>
    </div>
  );
}

function PageCard({ page }: { page: LandingPage }) {
  const url = `${BRAND.domain}/b/${page.slug}`;
  const published = page.status === "published";
  async function copy() {
    try {
      await navigator.clipboard.writeText(`https://${url}`);
      toast.success(LP_LIST.copied);
    } catch {
      toast(url);
    }
  }
  return (
    <article className="grid gap-5 rounded-lg bg-surface-1 p-5 elev-1 shadow-[inset_0_0_0_1px_var(--color-frame)] sm:grid-cols-[auto_minmax(0,1fr)] md:p-6">
      <div className="mx-auto sm:mx-0">
        <MiniPreview page={page} />
      </div>
      <div className="flex min-w-0 flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <LandingStatusBadge status={page.status} />
          <span className="text-micro text-muted">{published && page.publishedAtHe ? LP_LIST.publishedOn(page.publishedAtHe) : LP_LIST.updated(page.updatedAtHe)}</span>
        </div>
        <h3 className="text-h3">{page.business.nameHe}</h3>
        <div className="flex flex-wrap items-center gap-2 rounded-sm bg-surface-2 px-3 py-2">
          <Globe aria-hidden className="size-4 shrink-0 text-text-2" />
          <bdi dir="ltr" className="min-w-0 flex-1 truncate font-mono text-small">{url}</bdi>
          <Button variant="ghost" size="icon-sm" onClick={copy} aria-label={LP_LIST.copy}><Copy aria-hidden /></Button>
        </div>
        {page.stats && (
          <dl className="grid grid-cols-2 gap-3">
            <div className="rounded-sm bg-surface-2 p-3">
              <dt className="flex items-center gap-1.5 text-micro text-muted"><Eye aria-hidden className="size-3.5" />{LP_LIST.views}</dt>
              <dd className="mt-1 text-h3"><Num value={page.stats.views} /></dd>
            </div>
            <div className="rounded-sm bg-surface-2 p-3">
              <dt className="flex items-center gap-1.5 text-micro text-muted"><Inbox aria-hidden className="size-3.5" />{LP_LIST.leads}</dt>
              <dd className="mt-1 text-h3"><Num value={page.stats.leads} /></dd>
            </div>
            <p className="col-span-2 text-micro font-normal text-muted">{LP_LIST.sampleStats}</p>
          </dl>
        )}
        <div className="mt-auto flex flex-wrap gap-2">
          <Link href={`/app/landing-pages/${page.id}`} className={buttonVariants({ variant: "primary" })}><Pencil aria-hidden />{LP_LIST.edit}</Link>
          {published && (
            <Link href={`/b/${page.slug}`} target="_blank" className={buttonVariants({ variant: "secondary" })}>
              <ExternalLink aria-hidden />{LP_LIST.view}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

function FreeState() {
  const rows = PLANS.map((p) => ({
    id: p.id,
    name: p.nameHe,
    price: p.monthlyIls,
    value: p.landingPages === "per_client" ? LP_GATE.planRow.perClient : p.landingPages === 0 ? LP_GATE.planRow.free : `${p.landingPages === 1 ? "דף אחד" : `${p.landingPages} דפים`}`,
  }));
  return (
    <section aria-labelledby="lp-gate" className="relative overflow-hidden rounded-xl bg-surface-1 p-5 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-10">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-projector" />
      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-center">
        <div className="flex flex-col gap-4">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-micro text-primary-text"><Lock aria-hidden className="size-3.5" />{LP_LIST.eyebrow}</span>
          <h2 id="lp-gate" className="text-h2">{LP_GATE.title}</h2>
          <p className="max-w-2xl text-body-lg text-text-2">{LP_GATE.body}</p>
          <div className="flex flex-wrap gap-3">
            <Link href={withPlan(`/app/landing-pages/${NEW_PAGE_ID}`, "free")} className={buttonVariants({ size: "lg" })}>
              <Wand aria-hidden />
              {LP_COST.preview} · {LP_COST.credits(LANDING_GENERATE_CREDITS)}
            </Link>
            <Link href="/app/billing/plans" className={buttonVariants({ variant: "secondary", size: "lg" })}>{LP_GATE.plansCta}</Link>
            <Link href="/app/billing" className={buttonVariants({ variant: "ghost", size: "lg" })}>{LP_GATE.packCta}</Link>
          </div>
          <div className="mt-2">
            <p className="text-micro text-muted">{LP_GATE.perPlan}</p>
            <ul className="mt-2 grid gap-2 sm:grid-cols-2">
              {rows.map((r) => (
                <li key={r.id} className={cn("flex items-center justify-between gap-3 rounded-sm bg-surface-2 px-3 py-2 text-small", r.id === "free" && "opacity-70")}>
                  <span className="font-semibold">{r.name} {r.price > 0 && <span className="font-normal text-muted">· <Price ils={r.price} /></span>}</span>
                  <span className="text-text-2">{r.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mx-auto">
          <MiniPreview page={WORKSPACE_PAGES[0]} watermark />
        </div>
      </div>
      <p className="relative mt-6 flex items-center gap-2 text-small text-text-2">
        <FileText aria-hidden className="size-4 text-text-2" />
        {LP_LIST.emptyBody}
      </p>
    </section>
  );
}
