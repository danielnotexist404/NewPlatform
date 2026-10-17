/** Shared CTA class strings (plain module: safe to import from server and client components). */

/** Accent CTA pill: projector gradient with ink text (ink on the coral end is 6.3:1; white would fail). */
export const accentCta =
  "group inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-accent-gradient font-bold text-ink shadow-[0_8px_22px_-8px_color-mix(in_oklab,var(--color-coral)_75%,transparent),inset_0_1px_0_color-mix(in_oklab,var(--color-white)_40%,transparent)] transition-[transform,box-shadow,filter] duration-300 ease-out hover:-translate-y-px hover:brightness-[1.04] hover:shadow-[0_14px_30px_-10px_color-mix(in_oklab,var(--color-coral)_85%,transparent),inset_0_1px_0_color-mix(in_oklab,var(--color-white)_40%,transparent)] active:translate-y-0 active:scale-[.98]";

/** Ink CTA pill (on accent or light backgrounds). */
export const inkCta =
  "group inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-ink font-bold text-paper shadow-[0_10px_24px_-10px_color-mix(in_oklab,var(--color-ink)_70%,transparent)] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-px hover:shadow-[0_16px_32px_-12px_color-mix(in_oklab,var(--color-ink)_75%,transparent)] active:translate-y-0 active:scale-[.98]";

/** Quiet secondary pill. */
export const quietCta =
  "group inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold text-text transition-colors duration-200 hover:bg-surface-3/70";

/** Arrow nudge inside a `group` CTA (towards "forward" in either direction). */
export const ctaArrow = "size-4 transition-transform duration-300 rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1";
