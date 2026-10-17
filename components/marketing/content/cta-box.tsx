import Link from "next/link";
import { Sparkles } from "lucide-react";
import { DirIcon } from "@/components/a11y/dir-icon";
import { buttonVariants } from "@/components/ui/button";
import { SIGNUP_HREF } from "@/lib/constants";
import { getNiche, nicheShortName } from "@/lib/data/seed";
import { cn } from "@/lib/utils";
import { CTA_BOX } from "@/content/he/blog";

/** Unified end-of-article CTA (CtaBox, Part 02 §8.1). */
export function CtaBox({ kind, niche }: { kind: "create" | "hooks" | "pricing"; niche?: string }) {
  const n = niche ? getNiche(niche) : undefined;
  const copy = CTA_BOX[kind];
  const title = kind === "hooks" && n ? `עוד הוקים ל${nicheShortName(n)}` : copy.title;
  const secondary =
    kind === "hooks"
      ? { href: n ? `/hooks/${n.slug}` : "/hooks", label: n ? `לספריית ההוקים ל${nicheShortName(n)}` : "לספריית ההוקים" }
      : kind === "pricing"
        ? { href: "/pricing#credit-costs", label: "כמה עולה סרטון" }
        : { href: "/hooks", label: "לספריית ההוקים" };
  const primary = kind === "pricing" ? { href: "/pricing", label: "למחירים" } : { href: SIGNUP_HREF, label: "צרו סרטון בחינם" };

  return (
    <aside
      aria-label={title}
      className="not-prose relative my-12 [&_a]:no-underline overflow-hidden rounded-xl bg-surface-1 p-6 shadow-[inset_0_0_0_1px_var(--color-frame)] elev-2 md:p-8"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-afterglow opacity-90" />
      <div aria-hidden className="pointer-events-none absolute -top-20 inset-s-[-4rem] size-72 rounded-full bg-primary/15 blur-3xl" />
      <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <p className="mb-2 inline-flex items-center gap-1.5 text-micro text-primary-text">
            <Sparkles aria-hidden className="size-3.5" />
            {copy.eyebrow}
          </p>
          <h2 className="m-0 text-h3">{title}</h2>
          <p className="mb-0 mt-2 text-text-2">{copy.body}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Link href={primary.href} className={cn(buttonVariants({ size: "lg" }))}>
            {primary.label}
            <DirIcon name="forward" />
          </Link>
          <Link href={secondary.href} className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}>
            {secondary.label}
          </Link>
        </div>
      </div>
    </aside>
  );
}
