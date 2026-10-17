import { cn } from "@/lib/utils";

/** Generic phone (Part 01 §10.6): 44px body radius, 10px bezel, pill island. Not a real device model. */
export function PhoneFrame({
  children, label, className, glow = true,
}: {
  children: React.ReactNode;
  label?: string;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div role={label ? "group" : undefined} aria-label={label} className={cn("relative mx-auto w-full max-w-[300px]", className)}>
      {glow && (
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-10 -z-10 rounded-full opacity-90 blur-2xl light:hidden"
          style={{ background: "radial-gradient(50% 50% at 50% 40%, color-mix(in oklab, var(--color-primary) 22%, transparent), transparent 70%)" }}
        />
      )}
      <div className="relative rounded-[44px] bg-surface-3 p-[10px] shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-border-strong)_40%,transparent),var(--shadow-3)]">
        <div className="relative overflow-hidden rounded-[34px] bg-black">
          {children}
          <span aria-hidden className="absolute inset-x-0 top-2 z-10 mx-auto h-[18px] w-[28%] rounded-full bg-black shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-white)_8%,transparent)]" />
        </div>
      </div>
    </div>
  );
}
