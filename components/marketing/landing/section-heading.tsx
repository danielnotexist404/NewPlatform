import { cn } from "@/lib/utils";

/** Eyebrow chip: tiny gradient dot + label. */
export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-surface-1 px-3 py-1 text-micro text-text-2 shadow-[0_1px_2px_color-mix(in_oklab,var(--color-ink)_6%,transparent),inset_0_0_0_1px_var(--color-frame)]",
        className,
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-accent-gradient" />
      {children}
    </span>
  );
}

/** Centered section heading: eyebrow + big H2 + one short sub-line. */
export function SectionHeading({
  id, eyebrow, title, subtitle, align = "center", className, children,
}: {
  id: string;
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "start" | "center";
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("reveal flex flex-col gap-4", align === "center" ? "items-center text-center" : "items-start text-start", className)}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 id={id} className="max-w-[18ch] text-title text-text">
        {title}
      </h2>
      {subtitle && <p className={cn("max-w-xl text-body-lg text-text-2", align === "center" && "mx-auto")}>{subtitle}</p>}
      {children}
    </div>
  );
}

/** Section wrapper: <section aria-labelledby> with a fixed id and an airy rhythm. */
export function Section({
  id, labelledBy, className, children, container = true,
}: {
  id: string;
  labelledBy: string;
  className?: string;
  children: React.ReactNode;
  container?: boolean;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn("relative scroll-mt-20 py-20 md:py-24", className)}>
      {container ? <div className="container-marketing">{children}</div> : children}
    </section>
  );
}
