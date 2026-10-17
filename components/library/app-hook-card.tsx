"use client";
import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Check, Clapperboard, Copy, EllipsisVertical, Eye, Lightbulb, Link2, MessageCircle, ShieldAlert, Sparkles, Star, Users, WandSparkles } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HookText } from "@/components/hooks/hook-text";
import { fillText, placeholderLabel, type Values } from "@/components/hooks/text";
import type { HookView } from "@/components/hooks/hook-data";
import { NicheIcon } from "@/components/video/niche-icon";
import { Tag } from "@/components/settings/kit";
import { hooksCopy as h, accountCommon } from "@/content/he/account";
import { BRAND } from "@/lib/constants";
import { GOAL_LABEL, PLATFORM_LABEL, GENDER_LABEL } from "@/lib/labels";
import { inflect, type Address } from "./hook-inflect";
import { fill } from "@/components/settings/format";
import { cn } from "@/components/settings/cn";

const C = h.card;

export async function copyText(text: string, missing: string[]) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(missing.length ? fill(C.copiedMissing, { fields: missing.map(placeholderLabel).join(", ") }) : accountCommon.hookCopied);
    return true;
  } catch {
    toast(text, { duration: 8000 });
    return false;
  }
}

export function Strength({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-micro text-text-2">
      <span aria-hidden className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => <span key={i} className={cn("h-1.5 w-3 rounded-full", i <= value ? "bg-violet" : "bg-surface-3")} />)}
      </span>
      {fill(C.strength, { value })}
    </span>
  );
}

