import * as React from "react";
import Link from "next/link";
import { HeartPulse, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/a11y/num";
import { DirIcon } from "@/components/a11y/dir-icon";
import { healthReport, variantMetrics, type Campaign, type HookVariant } from "@/lib/mock/campaigns";
import { dashboard as D, healthTeaser as H, HOOK_KEY_HE } from "@/content/he/campaigns-app";
import { VideoThumb } from "./video-thumb";
import { ScoreRing } from "./score-ring";
import { fill, plural } from "./text";
import { cn } from "@/lib/utils";

export function WinnerCard({ campaign, winner, className }: { campaign: Campaign; winner: HookVariant; className?: string }) {
  const w = variantMetrics(campaign, winner);
  const others = campaign.variants.filter((v) => v.key !== winner.key).map((v) => variantMetrics(campaign, v));
  const otherSpend = others.reduce((a, m) => a + m.spendIls, 0);
  const otherRes = others.reduce((a, m) => a + m.results, 0);
  const otherCpr = otherRes ? Math.round((otherSpend / otherRes) * 100) / 100 : null;
  return (
    <section aria-labelledby="winner-title" className={cn("relative overflow-hidden rounded-md bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-5", className)}>
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-projector opacity-70" />
      <div className="relative flex gap-4">
        <VideoThumb size="sm" tone={winner.tone} className="w-20 md:w-24" />
        <div className="flex min-w-0 flex-col gap-2">
          <p className="inline-flex items-center gap-1.5 text-micro text-primary-text">
            <Trophy className="size-3.5" aria-hidden />
            {D.winner.eyebrow} · הוק {HOOK_KEY_HE[winner.key]}
          </p>
          <h2 id="winner-title" className="text-body font-bold leading-snug">&quot;{winner.hookText}&quot;</h2>
          <p className="text-small text-text-2">
            {fill(D.winner.body, {
              cpr: <Price ils={w.costPerResult ?? 0} decimals className="font-bold text-text" />,
              other: otherCpr ? <Price ils={otherCpr} decimals /> : "—",
            })}
          </p>
          <p className="text-micro font-normal text-muted">{campaign.name}</p>
        </div>
      </div>
      <Button asChild className="relative mt-4 w-full">
        <Link href={`/app/campaigns/${campaign.id}#boost`}>
          {D.winner.cta}
          <DirIcon name="forward" />
        </Link>
      </Button>
    </section>
  );
}

export function HealthTeaserCard({ className, connected = true }: { className?: string; connected?: boolean }) {
  return (
    <section aria-labelledby="health-teaser-title" className={cn("relative overflow-hidden rounded-md bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-5", className)}>
      <div aria-hidden className="pointer-events-none absolute -top-16 -inset-e-16 size-48 rounded-full bg-rose/15 blur-3xl" />
      <div className="relative flex items-start gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <p className="inline-flex items-center gap-1.5 text-micro text-rose">
            <HeartPulse className="size-4" aria-hidden />
            {H.eyebrow}
          </p>
          <h2 id="health-teaser-title" className="text-h3">{H.title}</h2>
          <p className="text-small text-text-2">{H.sub}</p>
        </div>
        {connected && <ScoreRing score={healthReport.score} size={84} label={H.scoreLabel} />}
      </div>
      {connected && (
        <p className="relative mt-3 text-small font-semibold text-text">{plural(healthReport.fixes.length, H.fixes)}</p>
      )}
      <Button asChild variant="secondary" className="relative mt-4 w-full">
        <Link href="/app/campaigns/health">
          {H.cta}
          <DirIcon name="forward" />
        </Link>
      </Button>
    </section>
  );
}
