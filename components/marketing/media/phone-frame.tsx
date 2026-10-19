import { cn } from "@/lib/utils";

/**
 * Generic phone body (not a real device model): ink bezel, pill island, soft layered shadow.
 * Children fill a 9:19.5 screen; pass `screenClassName` to change the screen aspect.
 */
export function PhoneFrame({
  children, className, screenClassName, label, shadow = true,
}: {
  children: React.ReactNode;
  className?: string;
  screenClassName?: string;
  label?: string;
  shadow?: boolean;
}) {
  return (
    <div
      role={label ? "group" : undefined}
      aria-label={label}
      className={cn(
        "relative bg-ink p-[3.2%]",
        shadow &&
          "shadow-[0_50px_90px_-40px_color-mix(in_oklab,var(--color-ink)_60%,transparent),0_18px_36px_-18px_color-mix(in_oklab,var(--color-ink)_40%,transparent),inset_0_0_0_1px_color-mix(in_oklab,var(--color-white)_16%,transparent)]",
        className,
      )}
      style={{ borderRadius: "15% / 7%" }}
    >
      <div className={cn("@container relative isolate aspect-[9/19.5] overflow-hidden bg-ink", screenClassName)} style={{ borderRadius: "12% / 5.6%" }}>
        {children}
        <span aria-hidden className="absolute inset-x-0 top-[2.8cqw] z-20 mx-auto h-[6.6cqw] w-[30%] rounded-full bg-ink" />
      </div>
    </div>
  );
}
