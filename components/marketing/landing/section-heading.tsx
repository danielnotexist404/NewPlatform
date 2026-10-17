import { cn } from "@/lib/utils";

/** Local SectionHeading (Part 01 §10.16): eyebrow chip + H2 + optional subtitle. No gold gradient here (one word per page). */
export function SectionHeading({
  id, eyebrow, title, subtitle, align = "start", className, children,
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
    <div className={cn("flex flex-col gap-4", align === "center" ? "items-center text-center" : "items-start text-start", className)}>
      {eyebrow && (
        <span className="inline-flex items-center gap-2 rounded-full bg-surface-2 px-3 py-1 text-micro text-text-2 shadow-[inset_0_0_0_1px_var(--color-frame)]">
          <span aria-hidden className="size-1.5 rounded-full bg-primary" />
          {eyebrow}
        </span>
      )}
      <h2 id={id} className="text-h2 max-w-3xl text-text">
        {title}
      </h2>
      {subtitle && <p className={cn("text-body-lg max-w-2xl text-text-2", align === "center" && "mx-auto")}>{subtitle}</p>}
      {children}
    </div>
  );
}

/** Section wrapper: <section aria-labelledby> with a fixed id and generous rhythm. */
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
    <section id={id} aria-labelledby={labelledBy} className={cn("relative scroll-mt-20 py-16 md:py-24", className)}>
      {container ? <div className="container-marketing">{children}</div> : children}
    </section>
  );
}
