"use client";
import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Check, Clapperboard, Copy, ExternalLink, Eye, Lightbulb, Link2, MessageCircle, ShieldAlert, Star, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { DirIcon } from "@/components/a11y/dir-icon";
import { NicheIcon } from "@/components/marketing/niches/niche-icon";
import { GENDER_LABEL, GOAL_LABEL, PLATFORM_LABEL } from "@/lib/labels";
import { HOOKS_COPY } from "@/content/he/hooks";
import { cn } from "@/lib/utils";
import type { HookView } from "./hook-data";
import { HookText } from "./hook-text";
import { usePersonalization } from "./stores";
import { fillText, placeholderLabel } from "./text";
import { useGate } from "./hooks-provider";
import { createFromHookHref, hookPermalink, signupHref, variationsHref } from "./links";

const C = HOOKS_COPY.card;

export type HookCardVariant = "library" | "compact" | "featured" | "page";

export interface HookCardProps {
  hook: HookView;
  variant?: HookCardVariant;
  /** Niche chip; hidden on the niche's own pages (Part 02 §5.2). */
  showNiche?: boolean;
  /** compact: show "צרו סרטון" too. */
  showCreate?: boolean;
  /** Analytics location (Part 06 §14.3) — kept for the event wiring. */
  location: string;
  headingLevel?: "h2" | "h3" | "h4";
  className?: string;
}

function Chip({ children, tone = "neutral", className }: { children: React.ReactNode; tone?: "neutral" | "lemon" | "violet" | "outline"; className?: string }) {
  return (
    <li
      className={cn(
        "inline-flex items-center gap-1 rounded-xs px-2 py-0.5 text-micro whitespace-nowrap [&_svg]:size-3.5",
        tone === "lemon" && "bg-lemon text-on-primary",
        tone === "neutral" && "bg-surface-3 text-text-2",
        tone === "violet" && "bg-violet/15 text-violet",
        tone === "outline" && "shadow-[inset_0_0_0_1px_var(--color-border-strong)] text-text-2",
        className,
      )}
    >
      {children}
    </li>
  );
}

