import Link from "next/link";
import { Coins } from "lucide-react";
import { DirIcon } from "@/components/a11y/dir-icon";
import { MediaTile } from "@/components/marketing/media/media-tile";
import { reelFromText } from "@/components/marketing/media/reel-data";
import { nicheVisualAt } from "@/components/marketing/media/props";
import { TEMPLATES_PAGE as T } from "@/content/he/gallery";
import { estimateSampleCredits, type VideoTemplate } from "@/lib/mock/gallery";
import { cn } from "@/lib/utils";

export interface TemplateCardData extends VideoTemplate {
  nicheName: string | null;
  nicheIconName: string | null;
}

export const templateStartHref = (id: string) => `/login?next=${encodeURIComponent(`/app/create?template=${id}&src=template`)}`;

/** Template card (clean redesign): a looping "video" in the template's format, name, one meta line and two actions. */
export function TemplateCard({ t, className, index = 0 }: { t: TemplateCardData; className?: string; index?: number }) {
  const credits = estimateSampleCredits({ durationSec: t.duration_sec, quality: "draft", visualMix: t.visual_mix });
  const reel = reelFromText(t.slug, t.sample_hook_he, t.niche_slug, { ...nicheVisualAt(t.niche_slug, t.niche_slug ? index % 3 : index), caption: (["box", "shadow", "accent"] as const)[index % 3], highlight: 1 });
  return (
    <article className={cn("group relative flex h-full flex-col gap-4", className)}>
      <MediaTile reel={reel} aspect={t.aspect_ratio} offset={index * 1.3} className="transition-transform duration-500 group-hover:-translate-y-1">
        <span className="absolute top-[4%] inset-e-[4%] z-10 rounded-full bg-paper/90 px-2.5 py-1 text-micro text-ink">{T.sampleTag}</span>
      </MediaTile>
      <div className="flex flex-1 flex-col gap-1.5 px-1">
        <h3 className="text-h3 font-bold leading-snug">
          <Link href={`/templates/${t.slug}`} className="after:absolute after:inset-0 after:rounded-[22px] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-focus">
            {t.name_he}
          </Link>
        </h3>
        <p className="text-small text-muted">
          {t.nicheName ?? T.forAll} · {T.seconds(t.duration_sec)} · <bdi dir="ltr">{t.aspect_ratio}</bdi>
        </p>
        <p className="inline-flex items-center gap-1.5 text-small font-semibold text-primary-text">
          <Coins aria-hidden className="size-4" />
          {T.fromCredits(credits)}
        </p>
        <div className="relative z-10 mt-2">
          <Link href={templateStartHref(t.id)} className="inline-flex items-center gap-1 text-small font-bold text-text hover:underline" data-cta-location="template_card">
            {T.start}
            <DirIcon name="forward" className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
