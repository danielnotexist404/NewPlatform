import Link from "next/link";
import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";

/** Wordmark: projector-gradient play mark + Hebrew name. The mark never mirrors. */
export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link
      href={href}
      aria-label={`${BRAND.nameHe}, לדף הבית`}
      className={cn("group inline-flex items-center gap-2.5 rounded-full text-[1.375rem] font-black leading-none text-text", className)}
    >
      <span
        aria-hidden
        className="relative inline-flex size-8 items-center justify-center rounded-[10px] bg-accent-gradient text-ink shadow-[0_6px_16px_-6px_color-mix(in_oklab,var(--color-coral)_70%,transparent),inset_0_1px_0_color-mix(in_oklab,var(--color-white)_45%,transparent)] transition-transform duration-300 group-hover:-rotate-6"
      >
        <svg viewBox="0 0 24 24" className="size-[15px]" fill="currentColor" style={{ transform: "none" }}>
          <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
        </svg>
      </span>
      <span>{BRAND.nameHe}</span>
    </Link>
  );
}
