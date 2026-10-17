import Link from "next/link";
import { Scissors, Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DirIcon } from "@/components/a11y/dir-icon";
import { SIGNUP_HREF } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { NOT_FOUND } from "@/content/he/site";

/** A strip of film frames where one frame was "cut" (decorative; LTR like all media). */
function CutFilmStrip() {
  const frames: (string | null)[] = ["", "4", "0", "4", null];
  return (
    <div role="img" aria-label={NOT_FOUND.framesLabel} dir="ltr" className="relative mx-auto w-full max-w-xl">
      <div aria-hidden className="absolute inset-x-[10%] -bottom-6 h-16 rounded-full bg-primary/20 blur-3xl" />
      <div aria-hidden className="relative rotate-[-3deg] rounded-md bg-black px-3 py-5 shadow-[inset_0_0_0_1px_var(--color-frame)] elev-3">
        {/* perforations */}
        {["top-1.5", "bottom-1.5"].map((pos) => (
          <div key={pos} className={cn("absolute inset-x-3 flex justify-between", pos)}>
            {Array.from({ length: 16 }).map((_, i) => (
              <span key={i} className="h-2 w-3 rounded-[2px] bg-white/10" />
            ))}
          </div>
        ))}
        <div className="grid grid-cols-5 gap-2">
          {frames.map((f, i) =>
            f !== null ? (
              <div
                key={i}
                className="flex aspect-[3/4] items-center justify-center overflow-hidden rounded-[6px]"
                style={{
                  backgroundImage:
                    i % 2
                      ? "radial-gradient(90% 80% at 30% 10%, color-mix(in oklab, var(--color-violet) 55%, transparent), transparent 70%), linear-gradient(180deg, color-mix(in oklab, var(--color-black) 80%, var(--color-violet)), var(--color-black))"
                      : "radial-gradient(90% 80% at 70% 10%, color-mix(in oklab, var(--color-primary) 55%, transparent), transparent 70%), linear-gradient(180deg, color-mix(in oklab, var(--color-black) 80%, var(--color-rose)), var(--color-black))",
                }}
              >
                {f && <span className="font-display text-[clamp(2.5rem,8vw,5.5rem)] leading-none text-white">{f}</span>}
              </div>
            ) : (
              <div key={i} className="relative flex aspect-[3/4] items-center justify-center rounded-[6px] border-2 border-dashed border-primary/70">
                <Scissors className="size-8 -rotate-90 text-primary" />
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

/** 404 body (Part 02 §1.5) — used by app/not-found.tsx and app/(marketing)/not-found.tsx. */
export function NotFoundContent() {
  return (
    <section aria-labelledby="nf-title" className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-afterglow opacity-80" />
      <div className="container-marketing relative grid items-center gap-14 py-16 md:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="max-w-xl">
          <p className="text-micro text-primary-text">{NOT_FOUND.eyebrow}</p>
          <h1 id="nf-title" className="mt-3 text-h1">{NOT_FOUND.title}</h1>
          <p className="mt-5 text-body-lg text-text-2">{NOT_FOUND.body}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/" className={cn(buttonVariants({ size: "lg" }))}>
              {NOT_FOUND.home}
            </Link>
            <Link href="/hooks" className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}>
              {NOT_FOUND.hooks}
            </Link>
            <Link href={SIGNUP_HREF} className={cn(buttonVariants({ variant: "ghost", size: "lg" }))}>
              {NOT_FOUND.create}
              <DirIcon name="forward" />
            </Link>
          </div>
          <form action="/hooks" method="get" role="search" className="mt-10 max-w-md">
            <label htmlFor="nf-q" className="mb-2 block text-small font-semibold">
              {NOT_FOUND.searchLabel}
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search aria-hidden className="pointer-events-none absolute inset-s-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
                <Input id="nf-q" name="q" type="search" placeholder={NOT_FOUND.searchPlaceholder} className="ps-10" />
              </div>
              <button type="submit" className={cn(buttonVariants({ variant: "secondary" }), "h-11")}>
                {NOT_FOUND.searchButton}
              </button>
            </div>
          </form>
          <nav aria-labelledby="nf-popular" className="mt-8">
            <h2 id="nf-popular" className="text-micro text-muted">{NOT_FOUND.popularTitle}</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {NOT_FOUND.popular.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-flex h-9 items-center rounded-full border border-border-strong px-4 text-small text-text-2 hover:text-text">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <CutFilmStrip />
      </div>
    </section>
  );
}