export function HookCard({ hook, variant = "library", showNiche = true, showCreate = true, location, headingLevel = "h3", className }: HookCardProps) {
  const values = usePersonalization();
  const gate = useGate();
  const [copied, setCopied] = React.useState(false);
  const [manual, setManual] = React.useState<string | null>(null);
  const titleId = `hook-${hook.id}-title`;
  const H = headingLevel;
  const full = variant !== "compact";
  /** Clean redesign: the long details (first seconds, why, platforms, compliance) only on the hook's own page. */
  const detail = variant === "page";

  const filled = fillText(hook.text, values);

  async function copyText() {
    const { text, missing } = fillText(hook.text, values);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setManual(null);
      window.setTimeout(() => setCopied(false), 2000);
      toast.success(missing.length ? C.toastCopiedMissing(missing.map(placeholderLabel).join(", ")) : C.toastCopied);
    } catch {
      setManual(text);
    }
  }
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(hookPermalink(hook.id));
      toast.success(C.toastLink);
    } catch {
      setManual(hookPermalink(hook.id));
    }
  }
  const waHref = `https://wa.me/?text=${encodeURIComponent(`${filled.text}\n\n${C.shareMore} ${hookPermalink(hook.id)}`)}`;

  return (
    <article
      id={hook.id}
      tabIndex={-1}
      aria-labelledby={titleId}
      data-location={location}
      className={cn(
        "group/card relative flex scroll-mt-28 flex-col outline-none focus-visible:outline-2 rounded-[24px] bg-surface-1 shadow-[inset_0_0_0_1px_var(--color-frame)] elev-1 transition-[background-color,box-shadow,translate] duration-300 hover:-translate-y-0.5",
        "hover:shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-primary)_28%,transparent)]",
        variant === "featured" ? "gap-6 p-7 md:p-8" : variant === "compact" ? "gap-3 p-4" : variant === "page" ? "gap-6 p-6 md:p-8" : "gap-5 p-6",
        (variant === "featured" || variant === "page") && "glow-primary bg-[radial-gradient(120%_90%_at_100%_0%,color-mix(in_oklab,var(--color-primary)_12%,transparent),transparent_60%)]",
        className,
      )}
    >
      {variant !== "page" && (
        <H id={titleId} className="sr-only">
          {C.srTitle(hook.typeName, hook.nicheShort)}
        </H>
      )}

      <div className="flex items-start justify-between gap-3">
        <ul className="flex flex-wrap items-center gap-1.5" aria-label="מאפייני ההוק">
          <Chip tone="lemon">
            <Link href={`/hooks/types/${hook.typeSlug}`} className="font-bold hover:underline">
              {hook.typeName}
            </Link>
          </Chip>
          {showNiche &&
            (hook.nicheSlug ? (
              <Chip tone="outline">
                <NicheIcon name={hook.nicheIcon} />
                <Link href={`/hooks/${hook.nicheSlug}`} className="hover:text-text">
                  {hook.nicheShort}
                </Link>
              </Chip>
            ) : (
              <Chip tone="outline">{C.forAny}</Chip>
            ))}
          {detail && <Chip>{hook.platforms.map((p) => PLATFORM_LABEL[p]).join(" · ")}</Chip>}
          {detail && <Chip>{GOAL_LABEL[hook.goal]}</Chip>}
          {detail && hook.gender !== "neutral" && <Chip>{GENDER_LABEL[hook.gender]}</Chip>}
          {hook.seasonName && <Chip tone="violet">{hook.seasonName}</Chip>}
        </ul>
        {full && (
          <Tooltip content={C.save}>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={C.save}
              className="-me-1.5 -mt-1 shrink-0 text-text-2 hover:text-primary-text"
              onClick={() => gate("save", signupHref(`/app/hooks?favorite=${hook.id}`))}
            >
              <Star aria-hidden />
            </Button>
          </Tooltip>
        )}
      </div>

      {variant === "page" ? (
        <h1 id={titleId} className="text-h2 font-extrabold text-text">
          <HookText text={hook.text} values={values} />
        </h1>
      ) : (
        <blockquote
          className={cn(
            "font-bold text-text",
            variant === "featured" ? "text-h3" : variant === "compact" ? "text-[1.0625rem] leading-[1.5]" : "text-[1.375rem] leading-[1.4]",
          )}
        >
          <HookText text={hook.text} values={values} />
        </blockquote>
      )}

      {detail && (
        <dl className={cn("flex flex-col gap-2", variant === "page" ? "text-body" : "text-small")}>
          <div className="flex gap-2">
            <Eye className="mt-1 size-4 shrink-0 text-muted" aria-hidden />
            <div>
              <dt className="inline font-semibold text-text">{C.firstSeconds}</dt>{" "}
              <dd className="inline text-text-2">
                <HookText text={hook.visual} values={values} />
              </dd>
            </div>
          </div>
          {hook.why && (
            <div className="flex gap-2">
              <Lightbulb className="mt-1 size-4 shrink-0 text-muted" aria-hidden />
              <div>
                <dt className="inline font-semibold text-text">{C.why}</dt> <dd className="inline text-text-2">{hook.why}</dd>
              </div>
            </div>
          )}
        </dl>
      )}

      {detail && hook.compliance && (
        <p className="flex gap-2 rounded-sm bg-surface-2 p-3 text-small text-text-2">
          <ShieldAlert className="mt-0.5 size-4 shrink-0 text-primary-text" aria-hidden />
          <span>
            <strong className="font-semibold text-text">{C.compliance}</strong> {hook.compliance}
          </span>
        </p>
      )}

      {manual && (
        <div className="rounded-sm border border-border-strong bg-surface-2 p-3" role="status">
          <p className="mb-1.5 text-micro text-text-2">{C.manualCopy}</p>
          <textarea
            readOnly
            dir="auto"
            value={manual}
            rows={2}
            onFocus={(e) => e.currentTarget.select()}
            className="w-full resize-none rounded-xs bg-surface-1 p-2 text-small text-text"
            autoFocus
          />
          <button type="button" className="mt-1 text-micro text-link underline" onClick={() => setManual(null)}>
            {C.closeManual}
          </button>
        </div>
      )}

      <div className={cn("mt-auto flex flex-wrap items-center gap-2", full && "pt-1")}>
        <Button variant={copied ? "secondary" : "outline"} size="sm" onClick={copyText} aria-live="polite" className="min-w-[5.5rem]">
          {copied ? <Check aria-hidden className="text-success" /> : <Copy aria-hidden />}
          {copied ? C.copied : C.copy}
        </Button>
        {(full || showCreate) && (
          <Button size="sm" onClick={() => gate("create", createFromHookHref(hook.id))}>
            <Clapperboard aria-hidden />
            {C.createVideo}
            <DirIcon name="forward" />
          </Button>
        )}
        {full && (
          <div className="ms-auto flex items-center gap-0.5">
            {detail && (
            <Tooltip content={C.variations}>
              <Button variant="ghost" size="icon-sm" aria-label={C.variations} onClick={() => gate("variations", variationsHref(hook.id))}>
                <WandSparkles aria-hidden className="text-violet" />
              </Button>
            </Tooltip>
            )}
            <Tooltip content={C.whatsapp}>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={C.whatsapp}
                className="inline-flex size-8 items-center justify-center rounded-full text-text-2 transition-colors hover:bg-surface-2 hover:text-text"
              >
                <MessageCircle className="size-[1.1em]" aria-hidden />
              </a>
            </Tooltip>
            {detail && (
            <Tooltip content={C.copyLink}>
              <Button variant="ghost" size="icon-sm" aria-label={C.copyLink} onClick={copyLink} className="text-text-2">
                <Link2 aria-hidden />
              </Button>
            </Tooltip>
            )}
            <Tooltip content={C.open}>
              <Link
                href={`/hooks/h/${hook.id}`}
                aria-label={C.open}
                className="inline-flex size-8 items-center justify-center rounded-full text-text-2 transition-colors hover:bg-surface-2 hover:text-text"
              >
                <ExternalLink className="size-[1.1em]" aria-hidden />
              </Link>
            </Tooltip>
          </div>
        )}
      </div>
    </article>
  );
}
