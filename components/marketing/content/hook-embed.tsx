import Link from "next/link";
import { House, Clapperboard, TriangleAlert, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getHook, getHookType, getNiche, nicheShortName } from "@/lib/data/seed";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CopyButton } from "./copy-button";
import { CONTENT_UI } from "@/content/he/site";

const NICHE_ICONS: Record<string, LucideIcon> = { House };

/** "{עיר}" placeholders in hook text render as chips (PlaceholderChip, Part 02 §1.4). */
export function HookText({ text }: { text: string }) {
  const parts = text.split(/(\{[^}]+\})/g);
  return (
    <>
      {parts.map((p, i) =>
        /^\{[^}]+\}$/.test(p) ? (
          <span key={i} className="mx-0.5 inline-block rounded-xs border border-dashed border-violet/60 bg-violet/10 px-1.5 text-[0.85em] font-semibold text-violet">
            {p.slice(1, -1)}
          </span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

/** A library hook embedded in an article (HookEmbed, Part 02 §8.1): text, what is on screen, copy, create. */
export function HookEmbed({ id }: { id: string }) {
  const hook = getHook(id);
  if (!hook) throw new Error(`HookEmbed: unknown hook id "${id}"`);
  const type = getHookType(hook.hook_type_slug);
  const niche = hook.niche_slug ? getNiche(hook.niche_slug) : undefined;
  const Icon = (niche && NICHE_ICONS[niche.icon]) || Clapperboard;
  const createHref = `/login?next=${encodeURIComponent(`/app/create?hook=${hook.id}`)}`;

  return (
    <figure className="not-prose relative my-8 [&_a]:no-underline overflow-hidden rounded-lg bg-surface-1 p-5 shadow-[inset_0_0_0_1px_var(--color-frame)] elev-2 md:p-6">
      <div aria-hidden className="pointer-events-none absolute -top-24 inset-e-[-6rem] size-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative flex gap-4 md:gap-5">
        <div aria-hidden className="hidden w-16 shrink-0 flex-col items-center gap-2 xs:flex">
          <div className="flex aspect-reel w-full items-center justify-center rounded-sm bg-black shadow-[inset_0_0_0_1px_var(--color-frame)]" style={{ backgroundImage: "radial-gradient(120% 80% at 80% 0%, color-mix(in oklab, var(--color-primary) 45%, transparent), transparent 65%)" }}>
            <Icon className="size-6 text-white/80" strokeWidth={1.5} />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {type && <Badge variant="violet">{type.name_he}</Badge>}
            {niche && <Badge variant="outline">{nicheShortName(niche)}</Badge>}
            {hook.is_featured && (
              <Badge variant="neutral">
                <Sparkles aria-hidden />
                {CONTENT_UI.hook.featured}
              </Badge>
            )}
          </div>
          <blockquote className="m-0 border-0 p-0 text-body-lg font-bold leading-snug text-text md:text-h3">
            &quot;<HookText text={hook.text_he} />&quot;
          </blockquote>
          <figcaption className="mt-2 text-small text-text-2">
            <span className="font-semibold text-text">{CONTENT_UI.hook.onScreen}</span>
            {hook.visual_direction_he}
          </figcaption>
          {hook.compliance_note_he && (
            <p className="mb-0 mt-2 flex items-start gap-1.5 text-small text-text-2">
              <TriangleAlert aria-hidden className="mt-1 size-4 shrink-0 text-primary-text" />
              {hook.compliance_note_he}
            </p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <CopyButton text={hook.text_he} label={CONTENT_UI.hook.copy} copiedToast={CONTENT_UI.hook.copied} />
            <Link href={createHref} className={cn(buttonVariants({ size: "sm" }))}>
              {CONTENT_UI.hook.create}
            </Link>
          </div>
        </div>
      </div>
    </figure>
  );
}
