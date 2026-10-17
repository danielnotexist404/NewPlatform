import Link from "next/link";
import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";

/** Wordmark: projector-gold play mark + Hebrew name. The mark never mirrors. */
export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} aria-label={`${BRAND.nameHe}, לדף הבית`} className={cn("inline-flex items-center gap-2 font-extrabold text-xl", className)}>
      <span aria-hidden className="relative inline-flex size-8 items-center justify-center rounded-[10px] bg-primary text-on-primary glow-primary">
        <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" style={{ transform: "none" }}>
          <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
        </svg>
      </span>
      <span>{BRAND.nameHe}</span>
    </Link>
  );
}
