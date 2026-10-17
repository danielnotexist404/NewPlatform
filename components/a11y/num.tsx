import { cn } from "@/lib/utils";

const nf = new Intl.NumberFormat("he-IL");

/** Numbers are bidi-isolated and tabular (Part 01 §9.3). */
export function Num({ value, className }: { value: number; className?: string }) {
  return <bdi className={cn("num", className)}>{nf.format(value)}</bdi>;
}

/** UI price: "₪119" — the shekel sign before the number (D-260). */
export function Price({ ils, className, decimals = false }: { ils: number; className?: string; decimals?: boolean }) {
  const text = decimals
    ? new Intl.NumberFormat("he-IL", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(ils)
    : nf.format(ils);
  return (
    <bdi className={cn("num", className)} aria-label={`${text} שקלים`}>
      ₪{text}
    </bdi>
  );
}

export function Bdi({ children, className }: { children: React.ReactNode; className?: string }) {
  return <bdi className={className}>{children}</bdi>;
}
