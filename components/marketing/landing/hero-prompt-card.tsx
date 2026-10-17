"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ChevronDown, Link2, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LtrInput, Textarea } from "@/components/ui/input";
import { Num } from "@/components/a11y/num";
import { DirIcon } from "@/components/a11y/dir-icon";
import { NicheIcon } from "./niche-icon";
import { NichePicker, type NicheGroup, type NicheOption } from "./niche-picker";
import { createHref, normalizeBusinessUrl, saveHeroDraft } from "./create-link";
import { useCycle, useMotionAllowed } from "./use-motion";
import { LANDING } from "@/content/he/landing";

const T = LANDING.heroCard;

/** HeroPromptCard (Part 02 §3.3.3): niche → link or description → CTA. */
export function HeroPromptCard({ launch, groups }: { launch: NicheOption[]; groups: NicheGroup[] }) {
  const router = useRouter();
  const id = React.useId();
  const motion = useMotionAllowed();
  const [niche, setNiche] = React.useState<string | null>(null);
  const [extra, setExtra] = React.useState<NicheOption | null>(null);
  const [mode, setMode] = React.useState<"url" | "describe">("url");
  const [url, setUrl] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [descFocused, setDescFocused] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const focusField = (which: "url" | "desc") => document.getElementById(`${id}-${which}`)?.focus();
  const ph = useCycle(T.descPlaceholders.length, 3500, motion && mode === "describe" && !descFocused && desc.length === 0);

  const all = React.useMemo(() => groups.flatMap((g) => g.items), [groups]);
  const chips = extra && !launch.some((n) => n.slug === extra.slug) ? [extra, ...launch] : launch;

  const onPick = (slug: string | null) => {
    setNiche(slug);
    const found = slug ? all.find((n) => n.slug === slug) ?? null : null;
    if (found && !launch.some((n) => n.slug === found.slug)) setExtra(found);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    let normalized: string | null = null;
    if (mode === "url") {
      const r = normalizeBusinessUrl(url);
      if (r === false) {
        setError(true);
        focusField("url");
        return;
      }
      normalized = r;
    }
    setBusy(true);
    saveHeroDraft({
      nicheSlug: niche,
      url: normalized,
      description: mode === "describe" && desc.trim() ? desc.trim() : null,
      ts: Date.now(),
    });
    router.push(createHref("hero", niche));
  };

  const errId = `${id}-url-error`;
  return (
    <form
      onSubmit={submit}
      noValidate
      data-cta-location="hero"
      className="glass relative flex flex-col gap-4 rounded-xl p-4 shadow-[inset_0_0_0_1px_var(--color-frame),var(--shadow-3)] transition-shadow focus-within:shadow-[inset_0_0_0_1px_var(--color-frame),var(--glow-primary)] sm:p-5"
    >
      <fieldset className="min-w-0">
        <legend className="mb-2.5 text-sm font-semibold text-text">{T.nicheLegend}</legend>
        <div
          role="radiogroup"
          aria-label={T.nicheGroupLabel}
          className="-mx-1 grid auto-cols-max grid-flow-col grid-rows-2 gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] md:mx-0 md:flex md:flex-wrap md:gap-1.5 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {chips.map((n) => (
            <label key={n.slug} className="group/chip relative cursor-pointer">
              <input
                type="radio"
                name={`${id}-niche`}
                value={n.slug}
                checked={niche === n.slug}
                onChange={() => setNiche(n.slug)}
                className="peer sr-only"
              />
              <span className="inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full bg-surface-2 px-3 text-sm md:h-8 md:gap-1 md:px-2.5 md:text-[0.84rem] font-semibold text-text-2 shadow-[inset_0_0_0_1px_var(--color-border)] transition-colors group-hover/chip:text-text peer-checked:bg-primary peer-checked:text-on-primary peer-checked:shadow-none peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus">
                <NicheIcon name={n.icon} className="size-4" />
                {n.label}
              </span>
            </label>
          ))}
          <NichePicker
            groups={groups}
            selected={niche}
            onSelect={onPick}
            trigger={
              <button
                type="button"
                className="inline-flex h-9 items-center gap-1 whitespace-nowrap rounded-full px-3 text-sm md:h-8 md:px-2.5 md:text-[0.84rem] font-semibold text-primary-text shadow-[inset_0_0_0_1px_var(--color-border-strong)] hover:bg-surface-2"
              >
                {T.moreNiches}
                <ChevronDown className="size-4" aria-hidden />
              </button>
            }
          />
        </div>
      </fieldset>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          {mode === "url" ? (
            <>
              <label htmlFor={`${id}-url`} className="text-sm font-semibold text-text">{T.urlLabel}</label>
              <div className="relative" dir="ltr">
                <Link2 className="pointer-events-none absolute inset-s-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
                <LtrInput
                  id={`${id}-url`}
                  size="lg"
                  inputMode="url"
                  autoComplete="url"
                  spellCheck={false}
                  placeholder={T.urlPlaceholder}
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (error) setError(false);
                  }}
                  aria-invalid={error || undefined}
                  aria-describedby={error ? errId : undefined}
                  className="h-14 ps-10"
                />
              </div>
              {error && (
                <p id={errId} role="alert" className="flex items-start gap-1.5 text-small text-danger">
                  <AlertCircle className="mt-1 size-4 shrink-0" aria-hidden />
                  <span>
                    {T.urlError.before}
                    <bdi dir="ltr">{T.urlError.example1}</bdi>
                    {T.urlError.middle}
                    <bdi dir="ltr">{T.urlError.example2}</bdi>
                    {T.urlError.after}
                  </span>
                </p>
              )}
            </>
          ) : (
            <>
              <label htmlFor={`${id}-desc`} className="text-sm font-semibold text-text">{T.descLabel}</label>
              <div className="relative">
                <Textarea
                  id={`${id}-desc`}
                  value={desc}
                  maxLength={T.descMax}
                  rows={2}
                  onFocus={() => setDescFocused(true)}
                  onBlur={() => setDescFocused(false)}
                  onChange={(e) => setDesc(e.target.value)}
                  aria-describedby={`${id}-desc-count`}
                  className="min-h-14 resize-none"
                />
                {desc.length === 0 && (
                  <span aria-hidden className="pointer-events-none absolute inset-x-3.5 top-2.5 line-clamp-2 text-base text-muted">
                    <span key={ph} className="inline-block motion-safe:animate-[kd-fade-up_.4s_var(--ease-out)]">{T.descPlaceholders[ph]}</span>
                  </span>
                )}
              </div>
              <p id={`${id}-desc-count`} className="text-end text-micro font-normal text-muted">
                <bdi dir="ltr"><Num value={desc.length} />/<Num value={T.descMax} /></bdi>
              </p>
            </>
          )}
          <button
            type="button"
            onClick={() => {
              const next = mode === "url" ? "describe" : "url";
              setMode(next);
              setError(false);
              requestAnimationFrame(() => focusField(next === "url" ? "url" : "desc"));
            }}
            className="mt-0.5 inline-flex w-fit items-center gap-1.5 text-small font-semibold text-link underline-offset-4 hover:underline"
          >
            {mode === "url" ? <PenLine className="size-4" aria-hidden /> : <Link2 className="size-4" aria-hidden />}
            {mode === "url" ? T.toDescribe : T.toUrl}
          </button>
        </div>
        <div className="flex flex-col items-stretch gap-1.5 lg:pt-[30px]">
          <Button type="submit" size="xl" loading={busy} className="relative w-full overflow-hidden lg:w-auto">
            <span aria-hidden className="kd-sweep pointer-events-none absolute inset-y-0 inset-s-0 w-1/3 bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--color-white)_55%,transparent),transparent)] opacity-60" />
            <span className="relative">{T.cta}</span>
            <DirIcon name="forward" className="relative size-5" />
          </Button>
          <p className="text-center text-micro text-muted">{T.ctaNote}</p>
        </div>
      </div>
    </form>
  );
}
