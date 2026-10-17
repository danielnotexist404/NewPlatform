import Link from "next/link";
import { Coins } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { DirIcon } from "@/components/a11y/dir-icon";
import { ReelArt, ArtChip, DurationChip, nicheIcon, toneFor } from "./reel-art";
import { SampleTag } from "./kit";
import { STRUCTURE_LABEL, TEMPLATES_PAGE as T } from "@/content/he/gallery";
import { VIDEO_TYPE_LABEL } from "@/lib/labels";
import { estimateSampleCredits, type VideoTemplate } from "@/lib/mock/gallery";
import { cn } from "@/lib/utils";

export interface TemplateCardData extends VideoTemplate {
  nicheName: string | null;
  nicheIconName: string | null;
}

export const templateStartHref = (id: string) => `/login?next=${encodeURIComponent(`/app/create?template=${id}&src=template`)}`;

/** Template card (Part 02 §6.2): poster, name, 2-line description, chips, "מ-# קרדיטים", start + details. */
export function TemplateCard({ t, className }: { t: TemplateCardData; className?: string }) {
  const credits = estimateSampleCredits({ durationSec: t.duration_sec, quality: "draft", visualMix: t.visual_mix });
  return (
    <article className={cn("flex h-full flex-col gap-4 rounded-lg bg-surface-1 p-3 shadow-[inset_0_0_0_1px_var(--color-frame)] transition-colors hover:bg-surface-2", className)}>
      <ReelArt
        aspect={t.aspect_ratio}
        tone={toneFor(t.slug)}
        icon={nicheIcon(t.nicheIconName)}
        hook={t.sample_hook_he}
        hookPosition={t.aspect_ratio === "16:9" ? "center" : "top"}
        size="sm"
        topEnd={<SampleTag>{T.sampleTag}</SampleTag>}
        topStart={<ArtChip>{t.nicheName ?? T.forAll}</ArtChip>}
        bottomEnd={<DurationChip sec={t.duration_sec} />}
        bottomStart={
          <ArtChip>
            <bdi dir="ltr">{t.aspect_ratio}</bdi>
          </ArtChip>
        }
      />
      <div className="flex flex-1 flex-col gap-2.5 px-1 pb-1">
        <h3 className="text-[1.125rem] font-bold leading-snug sm:text-h3">{t.name_he}</h3>
        <p className="line-clamp-2 text-small text-text-2">{t.description_he}</p>
        <ul className="flex flex-wrap gap-1.5" aria-label="מאפייני התבנית">
          <li className="rounded-xs bg-surface-3 px-2 py-0.5 text-micro text-text-2">{VIDEO_TYPE_LABEL[t.video_type]}</li>
          <li className="rounded-xs bg-surface-3 px-2 py-0.5 text-micro text-text-2">{T.seconds(t.duration_sec)}</li>
          <li className="rounded-xs bg-surface-3 px-2 py-0.5 text-micro text-text-2">
            <bdi dir="ltr">{t.aspect_ratio}</bdi>
          </li>
          <li className="hidden rounded-xs bg-surface-3 px-2 py-0.5 text-micro text-text-2 sm:block">{STRUCTURE_LABEL[t.structure]}</li>
        </ul>
        <p className="inline-flex items-center gap-1.5 text-small font-semibold text-primary-text">
          <Coins aria-hidden className="size-4" />
          {T.fromCredits(credits)}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 pt-2">
          <Link href={templateStartHref(t.id)} className={buttonVariants({ size: "md" })} data-cta-location="template_card">
            {T.start}
          </Link>
          <Link href={`/templates/${t.slug}`} className="inline-flex items-center gap-1 text-small font-semibold text-text-2 hover:text-text">
            {T.details}
            <DirIcon name="forward" className="size-4" />
            <span className="sr-only">: {t.name_he}</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
