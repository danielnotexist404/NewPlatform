"use client";
import * as React from "react";
import Link from "next/link";
import { motion as m } from "motion/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DirIcon } from "@/components/a11y/dir-icon";
import type { CaptionPreset } from "@/lib/mock/landing";
import { HookCard, type HookCardData } from "./hook-card";
import { NicheIcon } from "./niche-icon";
import { PhoneFrame } from "./phone-frame";
import { ReelArt } from "./reel-tile";
import { createHref } from "./create-link";
import { useMotionAllowed } from "./use-motion";
import { LANDING } from "@/content/he/landing";

export interface ShowcaseNiche {
  slug: string;
  label: string;
  icon: string;
  categorySlug: string;
  line: string;
  preset: CaptionPreset;
  phoneText: string;
  hooks: HookCardData[];
}

const T = LANDING.niches;
const DEFAULT = "real-estate";

function subscribeUrl(cb: () => void) {
  window.addEventListener("popstate", cb);
  return () => window.removeEventListener("popstate", cb);
}

/** NicheShowcase (Part 02 §3.5): 14 launch niches as tabs, 3 hooks + phone demo + "same video, 3 formats". */
export function NicheShowcase({ items }: { items: ShowcaseNiche[] }) {
  const motion = useMotionAllowed();
  const urlNiche = React.useSyncExternalStore(
    subscribeUrl,
    () => new URLSearchParams(window.location.search).get("niche"),
    () => null,
  );
  const [choice, setChoice] = React.useState<string | null>(null);
  const valid = (s: string | null) => !!s && items.some((n) => n.slug === s);
  const value = valid(choice) ? choice! : valid(urlNiche) ? urlNiche! : DEFAULT;
  const railRef = React.useRef<HTMLDivElement>(null);

  const select = (slug: string) => {
    setChoice(slug);
    try {
      const u = new URL(window.location.href);
      u.searchParams.set("niche", slug);
      window.history.replaceState(window.history.state, "", u.toString());
    } catch {
      /* ignore */
    }
  };
  const scrollRail = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    // In RTL "next" content lies to the left (negative scrollLeft).
    const rtl = getComputedStyle(el).direction === "rtl";
    el.scrollBy({ left: dir * (rtl ? -1 : 1) * el.clientWidth * 0.7, behavior: motion ? "smooth" : "auto" });
  };

  return (
    <Tabs value={value} onValueChange={select} className="mt-10 flex flex-col gap-8">
      <div className="relative flex items-center gap-2">
        <button
          type="button"
          onClick={() => scrollRail(-1)}
          className="hidden size-9 shrink-0 items-center justify-center rounded-full bg-surface-2 text-text-2 hover:text-text md:inline-flex"
          aria-label={T.scrollPrev}
        >
          <DirIcon name="prev" className="size-5" />
        </button>
        <div
          ref={railRef}
          className="min-w-0 flex-1 overflow-x-auto [mask-image:linear-gradient(to_left,transparent,black_4%,black_96%,transparent)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <TabsList aria-label={T.tablistLabel} className="inline-flex w-max gap-1.5 rounded-full bg-surface-1 p-1.5 shadow-[inset_0_0_0_1px_var(--color-frame)]">
            {items.map((n) => (
              <TabsTrigger
                key={n.slug}
                value={n.slug}
                className="inline-flex items-center gap-1.5 whitespace-nowrap px-3.5 py-2 data-[state=active]:bg-primary data-[state=active]:text-on-primary"
              >
                <NicheIcon name={n.icon} className="size-4" />
                {n.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <button
          type="button"
          onClick={() => scrollRail(1)}
          className="hidden size-9 shrink-0 items-center justify-center rounded-full bg-surface-2 text-text-2 hover:text-text md:inline-flex"
          aria-label={T.scrollNext}
        >
          <DirIcon name="next" className="size-5" />
        </button>
      </div>

      {items.map((n) => (
        <TabsContent key={n.slug} value={n.slug} className="outline-none focus-visible:outline-2">
          <m.div
              initial={motion ? { opacity: 0 } : false}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="grid items-start gap-10 lg:grid-cols-12"
            >
              <div className="flex flex-col gap-4 lg:col-span-7">
                <p className="text-body-lg max-w-2xl text-text-2">{n.line}</p>
                <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-1">
                  {n.hooks.map((h) => (
                    <HookCard key={h.id} hook={h} showVisual createHref={createHref("hooks", n.slug, { hook: h.id })} />
                  ))}
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-sm font-semibold">
                  <Link href={`/hooks/${n.slug}`} className="text-link underline-offset-4 hover:underline">
                    {T.hooksLink(n.label)}
                  </Link>
                  <Link href={`/niches/${n.slug}`} className="text-text-2 underline-offset-4 hover:text-text hover:underline">
                    {T.nicheLink(n.label)}
                  </Link>
                </div>
              </div>
              <div className="flex flex-col items-center gap-5 lg:col-span-5">
                <PhoneFrame label={T.phoneLabel(n.label)} className="max-w-[260px]">
                  <ReelArt
                    text={n.phoneText}
                    preset={n.preset}
                    icon={n.icon}
                    categorySlug={n.categorySlug}
                    nicheLabel={n.label}
                    badge={LANDING.wall.demo}
                    className="rounded-none"
                  />
                </PhoneFrame>
                <figure className="flex w-full max-w-[300px] flex-col items-center gap-2">
                  <div aria-hidden className="grid w-full grid-cols-[0.8fr_1.4fr] items-end gap-3">
                    <ReelArt text={n.phoneText} preset={n.preset} icon={n.icon} categorySlug={n.categorySlug} aspect="square" variant={1} chrome={false} />
                    <ReelArt text={n.phoneText} preset={n.preset} icon={n.icon} categorySlug={n.categorySlug} aspect="wide" variant={2} chrome={false} />
                  </div>
                  <figcaption className="text-micro text-muted">{T.formatsCaption}</figcaption>
                </figure>
              </div>
            </m.div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