/** HookCard for /app/hooks (variant "library" of Part 01 §10.15, with the in-app actions of Part 03 §14). */
export function AppHookCard({
  hook, values, favorite, onFavorite, onVariations, showNiche = true,
}: {
  hook: HookView;
  values: Values;
  favorite: boolean;
  onFavorite: (on: boolean) => void;
  onVariations: () => void;
  showNiche?: boolean;
}) {
  const [address, setAddress] = React.useState<Address>("plural");
  const [copied, setCopied] = React.useState(false);
  const text = address === "plural" ? hook.text : inflect(hook.text, address);
  const permalink = `https://${BRAND.domain}/hooks/h/${hook.id}`;

  const doCopy = async () => {
    const { text: filled, missing } = fillText(text, values);
    if (await copyText(filled, missing)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article aria-labelledby={`hook-${hook.id}`} className="flex h-full flex-col gap-4 rounded-lg bg-surface-1 p-5 elev-1 shadow-[inset_0_0_0_1px_var(--color-frame)] transition-shadow hover:elev-2">
      <div className="flex items-start justify-between gap-2">
      <ul className="flex flex-wrap items-center gap-1.5">
        <li><Tag variant="lemon">{hook.typeName}</Tag></li>
        {showNiche && (
          <li>
            <Tag variant="outline">
              {hook.nicheSlug ? <><NicheIcon name={hook.nicheIcon} aria-hidden />{hook.nicheShort}</> : C.forAny}
            </Tag>
          </li>
        )}
        {hook.seasonName && <li><Tag variant="violet">{hook.seasonName}</Tag></li>}
        {hook.platforms.slice(0, 3).map((p) => <li key={p}><Tag variant="neutral">{PLATFORM_LABEL[p]}</Tag></li>)}
        <li><Tag variant="neutral">{GOAL_LABEL[hook.goal]}</Tag></li>
        {hook.gender !== "neutral" && <li><Tag variant="neutral"><Users aria-hidden />{GENDER_LABEL[hook.gender]}</Tag></li>}
        {address !== "plural" && <li><Tag variant="success">{C.inflected}</Tag></li>}
      </ul>
        <span className="-me-2 -mt-1 flex shrink-0 items-center">
          <Button
            size="icon-sm"
            variant="ghost"
            aria-pressed={favorite}
            aria-label={favorite ? C.unfavorite : C.favorite}
            onClick={() => onFavorite(!favorite)}
            className={cn(favorite && "text-primary-text")}
          >
            <Star aria-hidden className={cn(favorite && "fill-current")} />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon-sm" variant="ghost" aria-label={C.more}><EllipsisVertical aria-hidden /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <a href={`https://wa.me/?text=${encodeURIComponent(`${fillText(text, values).text}\n\n${permalink}`)}`} target="_blank" rel="noopener"><MessageCircle aria-hidden />{C.whatsapp}</a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>{C.inflect}</DropdownMenuLabel>
              {(["plural", "female", "male"] as const).map((a) => (
                <DropdownMenuItem key={a} onSelect={() => setAddress(a)}>
                  {address === a ? <Check aria-hidden /> : <span className="size-4" aria-hidden />}
                  {C.inflectOptions[a]}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={async () => { try { await navigator.clipboard.writeText(permalink); toast.success(accountCommon.linkCopied); } catch { toast(permalink); } }}>
                <Link2 aria-hidden />{C.copyLink}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </span>
      </div>

      <blockquote id={`hook-${hook.id}`} dir="rtl" className="text-[1.25rem] leading-snug font-bold">
        <HookText text={text} values={values} />
      </blockquote>

      <div className="flex flex-col gap-2 text-small text-text-2">
        <p className="flex items-start gap-2"><Eye className="mt-1 size-4 shrink-0 text-muted" aria-hidden /><span><span className="font-semibold text-text">{C.firstSeconds}: </span>{hook.visual}</span></p>
        {hook.why && <p className="flex items-start gap-2"><Lightbulb className="mt-1 size-4 shrink-0 text-primary-text" aria-hidden /><span><span className="font-semibold text-text">{C.why} </span>{hook.why}</span></p>}
        {hook.compliance && <p className="flex items-start gap-2"><ShieldAlert className="mt-1 size-4 shrink-0 text-danger" aria-hidden />{hook.compliance}</p>}
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-border pt-4">
        <Button size="sm" variant="secondary" onClick={doCopy} aria-live="polite">
          {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
          {copied ? accountCommon.copied : accountCommon.copy}
        </Button>
        <Link href={`/app/create?hook=${hook.id}&src=hooks`} className={buttonVariants({ size: "sm" })}>
          <Clapperboard aria-hidden />{C.createVideo}
        </Link>
        <Button size="sm" variant="ghost" className="text-violet hover:glow-ai" onClick={onVariations}>
          <WandSparkles aria-hidden />{C.variations}
        </Button>
      </div>
    </article>
  );
}

/** Card for AI-written workspace hooks ("נכתבו בשבילכם"). */
export function WrittenHookCard({ id, text, strength, why, meta, values }: { id: string; text: string; strength: number; why: string; meta?: React.ReactNode; values: Values }) {
  return (
    <article className="flex h-full flex-col gap-3 rounded-lg bg-surface-1 p-5 elev-1 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-violet)_30%,transparent)]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Tag variant="violet"><Sparkles aria-hidden />{C.aiWritten}</Tag>
        <Strength value={strength} />
      </div>
      <blockquote dir="rtl" className="text-[1.25rem] leading-snug font-bold"><HookText text={text} values={values} /></blockquote>
      <p className="text-small text-text-2"><span className="font-semibold text-text">{C.why} </span>{why}</p>
      {meta && <div className="text-micro font-normal text-muted">{meta}</div>}
      <div className="mt-auto flex flex-wrap gap-2 border-t border-border pt-3">
        <Button size="sm" variant="secondary" onClick={() => { const f = fillText(text, values); copyText(f.text, f.missing); }}><Copy aria-hidden />{accountCommon.copy}</Button>
        <Link href={`/app/create?workspaceHook=${id}&src=hooks`} className={buttonVariants({ size: "sm" })}><Clapperboard aria-hidden />{C.createVideoShort}</Link>
      </div>
    </article>
  );
}
